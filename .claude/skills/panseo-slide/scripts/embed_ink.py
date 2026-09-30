"""녹화한 판서(.ink.json / .inkml)를 판서 엔진 v4 HTML(panseo-slide / panseo-board)에 인라인 클립으로 박는다.

사용법:
  python embed_ink.py <slide.html> <clip.ink.json|clip.inkml> [--slide N] [--layer slide|board] [--pause MS] [-o out.html]

- 클립은 STEPS END 주석 바로 뒤에 <script type="application/json" class="ink-clip" ...> 로 들어간다
  (엔진 스크립트보다 앞이어야 로드 시 읽힌다). file:// 로 열어도 동작한다.
- 같은 slide/layer 클립이 이미 있으면 교체한다.
- --slide/--layer 를 생략하면 녹화 파일에 기록된 값(저장 당시 슬라이드 번호·레이어)을 쓴다.
- --pause 로 '손 멈춤 → 다음 구간' 기준(ms, 기본 1000)을 바꿀 수 있다.
"""
import argparse
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

MARK = "<!-- ===================== STEPS END ===================== -->"


def _local(tag):
    return tag.rsplit("}", 1)[-1]


def inkml_to_clip(text):
    root = ET.fromstring(text)
    order = ["X", "Y"]
    brushes, meta = {}, {}
    for el in root.iter():
        name = _local(el.tag)
        if name == "traceFormat":
            ch = [c.get("name") for c in el if _local(c.tag) == "channel"]
            if ch:
                order = ch
        elif name == "brush":
            b = {"color": "#ffffff", "size": 4, "hl": False}
            for p in el:
                if _local(p.tag) != "brushProperty":
                    continue
                n, v = p.get("name"), p.get("value")
                if n == "color":
                    b["color"] = v
                elif n == "width":
                    b["size"] = float(v)
                elif n == "panseo-highlighter":
                    b["hl"] = v == "true"
            bid = el.get("{http://www.w3.org/XML/1998/namespace}id") or el.get("id")
            brushes[bid] = b
        elif name == "annotation" and el.get("type") == "panseo-ink":
            try:
                meta = json.loads(el.text or "{}")
            except ValueError:
                pass
    ix = order.index("X") if "X" in order else 0
    iy = order.index("Y") if "Y" in order else 1
    ip = order.index("F") if "F" in order else -1
    it = order.index("T") if "T" in order else -1
    strokes, clock = [], 0
    for tr in root.iter():
        if _local(tr.tag) != "trace":
            continue
        b = brushes.get((tr.get("brushRef") or "").lstrip("#"), {"color": "#ffffff", "size": 4, "hl": False})
        pts = []
        for chunk in (tr.text or "").split(","):
            a = chunk.split()
            if len(a) < 2:
                continue
            a = [float(v) for v in a]
            if it >= 0 and it < len(a):
                t = a[it]
            else:
                clock += 12
                t = clock
            p = a[ip] if 0 <= ip < len(a) else 0.5
            pts.append([a[ix], a[iy], p, t])
        if it < 0:
            clock += 400
        if pts:
            strokes.append({"color": b["color"], "size": b["size"], "hl": b["hl"], "pts": pts})
    w, h = meta.get("w"), meta.get("h")
    if not w or not h:
        w = max((p[0] for s in strokes for p in s["pts"]), default=0) + 20
        h = max((p[1] for s in strokes for p in s["pts"]), default=0) + 20
    return {"format": "panseo-ink", "version": 1, "w": w, "h": h,
            "layer": meta.get("layer", "slide"), "slide": meta.get("slide", 1),
            "pauseMs": meta.get("pauseMs", 1000), "strokes": strokes}


def load_clip(path):
    text = pathlib.Path(path).read_text(encoding="utf-8").strip()
    clip = inkml_to_clip(text) if text.startswith("<") else json.loads(text)
    if not clip.get("strokes"):
        sys.exit(f"획이 없는 클립입니다: {path}")
    return clip


def embed(html, clip, slide, layer):
    if MARK not in html:
        sys.exit("STEPS END 주석을 찾지 못했습니다 — 판서 엔진 템플릿으로 만든 HTML인가요?")
    body = json.dumps(clip, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    tag = f'<script type="application/json" class="ink-clip" data-slide="{slide}" data-layer="{layer}">{body}</script>'
    old = re.compile(r'\n?[ \t]*<script type="application/json" class="ink-clip" data-slide="%d" data-layer="%s">.*?</script>'
                     % (slide, re.escape(layer)), re.S)
    html, n = old.subn("", html)
    return html.replace(MARK, MARK + "\n  " + tag, 1), n


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html")
    ap.add_argument("clip")
    ap.add_argument("--slide", type=int)
    ap.add_argument("--layer", choices=["slide", "board"])
    ap.add_argument("--pause", type=int, help="구간 분할 기준 ms (기본: 클립 값 또는 1000)")
    ap.add_argument("-o", "--out")
    a = ap.parse_args()
    clip = load_clip(a.clip)
    if a.pause:
        clip["pauseMs"] = a.pause
    slide = a.slide or int(clip.get("slide", 1))
    layer = a.layer or clip.get("layer", "slide")
    clip["slide"], clip["layer"] = slide, layer
    src = pathlib.Path(a.html)
    html, replaced = embed(src.read_text(encoding="utf-8"), clip, slide, layer)
    out = pathlib.Path(a.out) if a.out else src
    out.write_text(html, encoding="utf-8")
    print(f"{'교체' if replaced else '추가'}: {layer} {slide} ← {a.clip} ({len(clip['strokes'])}획) → {out}")


if __name__ == "__main__":
    main()
