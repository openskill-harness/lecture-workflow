# 최종 QA 리포트 — spring-mvc-offline-2026 (G6 게이트 검수 · 오프라인 라인 첫 드라이런)

- 검수 일자: 2026-07-05
- 검수 주체: qa-agent
- 검사 기준: `.claude/skills/lecture-harness/references/quality-gates.md` (오프라인 G6 + G6 공통 + 자동 blocker + v1.8 원고=책 + v1.9 d2 스타일 게이트 + v1.7 타입-밀도)
- 대상: `manifest.yaml`(slide_mode: summary), `lesson-plan.yaml`(required_artifacts), `artifacts.yaml` 전 항목
- 판정 요약: **Blocker 1 · Warning 3 · Suggestion 1 → 현 상태 G6 통과 불가(해소 시 통과 가능)**

---

## 0. 심각도별 결론

| 심각도 | 개수 | 항목 |
|---|---|---|
| Blocker | 1 | B1 (L03 slides required-but-absent) |
| Warning | 3 | W1 (원고 미등록) · W2 (LAB 설계·판정 미등록) · W3 (required_artifacts↔pipeline 조건부 불일치) |
| Suggestion | 1 | S1 (슬라이드 파일명 vs 타입) |
| 검사 불가 | 0 | — |

자동 blocker 규칙 3종 점검: rule1(panseo_board_html 중복) **미해당** / rule2(required_artifacts 누락 final 승격) **해당 → B1** / rule3(validation_log 실패 step 승격) **미해당**.

---

## 1. 경계면 교차 비교 (핵심)

### 1-1. Registry ↔ 파일 — [부분 FAIL → W1/W2]
- artifacts.yaml 13개 항목 전부 실존·경로 일치. Registry→파일 방향 **PASS**.
- **역방향 공백**: 아래 required/핵심 산출물이 파일로 존재하나 Registry에 미등록.
  - `scripts/L01.md`, `scripts/L02.md` — 원고(v1.8 book-format, "script" required_artifact, 원고=책 검사 대상) → **미등록 (W1)**
  - `_workspace/03_lab_L03.yaml`, `04_lab_L03_plan.md`(LAB "script"=실습 문제 상황 설계), `09_sim_offline_profile_check.md`(판정 기록) → **미등록 (W2)**
  - 대조: concept_model·architecture_diagram·validation_log는 _workspace에서 등록됨 → 등록 기준 불일치.
- panseo_board_html 미등록 확인(자동 blocker rule1 미해당) — Registry에는 panseo_slide_html ×2, panseo_script ×2만 존재. **PASS**

### 1-2. 판서슬라이드(summary) L01(7컷)/L02(8컷) — [PASS]
- 컷 수 = `.step` 수: L01 7 / L02 8 **일치**. 첫 컷만 `class="step active"`, 나머지 `step` **PASS**.
- `node --check`(script 블록 추출): L01/L02 **문법 오류 0 (PASS)**.
- 판서보드 기능 내장: `#board`/toggleBoard/모눈 격자/`#pad` 캔버스/툴바 — panseo-slide 엔진 내장 **확인**.
- 글자 적음/판서 여백(v1.7 타입-밀도): 전 컷이 h1(한 줄)+sub(보조 한 줄) 구조. h1 ≤ 6단어, sub ≤ 14단어, 코드칩·45단어 근접 장 **없음** → 고밀도 아님, **warning 미발생. PASS**.

### 1-3. 원고 ↔ 판서슬라이드 ↔ 대본 3자 정합 — [PASS]
- 컷 경계: L01 원고 7컷 = 판서대본 7컷 = 슬라이드 7컷 / L02 8=8=8 **일치**.
- summary 한 줄: 슬라이드 컷 헤드라인 ↔ 원고 `> summary 슬라이드:` ↔ 판서대본 컷 제목 대조 일치(예: L01 컷1 "요청 하나 = 서블릿 하나?").
- [비유 이탈]: L02 컷5에서 3자 정합 — 원고 `[비유 이탈 — 직설]`, 판서대본 `[비유 이탈 — 식당 비유를 일부러 버립니다]`, Registry 노트 "[비유 이탈] 컷5 반영", 슬라이드 컷5 "트랜잭션 경계=유스케이스 경계=Service". **일치**.

### 1-4. 원고=책 (v1.8 / v1.9) — [PASS]
- `[IMG:` 잔존 **0**. **PASS**
- IMAGE PROMPT 처리 완료: `<img>` 존재 + 파일 실존 — L01 `ol1-dispatcher-desk.png`, L02 `ol2-fat-controller.png` 모두 참조·실존. (scripts/L01.md 18행의 `[IMAGE PROMPT]`는 메타 주석 설명이지 미처리 블록 아님.) **PASS**
- d2 블록 수 == SVG 병기 == 렌더 파일: **L01 5/5/5, L02 7/7/7 완전 일치**. **PASS**
- d2 스타일 게이트(v1.9): 12개 d2 소스 전부 `direction: right`; 명시 fill = `#f0f0f0`/`#eeeeee`(+white 키워드)로 허용 범위 내; SVG 테마색(#0D32B2·#F7F8FE·#EDF0FD·#E3E9FD·#EEF1F8) 잔존 **0**; streaks 잔존 **0**. **PASS**
- 주요 컷마다 예시/비유 서술 + 시각요소(d2/img) 존재 — 스팟 확인 **PASS**.
- 프롬프터 자수: 헤더가 비발화(판서·문답·시드·이미지·SVG) 제외 예산을 명시(L01 30분/7.5~9k자, L02 20분/5~6k자). 오프라인=판서 진행이라 자수 환산은 촬영 대비 연성 기준 — 선언 준수로 판정, 정밀 재산출은 비적용(검사 note).

### 1-5. 루브릭 ↔ 문제지 1:1 — [PASS]
RUBRIC-L03 criteria 4개 ↔ 문제지 R1~R5 교차:
| Rubric criteria (weight) | 대응 문제지 요구 | 정합 |
|---|---|---|
| ① 요청→응답 기능 동작 (35) | R1(매핑 200) · R5(201/409 결과) | ✓ |
| ② 요청/응답 DTO 경계 (20) | R2(SignUpRequest/Response, Member 미노출) | ✓ |
| ③ Controller/Service 책임 분리 (25) | R4(Service 이동, Repository 미참조) | ✓ |
| ④ 예외 처리·상태코드 매핑 (20) | R5(DuplicateEmailException+@ExceptionHandler+ResponseEntity) | ✓ |
- weight 합 = 35+20+25+20 = **100 PASS**.
- 문제지에 없는 요구 평가: 없음. 요구했으나 평가 없는 항목: R3(의도적 fat controller)는 by-design "실패 응답 코드 평가 안 함"의 과도기 before-상태로, 그 최종형이 criteria①(409)·③(이동)에서 평가됨 → **고아 요구 없음**. rubric open_dependencies(problem_sheet 1:1 교차)가 예고한 검사 **해소**.

### 1-6. 루브릭 ↔ 정답 코드 spot-check — [PASS]
`code/L03/final/` 실확인:
- MemberController: `@RestController`, 생성자 주입(MemberService만, MemberRepository import 없음), `@RequestBody SignUpRequest`→`SignUpResponse(id,email)`, `ResponseEntity.status(CREATED)`, `@ExceptionHandler(DuplicateEmailException)`→`CONFLICT` → criteria ①②③④ excellent **충족**.
- MemberService: `existsByEmail` 검사 + `DuplicateEmailException` throw + `save` → 규칙 이동(복제 아님)·도메인 예외 **충족**.
- rubric의 `verification_against_final`(4개 excellent_met: true) 실코드와 **모순 없음. PASS**.

### 1-7. 실습 가이드 자립성 — [PASS]
- 환경 전제(JDK 21/IntelliJ/Gradle wrapper 8.14.x/포트 8080) + starter 실행 명령이 validation_log와 일치: `gradlew.bat compileJava`→BUILD SUCCESSFUL, `bootJar`+`java -jar`, 포트 충돌 시 `--server.port=8081` 안내 = 로그 특이사항과 동일. **PASS**
- 정답 코드 미노출(힌트 수위 B): "완성 코드는 이 가이드에 없습니다" 명시, 어노테이션·클래스명·흔한 오류 경고까지만. **PASS**
- 스냅샷 경로 실존: `00-starter`~`final` 6개 디렉토리 전부 실존, 각 step.yaml 존재. **PASS**

### 1-8. 진행 노트(runbook) 포인터 정합 — [PASS]
- 컷 번호: L01 7컷 / L02 8컷 — 슬라이드·대본과 **일치**.
- Step 포인터: L03 Step 1~5 ↔ 스냅샷 01-request-mapping~final ↔ instructor_checkpoint stage 2/3/4/5 **일치**.
- 시간 합: L01 45 + L02 30 + L03 85 = 160 + 휴식 10×2 = **180 일치**. L01 내부 블록(15+17+8+5)·L03 내부 블록(8+8+14+10+14+18+8+5=85) 합 **일치**.
- 체크포인트 카운트: instructor_checkpoint 8항목(결함 7 + 질문 cue 1) — 진행노트 §6 서술과 **일치**.

### 1-9. 반입 코드 + validation_log — [PASS]
- `code/L03` 6단계(00-starter~final) step.yaml 전부 존재, change_reason 채워짐.
- validation_log: 6단계 전 컴파일 PASS, final 실기동 HTTP **201/409/201(id=2) 전 PASS**. draft 강등·검사 불가 없음. tech_stack(manifest) 어긋남 없음. **PASS**
- 실습 난이도 85분: 04_plan §1 블록 합 85분(예비 5분 포함), 지연 시나리오(Step5 과제전환→Step3 시연축약→붕괴시 Step4 사수) 근거 명시. **가능 판정 PASS**.

### 1-10. 시뮬레이터 — [PASS]
- offline_interactive 판정 기록 존재(`09_sim_offline_profile_check.md` — "적합"), node --check PASS, 배지 `L01 (오프라인)` 실확인. mode A(@RestController)/mode B(@Controller) 토글 실재.
- 원고 [SIM STEP] ↔ 시뮬 파트 편성: 원고 컷4~6 = [SIM 실행]~[SIM 종료](STEP 0~12), mode A 0~10 / mode B 7~12 — 09 판정·runbook 조작 시점표와 **일치**. **PASS**

---

## 2. required_artifacts 충족 판정

| 레슨 | required_artifacts | 충족 |
|---|---|---|
| L01 | slides, script, simulator, runbook | slides✓ · **script△(원고 실존·미등록 W1)** · simulator✓ · runbook✓ |
| L02 | slides, script, runbook | slides✓ · **script△(원고 실존·미등록 W1)** · runbook✓ |
| L03 | step_code, validation_log, lab_guide, problem_sheet, rubric, script, slides, runbook | step_code✓ · validation_log✓ · lab_guide✓ · problem_sheet✓ · rubric✓ · **script△(LAB설계=03_lab YAML 실존·미등록 W2)** · **slides✗(부재 → B1)** · runbook✓ |

### L03 slides 판정 (요청 명시 항목)
- **사실**: L03 판서슬라이드 HTML 및 L03 원고 파일이 존재하지 않음. 판서슬라이드는 L01/L02만 생성됨.
- **두 문언의 충돌**:
  - `lesson-plan.yaml` L03 required_artifacts = `[..., script, slides, ...]` (주석 "slides/script = 실습 도입 판서, G5 컷 승인 대상") → **필수로 선언**.
  - `offline-lab-lesson-pipeline`(pipeline.md 39행): "[G5: 실습 도입 판서슬라이드가 **필요한 레슨이면** 컷 승인 → panseo-slide-agent]" → **조건부**.
- **실질 공백 평가**: LAB 도입-판서 역할을 `lab_guide §2 전체 흐름 지도` + `runbook Block 0 전체 흐름 지도 판서`가 이미 수행 → 학생·강사 자료로서의 공백은 실질적으로 **없음**. L03 G5 컷 승인 기록도 없음(도입 슬라이드를 만들 계획이 실행되지 않음).
- **판정**: 문언(lesson-plan) 기준 **required_artifacts 누락 → 자동 blocker rule2 발동(B1)**. 단 파이프라인 문언·실질 공백 부재를 근거로 **"조건부 미해당"으로 재분류하면 해소** 가능(quality-gates rule47: 조건부 산출물은 required_artifacts에 넣지 않는다 — 조건 미충족은 누락이 아니라 "조건 대기"로 보고). **최종 결정은 사용자**: (a) lesson-plan 정정해 L03 slides/script 조건부 재분류[권고] / (b) defer 승인 / (c) L03 도입 슬라이드 실제 생성.

---

## 3. 지적 상세

### [BLOCKER] B1 — L03 required_artifacts "slides"(및 "script") 부재로 final 자동 승격 불가
- 근거: `lesson-plan.yaml` L34 `required_artifacts: [..., script, slides, ...]`; 파일 부재(`slides/`·`scripts/`에 L03 없음); quality-gates 자동 blocker rule2.
- 성격: **해소 가능 blocker**. 실질 자료 공백은 없음(§2 판정). 근본 원인은 W3(문언 불일치).
- 권고 해소: lesson-plan을 파이프라인 문언에 맞춰 정정(L03 slides/script를 조건부/미해당 처리) → rule47에 따라 "조건 대기"로 보고. 또는 사용자 defer.

### [WARNING] W1 — L01/L02 원고 미등록 (Registry↔파일 완전성)
- 근거: `scripts/L01.md`·`scripts/L02.md` 실존(v1.8 검사 전 PASS)이나 artifacts.yaml에 "script"/원고 타입 항목 없음(등록된 건 파생물 panseo_script 뿐).
- 영향: G6 공통 "Registry의 모든 (필수) 산출물이 추적되는가" 미충족 — 원고의 상태/승인 추적 불가.
- 권고: script(원고) 타입 항목 2건 등록(ART-SCRIPT-001/002, produced_by: script-agent).

### [WARNING] W2 — L03 LAB 설계·판정 문서 미등록
- 근거: `03_lab_L03.yaml`(LAB "script"=실습 문제 상황 설계), `04_lab_L03_plan.md`(G3 시간/힌트 근거), `09_sim_offline_profile_check.md`(offline_interactive 판정) 미등록.
- 영향: L03 "script" required_artifact의 추적 근거 및 시뮬 판정 근거가 Registry 밖.
- 권고: 최소한 03_lab YAML을 L03 script 근거로 등록(또는 script 매핑 규칙 명문화).

### [WARNING] W3 — required_artifacts ↔ pipeline 조건부 문언 불일치 (B1 근본 원인)
- 근거: lesson-plan L03가 조건부 산출물(실습 도입 판서슬라이드)을 required_artifacts에 넣음 — quality-gates rule47 위반.
- 권고: 오프라인 라인 표준으로, LAB의 도입 판서슬라이드/원고는 "필요한 레슨" 조건 충족 시에만 required로 승격. 미해당 시 required에서 제외하고 "조건 대기"로 표기.

### [SUGGESTION] S1 — 슬라이드 파일명 vs 타입
- `slides/L01_판서보드.html`/`L02_판서보드.html`이 type `panseo_slide_html`로 등록됨. 파일명 "판서보드"는 panseo_board_html(빈 칠판)과 혼동 소지. 실체는 판서슬라이드(엔진에 판서보드 모드 내장)이므로 파일명을 "판서슬라이드"로 통일 권장. (자동 blocker rule1은 미해당 — 별도 panseo_board_html 미등록.)

---

## 4. G6 통과 가능 여부

- **현 상태: 통과 불가** — blocker 1건(B1) 존재로 quality-gates G6 "blocker가 없는가" 미충족.
- **해소 조건**:
  1. B1: lesson-plan L03 slides/script 조건부 재분류(권고) 또는 사용자 defer 또는 L03 도입 슬라이드 생성 — 셋 중 택1로 blocker 해소.
  2. W1(원고 script 항목 등록)로 Registry 완전성 보완.
- 위 2건 처리 시 나머지 전 항목(경계면 교차·원고=책·d2 스타일·루브릭↔문제지↔정답·validation_log·시뮬 판정·runbook 포인터) PASS 상태이므로 **G6 통과 가능**.
