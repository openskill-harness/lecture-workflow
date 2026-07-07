# 하네스 리뷰 결함 수정 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2026-07-07 하네스 리뷰가 찾아낸 Tier 1~4 결함(SSOT 계약 반쪽 강제·하드게이트 미강제·comic-panel 커버리지 누락·가짜 stale 감지·문서 지연·하우스키핑)을 코드/스킬/문서 수정으로 닫는다.

**Architecture:** 하네스는 `.claude/skills/`의 스킬 산문 + `scripts/`의 파이썬 도구 + `docs/`의 설계문서로 구성된다. 코드 결함은 TDD로, 스킬·문서 결함은 정확한 텍스트 치환 + grep 검증으로 고친다. 가장 큰 구조 결정은 이미 확정됨: **manifest.json이 SSOT이고, `annotate_manuscript_assets.py`가 manifest→원고 경로를 되써주는 "공식 SSOT 브릿지"다** — pptx-build를 manifest 직독으로 재작성하지 않고 이 브릿지 관계를 계약으로 명문화한다.

**Tech Stack:** Python 3.14 · python-pptx 1.0.2 · Pillow · pytest 9 · 헤드리스 Chromium(Playwright, render 스크립트) · D2 CLI(엔진) · Codex/GPT 이미지 CLI(엔진).

## Global Constraints

- Python 3.14, pytest로 실행: `python -m pytest tests/ scripts/test_build_pptx.py -q` (repo 루트에서). 현재 baseline = 24 passed.
- manifest.json 경로는 항상 POSIX 슬래시(`assets/images/ch01/slide05.png`)로 기록한다. Windows 경로 백슬래시를 manifest에 쓰지 않는다.
- manifest.json이 소비 스킬(5~11단계)의 SSOT다. 원고에 병기된 `→ 생성됨:`/`→ 렌더됨:` 라인은 `annotate_manuscript_assets.py`가 manifest primary에서 파생한 **공식 브릿지 표기**이며, pptx-build만 이 브릿지를 소스로 읽는다(다른 소비자는 manifest 직독).
- 하드 게이트: `시각자산` 칸이 `✅` 또는 명시적 `deferred`가 아니면(⬜/🔄/`partial`/`stale`) 5~11단계를 진행하지 않는다.
- HTML 산출 스킬(storyboard/ppt-preview/panseo)에 새 색상·다크 테마를 도입하지 않는다(골든 템플릿 라이트 테마 고정).
- 스킬·문서 텍스트는 기존 한국어 문체·마크다운 규약을 그대로 따른다.
- 스킬 프론트매터는 반드시 `---`로 펜스된 YAML이며 `name`/`description`을 가진다.

---

### Task 1: 공유 원고문법 모듈 + comic-panel 커버리지 버그 수정

리뷰 [HIGH/Tier1 #3]: `IMG_PROMPT_RE`가 `Comic panel prompt:` 라벨을 매칭하지 못해 만화 2컷 슬라이드가 manifest 커버리지·하드게이트를 통째로 우회한다(빠진 시각자산이 `present`로 읽힘). 동시에 [Tier4]: `SLIDE_RE`/`FIELD_RE`가 3개 스크립트에 복붙되어 이런 문법 드리프트가 재발한다. 공유 모듈로 추출하며 버그를 고친다.

**Files:**
- Create: `scripts/manuscript_grammar.py`
- Modify: `scripts/build_asset_manifest.py:30-37` (정규식 정의를 import로 교체)
- Modify: `scripts/annotate_manuscript_assets.py:28-29` (로컬 `slide_re`/`field_re`를 import로 교체)
- Modify: `scripts/build_pptx.py:37-39` (`SLIDE_RE`/`FIELD_RE`/`IMG_PATH_RE`를 import로 교체)
- Test: `tests/test_build_asset_manifest.py` (comic-panel 케이스 추가)

**Interfaces:**
- Produces: `scripts/manuscript_grammar.py` exporting module-level compiled patterns — `SLIDE_RE`, `FIELD_RE`, `IMG_PROMPT_RE`, `IMG_PATH_RE`, `D2_PRIMARY_RE`, `IMG_DEFER_RE`. 이후 Task 2도 `IMG_PROMPT_RE`를 이 모듈에서 참조한다.
- Consumes: 없음(리뷰 결과가 유일 입력).

- [ ] **Step 1: 실패 테스트 작성** — `tests/test_build_asset_manifest.py`에 fixture와 테스트를 추가한다.

```python
_COMIC = (
    "## Slide 5. HTTP\n\n"
    "**Visual asset**\n"
    "- Comic panel prompt: `Two-panel comic explaining an HTTP request, no text, 16:9`\n\n"
    "**Source**\n- x\n"
)


def test_comic_panel_prompt_is_counted_as_image(tmp_path):
    # `Comic panel prompt:` 라벨도 이미지 프롬프트로 인식되어야 한다.
    # 미생성 상태이므로 image 블록이 primary=True/status=missing 으로 잡혀
    # 커버리지(하드게이트)에 포함돼야 한다 — 안 잡히면 빠진 자산이 present로 샌다.
    course = _make_course(tmp_path, _COMIC, img=False, d2=False)
    manifest, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(manifest)
    assert "image" in s
    assert s["image"]["primary"] is True
    assert s["image"]["status"] == "missing"
    assert manifest["visual_slides_total"] == 1
    assert manifest["overall_status"] != "present"
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `python -m pytest tests/test_build_asset_manifest.py::test_comic_panel_prompt_is_counted_as_image -v`
Expected: FAIL — `assert "image" in s` (현재 regex가 comic panel을 못 잡아 `has_img=False`, image 블록 없음, `visual_slides_total==0`).

- [ ] **Step 3: 공유 문법 모듈 생성** — `scripts/manuscript_grammar.py`:

```python
"""원고(manuscript-schema 문법) 공유 정규식 — 세 빌더(manifest/annotate/pptx)가 함께 쓴다.

라벨/문법 변경은 반드시 이 파일 한 곳에서만 수정한다(3중 복붙 드리프트 방지).
"""
import re

# 슬라이드 구간 헤더: `## Slide N. 제목`
SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
# 필드 라벨: `**Screen**` 등
FIELD_RE = re.compile(
    r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*"
)
# 영문 이미지 프롬프트 라인(백틱 안 우선). `GPT image prompt:`/`시각자료 프롬프트(영문):`/
# 만화 2컷 `Comic panel prompt:`(manuscript-schema.md:85) 모두 인식한다.
IMG_PROMPT_RE = re.compile(
    r"(?:image prompt|comic panel prompt|시각자료 프롬프트\(영문\))\s*[:：]\s*`?(.+)",
    re.IGNORECASE,
)
# 이미지 자산 경로(렌더된 png/jpg만 — .d2 소스는 제외)
IMG_PATH_RE = re.compile(r"(assets[/\\][^\s)`\"']+\.(?:png|jpg|jpeg|webp))", re.IGNORECASE)
# D2 opt-in 마커: "주 시각자료: D2" / "Primary asset: D2"
D2_PRIMARY_RE = re.compile(r"(?:주\s*시각자료|primary\s*asset)\s*[:：]\s*d2", re.IGNORECASE)
# 이미지 보류(defer) 마커
IMG_DEFER_RE = re.compile(r"이미지\s*보류|image\s*deferred", re.IGNORECASE)
```

- [ ] **Step 4: build_asset_manifest.py를 모듈 사용으로 교체** — `scripts/build_asset_manifest.py`의 30~37행 블록을 삭제하고 import로 바꾼다.

기존(삭제):
```python
SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
# 영문 이미지 프롬프트 라인 (백틱 안 우선, 없으면 라벨 뒤 텍스트)
IMG_PROMPT_RE = re.compile(r"(?:image prompt|시각자료 프롬프트\(영문\))\s*[:：]\s*`?(.+)", re.IGNORECASE)
# D2 opt-in 마커: "주 시각자료: D2" / "Primary asset: D2" 있으면 D2를 주 시각자료로 강제
D2_PRIMARY_RE = re.compile(r"(?:주\s*시각자료|primary\s*asset)\s*[:：]\s*d2", re.IGNORECASE)
# 이미지 보류(defer) 마커: 이미지가 primary인데 아직 안 만들었어도 의도된 보류(deferred)로 표기
IMG_DEFER_RE = re.compile(r"이미지\s*보류|image\s*deferred", re.IGNORECASE)
```

신규(대체):
```python
from manuscript_grammar import SLIDE_RE, FIELD_RE, IMG_PROMPT_RE, D2_PRIMARY_RE, IMG_DEFER_RE
```

(주의: `import re`는 `_hash`에서 쓰지 않으므로 다른 사용처가 없으면 그대로 두어도 되고, 미사용이면 제거해도 된다. 테스트로 확인.)

- [ ] **Step 5: annotate_manuscript_assets.py를 모듈 사용으로 교체** — 28~29행의 로컬 정의를 삭제한다.

기존(`annotate` 함수 내부, 삭제):
```python
    slide_re = re.compile(r"^## Slide (\d+)\.")
    field_re = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
```

파일 상단 import 블록(15행 `from pathlib import Path` 다음)에 추가:
```python
from manuscript_grammar import SLIDE_RE, FIELD_RE
```

그리고 함수 본문에서 `slide_re`/`field_re` 사용처를 `SLIDE_RE`/`FIELD_RE`로 바꾼다(대소문자만 변경 — `slide_re.match` → `SLIDE_RE.match`, `field_re.match` → `FIELD_RE.match`). 참고: 기존 로컬 `slide_re`는 `r"^## Slide (\d+)\."`(그룹1만), 공유 `SLIDE_RE`는 `r"^## Slide (\d+)\.\s*(.+)$"`(그룹2 추가). annotate는 `.match(...).group(1)`만 쓰므로 그룹2 추가는 무해하다. 단, 제목이 없는 헤더(`## Slide 5.` 뒤 공백/제목 없음)에서는 공유 `SLIDE_RE`가 `(.+)` 때문에 매치 실패할 수 있으니, annotate에서는 슬라이드 번호만 필요하므로 이 치환이 안전한지 Step 7 전체 테스트로 확인한다(불안하면 annotate만 `SLIDE_RE`를 쓰지 말고 번호 전용 패턴을 모듈에 `SLIDE_NUM_RE = re.compile(r"^## Slide (\d+)\.")`로 추가해 사용).

- [ ] **Step 6: build_pptx.py를 모듈 사용으로 교체** — 37~39행 삭제.

기존(삭제):
```python
SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
IMG_PATH_RE = re.compile(r"(assets[/\\][^\s)`\"']+\.(?:png|jpg|jpeg|webp))", re.IGNORECASE)
```

신규(대체, 8행 `from pathlib import Path` 아래 또는 같은 위치):
```python
from manuscript_grammar import SLIDE_RE, FIELD_RE, IMG_PATH_RE
```

- [ ] **Step 7: 전체 테스트 실행** — 세 스크립트가 모두 `scripts/`를 `sys.path`에 넣고 co-located 임포트하므로 새 모듈이 같은 폴더에서 임포트된다.

Run: `python -m pytest tests/ scripts/test_build_pptx.py -v`
Expected: PASS — 신규 comic-panel 테스트 포함 25 passed(기존 24 + 1). annotate/pptx 회귀 없음.

- [ ] **Step 8: Commit**

```bash
git add scripts/manuscript_grammar.py scripts/build_asset_manifest.py scripts/annotate_manuscript_assets.py scripts/build_pptx.py tests/test_build_asset_manifest.py
git commit -m "fix(manifest): comic-panel prompt 커버리지 누락 수정 + 원고문법 정규식 공유 모듈화"
```

---

### Task 2: 해시 기반 stale 감지 실제 구현

리뷰 [HIGH/Tier1 #4]: manifest 독스트링과 visual-assets §7이 "prompt_hash/d2_hash 기반 stale 재생성"을 광고하지만 코드는 매번 현재 원고에서 해시를 새로 계산할 뿐 **이전 manifest와 비교하지 않는다**. 실제 비교를 구현해 원고가 바뀌었는데 옛 이미지가 남은 슬라이드를 `status: "stale"`로 표기하고, stale은 커버로 인정하지 않아(하드게이트가 재생성을 유도) 오버롤이 `partial`로 떨어지게 한다.

**Files:**
- Modify: `scripts/build_asset_manifest.py` (`build_manifest` — 이전 manifest 로드 + 해시 비교, docstring)
- Modify: `.claude/skills/visual-assets/SKILL.md` (§7 "수동 절차" 문구를 자동화 반영으로)
- Test: `tests/test_build_asset_manifest.py`

**Interfaces:**
- Consumes: Task 1의 `IMG_PROMPT_RE`(모듈), 기존 `_hash()`.
- Produces: manifest 슬라이드의 `image`/`d2` 블록 `status`에 새 값 `"stale"` 추가(기존 `present|deferred|missing`에 더해). `slide_covered`는 `stale`을 커버로 인정하지 않는다.

- [ ] **Step 1: 실패 테스트 작성** — `tests/test_build_asset_manifest.py`:

```python
def test_changed_prompt_marks_present_asset_stale(tmp_path):
    # 1) 프롬프트 A로 빌드(이미지 파일 존재) → present
    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
    m1, _ = bam.build_manifest(str(course), "ch01")
    assert _slide5(m1)["image"]["status"] == "present"
    # 2) 원고의 이미지 프롬프트만 다른 텍스트로 교체(파일은 그대로) → stale
    changed = _BOTH.replace("HTTP request flow", "COMPLETELY DIFFERENT SCENE")
    (course / "manuscripts" / "ch01.md").write_text(changed, encoding="utf-8")
    m2, _ = bam.build_manifest(str(course), "ch01")
    s = _slide5(m2)
    assert s["image"]["status"] == "stale"
    assert m2["overall_status"] != "present"  # stale은 커버 아님 → 재생성 유도
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `python -m pytest tests/test_build_asset_manifest.py::test_changed_prompt_marks_present_asset_stale -v`
Expected: FAIL — 현재는 파일이 존재하면 무조건 `present`, `status == "stale"`에서 AssertionError.

- [ ] **Step 3: 이전 manifest 로드 헬퍼 추가** — `build_manifest` 함수 진입부(`course = Path(course_dir)` 다음 줄)에 이전 해시 맵 로드를 추가한다.

`scripts/build_asset_manifest.py`의 `def build_manifest(course_dir, ch):` 본문 상단:
```python
def build_manifest(course_dir, ch):
    course = Path(course_dir)
    prior = _load_prior_hashes(course)   # {slide: {"image": hash, "d2": hash}}
    md = (course / "manuscripts" / f"{ch}.md").read_text(encoding="utf-8")
```

파일에 헬퍼 함수 추가(`_hash` 함수 아래):
```python
def _load_prior_hashes(course):
    """이전 manifest.json에서 슬라이드별 (image/d2) 해시를 읽어온다. 없으면 빈 dict."""
    p = course / "assets" / "manifest.json"
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
```

- [ ] **Step 4: 이미지/D2 status 판정에 stale 반영** — `build_manifest`의 status 계산부를 수정한다.

이미지 블록(현재 `if img_file_ok: img_status = "present"` 분기)을 다음으로 교체:
```python
        if has_img:
            cur_hash = _hash(info["prompt"])
            prior_hash = prior.get(num, {}).get("image")
            if img_file_ok and prior_hash is not None and prior_hash != cur_hash:
                img_status = "stale"          # 파일은 있으나 프롬프트가 바뀜 → 재생성 필요
            elif img_file_ok:
                img_status = "present"
            elif primary != "image":
                img_status = "deferred"
            elif info["img_defer"]:
                img_status = "deferred"
            else:
                img_status = "missing"
            entry["image"] = {
                "path": img_path,
                "prompt_hash": cur_hash,
                "status": img_status,
                "primary": primary == "image",
            }
```

D2 블록(현재 `"status": "present" if d2_file_ok else (...)`)을 다음으로 교체:
```python
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
                "path": f"assets/diagrams/{d2_matches[0].name}" if d2_matches else None,
                "d2_hash": cur_d2_hash,
                "status": d2_status,
                "primary": primary == "d2",
            }
```

(주의: `slide_covered`는 이미 `("present", "deferred")`만 커버로 인정하므로 `stale`은 자동으로 커버에서 제외된다 — 추가 수정 불필요. `overall`은 covered<total이면 `partial`이 된다.)

- [ ] **Step 5: docstring 갱신** — 파일 상단 docstring의 `prompt_hash/d2_hash = ... stale 감지에 사용.`(18행) 줄을 다음으로 교체:

```python
prompt_hash/d2_hash = 원고 해당 소스 텍스트 SHA1 앞 12자. 재빌드 시 이전 manifest.json의
해시와 비교해, 파일은 있으나 프롬프트가 바뀐 자산을 status="stale"로 표기한다(stale은 커버로
인정하지 않으므로 하드 게이트가 재생성을 유도한다).
```

- [ ] **Step 6: 테스트 실행**

Run: `python -m pytest tests/ scripts/test_build_pptx.py -v`
Expected: PASS — 신규 stale 테스트 포함 26 passed. 기존 `test_image_is_primary_by_default` 등은 이전 manifest가 없는 tmp_path 첫 빌드라 stale 미발동, 회귀 없음.

- [ ] **Step 7: visual-assets SKILL §7 문구 갱신** — `.claude/skills/visual-assets/SKILL.md` §7에서 "스크립트가 해시가 파일과 일치하는지 검증하지 않으니 스킬이 옛/새 해시를 눈으로 대조" 취지의 문장을 찾아, 실제 자동 비교가 구현됐음을 반영하도록 교체한다.

Read the file, locate the §7 sentence describing manual hash comparison(리뷰가 인용: 스크립트가 "does not verify the file matches the hash"), replace with:
```
`build_asset_manifest.py`는 재빌드 시 이전 manifest.json의 prompt_hash/d2_hash와 현재 원고 해시를
자동 비교해, 프롬프트가 바뀐 present 자산을 `status: "stale"`로 표기한다. stale 슬라이드는 커버로
인정되지 않아 overall_status가 `partial`로 떨어지고, 하드 게이트가 해당 슬라이드의 재생성을 요구한다.
스킬은 stale로 표기된 슬라이드만 골라 image-gen/pub-d2로 재생성하면 된다(전체 재생성 불필요).
```

- [ ] **Step 8: Commit**

```bash
git add scripts/build_asset_manifest.py tests/test_build_asset_manifest.py .claude/skills/visual-assets/SKILL.md
git commit -m "feat(manifest): 이전 manifest 대조로 stale 자산 자동 감지 구현"
```

---

### Task 3: 하드게이트 검증 스크립트 + repair 역케이스 규칙

리뷰 [HIGH/Tier1 #2]: 하드게이트가 산문에만 있어 파일럿에서 이미 깨졌다(시각자산 🔄인데 코드~책 전부 ✅). 그리고 course-pipeline repair 규칙은 "✅인데 파일 없음"만 다루고 이 역케이스("게이트 미완인데 하류가 다 ✅")를 다루지 않는다. status.md를 읽어 게이트 위반을 기계적으로 검출하는 스크립트를 만들고, repair 규칙에 역케이스를 추가한다.

**Files:**
- Create: `scripts/check_visual_gate.py`
- Create: `tests/test_check_visual_gate.py`
- Modify: `.claude/skills/course-pipeline/SKILL.md` (repair 규칙에 역케이스 추가, 검증 스크립트 참조)

**Interfaces:**
- Produces: `check_visual_gate.py` — 함수 `check_gate(status_md_text) -> list[dict]`. 각 위반 dict: `{"chapter": "ch01", "downstream": ["코드","스토리보드",...], "visual_status": "🔄"}`. 위반이 없으면 빈 리스트. CLI: `python scripts/check_visual_gate.py <status.md>` → 위반 있으면 stderr 출력 + exit 1, 없으면 exit 0.
- Consumes: 없음.

- [ ] **Step 1: 실패 테스트 작성** — `tests/test_check_visual_gate.py`:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import check_visual_gate as cvg

_HEADER = (
    "| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |\n"
    "|---|---|---|---|---|---|---|---|---|---|---|\n"
)


def test_gate_violation_detected():
    # 시각자산 🔄 인데 하류가 ✅ → 위반
    row = "| ch01 | ✅ | ✅ | 🔄 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |\n"
    violations = cvg.check_gate(_HEADER + row)
    assert len(violations) == 1
    assert violations[0]["chapter"] == "ch01"
    assert violations[0]["visual_status"] == "🔄"
    assert "코드" in violations[0]["downstream"]


def test_deferred_visual_is_allowed():
    # 시각자산 deferred 는 하류 진행 허용 → 위반 없음
    row = "| ch01 | ✅ | ✅ | deferred | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |\n"
    assert cvg.check_gate(_HEADER + row) == []


def test_no_downstream_no_violation():
    # 시각자산 🔄 이지만 하류가 아직 아무것도 ✅ 아님 → 위반 없음
    row = "| ch01 | ✅ | ✅ | 🔄 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |\n"
    assert cvg.check_gate(_HEADER + row) == []
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `python -m pytest tests/test_check_visual_gate.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'check_visual_gate'`.

- [ ] **Step 3: 검증 스크립트 구현** — `scripts/check_visual_gate.py`:

```python
"""status.md 하드게이트 검증 — 시각자산이 ✅/deferred가 아닌데 하류(코드~책)가 ✅면 위반.

사용: python scripts/check_visual_gate.py <status.md>
  위반 있으면 각 차시를 stderr에 출력하고 exit 1, 없으면 exit 0.
course-pipeline이 재개 전/후 이 스크립트로 게이트 정합을 확인할 수 있다.
"""
import sys
from pathlib import Path

# status.md 표의 열 순서(과정개요서는 표 밖 별도 줄이라 표 열에 없음)
COLS = ["차시", "원고초안", "원고확정", "시각자산", "코드", "스토리보드",
        "PPT프리뷰", "판서", "시뮬", "PPTX", "책"]
VISUAL_IDX = COLS.index("시각자산")          # 3
DOWNSTREAM = COLS[VISUAL_IDX + 1:]           # 코드~책
OK_VISUAL = {"✅", "deferred", "➖"}          # 게이트 통과로 보는 값


def _cells(line):
    parts = [c.strip() for c in line.strip().strip("|").split("|")]
    return parts


def check_gate(status_md_text):
    violations = []
    for line in status_md_text.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = _cells(line)
        if len(cells) != len(COLS):
            continue
        if not cells[0].lower().startswith("ch"):
            continue  # 헤더/구분선 스킵
        visual = cells[VISUAL_IDX]
        if visual in OK_VISUAL:
            continue
        done_downstream = [COLS[VISUAL_IDX + 1 + i]
                           for i, c in enumerate(cells[VISUAL_IDX + 1:]) if c == "✅"]
        if done_downstream:
            violations.append({
                "chapter": cells[0],
                "visual_status": visual,
                "downstream": done_downstream,
            })
    return violations


def main():
    if len(sys.argv) < 2:
        print("usage: python scripts/check_visual_gate.py <status.md>", file=sys.stderr)
        return 2
    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    violations = check_gate(text)
    if not violations:
        print("OK: 하드게이트 위반 없음")
        return 0
    for v in violations:
        print(f"위반: {v['chapter']} 시각자산={v['visual_status']} 인데 "
              f"하류 완료={', '.join(v['downstream'])}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: 테스트 실행**

Run: `python -m pytest tests/test_check_visual_gate.py -v`
Expected: PASS — 3 passed.

- [ ] **Step 5: course-pipeline repair 규칙에 역케이스 추가** — `.claude/skills/course-pipeline/SKILL.md`의 "## repair 규칙" 섹션 끝(98행 항목 4 다음)에 5번 항목을 추가한다.

98행 `4. 선행 단계 검사(§3)에서도 동일한 원칙을 적용한다 ...` 다음에 삽입:
```
5. **역케이스(게이트 미완인데 하류가 ✅)**: `시각자산`이 ✅/`deferred`가 아닌데(⬜/🔄/`partial`/`stale`)
   그 차시의 코드~책 중 하나라도 ✅면 하드게이트가 이미 깨진 상태다. `python scripts/check_visual_gate.py
   courses/{course-id}/status.md`로 기계적으로 검출할 수 있다. 발견 시 조용히 되돌리지 말고 사용자에게
   보고한다 — (a) `assets/manifest.json`의 `overall_status`가 `present`면 시각자산 생성은 끝났고 사람 검토만
   남은 것이므로 사용자에게 시각자산을 ✅로 확정할지 확인하고, (b) manifest가 `partial`/`stale`/`missing`이면
   먼저 `visual-assets`로 나머지를 마무리한 뒤 하류 산출물의 재생성 필요 여부를 사용자와 정한다.
```

- [ ] **Step 6: course-pipeline 참고 섹션에 스크립트 추가** — 같은 파일 "## 참고" 섹션의 `- status.md 형식: ...` 다음 줄에 추가:
```
- 하드게이트 검증: `scripts/check_visual_gate.py` (status.md 게이트 위반 기계 검출)
```

- [ ] **Step 7: 전체 테스트 재확인**

Run: `python -m pytest tests/ scripts/test_build_pptx.py -q`
Expected: PASS — 이전 태스크들 + 신규 3개 포함 29 passed.

- [ ] **Step 8: Commit**

```bash
git add scripts/check_visual_gate.py tests/test_check_visual_gate.py .claude/skills/course-pipeline/SKILL.md
git commit -m "feat(gate): 하드게이트 검증 스크립트 + repair 역케이스 규칙"
```

---

### Task 4: visual-assets에 [PLOT SCRIPT]/plot_gen 라우팅 추가

리뷰 [MED/Tier1 #5]: image-gen은 `[IMAGE PROMPT]`→`image_gen.py`와 `[PLOT SCRIPT]`→`plot_gen.py`(정확 좌표 matplotlib 플롯, 생성이미지가 곡선·점배치를 망치는 슬라이드용) 두 분기를 문서화하는데, visual-assets는 `[IMAGE PROMPT]`와 D2만 방출한다. 정확 좌표 플롯이 필요한 슬라이드에 렌더 경로가 없다. `plot_gen.py`는 실재함(`.claude/skills/image-gen/scripts/plot_gen.py`).

**Files:**
- Modify: `.claude/skills/visual-assets/SKILL.md` (플롯 라우팅 절 추가)

**Interfaces:**
- Consumes: image-gen의 `[PLOT SCRIPT]`→`plot_gen.py` 규약(이미 문서화됨).
- Produces: visual-assets가 원고 Visual asset에 `주 시각자료: PLOT`(또는 `Plot script:`) 마커가 있는 슬라이드를 plot_gen 경로로 라우팅한다는 계약.

- [ ] **Step 1: visual-assets에 플롯 분기 절 추가** — `.claude/skills/visual-assets/SKILL.md`의 §3(D2 처리) 다음에 새 절을 추가한다. Read the file to find the §3 D2 section end, then insert:

```
### 3-b. 정확 좌표 플롯 (opt-in — [PLOT SCRIPT])

원고 Visual asset에 `주 시각자료: PLOT` 마커 또는 `Plot script:` 라인이 있는 슬라이드는 생성 이미지가
아니라 image-gen의 `plot_gen.py`로 렌더한다 — 곡선 연속성·점 좌표가 정확해야 하는 그래프(정사영·함수·
좌표평면 등)에서 생성 이미지는 좌표를 어긋나게 만들기 때문이다(image-gen이 이 목적을 위해 추가한 분기).
- 방출: `<!-- [PLOT SCRIPT: chNN-slideNN] --><matplotlib 파이썬 스니펫><!-- path: assets/images/chNN/slideNN.png -->`
- image-gen이 `[PLOT SCRIPT]` 태그를 스캔해 `plot_gen.py`로 실행, 결과 PNG를 같은 `assets/images/chNN/slideNN.png`
  경로에 쓴다 — manifest는 이미지 블록으로 동일하게 취급한다(별도 스키마 불필요).
- primary 판정: 이미지 블록으로 잡히므로 기본 primary. D2 마커와 동시 사용하지 않는다.
```

- [ ] **Step 2: grep 검증**

Run: `grep -n "PLOT SCRIPT\|plot_gen" .claude/skills/visual-assets/SKILL.md`
Expected: 최소 2개 매치(방출 태그 + 설명), 절이 실제 삽입됐음을 확인.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/visual-assets/SKILL.md
git commit -m "docs(visual-assets): 정확 좌표 플롯([PLOT SCRIPT]/plot_gen) 라우팅 절 추가"
```

---

### Task 5: annotate-as-SSOT-브릿지 계약 명문화

리뷰 [MED/Tier1 #1, 확정 결정]: pptx-build가 manifest 대신 원고 주석 경로를 읽어 SSOT 계약이 반쪽만 강제된다. pptx-build/SKILL.md는 한 파일 안에서 자기모순(line 10 "manifest 조회 없음" vs line 12 "manifest가 SSOT"). **결정: pptx-build를 재작성하지 않고, annotate를 "공식 SSOT 브릿지"로 명문화**한다 — annotate가 manifest primary를 원고에 되써주고 pptx-build만 그 브릿지를 읽는다는 관계를 세 곳(pptx-build SKILL, spec §3.0-A, CLAUDE.md)에 일관되게 못박는다.

**Files:**
- Modify: `.claude/skills/pptx-build/SKILL.md:10-12`
- Modify: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` (§3.0-A SSOT 서술)
- Modify: `CLAUDE.md:27` (시각자산 하드게이트 문단)
- Modify: `.claude/skills/edu-sim-builder/SKILL.md` (manifest 미언급 보완 — 구조만 참조함을 명시)

**Interfaces:**
- Consumes: 없음(계약 문서화).
- Produces: "annotate = 공식 SSOT 브릿지, pptx-build만 브릿지 소스로 읽음, 나머지 소비자는 manifest 직독" 이라는 단일 계약 문장(세 문서 동일 취지).

- [ ] **Step 1: pptx-build SKILL 10~12행 재작성** — 자기모순 제거. 기존 10~12행을 다음으로 교체:

`.claude/skills/pptx-build/SKILL.md` 기존(10~12행):
```
**시각자산(4단계)과의 관계(2026-07-06 개정)**: `scripts/build_pptx.py`의 파싱 로직은 바뀌지 않는다 — 원고의 `assets/...png|jpg|jpeg|webp` 경로 패턴(`IMG_PATH_RE`)을 그대로 잡는다. `visual-assets` 단계 완료 후 원고 Visual asset 필드에 병기된 자산 경로(`→ 생성됨:`/`→ 렌더됨:` 다음 줄의 `assets/...` 경로)가 그대로 이 정규식에 매치되므로, 이 스킬은 원고에 이미 병기된 경로를 그대로 사용하기만 하면 된다(별도 manifest 조회 로직 추가 없음).

**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며 `d2.primary=true` 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다(원고 병기는 annotate가 primary 한 줄만 남긴다). (pptx-build는 원고를 파싱해 첫 자산 경로를 임베드한다 — annotate가 primary만 병기하므로 그 경로가 곧 primary다. D2 primary 슬라이드는 원고에 `주 시각자료: D2` 마커가 있어야 annotate가 D2 경로를 병기한다.)
```

신규(대체):
```
**시각자산 SSOT와의 관계 — annotate 브릿지 계약**: `assets/manifest.json`이 시각자산 SSOT이고, `pptx-build`는
그 SSOT를 **직접 읽지 않는다** — 대신 `visual-assets` 단계의 `annotate_manuscript_assets.py`가 manifest의
primary 자산 경로를 원고 Visual asset 필드에 되써준 **공식 브릿지 표기**(`→ 생성됨:`/`→ 렌더됨:` 다음 줄의
`assets/...` 경로)를 읽는다. `scripts/build_pptx.py`의 `IMG_PATH_RE`가 이 브릿지 라인을 매치한다.
- 이것이 계약상 허용되는 유일한 "원고 경로 읽기"다: annotate가 strip-and-replace로 항상 primary 한 줄만
  남기므로, 브릿지 라인 = manifest primary가 보장된다. **따라서 pptx-build 실행 전 반드시 annotate가 최신
  manifest 기준으로 돌아 있어야 한다**(visual-assets 완료 시 자동 수행). manifest만 바꾸고 annotate를 안 돌리면
  pptx와 다른 소비자가 갈라지므로, 하드게이트(시각자산 ✅) 안에 annotate 실행이 포함됨을 전제한다.
- 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`), `주 시각자료: D2` 마커가 있는 슬라이드만 D2 PNG.
```

- [ ] **Step 2: spec §3.0-A에 브릿지 계약 명문화** — Read `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`, locate §3.0-A의 "소비 스킬은 manifest 확정 경로를 읽는다" 취지 문단, 그 문단 끝에 예외를 명시하는 문장을 추가:

```
단, `pptx-build`는 예외적으로 manifest를 직독하지 않고 `annotate_manuscript_assets.py`가 원고에 되써준
primary 경로(공식 브릿지 표기)를 읽는다. annotate는 manifest primary에서만 파생되고 strip-and-replace로
primary 한 줄만 유지하므로 브릿지 라인 = manifest primary가 불변식으로 보장된다. 이 브릿지가 SSOT 계약을
깨지 않는 유일 조건은 "pptx-build 실행 전 annotate가 최신 manifest로 돌아 있을 것"이며, 이는 시각자산 ✅
하드게이트 안에 포함된다.
```

- [ ] **Step 3: CLAUDE.md 하드게이트 문단 보강** — `CLAUDE.md`의 기존 문장:
```
**시각자산 하드 게이트**: `visual-assets`(4단계)가 ✅ 또는 명시적 `deferred`일 때만 5~11단계(코드~책)를 진행한다. 5~11단계 소비 스킬은 원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 자산을 임베드한다(상세: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3.0-A).
```
을 다음으로 교체(마지막 문장 앞에 pptx-build 예외 한 줄 삽입):
```
**시각자산 하드 게이트**: `visual-assets`(4단계)가 ✅ 또는 명시적 `deferred`일 때만 5~11단계(코드~책)를 진행한다. 5~11단계 소비 스킬은 원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 자산을 임베드한다. 단 `pptx-build`만은 예외로, `annotate_manuscript_assets.py`가 manifest primary를 원고에 되써준 **공식 브릿지 표기**를 읽는다(브릿지 = manifest primary 불변식; 상세: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3.0-A).
```

- [ ] **Step 4: edu-sim-builder manifest 참조 명시** — Read `.claude/skills/edu-sim-builder/SKILL.md`, locate the "Visual asset(있으면) → 참고 도식/이미지 구도로 삼는다" 취지 라인, 그 뒤에 명시 문장 추가:

```
이때 읽는 것은 원고 Visual asset의 **구도/구조 설명**일 뿐 렌더된 자산 경로가 아니다(시뮬레이터는 자산
파일을 임베드하지 않고 SVG/JS로 재구성하므로 manifest 경로 직독이 불필요하다). 자산의 실존 여부·확정
경로가 필요한 다른 소비 스킬과 달리 edu-sim-builder는 manifest를 조회하지 않는다 — 의도된 예외다.
```

- [ ] **Step 5: grep 검증**

Run: `grep -rn "브릿지" .claude/skills/pptx-build/SKILL.md CLAUDE.md docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`
Expected: 세 파일 모두 "브릿지" 매치 — 계약이 세 곳에 일관 삽입됐음.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/pptx-build/SKILL.md .claude/skills/edu-sim-builder/SKILL.md CLAUDE.md docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md
git commit -m "docs(ssot): annotate를 공식 SSOT 브릿지로 명문화 — pptx-build 예외 계약 일관화"
```

---

### Task 6: status.md 라이프사이클(🔄 시작 / ➖ 보류) 소비 스킬 통일

리뷰 [MED/Tier2 #6]: CLAUDE.md:75의 "시작 시 🔄" 의무를 소비 스킬 중 storyboard·ppt-preview·panseo-slide만 지키고, practice-code·pptx-build·book-build·edu-sim-builder·manuscript-draft는 끝에서 ✅만 찍는다. "➖ + 보류사유" 경로는 edu-sim-builder만 문서화. 재개 안전성 보장이 약해진다.

**Files:**
- Modify: `.claude/skills/practice-code/SKILL.md`
- Modify: `.claude/skills/pptx-build/SKILL.md`
- Modify: `.claude/skills/book-build/SKILL.md`
- Modify: `.claude/skills/manuscript-draft/SKILL.md`

**Interfaces:**
- Consumes: 없음.
- Produces: 각 스킬이 작업 시작 시 해당 status.md 열을 🔄로, 보류 시 ➖ + 사유로 갱신한다는 절차 문장(storyboard SKILL의 기존 표현을 표준으로 삼음).

- [ ] **Step 1: 표준 문구 확인** — 기준 표현을 storyboard에서 확인한다.

Run: `grep -n "🔄\|➖" .claude/skills/storyboard/SKILL.md`
Expected: 작업 시작 시 🔄, 확인 후 ✅ 취지 라인. 이 표현을 다른 스킬에 이식한다.

- [ ] **Step 2: practice-code에 라이프사이클 문장 추가** — Read `.claude/skills/practice-code/SKILL.md`, locate the 절차 시작부(작업 착수 지점), 그 앞에 삽입:

```
**status.md 착수 갱신**: 작업을 시작하면 해당 차시 `코드` 칸을 🔄로 바꾼다(재개 시 이 지점부터 이어가기
위함). 검증 통과 + 사용자 확인 후 ✅로, 사용자가 보류를 택하면 ➖ + 보류/누락 섹션에 사유를 기록한다.
```

- [ ] **Step 3: pptx-build에 라이프사이클 문장 추가** — Read `.claude/skills/pptx-build/SKILL.md`, "## 전제" 섹션 다음(빌드 착수 전)에 삽입:

```
**status.md 착수 갱신**: 빌드를 시작하면 해당 차시 `PPTX` 칸을 🔄로 바꾼다. 산출·사용자 확인 후 ✅로,
보류 시 ➖ + 보류/누락 사유로 갱신한다.
```

- [ ] **Step 4: book-build에 라이프사이클 문장 추가** — Read `.claude/skills/book-build/SKILL.md`, "## 전제" 또는 착수 지점에 삽입:

```
**status.md 착수 갱신**: 집필을 시작하면 해당 차시 `책` 칸을 🔄로 바꾼다. PDF 산출·사용자 확인 후 ✅로,
보류 시 ➖ + 보류/누락 사유로 갱신한다.
```

- [ ] **Step 5: manuscript-draft에 라이프사이클 문장 추가** — Read `.claude/skills/manuscript-draft/SKILL.md`, 착수 지점에 삽입:

```
**status.md 착수 갱신**: 초안 작성을 시작하면 해당 차시 `원고초안` 칸을 🔄로 바꾼다. 생성·사용자 확인 후
✅로 갱신한다.
```

- [ ] **Step 6: grep 검증**

Run: `grep -Ln "🔄" .claude/skills/practice-code/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/book-build/SKILL.md .claude/skills/manuscript-draft/SKILL.md .claude/skills/edu-sim-builder/SKILL.md`
Expected: 빈 출력(모든 파일이 🔄를 포함 = `-L`가 아무 것도 안 뽑음). edu-sim-builder는 이미 ➖를 가지나 🔄 시작 문구가 없으면 함께 추가한다.

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/practice-code/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/book-build/SKILL.md .claude/skills/manuscript-draft/SKILL.md
git commit -m "docs(skills): 소비 스킬에 status.md 🔄-착수/➖-보류 라이프사이클 통일"
```

---

### Task 7: panseo-slide manifest 자기모순 제거 + 하드게이트 추가

리뷰 [MED/Tier2 #7]: panseo-slide는 line 14 "manifest.json을 직접 읽지 않는다"(맞음) 바로 뒤 line 18에 다른 소비자에서 복붙된 "manifest에서 primary 자산 임베드" 보일러플레이트가 붙어 상호배타. 또한 5~11단계 중 유일하게 자체 시작게이트가 시각자산 열을 확인하지 않는다.

**Files:**
- Modify: `.claude/skills/panseo-slide/SKILL.md`

**Interfaces:**
- Consumes: 없음.
- Produces: panseo-slide가 manifest를 직독하지 않음을 일관되게 서술하고, 시작 전 시각자산 하드게이트를 확인한다는 절차.

- [ ] **Step 1: 모순 보일러플레이트 제거** — Read `.claude/skills/panseo-slide/SKILL.md`, locate line ~18 "**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산 ... `path`를 임베드한다." 로 시작하는 복붙 문단을 삭제하고, 대신 왜 manifest를 안 읽는지 한 줄로 대체:

```
(이 스킬은 manifest를 직독하지 않는다: 그대로 모드는 ppt-preview HTML을 그대로 이어받아 이미 임베드된
자산을 쓰고, 요약 모드는 판서용으로 자산을 넣지 않기 때문이다. 자산 SSOT 계약은 상류 ppt-preview가 이미
충족했다.)
```

- [ ] **Step 2: 하드게이트 확인 추가** — 시작게이트 절(원고확정/PPT프리뷰 확인하는 부분, 리뷰 기준 36~43행)에 시각자산 확인을 추가:

Read the file, locate the 시작 전제/게이트 확인 절, 그 안에 삽입:
```
- **하드게이트**: 두 모드 공통으로 해당 차시 `시각자산`이 ✅ 또는 `deferred`가 아니면(⬜/🔄/`partial`/`stale`)
  사용자에게 알리고 중단한다 — 먼저 `visual-assets`를 완료(또는 명시 보류)해야 한다.
```

- [ ] **Step 3: grep 검증**

Run: `grep -n "manifest\|하드게이트\|시각자산" .claude/skills/panseo-slide/SKILL.md`
Expected: "primary: true인 자산...임베드" 복붙 문단은 사라지고, 하드게이트/시각자산 확인 라인이 존재.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/panseo-slide/SKILL.md
git commit -m "fix(panseo-slide): manifest 자기모순 제거 + 시각자산 하드게이트 추가"
```

---

### Task 8: ppt-preview↔pptx-build DOM 계약 문구 수정

리뷰 [MED/Tier2 #8]: ppt-preview가 "pptx-build는 이 HTML을 소비하지 않는다 … 이 계약에 의존하지 않는다"고 단언하지만, pptx-build의 **기본** 이미지 모드는 `render_preview_slides.py`가 `.ppt-slide .ppt-canvas` 셀렉터로 그 HTML을 렌더하므로 기본 경로는 오히려 DOM 계약에 의존한다. "의존 안 함"은 네이티브(대안) 모드에서만 참.

**Files:**
- Modify: `.claude/skills/ppt-preview/SKILL.md` (리뷰 기준 13행·29행의 "소비하지 않는다" 서술)

**Interfaces:**
- Consumes: 없음.
- Produces: DOM 계약(`.ppt-slide`/`.ppt-canvas`)이 pptx-build **이미지 모드**의 입력임을 정확히 서술.

- [ ] **Step 1: 문구 수정** — Read `.claude/skills/ppt-preview/SKILL.md`, locate the 문장 "10단계 `pptx-build`는 이 파일을 소비하지 않는다 … 이 계약에 의존하지 않는다"(리뷰 인용), 다음으로 교체:

```
10단계 `pptx-build`의 **기본 이미지 모드**는 이 HTML을 `render_preview_slides.py`로 렌더하며
`.ppt-slide .ppt-canvas` DOM 계약에 의존한다 — 따라서 이 구조(`<section class="ppt-slide" data-slide="N">`
+ 내부 `.ppt-canvas` + `h2`)는 panseo-slide 그대로 모드와 pptx-build 이미지 모드 **양쪽의 소비 계약**이다.
(pptx-build의 대안 네이티브 모드만 이 HTML 대신 원고를 직접 파싱하므로 그 모드에서만 이 계약과 무관하다.)
```

- [ ] **Step 2: grep 검증**

Run: `grep -n "ppt-canvas\|이미지 모드\|네이티브 모드" .claude/skills/ppt-preview/SKILL.md`
Expected: 이미지 모드가 DOM 계약에 의존한다는 서술이 존재, "소비하지 않는다" 단언은 제거됨.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/ppt-preview/SKILL.md
git commit -m "fix(ppt-preview): pptx-build 이미지 모드가 DOM 계약 소비자임을 정정"
```

---

### Task 9: 문서 지연 일괄 갱신 (Tier 3)

리뷰 [Tier3]: 완주 이후 문서가 대거 뒤처짐 — CLAUDE.md(humanizer "예정", ch01 "원고확정부터 재개", "구축 진행 중"), spec §9(pptx 네이티브만 기술, 이미지 모드 기본 반영 안 됨), visual-assets §68(소비자 계약 전환을 "미래 작업"으로 서술). plan 체크박스는 Task 10에서 별도 처리.

**Files:**
- Modify: `CLAUDE.md` (33행 humanizer, 88~90행 강의 현황, 94행 구축 상태)
- Modify: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` (§9)
- Modify: `.claude/skills/visual-assets/SKILL.md` (68행 소비자 계약 전환 서술)

**Interfaces:**
- Consumes: 없음.
- Produces: 현행 구현과 일치하는 문서.

- [ ] **Step 1: CLAUDE.md humanizer 문구** — 기존:
```
- `humanizer` — 책 문체 교정 (Task 13에서 이식 예정, book-build가 사용)
```
교체:
```
- `humanizer` — 책 문체 교정 (이식 완료, book-build가 §3에서 호출해 사용)
```

- [ ] **Step 2: CLAUDE.md 강의 현황 문구** — 기존:
```
`spring-boot-basic` — 파일럿 진행 중. ch01은 GPT가 만든 원고/스토리보드/PPT 프리뷰(골든 템플릿의 원본)를 이어받아 원고확정(`manuscript-final`) 단계부터 재개한다. 상태: `courses/spring-boot-basic/status.md`.
```
교체:
```
`spring-boot-basic` — 파일럿. ch01은 11단계를 전 구간 통과해(원고~책·시뮬·PPTX 산출 완료) 시각자산 D2→GPT 재빌드 후 사용자 시각 검토만 남은 사실상 완주 상태다. 상태·다음 할 일: `courses/spring-boot-basic/status.md`.
```

- [ ] **Step 3: CLAUDE.md 구축 상태 문구** — 기존:
```
구축 상태: 스킬 구현 진행 중 (구현 계획 참조)
```
교체:
```
구축 상태: 16개 스킬·파이썬 도구체인 구현 완료, ch01 파일럿 전 구간 드라이런 통과. 잔여 항목은 `docs/superpowers/plans/2026-07-07-harness-review-fixes.md` 참조.
```

- [ ] **Step 4: spec §9 갱신** — Read `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §9, locate the 문장 "`pptx-build` 코드 자체는 바뀌지 않는다 — 원고에 병기된 `assets/...png` 경로를 정규식으로 잡는 방식 그대로다", 다음으로 교체:

```
`pptx-build`의 기본은 **이미지 모드**로 바뀌었다(제안 `2026-07-06_pptx-image-mode.md` 반영): 승인된
`ppt_previews/chNN.html`을 `render_preview_slides.py`로 렌더한 PNG를 각 장 전체 배경으로 넣는다. 원고를
python-pptx로 직접 파싱하는 방식은 대안 **네이티브 모드**(`--from-images` 미지정)로 남아 있으며, 그 모드는
annotate 브릿지 경로(§3.0-A)를 정규식으로 잡는다.
```

- [ ] **Step 5: visual-assets §68 갱신** — Read `.claude/skills/visual-assets/SKILL.md` line ~68, locate the 문장 "소비 스킬 … 계약 전환은 이 스킬의 책임 범위 밖 … 별도 반영 … 전환 전까지는 두 표기가 병존한다", 다음으로 교체:

```
소비 스킬의 "manifest 확정 경로 직독" 계약 전환은 이미 완료됐다(각 소비 SKILL.md에 반영). `pptx-build`만은
annotate 브릿지 경로를 읽는 예외로 계약화됐다(스펙 §3.0-A). 따라서 visual-assets는 생성 후 반드시
`annotate_manuscript_assets.py`를 돌려 원고에 primary 경로를 최신화한다 — 이 브릿지가 pptx-build의 유일한
자산 소스이기 때문이다.
```

- [ ] **Step 6: grep 검증**

Run: `grep -n "이식 완료\|사실상 완주\|이미지 모드\|계약 전환은 이미 완료" CLAUDE.md .claude/skills/visual-assets/SKILL.md docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`
Expected: 각 갱신 문구 매치, 기존 "예정"/"재개한다"/"바뀌지 않는다"/"범위 밖" 문구 소멸.

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md .claude/skills/visual-assets/SKILL.md
git commit -m "docs: 완주 이후 문서 지연 일괄 갱신(humanizer/현황/구축상태/spec §9/visual-assets §68)"
```

---

### Task 10: 하우스키핑 (Tier 4)

리뷰 [Tier4]: orphan 디렉터리, 트래킹된 `.pyc`, `.gitignore` 공백, 잔여 스파이크, 문서 미반영 산출 디렉터리, 파손된 엔진 프론트매터, 원고 dangling D2 경로.

**Files:**
- Delete: `courses/spring-mvc-2026/` (빈 orphan)
- Delete: `scripts/pptx_spike.py`
- Modify: `.gitignore`
- Modify: `.claude/skills/image-gen/SKILL.md` (프론트매터 description 인용부호)
- Modify: `.claude/skills/pub-d2-diagram/SKILL.md` (프론트매터 `---` 펜스 추가)
- Modify: `CLAUDE.md` (디렉터리 표에 `assets/ppt_render/chNN/` 추가)
- git rm --cached: 트래킹된 `.pyc`

**Interfaces:**
- Consumes: 없음.
- Produces: 깨끗한 트리 + 자동선택 가능한 엔진 프론트매터.

- [ ] **Step 1: orphan·스파이크 삭제**

```bash
cd C:/Users/ssarm/Documents/course-haness
rm -rf courses/spring-mvc-2026
rm -f scripts/pptx_spike.py
```

- [ ] **Step 2: 트래킹된 .pyc 언트래킹**

```bash
git rm --cached .claude/skills/image-gen/scripts/__pycache__/image_gen.cpython-314.pyc .claude/skills/image-gen/scripts/__pycache__/test_image_gen.cpython-314-pytest-9.0.3.pyc
```
(경로가 다르면 `git ls-files | grep pyc`로 실제 트래킹된 파일을 찾아 rm --cached 한다.)

- [ ] **Step 3: .gitignore에 .pytest_cache 추가** — `.gitignore` 끝에 추가:
```
.pytest_cache/
```

- [ ] **Step 4: image-gen 프론트매터 수정** — `.claude/skills/image-gen/SKILL.md` 기존:
```
description: [IMAGE PROMPT] (레거시 [GEMINI PROMPT]도 인식) 플레이스홀더를 Codex(GPT) CLI 이미지로 자동 생성·교체. 코드·개념 트랙 공용. 챕터 완성 후 `이미지 생성` 시 로드.
```
교체(값 전체를 큰따옴표로 감싸 YAML flow-sequence 오파싱 방지):
```
description: "[IMAGE PROMPT] 플레이스홀더를 Codex(GPT) CLI 이미지로 자동 생성·교체하고, [PLOT SCRIPT]는 plot_gen.py(matplotlib 정확 좌표 플롯)로 렌더한다. visual-assets가 주 호출자. '이미지 생성' 시 로드."
```

- [ ] **Step 5: pub-d2-diagram 프론트매터 펜스 추가** — `.claude/skills/pub-d2-diagram/SKILL.md` 상단 1~5행:
```
# D2 다이어그램 빌드 스킬

model: claude-sonnet-4-6
user_invocable: true
trigger: ["D2 빌드", "다이어그램 생성", "/d2"]
```
을 정규 YAML 프론트매터로 교체:
```
---
name: pub-d2-diagram
description: D2 소스를 모노톤 도형 PNG/SVG로 렌더하는 opt-in 폴백 엔진. visual-assets가 원고 `주 시각자료: D2` 마커 슬라이드에서만 스크립트로 호출한다. 기본 시각자산은 GPT 이미지이므로 자동선택 대상이 아니다.
model: claude-sonnet-4-6
---

# D2 다이어그램 빌드 스킬
```

- [ ] **Step 6: CLAUDE.md 디렉터리 표에 ppt_render 추가** — `assets/` 하위 트리에서 `diagrams/` 항목 다음 줄에 추가:
```
│   ├── ppt_render/chNN/         # pptx-build 이미지 모드: preview HTML→PNG 렌더(render_preview_slides.py)
```

- [ ] **Step 7: 원고 dangling D2 경로 정리(선택, 사용자 확인 후)** — `courses/spring-boot-basic/manuscripts/ch01.md`에 존재하지 않는 `ch01_*.d2`/`*.svg` 경로 11개가 남아 있다. 소비자는 manifest를 읽어 무해하나 원고 자체가 dangling이다. 이는 파일럿 콘텐츠 수정이므로 사용자에게 확인한 뒤에만 정리한다.

Run(현황 파악): `grep -n "assets/diagrams/ch01_" courses/spring-boot-basic/manuscripts/ch01.md`
사용자 확인 후, 존재하는 렌더 경로(`assets/diagrams/ch01-slideNN-*.png`)로 교체하거나 해당 표기를 제거한다. **사용자 승인 없이 원고를 수정하지 않는다**(practice-code 원칙과 동일).

- [ ] **Step 8: 전체 테스트 + git status 확인**

Run: `python -m pytest tests/ scripts/test_build_pptx.py -q && git status --short`
Expected: 테스트 그린(29 passed), git status에 삭제·수정만 표시되고 `.pytest_cache`/`.pyc`가 새로 스테이징되지 않음.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: orphan/스파이크 삭제, .pyc 언트래킹, .gitignore, 엔진 프론트매터 수정, 디렉터리 표 갱신"
```

---

### Task 11: 파일럿 status.md 게이트 상태 정합 (라이브 데이터 수정)

리뷰 [HIGH/Tier1 #2, 라이브]: 파일럿 `status.md:7`이 시각자산 🔄인데 코드~책 전부 ✅ — 하드게이트 위반 상태가 박제돼 있다. manifest는 `overall_status: present`(26/26)라 생성은 끝났고 사람 검토만 남았다. Task 3의 검증 스크립트로 검출하고, repair 역케이스 규칙(a)에 따라 사용자 확인 후 시각자산을 ✅로 확정한다.

**Files:**
- Modify: `courses/spring-boot-basic/status.md` (사용자 확인 후)

**Interfaces:**
- Consumes: Task 3의 `scripts/check_visual_gate.py`, manifest `overall_status`.
- Produces: 게이트 정합이 맞는 status.md(위반 0).

- [ ] **Step 1: 위반 검출** — Task 3 스크립트로 확인.

Run: `python scripts/check_visual_gate.py courses/spring-boot-basic/status.md`
Expected: exit 1 — "위반: ch01 시각자산=🔄 인데 하류 완료=코드, 스토리보드, ...".

- [ ] **Step 2: manifest 상태 확인** — 생성이 실제로 끝났는지 SSOT로 검증.

Run: `python -c "import json; m=json.load(open('courses/spring-boot-basic/assets/manifest.json',encoding='utf-8')); print(m['overall_status'], m['visual_slides_covered'], m['visual_slides_total'])"`
Expected: `present 26 26` — 시각자산 생성 완료, 사람 검토만 남음.

- [ ] **Step 3: 사용자 확인** — repair 규칙 (a)에 따라, "manifest가 present(26/26)이니 시각자산을 ✅로 확정할까요? (또는 아직 시각 검토 중이면 하류 산출물을 🔄로 되돌릴까요?)"를 사용자에게 묻는다. **임의로 바꾸지 않는다.**

- [ ] **Step 4: status.md 갱신(사용자가 ✅ 확정 시)** — `courses/spring-boot-basic/status.md`의 ch01 행에서 시각자산 칸 🔄→✅, 산출물 인덱스에 확정일 기록, 12/14행의 "사용자 검토 대기" 문구 정리, "다음 할 일"을 현행에 맞게 갱신.

- [ ] **Step 5: 정합 재확인**

Run: `python scripts/check_visual_gate.py courses/spring-boot-basic/status.md`
Expected: exit 0 — "OK: 하드게이트 위반 없음".

- [ ] **Step 6: Commit**

```bash
git add courses/spring-boot-basic/status.md
git commit -m "fix(pilot): ch01 시각자산 게이트 정합 — 사용자 확정 반영"
```

---

## Self-Review

**1. Spec/리뷰 커버리지 — 리뷰 Tier별 → 태스크 매핑:**
- Tier1 #1 SSOT 반쪽 강제 → Task 5. #2 하드게이트 미강제 → Task 3(+11 라이브). #3 comic-panel → Task 1. #4 가짜 stale → Task 2. #5 plot 경로 → Task 4. ✅ 전부 커버.
- Tier2 #6 status 라이프사이클 → Task 6. #7 panseo 모순+게이트 → Task 7. #8 ppt-preview DOM 문구 → Task 8. ✅
- Tier3 문서지연 → Task 9(+plan 체크박스는 이 문서가 완료 신호를 대체하므로 별도 태스크 불필요, Task 9 Step 3의 "잔여 항목은 이 plan 참조"로 연결). ✅
- Tier4 하우스키핑(orphan/pyc/gitignore/spike/ppt_render/엔진 프론트매터/dangling 경로) → Task 10. ✅
- 규정 dedup(SLIDE_RE/FIELD_RE 3중 복붙) → Task 1에 흡수. ✅

**2. Placeholder 스캔:** 코드 태스크(1·2·3)는 완전한 실제 코드·테스트를 담았다. 문서 태스크는 "Read → locate <리뷰 인용구> → replace with <완성된 대체 텍스트>" 형태로, 대체 텍스트를 전부 실제로 작성했다(빈 "적절히 수정" 없음). 앵커 인용구를 verbatim으로 갖지 못한 파일(spec §9, visual-assets §68, storyboard/ppt-preview 본문)은 리뷰 에이전트가 추출한 실제 문장을 앵커로 지정했다.

**3. 타입/이름 일관성:** `manuscript_grammar.py`가 export하는 이름(SLIDE_RE, FIELD_RE, IMG_PROMPT_RE, IMG_PATH_RE, D2_PRIMARY_RE, IMG_DEFER_RE)을 Task 1의 세 소비 스크립트와 Task 2가 동일 명으로 참조한다. `check_gate(status_md_text) -> list[dict]`의 dict 키(`chapter`/`visual_status`/`downstream`)를 Task 3 테스트·CLI·Task 11 Step 1 기대 출력이 일관되게 쓴다. manifest status 신값 `"stale"`을 Task 2 구현·테스트·visual-assets 문서·check_gate의 `OK_VISUAL` 제외 목록이 일관되게 다룬다.

**주의(실행자용):** Task 1 Step 5의 annotate `SLIDE_RE` 치환은 제목 없는 헤더에서 공유 `SLIDE_RE`의 `(.+)`가 매치 실패할 수 있으니 Step 7 전체 테스트로 회귀를 확인하고, 실패 시 모듈에 `SLIDE_NUM_RE` 별도 추가로 우회한다(Step 5에 명시).
