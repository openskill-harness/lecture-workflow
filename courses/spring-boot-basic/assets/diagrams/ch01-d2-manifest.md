# ch01 D2 다이어그램 렌더 매니페스트

원고: `courses/spring-boot-basic/manuscripts/ch01.md`
렌더 도구: `pub-d2-diagram` 스킬 방식 (D2 --layout elk --pad 40 → 모노톤 색상 치환 → PNG)
d2 버전: v0.7.1 (`C:\Program Files\D2\d2.exe`)
PNG 변환: rsvg-convert가 Windows 환경에 없어 headless Chromium(playwright, 이미 설치되어 있던 python 패키지) 스크린샷으로 SVG→PNG 변환. SVG 자체에는 SKILL.md의 sed 치환(0D32B2→222222, F7F8FE/EDF0FD/E3E9FD/EEF1F8→FFFFFF, streaks 패턴→FFFFFF)을 그대로 적용한 뒤 변환.

| 슬라이드 | 파일 경로 | D2 소스 요지 |
|---|---|---|
| Slide 5 (HTTP 요청-응답 구조) | `courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` | 브라우저 → HTTP 요청(GET /hello) → Spring Boot 서버 → HTTP 응답(200 OK + Hello) → 화면 표시. 원고 표기 경로 `assets/diagrams/ch01_http-request-response.d2`에 대응. |
| Slide 8 (웹 서버 vs WAS 역할 비교) | `courses/spring-boot-basic/assets/diagrams/ch01-slide08-was.png` | 브라우저의 정적 요청(이미지/CSS)은 웹 서버가 직접 응답, 동적 요청(로그인/등록)은 WAS가 DB 조회/저장 후 응답. 원고 표기 경로 `assets/diagrams/ch01_webserver-was-role.d2`에 대응. |
| Slide 10 (Spring Boot 내장 서버 시작 흐름) | `courses/spring-boot-basic/assets/diagrams/ch01-slide10-embedded.png` | 개발자 실행 → main()/SpringApplication.run → Spring 컨테이너 시작 → 내장 Tomcat 시작 → localhost:8080 요청 대기. 원고 표기 경로 `assets/diagrams/ch01_springboot-embedded-server.d2`에 대응. |
| Slide 15 (Web MVC 스타터 → 자동 설정) | `courses/spring-boot-basic/assets/diagrams/ch01-slide15-webmvc.png` | Web MVC 스타터 → Spring Boot 자동 설정(클래스패스 확인) → Spring MVC(요청 처리 구성) / 내장 Tomcat(서버 실행 구성) 분기. 슬라이드 내 D2 mini diagram(파일 경로 미표기, 원고 코드펜스 직접 정의).|
| Slide 20 (요청→코드 전체 흐름) | `courses/spring-boot-basic/assets/diagrams/ch01-slide20-flow.png` | 브라우저(/hello 요청) → 내장 Tomcat → Spring MVC 요청 매핑 → HelloController.hello() → 응답(Hello Spring Boot) → 브라우저. 원고 표기 경로 `assets/diagrams/ch01_request-to-controller.d2`에 대응. |

## 검증

- 5개 파일 모두 실제 생성 확인(용량 0바이트 아님): 52,344 ~ 81,598 bytes.
- 각 PNG를 시각 확인: 3색 모노톤(연회색 입력 사각형 #f0f0f0, 흰색 처리 사각형, 연회색 핵심 분기 육각형 #f8f8f8, 회색 DB 실린더 #eeeeee), 화살표는 검정 계열(#222222로 치환), `direction: right` 가로 흐름 유지. 원고 각 슬라이드의 노드/화살표 라벨과 1:1 일치.
- 렌더 실패 없음.

## 후속 참조용 경로 계약

스토리보드/ppt-preview/pptx repair 등 후속 산출물은 위 5개 경로를 그대로 참조하면 된다. 파일명 규칙: `ch01-slide{NN}-{요지}.png`.
