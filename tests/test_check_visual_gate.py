import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import check_visual_gate as cvg

_HEADER = (
    "| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |\n"
    "|---|---|---|---|---|---|---|---|---|---|---|\n"
)


def test_gate_violation_detected():
    # 시각자산 🔄 인데 하류가 ✅ → 위반
    row = "| ch01 | ✅ | ✅ | 🔄 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |\n"
    violations = cvg.check_gate(_HEADER + row)
    assert len(violations) == 1
    assert violations[0]["chapter"] == "ch01"
    assert violations[0]["visual_status"] == "🔄"
    assert "코드" in violations[0]["downstream"]


def test_deferred_visual_is_allowed():
    # 시각자산 deferred 는 하류 진행 허용 → 위반 없음
    row = "| ch01 | ✅ | ✅ | deferred | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |\n"
    assert cvg.check_gate(_HEADER + row) == []


def test_no_downstream_no_violation():
    # 시각자산 🔄 이지만 하류가 아직 아무것도 ✅ 아님 → 위반 없음
    row = "| ch01 | ✅ | ✅ | 🔄 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |\n"
    assert cvg.check_gate(_HEADER + row) == []
