# 촬영강의 레슨 파이프라인

레슨 모드별 파이프라인. 분기는 이 registry로만 하고 오케스트레이터 본문에 if를 흩뿌리지 않는다.

```yaml
lesson_pipeline_registry:
  THEORY: filmed-theory-lesson-pipeline
  LAB:    filmed-lab-lesson-pipeline
  HYBRID: filmed-hybrid-lesson-pipeline
  # SIMULATION 폐지 (v1.7) — 시뮬레이터는 레슨의 파트: required_artifacts에 simulator가 있는 레슨은 아래 "시뮬 파트" 단계가 파이프라인에 삽입된다
```

선언형 실행 (오케스트레이터 관점):

```yaml
pipeline:
  - id: classify_lessons
    agent: lesson-classifier-agent
    input: [course_manifest]
    output: [lesson_plan]          # → G2
  - id: create_theory_assets
    for_each: "lesson_plan where lesson_mode == THEORY"
    pipeline: filmed-theory-lesson-pipeline
  - id: create_lab_assets
    for_each: "lesson_plan where lesson_mode == LAB"
    pipeline: filmed-lab-lesson-pipeline
  - id: create_hybrid_assets
    for_each: "lesson_plan where lesson_mode == HYBRID"
    pipeline: filmed-hybrid-lesson-pipeline
  - id: compose_slides             # G4 이후
    agent: slide-composer-agent
  - id: generate_cue_sheet         # 에이전트 아님 — 오케스트레이터가 prompter 원고의 큐 마커를 추출해 생성
    derived_from: prompter_script 큐 마커
    output: [cue_sheet]
  - id: final_qa
    agent: qa-agent                # → G6
```

## 시뮬 파트 (v1.7 — required_artifacts에 simulator가 있는 레슨에 삽입)

시뮬레이터는 독립 레슨이 아니라 레슨의 한 파트다 (권장: 마지막 파트).

```text
[해당 레슨 파이프라인의 research 단계 후]
→ simulator-agent (profile: filmed — concept_model·architecture_diagram과 대조 검증 필수)
→ script-agent가 원고의 시뮬 파트를 서술: [SIM 실행]~[SIM 종료] 구간 + [SIM STEP n] 마커
  (파트별 시간 명시 — 예: 이론 4분 + 시뮬 10분. 자수 예산은 레슨 전체 duration 기준)
→ 이후 프롬프터/스토리보드가 시뮬 cue를 함께 처리 (cue 슬라이드 포함)
```

## filmed-theory-lesson-pipeline

```text
research-agent (이론 서사 재료: 배경/한계/비교/사례, 주장-출처 쌍)
→ [시뮬 파트 해당 시: simulator-agent — 위 시뮬 파트 절차]
→ script-agent (이론 서사 구조 원고 — content-rules.md (b), 시뮬 파트 포함 서술, (f) 원고=책 시드)
→ **원고 북 빌드 (오케스트레이터, v1.8)**: image_gen.py 실행(이미지 생성·삽입) + d2 → pub-d2-diagram 파이프라인(ELK+모노톤) SVG 렌더 병기
→ prompter-script-agent (최종 원고 기준 나레이션 변환 + 길이 검증 — 시각 요소 비발화)
→ slide-storyboard-agent (→ G4 대기)
→ qa-agent (incremental: 원고↔프롬프터↔스토리보드↔시뮬 STEP 정합)
```

## filmed-lab-lesson-pipeline

```text
script-agent (실습 문제 상황 설계 초안)
→ lab-code-agent 계획 수립 (단계 목록 + change_reason) → [G3 승인]
→ lab-code-agent (starter/problem/step/final 생성 + 실행 검증 → validation_log)
→ script-agent (코드 설명 원고 — step 메타의 lecture_message 기반)
→ prompter-script-agent
→ slide-storyboard-agent (핵심 변경점 강조 슬라이드 — 긴 코드 전체 금지) (→ G4 대기)
→ qa-agent (incremental: step 메타↔원고↔슬라이드 코드 조각 일치)
```

## filmed-hybrid-lesson-pipeline

THEORY 파이프라인과 LAB 파이프라인을 레슨 내 섹션 단위로 결합한다. 순서 원칙: 이론(왜) → 실습(어떻게) → 정리(언제 쓰는가). G3는 LAB 섹션에만 적용.

## 촬영 흐름 참고 (산출물이 지원해야 하는 실제 사용 패턴)

```text
PPT(슬라이드) 설명 → 필요 시 별도 시뮬레이터 실행 → PPT 복귀
→ 코드 화면(IDE) 또는 단계별 코드 설명 → PPT로 정리
```

큐시트는 이 전환 지점(prompter 원고의 큐 마커)을 시간 순으로 나열한 것이다.
