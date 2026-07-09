import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import annotate_manuscript_assets as ann


def _make_course(tmp_path, md_text, manifest):
    course = tmp_path / "course"
    (course / "manuscripts").mkdir(parents=True)
    (course / "assets").mkdir(parents=True)
    (course / "manuscripts" / "ch01.md").write_text(md_text, encoding="utf-8")
    (course / "assets" / f"manifest_{manifest.get('chapter', 'ch01')}.json").write_text(
        json.dumps(manifest, ensure_ascii=False), encoding="utf-8")
    return course


def _manifest(image=None, d2=None):
    entry = {"slide": 5}
    if image:
        entry["image"] = image
    if d2:
        entry["d2"] = d2
    return {"chapter": "ch01", "slides": [entry]}


_MD = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 시각자료 프롬프트(영문): `x`\n\n"
    "**Source**\n- s\n"
)


def _va_block(course):
    return (course / "manuscripts" / "ch01.md").read_text(encoding="utf-8")


def test_only_primary_image_annotated(tmp_path):
    m = _manifest(
        image={"path": "assets/images/ch01/slide05.png", "status": "present", "primary": True},
        d2={"path": "assets/diagrams/ch01-slide05-http.png", "status": "present", "primary": False},
    )
    course = _make_course(tmp_path, _MD, m)
    ann.annotate(str(course), "ch01")
    txt = _va_block(course)
    assert "→ 생성됨: assets/images/ch01/slide05.png" in txt
    assert "→ 렌더됨: assets/diagrams/ch01-slide05-http.png" not in txt


def test_d2_primary_annotated_image_not(tmp_path):
    m = _manifest(
        image={"path": "assets/images/ch01/slide05.png", "status": "present", "primary": False},
        d2={"path": "assets/diagrams/ch01-slide05-http.png", "status": "present", "primary": True},
    )
    course = _make_course(tmp_path, _MD, m)
    ann.annotate(str(course), "ch01")
    txt = _va_block(course)
    assert "→ 렌더됨: assets/diagrams/ch01-slide05-http.png" in txt
    assert "→ 생성됨: assets/images/ch01/slide05.png" not in txt


def test_stale_annotation_replaced(tmp_path):
    # 원고에 옛 D2 병기가 남아 있고, 이제 이미지가 primary → 옛 렌더됨 제거·생성됨 추가
    md_with_stale = (
        "## Slide 5. HTTP\n\n"
        "**Visual asset**\n"
        "- 시각자료 프롬프트(영문): `x`\n"
        "- → 렌더됨: assets/diagrams/ch01-slide05-http.png\n\n"
        "**Source**\n- s\n"
    )
    m = _manifest(
        image={"path": "assets/images/ch01/slide05.png", "status": "present", "primary": True},
        d2={"path": "assets/diagrams/ch01-slide05-http.png", "status": "deferred", "primary": False},
    )
    course = _make_course(tmp_path, md_with_stale, m)
    ann.annotate(str(course), "ch01")
    txt = _va_block(course)
    assert "→ 렌더됨: assets/diagrams/ch01-slide05-http.png" not in txt
    assert "→ 생성됨: assets/images/ch01/slide05.png" in txt
    assert txt.count("→ 생성됨") == 1  # 중복 병기 없음


def test_annotate_refuses_mismatched_chapter(tmp_path, monkeypatch):
    """차시가 어긋난 manifest로는 원고를 병기하지 않는다 — 다른 차시 그림이 PPTX에 섞이는 것을 막는다."""
    import pytest
    m = _manifest(image={"path": "assets/images/ch99/slide05.png", "status": "present", "primary": True})
    m["chapter"] = "ch99"
    course = _make_course(tmp_path, _MD, m)              # manifest_ch99.json 로 저장됨
    # ch01을 대상으로 부르면 manifest_ch01.json이 없어 FileNotFoundError
    with pytest.raises((SystemExit, FileNotFoundError)):
        ann.annotate(str(course), "ch01")
    # manifest_ch01.json 자리에 ch99 내용을 두면 가드가 SystemExit로 막는다
    (course / "assets" / "manifest_ch01.json").write_text(
        (course / "assets" / "manifest_ch99.json").read_text(encoding="utf-8"), encoding="utf-8")
    with pytest.raises(SystemExit):
        ann.annotate(str(course), "ch01")
