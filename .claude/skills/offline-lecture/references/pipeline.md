# 오프라인강의 레슨 파이프라인

```yaml
lesson_pipeline_registry:
  THEORY: offline-theory-lesson-pipeline
  LAB:    offline-lab-lesson-pipeline
  HYBRID: offline-hybrid-lesson-pipeline
  # SIMULATION 폐지 (v1.7) — 시뮬레이터는 레슨의 파트: required_artifacts에 simulator가 있는 레슨은 research 후 simulator-agent(profile: offline_interactive) 삽입, 원고/판서대본이 시뮬 파트를 서술
```

선언형 실행 구조는 filmed와 동일 (`for_each: lesson_plan where lesson_mode == ...`). 아래는 모드별 상세.

## offline-theory-lesson-pipeline

슬라이드 단계는 **G1의 `style.slide_mode`에 따라 분기**한다 (v1.7 — G5에서 레슨 단위 예외 가능):

```text
research-agent (이론 서사 재료, 주장-출처 쌍)
→ [시뮬 파트 해당 시: 아래 시뮬 파트 절차]
→ script-agent (시나리오/원고 초안 — 하나의 이야기 + 중심 비유 1개)
→ [slide_mode == summary]
    → [G5: 컷 구성·비유 방향 승인]
    → panseo-slide-agent (summary 프로파일: 판서슬라이드 HTML + 판서대본)
→ [slide_mode == rich]
    → slide-storyboard-agent → [G4: 스토리보드 승인]
    → slide-composer-agent (rich 프로파일: 라이트 엔진 html_slide — filmed slide-rules 준용, 대본은 진행 노트가 담당)
→ qa-agent (incremental: 원고↔슬라이드 정합 + 프로파일-밀도 결합 검사)
```

## offline-lab-lesson-pipeline

**LAB required_artifacts 기본 (v1.9.1 문언 확정):** `[step_code, validation_log, lab_guide, problem_sheet, rubric, runbook]` — `script`·`slides`는 **조건부**(별도 도입 판서가 필요한 레슨만). LAB의 도입·진행 역할은 실습 가이드(흐름 지도)와 진행 노트가 기본 담당한다. lesson-classifier는 LAB에 script/slides를 기본 포함하지 않는다.

```text
script-agent (실습 문제 상황 설계)
→ lab 구조 YAML 작성 (learner_task / instructor_checkpoint / submission / rubric_id)
→ lab-code-agent 계획 (단계 목록 + change_reason) → [G3 승인: lab YAML + 코드 계획]
→ lab-code-agent (step 코드 + 실행 검증 → validation_log + 정답 코드 final/)
→ (병렬) lab-guide-agent → 실습 가이드 + 문제지
         rubric-agent → 루브릭 YAML + md (정답 코드와 대조)
→ [G5: 실습 도입 판서슬라이드가 필요한 레슨이면 컷 승인 → panseo-slide-agent]
→ qa-agent (incremental: lab YAML↔가이드↔문제지↔루브릭↔정답 코드 교차 비교)
```

## offline-hybrid-lesson-pipeline

theory + lab 파이프라인을 섹션 단위로 결합. 판서슬라이드는 이론 섹션에, 실습 산출물은 실습 섹션에. G3는 LAB 섹션에만, G5는 판서슬라이드에만 적용.

## 시뮬 파트 (v1.7 — required_artifacts에 simulator가 있는 레슨에 삽입)

```text
[해당 레슨 파이프라인의 research 단계 후]
→ simulator-agent (profile: offline_interactive — 자유 탐색 허용, concept_model 대조 검증)
→ script/판서 시나리오가 시뮬 파트를 서술 (강사가 어떤 질문에 어떤 파라미터를 보여줄지 + 파트 시간)
→ qa-agent incremental: 시뮬 조작 가능성, cue 정합
```

## 수업 운영 산출물 (Phase 4)

```text
runbook-agent: lesson-plan + lab YAML(instructor_checkpoint) + 판서대본 + 시뮬 cue
  → 레슨별 진행 노트 (시간 블록 / 순회 체크리스트 / 지연 시나리오)
institutional-format-agent: 루브릭·평가기준·문제지 원본 → 기관 요구 포맷 (포맷 확인 후만)
```
