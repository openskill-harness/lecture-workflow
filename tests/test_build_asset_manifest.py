import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import build_asset_manifest as bam


def _make_course(tmp_path, slide_md, *, img=False, d2=False):
    """임시 과정 디렉터리 구성. slide_md는 ## Slide.. 섹션 전체 텍스트."""
    course = tmp_path / "course"
    (course / "manuscripts").mkdir(parents=True)
    (course / "assets" / "images" / "ch01").mkdir(parents=True)
    (course / "assets" / "diagrams").mkdir(parents=True)
    (course / "manuscripts" / "ch01.md").write_text(slide_md, encoding="utf-8")
    if img:
        (course / "assets" / "images" / "ch01" / "slide05.png").write_bytes(b"PNGDATA")
    if d2:
        (course / "assets" / "diagrams" / "ch01-slide05-http.png").write_bytes(b"PNGDATA")
    return course


_D2_FENCE = "```d2\nbrowser -> server\n```"

_BOTH = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 시각자료 프롬프트(영문): `A clean flat illustration of an HTTP request flow, no text, 16:9`\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_BOTH_D2_OPTIN = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 주 시각자료: D2\n"
    "- 시각자료 프롬프트(영문): `A clean flat illustration of an HTTP request flow, no text, 16:9`\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_D2_ONLY = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_IMG_DEFER = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 이미지 보류\n"
    "- 시각자료 프롬프트(영문): `A clean flat illustration of an HTTP request flow, no text, 16:9`\n\n"
    "**Source**\n- x\n"
)


_COMIC = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- Comic panel prompt: `Two-panel comic explaining an HTTP request, no text, 16:9`\n\n"
    "**Source**\n- x\n"
)


def _slide5(manifest):
    return next(s for s in manifest["slides"] if s["slide"] == 5)


def test_image_is_primary_by_default(tmp_path):
    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "present"
    assert s["d2"]["primary"] is False
    assert manifest["overall_status"] == "present"


def test_d2_opt_in_marker_makes_d2_primary(tmp_path):
    course = _make_course(tmp_path, _BOTH_D2_OPTIN, img=True, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["d2"]["primary"] is True
    assert s["image"]["primary"] is False


def test_d2_only_slide_keeps_d2_primary(tmp_path):
    course = _make_course(tmp_path, _D2_ONLY, img=False, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert "image" not in s
    assert s["d2"]["primary"] is True
    assert s["d2"]["status"] == "present"
    assert manifest["overall_status"] == "present"


def test_ungenerated_image_reads_missing_not_deferred(tmp_path):
    # 이미지 프롬프트 있고 D2 파일도 있으나 이미지 미생성 → 이제 이미지가 primary이므로 missing(하드 게이트가 막음)
    course = _make_course(tmp_path, _BOTH, img=False, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "missing"
    assert manifest["overall_status"] != "present"


def test_defer_marker_keeps_image_deferred_not_missing(tmp_path):
    # 이미지 프롬프트 + `이미지 보류` 마커, 이미지 미생성, D2 없음 → 의도된 보류이므로 deferred(커버로 인정)
    course = _make_course(tmp_path, _IMG_DEFER, img=False, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "deferred"
    assert manifest["overall_status"] == "present"


def test_changed_prompt_marks_present_asset_stale(tmp_path):
    # 1) 프롬프트 A로 빌드(이미지 파일 존재) → present
    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
    m1, _ = bam.build_manifest(str(course), "ch01")
    assert _slide5(m1)["image"]["status"] == "present"
    # 2) 원고의 이미지 프롬프트만 다른 텍스트로 교체(파일은 그대로) → stale
    changed = _BOTH.replace("HTTP request flow", "COMPLETELY DIFFERENT SCENE")
    (course / "manuscripts" / "ch01.md").write_text(changed, encoding="utf-8")
    m2, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(m2)
    assert s["image"]["status"] == "stale"
    assert m2["overall_status"] != "present"  # stale은 커버 아님 → 재생성 유도


def test_comic_panel_prompt_is_counted_as_image(tmp_path):
    # `Comic panel prompt:` 라벨도 이미지 프롬프트로 인식되어야 한다.
    # 미생성 상태이므로 image 블록이 primary=True/status=missing 으로 잡혀
    # 커버리지(하드게이트)에 포함돼야 한다 — 안 잡히면 빠진 자산이 present로 샌다.
    course = _make_course(tmp_path, _COMIC, img=False, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert "image" in s
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "missing"
    assert manifest["visual_slides_total"] == 1
    assert manifest["overall_status"] != "present"


# --- 자산 출처(origin) — 사용자 확정이 원고를 이긴다 ---

_USER_FILE = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- User image: `assets/images/ch01/slide05.png`\n\n"
    "**Source**\n- x\n"
)

_USER_FILE_OVER_D2 = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 주 시각자료: D2\n"
    "- User image: `assets/images/ch01/slide05.png`\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_USER_PROMPT = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- User image prompt: `A hand-drawn style HTTP request flow, no text, 16:9`\n\n"
    "**Source**\n- x\n"
)


def test_agent_origin_is_default(tmp_path):
    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    assert _slide5(manifest)["image"]["origin"] == "agent"


def test_user_prompt_origin_still_hashes(tmp_path):
    # 사용자가 준 프롬프트도 프롬프트다 — 해시·stale 대상. origin만 다르다(문구 임의 수정 금지 신호).
    course = _make_course(tmp_path, _USER_PROMPT, img=True, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["origin"] == "user-prompt"
    assert s["image"]["prompt_hash"] is not None
    assert s["image"]["status"] == "present"


def test_user_file_beats_d2_primary_marker(tmp_path):
    # codex 조건 2: user-file 분기가 d2_primary 분기보다 앞. 안 그러면 `주 시각자료: D2`가 계속 이긴다.
    course = _make_course(tmp_path, _USER_FILE_OVER_D2, img=True, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["origin"] == "user-file"
    assert s["d2"]["primary"] is False


def test_user_file_never_goes_stale(tmp_path):
    # codex 조건 1: agent 이미지가 있던 슬라이드를 user-file로 교체하면 prior_hash(non-null) != None
    # 이라 stale로 오판된다. origin=user-file은 해시 비교를 건너뛴다.
    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
    m1, _ = bam.build_manifest(str(course), "ch01")
    assert _slide5(m1)["image"]["prompt_hash"] is not None   # 이전 해시가 실제로 기록됨
    (course / "manuscripts" / "ch01.md").write_text(_USER_FILE, encoding="utf-8")
    m2, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(m2)
    assert s["image"]["origin"] == "user-file"
    assert s["image"]["prompt_hash"] is None
    assert s["image"]["status"] == "present"      # stale 아님
    assert m2["overall_status"] == "present"


def test_user_file_missing_blocks_hard_gate(tmp_path):
    course = _make_course(tmp_path, _USER_FILE, img=False, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    assert _slide5(manifest)["image"]["status"] == "missing"
    assert manifest["overall_status"] != "present"


def test_user_file_path_matches_annotate_canonical_path(tmp_path):
    # codex 조건 4: `User image:` 경로 == annotate 병기 경로. 다르면 build_pptx가 첫 경로를 집어 어긋난다.
    course = _make_course(tmp_path, _USER_FILE, img=True, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    canonical = f"assets/images/ch01/slide05.png"
    assert _slide5(manifest)["image"]["path"] == canonical
