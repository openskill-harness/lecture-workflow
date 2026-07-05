# 02. Lesson Classifier Rationale — spring-mvc-offline-2026

대상: 180분 오프라인 현장 실습 수업 / slide_mode: summary(판서) / 반입 자산: L04 stepped 코드(verify_only) + 재사용 시뮬레이터 후보 / 개념 모델 재사용(scope_boundaries 준수).

## 레슨별 모드 선택 이유 (1줄)

- **L01 (THEORY, 45분)** — goal[0] "요청 흐름을 **설명**할 수 있다"는 이해 목표 → THEORY. 요청 흐름 시뮬레이터는 독립 레슨이 아니라 이 레슨의 마지막 파트(required_artifacts.simulator + 원고 [SIM 실행]~[SIM 종료], 이론 28 + 시뮬 17).
- **L02 (THEORY, 30분)** — goal[1] "책임을 **구분**할 수 있다"도 이해 목표 → THEORY. 반입 코드의 final 상태를 read-only로 관찰만 하고 직접 빌드는 L03에 넘겨 동일 stepped 자산의 이중 생산을 피함.
- **L03 (LAB, 85분)** — goal[2] "Controller를 **직접 구현하고 실행**해 볼 수 있다"는 수행 목표이며 오프라인 LAB는 학생이 직접 실습 → 실습 시간을 이론 레슨의 약 1.9배로 반영. 반입 L04 stepped 코드가 실습 백본.

## 시간 계약

| 항목 | 분 |
|------|----|
| L01 THEORY | 45 |
| L02 THEORY | 30 |
| L03 LAB | 85 |
| **레슨 합계** | **160** |
| 휴식(10분 × 2회, duration 밖) | 20 |
| **총 운영** | **180** |

여유: 레슨 합계 160 = total_minutes 180 - 휴식 20. 권장선(≤160) 정확히 충족. LAB(85)에 학생 타이핑·실행·디버깅 여유 확보.

## 판단이 갈린 지점

1. **2 레슨(THEORY + 110분 HYBRID) vs 3 레슨** → 3 레슨 채택. 각 목표를 한 레슨에 1:1로 묶어 하위 산출물(lab YAML·루브릭·runbook 시간블록) 세분화 이점 > 단일 대형 HYBRID의 통합 이점.
2. **L02 책임 구분을 THEORY vs HYBRID/LAB** → THEORY 채택. "구분(이해)" 목표이고, 여기서 학생이 또 빌드하면 L03과 동일 stepped 자산을 두 번 소비. 관찰(read-only)로 두고 빌드는 L03에 일원화.
3. **runbook을 전 레슨 required_artifacts에 부착 vs 코스 레벨만** → 전 레슨 부착. required_outputs에 runbook이 있고 offline pipeline Phase 4가 "레슨별 진행 노트"를 명시하므로 G6 추적을 위해 각 레슨에 부착(실제 생성은 Phase 4 일괄).
4. **LAB 시간 85분** → 이론 예산에서 끌어와 배정. 오프라인 LAB 학생 실습 시간(1.5~2배) 원칙을 지키려 THEORY 두 레슨을 45/30으로 압축.

## 기존 자산 재사용이 걸리는 레슨

- **시뮬레이터(재사용 후보, spring-mvc-2026 요청 흐름 sim)** → **L01**. offline_interactive 프로파일 적합성은 후속 검증(자유 탐색 허용 여부 확인 필요).
- **L04 stepped 코드 (courses/spring-mvc-2026/code/L04, stepped·verify_only)** → **L03 primary** (실습 백본, 단계 구조 유지·검증/메타만, 이 강의 폴더로 복사 후 사용). **L02**는 동일 코드의 final 상태를 read-only 관찰 자료로만 참조 — 코드 산출물 생산 주체는 L03 하나로 유지(하위 파이프라인 중복 생산 방지).

## 에러/초과 여부

- 세 목표 모두 160분 내 소화 가능 판단. 학습 목표 삭제·초과 규모 보고 없음. scope_boundaries 밖 개념(Filter/Security/async/ThemeResolver/JPA 상세)은 어느 레슨에도 편성하지 않음.
