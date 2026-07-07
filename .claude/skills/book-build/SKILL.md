---
name: book-build
description: 확정 원고(`outputs/02_원고/chNN.md`)의 비유(Easy analogy)·실무사례(Practical case)·나레이션·실습·평가문항을 씨앗으로 소설처럼 이야기 형태로 재집필해 차시별 PDF 책(`outputs/10_책/chNN.pdf`)을 만든다. 과정 완주 시 합본(`outputs/10_책/합본.pdf`)도 만든다. "책 만들어줘", "PDF 책", "챕터 집필" 요청 시 사용. 파이프라인 11단계 — 캐릭터 설정 → 소설체 재집필(이미지는 `outputs/03_시각자산/manifest.json`의 확정 경로를 참조) → humanizer 문체 교정 → 편집 검토 4종(사실성·개념 누락·과도한 소설화·개념 앵커) → typst_builder(Typst/Pandoc)로 PDF 빌드. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
---

# book-build

확정 원고 `outputs/02_원고/chNN.md`(`manuscript-final` 산출물, manuscript-schema 8필드)를 **소설처럼 이야기 형태로 재집필**해 차시별 PDF 책(`outputs/10_책/chNN.pdf`)을 만드는 스킬이다. 파이프라인 11단계(마지막 단계)이며, 원고를 그대로 렌더하지 않고 비유·실무사례·나레이션·실습·평가를 씨앗 삼아 새로 쓴다.

**전제**: `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅여야 한다. 아니면 사용자에게 알리고 중단한다. `outputs/02_원고/chNN.md`가 존재해야 한다. **하드 게이트**: `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 완료(또는 명시적 보류)해야 한다.

**status.md 착수 갱신**: 집필을 시작하면 해당 차시 `책` 칸을 🔄로 바꾼다. PDF 산출·사용자 확인 후 ✅로,
보류 시 ➖ + 보류/누락 사유로 갱신한다.

**참조 규범 (Task 13 이식 자산 — 이 스킬은 규칙을 재정의하지 않고 그대로 따른다)**:
- `references/storytelling.md` — 캐릭터 삼각구도(팀장=힌트 제공자, 동료=문제 제기자, 오픈이=독자 대리인), 비유→왜?→정의 2단계, 비유는 캐릭터 대사에서 발견, Show Don't Tell, Try/Fail(성공 전 최소 2회 실패), 챕터 구조(이야기 파트 → 기술 파트, 라벨형 H2 금지 — "이야기", "기술 설명" 같은 제목을 달지 않고 자연스러운 장 제목만 쓴다), 이야기 파트 체크리스트(감각 묘사·Try/Fail·캐릭터 대화·내면독백·비유 촉발 등)
- `references/style.md` — 한국어 톤(`~합니다`/`~입니다`체, 대사는 존댓말), 이모지·em dash(`--`/`—`/`–`)·AI 선호어("이것이야말로", "정말 놀라운" 등) 전면 금지, 종결어미 반복 금지
- `references/build-pipeline.md` — 전처리 순서, Pandoc 옵션, Typst 후처리, 컴파일 옵션 상세(Windows 이식 주의 포함)
- `references/templates/book_base.typ` — Typst 조판(46배판 188×257mm, 자동 목차/표지/헤더). 본문 폰트 `KoPubWorldBatang_Pro`(폴백 `Malgun Gothic`), 코드 폰트 `D2Coding`
- `references/scripts/typst_builder.py` — MD→Typst→PDF 빌드 **라이브러리**(CLI 없음). `import typst_builder; typst_builder.build(config)` 형태로 호출한다(상세는 §5 참조)
- `references/fonts/` — D2Coding(OFL), KoPubWorld바탕(KOPUS 라이선스) 폰트 파일
- `humanizer` 스킬 — 한국어 AI 문체 24패턴 교정(별도 스킬로 호출, 이 스킬이 자체 구현하지 않는다)

## 절차

### 1. 캐릭터 설정 (과정당 1회)

`courses/{course-id}/outputs/10_책/characters.md`가 이미 있으면 건너뛴다. 없으면 `storytelling.md`의 삼각 구도(팀장=힌트 제공자/동료=문제 제기자/오픈이=독자 대리인)를 기준으로, 과정 대상자(과정개요서의 대상자 정의)에 맞는 캐릭터 3인의 이름·직군·말투를 사용자와 확정해 `outputs/10_책/characters.md`에 저장한다(예: 오픈이의 직군을 신입 백엔드 개발자로 할지, 주니어 데이터 분석가로 할지는 과정 주제에 따라 다르다). 실명 대신 역할명(팀장/동료/오픈이 또는 과정에 맞는 별칭)을 쓴다.

### 2. 소설체 재집필

원고 `outputs/02_원고/chNN.md`의 슬라이드들에서 다음을 씨앗으로 추출한다: Easy analogy(비유), Practical case(실무사례), Narration(설명 내용), Practice(실습), Assessment(평가문항). Screen/Visual asset은 장면 묘사·이미지 삽입 참고용으로만 쓴다.

이 씨앗들을 `storytelling.md` 전 규칙 + `style.md` 톤 규칙에 따라 `outputs/10_책/chNN_원고.md`로 재집필한다.

- 챕터는 이야기 파트(문제 등장 → 비유로 기술 소개 → Try/Fail 시행착오 → 결과)로 시작하고, 이후 기술 파트(정식 정의·심화 설명·실습 코드)로 이어진다. 두 파트를 가르는 라벨형 H2("## 이야기", "## 기술 설명" 등)는 달지 않는다 — 자연스러운 장 제목(예: `## 1장. 팔찌를 잃어버린 날`)만 쓴다.
- 원고의 핵심 개념·실습·평가문항이 하나도 누락되지 않도록 챕터 전체에 분배한다(한 슬라이드 = 반드시 한 장면일 필요는 없다. 여러 슬라이드를 하나의 장면으로 압축하거나, 한 슬라이드를 여러 장면으로 늘려도 된다).
- 캐릭터 등장 규칙(2개 챕터 연속 부재 금지)을 지킨다.
- **자산 해석 규칙(필수, 2026-07-06 개정)**: 이미지·D2 PNG 삽입은 원고 Visual asset의 프롬프트 텍스트가 아니라 `outputs/03_시각자산/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 결정한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다: (1) `image.status == "present"`이면 `image.path`, (2) 아니고 `d2.status == "present"`이면 `d2.path`, (3) 둘 다 `present`가 아니면(`deferred`/`missing`) 그 장면은 삽화 없이 텍스트만으로 쓴다. 실사용 경로는 `outputs/10_책/chNN_원고.md` 기준 상대경로로 보정한다. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.

- **자산 선택 계약**: 슬라이드별로 `outputs/03_시각자산/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`outputs/03_시각자산/images/chNN/slideNN.png`)이며 `d2.primary=true` 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다(원고 병기는 annotate가 primary 한 줄만 남긴다).

### 개념 앵커 (필수)

각 장에서 가장 중심적인 기술 개념 **1–2개**를 골라, 그 개념이 처음 도입되는 자리에 **개념 앵커**를 세운다. 앵커는 pandoc fenced div로 표기하며 3요소를 갖는다:

```
::: concept-anchor
**정식 기술명 · 영문 풀네임**
![](../03_시각자산/diagrams/{chNN}-slide{NN}-*.png)
짧은 정식 정의(1–2문장) — 원고 슬라이드 Screen의 `핵심 정의`를 근거로.
:::
```

- **기술명**: 이야기 제목이 아니라 실제 기술 용어(HTTP, WAS, 내장 Tomcat 등).
- **도식**: opt-in D2(`outputs/03_시각자산/manifest.json`의 `d2` 자산 또는 `outputs/03_시각자산/diagrams/{chNN}-slide{NN}-*.png`)를 쓴다. GPT 일러스트는 앵커에 쓰지 않는다(장면 전용). 고른 개념에 D2가 없으면 `pub-d2-diagram`으로 1개 생성, 그래도 도식화가 무의미하면 이미지 줄을 빼고 명+정의만 둔다.
- **정의**: 앵커에만 둔다. 같은 정의를 프로즈 문단에 다시 풀어 쓰지 않는다(비유·설명은 앵커 뒤 프로즈에서 계속).
- **밀도**: 장당 1–2개. 모든 용어에 앵커를 달지 않는다(소설 몰입 보호).
- **제목 이원화**: 각 장 제목은 `이야기 제목 — 기술 부제`(예: `2장. 약속이 있어야 대화가 된다 — HTTP`).

### 3. humanizer 패스

`outputs/10_책/chNN_원고.md` 작성 직후 **humanizer 스킬**을 호출해 AI 문체 24패턴(쉼표 과다, 어색한 띄어쓰기, AI 선호 어휘, 대명사·복수형 과다, 구조적 단조로움 등)을 교정한다. 교정 결과로 `outputs/10_책/chNN_원고.md`를 갱신한다.

### 4. 편집 검토 패스 (필수, 4종)

humanizer 패스 이후 반드시 아래 4종 검토를 순서대로 수행하고, 발견 항목을 수정한 뒤 사용자 확인을 받는다. 넷 중 하나라도 건너뛰면 확정할 수 없다.

1. **사실성 보존**: 챕터의 기술 서술(코드 동작, API 이름, 개념 정의 등)이 원고 `outputs/02_원고/chNN.md`와 원고의 `Source` 필드가 가리키는 근거와 어긋나는 문장이 없는지 문장 단위로 점검한다. 어긋나는 문장이 있으면 목록화하고 수정한다.
2. **개념 누락 대조표**: 원고의 슬라이드별 핵심 개념·Practice(실습)·Assessment(평가문항)가 `chNN_원고.md`에 모두 반영됐는지 대조표(원고 슬라이드 번호 ↔ 책 챕터/문단 위치)를 만들어 확인한다. 누락이 있으면 해당 부분만 보강한다.
3. **과도한 소설화 방지**: 기술 설명 없이 이야기만 이어지는 구간(예: 대화·감정 묘사만 3문단 이상 연속)을 검출한다. 발견되면 그 구간에 기술 설명(**동작 원리·코드·예시 — 단 정식 정의는 앵커에만 두고 여기서 재정의하지 않는다**)을 끼워 넣어 이야기와 기술이 번갈아 나오도록 조정한다.
4. **개념 앵커 검증(하드 체크)**: 아래를 모두 만족해야 하며, 하나라도 어기면 확정할 수 없다.
   - 각 장에 개념 앵커가 **1–2개** 있다(0개인 장이 없다).
   - 각 앵커에 **정식 기술명 + (도식 또는 명시적 도식-불가 사유) + 짧은 정의**가 모두 있다.
   - 앵커의 정의가 프로즈 문단에 **중복 용해되지 않았다**(정의는 앵커에만).

### 5. PDF 빌드

`typst_builder.py`(라이브러리, `import typst_builder; typst_builder.build(config)`)로 `outputs/10_책/chNN.pdf`를 생성한다.

**실제 호출 방식** (Task 13 드라이런으로 검증된 시그니처 — 브리프 가정과 달리 CLI 없음):

```python
import sys
from pathlib import Path

SKILL_SCRIPTS = Path(".claude/skills/book-build/references/scripts").resolve()
sys.path.insert(0, str(SKILL_SCRIPTS))
import typst_builder

sys.path.insert(0, str(Path("scripts").resolve()))
import course_layout

course_dir = Path("courses/{course-id}")
book_dir = course_layout.path(course_dir, "book")      # outputs/10_책 (배치 자동 판별)

config = {
    "title": "{회차명}",
    "base": course_dir,
    "assets_dir": course_layout.path(course_dir, "assets"),
    "mermaid_out": book_dir / "_mermaid_images",   # 이 하네스는 Mermaid 미사용 — 빈 디렉토리로 둠
    "template": book_dir / "book.typ",             # 프로젝트 book.typ — book_base.typ와 반드시 같은 디렉토리
    "font_path": SKILL_SCRIPTS.parent / "fonts",
    "front": [],                                    # 표지/서문 등, 없으면 빈 리스트
    "chapters": [book_dir / "chNN_원고.md"],
    "back": [],
    "output_md": book_dir / "_build" / "chNN.md",
    "output_typ": book_dir / "_build" / "chNN.typ",
    "output_pdf": book_dir / "chNN.pdf",
}
typst_builder.build(config)
```

주의사항:
- `merge_template_and_content()`가 `template_path.parent / "book_base.typ"`를 찾으므로, 프로젝트별 `book.typ`(book-title/color-primary 등 변수 정의)는 반드시 `references/templates/book_base.typ`의 사본과 **같은 디렉토리**(`outputs/10_책/` 또는 `outputs/10_책/_build/`)에 둔다. 처음 만드는 과정이면 `book_base.typ`를 그 디렉토리로 복사하고 `book.typ`에서 변수만 채운다.
- **`book.typ`가 반드시 정의해야 하는 변수(누락 시 Typst 컴파일 실패)**: `book-title`, `book-subtitle`, `book-description`, `book-header-title`, `book-authors`, `book-cover-image`(없으면 `""`), 표지 색상 `color-primary`/`color-primary-dark`/`color-primary-light`, 그리고 **`#let paragraph-gap = 6pt`**. `paragraph-gap`은 `book_base.typ`가 아니라 `paragraph-gap.lua` 필터가 생성 typst에 삽입하는 참조라 눈에 안 띄지만, 정의하지 않으면 `unknown variable: paragraph-gap`으로 빌드가 멈춘다. book.typ 최소 골격:
  ```typst
  #let book-title = "{과정명}"
  #let book-subtitle = "{회차 부제}"
  #let book-description = [{한두 문장 소개}]
  #let book-header-title = "{헤더 표시}"
  #let book-authors = "course-harness"
  #let book-cover-image = ""
  #let color-primary = rgb("#2563eb")
  #let color-primary-dark = rgb("#1e3a8a")
  #let color-primary-light = rgb("#93b4e8")
  #let paragraph-gap = 6pt
  ```
- `font_path`는 `references/fonts/` 절대경로를 그대로 넘긴다(Windows에서 `--font-path`로 주입됨).
- 이미지·D2 PNG 경로는 챕터 md 파일 기준 상대경로로 두면 `fix_image_paths()`가 자동으로 절대경로(Typst용 드라이브 앵커 제거 형식)로 변환한다.
- 과정의 전 차시가 `원고확정` + 책 집필을 완료하면(status.md 전체 ✅), 사용자 요청 시 `chapters` 리스트에 전 차시 `chNN_원고.md`를 순서대로 담아 합본(`outputs/10_책/합본.pdf`)을 같은 방식으로 빌드한다. 표지/목차는 `book_base.typ`가 자동 생성하므로 챕터 md를 연결하는 것 외에 별도 작업이 필요 없다.
- PDF 생성 후 실제로 열어(PyMuPDF로 텍스트 추출하거나 렌더링 이미지로 육안 확인 — Task 13 드라이런 참조) 빈 페이지·고아 줄·이미지 깨짐이 없는지 확인한다. `pdftotext`(poppler)는 한글 CJK 추출에서 오탐이 있었으므로 검증 시 PyMuPDF(`fitz`) 또는 육안 확인을 우선한다.

### 6. 확정

편집 검토 4종 통과 + PDF 렌더 정상을 사용자에게 보고하고 확인을 받은 뒤:

- `courses/{course-id}/status.md`의 해당 차시 `책` 칸을 ✅로 갱신한다.
- 산출물 인덱스에 `- chNN 책: outputs/10_책/chNN.pdf (확정 YYYY-MM-DD)`를 추가한다(합본이면 별도로 `- 합본: outputs/10_책/합본.pdf (확정 YYYY-MM-DD)`).

## 확정 체크리스트

- [ ] **편집 검토 4종 통과**: 사실성 보존 / 개념 누락 대조표 / 과도한 소설화 방지 / 개념 앵커 검증 — 네 검토 모두 수행하고 발견 항목을 수정했다.
- [ ] **PDF 렌더 정상**: 빈 페이지, 고아 줄(단락 마지막 한 줄이 다음 페이지로 넘어가는 현상), 이미지 깨짐이 없다(PyMuPDF 텍스트 추출 또는 렌더 이미지 육안 확인).
- [ ] **캐릭터 등장 규칙**: 2개 챕터 연속으로 캐릭터(팀장/동료/오픈이)가 하나도 등장하지 않는 구간이 없다.
- [ ] **개념 완전성**: 원고의 핵심 개념·Practice·Assessment가 책에서 대조표로 확인됐다(누락 없음).
- [ ] **개념 앵커**: 장마다 앵커 1–2개, 각 앵커 3요소(명+도식+정의) 충족, 정의 프로즈 용해 없음, 제목 이원화 적용.

## repair 규칙

체크리스트 실패 시 챕터 전체를 다시 쓰지 않는다.

- 편집 검토 4종 중 하나라도 실패하면 **검토에서 지적된 문단만** 재집필한다(챕터 전체 재집필 금지).
- 캐릭터 부재 구간이 발견되면 해당 챕터(또는 인접 챕터)에 짧은 대사 1개만 추가해 규칙을 충족시킨다.
- 개념 누락이 발견되면 누락된 개념만 가장 관련 있는 기술 파트 문단에 추가한다.
- PDF 렌더 실패(빈 페이지·이미지 깨짐 등)는 원고 재집필이 아니라 빌드 문제다 — 먼저 Task 13 드라이런 기록(`docs/history/2026-07-05_v2-redesign/typst-windows-dryrun.md`, Task 13 보고서 `.superpowers/sdd/task-13-report.md`)에 이미 알려진 이슈(예: 마지막 파일 뒤 구분자로 인한 이미지 근처 빈 페이지)인지 먼저 확인하고, 아니면 이미지 경로/`typst_builder.py` 후처리 로직을 점검한다.

## 라이선스 주의

`references/fonts/`의 KoPubWorld바탕체는 KoPub/KoPubWorld 라이선스로 무료 사용·복제·재배포가 허용되지만, **상업적 "판매" 등 유상 행위 시 사전 동의가 필요**하다. 이 스킬로 만든 책(`outputs/10_책/chNN.pdf`, `outputs/10_책/합본.pdf`)을 유료로 판매할 계획이면 배포 전 KoPubWorld바탕 라이선스 조항을 확인하고 필요 시 사전 동의를 받는다.

## 참고

- 원고 스키마: `.claude/skills/manuscript-draft/references/manuscript-schema.md` (8개 필드: Screen, Easy analogy, Practical case, Visual asset, Source, Narration, Practice, Assessment)
- Task 13 자산 이식 보고서: `.superpowers/sdd/task-13-report.md`, 드라이런 상세: `docs/history/2026-07-05_v2-redesign/typst-windows-dryrun.md`
- status.md 형식: `templates/status_template.md` (마지막 열이 `책`)
- 시각자산 SSOT: `outputs/03_시각자산/manifest.json`(`visual-assets` 스킬 소유) — §2 "자산 해석 규칙" 참조.
- 파이프라인 표: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3, §3.0-A(visual-assets), §10(이 스킬의 설계 근거)
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. Step 2 grep(개발 시점 1회성 구조 검증)으로 SKILL.md 자체를 확인했고, 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
