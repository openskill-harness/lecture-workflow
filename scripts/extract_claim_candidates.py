"""원고 기술검증 후보 추출 — manuscript-verify(3.5단계)의 결정적 입력 생성기.

확정 원고(manuscripts/chNN.md)를 슬라이드별로 파싱해 검증 대상 후보 텍스트
(Screen의 '핵심 정의' / Narration / Source)를 구조화해 뽑는다. 어떤 문장이 '검증 가능한
원자적 기술 주장'인지 distill·분류하고 비유를 제외하는 판단은 이 스크립트가 아니라
manuscript-verify 스킬(LLM)이 한다 — 여기서는 결정적 후보 필드만 제공한다.

사용:
  python scripts/extract_claim_candidates.py <course_dir> <chNN>   # JSON을 stdout으로
"""
import json
import re
import sys
from pathlib import Path

import course_layout
from manuscript_grammar import SLIDE_RE, FIELD_RE

DEF_RE = re.compile(r"핵심\s*정의\s*[:：]\s*(.+)")


def extract_candidates(md_text):
    """return [{"slide": int, "definition": str, "narration": str, "source": str}, ...]"""
    out = []
    cur = None
    field = None
    buf = None

    def flush():
        if cur is not None:
            out.append({
                "slide": cur,
                "definition": " ".join(buf["definition"]).strip(),
                "narration": " ".join(buf["narration"]).strip(),
                "source": " ".join(buf["source"]).strip(),
            })

    for line in md_text.splitlines():
        m = SLIDE_RE.match(line)
        if m:
            flush()
            cur = int(m.group(1))
            field = None
            buf = {"definition": [], "narration": [], "source": []}
            continue
        if cur is None:
            continue
        f = FIELD_RE.match(line)
        if f:
            field = f.group(1)
            continue
        text = line.strip().lstrip("-").strip()
        if not text:
            continue
        if field == "Screen":
            dm = DEF_RE.search(text)
            if dm:
                buf["definition"].append(dm.group(1).strip())
        elif field == "Narration":
            buf["narration"].append(text)
        elif field == "Source":
            buf["source"].append(text)
    flush()
    return out


def main():
    if len(sys.argv) < 3:
        print("usage: python scripts/extract_claim_candidates.py <course_dir> <chNN>")
        return 1
    md = (course_layout.path(sys.argv[1], "manuscripts") / f"{sys.argv[2]}.md").read_text(encoding="utf-8")
    print(json.dumps(extract_candidates(md), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
