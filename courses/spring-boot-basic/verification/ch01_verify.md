# 원고 기술검증 — ch01 (2026-07-07)

> 드라이런: 대표 3슬라이드(5·8·10)만 검증. 나머지 23슬라이드는 미검증(범위 한정).
> `manuscript-verify` 스킬 산출물 — 원고는 수정하지 않는다. 수정은 사용자가 `manuscript-final`로.

## 요약
- 검증 주장: 9건 / 지지 9 / **반박 0** / 검증불가 0 / 미검증 W(나머지 23슬라이드)
- 조치 대상(반박) 없음. 다만 **Source 보완 필요 4건**(주장은 맞으나 인용 Source가 부실 — 조치 대상 아님, 아래 지지 섹션 참고).

## 반박 (조치 대상 — 사용자가 manuscript-final로 검토·수정)
| 슬라이드 | 주장 | 확신도 | 근거(URL) | 근거 인용 | Source 지지 | 수정안 |
|---|---|---|---|---|---|---|
| — | (없음) | — | — | — | — | — |

## 검증불가 (사람 판단 필요 — 오류 아님)
| 슬라이드 | 주장 | 사유 | 참고 |
|---|---|---|---|
| — | (없음) | — | — |

## 미검증 (드라이런 범위 한정 — 재실행 필요)
- Slide 1~4, 6~7, 9, 11~26 (총 23슬라이드): 이번 드라이런은 5·8·10만 검증. 전량 검증은 사용자 운영 시.

## 지지 (참고 — 근거로 확인됨. `Source 지지: ✗`는 "Source 보완 필요")
| 슬라이드 | 주장 | 확신도 | 근거(URL) | 근거 인용 | Source 지지 | (버전) 대상/근거 |
|---|---|---|---|---|---|---|
| 5 | HTTP는 클라이언트-서버가 요청·응답 메시지를 주고받는 통신 규칙이다 | high | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview | "HTTP is a protocol… a client-server protocol… requests and responses" | ✓ | — |
| 5 | `GET /hello`는 `/hello` 자원을 가져오려는 요청이다 | high | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET | "The GET HTTP method requests a representation of the specified resource." | ✗ (보완 필요) | — |
| 5 | `200 OK`는 요청 성공을 뜻한다 | high | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200 | "The HTTP 200 OK… indicates that a request has succeeded." | ✗ (보완 필요) | — |
| 8 | WAS는 요청마다 달라지는 비즈니스 로직을 실행하고 DB 등과 연동해 동적 응답을 만든다 | high | https://aws.amazon.com/compare/the-difference-between-web-server-and-application-server/ | "Application servers handle business logic to generate dynamic content by connecting with… databases." | ✗ (보완 필요) | — |
| 8 | WAS는 Web Application Server의 줄임말이다 | high | https://acronyms.thefreedictionary.com/Web+application+server | "WAS: Web application server" | ✗ (보완 필요) | — |
| 10 | Spring Boot 내장 서버는 앱에 포함돼 함께 시작되며 별도 Tomcat 설치 없이 요청을 받는다 | high | https://docs.spring.io/spring-boot/tutorial/first-application/index.html | "SpringApplication bootstraps our application, starting Spring, which… starts the auto-configured Tomcat web server." | ✓ | Boot 4.1.0 / docs.spring.io 현행 |
| 10 | `main()`이 `SpringApplication.run()`을 호출하면 앱이 시작된다 | high | https://docs.spring.io/spring-boot/tutorial/first-application/index.html | "Our main method delegates to… SpringApplication… by calling run." | ✓ | Boot 4.1.0 / docs.spring.io 현행 |
| 10 | 웹 의존성이 있으면 Spring Boot가 웹앱으로 판단하고 내장 Tomcat을 함께 시작한다 | high | https://docs.spring.io/spring-boot/tutorial/first-application/index.html | "…spring-boot-starter-webmvc added Tomcat…, the auto-configuration assumes that you are developing a web application…" | ✓ | Boot 4.1.0 / docs.spring.io 현행 |
| 10 | 기본 내장 서버는 Tomcat이다 | high | https://docs.spring.io/spring-boot/how-to/webserver.html | "the spring-boot-starter-web[mvc] includes Tomcat… you can use spring-boot-starter-jetty instead." | ✓ | Boot 4.1.0 / docs.spring.io 현행 |

## Source 보완 권고 (조치 아님 — 참고)
- Slide 5: 인용 Source(MDN HTTP **Overview**)는 HTTP 정의는 지지하나 GET 메서드·200 코드 세부는 별도 페이지다 — 해당 MDN Methods/GET·Status/200 페이지를 보조 Source로 추가 권장.
- Slide 8: 인용 Source(MDN HTTP Overview·Spring Boot 공식 문서)는 WAS 개념을 정의하지 않는다(MDN HTTP는 WAS 무관, Spring Boot 문서는 'WAS' 용어 미사용) — AWS/Oracle의 Application Server 정의 출처로 교체 권장. (참고: 'WAS'는 IBM WebSphere Application Server 제품 약어로도 쓰임.)
