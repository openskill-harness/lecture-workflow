"""시각자산 manifest 빌더 — 재설계(visual-assets 스테이지)의 SSOT 생성기.

원고(chNN.md)의 슬라이드별 Visual asset(이미지 프롬프트 / D2 소스)을 스캔하고,
실제 생성된 자산 파일(images/chNN/, diagrams/)과 대조해 시각자산 폴더의
manifest.json 을 만든다. 경로는 course_layout 이 배치(outputs/ 규약·루트 평면)를
판별해 결정한다.

주 시각자료(primary): 사용자가 직접 준 파일(`User image:`)이 최우선. 그다음 `주 시각자료: D2`
마커, 그다음 GPT 이미지 프롬프트, 마지막으로 D2. image/d2 블록 모두 명시 `primary`(bool)를 갖는다.

자산 출처(origin, image 블록): 하네스가 그 자산을 덮어써도 되는지를 가른다.
  agent       — `GPT image prompt:` (하네스 작성). 해시 stale 적용, 자유롭게 재생성·개선.
  user-prompt — `User image prompt:` (사용자 제시). 해시 stale 적용, 문구 임의 수정 금지.
  user-file   — `User image: <경로>` (사용자 제공 파일). prompt_hash 없음, stale 비교 제외, 덮어쓰기 금지.
user-file 경로는 원고에 적힌 값을 그대로 쓴다 — 소비 스킬이 그 파일을 캐노니컬 경로
({assets_rel}/images/{ch}/slideNN.png)로 복사한 뒤 원고에 기록하므로, annotate 병기 경로와
build_pptx의 IMG_PATH_RE가 집는 첫 경로가 모두 같은 값이 된다.

manifest 스키마(슬라이드별):
  {
    "slide": 5,
    "image": {"path": "outputs/03_시각자산/images/ch01/slide05.png", "prompt_hash": "...|null", "status": "present|deferred|missing|stale", "primary": true, "origin": "agent|user-prompt|user-file"},
    "d2":    {"path": "outputs/03_시각자산/diagrams/ch01-slide05-http.png", "d2_hash": "...", "status": "present|deferred|missing", "primary": false}
  }
status(이미지): 파일 present → present / primary 아니거나 `이미지 보류` 마커면 deferred / 그 외 missing.
status(자산 단계 전체): primary 자산이 present·deferred인 슬라이드 수 / 예상 수 로 present|partial|missing 판정.
prompt_hash/d2_hash = 원고 해당 소스 텍스트 SHA1 앞 12자. 재빌드 시 이전 manifest.json의
해시와 비교해, 파일은 있으나 프롬프트가 바뀐 자산을 status="stale"로 표기한다(stale은 커버로
인정하지 않으므로 하드 게이트가 재생성을 유도한다). origin=user-file은 이 비교를 건너뛴다 —
prompt_hash가 None이라 이전 해시와 무조건 달라져 stale로 오판되기 때문이다.

사용:
  python scripts/build_asset_manifest.py <course_dir> <chNN>
  예: python scripts/build_asset_manifest.py courses/spring-boot-basic ch01
"""
import hashlib
import json
import sys
from pathlib import Path

import course_layout
from manuscript_grammar import (
    SLIDE_RE, FIELD_RE, IMG_PROMPT_RE, D2_PRIMARY_RE, IMG_DEFER_RE,
    USER_PROMPT_RE, USER_IMG_FILE_RE,
)


def _hash(text):
    return hashlib.sha1(text.strip().encode("utf-8")).hexdigest()[:12] if text and text.strip() else None


def _load_prior_hashes(course):
    """이전 manifest.json에서 슬라이드별 (image/d2) 해시를 읽어온다. 없으면 빈 dict."""
    p = course_layout.path(course, "assets") / "manifest.json"
    if not p.exists():
        return {}
    try:
        prev = json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    out = {}
    for s in prev.get("slides", []):
        out[s["slide"]] = {
            "image": (s.get("image") or {}).get("prompt_hash"),
            "d2": (s.get("d2") or {}).get("d2_hash"),
        }
    return out


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
            out[cur] = {"prompt": None, "d2": None, "d2_primary": False, "img_defer": False,
                        "user_file": None, "user_prompt": False, "_va": ""}
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
            if D2_PRIMARY_RE.search(line):
                out[cur]["d2_primary"] = True
            if IMG_DEFER_RE.search(line):
                out[cur]["img_defer"] = True
            uf = USER_IMG_FILE_RE.search(line)
            if uf and not out[cur]["user_file"]:
                out[cur]["user_file"] = uf.group(1).strip().rstrip("`").strip()
            if USER_PROMPT_RE.search(line):
                out[cur]["user_prompt"] = True
            pm = IMG_PROMPT_RE.search(line)
            if pm and not out[cur]["prompt"]:
                out[cur]["prompt"] = pm.group(1).strip().rstrip("`").strip()
    if cur is not None:
        out[cur]["_va"] = "\n".join(va_lines)
    return out


def build_manifest(course_dir, ch):
    course = Path(course_dir)
    prior = _load_prior_hashes(course)   # {slide: {"image": hash, "d2": hash}}
    md = (course_layout.path(course, "manuscripts") / f"{ch}.md").read_text(encoding="utf-8")
    va = parse_visual_assets(md)
    assets_rel = course_layout.rel(course, "assets")
    img_dir = course / assets_rel / "images" / ch
    dia_dir = course / assets_rel / "diagrams"

    slides = []
    for num in sorted(va):
        entry = {"slide": num}
        info = va[num]
        user_file = info["user_file"]
        has_img = bool(info["prompt"]) or bool(user_file)
        has_d2 = bool(info["d2"])

        # 자산 파일 실존 여부. user-file은 원고에 적힌 경로를 그대로 쓴다(캐노니컬 복사는 소비 스킬의 책임).
        d2_matches = sorted(dia_dir.glob(f"{ch}-slide{num:02d}-*.png")) if (has_d2 and dia_dir.exists()) else []
        d2_file_ok = bool(d2_matches) and d2_matches[0].stat().st_size > 0
        img_path = user_file or f"{assets_rel}/images/{ch}/slide{num:02d}.png"
        img_file_ok = has_img and (course / img_path).exists() and (course / img_path).stat().st_size > 0

        # 주 시각자료 선택: 사용자가 직접 준 파일이 최우선(사용자 확정이 원고를 이긴다).
        # 그 외 기본은 GPT 이미지. D2는 opt-in 마커가 있거나 이미지 프롬프트가 없을 때만 primary.
        if user_file:
            primary = "image"
        elif info["d2_primary"] and has_d2:
            primary = "d2"
        elif has_img:
            primary = "image"
        elif has_d2:
            primary = "d2"
        else:
            primary = None

        if has_d2:
            cur_d2_hash = _hash(info["d2"])
            prior_d2 = prior.get(num, {}).get("d2")
            if d2_file_ok and prior_d2 is not None and prior_d2 != cur_d2_hash:
                d2_status = "stale"
            elif d2_file_ok:
                d2_status = "present"
            elif primary != "d2":
                d2_status = "deferred"
            else:
                d2_status = "missing"
            entry["d2"] = {
                "path": f"{assets_rel}/diagrams/{d2_matches[0].name}" if d2_matches else None,
                "d2_hash": cur_d2_hash,
                "status": d2_status,
                "primary": primary == "d2",
            }
        if has_img:
            if user_file:
                origin = "user-file"
            elif info["user_prompt"]:
                origin = "user-prompt"
            else:
                origin = "agent"
            cur_hash = None if user_file else _hash(info["prompt"])
            prior_hash = prior.get(num, {}).get("image")
            # 주의: stale은 프롬프트 변경 후 첫 재빌드에서만 감지된다(새 해시를 저장하므로). 재생성 전 중복 빌드 금지 — visual-assets §7 흐름 준수.
            if origin == "user-file":
                # 사용자가 준 파일은 하네스가 덮어쓰지 않는다. prompt_hash가 None이라 해시 비교에
                # 넣으면 이전 해시와 무조건 달라져 stale로 오판되므로 비교 자체를 건너뛴다.
                img_status = "present" if img_file_ok else "missing"
            elif img_file_ok and prior_hash is not None and prior_hash != cur_hash:
                img_status = "stale"          # 파일은 있으나 프롬프트가 바뀜 → 재생성 필요
            elif img_file_ok:
                img_status = "present"
            elif primary != "image":
                img_status = "deferred"      # D2가 primary — 이미지는 폴백, 생성 불필요
            elif info["img_defer"]:
                img_status = "deferred"      # 명시적 보류
            else:
                img_status = "missing"       # primary인데 미생성 → 하드 게이트가 막음
            entry["image"] = {
                "path": img_path,
                "prompt_hash": cur_hash,
                "status": img_status,
                "primary": primary == "image",
                "origin": origin,
            }
        slides.append(entry)

    # 슬라이드별 "주 시각자료 확보" 여부로 집계 (deferred는 결핍 아님)
    def slide_covered(s):
        # 주 시각자료(primary)가 present 또는 (의도된)deferred면 커버됨
        for k in ("image", "d2"):
            a = s.get(k)
            if a and a.get("primary") and a.get("status") in ("present", "deferred"):
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
    out_path = course / assets_rel / "manifest.json"
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
