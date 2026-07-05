# 루브릭·평가 규칙

스키마는 `lecture-harness`의 `references/schemas.md` 6절. 이 문서는 품질 기준과 정합 검사만 담는다.

## 원본-파생 원칙

```text
원본: YAML (rubric-agent 생성, _workspace/)
사람이 읽는 문서: Markdown 렌더 (guides/)
제출 포맷: PDF/Excel/DOCX 등 변환 (institutional-format-agent, 기관 포맷 확인 후)
```

변환본을 직접 수정하지 않는다. 수정은 항상 YAML 원본에서 시작해 재파생한다.

## 품질 기준

- `weight` 합계 = 100.
- 모든 criteria는 Manifest `learning_goals`와 연결 (`goal_refs`). 어떤 목표와도 연결되지 않는 평가 항목 금지 — 가르치지 않은 것을 평가하지 않는다.
- levels 서술은 관찰 가능한 행동/결과로: "이해한다" ✗ → "예외 응답 형식이 일관적이다" ✓
- excellent/good/needs_improvement 3단계 기본. 기관이 다른 단계 수를 요구하면 원본 스키마를 바꾸지 말고 변환 단계에서 매핑한다.

## 정합 검사 (qa-agent 교차 비교 항목)

1. **루브릭 ↔ 정답 코드**: 정답 코드(final/)가 excellent 기준을 실제로 충족하는가. 충돌 시 삭제하지 않고 양쪽 병기 → 사용자 판단.
2. **루브릭 ↔ 문제지**: 문제지에 없는 요구를 평가하지 않는가 / 요구했는데 평가 항목이 없는 게 있는가 (1:1 대응).
3. **루브릭 ↔ lab YAML**: `evaluation.rubric_id` 연결이 실존하는가.
4. **난이도 ↔ 시간**: 평가 기준이 요구하는 완성도가 수업 시간 안에 도달 가능한가 (G3 계획과 대조).
