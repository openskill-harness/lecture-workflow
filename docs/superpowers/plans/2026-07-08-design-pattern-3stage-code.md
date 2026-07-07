# 디자인패턴 3단계 실습코드(start·middle·end) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 완성코드 `code/design-pattern-end`(ex02–ex14)를 기준으로, 강의 3단계 실습용 `code/design-pattern-start`(도메인 완성+핵심 메서드 TODO 스켈레톤)와 `code/design-pattern-middle`(디자인패턴 미적용 동작 코드)를 예제별로 만든다.

**Architecture:** end는 이미 존재하는 정답(참조). 각 예제 exNN마다 (1) **start** = end의 도메인/틀 파일을 그대로 복사하되 패턴의 핵심 메서드 본문만 `// TODO` + 컴파일 가능한 더미로 비운 스켈레톤, (2) **middle** = 같은 요구사항을 디자인패턴 없이 푼 동작 코드(안티패턴: if-else·복붙·직접 생성 등)를 새로 집필한다. 세 폴더는 `code/` 아래 병렬로 두고 패키지명은 exNN을 그대로 유지한다(end와 대조 가능).

**Tech Stack:** 순수 Java 21 (빌드도구 없음, `javac`/`java` 직접). 외부 라이브러리 없음. 한글 식별자·주석 사용.

## Global Constraints

- **대상 범위**: ex02 ~ ex14 (13개). **ex01·ex15·ex16 제외**(ex15·ex16은 이미 before/after·ref01~03 구조라 학생 실습 대상이며 start/middle 불필요).
- **패키지명 유지**: start·middle·end 모두 `package exNN;` (하위 패키지 포함, 예 `ex07.teacher`) — end와 1:1 대조 가능해야 함.
- **디렉터리**: start = `code/design-pattern-start/src/exNN/…`, middle = `code/design-pattern-middle/src/exNN/…`. end = `code/design-pattern-end/src/exNN/…`(참조, 수정 금지).
- **start 정의**: end의 도메인·틀 파일을 **그대로 복사**하고, 그 예제 패턴의 **핵심 메서드 본문만** `// TODO: <한글 지시>` + 컴파일되는 더미(값 반환형은 `return 0/null/false`, void는 빈 본문)로 대체한다. import·시그니처·클래스구조·주석은 유지. start는 **컴파일만** 되면 된다(실행 결과는 학생이 채운 뒤라야 정상).
- **middle 정의**: 같은 요구사항을 디자인패턴 없이 해결한 **동작하는** 안티패턴 코드. 각 예제 표의 "middle 설계"를 그대로 구현. middle은 **컴파일 + 실행(`java exNN.App`)이 에러 없이** 끝나야 한다.
- **한글 주석 보존**: end의 교육용 한글 주석 톤을 유지하고, middle에는 "왜 이게 불편한가(패턴이 필요한 이유)" 한 줄 주석을 남긴다.
- **인코딩**: 소스는 UTF-8. 컴파일은 `javac -encoding UTF-8`.
- **커밋**: 각 예제 = 한 커밋(start+middle 함께). 커밋 메시지 끝에 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- **작업 브랜치**: `master`가 아닌 브랜치. 시작 전 `git checkout -b feat/design-pattern-3stage`.
- **주의(더티 트리)**: `code/`는 현재 untracked이고 repo에 다른 미커밋 변경이 있다. 커밋 시 **명시 경로만** add(`git add code/design-pattern-start/src/exNN code/design-pattern-middle/src/exNN`). `git add -A`/`git add -u` 금지.
- **컴파일 산출물 미커밋**: `.class`/`bin/`은 커밋하지 않는다(검증용 임시 `/tmp` 또는 스크래치에 컴파일). 각 프로젝트 루트에 `bin/`을 gitignore.

---

### Task 0: 작업 브랜치 + 병렬 프로젝트 스캐폴드

**Files:**
- Create: `code/design-pattern-start/.gitignore`, `code/design-pattern-middle/.gitignore`

**Interfaces:**
- Produces: `code/design-pattern-start/`, `code/design-pattern-middle/` 두 프로젝트 루트와 `src/` 디렉터리. 이후 모든 예제 태스크가 여기에 파일을 추가.

- [ ] **Step 1: 브랜치 생성**

```bash
cd ~/Documents/course-haness && git checkout -b feat/design-pattern-3stage && git branch --show-current
```
Expected: `feat/design-pattern-3stage`

- [ ] **Step 2: 디렉터리 + gitignore 생성**

```bash
cd ~/Documents/course-haness
mkdir -p code/design-pattern-start/src code/design-pattern-middle/src
printf 'bin/\n*.class\n' > code/design-pattern-start/.gitignore
printf 'bin/\n*.class\n' > code/design-pattern-middle/.gitignore
```

- [ ] **Step 3: 커밋**

```bash
cd ~/Documents/course-haness
git add code/design-pattern-start/.gitignore code/design-pattern-middle/.gitignore
git commit -m "$(cat <<'EOF'
chore(design-pattern): start·middle 병렬 프로젝트 스캐폴드

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

## 예제 태스크 공통 절차 (Task 1~13 각 예제에 동일 적용)

각 예제 태스크는 아래 5스텝을 따른다. `exNN`·`SRC`·`START`·`MID`는 다음으로 고정:
- `SRC=code/design-pattern-end/src/exNN` (참조 원본, 읽기 전용)
- `START=code/design-pattern-start/src/exNN`
- `MID=code/design-pattern-middle/src/exNN`

1. **start 생성**: `SRC`의 파일 트리를 `START`로 복사한 뒤, 그 예제의 "start 스텁 대상" 메서드 본문만 `// TODO` + 더미로 교체.
2. **start 컴파일 검증**: `javac -encoding UTF-8 -d /tmp/dp-start-exNN $(find START -name '*.java')` → 에러 없이 성공(경고만 허용).
3. **middle 생성**: 그 예제의 "middle 설계"대로 `MID`에 파일 작성(안티패턴, 동작).
4. **middle 컴파일+실행 검증**: `javac -encoding UTF-8 -d /tmp/dp-mid-exNN $(find MID -name '*.java')` 성공 후 `java -cp /tmp/dp-mid-exNN exNN.App`(또는 해당 App 경로) 실행이 에러 없이 종료(출력 육안 확인).
5. **커밋**: `git add code/design-pattern-start/src/exNN code/design-pattern-middle/src/exNN` 후 `feat(design-pattern): exNN <패턴명> start·middle` 메시지로 커밋.

> **주의**: ex09처럼 App이 무한루프/스레드면 실행 검증은 몇 초 후 수동 종료하거나 루프 횟수를 유한으로 둔 채 확인한다(해당 태스크에 명시).

---

### Task 1: ex02 — OCP / 다형성  *(파일럿)*

**Files:**
- Create: `code/design-pattern-start/src/ex02/{App,Shape,Circle,Rectangle}.java`
- Create: `code/design-pattern-middle/src/ex02/{App,AreaCalculator}.java`

**start 스텁 대상**: `Circle.넓이()`, `Rectangle.넓이()` 본문만 TODO. (`App`·`Shape`·나머지는 end에서 그대로 복사)
- 예: `Circle.java`
```java
@Override
public double 넓이() {
    // TODO: 반지름(radius)으로 원의 넓이를 반환하세요 (radius * radius * 3.14)
    return 0;
}
```
`Rectangle.넓이()`도 동일 형식(`// TODO: 가로(width)*세로(height)를 반환하세요` / `return 0;`).

**middle 설계** (if-else 면적계산기, 다형성 없음):
- `code/design-pattern-middle/src/ex02/AreaCalculator.java`
```java
package ex02;

// [패턴 미적용] 도형 종류를 if-else로 분기해 넓이를 계산한다.
// 새 도형(삼각형 등)이 생기면 이 메서드를 계속 뜯어고쳐야 한다 → OCP 위반.
public class AreaCalculator {
    public double 넓이(String 종류, double a, double b) {
        if (종류.equals("사각형")) {
            return a * b;
        } else if (종류.equals("원")) {
            return a * a * 3.14;
        } else {
            return 0;
        }
    }
}
```
- `code/design-pattern-middle/src/ex02/App.java`
```java
package ex02;

public class App {
    public static void main(String[] args) {
        AreaCalculator calc = new AreaCalculator();
        System.out.println("넓이 : " + calc.넓이("사각형", 4, 5));
        System.out.println("넓이 : " + calc.넓이("원", 3, 0));
        // 삼각형이 필요하면? AreaCalculator.넓이()의 if-else를 또 고쳐야 한다. ← OCP 위반
    }
}
```

- [ ] **Step 1: start 생성** (`SRC=…/ex02`, 위 스텁 적용)
- [ ] **Step 2: start 컴파일**
Run: `cd ~/Documents/course-haness && javac -encoding UTF-8 -d /tmp/dp-start-ex02 $(find code/design-pattern-start/src/ex02 -name '*.java')`
Expected: 성공(에러 없음).
- [ ] **Step 3: middle 생성** (위 두 파일)
- [ ] **Step 4: middle 컴파일+실행**
Run: `cd ~/Documents/course-haness && javac -encoding UTF-8 -d /tmp/dp-mid-ex02 $(find code/design-pattern-middle/src/ex02 -name '*.java') && java -cp /tmp/dp-mid-ex02 ex02.App`
Expected: `넓이 : 20.0` / `넓이 : 28.26` 출력, 에러 없이 종료.
- [ ] **Step 5: 커밋**
```bash
cd ~/Documents/course-haness
git add code/design-pattern-start/src/ex02 code/design-pattern-middle/src/ex02
git commit -m "$(cat <<'EOF'
feat(design-pattern): ex02 OCP/다형성 start·middle

start: Circle/Rectangle.넓이() TODO 스켈레톤
middle: if-else 면적계산기(다형성 미적용, OCP 위반 예시)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: ex03 — Strategy  *(파일럿, 이 태스크 후 사용자 체크포인트)*

**Files:**
- Create: `code/design-pattern-start/src/ex03/{App,Animal,Mouse,Tiger,Doorman}.java`
- Create: `code/design-pattern-middle/src/ex03/{App,Doorman}.java`

**start 스텁 대상**: `Doorman`의 `setTarget()`·`쫒아내()` 본문만 TODO(필드 `private Animal target;`와 시그니처는 유지). Animal/Mouse/Tiger/App은 end에서 복사.
```java
public void setTarget(Animal target) {
    // TODO: 전달받은 전략(target)을 필드에 저장하세요
}
public void 쫒아내() {
    // TODO: 현재 보유한 전략(target)의 이름으로 "OO 쫒아내"를 출력하세요
}
```

**middle 설계** (전략 필드 없이 하드코딩 if-else):
- `code/design-pattern-middle/src/ex03/Doorman.java`
```java
package ex03;

// [패턴 미적용] 쫒아낼 대상을 문자열로 받아 if-else로 분기한다.
// 새 동물이 생기면 이 메서드를 고쳐야 하고, 런타임에 '전략'을 갈아끼울 수 없다.
public class Doorman {
    public void 쫒아내(String 동물) {
        if (동물.equals("호랑이")) {
            System.out.println("호랑이 쫒아내");
        } else if (동물.equals("쥐")) {
            System.out.println("쥐 쫒아내");
        } else {
            System.out.println("모르는 동물");
        }
    }
}
```
- `code/design-pattern-middle/src/ex03/App.java`
```java
package ex03;

public class App {
    public static void main(String[] args) {
        Doorman doorman = new Doorman();
        doorman.쫒아내("호랑이");
        doorman.쫒아내("쥐");
        // 새 동물이 생기면 Doorman.쫒아내()의 if-else를 또 고쳐야 한다.
    }
}
```

- [ ] **Step 1~5**: 공통 절차(위) 적용. Step 2 start 컴파일 `…-d /tmp/dp-start-ex03 …`, Step 4 `java -cp /tmp/dp-mid-ex03 ex03.App` → `호랑이 쫒아내`/`쥐 쫒아내` 출력. 커밋 메시지 `feat(design-pattern): ex03 Strategy start·middle`.

- [ ] **Step 6: 파일럿 체크포인트**
ex02·ex03 완료 후 사용자에게 두 폴더(`code/design-pattern-start/src/ex02·ex03`, `…-middle/…`)를 보고하고, start 스텁 깊이·middle 안티패턴 방향이 의도에 맞는지 확인받는다. 승인 후 Task 3~13 진행.

---

### Task 3: ex04 — Proxy

**Files:**
- start: `code/design-pattern-start/src/ex04/{App,Animal,Mouse,Tiger,Doorman,DoormanProxy,DoormanProxy2}.java`
- middle: `code/design-pattern-middle/src/ex04/{App,Animal,Mouse,Tiger,Doorman}.java`

**start 스텁 대상**: `DoormanProxy.쫓아내()`·`DoormanProxy2.쫓아내()` 본문만 TODO(원본 Doorman은 복사, 프록시 클래스의 "지갑검사 후 super/위임" 로직만 학생이 채움).
```java
// DoormanProxy
public void 쫓아내(Animal a){
    // TODO: 먼저 "지갑 검사"를 출력한 뒤, 원래 Doorman의 쫓아내(a)를 호출하세요(super)
}
```
DoormanProxy2도 동일 취지(`// TODO: 지갑 검사 후 위임`).

**middle 설계** (프록시 없이 Doorman에 부가기능 직접 삽입 — 단일책임 위반):
- `code/design-pattern-middle/src/ex04/Doorman.java`
```java
package ex04;

// [패턴 미적용] 문지기 본연의 '쫓아내기'에 '지갑 검사'까지 한 메서드에 뒤섞었다.
// 부가기능을 켜고/끄거나 다른 문지기에 재사용할 수 없다(프록시로 분리하면 해결).
public class Doorman {
    public void 쫓아내(Animal a){
        System.out.println("지갑 검사");      // 부가기능이 본체에 박혀버림
        System.out.println(a.getName()+" 쫒아내");
    }
}
```
- `App.java`: `new Doorman().쫓아내(new Mouse());` 호출. Animal/Mouse/Tiger는 end/ex04에서 복사.

- [ ] **Step 1~5**: 공통 절차. Step4 `java -cp /tmp/dp-mid-ex04 ex04.App` → `지갑 검사`/`쥐 쫒아내`. 커밋 `feat(design-pattern): ex04 Proxy start·middle`.

---

### Task 4: ex05 — Adapter

**Files:**
- start: `code/design-pattern-start/src/ex05/{App,Animal,Mouse,Tiger,Doorman,RabbitAdapter,lib/OuterRabbit}.java`
- middle: `code/design-pattern-middle/src/ex05/{App,Animal,Mouse,Tiger,Doorman,lib/OuterRabbit}.java`

**start 스텁 대상**: `RabbitAdapter.getName()` 본문만 TODO(필드·생성자는 유지). 나머지(OuterRabbit·Doorman·Animal 등)는 복사.
```java
@Override
public String getName() {
    // TODO: 어댑터가 감싼 OuterRabbit의 getFullname()을 Animal의 getName()으로 변환해 반환하세요
    return null;
}
```

**middle 설계** (어댑터 없이 — 타입 불일치를 Doorman 오버로딩으로 땜질):
- `code/design-pattern-middle/src/ex05/Doorman.java`
```java
package ex05;

import ex05.lib.OuterRabbit;

// [패턴 미적용] 외부 타입(OuterRabbit)이 Animal이 아니라서, 문지기가 직접 그 타입을 알아야 한다.
// 외부 타입이 늘 때마다 Doorman에 오버로드를 계속 추가해야 한다(어댑터로 감싸면 해결).
public class Doorman {
    public void 쫒아내(Animal a){
        System.out.println(a.getName()+" 쫒아내");
    }
    public void 쫒아내(OuterRabbit r){          // 외부 타입 전용 오버로드(땜질)
        System.out.println(r.getFullname()+" 쫒아내");
    }
}
```
- `lib/OuterRabbit.java`: end에서 복사. `App.java`: `new Doorman().쫒아내(new OuterRabbit());` 호출.

- [ ] **Step 1~5**: 공통. Step4 → `토끼 쫒아내`. 커밋 `feat(design-pattern): ex05 Adapter start·middle`.

---

### Task 5: ex06 — Singleton

**Files:**
- start: `code/design-pattern-start/src/ex06/{App,Animal,Mouse,Tiger,Doorman}.java`
- middle: `code/design-pattern-middle/src/ex06/{App,Animal,Mouse,Tiger,Doorman}.java`

**start 스텁 대상**: `Doorman`의 싱글턴 골격을 부분 스텁 — 필드 `public static Doorman instance = new Doorman();`와 `private Doorman(){}`는 골격으로 두되, 안내 주석으로 학생이 이해하게. **핵심 TODO는 `쫒아내()` 본문**(싱글턴 구조 자체는 틀로 제공, 동작 메서드를 채우게):
```java
public void 쫒아내(Animal a){
    // TODO: a.getName() 으로 "OO 쫒아내"를 출력하세요
}
```
(App은 `Doorman.instance` 사용 그대로 복사.)

**middle 설계** (싱글턴 아님 — new 남발, 인스턴스가 여러 개):
- `code/design-pattern-middle/src/ex06/Doorman.java`
```java
package ex06;

// [패턴 미적용] 생성자가 public이라 아무 데서나 new 로 여러 개 만들어진다.
// 하나만 유지하고 싶어도 강제할 방법이 없다(싱글턴으로 막을 수 있음).
public class Doorman {
    public Doorman() {}
    public void 쫒아내(Animal a){
        System.out.println(a.getName()+" 쫒아내");
    }
}
```
- `App.java`
```java
package ex06;

public class App {
    public static void main(String[] args) {
        Doorman d1 = new Doorman();
        Doorman d2 = new Doorman();   // 또 만들어짐 — 서로 다른 인스턴스
        System.out.println("같은 인스턴스인가? " + (d1 == d2));  // false
        d1.쫒아내(new Tiger());
    }
}
```

- [ ] **Step 1~5**: 공통. Step4 → `같은 인스턴스인가? false`/`호랑이 쫒아내`. 커밋 `feat(design-pattern): ex06 Singleton start·middle`.

---

### Task 6: ex07 — Template Method

**Files:**
- start: `code/design-pattern-start/src/ex07/{App,teacher/Teacher,teacher/HTMLTeacher,teacher/JavaTeacher,teacher/PythonTeacher}.java`
- middle: `code/design-pattern-middle/src/ex07/{App,teacher/HTMLTeacher,teacher/JavaTeacher,teacher/PythonTeacher}.java`

**start 스텁 대상**: `Teacher`의 템플릿 `수업하기()`와 공통 훅은 **그대로 제공**(틀), 각 구체 교사의 `강의하기()` 본문만 TODO.
```java
// HTMLTeacher
@Override
public void 강의하기() {
    // TODO: "HTML 강의하기" 를 출력하세요
}
```

**middle 설계** (템플릿 없이 — 각 교사가 전체 흐름을 복붙):
- `teacher/Teacher.java` 없음(공통 틀을 없앤 게 핵심). 각 교사가 독립 클래스로 `수업하기()`를 통째로 가진다.
- `code/design-pattern-middle/src/ex07/teacher/HTMLTeacher.java`
```java
package ex07.teacher;

// [패턴 미적용] 입장/출석/퇴장 공통 흐름을 교사마다 복붙한다.
// 공통 흐름이 바뀌면 모든 교사 클래스를 다 고쳐야 한다(템플릿 메서드로 한 곳에 모을 수 있음).
public class HTMLTeacher {
    public void 수업하기() {
        System.out.println("입장하기");
        System.out.println("출석부르기");
        System.out.println("HTML 강의하기");
        System.out.println("퇴장하기");
    }
}
```
JavaTeacher·PythonTeacher도 동일 구조(강의 줄만 `자바 강의하기`/`파이썬 강의하기`, 나머지 3줄 복붙).
- `App.java`: `new HTMLTeacher().수업하기();`

- [ ] **Step 1~5**: 공통. Step4 → 4줄(입장/출석/HTML 강의/퇴장). 커밋 `feat(design-pattern): ex07 Template Method start·middle`.

---

### Task 7: ex08 — Delegation

**Files:**
- start: `code/design-pattern-start/src/ex08/{App,student/Student,student/HomeworkType,student/MathStudent,student/ScienceStudent,student/HistoryStudent,student/HomeworkDelegator}.java`
- middle: `code/design-pattern-middle/src/ex08/{App,HomeworkType,HomeworkDelegator}.java`

**start 스텁 대상**: 각 학생의 `doHomework()`·`isSameHomework()` 본문 TODO, `HomeworkDelegator.delegateHomework()` 본문 TODO(구조·리스트 등록은 틀로 제공).
```java
// MathStudent
@Override public void doHomework() {
    // TODO: "수학 숙제를 합니다" 출력
}
@Override public boolean isSameHomework(HomeworkType t) {
    // TODO: t가 MATH인지 비교해 반환
    return false;
}
```

**middle 설계** (위임 없이 — Delegator가 if-else로 직접 수행):
- `code/design-pattern-middle/src/ex08/HomeworkDelegator.java`
```java
package ex08;

// [패턴 미적용] 위임 대상 객체 없이, 한 클래스가 모든 과목 숙제를 if-else로 직접 처리한다.
// 새 과목이 생기면 이 메서드를 계속 고쳐야 한다(학생 객체에 위임하면 클래스 추가로 끝).
public class HomeworkDelegator {
    public void delegateHomework(HomeworkType type) {
        if (type == HomeworkType.MATH) {
            System.out.println("수학 숙제를 합니다");
        } else if (type == HomeworkType.SCIENCE) {
            System.out.println("과학 숙제를 합니다");
        } else if (type == HomeworkType.HISTORY) {
            System.out.println("역사 숙제를 합니다");
        }
    }
}
```
- `HomeworkType.java`: `public enum HomeworkType { MATH, SCIENCE, HISTORY }` (middle은 하위패키지 없이 ex08 루트). `App.java`: 세 타입 호출.

- [ ] **Step 1~5**: 공통. Step4 → 3줄 숙제 출력. 커밋 `feat(design-pattern): ex08 Delegation start·middle`.

---

### Task 8: ex09 — Observer (polling → push)

**특이사항**: end는 `push/`(Observer)와 `polling/`(비효율 대안)을 모두 포함한다. 따라서 이 예제의 **middle = polling 버전**, **end = push 버전**이 자연 대응한다.

**Files:**
- start: `code/design-pattern-start/src/ex09/push/…`(end의 push 트리 복사 + 스텁)
- middle: `code/design-pattern-middle/src/ex09/polling/{App,LotteMart,Customer1}.java`(end의 polling을 그대로 middle로 이식)

**start 스텁 대상**(push): `Mart` 구현체(`LotteMart`·`EMart`)의 `add()`·`remove()`·`notify()` 본문 TODO(구독자 리스트 필드·구조는 틀 제공), `received()`는 복사.
```java
@Override public void add(Customer customer) {
    // TODO: 구독자 명단(customerList)에 customer를 추가하세요
}
@Override public void notify(String msg) {
    // TODO: 모든 구독자에게 update(msg)를 호출하세요
}
```

**middle 설계**(polling): end `code/design-pattern-end/src/ex09/polling/`의 App·LotteMart·Customer1을 **그대로 복사**하고, 파일 상단에 한 줄 주석 추가:
```java
// [패턴 미적용] 구독/알림(push) 대신, 손님이 1초마다 직접 물어본다(polling).
// 주기 설정이 애매하고 낭비가 크다(옵저버 push로 바꾸면 입고 즉시 통지).
```

**실행 검증 주의**: polling App은 `while(true)` 무한 루프다. Step4에서 `java` 실행 후 **약 8초 뒤 Ctrl-C(또는 타임아웃)로 종료**하고 "상품이 들어왔습니다" 알림이 뜨는지 육안 확인한다. (무한 실행이 정상 동작이므로 컴파일 성공 + 초기 몇 줄 출력 확인으로 통과 처리.)
Run 예: `cd ~/Documents/course-haness && javac -encoding UTF-8 -d /tmp/dp-mid-ex09 $(find code/design-pattern-middle/src/ex09 -name '*.java') && timeout 8 java -cp /tmp/dp-mid-ex09 ex09.polling.App; echo "(timeout으로 종료 = 정상)"`
Expected: "상품이 아직..." 여러 줄 후 "상품가 들어왔습니다" 알림, timeout 종료.

- [ ] **Step 1: start(push) 생성** — end push 트리 복사 + 위 스텁.
- [ ] **Step 2: start 컴파일** `…-d /tmp/dp-start-ex09 $(find code/design-pattern-start/src/ex09 -name '*.java')` 성공.
- [ ] **Step 3: middle(polling) 생성** — end polling 복사 + 안티패턴 주석.
- [ ] **Step 4: middle 컴파일+실행**(위 timeout 방식).
- [ ] **Step 5: 커밋** `feat(design-pattern): ex09 Observer(polling→push) start·middle`.

---

### Task 9: ex10 — Decorator

**Files:**
- start: `code/design-pattern-start/src/ex10/{App,notification/Notifier,notification/BasicNotifier,notification/EmailNotifier,notification/SmsNotifier}.java`
- middle: `code/design-pattern-middle/src/ex10/{App,notification/Notifier,notification/BasicNotifier,notification/BasicSms,notification/BasicEmail,notification/BasicSmsEmail}.java`

**start 스텁 대상**: `EmailNotifier`·`SmsNotifier`의 `send()` 본문 TODO(감쌀 `Notifier notifier` 필드·두 생성자는 틀 제공). BasicNotifier·Notifier·App은 복사.
```java
// EmailNotifier
public void send(){
    // TODO: 감싼 notifier가 있으면 먼저 send() 호출 후, "이메일 알림"을 출력하세요
}
```

**middle 설계** (데코레이터 없이 — 조합마다 클래스를 따로 만듦, 조합 폭발):
- `notification/BasicNotifier`(기본), `BasicSms`(기본+문자), `BasicEmail`(기본+이메일), `BasicSmsEmail`(기본+문자+이메일) 각각 독립 클래스로 하드코딩.
```java
package ex10.notification;
// [패턴 미적용] 알림 조합마다 클래스를 따로 만든다. 조합이 늘면 클래스가 기하급수로 폭발한다.
public class BasicSmsEmail implements Notifier {
    public void send(){
        System.out.println("기본 알림");
        System.out.println("문자 알림");
        System.out.println("이메일 알림");
    }
}
```
(BasicSms=기본+문자, BasicEmail=기본+이메일 동일 형식.) `App.java`: 네 조합을 각각 `new ...().send()`.

- [ ] **Step 1~5**: 공통. Step4 → 각 조합 출력. 커밋 `feat(design-pattern): ex10 Decorator start·middle`.

---

### Task 10: ex11 — DI/Mock (인터페이스 주입)

**Files:**
- start: `code/design-pattern-start/src/ex11/{App,Meter,MeterService,MockMeter,RealMeter}.java`
- middle: `code/design-pattern-middle/src/ex11/{App,MeterService,RealMeter}.java`

**start 스텁 대상**: `MeterService.render()` 본문 TODO(주입 필드·생성자는 틀), `MockMeter.getStep()`·`RealMeter.getStep()` 본문 TODO. Meter 인터페이스·App 복사.

**middle 설계** (인터페이스/주입 없이 — MeterService가 Real을 직접 생성, 교체·목킹 불가):
- `code/design-pattern-middle/src/ex11/MeterService.java`
```java
package ex11;

// [패턴 미적용] MeterService가 RealMeter를 직접 new 한다.
// RealMeter가 아직 없거나 느리면 개발/테스트를 시작조차 못 한다(인터페이스+주입으로 Mock 교체 가능).
public class MeterService {
    private RealMeter meter = new RealMeter();   // 구현에 직접 의존
    public void render(){
        System.out.println("걸음 수 : " + meter.getStep());
    }
}
```
- `RealMeter.java`(구체 클래스, 인터페이스 미구현): `public int getStep(){ return 100; }`. `App.java`: `new MeterService().render();`

- [ ] **Step 1~5**: 공통. Step4 → `걸음 수 : 100`. 커밋 `feat(design-pattern): ex11 DI/Mock start·middle`.

---

### Task 11: ex12 — DI/Mock + 단위테스트

**Files:**
- start: `code/design-pattern-start/src/ex12/{App,PayGate,OrderService,MockPayGate,RealPayGate,OrderServiceTest}.java`
- middle: `code/design-pattern-middle/src/ex12/{App,OrderService,RealPayGate}.java`

**start 스텁 대상**: `OrderService.주문()` 본문 TODO(주입 필드·생성자 틀), `MockPayGate.결제()`·`RealPayGate.결제()` 본문 TODO. PayGate·App·OrderServiceTest 복사(테스트는 학생이 주문()을 채우면 통과).
```java
// OrderService
public boolean 주문(int amount) {
    // TODO: amount가 0 이하면 false, 아니면 payGate.결제(amount) 결과를 반환하세요
    return false;
}
```

**middle 설계** (주입 없이 — OrderService가 RealPayGate 직접 생성, 테스트 불가):
- `code/design-pattern-middle/src/ex12/OrderService.java`
```java
package ex12;

// [패턴 미적용] OrderService가 RealPayGate를 직접 new 한다.
// 진짜 결제서버 없이는 주문 로직만 따로 테스트할 수 없다(PayGate 주입 + Mock으로 해결).
public class OrderService {
    private RealPayGate payGate = new RealPayGate();  // 구현에 직접 의존
    public boolean 주문(int amount) {
        if (amount <= 0) return false;
        return payGate.결제(amount);
    }
}
```
- `RealPayGate.java`(구체, 인터페이스 미구현): end의 RealPayGate 로직에서 `implements PayGate`/`@Override`만 제거. `App.java`: `new OrderService().주문(1000)` 출력.

- [ ] **Step 1~5**: 공통. Step4 → `[진짜] 결제 성공 : 1000원` 류 출력. 커밋 `feat(design-pattern): ex12 DI/Mock+테스트 start·middle`.

---

### Task 12: ex13 — Simple Factory

**Files:**
- start: `code/design-pattern-start/src/ex13/{App,DBFactory,lib/DB,lib/Driver,lib/MariaDB,lib/OracleDB}.java`
- middle: `code/design-pattern-middle/src/ex13/{App,lib/DB,lib/Driver,lib/MariaDB,lib/OracleDB}.java`

**start 스텁 대상**: `DBFactory.createDB(Driver)` 본문 TODO(싱글턴 골격은 틀 제공). lib/* 복사.
```java
public DB createDB(Driver driver){
    // TODO: driver.getProtocol()이 "maria"면 MariaDB, "oracle"이면 OracleDB를 생성하고
    //       각자 setUrl(...) 후 반환하세요. 없으면 예외를 던지세요.
    return null;
}
```

**middle 설계** (팩토리 없이 — App이 직접 new + setUrl, 생성 코드 흩뿌려짐):
- `code/design-pattern-middle/src/ex13/App.java`
```java
package ex13;

import ex13.lib.MariaDB;

// [패턴 미적용] 객체 생성(new + setUrl 세팅)을 사용하는 쪽(App)이 직접 한다.
// 같은 생성 코드가 여러 곳에 흩어지고, DB 종류가 늘면 App들을 다 고쳐야 한다(팩토리로 한 곳에 모음).
public class App {
    public static void main(String[] args) {
        MariaDB db = new MariaDB();
        db.setUrl("jdbc:mariadb://127.0.0.1:3306");  // 생성 세부를 App이 떠안음
        db.execute("select");
    }
}
```
- `lib/*`: end/ex13/lib에서 복사(DB·Driver·MariaDB·OracleDB).

- [ ] **Step 1~5**: 공통. Step4 → `query execute : jdbc:mariadb://…/select`. 커밋 `feat(design-pattern): ex13 Simple Factory start·middle`.

---

### Task 13: ex14 — Factory Method

**Files:**
- start: `code/design-pattern-start/src/ex14/{App,DB,DBFactory,MariaDB,OracleDB,MariaDBFactory,OracleDBFactory}.java`
- middle: `code/design-pattern-middle/src/ex14/{App,DB,MariaDB,OracleDB,DBFactory}.java`

**start 스텁 대상**: `MariaDBFactory.생성()`·`OracleDBFactory.생성()` 본문 TODO(추상 `DBFactory`의 `생성()` 추상 + `준비()` 틀은 그대로 제공). DB·MariaDB·OracleDB 복사.
```java
// MariaDBFactory
@Override public DB 생성() {
    // TODO: MariaDB를 만들고 setUrl("jdbc:mariadb://127.0.0.1:3306") 후 반환하세요
    return null;
}
```

**middle 설계** (팩토리 메서드 없이 — if-else Simple Factory, end 주석이 대조 대상으로 명시한 그 버전):
- `code/design-pattern-middle/src/ex14/DBFactory.java`
```java
package ex14;

// [패턴 미적용] 한 팩토리가 if-else로 무엇을 만들지 직접 분기한다(Simple Factory).
// 새 DB가 생기면 이 if-else를 고쳐야 한다 → OCP 위반(팩토리 메서드로 서브클래스에 위임하면 해결).
public class DBFactory {
    public DB 준비(String 종류) {
        DB db;
        if (종류.equals("maria")) {
            MariaDB m = new MariaDB();
            m.setUrl("jdbc:mariadb://127.0.0.1:3306");
            db = m;
        } else if (종류.equals("oracle")) {
            OracleDB o = new OracleDB();
            o.setUrl("jdbc:oracle:thin://127.0.0.1:8080");
            db = o;
        } else {
            throw new IllegalArgumentException("모르는 DB");
        }
        System.out.println("DB 연결 완료");
        return db;
    }
}
```
- `DB`·`MariaDB`·`OracleDB`: end/ex14에서 복사(제품은 동일). `App.java`: `new DBFactory().준비("maria").execute("select");`

- [ ] **Step 1~5**: 공통. Step4 → `DB 연결 완료`/`query execute : …/select`. 커밋 `feat(design-pattern): ex14 Factory Method start·middle`.

---

### Task 14: 전체 컴파일 스모크 + 단계별 README

**Files:**
- Create: `code/design-pattern-start/README.md`, `code/design-pattern-middle/README.md`

**Interfaces:**
- Consumes: Task 1~13 산출물 전체.

- [ ] **Step 1: start 전체 컴파일 스모크**
Run: `cd ~/Documents/course-haness && for d in code/design-pattern-start/src/ex*; do ex=$(basename $d); javac -encoding UTF-8 -d /tmp/dp-start-all/$ex $(find $d -name '*.java') && echo "OK start $ex" || echo "FAIL start $ex"; done`
Expected: ex02~ex14 전부 `OK`.

- [ ] **Step 2: middle 전체 컴파일 스모크**
Run: `cd ~/Documents/course-haness && for d in code/design-pattern-middle/src/ex*; do ex=$(basename $d); javac -encoding UTF-8 -d /tmp/dp-mid-all/$ex $(find $d -name '*.java') && echo "OK middle $ex" || echo "FAIL middle $ex"; done`
Expected: ex02~ex14 전부 `OK`.

- [ ] **Step 3: README 작성** (각 폴더)
`code/design-pattern-start/README.md`:
```markdown
# design-pattern-start (시작코드)

강의 3단계 실습의 1단계. 학생에게 배포하는 스켈레톤입니다.
도메인 클래스와 틀(구조)은 채워져 있고, **각 예제 디자인패턴의 핵심 메서드 본문만 `// TODO`** 로 비어 있습니다.
학생은 TODO만 채우면 됩니다. 컴파일은 되지만(더미 반환), 실행 결과는 TODO를 채워야 정상입니다.

- 대상 예제: ex02~ex14 (패턴별 1개)
- 정답: `../design-pattern-end`
- 실행: `javac -encoding UTF-8 -d bin $(find src/exNN -name '*.java') && java -cp bin exNN.App`
```
`code/design-pattern-middle/README.md`:
```markdown
# design-pattern-middle (망가진 코드 — 패턴 미적용)

강의 3단계 실습의 2단계. 같은 요구사항을 **디자인패턴 없이** 푼 동작 코드입니다.
if-else·복붙·직접 생성 등 안티패턴으로 "왜 패턴이 필요한가"를 체감시키는 용도입니다.
각 파일 상단 주석에 불편한 이유를 적어 두었습니다. 이 단계를 함께 실습한 뒤 `../design-pattern-end`(패턴 적용)로 리팩터링합니다.

- 대상 예제: ex02~ex14
- 실행: `javac -encoding UTF-8 -d bin $(find src/exNN -name '*.java') && java -cp bin exNN.App`
```

- [ ] **Step 4: 커밋**
```bash
cd ~/Documents/course-haness
git add code/design-pattern-start/README.md code/design-pattern-middle/README.md
git commit -m "$(cat <<'EOF'
docs(design-pattern): start·middle README(3단계 실습 안내)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review (작성자 체크)

- **Spec 커버리지**: 요구된 ex02~ex14 (ex01·ex15·ex16 제외) 13개 각각 start+middle 태스크(Task 1~13) 존재. 스캐폴드(Task 0), 파일럿 체크포인트(Task 2 Step 6), 전체 스모크+README(Task 14) 포함. start 정의("도메인 완성+핵심 TODO")·middle 정의("패턴 미적용 동작")·디렉터리(code/ 병렬)·end 미변경 전부 반영.
- **Placeholder 스캔**: 각 middle은 실제 코드 제시, 각 start는 스텁 대상 메서드와 TODO 문구를 구체 명시("적절히" 류 없음). 컴파일/실행 검증 명령과 기대 출력 명시. ex09 무한루프는 timeout 처리 명시.
- **타입/이름 정합**: 패키지명 exNN 일관(start·middle·end 동일), 검증 산출물 경로 `/tmp/dp-*-exNN` 일관, 각 App의 진입점 `exNN.App`(ex09만 `ex09.polling.App`) 정확. start는 컴파일만/ middle은 컴파일+실행 — 전역 제약과 각 태스크 Step 일치.
- **범위 주의**: middle의 하위패키지 단순화(ex08 HomeworkType를 ex08 루트로, ex10 조합 클래스) 등은 "패턴 미적용"의 자연스러운 형태이며 end와 대조를 해치지 않음(패키지 루트는 exNN 유지).
