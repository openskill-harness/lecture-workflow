"""시각자산 manifest 빌더 — 재설계(visual-assets 스테이지)의 SSOT 생성기.

원고(manuscripts/chNN.md)의 슬라이드별 Visual asset(이미지 프롬프트 / D2 소스)을 스캔하고,
실제 생성된 자산 파일(assets/images/chNN/, assets/diagrams/)과 대조해
courses/{id}/assets/manifest.json 을 만든다.

manifest 스키마(슬라이드별):
  {
    "slide": 5,
    "image": {"path": "assets/images/ch01/slide05.png", "prompt_hash": "...", "status": "present|missing"},
    "d2":    {"path": "assets/diagrams/ch01-slide05-http.png", "d2_hash": "...", "status": "present|missing"}
  }
status(자산 단계 전체): present 수 / 예상 수 로 present|partial|missing 판정.
prompt_hash/d2_hash = 원고의 해당 소스 텍스트 SHA1 앞 12자 → 원고 변경 시 stale 감지에 사용.

사용:
  python scripts/build_asset_manifest.py <course_dir> <chNN>
  예: python scripts/build_asset_manifest.py courses/spring-boot-basic ch01
"""
import hashlib
import json
import re
import sys
from pathlib import Path

SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
# 영문 이미지 프롬프트 라인 (백틱 안 우선, 없으면 라벨 뒤 텍스트)
IMG_PROMPT_RE = re.compile(r"(?:image prompt|시각자료 프롬프트\(영문\))\s*[:：]\s*`?(.+)", re.IGNORECASE)


def _hash(text):
    return hashlib.sha1(text.strip().encode("utf-8")).hexdigest()[:12] if text and text.strip() else None


def parse_visual_assets(md_text):
    """슬라이드별 Visual asset 내용을 추출. return {slide_num: {"prompt": str|None, "d2": str|None}}"""
    out = {}
    cur = None
    field = None
    in_code = False
    fence_lang = ""
    d2_lines = []
    va_lines = []
    for line in md_text.splitlines():
        if in_code:
            if line.strip().startswith("```"):
                if field == "Visual asset" and fence_lang == "d2":
                    out[cur]["d2"] = "\n".join(d2_lines)
                in_code, fence_lang, d2_lines = False, "", []
                continue
            if fence_lang == "d2":
                d2_lines.append(line)
            continue
        m = SLIDE_RE.match(line)
        if m:
            if cur is not None:
                out[cur]["_va"] = "\n".join(va_lines)
            cur = int(m.group(1))
            out[cur] = {"prompt": None, "d2": None, "_va": ""}
            field, va_lines = None, []
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
        if field == "Visual asset":
            va_lines.append(line)
            pm = IMG_PROMPT_RE.search(line)
            if pm and not out[cur]["prompt"]:
                out[cur]["prompt"] = pm.group(1).strip().rstrip("`").strip()
    if cur is not None:
        out[cur]["_va"] = "\n".join(va_lines)
    return out


def build_manifest(course_dir, ch):
    course = Path(course_dir)
    md = (course / "manuscripts" / f"{ch}.md").read_text(encoding="utf-8")
    va = parse_visual_assets(md)
    img_dir = course / "assets" / "images" / ch
    dia_dir = course / "assets" / "diagrams"

    slides = []
    for num in sorted(va):
        entry = {"slide": num}
        info = va[num]
        # D2 먼저 판정 (D2가 있으면 그 슬라이드의 주 시각자료)
        d2_present = False
        if info["d2"]:
            matches = sorted(dia_dir.glob(f"{ch}-slide{num:02d}-*.png")) if dia_dir.exists() else []
            d2_path = f"assets/diagrams/{matches[0].name}" if matches else None
            d2_present = bool(matches) and matches[0].stat().st_size > 0
            entry["d2"] = {
                "path": d2_path,
                "d2_hash": _hash(info["d2"]),
                "status": "present" if d2_present else "missing",
            }
        # 이미지: D2가 주 시각자료인 슬라이드에서 이미지가 없으면 deferred(중복 불필요)
        if info["prompt"]:
            img_path = f"assets/images/{ch}/slide{num:02d}.png"
            present = (course / img_path).exists() and (course / img_path).stat().st_size > 0
            if present:
                status = "present"
            elif d2_present:
                status = "deferred"   # D2로 대체 — 생성 불필요
            else:
                status = "missing"
            entry["image"] = {
                "path": img_path,
                "prompt_hash": _hash(info["prompt"]),
                "status": status,
                "primary": not d2_present,   # 이 슬라이드의 주 시각자료인가
            }
        slides.append(entry)

    # 슬라이드별 "주 시각자료 확보" 여부로 집계 (deferred는 결핍 아님)
    def slide_covered(s):
        # D2 present 또는 image present면 커버됨
        if s.get("d2", {}).get("status") == "present":
            return True
        if s.get("image", {}).get("status") == "present":
            return True
        # 시각자료 필드가 아예 없는 슬라이드(코드/평가)는 커버 대상 아님
        return "d2" not in s and "image" not in s
    total_visual_slides = sum(1 for s in slides if "d2" in s or "image" in s)
    covered = sum(1 for s in slides if ("d2" in s or "image" in s) and slide_covered(s))
    overall = "present" if covered == total_visual_slides and total_visual_slides > 0 else (
        "partial" if covered > 0 else "missing")

    manifest = {
        "chapter": ch,
        "overall_status": overall,
        "visual_slides_covered": covered,
        "visual_slides_total": total_visual_slides,
        "slides": slides,
    }
    out_path = course / "assets" / "manifest.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest, out_path


def main():
    if len(sys.argv) < 3:
        print("usage: python scripts/build_asset_manifest.py <course_dir> <chNN>")
        return 1
    manifest, out_path = build_manifest(sys.argv[1], sys.argv[2])
    print(f"OK: {out_path} — {manifest['overall_status']} "
          f"(시각슬라이드 {manifest['visual_slides_covered']}/{manifest['visual_slides_total']} 커버)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
