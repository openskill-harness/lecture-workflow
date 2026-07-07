import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import extract_claim_candidates as ecc

_MD = (
    "## Slide 5. HTTP\n\n"
    "**Screen**\n"
    "- 제목: HTTP\n"
    "- 핵심 정의: HTTP는 웹에서 클라이언트와 서버가 요청·응답 메시지를 주고받는 통신 규칙이다.\n"
    "**Easy analogy**\n"
    "- HTTP는 택배 운송장과 같다.\n"
    "**Source**\n"
    "- MDN HTTP Overview: https://developer.mozilla.org/en-US/docs/Web/HTTP\n"
    "**Narration**\n"
    "- 브라우저와 서버는 HTTP라는 약속으로 대화합니다.\n"
)


def test_extracts_definition_narration_source():
    c = ecc.extract_candidates(_MD)
    assert len(c) == 1
    s = c[0]
    assert s["slide"] == 5
    assert "통신 규칙이다" in s["definition"]
    assert "브라우저와 서버" in s["narration"]
    assert "MDN" in s["source"]
    # 비유(Easy analogy)는 후보에 안 들어간다 (범위 가드)
    assert "택배" not in s["definition"]
    assert "택배" not in s["narration"]
    assert "택배" not in s["source"]


def test_slide_without_definition_has_empty_definition():
    md = "## Slide 7. X\n\n**Screen**\n- 제목: X\n**Narration**\n- 설명 문장.\n"
    c = ecc.extract_candidates(md)
    assert len(c) == 1
    assert c[0]["definition"] == ""
    assert "설명 문장" in c[0]["narration"]


def test_multiple_slides():
    md = _MD + "\n## Slide 6. Y\n\n**Screen**\n- 핵심 정의: Y는 Z이다.\n"
    c = ecc.extract_candidates(md)
    assert [s["slide"] for s in c] == [5, 6]
    assert "Z이다" in c[1]["definition"]
