<!--
prompter for: L02 (filmed / SIMULATION)
source: scripts/L02.md
duration: 10분 (촬영 기준 — 분편안 재배분, 편1)
큐 마커: 도입/정리 = [SLIDE n] (L02 로컬 번호), 본체 = SIM 마커 원본 보존
발화 규칙: 각 줄 = 한 호흡. `> ref:` 줄은 출처 각주 — 읽지 않음(발화 자수 제외).
클라이맥스(모드 A STEP 8~9, 모드 B STEP 8)는 축약 금지 구간.
-->

# L02 프롬프터 — HTTP 요청 한 건이 MVC 내부를 통과하는 흐름 추적

---

## 0. 도입 — L01의 다리를 받는다

`[SLIDE 01]`

L01의 안내데스크, 기억나시죠.
요청을 왜 한곳에 몰아주는지는 봤으니,
이제 그 데스크가 요청 한 건을 **어떤 순서로** 처리하는지, 직접 따라갑니다.

재료는 회원가입 요청 하나.
`POST /members`.
뒤의 L04에서 우리가 직접 만들 그 요청입니다.

제가 단계를 누를 때마다, 요청은 관문을 하나씩 지나요.
화면이 무엇을 보여주든, 딱 하나만 붙잡으세요.
**저 관문이, 왜 거기 있는가.**

`[SIM 실행: 시뮬레이터_MVC요청흐름.html]` (모드 A = ① @RestController 선택 확인)

---

## 1. 모드 A — @RestController, JSON 응답 경로 (STEP 0~10)

`[SIM STEP 0]`

출발점입니다.
요청은 아직 서버 밖.
JSON 본문 하나를 들고, 서버로 향하는 중이에요.
이 순간 스프링은, 이 요청의 존재조차 모릅니다.

`[SIM STEP 1]`

요청을 **가장 먼저** 받는 건, 스프링이 아닙니다.
서블릿 컨테이너, 톰캣이에요.
스프링 MVC의 입구인 DispatcherServlet도, 결국 '서블릿' 한 개거든요.
서블릿은 컨테이너 없이는 못 돕니다.
그러니 첫 접수는 언제나 컨테이너 몫이에요.

`[SIM STEP 2]`

컨테이너는 이 요청을 어디로 넘길까요.
URL마다 다른 서블릿이 아니라,
프론트 컨트롤러로 등록된 **단 하나의 서블릿** — DispatcherServlet으로 몰아줍니다.
L01의 '한곳으로 모은다'가, 실제로 일어나는 지점이 바로 여기예요.

`[SIM STEP 3]`

데스크에 요청이 도착했는데,
컨트롤러를 바로 부르지 않고, 준비부터 합니다.
WebApplicationContext와 LocaleResolver를, request에 붙여요.
왜 미리 붙일까요.
이후 어느 단계에서든 '이 요청의 스프링 컨텍스트가 뭐냐, 언어가 뭐냐'를
꺼내 쓸 수 있게, 깔아두는 겁니다.
multipart 검사도 여기서 하지만, 이 요청은 JSON이라 해당 없음.
**필요한 관문만 열린다** — 이걸 기억하세요.
> ref: SFR, Processing

`[SIM STEP 4]`

이제 진짜 질문입니다.
이 `POST /members`를, 누가 처리하지?
그 답을 찾는 게 HandlerMapping이에요.
요청에 맞는 핸들러 하나, 그리고 그 앞뒤에 끼워질 인터셉터 체인까지,
**한 묶음으로** 찾아냅니다.
> ref: SFR, Special Bean Types

`[SIM STEP 5]`

찾았으면 바로 부르면 될 텐데,
왜 어댑터가 하나 더 낄까요.
컨트롤러를 호출하는 방식이, 한 가지가 아니기 때문입니다.
HandlerAdapter가 그 차이를 흡수해줘요.
그래서 DispatcherServlet은 '핸들러를 어떻게 부르는지' 세부를
**몰라도 되게 차단**해 줍니다.
> ref: SFR, Special Bean Types

`[SIM STEP 6]`

컨트롤러를 부르기 직전.
인터셉터의 preHandle이, 먼저 끼어듭니다.
'핸들러 실행 전' 공통 처리 자리예요 — 인증 검사 같은 것.
여기서 `false`를 반환하면, 체인이 끊기고
컨트롤러는 아예 호출되지 않습니다.
문지기죠.
> ref: SFR, Interception

`[SIM STEP 7]`

드디어 컨트롤러 메서드가, 호출됩니다.
그런데 그 직전에, 조용히 벌어지는 일이 있어요.
요청 본문의 JSON이, 문자열 그대로 들어오지 않습니다.
`@RequestBody` 자리에,
HttpMessageConverter가 JSON을 우리 객체 `MemberSaveRequest`로
**역직렬화**해서 꽂아 줘요.
컨트롤러는 이미 다 풀린 객체를, 받는 겁니다.
> ref: SFR, HTTP Message Conversion

### 클라이맥스 — 응답은 언제 만들어지는가

`[SIM STEP 8]`

여기가 오늘의 핵심입니다.
컨트롤러가 값을 `return` 했어요.
자, 응답은 **언제** 만들어질까요.
`@RestController`, 즉 `@ResponseBody`가 붙었으니,
반환한 객체는 HttpMessageConverter를 거쳐
곧장 응답 본문 JSON으로 직렬화됩니다.
그리고 결정적으로 —
이 경로에서는 **ViewResolver를 아예 타지 않습니다.**
화면에 그릴 뷰가, 없으니까요.
더 중요한 건 타이밍이에요.
이 직렬화와 응답 기록은, HandlerAdapter **안에서** 끝나 버립니다.
응답이 바로 이 순간, 이미 **커밋**된다는 뜻이에요.
> ref: SFR, @ResponseBody / Interception

`[SIM STEP 9]`

그다음에야 인터셉터 postHandle,
이어서 afterCompletion이 불립니다.
순서를 보세요.
응답은 STEP 8에서 이미 커밋됐고, postHandle은 그 뒤예요.
그래서 여기서 응답 헤더를 바꾸려 하면, 소용없습니다.
이미 부친 편지에, 도장 더 찍는 격이죠.
'@RestController에선 postHandle로 응답을 못 만진다'는 말,
그 이유가 바로 이 순서입니다.
> ref: SFR, Interception

`[SIM STEP 10]`

완성된 JSON 응답이, 왔던 길을 되짚어
DispatcherServlet, 톰캣을 지나 클라이언트로 돌아갑니다.
요청 한 건의 왕복이, 끝났습니다.

---

## 2. 모드 B — @Controller, HTML 뷰 렌더링 경로 (대조)

`[SIM 리셋 → 모드 ② @Controller 로 전환]`

같은 `POST /members`인데,
이번엔 JSON이 아니라, HTML 페이지를 돌려주는 컨트롤러입니다.
**STEP 6, preHandle까지는 방금 본 A와 완전히 동일**해요.
그러니 거기까진 빠르게 지나가고,
갈라지는 지점부터 봅니다.

`[SIM STEP 0~6 연속 클릭 — 나레이션 없이 빠르게, 모드 A와 동일 구간]`

`[SIM STEP 7]`

갈림길입니다.
A의 컨트롤러는 객체를 `return` 했죠.
B의 컨트롤러는, 문자열 하나를 반환합니다.
`"members/detail"`이라는 **논리적 뷰 이름**, 그리고 모델.
아직 HTML은 한 글자도 안 만들어졌어요.
'이 이름의 화면을 그려라'는 주문서만, 넘긴 겁니다.

`[SIM STEP 8]`

자, A와 정면으로 갈리는 지점입니다.
여기서 postHandle이 불립니다.
그런데 뷰 렌더링은? **아직이에요.**
A에서는 STEP 8에 이미 응답이 커밋돼서, postHandle이 손쓸 수 없었죠.
B에서는 postHandle이 불리는 이 순간, 화면은 아직 안 그려졌습니다.
같은 이름의 콜백인데 —
**응답이 커밋됐느냐, 아니냐**에 따라
할 수 있는 일이 달라져요.
이게 두 경로의, 진짜 차이입니다.
> ref: SFR, Interception

`[SIM STEP 9]`

제어가 DispatcherServlet으로, 돌아옵니다.
A에서는 HandlerAdapter가 응답까지 다 끝냈지만,
B에서는 **렌더링을 DispatcherServlet이 직접 주관**합니다.
뷰를 다루는 책임이, 데스크로 돌아온 거예요.

`[SIM STEP 10]`

그 주문서 — `"members/detail"`이라는 이름을
실제 `View` 객체로 바꿔 주는 게, ViewResolver입니다.
A에서는 만난 적도 없는 관문이죠.
논리적 이름을, 실제 템플릿으로 해석하는 자리입니다.
> ref: SFR, Special Bean Types

`[SIM STEP 11]`

이제 `View`가 모델 데이터를 채워,
실제 HTML 본문을 렌더링합니다.
A는 STEP 8에서 응답이 끝났는데,
B는 STEP 11에 와서야, 응답 본문이 완성돼요.
렌더링이라는 일이, 통째로 더 있으니까요.

`[SIM STEP 12]`

요청이 완료되면 afterCompletion이 불리고,
완성된 HTML이, 같은 귀갓길로 클라이언트에게 돌아갑니다.

`[SIM 종료]`

---

## 3. 정리 — 두 경로 요약 + L03로 넘어가는 다리

`[SLIDE 02]`

두 경로를 겹쳐 보죠.
**STEP 6, preHandle까지는 한 몸**입니다.
갈라진 건, 컨트롤러가 **무엇을 반환하느냐**에서였어요.

객체를 반환하면 — @ResponseBody —
HttpMessageConverter가 그 자리에서 직렬화하고, 커밋해 버립니다.
뷰는 없어요.

뷰 이름을 반환하면,
DispatcherServlet이 ViewResolver로 그 이름을 실제 View로 바꿔, 렌더링하고요.

같은 데스크, 반환값에 따라 다른 출구입니다.
(두 길 어디서 예외가 터지든, HandlerExceptionResolver가 따로 받아
에러 응답으로 돌리는 건 — 오늘 흐름 바깥의 안전망이고요.)

`[SLIDE 03]`

그런데 눈치채셨나요.
우리가 오늘 내내 본 건, 그 컨트롤러의 **앞뒤 관문**뿐이었습니다.
정작 한가운데,
HandlerAdapter가 부르는 STEP 7의 그 Controller **안에서**
무슨 일이 벌어지는지는, 열어보지 않았어요.

요청 하나가 여기까지 왔을 때,
이 Controller 안에는, 대체 무엇이 들어가야 할까요.
다음 강의에서, 그 안을 엽니다.
