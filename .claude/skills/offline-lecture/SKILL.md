---
name: offline-lecture
description: 오프라인(현장) 강의 제작 오케스트레이터. "오프라인 강의 만들어줘", "현장 수업 자료 제작", "실습 수업 패키지", "부트캠프/기관 강의 자료" 요청과 그 후속 작업("다시 실행", "재실행", "수정", "보완", "실습 가이드만 다시", "루브릭만 고쳐줘", "이전 결과 기반으로 개선") 시 반드시 이 스킬을 사용한다. 판서슬라이드+판서대본·실습 가이드·문제지·루브릭·강사 진행 노트·시뮬레이터·단계별 코드·기관 제출용 변환을 승인 게이트와 함께 생성한다. 촬영/녹화용은 filmed-lecture, 온라인 인강은 online-lecture 스킬을 쓴다.
---

# Offline Lecture Orchestrator (오프라인강의)

강사가 현장에서 학생 반응을 보며 판서와 실습을 운영할 수 있는 패키지를 만든다. 시작 전에 `lecture-harness` 스킬을 확인한다. 실행 주체는 `offline-lecture-orchestrator` 에이전트 정의를 따르며, 서브에이전트 호출 시 `model: "opus"`를 명시한다.

## 산출물 계약

**슬라이드 프로파일 선택 (v1.7):** 오프라인은 강의 성격에 따라 **rich(풍부) 또는 summary(판서용)**를 G1 manifest의 `style.slide_mode`로 확정한다 (G5에서 레슨 단위 예외 가능). summary → 판서슬라이드+판서대본(`panseo_slide_html`+`panseo_script`), rich → 고밀도 슬라이드(`html_slide`, 라이트 엔진, filmed slide-rules 준용) + 강사 대본은 진행 노트가 담당.

**기본 산출물:** 슬라이드(위 프로파일에 따름), 실습 가이드, 실습 문제지, 루브릭(YAML 원본 + md 렌더), 강사용 진행 노트, 시뮬레이터 HTML(레슨의 파트로 — v1.7), 정답 코드, 단계별 실습 코드 + validation_log, 기관 제출용 변환 파일.

기관 제출용 변환의 계약 분리: **구조화 원본은 항상 생성**하고, 외부 포맷 변환(`institutional_export`)은 기관 요구 포맷이 확인된 시점에 실행한다 (institutional-format-agent). `institutional_export`는 조건부 산출물이므로 레슨 `required_artifacts`에 넣지 않는다 — 포맷 미확인은 "누락"이 아니라 "조건 대기"이며 G6 final을 막지 않는다 (보고에는 명시).

**절대 규칙: `panseo-board`를 기본 파이프라인에서 생성하지 않는다.** 판서슬라이드에 판서보드 기능이 내장되어 있어 중복이다. "빈 칠판만 달라"는 명시 요청은 파이프라인 밖 단독 처리 (`panseo-board` 스킬 — SKILL.md 말미 "하네스 통합 재정의" 참조).

## 워크플로우

### Phase 0 — 컨텍스트 확인
초기 / 부분 재실행 / 새 실행 판별 (`lecture-harness`의 `references/architecture.md`).

### Phase 1 — Course Manifest → **[G1 승인]** (`delivery_type: offline`)
G1에서 `style.slide_mode`(rich/summary)를 반드시 확정한다 (v1.7).

### Phase 1.5 — 개념 모델·완성 구조도 (v1.7)
research-agent가 `_workspace/01_concept_model.yaml` + `01_architecture_diagram.d2` 생성 (강의 단위 1회). 시뮬레이터의 필수 대조 기준. **summary 판서슬라이드에 직접 파생 금지.**

### Phase 2 — 레슨 플랜 → **[G2 승인: 레슨 플랜 + 개념 모델·구조도 함께]**
lesson-classifier-agent. 오프라인은 LAB 레슨의 실습 시간을 이론 대비 1.5~2배로 반영했는지 확인. 시뮬레이터는 레슨의 파트로만 (v1.7).

### Phase 3 — 레슨별 파이프라인 실행
`references/pipeline.md`의 모드별 파이프라인. LAB 레슨은 lab 구조 YAML + 단계별 코드 계획 시점에 **[G3 승인]**. 판서슬라이드는 컷 구성·중심 비유 방향 시점에 **[G5 승인]** 후 HTML 생성. 판서 규칙: `references/panseo-rules.md`, 루브릭 규칙: `references/rubric-rules.md`.

각 레슨 완료 직후 qa-agent incremental QA (특히 루브릭↔정답 코드, 가이드↔문제지↔lab YAML 정합).

### Phase 4 — 진행 노트 + 기관 변환
runbook-agent로 강사 진행 노트 생성. 기관 요구 포맷이 확인되어 있으면 institutional-format-agent 실행, 미확인이면 "포맷 확인 필요"로 G6 보고에 명시.

### Phase 5 — 최종 QA → **[G6 승인]**
오프라인 G6 체크리스트(`lecture-harness`의 `references/quality-gates.md`)로 검수. Registry에 `panseo_board_html`이 있으면 자동 blocker. blocker 0 + required_artifacts 충족 시에만 `final`.

## 데이터 흐름

```text
manifest.yaml ─→ lesson-plan.yaml ─→ (레슨별)
  lab 구조 YAML(_workspace) ─┬→ lab-guide-agent → 실습 가이드 + 문제지
                             ├→ rubric-agent → 루브릭 YAML + md
                             └→ runbook-agent → 진행 노트
  lab-code-agent → step 코드 + validation_log + 정답 코드(final/)
  script/research → 시나리오 재료 → [slide_mode 분기] summary: panseo-slide-agent → 판서슬라이드+대본 (G5 후)
                                              rich: storyboard → slide-composer → html_slide (G4 후, 대본=진행노트)
  simulator-agent (profile: offline_interactive)
  구조화 원본 → institutional-format-agent → exports/ (포맷 확인 후)
```

## 에러 핸들링

공통 규칙 + 오프라인 특칙: 루브릭과 정답 코드 충돌 시 삭제하지 않고 양쪽 병기 → 사용자 판단. lab YAML의 learner_task/instructor_checkpoint가 비면 파생 에이전트는 생성을 진행하지 않고 반환.

## 테스트 시나리오

- **정상:** "Spring MVC 실습 수업" → G1 → G2 → G3(lab YAML+코드 계획) → G5(컷·비유) → 산출물 생성 → G6 → final.
- **에러(자동 blocker):** 파이프라인 중 실수로 panseo_board_html이 Registry에 등록 → qa-agent가 G6에서 blocker 보고 → 해당 산출물 제거 후 재검수.
- **경계:** 기관 포맷 미확인 → institutional_export를 deferred로 등록하고 G6 보고에 "포맷 확인 필요" 명시 → 사용자 defer 승인 시 final 진행 가능.
