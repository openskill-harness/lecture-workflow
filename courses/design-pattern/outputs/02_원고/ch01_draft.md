# 1차시 원고: 다형성·동적바인딩 워밍업 (ex01)

## 차시 정보

- 과정명: 유지보수성 향상을 위한 디자인패턴(Java)
- 회차명: 다형성·동적바인딩 워밍업 (ex01)
- 차시 목표: 상위 타입 참조로 하위 구현을 다루는 다형성의 의미와 추상 타입·구현 타입의 관계를 이해하고, 재정의된 메서드가 실행 시점에 선택되는 동적바인딩의 동작 원리를 설명하며, 다형성이 이후 모든 디자인 패턴의 공통 기반임을 과정 전체 로드맵과 함께 확인하고, 추상 타입 1개와 구현 타입 2개로 동적바인딩을 직접 구현한다.
- NCS 연계: 해당 없음
- 예상 분량: 30분 이상 초안. 사용자가 추후 축약 가능하도록 풍부하게 구성한다.

## 사용 출처

- Oracle Java Tutorials – Polymorphism: https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- Oracle Java Tutorials – Overriding and Hiding Methods: https://docs.oracle.com/javase/tutorial/java/IandI/override.html
- Oracle Java Tutorials – Abstract Methods and Classes: https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html
- Oracle Java Tutorials – Inheritance: https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html
- Getting Started with Java in VS Code (공식): https://code.visualstudio.com/docs/java/java-tutorial
- Extension Pack for Java (VS Code Marketplace): https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack
- Oracle JDK 다운로드: https://www.oracle.com/java/technologies/downloads/
- refactoring.guru 디자인패턴 카탈로그: https://refactoring.guru/design-patterns/catalog
- mariofusco/from-gof-to-lambda (GitHub): https://github.com/mariofusco/from-gof-to-lambda
- The Gang of Four Gave Us 23 Design Patterns… Are They Still Relevant in 2025? (Medium): https://medium.com/@freddy.dordoni/the-gang-of-four-gave-us-23-design-patterns-are-they-still-relevant-in-2025-f2e999c384c0
- Modern Java Language Features: Records, Sealed Classes, Pattern Matching (Java Code Geeks): https://www.javacodegeeks.com/2025/12/modern-java-language-features-records-sealed-classes-pattern-matching.html
- 과정개요서 — 유지보수성 향상을 위한 디자인패턴(Java): `courses/design-pattern/outputs/01_과정개요서.md`
- 실습 정답 소스: `code/design-pattern-end/src/ex01/Mem02.java`

---

## Slide 1. 표지

**Screen**
- 제목: 다형성·동적바인딩 워밍업
- 부제: 모든 디자인 패턴이 딛고 서 있는 한 가지 원리부터 확인한다
- 화면: 템플릿 표지 레이아웃 사용. 하나의 추상적인 자동차 실루엣 뒤로 서로 다른 두 대의 자동차(소나타·제네시스 느낌)가 겹쳐 보이는 상징 이미지를 우측에 배치.

**Easy analogy**
- "운전면허"는 특정 차종 면허가 아니다. 면허 하나로 소나타도 몰고 제네시스도 몬다. 운전자는 "자동차라면 이렇게 움직인다"는 공통 규격만 알면 된다 — 오늘 배울 다형성이 바로 이 관계다.

**Practical case**
- 교육용 시나리오: 디자인 패턴 책을 펼친 3년차 개발자가 전략 패턴 다이어그램 앞에서 멈춘다. "인터페이스에 의존하라는데, 왜 그게 되는 거지?" 이 과정의 첫 시간은 그 "왜"의 뿌리인 다형성과 동적바인딩을 손으로 확인하는 준비운동이다.

**Visual asset**
- GPT image prompt: `A clean educational illustration of one abstract car silhouette splitting into two different concrete cars, a sedan and a luxury sedan, with a driver holding a single steering wheel that fits both, bright classroom style, flat vector, no readable text, 16:9 slide composition.`

**Source**
- Oracle Java Tutorials – Polymorphism: 같은 상위 타입의 참조로 서로 다른 하위 구현의 동작을 호출할 수 있다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- 과정개요서 — 유지보수성 향상을 위한 디자인패턴(Java) ch01 차시내용.

**Narration**
- 안녕하세요. 유지보수성 향상을 위한 디자인패턴 과정의 첫 번째 시간입니다. 이번 시간의 주제는 다형성과 동적바인딩입니다. 어쩌면 "패턴 배우러 왔는데 왜 문법 복습부터 하지?"라고 생각하실 수 있습니다. 그런데 앞으로 배울 열여섯 개 차시의 모든 패턴은 단 하나의 원리 위에 서 있습니다. 상위 타입의 참조로 하위 구현을 다루면, 실행 시점에 실제 객체의 메서드가 선택된다는 원리입니다. 이 한 문장이 몸에 붙어 있지 않으면 전략 패턴도 프록시 패턴도 그림으로만 남습니다. 반대로 이 원리가 선명하면 이후의 패턴들은 전부 이 원리의 응용으로 읽힙니다. 그래서 오늘은 아주 쉬운 자동차 예제 하나로 이 원리를 완전히 소화하는 준비운동을 하겠습니다.

**Practice**
- 없음. 과정 도입.

**Assessment**
- 없음.

---

## Slide 2. 왜 워밍업부터 시작하는가: 패턴이 어려운 진짜 이유

**Screen**
- 제목: 패턴 책이 어려운 이유는 패턴이 아니라 다형성이다
- 짧은 문구:
  - 패턴 다이어그램의 화살표 대부분은 "추상에 의존"을 뜻한다
  - 추상에 의존하는 코드가 동작하는 원리 = 다형성 + 동적바인딩
  - 이 원리를 건너뛰면 패턴은 암기 과목이 된다
- 화면: 좌측에 전략 패턴 클래스 다이어그램을 흐릿하게, 우측에 그 다이어그램의 인터페이스-구현 화살표 하나만 크게 확대해 물음표를 붙인 구성.

**Easy analogy**
- 수영 강습에서 접영을 배우기 전에 물에 뜨는 법부터 확인하는 것과 같다. 뜨는 법이 불안하면 어떤 영법을 배워도 물을 무서워하게 된다.

**Practical case**
- 실무사례형 시나리오: 결제 모듈에 전략 패턴을 도입하자는 코드 리뷰에서, 한 팀원이 "인터페이스 타입 변수에 넣으면 어떤 구현이 실행되는지 어떻게 보장돼요?"라고 묻는다. 질문 자체는 훌륭하지만, 이 질문에 팀 전체가 명확히 답하지 못하면 패턴 도입 논의는 겉돈다. 답은 언어가 보장한다 — 실행 시점에 실제 객체의 재정의 메서드가 호출된다는 Java의 규칙이다.

**Visual asset**
- GPT image prompt: `An educational illustration showing a complex UML-like class diagram fading in the background, while a single arrow between an interface shape and an implementation shape is magnified with a large question mark, suggesting the real difficulty is the arrow itself, clean lecture slide style, no readable text.`

**Source**
- Oracle Java Tutorials – Polymorphism: JVM이 각 변수에 참조된 실제 객체에 맞는 메서드를 호출하며, 이를 가상 메서드 호출(virtual method invocation)이라 부른다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- refactoring.guru 디자인패턴 카탈로그: 패턴 구조도가 추상-구현 관계를 중심으로 그려짐. https://refactoring.guru/design-patterns/catalog

**Narration**
- 본격적으로 들어가기 전에, 왜 이 과정이 패턴이 아니라 워밍업으로 시작하는지 말씀드리겠습니다. 디자인 패턴 책이 어렵게 느껴지는 이유는 대부분 패턴 자체가 아닙니다. 패턴 다이어그램에 그려진 화살표, 그러니까 "구체 클래스가 아니라 추상에 의존한다"는 관계가 코드에서 실제로 어떻게 동작하는지 몸으로 확신하지 못하기 때문입니다. 인터페이스 타입 변수에 구현 객체를 담았을 때 어떤 메서드가 실행되는가, 그 선택은 언제 일어나는가. 이 질문에 즉답할 수 있으면 패턴은 암기가 아니라 추론의 대상이 됩니다. 실무에서도 마찬가지입니다. 전략 패턴이나 프록시 패턴을 도입하자는 논의에서 팀원들의 확신이 갈리는 지점은 언제나 이 기초 원리입니다. 그래서 오늘 한 시간을 투자해 이 원리를 확실하게 다지고 가는 것이 이후 열다섯 개 차시 전체의 속도를 결정합니다.

**Practice**
- 없음. 문제의식 공유.

**Assessment**
- 없음.

---

## Slide 3. 오늘의 학습 목표

**Screen**
- 제목: 오늘은 "한 문장"을 코드로 증명한다
- 학습목표 3개:
  1. 상위(추상) 타입 참조로 하위(구현) 객체를 다루는 다형성을 설명할 수 있다.
  2. 재정의된 메서드가 실행 시점에 선택되는 동적바인딩의 동작 원리를 설명할 수 있다.
  3. 추상 타입 1개와 구현 타입 2개로 동적바인딩을 직접 구현할 수 있다.
- 화면: 세 목표를 아이콘 중심으로 배치. 추상 자동차 아이콘, 실행 시점 선택을 뜻하는 갈림길 화살표 아이콘, 키보드 아이콘.

**Easy analogy**
- 오늘 목표는 "리모컨 하나로 어느 회사 TV든 켠다"는 문장을 말로만 아는 것이 아니라, 리모컨을 직접 분해해 버튼과 신호가 어떻게 연결되는지 확인하는 것이다.

**Practical case**
- 교육용 시나리오: 코드 리뷰에서 "여기 왜 부모 타입으로 받았어요?"라는 질문을 받았을 때, "그래야 나중에 구현을 바꿔 끼울 수 있고, 실행 시점에 실제 객체의 메서드가 호출되니까요"라고 근거를 들어 답하는 것이 오늘 수업 후의 모습이다.

**Visual asset**
- GPT image prompt: `Three-step visual roadmap icons for a Java lesson: an abstract car blueprint, a forked arrow representing runtime method selection, and a keyboard for hands-on coding, clean icons, light background, no text.`

**Source**
- 과정개요서 — 유지보수성 향상을 위한 디자인패턴(Java) §5 차시표 ch01 차시내용.

**Narration**
- 오늘의 학습 목표는 세 가지입니다. 첫째, 다형성이 무엇인지 설명할 수 있어야 합니다. 정의를 외우는 것이 아니라, 상위 타입 참조 하나로 서로 다른 하위 구현을 다룬다는 것이 코드에서 어떤 모습인지 말할 수 있어야 합니다. 둘째, 동적바인딩의 동작 원리를 설명할 수 있어야 합니다. 부모 타입 변수로 메서드를 호출했는데 왜 자식의 메서드가 실행되는지, 그 선택이 언제 어떻게 일어나는지를 다루겠습니다. 셋째, 직접 구현할 수 있어야 합니다. 오늘 함께 작성할 자동차 예제를 그대로 따라 만든 다음, 여러분이 고른 도메인으로 추상 타입 하나와 구현 타입 두 개를 스스로 설계해 같은 구조를 재현하는 과제까지 진행합니다. 눈으로 이해한 것과 손으로 만든 것의 차이가 큰 주제이니, 오늘은 꼭 끝까지 직접 타이핑해 보시길 권합니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 4. 다형성: 상위 타입 참조로 하위 구현을 다룬다

**Screen**
- 제목: 다형성 = 하나의 타입, 여러 개의 모습
- 짧은 문구:
  - `Car s = new Sonata();` — 부모 타입 변수에 자식 객체를 담는다
  - 변수의 타입은 Car, 실제 객체는 Sonata
  - "자동차"라고 부르지만 실제로는 소나타가 달린다
- 화면: 왼쪽에 `Car` 라벨이 붙은 주차 구역, 그 안에 소나타가 주차된 그림. 오른쪽에 같은 구역에 제네시스가 주차된 그림.

**Easy analogy**
- 호텔 발레파킹 주차권에는 "고객 차량"이라고만 적혀 있다. 주차권(참조 변수)의 표기는 늘 같지만, 그 주차권으로 나오는 실제 차(객체)는 손님마다 다르다.

**Practical case**
- 실무사례형 시나리오: 결제 서비스 코드가 `KakaoPay` 같은 구체 클래스 대신 `PaymentGateway` 같은 상위 타입으로 변수를 선언해 두면, 결제사를 추가하거나 교체할 때 호출부 코드를 고치지 않아도 된다. "부모 타입으로 받아 두는" 습관은 실무에서 변경 비용을 낮추는 첫 번째 장치다.

**Visual asset**
- GPT image prompt: `A parking spot labeled with a generic car symbol, shown twice side by side: once with a modest sedan parked and once with a luxury sedan parked in the same spot, implying one reference type holding different concrete objects, flat educational vector, no readable text.`
- Code block for slide:

```java
Car s = new Sonata(); // 부모 타입 참조 ← 자식 객체
Car g = new Genesis(); // 같은 타입의 변수에 다른 구현
```

**Source**
- Oracle Java Tutorials – Polymorphism: 하위 클래스의 객체를 상위 타입으로 다룰 수 있고, 각 참조가 가리키는 실제 객체에 맞는 동작이 수행된다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- Oracle Java Tutorials – Inheritance: 하위 클래스는 상위 클래스의 타입으로 취급될 수 있다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html

**Narration**
- 다형성이라는 단어부터 풀어 보겠습니다. 다형성은 "여러 형태를 가진다"는 뜻입니다. Java에서는 이것이 아주 구체적인 한 줄의 코드로 나타납니다. `Car s = new Sonata();` 이 한 줄입니다. 왼쪽을 보면 변수 s의 타입은 Car입니다. 오른쪽을 보면 실제로 만들어진 객체는 Sonata입니다. 즉 부모 타입의 변수에 자식 객체를 담은 것입니다. Java는 이것을 문법적으로 허용합니다. 소나타는 자동차의 일종이기 때문에, 자동차라고 불러도 거짓이 아니기 때문입니다. 호텔 발레파킹을 떠올려 보세요. 주차권에는 그냥 "고객 차량"이라고 적혀 있지만, 그 주차권으로 나오는 차는 손님마다 다릅니다. 주차권이 참조 변수이고, 실제 차가 객체입니다. 실무에서 이 한 줄이 중요한 이유는 변경 비용 때문입니다. 코드가 구체 클래스가 아니라 상위 타입에 의존하면, 나중에 구현을 바꾸거나 추가할 때 호출하는 쪽 코드를 건드리지 않아도 됩니다. 이 감각이 바로 다음 차시부터 배울 모든 패턴의 출발점입니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 5. 추상 타입 Car와 구현 타입 Sonata·Genesis

**Screen**
- 제목: 추상 타입은 약속만, 구현 타입은 내용을
- 짧은 문구:
  - `abstract class Car` — "자동차라면 run이 있어야 한다"는 약속
  - Car는 `new` 불가 — 약속만 있고 내용이 없으므로
  - Sonata와 Genesis가 각자의 run 내용을 채운다
- 화면: 상단에 점선으로 그려진 자동차 설계도(Car), 아래로 화살표 두 개가 내려와 실선으로 그려진 소나타와 제네시스. 설계도 옆에 "new 금지" 표시.

**Easy analogy**
- 추상 클래스는 프랜차이즈 본사의 "매장 운영 매뉴얼"과 같다. 매뉴얼 자체로는 장사를 할 수 없고(new 불가), 매뉴얼대로 문을 연 실제 매장(구현 클래스)이 있어야 손님을 받는다.

**Practical case**
- 실무사례형 시나리오: 사내 공통 모듈에서 `NotificationSender` 같은 추상 타입에 "보낸다"는 계약만 정의해 두고, 이메일·SMS·푸시 구현 클래스가 각자 내용을 채우는 구조를 자주 본다. 계약과 구현이 분리되어 있으면 새 채널 추가가 기존 코드 수정 없이 가능해진다.

**Visual asset**
- GPT image prompt: `A blueprint of a generic car drawn in dashed lines at the top labeled as abstract, with two solid arrows pointing down to two fully drawn concrete cars, a sedan and a luxury sedan, with a small forbidden sign on the blueprint implying it cannot be instantiated, clean educational diagram style, no readable text.`
- Code block for slide:

```java
abstract class Car { // new x
    abstract void run();
}

class Sonata extends Car {
    @Override
    void run() {
        System.out.println("소나타 달린다");
    }
}

class Genesis extends Car {
    @Override
    void run() {
        System.out.println("제네시스 달린다");
    }
}
```

**Source**
- Oracle Java Tutorials – Abstract Methods and Classes: 추상 클래스는 인스턴스화할 수 없고, 추상 메서드는 구현 없이 선언만 가지며 하위 클래스가 구현을 제공한다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html
- 실습 정답 소스: `code/design-pattern-end/src/ex01/Mem02.java`

**Narration**
- 이제 오늘의 예제 코드를 구조부터 보겠습니다. 먼저 Car는 abstract, 즉 추상 클래스입니다. 그 안의 run 메서드도 abstract라서 몸통이 없습니다. "자동차라면 달릴 수 있어야 한다"는 약속만 있고, 어떻게 달리는지는 적혀 있지 않은 상태입니다. 그래서 Car는 new로 직접 만들 수 없습니다. 내용이 없는 약속만으로는 실제 객체가 성립하지 않기 때문입니다. 프랜차이즈 본사의 매장 운영 매뉴얼을 생각하시면 됩니다. 매뉴얼은 장사의 규칙을 정하지만 매뉴얼 자체가 손님을 받지는 못합니다. 실제 장사는 매뉴얼대로 문을 연 매장이 합니다. 여기서 그 매장이 Sonata와 Genesis입니다. 두 클래스는 Car를 extends 하면서 run의 내용을 각자 채웁니다. 소나타는 "소나타 달린다"를, 제네시스는 "제네시스 달린다"를 출력합니다. 약속은 하나인데 내용은 둘, 이 구조가 다형성의 무대 장치입니다. 참고로 이후 차시에서는 추상 클래스뿐 아니라 인터페이스로 계약을 정의하는 경우를 더 많이 보게 되는데, "약속과 내용의 분리"라는 원리는 완전히 동일합니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 6. 오버라이드: 부모의 run을 자식이 다시 정의한다

**Screen**
- 제목: `@Override` — 같은 서명, 새로운 내용
- 짧은 문구:
  - 재정의(override): 부모의 메서드를 자식이 같은 서명으로 다시 작성
  - `@Override` 애노테이션은 "재정의가 맞는지" 컴파일러가 검사하게 한다
  - 재정의되면 부모의 메서드는 그 객체에서 가려진다(무효화)
- 화면: 부모 칸에 흐릿한 run(), 자식 칸에 선명한 run()이 그려지고, 자식의 run이 부모의 run 위에 도장처럼 찍혀 덮는 그림.

**Easy analogy**
- 회사 표준 근무 규정 위에 팀별 규정이 있는 것과 같다. 팀 규정이 같은 항목을 다시 정하면, 그 팀 안에서는 팀 규정이 우선하고 표준 규정의 해당 항목은 효력을 잃는다.

**Practical case**
- 실무사례형 시나리오: `toString()`을 재정의해 로그에 객체 상태가 읽기 좋게 찍히도록 하는 것은 가장 흔한 오버라이드 실무 사례다. 이때 메서드 이름을 `tostring`으로 잘못 쓰면 재정의가 아니라 별개 메서드가 되어 버리는데, `@Override`를 붙여 두면 컴파일 단계에서 바로 잡아 준다.

**Visual asset**
- GPT image prompt: `An educational illustration of method overriding: a parent class box with a faded method slot, and a child class box stamping its own bright method over it like a seal covering the old one, simple flat style, no readable text.`
- Code block for slide:

```java
class Sonata extends Car {
    @Override // 재정의 — 컴파일러가 서명 일치를 검사
    void run() {
        System.out.println("소나타 달린다");
    }
}
```

**Source**
- Oracle Java Tutorials – Overriding and Hiding Methods: 하위 클래스가 상위 클래스와 동일한 서명의 인스턴스 메서드를 정의하면 상위 클래스의 메서드를 재정의(override)하며, `@Override` 애노테이션으로 컴파일러 검사를 받을 수 있다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/override.html

**Narration**
- 다음 열쇠는 재정의, 영어로 오버라이드입니다. Sonata는 부모 Car에게 물려받은 run을 같은 이름, 같은 매개변수, 같은 반환 타입으로 다시 작성했습니다. 이렇게 서명이 완전히 일치하는 메서드를 자식이 다시 정의하면, 그 객체에서는 자식의 버전이 부모의 버전을 대신합니다. 오늘 예제 소스의 주석에 있는 표현을 빌리면, 부모의 run이 오버라이드되어 무효화되고 자식의 run이 살아남는 것입니다. 회사의 표준 근무 규정과 팀 규정의 관계를 생각하시면 쉽습니다. 팀 규정이 같은 항목을 다시 정했다면 그 팀 안에서는 팀 규정이 우선합니다. 코드 위에 붙은 @Override 애노테이션도 짚고 가겠습니다. 이 애노테이션은 동작을 바꾸지 않습니다. 대신 "이 메서드는 부모 것을 재정의한 것이 맞다"고 컴파일러에게 선언해서, 철자를 틀리거나 매개변수를 다르게 써서 재정의에 실패한 경우 컴파일 오류로 즉시 알려 줍니다. 실무에서 재정의 의도가 있는 메서드에는 반드시 붙이는 것이 관례입니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 7. 동적바인딩: 실행 시점에 재정의된 메서드가 선택된다

**Screen**
- 제목: 호출할 메서드는 "실행 시점의 실제 객체"가 결정한다
- 짧은 문구:
  - 컴파일 시점: 변수 타입(Car)에 run이 있는지 확인만 한다
  - 실행 시점: 실제 객체(Sonata)의 재정의된 run이 선택된다
  - 그래서 같은 `s.run()`이 객체에 따라 다르게 동작한다
- 화면: `s.run()` 호출 화살표가 Car의 흐릿한 run을 지나쳐(빗금 처리) Sonata의 선명한 run에 도착하는 흐름도.

**Easy analogy**
- 대표번호로 전화를 거는 것과 같다. 거는 쪽은 항상 같은 번호(부모 타입의 run)를 누르지만, 실제로 받는 사람은 그 시각에 당번인 담당자(실제 객체의 재정의 메서드)다.

**Practical case**
- 실무사례형 시나리오: 프레임워크가 우리가 만든 컨트롤러나 리스너의 메서드를 호출할 수 있는 이유가 바로 이것이다. 프레임워크는 우리 클래스의 존재를 모르고 상위 타입만 알지만, 실행 시점에는 우리가 재정의한 메서드가 선택되어 실행된다. 동적바인딩이 없다면 프레임워크라는 물건 자체가 성립하지 않는다.

**Visual asset**
- GPT image prompt: `A flow diagram illustration showing a method call arrow starting from a variable labeled with an abstract car type, passing by a crossed-out faded parent method, and landing on a bright overridden method inside a concrete sedan object, at runtime, clean technical illustration, no readable text.`
- Code block for slide:

```java
Car s = new Sonata();
// car의 run을 호출하러 갔더니, sonata가 run을 재정의해서,
// car의 run이 오버라이드(무효화)되고, sonata의 run이 호출된다.
s.run(); // 출력: 소나타 달린다
```

**Source**
- Oracle Java Tutorials – Polymorphism: JVM이 변수의 타입이 아니라 각 변수가 참조하는 실제 객체에 맞는 메서드를 호출하며, 이를 가상 메서드 호출(virtual method invocation)이라고 부른다는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- Oracle Java Tutorials – Overriding and Hiding Methods: 호출되는 인스턴스 메서드의 버전은 실행 시점 객체 기준이라는 설명. https://docs.oracle.com/javase/tutorial/java/IandI/override.html
- 실습 정답 소스 주석: `code/design-pattern-end/src/ex01/Mem02.java`

**Narration**
- 이제 오늘의 핵심인 동적바인딩입니다. `Car s = new Sonata();` 다음에 `s.run()`을 호출하면 무슨 일이 벌어질까요? 컴파일러는 변수 s의 타입인 Car를 보고 "Car에 run이라는 메서드가 선언되어 있는가"만 확인합니다. 여기까지는 컴파일 시점의 일입니다. 그런데 어떤 run을 실행할지는 이때 확정되지 않습니다. 프로그램이 실제로 돌아가는 실행 시점에, s가 가리키는 실제 객체가 무엇인지를 보고 그 객체의 메서드가 선택됩니다. 지금 s가 가리키는 것은 Sonata 객체입니다. Sonata 객체 안에는 부모에게 물려받은 run과 자신이 재정의한 run이 함께 준비되어 있는데, 재정의가 일어났기 때문에 부모의 run은 무효화되고 Sonata의 run이 호출됩니다. 예제 소스의 주석 그대로, Car의 run을 호출하러 갔더니 Sonata가 재정의해 둔 run이 대신 실행되는 것입니다. Oracle 공식 튜토리얼은 이것을 가상 메서드 호출이라고 부릅니다. 대표번호 비유를 기억해 주세요. 거는 쪽은 늘 같은 번호를 누르지만 받는 사람은 그때그때의 담당자입니다. 이 "늦은 결정" 덕분에 호출하는 코드는 그대로 두고 실행되는 내용만 바꿔 끼우는 설계가 가능해지고, 그것이 바로 디자인 패턴이 하는 일의 전부입니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 8. 코드 전체 읽기: Mem02.java

**Screen**
- 제목: 25줄로 증명하는 다형성과 동적바인딩
- 화면: Mem02.java 전체 코드를 크게 표시하고, `Car s = new Sonata();`와 `s.run()` 줄에 하이라이트. 우측 하단에 실행 결과 두 줄("소나타 달린다" / "제네시스 달린다") 표시.

**Easy analogy**
- 같은 리모컨 버튼(run 호출)을 두 번 눌렀는데, 첫 번째는 거실 TV가, 두 번째는 안방 TV가 켜진 상황이다. 버튼은 같아도 연결된 기기가 다르면 결과가 다르다.

**Practical case**
- 실무사례형 시나리오: 코드 리뷰에서 "이 두 줄은 완전히 같은 모양인데 결과가 왜 다르죠?"라는 질문이 나오면 좋은 신호다. `s.run()`과 `g.run()`은 호출 코드로는 구분되지 않고, 오직 변수에 담긴 실제 객체만 다르다. 호출부와 구현부가 분리되었다는 뜻이고, 이 분리가 유지보수성의 원천이다.

**Visual asset**
- Code block for slide:

```java
package ex01;

/**
 * 목표 : 다형성, 동적바인딩
 * 1. 소나타(오브젝트 == 객체), 제네시스(오브젝트 ==객체) == 자동차(추상)
 */

abstract class Car { // new x
    abstract void run();
}

class Sonata extends Car{
    @Override // 재정의
    void run() {
        System.out.println("소나타 달린다");
    } // sonata -> car

}

class Genesis extends Car{
    @Override // 재정의
    void run() {
        System.out.println("제네시스 달린다");
    } // genesis -> car

}

public class Mem02 {

    public static void main(String[] args) {
        Car s = new Sonata(); // 메모리 sonata(run), car(run)
        // car의 run을 호출하러 갔더니, sonata가 run을 재정의해서,
        // car의 run의 오버라이드(무효화)되고, sonata의 run이 호출된다.
        s.run();
        Car g = new Genesis(); // 메모리 genesis(run), car(run)
        g.run();
    }
}
```

**Source**
- 실습 정답 소스: `code/design-pattern-end/src/ex01/Mem02.java`
- Oracle Java Tutorials – Polymorphism: https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html

**Narration**
- 이제 오늘 실습할 파일 전체를 처음부터 끝까지 읽어 보겠습니다. 파일은 ex01 패키지에 있고 이름은 Mem02입니다. 위에서부터 보면, 추상 클래스 Car가 run이라는 추상 메서드 하나를 약속합니다. Sonata와 Genesis가 Car를 상속받아 각자의 run을 재정의합니다. 그리고 main을 보시죠. `Car s = new Sonata();` 부모 타입 변수에 소나타 객체를 담고 `s.run()`을 호출합니다. 방금 배운 대로 실행 시점에 실제 객체인 Sonata의 run이 선택되어 "소나타 달린다"가 출력됩니다. 이어서 `Car g = new Genesis();`와 `g.run()`. 코드 모양은 완전히 같지만 이번에는 실제 객체가 Genesis라서 "제네시스 달린다"가 출력됩니다. 여기서 주목할 점은 `s.run()`과 `g.run()`이라는 호출 코드만 봐서는 무엇이 실행될지 구분할 수 없다는 사실입니다. 결과를 결정하는 것은 호출 코드가 아니라 변수에 담긴 객체입니다. 호출하는 쪽과 실행되는 내용이 분리된 것이죠. 스물다섯 줄 남짓한 이 작은 파일이 다형성과 동적바인딩, 그리고 이후 모든 패턴의 원리를 전부 담고 있습니다.

**Practice**
- 후반 실습에서 이 파일을 직접 타이핑하고 실행한다. 클래스명·패키지명(ex01, Car, Sonata, Genesis, Mem02)은 정답본과 동일하게 유지한다.

**Assessment**
- 없음.

---

## Slide 9. 모든 패턴은 다형성 위에 서 있다

**Screen**
- 제목: 패턴 = "다형성을 어디에 쓸 것인가"에 대한 검증된 답
- 짧은 문구:
  - 전략 패턴: 갈아 끼울 행위를 추상 타입 뒤에 둔다
  - 프록시 패턴: 같은 추상 타입 뒤에 대리자를 세운다
  - 옵저버·팩토리·데코레이터… 전부 "추상에 의존 + 실행 시점 선택"의 응용
  - 람다도 동작을 갈아 끼우는 같은 뿌리의 현대적 표현
- 화면: 중앙 아래에 "다형성·동적바인딩"이라는 주춧돌, 그 위에 패턴 이름이 적힌 기둥들이 서 있는 신전 구도.

**Easy analogy**
- 다형성은 콘센트 규격이다. 규격(추상 타입)이 통일되어 있으니 드라이어든 청소기든(구현) 꽂아 쓸 수 있고, 멀티탭·타이머 콘센트(패턴들)는 그 규격 위에서 만들어진 응용 상품이다.

**Practical case**
- 실무사례형 시나리오: 현대 Java에서는 `Comparator`를 람다로 넘겨 정렬 기준을 갈아 끼운다. 클래스를 새로 만들지 않을 뿐, "호출부는 그대로 두고 동작만 바꿔 끼운다"는 구조는 전략 패턴과 동일하며 그 뿌리는 다형성이다. 패턴을 원리로 이해해 두면 고전 구현과 람다 구현을 상황에 맞게 오갈 수 있다.

**Visual asset**
- GPT image prompt: `A Greek temple metaphor illustration where a single large foundation stone supports many pillars, each pillar representing a different software design pattern, emphasizing that one principle supports them all, clean educational flat style, warm colors, no readable text.`

**Source**
- refactoring.guru 디자인패턴 카탈로그: 패턴들이 추상-구현 분리 구조를 공유함. https://refactoring.guru/design-patterns/catalog
- mariofusco/from-gof-to-lambda (GitHub): Strategy·Template Method 등 행동 패턴을 람다/함수 전달로 구현하는 예제 모음 — 동작 파라미터화의 뿌리가 같음을 보여줌. https://github.com/mariofusco/from-gof-to-lambda
- The Gang of Four… Still Relevant in 2025? (Medium): 패턴은 여전히 공유 어휘이자 멘털 모델로 유효하며 구현 방식이 현대화된다는 정리. https://medium.com/@freddy.dordoni/the-gang-of-four-gave-us-23-design-patterns-are-they-still-relevant-in-2025-f2e999c384c0
- Modern Java Language Features (Java Code Geeks): record 등 현대 기능이 구현을 간결화한다는 설명. https://www.javacodegeeks.com/2025/12/modern-java-language-features-records-sealed-classes-pattern-matching.html

**Narration**
- 이제 오늘 내용과 이 과정 전체를 연결해 보겠습니다. 디자인 패턴이란 무엇일까요? 저는 이렇게 정의하고 싶습니다. "다형성을 어디에, 어떻게 쓸 것인가"라는 질문에 대해 선배 개발자들이 검증해 둔 답안지입니다. 전략 패턴은 자주 바뀌는 행위를 추상 타입 뒤로 분리해서 갈아 끼우는 답이고, 프록시 패턴은 같은 추상 타입 뒤에 대리자를 세워 접근을 제어하는 답입니다. 옵저버, 팩토리, 데코레이터도 모두 "구체가 아니라 추상에 의존하고, 실행 시점에 실제 구현이 선택된다"는 오늘의 원리를 각자의 문제 상황에 적용한 것입니다. 콘센트 비유가 정확합니다. 콘센트 규격이 통일되어 있기 때문에 어떤 가전이든 꽂을 수 있고, 멀티탭이나 타이머 콘센트 같은 응용 상품도 그 규격 위에서 성립합니다. 한 가지 더, 현대 Java 이야기를 하겠습니다. 요즘은 전략 클래스를 따로 만들지 않고 람다로 동작을 바로 넘기는 코드가 흔합니다. 람다, record 같은 현대 기능이 패턴 구현을 훨씬 간결하게 만들었지만, "호출부를 고정하고 동작을 바꿔 끼운다"는 발상의 뿌리는 여전히 다형성입니다. 그래서 이 과정에서는 고전 구현과 현대 관용구를 함께 다루되, 오늘 다진 원리를 매번 진단 렌즈로 재사용할 것입니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 10. 과정 로드맵: ch01 준비운동에서 ch16 피날레까지

**Screen**
- 제목: 16차시 전체 지도 — 오늘은 출발선이다
- 화면: 좌측에서 우측으로 흐르는 로드맵. 오늘(ch01 다형성·동적바인딩)을 출발점으로 강조하고, 이후 흐름을 화살표로 연결:
  - 전략(ch03) → 프록시(ch04) → 어댑터(ch05) → 싱글톤(ch06) → 템플릿 메서드(ch07) → 위임(ch08) → 옵저버(ch09) → 데코레이터(ch10) → 목 객체(ch11) → AI 프렌들리·병렬개발(ch12) → 팩토리(ch13~14) → 리팩토링 종합(ch15) → 리플렉션 피날레(ch16)
- 하단 캐치프레이즈: "모든 패턴은 다형성 위에 서 있다"

**Easy analogy**
- 등산 안내도와 같다. 오늘은 입구의 준비운동 광장이고, 열여섯 번째 봉우리(리플렉션)에서는 우리가 매일 쓰는 프레임워크의 축소판을 직접 만들며 내려다보게 된다.

**Practical case**
- 교육용 시나리오: 과정 중반쯤 "지금 배우는 패턴이 전체에서 어디쯤인지" 길을 잃는 수강생이 많다. 이 로드맵 한 장을 기억해 두면, 매 차시가 "다형성이라는 같은 원리의 다른 응용"이라는 지도 위에서 자기 위치를 확인할 수 있다.

**Visual asset**
- GPT image prompt: `A horizontal learning roadmap illustration like a hiking trail map with a starting warm-up plaza and a sequence of small peaks leading to a grand final summit, one continuous path connecting all stops, flat educational infographic style, no readable text, 16:9.`

**Source**
- 과정개요서 — 유지보수성 향상을 위한 디자인패턴(Java) §5 차시표(16차시 구성)·§7 실습 도메인 연속성(관통 서사).

**Narration**
- 오늘이 준비운동이라고 했으니, 앞으로 어떤 산을 오를지 지도를 함께 보겠습니다. 다음 시간에는 캡슐화와 SOLID, 특히 개방-폐쇄 원칙을 다루면서 "좋은 설계란 무엇인가"의 기준을 세웁니다. 그다음부터 본격적인 패턴 여정입니다. 변하는 행위를 갈아 끼우는 전략 패턴, 대리자를 세우는 프록시 패턴, 호환되지 않는 것을 이어 붙이는 어댑터 패턴, 유일한 인스턴스를 보장하는 싱글톤 패턴을 지나, 알고리즘 골격을 고정하는 템플릿 메서드 패턴과 책임을 넘기는 위임 패턴으로 이어집니다. 이어서 상태 변화를 자동으로 알리는 옵저버 패턴, 기능을 겹겹이 누적하는 데코레이터 패턴을 배우고, 목 객체 차시에서는 테스트 가능한 구조를 만듭니다. 그 위에서 인터페이스 계약 기반으로 사람과 AI가 병렬 개발하는 AI 프렌들리 차시를 진행하고, 객체 생성을 다루는 팩토리 두 개 차시, 지금까지의 패턴으로 나쁜 코드를 통째로 재설계하는 리팩토링 종합 차시를 거쳐, 마지막 열여섯 번째 시간에는 리플렉션으로 프레임워크의 축소판을 직접 만드는 피날레에 도착합니다. 이 모든 정거장을 관통하는 문장이 하나 있습니다. 모든 패턴은 다형성 위에 서 있다. 오늘 이 출발선을 단단히 다져야 하는 이유입니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 11. 실습 준비: JDK 21 + VS Code + Extension Pack for Java

**Screen**
- 제목: 실습 환경 준비 — 여기서부터 직접 합니다
- 짧은 문구:
  - 지금까지는 눈으로 이해하는 시간, 여기서부터는 손으로 만드는 시간
  - 설치 1: JDK 21 (LTS)
  - 설치 2: VS Code
  - 설치 3: Extension Pack for Java (VS Code 확장)
  - 확인: 터미널에서 `java -version` → 21.x
- 화면: 좌측에 설치 3종 카드(JDK 21 → VS Code → Extension Pack for Java)를 순서대로, 우측에 Java 파일이 열린 VS Code 화면 목업.

**Easy analogy**
- 운전 연수 첫날과 같다. 도로에 나가기 전에 차량(JDK), 운전석(VS Code), 계기판과 보조 장치(Extension Pack for Java)를 먼저 점검한다. 점검이 끝나야 안심하고 달릴 수 있다.

**Practical case**
- 실무사례형 시나리오: 신규 입사자의 온보딩 첫날 업무는 대부분 개발 환경 표준 맞추기다. 팀원마다 JDK 버전이나 IDE 설정이 다르면 "제 컴퓨터에서는 되는데요"라는 말이 반복된다. 이 과정도 같은 이유로 전 차시가 JDK 21 + VS Code 표준 환경 하나로 실습한다.

**Visual asset**
- Screenshot plan:
  1. JDK 21 설치 후 터미널에서 `java -version` 실행 결과(21.x 표시).
  2. VS Code 확장 탭에서 "Extension Pack for Java"를 검색해 설치하는 화면.
  3. 실습용 작업 폴더를 VS Code로 연 화면(File → Open Folder).

**Source**
- Getting Started with Java in VS Code (공식): VS Code에서 Java 개발을 시작하려면 JDK와 Extension Pack for Java 설치가 필요하다는 안내. https://code.visualstudio.com/docs/java/java-tutorial
- Extension Pack for Java (VS Code Marketplace): https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack
- Oracle JDK 다운로드: https://www.oracle.com/java/technologies/downloads/

**Narration**
- 지금까지는 코드를 눈으로 함께 읽기만 했습니다. 여기서부터는 직접 손을 움직이는 실습 시간입니다. 준비물은 세 가지입니다. 첫째, JDK 21입니다. 장기 지원 버전이라 실무에서도 널리 쓰이는 기준이고, 이 과정의 전 차시가 이 버전으로 진행됩니다. 설치가 끝나면 터미널에서 java -version을 입력해 21로 시작하는 버전이 출력되는지 확인해 주세요. 둘째, 에디터는 VS Code를 사용합니다. 셋째, VS Code의 확장 탭에서 Extension Pack for Java를 설치합니다. 이 확장 묶음이 자바 문법 지원, 디버거, 그리고 우리가 곧 사용할 실행 버튼까지 한 번에 넣어 줍니다. 세 가지 설치가 끝나면 실습용 작업 폴더를 하나 만들고 VS Code의 File, Open Folder 메뉴로 그 폴더를 열어 주세요. 여기까지가 준비입니다. 앞으로 열여섯 차시 내내 이 환경을 그대로 쓰기 때문에, 오늘 설치를 확실히 해 두면 다음 시간부터는 바로 코드로 들어갈 수 있습니다.

**Practice**
- JDK 21 설치 후 터미널에서 `java -version` 실행, 21.x 확인.
- VS Code 설치.
- VS Code 확장 탭에서 "Extension Pack for Java" 검색·설치.
- 실습용 작업 폴더 생성 후 VS Code로 열기(File → Open Folder).

**Assessment**
- 없음.

---

## Slide 12. 실습 1: VS Code로 Mem02.java 작성하고 실행하기

**Screen**
- 제목: 직접 타이핑 → ▶ Run 클릭
- 화면:
  - 좌측: VS Code 편집기에 Mem02.java 핵심 코드(추상 Car, Sonata/Genesis, main)
  - 우측 하단: 통합 터미널에 실행 결과 두 줄
- 짧은 문구:
  - `src/ex01/Mem02.java` 생성 (패키지 선언과 폴더 구조 일치)
  - main 위에 뜨는 ▶ Run 버튼 클릭 — 컴파일과 실행을 확장이 대신한다
  - 출력: "소나타 달린다" / "제네시스 달린다"

**Easy analogy**
- 악보를 눈으로 읽는 것과 직접 연주하는 것은 다르다. 오늘 코드는 짧으니 복사·붙여넣기 대신 한 줄씩 직접 타이핑하며 각 줄의 의미를 소리 내어 말해 보자.

**Practical case**
- 실무사례형 시나리오: 온보딩 중인 신규 입사자에게 "작은 코드를 직접 실행해 보고 결과를 예측·확인하는" 습관을 들이게 하는 팀이 많다. 예측과 결과가 어긋나는 순간이 바로 학습이 일어나는 지점이기 때문이다. 이번 실습에서도 실행 전에 출력 결과를 먼저 종이에 적고 확인해 보자.

**Visual asset**
- Code block for slide:

```java
package ex01;

abstract class Car {
    abstract void run();
}

class Sonata extends Car {
    @Override
    void run() { System.out.println("소나타 달린다"); }
}

class Genesis extends Car {
    @Override
    void run() { System.out.println("제네시스 달린다"); }
}

public class Mem02 {
    public static void main(String[] args) {
        Car s = new Sonata();
        s.run();
        Car g = new Genesis();
        g.run();
    }
}
```

- Screenshot plan:
  1. VS Code 탐색기에서 `src/ex01` 폴더와 `Mem02.java`를 만든 화면.
  2. main 메서드 위에 표시된 ▶ Run 버튼.
  3. 통합 터미널에 출력된 두 줄("소나타 달린다" / "제네시스 달린다").

**Source**
- 실습 정답 소스: `code/design-pattern-end/src/ex01/Mem02.java`
- Getting Started with Java in VS Code (공식): 편집기 안의 Run 버튼으로 Java 애플리케이션을 실행할 수 있다는 안내. https://code.visualstudio.com/docs/java/java-tutorial

**Narration**
- 이제 직접 만들어 보겠습니다. VS Code 탐색기에서 src 폴더를 만들고, 그 아래 ex01 폴더, 그 안에 Mem02.java 파일을 만듭니다. 파일 첫 줄의 package ex01 선언과 폴더 구조가 일치해야 한다는 것, 잊지 마세요. 코드가 짧으니 복사해 붙여 넣지 말고 한 줄씩 직접 타이핑하시길 권합니다. 타이핑하면서 "지금 이 줄은 약속을 정하는 줄", "이 줄은 약속을 채우는 줄", "이 줄은 부모 타입에 자식 객체를 담는 줄"이라고 속으로 말해 보면 구조가 훨씬 빨리 몸에 붙습니다. 작성이 끝나면 실행합니다. Extension Pack for Java가 설치되어 있으면 main 메서드 위에 작은 Run 버튼이 나타납니다. 이 버튼 하나가 컴파일과 실행을 순서대로 대신해 줍니다. 누르기 전에 잠깐, 출력이 어떻게 나올지 먼저 예측해 보시죠. 예측하셨다면 실행합니다. 통합 터미널에 "소나타 달린다"와 "제네시스 달린다"가 차례로 출력되면 성공입니다. 같은 모양의 run 호출 두 번이 서로 다른 문장을 출력했다면, 여러분은 방금 동적바인딩을 직접 증명하신 것입니다.

**Practice**
- VS Code 탐색기에서 `src/ex01` 폴더 생성 → `Mem02.java` 생성, 코드 직접 타이핑(클래스명·패키지명 변경 금지).
- main 메서드 위 ▶ Run 버튼 클릭으로 실행(확장이 컴파일 후 실행까지 수행).
- 실행 전 출력 예측 → 통합 터미널의 실제 결과와 비교.
- 확인 실험: `Car s = new Sonata();`를 `Car s = new Genesis();`로 바꿔 다시 Run — 호출 코드(`s.run()`)를 한 글자도 안 고쳤는데 출력이 바뀌는 것을 확인.

**Assessment**
- 없음.

---

## Slide 13. 실습 2(과제): 나만의 추상 타입으로 동적바인딩 구현

**Screen**
- 제목: 과제 — 추상 타입 1개 + 구현 타입 2개
- 짧은 문구:
  - 도메인은 자유 선택: Animal←Dog/Cat, Shape←Circle/Rect, Notifier←Email/Sms …
  - 위치: `src/ex01/example` 폴더 (패키지 `ex01.example`)
  - 조건 1: 추상 클래스에 추상 메서드 1개 이상
  - 조건 2: 구현 클래스 2개가 각자 재정의
  - 조건 3: main에서 반드시 "부모 타입 변수"로 호출
- 화면: 예시 구조도(Animal ← Dog/Cat)와 체크리스트 3개, 좌측 하단에 `src/ex01/example` 폴더 트리. 소요 시간 안내: 수업 내 30분~1시간.

**Easy analogy**
- 요리 학원에서 시범 요리를 본 다음 같은 조리법으로 재료만 바꿔 직접 만들어 보는 단계다. 조리법(구조)은 같고 재료(도메인)만 여러분의 선택이다.

**Practical case**
- 교육용 시나리오: 과제 검사에서 가장 흔한 아쉬운 답안은 `Dog d = new Dog();`처럼 자식 타입 변수로 호출한 코드다. 동작은 하지만 다형성 증명이 아니다. 반드시 `Animal a = new Dog();`처럼 부모 타입 변수에 담아 호출해야 오늘 배운 구조가 된다 — 실무 코드 리뷰에서도 "변수를 추상 타입으로 선언했는가"는 단골 체크 항목이다.

**Visual asset**
- GPT image prompt: `A homework assignment illustration showing an abstract animal blueprint at the top with two concrete animals, a dog and a cat, below it, next to a simple three-item checklist, friendly educational flat style, no readable text.`

**Source**
- 과정개요서 — 유지보수성 향상을 위한 디자인패턴(Java) §5 차시표 ch01 과제(추상 타입 1개와 구현 타입 2개로 동적바인딩 직접 구현)·§7(수업 내 30분~1시간 과제).
- Oracle Java Tutorials – Abstract Methods and Classes: https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html

**Narration**
- 이제 오늘의 과제입니다. 방금 만든 자동차 예제와 똑같은 구조를, 이번에는 여러분이 고른 도메인으로 처음부터 직접 설계해서 구현해 보세요. 동물이 좋다면 추상 클래스 Animal에 소리를 내는 추상 메서드를 두고 Dog와 Cat이 각자 재정의하면 됩니다. 도형이 좋다면 Shape와 Circle, Rect로 넓이를 구해도 좋고, 알림이 좋다면 Notifier와 Email, Sms 구현도 좋습니다. 도메인은 완전히 자유입니다. 다만 세 가지 조건은 꼭 지켜 주세요. 첫째, 추상 클래스에 추상 메서드가 하나 이상 있어야 합니다. 둘째, 구현 클래스 두 개가 그 메서드를 각자 다르게 재정의해야 합니다. 셋째, 이것이 제일 중요한데, main에서 호출할 때 반드시 부모 타입 변수에 자식 객체를 담아 호출해야 합니다. 자식 타입 변수로 호출하면 프로그램은 돌아가지만 오늘 배운 다형성의 증명이 아닙니다. 과제 코드의 위치도 정해 드리겠습니다. 오늘 예제와 섞이지 않도록 ex01 폴더 아래에 example 폴더를 만들고, 그 안에 작성합니다. 파일 첫 줄의 패키지 선언은 ex01.example이 됩니다. 앞으로 매 차시의 과제도 같은 방식으로 그 차시 패키지 아래 example 폴더에 모읍니다. 시간은 수업 내 30분에서 1시간을 드립니다. 완성하시면 옆 사람과 코드를 바꿔 보며 "부모 타입으로 호출했는지"를 서로 확인해 보세요. 빨리 끝난 분은 구현 클래스를 세 번째로 하나 더 추가해 보시기 바랍니다. 기존 main 호출 방식이 전혀 바뀌지 않는다는 것을 느끼실 텐데, 그 감각이 다음 차시에 배울 개방-폐쇄 원칙의 예고편입니다.

**Practice**
- 도메인 선택(예: Animal←Dog/Cat, Shape←Circle/Rect 등 자유).
- `src/ex01/example/` 폴더 생성 후 새 파일 작성(패키지 선언 `package ex01.example;`): 추상 클래스 1개(추상 메서드 1개 이상) + 구현 클래스 2개(각자 재정의) + main 클래스.
- main에서 부모 타입 변수에 자식 객체를 담아 호출(예: `Animal a = new Dog(); a.sound();`).
- VS Code ▶ Run 버튼으로 실행 → 구현별로 다른 출력 확인.
- 심화(선택): 구현 클래스 1개 추가 후 main의 기존 호출 코드가 수정되지 않음을 확인.

**Assessment**
- 없음.

---

## Slide 14. 정리: 오늘 배운 한 문장

**Screen**
- 제목: 상위 타입으로 다루고, 실행 시점에 선택된다
- 화면: 오늘의 핵심을 4단 요약 카드로:
  - 다형성 — 부모 타입 참조에 자식 객체를 담는다
  - 추상 타입 — 약속만 정하고 new는 불가
  - 오버라이드 — 자식이 재정의하면 부모 메서드는 가려진다(무효화)
  - 동적바인딩 — 실행 시점의 실제 객체가 메서드를 결정한다
- 하단 문장: "모든 패턴은 다형성 위에 서 있다 — 다음 시간: 캡슐화·SOLID와 OCP"

**Easy analogy**
- 오늘 배운 것은 운전면허의 원리다. 면허(추상 타입의 계약) 하나로 어떤 차(구현)든 몰 수 있고, 실제로 어떤 차가 달리는지는 시동을 거는 순간(실행 시점)의 차가 결정한다.

**Practical case**
- 실무사례형 시나리오: 내일 출근해서 자기 팀 코드를 열어 보자. 변수 선언부에서 인터페이스나 추상 클래스 타입으로 선언된 곳을 세 군데만 찾아 "여기서 실제 객체는 무엇이고 언제 결정되는가"를 추적해 보면, 오늘 배운 원리가 살아 있는 코드에서 어떻게 쓰이는지 보인다.

**Visual asset**
- GPT image prompt: `A summary slide illustration with four small cards in a row representing polymorphism, abstract type contract, method overriding, and runtime dynamic binding, connected by a single baseline foundation bar, clean minimal educational style, no readable text.`

**Source**
- Oracle Java Tutorials – Polymorphism: https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- 과정개요서 — 유지보수성 향상을 위한 디자인패턴(Java) §5 차시표(ch01·ch02 연결).

**Narration**
- 오늘 내용을 정리하겠습니다. 다형성은 부모 타입의 참조 변수에 자식 객체를 담아, 하나의 타입으로 여러 구현을 다루는 것입니다. 추상 클래스 Car는 run이라는 약속만 정하고 스스로는 객체가 될 수 없었습니다. Sonata와 Genesis는 그 약속을 각자의 내용으로 재정의했고, 재정의된 순간 그 객체 안에서 부모의 run은 무효화됩니다. 그리고 어떤 run이 실행될지는 컴파일 시점이 아니라 실행 시점에, 변수가 아니라 실제 객체를 기준으로 선택됩니다. 이것이 동적바인딩입니다. 이 네 가지를 한 문장으로 줄이면 이렇게 됩니다. 상위 타입으로 다루고, 실행 시점에 선택된다. 이 문장이 이 과정 열여섯 차시 전체를 받치는 주춧돌입니다. 다음 시간에는 캡슐화와 SOLID 원칙, 특히 개방-폐쇄 원칙을 배우면서 "왜 추상에 의존하는 설계가 유지보수에 강한가"에 대한 판단 기준을 세우겠습니다. 오늘 과제를 꼭 완성해 오시고, 가능하다면 팀 코드에서 추상 타입으로 선언된 변수를 찾아보는 것까지 해 보시길 권합니다. 수고하셨습니다.

**Practice**
- 없음.

**Assessment**
- 없음.

---

## Slide 15. 평가하기 1: 사지선다형

**Screen**
- 제목: 평가하기
- 문제: 다음 코드를 실행했을 때 출력과 그 이유로 가장 적절한 것은?

```java
Car s = new Sonata();
s.run();
```

- 보기:
  1. "소나타 달린다" — 실행 시점에 실제 객체인 Sonata의 재정의된 run이 선택되기 때문이다.
  2. 컴파일 오류 — 부모 타입 변수에 자식 객체를 담을 수 없기 때문이다.
  3. 아무것도 출력되지 않는다 — 변수 타입이 Car이므로 몸통 없는 추상 메서드 run이 호출되기 때문이다.
  4. "소나타 달린다" — 컴파일 시점에 컴파일러가 Sonata의 run을 호출하도록 확정해 두기 때문이다.

**Easy analogy**
- 대표번호(부모 타입의 run)로 전화를 걸었을 때, 실제로 받는 사람은 번호가 아니라 그 순간의 당번 담당자(실행 시점의 실제 객체)가 결정한다.

**Practical case**
- 실무사례형 시나리오: 인터페이스 타입 필드로 주입받은 객체의 메서드를 호출하는 코드를 디버깅할 때, 브레이크포인트가 어느 구현 클래스에서 멈출지는 실행 시점에 그 필드에 담긴 실제 객체가 결정한다 — 1번 보기의 원리를 실무에서 매일 확인하는 장면이다.

**Visual asset**
- 화면은 문제 중심. 우측에 작은 아이콘: 부모 타입 변수 → 갈림길 화살표 → 실제 객체의 메서드.

**Source**
- Oracle Java Tutorials – Polymorphism(가상 메서드 호출: 실행 시점 실제 객체 기준 선택): https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- 실습 정답 소스: `code/design-pattern-end/src/ex01/Mem02.java`

**Narration**
- 첫 번째 평가는 오늘의 핵심인 동적바인딩을 확인하는 문제입니다. 정답은 1번입니다. 부모 타입 변수 s에 Sonata 객체를 담고 run을 호출하면, 실행 시점에 실제 객체인 Sonata가 재정의한 run이 선택되어 "소나타 달린다"가 출력됩니다. 2번은 틀렸습니다. 부모 타입 변수에 자식 객체를 담는 것은 Java가 문법으로 허용하는 다형성의 기본입니다. 3번도 틀렸습니다. 변수 타입이 Car라고 해서 추상 메서드가 호출되는 것이 아니라, 실제 객체의 재정의된 메서드가 호출됩니다. 4번은 출력은 맞지만 이유가 틀렸습니다. 어떤 run을 실행할지는 컴파일 시점에 확정되는 것이 아니라 실행 시점에 실제 객체를 보고 선택됩니다. 바로 그래서 "동적" 바인딩이라고 부르는 것입니다. 출력만 맞히는 것이 아니라 이유까지 정확히 고르는 것이 이 문제의 핵심입니다.

**Practice**
- 없음.

**Assessment**
- 유형: 사지선다형
- 정답: 1
- 난이도: 보통
- 해설: 호출될 메서드는 변수의 선언 타입이 아니라 실행 시점에 변수가 참조하는 실제 객체 기준으로 선택되며, 재정의된 Sonata의 run이 실행된다.
- 관련학습보기: Slide 4, Slide 7, Slide 8

---

## Slide 16. 평가하기 2: 진위형

**Screen**
- 제목: 평가하기
- 문제: Java에서 부모(상위) 타입의 참조 변수에 자식(하위) 클래스의 객체를 담을 수 있다. O/X

**Easy analogy**
- "고객 차량"이라고 적힌 발레파킹 주차권으로 소나타든 제네시스든 맡길 수 있는 것과 같다.

**Practical case**
- 실무사례형 시나리오: `List<String> list = new ArrayList<>();`처럼 인터페이스 타입 변수에 구현 객체를 담는 선언은 실무 Java 코드에서 가장 자주 보이는 관용구이며, 정확히 이 문장의 원리다.

**Visual asset**
- 간단한 포함 관계 이미지: 큰 원(Car) 안에 작은 원 두 개(Sonata, Genesis), 옆에 Car 라벨 변수 상자가 작은 원을 가리키는 화살표.

**Source**
- Oracle Java Tutorials – Inheritance(하위 클래스 객체를 상위 타입으로 다룰 수 있음): https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html

**Narration**
- 두 번째 문제는 다형성의 출발점을 확인합니다. 정답은 O입니다. 자식 클래스의 객체는 부모 타입의 일종이므로, 부모 타입의 참조 변수에 담을 수 있습니다. 오늘 예제의 `Car s = new Sonata();`가 정확히 이 문장의 코드 형태입니다. 여러분이 실무에서 매일 쓰는 `List<String> list = new ArrayList<>();`도 같은 원리입니다. 반대 방향은 성립하지 않는다는 점도 함께 기억해 주세요. 자식 타입 변수에 부모 객체를 그냥 담을 수는 없습니다. 소나타 전용 주차권으로 아무 자동차나 찾을 수는 없는 것과 같습니다.

**Practice**
- 없음.

**Assessment**
- 유형: 진위형
- 정답: O
- 난이도: 쉬움
- 해설: 하위 클래스 객체는 상위 타입으로 취급될 수 있어 상위 타입 참조 변수에 담을 수 있다(업캐스팅).
- 관련학습보기: Slide 4, Slide 5

---

## Slide 17. 평가하기 3: 진위형

**Screen**
- 제목: 평가하기
- 문제: 부모 타입 변수로 메서드를 호출하면, 어떤 메서드가 실행될지는 변수의 선언 타입에 따라 컴파일 시점에 최종 결정되므로 항상 부모의 메서드가 실행된다. O/X

**Easy analogy**
- 대표번호로 걸었다고 항상 안내 데스크(부모)가 받는 것이 아니다. 그 시각의 당번 담당자(실행 시점의 실제 객체)가 받는다.

**Practical case**
- 실무사례형 시나리오: "부모 타입으로 받으면 부모 로직이 돌 텐데요?"라는 오해는 코드 리뷰에서 실제로 자주 나온다. 이 오해가 남아 있으면 전략·프록시 같은 패턴 도입 논의가 매번 원점으로 돌아가므로, 팀 차원에서 정확히 짚고 넘어갈 가치가 있다.

**Visual asset**
- 컴파일 시점(서명 확인)과 실행 시점(실제 객체 기준 선택)을 나누어 보여주는 미니 비교 다이어그램.

**Source**
- Oracle Java Tutorials – Polymorphism(가상 메서드 호출): https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- Oracle Java Tutorials – Overriding and Hiding Methods(실행되는 버전은 실행 시점 객체 기준): https://docs.oracle.com/javase/tutorial/java/IandI/override.html

**Narration**
- 세 번째 문제의 정답은 X입니다. 컴파일 시점에 변수의 선언 타입으로 확인하는 것은 "그 타입에 해당 메서드가 존재하는가"까지입니다. 실제로 어떤 메서드가 실행될지는 실행 시점에 변수가 가리키는 실제 객체를 기준으로 선택됩니다. 자식이 재정의했다면 자식의 메서드가 실행됩니다. 오늘 예제에서 s의 선언 타입은 Car였지만 실행된 것은 Sonata의 run이었다는 것을 직접 확인하셨습니다. 만약 이 문장이 O였다면, 그러니까 컴파일 시점에 부모의 메서드로 고정된다면, 구현을 갈아 끼우는 전략 패턴도, 대리자를 끼워 넣는 프록시 패턴도, 프레임워크가 우리 코드를 호출하는 일도 모두 불가능해집니다. 동적바인딩이라는 이름의 "동적"이 실행 시점을 뜻한다는 것을 기억해 주세요.

**Practice**
- 없음.

**Assessment**
- 유형: 진위형
- 정답: X
- 난이도: 보통
- 해설: 메서드 선택은 컴파일 시점의 선언 타입이 아니라 실행 시점의 실제 객체를 기준으로 이루어지며, 재정의된 하위 클래스의 메서드가 실행된다(동적바인딩).
- 관련학습보기: Slide 6, Slide 7, Slide 8

---

## Slide 18. 참고자료

**Screen**
- 제목: 참고자료
- 목록:
  - Oracle Java Tutorials – Polymorphism / Overriding / Abstract Classes / Inheritance
  - Getting Started with Java in VS Code · Extension Pack for Java
  - refactoring.guru 디자인패턴 카탈로그
  - mariofusco/from-gof-to-lambda (GitHub)
  - GoF 패턴의 2025년 유효성 리뷰 (Medium)
  - 과정개요서 · 실습 정답 소스(ex01/Mem02.java)

**Easy analogy**
- 참고자료는 준비운동이 끝난 뒤에도 다시 돌아와 스트레칭할 수 있는 매트와 같다. 언제든 펼쳐서 오늘의 원리를 재확인할 수 있다.

**Practical case**
- 실무사례형 시나리오: 실무 개발자는 기억이 아니라 공식 문서로 확인한다. 특히 언어의 동작 규칙(무엇이 컴파일 시점이고 무엇이 실행 시점인지)은 Oracle 공식 튜토리얼과 매뉴얼로 근거를 확보하는 습관이 중요하다.

**Visual asset**
- 문서, GitHub, 브라우저 아이콘을 단정하게 배치.

**Source**
- https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
- https://docs.oracle.com/javase/tutorial/java/IandI/override.html
- https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html
- https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html
- https://code.visualstudio.com/docs/java/java-tutorial
- https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack
- https://www.oracle.com/java/technologies/downloads/
- https://refactoring.guru/design-patterns/catalog
- https://github.com/mariofusco/from-gof-to-lambda
- https://medium.com/@freddy.dordoni/the-gang-of-four-gave-us-23-design-patterns-are-they-still-relevant-in-2025-f2e999c384c0
- https://www.javacodegeeks.com/2025/12/modern-java-language-features-records-sealed-classes-pattern-matching.html

**Narration**
- 마지막으로 이번 차시에서 활용한 참고자료입니다. Oracle 공식 Java 튜토리얼의 다형성, 오버라이딩, 추상 클래스, 상속 문서는 오늘 다룬 언어 규칙 전체의 근거로 사용했습니다. 특히 다형성 문서의 가상 메서드 호출 설명은 동적바인딩 슬라이드의 직접적인 출처입니다. VS Code의 Java 시작 가이드와 Extension Pack for Java 문서는 실습 환경 설치와 Run 버튼 실행 절차의 근거입니다. refactoring.guru 카탈로그는 앞으로 배울 패턴들의 구조를 미리 훑어보기에 좋은 자료이고, from-gof-to-lambda 저장소는 고전 패턴이 람다로 어떻게 현대화되는지 보여 주는 예제 모음입니다. GoF 패턴의 2025년 유효성을 리뷰한 글과 현대 Java 언어 기능 정리 글은 "패턴은 유효하되 구현이 현대화된다"는 이 과정의 관점을 뒷받침합니다. 과제를 하다 궁금한 점이 생기면 먼저 Oracle 튜토리얼을 열어 보는 습관을 들여 보시길 권합니다. 다음 시간에 뵙겠습니다.

**Practice**
- 없음.

**Assessment**
- 없음.
