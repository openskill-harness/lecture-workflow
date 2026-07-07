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
