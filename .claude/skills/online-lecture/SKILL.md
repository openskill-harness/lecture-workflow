---
name: online-lecture
description: 온라인 강의(유튜브 판서 VOD — 강사가 요약 슬라이드 위에 무조건 판서하며 녹화하는 강의) 제작 오케스트레이터. "온라인 강의 만들어줘", "유튜브 강의 자료", "인강 자료 제작", "판서 강의 만들어줘" 요청과 그 후속 작업("다시 실행", "재실행", "수정", "보완", "원고만 다시", "시뮬레이터만 고쳐줘", "이전 결과 기반으로 개선") 시 반드시 이 스킬을 사용한다. 원고·판서슬라이드(summary)+판서대본·시뮬레이터를 승인 게이트와 함께 생성한다. 고밀도 슬라이드 촬영 패키지는 filmed-lecture, 현장 수업은 offline-lecture 스킬을 쓴다.
---

# Online Lecture Orchestrator (온라인강의 = 유튜브 판서 VOD, v1.7)

**온라인 라인 = 유튜브 녹화 판서 강의다** (사용자 정의 2026-07-05): 강사가 요약(summary) 슬라이드를 띄우고 그 위에 **무조건 판서하며** 녹화한다. 슬라이드 프로파일은 summary 고정 — 글자 적게, 판서 여백이 수업 설계의 전제. **요구사항을 단순하게 유지한다.** 시작 전에 `lecture-harness` 스킬을 확인한다. 실행 주체는 `online-lecture-orchestrator` 에이전트 정의를 따르며, 서브에이전트 호출 시 `model: "opus"`를 명시한다.

## 산출물 계약

**기본 산출물 (3종만):** 강의 원고, 판서슬라이드 HTML + 판서대본(panseo-slide **summary 프로파일 고정**), 시뮬레이터 HTML(해당 레슨의 파트로 — v1.7).

- 프롬프터·PPTX·실습가이드·루브릭은 기본 산출물에 **넣지 않는다.** 확장 요청이 오면 즉석 추가하지 말고 설계 문서 개정 + GPT 교차 검증을 먼저 거친다.
- **panseo-board 기본 생성 금지** (판서슬라이드에 판서보드 기능 내장 — 중복).

## 워크플로우

### Phase 0 — 컨텍스트 확인
초기 / 부분 재실행 / 새 실행 판별 (`lecture-harness`의 `references/architecture.md`).

### Phase 1 — Course Manifest → **[G1 승인]** (`delivery_type: online`)

### Phase 1.5 — 개념 모델·완성 구조도 (v1.7)
research-agent가 `_workspace/01_concept_model.yaml` + `01_architecture_diagram.d2` 생성. **판서슬라이드(summary)에 직접 파생 금지** — 시뮬레이터·원고 시드의 원천으로만.

### Phase 2 — 레슨 플랜 → **[G2 승인: 레슨 플랜 + 개념 모델·구조도 함께]**
lesson-classifier-agent. 시청자가 영상으로 보므로 레슨 단위를 짧게 (한 레슨 = 한 개념 덩어리) 유지했는지 확인. 시뮬레이터는 레슨의 파트로만 (v1.7).

### Phase 3 — 레슨별 파이프라인 실행
`references/pipeline.md`. 원고는 섹션마다 hook→concept→visual→interaction→summary 구조 (`references/self-paced-rules.md`). 판서슬라이드는 컷·비유 방향 시점에 **[G5 승인]**. 시뮬레이터는 `online_self_paced` 프로파일.

각 레슨 완료 직후 qa-agent incremental QA (원고↔판서슬라이드 흐름 정합).

### Phase 4 — 최종 QA → **[G6 승인]**
온라인 G6 체크리스트(`lecture-harness`의 `references/quality-gates.md`)로 검수. blocker 0 + required_artifacts 충족 시에만 `final`.

## 데이터 흐름

```text
manifest.yaml ─→ lesson-plan.yaml ─→ (레슨별)
  script-agent → 섹션 구조 원고 (hook/concept/visual/interaction/summary)
  → [G5] → panseo-slide-agent → 판서슬라이드 + 대본 (원고 흐름과 일치)
  simulator-agent (profile: online_self_paced) → 원고 interaction 필드와 cue 연결
모든 산출물 → artifacts.yaml, 중간물 → _workspace/
```

## 에러 핸들링

공통 규칙(`architecture.md`). 온라인 특칙: 원고 섹션에 interaction cue가 있는데 시뮬레이터 생성이 실패하면, cue를 제거하지 말고 G6 보고에 누락으로 명시한다 (defer 시 원고의 해당 cue에 "준비 중" 처리 여부를 사용자에게 확인).

## 테스트 시나리오

- **정상:** "DispatcherServlet 온라인 강의" → G1 → G2 → 원고 → G5(컷·비유) → 판서슬라이드+시뮬레이터 → G6 → final.
- **에러(자동 blocker):** Registry에 panseo_board_html 등록 → qa-agent blocker.
- **경계:** 사용자가 "실습 가이드도 넣어줘" → 즉석 추가하지 않고 설계 개정 + GPT 교차 검증 절차 안내.
