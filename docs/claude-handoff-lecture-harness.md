# Claude Handoff: Developer Lecture Production Harness

- Date: 2026-07-05
- Project: `C:\Users\ssarm\Documents\강의하네스`
- Purpose: Claude에서 강의 제작 하네스를 이어서 설계/구축하기 위한 최종 인수인계 문서
- Status: 설계 전 단계. 참고 스킬만 존재하고, 하네스 본체는 아직 생성되지 않음.

## Claude에게 먼저 요청할 일

이 문서를 먼저 끝까지 읽고, 바로 구현하지 말고 다음 순서로 진행하라.

1. 현재 워크스페이스의 `참고스킬/` 폴더를 읽어 실제 스킬 계약을 확인한다.
2. 이 문서의 결정사항과 충돌하는 해석이 있는지 보고한다.
3. 하네스 설계 문서 v1을 먼저 작성한다.
4. 사용자의 승인을 받은 뒤 `.claude/agents`, `.claude/skills`, 오케스트레이터 스킬을 생성한다.

## 가장 중요한 정정사항

### panseo-slide와 panseo-board의 관계

이전 대화 중 한 번 잘못 정리된 부분이 있다. 최종 정리는 아래가 맞다.

```text
panseo-slide
→ 판서슬라이드 HTML 생성
→ 그 안에 판서보드 기능이 이미 포함되어 있음
→ 판서대본도 함께 생성함
→ 오프라인/온라인 강의에서 "판서슬라이드"가 필요할 때 기본으로 사용

panseo-board
→ 슬라이드 없이 빈 칠판/빈 판서보드만 필요할 때 사용하는 단독 보드
→ 오프라인/온라인 기본 산출물로 별도 생성하면 안 됨
```

따라서 오프라인/온라인 강의에서 `panseo-slide`와 `panseo-board`를 동시에 기본 호출하면 산출물이 중복된다. `panseo-board`는 "빈 판서 화면 하나만 달라" 같은 별도 요청이 있을 때만 연결한다.

### 판서슬라이드는 시뮬레이터나 완성 구조도에서 파생되는 산출물이 아니다

판서슬라이드는 강사가 강의 중 직접 설명하며 판서하는 도구다. 완성 구조도나 시뮬레이터를 반드시 주입해 판서보드를 만드는 설계는 틀렸다.

판서슬라이드의 본질:

- 글자가 적어야 한다.
- 강사가 말로 설명하면서 채울 여백이 있어야 한다.
- 화면은 "설명할 발판"이지, 완성된 설명 문서가 아니다.
- 시뮬레이터와 완성 구조도는 별도 참고 자료일 수 있지만 필수 입력이 아니다.

반대로 촬영강의 PPT는 판서를 할 수 없기 때문에 글자, 도형, 코드 설명, 이미지가 더 많아도 된다.

## 프로젝트 현황

현재 워크스페이스에는 `.claude` 하네스가 없다.

확인된 파일:

```text
참고스킬/edu-sim-builder/SKILL.md
참고스킬/edu-sim-builder/assets/template.html
참고스킬/edu-sim-builder/references/*.md

참고스킬/panseo-slide/SKILL.md
참고스킬/panseo-slide/template/board_template.html
참고스킬/panseo-slide/reference/*.md

참고스킬/panseo-board/SKILL.md
참고스킬/panseo-board/template/board_template.html
참고스킬/panseo-board/reference/*.md
```

현재 상태는 신규 하네스 구축 상태다. 기존 하네스와의 충돌은 아직 없다.

## 대화 배경 요약

처음 ChatGPT 대화에서는 "개발자 대상 강의자료를 어떤 순서로 만들어야 양질의 PPT가 나오는가"를 논의했다.

핵심 결론은 다음이었다.

```text
학습 목표
→ 실습/이론 흐름
→ 단계별 실습 코드 또는 개념 설계
→ 강의 원고
→ PPT/판서슬라이드/시뮬레이터
→ QA 및 리허설
```

개발자 강의에서는 PPT부터 만들면 품질이 흔들린다. 특히 실습형 강의에서는 완성 코드 하나가 아니라 `starter`, `problem`, `step`, `final`처럼 변화 과정을 보여주는 단계별 코드가 중요하다.

그 다음 대화는 "강의 제작을 자동화하는 하네스"로 확장되었다. 처음에는 하나의 Course Orchestrator가 논의되었으나, 사용자는 촬영강의/오프라인강의/온라인강의를 하나의 거대한 if 구조로 합치고 싶지 않다고 했다.

최종 방향은 독립 오케스트레이터 3개다.

```text
1. 촬영강의 오케스트레이터
2. 오프라인강의 오케스트레이터
3. 온라인강의 오케스트레이터
```

공통 스킬과 스키마는 공유할 수 있지만, 각 오케스트레이터는 산출물과 품질 기준이 다르므로 독립적으로 유지해야 한다.

## 제품 비전

이 프로젝트의 목표는 "개발자 강의 제작 하네스"다.

단순히 PPT 하나를 만드는 도구가 아니다. 강의 제작 과정 전체를 산출물 중심으로 구조화한다.

핵심 원칙:

- 강의 전체를 실습형/이론형으로 나누지 않는다. 레슨 단위로 나눈다.
- 한 강의 안에는 이론, 실습, 시뮬레이터, 코드 설명이 섞일 수 있다.
- 촬영강의, 오프라인강의, 온라인강의는 서로 다른 제작 라인이다.
- PPT/판서슬라이드/시뮬레이터/실습코드/원고는 서로 대체재가 아니라 다른 역할의 산출물이다.
- 각 단계의 산출물이 다음 단계의 입력이 되어야 한다.
- AI가 내용을 계속 불리는 것을 막기 위해 사용자 승인 게이트가 필요하다.

## 강의 유형별 최종 해석

### 1. 촬영강의

촬영강의는 PPT 중심이다.

강사는 PPT를 띄워두고 발표하거나 프롬프터 원고를 읽는다. 중간에 별도 시뮬레이터를 켜서 보여줄 수 있다. 시뮬레이터는 PPT 안에 포함하지 않는다.

기본 산출물:

- 강의 전체 PPT
- HTML 기반 슬라이드 원본
- PPTX 변환본
- 강의 원고
- 프롬프터용 나레이션 원고
- 단계별 실습 코드
- 별도 시뮬레이터 HTML
- 상황 만화/이미지 에셋
- 촬영 큐시트

촬영강의 PPT의 성격:

- 판서를 할 수 없으므로 판서슬라이드보다 설명 밀도가 높아도 된다.
- 글자, 도형, 이미지, 코드 강조가 들어갈 수 있다.
- 단, 한 슬라이드에는 하나의 핵심 메시지가 있어야 한다.
- 긴 코드 전체를 붙이는 방식은 피하고 핵심 변경점만 강조한다.

촬영강의 흐름 예:

```text
PPT 설명
→ 필요 시 별도 시뮬레이터 실행
→ PPT로 복귀
→ 코드 화면 또는 단계별 코드 설명
→ PPT로 정리
```

### 2. 오프라인강의

오프라인강의는 강사가 학생 반응을 보며 판서와 실습을 운영한다.

기본 산출물:

- 판서슬라이드 HTML (`panseo-slide` 사용)
- 판서대본 (`panseo-slide` 산출물)
- 실습 가이드 문서
- 실습 문제지
- 루브릭/평가기준 문서
- 강사용 진행 노트
- 별도 시뮬레이터 HTML
- 정답 코드
- 단계별 실습 코드
- 기관 제출용 변환 파일

오프라인 판서슬라이드의 성격:

- 화면 글자는 적어야 한다.
- 강사가 설명하며 판서할 여백이 있어야 한다.
- 완성된 설명 자료가 아니라 강사의 설명을 돕는 무대다.
- `panseo-slide` 안에 판서보드 기능이 이미 있으므로 별도 `panseo-board`를 기본 생성하지 않는다.

루브릭/평가기준은 내부 원본을 YAML/JSON 또는 구조화 Markdown으로 관리하고, 기관 요구에 따라 PDF/Excel/DOCX/PPT 등으로 변환하는 방향이 좋다.

### 3. 온라인강의

온라인강의는 현재 요구사항을 단순하게 유지한다.

기본 산출물:

- 원고
- 판서슬라이드 HTML (`panseo-slide` 사용)
- 판서대본 (`panseo-slide` 산출물)
- 별도 시뮬레이터 HTML

온라인강의에는 촬영용 프롬프터, PPTX 변환, 실습가이드, 루브릭을 기본 산출물로 넣지 않는다. 필요해질 때 확장한다.

## 기존 참고 스킬의 역할

### edu-sim-builder

위치:

```text
참고스킬/edu-sim-builder/SKILL.md
```

역할:

- 단일 HTML/CSS/JS 교육용 인터랙티브 시뮬레이터를 만든다.
- 버튼, 탭, SVG 다이어그램, 애니메이션 등을 사용해 어려운 개념을 "만져보며 배우는" 형태로 만든다.
- 외부 의존 없는 단일 HTML이 기본이다.
- 내용 검증, 수학/좌표 검증, 런타임 검증을 강조한다.

하네스 연결:

- 촬영강의/오프라인강의/온라인강의 모두에서 "별도 시뮬레이터 HTML" 생성에 사용 가능하다.
- 단, 시뮬레이터는 PPT나 판서슬라이드에 내장하지 않는다.
- PPT/원고/판서대본에는 언제 시뮬레이터를 열지에 대한 cue만 넣는다.

### panseo-slide

위치:

```text
참고스킬/panseo-slide/SKILL.md
```

역할:

- 글자 적은 HTML 판서슬라이드와 판서대본을 생성한다.
- 생성된 HTML 안에 펜 판서, 빈 칠판 판서모드, 모눈, 선택/이동/지우개, 전체화면 기능이 포함된다.
- 산출물은 항상 2개다.

```text
<강의명>_판서보드.html
<강의명>_판서대본.md
```

주의:

- 파일명이 `_판서보드.html`이라도 이것은 판서슬라이드 산출물이다. 내부에 판서보드 기능이 들어간 판서슬라이드로 이해해야 한다.
- 오프라인/온라인의 기본 판서 자료는 이 스킬이 담당한다.

### panseo-board

위치:

```text
참고스킬/panseo-board/SKILL.md
```

역할:

- 슬라이드가 없는 단일 빈 판서보드 HTML을 만든다.
- 그래프, 2차원 평면, 즉석 필기, 빈 칠판이 필요할 때 사용한다.

하네스 연결:

- "빈 판서보드만 만들어줘", "필기용 보드 하나 줘" 같은 별도 요청이 있을 때만 사용한다.
- 오프라인/온라인 기본 강의자료 생성 파이프라인에 자동 포함하지 않는다.

## 하네스 스킬 사용에 대한 결정

사용자는 "하네스 스킬을 쓰는 게 더 좋은가?"라고 물었다.

결론:

```text
하네스 스킬은 사용하는 것이 좋다.
단, 맹목적으로 따르지 말고 공정 체크리스트와 구조화 가이드로 사용한다.
```

이유:

- 오케스트레이터가 3개라 구조가 쉽게 커진다.
- 기존 참고스킬을 그대로 연결해야 한다.
- 에이전트/스킬/산출물 계약을 분리해야 한다.
- 나중에 Claude 세션이 바뀌어도 구조를 다시 불러올 수 있어야 한다.
- "거대한 if 오케스트레이터"가 되는 것을 막아야 한다.

Claude Code 환경에서는 `.claude/agents`, `.claude/skills`, `CLAUDE.md` 구조가 자연스럽기 때문에 하네스 스킬의 권장 구조와 잘 맞는다.

주의:

- 하네스 스킬이 제시하는 경로/모델/팀 도구가 현재 Claude 환경과 다르면 프로젝트 현실에 맞게 조정한다.
- 기존 `참고스킬`을 무리하게 수정하지 않는다. 먼저 wrapper 또는 orchestration skill로 연결한다.

## 공통 모델 설계 방향

### Course Manifest

모든 오케스트레이터가 공유하는 강의 입력 문서다.

예상 필드:

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
  total_minutes: 360

tech_stack:
  - Java 21
  - Spring Boot 3.x
  - Gradle
  - IntelliJ

learning_goals:
  - HTTP 요청이 Spring MVC 내부에서 처리되는 흐름을 설명할 수 있다.
  - Controller와 Service의 책임을 구분할 수 있다.
  - 기본적인 Controller를 구현할 수 있다.

required_outputs:
  - slides
  - script
  - simulator
  - source_code

constraints:
  language: ko-KR
  tone: 실무형, 초급자 친화적
```

### Lesson Plan

강의 전체가 아니라 레슨 단위로 성격을 분류한다.

```yaml
lessons:
  - id: L01
    title: Spring MVC 요청 흐름 이론
    lesson_mode: THEORY
    required_artifacts:
      - script
      - slides

  - id: L02
    title: DispatcherServlet 요청 흐름 시뮬레이터
    lesson_mode: SIMULATION
    required_artifacts:
      - simulator
      - script_cue
      - slide_cue

  - id: L03
    title: Controller 실습
    lesson_mode: LAB
    required_artifacts:
      - step_code
      - lab_guide
      - explanation_script
```

권장 lesson_mode:

- `THEORY`: 개념/배경/이유/비교/사례 중심
- `LAB`: 단계별 코드와 실습 중심
- `HYBRID`: 이론과 실습이 강하게 결합
- `SIMULATION`: 별도 인터랙티브 시뮬레이터가 핵심

### Artifact Registry

생성된 산출물은 레지스트리에 등록한다.

```yaml
artifacts:
  - id: ART-SIM-001
    type: simulator_html
    lesson_id: L02
    path: courses/spring-mvc-2026/simulators/request-flow.html

  - id: ART-PANSEO-001
    type: panseo_slide_html
    lesson_id: L01
    path: courses/spring-mvc-2026/slides/L01_판서보드.html

  - id: ART-SCRIPT-001
    type: script
    lesson_id: L01
    path: courses/spring-mvc-2026/scripts/L01.md
```

## 오케스트레이터 설계 방향

### 공통 원칙

- 하나의 거대 오케스트레이터에서 `if delivery_type == ...`로 모든 것을 처리하지 않는다.
- `filmed-lecture`, `offline-lecture`, `online-lecture`를 독립 오케스트레이터로 만든다.
- 공통 스키마와 공통 검증 기준은 공유하되, 산출물 순서와 품질 기준은 각 오케스트레이터가 소유한다.
- 레슨 단위 pipeline registry를 사용한다.

예:

```yaml
lesson_pipeline_registry:
  THEORY:
    pipeline: filmed-theory-lesson-pipeline
  LAB:
    pipeline: filmed-lab-lesson-pipeline
  HYBRID:
    pipeline: filmed-hybrid-lesson-pipeline
  SIMULATION:
    pipeline: filmed-simulation-lesson-pipeline
```

### Filmed Lecture Orchestrator

목표:

- 촬영용 PPT와 프롬프터 중심의 강의 패키지를 만든다.

주요 에이전트 후보:

- FilmedLectureOrchestrator
- ResearchAgent
- LessonClassifierAgent
- LabCodeAgent
- TheoryNarrativeAgent
- SimulatorAgent
- ComicScenarioAgent
- PrompterScriptAgent
- SlideStoryboardAgent
- HtmlSlideComposerAgent
- PptExportAgent
- FilmedLectureQAAgent

핵심 품질 게이트:

- PPT가 강의 흐름의 중심인가?
- 시뮬레이터는 별도 파일이며 PPT에는 실행 cue만 있는가?
- 프롬프터 원고가 실제 말하기 흐름으로 읽히는가?
- 단계별 코드는 starter/problem/step/final로 변화 이유를 보여주는가?
- 긴 설정/반복 코드를 실시간 타이핑하도록 강요하지 않는가?

### Offline Lecture Orchestrator

목표:

- 강사가 현장에서 판서와 실습을 운영할 수 있는 강의 패키지를 만든다.

주요 에이전트 후보:

- OfflineLectureOrchestrator
- OfflineCurriculumAgent
- PanseoSlideAgent
- LabGuideAgent
- RubricAgent
- InstructorRunbookAgent
- SimulatorAgent
- StudentMaterialAgent
- InstitutionalFormatAgent
- OfflineLectureQAAgent

핵심 품질 게이트:

- 판서슬라이드의 화면 글자가 적은가?
- 강사가 설명하며 채울 여백이 충분한가?
- 실습 가이드는 학생이 혼자 보고 시작할 수 있는가?
- 루브릭은 학습목표와 연결되는가?
- 정답 코드와 평가 기준이 충돌하지 않는가?
- 실습 난이도가 수업 시간 안에 가능한가?
- `panseo-slide`가 기본 판서 자료를 담당하며, `panseo-board`가 중복 생성되지 않는가?

### Online Lecture Orchestrator

목표:

- 원고, 판서슬라이드, 시뮬레이터 중심의 자기주도형 온라인 강의 자료를 만든다.

주요 에이전트 후보:

- OnlineLectureOrchestrator
- OnlineLessonDesignAgent
- ScriptAgent
- PanseoSlideAgent
- SimulatorAgent
- OnlineLectureQAAgent

핵심 품질 게이트:

- 원고와 판서슬라이드 흐름이 맞는가?
- 판서슬라이드는 글자가 적고 설명 여백이 있는가?
- 시뮬레이터는 별도 파일로 생성되는가?
- 학습자가 혼자 봐도 개념의 hook/problem/summary가 이어지는가?

## 제안하는 파일 구조

Claude에서 실제 구축 시 다음 구조를 우선 검토한다.

```text
.claude/
  agents/
    filmed-lecture-orchestrator.md
    offline-lecture-orchestrator.md
    online-lecture-orchestrator.md
    lesson-classifier.md
    research-agent.md
    lab-code-agent.md
    simulator-agent.md
    panseo-slide-agent.md
    qa-agent.md

  skills/
    lecture-harness/
      SKILL.md
      references/
        architecture.md
        schemas.md
        quality-gates.md

    filmed-lecture/
      SKILL.md
      references/
        pipeline.md
        slide-rules.md
        prompter-rules.md

    offline-lecture/
      SKILL.md
      references/
        pipeline.md
        panseo-rules.md
        rubric-rules.md

    online-lecture/
      SKILL.md
      references/
        pipeline.md
        self-paced-rules.md

    reference-skill-bridge/
      SKILL.md
      references/
        edu-sim-builder.md
        panseo-slide.md
        panseo-board.md

docs/
  harness-design-v1.md
  claude-handoff-lecture-harness.md

courses/
  .gitkeep
```

중요:

- `참고스킬/`은 원본 참고 자산으로 보존한다.
- 실제 `.claude/skills`에는 참고스킬을 그대로 복사할지, bridge skill로 호출할지 먼저 결정한다.
- 안전한 시작은 bridge skill이다. 원본을 바로 수정하지 않는다.

## 사용자 승인 게이트

AI가 내용을 과하게 추가하는 것을 막기 위해 다음 지점에서 사용자의 승인을 받아야 한다.

1. Course Manifest 확정
2. 커리큘럼/레슨 플랜 확정
3. 실습 범위 및 단계별 코드 계획 확정
4. 촬영강의 PPT 스토리보드 확정
5. 오프라인/온라인 판서슬라이드 방향 확정
6. 최종 QA 후 배포 패키지 확정

## 실습 코드 설계 원칙

개발자 강의의 실습 코드는 단일 완성본이면 부족하다. 왜 코드가 바뀌는지 보여주는 단계별 흐름이 필요하다.

예:

```text
00-starter/
01-problem/
02-controller-added/
03-service-extracted/
04-validation-added/
05-test-added/
final/
```

각 단계는 아래 정보를 가져야 한다.

```yaml
step:
  id: step-03
  title: Service 분리
  previous_state: Controller가 비즈니스 로직을 모두 처리
  change_reason: Controller 책임이 과도하게 커짐
  changed_files:
    - UserController.java
    - UserService.java
  expected_result: 요청 처리와 비즈니스 로직이 분리됨
  lecture_message: 분리는 파일을 늘리는 것이 아니라 변경 이유를 분리하는 것이다.
```

## PPT/판서슬라이드/시뮬레이터의 역할 차이

```text
촬영강의 PPT
→ 설명의 중심
→ 글자/도형/이미지/코드 설명이 비교적 많아도 됨
→ 별도 시뮬레이터 실행 cue 포함

판서슬라이드
→ 강사의 실시간 설명을 위한 발판
→ 글자가 적어야 함
→ 여백과 판서 가능성이 중요
→ panseo-slide 사용

시뮬레이터
→ 직접 눌러보고 흐름을 관찰하는 별도 HTML
→ PPT/판서슬라이드에 내장하지 않음
→ edu-sim-builder 사용

빈 판서보드
→ 슬라이드 없이 즉석 필기만 필요한 경우
→ panseo-board 사용
```

## Claude가 피해야 할 오해

- 오프라인/온라인 강의에서 `panseo-slide`와 `panseo-board`를 둘 다 기본 산출물로 만들지 말 것.
- 판서슬라이드를 완성 구조도의 축약판으로 만들지 말 것.
- 판서슬라이드에 촬영강의 PPT처럼 많은 글자를 넣지 말 것.
- 촬영강의 PPT를 판서슬라이드처럼 너무 비워두지 말 것.
- 강의 전체를 `LAB` 또는 `THEORY` 하나로 분류하지 말 것.
- 시뮬레이터를 PPT나 판서슬라이드에 포함시키는 것을 기본값으로 삼지 말 것.
- 하나의 거대한 오케스트레이터에 모든 조건문을 넣지 말 것.
- 기존 참고스킬을 바로 덮어쓰지 말 것.

## 다음 작업 제안

Claude가 이어서 할 작업은 아래 순서가 좋다.

1. `참고스킬/panseo-slide/SKILL.md`, `참고스킬/panseo-board/SKILL.md`, `참고스킬/edu-sim-builder/SKILL.md`를 다시 읽고 이 문서와의 일치 여부를 확인한다.
2. `docs/harness-design-v1.md`를 작성한다.
3. 하네스 설계 문서에는 공통 스키마, 세 오케스트레이터, 산출물 계약, 품질 게이트, 기존 참고스킬 연결 방식을 포함한다.
4. 사용자에게 설계 v1 승인을 받는다.
5. 승인 후 `.claude/agents`와 `.claude/skills` scaffold를 생성한다.
6. 먼저 `filmed-lecture` 오케스트레이터를 MVP로 구현한다.
7. 이후 `offline-lecture`, `online-lecture`를 순차 확장한다.
8. 샘플 강의 하나로 드라이런한다. 추천 샘플은 "Spring MVC 요청 흐름"이다.

## Claude에게 줄 수 있는 시작 프롬프트

아래 문장을 Claude에 그대로 붙여넣어도 된다.

```text
이 문서는 Codex와 나눈 강의 제작 하네스 설계 인수인계 문서야.
먼저 끝까지 읽고, 현재 워크스페이스의 참고스킬 폴더를 확인해줘.
바로 구현하지 말고, 이 문서의 결정사항을 기준으로 하네스 설계 문서 v1 작성 계획을 먼저 제안해줘.
특히 panseo-slide 안에 판서보드 기능이 이미 포함되어 있다는 점을 절대 놓치지 마.
```

## 최종 결론

이 프로젝트는 "개발자 강의 제작 자동화"가 아니라, 더 정확히는 "개발자 강의 제작 과정을 산출물 계약과 품질 게이트로 운영하는 하네스"다.

성공 기준은 자동으로 모든 것을 한 번에 만드는 것이 아니다. 성공 기준은 다음이다.

- 강의 목표가 산출물 전체를 지배한다.
- 레슨 단위로 이론/실습/시뮬레이터가 자연스럽게 섞인다.
- 촬영강의/오프라인강의/온라인강의가 서로 다른 제작 라인을 가진다.
- `panseo-slide`, `panseo-board`, `edu-sim-builder`의 역할이 정확히 분리된다.
- 사람이 승인해야 할 지점에서 AI가 멈춘다.
- 결과물이 나중에 수정/재사용 가능한 강의 자산으로 남는다.
