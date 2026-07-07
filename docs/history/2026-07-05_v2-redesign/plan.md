# 통합 강의 제작 하네스 v2 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 3라인 하네스를 폐기하고, 원고 단일 원천의 10단계 파이프라인(개요서→원고초안→원고확정→실습코드→스토리보드→PPT preview→판서→시뮬레이터→PPTX→PDF책) + 오케스트라 스킬로 재구축한다.

**Architecture:** 각 단계는 `.claude/skills/`의 독립 스킬. 진행 상태는 `courses/{id}/status.md` 단일 파일(체크 테이블+산출물 인덱스+보류). 오케스트라 스킬 `course-pipeline`이 status.md를 읽어 미완료 단계부터 순서대로 스킬을 호출한다. 코드형 빌더는 `scripts/`의 Python(pptx) 및 lecture-book-workflow에서 이식한 Typst 파이프라인(책).

**Tech Stack:** Claude Code 스킬(md), Python 3 + python-pptx, Typst + Pandoc(책 조판), 기존 엔진 스킬(panseo-slide 판서 엔진, edu-sim-builder, image-gen, pub-d2-diagram).

**Spec:** `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` (섹션 번호 인용 시 "스펙 §N")

## Global Constraints

- 플랫폼: Windows 11. 외부 바이너리(typst/pandoc)와 폰트 경로는 Windows에서 동작해야 하며 macOS 경로 하드코딩 금지 (스펙 §10).
- 모든 신규 스킬: `.claude/skills/<name>/SKILL.md`, frontmatter는 `name` + `description`(한국어 트리거 문구 포함) 필수.
- 스토리보드/PPT preview/시뮬레이터는 **라이트 테마**. 디자인 기준은 `templates/golden/`의 골든 템플릿 3종 (스펙 §2-8).
- 원고 스키마: 차시 헤더 + 슬라이드당 9필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment), 차시당 평가 4지선다 1 + 진위형 2 (스펙 §6).
- 파일 규약: 과정 폴더 `courses/{course-id}/`, 차시 파일 접두사 `chNN` (스펙 §4).
- status.md 단계 열 이름(고정): `원고초안, 원고확정, 코드, 스토리보드, PPT프리뷰, 판서, 시뮬, PPTX, 책`.
- 삭제 작업은 반드시 legacy snapshot 커밋 **이후에만** 수행 (스펙 §12).
- 각 태스크 완료 시 커밋. 커밋 메시지 끝에 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- 각 단계 스킬 SKILL.md에는 "확정 체크리스트"와 "실패 시 repair 규칙" 섹션 필수 (스펙 §3).
- 참조 자산: lecture-book-workflow clone은 `C:\Users\ssarm\AppData\Local\Temp\claude\C--Users-ssarm-Documents-course-haness\09dbee56-4207-48fb-84a6-728876cea459\scratchpad\lecture-book-workflow` (이하 `$LBW`). scratchpad는 세션 휘발성이므로 **Task 13에서 필요 파일을 저장소로 복사한 후에만 의존**. clone이 사라졌으면 `git clone --depth 1 https://github.com/edu-openskill/lecture-book-workflow.git`으로 재확보 (Windows 경로길이 이슈 시 `git config core.longpaths true` 선행).

## 파일 구조 맵

```
(신규)
templates/golden/manuscript_golden.md          # GPT ch01 원고 사본 — 원고 포맷 기준
templates/golden/storyboard_golden.html        # GPT ch01 스토리보드 사본 — 디자인 기준
templates/golden/ppt_preview_golden.html       # GPT ch01 PPT preview 사본 — 디자인 기준
templates/status_template.md                   # status.md 초기 템플릿
.claude/skills/course-outline/SKILL.md         # 1단계
.claude/skills/manuscript-draft/SKILL.md       # 2단계 (+ references/manuscript-schema.md)
.claude/skills/manuscript-final/SKILL.md       # 3단계
.claude/skills/practice-code/SKILL.md          # 4단계
.claude/skills/storyboard/SKILL.md             # 5단계
.claude/skills/ppt-preview/SKILL.md            # 6단계
.claude/skills/pptx-build/SKILL.md             # 9단계 (+ scripts/build_pptx.py)
.claude/skills/book-build/SKILL.md             # 10단계 (+ references/: storytelling.md, style.md, templates/, scripts/, fonts/)
.claude/skills/humanizer/                      # $LBW에서 통째 복사
.claude/skills/course-pipeline/SKILL.md        # 오케스트라
scripts/pptx_spike.py                          # Task 11 spike (검증 후 유지)
scripts/build_pptx.py                          # 9단계 빌더
courses/spring-boot-basic/                     # 파일럿 과정 (ch01 산출물 이동)

(재작성)
.claude/skills/panseo-slide/SKILL.md           # 7단계 — 요약/그대로 2모드
.claude/skills/edu-sim-builder/SKILL.md        # 8단계 — 라이트+원고연동+표준화
CLAUDE.md                                      # 새 하네스 기준

(삭제 — Task 1)
.claude/skills/{filmed-lecture,offline-lecture,online-lecture,lecture-harness}/
.claude/agents/ 전체
docs/{harness-design-v1.md,claude-handoff-lecture-harness.md,harness-changelog.md}
docs/proposals/  docs/reviews/(v2 검증 기록 제외)
courses/{spring-mvc-2026,spring-mvc-offline-2026,spring-mvc-online-2026}/
```

---

### Task 1: Legacy snapshot 커밋 + 삭제/이동/골든 템플릿 배치

**Files:**
- Create: `templates/golden/manuscript_golden.md`, `templates/golden/storyboard_golden.html`, `templates/golden/ppt_preview_golden.html`
- Create(이동): `courses/spring-boot-basic/manuscripts/ch01.md`, `courses/spring-boot-basic/storyboards/ch01.html`, `courses/spring-boot-basic/ppt_previews/ch01.html`
- Delete: 위 파일 구조 맵의 삭제 목록 전부

**Interfaces:**
- Produces: `templates/golden/` 3종 (이후 모든 스킬 태스크가 디자인/포맷 기준으로 참조), `courses/spring-boot-basic/` 파일럿 폴더

- [ ] **Step 1: 전체 스냅샷 커밋** — 삭제 전 복구 지점. 저장소 루트에서:

```bash
git add -A
git commit -m "chore: legacy snapshot — v1 하네스 전체 보존 (v2 재구축 전 복구 지점)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

확인: `git log --oneline` 에 스냅샷 커밋 표시, `git status` clean.

- [ ] **Step 2: 골든 템플릿 복사 + ch01 산출물 이동** (PowerShell):

```powershell
New-Item -ItemType Directory -Force templates/golden, courses/spring-boot-basic/manuscripts, courses/spring-boot-basic/storyboards, courses/spring-boot-basic/ppt_previews
Copy-Item ch01_server-webapp-runtime.md templates/golden/manuscript_golden.md
Copy-Item ch01_storyboard.html templates/golden/storyboard_golden.html
Copy-Item ch01_ppt_preview.html templates/golden/ppt_preview_golden.html
Move-Item ch01_server-webapp-runtime.md courses/spring-boot-basic/manuscripts/ch01.md
Move-Item ch01_storyboard.html courses/spring-boot-basic/storyboards/ch01.html
Move-Item ch01_ppt_preview.html courses/spring-boot-basic/ppt_previews/ch01.html
```

- [ ] **Step 3: 구 하네스 삭제** (PowerShell). 삭제 전 각 경로 존재 확인, 없는 경로는 건너뜀:

```powershell
Remove-Item -Recurse -Force -Confirm:$false .claude/skills/filmed-lecture, .claude/skills/offline-lecture, .claude/skills/online-lecture, .claude/skills/lecture-harness, .claude/agents, docs/proposals, courses/spring-mvc-2026, courses/spring-mvc-offline-2026, courses/spring-mvc-online-2026
Remove-Item -Force docs/harness-design-v1.md, docs/claude-handoff-lecture-harness.md, docs/harness-changelog.md
Get-ChildItem docs/reviews -File | Where-Object { $_.Name -ne '2026-07-05_v2-redesign-codex-review.md' } | Remove-Item -Force
```

주의: `.claude/skills/panseo-slide`, `panseo-board`, `edu-sim-builder`, `image-gen`, `pub-d2-diagram`, `참고스킬/`은 **삭제 금지**.

- [ ] **Step 4: 검증** — 다음이 모두 참:

```powershell
@('templates/golden/manuscript_golden.md','templates/golden/storyboard_golden.html','templates/golden/ppt_preview_golden.html','courses/spring-boot-basic/manuscripts/ch01.md') | ForEach-Object { if (-not (Test-Path $_)) { Write-Error "MISSING: $_" } }
@('.claude/agents','docs/harness-design-v1.md','courses/spring-mvc-2026','.claude/skills/lecture-harness') | ForEach-Object { if (Test-Path $_) { Write-Error "SHOULD BE DELETED: $_" } }
@('.claude/skills/panseo-slide','.claude/skills/edu-sim-builder','.claude/skills/image-gen','.claude/skills/pub-d2-diagram','.claude/skills/panseo-board') | ForEach-Object { if (-not (Test-Path $_)) { Write-Error "ENGINE SKILL LOST: $_" } }
```

Expected: 에러 출력 없음.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "chore: v1 하네스 제거, 골든 템플릿·파일럿 과정 배치

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: CLAUDE.md 재작성 + status 템플릿

**Files:**
- Modify: `CLAUDE.md` (전체 교체)
- Create: `templates/status_template.md`
- Create: `courses/spring-boot-basic/status.md` (템플릿 인스턴스)

**Interfaces:**
- Produces: status.md 규약(모든 단계 스킬이 읽고 갱신), CLAUDE.md 트리거 표(스킬 라우팅)

- [ ] **Step 1: `templates/status_template.md` 작성** — 아래 내용 그대로 (플레이스홀더 `{course-id}`, `{N}`만 인스턴스화 시 치환):

```markdown
# {course-id} 진행 상태

과정개요서: ⬜ (`1.과정개요서.md`)

| 차시 | 원고초안 | 원고확정 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
|---|---|---|---|---|---|---|---|---|---|
| ch01 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

기호: ⬜ 미착수 / 🔄 진행 중(사용자 확인 대기 포함) / ✅ 확정 / ➖ 보류(사유는 아래)

다음 할 일: 과정개요서 작성

## 산출물 인덱스 (확정 시 자동 갱신)
<!-- 형식: - chNN 산출물명: 경로 (확정 YYYY-MM-DD[, 검증 로그: 경로]) -->

## 보류/누락
<!-- 형식: - chNN 산출물명: 사유 (YYYY-MM-DD) -->
```

- [ ] **Step 2: `courses/spring-boot-basic/status.md` 생성** — 템플릿에서 `{course-id}`→`spring-boot-basic` 치환. ch01은 GPT 원고가 이미 있으므로 `원고초안 ✅, 원고확정 🔄`(파일럿 티키타카 대상), 스토리보드·PPT프리뷰는 GPT 산출물이 있으나 새 스킬 검증 전이므로 `🔄` 표기. `다음 할 일: ch01 원고 확정(manuscript-final) — 기존 GPT 원고 기반 티키타카`. 산출물 인덱스에 3개 파일 경로 기록.

- [ ] **Step 3: CLAUDE.md 전체 재작성** — 필수 내용:
  - 제목: "강의 제작 하네스 v2 — 원고 단일 원천 10단계 파이프라인"
  - 파이프라인 표 (스펙 §3 표를 그대로: # / 스킬 / 산출물 / 확정 방식)
  - 트리거 라우팅: "과정 만들자/개요서" → `course-outline`, "원고 초안" → `manuscript-draft`, "원고 수정/완성" → `manuscript-final`, "실습 코드" → `practice-code`, "스토리보드" → `storyboard`, "PPT 프리뷰" → `ppt-preview`, "판서" → `panseo-slide`, "시뮬레이터" → `edu-sim-builder`, "PPTX" → `pptx-build`, "책/PDF" → `book-build`, "이어서 하자/다음 단계/전체 실행" → `course-pipeline`
  - 규약: 디렉터리 구조(스펙 §4), status.md 갱신 의무(단계 스킬은 시작 시 🔄, 사용자 확정 시 ✅ + 산출물 인덱스 행 추가), 골든 템플릿 위치
  - 유지 규칙: "구조 변경은 `docs/proposals/` 계획서 + codex 사전 검증(`codex exec --sandbox read-only '...' </dev/null`, Git Bash) 후 반영, 결과는 `docs/reviews/` 저장" (기존 규칙 승계)
  - 설계 문서 포인터: 스펙 경로, 이 계획 경로
  - 강의 현황: `spring-boot-basic` 파일럿 진행 중(ch01 원고확정 단계부터)

- [ ] **Step 4: 검증** — `templates/status_template.md`의 표 열 이름이 Global Constraints의 고정 열 이름과 일치하는지, CLAUDE.md의 스킬명 11개가 파일 구조 맵의 스킬 폴더명과 일치하는지 눈으로 대조.

- [ ] **Step 5: 커밋**

```bash
git add CLAUDE.md templates/status_template.md courses/spring-boot-basic/status.md
git commit -m "docs: CLAUDE.md v2 재작성 + status 템플릿/파일럿 상태 파일

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `course-outline` 스킬 (1단계)

**Files:**
- Create: `.claude/skills/course-outline/SKILL.md`

**Interfaces:**
- Produces: `courses/{id}/1.과정개요서.md` + `courses/{id}/research/{주제}.md` + status.md 생성/갱신. 개요서 필수 섹션: 과정명/대상자/과정목표(1개)/세부 학습목표(N개)/차시표(번호·차시명·차시내용·실습 여부)/NCS 연계(해당 시)/실습 도메인 연속성.

- [ ] **Step 1: SKILL.md 작성** — frontmatter:

```yaml
---
name: course-outline
description: 개발자 강의 과정개요서를 사용자와 함께 만든다. "과정 만들자", "과정개요서 만들어줘", "새 강의 기획", "커리큘럼 짜자" 요청 시 사용. 리서치 서브에이전트로 최신 자료를 조사한 뒤 대상자→과정목표→세부목표→차시 순으로 대화하며 1.과정개요서.md를 확정한다.
---
```

본문 필수 내용 (스펙 §5의 8단계 흐름을 그대로 절차화):
1. "어떤 과정을 만들까요?" 질문 (이미 주제를 말했으면 생략)
2. 과정 폴더 결정(`courses/{kebab-case-id}/`) 후 **리서치 서브에이전트 디스패치** — Agent 도구(general-purpose)로 "주제의 최신 동향/버전/공식 문서/실무 채용 요구/유사 강의 커리큘럼을 웹 검색해 `courses/{id}/research/{주제}.md`로 저장(주장-출처 쌍)" 지시. 메인 컨텍스트에는 결과 파일 요약만 반입.
3. 리서치 md를 읽고 주제를 사용자 눈높이로 설명
4. **대상자 선정** — AskUserQuestion으로 후보 제시(예: 완전 초보/전공 신입/1년차). 대상자가 이후 모든 후보 제시의 난이도 기준이 됨을 본문에 명시
5. 과정목표 1개 — 후보 3개 제시(선택 또는 직접 입력)
6. 세부 학습목표 — 항목마다 후보 3개 제시
7. 차시 수/차시명/차시내용을 표로 함께 정리 (실습 도메인은 하나로 이어가도록 제안 — 예: Todo 도메인)
8. 개요서 초안 생성 → 사용자 확인/수정 → `1.과정개요서.md` 저장, `templates/status_template.md`로 status.md 생성(차시 행 수 = 확정 차시 수), 과정개요서 ✅ 표기

**확정 체크리스트** 섹션: 필수 섹션 7종 존재 / 차시표의 각 차시에 내용·실습 여부 기재 / 대상자·목표·차시 난이도 정합. **repair 규칙** 섹션: 체크 실패 항목은 해당 대화 단계로 되돌아가 재확정(전체 재시작 금지).

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/course-outline/SKILL.md -Pattern '^name: course-outline', '확정 체크리스트', 'repair' | ForEach-Object Line
```

Expected: 3개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/course-outline
git commit -m "feat: course-outline 스킬 (1단계 — 과정개요서 대화 생성)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: `manuscript-draft` 스킬 + 원고 스키마 (2단계)

**Files:**
- Create: `.claude/skills/manuscript-draft/SKILL.md`
- Create: `.claude/skills/manuscript-draft/references/manuscript-schema.md`

**Interfaces:**
- Consumes: `1.과정개요서.md`, `research/*.md`, `templates/golden/manuscript_golden.md`
- Produces: `manuscripts/chNN_draft.md` (스키마 준수). 스키마 문서는 manuscript-final/storyboard/ppt-preview/pptx-build/book-build가 참조.

- [ ] **Step 1: `references/manuscript-schema.md` 작성** — 스펙 §6을 규범 문서화:
  - 차시 헤더 필드: 과정명/회차명/차시 목표/NCS 연계(해당 시)/예상 분량/사용 출처 목록
  - 슬라이드 블록 문법: `## Slide N. 제목` + 9필드 순서 고정(`**Screen**`, `**Easy analogy**`, `**Practical case**`, `**Visual asset**`, `**Source**`, `**Narration**`, `**Practice**`, `**Assessment**`) — 해당 없음은 `- 없음.` 명기(필드 생략 금지)
  - Visual asset 하위 유형: `GPT image prompt:`(백틱 프롬프트), D2 초안(```d2 코드펜스), 화면 캡처 계획, 코드 블록
  - 평가 규칙: 차시 전체에서 4지선다 1개 + 진위형 2개, 각 문항에 보기/정답/해설
  - 초안 원칙: 압축 금지, 30분 초과 허용
  - 골든 예시 포인터: `templates/golden/manuscript_golden.md`

- [ ] **Step 2: SKILL.md 작성** — frontmatter `name: manuscript-draft`, description에 트리거("원고 초안", "N차시 원고 만들어줘"). 본문 절차:
  1. status.md에서 대상 차시 확인(인자로 chNN 지정 가능)
  2. 개요서의 해당 차시 내용 + research md를 근거로, **스키마 준수 초안**을 `manuscripts/chNN_draft.md`로 생성. 분량이 크므로 서브에이전트(Agent, general-purpose)에 스키마 문서·개요서·리서치 경로를 주고 위임 가능
  3. 근거자료: Source 필드는 리서치 md의 주장-출처 쌍에서 인용, 새 주장은 웹 검색으로 출처 확보
  4. 생성 후 확정 체크리스트 통과 확인 → 사용자에게 슬라이드 목록 요약 보고 → 확인받으면 status.md 원고초안 ✅
  
  **확정 체크리스트**: 전 슬라이드 9필드 존재 / 평가 문항 4지선다1+진위형2 / 모든 Source에 URL 또는 문서명 / Narration은 그대로 읽을 수 있는 존댓말 문장. **repair**: 실패 필드만 해당 슬라이드 단위로 재생성.

- [ ] **Step 3: 구조 검증** — 골든 원고가 스키마 문서와 모순되지 않는지 확인:

```powershell
Select-String -LiteralPath templates/golden/manuscript_golden.md -Pattern '^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*' | Group-Object { $_.Matches[0].Groups[1].Value } | Select-Object Name, Count
```

Expected: 8개 필드명이 모두 등장(슬라이드 수만큼). 스키마 문서의 필드명 표기가 골든과 다르면 **스키마 쪽을 골든에 맞춰 수정**.

- [ ] **Step 4: 커밋**

```bash
git add .claude/skills/manuscript-draft
git commit -m "feat: manuscript-draft 스킬 + 원고 스키마 (2단계)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: `manuscript-final` 스킬 (3단계)

**Files:**
- Create: `.claude/skills/manuscript-final/SKILL.md`

**Interfaces:**
- Consumes: `manuscripts/chNN_draft.md`, `references/manuscript-schema.md`(manuscript-draft 소유)
- Produces: `manuscripts/chNN.md` (확정 원고 — 이후 4~10단계의 단일 입력)

- [ ] **Step 1: SKILL.md 작성** — frontmatter `name: manuscript-final`, 트리거("원고 수정", "원고 완성", "티키타카"). 본문 절차:
  1. `chNN_draft.md`를 `chNN.md`로 복사(이미 있으면 이어서), status.md 원고확정 🔄
  2. **티키타카 루프**: 사용자 지시(슬라이드 추가/삭제/압축/비유 교체/나레이션 수정 등)를 받아 슬라이드 단위로 수정. 수정할 때마다 스키마 필드 무결성 유지. 한 번에 한 요청 처리 후 변경 요약 보고
  3. 시각 자산 확정 지원: 사용자가 원하면 `image-gen` 스킬로 `GPT image prompt` 실생성 → `assets/images/chNN/`, `pub-d2-diagram` 스킬로 D2 렌더 → `assets/diagrams/`. 생성된 파일 경로를 해당 슬라이드 Visual asset에 병기
  4. 사용자가 "확정"이라 하면 확정 체크리스트 실행 → status.md 원고확정 ✅ + 산출물 인덱스 기록
  
  **확정 체크리스트**: 스키마 전 필드 무결 / draft 대비 의도된 변경만 존재(임의 삭제 없음) / Visual asset에 생성 완료된 자산은 실경로 병기. **repair**: 체크 실패 슬라이드만 사용자에게 보고 후 수정.

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/manuscript-final/SKILL.md -Pattern '^name: manuscript-final', 'image-gen', 'pub-d2-diagram', '확정 체크리스트' | ForEach-Object Line
```

Expected: 4개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/manuscript-final
git commit -m "feat: manuscript-final 스킬 (3단계 — 원고 티키타카 확정)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: `practice-code` 스킬 (4단계)

**Files:**
- Create: `.claude/skills/practice-code/SKILL.md`

**Interfaces:**
- Consumes: `manuscripts/chNN.md`의 Practice 필드
- Produces: `code/chNN/` (실행 가능한 실습 코드) + `code/chNN/validation.log` (실행 검증 기록). 이후 단계는 코드 블록을 이 폴더에서 발췌.

- [ ] **Step 1: SKILL.md 작성** — frontmatter `name: practice-code`, 트리거("실습 코드 만들어줘", "코드 검증"). 본문 절차:
  1. 확정 원고의 Practice 필드를 전부 수집해 실습 시나리오 순서 재구성
  2. `code/chNN/`에 코드 생성. 단계형 실습이면 하위 폴더 `step1/`, `step2/`, `final/` 구조 허용
  3. **실행 검증(필수)**: 과정 기술 스택에 맞는 실제 실행 — 예: Spring Boot면 `gradlew build` + 앱 기동 + `curl`/`Invoke-WebRequest`로 엔드포인트 응답 확인. 모든 명령과 출력 요지를 `code/chNN/validation.log`에 기록(실행 일시 포함)
  4. **원고 역수정**: 코드와 원고의 Practice 지시가 어긋나면(버전/명령/결과 상이) 차이를 사용자에게 보고하고 승인 후 원고 수정
  5. 검증 통과 + 사용자 확인 → status.md 코드 ✅ + 인덱스에 validation.log 경로 기록
  
  **확정 체크리스트**: validation.log 존재·통과 기록 / 원고 Practice의 모든 코드 블록이 code/chNN 실물과 일치 / 실행 전제(JDK 버전 등)가 원고 차시 헤더와 일치. **repair**: 실패 시 코드 수정 후 재실행(원고 임의 수정 금지 — 사용자 승인 필요).

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/practice-code/SKILL.md -Pattern '^name: practice-code', 'validation\.log', '역수정' | ForEach-Object Line
```

Expected: 3개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/practice-code
git commit -m "feat: practice-code 스킬 (4단계 — 실습 코드 생성·실행 검증)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: `storyboard` 스킬 (5단계)

**Files:**
- Create: `.claude/skills/storyboard/SKILL.md`

**Interfaces:**
- Consumes: `manuscripts/chNN.md`, `templates/golden/storyboard_golden.html`
- Produces: `storyboards/chNN.html` — 슬라이드별 카드(슬라이드 미리보기 + 나레이션/비유/실무사례/실습/평가/출처 전개), 라이트 테마, 단일 자립 HTML

- [ ] **Step 1: SKILL.md 작성** — frontmatter `name: storyboard`, 트리거("스토리보드 만들어줘"). 본문 핵심 규칙:
  1. **골든 템플릿이 디자인 규범**: `templates/golden/storyboard_golden.html`의 CSS 변수(`--ink #17202a`, `--line #d9dee7`, 배경 `#eceff4`, 카드 흰색+라운드+그림자), Malgun Gothic 폰트, `.slide-head`/`.slide-body`/`.slide-preview` 구조를 따른다. 새 색·다크 테마 도입 금지
  2. 원고의 슬라이드 블록을 1:1로 카드화 — 카드 상단에 슬라이드 화면 미리보기(Screen 필드 재현), 하단에 나머지 필드를 라벨링된 섹션으로
  3. 생성 이미지가 이미 있으면(`assets/images/chNN/`) 미리보기에 상대 경로로 삽입, 없으면 프롬프트 텍스트를 placeholder 박스로
  4. 외부 CDN 의존 금지(자립 파일), 사용자 확인 후 status.md 스토리보드 ✅
  
  **확정 체크리스트**: 카드 수 = 원고 슬라이드 수 / 모든 카드에 Narration 표시 / 라이트 팔레트 준수 / 브라우저 열림 확인(Playwright 또는 사용자 확인). **repair**: 누락 카드만 재생성.

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/storyboard/SKILL.md -Pattern '^name: storyboard', 'storyboard_golden', '라이트' | ForEach-Object Line
```

Expected: 3개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/storyboard
git commit -m "feat: storyboard 스킬 (5단계 — 라이트 테마 HTML 스토리보드)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: `ppt-preview` 스킬 (6단계)

**Files:**
- Create: `.claude/skills/ppt-preview/SKILL.md`

**Interfaces:**
- Consumes: `manuscripts/chNN.md`(Screen/Visual asset), `storyboards/chNN.html`(순서 확인용), `templates/golden/ppt_preview_golden.html`
- Produces: `ppt_previews/chNN.html` — 16:9 슬라이드 캔버스 나열. **panseo-slide '그대로 모드'와 pptx-build가 이 파일의 슬라이드 구조를 소비**하므로 슬라이드 루트는 `<section class="ppt-slide" data-slide="N">` + 내부 `.ppt-canvas`로 고정.

- [ ] **Step 1: SKILL.md 작성** — frontmatter `name: ppt-preview`, 트리거("PPT 프리뷰", "PPT 미리보기"). 본문 핵심 규칙:
  1. 골든 템플릿(`ppt_preview_golden.html`)의 캔버스 규격을 따름: `.ppt-canvas { aspect-ratio: 16/9 }`, 라이트 팔레트, 제목+짧은 문구+이미지/D2/코드만(긴 설명 금지 — 설명은 원고와 스토리보드 담당)
  2. **DOM 계약(후속 단계 소비용)**: 각 슬라이드는 `<section class="ppt-slide" data-slide="N">` 루트, 캔버스는 `.ppt-canvas`, 슬라이드 제목은 캔버스 내 `h2`. 이 계약을 SKILL.md에 "출력 계약" 섹션으로 명시
  3. Screen 필드의 화면 구성 지시를 재현, Visual asset의 실자산(있으면 상대경로) 삽입
  4. 사용자 확인 후 status.md PPT프리뷰 ✅
  
  **확정 체크리스트**: `data-slide` 연번 = 원고 슬라이드 수 / 캔버스당 단어 수 과밀 여부(제목 제외 본문 45단어 이내 권고) / 라이트 팔레트. **repair**: 과밀 슬라이드는 문구 축약(원고는 불변).

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/ppt-preview/SKILL.md -Pattern '^name: ppt-preview', 'data-slide', '출력 계약' | ForEach-Object Line
```

Expected: 3개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/ppt-preview
git commit -m "feat: ppt-preview 스킬 (6단계 — 16:9 라이트 PPT 미리보기, DOM 출력 계약)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: `panseo-slide` 재작성 (7단계 — 요약/그대로 2모드)

**Files:**
- Modify: `.claude/skills/panseo-slide/SKILL.md` (전면 재작성)
- Create(정리): `.claude/skills/panseo-slide/references/engine.md` (판서 엔진 요구 명세 — 기존 스킬에서 추출)

**Interfaces:**
- Consumes: `manuscripts/chNN.md`(요약 모드) 또는 `ppt_previews/chNN.html`의 `.ppt-slide` DOM(그대로 모드)
- Produces: `panseo/chNN.html`(판서 기능 내장 슬라이드) + `panseo/chNN_대본.md`(판서대본)

- [ ] **Step 1: 기존 스킬 인벤토리** — 재작성 전에 엔진 자산 파악:

```powershell
Get-ChildItem .claude/skills/panseo-slide -Recurse | Select-Object FullName
```

판서 엔진(펜 드로잉/모눈 격자/✂사각형 선택 이동/✋획 객체 이동/파괴적 지우개/판서모드 전환/전체화면)을 구현한 템플릿·코드 조각의 위치를 확인하고, 그 요구 명세(기능 목록 + 터치/펜 이벤트 처리 방식)를 `references/engine.md`로 정리. 기존 파일 중 엔진 템플릿은 유지, "하네스 통합 재정의" 섹션과 rich/summary 프로파일 서술은 폐기 대상.

- [ ] **Step 2: SKILL.md 전면 재작성** — frontmatter:

```yaml
---
name: panseo-slide
description: 판서 기능(펜·모눈·선택이동·지우개·빈 칠판 전환)이 내장된 강의 슬라이드 HTML과 판서대본을 만든다. "판서 슬라이드 만들어줘", "판서 자료" 요청 시 사용. 요약 모드(원고를 판서용으로 요약)와 그대로 모드(PPT 프리뷰 내용 그대로 + 판서 레이어) 중 선택.
---
```

본문 절차:
1. **모드 질문(필수)**: AskUserQuestion — `요약 모드`(원고를 판서 여백 있는 저밀도 슬라이드로 요약) / `그대로 모드`(ppt_previews/chNN.html의 각 `.ppt-slide` 캔버스 내용을 그대로 이식하고 판서 레이어만 추가)
2. 요약 모드: 원고 슬라이드당 핵심 1~2줄+키워드만, 화면 하단 1/3은 판서 여백 확보
3. 그대로 모드: `data-slide` 순서 보존, 캔버스 마크업 이식(스타일 포함), 판서 캔버스를 슬라이드 위 오버레이로
4. 두 모드 공통: `references/engine.md`의 판서 엔진 전 기능 탑재, 갤럭시탭 펜·터치 동작 전제, 단일 자립 HTML
5. 판서대본 `chNN_대본.md`: 슬라이드별로 "무엇을 판서할지(그릴 도형/쓸 키워드)" + 말할 요지
6. 사용자 확인 후 status.md 판서 ✅

**확정 체크리스트**: 엔진 기능 7종 전부 동작(브라우저 확인) / 슬라이드 수 일치 / 대본의 슬라이드 번호 정합. **repair**: 엔진 결함은 engine.md 명세 기준으로 수정, 콘텐츠 결함은 해당 슬라이드만 재생성.

- [ ] **Step 3: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/panseo-slide/SKILL.md -Pattern '요약 모드', '그대로 모드', 'ppt-slide' | ForEach-Object Line
if (Select-String -LiteralPath .claude/skills/panseo-slide/SKILL.md -Pattern '하네스 통합 재정의') { Write-Error "구 재정의 섹션 잔존" }
```

Expected: 앞 3개 매치, 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add .claude/skills/panseo-slide
git commit -m "feat: panseo-slide 재작성 (7단계 — 요약/그대로 2모드)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: `edu-sim-builder` 재작성 (8단계 — 라이트+원고연동+표준화)

**Files:**
- Modify: `.claude/skills/edu-sim-builder/SKILL.md` (전면 재작성, 기존 본문의 유효한 제작 노하우는 선별 승계)

**Interfaces:**
- Consumes: `manuscripts/chNN.md`의 대상 슬라이드 블록(비유/나레이션/Visual asset), `storyboards/chNN.html`(슬라이드 목록 제시용)
- Produces: `simulators/chNN_{주제}.html` (단일 자립 HTML, 라이트 테마)

- [ ] **Step 1: SKILL.md 재작성** — frontmatter `name: edu-sim-builder`, description은 기존 트리거 문구 유지 + "원고 연동" 추가. 본문 필수 내용:
  1. **입력 계약**: 과정 파이프라인에서 호출되면 원고의 대상 슬라이드 블록을 읽어 비유(Easy analogy)를 시뮬레이터의 중심 은유로, Narration을 단계 설명의 근거로 사용. 단독 호출(파이프라인 밖)도 기존처럼 지원
  2. **대상 선정 흐름**: 원고/스토리보드의 슬라이드 목록을 보여주고 "어떤 슬라이드를 시뮬레이터로 만들까요?" 질문
  3. **라이트 테마 기본**: 골든 템플릿 팔레트(`--ink #17202a` 계열, 흰 배경, 파랑/초록 포인트)와 통일. 다크는 명시 요청 시만
  4. **표준 구성 요소(필수 내장)**: ① 단계별 시나리오 진행(이전/다음, 진행 표시) ② 비유 뷰 ↔ 실제 개념 뷰 토글 ③ 애니메이션 속도 조절 ④ 리셋 ⑤ 각 단계 한 줄 설명 패널
  5. **품질 체크리스트**: 버튼 전부 동작 / 상태 꼬임 없이 리셋 / 토글 후에도 단계 동기화 / 모바일(태블릿) 폭 대응 / 외부 의존 0
  6. 사용자 확인 후 status.md 시뮬 ✅ (보류 선택 시 ➖ + 보류 사유 기록)

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/edu-sim-builder/SKILL.md -Pattern '입력 계약', '토글', '라이트', 'Easy analogy' | ForEach-Object Line
```

Expected: 4개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/edu-sim-builder
git commit -m "feat: edu-sim-builder 재작성 (8단계 — 라이트 기본·원고 연동·표준 구성)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: PPTX speaker-notes spike

**Files:**
- Create: `scripts/pptx_spike.py`

**Interfaces:**
- Produces: python-pptx로 발표자 노트 삽입이 Windows에서 동작함을 증명 (Task 12의 전제)

- [ ] **Step 1: python-pptx 설치 확인/설치**

```powershell
python -m pip show python-pptx; if (-not $?) { python -m pip install python-pptx }
```

- [ ] **Step 2: spike 스크립트 작성** — `scripts/pptx_spike.py`:

```python
"""python-pptx speaker notes spike: 슬라이드 1장 + 노트 삽입 → 재독해 검증."""
from pptx import Presentation
from pptx.util import Inches, Pt

OUT = "scripts/spike_out.pptx"
NOTE = "안녕하세요. 이번 시간에는 스프링 부트 실행 환경을 살펴보겠습니다."

def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)   # 16:9
    prs.slide_height = Inches(7.5)
    slide = prs.slides.add_slide(prs.slide_layouts[5])  # Title Only
    slide.shapes.title.text = "서버 프로그램과 실행 환경"
    body = slide.shapes.add_textbox(Inches(1), Inches(2), Inches(11), Inches(4))
    body.text_frame.text = "요청을 받는다 → 처리한다 → 응답을 돌려준다"
    body.text_frame.paragraphs[0].font.size = Pt(28)
    slide.notes_slide.notes_text_frame.text = NOTE   # 발표자 노트
    prs.save(OUT)

def verify():
    prs = Presentation(OUT)
    slide = prs.slides[0]
    assert slide.has_notes_slide, "notes_slide 없음"
    got = slide.notes_slide.notes_text_frame.text
    assert got == NOTE, f"노트 불일치: {got!r}"
    print("SPIKE PASS: speaker notes OK")

if __name__ == "__main__":
    build()
    verify()
```

- [ ] **Step 3: 실행 검증**

```powershell
python scripts/pptx_spike.py
```

Expected: `SPIKE PASS: speaker notes OK`. 추가로 `scripts/spike_out.pptx`를 PowerPoint(설치돼 있으면)로 열어 발표자 노트 표시를 사용자 또는 구현자가 눈으로 확인. 실패 시(라이브러리 결함) 스펙 §9의 대안(OOXML 직접 수정)으로 전환하고 Task 12 설계를 조정 — 이 경우 사용자에게 보고.

- [ ] **Step 4: 산출물 정리 후 커밋** — `scripts/spike_out.pptx`는 커밋하지 않음:

```bash
rm scripts/spike_out.pptx
git add scripts/pptx_spike.py
git commit -m "feat: pptx speaker-notes spike 통과 (python-pptx notes_slide 검증)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 12: `pptx-build` 스킬 + 빌더 (9단계)

**Files:**
- Create: `scripts/build_pptx.py`
- Create: `scripts/test_build_pptx.py`
- Create: `.claude/skills/pptx-build/SKILL.md`

**Interfaces:**
- Consumes: `manuscripts/chNN.md`(스키마 §6 문법), `assets/images/chNN/`, `assets/diagrams/`
- Produces: `pptx/chNN.pptx`. 빌더 CLI: `python scripts/build_pptx.py <manuscript.md> <out.pptx> [--assets-root <course-dir>]`
- 핵심 함수: `parse_manuscript(md_text) -> list[Slide]` (Slide = dict: `title, screen_lines, image_paths, code, narration`)

- [ ] **Step 1: 실패하는 테스트 작성** — `scripts/test_build_pptx.py`:

```python
"""build_pptx 파서/빌더 테스트 (pytest)."""
import textwrap
from pptx import Presentation
from build_pptx import parse_manuscript, build_pptx

SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## 차시 정보
    - 과정명: 테스트 과정

    ## Slide 1. 표지
    **Screen**
    - 제목: 테스트 강의
    - 부제: 부제목입니다
    **Narration**
    - 안녕하세요. 첫 번째 나레이션입니다.

    ## Slide 2. 본문
    **Screen**
    - 제목: 본문 슬라이드
    - 짧은 문구:
      - 첫 번째 포인트
      - 두 번째 포인트
    **Visual asset**
    - GPT image prompt: `a test image`
    **Narration**
    - 두 번째 나레이션입니다.
    """)

def test_parse_slide_count_and_titles():
    slides = parse_manuscript(SAMPLE)
    assert len(slides) == 2
    assert slides[0]["title"] == "표지"
    assert slides[1]["title"] == "본문"

def test_parse_narration_and_screen():
    slides = parse_manuscript(SAMPLE)
    assert slides[0]["narration"].startswith("안녕하세요.")
    assert "첫 번째 포인트" in slides[1]["screen_lines"]

def test_build_writes_notes(tmp_path):
    out = tmp_path / "out.pptx"
    build_pptx(SAMPLE, str(out), assets_root=str(tmp_path))
    prs = Presentation(str(out))
    assert len(prs.slides) == 2
    assert prs.slides[0].notes_slide.notes_text_frame.text.startswith("안녕하세요.")
```

- [ ] **Step 2: 실패 확인**

```powershell
cd scripts; python -m pytest test_build_pptx.py -v; cd ..
```

Expected: FAIL — `ModuleNotFoundError: No module named 'build_pptx'` (pytest 미설치 시 `python -m pip install pytest` 선행).

- [ ] **Step 3: 빌더 구현** — `scripts/build_pptx.py`:

```python
"""원고(md, manuscript-schema 문법) → PPTX. 발표자 노트에 Narration 삽입.

사용: python scripts/build_pptx.py <manuscript.md> <out.pptx> [--assets-root <course-dir>]
"""
import argparse
import re
import sys
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt

SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
IMG_PATH_RE = re.compile(r"(assets[/\\][^\s)`\"']+\.(?:png|jpg|jpeg|webp))", re.IGNORECASE)

def parse_manuscript(md_text):
    """슬라이드 블록을 dict 리스트로. keys: title, screen_lines, image_paths, code, narration"""
    slides, cur, field = [], None, None
    in_code, code_lines = False, []
    for line in md_text.splitlines():
        m = SLIDE_RE.match(line)
        if m:
            if cur:
                slides.append(cur)
            cur = {"title": m.group(2).strip(), "screen_lines": [], "image_paths": [], "code": "", "narration": ""}
            field, in_code, code_lines = None, False, []
            continue
        if cur is None:
            continue
        f = FIELD_RE.match(line)
        if f:
            field = f.group(1)
            continue
        if line.strip().startswith("```"):
            if in_code:
                if field == "Visual asset":
                    cur["code"] = "\n".join(code_lines)
                in_code, code_lines = False, []
            else:
                in_code = True
            continue
        if in_code:
            code_lines.append(line)
            continue
        text = line.strip().lstrip("-").strip()
        if not text:
            continue
        if field == "Screen":
            cur["screen_lines"].append(text)
        elif field == "Narration":
            cur["narration"] = (cur["narration"] + " " + text).strip()
        elif field == "Visual asset":
            for im in IMG_PATH_RE.findall(line):
                cur["image_paths"].append(im)
    if cur:
        slides.append(cur)
    return slides

def build_pptx(md_text, out_path, assets_root="."):
    slides = parse_manuscript(md_text)
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    layout = prs.slide_layouts[5]  # Title Only
    for s in slides:
        slide = prs.slides.add_slide(layout)
        slide.shapes.title.text = s["title"]
        top = Inches(1.8)
        body_lines = [l for l in s["screen_lines"] if not l.startswith("제목:")]
        if body_lines:
            box = slide.shapes.add_textbox(Inches(0.8), top, Inches(7.0), Inches(4.8))
            tf = box.text_frame
            tf.word_wrap = True
            for i, l in enumerate(body_lines[:8]):
                p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
                p.text = l
                p.font.size = Pt(22)
        for im in s["image_paths"][:1]:
            p = Path(assets_root) / im
            if p.exists():
                slide.shapes.add_picture(str(p), Inches(8.2), top, width=Inches(4.5))
        if s["code"]:
            cb = slide.shapes.add_textbox(Inches(0.8), Inches(5.2), Inches(11.7), Inches(1.8))
            cf = cb.text_frame
            cf.word_wrap = True
            cf.text = s["code"][:600]
            cf.paragraphs[0].font.name = "Consolas"
            cf.paragraphs[0].font.size = Pt(12)
        if s["narration"]:
            slide.notes_slide.notes_text_frame.text = s["narration"]
    prs.save(out_path)
    return len(slides)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manuscript")
    ap.add_argument("out")
    ap.add_argument("--assets-root", default=".")
    args = ap.parse_args()
    md = Path(args.manuscript).read_text(encoding="utf-8")
    n = build_pptx(md, args.out, args.assets_root)
    print(f"OK: {n} slides -> {args.out}")

if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
cd scripts; python -m pytest test_build_pptx.py -v; cd ..
```

Expected: 3 passed.

- [ ] **Step 5: 실데이터 스모크** — 파일럿 원고로 실행:

```powershell
New-Item -ItemType Directory -Force courses/spring-boot-basic/pptx
python scripts/build_pptx.py courses/spring-boot-basic/manuscripts/ch01.md courses/spring-boot-basic/pptx/ch01.pptx --assets-root courses/spring-boot-basic
```

Expected: `OK: <슬라이드수> slides -> ...ch01.pptx` (슬라이드 수 = 원고 `## Slide` 수와 일치).

- [ ] **Step 6: SKILL.md 작성** — frontmatter `name: pptx-build`, 트리거("PPTX 만들어줘", "PPT 완성"). 본문: 위 CLI 실행 → 슬라이드 수 검증 → 이미지 누락 경고 목록 보고 → PowerPoint에서 열어 확인 요청 → 확정 시 status.md PPTX ✅. **확정 체크리스트**: 슬라이드 수 일치 / 전 슬라이드 노트 존재(Narration 있는 슬라이드) / 이미지 깨짐 없음(사용자 확인). **repair**: 파서가 놓친 필드는 build_pptx.py 수정으로 대응(원고 수정 금지), 수정 후 pytest 재실행.

- [ ] **Step 7: 커밋**

```bash
git add scripts/build_pptx.py scripts/test_build_pptx.py .claude/skills/pptx-build courses/spring-boot-basic/pptx/ch01.pptx
git commit -m "feat: pptx-build 스킬 + 빌더 (9단계 — 원고→PPTX, 발표자 노트)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 13: 책 자산 이식 + Windows Typst 드라이런

**Files:**
- Create: `.claude/skills/humanizer/` ($LBW `.claude/skills/humanizer/` 통째 복사)
- Create: `.claude/skills/book-build/references/storytelling.md` ($LBW `.claude/rules/storytelling.md` 복사)
- Create: `.claude/skills/book-build/references/style.md` ($LBW `.claude/rules/style.md` 복사)
- Create: `.claude/skills/book-build/references/templates/book_base.typ` ($LBW에서 복사 후 Windows 수정)
- Create: `.claude/skills/book-build/references/scripts/typst_builder.py` ($LBW에서 복사 후 Windows 수정)
- Create: `.claude/skills/book-build/references/build-pipeline.md` ($LBW `pub-build/references/build-pipeline.md` 복사)
- Create: `.claude/skills/book-build/references/fonts/` (폰트 파일)

**Interfaces:**
- Produces: `typst_builder.py`가 Windows에서 md→pdf 생성 가능 상태 (Task 14의 전제). 폰트는 `--font-path`로 저장소 내 fonts/ 사용(시스템 설치 불요).

- [ ] **Step 1: $LBW 확보 확인 및 파일 복사** — $LBW 경로가 없으면 Global Constraints의 재clone 절차 수행 후:

```powershell
$LBW = "C:\Users\ssarm\AppData\Local\Temp\claude\C--Users-ssarm-Documents-course-haness\09dbee56-4207-48fb-84a6-728876cea459\scratchpad\lecture-book-workflow"
New-Item -ItemType Directory -Force .claude/skills/book-build/references/templates, .claude/skills/book-build/references/scripts, .claude/skills/book-build/references/fonts
Copy-Item -Recurse "$LBW/.claude/skills/humanizer" .claude/skills/humanizer
Copy-Item "$LBW/.claude/rules/storytelling.md" .claude/skills/book-build/references/storytelling.md
Copy-Item "$LBW/.claude/rules/style.md" .claude/skills/book-build/references/style.md
Copy-Item "$LBW/.claude/skills/pub-typst-design/references/templates/book_base.typ" .claude/skills/book-build/references/templates/book_base.typ
Copy-Item "$LBW/.claude/skills/pub-build/references/scripts/typst_builder.py" .claude/skills/book-build/references/scripts/typst_builder.py
Copy-Item "$LBW/.claude/skills/pub-build/references/build-pipeline.md" .claude/skills/book-build/references/build-pipeline.md
```

경로가 원본 repo에서 다르면(`Get-ChildItem $LBW/.claude -Recurse -Filter *.typ` 등으로) 실경로를 찾아 복사. humanizer의 LICENSE/출처(MIT, DaleSeo) 표기는 그대로 보존.

- [ ] **Step 2: typst/pandoc 설치 확인**

```powershell
typst --version; pandoc --version
```

없으면: `winget install --id Typst.Typst -e; winget install --id JohnMacFarlane.Pandoc -e` 후 새 셸에서 재확인.

- [ ] **Step 3: 폰트 확보** — `references/fonts/`에 배치:
  - D2Coding: https://github.com/naver/d2codingfont 릴리스 zip에서 `D2Coding-*.ttf` 추출
  - 본문 한글 폰트: RIDIBatang(리디바탕, 무료 배포 https://ridicorp.com/ridibatang/ ) 다운로드. 자동 다운로드가 어려우면(로그인 등) **사용자에게 다운로드 요청**하고, 임시 대체로 KoPubWorld바탕 또는 시스템 `malgun.ttf` 복사 사용 — 어떤 폰트를 확보했는지 기록
  
```powershell
Get-ChildItem .claude/skills/book-build/references/fonts
```

Expected: 본문용 1종 + 코드용 D2Coding 파일 존재.

- [ ] **Step 4: Windows 조정** — `book_base.typ`와 `typst_builder.py`에서:
  - macOS 폰트 경로(`~/Library/Fonts`) 참조 제거, `--font-path`는 빌더 인자로 받아 `references/fonts/` 절대경로 주입
  - `book_base.typ`의 본문 폰트명을 Step 3 확보 폰트명으로 수정 (typst는 폰트 패밀리명 매칭 — `typst fonts --font-path <dir>`로 실명 확인)
  - 경로 구분자/셸 호출(`os.system`·subprocess에 mac 전용 명령이 있으면) Windows 호환으로 수정
  - Mermaid 렌더 단계 등 이 하네스에서 안 쓰는 전처리(우리는 D2 PNG를 이미 파일로 가짐)는 옵션화하거나 제거

- [ ] **Step 5: 드라이런** — 최소 md로 PDF 생성 (한글 본문 + 코드 블록 + 이미지 1장 포함):

```powershell
New-Item -ItemType Directory -Force scripts/book_dryrun
@'
# 1장. 드라이런

안녕하세요. 한글 조판과 줄바꿈이 정상인지 확인합니다. 김치찌개를 주문하면 주방이 응답을 돌려줍니다.

```java
public class Hello { public static void main(String[] a){ System.out.println("안녕"); } }
```
'@ | Out-File -Encoding utf8 scripts/book_dryrun/ch_test.md
python .claude/skills/book-build/references/scripts/typst_builder.py scripts/book_dryrun/ch_test.md scripts/book_dryrun/out.pdf
```

(빌더 CLI 시그니처가 다르면 실제 시그니처에 맞춰 호출.) Expected: `out.pdf` 생성, 열어서 한글 본문·코드 폰트·목차/표지 렌더 확인. 실패 항목(폰트 미매칭·한글 줄바꿈 깨짐·pandoc 변환 오류)은 여기서 전부 해결하고, 해결 내역을 `docs/reviews/2026-07-05_typst-windows-dryrun.md`에 기록.

- [ ] **Step 6: 커밋** — 드라이런 임시 파일 제외:

```bash
rm -rf scripts/book_dryrun
git add .claude/skills/humanizer .claude/skills/book-build docs/reviews/2026-07-05_typst-windows-dryrun.md
git commit -m "feat: 책 자산 이식 (humanizer·storytelling·Typst 엔진) + Windows 드라이런

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 14: `book-build` 스킬 (10단계 — 소설체 재집필 + PDF)

**Files:**
- Create: `.claude/skills/book-build/SKILL.md`

**Interfaces:**
- Consumes: `manuscripts/chNN.md`(확정 원고 전체), `assets/`, `code/chNN/`, references(storytelling/style/templates/scripts/fonts), humanizer 스킬
- Produces: `book/chNN_원고.md`(소설체 챕터), `book/chNN.pdf`, 완주 시 `book/합본.pdf`, `book/characters.md`(과정 공통 캐릭터 설정)

- [ ] **Step 1: SKILL.md 작성** — frontmatter `name: book-build`, 트리거("책 만들어줘", "PDF 책", "챕터 집필"). 본문 절차:
  1. **캐릭터 설정(과정당 1회)**: `book/characters.md`가 없으면 storytelling.md의 삼각 구도(팀장=힌트 제공자/동료=문제 제기자/주인공=독자 대리인)로 과정 대상자에 맞는 캐릭터 3인을 사용자와 확정
  2. **소설체 재집필**: 원고 chNN의 비유(Easy analogy)·실무사례·나레이션·실습·평가를 씨앗으로 `book/chNN_원고.md` 집필. storytelling.md 전 규칙 적용(비유→왜?→정의, 비유는 대화에서 발견, Try-Fail 최소 2회, 이야기 파트→기술 파트 구조·라벨형 H2 금지) + style.md 톤 규칙(존댓말, 이모지·em dash·AI 선호어 금지)
  3. **humanizer 패스**: humanizer 스킬로 AI 문체 패턴 교정
  4. **편집 검토 패스(필수, 스펙 §10)**: ① 사실성 보존 — 기술 서술이 원고·Source와 어긋나는 문장 목록화 ② 개념 누락 — 원고의 핵심 개념/실습/평가문항이 책에 모두 등장하는지 대조표 ③ 과도한 소설화 — 기술 설명 없는 이야기 연속 구간 검출. 발견 항목 수정 후 사용자 확인
  5. **PDF 빌드**: `typst_builder.py`로 `book/chNN.pdf` 생성(이미지·D2 PNG는 assets 상대경로). 과정 전 차시 완료 시 사용자 요청으로 합본(`book/합본.pdf`) — 챕터 md 연결 + 표지/목차는 book_base.typ 자동
  6. 확정 시 status.md 책 ✅
  
  **확정 체크리스트**: 편집 검토 3종 통과 / PDF 렌더 정상(빈 페이지·고아 줄·이미지 깨짐 없음) / 캐릭터 등장 규칙(2챕터 연속 부재 금지) 준수. **repair**: 검토 실패 문단만 재집필(챕터 전체 재집필 금지), 렌더 실패는 Task 13 드라이런 기록 참조.

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/book-build/SKILL.md -Pattern '^name: book-build', 'characters', 'humanizer', '사실성', 'typst_builder' | ForEach-Object Line
```

Expected: 5개 모두 매치.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/book-build/SKILL.md
git commit -m "feat: book-build 스킬 (10단계 — 소설체 재집필·편집 검토·Typst PDF)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 15: `course-pipeline` 오케스트라 스킬

**Files:**
- Create: `.claude/skills/course-pipeline/SKILL.md`

**Interfaces:**
- Consumes: `courses/{id}/status.md`, 단계 스킬 10종
- Produces: 순차 실행 제어(스킬 자체 산출물 없음)

- [ ] **Step 1: SKILL.md 작성** — frontmatter `name: course-pipeline`, 트리거("이어서 하자", "다음 단계", "전체 실행", "파이프라인 돌려줘"). 본문 절차:
  1. 과정 폴더 식별(인자 없으면 `courses/` 하위 status.md 목록 제시 후 선택, 신규면 `course-outline`부터)
  2. status.md 파싱 → 단계 순서(`과정개요서 → 원고초안 → 원고확정 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`)에서 첫 미완(⬜/🔄) 셀 식별. 진행 단위는 사용자에게 확인: "chNN을 끝까지" 또는 "이 단계를 전 차시에"
  3. 해당 단계 스킬을 Skill 도구로 호출(스킬명 매핑 표를 본문에 명시 — status 열 이름 ↔ 스킬명). ➖(보류) 셀은 건너뜀
  4. 각 단계는 해당 스킬의 확정 절차(사용자 확인)를 그대로 따름 — 오케스트라가 확인을 생략하지 않음
  5. 사용자가 "여기까지"라 하면 status.md의 `다음 할 일`을 갱신하고 정지
  
  **확정 체크리스트**: 호출 전 선행 단계 ✅ 여부 검사(예: 코드 단계는 원고확정 ✅ 필수 — 위반 시 선행 단계부터 제안). **repair**: status.md와 실파일 불일치(파일 없는데 ✅) 발견 시 인덱스 재검증 후 사용자 보고.

- [ ] **Step 2: 구조 검증**

```powershell
Select-String -LiteralPath .claude/skills/course-pipeline/SKILL.md -Pattern '^name: course-pipeline', '다음 할 일', '선행 단계' | ForEach-Object Line
```

Expected: 3개 모두 매치. 추가로 본문 매핑 표의 스킬명 10종이 실제 `.claude/skills/` 폴더명과 일치하는지 대조:

```powershell
Get-ChildItem .claude/skills -Directory | Select-Object Name
```

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/course-pipeline
git commit -m "feat: course-pipeline 오케스트라 스킬 (status 기반 재개 실행)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 16: 파일럿 드라이런 (spring-boot-basic ch01)

**Files:**
- Modify: `courses/spring-boot-basic/` 산출물 전반, `status.md`

**Interfaces:**
- Consumes: 전 단계 스킬. 이 태스크는 사용자와 함께 진행하는 **대화형 검증**이며 서브에이전트로 위임하지 않는다.

- [ ] **Step 1: 개요서 소급 작성** — `course-outline` 스킬을 호출하되 리서치·차시 논의는 기존 GPT 시나리오(스프링부트 기초 10차시, 대상: 초보자, Todo 도메인 연속 실습)를 초안으로 제시해 빠르게 확정 → `1.과정개요서.md` + status.md 차시 행 10개로 확장

- [ ] **Step 2: ch01 원고 확정** — `manuscript-final`로 기존 `manuscripts/ch01.md`를 티키타카 확정 (필요 시 image-gen/D2 실생성 포함)

- [ ] **Step 3: 4~10단계 순차 실행** — `course-pipeline`으로 ch01의 코드→스토리보드→PPT프리뷰→판서(두 모드 중 사용자 선택)→시뮬→PPTX→책을 차례로 실행. 각 단계에서 확정 체크리스트가 실제로 걸러내는지, status.md가 올바르게 갱신되는지 관찰

- [ ] **Step 4: 드라이런 회고 기록** — 발견된 스킬 결함/규약 모호점을 수정하고 `docs/reviews/2026-07-05_pilot-dryrun.md`에 기록 (수정은 해당 스킬 파일에 즉시 반영)

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat: 파일럿 드라이런 (spring-boot-basic ch01 전 구간) + 스킬 보정

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review 결과

- **Spec coverage**: §3 파이프라인 10단계 → Task 3~14, §3.1 오케스트라 → Task 15, §4 디렉터리/status → Task 1~2, §5 개요서 흐름 → Task 3, §6 스키마 → Task 4, §7 판서 2모드 → Task 9, §8 시뮬 → Task 10, §9 PPTX(+spike) → Task 11~12, §10 책(+품질 3종, Windows 조정) → Task 13~14, §11 삭제/보존/이동 → Task 1, §12 되돌리기 → Task 1 Step 1, §14 구현 순서 준수. 갭 없음.
- **Placeholder scan**: 코드 블록 완비(spike/빌더/테스트), 스킬 태스크는 필수 섹션·규칙·검증 명령 명시. $LBW 파일 경로는 원본 repo 조사 보고 기준이며 상이 시 탐색 절차 명시.
- **Type consistency**: `parse_manuscript`/`build_pptx` 시그니처가 Task 12 테스트·구현·CLI에서 일치. status.md 열 이름은 Global Constraints·Task 2 템플릿·Task 15 매핑에서 동일 문자열.
