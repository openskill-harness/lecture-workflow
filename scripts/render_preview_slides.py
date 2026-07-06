"""ppt_preview HTML의 각 `.ppt-slide .ppt-canvas`를 16:9 PNG로 렌더한다.

pptx-build(이미지 모드)의 입력 자산 생성기. Playwright(Chromium) 헤드리스로
승인된 미리보기 HTML을 슬라이드별 이미지로 떠서, PPTX 각 장의 전체 배경으로 쓴다.

사용: python scripts/render_preview_slides.py <preview.html> <out_dir> [--width 1280] [--scale 2]
"""
import argparse
import sys
from pathlib import Path

# 렌더 시 캔버스를 정확한 16:9 풀블리드로 만들기 위한 오버라이드.
# 테두리/라운드/그림자/외부 여백을 제거하고, 폭·높이·종횡비를 모두 강제한다 —
# preview CSS가 `aspect-ratio: 16/9`를 잃어도 렌더러가 16:9를 보장한다(codex 검토 #3).
CANVAS_OVERRIDE_CSS = """
  html, body {{ margin: 0 !important; padding: 0 !important; background: #fff !important; }}
  .ppt-slide {{ margin: 0 !important; padding: 0 !important; }}
  .ppt-canvas {{
    width: {width}px !important;
    height: {height}px !important;
    aspect-ratio: 16 / 9 !important;
    max-width: none !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
  }}
"""


def render(preview_html, out_dir, width=1280, scale=2):
    from playwright.sync_api import sync_playwright

    html_path = Path(preview_html).resolve()
    if not html_path.exists():
        raise SystemExit(f"미리보기 HTML 없음: {html_path}")
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    height = round(width * 9 / 16)
    expected = (width * scale, height * scale)  # 렌더 후 PNG 픽셀 크기(16:9) 기대값
    written = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=scale, viewport={"width": width + 80, "height": 900})
        page.goto(html_path.as_uri())
        page.add_style_tag(content=CANVAS_OVERRIDE_CSS.format(width=width, height=height))
        # 이미지 로딩 + 폰트 준비 대기(한글 글리프 안정화). networkidle만으로는
        # 웹폰트/시스템폰트 준비를 보장하지 않으므로 document.fonts.ready도 기다린다(codex 검토 #4).
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        canvases = page.query_selector_all(".ppt-slide .ppt-canvas")
        if not canvases:
            raise SystemExit("`.ppt-slide .ppt-canvas` 요소를 찾지 못했습니다.")
        for i, el in enumerate(canvases, 1):
            el.scroll_into_view_if_needed()
            png = out / f"slide{i:02d}.png"
            el.screenshot(path=str(png))
            written.append(png)
        browser.close()

    # 렌더 후 16:9 크기 검증(preview CSS 회귀나 잘림을 조기 발견).
    from PIL import Image
    bad = []
    for png in written:
        with Image.open(png) as im:
            if im.size != expected:
                bad.append((png.name, im.size))
    if bad:
        raise SystemExit(f"렌더 크기 불일치(기대 {expected}): " +
                         ", ".join(f"{n}={s}" for n, s in bad))
    return written


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("preview_html")
    ap.add_argument("out_dir")
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--scale", type=int, default=2)
    args = ap.parse_args()
    files = render(args.preview_html, args.out_dir, args.width, args.scale)
    print(f"OK: {len(files)} slide images -> {args.out_dir}")


if __name__ == "__main__":
    sys.exit(main())
