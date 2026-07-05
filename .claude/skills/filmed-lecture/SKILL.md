---
name: filmed-lecture
description: 촬영강의(녹화 강의) 제작 오케스트레이터. "촬영강의 만들어줘", "녹화용 강의 제작", "촬영 패키지 만들어줘" 요청과 그 후속 작업("다시 실행", "재실행", "업데이트", "수정", "보완", "슬라이드만 다시", "프롬프터 원고만 고쳐줘", "이전 결과 기반으로 개선") 시 반드시 이 스킬을 사용한다. 촬영용 HTML 슬라이드·원고·프롬프터 나레이션·단계별 실습 코드·시뮬레이터·촬영 큐시트를 승인 게이트와 함께 생성한다. 오프라인 현장 강의는 offline-lecture, 온라인 인강은 online-lecture 스킬을 쓴다.
---

# Filmed Lecture Orchestrator (촬영강의)

촬영용 슬라이드와 프롬프터 중심의 강의 패키지를 만든다. 시작 전에 `lecture-harness` 스킬(공통 스키마·게이트·콘텐츠 규칙)을 확인한다. 실행 주체는 `filmed-lecture-orchestrator` 에이전트 정의를 따르며, 서브에이전트 호출 시 `model: "opus"`를 명시한다.

## 산출물 계약

**기본 산출물(최종 목표):** HTML 슬라이드, PPTX 변환본, 강의 원고, 프롬프터 나레이션 원고, 단계별 실습 코드, 실행 검증 로그, 시뮬레이터 HTML, 상황 만화/이미지 에셋, 촬영 큐시트.

**현재 MVP 범위:** 위에서 **PPTX 변환본·상황 만화/이미지 에셋 제외** (사용자 결정 2026-07-05, Registry에 타입만 예약). 계약 자체는 축소된 것이 아니다 — 후속 확장 시 복원한다.

## 워크플로우

### Phase 0 — 컨텍스트 확인
`courses/{id}/` 존재 여부로 실행 모드 판별: 초기 실행 / 부분 재실행(해당 에이전트만) / 새 실행(`_workspace/` → `_workspace_prev/`). 판별 기준은 `lecture-harness`의 `references/architecture.md`.

### Phase 1 — Course Manifest → **[G1 승인]**
사용자 입력으로 `manifest.yaml` 작성 (`delivery_type: filmed`). 부족한 정보(대상 학습자의 아는 것/모르는 것, 총 시간, 기술 스택 버전)는 1~2개 질문으로 채운다.

**촬영 시간 기준: 촬영강의는 1편 = 약 30분이 표준이다** (사용자 확인 2026-07-05). 콘텐츠가 30분을 넘으면 Manifest `duration.episodes`로 여러 편을 선언한다 (스키마 v1.5). 레슨의 편 배정은 G2에서 레슨 플랜과 함께 확정한다. total_minutes를 임의로 크게 잡지 않는다.

미리 만들어진 자산(코드 등)이 있으면 G1에서 `existing_assets`로 등록한다 — 반입 모드(역-단계화/검증만/read-only)는 G3에서 확정 (`lecture-harness`의 schemas.md·설계 문서 10절).

### Phase 1.5 — 개념 모델·완성 구조도 (v1.7)
research-agent가 `_workspace/01_concept_model.yaml` + `01_architecture_diagram.d2`를 생성한다 (강의 단위 1회). 시뮬레이터 시나리오·rich 슬라이드 도형·원고 d2 시드의 원천.

### Phase 2 — 레슨 플랜 → **[G2 승인: 레슨 플랜 + 개념 모델·구조도 함께]**
lesson-classifier-agent 호출 → `lesson-plan.yaml`. 강의 전체가 단일 모드로 나오면 의심하고 재검토한다. 시뮬레이터가 필요한 레슨은 독립 레슨이 아니라 `required_artifacts: [simulator]` 부착 + 원고 시뮬 파트로 (v1.7).

### Phase 3 — 레슨별 파이프라인 실행
`references/pipeline.md`의 모드별 파이프라인을 레슨마다 실행한다. 서로 다른 레슨은 병렬 호출 가능. LAB 레슨은 단계별 코드 계획 시점에 **[G3 승인]**, 스토리보드 완성 시점에 레슨 묶음으로 **[G4 승인]**을 받는다.

각 레슨 완료 직후 qa-agent로 incremental QA를 돌린다 (전체 완성 후 1회가 아니라).

### Phase 4 — 슬라이드 조립 + 큐시트
G4 승인된 스토리보드로 slide-composer-agent가 HTML 슬라이드 조립. prompter 원고의 큐 마커(`[SLIDE n]`, `[SIM 실행]`, `[IDE 화면]`)를 모아 촬영 큐시트(`cue_sheet`)를 생성한다. 슬라이드 규칙: `references/slide-rules.md`, 나레이션 규칙: `references/prompter-rules.md`.

### Phase 5 — 최종 QA → **[G6 승인]**
qa-agent에 촬영강의 G6 체크리스트(`lecture-harness`의 `references/quality-gates.md`)를 입력해 전체 검수. blocker 0이고 required_artifacts가 모두 존재할 때만 Registry를 `final`로 승격한다. 누락 시 repair/defer/abort 사용자 선택.

## 데이터 흐름

```text
manifest.yaml ─→ lesson-plan.yaml ─→ (레슨별)
  research brief ─→ 원고 ─→ 프롬프터 원고 ─→ 스토리보드 ─→ HTML 슬라이드
  step 코드 + validation_log ──────────────────↗ (코드 슬라이드 재료)
  시뮬레이터 HTML (profile: filmed) ──→ cue만 슬라이드/원고에 삽입
모든 산출물 → artifacts.yaml 등록, 중간물 → _workspace/{phase}_{agent}_{artifact}.{ext}
```

## 에러 핸들링

공통 규칙(`architecture.md`)을 따른다: 1회 재시도 → 누락 명시 진행, 필수 산출물 누락 시 G6 final 불가, 상충 산출물 출처 병기. 나레이션 길이 초과는 prompter-script-agent가 임의 삭제하지 않고 보고한다.

## 테스트 시나리오

- **정상:** "Spring MVC 요청 흐름" 촬영강의 → G1 → G2(레슨 플랜: THEORY(시뮬 파트)+THEORY+LAB + 개념 모델·완성 구조도) → G3 코드 계획 → G4 스토리보드 → 산출물 생성 → G6 → final.
- **에러:** simulator-agent 2회 실패 → simulator_html 누락으로 G6 보고 → 사용자 "시뮬레이터만 다시" → Phase 0이 부분 재실행 판별 → simulator-agent만 재호출.
- **경계:** 나레이션이 duration 대비 15% 초과 → prompter-script-agent가 초과 규모·삭제 후보 보고 → 사용자 결정 후 재변환.
