---
name: harness-maintain
description: 이 강의 제작 하네스(스킬·에이전트·CLAUDE.md·docs)를 R1~R4 SSOT 규율로 점검·유지보수·확장한다. "하네스 점검", "하네스 감사", "하네스 현황", "스킬 추가", "스킬 수정", "에이전트/스킬 동기화", "하네스 정합성", "drift 확인", "하네스 고쳐줘" 요청 시 반드시 사용. 외부 harness 플러그인(harness:harness) 대신 이 스킬을 쓴다 — 이 프로젝트는 변경 이력을 CLAUDE.md 인라인 표가 아니라 docs/history로 분리 관리하기 때문이다. 하네스 구조를 바꾸는(스킬/에이전트/디렉터리 규약/status.md 스키마) 모든 작업에 적용.
---

# harness-maintain — 하네스 유지보수 (SSOT 규율)

이 스킬은 강의 제작 하네스 자체를 점검·수정·확장한다. 강의 산출물(원고·PPT·책)이 아니라 **하네스 구성물**(`.claude/skills/*`, `.claude/agents/*`, `CLAUDE.md`, `docs/`)이 대상이다. 외부 harness 플러그인을 부르지 않는다.

## 핵심 규율 — R1~R4 (SSOT는 CLAUDE.md 유지 규칙)

규칙 전문은 `CLAUDE.md` 유지 규칙이 SSOT이며, 요지는:
- **R1** 현행 진실 + 현재형 결정 이유(why)만 — 폐기된 옛 상태·이전 설계·1회성 이관·옛 경로는 history로. "왜 지금 이렇게 설계했나"(현재형 근거)는 유지하되, "무엇을 왜 바꿨나"(변경 사유)는 R3대로 history에만.
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

1. `docs/history/<YYYY-MM-DD_변경>/proposal.md`에 계획을 쓴다(문제·제안·회귀 위험·검증). 큰 변경이라 writing-plans로 실행계획을 만들면 그 계획도 **같은 폴더 `plan.md`**에 둔다 — superpowers writing-plans의 기본 저장 위치(`docs/superpowers/plans`)를 이 규약으로 override한다(계획도 point-in-time 산출물 = 이력이므로). 한 변경의 proposal·codex-review·plan은 항상 한 폴더에 동거한다.
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
