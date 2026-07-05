# 시뮬레이터 offline_interactive 프로파일 적합성 검증

- 검증 대상: `courses/spring-mvc-2026/simulators/시뮬레이터_MVC요청흐름.html` (filmed 프로파일로 제작)
- 대상 프로파일: `offline_interactive` (오프라인 라인)
- 성격: **기존 시뮬 재사용 검증** (신규 생성 아님)
- 판정 기준: `.claude/skills/lecture-harness/references/content-rules.md` (c)절 + `edu-sim-builder/SKILL.md` 115행
- 일자: 2026-07-05

## 판정: **적합** (배지 정정 후 재사용)

filmed용으로 제작된 이 시뮬은 엔진 구조 변경 없이 offline_interactive 요건을 충족한다. 유일한 조치는 컨텍스트 배지 라벨 정정(메타데이터)이며, 이는 프로파일 기능 결함이 아니다.

---

## 판정 근거

### ① 강사 실시간 조작 가능성 — PASS

프로파일 핵심 요구: "강사가 수업 중 실시간 조작. 즉석 질문 대응."

시뮬이 제공하는 조작 수단:
- **`다음 단계 ▶`** (step 전진): 나레이션·설명 타이밍에 맞춰 한 단계씩 진행. 강사가 말하면서 원하는 지점에서 멈출 수 있음.
- **`↺ 리셋`**: 언제든 STEP 0으로 복귀 → "다시 처음부터 보자" 즉석 대응.
- **모드 토글 A/B** (`@RestController` JSON ↔ `@Controller` 뷰): 학생이 "REST면 뷰는 안 거치나요?" 같은 질문을 하면 즉석에서 분기를 바꿔 보여줄 수 있음. 두 분기의 응답 경로(converter vs viewresolver→view) 차이가 화면에 대비되어 즉석 질문 대응에 직접 쓰인다.
- 진행 카운터/프로그레스 바로 현재 위치를 강사·학생이 함께 인지.

→ step 전진·리셋·모드 전환의 조합으로 즉석 질문 대응이 성립한다. **PASS.**

### ② 자유 탐색 요건 해석: "허용" vs "필수" — PASS

문언 대조:

| 프로파일 | 문언 | 요건 강도 |
|----------|------|-----------|
| `offline_interactive` | "즉석 질문 대응용 자유 탐색(파라미터 조절) **허용**" | 허용(permit) |
| `online_self_paced` | "시작 안내 문구, 리셋 버튼, 단계별 진행 표시 **필수**" | 필수(require) |

- content-rules (c)절과 edu-sim-builder SKILL.md 115행 모두 offline_interactive에 대해 **"허용"** 단어를 쓴다. 온라인 프로파일이 "필수"를 명시하는 것과 대비된다.
- 해석: offline_interactive는 시뮬이 자유 탐색을 **막지 않고 허용**하기를 요구한다. **연속 파라미터 슬라이더 위젯을 강제하지 않는다** ("필수"가 아니므로). 만약 파라미터 조절 위젯이 필수였다면 문언이 online처럼 "필수"였을 것.
- 현 시뮬 통과 여부: 이 개념(MVC 요청 파이프라인)은 본질적으로 **고정 순서 파이프라인**이라 연속 파라미터가 자연스럽지 않다. 이 개념에서 유의미한 "파라미터"는 **응답 분기 타입(A/B)**이며, 모드 토글로 자유롭게 조절 가능하다. 또한 step 전진·리셋을 임의 시점에 자유롭게 조작할 수 있어 이산적 자유 탐색이 열려 있다.

→ "허용" 요건 기준으로, 시뮬은 개념에 맞는 자유 탐색(분기 토글 + 자유 리셋/전진)을 허용한다. **PASS.**

### ③ 부족한 점 / 최소 보완

- **필수 보완: 배지 라벨 정정.** filmed 컨텍스트의 `L01` → `L01 (오프라인)`. (기능 결함 아님, 컨텍스트 메타데이터. **이번에 정정 완료.**)
- **비차단 선택 개선(적용 안 함):** step 후진 버튼(`◀ 이전 단계`)이 있으면 "방금 5단계 다시 보여주세요"에 리셋 없이 대응 가능. 단, ⓐ 엔진 구조 변경에 해당하고 ⓑ "허용" 요건이지 "필수"가 아니며 ⓒ 리셋+전진으로 이미 커버되므로 **재사용 검증 범위에서 적용하지 않음**. 향후 개선 여지로만 기록.

---

## STEP 구조 대조 검증 (concept_model + architecture_diagram, v1.7)

원천: `_workspace/01_concept_model.yaml`, `_workspace/01_architecture_diagram.d2` (spring-mvc-2026 G2 승인본 복사, 재사용 승인 대상).

- **컴포넌트 순서 일치:** 시뮬 노드/STEP 순서(client→tomcat→dispatcher→context·locale·multipart→mapping→adapter→interceptor→controller, 분기 A: converter / 분기 B: viewresolver→view→dispatcher)가 diagram 요청 진입~응답 반환 화살표 순서와 일치.
- **관계 방향 일치:** interceptor.preHandle(컨트롤러 호출 전), adapter.invokes(컨트롤러 호출), 분기 A converter 직렬화, 분기 B viewresolver→view 순서 모두 일치.
- **핵심 타이밍 일치:** 분기 A에서 "converter 응답 커밋 → postHandle"(STEP 8→9)이 diagram `timing: before_postHandle` 및 concept_model S-11 note와 일치. 분기 B에서 postHandle(after_controller_before_render)이 뷰 렌더링 이전에 위치하는 것도 일치.
- **scope 경계 준수:** L03 구간(controller→service→DTO→repository→transaction-boundary)은 시뮬에 없음. diagram상 해당 관계는 L03 소속이고 이 시뮬은 L01 범위이므로 정합. 예외 경로(HandlerExceptionResolver)는 시뮬 하단 note에서 "이 시뮬 범위 밖"으로 명시 — scope_boundaries 정신과 일치.

→ **불일치 없음.** 임의 진행/확인 요청 불필요.

---

## 런타임/문법 검증

- `node --check`: script 블록 1개 추출 → 문법 오류 **0건 (PASS)**. (node v24.13.0)
- 좌표/수학: 원본이 이미 viewBox 640×520 내 좌표 검증 완료 상태(주석 명시), 이번 재사용에서 좌표 변경 없음 → 재검증 불필요.
- 내용(개념) 검증: STEP 단정 문장이 concept_model 주장-출처 쌍과 일치함을 대조로 확인(위 STEP 대조). 재사용으로 내용 변경 없음.

---

## 수행 조치

1. `courses/spring-mvc-offline-2026/simulators/` 생성.
2. 시뮬 HTML 복사(원본 무수정 보존).
3. 배지 `L01` → `L01 (오프라인)` 정정 (복사본 1곳).
4. `node --check` 재검증 통과.
5. 본 판정 문서 작성.

## 산출물

- `courses/spring-mvc-offline-2026/simulators/시뮬레이터_MVC요청흐름.html` (배지 정정본)

## 실행 cue (실습 가이드/강사 노트 삽입용)

- `[SIM: 시뮬레이터_MVC요청흐름.html — 모드 A(@RestController)로 STEP 0→10 진행하며 요청→응답 흐름 시연]`
- `[SIM 즉석 대응: 뷰 렌더링 질문 시 모드 B로 토글 → STEP 8~11에서 postHandle이 렌더링보다 앞선다는 점 강조]`
- `[SIM 리셋: 질문 후 ↺ 리셋으로 처음부터 재시연]`
