# 08 — 최종 QA 리포트 (G6 게이트 검수)

- course: spring-mvc-2026 (촬영강의 / filmed / 2편: 편1=30분 L01~L03, 편2=20분 L04)
- 검사 기준: `.claude/skills/lecture-harness/references/quality-gates.md` — 촬영강의 G6 체크리스트 + G6 공통 + 자동 blocker 규칙 (이 기준 밖 취향 지적 없음)
- 검사 방식: **경계면 교차 비교** (존재 확인 아님). 실행 검사는 실제 실행.
- 검사일: 2026-07-05 / agent: qa-agent

## 최종 판정: **G6 통과 가능 (blocker 0)**

- blocker **0** / warning **3** / suggestion **4**
- 자동 blocker 3규칙 전부 미해당. 모든 산출물 status: draft (final 승격 시도 없음 → 승격-blocker 규칙 N/A).
- warning은 품질 개선 항목이며 final을 막지 않는다. 승격 전 처리 권장(비-게이팅).

---

## A. 자동 blocker 규칙 (전부 PASS)

| 규칙 | 결과 | 근거 |
|---|---|---|
| ① panseo_board standalone 중복 등록 | **PASS(해당없음)** | filmed 라인. `artifacts.yaml` 전체 grep — `panseo` 0건 |
| ② required_artifacts 누락 상태 final 승격 | **PASS(N/A)** | `artifacts.yaml` 전 항목 `status: draft` (final 승격 시도 없음) |
| ③ validation_log 실패 step_code final 승격 | **PASS(N/A)** | `05_labcode_L04_validation.log` 전 단계 PASS + ART-CODE-001 draft |

## B. G6 공통 기준

| 항목 | 결과 | 근거 |
|---|---|---|
| qa 리포트 blocker 없음 | **PASS** | 본 리포트 blocker 0 |
| required_artifacts 모두 존재(draft 이상) | **PASS** | 아래 D. 레슨별 전부 draft 존재 |
| Registry ↔ 실제 파일 일치 | **PASS** | 16개 항목 선언 경로 전부 실존(아래 C) |
| 조건부 산출물 조건 대기 | N/A | institutional_export 등 filmed 무관 |

## C. Registry ↔ 실제 파일 (16/16 PASS)

`artifacts.yaml` 전 항목 경로 실존 확인:
- ART-CODE-001 `code/L04/` (00-starter/01/02/03/04/final 6개 프로젝트 + 각 step.yaml) ✓
- ART-SCRIPT-001~004 `scripts/L0{1..4}.md` ✓ / ART-PROMPT-001~004 `scripts/L0{1..4}_prompter.md` ✓
- ART-SIM-001 `simulators/시뮬레이터_MVC요청흐름.html` ✓
- ART-SLIDE-001~004 `slides/L0{1..4}.html` ✓
- ART-CUE-001 `scripts/촬영큐시트.md` ✓ / ART-VLOG-001 `_workspace/05_labcode_L04_validation.log` ✓

## D. required_artifacts (lesson-plan) 대비 (전부 draft 존재)

| 레슨 | required_artifacts | 충족 |
|---|---|---|
| L01 | script, prompter_script, slides | ✓ 전부 draft |
| L02 | simulator, script, prompter_script, slides | ✓ |
| L03 | script, prompter_script, slides | ✓ |
| L04 | step_code, validation_log, script, prompter_script, slides | ✓ |

---

## E. 촬영강의 G6 체크리스트 (라인별) — 항목별 [결과]

### E1. 슬라이드가 강의 흐름의 중심인가? — **[PASS]**
- L01/L02/L03: 슬라이드 중심 진행. L04(LAB)는 슬라이드 9장이 IDE 워크스루의 **브리지/오프닝/결과강조/마무리** 역할(코드 낭독 슬라이드 0장) — LAB에 적합한 구조. 근거: `07_storyboard_L04.md` 인터리브 표, `촬영큐시트.md` 편2.

### E2. 시뮬레이터는 별도 파일 + 슬라이드엔 실행 cue만? — **[PASS]**
- 시뮬레이터 별도 파일 1개. `slides/L02.html`: `<iframe>` 0, `<pre>/<code>` 0, 시뮬레이터 embed 없음 — CUE-A/CUE-C가 실행 cue 카드(파일명/조작/전환만). 전 슬라이드 embed 시뮬레이터/긴 코드 없음.

### E3. 프롬프터가 실제 말하기 흐름으로 읽히는가? — **[PASS]**
- 4개 프롬프터 모두 한 줄=한 호흡, cue 대괄호 분리, `> ref:` 각주 비발화 규칙 명시. 원고의 인용 괄호를 발화에서 제거(정확) → 프롬프터 ⊆ 원고 내용, **원고 밖 내용 0**.

### E4. 나레이션 분량이 duration(250~300자/분) 안인가? — **[PASS]** (실측)
- 스크립트로 재측정(공백 제외, cue/ref/heading 제거):

| 레슨 | duration | 실측 자수 | 자/분 | 판정 |
|---|---|---|---|---|
| L01 | 4분 | 1,025 | 256 | PASS |
| L02 | 10분 | 2,735 | 274 | PASS |
| L03 | 10분 | 2,844 | 284 | PASS |
| L04 | 17분 | 4,564 | 268 | PASS |

### E5. 단계별 코드 변화 이유 + validation_log 성공? — **[PASS]**
- step.yaml 6개 전부 `change_reason` 비어있지 않음(+ lecture_message가 L04 원고 정리문과 일치).
- `05_labcode_L04_validation.log`: 00~final 전 단계 빌드 PASS, final 실기동 HTTP **201/409/201 전부 PASS**. draft 강등·검사불가 0.
- **원고↔소스 교차(주요 식별자 spot check) 일치:** 01 `@RestController`/`@PostMapping`/고정문자열, 02 `@RequestBody SignUpRequest`→`SignUpResponse`, 03 `existsByEmail`+`IllegalStateException`, 04 `@Service MemberService`+생성자주입+`memberService.signUp()`, final `DuplicateEmailException extends RuntimeException`+`@ExceptionHandler`+`ResponseEntity 201/409` — 전부 `scripts/L04.md` 코드블록과 동일.
- starter 도메인 검증: `Member(id,email,name)` record, `MemberRepository.save`(id auto)/`existsByEmail`(boolean), `SignUpResponse(id,email)` — 원고 서술과 일치.

### E6. 긴 설정/반복 코드 실시간 타이핑 강요 안 함? — **[PASS]**
- starter 7종 사전 배치(원고 "미리 준비해 둔 것"), 슬라이드 긴 코드 0, IDE는 diff만. validation_log가 starter warm build 별도 확인.

### E7. constraints(max_slide_words 45, code_font_min_pt 22) 준수? — **[WARNING]**
- **최상위 section 수 = 스토리보드 장수: L01 9=9 / L02 5=5 / L03 11=11 / L04 9=9 (PASS)** (L02는 W2 참조).
- HTML JS 문법 검사: 각 파일 `<script>` 블록 vm.Script 파싱 — 4 슬라이드 + 시뮬레이터 전부 **0 errors**. (node --check는 HTML 직접 파싱 불가 → 임베드 스크립트 추출 검사로 대체.)
- 슬라이드별 단어 수 실측(각주/citation·running kicker 제외, 가운뎃점 복합토큰=1): **L01 max 30 / L02 max 43 / L04 max 32 전부 ≤45 PASS. L03 S05만 초과 → W1.**
- 코드 폰트: L01(SVG 30/34px≈22.5–25.5pt), L02(--code-min 1.92rem≈23pt), L03(--code 22pt) 준수 / L04 주 코드칩 min 30px 준수, 단 2차 식별자 칩 미달 → W3.

---

## F. 경계면 교차 비교 (특별 확인 항목)

### F1. L03 프롬프터 [SLIDE 01~11] ↔ 07_storyboard_L03 S01~S11 ↔ slides/L03.html — **[PASS]** (재넘버링 정합)
- 프롬프터 재넘버링(구 SLIDE 06 → S06+S07 분할, 이후 +1 시프트) **완전 적용**.
- slides/L03.html 11개 section(data-i 1~11) 제목 순서 = 스토리보드 S01~S11:
  1 뚱뚱한 컨트롤러 / 2 홀서버↔주방 / 3 깨지는 3가지 / 4 줄수❌변경이유⭕ / 5 책임 대조표 / 6 트랜잭션경계=Service / **7 [직설] 계층도 Controller→Service→Repository→DB(식당 아이콘 없음)** / 8 오분류 3 / 9 판단기준 / 10 두 질문 / 11 L04 예고.
- 프롬퍼 SLIDE 07 = `[화면: 계층 흐름 — Controller→Service→Repository→DB]`가 슬라이드 7과 정확히 대응. **분할 지점 서사 정합.**

### F2. L02 [SIM STEP n] 마커 개수 ↔ 시뮬레이터 실제 STEP — **[PASS]**
- 프롬퍼 모드 A: STEP 0~10 (11개). 시뮬레이터 `STEPS.A` 배열 **11개**(counter ctot=10). 일치.
- 프롬퍼 모드 B: STEP 0~6 배치클릭 + STEP 7~12 (총 0~12, 13개). 시뮬레이터 `STEPS.B` 배열 **13개**(ctot=12). 일치.
- 내용 정합: A STEP8 직렬화·커밋(ViewResolver 미탐)·postHandle 이전, A STEP9 커밋 후 postHandle, B STEP8 postHandle·렌더링 아직, B STEP10 ViewResolver·11 View렌더·12 afterCompletion — 프롬퍼와 일치.

### F3. 촬영큐시트 ↔ 프롬퍼 마커·파일·디렉토리 — **[PASS]**
- 큐시트 참조 대상 전부 실존: 슬라이드 4개 / 시뮬레이터 1개 / `code/L04` 6개 프로젝트 / 프롬퍼 4개.
- 편1 SIM STEP·모드 A/B, 편2 IDE 단계(00-starter~final)·L04 S1~S9·S8 실행결과 참조가 실제 파일/마커와 정합.

### F4. 슬라이드 S8 수치 ↔ validation_log 실측 — **[PASS]**
- `slides/L04.html` S8: `alice 201 {id:1,email:alice}` / `alice 재시도 409 "이미 가입된 이메일"` / `bob 201 id 2` / `500→409`.
- validation_log TEST1 201 id:1 / TEST2 409 / TEST3 201 id:2와 **완전 일치**(임의 값 없음).

---

## G. 지적 사항 (근거·위치 병기)

### WARNING (3)

**W1 — L03 S05 단어 수 max_slide_words(45) 경계 초과**
- 위치: `slides/L03.html` section data-i="5" "두 계층의 책임 대조표"
- 실측 52어절(running kicker 포함) / chrome(kicker·foot) 제외 시 ~41–47. 최고밀도 슬라이드(2×4 대조표 + `@Valid` 설명 칩 + baton 흐름). `@Valid` 칩 문장("형식이 맞는가"이지…)이 최대 기여.
- 조치 권장: `@Valid` 칩 문장 축약. 게이팅 아님(자동 blocker 아님).

**W2 — L02 스토리보드 slide_count(6) ↔ 물리 section(5) 표기 드리프트**
- 위치: `07_storyboard_L02.md`(header `slide_count: 6`) vs `slides/L02.html`(section 5개, CUE-B 없음)
- 화해됨: `촬영큐시트.md` 편1 6행이 리셋→모드B를 "물리 슬라이드 없음, 편집 마커"로 규정, 스토리보드 CUE-B도 "시뮬레이터 유지·슬라이드 복귀 없음"으로 명세. 설계 의도상 물리 5장이 정답이며 **본 QA 기대치(5)도 충족**. 스토리보드 숫자 라벨만 드리프트.
- 조치 권장: 스토리보드 slide_count를 "5(물리) + CUE-B(비-렌더 오버레이)"로 표기 정정.

**W3 — L04 2차 코드/식별자 칩 폰트가 22pt(≈29–30px) 미달**
- 위치: `slides/L04.html` `.newlist .id` clamp(22px,2.3vw,28px), `.badge404 .code` clamp(22px,…,28px), `.fatbox .ttl` clamp(20px,…,26px) — 최대 26~28px(≈19.5–21pt).
- 주 코드칩(S3 `@PostMapping` `.node .t`/라인61 min 30px)은 준수. 파일 자체 주석도 "≥22pt(min 30px)" 기준 채택. 2차 칩(`MemberController`·`MemberService`·`POST /members`)만 자기 기준 미달.
- 조치 권장: 해당 clamp min을 30px로 상향.

### SUGGESTION (4)

**S1 — L04 프롬퍼 헤더 "전 구간 IDE 화면(슬라이드 없음)" 문구 부정확**
- `scripts/L04_prompter.md` 주석. 실제 브리지 슬라이드 9장(S1~S9) 존재·사용(큐시트/스토리보드 인터리브). 나레이션이 `[IDE 화면]` 마커 기반이고 `[SLIDE n]` 마커가 없다는 점은 사실이나 "슬라이드 없음"은 과소표현. 문구 명확화 권장(내용 충돌 아님).

**S2 — L04 나레이션 "저장소에 메서드가 두 개" vs 실제 3개(findById 미사용)**
- `scripts/L04.md`·`L04_prompter.md`("메서드가 두 개") vs `00-starter/MemberRepository.java`(save/existsByEmail/**findById**). findById는 레슨에서 미참조. 시청자가 파일 열면 인지 가능한 경미 부정확 — findById 제거 또는 "두 개"→"핵심 두 개" 표현 권장.

**S3 — L04 duration 주석 드리프트(12분 잔존)**
- `05_labcode_L04_validation.log` 헤더 "L04 (LAB, 12분)" 및 `scripts/L04.md` `time_budget=12.0` vs lesson-plan/Registry L04=**17분**(편2 재배분). 내부 주석만 스테일, 검증 결과·자수 판정에 영향 없음. 주석 정정 권장.

**S4 — L02 시뮬레이터 DTO 명칭 ↔ L04 실코드 명칭 불일치**
- L02(시뮬레이터/프롬퍼/원고) `MemberSaveRequest`/`MemberResponse` vs L04 실코드 `SignUpRequest`/`SignUpResponse`. L02는 개념 트레이스(동일 도메인 POST /members이나 동일 클래스 주장 아님) → L02 내부는 일관. 편 간 연속성 위해 명칭 통일 고려(경미).

---

## H. 검사 불가 항목
- 없음. 전 항목 실행/대조 완료.
