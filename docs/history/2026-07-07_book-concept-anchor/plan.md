# 책 개념 앵커(Concept Anchor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** book-build이 소설체 책을 만들 때, 장당 핵심 기술 개념 1–2개를 `정식 기술명 + 깨끗한 D2 도식 + 짧은 정의`로 된 시각적 "개념 앵커" 블록으로 세우고(정의를 프로즈에 녹이지 않음), 그 아래로 이야기가 흐르게 한다.

**Architecture:** 책 원고 마크다운에 pandoc fenced div `::: concept-anchor … :::`로 앵커를 표기하고, 새 Lua 필터(`concept-anchor.lua`)가 이 div를 typst의 `#concept-anchor[…]` 호출로 변환하며, `book_base.typ`에 정의된 `#let concept-anchor` 함수가 구분선 블록으로 렌더한다. manuscript는 변경하지 않는다(앵커 씨앗인 `핵심 정의`·D2가 이미 원고에 존재). book-build SKILL.md·storytelling.md에 앵커 저작 규칙과 편집검토 하드 체크를 추가하고, ch01 책을 앵커 버전으로 재빌드해 검증한다.

**Tech Stack:** pandoc(markdown→typst, Lua 필터), typst(PDF 컴파일), Python 3.14 + pytest 9.0.3, Git Bash on Windows 11.

## Global Constraints

- **하네스 구조 변경은 proposal + codex 사전검증 필수**: `docs/proposals/`에 계획서를 쓰고 `codex exec --sandbox read-only '...' </dev/null`(Git Bash, stdin 닫고)로 검증한 뒤 결과를 `docs/reviews/`에 저장하고 나서 반영한다 (CLAUDE.md 유지 규칙).
- **manuscript 무변경**: 앵커 씨앗(`핵심 정의`·D2)이 이미 확정 원고에 있으므로 `courses/*/manuscripts/*.md`는 건드리지 않는다.
- **앵커 3요소 고정**: 정식 기술명 + 도식(또는 명시적 도식-불가 사유) + 짧은 정의(1–2문장). 정의는 앵커에만 두고 프로즈에 중복 용해 금지.
- **밀도**: 장당 핵심 개념 1–2개만 앵커. 0개 불가(하드 체크). 모든 용어에 앵커 금지.
- **도식 = opt-in D2 재활용**: 앵커 도식은 `assets/diagrams/{chNN}-slide{NN}-*.png`(D2)를 쓴다. GPT 일러스트는 앵커에 쓰지 않는다(이야기 장면 전용). 없으면 `pub-d2-diagram` 생성 또는 최종적으로 도식 없이 명+정의.
- **제목 이원화**: 각 장 제목은 `이야기 제목 — 기술 부제`.
- **편집검토 ④ = 하드 체크**: 앵커 미충족(0개, 3요소 누락, 정의 프로즈 용해) 시 책 확정 불가.
- **라이트 테마 고정**: 새 색상 도입 금지. `book_base.typ` 기존 accent `rgb("#2563eb")` 재사용(`style.md` 디자인 제약 준수).
- **대상 검증 차시**: `courses/spring-boot-basic` ch01.
- 스펙 출처: `docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md`.
- **codex 조건부 승인 반영**(`docs/reviews/2026-07-07_book-concept-anchor-codex-review.md`): (1) Lua 필터는 `pandoc.write`로 AST→typst 직렬화 + `+fenced_divs` + anchor 필터를 paragraph-gap 앞에 → Task 3. (2) 앵커 이미지 빈 alt + design_assembler 경로에도 함수 → Task 3·6. (3) 편집검토 기존 ③ 유지 + 신규 ④ 추가(대체 금지) → Task 4.

---

## File Structure

- `docs/proposals/2026-07-07_book-concept-anchor.md` — 재설계 제안서 (신규)
- `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md` — codex 사전검증 결과 (신규)
- `.claude/skills/book-build/references/scripts/concept-anchor.lua` — `Div.concept-anchor` → `#concept-anchor[…]` 변환 Lua 필터 (신규)
- `.claude/skills/book-build/references/templates/book_base.typ` — `#let concept-anchor(body)` 블록 스타일 추가 (수정)
- `.claude/skills/book-build/references/scripts/typst_builder.py` — pandoc 호출에 `concept-anchor.lua` 필터 추가 (수정, 401–408행)
- `tests/test_concept_anchor_render.py` — Lua 변환 + typst 컴파일 테스트 (신규)
- `.claude/skills/book-build/SKILL.md` — 앵커 저작 규칙 + 편집검토 ④ 하드 체크 (수정)
- `.claude/skills/book-build/references/storytelling.md` — 앵커 필수 구조 + 제목 이원화 (수정)
- `courses/spring-boot-basic/book/ch01_원고.md` — 앵커 삽입 (수정, Task 6)
- `courses/spring-boot-basic/book/ch01.pdf` — 앵커 버전 재빌드 (수정, Task 6)
- `courses/spring-boot-basic/status.md` — ch01 책 재확정 (수정, Task 6)

> **Scope note:** 단일 서브시스템(book-build 앵커) 플랜이다. "기술 검증 에이전트"(스펙 §6)는 독립 서브시스템으로 이 플랜에 포함하지 않는다.

---

## Phase A — 제안서 + codex 사전검증

### Task 1: 재설계 제안서 작성

**Files:**
- Create: `docs/proposals/2026-07-07_book-concept-anchor.md`

**Interfaces:**
- Produces: 제안서 경로 (Task 2 입력)

- [ ] **Step 1: 제안서 작성**

아래 내용으로 `docs/proposals/2026-07-07_book-concept-anchor.md`를 생성한다:

```markdown
# 제안: 책 개념 앵커 (기술명+D2 도식+정의 블록)

## 1. 배경 / 문제
- 소설체 PDF 책이 비유·이야기 일색으로 "부실해 보인다". 실제 ch01은 기술 정의가 서술 문단에 용해돼 안 보이고, 장 제목도 순전히 이야기라 무슨 기술인지 목차에서 안 보인다.
- storytelling.md는 이미 "비유 → 왜? → 정의"를 요구하나 출력에서 정의가 프로즈에 용해돼 형해화됐다.

## 2. 제안
- **개념 앵커**: 새 핵심 기술 도입부(장당 1–2개)에 `정식 기술명 + 깨끗한 D2 도식 + 짧은 정의` 블록을 세우고 그 아래로 이야기가 흐른다. 정의는 앵커에만.
- **렌더**: 책 원고에 pandoc fenced div `::: concept-anchor`로 표기 → 새 Lua 필터가 `#concept-anchor[…]` typst 호출로 변환 → book_base.typ의 `#let concept-anchor`가 구분선 블록으로 렌더.
- **도식**: opt-in D2 재활용(GPT 일러스트는 장면 전용). **제목 이원화**("이야기 제목 — 기술 부제").
- **편집검토 ④(하드 체크)**: 앵커 미충족 시 확정 불가.
- **manuscript 무변경**(씨앗이 원고에 존재). 변경은 book-build에 국한.

## 3. 하위호환 / 리스크
- `::: concept-anchor`가 없는 기존 책 원고는 새 Lua 필터에 무영향(매칭 0건) → 회귀 없음.
- Lua 필터가 div 내용을 그대로 `#concept-anchor[…]`로 감싸므로 앵커 내부 마크다운(굵은 명·이미지·정의)은 정상 렌더.

## 4. 반영 순서
Phase B(렌더 기구+테스트) → Phase C(문서) → Phase D(ch01 적용).
```

- [ ] **Step 2: 커밋**

```bash
git add docs/proposals/2026-07-07_book-concept-anchor.md
git commit -m "docs: 책 개념 앵커 제안서"
```

---

### Task 2: codex 사전검증

**Files:**
- Create: `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md`

**Interfaces:**
- Consumes: `docs/proposals/2026-07-07_book-concept-anchor.md`
- Produces: 검증 결과(승인/조건부 승인 → 조건은 이후 Task에 반영)

- [ ] **Step 1: codex 읽기전용 검증 실행**

Git Bash에서 stdin을 닫고 실행한다:

```bash
codex exec --sandbox read-only 'docs/proposals/2026-07-07_book-concept-anchor.md 제안과 docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md 스펙을 검토하라. .claude/skills/book-build/references/scripts/typst_builder.py의 pandoc 호출(401~408행, --lua-filter paragraph-gap.lua)과 book_base.typ의 #show 스타일을 읽고, (1) Div.concept-anchor를 두 번째 Lua 필터로 #concept-anchor[…]로 감싸 typst로 변환하는 접근이 pandoc typst writer와 정합한지 (2) book_base.typ에 #let concept-anchor(body) 블록을 추가할 때 기존 #show 규칙과 충돌 여부 (3) 편집검토 하드 체크가 기존 3종과 정합한지 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
```

Expected: 승인 또는 조건부 승인(조건 목록). 출력 전문을 복사한다.

- [ ] **Step 2: 검증 결과 저장 + 조건 반영**

codex 출력 전문을 `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md`에 저장하고 맨 위에 한 줄 결론을 요약한다. 조건부 승인이면 조건을 Phase B~D 해당 Task에 반영한다.

- [ ] **Step 3: 커밋**

```bash
git add docs/reviews/2026-07-07_book-concept-anchor-codex-review.md
git commit -m "docs: 책 개념 앵커 제안 codex 사전검증 결과"
```

---

## Phase B — 앵커 렌더 기구 (TDD)

### Task 3: concept-anchor Lua 필터 + typst 함수 + pandoc 배선

**Files:**
- Create: `.claude/skills/book-build/references/scripts/concept-anchor.lua`
- Modify: `.claude/skills/book-build/references/templates/book_base.typ` (`#let concept-anchor` 추가)
- Modify: `.claude/skills/book-build/references/scripts/typst_builder.py` (pandoc cmd에 필터 추가, 401–408행)
- Create: `tests/test_concept_anchor_render.py`

**Interfaces:**
- Consumes: 없음(빌드 파이프라인 내부)
- Produces: 책 원고의 `::: concept-anchor … :::` fenced div가 PDF에서 위아래 구분선으로 감싼 블록(기술명 굵게 + D2 이미지 + 정의)으로 렌더된다. Lua 필터 함수명 `Div`, typst 함수 `#concept-anchor(body)`.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/test_concept_anchor_render.py`를 생성한다:

```python
import shutil
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
SCRIPTS = REPO / ".claude/skills/book-build/references/scripts"
TEMPLATES = REPO / ".claude/skills/book-build/references/templates"
LUA = SCRIPTS / "concept-anchor.lua"
BASE = TEMPLATES / "book_base.typ"

pandoc = pytest.mark.skipif(shutil.which("pandoc") is None, reason="pandoc 미설치")
typst = pytest.mark.skipif(shutil.which("typst") is None, reason="typst 미설치")

_MD = (
    "::: concept-anchor\n"
    "**HTTP · HyperText Transfer Protocol**\n\n"
    "![](x.png)\n\n"
    "웹에서 클라이언트와 서버가 요청·응답 메시지를 주고받는 통신 규칙.\n"
    ":::\n\n"
    "그날 민준은 API가 안 된다고 했다.\n"
)


@pandoc
def test_div_becomes_concept_anchor_call(tmp_path):
    md = tmp_path / "in.md"
    md.write_text(_MD, encoding="utf-8")
    out = tmp_path / "out.typ"
    cmd = ["pandoc", str(md), "-f", "markdown+fenced_divs", "-t", "typst", "-o", str(out),
           "--wrap=none", "--lua-filter", str(LUA)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    typ = out.read_text(encoding="utf-8")
    assert "#concept-anchor[" in typ          # 앵커 호출로 감쌈
    assert "HTTP" in typ                        # 기술명 보존
    assert "통신 규칙" in typ                    # 정의 보존
    # 앵커 밖 프로즈는 감싸지 않음
    assert "그날 민준은" in typ


@pandoc
def test_non_anchor_div_untouched(tmp_path):
    md = tmp_path / "in.md"
    md.write_text("::: other\n일반 내용.\n:::\n", encoding="utf-8")
    out = tmp_path / "out.typ"
    cmd = ["pandoc", str(md), "-f", "markdown+fenced_divs", "-t", "typst", "-o", str(out),
           "--wrap=none", "--lua-filter", str(LUA)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    assert "#concept-anchor[" not in out.read_text(encoding="utf-8")


def test_book_base_defines_concept_anchor():
    assert "#let concept-anchor(" in BASE.read_text(encoding="utf-8")


@typst
def test_concept_anchor_typst_compiles(tmp_path):
    # book_base.typ의 concept-anchor 함수를 import해 최소 문서로 컴파일
    doc = tmp_path / "doc.typ"
    doc.write_text(
        f'#import "{BASE.as_posix()}": concept-anchor\n'
        '#concept-anchor[*HTTP* \\ 웹 통신 규칙.]\n',
        encoding="utf-8")
    pdf = tmp_path / "o.pdf"
    r = subprocess.run(["typst", "compile", str(doc), str(pdf)],
                       capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    assert pdf.exists() and pdf.stat().st_size > 0
```

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `python -m pytest tests/test_concept_anchor_render.py -v`
Expected: `test_div_becomes_concept_anchor_call`, `test_book_base_defines_concept_anchor`, `test_concept_anchor_typst_compiles` 가 FAIL(필터·함수 없음). `test_non_anchor_div_untouched`는 필터 파일이 없어 pandoc이 `--lua-filter` 경로 오류로 FAIL.

- [ ] **Step 3: Lua 필터 작성**

`.claude/skills/book-build/references/scripts/concept-anchor.lua`를 생성한다:

```lua
-- Div(class="concept-anchor") → typst #concept-anchor[ <직렬화된 내용> ] 로 감싼다.
-- codex 조건1: 내부 Markdown을 문자열로 끼워 넣지 말고, div의 AST content를
-- pandoc.write로 typst content로 직렬화한 뒤 단일 RawBlock으로 감싼다.
-- 다른 div는 손대지 않는다.
function Div(el)
  if el.classes and el.classes:includes("concept-anchor") then
    local inner = pandoc.write(pandoc.Pandoc(el.content), "typst")
    return pandoc.RawBlock("typst", "#concept-anchor[\n" .. inner .. "\n]")
  end
end
```

- [ ] **Step 4: typst 앵커 함수 추가**

`book_base.typ`에서 기존 `#show strong: set text(fill: rgb("#1e3a5f"))` 줄(약 170행) 바로 다음에 아래를 추가한다:

```typst
// ── 개념 앵커 (concept-anchor) ──
// 정식 기술명(굵게) + D2 도식 + 짧은 정의를 위아래 구분선으로 감싼 블록.
// 이야기 프로즈와 시각적으로 분리해 정의가 눈에 보이게 한다.
// 앵커 내부 D2 이미지는 빈 alt(![](path))로 둔다 — 전역 #show figure 여백 중복 방지(codex 조건2).
#let concept-anchor(body) = block(
  width: 100%,
  above: 16pt,
  below: 16pt,
  inset: (top: 10pt, bottom: 10pt),
  stroke: (
    top: 0.8pt + rgb("#2563eb"),
    bottom: 0.8pt + rgb("#2563eb"),
  ),
)[
  #set align(center)
  #body
]
```

- [ ] **Step 5: pandoc 호출에 필터 배선**

`typst_builder.py`의 pandoc 변환 함수(약 398–408행)를 아래처럼 수정한다. `lua_filter` 정의 다음에 `anchor_filter`를 추가하고 cmd에 `--lua-filter`를 하나 더 넣는다:

```python
    lua_filter = Path(__file__).parent / 'paragraph-gap.lua'
    anchor_filter = Path(__file__).parent / 'concept-anchor.lua'
    cmd = [
        'pandoc',
        str(md_path),
        '-f', 'markdown+pipe_tables+fenced_code_blocks+backtick_code_blocks+fenced_divs-citations',
        '-t', 'typst',
        '-o', str(typ_path),
        '--wrap=none',
        '--lua-filter', str(anchor_filter),   # anchor 필터를 paragraph-gap 앞에 — 순서 고정(codex 조건1)
        '--lua-filter', str(lua_filter),
    ]
```

- [ ] **Step 5b: design 모드 경로에도 concept-anchor 함수 포함 (codex 조건2)**

`design` 모드는 `merge_template_and_content`(typst_builder.py:674)가 `book_base.typ`가 아니라 `design_assembler.assemble_book_base(...)`가 조립한 base를 쓴다. ch01은 standard 모드(driver에 `design` 키 없음)라 book_base.typ로 충분하지만, design 모드 회귀를 막기 위해 `design_assembler.py`의 조립 결과에도 동일한 `#concept-anchor` 정의가 포함되도록 한다(assemble_book_base가 산출하는 base 문자열에 Step 4의 함수 블록을 추가하거나, 공통 컴포넌트로 삽입). 구조 파악 후 book_base.typ와 **동일한 함수 정의**를 넣는다.

- [ ] **Step 6: 테스트 실행해 통과 확인**

Run: `python -m pytest tests/test_concept_anchor_render.py -v`
Expected: 4개 테스트 PASS. (`test_concept_anchor_typst_compiles`가 `book_base.typ` import 시 최상위 미정의 변수 오류로 실패하면, 그 원인 줄을 함수 정의 위로 옮기지 말고 — 대신 book_base.typ 최상위에서 미정의 변수를 직접 참조하는 곳이 없는지 확인한다. `#let`/`#show`/`state`만 있으면 import는 성공한다.)

- [ ] **Step 7: 커밋**

```bash
git add .claude/skills/book-build/references/scripts/concept-anchor.lua .claude/skills/book-build/references/templates/book_base.typ .claude/skills/book-build/references/scripts/typst_builder.py tests/test_concept_anchor_render.py
git commit -m "feat(book-build): 개념 앵커 렌더 — concept-anchor Lua 필터 + typst 블록 함수"
```

---

## Phase C — 저작 규칙 문서

### Task 4: book-build SKILL.md — 앵커 규칙 + 편집검토 ④ 하드 체크

**Files:**
- Modify: `.claude/skills/book-build/SKILL.md`

**Interfaces:**
- Consumes: Task 3 렌더 규약(`::: concept-anchor` 마크다운, 3요소)
- Produces: book-build 실행자가 따르는 앵커 저작·검증 절차

- [ ] **Step 1: 재집필 단계에 앵커 저작 규칙 추가**

`SKILL.md`의 소설체 재집필을 서술하는 절(원고 씨앗 추출·재집필 규칙이 있는 부분, "자산 선택 계약" 근처)에 아래 규칙 블록을 추가한다:

```
### 개념 앵커 (필수)

각 장에서 가장 중심적인 기술 개념 **1–2개**를 골라, 그 개념이 처음 도입되는 자리에 **개념 앵커**를 세운다. 앵커는 pandoc fenced div로 표기하며 3요소를 갖는다:

​```
::: concept-anchor
**정식 기술명 · 영문 풀네임**
![](../assets/diagrams/{chNN}-slide{NN}-*.png)
짧은 정식 정의(1–2문장) — 원고 슬라이드 Screen의 `핵심 정의`를 근거로.
:::
​```

- **기술명**: 이야기 제목이 아니라 실제 기술 용어(HTTP, WAS, 내장 Tomcat 등).
- **도식**: opt-in D2(`assets/manifest.json`의 `d2` 자산 또는 `assets/diagrams/{chNN}-slide{NN}-*.png`)를 쓴다. GPT 일러스트는 앵커에 쓰지 않는다(장면 전용). 고른 개념에 D2가 없으면 `pub-d2-diagram`으로 1개 생성, 그래도 도식화가 무의미하면 이미지 줄을 빼고 명+정의만 둔다.
- **정의**: 앵커에만 둔다. 같은 정의를 프로즈 문단에 다시 풀어 쓰지 않는다(비유·설명은 앵커 뒤 프로즈에서 계속).
- **밀도**: 장당 1–2개. 모든 용어에 앵커를 달지 않는다(소설 몰입 보호).
- **제목 이원화**: 각 장 제목은 `이야기 제목 — 기술 부제`(예: `2장. 약속이 있어야 대화가 된다 — HTTP`).
```

- [ ] **Step 2: 기존 ③ 유지(문구 조정) + 신규 ④ 개념 앵커 검증 추가 (codex 조건3 — 대체 금지)**

`SKILL.md`의 `### 4. 편집 검토 패스` 절에서:

(a) 절 도입부의 "**3종**"을 "**4종**"으로 바꾼다.

(b) 기존 3번 "**과도한 소설화 방지**" 항목은 **유지**하되, "기술 설명(정의·동작 원리·코드)을 끼워 넣어" 문구를 아래처럼 고친다(새 ④ 하드 체크의 "정의 중복 용해 금지"와 충돌 방지):

```
3. **과도한 소설화 방지**: 기술 설명 없이 이야기만 이어지는 구간(예: 대화·감정 묘사만 3문단 이상 연속)을 검출한다. 발견되면 그 구간에 기술 설명(**동작 원리·코드·예시 — 단 정식 정의는 앵커에만 두고 여기서 재정의하지 않는다**)을 끼워 넣어 이야기와 기술이 번갈아 나오도록 조정한다.
```

(c) 그 아래에 **4번 항목**을 새로 추가한다:

```
4. **개념 앵커 검증(하드 체크)**: 아래를 모두 만족해야 하며, 하나라도 어기면 확정할 수 없다.
   - 각 장에 개념 앵커가 **1–2개** 있다(0개인 장이 없다).
   - 각 앵커에 **정식 기술명 + (도식 또는 명시적 도식-불가 사유) + 짧은 정의**가 모두 있다.
   - 앵커의 정의가 프로즈 문단에 **중복 용해되지 않았다**(정의는 앵커에만).
```

- [ ] **Step 3: 확정 체크리스트 갱신 (3종→4종 + 앵커 항목)**

`SKILL.md`의 확정 체크리스트에서 기존 "**편집 검토 3종 통과**" 항목을 "**편집 검토 4종 통과**: 사실성 보존 / 개념 누락 대조표 / 과도한 소설화 방지 / 개념 앵커 검증"으로 바꾸고, 아래 항목을 추가한다:

```
- [ ] **개념 앵커**: 장마다 앵커 1–2개, 각 앵커 3요소(명+도식+정의) 충족, 정의 프로즈 용해 없음, 제목 이원화 적용.
```

- [ ] **Step 4: 커밋**

```bash
git add .claude/skills/book-build/SKILL.md
git commit -m "docs(book-build): 개념 앵커 저작 규칙 + 편집검토 ④ 하드 체크"
```

---

### Task 5: storytelling.md — 앵커 필수 구조 + 제목 이원화

**Files:**
- Modify: `.claude/skills/book-build/references/storytelling.md`

**Interfaces:**
- Consumes: Task 3·4 규약
- Produces: 재집필 시 참조하는 소설 기법 문서의 앵커 규칙

- [ ] **Step 1: "비유 → 왜? → 정의" 패턴을 앵커로 개정**

`storytelling.md`의 `### 패턴: 비유 → 왜? → 정의` 절(약 106행)에서 정의를 프로즈에 쓰는 예시 뒤에 아래 문단을 추가한다:

```
**정의는 개념 앵커에 세운다(중요)**: 위 "정의"는 프로즈 문단에 녹이지 말고, 장당 1–2개의 **개념 앵커**(정식 기술명 + D2 도식 + 짧은 정의) 블록으로 세운다. 앵커는 book-build SKILL.md의 `::: concept-anchor` 규약을 따른다. 비유는 앵커 뒤 프로즈에서 계속 쓰되, 정식 정의를 다시 풀어 쓰지 않는다(앵커에만).
```

- [ ] **Step 2: 제목 이원화 규칙 추가**

`storytelling.md`의 구조 절(`## 구조: 문제 → 기술 소개 → 해결 → 결과`, 약 14행) 바로 뒤에 아래를 추가한다:

```
**장 제목 이원화**: 각 장 제목은 `이야기 제목 — 기술 부제` 형식으로 쓴다(예: `3장. 안내 데스크와 주방 — 웹 서버와 WAS`). 목차에서 각 장의 기술 주제가 보이게 한다.
```

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/book-build/references/storytelling.md
git commit -m "docs(storytelling): 정의는 개념 앵커에 + 장 제목 이원화"
```

---

## Phase D — ch01 적용 (검증)

### Task 6: ch01 책 앵커 버전 재빌드

**Files:**
- Modify: `courses/spring-boot-basic/book/ch01_원고.md`
- Modify: `courses/spring-boot-basic/book/ch01.pdf` (재빌드)
- Modify: `courses/spring-boot-basic/status.md`

**Interfaces:**
- Consumes: Task 3(렌더 기구), Task 4·5(저작 규칙), `courses/spring-boot-basic/manuscripts/ch01.md`(핵심 정의 씨앗), `assets/diagrams/ch01-slide{05,08,10,15,20}-*.png`(D2)
- Produces: 장마다 개념 앵커가 든 ch01 책 PDF

- [ ] **Step 1a: 코스 book_base.typ 재동기화 (필수 — 안 하면 앵커 함수 미정의로 빌드 실패)**

ch01 책 빌드는 골든 템플릿이 아니라 **코스 자체 복사본** `courses/spring-boot-basic/book/book_base.typ`를 쓴다(driver의 `template=book/book.typ` → `merge_template_and_content`가 `book/book_base.typ`를 base로 사용). 이 복사본에 `#concept-anchor` 함수가 없으면 앵커 RawBlock 컴파일 시 미정의 오류가 난다. Task 3에서 갱신된 골든 템플릿을 코스 복사본으로 재동기화한다:

Run: `cp .claude/skills/book-build/references/templates/book_base.typ courses/spring-boot-basic/book/book_base.typ`
검증: `grep -c "concept-anchor" courses/spring-boot-basic/book/book_base.typ` → `>=1`.
(골든의 render-book-frontmatter 리팩터가 함께 들어오며, typst_builder가 그 함수 호출을 주입한다 — Task 3 리뷰에서 코스 book.typ 바인딩과 함께 컴파일 정상 검증됨.)

- [ ] **Step 1b: 장별 핵심 개념 선정 + 앵커 삽입**

`courses/spring-boot-basic/book/ch01_원고.md`의 각 장에서 핵심 개념 1–2개를 골라(원고 `manuscripts/ch01.md`의 해당 슬라이드 `핵심 정의` 근거) 그 개념 도입부에 `::: concept-anchor` 블록을 삽입한다. 기존 5개 D2(HTTP·WAS·내장Tomcat·WebMVC·요청흐름)를 도식으로 재활용한다. 예(2장):

```
## 2장. 약속이 있어야 대화가 된다 — HTTP

::: concept-anchor
**HTTP · HyperText Transfer Protocol**
![](../assets/diagrams/ch01-slide05-http.png)
웹에서 클라이언트와 서버가 요청·응답 메시지를 주고받는 통신 규칙.
:::

(이하 기존 이야기 프로즈 — 단, 프로즈 안에 있던 정식 정의 문장은 앵커로 옮겨 중복 제거)
```

각 장 제목에 기술 부제를 붙인다(제목 이원화). 정의를 앵커로 옮긴 뒤 프로즈에 남은 중복 정의 문장은 제거한다. **앵커 내부 D2 이미지는 빈 alt(`![](path)`)로 둔다**(figure 여백 중복 방지 — codex 조건2).

- [ ] **Step 2: 책 재빌드**

`book/_build/driver.py`(또는 book-build SKILL.md §5의 `typst_builder.build(config)`)로 PDF를 재생성한다:

Run: `python courses/spring-boot-basic/book/_build/driver.py`
Expected: `courses/spring-boot-basic/book/ch01.pdf` 재생성(mtime 갱신, 오류 없음).

- [ ] **Step 3: 앵커 렌더 확인**

Run: `grep -c "::: concept-anchor" courses/spring-boot-basic/book/ch01_원고.md`
Expected: 6장 기준 6~12(장당 1–2). 그리고 PyMuPDF 또는 육안으로 PDF에서 앵커 블록(구분선 + 기술명 + 도식 + 정의)이 이야기와 분리돼 보이는지 확인한다.

- [ ] **Step 4: 편집검토 ④ 하드 체크 수행**

Task 4 Step 2의 하드 체크를 수행한다: 장마다 앵커 1–2개, 각 앵커 3요소 충족, 정의 프로즈 용해 없음, 제목 이원화. 미충족 항목이 있으면 그 장만 수정하고 Step 2 재빌드.

- [ ] **Step 5: status.md 갱신 + 사용자 확인**

`courses/spring-boot-basic/status.md`의 ch01 책 산출물 인덱스 줄을 앵커 반영으로 갱신하고(예: `삽화 …, 개념 앵커 N개`), 사용자에게 앵커 버전 PDF 육안 확인을 요청한다. 확인 후 `책` 칸을 ✅로 유지/갱신한다.

- [ ] **Step 6: 커밋**

```bash
git add courses/spring-boot-basic/book/book_base.typ courses/spring-boot-basic/book/ch01_원고.md courses/spring-boot-basic/book/ch01.pdf courses/spring-boot-basic/status.md
git commit -m "content(ch01): 책 개념 앵커 적용 — 장별 기술명+D2+정의 앵커 + book_base 재동기화"
```

---

## Self-Review

**1. Spec coverage:**
- 개념 앵커 3요소·렌더(스펙 §2) → Task 3 ✅
- 밀도 1–2/장(§3.1) → Task 4(규칙)·Task 6(적용) ✅
- 앵커 씨앗=원고, manuscript 무변경(§3.2) → Global Constraints·Task 6 ✅
- 도식 opt-in D2 재활용/생성/폴백(§3.3) → Task 4·Task 6 ✅
- 제목 이원화(§3.4) → Task 4·5·6 ✅
- 편집검토 ④ 하드 체크(§3.5) → Task 4·Task 6 ✅
- 컴포넌트 5곳(§4) → Task 3(typst/lua/typst_builder)·Task 4(SKILL)·Task 5(storytelling) ✅
- 적용=ch01 재빌드(§5) → Task 6 ✅
- proposal+codex(§7·유지규칙) → Task 1·2 ✅
- 기술 검증 에이전트(§6) → 범위 밖 명시 ✅

**2. Placeholder scan:** Task 3은 완전한 Lua·typst·python·pytest 코드 포함. Task 4·5는 삽입할 정확한 문구 명시. Task 6은 실제 앵커 예시 + 정확한 grep/빌드 명령. "적절히 처리" 류 없음.

**3. Type consistency:** 마크다운 마커 `::: concept-anchor`, typst 함수 `#concept-anchor(body)`/호출 `#concept-anchor[…]`, Lua 함수 `Div`가 Task 3(정의)·Task 4·5(문서)·Task 6(적용)에서 일치. D2 경로 계약 `assets/diagrams/{chNN}-slide{NN}-*.png` 일치. 필터 배선(2개 `--lua-filter`) Task 3 Step 5에 명시.

> **실행 순서 주의**: Task 3(렌더 기구)이 없으면 Task 6의 `::: concept-anchor`가 그냥 텍스트로 렌더된다 — Phase B → Phase D 순서 필수.
