# 디자인 패턴 실습 소스 v3 (강의 최종본 · AI 프렌들리 포함)

4일(32시간) 강의의 **최종 강의 순서**에 맞춘 실습 소스입니다. `v3`가 최신 정식본입니다.

> - 실습 원칙: 모든 예제는 **초보자용**으로 쉽게, **한 예제 = 한 주제에만 집중**.
> - `v2` 대비 변경: **목 객체 뒤에 「AI 프렌들리·병렬개발」 예제(`ex12`) 추가**, 그에 맞춰 팩토리 계열을 뒤로 재배치.
> - 번호 체계: 예제 번호는 `ex01`~`ex16`(차시 번호 ch01~ch16과 1:1 대응). 구버전 문서의 ex00~ex15에서 +1씩 이동.
> - **커맨드 + 팩토리(패턴 결합)는 강의 제외** (원본 코드는 원본 레포 `design-pattern/src/ex10`에 보존).

---

## 전체 목차 (강의 순서)

| 번호 | 패턴 / 주제 | 실습(일차) | 원본 |
|:---:|------|:---:|:---:|
| `ex01` | 다형성·동적바인딩 기초 | 1일 오전(도입) | 기존 ex00 |
| `ex02` | **SOLID (OCP)** 🆕 | 1일 오전 | 신규 |
| `ex03` | 전략 (Strategy) | 1일 오전 | 기존 ex01 |
| `ex04` | 프록시 (Proxy) | 1일 오후 | 기존 ex02 |
| `ex05` | 어댑터 (Adapter) | 1일 오후 | 기존 ex03 |
| `ex06` | 싱글톤 (Singleton) | 2일 오전 | 기존 ex04 |
| `ex07` | 템플릿 메서드 (Template Method) | 2일 오전 | 기존 ex05 |
| `ex08` | 위임 (Delegation) | 2일 오후 | 기존 ex09 |
| `ex09` | 옵저버 (Observer) | 2일 오후 | 기존 ex08 |
| `ex10` | 데코레이터 (Decorator) | 3일 오전 | 기존 ex06 (Notifier) |
| `ex11` | 목 객체 (Mock Object) | 3일 오전~오후 | 기존 mock |
| `ex12` | **AI 프렌들리·병렬개발 (Mock 활용)** 🆕 | 3일 오후 | 신규 |
| `ex13` | 팩토리 - Simple Factory | 4일 오전 | 기존 ex07 |
| `ex14` | **팩토리 메서드 (Factory Method)** 🆕 | 4일 오전 | 신규 |
| `ex15` | **리팩토링 before → after** 🆕 | 4일 오후 | 신규 |
| `ex16` | **리플렉션 — 패턴의 한계를 넘어** (DispatcherServlet 축소판) 🆕 | 4일 오후(피날레) | 신규 |

> ~~커맨드 + 팩토리~~ 는 강의 제외 (원본 레포 `ex10`에 보존).

---

## 4일 시간표

| 일차 | 오전 (4h) | 오후 (4h) |
|---|---|---|
| **1일** | 개요·SOLID + 전략 (`ex01·02·03`) | 프록시 + 어댑터 (`ex04·05`) |
| **2일** | 싱글톤 + 템플릿 (`ex06·07`) | 위임 + 옵저버 (`ex08·09`) |
| **3일** | 데코레이터 + 목 객체 도입 (`ex10·11`) | 목 객체 심화 + AI 프렌들리·병렬개발 (`ex11·12`) |
| **4일** | 팩토리 Simple + 팩토리 메서드 (`ex13·14`) | 리팩토링 + 리플렉션 피날레 (`ex15·16`) |

---

## 신규로 추가한 예제

### ex02 · SOLID (OCP)
`도형`(추상) → `사각형`, `원`이 각자 `넓이()`를 책임진다. 새 도형이 생겨도 `App`은 수정하지 않는다(개방-폐쇄 원칙). if-else '나쁜 예'를 주석으로 대비.

### ex12 · AI 프렌들리·병렬개발 (Mock 활용) 🆕
목 객체를 "왜 쓰는가"의 실전 편. 결제 시스템으로 **인터페이스 우선 → 단위 테스트 → 병렬 개발** 흐름을 보여준다.
- `PayGate`(계약) → `MockPayGate`(가짜, 개발용) / `RealPayGate`(진짜, 나중 완성)
- `OrderService`(주문 로직)는 계약에만 의존 → 백엔드 없이 Mock으로 먼저 개발
- `OrderServiceTest` — **라이브러리 없는 순수 Java `main()`** 로 주문 로직만 콕 집어 검증 (JUnit·설치·인터넷 불필요)
- `App` — Mock을 Real로 갈아끼우기만 하면 끝 (OrderService 안 고침)
- **AI 프렌들리 포인트**: 명확한 인터페이스(스펙) + 단위 테스트(자동 검증) + 작은 조각 분리 = AI에게 맡기기 쉬운 코드

### ex14 · 팩토리 메서드 (Factory Method)
`DBFactory`(추상)의 `생성()`을 `MariaDBFactory`, `OracleDBFactory`가 각자 구현. `ex13`(Simple Factory)의 if-else가 사라진다.

### ex15 · 리팩토링 (before → after)
커피 공장 if-else(`before`) → `Map` 등록(`after`)으로 재설계. "지저분한 코드 → 패턴 적용" 실습.

### ex16 · 리플렉션 — 패턴의 한계를 넘어 (ref01 → ref02 → ref03)
- `ref01`: URI→메서드 if-else 매핑의 한계(OCP 위반)
- `ref02`: `@RequestMapping` + 리플렉션으로 메서드 자동 탐색·호출
- `ref03`: 패키지 스캔 + `@Controller` 자동 등록 = **DispatcherServlet 축소판**. "어노테이션만 달았는데 연결됐다"의 실체.

---

## 실행 방법

### 사전 준비 (폐쇄망 1회)
1. **JDK** 설치 (JRE 아님) — javac 필요
2. **VS Code + Extension Pack for Java** 설치

(외부 JAR·JUnit 라이브러리 불필요)

### 일반 예제 실행
```bash
javac -encoding UTF-8 -d bin $(find src -name '*.java')
java -cp bin ex12.App          # 병렬개발: Mock → Real 갈아끼우기
java -cp bin ex14.App          # 팩토리 메서드
java -cp bin ex15.before.App   # 리팩토링 전 / after.App 후
java -cp bin ex16.ref03.App    # 리플렉션 패키지 스캔 (컴파일된 bin 필요)
```

### 단위 테스트 실행 (ex12 OrderServiceTest) — 라이브러리 불필요
`OrderServiceTest`는 `main()`을 가진 평범한 클래스라 그냥 실행하면 된다.
- **VS Code(추천)**: `main()` 위 초록 ▶ 버튼 클릭.
- **명령줄(Windows)**:
```bat
javac -encoding UTF-8 -d bin src\ex12\*.java
java -cp bin ex12.OrderServiceTest
```
> 통과/실패 개수를 출력하고, 실패가 있으면 종료코드 1을 반환한다(자동화 친화).

> 각 예제의 진입점은 해당 패키지의 `App.java`. ex15는 `before/after` 두 개, ex16은 `ref01~ref03` 세 개. ex12 테스트는 위 방법으로 실행.
