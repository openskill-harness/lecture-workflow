import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".claude/skills/panseo-slide/scripts"))
import embed_ink as ei

_TEMPLATE = ROOT / ".claude/skills/panseo-slide/template/board_template_light.html"

_CLIP = {"format": "panseo-ink", "version": 1, "w": 1280, "h": 720, "layer": "slide", "slide": 1, "pauseMs": 1000,
         "strokes": [{"color": "#ff5c6e", "size": 4, "hl": False, "pts": [[10, 10, 0.5, 0], [20, 20, 0.5, 30]]},
                     {"color": "#1a1f2e", "size": 8, "hl": True, "pts": [[50, 50, 0.5, 2000], [60, 40, 0.5, 2050]]}]}

_INKML = """<?xml version="1.0" encoding="UTF-8"?>
<ink xmlns="http://www.w3.org/2003/InkML">
  <definitions>
    <traceFormat xml:id="tf"><channel name="X" type="decimal"/><channel name="Y" type="decimal"/><channel name="F" type="decimal"/><channel name="T" type="integer" units="ms"/></traceFormat>
    <brush xml:id="b0"><brushProperty name="color" value="#ff5c6e"/><brushProperty name="width" value="4" units="px"/></brush>
    <brush xml:id="b1"><brushProperty name="color" value="#1a1f2e"/><brushProperty name="width" value="8" units="px"/><brushProperty name="panseo-highlighter" value="true"/></brush>
  </definitions>
  <annotation type="panseo-ink">{"w":1280,"h":720,"layer":"board","slide":2,"pauseMs":800}</annotation>
  <trace brushRef="#b0">10 10 0.5 0, 20 20 0.5 30</trace>
  <trace brushRef="#b1">50 50 0.5 2000, 60 40 0.5 2050</trace>
</ink>
"""


def _clips(html):
    import re
    return re.findall(r'<script type="application/json" class="ink-clip" data-slide="(\d+)" data-layer="(\w+)">(.*?)</script>', html, re.S)


def test_inkml_to_clip_keeps_brush_time_and_meta():
    clip = ei.inkml_to_clip(_INKML)
    assert (clip["w"], clip["h"], clip["layer"], clip["slide"], clip["pauseMs"]) == (1280, 720, "board", 2, 800)
    assert [s["color"] for s in clip["strokes"]] == ["#ff5c6e", "#1a1f2e"]
    assert clip["strokes"][1]["hl"] is True and clip["strokes"][1]["size"] == 8
    assert clip["strokes"][1]["pts"][0] == [50, 50, 0.5, 2000]


def test_inkml_without_time_channel_gets_synthetic_time():
    txt = _INKML.replace('<channel name="T" type="integer" units="ms"/>', "").replace(" 0.5 0,", " 0.5,") \
        .replace(" 0.5 30<", " 0.5<").replace(" 0.5 2000,", " 0.5,").replace(" 0.5 2050<", " 0.5<")
    ts = [p[3] for s in ei.inkml_to_clip(txt)["strokes"] for p in s["pts"]]
    assert ts == sorted(ts) and len(set(ts)) == len(ts)


def test_embed_inserts_after_steps_end_and_replaces_same_slot():
    html = _TEMPLATE.read_text(encoding="utf-8")
    html, n = ei.embed(html, _CLIP, 2, "slide")
    assert n == 0
    html, n = ei.embed(html, dict(_CLIP, pauseMs=1500), 2, "slide")
    assert n == 1
    html, _ = ei.embed(html, _CLIP, 2, "board")
    found = _clips(html)
    assert [(s, l) for s, l, _ in found] == [("2", "board"), ("2", "slide")]
    assert json.loads(found[1][2])["pauseMs"] == 1500
    # 클립은 엔진 <script>보다 앞(STEPS END 바로 뒤)
    assert html.index('class="ink-clip" data-slide="2"') < html.index("<script>\n/* ── 판서슬라이드 엔진")


def test_embed_escapes_script_close():
    clip = dict(_CLIP, note="</script><b>")
    html, _ = ei.embed(_TEMPLATE.read_text(encoding="utf-8"), clip, 1, "slide")
    body = _clips(html)[0][2]
    assert "</script>" not in body and json.loads(body)["note"] == "</script><b>"
