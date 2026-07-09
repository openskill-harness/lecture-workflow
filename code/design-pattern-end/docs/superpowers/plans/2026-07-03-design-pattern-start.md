# design-pattern-start Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Tasks 1-4 and 16 (mechanical, no user input needed) may use superpowers:subagent-driven-development or superpowers:executing-plans. Tasks 5-15 (per-lecture before code) REQUIRE live dialogue with the user in the main session — do NOT dispatch them to a subagent that cannot ask the user questions; execute them inline, one at a time, in strict numeric order. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `design-pattern-start` — a brand-new, **independent** git repository (sibling folder to `design-pattern-v3`, not a worktree/branch of it) containing only "before" (pattern-not-applied) versions of `ex00`-`ex14`, so the instructor and students can live-type the after (pattern-applied) solution during class.

**Architecture:** `design-pattern-start/src/exNN/...` mirrors `design-pattern-v3/src/exNN/...` package-for-package. Three examples (`ex08`, `ex13`, `ex14`) reuse before/after pairs that already exist in `design-pattern-v3`, copied over as plain files (not shared git history). The remaining eleven examples (`ex00,01,02,03,04,05,06,07,09,10,11`) have no existing before code, so each is drafted through a live discussion with the user, then compiled and run to confirm it demonstrates the intended problem.

**Tech Stack:** Plain Java (JDK, `javac`/`java` only — no build tool, no external libraries), same as `design-pattern-v3`.

## Global Constraints

- `design-pattern-start` is a **brand-new, independent git repository** at `../design-pattern-start` relative to `design-pattern-v3` (i.e. both live side by side under `부산은행/`). It does NOT share commit history with `design-pattern-v3` — no `git worktree`, no shared `.git`. This avoids leaking `design-pattern-v3`'s answer-key commit history to students when this new repo is pushed publicly.
- `design-pattern-v3` (including its `.git`) is never modified by this plan.
- Remote for the new repo: `https://github.com/busan-bank-2026/design-pattern-start.git` (sibling to the existing `design-pattern-v3` remote, `https://github.com/busan-bank-2026/design-pattern-end.git`).
- Before code must actually compile and run (`javac` + `java`) — no blank-fill/TODO method stubs, no missing files.
- Before-code header comments describe the observable symptom only (duplication, brittle `if-else`, tight coupling, type mismatch, etc.) — they must NOT name the design pattern or hint at the fix. (Contrast with `design-pattern-v3`'s comments, which do name the pattern and outline the fix — those are answer-key comments and must not be copied verbatim into `design-pattern-start`.)
- Package/file naming mirrors `design-pattern-v3` (`exNN` package, `App.java` entry point per package).
- No blank-fill/stub approach anywhere in this plan.
- `ex15` is out of scope for this plan.
- **All commands below assume the current working directory is the `design-pattern-start` repo root** (i.e., you have already `cd`'d there per Task 1) unless a step explicitly says otherwise. Where a step needs to read a source file from `design-pattern-v3`, it references it via the relative path `../design-pattern-v3/...`.

---

### Task 1: Create the independent `design-pattern-start` repo

**Files:**
- Create: `design-pattern-start/` (new sibling directory to `design-pattern-v3`, new git repo)
- Create: `design-pattern-start/README.md`
- Create: `design-pattern-start/src/` (empty directory, populated by later tasks)
- Create: `design-pattern-start/bin/` (empty directory, populated by later tasks)

**Interfaces:**
- Produces: the `design-pattern-start` repo root that every later task writes into (and `cd`s stay inside for the rest of this plan).

- [ ] **Step 1: Create the sibling folder and initialize git**

Run from inside `design-pattern-v3` (so `..` is `부산은행/`):

```bash
cd ..
mkdir -p design-pattern-start
cd design-pattern-start
git init -b master
git remote add origin https://github.com/busan-bank-2026/design-pattern-start.git
mkdir -p src bin
```

Expected: `Initialized empty Git repository in .../design-pattern-start/.git/`, and `git remote -v` shows `origin` pointing at the new URL. From this point on, stay `cd`'d into `design-pattern-start` for every remaining task in this plan.

- [ ] **Step 2: Write the student-facing README**

Create `README.md` (at the `design-pattern-start` repo root) with exactly this content:

```markdown
# 디자인 패턴 실습 - 시작 코드 (design-pattern-start)

이 폴더는 강의 실습용 "시작 코드"입니다. 각 예제(`exNN`)에는 디자인 패턴을 적용하기 *전* 상태의
코드만 들어 있습니다. 강의 중 강사와 함께 이 코드를 리팩토링하며 패턴을 적용해봅니다.

## 사전 준비 (폐쇄망 1회)
1. **JDK** 설치 (JRE 아님) — javac 필요
2. **VS Code + Extension Pack for Java** 설치

(외부 JAR·JUnit 라이브러리 불필요)

## 실행 방법

```bash
javac -encoding UTF-8 -d bin src/exNN/*.java
java -cp bin exNN.App
```

`exNN`은 실습할 예제 번호로 바꿔서 실행하세요 (예: `ex01`). 진입점은 각 패키지의 `App.java`입니다.
일부 예제는 하위 패키지(예: `ex08.polling`)를 포함하므로, 그 경우 `javac` 대상 경로와 `java -cp`
실행 시 클래스 이름에 하위 패키지까지 포함해야 합니다.
```

- [ ] **Step 3: Verify the structure**

```bash
find . -maxdepth 1 | sort
```

Expected output:
```
.
./README.md
./bin
./src
```
(plus `./.git`)

- [ ] **Step 4: Commit**

```bash
git add README.md src bin
git commit -m "design-pattern-start: 기본 골격 생성"
```

(If git refuses to add the empty `src`/`bin` directories because they have no tracked files yet, that's expected — later tasks add files into them and the directories will be committed then. Skip committing empty dirs if `git add` reports nothing to add.)

---

### Task 2: `ex08` — copy `polling` as the before code (mechanical)

**Files:**
- Create: `src/ex08/polling/App.java`
- Create: `src/ex08/polling/Customer1.java`
- Create: `src/ex08/polling/LotteMart.java`

**Interfaces:**
- Produces: `ex08.polling.App` runnable entry point. `push` (the Observer-pattern after-version) is added live in class as a sibling package `ex08.push` — not created by this plan.

- [ ] **Step 1: Copy the existing polling package verbatim from `design-pattern-v3`**

```bash
mkdir -p src/ex08/polling
cp ../design-pattern-v3/src/ex08/polling/App.java \
   ../design-pattern-v3/src/ex08/polling/Customer1.java \
   ../design-pattern-v3/src/ex08/polling/LotteMart.java \
   src/ex08/polling/
```

- [ ] **Step 2: Compile**

```bash
javac -encoding UTF-8 -d bin src/ex08/polling/*.java
```

Expected: no compiler errors; `bin/ex08/polling/*.class` created.

- [ ] **Step 3: Run and confirm the problem is observable**

```bash
timeout 8 java -cp bin ex08.polling.App
```

Expected output pattern (timing may vary slightly): a few lines of
`상품이 아직 들어오지 않았어요`, then once the background thread finishes (~5s),
repeated lines of `손님1이 받은 알림 : 상품가 들어왔습니다`. The loop never
terminates on its own (by design — this *is* the polling problem: the customer
must keep asking) — the `timeout 8` cuts it off after 8 seconds for verification
purposes.

- [ ] **Step 4: Commit**

```bash
git add src/ex08 bin/ex08
git commit -m "design-pattern-start: ex08 폴링(before) 코드 추가"
```

---

### Task 3: `ex13` — port `ex12` (Simple Factory) as the before code

**Files:**
- Create: `src/ex13/App.java`
- Create: `src/ex13/DBFactory.java`
- Create: `src/ex13/lib/DB.java`
- Create: `src/ex13/lib/Driver.java`
- Create: `src/ex13/lib/MariaDB.java`
- Create: `src/ex13/lib/OracleDB.java`

**Interfaces:**
- Produces: `ex13.App` runnable entry point. The Factory Method refactor (splitting `DBFactory`'s `if-else` into `MariaDBFactory`/`OracleDBFactory`) is done live in class — not created by this plan.

`design-pattern-v3`'s `ex12` package is literally `ex12`; it must be rewritten to `ex13` (and `ex12.lib` to `ex13.lib`) rather than copied verbatim, since `design-pattern-start` needs its own `ex13` package independent of `ex12`.

- [ ] **Step 1: Create the files with the package renamed**

`src/ex13/App.java`:
```java
package ex13;

import ex13.lib.DB;
import ex13.lib.Driver;

public class App {
    public static void main(String[] args) {
        DBFactory factory = DBFactory.getInstance();
        DB oralceDB = factory.createDB(Driver.MARIA); // DB, MaraiDB
        oralceDB.execute("select");
    }
}
```

`src/ex13/DBFactory.java`:
```java
package ex13;

import ex13.lib.DB;
import ex13.lib.Driver;
import ex13.lib.MariaDB;
import ex13.lib.OracleDB;

public class DBFactory {

    private static DBFactory instance = new DBFactory();

    private DBFactory(){}

    public static DBFactory getInstance(){
        return instance;
    }

    // 단점: OCP 위배
    // 책임 : new를 대신해준다.
    public DB createDB(Driver driver){ // maria, oracle, mysql, mssql
        if(driver.getProtocol().equals("maria")){
            MariaDB mariaDB = new MariaDB();
            mariaDB.setUrl("jdbc:mariadb://127.0.0.1:3306");
            return mariaDB;
        }else if(driver.getProtocol().equals("oracle")){
            OracleDB oracleDB = new OracleDB();
            oracleDB.setUrl("jdbc:oracle:thin://127.0.0.1:8080");
            return oracleDB;
        }else{
            throw new NullPointerException("db driver not found exception");
        }
    }
}
```

`src/ex13/lib/DB.java`:
```java
package ex13.lib;

public interface DB {
    void setUrl(String url);
    int execute(String sql);
}
```

`src/ex13/lib/Driver.java`:
```java
package ex13.lib;

public enum Driver {
    ORACLE("oracle"),
    MARIA("maria");

    private final String protocol;

    Driver(String protocol) {
        this.protocol = protocol;
    }

    public String getProtocol(){
        return protocol;
    }
}
```

`src/ex13/lib/MariaDB.java`:
```java
package ex13.lib;

public class MariaDB implements DB{

    private String path;

    // SQL 쿼리 전송 (1은 성공, -1은 실패)
    public int execute(String sql){
        if(path == null) {
            System.out.println("path : null point error");
            return -1;
        }

        if(sql.equals("select")){
            System.out.println("query execute : "+path+"/"+sql);
            return 1;
        }else{
            System.out.println("query fail : syntax error");
            return -1;
        }
    }

    // DBMS 서버 ip 세팅
    public void setUrl(String path){
        this.path = path;
    }
}
```

`src/ex13/lib/OracleDB.java`:
```java
package ex13.lib;

public class OracleDB implements DB{

    private String url;

    // SQL 쿼리 전송 (1은 성공, -1은 실패)
    public int execute(String sql){
        if(sql.equals("select")){
            System.out.println("query execute : "+url+"/"+sql);
            return 1;
        }else{
            System.out.println("query fail : syntax error");
            return -1;
        }
    }

    // DBMS 서버 ip 세팅
    public void setUrl(String url){
        this.url = url;
    }
}
```

- [ ] **Step 2: Compile**

```bash
javac -encoding UTF-8 -d bin src/ex13/*.java src/ex13/lib/*.java
```

Expected: no compiler errors.

- [ ] **Step 3: Run and confirm**

```bash
java -cp bin ex13.App
```

Expected output: `query execute : jdbc:mariadb://127.0.0.1:3306/select`

- [ ] **Step 4: Commit**

```bash
git add src/ex13 bin/ex13
git commit -m "design-pattern-start: ex13 Simple Factory(before) 코드 추가"
```

---

### Task 4: `ex14` — copy the existing `before` folder (mechanical)

**Files:**
- Create: `src/ex14/App.java`
- Create: `src/ex14/CoffeeFactory.java`

**Interfaces:**
- Produces: `ex14.App` runnable entry point. The `Map`-based after-refactor is done live in class — not created by this plan.

`design-pattern-v3`'s `ex14/before` files use package `ex14.before`; since `design-pattern-start`'s `ex14` folder IS the before state (there's no sibling `after` folder here — that's built live), flatten the package to plain `ex14` to match every other example's convention (`exNN` package with no `.before` suffix).

- [ ] **Step 1: Create the files with the package flattened**

`src/ex14/App.java`:
```java
package ex14;

public class App {
    public static void main(String[] args) {
        CoffeeFactory factory = new CoffeeFactory();
        System.out.println(factory.만들기("라떼"));

        // 새 커피(예: 콜드브루)가 생기면?
        // → CoffeeFactory 의 if-else 를 또 열어서 고쳐야 한다. (귀찮고 위험)
    }
}
```

`src/ex14/CoffeeFactory.java`:
```java
package ex14;

/**
 * 문제 : 새 커피가 생길 때마다 이 만들기() 안의 if-else 를 계속 고쳐야 한다.
 *        (수정에 열려있음 → 유지보수 어려움)
 */
public class CoffeeFactory {

    public String 만들기(String type) {
        if (type.equals("아메리카노")) {
            return "아메리카노";
        } else if (type.equals("라떼")) {
            return "라떼";
        } else if (type.equals("모카")) {
            return "모카";
        } else {
            return "그런 커피 없어요";
        }
    }
}
```

- [ ] **Step 2: Compile**

```bash
javac -encoding UTF-8 -d bin src/ex14/*.java
```

Expected: no compiler errors.

- [ ] **Step 3: Run and confirm**

```bash
java -cp bin ex14.App
```

Expected output: `라떼`

- [ ] **Step 4: Commit**

```bash
git add src/ex14 bin/ex14
git commit -m "design-pattern-start: ex14 커피공장 if-else(before) 코드 추가"
```

---

## Tasks 5-15: per-lecture before code (interactive — main session only)

Each of these eleven tasks follows the identical five-step procedure. They MUST run one at a time,
in order, in the main conversation — each requires the user to describe the concrete problem
scenario before any code is written, per the approved design spec
(`design-pattern-v3/docs/superpowers/specs/2026-07-03-design-pattern-start-design.md`, "이후 진행
방식"). Do not pre-write the Java code for these now; do not skip ahead to a later task before the
current one is committed.

**Shared procedure (repeat for each `exNN` below):**

- [ ] **Step 1: Ask the user for the concrete before-scenario**
  Ask what specific problem situation they want students to see for this lecture (characters, data,
  what goes wrong without the pattern). Use the "Context" line under each task below to remind
  yourself which pattern this lecture leads to — but do not reveal the pattern name or solution
  shape in how the code's comments are written (see Global Constraints).

- [ ] **Step 2: Write the before code**
  Create `src/exNN/*.java` (under the `design-pattern-start` repo root) implementing the discussed
  scenario without the pattern applied. Include a header comment on the entry-point class describing
  the observable symptom only (no pattern name, no fix outline).

- [ ] **Step 3: Compile**
  ```bash
  javac -encoding UTF-8 -d bin src/exNN/*.java
  ```
  Expected: no compiler errors.

- [ ] **Step 4: Run and show the output to the user**
  ```bash
  java -cp bin exNN.App
  ```
  Confirm with the user that the output/behavior demonstrates the intended problem. Revise and
  re-run if not.

- [ ] **Step 5: Commit**
  ```bash
  git add src/exNN bin/exNN
  git commit -m "design-pattern-start: exNN <한 줄 설명>(before) 코드 추가"
  ```

### Task 5: `ex00` — 메모리·다형성 기초 (도입)
**Context:** `design-pattern-v3/src/ex00` has `Mem01.java`, `Mem02.java` — an intro to references vs.
values / polymorphism basics, before any pattern is introduced. There may be no "before/after" split
needed here at all (it's a warm-up, not a pattern refactor) — confirm with the user whether this
lecture even needs a "problem" framing, or if it's typed from scratch as a plain teaching example.

### Task 6: `ex01` — SOLID (OCP)
**Context:** `design-pattern-v3/src/ex01` has `App.java`, `Circle.java`, `Rectangle.java`,
`Shape.java`. The after-version's `App.java` comment already sketches a bad `if-else` example in
pseudocode (`if (종류.equals("사각형")) ...`) — that pseudocode is the starting point for a real
before implementation (a single class computing area by checking a type string/enum with `if-else`,
no `Shape` abstraction).

### Task 7: `ex02` — 전략 (Strategy)
**Context:** `design-pattern-v3/src/ex02` has `Animal.java`, `App.java`, `Doorman.java`,
`Mouse.java`, `Tiger.java`.

### Task 8: `ex03` — 프록시 (Proxy)
**Context:** `design-pattern-v3/src/ex03` has `Animal.java`, `App.java`, `Doorman.java`,
`DoormanProxy.java`, `DoormanProxy2.java`, `Mouse.java`, `Tiger.java`.

### Task 9: `ex04` — 어댑터 (Adapter)
**Context:** `design-pattern-v3/src/ex04` has `Animal.java`, `App.java`, `Doorman.java`, `lib/`,
`Mouse.java`, `RabbitAdapter.java`, `Tiger.java`.

### Task 10: `ex05` — 싱글톤 (Singleton)
**Context:** `design-pattern-v3/src/ex05` has `Animal.java`, `App.java`, `Doorman.java`,
`Mouse.java`, `Tiger.java`.

### Task 11: `ex06` — 템플릿 메서드 (Template Method)
**Context:** `design-pattern-v3/src/ex06` has `App.java` and `teacher/{HTMLTeacher, JavaTeacher,
PythonTeacher, Teacher}.java`.

### Task 12: `ex07` — 위임 (Delegation)
**Context:** `design-pattern-v3/src/ex07` has `App.java` and `student/{HistoryStudent,
HomeworkDelegator, HomeworkType, MathStudent, ScienceStudent, Student}.java`.

### Task 13: `ex09` — 데코레이터 (Decorator)
**Context:** `design-pattern-v3/src/ex09` has `App.java` and `notification/{BasicNotifier,
EmailNotifier, Notifier, SmsNotifier}.java`.

### Task 14: `ex10` — 목 객체 (Mock Object)
**Context:** `design-pattern-v3/src/ex10` has `App.java`, `Meter.java`, `MeterService.java`,
`MockMeter.java`, `RealMeter.java`.

### Task 15: `ex11` — AI 프렌들리·병렬개발 (Mock 활용)
**Context:** `design-pattern-v3/src/ex11` has `App.java`, `MockPayGate.java`, `OrderService.java`,
`OrderServiceTest.java`, `PayGate.java`, `RealPayGate.java`. Note `OrderServiceTest` is a
dependency-free `main()`-based test — if the before-scenario for this lecture builds on `ex10`'s
mock concept, check with the user whether it needs its own test class too.

---

### Task 16: Final integration check, README update, and push

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: every `exNN` folder created in Tasks 2-15.

- [ ] **Step 1: Compile the entire `src` tree at once**

```bash
javac -encoding UTF-8 -d bin $(find src -name '*.java')
```

Expected: no compiler errors across all examples together (catches any cross-file naming collisions
introduced while doing tasks one at a time).

- [ ] **Step 2: Spot-check two or three examples still run as expected**

```bash
java -cp bin ex01.App
java -cp bin ex13.App
```

Expected: same outputs confirmed in Tasks 6 and 3 respectively.

- [ ] **Step 3: Update `README.md`**

Append a short index table listing `ex00`-`ex14` with a one-line, non-spoiler description of "what
you'll see" (symptom only, not the pattern name) for each, mirroring the order in
`design-pattern-v3/README.md`'s 전체 목차 table but with the pattern names removed. Ask the user to
confirm the wording per row before finalizing, since some rows depend on decisions made during
Tasks 5-15.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "design-pattern-start: 전체 통합 확인 및 README 인덱스 정리"
```

- [ ] **Step 5: Push to the new remote**

Confirm with the user immediately before this step (first push to a shared GitHub remote). Then:

```bash
git push -u origin master
```

Expected: the `busan-bank-2026/design-pattern-start` GitHub repo now has all commits from this plan.
