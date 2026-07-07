# 제안: 하네스 SSOT 규율 + 이력 일원화

- 날짜: 2026-07-07
- 유형: 하네스 구조 변경 (디렉터리 규약 + CLAUDE.md 스키마 + 유지 규칙 + 신규 스킬)

## 문제
- CLAUDE.md가 스킬 목록·디렉터리 구조·단계 상세를 담아 각 SKILL.md와 이중 관리(중복).
- 권위 문서에 폐기된 v1 서술("라인 구분·승인 게이트 폐기")과 stale 단계수(spec/plan "10단계" vs CLAUDE "11단계")가 old+new로 공존.
- "내용 추가 vs 교체" 규율이 어디에도 문서화되지 않아 drift가 반복 발생.
- 변경 이력이 docs/proposals·docs/reviews·docs/superpowers/plans로 흩어져 3중 관리.
- 하네스 유지보수를 외부 harness 플러그인에 의존 — 그 플러그인은 변경 이력을 CLAUDE.md 인라인 표로 두라 권해 R3(이력 분리)와 충돌.

## 제안
- 2계층 모델: Tier 1(SSOT, 현행 진실만) / Tier 2(docs/history, append-only 이력).
- proposals+reviews+plans를 docs/history/<날짜_변경>/로 물리 통합, docs/history/CHANGELOG.md ledger 신설.
- CLAUDE.md를 포인터+트리거+유지규칙(R1~R4)으로 슬림화, 파이프라인 상세는 course-pipeline SKILL로 이관.
- R1(SSOT)·R2(추가 vs 교체)·R3(이력 분리)·R4(무중복)을 유지 규칙에 명문화.
- 외부 harness 플러그인 대신 in-repo harness-maintain 스킬을 신설(R1~R4 + 감사 + 변경 절차), CLAUDE.md가 유지보수를 그 스킬로 라우팅.

## 회귀 위험
- proposals/reviews를 참조하는 6+ SKILL/spec의 경로 파손 → Task 3에서 일괄 갱신.
- spec은 이동하지 않음(Tier 1 유지) → 참조 파손 최소화.
- 외부 플러그인은 삭제하지 않음(전역 영향 회피) — CLAUDE.md 라우팅으로 이 프로젝트에서만 비사용.

## 검증
- codex 사전검증 read-only.
- 반영 후 정합성 드라이런: CLAUDE.md 중복 0, stale "10단계" 0, dead-link 0, harness-maintain 라우팅 present.
