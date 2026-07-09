# 원고 기술검증 — ch01 (2026-07-08)

대상 원고: `outputs/02_원고/ch01.md` (다형성·동적바인딩 워밍업, ex01)
검증 방식: 슬라이드별 기술 주장 distill → 적대적 검증 서브에이전트 3인 병렬(권위 문서 웹 리서치 + Source 교차확인). 비유·의견·서사는 검증 대상에서 제외.

## 요약
- 검증 주장: 8건 / 지지 8 / **반박 0** / 검증불가 0 / 미검증 0
- 조치 필요 반박 없음. Source 보완 권유 1건(C7), 엄밀화 선택 참고 2건(C3·C6).

## 반박 (조치 대상 — 사용자가 manuscript-final로 검토·수정)

없음.

## 검증불가 (사람 판단 필요 — 오류 아님)

없음.

## 미검증 (파견 상한 초과 — 재실행 필요)

없음.

## 지지 (참고 — 근거로 확인됨. `source_supports: false`면 "Source 보완 필요"로 표시)

| 슬라이드 | 주장 | 확신도 | 근거(URL) | 근거 인용 | Source 지지 |
|---|---|---|---|---|---|
| 4 | 부모 타입 참조 변수에 자식 객체를 담을 수 있고(업캐스팅), 호출 시 각 참조가 가리키는 실제 객체에 맞는 동작이 수행된다 | high | https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html | "The JVM calls the appropriate method for the object that is referred to in each variable. It does not call the method that is defined by the variable's type. This behavior is referred to as virtual method invocation…" | ✓ |
| 5 | 추상 클래스는 인스턴스화할 수 없다(new 불가) | high | https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html | "Abstract classes cannot be instantiated, but they can be subclassed." | ✓ |
| 5 | 추상 메서드는 구현 없이 선언만 가지며 하위 클래스가 구현을 제공한다 | high | https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html | "An abstract method is a method that is declared without an implementation… When an abstract class is subclassed, the subclass usually provides implementations for all of the abstract methods…" | ✓ |
| 6 | 하위 클래스가 상위와 동일한 서명(이름·매개변수·반환타입)의 인스턴스 메서드를 정의하면 상위 메서드를 재정의(override)한다 | high | https://docs.oracle.com/javase/tutorial/java/IandI/override.html | "An instance method in a subclass with the same signature (name, plus the number and the type of its parameters) and return type as an instance method in the superclass overrides the superclass's method." | ✓ |
| 6 | @Override는 동작을 바꾸지 않고, 재정의 대상이 상위에 없으면 컴파일러가 오류를 낸다 | high | https://docs.oracle.com/javase/tutorial/java/IandI/override.html | "…use the @Override annotation that instructs the compiler that you intend to override a method… If… the compiler detects that the method does not exist in one of the superclasses, then it will generate an error." | ✓ |
| 7 | 실행될 메서드는 컴파일 시점의 선언 타입이 아니라 실행 시점의 실제 객체 기준으로 선택된다(가상 메서드 호출) | high | https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html | "…It does not call the method that is defined by the variable's type. This behavior is referred to as virtual method invocation…" | ✓ |
| 11 | JDK 21은 장기 지원(LTS) 버전이다 | high | https://en.wikipedia.org/wiki/Java_version_history (+ Oracle Java SE Support Roadmap) | "Java 8, 11, 17, 21, and 25 are all LTS releases. Oracle JDK 21 LTS, released September 2023… NFTC updates until September 2026." | ✗ (Source 보완 필요) |
| 11 | VS Code에서 Java 개발엔 JDK + Extension Pack for Java가 필요하며 이 확장이 문법 지원·디버거·실행을 제공한다 | high | https://code.visualstudio.com/docs/java/java-tutorial | "To use Java within Visual Studio Code, you need to install a Java Development Kit (JDK)… The Extension Pack for Java bundles Language Support for Java by Red Hat, Debugger for Java, Test Runner, Maven, Project Manager, IntelliCode." | ✓ |

## 비고 (엄밀화 선택 참고 — 필수 수정 아님)

- **C1/C6 적대적 반박 결과**: "실제 객체에 맞는 동작 선택"은 오버라이드된 **인스턴스 메서드**(가상 호출)에만 성립한다. static 메서드는 hiding(정적 바인딩), private/final은 재정의 대상 아님 — 그러나 ch01 주장들은 전부 인스턴스 메서드 재정의 문맥으로 서술돼 공식 문서와 충돌하지 않음(반박 불가).
- **C3 엄밀화(선택)**: "하위 클래스가 구현을 제공한다"에 "구현하지 않으면 그 하위 클래스도 abstract로 선언해야 한다"는 단서를 덧붙이면 더 정확. 슬라이드 수준 주장으로는 정확하므로 필수 아님.
- **C7 Source 보완(권유)**: JDK 21 LTS 주장은 사실이나, 원고가 인용한 Oracle 다운로드 페이지는 WebFetch 403이라 그 페이지로 직접 인용을 뜨지 못함. 근거는 Wikipedia 버전 히스토리 + Oracle 지원 로드맵(검색 스니펫)으로 확보. 원한다면 Slide 11 Source에 Oracle Java SE Support Roadmap URL(https://www.oracle.com/java/technologies/java-se-support-roadmap.html)을 보강 권유 — 조치 대상 아님.

## 결론

ch01의 기술 주장 8건 전부 Oracle·VS Code 공식 문서로 **지지(high)**. 조치가 필요한 반박·검증불가 0건. 판서 단계 진행에 기술적 걸림돌 없음.
