#!/usr/bin/env python3
"""원고 md의 ```d2 블록 → ELK 레이아웃 + O'Reilly 모노톤 SVG (pub-d2-diagram 파이프라인)."""
import re, subprocess, sys, pathlib

D2 = r"C:\Program Files\D2\d2.exe"
MONO = [  # pub-d2-diagram SKILL.md의 sed 치환과 동일
    ("#0D32B2", "#222222"), ("#F7F8FE", "#FFFFFF"), ("#EDF0FD", "#FFFFFF"),
    ("#E3E9FD", "#FFFFFF"), ("#EEF1F8", "#FFFFFF"),
]
STREAKS = re.compile(r"fill:url\(#streaks-(?:bright|darker|normal|dark)[^)]*\)")
ALLOWED_FILLS = {"#f0f0f0", "white", "#eeeeee", "transparent", "#ffffff"}

def main(md_path, img_dir, prefix):
    md = pathlib.Path(md_path).read_text(encoding="utf-8")
    blocks = re.findall(r"```d2\n(.*?)```", md, re.S)
    img = pathlib.Path(img_dir); img.mkdir(exist_ok=True)
    fails = 0
    for i, b in enumerate(blocks, 1):
        if not b.strip():
            print(f"{prefix}-d{i}: FAIL 빈 d2 블록"); fails += 1; continue
        # 스타일 가드 (strict — 위반은 실패, codex Task0 처방)
        viol = []
        if "direction: right" not in b:
            viol.append("direction: right 누락")
        bad = [f for f in re.findall(r'fill:\s*"?([#\w]+)"?', b)
               if f.lower() not in ALLOWED_FILLS]
        if bad:
            viol.append(f"비허용 fill {bad}")
        if viol:
            print(f"{prefix}-d{i}: FAIL " + "; ".join(viol)); fails += 1; continue
        d2f = img / f"{prefix}-d{i}.d2"; svgf = img / f"{prefix}-d{i}.svg"
        d2f.write_text(b, encoding="utf-8")
        r = subprocess.run([D2, "--layout", "elk", "--pad", "40", str(d2f), str(svgf)],
                           capture_output=True, text=True)
        if r.returncode != 0:
            err = (r.stderr.strip().splitlines() or ["(stderr 없음)"])[-1]
            print(f"{prefix}-d{i}: FAIL {err}")
            fails += 1
            continue
        svg = svgf.read_text(encoding="utf-8")
        for src, dst in MONO:
            svg = svg.replace(src, dst)
        svg = STREAKS.sub("fill:#FFFFFF", svg)
        svgf.write_text(svg, encoding="utf-8")
        print(f"{prefix}-d{i}: OK (elk+mono)")
    print(f"blocks={len(blocks)} fails={fails}")
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2], sys.argv[3]))
