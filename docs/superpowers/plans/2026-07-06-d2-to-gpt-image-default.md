# D2 → GPT 이미지 기본 전환 + ch01 재확정 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하네스의 시각자산 기본값을 D2 다이어그램에서 GPT 이미지로 전환하고(D2는 명시 opt-in 폴백으로 유지), 그 규약으로 `spring-boot-basic` ch01의 5개 D2 슬라이드(05·08·10·15·20)를 GPT 이미지로 재생성해 전 소비물을 재빌드한 뒤 ch01을 재확정한다.

**Architecture:** manifest 빌더(`scripts/build_asset_manifest.py`)의 "주 시각자료(primary)" 선택 로직을 역전한다 — 이미지 프롬프트가 있으면 GPT 이미지가 기본 primary, D2는 원고 Visual asset 필드에 `주 시각자료: D2` opt-in 마커가 있거나 이미지 프롬프트가 아예 없을 때만 primary. `image`/`d2` 두 블록 모두 명시 `primary` 불리언을 갖고, `slide_covered`는 primary 자산이 present(또는 명시 `이미지 보류`로 deferred)일 때만 커버로 센다. manifest.json은 SSOT이고, 소비 스크립트가 원고에서 자산 경로를 긁는 경로(annotate → build_pptx)도 primary만 병기하도록 만들어 primary-aware로 정합시킨다. 하네스 구조 변경이므로 CLAUDE.md 유지 규칙대로 proposal + codex 사전검증을 먼저 거친다(완료: Task 1·2, 조건부 승인 — 조건 5건 본 계획에 반영).

**Tech Stack:** Python 3.14 + pytest 9.0.3(빌더·annotate 단위테스트), image-gen(`scripts/image_gen.py`, Codex 이미지), python-pptx(`scripts/build_pptx.py`), Typst(book-build), Git Bash on Windows 11.

## Global Constraints

- **하네스 구조 변경은 proposal + codex 사전검증 필수**: `docs/proposals/`에 계획서를 쓰고 `codex exec --sandbox read-only '...' </dev/null`(Git Bash, stdin 닫고)로 검증한 뒤 결과를 `docs/reviews/`에 저장하고 나서 반영한다 (CLAUDE.md 유지 규칙). — Task 1·2에서 완료.
- **manifest.json은 SSOT — 손으로 편집 금지**: 항상 `python scripts/build_asset_manifest.py <course_dir> <chNN>`로 재생성한다.
- **주 시각자료(primary) 단일 규약**: 소비물은 슬라이드별 manifest의 `primary: true` 자산을 임베드한다. 원고 자산 병기는 `annotate_manuscript_assets.py`가 primary 하나만 쓰고, `build_pptx.py`는 원고의 첫 자산 경로(`image_paths[:1]`)를 임베드하므로 primary가 원고의 유일한 자산 경로여야 한다.
- **원고에 image-gen 주석 블록 직접 삽입 금지**: `image_gen.py`는 처리한 블록을 프롬프트째 지우고 `<img>`로 치환하는 파괴적 스크립트다. 반드시 스크래치 파일에 모아 실행하고 실행 후 삭제한다 (visual-assets §2).
- **경로 계약 고정**: 이미지 `assets/images/{chNN}/slide{NN}.png`(pptx-build `IMG_PATH_RE`가 이 패턴 인식), D2 `assets/diagrams/{chNN}-slide{NN}-*.png`.
- **라이트 테마 고정**: 새 색상·다크 테마 도입 금지 (골든 템플릿 기준).
- **Codex 이미지 생성은 직렬·장당 1~2분**: 여러 장은 스크래치 1개에 모아 백그라운드 1회 실행하고 PNG 개수로 진행 확인 (폴링 전용 서브에이전트 금지).
- **status.md 갱신 의무**: 단계 시작 시 🔄, 사용자 확정 시 ✅.
- **대상 과정 디렉터리**: `courses/spring-boot-basic`. 대상 차시: `ch01`.

---

## File Structure

- `docs/proposals/2026-07-06_d2-to-gpt-image-default.md` — 재설계 제안서 (Task 1 완료)
- `docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md` — codex 사전검증 결과 (Task 2 완료)
- `scripts/build_asset_manifest.py` — primary 선택 로직 역전 + `이미지 보류` defer 마커 (수정)
- `tests/test_build_asset_manifest.py` — 빌더 단위테스트 (신규)
- `scripts/annotate_manuscript_assets.py` — primary 자산만 병기(기존 병기 라인 stale 제거) (수정)
- `tests/test_annotate_manuscript_assets.py` — annotate 단위테스트 (신규)
- `.claude/skills/visual-assets/SKILL.md` — 기본=이미지, D2=opt-in, `이미지 보류` deferral 절차 (수정)
- `.claude/skills/manuscript-draft/references/manuscript-schema.md` — Visual asset 하위유형: 이미지 기본 + `주 시각자료: D2` + `이미지 보류` 명세 (수정)
- `.claude/skills/{storyboard,ppt-preview,pptx-build,panseo-slide,book-build}/SKILL.md` — "manifest primary 자산 임베드" 계약 (수정)
- `CLAUDE.md` — pub-d2-diagram을 opt-in 폴백으로 명시 (수정)
- `courses/spring-boot-basic/manuscripts/ch01.md` — 05·08·10·15·20 영문 프롬프트 재작성 + primary 병기(annotate) (수정)
- `courses/spring-boot-basic/assets/images/ch01/slide{05,08,10,15,20}.png` — 신규 GPT 이미지 (신규)
- `courses/spring-boot-basic/assets/manifest.json` — 재생성 (스크립트가 씀)
- `courses/spring-boot-basic/{storyboards,ppt_previews,panseo,pptx,book}/ch01.*` — 5슬라이드 재빌드 (수정)
- `courses/spring-boot-basic/status.md` — ch01 재확정 갱신 (수정)

> **Scope note:** 두 하위작업(하네스 재설계 Phase A~C / ch01 콘텐츠 재빌드 Phase D)을 한 플랜에 담는다. ch01 재빌드가 재설계된 빌더·annotate에 강결합돼 있고 "GPT 이미지 전환을 ch01로 증명"이 하나의 완결 산출물이기 때문이다.

> **codex 조건부 승인 반영(Task 2)**: (1)(2) primary 기준 `slide_covered`·두 블록 명시 `primary` → Task 3. (3) 명시 defer 마커(`이미지 보류`) → Task 3. (4)(5) 소비 primary-aware — annotate가 primary만 병기하도록 → Task 4, 소비 스킬 문구 → Task 7, ch01 검증 → Task 12.

---

## Phase A — 제안서 + codex 사전검증 (완료)

### Task 1: 재설계 제안서 작성 — ✅ 완료 (commit 7adc4cb)

`docs/proposals/2026-07-06_d2-to-gpt-image-default.md` 생성 완료.

### Task 2: codex 사전검증 — ✅ 완료 (commit eed767d, 조건부 승인)

`docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md` 저장 완료. 조건 5건은 위 "codex 조건부 승인 반영"대로 Task 3·4·7·12에 반영됨.

---

## Phase B — manifest 빌더 로직 역전 (TDD)

### Task 3: 이미지 primary 기본 + D2 opt-in 마커 + 이미지 보류 defer 마커

**Files:**
- Create: `tests/test_build_asset_manifest.py`
- Modify: `scripts/build_asset_manifest.py` (parse_visual_assets, build_manifest 슬라이드 루프, slide_covered)

**Interfaces:**
- Consumes: 없음(독립 스크립트)
- Produces: `build_manifest(course_dir, ch) -> (manifest_dict, out_path)`. 슬라이드 엔트리의 `image`/`d2` 블록 각각에 `status`(`present`/`deferred`/`missing`)와 `primary`(bool). 규칙: `주 시각자료: D2` 마커 + D2 있으면 D2 primary; 아니면 이미지 프롬프트 있으면 이미지 primary; 둘 다 아니면 D2 primary(이미지 프롬프트 없는 D2-only). 이미지 status: 파일 있으면 present, primary 아니면 deferred, `이미지 보류` 마커 있으면 deferred, 그 외 missing. `slide_covered`는 primary 자산 status가 present 또는 deferred일 때 커버.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/test_build_asset_manifest.py`를 생성한다:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import build_asset_manifest as bam


def _make_course(tmp_path, slide_md, *, img=False, d2=False):
    """임시 과정 디렉터리 구성. slide_md는 ## Slide.. 섹션 전체 텍스트."""
    course = tmp_path / "course"
    (course / "manuscripts").mkdir(parents=True)
    (course / "assets" / "images" / "ch01").mkdir(parents=True)
    (course / "assets" / "diagrams").mkdir(parents=True)
    (course / "manuscripts" / "ch01.md").write_text(slide_md, encoding="utf-8")
    if img:
        (course / "assets" / "images" / "ch01" / "slide05.png").write_bytes(b"PNGDATA")
    if d2:
        (course / "assets" / "diagrams" / "ch01-slide05-http.png").write_bytes(b"PNGDATA")
    return course


_D2_FENCE = "```d2\nbrowser -> server\n```"

_BOTH = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 시각자료 프롬프트(영문): `A clean flat illustration of an HTTP request flow, no text, 16:9`\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_BOTH_D2_OPTIN = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 주 시각자료: D2\n"
    "- 시각자료 프롬프트(영문): `A clean flat illustration of an HTTP request flow, no text, 16:9`\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_D2_ONLY = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    f"{_D2_FENCE}\n\n"
    "**Source**\n- x\n"
)

_IMG_DEFER = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 이미지 보류\n"
    "- 시각자료 프롬프트(영문): `A clean flat illustration of an HTTP request flow, no text, 16:9`\n\n"
    "**Source**\n- x\n"
)


def _slide5(manifest):
    return next(s for s in manifest["slides"] if s["slide"] == 5)


def test_image_is_primary_by_default(tmp_path):
    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "present"
    assert s["d2"]["primary"] is False
    assert manifest["overall_status"] == "present"


def test_d2_opt_in_marker_makes_d2_primary(tmp_path):
    course = _make_course(tmp_path, _BOTH_D2_OPTIN, img=True, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["d2"]["primary"] is True
    assert s["image"]["primary"] is False


def test_d2_only_slide_keeps_d2_primary(tmp_path):
    course = _make_course(tmp_path, _D2_ONLY, img=False, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert "image" not in s
    assert s["d2"]["primary"] is True
    assert s["d2"]["status"] == "present"
    assert manifest["overall_status"] == "present"


def test_ungenerated_image_reads_missing_not_deferred(tmp_path):
    # 이미지 프롬프트 있고 D2 파일도 있으나 이미지 미생성 → 이제 이미지가 primary이므로 missing(하드 게이트가 막음)
    course = _make_course(tmp_path, _BOTH, img=False, d2=True)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "missing"
    assert manifest["overall_status"] != "present"


def test_defer_marker_keeps_image_deferred_not_missing(tmp_path):
    # 이미지 프롬프트 + `이미지 보류` 마커, 이미지 미생성, D2 없음 → 의도된 보류이므로 deferred(커버로 인정)
    course = _make_course(tmp_path, _IMG_DEFER, img=False, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "deferred"
    assert manifest["overall_status"] == "present"
```

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `python -m pytest tests/test_build_asset_manifest.py -v`
Expected: 최소 `test_image_is_primary_by_default`, `test_d2_opt_in_marker_makes_d2_primary`, `test_ungenerated_image_reads_missing_not_deferred`, `test_defer_marker_keeps_image_deferred_not_missing` 가 FAIL (현재 빌더는 D2 우선·primary 키 없음·defer 마커 미인식). `test_d2_only_slide_keeps_d2_primary`도 d2에 `primary` 키가 없어 KeyError로 FAIL.

- [ ] **Step 3: parse_visual_assets에 마커 파싱 추가**

`scripts/build_asset_manifest.py`에서 `IMG_PROMPT_RE` 정의 바로 아래에 추가한다:

```python
# D2 opt-in 마커: "주 시각자료: D2" / "Primary asset: D2" 있으면 D2를 주 시각자료로 강제
D2_PRIMARY_RE = re.compile(r"(?:주\s*시각자료|primary\s*asset)\s*[:：]\s*d2", re.IGNORECASE)
# 이미지 보류(defer) 마커: 이미지가 primary인데 아직 안 만들었어도 의도된 보류(deferred)로 표기
IMG_DEFER_RE = re.compile(r"이미지\s*보류|image\s*deferred", re.IGNORECASE)
```

`parse_visual_assets`에서 슬라이드 dict 초기화 줄을 바꾼다:

```python
            out[cur] = {"prompt": None, "d2": None, "d2_primary": False, "img_defer": False, "_va": ""}
```

그리고 `if field == "Visual asset":` 블록에서 `va_lines.append(line)` 다음에 마커 감지를 추가한다:

```python
        if field == "Visual asset":
            va_lines.append(line)
            if D2_PRIMARY_RE.search(line):
                out[cur]["d2_primary"] = True
            if IMG_DEFER_RE.search(line):
                out[cur]["img_defer"] = True
            pm = IMG_PROMPT_RE.search(line)
            if pm and not out[cur]["prompt"]:
                out[cur]["prompt"] = pm.group(1).strip().rstrip("`").strip()
```

- [ ] **Step 4: build_manifest 슬라이드 루프 역전**

`build_manifest`에서 `slides = []` 부터 `slides.append(entry)` 까지의 블록(현재 90~121행)을 아래로 교체한다:

```python
    slides = []
    for num in sorted(va):
        entry = {"slide": num}
        info = va[num]
        has_img = bool(info["prompt"])
        has_d2 = bool(info["d2"])

        # 자산 파일 실존 여부
        d2_matches = sorted(dia_dir.glob(f"{ch}-slide{num:02d}-*.png")) if (has_d2 and dia_dir.exists()) else []
        d2_file_ok = bool(d2_matches) and d2_matches[0].stat().st_size > 0
        img_path = f"assets/images/{ch}/slide{num:02d}.png"
        img_file_ok = has_img and (course / img_path).exists() and (course / img_path).stat().st_size > 0

        # 주 시각자료 선택: 기본은 GPT 이미지. D2는 opt-in 마커가 있거나 이미지 프롬프트가 없을 때만 primary.
        if info["d2_primary"] and has_d2:
            primary = "d2"
        elif has_img:
            primary = "image"
        elif has_d2:
            primary = "d2"
        else:
            primary = None

        if has_d2:
            entry["d2"] = {
                "path": f"assets/diagrams/{d2_matches[0].name}" if d2_matches else None,
                "d2_hash": _hash(info["d2"]),
                "status": "present" if d2_file_ok else ("deferred" if primary != "d2" else "missing"),
                "primary": primary == "d2",
            }
        if has_img:
            if img_file_ok:
                img_status = "present"
            elif primary != "image":
                img_status = "deferred"      # D2가 primary — 이미지는 폴백, 생성 불필요
            elif info["img_defer"]:
                img_status = "deferred"      # 명시적 보류
            else:
                img_status = "missing"       # primary인데 미생성 → 하드 게이트가 막음
            entry["image"] = {
                "path": img_path,
                "prompt_hash": _hash(info["prompt"]),
                "status": img_status,
                "primary": primary == "image",
            }
        slides.append(entry)
```

- [ ] **Step 5: slide_covered 를 primary 기준으로 교체**

`build_manifest`의 `def slide_covered(s):` 함수 본문(현재 124~131행)을 아래로 교체한다:

```python
    def slide_covered(s):
        # 주 시각자료(primary)가 present 또는 (의도된)deferred면 커버됨
        for k in ("image", "d2"):
            a = s.get(k)
            if a and a.get("primary") and a.get("status") in ("present", "deferred"):
                return True
        # 시각자료 필드가 아예 없는 슬라이드(코드/평가)는 커버 대상 아님
        return "d2" not in s and "image" not in s
```

- [ ] **Step 6: 테스트 실행해 통과 확인**

Run: `python -m pytest tests/test_build_asset_manifest.py -v`
Expected: 5개 테스트 전부 PASS.

- [ ] **Step 7: 커밋**

```bash
git add scripts/build_asset_manifest.py tests/test_build_asset_manifest.py
git commit -m "feat(manifest): 주 시각자료 기본값 D2→GPT 이미지 역전 + D2 opt-in/이미지 보류 마커"
```

---

### Task 4: annotate_manuscript_assets.py를 primary-aware로

**Files:**
- Create: `tests/test_annotate_manuscript_assets.py`
- Modify: `scripts/annotate_manuscript_assets.py` (va_annotations, flush_va)

**Interfaces:**
- Consumes: Task 3 manifest(`image`/`d2` 블록의 `primary` 필드)
- Produces: `annotate(course_dir, ch) -> int`. 원고 각 Visual asset 블록에서 기존 `→ 생성됨:`/`→ 렌더됨:` 병기 라인을 전부 제거하고, **primary 자산이 present인 경우 그 한 줄만** 다시 병기한다(image primary→`- → 생성됨: <path>`, d2 primary→`- → 렌더됨: <path>`). primary가 deferred/missing이면 병기하지 않는다. 이로써 `build_pptx.py`가 원고에서 긁는 첫 자산 경로가 항상 primary가 된다.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/test_annotate_manuscript_assets.py`를 생성한다:

```python
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import annotate_manuscript_assets as ann


def _make_course(tmp_path, md_text, manifest):
    course = tmp_path / "course"
    (course / "manuscripts").mkdir(parents=True)
    (course / "assets").mkdir(parents=True)
    (course / "manuscripts" / "ch01.md").write_text(md_text, encoding="utf-8")
    (course / "assets" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False), encoding="utf-8")
    return course


def _manifest(image=None, d2=None):
    entry = {"slide": 5}
    if image:
        entry["image"] = image
    if d2:
        entry["d2"] = d2
    return {"chapter": "ch01", "slides": [entry]}


_MD = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- 시각자료 프롬프트(영문): `x`\n\n"
    "**Source**\n- s\n"
)


def _va_block(course):
    return (course / "manuscripts" / "ch01.md").read_text(encoding="utf-8")


def test_only_primary_image_annotated(tmp_path):
    m = _manifest(
        image={"path": "assets/images/ch01/slide05.png", "status": "present", "primary": True},
        d2={"path": "assets/diagrams/ch01-slide05-http.png", "status": "present", "primary": False},
    )
    course = _make_course(tmp_path, _MD, m)
    ann.annotate(str(course), "ch01")
    txt = _va_block(course)
    assert "→ 생성됨: assets/images/ch01/slide05.png" in txt
    assert "→ 렌더됨: assets/diagrams/ch01-slide05-http.png" not in txt


def test_d2_primary_annotated_image_not(tmp_path):
    m = _manifest(
        image={"path": "assets/images/ch01/slide05.png", "status": "present", "primary": False},
        d2={"path": "assets/diagrams/ch01-slide05-http.png", "status": "present", "primary": True},
    )
    course = _make_course(tmp_path, _MD, m)
    ann.annotate(str(course), "ch01")
    txt = _va_block(course)
    assert "→ 렌더됨: assets/diagrams/ch01-slide05-http.png" in txt
    assert "→ 생성됨: assets/images/ch01/slide05.png" not in txt


def test_stale_annotation_replaced(tmp_path):
    # 원고에 옛 D2 병기가 남아 있고, 이제 이미지가 primary → 옛 렌더됨 제거·생성됨 추가
    md_with_stale = (
        "## Slide 5. HTTP\n\n"
        "**Visual asset**\n"
        "- 시각자료 프롬프트(영문): `x`\n"
        "- → 렌더됨: assets/diagrams/ch01-slide05-http.png\n\n"
        "**Source**\n- s\n"
    )
    m = _manifest(
        image={"path": "assets/images/ch01/slide05.png", "status": "present", "primary": True},
        d2={"path": "assets/diagrams/ch01-slide05-http.png", "status": "deferred", "primary": False},
    )
    course = _make_course(tmp_path, md_with_stale, m)
    ann.annotate(str(course), "ch01")
    txt = _va_block(course)
    assert "→ 렌더됨: assets/diagrams/ch01-slide05-http.png" not in txt
    assert "→ 생성됨: assets/images/ch01/slide05.png" in txt
    assert txt.count("→ 생성됨") == 1  # 중복 병기 없음
```

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `python -m pytest tests/test_annotate_manuscript_assets.py -v`
Expected: 3개 전부 FAIL (현행 annotate는 present인 image·d2를 둘 다 병기하고 stale 라인을 제거하지 않음).

- [ ] **Step 3: va_annotations를 primary 기준으로 교체**

`scripts/annotate_manuscript_assets.py`의 `va_annotations` 함수(현재 31~41행)를 아래로 교체한다:

```python
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
```

- [ ] **Step 4: flush_va를 stale 제거 후 primary만 병기로 교체**

`scripts/annotate_manuscript_assets.py`의 `flush_va` 함수(현재 43~51행)를 아래로 교체한다:

```python
    ANN_RE = re.compile(r"^\s*-\s*→\s*(생성됨|렌더됨)\s*[:：]")

    def flush_va(buffer, slide):
        """Visual asset 블록에서 기존 자산 병기 라인을 모두 제거하고 primary 병기만 다시 넣는다."""
        buffer = [ln for ln in buffer if not ANN_RE.match(ln)]
        buffer.extend(va_annotations(slide))
        return buffer
```

- [ ] **Step 5: 테스트 실행해 통과 확인**

Run: `python -m pytest tests/test_annotate_manuscript_assets.py -v`
Expected: 3개 전부 PASS.

- [ ] **Step 6: 기존 build_pptx 테스트 회귀 확인**

Run: `python -m pytest scripts/test_build_pptx.py -v`
Expected: 기존 테스트 전부 PASS (annotate 변경이 build_pptx 파서에 회귀를 주지 않음).

- [ ] **Step 7: 커밋**

```bash
git add scripts/annotate_manuscript_assets.py tests/test_annotate_manuscript_assets.py
git commit -m "feat(annotate): primary 자산만 병기(stale 제거) — build_pptx primary-aware"
```

---

## Phase C — 하네스 문서 동기화

### Task 5: visual-assets SKILL.md — 이미지 기본 / D2 opt-in / 보류 마커

**Files:**
- Modify: `.claude/skills/visual-assets/SKILL.md`

**Interfaces:**
- Consumes: Task 3·4 규약(이미지 primary 기본, `주 시각자료: D2`, `이미지 보류`, annotate primary만 병기)
- Produces: 재설계된 절차 문서

- [ ] **Step 1: §3 D2 렌더 절을 opt-in으로 개정**

`### 3. D2 렌더` 절의 제목+첫 항목을 아래로 바꾼다:

```
### 3. D2 렌더 (opt-in — 원고에 `주 시각자료: D2` 마커가 있거나 이미지 프롬프트가 없는 슬라이드만)

- **기본값은 GPT 이미지다.** 슬라이드에 이미지 프롬프트가 있으면 그 슬라이드는 §2(이미지)로 처리하고 D2는 렌더하지 않는다(원고에 D2 코드펜스가 남아 있어도 폴백 소스로만 보존). D2를 그 슬라이드의 주 시각자료로 쓰려면 원고 Visual asset 필드에 `- 주 시각자료: D2` 한 줄을 넣는다(그때만 아래 렌더를 수행).
```

- [ ] **Step 2: §4 manifest 절의 자동 defer 설명 갱신**

`### 4. manifest 생성 (SSOT)` 절에서 "D2가 있는 슬라이드는 이미지가 없어도..." 로 시작하는 항목을 아래로 교체한다:

```
- **기본은 이미지 primary**: 이미지 프롬프트가 있으면 `image.primary = true`, D2는 있어도 `d2.primary = false`(폴백 소스로 보존). `주 시각자료: D2` 마커가 있는 슬라이드만 `d2.primary = true`가 되고 이미지가 `deferred`로 강등된다. 이미지 프롬프트가 없는 D2-only 슬라이드는 D2가 primary다.
- **이미지 미생성 처리**: 이미지가 primary인데 아직 안 만들었으면 `missing`(하드 게이트가 막음)이다. 의도적으로 나중으로 미루려면 원고 Visual asset 필드에 `- 이미지 보류` 한 줄을 넣어라 — 그러면 `deferred`로 표기되어 커버로 인정된다.
- **원고 자산 병기**: `python scripts/annotate_manuscript_assets.py <course_dir> <chNN>`는 이제 슬라이드별 primary 자산 한 줄만 병기하고 옛 병기 라인은 제거한다(build_pptx가 원고 첫 경로를 임베드하므로 primary가 유일 경로여야 한다).
```

- [ ] **Step 3: 확정 체크리스트의 D2 파일명 계약 항목에 opt-in 단서 추가**

`### 확정 체크리스트`의 "**D2 파일명 계약**" 항목을 아래로 바꾼다:

```
- [ ] **D2 파일명 계약(opt-in 슬라이드 한정)**: `주 시각자료: D2`로 실제 렌더한 D2 산출물이 있다면 `assets/diagrams/{chNN}-slide{NN}-*.png` 형식으로 저장돼 있다. 이미지 primary 슬라이드는 D2 렌더가 없어도 무방하다.
```

- [ ] **Step 4: 커밋**

```bash
git add .claude/skills/visual-assets/SKILL.md
git commit -m "docs(visual-assets): 기본=GPT 이미지, D2=opt-in, 이미지 보류 절차로 개정"
```

---

### Task 6: manuscript-schema.md — Visual asset 하위유형 명세

**Files:**
- Modify: `.claude/skills/manuscript-draft/references/manuscript-schema.md` (§4 Visual asset)

**Interfaces:**
- Consumes: Task 3 마커 규약
- Produces: 원고 저자가 따르는 Visual asset 필드 규격

- [ ] **Step 1: §4 Visual asset 하위유형 위치 확인**

Run: `grep -n "Visual asset\|시각자료 프롬프트\|D2 diagram\|주 시각자료" .claude/skills/manuscript-draft/references/manuscript-schema.md`
Expected: 이미지 프롬프트 / D2 diagram 하위유형을 설명하는 §4 위치.

- [ ] **Step 2: 주 시각자료 규칙 문단 삽입**

§4에서 이미지 프롬프트·D2 diagram을 나열하는 지점 바로 뒤에 아래 문단을 추가한다:

```
**주 시각자료 규칙(중요)**: 한 슬라이드에 이미지 프롬프트와 D2를 함께 둘 수 있으나 **기본 주 시각자료는 GPT 이미지**다. 소비물은 manifest의 `primary` 자산을 임베드하며, 이미지 프롬프트가 있으면 이미지가 primary가 된다. 특정 슬라이드에서 D2를 주 시각자료로 쓰려면 Visual asset 필드에 `- 주 시각자료: D2` 한 줄을 넣는다. 이미지 생성을 나중으로 미루려면 `- 이미지 보류` 한 줄을 넣는다(그러면 manifest가 `deferred`로 표기해 하드 게이트를 통과). D2 코드펜스만 있고 이미지 프롬프트가 없는 슬라이드는 D2가 자동으로 primary다.
```

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/manuscript-draft/references/manuscript-schema.md
git commit -m "docs(schema): Visual asset 기본=이미지 + 주 시각자료:D2 / 이미지 보류 명세"
```

---

### Task 7: 소비 스킬 5종 — "manifest primary 자산 임베드" 계약

**Files:**
- Modify: `.claude/skills/storyboard/SKILL.md`
- Modify: `.claude/skills/ppt-preview/SKILL.md`
- Modify: `.claude/skills/pptx-build/SKILL.md`
- Modify: `.claude/skills/panseo-slide/SKILL.md`
- Modify: `.claude/skills/book-build/SKILL.md`

**Interfaces:**
- Consumes: Task 3 manifest `primary` 필드, Task 4 annotate primary 병기
- Produces: 각 소비 스킬이 primary 자산을 임베드한다는 계약 문구

- [ ] **Step 1: 각 소비 스킬의 자산 임베드 서술 위치 확인**

Run: `grep -rn "manifest\|primary\|assets/diagrams\|assets/images\|Visual asset\|시각자료" .claude/skills/storyboard/SKILL.md .claude/skills/ppt-preview/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/panseo-slide/SKILL.md .claude/skills/book-build/SKILL.md`
Expected: 각 파일의 자산 임베드 서술 위치.

- [ ] **Step 2: 5개 파일 각각에 primary 계약 문장 추가**

각 소비 스킬 SKILL.md의 자산 임베드 절에 아래 문장을 추가한다:

```
**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며 `d2.primary=true` 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다(원고 병기는 annotate가 primary 한 줄만 남긴다).
```

pptx-build는 원고를 직접 파싱하므로 문장 뒤에 단서를 덧붙인다:

```
(pptx-build는 원고를 파싱해 첫 자산 경로를 임베드한다 — annotate가 primary만 병기하므로 그 경로가 곧 primary다. D2 primary 슬라이드는 원고에 `주 시각자료: D2` 마커가 있어야 annotate가 D2 경로를 병기한다.)
```

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/storyboard/SKILL.md .claude/skills/ppt-preview/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/panseo-slide/SKILL.md .claude/skills/book-build/SKILL.md
git commit -m "docs(consumers): 소비 스킬 5종 manifest primary 자산 임베드 계약 명시"
```

---

### Task 8: CLAUDE.md — pub-d2-diagram을 opt-in 폴백으로 명시

**Files:**
- Modify: `CLAUDE.md` (보조 엔진 스킬 목록)

**Interfaces:**
- Consumes: Phase B/C 규약
- Produces: 하네스 최상위 문서에 D2 opt-in 상태 반영

- [ ] **Step 1: 보조 엔진 설명 갱신**

`CLAUDE.md`의 아래 줄:

```
- `pub-d2-diagram` — D2 모노톤 도형 렌더 (주 호출자: `visual-assets`)
```

를 아래로 교체한다:

```
- `pub-d2-diagram` — D2 모노톤 도형 렌더 (opt-in 폴백 엔진 — 기본 시각자산은 GPT 이미지, 원고에 `주 시각자료: D2` 마커가 있는 슬라이드에서만 `visual-assets`가 호출)
```

- [ ] **Step 2: 커밋**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE): pub-d2-diagram을 opt-in 폴백 엔진으로 명시"
```

---

## Phase D — ch01 재확정 (5개 D2 슬라이드 → GPT 이미지)

### Task 9: ch01 슬라이드 05·08·10·15·20 영문 이미지 프롬프트 재작성

**Files:**
- Modify: `courses/spring-boot-basic/manuscripts/ch01.md`

**Interfaces:**
- Consumes: 덱 하우스 스타일(slide01/04 프롬프트 — "clean educational illustration, flat, no text, 16:9")
- Produces: 5개 슬라이드의 `시각자료 프롬프트(영문)`를 D2 언급 없이 GPT 일러스트용으로 재작성. Task 10이 이 프롬프트로 이미지 생성.

- [ ] **Step 1: status.md ch01 시각자산 칸을 🔄로**

`courses/spring-boot-basic/status.md`의 ch01 행 `시각자산` 칸을 `✅`에서 `🔄`로 바꾸고, "다음 할 일" 줄을 `ch01 05·08·10·15·20 GPT 이미지 재생성 진행 중`으로 갱신한다.

- [ ] **Step 2: 5개 슬라이드의 영문 프롬프트 교체**

각 슬라이드의 `- 시각자료 프롬프트(영문): ...` 줄을 아래로 교체한다(D2 코드펜스·국문 프롬프트·기존 `→ 렌더됨` 줄은 그대로 둔다 — 폴백 소스 보존, 병기 정리는 Task 12 annotate가 담당). 스타일은 slide01/04와 동일하게 "clean educational flat illustration, no text, 16:9".

Slide 5:
```
- 시각자료 프롬프트(영문): `A clean educational flat illustration of an HTTP request/response flow, no text, 16:9. A browser on the left sends a request arrow to a Spring Boot server box on the right, and the server returns a response arrow back. Emphasize the round-trip with two distinct arrows. Bright classroom style, simple lines, no readable labels.`
```

Slide 8:
```
- 시각자료 프롬프트(영문): `A clean educational flat illustration comparing two roles, no text, 16:9. On top, a web server hands back a static file (image/document icon); on the bottom, a WAS (application server) processes business logic and reaches a database cylinder. Two parallel horizontal lanes, bright classroom style, simple lines, no readable labels.`
```

Slide 10:
```
- 시각자료 프롬프트(영문): `A clean educational flat illustration of a Spring Boot app booting, no text, 16:9. Left to right: a developer clicking Run on main(), a Spring container starting up, an embedded Tomcat icon waking inside the same box, and a browser reaching localhost:8080 ready. Emphasize that the server lives inside the application. Bright classroom style, simple lines, no readable labels.`
```

Slide 15:
```
- 시각자료 프롬프트(영문): `A clean educational flat illustration of dependency auto-configuration, no text, 16:9. A Web MVC starter block on the left leads via an arrow to a Spring Boot auto-configuration gear, which prepares two ready components on the right: Spring MVC and an embedded Tomcat. Compact left-to-right flow, bright classroom style, simple lines, no readable labels.`
```

Slide 20:
```
- 시각자료 프롬프트(영문): `A clean educational flat illustration of an end-to-end request journey, no text, 16:9. Left to right: a browser hitting /hello, an embedded Tomcat, a Spring MVC request-mapping router, a controller method box, and an HTTP response returning to the browser. One continuous horizontal path, bright classroom style, simple lines, no readable labels.`
```

- [ ] **Step 3: 프롬프트에 D2 언급이 없는지 확인**

Run: `grep -n "시각자료 프롬프트(영문)" courses/spring-boot-basic/manuscripts/ch01.md | grep -i "d2"`
Expected: 빈 출력.

- [ ] **Step 4: 커밋**

```bash
git add courses/spring-boot-basic/manuscripts/ch01.md courses/spring-boot-basic/status.md
git commit -m "content(ch01): 05·08·10·15·20 영문 프롬프트를 GPT 일러스트용으로 재작성"
```

---

### Task 10: 5개 GPT 이미지 생성 (image-gen 브릿지)

**Files:**
- Create: `courses/spring-boot-basic/assets/images/ch01/slide{05,08,10,15,20}.png`
- Temp: 스크래치 `.tmp_ch01_d2repl.md`(실행 후 삭제)

**Interfaces:**
- Consumes: Task 9의 재작성된 5개 영문 프롬프트
- Produces: 5개 PNG(경로 계약 `assets/images/ch01/slideNN.png`)

- [ ] **Step 1: 스크래치 파일에 5개 IMAGE PROMPT 블록 작성**

세션 스크래치 디렉터리에 `.tmp_ch01_d2repl.md`를 만들고, 슬라이드 05·08·10·15·20 각각에 Task 9의 영문 프롬프트로 아래 블록을 담는다(원고 `ch01.md`에는 절대 삽입하지 않는다):

```
<!-- [IMAGE PROMPT: ch01-slide05]
A clean educational flat illustration of an HTTP request/response flow, no text, 16:9. A browser on the left sends a request arrow to a Spring Boot server box on the right, and the server returns a response arrow back. Emphasize the round-trip with two distinct arrows. Bright classroom style, simple lines, no readable labels.
path: assets/images/ch01/slide05.png
-->
![ch01-slide05](placeholder.png)
```

(slide08/10/15/20도 같은 형식으로 각자의 프롬프트·path로 이어 붙인다.)

- [ ] **Step 2: image-gen 백그라운드 실행**

Run (background): `python .claude/skills/image-gen/scripts/image_gen.py <스크래치>/.tmp_ch01_d2repl.md courses/spring-boot-basic`
5장 직렬 = 약 5~10분. 폴링 전용 서브에이전트를 띄우지 않는다.

- [ ] **Step 3: 생성 확인**

Run: `for n in 05 08 10 15 20; do ls -la courses/spring-boot-basic/assets/images/ch01/slide$n.png; done`
Expected: 5개 파일 존재, 크기 > 0. 실패한 슬라이드가 있으면 그 슬라이드만 Step 1~2 재실행(repair — 전체 재생성 금지).

- [ ] **Step 4: 스크래치 삭제 + 원고 위생 확인**

Run: `rm <스크래치>/.tmp_ch01_d2repl.md; grep -c "IMAGE PROMPT" courses/spring-boot-basic/manuscripts/ch01.md`
Expected: 삭제 성공, grep 결과 `0`.

- [ ] **Step 5: 커밋**

```bash
git add courses/spring-boot-basic/assets/images/ch01/slide05.png courses/spring-boot-basic/assets/images/ch01/slide08.png courses/spring-boot-basic/assets/images/ch01/slide10.png courses/spring-boot-basic/assets/images/ch01/slide15.png courses/spring-boot-basic/assets/images/ch01/slide20.png
git commit -m "content(ch01): 05·08·10·15·20 GPT 이미지 생성"
```

---

### Task 11: manifest 재생성 + 이미지 primary 검증

**Files:**
- Modify: `courses/spring-boot-basic/assets/manifest.json` (스크립트가 씀)

**Interfaces:**
- Consumes: Task 3 빌더, Task 10 이미지 파일
- Produces: 5개 슬라이드가 `image.primary=true, status=present`인 manifest

- [ ] **Step 1: manifest 재생성**

Run: `python scripts/build_asset_manifest.py courses/spring-boot-basic ch01`
Expected: `OK: ... — present (시각슬라이드 26/26 커버)`.

- [ ] **Step 2: 5개 슬라이드 primary 검증**

Run: `python -c "import json; m=json.load(open('courses/spring-boot-basic/assets/manifest.json',encoding='utf-8')); [print(s['slide'], s.get('image',{}).get('status'), s.get('image',{}).get('primary'), s.get('d2',{}).get('primary')) for s in m['slides'] if s['slide'] in (5,8,10,15,20)]"`
Expected 각 줄: `<slide> present True False`.

- [ ] **Step 3: overall present 확인**

Run: `python -c "import json; m=json.load(open('courses/spring-boot-basic/assets/manifest.json',encoding='utf-8')); print(m['overall_status'], m['visual_slides_covered'], m['visual_slides_total'])"`
Expected: `present 26 26`.

- [ ] **Step 4: 커밋**

```bash
git add courses/spring-boot-basic/assets/manifest.json
git commit -m "content(ch01): manifest 재생성 — 05·08·10·15·20 이미지 primary"
```

---

### Task 12: 원고 병기 정리(annotate) + 소비물 5종 재빌드

**Files:**
- Modify: `courses/spring-boot-basic/manuscripts/ch01.md` (annotate — primary 병기로 정리)
- Modify: `courses/spring-boot-basic/storyboards/ch01.html`
- Modify: `courses/spring-boot-basic/ppt_previews/ch01.html`
- Modify: `courses/spring-boot-basic/panseo/ch01.html`
- Modify: `courses/spring-boot-basic/pptx/ch01.pptx`
- Modify: `courses/spring-boot-basic/book/ch01.pdf`

**Interfaces:**
- Consumes: Task 4 annotate(primary-aware), Task 11 manifest(이미지 primary)
- Produces: 5개 슬라이드가 GPT 이미지를 임베드하도록 갱신된 소비물

- [ ] **Step 1: annotate로 원고 자산 병기 정리**

Run: `python scripts/annotate_manuscript_assets.py courses/spring-boot-basic ch01`
그다음 5개 슬라이드가 이미지 병기만 남고 옛 D2 렌더 병기가 사라졌는지 확인:
Run: `for n in 05 08 10 15 20; do echo "slide$n:"; grep -A2 "생성됨: assets/images/ch01/slide$n.png\|렌더됨: assets/diagrams/ch01-slide$n" courses/spring-boot-basic/manuscripts/ch01.md; done`
Expected: 각 슬라이드에 `→ 생성됨: assets/images/ch01/slideNN.png`가 있고 `→ 렌더됨: assets/diagrams/...`는 없다.

- [ ] **Step 2: storyboard 재빌드**

`storyboard` 스킬을 ch01에 대해 재실행한다(manifest primary 임베드).
Run(검증): `for n in 05 08 10 15 20; do echo -n "slide$n img="; grep -c "assets/images/ch01/slide$n.png" courses/spring-boot-basic/storyboards/ch01.html; done; echo -n "old d2 refs="; grep -c "assets/diagrams/ch01-slide" courses/spring-boot-basic/storyboards/ch01.html`
Expected: 각 슬라이드 img `>=1`, old d2 refs `0`.

- [ ] **Step 3: ppt-preview 재빌드**

`ppt-preview` 스킬을 ch01에 대해 재실행한다.
Run(검증): `for n in 05 08 10 15 20; do echo -n "slide$n img="; grep -c "assets/images/ch01/slide$n.png" courses/spring-boot-basic/ppt_previews/ch01.html; done; grep -c "assets/diagrams/ch01-slide" courses/spring-boot-basic/ppt_previews/ch01.html`
Expected: 각 슬라이드 `>=1`, 마지막(diagrams) `0`.

- [ ] **Step 4: panseo-slide 재빌드**

`panseo-slide` 스킬(그대로 모드)을 ch01에 대해 재실행한다.
Run(검증): `grep -c "assets/diagrams/ch01-slide" courses/spring-boot-basic/panseo/ch01.html`
Expected: `0`.

- [ ] **Step 5: pptx 재빌드 + primary 임베드 검증**

`pptx-build` 스킬을 ch01에 대해 재실행한다(`python scripts/build_pptx.py`를 원고 + `--assets-root courses/spring-boot-basic`로). annotate가 primary(이미지)만 병기했으므로 5슬라이드는 이미지가 임베드된다.
Run(검증 - 슬라이드 수): `python -c "from pptx import Presentation; print(len(Presentation('courses/spring-boot-basic/pptx/ch01.pptx').slides._sldIdLst))"`
Expected: `26`.
Run(검증 - 이미지 소스): `python -c "from pptx import Presentation; p=Presentation('courses/spring-boot-basic/pptx/ch01.pptx'); import collections; c=collections.Counter(); [c.update([img.image.content_type]) for sl in p.slides for img in sl.shapes if sl.shapes and img.shape_type==13]; print('images embedded:', sum(c.values()))"`
Expected: 임베드 이미지 수 > 0 (오류 없이 실행). 추가로 `ls -la courses/spring-boot-basic/pptx/ch01.pptx`로 mtime 갱신 확인.

- [ ] **Step 6: book 재빌드**

`book-build` 스킬을 ch01에 대해 재실행한다(삽화가 manifest primary=이미지를 참조).
Run(검증): `ls -la courses/spring-boot-basic/book/ch01.pdf`
Expected: 파일 존재, mtime 갱신. 육안 확인 권장(05·08·10·15·20 삽화가 GPT 이미지).

- [ ] **Step 7: 커밋**

```bash
git add courses/spring-boot-basic/manuscripts/ch01.md courses/spring-boot-basic/storyboards/ch01.html courses/spring-boot-basic/ppt_previews/ch01.html courses/spring-boot-basic/panseo/ch01.html courses/spring-boot-basic/pptx/ch01.pptx courses/spring-boot-basic/book/ch01.pdf
git commit -m "content(ch01): 원고 병기 정리 + 소비물 5종 재빌드 — 05·08·10·15·20 GPT 이미지 임베드"
```

---

### Task 13: status.md 갱신 + ch01 재확정

**Files:**
- Modify: `courses/spring-boot-basic/status.md`

**Interfaces:**
- Consumes: Task 9~12 산출물
- Produces: ch01 재확정 상태(사용자 확인 후 ✅)

- [ ] **Step 1: 산출물 인덱스 갱신**

`status.md` 산출물 인덱스에서 ch01 시각자산 줄을 아래로 바꾼다:

```
- ch01 시각자산: assets/manifest.json (SSOT, 26/26 커버 — GPT 이미지 26 primary, D2 5는 opt-in 폴백 소스로 보존/미임베드)
```

"보류/누락" 섹션의 "D2 슬라이드(05/08/10/15/20)의 GPT 이미지: deferred" 항목을 삭제한다(이제 생성됨).

- [ ] **Step 2: 사용자 재확정 요청**

사용자에게 재빌드된 ch01 산출물(특히 05·08·10·15·20의 새 GPT 이미지가 반영된 storyboard/ppt-preview/pptx/book)을 육안 확인 요청한다. 확인 전까지 시각자산 칸은 `🔄`.

- [ ] **Step 3: 사용자 확정 시 ✅ 갱신**

사용자가 확정하면 ch01 `시각자산` 칸을 `✅`로 갱신하고, "다음 할 일" 줄을 다음 차시(ch02) 착수 또는 파일럿 종료로 갱신한다.

- [ ] **Step 4: 커밋**

```bash
git add courses/spring-boot-basic/status.md
git commit -m "content(ch01): D2→GPT 이미지 재빌드 완료 — ch01 재확정"
```

---

## Self-Review

**1. Spec coverage:**
- D2→이미지 기본 전환(빌더 primary 역전) → Task 3 ✅
- D2 opt-in 유지(`주 시각자료: D2` 마커 + pub-d2-diagram 존치) → Task 3(마커)·Task 8(엔진 존치) ✅
- 명시 defer(`이미지 보류`) — codex 조건 3 → Task 3 ✅
- 소비 primary-aware(annotate·pptx) — codex 조건 4·5 → Task 4·7·12 ✅
- 하네스 문서 동기화 → Task 5~8 ✅
- proposal + codex 사전검증(CLAUDE.md 유지 규칙) → Task 1~2 ✅(완료)
- ch01 5슬라이드 GPT 이미지 재생성 → Task 9~10 ✅
- 전 소비물 재빌드 → Task 12 ✅
- ch01 재확정 → Task 13 ✅

**2. Placeholder scan:** 코드 스텝(Task 3·4)은 완전한 테스트·구현 코드 포함. 프롬프트 재작성(Task 9)은 5개 전문 명시. 소비 재빌드(Task 12)는 스킬 호출 + 정확한 grep/python 검증 명시. "적절히 처리" 류 없음.

**3. Type consistency:** manifest 필드 `primary`/`status`/`path`/`prompt_hash`/`d2_hash`가 Task 3(정의)·Task 4(annotate 소비)·Task 7(계약)·Task 11(검증)에서 일치. 마커 문자열 `주 시각자료: D2`·`이미지 보류`가 Task 3(정규식)·Task 5·6(문서)에서 동일. 병기 라인 `→ 생성됨:`/`→ 렌더됨:`가 Task 4(annotate)·Task 12(검증)에서 일치. 경로 계약 전 Task 일치.

> **실행 순서 주의(재설계 특성)**: Task 3(빌더)은 이미지 미생성 D2 슬라이드를 `missing`으로 만든다 — 그래서 Phase B → Phase D 순서를 지켜야 한다. 빌더만 바꾸고 이미지를 안 만들면 ch01 manifest가 일시 `partial`이 된다(codex 조건 2가 명시). Task 10~11이 이를 해소한다. 또한 Task 12 Step 1(annotate)은 반드시 Task 11(manifest 재생성) 이후에 실행해야 primary 병기가 올바르다.
