# 02. Lesson Classifier Rationale — spring-mvc-2026

G1 승인된 Course Manifest(촬영강의 1편, 30분, 학습 목표 3개)를 레슨 4개로 분해했다.
강의 전체를 한 모드로 묶지 않고, 목표별 학습 성격에 따라 THEORY/SIMULATION/LAB을 섞었다.

## 레슨별 모드 선택 이유 (1줄)

- **L01 (THEORY, goal 0)** — "왜 DispatcherServlet인가"는 개념·배경·이유 설명이라 THEORY. 오프닝 겸 전체 흐름의 밑그림.
- **L02 (SIMULATION, goal 0)** — 요청이 Tomcat→DispatcherServlet→HandlerMapping→Controller를 통과하는 흐름은 정적 슬라이드보다 단계 진행 시뮬레이터로 추적할 때 이해가 빠르다. Manifest가 simulator를 required_output으로 명시한 지점과 정확히 대응.
- **L03 (THEORY, goal 1)** — 책임 구분은 코드보다 "무엇을 어디에 두는가"의 판단 기준(비교·사례) 설명이 핵심이라 THEORY.
- **L04 (LAB, goal 2)** — "구현할 수 있다"는 단계별 코드 산출이 필수. step_code + validation_log로 요청 매핑→응답을 실제로 짜 보이며, 그 과정에서 L03의 책임 구분(goal 1)을 코드로 재확인.

## 시간 배분 근거 (합계 30분 = total_minutes, 초과 0)

| 레슨 | 모드 | 분 | 근거 |
|------|------|----|------|
| L01 | THEORY | 4 | 오프닝 + 개념 도입. 짧게 밑그림만. |
| L02 | SIMULATION | 7 | 시뮬레이터 조작 + 단계별 나레이션. cue 흐름에 여유. |
| L03 | THEORY | 7 | 책임 구분은 판단 기준 설명이라 사례 포함 시간 확보. |
| L04 | LAB | 12 | 최대 비중. 촬영강의라 학생 실습 시간이 아니라 **코드 설명 시간** 기준(요청 매핑→DTO→응답 단계 walkthrough). 실습 라인의 1.5~2배 여유는 적용하지 않음. |

- goal 0은 THEORY(왜)+SIMULATION(어떻게 흐르는가)로 이원화해 이해 깊이를 확보. 나머지 두 목표는 각각 1개 레슨에 대응.
- 모든 레슨이 최소 1개 목표에 연결되며, 목표 미연결 레슨(내용 불리기) 없음.

## required_artifacts 산정

촬영강의 pipeline.md 모드별 기본 산출물에서 시작:
- THEORY: script, prompter_script, slides
- SIMULATION: simulator, script, prompter_script, slides (슬라이드는 cue 중심 — 시뮬 내용 복제 금지)
- LAB: step_code, validation_log, script, prompter_script, slides (긴 코드 전체 대신 핵심 변경점 강조)

Manifest required_outputs의 `source_code`는 L04의 step_code로, `cue_sheet`는 레슨 산출물이 아니라 오케스트레이터가 prompter 큐 마커에서 코스 단위로 추출(파이프라인 규정) — 레슨 required_artifacts에 넣지 않음.

## 판단이 갈렸던 지점

1. **goal 0을 1개 레슨(HYBRID)로 둘까 vs THEORY+SIMULATION 2개로 쪼갤까** — 쪼갬. Manifest가 simulator를 명시했고, 요청 흐름은 시뮬레이터가 주인공이 되는 SIMULATION 성격이 뚜렷해 개념 도입(THEORY)과 분리하는 편이 하위 산출물 파이프라인(cue 중심 슬라이드 등)도 깔끔.
2. **L04 LAB 시간** — 에이전트 기본 원칙은 LAB에 이론 대비 1.5~2배 여유이나, 이는 학생 실습 라인 기준. 촬영강의는 코드 설명 시간이라 과도한 배증 없이 12분(전체의 40%)로 최대 비중만 부여. 초과 위험 없이 30분에 정확히 수렴.

## 시간 소화 가능성

학습 목표 3개는 30분 안에 소화 가능하다고 판단(초과 규모 보고 사항 없음). 각 목표가 도입-흐름-판단-구현으로 자연스럽게 배치됨.
