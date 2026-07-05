# codex(GPT) 교차 검증 결과 — 하네스 스캐폴드

- 날짜: 2026-07-05
- 도구: OpenAI Codex CLI 0.142.0, model gpt-5.5, sandbox read-only
- 검토 대상: `.claude/agents/` (17), `.claude/skills/` (5 + references), `CLAUDE.md` — 기준: 설계 문서 v1.2 + 인수인계 문서
- 결과: **blocker 0 / warning 3 / suggestion 1** → 전건 반영, 설계 문서 v1.3으로 개정

## 지적 사항과 처리

| 심각도 | 지적 | 처리 |
|--------|------|------|
| warning | 온라인 라인 범위 초과: `online-lab-lesson-pipeline`이 lab-code-agent·validation_log를 사용 — 설계상 온라인 기본 산출물은 3종(원고/판서슬라이드/시뮬레이터)뿐이고 오케스트레이터 호출 목록과도 불일치 | **반영**: 온라인 pipeline에서 LAB/HYBRID 파이프라인 제거. LAB/HYBRID 레슨이 나오면 G2에서 재구성 또는 설계 개정+GPT 검증을 사용자에게 확인하도록 규정 |
| warning | 명시 요청 panseo-board와 QA 자동 blocker 규칙 충돌 — 예외를 표현할 필드 부재 | **반영**: Registry에 `pipeline_scope: standalone` + `request_reason` 필드 추가 (schemas.md). blocker는 "두 필드 없이 등록된 경우"로 한정 (quality-gates.md, qa-agent.md, bridge panseo-board.md) |
| warning | `institutional_export`의 deferred와 G6 final 조건 충돌 — 기본 산출물이면서 조건부 실행이라 required 판정이 흔들림 | **반영**: 조건부 산출물은 `required_artifacts`에 넣지 않음, 조건 미충족은 "조건 대기"로 보고. 사용자 승인된 `deferred`는 final을 막지 않음 (quality-gates.md, offline SKILL.md, schemas.md) |
| suggestion | filmed pipeline `compose_and_cue` 단계의 `agents` 배열에 비에이전트 항목 혼입 | **반영**: `compose_slides`(agent)와 `generate_cue_sheet`(derived_from, 오케스트레이터 수행)로 분리 |

## codex 추가 확인 사항 (이상 없음)

- `.claude/agents`의 에이전트명 참조는 모두 실제 파일과 일치
- panseo-board 기본 파이프라인 금지, PPTX MVP 제외, G1~G6 게이트는 설계 v1.2와 정합

## 후속

- 설계 문서 v1.3 개정 이력에 본 검증을 근거로 기록 (Registry 필드 추가·deferred 규칙·온라인 계약 경계는 이 검증의 권고를 그대로 채택한 것이므로 별도 재검증 생략)
