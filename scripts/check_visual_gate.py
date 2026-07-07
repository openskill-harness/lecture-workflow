"""status.md 하드게이트 검증 — 시각자산이 ✅/deferred가 아닌데 하류(코드~책)가 ✅면 위반.

사용: python scripts/check_visual_gate.py <status.md>
  위반 있으면 각 차시를 stderr에 출력하고 exit 1, 없으면 exit 0.
course-pipeline이 재개 전/후 이 스크립트로 게이트 정합을 확인할 수 있다.
"""
import sys
from pathlib import Path

# status.md 표의 열 순서(과정개요서는 표 밖 별도 줄이라 표 열에 없음)
COLS = ["차시", "원고초안", "원고확정", "시각자산", "코드", "스토리보드",
        "PPT프리뷰", "판서", "시뮬", "PPTX", "책"]
VISUAL_IDX = COLS.index("시각자산")          # 3
DOWNSTREAM = COLS[VISUAL_IDX + 1:]           # 코드~책
OK_VISUAL = {"✅", "deferred", "➖"}          # 게이트 통과로 보는 값


def _cells(line):
    parts = [c.strip() for c in line.strip().strip("|").split("|")]
    return parts


def check_gate(status_md_text):
    violations = []
    for line in status_md_text.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = _cells(line)
        if len(cells) != len(COLS):
            continue
        if not cells[0].lower().startswith("ch"):
            continue  # 헤더/구분선 스킵
        visual = cells[VISUAL_IDX]
        if visual in OK_VISUAL:
            continue
        done_downstream = [COLS[VISUAL_IDX + 1 + i]
                           for i, c in enumerate(cells[VISUAL_IDX + 1:]) if c == "✅"]
        if done_downstream:
            violations.append({
                "chapter": cells[0],
                "visual_status": visual,
                "downstream": done_downstream,
            })
    return violations


def main():
    if len(sys.argv) < 2:
        print("usage: python scripts/check_visual_gate.py <status.md>", file=sys.stderr)
        return 2
    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    violations = check_gate(text)
    if not violations:
        print("OK: 하드게이트 위반 없음")
        return 0
    for v in violations:
        print(f"위반: {v['chapter']} 시각자산={v['visual_status']} 인데 "
              f"하류 완료={', '.join(v['downstream'])}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
