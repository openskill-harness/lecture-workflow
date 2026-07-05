# 04. L04 LAB 실습 문제 상황 설계 초안 — spring-mvc-2026

> 이 문서는 **원고가 아니다.** filmed-lab-lesson-pipeline의 `script-agent (실습 문제 상황 설계 초안)` 산출물이며,
> 다음 단계인 `lab-code-agent 계획 수립 → G3 승인`의 **입력**이다.
> 코드는 아직 작성하지 않는다. 실행 검증(validation_log)은 G3 승인 후 lab-code-agent가 수행한다.

- 대상 레슨: **L04 (LAB, 12분)** [추기] 분편안으로 17분(편2) 재배분됨 — "기본 Controller 구현 — 요청 매핑부터 응답까지"
- 학습 목표: goal 2 (기본적인 Controller를 구현할 수 있다) **주**, goal 1 (Controller와 Service의 책임을 구분할 수 있다) **보강**
- 촬영강의 특성: 학생 실습 시간이 아니라 **"단계별 코드 변화를 12분 안에 설명"**하는 walkthrough. 각 단계는 한 화면에서 설명 가능한 크기로 쪼갠다.
- 스택: Java 21, Spring Boot 3.4.x, Gradle 8.x, IntelliJ

---

## 1. 선택한 도메인: **회원 가입 (Member Sign-up)**

**이유:** L03(THEORY, "Controller와 Service의 책임 경계")이 "무엇을 어디에 두는가"를 판단 기준으로 다뤘다.
회원 가입은 **"중복 이메일 검사"라는 진짜 비즈니스 규칙**을 갖고 있어, "왜 이 로직을 Controller가 아니라 Service에 두는가"를
말이 아니라 **코드로 재확인**시킬 수 있다. CRUD 경험자에게 가장 친숙한 소재이며, 하나의 POST 흐름 안에서
`요청 매핑 → 본문 바인딩 → 비즈니스 규칙 → 응답 상태`까지 "요청 매핑부터 응답까지"를 한 도메인으로 끝까지 유지할 수 있다.

- **도서 조회를 고르지 않은 이유:** 읽기 위주라 Service로 분리할 비즈니스 규칙이 빈약 → goal 1(책임 구분) 보강 효과가 약하다.

**중심 서사(끝까지 유지):** "동작하는 뚱뚱한 Controller"를 먼저 만들어 보인 뒤, L03에서 말한 책임 경계가 무너진 지점을
짚고 Service로 분리한다. 즉 **일부러 한 단계 나쁘게 만들었다가 고치는** 구조 — 이것이 goal 1을 코드로 증명하는 장치다.

---

## 2. 영속성·범위 결정 (단순화 방침)

- **DB/JPA 없음.** `MemberRepository`는 `ConcurrentHashMap` 기반 **in-memory 저장소**로 starter에 미리 넣는다.
  이유: 이 레슨의 초점은 "요청 매핑부터 응답까지"(MVC 요청 처리)이지 영속성이 아니다. JPA 설정·엔티티 매핑은 12분을 잡아먹고 주제를 흐린다.
- **Lombok 없음.** 도메인/DTO는 `record`로 두어 필드가 화면에 그대로 보이게 한다(촬영 가독성). 어노테이션 마법을 최소화.
- **Bean Validation은 선택 범위 밖.** 중복 검사(비즈니스 규칙)에 집중하고, `@Valid`/`@NotBlank`는 다루지 않는다(시간·초점). → G3 확인 항목.

---

## 3. starter에 미리 넣을 것 (영상에서 타이핑하지 않는다)

`code/L04/00-starter/` 에 아래를 완성 상태로 배치. **영상은 여기서 시작해 MemberController와 MemberService만 만들어 나간다.**

| 파일 | 내용 | 넣는 이유 |
|------|------|----------|
| `build.gradle` | Spring Boot 3.4.x, Java 21 toolchain, `spring-boot-starter-web`만 | 의존성 세팅은 설명 대상 아님 |
| `settings.gradle` | rootProject 이름 | 보일러플레이트 |
| `MemberApplication.java` | `@SpringBootApplication` main | 부트스트랩은 이미 아는 내용 |
| `Member.java` | `record Member(Long id, String email, String name)` 도메인 | 도메인 모양은 설명 대상 아님 |
| `MemberRepository.java` | in-memory: `save()`(id 자동 증가), `existsByEmail()`, `findById()` | 저장소 구현은 초점 아님. **핵심 메서드 시그니처만 영상에서 호출** |
| `SignUpRequest.java` | `record SignUpRequest(String email, String name)` — 요청 DTO | 필드 정의는 보일러플레이트, 바인딩 "연결"만 영상에서 |
| `SignUpResponse.java` | `record SignUpResponse(Long id, String email)` — 응답 DTO | 상동 |

**starter에 없는 것(= 영상에서 만드는 것):** `MemberController.java`, `MemberService.java`, `DuplicateEmailException.java`(step-05에서 등장).

---

## 4. 단계 목록 초안 (schemas.md §4 step 메타 형식)

> 총 5단계(step-01 ~ step-05=final) + 00-starter. `change_reason`이 비는 단계는 없다.
> `changed_files`는 **예상**이며 lab-code-agent가 실제 생성 시 확정한다.

### step-01 — 요청 매핑 (URL·메서드를 컨트롤러에 연결)
```yaml
step:
  id: step-01
  title: 요청 매핑 — POST /members 를 컨트롤러 메서드에 연결
  previous_state: MemberController가 없음. 요청을 받을 진입점이 아직 존재하지 않는다.
  change_reason: 클라이언트 요청이 도착할 진입점(핸들러)이 필요하다.
  changed_files: [MemberController.java]
  expected_result: POST /members 호출 시 컨트롤러 메서드가 실행되고 고정 문자열이 200으로 응답된다.
  lecture_message: 요청 매핑은 "이 URL·이 메서드가 오면 이 자바 메서드를 실행하라"는 선언이다. L02에서 본 DispatcherServlet이 이 선언을 보고 핸들러를 찾는다.
```

### step-02 — 요청 본문 바인딩 + 응답 DTO 반환
```yaml
step:
  id: step-02
  title: 요청/응답 데이터 흐름 — @RequestBody 로 받고 응답 DTO로 돌려주기
  previous_state: 컨트롤러가 요청 본문을 무시하고 고정 문자열만 반환한다.
  change_reason: 실제 가입은 요청 데이터를 받아 결과 데이터를 돌려줘야 한다.
  changed_files: [MemberController.java]
  expected_result: JSON 본문이 SignUpRequest로 역직렬화되고, 저장 후 SignUpResponse JSON이 반환된다.
  lecture_message: 컨트롤러의 입구와 출구는 도메인 객체가 아니라 요청/응답 전용 DTO다 — 경계에서 데이터의 모양을 바꾼다.
```

### step-03 — (의도적) 뚱뚱한 컨트롤러: 비즈니스 규칙까지 컨트롤러 안에
```yaml
step:
  id: step-03
  title: 가입 규칙을 컨트롤러 안에 넣기 — 중복 이메일 검사 + 저장
  previous_state: 컨트롤러가 받은 데이터를 검증 없이 그대로 저장한다.
  change_reason: 같은 이메일로 중복 가입되면 안 된다는 규칙을 적용해야 한다.
  changed_files: [MemberController.java]
  expected_result: 중복 이메일이면 저장을 막고, 아니면 저장 후 응답한다. 단 이 모든 판단이 컨트롤러 한 곳에 있다.
  lecture_message: 지금 이 코드는 동작한다. 하지만 컨트롤러가 "요청을 받는 일"과 "가입 규칙을 판단하는 일"을 동시에 떠안았다 — L03에서 말한 책임 경계가 무너진 상태다.
```

### step-04 — Service 분리 (goal 1 보강의 핵심)
```yaml
step:
  id: step-04
  title: 책임 분리 — 가입 규칙을 MemberService로 옮기기
  previous_state: 컨트롤러가 요청 처리와 비즈니스 규칙을 모두 처리한다.
  change_reason: 웹 형식과 가입 규칙은 변경 이유가 다르다. 한 곳에 두면 한쪽 변경이 다른 쪽을 흔든다.
  changed_files: [MemberService.java, MemberController.java]
  expected_result: 컨트롤러는 요청 수신·응답 변환만, MemberService가 중복 검사·저장을 담당한다. 동작은 step-03과 동일.
  lecture_message: 분리는 파일을 늘리는 게 아니라 변경 이유를 나누는 것이다. 웹 형식이 바뀌면 Controller만, 가입 규칙이 바뀌면 Service만 고친다.
```

### step-05 (final) — 응답 완성: 상태 코드로 결과 말하기
```yaml
step:
  id: step-05
  title: 응답까지 완성 — 성공 201 Created, 중복 409 Conflict
  previous_state: 성공과 실패가 모두 200으로 나가고, 중복은 예외가 그대로 500이 된다.
  change_reason: "응답까지"란 데이터를 넘겨주는 것을 넘어 결과를 HTTP 상태로 표현하는 것이다.
  changed_files: [MemberController.java, MemberService.java, DuplicateEmailException.java]
  expected_result: 신규 가입은 201 + 응답 DTO, 중복은 409로 응답한다(@ExceptionHandler로 매핑).
  lecture_message: "요청 매핑부터 응답까지"의 마지막 조각은 상태 코드다. 성공은 201, 중복은 409 — 응답은 데이터만이 아니라 결과의 의미를 담는다.
```

**단계 흐름 요약(중심 서사):** 진입점(01) → 데이터 흐름(02) → 동작하지만 뚱뚱한 컨트롤러(03) → **책임 분리(04)** → 응답 완성(05).
03→04가 L03 이론을 코드로 되갚는 지점이다.

---

## 5. 12분 설명 시간 배분 초안

| 구간 | 분 | 내용 |
|------|----|------|
| starter 오리엔테이션 | 1.5 | 미리 넣어둔 파일(도메인·저장소·DTO) 훑고 "여기서 컨트롤러/서비스만 만든다" 선언 |
| step-01 요청 매핑 | 2.0 | @RestController/@PostMapping, DispatcherServlet 연결 상기 |
| step-02 본문·응답 바인딩 | 2.5 | @RequestBody, DTO 경계 개념 (가장 촘촘, 데이터 흐름 핵심) |
| step-03 뚱뚱한 컨트롤러 | 1.5 | 중복 검사 넣고 "동작은 하지만…" 문제 제기 (짧게, 긴장 조성용) |
| step-04 Service 분리 | 2.5 | goal 1 보강 핵심. 변경 이유 분리 논증에 시간 확보 |
| step-05 응답 상태·예외 | 1.5 | 201/409, @ExceptionHandler 정리 |
| 마무리 정리 | 0.5 | "요청 매핑→응답" 전체 지도 되짚기 |
| **합계** | **12.0** | |

- step-02와 step-04에 무게를 실었다(goal 2의 데이터 흐름, goal 1의 책임 분리). step-03은 문제 제기용이라 의도적으로 짧다.

---

## 6. G3에서 사용자가 결정할 선택지

1. **도메인 확정** — 초안은 **회원 가입**. 도서 조회로 바꾸면 Service 분리의 비즈니스 규칙(중복 검사)이 약해져 goal 1 보강이 얕아진다. (권장: 회원 가입 유지)
2. **[핵심] 5단계(뚱뚱한 컨트롤러 → 분리) vs 4단계(처음부터 Service 도입)** —
   - 5단계: 03에서 일부러 책임을 뭉쳤다가 04에서 분리 → L03 이론을 코드로 증명. **단, step-03에 1.5분을 쓴다(시간 리스크).**
   - 4단계: step-03을 생략하고 step-02 직후 바로 Service 도입 → 시간 여유는 늘지만 "왜 분리하나"의 체감이 약해짐.
   - (권장: 5단계 — 이 레슨이 goal 1을 함께 지는 유일한 지점이라 분리의 동기를 코드로 보여줄 가치가 큼)
3. **영속성** — in-memory Map(권장, DB 없음) 확정 여부. JPA를 원하면 별도 시간·초점 비용 발생 → 이 경우 12분 초과 위험을 오케스트레이터에 보고 필요.
4. **Bean Validation 포함 여부** — 초안은 **제외**(중복 규칙에 집중). `@Valid`/`@NotBlank`를 넣으려면 step 추가 또는 step-02 확장 필요 → 시간 재배분.
5. **응답 상태 표현 방식** — 초안은 `ResponseEntity` + `@ExceptionHandler`(중복→409). `@ResponseStatus` 어노테이션 방식으로 갈지의 스타일 선택(사소, lab-code-agent 재량 가능).

---

## 7. 다음 단계 인계 메모 (→ lab-code-agent, G3 승인 후)

- 위 step 메타 5건을 `code/L04/{step}/step.yaml`로 확정하고 starter/step/final 코드 생성.
- 각 step은 **직전 step에서 changed_files만 변경**되도록 diff 최소화(촬영 시 변경점 강조용). 특히 step-03→step-04는 "옮기기"라 컨트롤러에서 빠진 코드가 Service로 그대로 이동하는 게 화면에 보이도록.
- 실행 검증: 각 step이 컴파일·기동되고 expected_result가 재현되는지 확인 → validation_log 산출.
- 슬라이드(slide-storyboard-agent)에는 **긴 코드 전체가 아니라 step별 핵심 변경점**만 넘어간다(파이프라인 규정).
