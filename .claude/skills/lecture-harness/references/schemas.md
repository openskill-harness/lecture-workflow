# 공통 스키마

모든 인스턴스는 `courses/{course-id}/`에 YAML로 저장한다. 스키마 변경은 구조적 결정 — 설계 문서 개정 + GPT 교차 검증 필수.

## 1. Course Manifest (`manifest.yaml`) — G1 확정 대상

```yaml
course:
  id: spring-mvc-2026          # kebab-case, 디렉토리명과 일치
  title: Spring MVC와 웹 요청 처리 구조
  delivery_type: filmed        # filmed | offline | online

target_learners:               # 아는 것과 모르는 것을 구분해 기술
  - Java 문법 가능
  - Servlet 컨테이너 구조는 모름

duration:
  total_minutes: 50            # 전체 합
  episodes:                    # 촬영강의: 1편 ≈ 30분 표준 (v1.5). 편 배정은 G2에서 확정
    - no: 1
      minutes: 30
    - no: 2
      minutes: 20

existing_assets:               # 미리 만들어진 자산 반입 (선택, v1.5)
  - kind: source_code          # v1.5 범위: source_code만 (slides/script/simulator 반입은 후속 확장)
    path: D:\my-project        # 로컬 경로 또는 repo URL
    shape: final_only          # final_only | stepped | mixed
    access: read_only          # read_only(복사 후 작업, 원본 무수정) | in_place
    policy: restructure        # restructure | verify_only — verify_only는 shape=stepped에서만 유효 (그 외 조합은 G1 반려). 매트릭스: 설계 문서 10절

tech_stack:
  - Java 21
  - Spring Boot 3.x

learning_goals:                # "~할 수 있다" 형식, 측정 가능하게
  - HTTP 요청이 Spring MVC 내부에서 처리되는 흐름을 설명할 수 있다.

required_outputs:              # 라인 기본 산출물에서 추가/제외
  - slides
  - script
  - simulator
  - source_code

style:
  tone: 실무형, 초급자 친화적
  visual_style: 깔끔한 기술 교육용
  language: ko-KR
  slide_mode: rich             # 오프라인 전용 (v1.7): rich | summary — G1에서 확정, G5에서 레슨 예외 가능. 촬영=rich 고정·온라인=summary 고정이라 이 필드 무시

constraints:
  max_slide_words: 45          # 슬라이드 1장당 최대 단어 수 (판서슬라이드는 라인 규칙이 더 엄격하면 그쪽 우선)
  code_font_min_pt: 22
  citation_required_for:       # 출처 필수 대상
    - statistics
    - news
    - version_specific_claims
    - external_case_studies
```

## 2. Lesson Plan (`lesson-plan.yaml`) — G2 확정 대상

```yaml
lessons:
  - id: L01                    # L + 2자리, 순서 고정 (재실행 시 보존)
    title: Spring MVC 요청 흐름 이론
    lesson_mode: THEORY        # THEORY | LAB | HYBRID (SIMULATION은 v1.7에서 폐지 — 아래 시뮬 파트 규칙)
    episode: 1                 # 촬영강의: 소속 편 (manifest duration.episodes 참조, v1.5)
    duration_minutes: 40
    required_artifacts: [script, slides]        # 누락 시 G6 final 불가
    learning_goal_refs: [0]    # manifest.learning_goals 인덱스 (모든 레슨 1개 이상)
```

lesson_mode 기준:
- `THEORY`: 개념/배경/이유/비교/사례 중심
- `LAB`: 단계별 코드와 실습 중심
- `HYBRID`: 이론과 실습이 강하게 결합

**시뮬레이터는 레슨 모드가 아니다 (v1.7, 사용자 결정).** 시뮬레이터는 슬라이드 설명의 부족한 부분을 직접 눌러 보여주는 보조 수단이므로 독립 레슨(챕터)을 만들지 않는다. 시뮬레이터가 필요한 레슨은 ① `required_artifacts`에 `simulator` 추가 ② 원고의 한 파트(권장: 마지막 파트)로 시뮬 조작 서사 포함 — 원고에 `[SIM 실행]`~`[SIM 종료]` 구간과 파트별 시간(예: 이론 4분 + 시뮬 10분)을 명시한다.

## 3. Artifact Registry (`artifacts.yaml`)

```yaml
artifacts:
  - id: ART-PANSEO-001         # ART-{종류}-{일련번호}
    type: panseo_slide_html    # 아래 타입 표
    lesson_id: L01
    path: courses/spring-mvc-2026/slides/L01_판서보드.html
    status: draft              # draft | approved | final | deferred
    produced_by: panseo-slide-agent
    approved_gate: G5          # 통과한 게이트 (없으면 생략)
    derived_from: ART-RUBRIC-001   # 파생물일 때 원본 연결 (선택)
    pipeline_scope: standalone # 기본 파이프라인 밖 단독 생성물일 때 (선택, panseo_board_html 등)
    request_reason: 사용자가 2026-07-05 "빈 칠판 하나 만들어줘" 요청   # standalone일 때 필수
    origin: generated          # step_code 전용 (v1.5): generated | imported | restructured
```

- `status: deferred`는 사용자가 defer를 승인한 산출물이다. **deferred는 G6 final을 막지 않는다** (required 누락과 구분).
- `panseo_board_html`은 `pipeline_scope: standalone` + `request_reason` 없이 등록되면 qa-agent 자동 blocker다.

### 산출물 타입 표준

| type | 설명 | 생성 주체 |
|------|------|----------|
| `html_slide` | 촬영강의 HTML 슬라이드 | slide-composer-agent |
| `pptx` | PPTX 변환본 (**후속 과제 — 타입만 예약**) | (미정) |
| `panseo_slide_html` | 판서슬라이드 (판서보드 기능 내장) | panseo-slide-agent |
| `panseo_script` | 판서대본 | panseo-slide-agent |
| `panseo_board_html` | 빈 판서보드 (**명시 요청 시에만**) | panseo-board 스킬 (파이프라인 밖 단독 호출) |
| `script` | 강의 원고 | script-agent |
| `prompter_script` | 프롬프터 나레이션 원고 | prompter-script-agent |
| `concept_model` | 강의 공통 개념 모델 (개념·관계·범위 경계 YAML, v1.7) | research-agent |
| `architecture_diagram` | 완성 구조도 (d2 원본, v1.7) | research-agent |
| `simulator_html` | 별도 시뮬레이터 HTML | simulator-agent |
| `step_code` | 단계별 실습 코드 디렉토리 | lab-code-agent |
| `validation_log` | step 코드 실행 검증 로그 | lab-code-agent |
| `lab_guide` | 실습 가이드 | lab-guide-agent |
| `problem_sheet` | 실습 문제지 | lab-guide-agent |
| `rubric` | 루브릭 (YAML 원본 + md 렌더) | rubric-agent |
| `runbook` | 강사용 진행 노트 | runbook-agent |
| `cue_sheet` | 촬영 큐시트 | prompter-script-agent 마커 기반 |
| `institutional_export` | 기관 제출용 변환 파일 | institutional-format-agent |

## 4. Step 메타 (단계별 코드, `code/{lesson-id}/{step}/step.yaml`)

```yaml
step:
  id: step-03
  title: Service 분리
  previous_state: Controller가 비즈니스 로직을 모두 처리
  change_reason: Controller 책임이 과도하게 커짐      # 비어 있으면 그 단계는 만들지 않는다
  changed_files: [UserController.java, UserService.java]
  expected_result: 요청 처리와 비즈니스 로직이 분리됨
  lecture_message: 분리는 파일을 늘리는 것이 아니라 변경 이유를 분리하는 것이다.
```

## 5. LAB 구조 (오프라인, `_workspace/{NN}_lab_{lesson-id}.yaml`)

```yaml
lab:
  id: LAB-02
  title: 회원 가입 API 구현
  learner_task:                # → 가이드/문제지의 원천
    - DTO를 설계한다.
  instructor_checkpoint:       # → 진행 노트의 원천
    - DTO와 Entity를 혼용하는지 확인
  submission:
    - GitHub Repository
  evaluation:
    rubric_id: RUBRIC-02       # 루브릭 연결 (정합 검사 근거)
```

## 6. 루브릭 (`_workspace/{NN}_rubric_{lab-id}.yaml`)

```yaml
rubric:
  id: RUBRIC-02
  title: 회원 가입 API 구현 평가
  criteria:                    # weight 합계 = 100
    - name: 기능 구현
      weight: 40
      goal_refs: [2]           # learning_goals 연결 필수
      levels:
        excellent: 정상 가입과 예외 처리가 모두 동작한다.    # 관찰 가능한 서술만
        good: 정상 가입은 동작하나 일부 예외 처리가 부족하다.
        needs_improvement: 핵심 기능이 정상 동작하지 않는다.
```

## 8. 개념 모델 + 완성 구조도 (v1.7 — G1 직후 생성, G2에서 레슨 플랜과 함께 승인)

```yaml
# _workspace/01_concept_model.yaml
concept_model:
  concepts:                      # 강의가 다루는 개념 목록
    - id: dispatcher-servlet
      name: DispatcherServlet
      definition: 모든 요청을 받아 위임 컴포넌트에 분배하는 중앙 서블릿
      source: Spring Framework Reference   # 주장-출처 규칙 동일 적용
  relationships:                 # 개념 간 관계 (구조도의 원천)
    - from: tomcat
      to: dispatcher-servlet
      kind: forwards_request
  scope_boundaries:              # 이 강의에서 다루지 않는 경계 (시뮬 범위 못박기)
    - Servlet Filter 체인은 범위 밖
```

```text
_workspace/01_architecture_diagram.d2   ← relationships에서 도출한 완성 구조도 d2 원본
```

**소비 계약:** ① 시뮬레이터 동작 시나리오의 **필수 기반** — simulator-agent는 STEP 구조·컴포넌트 순서를 concept_model과 대조 검증한다 ② 촬영(rich) 슬라이드 도형·원고 d2 시드의 참고 원천 ③ **판서슬라이드(summary) 직접 파생 금지** — 인수인계 확정 조항("판서슬라이드는 완성 구조도에서 파생되는 산출물이 아니다") 유지, 선택 참고만 가능.

## 7. 온라인 원고 섹션 (`scripts/{lesson-id}.md` 내 구조)

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
