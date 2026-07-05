# 하네스 아키텍처

설계 원천: `docs/harness-design-v1.md` (v1.2). 이 문서는 실행에 필요한 요약이다.

## 실행 모드: 서브에이전트 + 파일 기반

- 오케스트레이터(메인 세션 또는 라인 오케스트레이터 에이전트)가 Agent 도구로 서브에이전트를 호출한다. 팀 도구(TeamCreate)가 없는 환경이므로 팀 모드를 쓰지 않는다.
- 병렬 가능한 독립 작업(예: 서로 다른 레슨의 산출물)은 `run_in_background: true`로 병렬 호출한다.
- 모든 Agent 호출에 `model: "opus"` 명시. opus 미지원 환경이면 세션 기본 모델로 대체하고 게이트 보고에 명시한다.
- 에이전트 정의는 `.claude/agents/{name}.md`에 있다. prompt에 역할을 즉석으로 넣지 않는다.

## 데이터 전달 프로토콜

- **파일 기반이 기본.** 중간 산출물은 `courses/{course-id}/_workspace/`에 저장한다.
- 파일명 컨벤션: `{phase}_{agent}_{artifact}.{ext}` — 예: `02_classifier_rationale.md`, `04_labcode_L03_validation.log`
- 최종 산출물만 강의 디렉토리(slides/, scripts/, simulators/, code/, guides/, exports/)에 출력한다.
- `_workspace/`는 삭제하지 않는다 (감사 추적 + 부분 재실행 근거).
- 서브에이전트 반환값은 요약·메타데이터만 담고, 본체는 파일로 전달한다.

## 강의 디렉토리 구조

```text
courses/{course-id}/
  manifest.yaml        # G1 확정본
  lesson-plan.yaml     # G2 확정본
  artifacts.yaml       # Artifact Registry (상태: draft/approved/final/deferred)
  _workspace/          # 중간 산출물 (보존)
  slides/  scripts/  simulators/  code/  guides/  exports/
```

## 재실행 판별 (모든 라인 오케스트레이터의 Phase 0)

| 상태 | 판별 | 동작 |
|------|------|------|
| 초기 실행 | `courses/{id}/` 없음 | 전체 파이프라인 |
| 부분 재실행 | `_workspace/` 존재 + 부분 수정 요청 | 해당 에이전트만 재호출, 하위 의존 산출물 정합 재검사 |
| 새 실행 | `_workspace/` 존재 + 새 입력 제공 | `_workspace/` → `_workspace_prev/` 이동 후 전체 실행 |

## 에이전트 카탈로그

| 에이전트 | 라인 | 역할 요약 |
|----------|------|----------|
| filmed/offline/online-lecture-orchestrator | 라인별 | 라인 스킬 워크플로우 실행 주체 |
| lesson-classifier-agent | 공용 | Manifest → Lesson Plan (모드 부여) |
| research-agent | 공용 | 주장-출처 쌍 research brief |
| script-agent | 공용 | 강의 원고 (이론 서사/온라인 섹션 구조) |
| lab-code-agent | 공용 | 단계별 코드 + 실행 검증(validation_log) |
| simulator-agent | 공용 | edu-sim-builder 스킬(복사본), 프로파일 적용 |
| panseo-slide-agent | 오프라인/온라인 | panseo-slide 스킬(복사본) — HTML+대본 2개 |
| slide-storyboard-agent | 촬영 | 스토리보드 설계 (G4 대상) |
| slide-composer-agent | 촬영 | HTML 슬라이드 조립 (PPTX는 후속) |
| prompter-script-agent | 촬영 | 나레이션 변환 + 길이 검증 |
| lab-guide-agent | 오프라인 | lab YAML → 가이드/문제지 파생 |
| rubric-agent | 오프라인 | 루브릭 YAML 원본 |
| runbook-agent | 오프라인 | 강사 진행 노트 |
| institutional-format-agent | 오프라인 | 원본 → 기관 포맷 변환 (포맷 확인 후만) |
| qa-agent | 공용 | 경계면 교차 비교, incremental QA, 자동 blocker |

## 에러 핸들링 공통 규칙

- 에이전트 실패 → 1회 재시도 → 재실패 시 산출물 없이 진행 + 게이트 보고에 누락 명시.
- 필수 산출물(`required_artifacts`) 누락 → G6 `final` 불가 → repair/defer/abort 사용자 선택.
- 상충 산출물(루브릭 vs 정답 코드 등) → 삭제 금지, 출처 병기, 사용자 판단.
- codex CLI 실패 → GPT 교차 검증 생략 + 보고에 명시.
