# codex(GPT) 사전 검증 결과 — CLAUDE.md 변경 이력 분리

- 날짜: 2026-07-05
- 도구: OpenAI Codex CLI 0.142.0, sandbox read-only
- **절차: 변경 처리 원칙(선반영 금지)의 첫 정식 적용** — 사용자 제안 → 계획 → 사전 검증 → 사용자 승인(플랜 모드) → 반영 순서 준수
- 제안: CLAUDE.md에는 현재 유효 상태만 남기고 변경 이력을 `docs/harness-changelog.md`로 분리
- 결과: **아이디어 타당 판정, blocker 0 / warning 2 / suggestion 2** → 전건 계획에 반영 후 실행

## codex 판정 요지

> CLAUDE.md는 매 세션 로딩되는 진입 문서라 append-only 이력을 계속 키우면 비용 대비 효용이 낮다. 최선안: "CLAUDE.md = 현재 유효 상태 + 포인터 / harness-design-v1.md = 설계 규범 버전 이력 / harness-changelog.md = 운영 변경 append-only 감사 로그" 3분리.

## 지적 사항과 처리

| 심각도 | 지적 | 처리 |
|--------|------|------|
| warning | lecture-harness SKILL.md에도 stale 버전 핀(v1.4) 잔존 | **반영**: CLAUDE.md와 함께 버전 핀 제거 ("문서 내 개정 이력 표 참조") |
| warning | changelog ↔ 설계 문서 개정 이력의 역할 미구분 시 중복 기록 지속 | **반영**: changelog 상단에 역할 구분 조항 명시 (설계 규범 변경은 설계 문서에도 / 운영 변경은 changelog에만) |
| suggestion | CLAUDE.md의 현재 상태 요약이 구체적이어야 컨텍스트 손실 없음 | **반영**: 현재 구성 요약(에이전트/스킬/강의 + 유효 override) 추가, 규칙 섹션 유지 |
| suggestion | 참조 갱신 대상 확정 (3곳: SKILL.md 2곳 + gpt-review-process 1곳, 과거 review 문서는 이력이라 제외) | **반영**: 3곳만 갱신, 검증 grep으로 확인 |

## 반영 후 검증

- CLAUDE.md/.claude 내 "변경 이력" 언급 = 포인터 1줄만 잔존 ✓
- CLAUDE.md 버전 핀 잔존 0 ✓
- changelog 8행 (기존 6 + 원칙 등록 + 본 변경) + 역할 구분 조항 ✓
