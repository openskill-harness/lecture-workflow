---
name: lecture-harness
description: 개발자 강의 제작 하네스의 공통 기반 — 공통 스키마(Course Manifest/Lesson Plan/Artifact Registry), 승인 게이트 G1~G6, 콘텐츠 규칙, GPT 교차 검증 절차. 강의 제작 작업을 시작할 때, 하네스 구조·스키마·게이트에 대한 질문을 받을 때, 하네스의 구조적 변경(스키마·파이프라인·에이전트·스킬 추가/수정)을 하려 할 때 반드시 이 스킬을 먼저 확인한다. 라인별 제작 실행은 filmed-lecture/offline-lecture/online-lecture 스킬이 담당한다.
---

# Lecture Harness (공통 기반)

개발자 강의 제작 과정을 **산출물 계약과 품질 게이트로 운영하는 하네스**의 공통 규칙. 설계 원천은 `docs/harness-design-v1.md`(최신 개정은 문서 내 개정 이력 표 참조)이며, 이 스킬과 설계 문서가 어긋나면 설계 문서를 먼저 개정한다.

## 구조 한눈에

- 제작 라인 3개 (독립 오케스트레이터): `filmed-lecture`(촬영) / `offline-lecture`(오프라인) / `online-lecture`(온라인). 하나의 거대 오케스트레이터에 if 분기를 넣지 않는다.
- 분류 단위는 강의가 아니라 **레슨**: `THEORY / LAB / HYBRID` (시뮬레이터는 레슨이 아니라 레슨의 파트 — v1.7)
- 실행 모드: 서브에이전트 + 파일 기반 산출물 전달. Agent 호출 시 `model: "opus"` (미지원 시 세션 기본 모델 + 보고 명시)
- 판서/시뮬 스킬은 `참고스킬/`의 복사본(`.claude/skills/panseo-slide`, `panseo-board`, `edu-sim-builder`)을 사용 — 각 SKILL.md 말미 "하네스 통합 재정의" 섹션이 환경·하네스 규칙을 담고 본문보다 우선. 원본 폴더는 백업으로 보존(수정 금지)
- 강의 데이터: `courses/{course-id}/` (manifest.yaml, lesson-plan.yaml, artifacts.yaml, _workspace/, 산출물 디렉토리)
- 상세 아키텍처: `references/architecture.md`

## 공통 스키마

Course Manifest / Lesson Plan / Artifact Registry / step·lab·rubric·온라인 섹션 스키마 전문은 `references/schemas.md`. 스키마를 바꾸려면 설계 문서 개정 + GPT 교차 검증을 먼저 거친다.

## 승인 게이트 (AI가 멈추는 지점)

| 게이트 | 시점 | 확정 대상 |
|--------|------|----------|
| G1 | Manifest 작성 후 | Course Manifest |
| G2 | 레슨 분해 후 | 커리큘럼/레슨 플랜 |
| G3 | LAB 레슨 설계 후 | 실습 범위 + 단계별 코드 계획 |
| G4 | 촬영강의 한정 | 슬라이드 스토리보드 |
| G5 | 오프라인/온라인 한정 | 판서슬라이드 방향 (컷 구성·비유) |
| G6 | QA 통과 후 | 최종 배포 패키지 |

승인 없이 다음 Phase로 진행하지 않는다. 이유: AI가 내용을 계속 불리는 것을 막는 유일한 구조적 장치가 게이트다. 게이트별 통과 기준과 라인별 G6 체크리스트는 `references/quality-gates.md`.

**필수 산출물 누락 시 G6에서 `final` 확정 불가.** 사용자에게 repair(재생성) / defer(후속 연기, Registry에 `deferred` 기록) / abort(중단)를 선택받는다.

## 콘텐츠 공통 규칙

출처 인용 정책(통계·뉴스·버전 특정 주장·외부 사례는 출처 필수), 이론형 레슨 서사 구조(문제 상황으로 시작 → "언제 쓰고 언제 피할지"로 마무리), 시뮬레이터 프로파일(filmed / offline_interactive / online_self_paced)은 `references/content-rules.md`.

## 판서 산출물의 역할 분리 (혼동 금지)

```text
판서슬라이드 (panseo-slide) → 오프라인/온라인 기본 판서 자료. 판서보드 기능 내장. 산출물 항상 2개(HTML+대본).
빈 판서보드 (panseo-board)  → "빈 칠판만 달라"는 명시 요청 시에만. 기본 파이프라인 연결 금지 (중복).
시뮬레이터 (edu-sim-builder) → 항상 별도 HTML. 슬라이드에 내장 금지, cue만 삽입.
```

## GPT 교차 검증 (구조적 결정 필수 절차)

설계 시점에 결정되는 구조적 사항 — 아키텍처·스키마·파이프라인·품질 게이트 변경, 에이전트/스킬 추가 — 은 **GPT를 CLI로 spawn하여 교차 검토·검증을 거친다.** 절차·명령·결과 처리 규칙은 `references/gpt-review-process.md`. 일상적 산출물 생성은 대상이 아니다.

## 하네스 진화

- 실행 완료 후 사용자에게 개선점 피드백 기회를 제공한다 (강요하지 않는다).
- 피드백 반영 경로: 결과물 품질 → 해당 스킬, 역할 → 에이전트 정의, 순서 → 라인 스킬, 트리거 누락 → description.
- 모든 구조 변경은 `docs/harness-changelog.md`(append-only)에 기록하고, 구조적 변경이면 GPT 교차 검증을 거친다. 설계 규범 변경이면 설계 문서 개정 이력에도 기록한다.
