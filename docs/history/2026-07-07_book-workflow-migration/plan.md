# book-workflow 선별 마이그레이션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 책 플러그인 `book-workflow`에서 course-haness에 정말 빠진 것만(레이아웃 QA 2종·screenshot·reader-panel·book-build 검토 5종째·합본 규격) 현행 구조로 편입하고, 고아(`review`)·잔재(`math`)를 정리한다.

**Architecture:** course-haness는 에이전트 없는 스킬 오케스트라(`course-pipeline`)다. 편입 스킬은 전부 현행 경로(`courses/{id}/outputs/…`)와 `book-build`의 `typst_builder.py`에 맞춰 재작성한다. autocrop은 이미 `typst_builder.py`에 있으므로 별도 스킬로 만들지 않는다(codex 조건 a). reader-panel은 파이프라인 단계가 아니라 `manuscript-verify`와 같은 비차단 온디맨드 옵션이다(codex 조건 b). 레이아웃 QA는 book-build 내부 도구로만 걸고 파이프라인 게이트로 승격하지 않는다(codex 조건 c).

**Tech Stack:** Markdown 스킬 정의(SKILL.md), Python(PyMuPDF `fitz` 기반 `pdf_layout_checker.py`, `terminal_screenshot.py`/`capture.py`), Typst(`typst_builder.py`).

## Global Constraints

- **SSOT 규율 R1~R4** (CLAUDE.md): 권위 문서엔 현행 진실만. 변경 이력은 `docs/history/`에만. CLAUDE.md엔 스킬 목록·경로를 복제하지 않는다(포인터만).
- **스킬 명명 규약**: 스킬 폴더명 == SKILL.md frontmatter `name:` (예: `pub-layout-check` 폴더 → `name: pub-layout-check`).
- **경로 규약**: 모든 산출물은 `courses/{course-id}/outputs/NN_*/`. book-workflow 잔재 경로(`chapters/`, `projects/`, `book/`, `planning/`, `.pdf_venv`)를 남기지 않는다.
- **outputs 번호**: 01~11 점유(01_과정개요서 … 11_검증). reader-panel은 `12_독자패널`(파이프라인 단계 아님 — 리포트 namespace).
- **원본 위치**: `~/Documents/course-haness/book-workflow/.claude/skills/{layout-check→pub-layout-check, page-fit→pub-page-fit, screenshot, beta-reader}`. (원본 폴더명 ≠ course-haness 폴더명에 유의.)
- **커밋 규약**: 커밋 메시지 끝에 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. 각 태스크 끝에 커밋.
- **작업 브랜치**: `master`가 아닌 브랜치에서 작업. 시작 전 `git checkout -b migrate/book-workflow-skills`.

---

### Task 0: 작업 브랜치 생성

**Files:** (없음 — git 작업)

- [ ] **Step 1: 브랜치 생성**

```bash
cd ~/Documents/course-haness && git checkout -b migrate/book-workflow-skills
```

- [ ] **Step 2: 확인**

Run: `git branch --show-current`
Expected: `migrate/book-workflow-skills`

---

### Task 1: 고아 정리 — `review` 삭제 + `math` 현행화

**Files:**
- Delete: `.claude/skills/review/` (전체)
- Modify: `.claude/skills/math/SKILL.md`

**Interfaces:**
- Produces: 없음(제거/정정). 이후 태스크가 `review`를 참조하지 않음을 전제.

- [ ] **Step 1: `review` 사용처가 없는지 검증(삭제 전 안전 확인)**

Run:
```bash
cd ~/Documents/course-haness && grep -rn "skills/review\|review 스킬\|review/SKILL" .claude/skills CLAUDE.md docs/superpowers/specs 2>/dev/null | grep -v "^\.claude/skills/review/" | grep -viE "code-review|manuscript-verify|received-code-review"
```
Expected: 출력 없음(= `review` 스킬을 부르는 권위 문서가 없음). 만약 매치가 나오면 그 파일을 먼저 정리하고 진행.

- [ ] **Step 2: `review` 스킬 폴더 삭제**

```bash
cd ~/Documents/course-haness && git rm -r .claude/skills/review
```

- [ ] **Step 3: `math/SKILL.md` frontmatter description 교체**

`.claude/skills/math/SKILL.md`의 frontmatter를 아래로 교체(옛 "개념 트랙 STEP 5", "코드 트랙의 code 스킬에 대응" 제거):

```markdown
---
name: math
description: 수식 전개(LaTeX) + 계산 예제 단계화(worked example) + 연습문제 생성. 수학·수식이 필요한 개념형 강의의 원고(manuscript-draft/manuscript-final)나 책(book-build) 집필에서 수식 파트가 나올 때 온디맨드로 로드하는 보조 스킬. "수식 전개", "계산 예제", "연습문제 만들어줘", "수학 파트" 요청 시 사용. 파이프라인 단계를 소유하지 않는다(비차단 보조).
---
```

- [ ] **Step 4: `math/SKILL.md` 본문의 옛 파이프라인 어휘·죽은 경로 교체**

본문에서 아래를 치환한다(현행 경로/어휘로):
- `# 수식·예제 스킬 (개념 트랙)` → `# 수식·예제 스킬 (math)`
- `## 로드 시점` 블록의 `STEP 5 챕터 집필(개념 트랙) 기술 파트` / `STEP 3 계산예제 설계` → `원고(manuscript-*)·책(book-build) 집필 중 수식·계산예제·연습문제가 필요한 파트` 한 줄로 교체
- `해답은 챕터에 두지 않고 STEP 7 부록에 모은다(\`book/back/appendix.md\`).` → `해답은 본문에 두지 않고 해당 차시 원고 말미 또는 책 부록에 모은다.`
- `planning/research-*.md`(예: `research-경사하강-방법론.md`) → `해당 과정의 리서치 산출물(course-outline 리서치 md)`
- `planning/known.md` 선수지식 대조 문단 → 선수지식은 `outputs/01_과정개요서.md`의 대상자·선수지식 항목과 대조한다로 교체. `workflow/review-guide.md 2.5` 참조 제거.
- `형식·러너: \`visual/references/image.md\` §0·방식 C + \`image-gen\` 스킬 \`plot_gen.py\`.` → `형식·러너: \`image-gen\` 스킬의 \`plot_gen.py\`([PLOT SCRIPT] 렌더).` (죽은 `visual/references/image.md` 제거, 살아있는 image-gen만 남김)

- [ ] **Step 5: 잔재 어휘 0 검증**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "개념 트랙|코드 트랙|code 스킬|STEP [0-9]|planning/|workflow/review-guide|visual/references|book/back" .claude/skills/math/SKILL.md
```
Expected: 출력 없음.

- [ ] **Step 6: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
refactor(harness): review 스킬 삭제 + math 현행화

- review: 사용처 0, book-build 편집검토 4종이 대체 → 삭제
- math: 옛 트랙/STEP/code 스킬 어휘·죽은 경로 제거, 온디맨드 보조 스킬로 재서술

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `pub-layout-check` 편입 (PDF 레이아웃 감지 도구)

**Files:**
- Create: `.claude/skills/pub-layout-check/SKILL.md`
- Create: `.claude/skills/pub-layout-check/references/detection-rules.md` (원본 복사)
- Create: `.claude/skills/pub-layout-check/references/scripts/pdf_layout_checker.py` (원본 복사)

**Interfaces:**
- Produces: `pdf_layout_checker.py`는 인자로 PDF 경로 1개를 받아 페이지별 사용률·이슈 리포트를 stdout으로 출력하는 CLI(경로 무관, 재작성 불필요). Task 3(pub-page-fit)·Task 5(book-build 연결)가 이 CLI를 소비.

- [ ] **Step 1: 원본 스크립트/참조 복사**

```bash
cd ~/Documents/course-haness
SRC=book-workflow/.claude/skills
mkdir -p .claude/skills/pub-layout-check/references/scripts
cp "$SRC/pub-layout-check/references/scripts/pdf_layout_checker.py" .claude/skills/pub-layout-check/references/scripts/
cp "$SRC/pub-layout-check/references/detection-rules.md" .claude/skills/pub-layout-check/references/
```

- [ ] **Step 2: 스크립트가 book-workflow 경로에 하드 의존하지 않는지 검증**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "projects/|chapters/|\.pdf_venv|book/output" .claude/skills/pub-layout-check/references/scripts/pdf_layout_checker.py
```
Expected: 출력 없음(= PDF 경로를 인자로만 받음). 만약 하드코딩 경로가 있으면 인자(`sys.argv[1]`) 기반으로 교체.

- [ ] **Step 3: 스크립트 스모크 실행(PyMuPDF 의존 확인)**

Run (기존 빌드된 PDF가 있으면 그 경로로, 없으면 `--help`/임포트만):
```bash
cd ~/Documents/course-haness && python .claude/skills/pub-layout-check/references/scripts/pdf_layout_checker.py 2>&1 | head -5
```
Expected: 인자 없이 실행 시 usage 또는 "PDF 경로 필요" 류 메시지(임포트 에러 `ModuleNotFoundError: fitz`가 **아님**). fitz 미설치면 `pip install pymupdf` 후 재시도.

- [ ] **Step 4: SKILL.md 작성(현행 경로 규약)**

`.claude/skills/pub-layout-check/SKILL.md`:

```markdown
---
name: pub-layout-check
description: book-build가 만든 PDF(`outputs/10_책/chNN.pdf`)를 페이지별로 분석해 빈 페이지·고아줄·과도한 공백·이미지 밀림을 감지하는 도구 스킬. "레이아웃 점검", "PDF 빈 페이지 확인", "고아줄 검사" 요청 시, 또는 book-build 확정 절차의 'PDF 렌더 정상' 검증을 도구화할 때 로드한다. 감지만 하고 수정하지 않는다(수정 전략은 pub-page-fit). 파이프라인 단계가 아니라 book-build 내부 post-build 도구다.
allowed-tools: Bash(python *pdf_layout_checker.py*)
---

# pub-layout-check — PDF 레이아웃 감지

book-build가 빌드한 PDF를 페이지별로 분석해 레이아웃 문제를 감지한다. **감지 전용** — 수정은 `pub-page-fit`이 담당한다. 파이프라인 단계나 status.md 칸이 아니라 **book-build 내부 post-build 도구**다(course-pipeline 게이트로 승격하지 않는다).

## 스크립트

- `references/scripts/pdf_layout_checker.py` — PDF 경로 1개를 인자로 받아 페이지 사용률 막대와 이슈 리포트를 출력. PyMuPDF(`fitz`) 필요(book-build와 동일 의존).

## 실행

```bash
python .claude/skills/pub-layout-check/references/scripts/pdf_layout_checker.py courses/{course-id}/outputs/10_책/chNN.pdf
```

## 감지 항목

| 이슈 | 심각도 | 조건 | 제안(→ pub-page-fit) |
|------|--------|------|------|
| 빈 페이지 | high | 텍스트·이미지 블록 없음 | pagebreak 제거 |
| 고아 콘텐츠 | high | ≤4줄 + 하단 50%+ 빈 공간 | 이전 페이지로 당기기 |
| 낮은 사용률 | medium | 콘텐츠 45% 미만 | 이미지/코드 밀림 패턴 |
| 과대 이미지 | medium | 이미지가 페이지 70%+ | max-width 축소 |
| 밀림 패턴 | medium | 이전 55% 미만 + 다음 페이지 이미지 | auto-image 자동 축소 |

## 출력 예

​```
p03 |#################.......................|  45%  <<빈 공간>>
p06 |########................................|  22%  <<<고아>>>
​```

## 참조

- `references/detection-rules.md` — 감지 규칙 상세
```

- [ ] **Step 5: detection-rules.md의 죽은 경로 정정**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "projects/|chapters/|\.pdf_venv|book/output|graph TD" .claude/skills/pub-layout-check/references/detection-rules.md
```
매치가 있으면 현행 경로(`outputs/10_책/chNN.pdf`)로 치환. 없으면 통과.

- [ ] **Step 6: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
feat(pub-layout-check): PDF 레이아웃 감지 도구 편입

book-workflow에서 이식. book-build post-build 감지 전용(수정은 pub-page-fit).
현행 경로 outputs/10_책/chNN.pdf 기준, PyMuPDF 의존.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `pub-page-fit` 편입 + book-build repair 연결

**Files:**
- Create: `.claude/skills/pub-page-fit/SKILL.md`
- Create: `.claude/skills/pub-page-fit/references/fit-strategies.md` (원본 복사)

**Interfaces:**
- Consumes: Task 2의 `pdf_layout_checker.py` 이슈 리포트.
- Produces: 이슈별 수정 전략(자동/수동 구분). book-build repair 규칙이 이 스킬을 참조.

- [ ] **Step 1: 원본 참조 복사**

```bash
cd ~/Documents/course-haness
mkdir -p .claude/skills/pub-page-fit/references
cp book-workflow/.claude/skills/pub-page-fit/references/fit-strategies.md .claude/skills/pub-page-fit/references/
```

- [ ] **Step 2: SKILL.md 작성**

`.claude/skills/pub-page-fit/SKILL.md`:

```markdown
---
name: pub-page-fit
description: pub-layout-check가 감지한 PDF 레이아웃 이슈(고아줄·빈 페이지·과대 이미지·이미지 밀림)를 해결하는 수정 전략 스킬. "레이아웃 수정", "고아줄 해결", "이미지 밀림 고쳐줘" 요청 시, 또는 book-build repair 절차에서 로드한다. 자동 수정 가능분과 수동 판단분을 구분해 제시한다. 파이프라인 단계가 아니라 book-build 내부 repair 도구다.
---

# pub-page-fit — PDF 밀도 조정 전략

`pub-layout-check`가 감지한 이슈를 해결하는 전략을 제공한다. book-build의 **repair 도구**로, 챕터 전체 재집필이 아니라 문단·이미지 단위 수정을 원칙으로 한다. 파이프라인 게이트·status.md 칸으로 승격하지 않는다.

## 이슈별 전략(요약)

| 이슈 | 자동 수정 | 수동 판단 |
|------|-----------|-----------|
| 고아 콘텐츠 | 이전 페이지 이미지 max-width 5~10%↓, 수평선(`---`) 제거 | 앞 섹션 1~2문장 축약, h1이면 고아 허용 |
| 이미지 밀림 | max-width 0.7→0.6→0.5→0.4 단계 축소 후 재빌드 | 이미지 앞 텍스트 추가/이동 |
| 빈 페이지 | 해당 heading `pagebreak(weak:true)` 제거 | 의도적(Part 구분)인지 확인 |
| 과대 이미지 | `_detect_image_max_width()` 축소 + autocrop | — |

## 자동 수정 루프

1. `pub-layout-check` 실행 → 이슈 목록
2. 자동 수정 적용(이미지 크기·수평선)
3. book-build `typst_builder.py`로 재빌드
4. 재분석 → 이슈 감소 확인
5. 남은 이슈는 사용자에게 보고

## 참조

- `references/fit-strategies.md` — 구체 전략(전략 8: 이야기 파트 2단 레이아웃 포함)
```

- [ ] **Step 3: fit-strategies.md 죽은 경로 정정**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "projects/|chapters/|\.pdf_venv|book/output" .claude/skills/pub-page-fit/references/fit-strategies.md
```
매치가 있으면 현행 경로/어휘로 치환. 없으면 통과.

- [ ] **Step 4: book-build SKILL.md의 repair 규칙에 pub-layout-check/pub-page-fit 연결 추가**

`.claude/skills/book-build/SKILL.md`의 "## repair 규칙" 섹션 끝에 아래 항목을 **추가**(R2 추가):

```markdown
- **레이아웃 도구화**: "PDF 렌더 정상" 검증은 육안 외에 `pub-layout-check`(감지) → `pub-page-fit`(수정 전략)으로 도구화할 수 있다. 감지된 고아줄·빈 페이지·이미지 밀림은 챕터 재집필이 아니라 이미지 max-width·수평선·pagebreak 조정으로 해소한 뒤 `typst_builder.py`로 재빌드한다. 이 두 스킬은 book-build 내부 도구이며 파이프라인 게이트가 아니다.
```

- [ ] **Step 5: 연결 검증**

Run:
```bash
cd ~/Documents/course-haness && grep -c "pub-layout-check\|pub-page-fit" .claude/skills/book-build/SKILL.md
```
Expected: `1` 이상.

- [ ] **Step 6: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
feat(pub-page-fit): PDF 레이아웃 수정 전략 편입 + book-build repair 연결

pub-layout-check(감지)→pub-page-fit(수정)을 book-build repair 도구로 연결.
codex 조건 c: 파이프라인 게이트로 승격하지 않음.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `screenshot` 편입

**Files:**
- Create: `.claude/skills/screenshot/SKILL.md`
- Create: `.claude/skills/screenshot/references/terminal-capture.md`, `references/browser-capture.md` (원본 복사)
- Create: `.claude/skills/screenshot/scripts/capture.py`, `scripts/terminal_screenshot.py` (원본 복사)

**Interfaces:**
- Produces: 터미널/브라우저 PNG 캡처. book-build `[CAPTURE NEEDED]` 교체 및 practice-code 실행결과 캡처가 소비.

- [ ] **Step 1: 원본 전체 복사**

```bash
cd ~/Documents/course-haness
cp -r book-workflow/.claude/skills/screenshot .claude/skills/screenshot
```

- [ ] **Step 2: 출력 경로 규약을 현행으로 치환**

`.claude/skills/screenshot/SKILL.md`의 "핵심 규칙"에서 출력 경로를 현행으로 교체:
- `{project}/assets/CH{N}/terminal/` → `courses/{course-id}/outputs/03_시각자산/captures/chNN/terminal/` (브라우저는 `.../browser/`)
- 파일명 규칙 `{NN}_{설명}.png`는 유지.

- [ ] **Step 3: references의 죽은 경로 정정**

Run:
```bash
cd ~/Documents/course-haness && grep -rnE "projects/|chapters/|\{project\}/assets" .claude/skills/screenshot/references .claude/skills/screenshot/SKILL.md
```
매치가 있으면 현행 경로(`courses/{course-id}/outputs/03_시각자산/captures/…`)로 치환. 없으면 통과.

- [ ] **Step 4: 스크립트 임포트 스모크**

Run:
```bash
cd ~/Documents/course-haness && python -c "import ast; ast.parse(open('.claude/skills/screenshot/scripts/capture.py',encoding='utf-8').read()); ast.parse(open('.claude/skills/screenshot/scripts/terminal_screenshot.py',encoding='utf-8').read()); print('parse-ok')"
```
Expected: `parse-ok`.

- [ ] **Step 5: book-build style.md의 `[CAPTURE NEEDED]` 처리에 screenshot 연결 명시**

`.claude/skills/book-build/references/style.md`에서 `[CAPTURE NEEDED]` 관련 문단에 "이 플레이스홀더는 `screenshot` 스킬로 실제 PNG(`outputs/03_시각자산/captures/…`)로 교체한다." 한 줄을 추가(이미 유사 문구가 있으면 경로만 현행화).

- [ ] **Step 6: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
feat(screenshot): 터미널·브라우저 PNG 캡처 스킬 편입

[CAPTURE NEEDED] 교체 + practice-code 실행결과 캡처용.
출력 경로를 outputs/03_시각자산/captures/로 현행화, book-build style.md 연결.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: book-build 편집검토 **5종째**(연결·시제·의인화)

**Files:**
- Modify: `.claude/skills/book-build/SKILL.md` (편집검토 4종 → 5종, 확정 체크리스트)

**Interfaces:**
- Consumes: 없음.
- Produces: 확정 체크리스트에 5종째 항목. reader-panel(Task 7)과 목적이 다름(이건 저자 자기검토, reader-panel은 독자 시뮬).

- [ ] **Step 1: 편집검토 섹션에 5번 항목 추가**

`.claude/skills/book-build/SKILL.md`의 편집검토 목록(현재 1~4번: 사실성/개념누락/과도소설화/개념앵커) 뒤에 5번을 **추가**:

```markdown
5. **문장·문단 정합(연결·시제·의인화)**: 소설체 재집필 특성상 아래 3렌즈를 점검한다. 자동 훅이 아니라 확정 절차의 육안 체크다.
   - **연결(문단 전환)**: 인접한 두 산문 문단이 '대비 개념쌍'(폴링/푸시, 동기/비동기, 기존/바뀜 등)인데 둘 다 같은 비유·어절로 시작하고, 둘째 문단에 전환어(반대로·반면·그래서)나 앞 문단 끝 키워드 회수가 없으면 위반 → 전환어 또는 키워드 회수를 넣는다. (단순 절차 설명이 연속으로 같은 단어로 시작하는 것은 위반 아님 — 대비쌍일 때만.)
   - **시제 규율**: 분위기 보강용 불필요한 과거형 회수가 있으면 현재형으로. (사건의 사실 회수 과거형은 정상.)
   - **기술파트 한정 의인화**: 기술 설명 산문에서 코드·시스템에 사람 행위를 부여하면 위반 → 동작 서술로 교정. **단, 비유 캐릭터(팀장/동료/오픈이) 대사와 기존 어조의 "서버가 먼저 알린다" 류는 예외**(이 책은 캐릭터 소설체).
```

- [ ] **Step 2: 확정 체크리스트에 5종째 반영**

같은 파일 "## 확정 체크리스트"의 `**편집 검토 4종 통과**` 항목을 `**편집 검토 5종 통과**: 사실성 보존 / 개념 누락 대조표 / 과도한 소설화 방지 / 개념 앵커 검증 / 문장·문단 정합(연결·시제·의인화) — 다섯 검토 모두 수행하고 발견 항목을 수정했다.`로 교체(4→5, old 삭제 = R2 제자리 교체).

- [ ] **Step 3: repair 규칙의 "편집 검토 4종" 문구도 5종으로 정합**

같은 파일 repair 규칙에서 `편집 검토 4종 중 하나라도 실패하면` → `편집 검토 5종 중 하나라도 실패하면`으로 교체.

- [ ] **Step 4: 4종 잔재 0 검증(R2 old+new 공존 금지)**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "편집 검토 4종|검토 4종 통과" .claude/skills/book-build/SKILL.md
```
Expected: 출력 없음.

- [ ] **Step 5: description의 "편집 검토 4종" 표기도 5종으로**

frontmatter description의 `편집 검토 4종(사실성·개념 누락·과도한 소설화·개념 앵커)` → `편집 검토 5종(사실성·개념 누락·과도한 소설화·개념 앵커·문장문단 정합)`으로 교체.

Run: `cd ~/Documents/course-haness && grep -c "편집 검토 5종\|검토 5종" .claude/skills/book-build/SKILL.md`
Expected: `2` 이상(본문+체크리스트+description 중).

- [ ] **Step 6: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
feat(book-build): 편집검토 5종째(연결·시제·의인화) 추가

book-workflow 훅 5렌즈 중 소설체 품질에 기여하는 3렌즈를 흡수.
자동 훅이 아니라 확정 절차 체크 항목. 4종→5종 제자리 교체(R2).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: book-build 합본 **완성 규격**(웹인쇄소 흡수)

**Files:**
- Modify: `.claude/skills/book-build/SKILL.md` (합본 규칙 + 확정 체크리스트)

**Interfaces:**
- Consumes: 기존 합본 로직(`chapters` 리스트 + `book_base.typ` 자동 표지/목차).
- Produces: 합본 완성 체크리스트(판권지·프롤로그·챕터표지·계층 북마크). 구현은 Typst 유지(HTML 경로 미도입).

- [ ] **Step 1: 합본 문단에 완성 규격 추가**

`.claude/skills/book-build/SKILL.md`의 합본 관련 문단(현재 "과정의 전 차시가 …합본(`outputs/10_책/합본.pdf`)을 …빌드한다. 표지/목차는 `book_base.typ`가 자동 생성…") 뒤에 **추가**:

```markdown
- **합본 완성 규격(한 권으로 병합)**: 합본은 낱장 PDF 이어붙이기가 아니라 한 권의 책이어야 한다. `book_base.typ`가 표지·목차를 자동 생성하는 것에 더해, 합본 시 아래를 갖춘다.
  - **판권지**(제목·저자·판형·라이선스 고지)를 표지 다음(또는 책 말미)에 둔다.
  - **프롤로그/머릿말**을 목차 앞(`PRE_TOC_CONTENT`)에 배치한다(목차에는 포함하지 않음 — `exclude_from_toc`).
  - **차시별 챕터표지**로 각 chNN 시작을 구분한다.
  - **전체 연속 페이지번호**와 **계층 북마크(장·절)**가 PDF outline에 살아 있어야 한다.
```

- [ ] **Step 2: 확정 체크리스트에 합본 규격 항목 추가(합본 빌드 시에만 적용)**

"## 확정 체크리스트"에 항목 추가:

```markdown
- [ ] **(합본만) 완성 규격**: 판권지·프롤로그(목차 제외)·차시별 챕터표지·연속 페이지번호·계층 북마크가 합본 PDF에 존재한다(PyMuPDF outline/텍스트 추출로 확인).
```

- [ ] **Step 3: 검증**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "판권지|계층 북마크|챕터표지" .claude/skills/book-build/SKILL.md
```
Expected: 최소 2줄(합본 문단 + 체크리스트).

- [ ] **Step 4: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
feat(book-build): 합본 완성 규격 흡수(웹인쇄소 에이전트 규격)

판권지·프롤로그·챕터표지·연속 페이지번호·계층 북마크를 합본 규칙+체크리스트로.
구현은 기존 Typst 경로 유지(HTML+Chromium 경로 미도입).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: `reader-panel` 신규 편입(beta-reader 개명·재작성)

**Files:**
- Create: `.claude/skills/reader-panel/SKILL.md` (전면 재작성)
- Create: `.claude/skills/reader-panel/README.md` (원본 참고, 현행화)

**Interfaces:**
- Consumes: 확정 원고(`outputs/02_원고/chNN.md`) 또는 확정 책(`outputs/10_책/chNN.pdf`), 과정개요서(`outputs/01_과정개요서.md`).
- Produces: `outputs/12_독자패널/chNN_reader.md` 리포트. status.md 열은 추가하지 않음.

- [ ] **Step 1: 폴더 생성 + SKILL.md 작성(현행 구조·비차단 온디맨드)**

`.claude/skills/reader-panel/SKILL.md`:

```markdown
---
name: reader-panel
description: 10명의 가상 독자 페르소나가 확정 원고나 완성된 책을 읽고 실습하며 피드백을 내는 시험 독자 패널. "독자 패널", "시험 독자", "reader-panel", "베타 리딩" 요청 시 사용. 이야기(몰입/비유/톤)·기술(용어/코드/시각화)·실습(막힘/에러/결과)을 평가해 근거부 리포트(`outputs/12_독자패널/chNN_reader.md`)를 낸다. 비차단 온디맨드 옵션 — 파이프라인 단계가 아니고 하드 게이트가 아니며 원고/책을 자동 수정하지 않는다(수정은 사용자가 manuscript-final/book-build로).
user_invocable: true
---

# reader-panel — 시험 독자 패널

다양한 배경의 가상 독자 10명이 원고 또는 책을 읽고 실습하며 피드백을 낸다. `manuscript-verify`와 같은 **비차단 온디맨드 옵션**이다: 파이프라인 단계·status.md 칸이 아니고, 하드 게이트가 아니며, 원고/책을 자동 수정하지 않고 근거부 리포트만 낸다.

## 두 가지 실행 기준(분리)

| 기준 | 전제 | 입력 |
|------|------|------|
| **원고 기준**(조기 리딩) | 해당 차시 `원고확정 ✅` | `outputs/02_원고/chNN.md` |
| **책 기준**(최종 리딩) | 해당 차시 `책 ✅` | `outputs/10_책/chNN.pdf` |

사용자가 지정한 기준으로 실행한다. 지정이 없으면 어느 기준인지 되묻는다.

## 실행 흐름

### 1. 컨텍스트 로드
- `outputs/01_과정개요서.md` — 대상자·선수지식·과정목표(= 독자 상수)
- 대상 원고(`outputs/02_원고/chNN.md`) 또는 책(`outputs/10_책/chNN.pdf`)
- 실습 코드가 있으면 `outputs/04_코드/chNN/`
- 이전 리포트가 있으면 `outputs/12_독자패널/chNN_reader.md`(개선 확인용)

### 2. 페르소나 10명 자동 생성
과정개요서의 대상자·기술스택을 근거로 생성한다:
- 2명 주제와 가까운 배경 / 2명 먼 배경 / 2명 비개발(PM·기획) / 2명 숙련자(리드·시니어) / 1명 초보(부트캠프) / 1명 학생.
- 각 페르소나 필드: 이름(역할) · 배경 · 코드 수준 · 관점(막히는 포인트).

### 3. 10명 병렬 디스패치
Agent 도구로 10명을 병렬 실행. 각자에게 페르소나·독자 상수·본문(+실습 코드)·아래 체크리스트를 전달하고 "이 관점에서 솔직하게, 좋은 점도 나쁜 점도 숨기지 말라"고 지시.

### 4. 평가 체크리스트
- **이야기**: 몰입 / 비유 적합 / AI투 톤 / 용어 도입 순서 / 등장인물 대사.
- **기술**: 비유↔정의 연결 / 코드 이해도 / 데이터 시각화 / 파일트리 [실습·설명·참고] 명료성.
- **실습**(코드 있는 차시만): 환경구축 막힘 / 실행결과 일치 / TODO 힌트 / 에러 대응.
- **전체**: 학습곡선 점프 / 분량 체감 / 다음 차시 예고 흥미.

### 5. 종합 리포트
`outputs/12_독자패널/chNN_reader.md`에 저장. 구조: 페르소나 목록표 → 요약(통과 N/10) → 공통 피드백(3명 이상) → 심각도별 이슈(높음/중간/낮음) → 페르소나별 상세([이야기]/[기술]/[실습]/[총평]/[점수]) → 수정 제안(우선순위·위치·관련 페르소나).

## 제약
- 실습 코드는 실행하지 않고 **코드 리딩으로 평가**(실행 검증은 practice-code 담당).
- 과정개요서의 대상자·선수지식을 기본 전제로 한다.
- 코드 없는 개념 차시는 실습 평가를 건너뛴다.
- 이전 리포트가 있으면 "지적이 개선됐는가"도 확인.
- **원고/책을 직접 수정하지 않는다** — 리포트만 낸다.
```

- [ ] **Step 2: "12"가 단계 아님을 재확인(문서 내 자기표기)**

Step 1 SKILL.md에 "파이프라인 단계가 아니고"가 포함됐는지 검증.
Run: `cd ~/Documents/course-haness && grep -c "파이프라인 단계가 아니\|비차단 온디맨드" .claude/skills/reader-panel/SKILL.md`
Expected: `2` 이상.

- [ ] **Step 3: status.md 열 미추가 검증**

Run:
```bash
cd ~/Documents/course-haness && grep -rn "독자패널\|reader-panel" templates/status_template.md courses/*/status.md 2>/dev/null
```
Expected: 출력 없음(status에 열/칸을 만들지 않음 — codex 조건 b).

- [ ] **Step 4: 트리거 near-miss 충돌 점검**

Run:
```bash
cd ~/Documents/course-haness && grep -rn "시험 독자\|독자 패널\|베타 리딩\|reader-panel" .claude/skills/*/SKILL.md | grep -v "reader-panel/SKILL.md"
```
Expected: 출력 없음(= 다른 스킬 description이 같은 트리거를 물지 않음). 특히 `manuscript-verify`(검증/팩트체크)와 겹치지 않음을 확인.

- [ ] **Step 5: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
feat(reader-panel): 시험 독자 패널 편입(beta-reader 개명·재작성)

10명 가상 독자 병렬 리딩 → outputs/12_독자패널/chNN_reader.md 리포트.
비차단 온디맨드(manuscript-verify 성격), status 열 없음, 원고/책 두 기준 분리.
codex 조건 b 반영: "12"는 파이프라인 단계 아닌 리포트 namespace.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: CLAUDE.md 포인터 정합 + harness-maintain 감사 + CHANGELOG

**Files:**
- Modify: `CLAUDE.md` (필요 시 포인터만 — R4 준수)
- Modify: `docs/history/CHANGELOG.md`

**Interfaces:**
- Consumes: Task 1~7 결과.
- Produces: 정합성 통과 + 이력 기록.

- [ ] **Step 1: CLAUDE.md가 스킬 목록을 복제하지 않는지 확인(R4)**

Run:
```bash
cd ~/Documents/course-haness && grep -nE "reader-panel|pub-layout-check|pub-page-fit|screenshot" CLAUDE.md
```
Expected: 출력 없음(CLAUDE.md는 포인터만, 스킬 상세는 각 SKILL.md가 SSOT). 만약 스킬 목록이 있으면 복제를 넣지 말고 그대로 둔다(추가 작업 없음).

- [ ] **Step 2: R1 old+new 공존 감사**

Run:
```bash
cd ~/Documents/course-haness && grep -rnE "폐기|이전엔|구버전|deprecated|편집 검토 4종" CLAUDE.md .claude/skills docs/superpowers/specs 2>/dev/null | grep -v docs/history
```
Expected: 출력 없음(권위 문서에 옛 상태 잔존 없음).

- [ ] **Step 3: R2 dead-link 감사**

Run:
```bash
cd ~/Documents/course-haness && grep -rnE "skills/review|skills/(code|writing|planning|visual|beta-reader|prose-polish|pub-build|pub-typst-design|pub-image-optimize)/" .claude/skills CLAUDE.md docs/superpowers/specs 2>/dev/null
```
Expected: 출력 없음(삭제·미편입 스킬로의 죽은 링크 없음). 매치가 나오면 해당 링크를 정정.

- [ ] **Step 4: 전체 스킬 로드 sanity(frontmatter name == 폴더명)**

Run:
```bash
cd ~/Documents/course-haness && for d in .claude/skills/*/; do n=$(basename "$d"); fn=$(grep -m1 "^name:" "$d/SKILL.md" 2>/dev/null | sed 's/name:[[:space:]]*//'); [ "$n" != "$fn" ] && echo "MISMATCH $n != $fn"; done; echo "check-done"
```
Expected: `check-done`만 출력(불일치 없음). reader-panel·pub-layout-check·pub-page-fit·screenshot 모두 일치해야 함.

- [ ] **Step 5: CHANGELOG 한 줄 추가(맨 위)**

`docs/history/CHANGELOG.md`의 표 맨 위(헤더 다음 줄)에 추가:

```markdown
| 2026-07-07 | book-workflow 선별 마이그레이션 — 편입(pub-layout-check·pub-page-fit·screenshot·reader-panel·book-build 검토5종+합본규격), 정리(review 삭제·math 현행화), autocrop은 book-build 흡수 | skills/{pub-layout-check,pub-page-fit,screenshot,reader-panel,book-build,math}, review 삭제 | 책 품질 도구·독자 검증 편입, 중복/고아 제거 | [2026-07-07_book-workflow-migration](2026-07-07_book-workflow-migration/) |
```

- [ ] **Step 6: 커밋**

```bash
cd ~/Documents/course-haness && git add -A && git commit -m "$(cat <<'EOF'
docs(harness): book-workflow 마이그레이션 정합성 감사 + CHANGELOG

R1/R2/R4 감사 통과, frontmatter name==폴더명 확인, CHANGELOG 기록.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: 최종 검증 + 브랜치 완료

**Files:** (없음)

- [ ] **Step 1: 미편입 스킬이 실제로 안 들어왔는지 확인**

Run:
```bash
cd ~/Documents/course-haness && ls .claude/skills/ | grep -E "^(review|lecture|lecture-caption|code|writing|planning|visual|beta-reader|prose-polish|pub-build|pub-typst-design|pub-image-optimize|pub-html-build|pub-html-to-pdf|pub-page-fit-html|pub-studio|image-analyzer|design-doc-mermaid|pdf-ty|pub-info)$"
```
Expected: 출력 없음(배제 스킬 0개 존재).

- [ ] **Step 2: 편입 스킬 4종 존재 확인**

Run:
```bash
cd ~/Documents/course-haness && for s in pub-layout-check pub-page-fit screenshot reader-panel; do test -f .claude/skills/$s/SKILL.md && echo "OK $s" || echo "MISSING $s"; done
```
Expected: 4줄 모두 `OK`.

- [ ] **Step 3: superpowers:finishing-a-development-branch로 마무리**

구현 완료·검증 통과 후 `superpowers:finishing-a-development-branch` 스킬로 병합/PR/정리 옵션을 사용자에게 제시한다.

---

## Self-Review (작성자 체크 — 통과)

- **Spec 커버리지**: proposal §3-A(review삭제·math)=Task1, §3-B(layout-check·page-fit)=Task2·3, §3-B2(autocrop 흡수=별도 스킬 안 만듦)=Task2·3에서 pub-image-optimize 미생성으로 반영, §3-C(screenshot)=Task4, §3-D(검토5종)=Task5, §3-E(reader-panel)=Task7, §3-F(합본규격)=Task6, §6(감사·CHANGELOG)=Task8. 전 항목 태스크 존재.
- **Placeholder**: 각 편집 스텝에 실제 치환 문자열·검증 명령·기대출력 명시. "적절히" 류 없음.
- **Type/이름 정합**: 스킬 폴더명==name(pub-layout-check/pub-page-fit/screenshot/reader-panel), 출력 경로 `outputs/12_독자패널/chNN_reader.md` 일관, `pdf_layout_checker.py` CLI 계약 Task2 정의→Task3·5 소비 일치.
