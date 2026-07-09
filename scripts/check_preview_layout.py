"""ppt_preview HTML의 레이아웃 위반을 기계 검출한다 — 감지만 하고 수정하지 않는다.

`pub-layout-check`(PDF)의 HTML판. 수정 전략은 `ppt-preview` SKILL.md의 repair 규칙이 담당한다.

검사는 `render_preview_slides.py`와 **동일한 캔버스 오버라이드 CSS** 아래에서 수행한다 —
pptx-build 이미지 모드가 그 기하에서 렌더하므로, 그때 잘리는 것을 그때의 조건으로 재야 한다.

검사 항목:
  1. code-scroll  — 캔버스 안 `pre`가 스크롤됨(scrollHeight > clientHeight). PPTX에서 아래가 잘린다.
  2. overflow     — 자식 요소가 `.ppt-canvas` 경계를 벗어남.
  3. slide-seq    — `data-slide`가 1부터 빠짐없는 연번이 아니거나 중복. (--manuscript 주면 원고 슬라이드 수와 대조)
  4. word-count   — 캔버스 본문(h2 제외) 단어 수가 한도 초과(기본 45).
  5. palette      — 골든에 없는 색상값이 도입됨(새 색상표·다크 테마 금지).

사용:
  python scripts/check_preview_layout.py <preview.html> [--golden templates/golden/ppt_preview_golden.html]
                                         [--manuscript courses/{id}/outputs/02_원고/chNN.md]
                                         [--width 1280] [--max-words 45]
심각도: word-count는 SKILL.md상 권고이므로 warn, 나머지는 error.
종료코드: error 0건이면 0, 있으면 1(warn만 있으면 0).
"""
import argparse
import re
import sys
from pathlib import Path

from render_preview_slides import CANVAS_OVERRIDE_CSS

# 색상 리터럴: #rgb/#rrggbb/#rrggbbaa, rgb()/rgba()/hsl()/hsla()
_COLOR_RE = re.compile(
    r"#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?)\([^)]*\)",
    re.IGNORECASE,
)
_SLIDE_RE = re.compile(r"^## Slide (\d+)\.", re.M)


def _norm_color(c):
    c = c.strip().lower().replace(" ", "")
    if c.startswith("#") and len(c) == 4:  # #abc -> #aabbcc
        c = "#" + "".join(ch * 2 for ch in c[1:])
    return c


def _colors(text):
    return {_norm_color(c) for c in _COLOR_RE.findall(text)}


# 캔버스 안에서 측정할 값들. 오버라이드 CSS 적용 후 실행한다.
_PROBE_JS = """
() => {
  const out = [];
  document.querySelectorAll('.ppt-slide').forEach(slide => {
    const canvas = slide.querySelector('.ppt-canvas');
    if (!canvas) { out.push({slide: slide.dataset.slide ?? null, noCanvas: true}); return; }
    const cr = canvas.getBoundingClientRect();

    const scrollers = [];
    canvas.querySelectorAll('pre').forEach(pre => {
      if (pre.scrollHeight > pre.clientHeight + 1 || pre.scrollWidth > pre.clientWidth + 1) {
        scrollers.push({tag: 'pre', dh: pre.scrollHeight - pre.clientHeight, dw: pre.scrollWidth - pre.clientWidth});
      }
    });

    const TOL = 1.5;  // 서브픽셀 반올림 여유
    const overflows = [];
    canvas.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const over = {
        top: cr.top - r.top, left: cr.left - r.left,
        bottom: r.bottom - cr.bottom, right: r.right - cr.right,
      };
      const worst = Math.max(over.top, over.left, over.bottom, over.right);
      if (worst > TOL) {
        const cls = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
        overflows.push({tag: el.tagName.toLowerCase(), cls: cls.split(/\\s+/)[0] || '', px: Math.round(worst)});
      }
    });

    const h2 = canvas.querySelector('h2');
    const full = (canvas.innerText || '').trim();
    const title = h2 ? (h2.innerText || '').trim() : '';
    const body = full.startsWith(title) ? full.slice(title.length) : full;
    const words = body.split(/\\s+/).filter(Boolean).length;

    out.push({
      slide: slide.dataset.slide ?? null,
      scrollers,
      overflows: overflows.slice(0, 5),
      overflowCount: overflows.length,
      words,
    });
  });
  return out;
}
"""


def probe(preview_html, width=1280):
    from playwright.sync_api import sync_playwright

    html_path = Path(preview_html).resolve()
    if not html_path.exists():
        raise SystemExit(f"미리보기 HTML 없음: {html_path}")
    height = round(width * 9 / 16)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width + 80, "height": 900})
        page.goto(html_path.as_uri())
        page.add_style_tag(content=CANVAS_OVERRIDE_CSS.format(width=width, height=height))
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        data = page.evaluate(_PROBE_JS)
        browser.close()
    return data


def check(preview_html, golden=None, manuscript=None, width=1280, max_words=45):
    findings = []
    slides = probe(preview_html, width)
    html_text = Path(preview_html).read_text(encoding="utf-8")

    seen = []
    for s in slides:
        n = s.get("slide")
        tag = f"slide {n}" if n else "slide ?"
        if s.get("noCanvas"):
            findings.append(("output-contract", tag, ".ppt-canvas 없음"))
            continue
        seen.append(n)
        for sc in s["scrollers"]:
            findings.append(("code-scroll", tag,
                             f"pre 스크롤 (세로 +{sc['dh']}px, 가로 +{sc['dw']}px) — PPTX에서 잘림"))
        if s["overflowCount"]:
            worst = ", ".join(f"{o['tag']}.{o['cls'] or '-'}(+{o['px']}px)" for o in s["overflows"])
            findings.append(("overflow", tag,
                             f"캔버스 밖으로 {s['overflowCount']}개 요소 삐져나옴: {worst}"))
        if s["words"] > max_words:
            findings.append(("word-count", tag, f"본문 {s['words']}단어 (한도 {max_words})"))

    # 슬라이드 연번
    nums = [int(n) for n in seen if n and str(n).isdigit()]
    if len(nums) != len(seen):
        findings.append(("slide-seq", "-", "data-slide 누락된 슬라이드 있음"))
    if nums != list(range(1, len(nums) + 1)):
        findings.append(("slide-seq", "-", f"data-slide가 1부터의 연번이 아님: {nums}"))
    if manuscript:
        want = len(_SLIDE_RE.findall(Path(manuscript).read_text(encoding="utf-8")))
        if want != len(nums):
            findings.append(("slide-seq", "-", f"캔버스 {len(nums)}개 ≠ 원고 슬라이드 {want}개"))

    # 팔레트: 골든에 없는 색상은 새 색상표 도입
    if golden:
        allowed = _colors(Path(golden).read_text(encoding="utf-8"))
        extra = sorted(_colors(html_text) - allowed)
        if extra:
            findings.append(("palette", "-", f"골든에 없는 색상 {len(extra)}종: {', '.join(extra[:8])}"))

    return findings, len(slides)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("preview_html")
    ap.add_argument("--golden", default="templates/golden/ppt_preview_golden.html")
    ap.add_argument("--manuscript")
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--max-words", type=int, default=45)
    args = ap.parse_args()

    golden = args.golden if args.golden and Path(args.golden).exists() else None
    findings, n = check(args.preview_html, golden, args.manuscript, args.width, args.max_words)

    if not findings:
        print(f"OK: {n}개 캔버스 — 위반 없음")
        return 0
    errors = [f for f in findings if f[0] != "word-count"]
    warns = [f for f in findings if f[0] == "word-count"]
    print(f"캔버스 {n}개 — error {len(errors)}건, warn {len(warns)}건\n")
    for kind, where, msg in errors:
        print(f"  [error/{kind}] {where}: {msg}")
    for kind, where, msg in warns:
        print(f"  [warn/{kind}] {where}: {msg}")
    print("\n감지만 합니다. 수정은 ppt-preview SKILL.md의 repair 규칙을 따르세요.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
