# 1차시 원고: 서버 프로그램과 웹 애플리케이션 실행 환경 이해

## 차시 정보

- 과정명: 스프링 부트 기초
- 회차명: 서버 프로그램과 웹 애플리케이션 실행 환경 이해
- 차시 목표: 서버 프로그램의 역할, 웹 서버와 WAS의 차이, HTTP 요청-응답 구조, Spring Boot 내장 서버와 자동 설정 기반 실행 방식을 이해하고, 간단한 Spring Boot 애플리케이션 실행을 확인한다.
- NCS 연계: 개발환경 구축하기(`2001020211_23v6-1.1`, `2001020211_23v6-1.2`), 서버 프로그램 구현하기(`2001020211_23v6-3.1`)
- 예상 분량: 30분 이상 초안. 사용자가 추후 축약 가능하도록 풍부하게 구성한다.

## 사용 출처

- Spring Boot 공식 문서: https://docs.spring.io/spring-boot/index.html
- Spring Boot 4.1.0 시스템 요구사항: https://docs.spring.io/spring-boot/system-requirements.html
- Spring Boot 첫 애플리케이션 튜토리얼: https://docs.spring.io/spring-boot/tutorial/first-application/index.html
- Spring Tools 공식 페이지: https://spring.io/tools/
- MDN HTTP Overview: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
- eGovFrame 심플홈페이지 BackEnd 공식 GitHub: https://github.com/eGovFramework/egovframe-template-simple-backend

---

## Slide 1. 표지

**Screen**
- 제목: 서버 프로그램과 웹 애플리케이션 실행 환경 이해
- 부제: Spring Boot가 웹 애플리케이션을 실행하는 방식을 처음부터 보기
- 화면: 템플릿 표지 레이아웃 사용. 오른쪽 또는 하단에 웹 브라우저, 서버, Spring Boot 로고 느낌의 상징 이미지를 배치.

**Easy analogy**
- 웹 애플리케이션은 “손님이 주문하면 주방이 음식을 만들어 다시 내보내는 식당”과 같다. 브라우저는 손님, 서버 프로그램은 주방, HTTP는 주문서다.

**Practical case**
- 교육용 시나리오: 신입 개발자가 회사에 들어와 “로컬에서 서버를 켰는데 왜 브라우저에서 화면이 보이나요?”라고 묻는다. 이번 차시는 그 질문에 답하는 첫 출발점이다.

**Visual asset**
- GPT image prompt: `초보 개발자가 노트북 브라우저를 보고 있고, 그 브라우저가 작은 스프링부트 서버 상자와 선으로 연결된 교육용 일러스트, 단순한 선, 밝은 강의실 분위기, 글자 없이, 16:9 슬라이드 구도`

**Source**
- Spring Boot 공식 문서: 독립 실행 가능한 Spring 기반 애플리케이션을 만들고 실행할 수 있다는 설명.

**Narration**
- 안녕하세요. 이번 시간에는 스프링 부트 기초 과정의 첫 번째 주제인 서버 프로그램과 웹 애플리케이션 실행 환경을 살펴보겠습니다. 오늘은 아직 복잡한 코드를 많이 작성하지 않습니다. 대신 우리가 앞으로 만들 Spring Boot 애플리케이션이 어디에서 실행되고, 브라우저 요청을 어떻게 받고, 왜 별도의 Tomcat 설치 없이 바로 실행되는지를 큰 그림으로 이해하는 시간이 됩니다. 이 차시를 잘 잡아두면 뒤에서 Controller, REST API, JPA, 테스트를 배울 때 “내 코드가 실제 요청 흐름에서 어디에 놓이는지”가 훨씬 선명해집니다.

**Practice**
- 없음. 과정 도입.

**Assessment**
- 없음.

---

## Slide 2. 최신 이슈로 학습 열기: 공공 예제도 Spring Boot 기반으로 이동하고 있다

**Screen**
- 제목: 공공 예제도 API와 Spring Boot 실행 방식을 전제로 한다
- 짧은 문구:
  - Spring Boot 4.1.0은 Java 17 이상, Gradle 8.14 이상 또는 9.x를 지원한다.
  - 이 과정 실습 기준은 JDK 21, Spring Boot 4.1.0, Gradle, Spring Tools for Eclipse 5.2.0 이상이다.
  - eGovFrame 심플홈페이지 BackEnd 예제도 Spring Boot 기반 BackEnd/FrontEnd 분리 흐름을 보여준다.
  - 기존 JSP 뷰 중심에서 BackEnd와 FrontEnd를 분리한 예시를 제공한다.
- 화면: 좌측에는 “과거: JSP/WAR/서버 배포” 이미지, 우측에는 “현재: API BackEnd + FrontEnd 분리 + Spring Boot” 이미지.

**Easy analogy**
- 예전에는 식당 홀이랑 주방이 한 건물 안에 꽉 붙어 있는 느낌이었다면, 요즘은 주문 앱, 주방, 배달 시스템이 역할을 나누어 연결되는 느낌이다.

**Practical case**
- 실무사례형 시나리오: 공공 프로젝트에 투입된 개발자가 기존 JSP 화면 중심 프로젝트만 경험했다. 그런데 새 예제 저장소를 보니 BackEnd와 FrontEnd가 분리되어 있고, BackEnd는 Spring Boot로 실행된다. 이 개발자는 “서버 프로그램이 화면을 직접 그리는 것”과 “API로 데이터를 제공하는 것”의 차이를 먼저 이해해야 한다.

**Visual asset**
- GPT image prompt: `좌우 분할 교육용 일러스트. 왼쪽은 JSP 페이지와 무거운 외부 서버 랙으로 이루어진 낡은 모놀리식 웹 애플리케이션, 오른쪽은 스프링부트로 만든 현대적 API 백엔드가 별도의 프런트엔드 브라우저와 연결된 모습, 깔끔한 기업 교육 자료 스타일, 글자·라벨 없이`

**Source**
- eGovFrame 심플홈페이지 BackEnd GitHub: https://github.com/eGovFramework/egovframe-template-simple-backend
- Spring Boot 4.1.0 시스템 요구사항: https://docs.spring.io/spring-boot/system-requirements.html
- Spring Tools 공식 페이지: https://spring.io/tools/

**Narration**
- 본격적인 이론으로 들어가기 전에 최신 흐름을 하나 보겠습니다. 2026년 현재 Spring Boot 공식 문서의 4.1.0 기준을 보면 Java 17 이상에서 동작하고, Gradle은 8.14 이상 또는 9.x를 명시적으로 지원합니다. 이 과정은 장기 지원 버전으로 많이 쓰이는 JDK 21, Spring Boot 4.1.0, Gradle, Spring Tools for Eclipse 5.2.0 이상을 실습 기준으로 잡겠습니다. 동시에 전자정부 표준프레임워크의 심플홈페이지 BackEnd 예제처럼 공공 예제에서도 BackEnd와 FrontEnd를 분리하고 Spring Boot 기반 BackEnd를 제공하는 흐름을 볼 수 있습니다. 여기서 중요한 메시지는 하나입니다. 요즘 서버 프로그램은 단순히 HTML 화면만 만들어 주는 역할에 머물지 않습니다. 브라우저나 프론트엔드 앱이 요청을 보내면, 서버는 API로 데이터를 응답하고, 그 과정에서 HTTP, Controller, 내장 서버, 실행 환경이 모두 함께 작동합니다. 그래서 우리는 첫 시간에 “서버 프로그램이 무엇이고, Spring Boot는 그 서버 프로그램을 어떻게 실행시키는가”를 먼저 보려는 것입니다.

**Practice**
- 없음. 최신 이슈 기반 도입.

**Assessment**
- 없음.

---

## Slide 3. 오늘의 학습 목표

**Screen**
- 제목: 오늘은 “요청이 들어와 응답이 나가기까지”를 본다
- 학습목표 3개:
  1. 서버 프로그램의 역할을 설명할 수 있다.
  2. 웹 서버와 웹 애플리케이션 서버의 차이를 구분할 수 있다.
  3. Spring Boot 애플리케이션이 내장 서버와 자동 설정으로 실행되는 흐름을 설명할 수 있다.
- 화면: 세 개의 목표를 아이콘 중심으로 배치. 서버 아이콘, HTTP 화살표, Spring Boot 실행 버튼.

**Easy analogy**
- 오늘 목표는 자동차 정비사가 되기 전에 “운전자가 시동을 걸면 엔진, 변속기, 바퀴가 어떤 순서로 움직이는지”를 보는 것이다.

**Practical case**
- 교육용 시나리오: 실무에서 장애가 났을 때 “브라우저 문제인지, 웹 서버 문제인지, 애플리케이션 코드 문제인지”를 구분하지 못하면 원인 분석이 느려진다. 오늘 내용은 나중에 장애를 분리해서 보는 기초가 된다.

**Visual asset**
- GPT image prompt: `스프링부트 입문 강의의 3단계 시각 로드맵: 서버의 역할, HTTP 요청과 응답, 내장 서버 실행 버튼. 깔끔한 아이콘, 밝은 배경, 글자 없이`

**Source**
- `[과정개요서] 스프링 부트 기초_v3(완료).hwpx`의 1차시 학습내용.

**Narration**
- 이번 차시의 핵심은 요청과 응답입니다. 사용자가 브라우저에서 주소를 입력하거나 버튼을 클릭하면 요청이 만들어집니다. 그 요청은 네트워크를 지나 서버 프로그램에 도착하고, 서버 프로그램은 필요한 처리를 한 뒤 응답을 돌려줍니다. 오늘은 이 흐름을 아주 쉬운 수준에서 잡아보겠습니다. 첫째, 서버 프로그램이 하는 일을 이해합니다. 둘째, 웹 서버와 웹 애플리케이션 서버가 어떤 점에서 다른지 봅니다. 셋째, Spring Boot에서는 왜 Tomcat을 따로 설치하지 않아도 애플리케이션이 실행되는지 확인합니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 4. 서버 프로그램은 요청을 받아 결과를 돌려주는 일꾼이다

**Screen**
- 제목: 서버 프로그램의 기본 역할
- 짧은 문구:
  - 요청을 받는다
  - 필요한 처리를 한다
  - 응답을 돌려준다
- 화면: 손님 -> 주문서 -> 주방 -> 완성된 음식 흐름의 큰 일러스트.

**Easy analogy**
- 서버 프로그램은 식당 주방과 같다. 손님이 “김치찌개 주세요”라고 주문하면, 주방은 주문을 해석하고 음식을 만들어 다시 내보낸다.

**Practical case**
- 교육용 시나리오: 회사의 사내 게시판에서 사용자가 “공지사항 목록”을 클릭한다. 서버 프로그램은 목록 요청을 받고, 데이터베이스에서 공지사항을 찾아, 브라우저가 이해할 수 있는 응답으로 돌려준다.

**Visual asset**
- GPT image prompt: `서버 프로그램을 식당 주방에 비유한 그림: 손님이 주문서를 건네고, 주방이 그것을 처리하고, 종업원이 요리를 내온다. 교육용 플랫 일러스트, 글자 없이, 16:9`

**Source**
- MDN HTTP Overview: HTTP는 웹에서 데이터를 교환하는 기반이며 클라이언트-서버 프로토콜이라고 설명.

**Narration**
- 서버 프로그램을 아주 단순하게 말하면, 요청을 받고 응답을 돌려주는 프로그램입니다. 여기서 요청은 사용자가 원하는 일입니다. 예를 들어 “공지사항 목록을 보여 주세요”, “회원 정보를 저장해 주세요”, “Todo 하나를 등록해 주세요” 같은 것이 요청입니다. 서버 프로그램은 이 요청을 해석하고, 필요한 로직을 실행하고, 데이터가 필요하면 데이터베이스와도 이야기한 뒤, 결과를 응답으로 돌려줍니다. 이 구조를 식당에 비유하면 쉽습니다. 손님은 브라우저입니다. 주문서는 HTTP 요청입니다. 주방은 서버 프로그램입니다. 완성된 음식은 HTTP 응답입니다. 앞으로 우리가 작성할 Controller, Service, Repository 코드는 모두 이 주방 안에서 각자 맡은 일을 하는 구성원이라고 보면 됩니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 5. HTTP는 브라우저와 서버가 주고받는 약속이다

**Screen**
- 제목: HTTP 요청과 응답
- 짧은 문구:
  - Request: 브라우저가 서버에 보내는 메시지
  - Response: 서버가 브라우저에 돌려주는 메시지
- 화면: 브라우저 -> GET /hello -> 서버 -> 200 OK + Hello 흐름.

**Easy analogy**
- HTTP는 택배 운송장 양식과 같다. 보내는 사람, 받는 사람, 주소, 요청 내용이 일정한 규칙으로 적혀 있어야 배송이 가능하다.

**Practical case**
- 실무사례형 시나리오: 개발자가 API가 안 된다고 말할 때, 실제로는 서버가 죽은 것이 아니라 요청 경로가 `/hello`가 아니라 `/helo`로 잘못 들어간 경우가 많다. HTTP 요청의 경로와 응답 상태 코드를 볼 줄 알면 이런 문제를 빨리 찾는다.

**Visual asset**
- D2 diagram: `outputs/03_시각자산/diagrams/ch01_http-request-response.d2`

```d2
direction: right

classes: {
  input: {
    shape: rectangle
    style: { fill: "#f0f0f0"; stroke: "#111111"; stroke-width: 1; border-radius: 8; font-size: 24 }
  }
  component: {
    shape: rectangle
    style: { fill: white; stroke: "#111111"; stroke-width: 1; border-radius: 8; font-size: 24 }
  }
  key: {
    shape: hexagon
    style: { fill: "#f8f8f8"; stroke: "#111111"; stroke-width: 2; font-size: 24 }
  }
}

browser: "브라우저" { class: input }
request: "HTTP 요청\nGET /hello" { class: key }
server: "Spring Boot 서버" { class: component }
response: "HTTP 응답\n200 OK + Hello" { class: key }
screen: "화면에 결과 표시" { class: input }

browser -> request: "주소 입력"
request -> server: "요청 전달"
server -> response: "처리 결과"
response -> screen: "응답 표시"
```

**Source**
- MDN HTTP Overview: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

**Narration**
- 브라우저와 서버가 아무 규칙 없이 대화하면 서로 알아들을 수 없습니다. 그래서 웹에서는 HTTP라는 약속을 사용합니다. HTTP 요청은 브라우저가 서버에 보내는 메시지입니다. 예를 들어 `GET /hello`는 `/hello`라는 자원을 가져오고 싶다는 뜻입니다. 서버는 요청을 처리한 뒤 응답을 돌려줍니다. 응답에는 성공 여부를 나타내는 상태 코드가 들어갑니다. 대표적으로 `200 OK`는 요청이 성공했다는 뜻입니다. 이 흐름을 택배 운송장으로 생각해도 좋습니다. 주소가 잘못되면 택배가 엉뚱한 곳으로 갑니다. HTTP 요청에서도 경로, 메서드, 헤더, 본문 같은 정보가 맞아야 서버가 원하는 처리를 할 수 있습니다.

**Practice**
- 없음. 후반 실습에서 브라우저로 `http://localhost:8080/hello` 호출 예정.

**Assessment**
- 없음.

---

## Slide 6. HTTP 메시지는 사람이 읽을 수 있는 구조를 가진다

**Screen**
- 제목: 요청과 응답은 구조가 있다
- 화면:
  - 왼쪽: 요청 예시 `GET /hello HTTP/1.1`
  - 오른쪽: 응답 예시 `HTTP/1.1 200 OK`
  - 하단: Method, Path, Status Code 라벨.

**Easy analogy**
- HTTP 메시지는 회사의 결재 양식과 같다. 제목, 요청 내용, 첨부 내용, 승인 결과가 정해진 칸에 들어간다.

**Practical case**
- 실무사례형 시나리오: 프론트엔드 개발자가 “서버에서 오류가 나요”라고 말한다. 백엔드 개발자는 브라우저 개발자 도구의 Network 탭을 열어 요청 경로, 메서드, 응답 상태 코드를 먼저 확인한다.

**Visual asset**
- GPT image prompt: `HTTP 요청서와 HTTP 응답서를 단순한 서식 문서 두 장으로 나란히 보여주는 교육용 분할 레이아웃. 메서드·경로·상태 영역이 색으로 강조됨. 깔끔한 강의 슬라이드 스타일, 실제 글자는 넣지 않고 형태만`
- Code block for slide:

```http
GET /hello HTTP/1.1
Host: localhost:8080
```

```http
HTTP/1.1 200 OK
Content-Type: text/plain

Hello Spring Boot
```

**Source**
- MDN HTTP Overview, HTTP Messages section.

**Narration**
- HTTP 메시지는 생각보다 사람이 읽기 쉬운 구조로 되어 있습니다. 요청에는 어떤 방식으로 요청하는지, 어느 경로를 요청하는지, 추가 정보가 무엇인지가 들어갑니다. 응답에는 요청이 성공했는지 실패했는지를 나타내는 상태 코드와 실제 응답 내용이 들어갑니다. 이 구조를 알면 나중에 REST API를 만들 때 훨씬 편합니다. 예를 들어 GET은 조회, POST는 등록처럼 역할을 나누어 생각할 수 있습니다. 오늘은 아주 깊게 들어가지는 않지만, “브라우저와 서버는 요청 메시지와 응답 메시지를 주고받는다”는 그림만은 꼭 기억해 주세요.

**Practice**
- 브라우저 개발자 도구 Network 탭 캡처 후보. 1차시 PPT에는 개념 캡처 또는 후반 실습 캡처로 활용.

**Assessment**
- 없음.

---

## Slide 7. 웹 서버는 정적 파일을 빠르게 전달하는 문지기다

**Screen**
- 제목: 웹 서버의 대표 역할
- 짧은 문구:
  - HTML, CSS, JS, 이미지 전달
  - 정적 파일 처리에 강함
  - 필요하면 WAS로 요청 전달
- 화면: 웹 서버가 파일 캐비닛에서 HTML/CSS/이미지를 꺼내 브라우저로 전달하는 그림.

**Easy analogy**
- 웹 서버는 매장 입구의 안내 직원과 같다. 준비된 안내 책자나 메뉴판은 바로 꺼내 주고, 복잡한 상담은 담당자에게 넘긴다.

**Practical case**
- 실무사례형 시나리오: 회사 홈페이지의 로고 이미지, CSS 파일, JavaScript 파일은 매번 복잡한 비즈니스 로직을 거칠 필요가 없다. 이런 정적 리소스는 웹 서버가 빠르게 전달하는 것이 효율적이다.

**Visual asset**
- GPT image prompt: `웹 서버를 안내 데스크 직원에 비유해 HTML·CSS·자바스크립트·이미지 같은 정적 파일을 브라우저에 건네주는 그림, 단순한 기술 은유, 플랫 벡터, 읽을 수 있는 글자 없이`

**Source**
- MDN HTTP Overview: 클라이언트가 서버에 요청하고 서버가 문서나 리소스를 제공한다는 설명.

**Narration**
- 이제 웹 서버와 웹 애플리케이션 서버의 차이를 보겠습니다. 먼저 웹 서버는 정적 파일을 전달하는 역할에 강합니다. 정적 파일은 이미 만들어져 있는 파일입니다. HTML, CSS, JavaScript, 이미지 파일처럼 요청이 들어올 때마다 복잡한 계산을 하지 않아도 되는 리소스입니다. 웹 서버를 매장 입구 안내 직원으로 생각하면 쉽습니다. 손님이 메뉴판을 달라고 하면 바로 꺼내 줍니다. 하지만 손님이 “내 주문 상태를 확인해 주세요”처럼 개인별 처리가 필요한 요청을 하면, 안내 직원은 담당 부서나 주방으로 요청을 넘겨야 합니다. 그때 등장하는 것이 웹 애플리케이션 서버입니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 8. WAS는 실행 중인 애플리케이션 로직을 처리한다

**Screen**
- 제목: WAS는 동적인 요청을 처리한다
- 짧은 문구:
  - 로그인
  - 게시글 등록
  - 주문 처리
  - 데이터베이스 연동
- 화면: WAS 안에 Controller, Service, Repository, DB 연결이 있는 그림.

**Easy analogy**
- WAS는 식당 주방장과 조리팀이다. 손님마다 다른 주문을 받고, 상황에 맞게 요리해서 결과를 만든다.

**Practical case**
- 실무사례형 시나리오: “내 장바구니 보기” 요청은 사용자마다 결과가 다르다. 단순 파일 전달이 아니라 로그인 사용자 확인, 장바구니 데이터 조회, 응답 생성이 필요하므로 애플리케이션 로직이 실행되어야 한다.

**Visual asset**
- D2 diagram: `outputs/03_시각자산/diagrams/ch01_webserver-was-role.d2`

```d2
direction: right

classes: {
  input: { shape: rectangle; style: { fill: "#f0f0f0"; stroke: "#111111"; border-radius: 8; font-size: 23 } }
  component: { shape: rectangle; style: { fill: white; stroke: "#111111"; border-radius: 8; font-size: 23 } }
  key: { shape: hexagon; style: { fill: "#f8f8f8"; stroke: "#111111"; stroke-width: 2; font-size: 23 } }
  db: { shape: cylinder; style: { fill: "#eeeeee"; stroke: "#111111"; font-size: 23 } }
}

browser: "브라우저" { class: input }
web: "웹 서버\n정적 파일" { class: component }
was: "WAS\n애플리케이션 로직" { class: key }
db: "DB" { class: db }

browser -> web: "이미지/CSS 요청"
browser -> was: "로그인/등록 요청"
was -> db: "데이터 조회/저장"
db -> was: "결과"
was -> browser: "동적 응답"
web -> browser: "정적 응답"
```

**Source**
- MDN HTTP Overview, Spring Boot 공식 문서.

**Narration**
- WAS는 Web Application Server의 줄임말입니다. 이름 그대로 웹 애플리케이션이 실행되는 서버입니다. 여기서는 단순히 파일을 전달하는 수준을 넘어 애플리케이션 코드가 실제로 동작합니다. 로그인, 게시글 등록, 주문 처리, 데이터베이스 조회처럼 요청마다 결과가 달라지는 일을 처리합니다. Spring Boot로 만든 웹 애플리케이션도 결국 이런 애플리케이션 로직을 실행합니다. 다만 Spring Boot에서는 내장 Tomcat 같은 서버가 애플리케이션 안에 함께 들어와 실행되기 때문에, 초보자 입장에서는 “서버 설치”보다 “애플리케이션 실행”으로 시작할 수 있습니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 9. 과거 방식: 서버를 따로 설치하고 애플리케이션을 올렸다

**Screen**
- 제목: 전통적인 배포 흐름
- 짧은 문구:
  - Tomcat 설치
  - WAR 파일 배포
  - 서버 설정 관리
- 화면: 개발자가 WAR 박스를 외부 Tomcat 서버 랙에 올리는 장면.

**Easy analogy**
- 예전 방식은 공연장을 먼저 빌리고, 그 무대 위에 공연팀을 올리는 방식과 비슷하다.

**Practical case**
- 실무사례형 시나리오: 예전 프로젝트에서는 개발자가 로컬 Tomcat 버전, 서버 설정, 배포 경로가 달라 실행 오류를 겪는 일이 잦았다. 같은 코드라도 누구의 PC에서는 되고, 누구의 PC에서는 안 되는 문제가 생겼다.

**Visual asset**
- GPT image prompt: `개발자가 WAR 패키지 상자를 들고 별도의 커다란 톰캣 서버 랙으로 옮기는, 예전 방식 배포를 은유한 그림. 약간 유머러스하되 전문적인 분위기, 읽을 수 있는 글자 없이`

**Source**
- Spring Boot 공식 문서: Spring Boot는 `java -jar` 실행 또는 전통적인 WAR 배포를 모두 언급한다.

**Narration**
- Spring Boot를 제대로 이해하려면 과거 방식도 잠깐 볼 필요가 있습니다. 전통적인 Java 웹 애플리케이션에서는 Tomcat 같은 서버를 따로 설치하고, 우리가 만든 애플리케이션을 WAR 파일로 만들어 그 서버에 배포하는 흐름이 많았습니다. 이 방식은 여전히 사용할 수 있지만, 초보자가 처음 배우기에는 설정할 것이 많습니다. Tomcat 버전, 포트, 배포 경로, 서버 설정이 맞아야 합니다. 그래서 개발 환경이 조금만 달라도 “내 PC에서는 되는데 다른 PC에서는 안 된다”는 문제가 생기기 쉽습니다. Spring Boot는 이런 시작 장벽을 크게 낮춰 줍니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 10. Spring Boot 방식: 애플리케이션이 서버를 품고 실행된다

**Screen**
- 제목: Spring Boot는 내장 서버로 바로 실행된다
- 짧은 문구:
  - 애플리케이션 실행
  - 내장 Tomcat 시작
  - 요청 처리 준비 완료
- 화면: 하나의 Spring Boot 상자 안에 Java 코드와 Tomcat 엔진이 함께 들어 있는 그림.

**Easy analogy**
- Spring Boot 방식은 푸드트럭과 같다. 주방을 따로 빌리지 않고, 주방을 차 안에 싣고 바로 영업을 시작한다.

**Practical case**
- 실무사례형 시나리오: 팀원이 새 프로젝트를 받아서 `Run As > Spring Boot App`을 눌렀더니 바로 8080 포트로 서버가 뜬다. 별도 Tomcat 설치 없이 API 확인이 가능해져 온보딩 시간이 줄어든다.

**Visual asset**
- D2 diagram: `outputs/03_시각자산/diagrams/ch01_springboot-embedded-server.d2`

```d2
direction: right

classes: {
  input: { shape: rectangle; style: { fill: "#f0f0f0"; stroke: "#111111"; border-radius: 8; font-size: 23 } }
  component: { shape: rectangle; style: { fill: white; stroke: "#111111"; border-radius: 8; font-size: 23 } }
  key: { shape: hexagon; style: { fill: "#f8f8f8"; stroke: "#111111"; stroke-width: 2; font-size: 23 } }
}

developer: "개발자" { class: input }
main: "main()\nSpringApplication.run" { class: key }
spring: "Spring 컨테이너 시작" { class: component }
tomcat: "내장 Tomcat 시작" { class: key }
ready: "localhost:8080\n요청 대기" { class: input }

developer -> main: "실행"
main -> spring: "애플리케이션 부트스트랩"
spring -> tomcat: "웹 서버 자동 시작"
tomcat -> ready: "서버 준비 완료"
```

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼: `SpringApplication.run`이 Spring을 시작하고 자동 설정된 Tomcat 웹 서버를 시작한다는 설명.

**Narration**
- Spring Boot의 매우 중요한 특징은 내장 서버입니다. Spring Boot 애플리케이션을 실행하면, 우리가 만든 코드만 실행되는 것이 아닙니다. `main()` 메서드가 `SpringApplication.run()`을 호출하고, 이 과정에서 Spring 애플리케이션이 시작됩니다. 웹 애플리케이션에 필요한 의존성이 들어 있으면 Spring Boot가 웹 애플리케이션이라고 판단하고 내장 Tomcat을 함께 시작합니다. 그래서 개발자는 외부 Tomcat을 따로 설치하지 않아도 `localhost:8080`으로 접속해서 결과를 확인할 수 있습니다. 방금 비유한 것처럼, 공연장을 따로 빌리는 방식이 아니라 푸드트럭처럼 실행에 필요한 환경을 함께 가지고 움직이는 느낌입니다.

**Practice**
- 후반 실습에서 STS4에서 애플리케이션을 실행하고 콘솔 로그의 Tomcat started 메시지를 캡처한다.

**Assessment**
- 없음.

---

## Slide 11. 자동 설정은 “상황을 보고 기본 준비를 해주는 도우미”다

**Screen**
- 제목: Auto-configuration은 기본 설정을 자동으로 잡아준다
- 짧은 문구:
  - Web MVC starter 있음
  - Spring MVC/Tomcat 설정 추정
  - 개발자는 핵심 코드에 집중
- 화면: Spring Boot가 프로젝트 가방 안의 의존성을 보고 필요한 장비를 자동으로 꺼내는 그림.

**Easy analogy**
- 자동 설정은 캠핑 초보를 돕는 캠핑 매니저와 같다. 텐트가 있으면 팩과 망치를 챙기고, 버너가 있으면 가스도 챙겨 준다.

**Practical case**
- 실무사례형 시나리오: 과거에는 XML 설정이나 서버 설정을 많이 만져야 했지만, Spring Boot 4 프로젝트에서는 `spring-boot-starter-webmvc`를 추가하면 웹 애플리케이션에 필요한 기본 구성이 자동으로 잡힌다. 덕분에 신입 개발자가 처음부터 복잡한 설정 파일에 파묻히지 않는다.

**Visual asset**
- GPT image prompt: `스프링부트를 친절한 설정 도우미로 표현한 그림: 프로젝트 배낭 안을 들여다보며 웹 서버·MVC 라우팅·기본 설정 도구를 알아서 챙겨 주는 모습, 깔끔한 기술 만화 스타일, 글자 없이`

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼: `@EnableAutoConfiguration`은 추가된 jar 의존성을 기준으로 Spring 구성을 추정하고, `spring-boot-starter-webmvc`가 Tomcat과 Spring MVC를 추가하면 웹 애플리케이션으로 설정한다고 설명.

**Narration**
- Spring Boot를 쓰면 설정이 완전히 사라지는 것은 아닙니다. 하지만 기본 설정의 부담이 크게 줄어듭니다. 자동 설정은 프로젝트의 의존성과 상황을 보고 “이 프로젝트는 웹 애플리케이션이겠구나”, “그러면 Spring MVC와 Tomcat 구성이 필요하겠구나”처럼 기본 구성을 잡아주는 기능입니다. 이것은 초보자에게 특히 중요합니다. 처음부터 모든 설정을 직접 작성하려고 하면, 서버 프로그램을 만들기도 전에 설정 파일에서 길을 잃을 수 있습니다. Spring Boot는 일단 동작하는 기본값을 제공하고, 개발자가 필요할 때 그 기본값을 바꿀 수 있게 해줍니다.

**Practice**
- 후반 실습에서 `spring-boot-starter-webmvc`가 들어가면 웹 서버가 실행되는 흐름을 설명한다.

**Assessment**
- 없음.

---

## Slide 12. 실무 중간 사례: “서버 설치부터 하라”는 말이 줄어든다

**Screen**
- 제목: 실무에서는 실행 환경 단순화가 큰 장점이다
- 화면: 두 개발자 비교.
  - A: 외부 서버 설치, 포트 설정, 배포 오류로 지친 모습
  - B: Spring Boot App 실행 후 브라우저 확인
- 화면 글자는 최소화: “설정 먼저” vs “실행 먼저”

**Easy analogy**
- 조립식 가구를 살 때, 나사와 공구를 따로 찾는 것보다 필요한 공구가 함께 들어 있으면 시작이 훨씬 쉽다.

**Practical case**
- 교육용 시나리오: 신입 개발자 민수는 기존 Java 웹 프로젝트를 처음 실행하면서 Tomcat 설치, 서버 런타임 등록, WAR 배포 경로 때문에 반나절을 보냈다. 옆자리 개발자 지연은 Spring Boot 프로젝트를 열고 `Run As > Spring Boot App`으로 바로 실행해 보라고 알려준다. 민수는 먼저 서버가 뜨는 경험을 하고, 이후에 요청 흐름과 코드를 차근차근 배운다.

**Visual asset**
- Comic panel prompt: `프로그래밍 강의용 2컷 만화. 1컷: 초보 개발자가 외부 서버 설치 대화상자와 설정 서류에 파묻혀 압도된 모습. 2컷: 동료가 간단한 스프링부트 실행 버튼을 가리키자 개발자가 안도하는 모습. 깔끔한 선화, 글자·말풍선 없이`

**Source**
- Spring Tools 공식 페이지: Spring Initializr와 Spring Guides 통합으로 빠르게 실행 가능한 Spring Boot 앱을 시작할 수 있다는 설명.
- Spring Boot 공식 문서: Spring Boot 애플리케이션은 `java -jar`로 시작할 수 있다는 설명.

**Narration**
- 여기서 실무적인 장점을 하나 짚고 넘어가겠습니다. Spring Boot를 쓰면 개발자가 서버 설치와 배포 설정부터 배우지 않아도, 먼저 애플리케이션을 실행해 볼 수 있습니다. 물론 운영 환경에서는 여전히 배포와 설정이 중요합니다. 하지만 학습과 개발 초기 단계에서는 “일단 실행된다”는 경험이 매우 중요합니다. 실행이 되어야 요청을 보내 보고, 로그를 보고, Controller 코드를 고쳐 보고, 다시 결과를 확인할 수 있습니다. Spring Tools와 Spring Boot는 이 시작 경험을 단순하게 만들어 줍니다. 그래서 우리는 오늘 STS4에서 직접 애플리케이션을 실행해 보고, 브라우저에서 응답을 확인할 예정입니다.

**Practice**
- 없음. 실습 전 동기 부여.

**Assessment**
- 없음.

---

## Slide 13. 실습 준비: 오늘 만들 가장 작은 서버 프로그램

**Screen**
- 제목: `/hello`에 응답하는 가장 작은 서버
- 화면:
  - 프로젝트명: `ch01-hello-server`
  - 주소: `http://localhost:8080/hello`
  - 응답: `Hello Spring Boot`
- 하단에는 STS4 실행 화면 캡처 자리 표시.

**Easy analogy**
- 처음 식당을 열 때 모든 메뉴를 만들 필요는 없다. 먼저 “물 한 잔 주세요”라는 주문에 응답해 보는 것부터 시작한다.

**Practical case**
- 실무사례형 시나리오: 새 서버 프로젝트를 만들면 가장 먼저 하는 일 중 하나가 health check나 hello endpoint를 만들어 “서버가 살아 있는지” 확인하는 것이다.

**Visual asset**
- Screenshot plan:
  1. STS4 시작 화면 또는 workspace 화면.
  2. Spring Starter Project 생성 화면.
  3. 프로젝트 구조.
  4. `HelloController.java`.
  5. Console의 Started 로그.
  6. 브라우저 `localhost:8080/hello` 응답.

**Source**
- Spring Tools 공식 페이지: Spring Tools for Eclipse, Spring Initializr 통합.
- Spring Boot 첫 애플리케이션 튜토리얼: 작은 Hello World 웹 애플리케이션 예시.

**Narration**
- 이제 실습으로 넘어가겠습니다. 오늘 만들 코드는 아주 작습니다. `/hello`라는 주소로 요청이 들어오면 `Hello Spring Boot`라는 문자열을 응답하는 서버 프로그램입니다. 이 작은 예제가 중요한 이유는, 앞으로 만들 모든 API가 같은 구조를 확장하기 때문입니다. 주소를 정하고, 요청을 받고, 메서드를 실행하고, 응답을 돌려주는 흐름은 동일합니다. 오늘은 복잡한 데이터베이스나 화면은 사용하지 않습니다. 대신 서버가 켜지고, 브라우저 요청이 들어오고, 응답이 나가는 전체 흐름을 눈으로 확인하는 데 집중합니다.

**Practice**
- STS4에서 Spring Starter Project 생성.
- Dependencies: Spring Web MVC starter.
- 실습 기준: JDK 21, Spring Boot 4.1.0, Gradle, Spring Tools for Eclipse 5.2.0 이상.

**Assessment**
- 없음.

---

## Slide 14. 실습 1: Spring Starter Project 만들기

**Screen**
- 제목: Spring Starter Project 생성
- 화면:
  - STS4 New > Spring Starter Project 화면 캡처
  - Group: `com.example`
  - Artifact: `ch01-hello-server`
  - Name: `ch01-hello-server`
  - Package: `com.example.ch01`
- 짧은 문구: “웹 의존성을 추가하면 서버 실행 준비가 쉬워진다”

**Easy analogy**
- 프로젝트 생성은 빈 가게를 계약하는 단계다. 어떤 업종인지 정하면 필요한 기본 설비를 함께 준비한다.

**Practical case**
- 실무사례형 시나리오: 팀에서 새 API 서버를 만들 때 처음부터 폴더와 빌드 파일을 손으로 모두 만들기보다, Spring Initializr로 기본 구조를 만들고 팀 규칙에 맞게 조정하는 경우가 많다.

**Visual asset**
- Screenshot plan: STS4 Spring Starter Project wizard.
- GPT support image prompt: `작은 서버 가게를 열기 전에 재료를 고르듯 프로젝트 옵션을 선택하는 장면을 단순한 시각적 은유로 표현, 깔끔한 교육용 스타일, 글자 없이`

**Source**
- Spring Tools 공식 페이지: Spring Initializr 통합으로 빠르게 Spring Boot 앱을 시작할 수 있다는 설명.

**Narration**
- STS4에서 Spring Starter Project를 만들어 보겠습니다. 여기서 Group, Artifact, Name, Package 같은 항목을 입력합니다. 지금은 이름 자체보다 “프로젝트 기본 구조를 자동으로 만든다”는 점이 중요합니다. 우리가 MVC 웹 애플리케이션을 만들 것이기 때문에 Web MVC 스타터를 추가합니다. 이 스타터가 들어가면 Spring Boot는 이 프로젝트가 웹 요청을 받을 애플리케이션이라고 판단할 수 있습니다. 나중에 자동 설정과 내장 서버가 이 정보를 활용합니다.

**Practice**
- STS4 메뉴: `File > New > Spring Starter Project`
- 입력 예:
  - Name: `ch01-hello-server`
  - Type: Gradle - Groovy
  - Spring Boot: 4.1.0
  - Java: 21
  - Packaging: Jar
  - Package: `com.example.ch01`

**Assessment**
- 없음.

---

## Slide 15. 실습 2: Web MVC 스타터 추가하기

**Screen**
- 제목: Web MVC 스타터는 웹 서버 실행의 힌트가 된다
- 화면:
  - Dependencies 선택 화면 캡처
  - Spring Web MVC 선택 표시
  - 오른쪽에는 “Tomcat + Spring MVC 자동 구성” 미니 아이콘

**Easy analogy**
- “라면 가게”라고 업종을 정하면 냄비, 버너, 물, 그릇 같은 기본 도구가 준비되는 것과 같다.

**Practical case**
- 실무사례형 시나리오: 신입 개발자가 “왜 아무 설정도 안 했는데 8080 포트가 열리나요?”라고 묻는다. 선배 개발자는 “Web MVC 스타터가 들어가 있어서 Boot가 웹 애플리케이션으로 보고 내장 서버를 준비한 것”이라고 설명한다.

**Visual asset**
- D2 mini diagram:

```d2
direction: right

classes: {
  input: { shape: rectangle; style: { fill: "#f0f0f0"; stroke: "#111111"; border-radius: 8; font-size: 23 } }
  component: { shape: rectangle; style: { fill: white; stroke: "#111111"; border-radius: 8; font-size: 23 } }
  key: { shape: hexagon; style: { fill: "#f8f8f8"; stroke: "#111111"; stroke-width: 2; font-size: 23 } }
}

dep: "Web MVC\n스타터" { class: input }
boot: "Spring Boot\n자동 설정" { class: key }
mvc: "Spring MVC" { class: component }
tomcat: "내장 Tomcat" { class: component }

dep -> boot: "클래스패스 확인"
boot -> mvc: "요청 처리 구성"
boot -> tomcat: "서버 실행 구성"
```

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼: `spring-boot-starter-webmvc`가 Tomcat과 Spring MVC를 추가하고, 자동 설정이 웹 애플리케이션으로 설정한다는 설명.

**Narration**
- 의존성은 Spring Boot에게 중요한 힌트를 줍니다. Spring Boot 4.1.0 기준의 MVC 웹 실습에서는 `spring-boot-starter-webmvc`를 사용합니다. 이 스타터가 들어가면 프로젝트 안에 웹 요청을 처리하는 데 필요한 Spring MVC와 내장 Tomcat 관련 라이브러리들이 들어옵니다. Spring Boot는 클래스패스에 어떤 라이브러리가 있는지 보고 기본 설정을 추정합니다. 그래서 Web MVC 스타터가 있으면 “이 프로젝트는 MVC 웹 애플리케이션이겠구나”라고 판단하고 Spring MVC와 내장 Tomcat 구성을 준비합니다. 이 지점이 Spring Boot의 시작 경험을 편하게 만드는 핵심입니다. 개발자는 처음부터 서버 설정 파일을 모두 작성하지 않고, Controller 코드부터 작성해 볼 수 있습니다.

**Practice**
- Dependencies에서 `Spring Web MVC` 선택.
- 프로젝트 생성 완료 후 `build.gradle`에 `spring-boot-starter-webmvc`가 들어갔는지 확인하는 캡처를 추가한다.

**Assessment**
- 없음.

---

## Slide 16. 실습 3: HelloController 작성하기

**Screen**
- 제목: 요청을 받을 Controller 만들기
- 화면:
  - `HelloController.java` 코드 크게 표시
  - 핵심 강조: `@RestController`, `@GetMapping("/hello")`

**Easy analogy**
- Controller는 식당의 주문 접수 담당자다. “/hello 주문”이 들어오면 정해진 응답을 준비한다.

**Practical case**
- 실무사례형 시나리오: API 서버에서 Controller는 외부 요청이 처음 들어오는 창구다. 팀에서는 URL 규칙을 정하고, 각 Controller가 어떤 요청을 받을지 명확히 관리한다.

**Visual asset**
- Code block for PPT:

```java
package com.example.ch01;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot";
    }
}
```

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼: `@RestController`, `@RequestMapping`이 웹 요청 처리와 라우팅 정보를 제공한다는 설명.

**Narration**
- 이제 Controller를 작성합니다. `@RestController`는 이 클래스가 웹 요청을 처리하는 Controller 역할을 한다는 표시입니다. `@GetMapping("/hello")`는 `/hello` 경로로 들어오는 GET 요청을 이 메서드가 처리한다는 뜻입니다. 메서드는 문자열을 반환합니다. `@RestController`를 사용하면 이 문자열은 별도 화면 템플릿으로 가지 않고, 응답 본문에 바로 담겨 브라우저로 전달됩니다. 지금은 코드가 아주 짧지만, 이 구조가 뒤에서 REST API를 만들 때 계속 반복됩니다.

**Practice**
- STS4에서 `src/main/java/com/example/ch01/HelloController.java` 생성.
- 위 코드 입력.
- 저장.

**Assessment**
- 없음.

---

## Slide 17. 실습 4: main 메서드가 애플리케이션을 시작한다

**Screen**
- 제목: 시작점은 `main()`이다
- 화면:
  - `Ch01HelloServerApplication.java` 코드
  - `SpringApplication.run(...)` 강조
  - 오른쪽에 실행 버튼 아이콘

**Easy analogy**
- `main()`은 가게의 전원 스위치다. 스위치를 켜면 조명, 냉장고, 주방 장비가 차례로 켜진다.

**Practical case**
- 실무사례형 시나리오: 운영 장애 분석 중 서버가 시작되지 않는다면, 개발자는 먼저 애플리케이션 시작 로그와 `main()`에서 어떤 설정이 로딩되는지 확인한다.

**Visual asset**
- Code block:

```java
package com.example.ch01;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Ch01HelloServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(Ch01HelloServerApplication.class, args);
    }
}
```

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼: `main` 메서드가 `SpringApplication.run`을 호출하고, Spring과 자동 설정된 Tomcat 웹 서버를 시작한다는 설명.

**Narration**
- Java 애플리케이션의 시작점은 `main()` 메서드입니다. Spring Boot 애플리케이션도 마찬가지입니다. 다만 `main()` 안에서 직접 서버를 하나하나 만드는 것이 아니라 `SpringApplication.run()`을 호출합니다. 이 호출이 Spring Boot 애플리케이션 시작의 핵심입니다. Spring 컨테이너가 시작되고, 필요한 Bean이 준비되고, 웹 애플리케이션이면 내장 Tomcat도 시작됩니다. 그래서 이 코드는 짧지만 매우 많은 일이 뒤에서 일어나게 만드는 출발점입니다.

**Practice**
- 생성된 `Ch01HelloServerApplication.java` 확인.
- `@SpringBootApplication`과 `SpringApplication.run` 위치를 강조한 캡처.

**Assessment**
- 없음.

---

## Slide 18. 실습 5: Spring Boot App으로 실행하기

**Screen**
- 제목: 실행하면 내장 서버가 열린다
- 화면:
  - STS4 `Run As > Spring Boot App` 캡처
  - Console의 Started 로그 캡처
  - `Tomcat started on port 8080`에 하이라이트

**Easy analogy**
- 푸드트럭 시동을 걸면 주방이 열리고 주문 받을 준비가 되는 것과 같다.

**Practical case**
- 실무사례형 시나리오: 팀원이 “서버 실행했어요?”라고 물으면, 단순히 IDE 실행 버튼을 눌렀다는 뜻이 아니라 포트가 열리고 요청을 받을 준비가 되었는지 확인했다는 뜻이다.

**Visual asset**
- Screenshot plan:
  - Project 우클릭 > Run As > Spring Boot App.
  - Console 로그.
  - 포트 8080 표시.

**Source**
- Spring Tools 공식 페이지: Spring Tools for Eclipse 제공.
- Spring Boot 실행 예시와 STS4의 Spring Boot App 실행 흐름.

**Narration**
- 이제 애플리케이션을 실행해 보겠습니다. STS4에서는 프로젝트를 우클릭하고 `Run As > Spring Boot App`을 선택할 수 있습니다. 실행하면 콘솔에 Spring Boot 배너와 여러 로그가 출력됩니다. 여기서 꼭 확인할 것은 애플리케이션이 시작되었다는 메시지와 포트 번호입니다. 기본적으로 8080 포트를 사용합니다. 포트가 열렸다는 것은 브라우저나 API 도구가 이 애플리케이션에 요청을 보낼 수 있다는 뜻입니다. 즉, 지금 우리 PC 안에서 작은 서버 프로그램이 실행 중인 상태입니다.

**Practice**
- STS4에서 실행.
- Console 로그 캡처.
- 오류 발생 시 체크:
  - 이미 8080 포트를 쓰는 프로그램이 있는지 확인.
  - Java 버전이 프로젝트 설정과 맞는지 확인.
  - Controller 패키지가 애플리케이션 패키지 하위인지 확인.

**Assessment**
- 없음.

---

## Slide 19. 실습 6: 브라우저에서 `/hello` 호출하기

**Screen**
- 제목: 브라우저가 요청하고 서버가 응답한다
- 화면:
  - 주소창: `http://localhost:8080/hello`
  - 화면 결과: `Hello Spring Boot`
  - 옆에 요청-응답 미니 화살표

**Easy analogy**
- 손님이 “물 주세요”라고 말하자, 주방이 “여기 있습니다”라고 바로 응답한 상황이다.

**Practical case**
- 실무사례형 시나리오: 개발자는 새 API를 만들면 브라우저, curl, Postman 같은 도구로 요청을 보내 실제 응답이 오는지 확인한다. 이 작은 확인이 배포 전 문제를 줄인다.

**Visual asset**
- Screenshot plan:
  - Chrome/Edge 주소창에 `localhost:8080/hello`.
  - 결과 화면 캡처.
  - 선택 사항: 개발자 도구 Network 탭에서 Status 200 확인.

**Source**
- MDN HTTP Overview: 클라이언트가 요청을 보내고 서버가 응답을 제공한다는 설명.

**Narration**
- 이제 브라우저에서 `http://localhost:8080/hello`로 접속합니다. 브라우저는 이 주소를 바탕으로 HTTP 요청을 만듭니다. 요청은 우리 PC에서 실행 중인 Spring Boot 애플리케이션으로 전달됩니다. Spring Boot는 `/hello` 경로를 처리할 Controller 메서드를 찾고, 우리가 작성한 `hello()` 메서드를 실행합니다. 그 결과 문자열인 `Hello Spring Boot`가 응답으로 돌아옵니다. 화면에 이 문장이 보이면 오늘의 가장 작은 서버 프로그램은 성공적으로 동작한 것입니다.

**Practice**
- 브라우저에서 URL 입력.
- 결과 캡처.
- Network 탭에서 request URL, status code 확인 캡처 후보.

**Assessment**
- 없음.

---

## Slide 20. 요청이 코드까지 도착하는 전체 그림

**Screen**
- 제목: `/hello` 요청은 어디로 흘러갈까?
- 화면: Browser -> Embedded Tomcat -> Spring MVC -> HelloController -> Response 흐름도.

**Easy analogy**
- 택배가 아파트 경비실, 동, 층, 집 주소를 거쳐 정확한 사람에게 도착하는 흐름과 같다.

**Practical case**
- 실무사례형 시나리오: API가 404로 실패하면 개발자는 “서버는 켜졌는가?”, “경로가 맞는가?”, “Controller 매핑이 있는가?”를 순서대로 확인한다. 흐름을 알면 어디서 끊겼는지 찾기 쉽다.

**Visual asset**
- D2 diagram: `outputs/03_시각자산/diagrams/ch01_request-to-controller.d2`

```d2
direction: right

classes: {
  input: { shape: rectangle; style: { fill: "#f0f0f0"; stroke: "#111111"; border-radius: 8; font-size: 22 } }
  component: { shape: rectangle; style: { fill: white; stroke: "#111111"; border-radius: 8; font-size: 22 } }
  key: { shape: hexagon; style: { fill: "#f8f8f8"; stroke: "#111111"; stroke-width: 2; font-size: 22 } }
}

browser: "브라우저\n/hello 요청" { class: input }
tomcat: "내장 Tomcat" { class: key }
springmvc: "Spring MVC\n요청 매핑" { class: component }
controller: "HelloController\nhello()" { class: key }
response: "응답\nHello Spring Boot" { class: input }

browser -> tomcat: "HTTP 요청"
tomcat -> springmvc: "요청 전달"
springmvc -> controller: "경로에 맞는 메서드 찾기"
controller -> response: "문자열 반환"
response -> browser: "HTTP 응답"
```

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼: `@RequestMapping`은 HTTP 요청 경로를 메서드에 매핑하고, `@RestController`는 결과 문자열을 호출자에게 직접 렌더링한다는 설명.

**Narration**
- 방금 실행한 결과를 전체 흐름으로 다시 정리해 보겠습니다. 브라우저에서 `/hello` 요청이 만들어집니다. 이 요청은 내장 Tomcat이 받습니다. Tomcat은 웹 서버 역할을 하면서 요청을 Spring MVC 쪽으로 넘깁니다. Spring MVC는 등록된 Controller와 매핑 정보를 보고 `/hello`를 처리할 메서드를 찾습니다. 우리가 만든 `HelloController`의 `hello()` 메서드가 실행되고, 반환된 문자열이 HTTP 응답으로 브라우저에 돌아갑니다. 이 그림은 앞으로 계속 확장됩니다. 나중에는 Controller 뒤에 Service가 붙고, Repository와 데이터베이스가 붙습니다. 하지만 출발점은 오늘 본 이 흐름입니다.

**Practice**
- 없음. 실습 결과 정리.

**Assessment**
- 없음.

---

## Slide 21. 적용하기: 어디에서 문제가 났는지 찾아보기

**Screen**
- 제목: 서버가 안 보일 때 어디부터 볼까?
- 화면: 세 가지 상황 카드
  1. 서버 실행 실패
  2. 404 Not Found
  3. 응답 문자열이 예상과 다름
- 하단: “실행 로그 -> URL -> Controller 코드” 순서.

**Easy analogy**
- 택배가 안 왔을 때 물류센터 출발 여부, 주소, 수령인을 차례대로 확인하는 것과 같다.

**Practical case**
- 실무사례형 시나리오: 신입 개발자가 `/hello`가 안 된다고 말한다. 선배는 먼저 콘솔에서 서버가 Started 되었는지 보고, 다음으로 주소가 `localhost:8080/hello`인지 확인하고, 마지막으로 Controller의 매핑 경로가 `/hello`인지 확인한다.

**Visual asset**
- GPT image prompt: `초보 백엔드 개발자를 위한 문제 해결 체크리스트 일러스트: 서버 로그, 브라우저 주소창, 컨트롤러 코드 세 지점이 화살표로 이어진 그림, 깔끔한 강의 슬라이드 스타일, 글자 없이`

**Source**
- MDN HTTP Overview, Spring Boot 첫 애플리케이션 튜토리얼.

**Narration**
- 이제 적용 문제를 하나 생각해 보겠습니다. 브라우저에서 `/hello`를 입력했는데 결과가 나오지 않는다면 어디부터 봐야 할까요? 첫째, 서버가 실제로 실행되었는지 봅니다. 콘솔에 Started 메시지가 없거나 오류가 있다면 요청을 받을 수 없습니다. 둘째, URL이 맞는지 봅니다. 포트가 다르거나 경로가 틀리면 원하는 Controller까지 요청이 가지 않습니다. 셋째, Controller 코드의 매핑이 맞는지 봅니다. `@GetMapping("/hello")`가 아니라 다른 경로로 되어 있으면 404가 날 수 있습니다. 이렇게 흐름을 알고 있으면 문제를 감으로 찾지 않고 순서대로 좁혀갈 수 있습니다.

**Practice**
- 실습 중 일부러 URL을 `/helo`로 잘못 입력해 404 또는 오류 화면을 확인하고, 다시 `/hello`로 수정해 정상 응답을 확인하는 캡처를 추가할 수 있다.

**Assessment**
- 없음.

---

## Slide 22. 정리: 오늘 배운 핵심 흐름

**Screen**
- 제목: 브라우저 요청은 서버 프로그램의 코드로 이어진다
- 화면:
  - 브라우저
  - HTTP 요청
  - 내장 Tomcat
  - Spring MVC
  - Controller
  - HTTP 응답
- 하단 짧은 문장: “Spring Boot는 이 실행 환경을 빠르게 시작하게 해준다.”

**Easy analogy**
- 오늘 배운 것은 식당 전체 운영 동선이다. 손님, 주문서, 안내 직원, 주방, 완성된 음식의 관계를 본 것이다.

**Practical case**
- 실무사례형 시나리오: 앞으로 API 개발을 맡으면 단순히 메서드 하나를 작성하는 것이 아니라, 그 메서드가 HTTP 요청 흐름에서 어떤 위치에 있는지 이해하고 작성해야 한다.

**Visual asset**
- Reuse D2: `ch01_request-to-controller.d2`를 단순화하거나 정리용 아이콘 흐름도로 재사용.

**Source**
- 본 차시 전체 출처 종합.

**Narration**
- 오늘 내용을 정리하겠습니다. 서버 프로그램은 요청을 받아 처리하고 응답을 돌려주는 프로그램입니다. HTTP는 브라우저와 서버가 메시지를 주고받기 위한 약속입니다. 웹 서버는 정적 리소스 전달에 강하고, WAS는 동적인 애플리케이션 로직을 처리합니다. Spring Boot는 내장 서버와 자동 설정을 통해 웹 애플리케이션을 빠르게 실행할 수 있게 해줍니다. 그리고 우리는 `/hello` 요청을 받아 문자열을 응답하는 가장 작은 서버 프로그램을 실행해 보았습니다. 다음 차시부터는 이 흐름이 어떤 원리로 Controller 메서드까지 연결되는지 더 깊게 들어가겠습니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 23. 평가하기 1: 사지선다형

**Screen**
- 제목: 평가하기
- 문제: Spring Boot 웹 애플리케이션을 실행했을 때 내장 Tomcat이 시작되는 이유로 가장 적절한 것은?
- 보기:
  1. 브라우저가 자동으로 Tomcat을 설치하기 때문이다.
  2. Web MVC 스타터와 자동 설정을 바탕으로 Spring Boot가 웹 애플리케이션 실행 환경을 구성하기 때문이다.
  3. 모든 Java 프로그램은 기본적으로 8080 포트를 열기 때문이다.
  4. Controller 클래스가 데이터베이스를 자동으로 생성하기 때문이다.

**Easy analogy**
- 의존성이 “이 프로젝트는 웹 가게입니다”라고 알려 주면, Spring Boot가 기본 주방 장비를 준비하는 상황이다.

**Practical case**
- 실무사례형 시나리오: 새 프로젝트가 실행되자마자 8080 포트가 열렸다면, 개발자는 Web MVC 스타터와 자동 설정을 먼저 떠올릴 수 있어야 한다.

**Visual asset**
- 화면은 문제 중심. 우측에 작은 아이콘: 의존성 -> 자동 설정 -> Tomcat.

**Source**
- Spring Boot 첫 애플리케이션 튜토리얼의 auto-configuration 및 Tomcat 시작 설명.

**Narration**
- 첫 번째 평가는 Spring Boot의 내장 서버 실행 이유를 확인하는 문제입니다. 정답은 2번입니다. Spring Boot는 프로젝트의 의존성과 자동 설정을 바탕으로 필요한 실행 환경을 구성합니다. Web MVC 스타터가 있으면 웹 애플리케이션으로 판단하고, 내장 Tomcat과 Spring MVC 구성을 준비할 수 있습니다. 1번처럼 브라우저가 Tomcat을 설치하는 것이 아니고, 3번처럼 모든 Java 프로그램이 8080 포트를 여는 것도 아닙니다. 4번은 데이터베이스와 관련된 내용이라 이번 질문의 핵심과 다릅니다.

**Practice**
- 없음.

**Assessment**
- 유형: 사지선다형
- 정답: 2
- 난이도: 보통
- 해설: Web MVC 스타터와 자동 설정을 기반으로 Spring Boot가 웹 실행 환경과 내장 서버를 구성한다.
- 관련학습보기: Slide 10, Slide 11, Slide 15

---

## Slide 24. 평가하기 2: 진위형

**Screen**
- 제목: 평가하기
- 문제: HTTP에서 브라우저가 서버에 보내는 메시지를 요청(Request), 서버가 브라우저로 돌려주는 메시지를 응답(Response)이라고 한다. O/X

**Easy analogy**
- 손님의 주문서가 요청이고, 주방에서 나온 음식이 응답이다.

**Practical case**
- 실무사례형 시나리오: API 오류 분석의 첫 단계는 “어떤 요청을 보냈고 어떤 응답을 받았는가”를 확인하는 것이다.

**Visual asset**
- 간단한 요청/응답 화살표 이미지.

**Source**
- MDN HTTP Overview.

**Narration**
- 두 번째 문제는 HTTP의 기본 구조를 확인합니다. 정답은 O입니다. HTTP에서 클라이언트, 보통은 브라우저가 서버에 보내는 메시지를 요청이라고 합니다. 서버가 그 요청에 대해 돌려주는 메시지를 응답이라고 합니다. 앞으로 REST API를 만들 때 우리는 계속 요청과 응답을 설계하게 됩니다.

**Practice**
- 없음.

**Assessment**
- 유형: 진위형
- 정답: O
- 난이도: 쉬움
- 해설: HTTP는 클라이언트가 요청을 보내고 서버가 응답을 제공하는 클라이언트-서버 구조를 가진다.
- 관련학습보기: Slide 5, Slide 6

---

## Slide 25. 평가하기 3: 진위형

**Screen**
- 제목: 평가하기
- 문제: 웹 서버는 항상 데이터베이스 조회와 비즈니스 로직 실행을 직접 담당하며, WAS는 정적 파일만 전달한다. O/X

**Easy analogy**
- 안내 직원이 모든 요리를 직접 만드는 것이 아니라, 복잡한 주문은 주방으로 넘긴다.

**Practical case**
- 실무사례형 시나리오: 정적 파일 전달과 동적 비즈니스 처리를 구분하면 장애나 성능 문제를 분석할 때 어느 계층을 먼저 봐야 하는지 판단하기 쉽다.

**Visual asset**
- 웹 서버와 WAS 역할 비교 미니 다이어그램.

**Source**
- MDN HTTP Overview, Spring Boot 공식 문서.

**Narration**
- 세 번째 문제의 정답은 X입니다. 일반적으로 웹 서버는 정적 리소스 전달에 강하고, WAS는 애플리케이션 로직을 실행하는 역할을 담당합니다. 실제 시스템에서는 구성 방식에 따라 역할이 섞일 수 있지만, 기초 개념을 배울 때는 정적 리소스 중심의 웹 서버와 동적 로직 중심의 WAS를 구분해서 이해하는 것이 좋습니다.

**Practice**
- 없음.

**Assessment**
- 유형: 진위형
- 정답: X
- 난이도: 보통
- 해설: 웹 서버는 정적 리소스 처리에 강하고, WAS는 동적 애플리케이션 로직 처리에 초점을 둔다.
- 관련학습보기: Slide 7, Slide 8

---

## Slide 26. 참고자료

**Screen**
- 제목: 참고자료
- 목록:
  - Spring Boot 공식 문서
  - Spring Boot 첫 애플리케이션 튜토리얼
  - Spring Tools 공식 페이지
  - MDN HTTP Overview
  - eGovFrame 심플홈페이지 BackEnd GitHub

**Easy analogy**
- 참고자료는 수업 뒤에 다시 찾아볼 수 있는 지도와 같다.

**Practical case**
- 실무사례형 시나리오: 실무 개발자는 기억에만 의존하지 않고 공식 문서를 확인하며 버전과 설정을 검증한다.

**Visual asset**
- 문서, GitHub, 브라우저 아이콘을 단정하게 배치.

**Source**
- https://docs.spring.io/spring-boot/index.html
- https://docs.spring.io/spring-boot/tutorial/first-application/index.html
- https://spring.io/tools/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
- https://github.com/eGovFramework/egovframe-template-simple-backend

**Narration**
- 마지막으로 이번 차시에서 활용한 참고자료입니다. Spring Boot 공식 문서는 Spring Boot가 어떤 목표와 특징을 가지는지 확인하는 데 사용했습니다. Spring Boot 4.1.0 시스템 요구사항 문서는 JDK 21과 Gradle 기준을 정하는 근거로 사용했습니다. 첫 애플리케이션 튜토리얼은 `spring-boot-starter-webmvc`, `@RestController`, 요청 매핑, `SpringApplication.run`, 내장 Tomcat 시작 흐름을 설명하는 근거로 사용했습니다. Spring Tools 공식 페이지는 Spring Tools for Eclipse와 Spring Initializr 기반 실습 환경을 설명하는 데 사용했습니다. MDN HTTP Overview는 HTTP 요청과 응답의 기본 구조를 설명하는 근거로 사용했습니다. eGovFrame GitHub 예제는 공공 예제에서도 Spring Boot 기반 BackEnd 흐름을 확인할 수 있는 최신 실무 연결 자료로 활용했습니다.

**Practice**
- 없음.

**Assessment**
- 없음.
