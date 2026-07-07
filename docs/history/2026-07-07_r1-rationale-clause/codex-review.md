# codex 사전검증 — R1 "결정 이유 유지" 조항

**결론: 조건부승인 → 조건(현재형 결정이유 vs 변경이력 사유 구분) 반영 완료.**

- 도구: `codex exec --sandbox read-only` (Git Bash, stdin 닫음)
- 대상: `proposal.md` + CLAUDE.md R1 + harness-maintain R1 줄
- tokens used: 121,859

## 지적 (1건) 과 반영

### [R3 충돌/모호성] "결정의 이유(why)" 범위가 너무 넓음
제안 문구가 *변경 이유*(무엇을 왜 바꿨나)까지 권위 문서에 남겨도 되는 것처럼 읽힐 수 있음. R3("변경 이력은 docs/history에만")와 충돌 소지. → **현재형 결정 이유**(현 설계를 이해·운영하는 근거, 유지)와 **변경 이력 사유**(→history)를 명확히 갈라야 함. 또 "why 유지"가 폐기된 옛 상태·옛 경로/dead-link를 남기는 핑계가 되지 않게 못박아야 함.

**반영:** codex 권장 문구 채택 —
> 권위 문서엔 현행 진실과, 현행 설계를 이해·운영하는 데 필요한 **현재형 결정 이유**만 남긴다. 폐기된 옛 상태·이전 설계·"예전엔 X였다"·1회성 이관 절차·옛 경로/dead-link는 인라인에 남기지 않고 `docs/history/`로 보낸다. 무엇을 언제 왜 바꿨는지에 대한 변경 이력(사유)은 R3에 따라 `docs/history/`에만 기록한다.

harness-maintain R1 요지 줄도 "현행 진실 + 현재형 결정 이유만"으로 동기화.

## 기타
- R2: CLAUDE.md R1·harness-maintain R1 줄을 제자리 교체 — OK.
- R4: 상세 절차·스킬 목록 복제 아님 — OK.
- audit(dead-link grep)은 약화되지 않음 — OK.
