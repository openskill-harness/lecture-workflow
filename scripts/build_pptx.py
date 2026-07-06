"""원고(md, manuscript-schema 문법) → PPTX. 발표자 노트에 Narration 삽입.

사용: python scripts/build_pptx.py <manuscript.md> <out.pptx> [--assets-root <course-dir>]
"""
import argparse
import re
import sys
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt

# 자산 임베드 안전 여백 정책: EMBED_SAFE_MARGIN_RATIO = 0.05 (스펙 §3.0-A canonical)
# PPTX target 구현 상수 — 슬라이드 가장자리에서 확보할 안전 여백.
PPTX_EMBED_MARGIN = Inches(0.5)


def _fit_in_box(img_px_w, img_px_h, box_w_emu, box_h_emu):
    """이미지 픽셀 종횡비를 유지한 채 박스(EMU) 안에 들어가는 (w, h)를 반환.
    width·height 둘 다 박스를 넘지 않는다(오버플로 불가). codex 검증 조건 1."""
    aspect = img_px_w / img_px_h if img_px_h else 1.0
    w = box_w_emu
    h = int(round(w / aspect))
    if h > box_h_emu:
        h = box_h_emu
        w = int(round(h * aspect))
    return w, h


def _image_px_size(path):
    """PIL로 픽셀 크기 읽기(EXIF 회전 보정)."""
    from PIL import Image, ImageOps
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        return im.size  # (w, h)

SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
IMG_PATH_RE = re.compile(r"(assets[/\\][^\s)`\"']+\.(?:png|jpg|jpeg|webp))", re.IGNORECASE)

def parse_manuscript(md_text):
    """슬라이드 블록을 dict 리스트로. keys: title, screen_lines, image_paths, code, narration"""
    slides, cur, field = [], None, None
    in_code, code_lines, fence_lang = False, [], ""
    for line in md_text.splitlines():
        if in_code:
            if line.strip().startswith("```"):
                # d2 fence = diagram source, not display code -> discard.
                if field == "Visual asset" and fence_lang != "d2" and code_lines:
                    block = "\n".join(code_lines)
                    cur["code"] = (cur["code"] + "\n\n" + block) if cur["code"] else block
                in_code, code_lines, fence_lang = False, [], ""
                continue
            code_lines.append(line)
            continue
        m = SLIDE_RE.match(line)
        if m:
            if cur:
                slides.append(cur)
            cur = {"title": m.group(2).strip(), "screen_lines": [], "image_paths": [], "code": "", "narration": ""}
            field, in_code, code_lines, fence_lang = None, False, [], ""
            continue
        if cur is None:
            continue
        f = FIELD_RE.match(line)
        if f:
            field = f.group(1)
            continue
        if line.strip().startswith("```"):
            in_code = True
            fence_lang = line.strip()[3:].strip().lower()
            continue
        text = line.strip().lstrip("-").strip()
        if not text:
            continue
        if field == "Screen":
            cur["screen_lines"].append(text)
        elif field == "Narration":
            cur["narration"] = (cur["narration"] + " " + text).strip()
        elif field == "Visual asset":
            for im in IMG_PATH_RE.findall(line):
                cur["image_paths"].append(im)
    if cur:
        slides.append(cur)
    return slides

def build_pptx(md_text, out_path, assets_root="."):
    slides = parse_manuscript(md_text)
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    layout = prs.slide_layouts[5]  # Title Only
    for s in slides:
        slide = prs.slides.add_slide(layout)
        slide.shapes.title.text = s["title"]
        top = Inches(1.8)
        body_lines = [l for l in s["screen_lines"] if not l.startswith("제목:")]
        if body_lines:
            box = slide.shapes.add_textbox(Inches(0.8), top, Inches(7.0), Inches(4.8))
            tf = box.text_frame
            tf.word_wrap = True
            for i, l in enumerate(body_lines[:8]):
                p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
                p.text = l
                p.font.size = Pt(22)
        for im in s["image_paths"][:1]:
            p = Path(assets_root) / im
            if p.exists():
                # 이미지 배치 박스: 본문이 있으면 우측 컬럼, 없으면 하단 중앙 넓은 영역.
                # 어느 경우든 슬라이드 가장자리에서 PPTX_EMBED_MARGIN 여백 확보.
                m = PPTX_EMBED_MARGIN
                box_top = top  # 제목 아래
                box_bottom = prs.slide_height - m
                box_h = box_bottom - box_top
                if body_lines:
                    box_left = Inches(8.0)
                    box_right = prs.slide_width - m
                else:
                    box_left = m
                    box_right = prs.slide_width - m
                box_w = box_right - box_left
                try:
                    px_w, px_h = _image_px_size(p)
                except Exception:
                    px_w, px_h = (4, 3)
                w, h = _fit_in_box(px_w, px_h, box_w, box_h)
                # 박스 안에서 중앙 정렬
                left = box_left + (box_w - w) // 2
                pic_top = box_top + (box_h - h) // 2
                slide.shapes.add_picture(str(p), left, pic_top, width=w, height=h)
        if s["code"]:
            cb = slide.shapes.add_textbox(Inches(0.8), Inches(5.2), Inches(11.7), Inches(1.8))
            cf = cb.text_frame
            cf.word_wrap = True
            cf.text = s["code"][:600]
            cf.paragraphs[0].font.name = "Consolas"
            cf.paragraphs[0].font.size = Pt(12)
        if s["narration"]:
            slide.notes_slide.notes_text_frame.text = s["narration"]
    prs.save(out_path)
    return len(slides)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manuscript")
    ap.add_argument("out")
    ap.add_argument("--assets-root", default=".")
    args = ap.parse_args()
    md = Path(args.manuscript).read_text(encoding="utf-8")
    n = build_pptx(md, args.out, args.assets_root)
    print(f"OK: {n} slides -> {args.out}")

if __name__ == "__main__":
    sys.exit(main())
