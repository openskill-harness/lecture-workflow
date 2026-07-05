# Research Brief — L03 「Controller와 Service의 책임 경계」

- course: spring-mvc-2026 (촬영강의, 1편=30분)
- lesson: L03 / THEORY / 7분
- learning_goal: Controller와 Service의 책임을 구분할 수 있다. (goal ref 1)
- 대상 학습자: Spring Boot로 CRUD API를 만들어 본 경험 있음. DispatcherServlet 내부는 모름.
- 서사 구조: content-rules (b) — 문제 상황 → 기존 방식이 깨지는 지점 → 분리 근거 → 핵심 구조 → 동작 흐름 → 흔한 오분류 → 언제 피할지
- 조사일: 2026-07-05
- 범위 한정: goal 1(책임 구분)에 필요한 재료만. Controller 구현 상세(goal 2)는 L04 소관이라 최소화.

> 표기 규칙: 각 주장에 `source:` 병기. 공식 문서·1차 자료가 없고 설계 원칙에서 파생한 추론/판단은
> `basis: reasoning` + `unverified: true`로 표시(통념을 사실로 기록하지 않기 위함). 원고에서 사실처럼 단정하지 말 것.

---

## 섹션 1 — 문제 상황: "이미 겪어봤을 코드 냄새" (Controller에 로직이 몰린 코드)

> 대상이 CRUD 경험자이므로, 낯선 개념이 아니라 자기 코드에서 본 증상으로 문을 연다.
> 이 섹션 증상들은 대부분 "설계 원칙의 위반 결과"로 서술해야 근거가 선다. 증상 자체를 통계처럼 말하지 말 것.

- **claim S1-1 (증상: 중복):** 같은 비즈니스 규칙(예: 재고 차감, 권한 확인)을 두 번째 진입점(다른 컨트롤러, 배치 작업, 스케줄러, 메시지 컨슈머)에서 또 써야 할 때, Controller에 로직이 있으면 규칙이 복붙되어 여러 곳에 흩어진다. 서비스 계층은 이 공통 로직을 한곳에 모아 "여러 종류의 인터페이스에 걸친 중복 구현"을 없애기 위한 것이다.
  - source: Martin Fowler, *Patterns of Enterprise Application Architecture* — "Service Layer" (martinfowler.com/eaaCatalog/serviceLayer.html). 정의: *"encapsulates the application's business logic, controlling transactions and coordinating responses"*; 여러 client 인터페이스가 공통 로직을 필요로 할 때 이를 한 계층으로 통합.

- **claim S1-2 (증상: 변경 파급):** HTTP 처리와 비즈니스 규칙이 한 메서드에 섞이면, 서로 다른 이유로 바뀌는 것들이 한 모듈에 묶여 한쪽 변경이 다른 쪽을 깨뜨린다. 이는 SRP 위반의 전형이다.
  - source: Robert C. Martin, "The Single Responsibility Principle" (2014, blog.cleancoder.com). 정의: *"A module should have one, and only one, reason to change."* / *"Gather together the things that change for the same reasons. Separate those things that change for different reasons."*

- **claim S1-3 (증상: 테스트 어려움):** 비즈니스 로직이 Controller 안에 있으면 그 로직을 검증하려고 HTTP/서블릿 계층(MockMvc, 웹 슬라이스)을 띄워야 한다. 로직이 Service의 평범한 객체에 있으면 웹 인프라 없이 POJO 단위 테스트로 검증할 수 있다.
  - basis: reasoning (관심사 분리의 직접 귀결). unverified: true
  - note: 원고에서 "테스트가 느리다/어렵다"를 단정하지 말고 "웹 계층을 띄워야 검증된다"는 구조적 사실로 서술. 정량 수치 금지(측정 출처 없음).

- **claim S1-4 (냄새의 이름):** 이런 "비대한 컨트롤러"는 오래된 안티패턴 통칭이 있으나(예: fat/bloated controller), 이는 커뮤니티 통칭이지 특정 1차 저작의 정식 정의가 아니다.
  - basis: folk terminology. unverified: true
  - note: 원고에서 "학계/공식 용어"인 것처럼 인용하지 말 것. 비유·구어로만 사용.

---

## 섹션 2 — 기존 방식이 깨지는 지점 (경계가 없을 때)

- **claim S2-1:** Controller가 요청 파싱·검증·비즈니스 규칙·트랜잭션·응답 조립을 전부 하면, "애플리케이션의 경계"가 웹 프레임워크에 묶여버린다. 웹이 아닌 진입점(테스트, 배치, 다른 프로토콜)에서 같은 유스케이스를 재사용할 수 없다.
  - source: Fowler, "Service Layer" (PoEAA) — *"A Service Layer defines an application's boundary and its set of available operations from the perspective of interfacing client layers."* (경계를 웹이 아니라 서비스가 정의해야 재사용 가능.)

- **claim S2-2 (분리의 원전 개념):** "관심사의 분리(separation of concerns)"는 서로 다른 측면을 독립적으로 다루기 위한 사고 정리 기법으로, Dijkstra가 명명했다. Controller/Service 분리는 이 원리의 웹 계층 적용이다.
  - source: Edsger W. Dijkstra, "On the role of scientific thought" (EWD447, 1974-08-30, cs.utexas.edu/~EWD). 원문: *"...what I sometimes have called 'the separation of concerns', ... the only available technique for effective ordering of one's thoughts."*
  - note: Dijkstra는 "프로그램 안의 concern"이 아니라 "설계자가 신경 쓸 concern"을 말했다는 맥락 주의(과잉 인용 금지).

---

## 섹션 3 — 분리의 근거: 관심사 분리 + "변경 이유" 분리

- **claim S3-1:** 계층을 나누는 기준은 "코드량"이 아니라 "무엇이 어떤 이유로 바뀌는가"다. HTTP 표현 형식이 바뀌는 이유(엔드포인트 경로, 상태코드, 응답 포맷)와 업무 규칙이 바뀌는 이유(정책, 계산, 트랜잭션 범위)는 서로 다른 이해관계자에서 온다 → 다른 모듈로.
  - source: Robert C. Martin, "The Single Responsibility Principle" (2014). *"This principle is about people."* — 변경 요구는 서로 다른 액터(이해관계자)에서 오고, 한 액터의 변경이 다른 액터가 의존하는 기능을 깨지 않도록 격리.

- **claim S3-2:** 서비스 계층은 얇게 유지하고 규칙을 도메인에 두는 것이 이상적이다. 반대로 엔티티를 게터/세터 껍데기로 두고 모든 로직을 서비스에 몰면 "빈혈 도메인 모델(Anemic Domain Model)" 안티패턴이 된다 — 즉 "Controller→Service로 옮기면 끝"이 아니라 로직이 어디에 살아야 하는지의 문제.
  - source: Martin Fowler, "AnemicDomainModel" (martinfowler.com/bliki). 인용: *"If all your logic is in services, you've robbed yourself blind."* / Eric Evans(DDD): 서비스 계층은 얇게, 업무 로직은 도메인 객체에.
  - note: L03의 목표는 Controller vs Service 경계이므로 도메인 계층 논쟁은 "깊게는 뒤에서"로 살짝만. 다만 "Service=만능 쓰레기통 아님"의 근거로 쓸 수 있음.

---

## 섹션 4 — 핵심 구조 (책임의 정의)

### 4A. Controller = HTTP 경계 어댑터

- **claim S4-1:** Spring MVC 컨트롤러(@Controller/@RestController)의 책임은 (1) 요청 매핑(@GetMapping 등), (2) 요청 입력 바인딩(@RequestParam/@RequestBody/@ModelAttribute/@RequestHeader 등), (3) 입력 검증 트리거, (4) 예외 처리(@ExceptionHandler), (5) 응답/상태코드 생성(뷰 이름, @ResponseBody, ResponseEntity)이다. 즉 HTTP와 애플리케이션 로직 사이의 어댑터/브리지.
  - source: Spring Framework Reference — Web MVC, "Annotated Controllers" (docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html). 컨트롤러는 base class 상속/인터페이스 구현 없이 유연한 메서드 시그니처를 가지며 "HTTP 요청과 비즈니스 로직 사이의 다리" 역할.
  - version: Spring Framework 6.x / Spring Boot 3.4.x 계열 문서 기준.

- **claim S4-2 (검증은 Controller 경계에서 트리거):** 입력 유효성 검증은 컨트롤러 메서드 인자에 @Valid/@Validated로 트리거되며, 위반 시 MethodArgumentNotValidException(또는 메서드 수준 검증 시 HandlerMethodValidationException)이 발생한다. 즉 "형식/제약 검증"은 HTTP 경계의 책임.
  - source: Spring Framework Reference — Web MVC, "Validation" (docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html). @Valid는 중첩 제약용이며 그 자체로 메서드 검증을 유발하지 않음; 앱은 두 예외를 모두 처리해야 함.
  - version_specific: Spring Framework 6.1부터 내장 메서드 검증을 쓰려면 컨트롤러의 클래스 레벨 @Validated를 제거해야 함 — 버전 특정 주장이므로 반드시 출처 표기.
  - note: "입력 형식 검증(경계)" vs "업무 규칙 검증(예: 잔액 부족)"은 다른 층. 후자는 Service. 이 구분을 오분류 섹션과 연결.

### 4B. Service = 유스케이스 + 트랜잭션 경계

- **claim S4-3:** 서비스 계층은 애플리케이션의 유스케이스(가용 오퍼레이션 집합)를 정의하고, 업무 로직을 캡슐화하며, 트랜잭션을 제어하고 응답을 조율한다.
  - source: Fowler, "Service Layer" (PoEAA) — *"It encapsulates the application's business logic, controlling transactions and coordinating responses in the implementation of its operations."*

- **claim S4-4 (트랜잭션 경계는 서비스):** Spring 팀은 @Transactional을 인터페이스나 컨트롤러가 아니라 구체 클래스의 서비스 계층 메서드에 붙일 것을 권장한다. 즉 트랜잭션 경계 = 유스케이스(서비스) 경계.
  - source: Spring Framework Reference — Data Access, "Using @Transactional" (docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html). 원문: *"The Spring team recommends that you annotate methods of concrete classes with the @Transactional annotation, rather than relying on annotated methods in interfaces..."* + 인터페이스 애노테이션은 (특히 AspectJ 모드에서) 조용히 무시될 수 있음.
  - note: 이 한 문장이 L03에서 "왜 트랜잭션을 Controller에 두면 안 되나"의 결정적 근거. 강조.

---

## 섹션 5 — 실제 동작 흐름 (한 요청이 두 책임을 지나는 경로)

- **claim S5-1 (책임 배턴 넘기기):** 전형적 흐름 — DispatcherServlet이 매핑 → Controller가 HTTP 요청을 파싱/바인딩/형식검증하여 입력 객체(주로 요청 DTO)로 변환 → Service의 유스케이스 메서드 호출(여기서 트랜잭션 시작) → Service가 도메인/리포지토리 조율하여 결과 반환 → Controller가 결과를 응답 표현(상태코드/DTO/ResponseEntity)으로 변환.
  - source(구성 근거): 컨트롤러 책임=Spring "Annotated Controllers"; 서비스 책임/트랜잭션=Fowler "Service Layer" + Spring "@Transactional"(위 인용들). 흐름 자체는 이 두 책임 정의의 합성.
  - note: L02(SIMULATION)에서 DispatcherServlet 내부 흐름을 이미 다루므로, L03은 "Controller↔Service 배턴 지점"만 확대. 중복 서술 피하기.

---

## 섹션 6 — 흔한 오분류 사례 (경계를 헷갈리는 지점)

- **claim S6-1 (오분류: 트랜잭션을 Controller에):** @Transactional을 컨트롤러에 붙이거나 컨트롤러에서 여러 리포지토리 호출을 이어 붙여 트랜잭션 경계를 웹 계층에 두는 것. 권장은 서비스 구체 클래스 메서드.
  - source: Spring Reference, "Using @Transactional" (위 claim S4-4와 동일 출처).

- **claim S6-2 (오분류: DTO↔Entity 혼용):** 요청/응답 전송용 객체(DTO)와 도메인/영속 엔티티를 구분 없이 하나로 쓰는 것. DTO는 프로세스 경계를 넘는 데이터 운반·직렬화 캡슐화가 목적이고, 도메인 객체와는 역할이 다르다(서버 측 assembler로 변환).
  - source: Martin Fowler, PoEAA — "Data Transfer Object" (martinfowler.com/eaaCatalog/dataTransferObject.html). 정의: *"An object that carries data between processes in order to reduce the number of method calls."* DTO↔도메인 변환은 assembler가 담당, 직렬화 관심사를 격리.
  - note: 엔티티를 그대로 @RequestBody/@ResponseBody에 노출하면 (a) 직렬화·검증 관심사가 도메인에 새고 (b) 과다/과소 노출·바인딩 취약점 위험. 후자의 보안적 주장은 별도 1차 출처 없이 단정 금지 → 아래 unverified.
  - basis(보안 위험 부연): reasoning. unverified: true

- **claim S6-3 (오분류: 업무 규칙 검증을 형식 검증과 혼동):** "@NotBlank/@Min 같은 형식·제약 검증"(경계=Controller의 @Valid)과 "잔액 부족·중복 예약 같은 업무 규칙 검증"(Service)을 같은 층으로 취급.
  - source: 경계 검증은 Spring "Validation" 문서(claim S4-2). 업무 규칙이 Service 소관인 근거는 Fowler "Service Layer"의 business logic 캡슐화(claim S4-3). (두 출처의 조합.)

---

## 섹션 7 — 언제 분리가 과한가 (얇은 CRUD)

- **claim S7-1:** 서비스가 리포지토리를 그대로 1:1 위임만 하는 순수 통과(pass-through) CRUD에서는, 아무 로직도 더하지 않는 서비스 계층이 상용구만 늘릴 수 있다는 실무 논쟁이 있다. 이는 커뮤니티 판단이며 단일 권위 1차 출처는 없다.
  - basis: community practice / judgment. unverified: true
  - note: "서비스를 없애라"로 단정 금지. "무엇을 위해 그 층이 있는지"를 되묻는 도구로만 제시.

- **claim S7-2 (판단 기준의 원칙적 근거):** 다만 "로직이 생기면 어디에 둘 것인가"의 답이 자동으로 "서비스"는 아니다 — 규칙을 서비스에만 몰면 빈혈 도메인이 되고, 그렇다고 컨트롤러에 두면 경계가 깨진다. 핵심 판단은 "이 변경은 어떤 이유(액터)로 오는가"(SRP)와 "재사용 경계가 필요한가"(Service Layer)다.
  - source: Fowler "AnemicDomainModel" + Martin "SRP" + Fowler "Service Layer" (앞 인용 재사용).
  - note: content-rules (b)의 "언제 쓰고 언제 피할지로 마무리" 고정 요건 충족 지점. 결론을 규칙 암기가 아니라 "판단 기준"으로 닫을 것.

---

## 중심 비유 후보 (원고/슬라이드용)

- **후보 A (추천): 식당의 홀 서버(웨이터) ↔ 주방(셰프).**
  - 매핑: Controller=웨이터(손님 말=HTTP를 받아 주문서로 변환, 메뉴에 있는 주문인지 형식 확인=@Valid, 음식 나가면 상태 전달=상태코드), Service=주방/셰프(실제 조리=업무 로직, 레시피 소유, 한 티켓은 통째로 완성되거나 취소=트랜잭션의 all-or-nothing). DTO=주문서(홀의 약식 표기) vs 엔티티=실제 식재료.
  - 강점: 트랜잭션 경계(주방 티켓의 전부-아니면-전무)와 DTO↔Entity 구분까지 한 비유로 커버. content-rules (b)의 "중심 비유 1개 유지"에 적합.
  - 비유가 깨지는 지점(직설 전환): 주방을 "데이터베이스"로 오해시키면 안 됨 — Service는 조리(유스케이스 조율)이고, 저장창고(Repository)는 별개. 이 지점에서 비유를 버리고 계층으로 직설.

- **후보 B (백업): 병원/호텔의 프런트데스크 ↔ 진료실/백오피스.**
  - 매핑: 프런트=접수·서식 확인·안내(경계), 진료/백오피스=실제 처리·기록·정책. 트랜잭션 비유는 A만큼 자연스럽지 않아 2순위.

---

## 반환 요약 (오케스트레이터용)

- 핵심 주장 수: 17개 (S1-1~S1-4, S2-1~2, S3-1~2, S4-1~4, S5-1, S6-1~3, S7-1~2)
- unverified 표시: 4개 (`unverified: true` 명시 — S1-3 테스트 어려움, S1-4 "fat controller" 통칭, S6-2 보안 위험 부연, S7-1 얇은 CRUD 판단). 모두 원고에서 사실 단정 금지 대상.
- 권위 1차 출처: Spring Framework Reference(컨트롤러/검증/@Transactional), Fowler PoEAA(Service Layer, DTO)+bliki(Anemic), R.C. Martin(SRP 2014), Dijkstra(EWD447, 1974).
- 주의점:
  1. version_specific 주장(claim S4-2: Spring 6.1 메서드 검증, 클래스 레벨 @Validated 제거)은 반드시 출처 병기 — manifest citation_required 대상.
  2. "fat controller" 등은 통칭일 뿐 공식 정의 아님(S1-4) — 학술 용어처럼 인용 금지.
  3. 테스트 어려움·보안 위험(S1-3, S6-2 부연)은 원칙 파생 추론 → 정량/단정 금지.
  4. 도메인 계층(Anemic) 논쟁은 L03 범위를 넘지 않게 "Service=만능 아님" 근거로만 얕게.
  5. L02(요청 흐름)와 서술 중복 주의 — L03은 Controller↔Service 배턴 지점만 확대.
