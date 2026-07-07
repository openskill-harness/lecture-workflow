# 하네스 SSOT 규율 + 이력 일원화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하네스의 권위 문서(CLAUDE.md·SKILL.md·에이전트·설계 spec)가 현재의 최종 진실만 담고(SSOT), 변경 이력은 `docs/history/` 한 곳으로 분리되도록 재설계한다.

**Architecture:** 2계층 모델을 강제한다 — Tier 1 = SSOT(현행 진실만): `CLAUDE.md`(슬림 포인터), `.claude/skills/*/SKILL.md`, `.claude/agents/*.md`, `docs/superpowers/specs/*`(현행 설계). Tier 2 = 이력(필요할 때만 로드, append-only): `docs/history/`. 흩어져 있던 `docs/proposals`+`docs/reviews`+`docs/superpowers/plans`를 `docs/history/<날짜_변경>/` 변경별 폴더로 물리 통합하고, `docs/history/CHANGELOG.md` 단일 ledger를 신설한다. CLAUDE.md는 파이프라인 상세 표·디렉터리 구조·스킬 목록 중복을 버리고 `course-pipeline` SKILL(SSOT)로 이관한다. "추가 vs 교체" 불변식(R1~R4)을 유지 규칙에 명문화하고, 외부 harness 플러그인 대신 이 repo의 `harness-maintain` 스킬을 신설해 하네스 점검·동기화·스킬 추가를 자립시킨다(CLAUDE.md가 그 스킬로 라우팅, 외부 플러그인은 이 프로젝트에서 사용하지 않음).

**Tech Stack:** Markdown, git(`git mv`), Grep(ripgrep), codex CLI(사전검증), PowerShell/Git Bash.

## Global Constraints

- **유지 규칙 준수(자기적용)**: 이 계획 자체가 하네스 구조 변경이므로, 실행 전 제안서 + codex 사전검증을 거친다(Task 1). codex는 Git Bash에서 stdin을 닫고 read-only로: `codex exec --sandbox read-only '...' </dev/null`.
- **Tier 1 문서는 최종 진실만**: 어떤 SSOT 문서에도 "이전엔 X였다"·폐기 개념·변경 이력을 인라인으로 남기지 않는다(R1). 내용 변경은 제자리 교체이며 old+new 공존 금지(R2).
- **이력은 `docs/history/`에만**: 변경별 폴더 + `docs/history/CHANGELOG.md` 한 줄 ledger. Tier 1 문서 안에 이력 테이블을 만들지 않는다(R3).
- **무중복**: 스킬 목록·디렉터리 구조·단계 상세를 CLAUDE.md에 복제하지 않는다(R4). 각 스킬 SKILL.md와 파일시스템이 SSOT다.
- **파일 이동은 `git mv`**: 히스토리 보존. 삭제 후 재생성 금지.
- **커밋은 사용자가 요청할 때만**: 각 Task 끝의 커밋 스텝은 사용자가 커밋을 원할 때 실행한다. 현재 브랜치가 `master`이므로, 커밋 전 작업 브랜치 생성 여부를 사용자에게 확인한다.
- **spec 이동 금지**: `docs/superpowers/specs/`는 Tier 1(현행 설계)이므로 `docs/history`로 옮기지 않는다. 내용 최신화·참조 갱신만 한다.
- **이력은 스냅샷(불변)**: `docs/history/`로 이전된 기록(proposal/plan/review) 내부의 옛 경로 참조는 **그대로 보존**한다(당시엔 참인 스냅샷). 이력 내부 링크를 새 경로로 rewrite하지 않는다(R3: append-only).
- **dead-link 감사 범위 = 권위 파일만**: dead-link/drift grep은 `.claude/skills`(SKILL.md·scripts·templates 포함) + `docs/superpowers/specs` + `CLAUDE.md`로 한정한다. `docs/history/`(스냅샷)·`.superpowers/sdd/`(빌드 이력)·`courses/**`(재생성되는 산출물)·`**/_build/**`(git-ignore)는 감사에서 제외한다.
- **산출물(courses/**)은 갱신 대상 아님**: 강의 산출물에 박힌 옛 경로 인용은 해당 스킬 재실행 시 재생성되므로 이 계획에서 손대지 않는다(권위 문서가 아님). 감사 범위에서도 제외.

---

## File Structure

**신설:**
- `docs/history/CHANGELOG.md` — 변경 이력 단일 ledger(날짜·변경·대상·사유·레코드 링크). 최신이 위.
- `docs/history/<YYYY-MM-DD_slug>/` — 변경별 레코드 폴더. 안에 `proposal.md`(계획)·`codex-review.md`(검증)·`plan.md`(실행계획)를 동거시킨다.
- `.claude/skills/harness-maintain/SKILL.md` — 하네스 유지보수 스킬(R1~R4 + 감사 + 변경 절차 + docs/history 이력 모델 + 진화 트리거). 외부 harness 플러그인(harness:harness) 대체 — 이 프로젝트의 "하네스 점검·동기화·스킬 추가/수정" 진입점.

**이전(`git mv`):** `docs/proposals/*` + `docs/reviews/*` + `docs/superpowers/plans/*` → `docs/history/<변경>/`.

**재작성:** `CLAUDE.md`(슬림), `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`(stale 내용 정정 + 참조 갱신).

**수정(참조 갱신):** `.claude/skills/{visual-assets,panseo-slide,book-build,pub-d2-diagram}/SKILL.md`, `docs/superpowers/specs/*`.

**유지(그대로):** `docs/superpowers/specs/`(위치), `.superpowers/sdd/*`(빌드 이력, 범위 밖), `.claude/skills/course-pipeline/SKILL.md`의 기존 매핑표·하드게이트표(Task 4에서 보강만).

### 이전 매핑 (Task 2 기준표)

| 대상 변경 폴더 | 이동할 기존 파일 → 새 이름 |
|---|---|
| `docs/history/2026-07-05_v2-redesign/` | `reviews/2026-07-05_v2-redesign-codex-review.md`→`codex-review.md`; `plans/2026-07-05-unified-lecture-pipeline.md`→`plan.md`; `reviews/2026-07-05_typst-windows-dryrun.md`→`typst-windows-dryrun.md` |
| `docs/history/2026-07-06_visual-assets-stage-redesign/` | `proposals/2026-07-06_visual-assets-stage-redesign.md`→`proposal.md`; `reviews/2026-07-06_visual-assets-redesign-codex-review.md`→`codex-review.md` |
| `docs/history/2026-07-06_asset-embed-safe-margin/` | `proposals/2026-07-06_asset-embed-safe-margin.md`→`proposal.md`; `reviews/2026-07-06_asset-embed-margin-codex-review.md`→`codex-review.md` |
| `docs/history/2026-07-06_d2-to-gpt-image-default/` | `proposals/2026-07-06_d2-to-gpt-image-default.md`→`proposal.md`; `reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md`→`codex-review.md`; `plans/2026-07-06-d2-to-gpt-image-default.md`→`plan.md` |
| `docs/history/2026-07-06_pptx-image-mode/` | `proposals/2026-07-06_pptx-image-mode.md`→`proposal.md`; `reviews/2026-07-06_pptx-image-mode-codex-review.md`→`codex-review.md` |
| `docs/history/2026-07-06_d2-layout-debug/` | `reviews/2026-07-06_d2-layout-debug.md`→`debug-note.md` |
| `docs/history/2026-07-07_book-concept-anchor/` | `proposals/2026-07-07_book-concept-anchor.md`→`proposal.md`; `reviews/2026-07-07_book-concept-anchor-codex-review.md`→`codex-review.md`; `plans/2026-07-07-book-concept-anchor.md`→`plan.md` |
| `docs/history/2026-07-07_manuscript-verify/` | `proposals/2026-07-07_manuscript-verify.md`→`proposal.md`; `reviews/2026-07-07_manuscript-verify-codex-review.md`→`codex-review.md`; `plans/2026-07-07-manuscript-verify.md`→`plan.md` |
| `docs/history/2026-07-07_harness-review-fixes/` | `plans/2026-07-07-harness-review-fixes.md`→`plan.md` |
| `docs/history/2026-07-07_ssot-discipline/` | (본 변경) `proposal.md`·`codex-review.md`(Task 1) + `plan.md`(이 파일, 이미 배치됨) |

이전 후 `docs/proposals/`·`docs/reviews/`·`docs/superpowers/plans/`는 빈 디렉터리가 되므로 제거한다.

---

### Task 1: 제안서 + codex 사전검증 (유지 규칙 자기적용)

이 계획을 실행하기 전에, 하네스 구조 변경 절차(제안 → codex 검증 → 반영)를 먼저 밟는다. 이 Task가 새 `docs/history/` 구조의 **첫 레코드**를 만들어 dogfooding한다.

**Files:**
- Create: `docs/history/2026-07-07_ssot-discipline/proposal.md`
- Create: `docs/history/2026-07-07_ssot-discipline/codex-review.md`

**Interfaces:**
- Produces: `proposal.md`(이 계획의 요약 근거), `codex-review.md`(codex 판정) — Task 7의 CHANGELOG 레코드 링크가 이 폴더를 가리킨다.

- [ ] **Step 1: 제안서 작성**

아래 내용으로 `docs/history/2026-07-07_ssot-discipline/proposal.md`를 생성한다:

```markdown
# 제안: 하네스 SSOT 규율 + 이력 일원화

- 날짜: 2026-07-07
- 유형: 하네스 구조 변경 (디렉터리 규약 + CLAUDE.md 스키마 + 유지 규칙)

## 문제
- CLAUDE.md가 스킬 목록·디렉터리 구조·단계 상세를 담아 각 SKILL.md와 이중 관리(중복).
- 권위 문서에 폐기된 v1 서술("라인 구분·승인 게이트 폐기")과 stale 단계수(spec/plan "10단계" vs CLAUDE "11단계")가 old+new로 공존.
- "내용 추가 vs 교체" 규율이 어디에도 문서화되지 않아 drift가 반복 발생.
- 변경 이력이 docs/proposals·docs/reviews·docs/superpowers/plans로 흩어져 3중 관리.

## 제안
- 2계층 모델: Tier 1(SSOT, 현행 진실만) / Tier 2(docs/history, append-only 이력).
- proposals+reviews+plans를 docs/history/<날짜_변경>/로 물리 통합, docs/CHANGELOG.md ledger 신설.
- CLAUDE.md를 포인터+트리거+유지규칙(R1~R4)으로 슬림화, 파이프라인 상세는 course-pipeline SKILL로 이관.
- R1(SSOT)·R2(추가 vs 교체)·R3(이력 분리)·R4(무중복)을 유지 규칙에 명문화.
- 외부 harness 플러그인 대신 in-repo harness-maintain 스킬을 신설(R1~R4 + 감사 + 변경 절차), CLAUDE.md가 유지보수를 그 스킬로 라우팅.

## 회귀 위험
- proposals/reviews를 참조하는 6+ SKILL/spec의 경로 파손 → Task 3에서 일괄 갱신.
- spec은 이동하지 않음(Tier 1 유지) → 참조 파손 최소화.

## 검증
- codex 사전검증 read-only.
- 반영 후 정합성 드라이런: CLAUDE.md 중복 0, stale "10단계" 0, dead-link 0.
```

- [ ] **Step 2: codex 사전검증 실행**

Git Bash에서 stdin을 닫고 read-only로 실행한다:

```bash
codex exec --sandbox read-only 'docs/history/2026-07-07_ssot-discipline/proposal.md 와 docs/history/2026-07-07_ssot-discipline/plan.md 를 읽고, 2계층 SSOT/이력 분리 재설계의 논리적 결함·회귀 위험·누락 참조를 지적하라. 특히 proposals/reviews 물리 이전 시 깨질 참조를 빠짐없이 열거하라.' </dev/null
```

- [ ] **Step 3: 검증 결과 저장**

codex 출력을 `docs/history/2026-07-07_ssot-discipline/codex-review.md`에 저장하고 맨 위에 한 줄 결론(승인/조건부/반려)을 요약한다. 조건부면 해당 조건을 아래 Task에 반영한다.

- [ ] **Step 4: 검증 — 레코드 존재 확인**

Run (Git Bash): `ls docs/history/2026-07-07_ssot-discipline/`
Expected: `codex-review.md  plan.md  proposal.md` 3개가 보인다.

- [ ] **Step 5: Commit (사용자 요청 시)**

```bash
git add docs/history/2026-07-07_ssot-discipline/
git commit -m "docs(harness): SSOT 규율 재설계 제안 + codex 사전검증"
```

---

### Task 2: docs/history 구조 생성 + 기존 기록 물리 이전 + CHANGELOG 신설

**Files:**
- Create: `docs/history/CHANGELOG.md`
- Move (`git mv`): 위 "이전 매핑" 표의 모든 파일
- Delete(빈 폴더): `docs/proposals/`, `docs/reviews/`, `docs/superpowers/plans/`

**Interfaces:**
- Produces: `docs/history/<변경>/{proposal,codex-review,plan}.md` 정규 경로 — Task 3의 참조 갱신이 이 경로를 사용한다. `CHANGELOG.md`(ledger) — Task 7이 본 변경 줄을 추가한다.

- [ ] **Step 1: 변경별 폴더로 `git mv` 이전**

"이전 매핑" 표대로 각 파일을 옮긴다. 예(전체를 표대로 반복):

```bash
mkdir -p docs/history/2026-07-05_v2-redesign docs/history/2026-07-06_visual-assets-stage-redesign docs/history/2026-07-06_asset-embed-safe-margin docs/history/2026-07-06_d2-to-gpt-image-default docs/history/2026-07-06_pptx-image-mode docs/history/2026-07-06_d2-layout-debug docs/history/2026-07-07_book-concept-anchor docs/history/2026-07-07_manuscript-verify docs/history/2026-07-07_harness-review-fixes

git mv docs/reviews/2026-07-05_v2-redesign-codex-review.md docs/history/2026-07-05_v2-redesign/codex-review.md
git mv docs/superpowers/plans/2026-07-05-unified-lecture-pipeline.md docs/history/2026-07-05_v2-redesign/plan.md
git mv docs/reviews/2026-07-05_typst-windows-dryrun.md docs/history/2026-07-05_v2-redesign/typst-windows-dryrun.md
git mv docs/proposals/2026-07-06_visual-assets-stage-redesign.md docs/history/2026-07-06_visual-assets-stage-redesign/proposal.md
git mv docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md docs/history/2026-07-06_visual-assets-stage-redesign/codex-review.md
git mv docs/proposals/2026-07-06_asset-embed-safe-margin.md docs/history/2026-07-06_asset-embed-safe-margin/proposal.md
git mv docs/reviews/2026-07-06_asset-embed-margin-codex-review.md docs/history/2026-07-06_asset-embed-safe-margin/codex-review.md
git mv docs/proposals/2026-07-06_d2-to-gpt-image-default.md docs/history/2026-07-06_d2-to-gpt-image-default/proposal.md
git mv docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md docs/history/2026-07-06_d2-to-gpt-image-default/codex-review.md
git mv docs/superpowers/plans/2026-07-06-d2-to-gpt-image-default.md docs/history/2026-07-06_d2-to-gpt-image-default/plan.md
git mv docs/proposals/2026-07-06_pptx-image-mode.md docs/history/2026-07-06_pptx-image-mode/proposal.md
git mv docs/reviews/2026-07-06_pptx-image-mode-codex-review.md docs/history/2026-07-06_pptx-image-mode/codex-review.md
git mv docs/reviews/2026-07-06_d2-layout-debug.md docs/history/2026-07-06_d2-layout-debug/debug-note.md
git mv docs/proposals/2026-07-07_book-concept-anchor.md docs/history/2026-07-07_book-concept-anchor/proposal.md
git mv docs/reviews/2026-07-07_book-concept-anchor-codex-review.md docs/history/2026-07-07_book-concept-anchor/codex-review.md
git mv docs/superpowers/plans/2026-07-07-book-concept-anchor.md docs/history/2026-07-07_book-concept-anchor/plan.md
git mv docs/proposals/2026-07-07_manuscript-verify.md docs/history/2026-07-07_manuscript-verify/proposal.md
git mv docs/reviews/2026-07-07_manuscript-verify-codex-review.md docs/history/2026-07-07_manuscript-verify/codex-review.md
git mv docs/superpowers/plans/2026-07-07-manuscript-verify.md docs/history/2026-07-07_manuscript-verify/plan.md
git mv docs/superpowers/plans/2026-07-07-harness-review-fixes.md docs/history/2026-07-07_harness-review-fixes/plan.md
```

- [ ] **Step 2: 빈 폴더 제거**

```bash
rmdir docs/proposals docs/reviews docs/superpowers/plans
```

Expected: 오류 없이 제거(비어 있어야 함). 남은 파일이 있으면 매핑 표 누락이므로 Step 1로 돌아간다.

- [ ] **Step 3: CHANGELOG ledger 생성**

`docs/history/CHANGELOG.md`를 아래로 생성한다(본 변경 줄은 Task 7에서 추가하므로 지금은 헤더 + 기존 변경들만):

```markdown
# 하네스 변경 이력 (CHANGELOG)

권위 문서(SSOT)의 "무엇이 언제 왜 바뀌었나" 단일 ledger. 상세는 각 레코드 폴더 링크.
한 줄 = 한 변경. 최신이 위. 이 파일과 `docs/history/<날짜_변경>/`만이 이력의 SSOT다 — 권위 문서엔 이력을 쓰지 않는다.

| 날짜 | 변경 | 대상 | 사유 | 레코드 |
|------|------|------|------|--------|
| 2026-07-07 | manuscript-verify 스킬 신설(3.5단계) | skills/manuscript-verify, CLAUDE.md | 원고 기술주장 적대적 검증 | [2026-07-07_manuscript-verify](2026-07-07_manuscript-verify/) |
| 2026-07-07 | book-build 개념 앵커 도입 | skills/book-build | 개념 누락 방지 | [2026-07-07_book-concept-anchor](2026-07-07_book-concept-anchor/) |
| 2026-07-06 | pptx 이미지 모드 기본화 | skills/pptx-build | 프리뷰 픽셀 동일 | [2026-07-06_pptx-image-mode](2026-07-06_pptx-image-mode/) |
| 2026-07-06 | 기본 시각자산 D2→GPT 이미지 | skills/visual-assets, image-gen | 품질/일관성 | [2026-07-06_d2-to-gpt-image-default](2026-07-06_d2-to-gpt-image-default/) |
| 2026-07-06 | 자산 임베드 안전 여백 | skills/storyboard, ppt-preview, panseo-slide | 자산 잘림 방지 | [2026-07-06_asset-embed-safe-margin](2026-07-06_asset-embed-safe-margin/) |
| 2026-07-06 | visual-assets 스테이지 신설(10→11단계) | skills/visual-assets, spec | 재동기화 폭포 제거 | [2026-07-06_visual-assets-stage-redesign](2026-07-06_visual-assets-stage-redesign/) |
| 2026-07-05 | 원고 단일원천 파이프라인 v2 재설계 | 전체 | 라인/게이트 폐기, 단계별 확정 | [2026-07-05_v2-redesign](2026-07-05_v2-redesign/) |
```

- [ ] **Step 4: 검증 — 이전 완결성 확인**

Run (Git Bash):
```bash
test ! -d docs/proposals && test ! -d docs/reviews && test ! -d docs/superpowers/plans && echo "OLD_DIRS_GONE"
find docs/history -name '*.md' | wc -l
```
Expected: `OLD_DIRS_GONE` 출력. `.md` 개수 = 이전 20개 + CHANGELOG 1 + plan/proposal/codex-review(Task 1) 3 = **24**.

- [ ] **Step 5: Commit (사용자 요청 시)**

```bash
git add -A docs/
git commit -m "docs(harness): 변경 이력 docs/history 일원화 + CHANGELOG 신설"
```

---

### Task 3: 이전으로 깨진 참조 갱신 + stale spec 내용 정정

Task 2의 물리 이전으로 Tier 1 문서(SKILL·spec)가 가리키던 경로가 깨졌다. 이를 새 `docs/history/` 경로로 교체한다(R2: 제자리 교체). 동시에 spec의 stale 내용(10단계·폐기 서술)을 현행으로 정정한다(R1).

**Files:**
- Modify: `.claude/skills/visual-assets/SKILL.md` (2곳)
- Modify: `.claude/skills/panseo-slide/SKILL.md` (2곳)
- Modify: `.claude/skills/book-build/SKILL.md` (2곳)
- Modify: `.claude/skills/pub-d2-diagram/SKILL.md` (1곳)
- Modify: `.claude/skills/ppt-preview/SKILL.md` (1곳, :74)
- Modify: `.claude/skills/storyboard/SKILL.md` (1곳, :59)
- Modify: `.claude/skills/book-build/references/templates/book_base.typ` (2곳, :211-212 주석)
- Modify: `.claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py` (1곳, :6 주석)
- Modify: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` (참조 + stale 내용)
- Modify: `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`, `docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md` (유지규칙 절차 서술)
- **제외**: `courses/**` 산출물(storyboards/ch01.html, ppt_previews/ch01.html, panseo/ch01.html, book/book_base.typ 등)과 `**/_build/**`(git-ignore)의 옛 경로 인용은 재생성 대상이라 손대지 않는다(Global Constraints "산출물 제외").

**Interfaces:**
- Consumes: Task 2의 새 경로.

- [ ] **Step 1: SKILL 참조 경로 일괄 교체**

각 파일에서 아래 old→new로 교체한다(Edit 도구, **`replace_all: true`** — 한 파일에 같은 경로가 여러 줄 나올 수 있음, 예: visual-assets :10·:12).

| 파일 | old | new |
|---|---|---|
| visual-assets/SKILL.md | `docs/proposals/2026-07-06_visual-assets-stage-redesign.md` | `docs/history/2026-07-06_visual-assets-stage-redesign/proposal.md` |
| visual-assets/SKILL.md | `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md` | `docs/history/2026-07-06_visual-assets-stage-redesign/codex-review.md` |
| panseo-slide/SKILL.md | `docs/proposals/2026-07-06_asset-embed-safe-margin.md` | `docs/history/2026-07-06_asset-embed-safe-margin/proposal.md` |
| panseo-slide/SKILL.md | `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md` | `docs/history/2026-07-06_asset-embed-safe-margin/codex-review.md` |
| ppt-preview/SKILL.md (:74) | `docs/proposals/2026-07-06_asset-embed-safe-margin.md` | `docs/history/2026-07-06_asset-embed-safe-margin/proposal.md` |
| ppt-preview/SKILL.md (:74) | `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md` | `docs/history/2026-07-06_asset-embed-safe-margin/codex-review.md` |
| storyboard/SKILL.md (:59) | `docs/proposals/2026-07-06_asset-embed-safe-margin.md` | `docs/history/2026-07-06_asset-embed-safe-margin/proposal.md` |
| storyboard/SKILL.md (:59) | `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md` | `docs/history/2026-07-06_asset-embed-safe-margin/codex-review.md` |
| book-build/references/templates/book_base.typ | `docs/proposals/2026-07-06_asset-embed-safe-margin.md` | `docs/history/2026-07-06_asset-embed-safe-margin/proposal.md` |
| book-build/references/templates/book_base.typ | `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md` | `docs/history/2026-07-06_asset-embed-safe-margin/codex-review.md` |
| book-build/SKILL.md | `docs/reviews/2026-07-05_typst-windows-dryrun.md` | `docs/history/2026-07-05_v2-redesign/typst-windows-dryrun.md` |
| pub-d2-diagram/SKILL.md | `docs/reviews/2026-07-06_d2-layout-debug.md` | `docs/history/2026-07-06_d2-layout-debug/debug-note.md` |
| pub-d2-diagram/scripts/render_md_diagrams.py (:6) | `docs/reviews/2026-07-06_d2-layout-debug.md` | `docs/history/2026-07-06_d2-layout-debug/debug-note.md` |

`book-build/SKILL.md`가 참조하는 `.superpowers/sdd/task-13-report.md`는 범위 밖이므로 건드리지 않는다.

- [ ] **Step 2: spec 참조 경로 교체**

`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`의 `docs/proposals/…`·`docs/reviews/…` 참조(4곳: 상태·개정이력·근거·문서목록)를 위 표와 동일 규칙으로 새 `docs/history/…` 경로로 교체한다.

- [ ] **Step 3: spec의 유지규칙 절차 서술 갱신**

`manuscript-verify-design.md:88`, `book-concept-anchor-design.md:108`의 *"`docs/proposals/`에 계획을 쓰고 … `docs/reviews/`에 결과를 저장한다"* 문장을 현행 절차로 교체한다:

```
docs/history/<날짜_변경>/proposal.md 에 계획을 쓰고 codex 사전검증 결과를 같은 폴더 codex-review.md 에 저장한 뒤 반영하고, docs/history/CHANGELOG.md 에 한 줄 추가한다(CLAUDE.md 유지 규칙 R3).
```

- [ ] **Step 4: stale 내용 정정 (R1)**

`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`에서 현행과 어긋나는 서술을 제자리 교체한다:
- 인라인 "개정 이력" 줄(예: 헤더의 "개정 이력: … 10단계→11단계")은 CHANGELOG와 중복이므로 제거(R3).
- **UNMARKED 현행 주장** 중 "10단계"가 있으면 "11단계"로 교체. 단, "당시/최초 작성 시점/이미 완료된 기록"으로 **자기-주석된 마이그레이션 기록**의 "10단계"는 시점이 명시된 이력이므로 보존한다(R1은 표시 없는 옛 내용만 금지). 확인: `grep -rn "10단계" docs/superpowers/specs/`로 남는 것이 전부 주석된 기록인지 확인.
- 폐기된 v1을 *정의*하는 미표시 서술이 현행 진실을 흐리면 제거.

- [ ] **Step 5: 검증 — dead-link 0 확인**

Run (Git Bash):
```bash
rg -n "docs/(proposals|reviews|superpowers/plans)/" .claude/skills docs/superpowers/specs CLAUDE.md
```
Expected: **매치 0**(CLAUDE.md는 Task 5에서 별도 처리되므로 이 시점엔 아직 남아 있을 수 있음 — 그 매치 외 0이어야 한다). stale 확인: `grep -rn "10단계" docs/superpowers/specs/` → 남는 것은 자기-주석된 마이그레이션 기록(당시 10단계, 이미 완료)뿐, UNMARKED 현행 주장은 0.

- [ ] **Step 6: Commit (사용자 요청 시)**

```bash
git add .claude/skills docs/superpowers/specs
git commit -m "docs(harness): docs/history 이전에 따른 참조 갱신 + spec stale 정정"
```

---

### Task 4: course-pipeline SKILL에 파이프라인 SSOT 흡수

CLAUDE.md에서 버릴 "디렉터리 구조"·"status.md 갱신 의무"의 SSOT 자리를 오케스트라 스킬에 마련한다. 단계↔스킬 매핑표·선행단계(하드게이트)표는 이미 course-pipeline SKILL에 있으므로 **존재만 확인**하고, 빠진 두 블록만 추가한다.

**Files:**
- Modify: `.claude/skills/course-pipeline/SKILL.md`

**Interfaces:**
- Produces: 디렉터리 구조·status.md 계약의 단일 출처 — Task 5의 슬림 CLAUDE.md가 이 스킬을 포인터로 가리킨다.

- [ ] **Step 1: 기존 커버리지 확인**

Run: `rg -n "단계 순서|선행 단계|하드 게이트|status.md" .claude/skills/course-pipeline/SKILL.md`
Expected: 매핑표(§단계 순서 ↔ 스킬명)와 선행단계 검사표가 존재. 존재하면 그 두 표는 건드리지 않는다.

- [ ] **Step 2: 디렉터리 구조 블록 추가**

course-pipeline SKILL.md 말미에 `## 과정 디렉터리 구조 (SSOT)` 섹션을 추가하고, 현재 CLAUDE.md "규약 §디렉터리 구조"의 트리를 그대로 옮긴다(courses/{course-id}/ 이하 status.md·manuscripts·assets/manifest.json·code 등 전체 트리). 상세 근거는 `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md §4`로 포인터.

- [ ] **Step 3: status.md 갱신 의무 블록 추가**

이어서 `## status.md 갱신 의무 (모든 단계 스킬 공통)` 섹션을 추가하고 CLAUDE.md의 해당 규칙을 옮긴다: 작업 시작 시 열 🔄, 확정 시 ✅ + 산출물 인덱스에 경로/확정일/검증로그 한 줄, 보류 시 ➖ + 사유. 템플릿: `templates/status_template.md`.

- [ ] **Step 4: 검증 — 흡수 확인**

Run: `rg -n "디렉터리 구조|status.md 갱신 의무|manifest.json" .claude/skills/course-pipeline/SKILL.md`
Expected: 두 새 섹션 제목과 트리 내용이 보인다.

- [ ] **Step 5: Commit (사용자 요청 시)**

```bash
git add .claude/skills/course-pipeline/SKILL.md
git commit -m "docs(course-pipeline): 디렉터리 구조·status.md 계약 SSOT 흡수"
```

---

### Task 5: CLAUDE.md 슬림 재작성 (포인터 + 트리거 + R1~R4)

CLAUDE.md를 메타 스킬 규격(포인터+트리거+이력링크)으로 축소하고, 파이프라인 표·디렉터리 구조·스킬 목록·트리거 라우팅 표·골든 템플릿 상세·v1 잔재를 제거한다. 유지 규칙을 R1~R4 불변식으로 교체한다.

**Files:**
- Modify(전면 재작성): `CLAUDE.md`

**Interfaces:**
- Consumes: Task 4(course-pipeline가 파이프라인/디렉터리 SSOT), Task 2(docs/history 존재).

- [ ] **Step 1: CLAUDE.md를 아래 내용으로 전면 교체**

```markdown
# 강의 제작 하네스 — SSOT 포인터

**목표:** 확정 원고(manuscript)를 단일 원천으로 실습코드·스토리보드·PPT·판서·시뮬·PPTX·PDF책을 파생하는 11단계 파이프라인으로 개발자 강의를 제작한다.

**트리거:** 강의 제작 관련 요청("과정 만들자", "원고", "시각자산", "실습 코드", "스토리보드", "PPT", "판서", "시뮬레이터", "PPTX", "책", "원고 검증", "이어서 하자" 등)은 오케스트라 스킬 `course-pipeline`으로 라우팅한다. 개별 단계의 트리거·산출물·확정 절차·디렉터리 규약·하드 게이트·status.md 계약은 각 스킬의 description과 SKILL.md가 SSOT다. 파이프라인 전체 구조는 `course-pipeline` SKILL.md, 현행 설계는 `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`.

**하네스 유지보수:** 하네스 점검·감사·동기화·스킬 추가/수정 요청("하네스 점검", "스킬 추가", "에이전트/스킬 동기화" 등)은 이 repo의 `harness-maintain` 스킬을 쓴다. 외부 harness 플러그인(harness:harness)은 이 프로젝트에서 사용하지 않는다 — 유지보수 규율(R1~R4)과 이력 모델(docs/history)이 다르기 때문이다.

**진행 상태:** 각 과정의 단계×차시 상태는 `courses/{course-id}/status.md`가 SSOT다. 파일럿 `spring-boot-basic`의 다음 할 일도 그 status.md에서 확인한다.

## 유지 규칙 (SSOT 규율)

이 하네스의 권위 문서 — `CLAUDE.md`, `.claude/skills/*/SKILL.md`, `.claude/agents/*.md`, `docs/superpowers/specs/*` — 는 **현재의 최종 진실만** 담는다.

- **R1 (SSOT):** 권위 문서엔 현행 진실만 남긴다. 폐기된 개념·이전 설계·"예전엔 X였다"를 인라인에 남기지 않는다.
- **R2 (추가 vs 교체):** 규칙을 *추가*하면 기존에 덧붙인다. 내용을 *변경*하면 제자리에서 교체하고 옛 내용을 지운다 — old와 new가 한 문서에 공존하면 안 된다.
- **R3 (이력 분리):** 무엇을 왜 바꿨는지는 `docs/history/`에만 기록한다(`docs/history/CHANGELOG.md` 한 줄 ledger + `docs/history/<날짜_변경>/` 레코드 폴더). 권위 문서 안에 변경 이력을 쓰지 않는다.
- **R4 (무중복):** 스킬 목록·디렉터리 구조·단계 상세를 CLAUDE.md에 복제하지 않는다. 각 스킬 SKILL.md와 파일시스템이 SSOT다.

**변경·점검 절차:** 하네스 구조 변경(스킬 추가/수정, 디렉터리 규약, status.md 스키마 등)의 구체 절차(제안 → codex 사전검증 → R2 제자리 반영 → CHANGELOG 기록)와 drift 감사 방법은 `harness-maintain` 스킬이 SSOT다.
```

- [ ] **Step 2: 검증 — 슬림화·무중복 확인**

Run (Git Bash):
```bash
wc -l CLAUDE.md
rg -n "폐기|10단계|11단계 표|보조 엔진|트리거 라우팅 표|├──" CLAUDE.md
rg -n "docs/(proposals|reviews|superpowers/plans)/" CLAUDE.md
rg -n "R1 \(SSOT\)|R2 \(추가 vs 교체\)|R3 \(이력 분리\)|R4 \(무중복\)" CLAUDE.md
rg -n "harness-maintain|외부 harness 플러그인" CLAUDE.md
```
Expected: 줄 수 ≤ 42. 첫 rg(디렉터리 트리·라우팅표·폐기 서술)는 매치 0(제목의 "11단계"는 허용 — "11단계 표"가 아니라 산문). 둘째 rg(옛 경로) 0. 셋째 rg(R1~R4) 4개 매치. 넷째 rg(유지보수 라우팅) — harness-maintain 라우팅 + 외부 플러그인 미사용 문장이 보인다.

- [ ] **Step 3: Commit (사용자 요청 시)**

```bash
git add CLAUDE.md
git commit -m "docs(harness): CLAUDE.md 슬림화 + R1~R4 SSOT 규율 명문화"
```

---

### Task 6: harness-maintain 스킬 신설 (외부 플러그인 대체, in-repo 자립)

외부 harness 플러그인을 끌어쓰지 않고 이 repo 안에서 하네스를 점검·유지보수·확장하도록, R1~R4 규율 + 감사 + 변경 절차 + 진화 트리거를 담은 스킬을 만든다. 외부 메타 스킬의 좋은 프로세스(감사·진화·트리거 충돌 검사)는 가져오되, 이력은 인라인 표가 아니라 `docs/history`로 분리한다.

**Files:**
- Create: `.claude/skills/harness-maintain/SKILL.md`

**Interfaces:**
- Consumes: Task 5(CLAUDE.md가 이 스킬로 라우팅), Task 2(docs/history + CHANGELOG 존재).
- Produces: "하네스 점검·동기화·스킬 추가/수정"의 in-repo 진입점.

- [ ] **Step 1: SKILL.md를 아래 내용으로 생성**

`.claude/skills/harness-maintain/SKILL.md`:

````markdown
---
name: harness-maintain
description: 이 강의 제작 하네스(스킬·에이전트·CLAUDE.md·docs)를 R1~R4 SSOT 규율로 점검·유지보수·확장한다. "하네스 점검", "하네스 감사", "하네스 현황", "스킬 추가", "스킬 수정", "에이전트/스킬 동기화", "하네스 정합성", "drift 확인", "하네스 고쳐줘" 요청 시 반드시 사용. 외부 harness 플러그인(harness:harness) 대신 이 스킬을 쓴다 — 이 프로젝트는 변경 이력을 CLAUDE.md 인라인 표가 아니라 docs/history로 분리 관리하기 때문이다. 하네스 구조를 바꾸는(스킬/에이전트/디렉터리 규약/status.md 스키마) 모든 작업에 적용.
---

# harness-maintain — 하네스 유지보수 (SSOT 규율)

이 스킬은 강의 제작 하네스 자체를 점검·수정·확장한다. 강의 산출물(원고·PPT·책)이 아니라 **하네스 구성물**(`.claude/skills/*`, `.claude/agents/*`, `CLAUDE.md`, `docs/`)이 대상이다. 외부 harness 플러그인을 부르지 않는다.

## 핵심 규율 — R1~R4 (SSOT는 CLAUDE.md 유지 규칙)

규칙 전문은 `CLAUDE.md` 유지 규칙이 SSOT이며, 요지는:
- **R1** 현행 진실만 — 폐기 개념·이전 설계를 인라인에 남기지 않는다.
- **R2** 추가는 덧붙이고, 변경은 제자리 교체 — old+new 공존 금지.
- **R3** 이력은 `docs/history/`에만(CHANGELOG + 변경 폴더) — 권위 문서에 이력 표 금지.
- **R4** 스킬 목록·디렉터리 구조·단계 상세를 CLAUDE.md에 복제 금지 — 각 SKILL.md·파일시스템이 원본.

## 시작 시 (항상)

`docs/history/CHANGELOG.md`를 먼저 읽는다. 최근 변경 맥락을 잡아, 방금 제거한 것을 되돌리는 퇴행을 막는다(인라인 이력 표 없이 그 이점을 회수하는 지점).

## 점검(audit) 절차

"하네스 점검/감사/현황/정합성" 요청 시:

1. `.claude/skills/`의 스킬 목록과 `CLAUDE.md`·`course-pipeline` SKILL의 언급을 대조한다.
2. drift 체크리스트를 grep으로 훑는다:
   - **중복(R4)**: 파이프라인 표·디렉터리 트리·스킬 목록이 CLAUDE.md와 SKILL.md에 이중인지. `rg -n "├──|단계.*스킬|트리거 라우팅" CLAUDE.md`
   - **stale(R1/R2)**: 문서 간 어긋난 사실(단계 수, 경로, 버전). `rg -n "10단계|11단계" docs .claude/skills CLAUDE.md`로 상충 확인.
   - **old+new 공존(R2)**: `rg -n "폐기|이전엔|구버전|deprecated" CLAUDE.md .claude/skills docs/superpowers/specs`
   - **dead-link(R2)**: `rg -n "docs/(proposals|reviews|superpowers/plans)/" .claude/skills docs/superpowers/specs CLAUDE.md` (권위 파일만. `docs/history/`·`.superpowers/sdd/`·`courses/**`는 스냅샷/산출물이라 제외 — 옛 경로가 남아 있어도 정상).
3. 발견을 사용자에게 보고한다(수정 강행 전 확인).

## 변경 절차 (구조 변경 시)

스킬 추가/수정, 에이전트 변경, 디렉터리 규약·status.md 스키마 변경은:

1. `docs/history/<YYYY-MM-DD_변경>/proposal.md`에 계획을 쓴다(문제·제안·회귀 위험·검증). 큰 변경이라 writing-plans로 실행계획을 만들면 그 계획도 **같은 폴더 `plan.md`**에 둔다 — superpowers writing-plans의 기본 저장 위치(`docs/superpowers/plans/`)를 이 규약으로 override한다(계획도 point-in-time 산출물 = 이력이므로). 한 변경의 proposal·codex-review·plan은 항상 한 폴더에 동거한다.
2. codex 사전검증 — Git Bash에서 stdin 닫고 read-only: `codex exec --sandbox read-only '...' </dev/null`. 결과를 같은 폴더 `codex-review.md`에 저장(맨 위 한 줄 결론). 조건부/반려면 반영.
3. 변경을 **R2로 반영**한다:
   - 새 규칙/기능 *추가* → 기존 문서에 덧붙인다.
   - 기존 내용 *변경* → 제자리에서 교체하고 옛 내용을 지운다. old+new를 함께 남기지 않는다.
   - CLAUDE.md엔 상세를 복제하지 않는다(R4) — 포인터만.
4. `docs/history/CHANGELOG.md` 맨 위에 한 줄 추가(날짜·변경·대상·사유·레코드 링크).

## 스킬 추가 시 추가 점검

- **트리거 충돌**: 신규 스킬 description이 기존 스킬과 겹쳐 오발동하지 않는지, near-miss 표현으로 확인한다.
- **description은 적극적으로**: 하는 일 + 구체적 트리거 상황을 적되, 비슷하지만 트리거하면 안 되는 경우와 구분한다.
- **분리 원칙**: 스킬=어떻게, 에이전트=누가. 정의는 파일로 존재해야 다음 세션에서 재사용된다.

## 진화 트리거 (제안 시점)

사용자가 "고쳐줘"라 하지 않아도, 다음이면 변경을 제안한다:
- 같은 유형 피드백이 2회 이상 반복.
- 특정 스킬이 반복 실패하는 패턴.
- 사용자가 오케스트라를 우회해 수동 작업하는 게 관찰됨.

## 산출물 체크리스트

- [ ] CHANGELOG를 먼저 읽었다.
- [ ] 구조 변경이면 proposal + codex-review가 `docs/history/<변경>/`에 있다.
- [ ] 변경을 R2(제자리 교체, old+new 금지)로 반영했다.
- [ ] CLAUDE.md에 상세를 복제하지 않았다(R4) — 포인터만.
- [ ] `docs/history/CHANGELOG.md`에 한 줄 추가했다.
- [ ] drift 체크리스트 grep이 모두 0(중복·stale·old+new·dead-link).
````

- [ ] **Step 2: 검증 — 스킬 구조·트리거·규율 확인**

Run (Git Bash):
```bash
test -f .claude/skills/harness-maintain/SKILL.md && echo "SKILL_EXISTS"
rg -n "^name: harness-maintain$" .claude/skills/harness-maintain/SKILL.md
rg -n "R1|R2|R3|R4|docs/history/CHANGELOG|외부 harness 플러그인" .claude/skills/harness-maintain/SKILL.md
rg -ni "하네스 점검|스킬 추가|동기화" .claude/skills/harness-maintain/SKILL.md
```
Expected: `SKILL_EXISTS`, `name: harness-maintain` 1매치, R1~R4·CHANGELOG·외부 플러그인 언급 present, 트리거 표현(하네스 점검·스킬 추가·동기화) present.

- [ ] **Step 3: Commit (사용자 요청 시)**

```bash
git add .claude/skills/harness-maintain/SKILL.md
git commit -m "feat(harness-maintain): 하네스 유지보수 스킬 신설 — R1~R4 + 감사 + docs/history (외부 플러그인 대체)"
```

---

### Task 7: CHANGELOG 최종 기록 + 정합성 드라이런

**Files:**
- Modify: `docs/history/CHANGELOG.md`

- [ ] **Step 1: 본 변경 줄 추가**

`docs/history/CHANGELOG.md` 표 맨 위(헤더 다음)에 한 줄을 추가한다:

```markdown
| 2026-07-07 | SSOT 규율(R1~R4) 도입 + CLAUDE.md 슬림화 + 이력 docs/history 일원화 + harness-maintain 스킬 신설(외부 플러그인 대체) | CLAUDE.md, course-pipeline, harness-maintain, docs/ | old+new 공존·중복·3중관리 제거, 유지보수 in-repo 자립 | [2026-07-07_ssot-discipline](2026-07-07_ssot-discipline/) |
```

- [ ] **Step 2: 정합성 드라이런 (R1·R4 검사)**

Run (Git Bash):
```bash
echo "-- CLAUDE.md 중복/이력/트리 잔재 --"; rg -n "├──|트리거 라우팅|보조 엔진 스킬|폐기하고|변경 이력" CLAUDE.md
echo "-- 옛 경로 dead-link (권위 파일만; history·courses·sdd 스냅샷 제외) --"; rg -n "docs/(proposals|reviews|superpowers/plans)/" CLAUDE.md .claude/skills docs/superpowers/specs
echo "-- stale 단계수 --"; rg -n "10단계" docs/superpowers/specs .claude/skills CLAUDE.md
echo "-- 빈 옛 폴더 --"; ls docs/proposals docs/reviews docs/superpowers/plans 2>/dev/null
echo "-- 유지보수 라우팅 --"; rg -n "harness-maintain" CLAUDE.md && test -f .claude/skills/harness-maintain/SKILL.md && echo "MAINTAIN_OK"
```
Expected: 1번 매치 0(제목 "11단계"는 별개), 2번 0, 3번 0, 4번 "No such file"(제거됨), 5번 CLAUDE.md에 harness-maintain 라우팅 present + `MAINTAIN_OK`.

- [ ] **Step 3: 최종 구조 확인**

Run: `find docs/history -maxdepth 1 -type d | sort`
Expected: 10개 변경 폴더 + `docs/history` 루트가 보인다.

- [ ] **Step 4: Commit (사용자 요청 시)**

```bash
git add docs/history/CHANGELOG.md
git commit -m "docs(harness): CHANGELOG에 SSOT 재설계 기록 + 정합성 확인"
```

---

## Self-Review

- **Spec coverage:** SSOT 규율 명문화(Task 5 R1~R4), 이력 분리·일원화(Task 2, docs/history + CHANGELOG), 추가 vs 교체 불변식(R2, Task 5), CLAUDE.md 슬림·무중복(Task 4·5), 유지보수 in-repo 자립 — harness-maintain 스킬 신설·외부 플러그인 대체·CLAUDE.md 라우팅(Task 6·5), 참조·stale 정합(Task 3·7), 유지규칙 자기적용(Task 1 codex). 사용자 세 결정(강한 슬림화 / docs/history 물리 이전 / 외부 플러그인 대신 harness-maintain 자립) 모두 반영.
- **Placeholder scan:** 각 재작성 문서(제안서·CHANGELOG·슬림 CLAUDE.md)의 실제 최종 내용을 본문에 수록. 이전 매핑·참조 교체를 old→new 정확 경로 표로 명시. TBD 없음.
- **Type consistency:** 폴더/파일명 규약 통일 — 레코드 폴더 `YYYY-MM-DD_slug`, 내부 파일 `proposal.md`/`codex-review.md`/`plan.md`(+ 예외 `typst-windows-dryrun.md`·`debug-note.md`), ledger `docs/history/CHANGELOG.md`. Task 2가 만든 경로를 Task 3·7이 동일 표기로 소비.
```
