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
    (course / "assets" / "manifest.json").write_text(
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
