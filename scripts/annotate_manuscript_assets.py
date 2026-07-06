"""원고 Visual asset 필드에 manifest의 확정 자산 경로를 병기(주석).

visual-assets 스테이지의 일부. manifest.json에서 슬라이드별 주 시각자료(primary)를 읽어,
원고(manuscripts/chNN.md)의 해당 `**Visual asset**` 블록에서 기존 병기 라인을 모두 제거한 뒤
primary 자산 한 줄만 다시 넣는다: `→ 생성됨: <path>`(이미지 primary) / `→ 렌더됨: <path>`(D2 primary).
- strip-and-replace: 재생성으로 primary가 바뀌어도 stale 병기가 남지 않고 항상 primary 하나만 유지된다.
- manifest가 SSOT이고 이 주석은 사람이 읽는 보조 표기(+ build_pptx가 원고 첫 자산 경로=primary를 잡는 용도).

사용:
  python scripts/annotate_manuscript_assets.py <course_dir> <chNN>
"""
import json
import re
import sys
from pathlib import Path


def annotate(course_dir, ch):
    course = Path(course_dir)
    md_path = course / "manuscripts" / f"{ch}.md"
    manifest = json.loads((course / "assets" / "manifest.json").read_text(encoding="utf-8"))
    by_slide = {s["slide"]: s for s in manifest["slides"]}

    lines = md_path.read_text(encoding="utf-8").splitlines()
    out = []
    cur_slide = None
    in_va = False
    slide_re = re.compile(r"^## Slide (\d+)\.")
    field_re = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")

    def va_annotations(slide):
        """이 슬라이드에 병기할 라인 — 주 시각자료(primary)가 present인 경우 그 한 줄만."""
        anns = []
        entry = by_slide.get(slide, {})
        img = entry.get("image", {})
        d2 = entry.get("d2", {})
        if img.get("primary") and img.get("status") == "present":
            anns.append(f"- → 생성됨: {img['path']}")
        elif d2.get("primary") and d2.get("status") == "present":
            anns.append(f"- → 렌더됨: {d2['path']}")
        return anns

    ANN_RE = re.compile(r"^\s*-\s*→\s*(생성됨|렌더됨)\s*[:：]")

    def flush_va(buffer, slide):
        """Visual asset 블록에서 기존 자산 병기 라인을 모두 제거하고 primary 병기만 다시 넣는다."""
        buffer = [ln for ln in buffer if not ANN_RE.match(ln)]
        buffer.extend(va_annotations(slide))
        return buffer

    va_buffer = []
    inserted = 0
    for line in lines:
        m = slide_re.match(line)
        if m:
            if in_va and va_buffer:
                before = len(va_buffer)
                va_buffer = flush_va(va_buffer, cur_slide)
                inserted += len(va_buffer) - before
                out.extend(va_buffer)
                va_buffer = []
            cur_slide = int(m.group(1))
            in_va = False
            out.append(line)
            continue
        f = field_re.match(line)
        if f:
            # 이전 Visual asset 블록 종료 처리
            if in_va and va_buffer:
                before = len(va_buffer)
                va_buffer = flush_va(va_buffer, cur_slide)
                inserted += len(va_buffer) - before
                out.extend(va_buffer)
                va_buffer = []
            in_va = (f.group(1) == "Visual asset")
            if in_va:
                out.append(line)
            else:
                out.append(line)
            continue
        if line.strip() == "---" and in_va:
            if va_buffer:
                before = len(va_buffer)
                va_buffer = flush_va(va_buffer, cur_slide)
                inserted += len(va_buffer) - before
                out.extend(va_buffer)
                va_buffer = []
            in_va = False
            out.append(line)
            continue
        if in_va:
            va_buffer.append(line)
        else:
            out.append(line)
    # 파일 끝 처리
    if in_va and va_buffer:
        before = len(va_buffer)
        va_buffer = flush_va(va_buffer, cur_slide)
        inserted += len(va_buffer) - before
        out.extend(va_buffer)

    md_path.write_text("\n".join(out) + "\n", encoding="utf-8")
    return inserted


def main():
    if len(sys.argv) < 3:
        print("usage: python scripts/annotate_manuscript_assets.py <course_dir> <chNN>")
        return 1
    n = annotate(sys.argv[1], sys.argv[2])
    print(f"OK: {n} 자산 경로 병기 ({sys.argv[1]}/manuscripts/{sys.argv[2]}.md)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
