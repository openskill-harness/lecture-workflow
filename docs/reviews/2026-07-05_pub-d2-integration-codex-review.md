# codex(GPT) 사전 검증 결과 — pub-d2-diagram 하네스 연결 계획 (v1.9)

- 날짜: 2026-07-05
- 대상: `docs/proposals/2026-07-05_pub-d2-diagram-integration.md` (반영 전 계획서 — 선반영 금지 원칙 준수)
- 결과: **blocker 1 / warning 5 / suggestion 3** → 전건 계획서에 반영 후 진행

## 지적과 처리

| 심각도 | 지적 | 처리 |
|--------|------|------|
| blocker | 계획 예시의 d2 class 문법 `노드: "라벨".class: x`가 d2 0.7.1에서 무효 (codex가 `d2 validate`로 실증) | **반영**: `노드: "라벨" { class: x }` 형식으로 예시 교체 + Global Constraints에 문법 규칙 명시 |
| warning | SVG-only는 타당하나 스킬 원 파이프라인(→PNG)과 scope 구분 필요 | 반영됨 (SKILL 통합 섹션에 "SVG까지 — 원고 계약" 명시 기존재) |
| warning | 모노톤 ↔ 라이트 슬라이드: 별개 산출물이라 충돌 없음 — 단 명시 필요 | **반영**: Global Constraints에 "원고 SVG=모노톤 / 슬라이드 SVG=라이트 토큰, 별개" 명시 |
| warning | 기존 `direction: down` 3건(l01-d3, l02-d1, l02-d6) right 전환 시 레이아웃 의미 변화 가능 | **반영**: 해당 3건 시각 검수 필수 조항 추가 |
| warning | 렌더 스크립트 가드가 WARN-only (exit 0) — 검증 미연결 | **반영**: strict 모드로 강화 (스타일 위반 = FAIL, exit 1) |
| warning | 최종 검증이 테마색 2종만 검사 | **반영**: 테마색 5종 + streaks + 비허용 fill 전수 검사로 확대 |
| suggestion | 스크립트 stderr 빈 문자열·빈 블록 안전 처리 | **반영** |
| suggestion | quality-gates에 v1.9 d2 스타일 게이트 추가 (재실행 시 유지) | **반영**: Task 2에 Step 5 신설 |
| suggestion | 스타일 변환 검증 기록을 artifacts에 남기기 | 반영됨 (Task 6 Step 2 기존재) |

## 재검증 생략 사유

blocker 수정안이 검토자(codex) 본인의 처방을 그대로 채택한 문법 교체이며, codex가 이미 `d2 validate`로 해당 형식의 유효성을 실증했으므로 전체 재검증을 생략한다.
