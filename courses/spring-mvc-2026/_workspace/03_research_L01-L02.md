# Research Brief — L01 + L02 (통합)

- course: spring-mvc-2026 (촬영강의 1편 = 30분)
- 대상 레슨: L01 (THEORY, 4분) + L02 (SIMULATION, 7분)
- 공통 학습 목표(ref 0): HTTP 요청이 Spring MVC 내부에서 처리되는 흐름을 설명할 수 있다.
- 작성일: 2026-07-05
- 웹 접근: **정상** (Spring 공식 레퍼런스 + Martin Fowler PoEAA 원문 확보). 아래 주장은 대부분 verified.
- 버전 정합성 메모: manifest = Spring Boot 3.4.x → Spring Framework 6.2.x. 아래 인용 페이지는 Spring Framework 레퍼런스의 현행판이며, 본 brief가 다루는 요소(Front Controller 구조, DispatcherServlet 처리 시퀀스, Special Bean Types, `@ResponseBody`/HttpMessageConverter)는 6.0 이후 구조가 동일하게 유지된다. **단, ThemeResolver는 Spring Framework 6.0에서 제거**되었으므로 Special Bean Types 및 시퀀스에서 언급하지 않는다 (아래 C-13 주의).

---

## 섹션 1. 이론 서사 재료 (L01용, content-rules (b) 순서)

### 1.1 문제 상황 (시작 고정)
- **C-01**: Spring MVC를 포함한 다수 웹 프레임워크는 "front controller 패턴"으로 설계되어 있다 — 중앙 서블릿 하나(`DispatcherServlet`)가 요청 처리의 공통 알고리즘을 제공하고, 실제 작업은 설정 가능한 위임 컴포넌트가 수행한다.
  - source: Spring Framework Reference, "DispatcherServlet" — <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html> (원문: "Spring MVC, as many other web frameworks, is designed around the front controller pattern where a central `Servlet`, the `DispatcherServlet`, provides a shared algorithm for request processing, while actual work is performed by configurable delegate components.")

### 1.2 기존 방식(서블릿 직접 매핑)의 한계 — 깨지는 지점
- **C-02**: Front Controller 패턴이 해결하는 문제는 "입력 컨트롤러 동작이 여러 객체에 흩어지면 그 동작 상당수가 중복될 수 있다"는 것이다. (= 서블릿을 URL마다 직접 매핑하면 인증·로깅·예외 처리 같은 공통 관심사가 각 서블릿에 중복된다는 근거)
  - source: Martin Fowler, *Patterns of Enterprise Application Architecture*, "Front Controller" — <https://martinfowler.com/eaaCatalog/frontController.html> (원문: "If the input controller behavior is scattered across multiple objects, much of this behavior can end up duplicated.")
- **C-03**: 또한 흩어진 방식은 "런타임에 동작을 바꾸기 어렵다".
  - source: 위와 동일 (원문: "Also, it's difficult to change behavior at runtime.")

### 1.3 등장 배경 / 핵심 아이디어
- **C-04**: Front Controller는 모든 요청 처리를 단일 핸들러 객체로 통과시켜 통합한다. 이 객체가 공통 동작을 수행하고, 요청별 고유 동작은 하위(command) 객체로 분배(dispatch)한다.
  - source: Martin Fowler PoEAA, "Front Controller" — 위 URL (원문: "The Front Controller consolidates all request handling by channeling requests through a single handler object. This object can carry out common behavior ... The handler then dispatches to command objects for behavior particular to a request.")
- **C-05**: DispatcherServlet은 Spring 설정을 이용해 request mapping, view resolution, exception handling 등에 필요한 위임 컴포넌트를 "발견(discover)"한다. (= 중앙 집중 분배의 실제 메커니즘)
  - source: Spring Framework Reference, "DispatcherServlet" — 위 URL (원문: DispatcherServlet "uses Spring configuration to discover the delegate components it needs for" request mapping, view resolution, exception handling, and more.)

### 1.4 핵심 구조 — Special Bean Types (위임 컴포넌트 목록)
DispatcherServlet이 위임하는 특수 빈. 각 항목 source: Spring Framework Reference, "Special Bean Types" — <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/special-bean-types.html> (표 문구 verbatim)

- **C-06 `HandlerMapping`**: 요청을 핸들러 + (전/후처리용) 인터셉터 목록에 매핑한다. 매핑 기준은 구현체마다 다르다. (원문: "Map a request to a handler along with a list of interceptors for pre- and post-processing.")
- **C-07 `HandlerAdapter`**: DispatcherServlet이 핸들러를 실제로 어떻게 호출하는지와 무관하게 핸들러를 호출하도록 돕는다. 예: 애노테이션 컨트롤러 호출 시 애노테이션 해석을 담당하여 DispatcherServlet을 그 세부로부터 차단한다. (원문: "Help the `DispatcherServlet` to invoke a handler mapped to a request, regardless of how the handler is actually invoked. ... The main purpose of a `HandlerAdapter` is to shield the `DispatcherServlet` from such details.")
- **C-08 `HandlerExceptionResolver`**: 예외를 해석하는 전략. 핸들러/HTML 에러 뷰/기타 대상으로 매핑할 수 있다. (원문: "Strategy to resolve exceptions, possibly mapping them to handlers, to HTML error views, or other targets.")
- **C-09 `ViewResolver`**: 핸들러가 반환한 논리적 String 뷰 이름을, 응답에 렌더링할 실제 `View`로 해석한다. (원문: "Resolve logical `String`-based view names returned from a handler to an actual `View` with which to render to the response.")
- **C-10 `LocaleResolver` / `LocaleContextResolver`**: 클라이언트 Locale(및 시간대)을 해석해 국제화된 뷰를 제공한다.
- **C-11 `MultipartResolver`**: multipart 요청(예: 브라우저 폼 파일 업로드)을 파싱하는 추상화.
- **C-12 `FlashMapManager`**: 리다이렉트 등에서 한 요청에서 다음 요청으로 속성을 넘기기 위한 입/출력 FlashMap을 저장·조회.
- **C-13 (주의) ThemeResolver**: 현행 Special Bean Types 표에 **ThemeResolver가 없다** — Spring Framework 6.0에서 테마 지원이 제거되었기 때문. Spring Boot 3.x 대상 강의에서 "DispatcherServlet이 ThemeResolver를 사용한다"고 말하면 안 된다.
  - source: 위 Special Bean Types 페이지에 ThemeResolver 미포함 확인. 제거 사실 자체(6.0 removal)는 릴리스노트 재확인 권장 → `unverified: true` (본 세션에서 6.0 릴리스노트 원문 미확보). 강의에는 "언급하지 않는다"로만 반영하면 충분하므로 주장 자체를 원고에 넣을 필요 없음.

### 1.5 실제 동작 흐름 (요약 — 상세 단정 목록은 섹션 2)
- **C-14**: 공식 처리 시퀀스는 아래 5단계로 요약된다(세부는 섹션 2 참조):
  1) WebApplicationContext를 request에 바인딩, 2) LocaleResolver를 request에 바인딩, 3) (설정 시) multipart 검사·래핑, 4) 적절한 핸들러 탐색 후 실행 체인 실행, 5) 모델이 반환되면 뷰 렌더링(반환 안 되면 렌더링 없음).
  - source: Spring Framework Reference, "Processing" — <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/sequence.html>

### 1.6 대체 기술 / 비교 (다른 프레임워크의 Front Controller)
- **C-15**: Front Controller는 Spring 고유가 아니라 웹 프레임워크 전반의 공통 설계다("as many other web frameworks"). 즉 다른 프레임워크도 중앙 진입점을 둔다.
  - source: Spring Framework Reference, "DispatcherServlet" — 위 URL (동일 원문 인용).
- **C-16**: Front Controller는 GoF/PoEAA 계열의 확립된 엔터프라이즈 패턴이며 Fowler의 PoEAA 카탈로그에 정식 등재되어 있다. (프레임워크 독립적 개념임을 뒷받침)
  - source: Martin Fowler PoEAA, "Front Controller" — 위 URL.
- **비교 주의**: 특정 타 프레임워크(예: "Jakarta EE의 X", "Ruby on Rails의 Y")가 front controller를 쓴다는 개별 단정은 본 세션에서 1차 출처 미확보. 원고에서 개별 프레임워크명을 들어 단정하려면 추가 조사 필요 → 현재는 C-15/C-16의 "웹 프레임워크 일반의 공통 패턴" 수준으로만 서술 권장.

### 1.7 언제 유용한가 (마무리 고정)
- **C-17**: 이 모델은 "유연하며 다양한 워크플로를 지원한다". 즉 공통 처리를 한 곳에서 표준화하면서도, 위임 컴포넌트 교체로 다양한 요청 처리 방식을 수용할 수 있을 때 유용하다.
  - source: Spring Framework Reference, "DispatcherServlet" — 위 URL (원문: "This model is flexible and supports diverse workflows.")
- **C-18 (언제 덜 필요한가)**: 위임 컴포넌트는 필요할 때만 활성화된다 — 예: "locale 해석이 필요 없으면 locale resolver가 필요 없다", multipart resolver도 "지정한 경우에만" multipart를 검사한다. (모든 요청에 모든 단계가 강제되지 않음)
  - source: Spring Framework Reference, "Processing" — 위 URL (원문: "If you do not need locale resolving, you do not need the locale resolver." / "If you specify a multipart file resolver, the request is inspected for multiparts.")

---

## 섹션 2. L02 시뮬레이터용 — 요청 처리 컴포넌트 순서 (단정 문장 목록)

> 시뮬레이터(filmed 프로파일)가 아래 순서를 **문자 그대로 애니메이션**한다. 각 문장은 그대로 단정 자막/나레이션 검증에 사용 가능. Tomcat 진입은 서블릿 컨테이너 사실, 그 이후는 위 공식 시퀀스/빈 정의에 근거.

- **S-01**: 클라이언트가 보낸 HTTP 요청을 서블릿 컨테이너(Tomcat)가 먼저 수신한다.
  - source: 서블릿 컨테이너 일반 동작 (Jakarta Servlet 스펙). Spring 문서는 DispatcherServlet을 "central `Servlet`"으로 규정 → 컨테이너가 서블릿에 요청을 넘기는 구조. (Spring Reference "DispatcherServlet", 위 URL)
- **S-02**: 컨테이너는 요청을 프론트 컨트롤러로 등록된 단일 서블릿, 즉 `DispatcherServlet`으로 라우팅한다.
  - source: Spring Reference "DispatcherServlet" — 위 URL ("a central `Servlet`, the `DispatcherServlet`").
- **S-03**: `DispatcherServlet`은 `WebApplicationContext`를 request 속성으로 바인딩한다.
  - source: Spring Reference "Processing" — sequence.html, 1단계.
- **S-04**: 그다음 `LocaleResolver`를 request에 바인딩한다(로케일 해석용; 불필요하면 생략 가능).
  - source: 위 sequence.html, 2단계.
- **S-05**: `MultipartResolver`가 설정돼 있으면 요청의 multipart 여부를 검사하고, multipart면 `MultipartHttpServletRequest`로 래핑한다.
  - source: 위 sequence.html, 3단계.
- **S-06**: `DispatcherServlet`은 `HandlerMapping`을 통해 요청에 맞는 핸들러와 인터셉터 실행 체인을 찾는다.
  - source: 위 sequence.html 4단계 + Special Bean Types `HandlerMapping` 정의.
- **S-07**: 찾은 핸들러를 호출하기 위해 `DispatcherServlet`은 알맞은 `HandlerAdapter`를 사용한다(애노테이션 컨트롤러의 경우 애노테이션 해석을 담당).
  - source: Special Bean Types `HandlerAdapter` 정의 — 위 URL.
- **S-08**: 핸들러 실행 전, 인터셉터의 `preHandle(..)`이 먼저 호출된다. `false`를 반환하면 이후 실행 체인이 중단되고 핸들러는 호출되지 않는다.
  - source: Spring Reference "Interception" (HandlerInterceptor) — <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/handlermapping-interceptor.html>
- **S-09**: `HandlerAdapter`가 실제 Controller 메서드를 호출한다. (요청 본문이 있으면 `@RequestBody` 인자는 `HttpMessageConverter`로 역직렬화되어 주입된다.)
  - source: `HandlerAdapter` 정의(위) + HTTP Message Conversion — <https://docs.spring.io/spring-framework/reference/integration/rest-clients.html> ("converted to and from HTTP messages with the help of an `HttpMessageConverter`").
- **S-10 (분기 A — @ResponseBody / @RestController)**: 메서드에 `@ResponseBody`가 있으면 반환값이 `HttpMessageConverter`를 통해 응답 본문으로 직렬화된다. 이 경로에서는 **뷰 해석(ViewResolver)이 일어나지 않는다**.
  - source: Spring Reference "@ResponseBody" — <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responsebody.html> (원문: "have the return serialized to the response body through an HttpMessageConverter"). `@RestController` = `@Controller` + `@ResponseBody`(동일 페이지).
- **S-11 (분기 A 타이밍 주의)**: `@ResponseBody`/`ResponseEntity`의 경우 응답이 `HandlerAdapter` 내부에서 이미 기록·커밋되며, 이는 인터셉터 `postHandle` **이전**이다(그래서 postHandle에서 헤더 추가 등 응답 변경 불가).
  - source: Spring Reference "Interception" — 위 URL (원문: "the response is written and committed within the `HandlerAdapter`, before `postHandle` is called").
- **S-12 (분기 B — 뷰 반환)**: 핸들러가 논리적 뷰 이름/모델을 반환하면, `ViewResolver`가 그 String 뷰 이름을 실제 `View`로 해석하고, `View`가 모델을 응답으로 렌더링한다.
  - source: Special Bean Types `ViewResolver` 정의(위) + sequence.html 5단계 ("If a model is returned, the view is rendered.").
- **S-13**: 모델이 반환되지 않으면(예: 인터셉터가 요청을 이미 처리) 뷰 렌더링은 일어나지 않는다.
  - source: sequence.html 5단계 (원문: "If no model is returned ... no view is rendered, because the request could already have been fulfilled.").
- **S-14 (분기 B 후처리)**: 뷰 경로에서는 핸들러 실행 후 인터셉터 `postHandle(..)`이, 요청 완료 후 `afterCompletion(..)`이 호출된다.
  - source: Spring Reference "Interception" — 위 URL (preHandle=before, postHandle=after handler, afterCompletion=after complete request).
- **S-15 (예외 경로)**: 요청 처리 중 발생한 예외는 `WebApplicationContext`에 선언된 `HandlerExceptionResolver` 빈들이 해석한다.
  - source: sequence.html 보충 문구 + Special Bean Types `HandlerExceptionResolver` 정의.
- **S-16**: 완성된 응답은 `DispatcherServlet` → 서블릿 컨테이너(Tomcat) → 클라이언트로 되돌아간다.
  - source: 서블릿 컨테이너 일반 동작(응답 반환 경로) + S-01/S-02의 역경로.

**시뮬레이터 정본 순서(한 줄):**
Tomcat 수신 → DispatcherServlet(WebApplicationContext·LocaleResolver 바인딩, multipart 검사) → HandlerMapping(핸들러+인터셉터 체인) → HandlerAdapter → 인터셉터 preHandle → Controller 호출 → [A: @ResponseBody → HttpMessageConverter 직렬화(뷰 해석 없음) | B: 뷰 이름 반환 → ViewResolver → View 렌더링] → 인터셉터 postHandle/afterCompletion → 응답을 Tomcat 경유로 클라이언트 반환. (예외는 HandlerExceptionResolver.)

---

## 섹션 3. 버전 특정 주장 / 미검증 항목

- **V-01 (unverified: true)**: "Spring Boot 3.x는 클래스패스에 Jackson이 있으면 JSON `HttpMessageConverter`를 자동 구성하여 `@RestController` 반환값을 기본 JSON으로 직렬화한다." — `@ResponseBody`가 `HttpMessageConverter`로 직렬화한다는 것(S-10)은 verified이나, "Jackson 자동 구성 = Boot 3.x 기본값"이라는 버전 특정 부분은 본 세션에서 Spring Boot 레퍼런스/릴리스노트 원문 미확보. 원고에 쓰려면 Spring Boot 3.4 레퍼런스(`spring-boot-features` / messaging-JSON 섹션) 확인 필요. citation_required(version_specific_claims) 대상.
- **V-02 (unverified: true)**: ThemeResolver의 "Spring Framework 6.0 제거" 시점 명시(C-13) — 릴리스노트 원문 재확인 권장. 강의에는 "언급하지 않기"로만 반영하므로 원고 삽입 불필요.
- 그 외 섹션 1~2의 모든 C/S 항목은 Spring 공식 레퍼런스 및 Fowler PoEAA 원문으로 verified.

---

## 섹션 4. 인용 출처 목록 (1차 자료)

1. Spring Framework Reference — DispatcherServlet: <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html>
2. Spring Framework Reference — Processing (sequence): <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/sequence.html>
3. Spring Framework Reference — Special Bean Types: <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/special-bean-types.html>
4. Spring Framework Reference — Interception (HandlerInterceptor): <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/handlermapping-interceptor.html>
5. Spring Framework Reference — @ResponseBody: <https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responsebody.html>
6. Spring Framework Reference — HTTP Message Conversion: <https://docs.spring.io/spring-framework/reference/integration/rest-clients.html>
7. Martin Fowler, *PoEAA* — Front Controller: <https://martinfowler.com/eaaCatalog/frontController.html>
