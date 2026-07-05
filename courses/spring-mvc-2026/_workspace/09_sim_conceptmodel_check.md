# 시뮬레이터 ↔ v1.7 개념 모델 대조 검증

- 검증 대상: `courses/spring-mvc-2026/simulators/시뮬레이터_MVC요청흐름.html`
- 대조 기준: `_workspace/01_concept_model.yaml` (v1.7, G2 승인), `_workspace/01_architecture_diagram.d2` (v1.7)
- 검증자: simulator-agent / 프로파일: filmed (예측 가능한 step 진행)
- 일자: 2026-07-05
- baseline 재확인: `node --check` PASS · Mode A = 11 STEP(idx 0~10) · Mode B = 13 STEP(idx 0~12) — 태스크 명세와 일치, **편집 없음(구조·엔진·STEP 수 불변)**

---

## 종합 판정: 일치 (승계 가능)

4개 대조 항목 전부 통과. 구조적 불일치 0건, 화면 텍스트 수준 수정 필요 0건. 단 **비-검증성 관측 2건**(승계 전 오케스트레이터 확인 권장, 아래 §5).

---

## ① STEP 컴포넌트 순서 ↔ concept_model relationships 방향·순서

concept_model relationships를 요청 처리 순서로 나열하고 시뮬 STEP과 대조. (rel 번호 = yaml 등장 순)

| # | concept_model relationship (kind) | 방향 | 시뮬 대응 STEP (A / B) | 판정 |
|---|---|---|---|---|
| r1 | http-client → servlet-container (sends_request) | ↓ | A0/B0 → A1/B1 (client→tomcat) | 일치 |
| r2 | servlet-container → dispatcher-servlet (routes_to_front_controller) | ↓ | A2/B2 (tomcat→dispatch 라우팅) | 일치 |
| r3 | dispatcher-servlet → front-controller-pattern (implements) | — | dispatch 노드 sub-label "프론트 컨트롤러" + STEP2 문구 | 일치(개념 속성, 흐름 노드 아님 — 라벨로 표현) |
| r4 | dispatcher-servlet → web-application-context (binds_to_request) | ↓ | A3/B3 "WebApplicationContext ... 바인딩" | 일치 |
| r5 | dispatcher-servlet → locale-resolver (binds, optional) | ↓ | A3/B3 "LocaleResolver ... 바인딩" | 일치(§5-b 관측) |
| r6 | dispatcher-servlet → multipart-resolver (inspects, optional) | ↓ | A3 "MultipartResolver 있으면 검사 / multipart 아님", B3 "필요 시 검사" | 일치 |
| r7 | dispatcher-servlet → handler-mapping (discovers_handler_chain) | ↓ | A4/B4 "HandlerMapping — 핸들러 탐색" | 일치 |
| r8 | handler-mapping → handler-interceptor (supplies_interceptor_chain) | → | A4/B4 "핸들러와 인터셉터 실행 체인" | 일치(체인 공급 주체=Mapping) |
| r9 | dispatcher-servlet → handler-adapter (selects) | ↓ | A5/B5 "HandlerAdapter 선택" | 일치(r7,r8 뒤 순서까지 일치) |
| r10 | handler-interceptor → controller (pre_handles, before_controller) | ↓ | A6/B6 "preHandle() ... 호출 전 · false면 중단" | 일치(순서·타이밍·중단조건) |
| r11 | handler-adapter → controller (invokes) | ↓ | A7/B7 "HandlerAdapter가 컨트롤러 메서드 호출" | 일치(r10 뒤 순서 일치) |
| r12 | controller → http-message-converter (deserializes_request_body) | → | A7 "@RequestBody ... HttpMessageConverter로 역직렬화 → SignUpRequest" | 일치 |
| r13 | controller → dto (binds_request_input) | → | A7 SignUpRequest 주입 / B7 MemberForm 바인딩 | 일치(§5-a 관측) |
| r14 | controller → service (delegates_use_case) | → | 코드 스니펫 `memberService.save(...)` | 부분(§5-a) |
| r15 | service → transaction-boundary (owns) | → | 미시각화 | 범위밖(§5-a) |
| r16 | service → repository (coordinates) | → | 미시각화 | 범위밖(§5-a) |
| r17 | service → controller (returns_result) | ← | 코드 스니펫 `Long id = ...` 반환 | 부분(§5-a) |
| r26 | dispatcher-servlet → servlet-container (returns_response) | ↑ | A10/B12 "DispatcherServlet → Tomcat → 클라이언트" | 일치 |
| r27 | servlet-container → http-client (returns_response) | ↑ | A10/B12 동일 문구 | 일치 |

판정: 요청 진입~핸들러 호출~응답 반환의 **주 파이프라인 순서·방향이 relationships와 완전 일치**. r14~r17(Service 계층 배턴, L03 개념)은 시뮬이 컨트롤러 코드 한 줄(`memberService.save`)로 추상화 — 상충 아님, §5-a 참조.

---

## ② 응답 A/B 분기와 timing

| concept_model | 시뮬 대응 | 판정 |
|---|---|---|
| r18 controller → converter (serializes_response, **branch A**, "ViewResolver 미개입") | A8 "@ResponseBody ... HttpMessageConverter로 직렬화. **ViewResolver는 호출되지 않습니다.**" | 일치 |
| r19 converter → handler-adapter (response_committed_within, **branch A**, **timing: before_postHandle**) | A8 warn: "이 직렬화·응답 기록은 **HandlerAdapter 내부**에서 ... 이미 **커밋** ... postHandle 보다 **먼저**" | 일치(핵심 subtle timing 정확 반영) |
| (분기 A postHandle 무력화, brief S-11) | A9 warn: "응답 이미 커밋 — postHandle에서 ... **응답을 바꿀 수 없습니다**" | 일치 |
| r20 controller → view-resolver (returns_view_name, **branch B**) | B7 "논리적 뷰 이름 "members/detail" ... 반환" | 일치 |
| r23 interceptor → controller (post_handles, **branch B**, **timing: after_controller_before_render**) | B8 "postHandle()" + warn "뷰 렌더링은 **아직** ... postHandle **다음**" | 일치(컨트롤러 후·렌더 전 위치 정확) |
| r21 view-resolver → view (resolves_to, **branch B**) | B10 "ViewResolver가 ... 실제 View 객체로 해석" | 일치 |
| r22 view → dispatcher-servlet (renders_to_response, **branch B**) | B9 "DispatcherServlet이 뷰 렌더링 주관" + B11 "View가 ... HTML 응답 본문 렌더링" | 일치 |
| r24 interceptor → controller (after_completion, after_request_complete, 양분기 공통) | A9 "postHandle → afterCompletion", B12 "afterCompletion() ... 반환" | 일치(양분기 공통 처리) |

판정: **A/B 분기 분리와 timing이 concept_model의 가장 미묘한 지점까지 정확**. 분기 A는 "HandlerAdapter 내부 커밋 → postHandle 이전"(A8→A9 순서), 분기 B는 "postHandle(B8) → ViewResolver→View 렌더(B10→B11)" 순서로, timing 필드(`before_postHandle` vs `after_controller_before_render`)와 STEP 배열 순서가 완전 대응.

---

## ③ scope_boundaries 위반 요소 화면 존재 여부

| scope_boundary 항목 | 화면 검사 결과 | 판정 |
|---|---|---|
| Servlet Filter 체인 (DispatcherServlet 앞단) | 흐름이 client→Tomcat→DispatcherServlet에서 시작, 필터 노드/언급 없음 | 위반 없음 |
| Spring Security (인증/인가, 시큐리티 필터) | 부재 | 위반 없음 |
| 비동기(async/DeferredResult/WebFlux) | 부재, 동기 서블릿 스택만 | 위반 없음 |
| ThemeResolver / 테마 | STEP3 바인딩 대상은 WebApplicationContext·LocaleResolver·MultipartResolver뿐, **ThemeResolver 없음** | 위반 없음(경계 준수) |
| JPA/DB·영속성 상세, @Transactional 전파/격리 | `memberService.save()` 한 줄만, Repository 노드·트랜잭션 상세 미노출 | 위반 없음 |
| 뷰 템플릿 엔진 상세(Thymeleaf/JSP 내부) | 분기 B는 ViewResolver→View 수준까지만, 템플릿 문법 없음 | 위반 없음(경계 명시 준수) |
| Jackson 자동구성/버전 특정 동작 | HttpMessageConverter를 일반 전략으로만 서술, "Boot 3.x 기본값" 등 버전 단정 없음 | 위반 없음 |
| 커스텀 HandlerMapping/Adapter·content negotiation 상세 | 존재만 언급, 내부 미노출 | 위반 없음 |

추가: HandlerExceptionResolver(예외 경로)는 하단 `note exc`에서 **"이 시뮬 범위 밖"으로 명시**하며 r25(resolves_exception)와 일치하게 서술 — 경계를 올바르게 프레이밍.

판정: **scope_boundaries 위반 0건**. 버전 특정 주장·Filter·Security·ThemeResolver·async·영속성/템플릿 내부 모두 화면에 없음.

---

## ④ 노드 라벨·용어 ↔ concept_model name 일치

| 시뮬 노드 라벨 | concept_model name / d2 라벨 | 판정 |
|---|---|---|
| 서블릿 컨테이너 (Tomcat) | 서블릿 컨테이너 (Tomcat) | 정확 일치 |
| DispatcherServlet (+sub 프론트 컨트롤러) | DispatcherServlet / "DispatcherServlet\n(프론트 컨트롤러 구현)" | 일치 |
| HandlerMapping | HandlerMapping | 정확 일치 |
| HandlerAdapter | HandlerAdapter | 정확 일치 |
| HandlerInterceptor | HandlerInterceptor | 정확 일치 |
| Controller (+sub @PostMapping) | Controller (@Controller / @RestController) | 일치 |
| HttpMessageConverter | HttpMessageConverter | 정확 일치 |
| ViewResolver → View (한 노드로 병합) | ViewResolver / View (개념 모델은 2개 노드) | 일치(§5 없음 — STEP10/11이 해석·렌더 분리, 라벨 자체는 일치) |
| 클라이언트 (브라우저/프론트) | HTTP 클라이언트 / "클라이언트" (정의: 브라우저/앱 등) | 일치(경미한 표현차, 상충 아님) |

용어 검사: 시뮬에 등장하는 SignUpRequest/SignUpResponse/MemberForm/@RequestBody/@ModelAttribute/preHandle/postHandle/afterCompletion 모두 concept_model 정의·brief 용어 범위 내. **개념 모델에 없는 용어나 상충 용어 0건.**

판정: **라벨·용어 일치**. ViewResolver와 View를 시각적으로 1개 노드로 묶었으나 라벨이 두 개념을 모두 담고 STEP에서 해석(B10)·렌더링(B11)을 분리하므로 개념 왜곡 없음.

---

## §5 관측 사항 (수정 아님 — 승계 전 오케스트레이터 확인 권장)

**(a) Service 계층 배턴(r13~r17)의 추상화 — 구조적 불일치 아님, 범위 분할**
- 이 시뮬은 badge상 **DispatcherServlet 요청 흐름(L02/MVC 파이프라인)** 스코프. concept_model의 r14~r17(controller→service→transaction/repository→controller 반환)은 **L03(책임 경계) 개념**이며, 시뮬은 이를 컨트롤러 코드 스니펫의 `memberService.save(...)` 한 줄로 추상화.
- 판정: MVC 요청 흐름 시뮬로서는 **올바른 스코프 분할**(상충·모순 없음). 다만 만약 이 시뮬을 L03(서비스 계층/트랜잭션 경계) 시뮬로도 재사용할 의도라면 r15(@Transactional 경계)·r16(Repository 조율) 시각화가 **없음**을 인지 필요. → 승계 대상 레슨이 요청-흐름(L02류)이면 문제없음.

**(b) LocaleResolver를 무조건 바인딩으로 서술**
- concept_model r5는 `optional: true`("불필요하면 생략 가능"). 시뮬 STEP3는 "LocaleResolver를 request에 바인딩합니다"로 단정.
- Spring Framework Reference의 표준 processing sequence(2단계)가 로케일 리졸버를 request에 바인딩하므로 **사실 오류는 아님**. optional은 "로케일 해석이 불필요할 때 생략 가능"의 의미. MultipartResolver는 STEP3에서 "있으면/필요 시"로 조건부 서술해 optional을 반영. → 경미, 수정 불요(원한다면 후속 라운드에서 "(선택)" 표기 추가 가능).

**(c) 레슨 번호 라벨 — 확인 요청 대상**
- 시뮬 badge/코드 주석은 **"L02"**(badge: "요청 처리 흐름 · L02", 좌표 주석 등). 반면 본 태스크 지시는 "**L01** 시뮬 파트로 승계 가능한가"로 지칭.
- 이는 개념 대조 항목이 아니라 **레슨 매핑 문제**. 정본은 lesson-plan.yaml(미확인). badge를 임의로 L01↔L02 변경하면 오히려 틀릴 수 있어 **수정하지 않음**. → 승계 확정 전 오케스트레이터가 lesson-plan 기준으로 badge 레슨 번호를 확정·정정할 것.

---

## 재검증 결과 (편집 없음)
- 편집 미발생 → 구조·엔진 로직·STEP 배열 불변.
- `node --check` (추출 스크립트): **PASS**
- STEP 수: Mode A 11(idx 0~10), Mode B 13(idx 0~12) — **불변, 명세 일치**

---
**[추기 2026-07-05, 오케스트레이터]** §5(c)의 badge "L02" 서술은 검증 시점 기준이다. 이후 G2 재확정(레슨 재편)에 따라 시뮬레이터 badge를 "L01"로 정정 완료했고 Registry(ART-SIM-001, lesson_id L01)와 일치한다. (최종 QA v2 W-BADGE 해소)
