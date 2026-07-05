# 강의 제작 하네스 설계 문서 v1

- 작성일: 2026-07-05
- 상태: 사용자 승인 대기 (승인 후 `.claude/` 스캐폴드 생성)
- 상위 문서: `docs/claude-handoff-lecture-harness.md` (인수인계 문서)
- 프로젝트: `C:\Users\ssarm\Documents\course-haness`

**개정 이력:**
| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-07-05 | 초안 |
| v1.1 | 2026-07-05 | GPT 설계안 비교 후 보완 (비교 기록: `docs/reviews/2026-07-05_gpt-design-comparison.md`) |
| v1.2 | 2026-07-05 | codex(GPT) 교차 검증 warning 4건 반영 (검증 기록: `docs/reviews/2026-07-05_design-v1.1-codex-review.md`) |
| v1.3 | 2026-07-05 | 스캐폴드 codex 교차 검증 반영: Registry에 `pipeline_scope: standalone`+`request_reason` 필드(명시 요청 panseo-board 예외), `deferred`·조건부 산출물은 G6 final을 막지 않음, 온라인 LAB/HYBRID는 현행 계약 밖(G2에서 재구성 또는 설계 개정) (검증 기록: `docs/reviews/2026-07-05_scaffold-codex-review.md`) |
| v1.4 | 2026-07-05 | **bridge 방식 폐기 → 참고스킬 복사 방식** (사용자 결정): `참고스킬/` 3종을 `.claude/skills/`로 복사하고 각 SKILL.md 말미에 "하네스 통합 재정의" 섹션(환경·하네스 규칙, 본문보다 우선)을 추가. `reference-skill-bridge` 스킬 삭제. 원본 폴더는 백업으로 보존(수정 금지). 원본 개정 시 본문 재복사 + 재정의 섹션 재부착으로 동기화 |
| v1.5 | 2026-07-05 | 드라이런 발견 3건 반영 (사용자 결정): ① **편(episode) 개념** — 촬영강의 1편=30분 표준을 Manifest `duration.episodes`로 모델링, 레슨을 편에 배정 ② **원고 자수 예산 선반영** — script-agent는 착수 시 duration×250~300자를 목표 자수로 정하고 그 안에서 서사 설계 (L02~L04 전량 길이 초과의 재발 방지) ③ **기존 코드 반입 경로** — Manifest `existing_assets` + lab-code-agent 3모드(역-단계화/검증만/read-only 복사) + Registry `origin` 필드 |
| v1.6 | 2026-07-05 | 드라이런 G6 이후 사용자 품질 피드백 반영: ① **촬영 슬라이드를 판서 엔진 기반으로 전환** — panseo-slide 엔진의 라이트 변형 템플릿(filmed 전용 자산)으로 조립, 내용 밀도는 촬영 기준 유지, 유사시 판서모드로 즉석 판서 ② **촬영 슬라이드 기본 테마 = 라이트** (시뮬레이터는 다크 유지) ③ **덱 간 디자인 일관성 규칙** — 레슨 유형 무관 동일 엔진·디자인 시스템 (L02 이탈 재발 방지) ④ **원고 시드 데이터 블록** — [IMG] / ```d2``` 코드블록 / [비유] 블록으로 원고가 슬라이드·시뮬레이터·이미지의 원천이 되게 함 (표기 표준: 다이어그램 시드는 d2 코드블록만) |
| v1.7 | 2026-07-05 | 사용자 제안 4건 반영 (P1~P4 codex 사전 검증, 기각 2건 병기 — 기록: `docs/reviews/2026-07-05_design-v1.7-codex-review.md`): ① **SIMULATION 레슨 모드 폐지 (전 라인, 사용자 결정 — codex의 enum 유지 권고 기각)** — 시뮬레이터는 레슨의 파트: `required_artifacts: [simulator]` + 원고 시뮬 파트([SIM 실행]~[SIM 종료], 파트별 시간) ② **개념 모델(concept_model) + 완성 구조도(architecture_diagram) 신설** — G1 직후 research-agent 생성, G2에서 레슨 플랜과 함께 승인. 시뮬레이터 시나리오의 필수 기반(대조 검증), rich 슬라이드·원고 d2 시드의 참고 원천. 판서슬라이드 직접 파생 금지 유지 ③ **슬라이드 2프로파일** — panseo-slide를 판서 엔진 소유 스킬로 재선언, `rich`(고밀도·라이트→`html_slide`: 촬영 고정/오프라인 선택) / `summary`(판서용·다크→`panseo_slide_html`+대본: 온라인 고정/오프라인 선택), 오프라인 선택은 G1 `style.slide_mode`, 라이트 템플릿 panseo-slide로 이관 ④ **온라인 라인 재정의 = 유튜브 판서 VOD** (사용자 정의 — codex의 2유형 분리 제안 기각): 강사가 summary 슬라이드 위에 무조건 판서하며 녹화, 시뮬레이터는 시연+시청자 배포 겸용 |
| v1.8 | 2026-07-05 | **원고 = 책** (사용자 피드백 — "원고는 책 같은 것: 도형·이미지·쉬운 예시/비유가 원고 안에 보여야 한다"): ① 이미지 시드를 image-gen 스킬 계약(`[IMAGE PROMPT]` 주석 블록 + `path:` repo 상대 / 이미지 라인은 원고 상대)으로 표준화, codex CLI spawn으로 자동 생성·삽입 ② d2 코드블록 + 렌더 SVG 병기 (d2 CLI 0.7.1 설치) ③ 밀도 강화 — 주요 섹션(H2/H3)마다 예시/비유 서술 + 시각 요소 ④ 파이프라인에 "원고 북 빌드" 단계(script 뒤·prompter 앞) ⑤ 프롬프터 비발화 확장 + QA 원고=책 검사 7항목 (codex 사전 검증: 경로 계약 분리·표기 전파 blocker 2건 반영) |
| v1.9 | 2026-07-05 | pub-d2-diagram 스킬 연결 — 원고 도형 스타일·렌더 파이프라인 표준화, 사용자 제공 스킬 |

## 1. 목적

개발자 강의 제작 과정을 **산출물 계약과 품질 게이트로 운영하는 하네스**를 구축한다.
자동으로 모든 것을 한 번에 만드는 것이 목표가 아니다. 목표는 다음이다.

- 강의 목표가 산출물 전체를 지배한다.
- 레슨 단위로 이론/실습/시뮬레이터가 자연스럽게 섞인다.
- 촬영강의/오프라인강의/온라인강의가 서로 다른 제작 라인을 가진다.
- `panseo-slide`, `panseo-board`, `edu-sim-builder`의 역할이 정확히 분리된다.
- 사람이 승인해야 할 지점에서 AI가 멈춘다.
- 결과물이 수정/재사용 가능한 강의 자산으로 남는다.

## 2. 핵심 설계 원칙

1. **오케스트레이터 3개 독립.** `filmed-lecture`, `offline-lecture`, `online-lecture`를 독립 스킬로 만든다. 하나의 거대 오케스트레이터에 `if delivery_type == ...`를 넣지 않는다.
2. **레슨 단위 분류.** 강의 전체를 이론형/실습형으로 나누지 않는다. 레슨마다 `THEORY / LAB / HYBRID` 모드를 부여하고, 모드별 레슨 파이프라인을 태운다. **시뮬레이터는 레슨 모드가 아니라 레슨의 파트다** (v1.7, 사용자 결정 — codex는 시뮬 중심 콘텐츠 대비 enum 유지를 권고했으나 기각): 필요한 레슨의 `required_artifacts`에 `simulator`를 추가하고 원고의 한 파트로 시뮬 조작 서사를 넣는다.
3. **공통 스키마 공유, 품질 기준은 라인별 소유.** Course Manifest / Lesson Plan / Artifact Registry는 3개 라인이 공유한다. 산출물 순서와 품질 게이트는 각 오케스트레이터가 소유한다.
4. **참고스킬 원본 무수정.** `참고스킬/`은 백업 자산으로 보존하고, 복사본을 `.claude/skills/`에 두고 사용한다. 복사본과 원본의 차이는 각 SKILL.md 말미 "하네스 통합 재정의" 섹션에만 둔다 (v1.4, 사용자 결정).
5. **판서 산출물 중복 금지.** `panseo-slide` 산출물(`_판서보드.html`)에는 판서보드 기능이 이미 내장되어 있다. 오프라인/온라인 기본 파이프라인에서 `panseo-board`를 함께 생성하지 않는다. `panseo-board`는 "빈 칠판만 달라"는 명시적 요청이 있을 때만 사용한다.
6. **시뮬레이터는 별도 파일.** PPT/판서슬라이드에 내장하지 않는다. 슬라이드/원고에는 실행 cue만 넣는다.
7. **승인 게이트에서 정지.** AI가 내용을 불리는 것을 막기 위해 정해진 게이트에서 반드시 사용자 승인을 받는다.
8. **설계 결정은 GPT 교차 검증을 거친다.** 아래 3절 참조.

## 3. 설계 결정 검증 프로세스 (GPT 교차 검증)

> 이 규칙은 `.claude/` 스캐폴드 생성 시 `CLAUDE.md` 하네스 포인터에도 기록한다.

설계 시점에 내려지는 결정사항(아키텍처 변경, 스키마 변경, 파이프라인/품질 게이트 변경, 신규 에이전트·스킬 추가)은 **GPT를 CLI로 spawn하여 교차 검토·검증하는 과정을 거친다.**

### 3-1. 도구

- OpenAI Codex CLI (`codex`, 이 환경에 0.142.0 설치 확인됨)
- 비대화형 실행: `codex exec "<검토 프롬프트>"` — 검토 대상 문서 경로를 프롬프트에 포함해 읽게 한다.

### 3-2. 검증 시점

| 시점 | 검토 대상 |
|------|----------|
| 설계 문서 v(n) 작성/개정 직후, 사용자 승인 요청 전 | 설계 문서 전체 |
| 공통 스키마(Manifest/Lesson Plan/Registry) 변경 시 | 변경된 스키마 + 영향받는 오케스트레이터 |
| 오케스트레이터 파이프라인/품질 게이트 변경 시 | 해당 오케스트레이터 스킬 |
| 신규 에이전트/스킬 추가 시 | 신규 정의 + 기존 구성과의 중복 여부 |

일상적 산출물 생성(레슨 원고, 슬라이드 등)은 대상이 아니다. **구조적 결정만** 대상이다.

### 3-3. 검토 프롬프트 계약

GPT에게 다음을 요구한다.

1. 결정사항이 상위 문서(인수인계 문서)의 확정 사항과 충돌하는지
2. 누락된 산출물/게이트/에러 경로가 있는지
3. 과잉 설계(불필요한 에이전트/스킬/단계)가 있는지
4. 각 지적에 심각도(blocker / warning / suggestion) 부여

### 3-4. 결과 처리

- 검토 결과는 `docs/reviews/{YYYY-MM-DD}_{대상}.md`로 저장한다 (감사 추적).
- blocker는 사용자 보고 전에 수정하거나, 수정하지 않을 경우 사유를 병기한다.
- warning/suggestion은 채택 여부를 사용자 보고에 병기하고 **최종 결정은 사용자가 한다.** GPT 의견이 인수인계 문서의 확정 사항과 충돌하면 인수인계 문서가 우선한다.
- codex CLI가 실패/미설치 상태면 검증을 건너뛰되, 보고에 "GPT 교차 검증 생략됨"을 명시한다.

## 4. 실행 환경 적응 사항

인수인계 문서의 "환경과 다르면 현실에 맞게 조정한다" 원칙에 따라 확정한 사항.

| 항목 | 결정 |
|------|------|
| 실행 모드 | **서브에이전트 + 파일 기반 산출물 전달.** 현재 환경에 팀 도구(TeamCreate)가 없으므로 에이전트 팀 모드 대신 오케스트레이터 스킬이 Agent 도구로 서브에이전트를 호출한다. |
| 에이전트 모델 | Agent 호출 시 `model: "opus"` 명시 (하네스 스킬 규정). opus를 쓸 수 없는 환경이면 세션 기본 모델로 대체하고 게이트 보고에 명시 |
| 중간 산출물 | `courses/{course-id}/_workspace/`에 저장. 파일명 `{phase}_{agent}_{artifact}.{ext}` |
| panseo-slide 템플릿 경로 | 원본 스킬의 `/sessions/*/mnt/...` 경로 대신 복사본 스킬 폴더의 `template/board_template.html`을 사용 (복사본 SKILL.md "하네스 통합 재정의"에서 재정의) |
| 산출물 전달 | 원본 스킬의 `present_files` 대신 파일 경로 보고로 대체 |
| PPTX 변환 | **후속 과제로 연기.** MVP는 HTML 슬라이드까지만 생성. Artifact Registry에 `pptx` 타입만 예약해 둔다. |

## 5. 공통 스키마

세 오케스트레이터가 공유하는 데이터 계약. 스키마 정의는 `.claude/skills/lecture-harness/references/schemas.md`에 두고, 인스턴스는 강의별 디렉토리에 YAML로 저장한다.

### 5-1. Course Manifest (`courses/{course-id}/manifest.yaml`)

강의 전체의 입력 문서. 모든 파이프라인의 출발점.

```yaml
course:
  id: spring-mvc-2026
  title: Spring MVC와 웹 요청 처리 구조
  delivery_type: filmed | offline | online

target_learners:
  - Java 문법 가능
  - Spring Boot CRUD 경험 있음
  - Servlet 컨테이너 구조는 모름

duration:
  total_minutes: 50            # 전체 합
  episodes:                    # 촬영강의: 1편 ≈ 30분 표준. 편 배정은 G2에서 레슨과 함께 확정
    - no: 1
      minutes: 30
    - no: 2
      minutes: 20

existing_assets:               # 미리 만들어진 자산이 있을 때 (선택, v1.5)
  - kind: source_code          # v1.5 범위: source_code만. slides/script/simulator 반입은 후속 확장 (담당 에이전트별 규칙 필요)
    path: D:\my-project        # 로컬 경로 또는 repo URL
    shape: final_only          # final_only(완성본만) | stepped(이미 단계별) | mixed(일부만 단계별)
    access: read_only          # read_only(원본 무수정 — courses/{id}/code/로 복사 후 작업) | in_place
    policy: restructure        # restructure | verify_only — 조합 매트릭스는 10절. verify_only는 shape=stepped에서만 유효

tech_stack:
  - Java 21
  - Spring Boot 3.x

learning_goals:
  - HTTP 요청이 Spring MVC 내부에서 처리되는 흐름을 설명할 수 있다.
  - Controller와 Service의 책임을 구분할 수 있다.

required_outputs:        # 라인 기본 산출물에서 추가/제외할 항목
  - slides
  - script
  - simulator
  - source_code

style:
  tone: 실무형, 초급자 친화적
  visual_style: 깔끔한 기술 교육용
  language: ko-KR

constraints:
  max_slide_words: 45          # 슬라이드 1장당 최대 단어 수 (판서슬라이드는 라인 규칙이 더 엄격하면 그쪽 우선)
  code_font_min_pt: 22
  citation_required_for:       # 아래 유형의 주장에는 출처 표기 필수
    - statistics
    - news
    - version_specific_claims
    - external_case_studies
```

### 5-2. Lesson Plan (`courses/{course-id}/lesson-plan.yaml`)

레슨 단위 분류. 강의 전체가 아니라 레슨마다 성격을 부여한다.

```yaml
lessons:
  - id: L01
    title: Spring MVC 요청 흐름 이론
    lesson_mode: THEORY          # THEORY | LAB | HYBRID (SIMULATION은 v1.7 폐지)
    episode: 1                   # 촬영강의: 소속 편 (G2에서 확정, v1.5)
    duration_minutes: 40
    required_artifacts: [script, slides]        # 시뮬 파트가 있는 레슨은 simulator 추가 (v1.7)

  - id: L02
    title: 예외 처리의 필요성과 설계 (시뮬 파트 포함 예)
    lesson_mode: THEORY
    duration_minutes: 30          # 파트 시간은 원고에 명시 (예: 이론 20 + 시뮬 10)
    required_artifacts: [script, slides, simulator]

  - id: L03
    title: Controller 실습
    lesson_mode: LAB
    duration_minutes: 90
    required_artifacts: [step_code, lab_guide, explanation_script]
```

- `THEORY`: 개념/배경/이유/비교/사례 중심
- `LAB`: 단계별 코드와 실습 중심
- `HYBRID`: 이론과 실습이 강하게 결합

시뮬레이터는 레슨 모드가 아니다 (v1.7): 독립 레슨을 만들지 않고, 필요한 레슨에 `simulator` 산출물 + 원고 시뮬 파트([SIM 실행]~[SIM 종료], 파트별 시간 명시)로 부착한다.

### 5-3. Artifact Registry (`courses/{course-id}/artifacts.yaml`)

생성된 모든 산출물의 등록부. QA와 재실행 판단의 근거.

```yaml
artifacts:
  - id: ART-PANSEO-001
    type: panseo_slide_html      # 아래 타입 표 참조
    lesson_id: L01
    path: courses/spring-mvc-2026/slides/L01_판서보드.html
    status: draft | approved | final
    produced_by: panseo-slide-agent
    approved_gate: G5            # 어떤 승인 게이트를 통과했는지
```

**산출물 타입 표준:**

| type | 설명 | 생성 주체 |
|------|------|----------|
| `html_slide` | 촬영강의 HTML 슬라이드 | slide-composer-agent |
| `pptx` | PPTX 변환본 (**후속 과제 — 타입만 예약**) | (미정) |
| `panseo_slide_html` | 판서슬라이드 (판서보드 기능 내장) | panseo-slide-agent |
| `panseo_script` | 판서대본 (`_판서대본.md`) | panseo-slide-agent |
| `panseo_board_html` | 빈 판서보드 (**명시 요청 시에만**) | `panseo-board` 스킬 (파이프라인 밖 단독 호출) |
| `script` | 강의 원고 | script 계열 에이전트 |
| `prompter_script` | 프롬프터용 나레이션 원고 | prompter-script-agent |
| `simulator_html` | 별도 시뮬레이터 HTML | simulator-agent |
| `step_code` | 단계별 실습 코드 디렉토리 | lab-code-agent |
| `validation_log` | step 코드 실행 검증 로그 | lab-code-agent |
| `lab_guide` | 실습 가이드 문서 | lab-guide-agent |
| `problem_sheet` | 실습 문제지 (학생 배포용) | lab-guide-agent |
| `rubric` | 루브릭/평가기준 (구조화 원본) | rubric-agent |
| `runbook` | 강사용 진행 노트 | runbook-agent |
| `cue_sheet` | 촬영 큐시트 | cue 계열 에이전트 |
| `institutional_export` | 기관 제출용 변환 파일 | institutional-format-agent |

### 5-4. 공통 콘텐츠 규칙

세 라인이 공유하는 내용 품질 규칙. `.claude/skills/lecture-harness/references/content-rules.md`에 상세를 둔다.

**(a) 출처 인용 정책.** Manifest의 `citation_required_for`에 해당하는 주장(통계, 뉴스, 버전 특정 주장, 외부 사례)은 원고/슬라이드에 출처를 표기한다. 출처를 확인할 수 없으면 그 주장을 빼거나 "확인 필요"로 표시하고 게이트 보고에 명시한다. research-agent의 산출물(research brief)은 주장-출처 쌍으로 기록한다.

**(b) 이론형 레슨 서사 구조.** THEORY 레슨의 원고는 정의 나열이 아니라 다음 흐름을 따른다.

```text
문제 상황 → 기존 방식 → 기존 방식이 깨지는 지점 → 기술이 나온 배경
→ 핵심 구조 → 실제 동작 흐름 → 대체 기술과의 차이 → 현업 사례
→ 언제 사용하고 언제 피할지
```

주제에 따라 일부 단계를 생략할 수 있지만, "문제 상황으로 시작"과 "언제 쓰고 언제 피할지로 마무리"는 유지한다. (예: N+1 강의 — 잘 동작하는 서비스 → 사용자 증가로 쿼리 급증 → 로그로 발견 → ORM이 왜 이런 쿼리를 내는가 → Fetch Join/EntityGraph/Batch Fetch 비교 → 무조건 Fetch Join이 답이 아닌 이유 → 코드 개선.)

**(c') 원고 자수 예산 선반영 (v1.5).** script 계열 에이전트는 원고 착수 시 `duration_minutes × 250~300자(공백 제외)`를 목표 자수로 먼저 정하고, 그 예산 안에서 서사를 설계한다. 예산을 넘는 서사는 쓰고 나서 줄이는 게 아니라 설계 단계에서 범위를 좁힌다(다음 편으로 유예). 근거: 드라이런에서 예산 없이 쓴 원고 3건이 전량 27~39% 초과했고, 한국어 자연 발화 상한(~330자/분)상 프롬프터 단계 압축으로는 회복 불가였다.

**(c) 시뮬레이터 프로파일.** 시뮬레이터는 라인별 사용 맥락이 다르므로, edu-sim-builder 호출 시 프로파일을 지정한다. 지금은 같은 스킬을 쓰되 프로파일별 요구사항만 다르게 주입하고, 요구가 갈라지면 그때 스킬을 분리한다.

| 프로파일 | 라인 | 특성 |
|----------|------|------|
| `filmed` | 촬영강의 | 강사가 시연·나레이션 타이밍에 맞춰 조작. step 진행이 예측 가능해야 함 |
| `offline_interactive` | 오프라인강의 | 강사가 수업 중 실시간 조작. 즉석 질문 대응용 자유 탐색 허용 |
| `online_self_paced` | 온라인강의 | 영상 속 강사 시연 + 시청자 배포(설명란 링크) 겸용 (v1.7). 안내 문구·리셋 버튼 등 혼자 조작 장치 필수 |

## 6. 디렉토리 구조

```text
.claude/
  agents/
    filmed-lecture-orchestrator.md      # 라인 오케스트레이터 3종
    offline-lecture-orchestrator.md
    online-lecture-orchestrator.md
    lesson-classifier-agent.md          # 공용 에이전트
    research-agent.md
    lab-code-agent.md
    simulator-agent.md
    panseo-slide-agent.md
    script-agent.md
    slide-composer-agent.md             # 촬영강의 전용
    prompter-script-agent.md            # 촬영강의 전용
    lab-guide-agent.md                  # 오프라인 전용
    rubric-agent.md                     # 오프라인 전용
    qa-agent.md                         # 공용 QA (라인별 게이트 체크리스트 입력)

  skills/
    lecture-harness/                    # 공통: 스키마·아키텍처·검증 프로세스
      SKILL.md
      references/
        architecture.md
        schemas.md
        quality-gates.md
        content-rules.md                # 5-4절 공통 콘텐츠 규칙 (인용 정책·이론 서사·시뮬 프로파일)
        gpt-review-process.md           # 3절의 GPT 교차 검증 절차 상세
    filmed-lecture/
      SKILL.md
      references/ (pipeline.md, slide-rules.md, prompter-rules.md)
    offline-lecture/
      SKILL.md
      references/ (pipeline.md, panseo-rules.md, rubric-rules.md)
    online-lecture/
      SKILL.md
      references/ (pipeline.md, self-paced-rules.md)
    panseo-slide/                       # 참고스킬 복사본 + "하네스 통합 재정의" 섹션 (v1.4)
    panseo-board/                       # 〃 (명시 요청 시에만 사용)
    edu-sim-builder/                    # 〃

docs/
  claude-handoff-lecture-harness.md
  harness-design-v1.md                  # 이 문서
  reviews/                              # GPT 교차 검증 결과 보관

courses/
  {course-id}/
    manifest.yaml
    lesson-plan.yaml
    artifacts.yaml
    _workspace/                         # 중간 산출물 (보존)
    slides/  scripts/  simulators/  code/  guides/
```

## 7. 오케스트레이터 설계

### 7-0. 공통 구조

모든 오케스트레이터 스킬은 다음 뼈대를 공유한다.

1. **Phase 0 — 컨텍스트 확인**: `courses/{id}/` 존재 여부로 초기 실행 / 부분 재실행 / 새 실행을 판별. 부분 재실행이면 해당 에이전트만 재호출.
2. **Phase 1 — Manifest 확정**: 사용자 입력으로 Course Manifest 작성 → **[G1 승인]**
3. **Phase 1.5 — 개념 모델·완성 구조도 (v1.7)**: research-agent가 `concept_model.yaml` + `architecture_diagram.d2` 생성 (G1 직후, 강의 단위 1회)
4. **Phase 2 — 레슨 플랜**: lesson-classifier-agent가 레슨 분해 + 모드 부여 → 개념 모델·구조도와 **함께 [G2 승인]** (레슨 분해가 개념 경계와 정합하는지 확인)
4. **Phase 3~N — 레슨 파이프라인 실행**: 레슨 모드별 파이프라인 registry에 따라 에이전트 호출 (라인별로 상이, 아래 참조)
5. **Phase 마지막 — QA**: qa-agent가 라인별 품질 게이트 체크리스트로 검수 → **[G6 승인]** → Artifact Registry `final` 확정

레슨 파이프라인 registry (라인별 스킬의 `references/pipeline.md`에 정의):

```yaml
lesson_pipeline_registry:
  THEORY: {line}-theory-lesson-pipeline
  LAB:    {line}-lab-lesson-pipeline
  HYBRID: {line}-hybrid-lesson-pipeline
  # SIMULATION 폐지 (v1.7) — 시뮬레이터는 required_artifacts로 부착, 각 파이프라인에 시뮬 파트 삽입
```

레슨 실행은 선언형으로 기술한다 — 분기(`if`)를 오케스트레이터 본문에 흩뿌리지 않고, `for_each` 선택 규칙으로 파이프라인을 매핑한다.

```yaml
pipeline:
  - id: classify_lessons
    agent: lesson-classifier-agent
    input: [course_manifest]
    output: [lesson_plan]
  - id: create_theory_assets
    for_each: "lesson_plan where lesson_mode == THEORY"
    pipeline: {line}-theory-lesson-pipeline
  - id: create_lab_assets
    for_each: "lesson_plan where lesson_mode == LAB"
    pipeline: {line}-lab-lesson-pipeline
  # ... HYBRID 동일. 시뮬 파트는 각 레슨 파이프라인 내부 단계 (v1.7)
  - id: final_qa
    agent: qa-agent
    input: [all_artifacts]
    output: [qa_report]
```

### 7-1. Filmed Lecture Orchestrator (촬영강의) — MVP 우선 구현

**목표:** 촬영용 슬라이드와 프롬프터 중심의 강의 패키지.

**기본 산출물(최종 목표, 인수인계 문서 기준):** HTML 슬라이드, PPTX 변환본, 강의 원고, 프롬프터 나레이션 원고, 단계별 실습 코드, 실행 검증 로그, 별도 시뮬레이터 HTML, 상황 만화/이미지 에셋, 촬영 큐시트.

**MVP 범위:** 위에서 **PPTX 변환본과 상황 만화/이미지 에셋을 제외**한 전부 (사용자 결정 2026-07-05, 후속 확장 시 복원). 기본 산출물 계약 자체는 축소하지 않는다.

**슬라이드 성격 (v1.6 개정, v1.7 경로·소유 변경):** 설명 밀도가 높아도 된다 (한 슬라이드 = 하나의 핵심 메시지, 긴 코드 전체 대신 핵심 변경점만). **판서 엔진 기반 = panseo-slide 스킬의 `rich` 프로파일**: 라이트 템플릿(`.claude/skills/panseo-slide/template/board_template_light.html` — v1.7에서 panseo-slide 소유로 이관)으로 조립하여, 평소에는 촬영 밀도의 슬라이드로 쓰고 유사시 판서모드 버튼(🪧/b)으로 즉석 판서한다. 기본 판서슬라이드처럼 제목만 남기는 것은 금지 — 밀도 규칙은 촬영 기준(max_slide_words 45)을 따른다. **테마: 라이트 고정** (시뮬레이터는 edu-sim-builder 다크 유지 — 별도 창이라 충돌 없음). **덱 간 일관성**: 한 강의의 모든 레슨 덱은 레슨 유형 무관 동일 엔진·디자인 토큰을 쓴다. cue 슬라이드도 같은 덱 스타일 안에서 표현한다.

**슬라이드 제작 단계 분해.** 슬라이드는 하나의 에이전트가 한 번에 만들지 않고 다음 단계를 거친다. 각 단계의 명세는 `_workspace/`에 저장하여 부분 재실행이 가능하게 한다. (별도 스킬 8개로 쪼개지 않고 filmed-lecture 파이프라인 내 단계로 관리 — 과잉 분리 방지)

```text
스토리보드 설계 (slide-storyboard-agent) → [G4 승인]
→ 도형/다이어그램/코드블록 명세 생성
→ HTML 슬라이드 조립 (slide-composer-agent)
→ 렌더링 QA (qa-agent: 글자 수·폰트 크기·한 슬라이드 한 메시지 검사)
```

**주요 에이전트:** research → lesson-classifier → (레슨별) lab-code / script / simulator → prompter-script → slide-storyboard → slide-composer → qa

**품질 게이트 (G6 체크리스트):**
- 슬라이드가 강의 흐름의 중심인가?
- 시뮬레이터는 별도 파일이며 슬라이드에는 실행 cue만 있는가?
- 프롬프터 원고가 실제 말하기 흐름으로 읽히는가?
- **나레이션 분량이 레슨 `duration_minutes` 안에 들어가는가?** (한국어 발화 기준 분당 약 250~300자로 환산 검증)
- 단계별 코드는 starter/problem/step/final로 변화 이유를 보여주는가? 실행 검증 로그가 있는가?
- 긴 설정/반복 코드를 실시간 타이핑하도록 강요하지 않는가?
- Manifest constraints(max_slide_words, code_font_min_pt)를 지키는가?

### 7-2. Offline Lecture Orchestrator (오프라인강의)

**목표:** 강사가 현장에서 판서와 실습을 운영할 수 있는 패키지.

**기본 산출물:** 판서슬라이드 HTML + 판서대본(`panseo-slide`), 실습 가이드, 실습 문제지, 루브릭(구조화 원본), 강사용 진행 노트, 별도 시뮬레이터 HTML, 정답 코드, 단계별 실습 코드, 기관 제출용 변환 파일. — 기관 제출용 변환은 **기본 산출물**이되, 계약을 둘로 나눈다: 구조화 원본(YAML 루브릭 등)은 항상 생성하고, 외부 포맷 변환(`institutional_export`: PDF/Excel/DOCX 등)은 기관 요구 포맷이 확인된 시점에 실행한다.

**판서슬라이드 성격:** 화면 글자 최소. 강사가 설명하며 판서할 여백. 완성 설명 자료가 아니라 설명의 발판.

**실습(LAB) 레슨 구조 스키마.** 실습 가이드·문제지·루브릭·진행 노트는 다음 구조화 원본에서 파생한다 (`courses/{id}/_workspace/`에 YAML로 저장).

```yaml
lab:
  id: LAB-02
  title: 회원 가입 API 구현
  learner_task:            # 학생이 할 일 (문제지·실습 가이드의 원천)
    - DTO를 설계한다.
    - Controller를 구현한다.
  instructor_checkpoint:   # 강사가 순회하며 확인할 것 (진행 노트의 원천)
    - DTO와 Entity를 혼용하는지 확인
    - Controller에 비즈니스 로직이 몰리는지 확인
  submission:              # 제출물 정의
    - GitHub Repository
    - 실행 화면 캡처
  evaluation:
    rubric_id: RUBRIC-02   # 루브릭과 명시적 연결 (정답 코드-루브릭 충돌 검사의 근거)
```

**루브릭 구조화 원본.** 기관이 어떤 포맷(PDF/Excel/DOCX/HWP)을 요구해도 내부 원본은 YAML로 고정한다.

```yaml
rubric:
  id: RUBRIC-02
  title: 회원 가입 API 구현 평가
  criteria:
    - name: 기능 구현
      weight: 40
      levels:
        excellent: 정상 가입과 예외 처리가 모두 동작한다.
        good: 정상 가입은 동작하나 일부 예외 처리가 부족하다.
        needs_improvement: 핵심 기능이 정상 동작하지 않는다.
    # weight 합계 = 100, 각 criteria는 learning_goals 중 하나 이상과 연결
```

**주요 에이전트:** research → lesson-classifier → (레슨별) panseo-slide / lab-code / lab-guide / rubric / simulator → runbook → qa

**품질 게이트 (G6 체크리스트):**
- 판서슬라이드의 화면 글자가 적은가? 판서 여백이 충분한가?
- 실습 가이드는 학생이 혼자 보고 시작할 수 있는가?
- 루브릭은 학습목표와 연결되는가? 정답 코드와 충돌하지 않는가?
- 실습 난이도가 수업 시간 안에 가능한가?
- **`panseo-board`가 중복 생성되지 않았는가?** (기본 파이프라인에 포함 금지)

### 7-3. Online Lecture Orchestrator (온라인강의)

**목표 (v1.7 재정의):** 온라인 = **유튜브 판서 VOD** — 강사가 summary 슬라이드 위에 무조건 판서하며 녹화한다. 원고·판서슬라이드(summary 고정)·시뮬레이터(레슨 파트) 중심. 요구사항을 단순하게 유지한다.

**기본 산출물:** 원고, 판서슬라이드 HTML + 판서대본(`panseo-slide`), 별도 시뮬레이터 HTML. (프롬프터·PPTX·실습가이드·루브릭은 기본 포함하지 않음 — 필요 시 확장)

**원고 섹션 형식.** 시청자가 영상으로 혼자 보므로(현장 질문 불가) 섹션마다 다음 구조를 갖춘다. visual 필드는 "강사가 판서로 그릴 것"의 명세다 (v1.7).

```yaml
section:
  title: DispatcherServlet은 왜 필요한가?
  learning_goal: [Spring MVC 요청 처리 흐름을 설명할 수 있다.]
  hook: Controller가 많아질수록 요청을 어디서 어떻게 분기해야 할까?
  concept: [DispatcherServlet의 역할, HandlerMapping의 역할]
  visual: 클라이언트 → Tomcat → DispatcherServlet → HandlerMapping → Controller
  interaction: 시뮬레이터에서 요청 버튼을 눌러 흐름을 확인한다.   # 시뮬레이터 cue
  summary: DispatcherServlet은 Spring MVC의 중앙 요청 조정자다.
```

**주요 에이전트:** lesson-classifier → (레슨별) script / panseo-slide / simulator → qa

**품질 게이트 (G6 체크리스트):**
- 원고와 판서슬라이드 흐름이 맞는가?
- 판서슬라이드는 글자가 적고 설명 여백이 있는가?
- 시뮬레이터는 별도 파일인가?
- 학습자가 혼자 봐도 hook → problem → summary가 이어지는가?

## 8. 참고스킬 연결 설계 (v1.4: 복사 방식)

`참고스킬/` 원본은 백업으로 보존하고 수정하지 않는다. 복사본(`.claude/skills/panseo-slide`, `panseo-board`, `edu-sim-builder`)의 SKILL.md 말미 **"하네스 통합 재정의" 섹션**이 다음을 재정의하며 본문보다 우선한다. (~v1.3의 reference-skill-bridge 스킬은 사용자 결정으로 폐기)

| 참고스킬 | 복사본에서 재정의하는 것 | 하네스 내 용도 |
|----------|--------------------------|----------------|
| `panseo-slide` | **판서 엔진 소유 스킬 (v1.7)** — 템플릿 2종(`template/board_template.html` 다크=summary, `template/board_template_light.html` 라이트=rich) + 2프로파일 계약(rich→`html_slide` 대본 없음 / summary→`panseo_slide_html`+`panseo_script` 항상 2개), `present_files` → 파일 경로 보고, 출력 위치 → `courses/{id}/slides/` | 오프라인/온라인 기본 판서 자료. 산출물은 항상 2개(`_판서보드.html` + `_판서대본.md`). 파일명이 `_판서보드.html`이라도 이것은 **판서슬라이드** 산출물이다. |
| `panseo-board` | 동일 방식 경로 재정의 | **기본 파이프라인에 연결하지 않는다.** "빈 판서보드/빈 칠판만 달라"는 명시 요청 시에만 단독 호출. |
| `edu-sim-builder` | 출력 위치 → `courses/{id}/simulators/`, `present_files` → 파일 경로 보고, 호출 시 **프로파일 파라미터**(`filmed` / `offline_interactive` / `online_self_paced`, 5-4절) 주입 | 세 라인 모두의 `simulator_html` 생성. 슬라이드에 내장 금지, cue만 삽입. 내용 검증·수학 검증 절차는 원본 스킬 그대로 따른다. |

복사본 유지 규칙: 원본과의 차이는 "하네스 통합 재정의" 섹션에만 격리한다. 원본(`참고스킬/`)이 개정되면 복사본 본문을 통째로 재복사하고 재정의 섹션만 다시 붙인다. 복사본 본문을 직접 고치지 않는다 (drift 방지).

## 9. 사용자 승인 게이트

| 게이트 | 시점 | 확정 대상 |
|--------|------|----------|
| G1 | Manifest 작성 후 | Course Manifest |
| G2 | 레슨 분해 후 | 커리큘럼/레슨 플랜 |
| G3 | LAB 레슨 설계 후 | 실습 범위 + 단계별 코드 계획 |
| G4 | 촬영강의 한정 | PPT(HTML 슬라이드) 스토리보드 |
| G5 | 오프라인/온라인 한정 | 판서슬라이드 방향 (컷 구성·비유) |
| G6 | QA 통과 후 | 최종 배포 패키지 |

게이트에서는 산출물 요약 + QA 결과 + (구조적 결정이 있었다면) GPT 교차 검증 결과를 함께 보고한다. 승인 없이는 다음 Phase로 진행하지 않는다.

## 10. 실습 코드 설계 원칙 (LAB 레슨 공통)

단일 완성본이 아니라 변화 과정을 보여주는 단계별 코드로 생성한다.

```text
courses/{id}/code/{lesson-id}/
  00-starter/  01-problem/  02-.../  ...  final/
```

각 단계는 메타데이터를 가진다.

```yaml
step:
  id: step-03
  title: Service 분리
  previous_state: Controller가 비즈니스 로직을 모두 처리
  change_reason: Controller 책임이 과도하게 커짐
  changed_files: [UserController.java, UserService.java]
  expected_result: 요청 처리와 비즈니스 로직이 분리됨
  lecture_message: 분리는 파일을 늘리는 것이 아니라 변경 이유를 분리하는 것이다.
```

**실행 검증 필수.** 모든 step 코드는 생성 후 실제로 빌드/실행(또는 테스트)하여 검증하고, 결과를 `validation_log` 산출물로 Registry에 등록한다. 검증에 실패한 step 코드는 게이트 보고에 명시하며 `final` 상태가 될 수 없다.

**기존 코드 반입 경로 (v1.5).** 사용자가 미리 만들어 둔 코드가 있으면 Manifest `existing_assets`에 등록하고, lab-code-agent가 `shape`/`policy`에 따라 분기한다. 반입 모드와 재구성 범위는 **G3에서 확정**한다.

`access`는 전처리다: `read_only`면 `courses/{id}/code/`로 복사한 뒤 아래 policy를 적용한다 (참고스킬과 같은 원본 보존 원칙). `in_place`는 이미 강의 디렉토리 안에 있을 때만.

**shape × policy 전체 매트릭스 (v1.5.1, blocker 수정):**

| shape \ policy | `restructure` | `verify_only` |
|----------------|---------------|---------------|
| `final_only` | **역-단계화**: 완성본을 `final/`로 두고 변경을 되돌리며 이전 단계 생성. step 메타 작성 + 전 단계 실행 검증 | **불허** — 단계가 없어 step_code 계약을 채울 수 없음. G1에서 반려하고 restructure를 제안 |
| `stepped` | 기존 단계를 G3 계획에 맞게 **재구성**(병합·분할·메타 보완) + 전 단계 실행 검증 | 기존 단계 구조 유지. step.yaml 메타 부여 + 실행 검증 + validation_log만. 코드 수정은 사용자 승인 필요 |
| `mixed` | 단계가 있는 부분은 재구성, 없는 부분은 역-단계화로 보완 + 전 단계 실행 검증 | **불허** — stepped와 동일 사유로 G1 반려 |

G3에서 확정된 조합(shape/access/policy)은 `_workspace`의 코드 계획서에 기록하고, Registry의 `step_code` 항목에 `origin: generated | imported | restructured`를 남겨 출처를 추적한다. 기존 코드가 Manifest의 tech_stack·학습 목표와 어긋나면 lab-code-agent는 임의 수정하지 말고 어긋남 목록을 G3에 보고한다.

## 11. 에러 핸들링

- 에이전트 실패 시 1회 재시도. 재실패하면 해당 산출물 없이 진행하고 게이트 보고에 누락을 명시한다.
- **필수 산출물 누락 시 G6에서 `final` 확정 불가.** 레슨의 `required_artifacts`에 포함된 산출물이 누락된 상태에서는 배포 패키지를 확정할 수 없다. 사용자에게 재생성(repair) / 해당 산출물만 후속으로 연기(defer) / 중단(abort) 중 하나를 선택받고, defer 선택 시 Registry에 `deferred` 상태로 기록한다. 사용자 승인이 기록된 `deferred`와 조건부 산출물(`institutional_export` 등 실행 조건 미충족)은 final을 막지 않는다 — 조건부 산출물은 `required_artifacts`에 넣지 않는다.
- 상충하는 산출물(예: 루브릭 vs 정답 코드)은 삭제하지 않고 출처를 병기해 사용자 판단으로 넘긴다.
- codex CLI 실패 시 GPT 교차 검증을 생략하되 보고에 명시한다 (3-4절).
- 중간 산출물(`_workspace/`)은 삭제하지 않는다 (감사 추적·부분 재실행용).

## 12. 구현 로드맵

| 단계 | 내용 | 비고 |
|------|------|------|
| 1 | 이 설계 문서의 GPT 교차 검증 + 사용자 승인 | 최초의 3절 프로세스 적용 사례 |
| 2 | `.claude/agents` + `.claude/skills` 스캐폴드 + CLAUDE.md 포인터 등록 | GPT 검증 규칙을 CLAUDE.md에 명시. 공용 에이전트(research/script/qa)는 입출력 계약을 좁게 정의해 범용화 방지 |
| 3 | **MVP: filmed-lecture 구현** (PPTX 제외) | |
| 4 | 드라이런: "Spring MVC 요청 흐름" 샘플 강의 | G1~G6 게이트 동작 확인 |
| 5 | offline-lecture 확장 | |
| 6 | online-lecture 확장 | |
| 후속 | PPTX 변환 스킬, 상황 만화/이미지 에셋, 기관 제출용 변환 | 필요 시점에 착수 |

## 13. 테스트 시나리오

**정상 흐름:** "Spring MVC 요청 흐름" 촬영강의 요청 → G1 Manifest 승인 → G2 레슨 플랜(THEORY+시뮬 파트 1 + THEORY 1 + LAB 1) + 개념 모델·완성 구조도 승인 → G3 단계별 코드 계획 승인 → G4 스토리보드 승인 → 레슨별 산출물 생성 → G6 QA 통과 → Registry `final`.

**에러 흐름:** simulator-agent가 2회 실패 → `simulator_html` 누락 상태로 G6 보고 → 사용자가 "시뮬레이터만 다시" 요청 → Phase 0이 부분 재실행으로 판별, simulator-agent만 재호출.

**오용 방지:** 오프라인강의 파이프라인에서 `panseo_board_html`이 `pipeline_scope: standalone` + `request_reason` 없이 Registry에 등록되면 qa-agent가 G6에서 blocker로 보고한다 (기본 파이프라인의 중복 생성). 명시 요청으로 단독 생성되어 두 필드가 기록된 경우는 예외다.
