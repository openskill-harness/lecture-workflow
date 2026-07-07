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
