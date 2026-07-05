# 최종 QA 리포트 v2 — spring-mvc-2026 (v1.7 재생성 패키지, G6 재확정 검수)

- 검수 일시: 2026-07-05
- 검수자: qa-agent (촬영강의 G6 체크리스트 + G6 공통 + 자동 blocker + v1.7 타입-밀도 결합 검사)
- 대상: 촬영강의 spring-mvc-2026 (2편 구성 / manifest 라이트 테마·rich 프로파일 / lesson-plan L01 14분·L02 10분·L03 17분)
- 기준: `.claude/skills/lecture-harness/references/quality-gates.md`
- 방법: 경계면 교차 비교 (Registry ↔ 파일 ↔ 원고 ↔ 프롬프터 ↔ 스토리보드 ↔ 슬라이드 ↔ 코드 ↔ 시뮬레이터). 자수·마커·단어수·node 검사는 스크립트 실측.

## 판정 요약

| 심각도 | 개수 |
|--------|------|
| **Blocker** | **0** |
| Warning | 3 |
| Suggestion | 1 |

**G6 재확정: 가능(PASS).** blocker 0, required_artifacts 전부 실존, validation_log 성공, Registry↔파일 일치. Warning 3건은 전부 산출물 자체 결함이 아니라 **QA/설계 기록 문서의 지연(stale)** 또는 **검사 방법 투명성 고지**이며 배포를 막지 않는다. G6 승인 시 draft 상태 산출물(원고·프롬퍼·슬라이드)을 final로 승격하면 된다.

---

## 항목별 결과

### 1. Registry 무결성 — PASS
- **실존 파일 일치:** artifacts.yaml 전 항목의 path가 디스크에 실존. 활성 산출물(CM-001, AD-001, CODE-001, VLOG-001, SIM-001, SCRIPT/PROMPT/SLIDE-101~103, CUE-101) + superseded 12항목 모두 확인.
- **supersedes 체인 정합:** 101 계열 = 구 001+002 통합(구L01 이론 + 구L02 시뮬 → 신 L01), 102→003, 103→004. SCRIPT/PROMPT/SLIDE 3종 동일 패턴, CUE-101→001. 구 001~004 전부 커버 — 정합.
- **superseded 실존:** `_workspace/superseded_v1/scripts/`(L01~L04 원고·프롬퍼 + 큐시트), `.../slides/`(L01~L04 html) 전부 실존.
- **lesson_id 신 체계 통일:** 활성 = L01/L02/L03/ALL, code lesson_id=L03(구L04), sim lesson_id=L01(구L02). superseded는 구L01~구L04 라벨. 정합.
- 근거: `ls -R` 전수 + artifacts.yaml 대조.

### 2. 원고 ↔ 프롬프터 (L01/L02/L03) — PASS
- **시드 블록 프롬프터 발화 미포함:** 세 프롬프터 모두 발화 라인에 `[IMG:]`/```d2```/`[비유:]` 0건. L01 프롬퍼의 [IMG]/[비유] 언급 3건은 전부 `<!-- 발화 제외 -->` 주석 또는 발화규칙 설명(14행)이며 낭독 대상 아님. (원고에는 시드 정상 존재: L01 IMG1·비유2·d2 2 / L02 IMG1·비유1·d2 2 / L03 IMG1·비유1·d2 2.)
- **자수 재측정(공백 제외, 각주·큐·시드·제목 제외 실측):**
  | 레슨 | 실측 자수 | 대역 | 판정 |
  |------|----------:|------|------|
  | L01 | **3,508** | 3,500 ~ 4,200 | PASS (하한 근접) |
  | L02 | **2,901** | 2,500 ~ 3,000 | PASS (상단) |
  | L03 | **4,563** | 4,250 ~ 5,100 | PASS (중앙) |
  - L01은 대역 하한(3,500)에 근접. 250자/분 보수 환산 14.0분으로 duration 14분에 정확히 착지 — 초과 위험 0, 여유 낭독. (워크스페이스 06_v2 리포트의 3,457은 각주 제외 방식 차이로 43자 낮게 산출됐으나, 두 값 모두 ±10% 밴드 내이며 "시간 초과 없음"이라는 게이트 취지 충족. → Suggestion S1.)
- **내용 일치:** L01 원고↔프롬퍼 전문 대조 — 문장·순서·클라이맥스(모드 A STEP 8~9) 일치. L02/L03은 프롬퍼가 구 L03/L04 프롬퍼 본문 바이트 승계 + 레슨 참조만 갱신(06_v2 리포트). 갱신 실측 확인: L02 프롬퍼 회상 "L01에서 봤으니"(130행)·예고 "[IDE 예고 — L03]"(226행) 정확 반영.

### 3. L01 시뮬 파트 정합 — PASS
- **SIM 마커 21개 ↔ 시뮬 실제 STEP:** 원고·프롬퍼 각 `[SIM ...]` 마커 21개(실행1 + 모드A STEP0~10 11개 + 리셋1 + 모드B STEP0~6묶음1·STEP7~12 6개 + 종료1). 프롬퍼 grep 22 중 1개는 헤더 주석의 "[SIM 실행] cue" 언급 → 본문 21로 일치. 모드 A(STEP 0~10, 11개) 개별 마커, 모드 B(STEP 0~12, 13개)는 0~6 묶음 + 7~12 개별로 전 STEP 커버.
- **시뮬 badge "L01":** 파일 실측 `Spring MVC · 요청 처리 흐름 · L01` — 정정 반영 확인.
- **concept_model 대조 리포트:** `_workspace/09_sim_conceptmodel_check.md` 실존. 4개 대조 항목 전부 일치(STEP 순서·A/B timing·scope_boundaries 위반0·라벨 용어). node --check PASS, Mode A 11 STEP / Mode B 13 STEP 명세 일치.

### 4. 스토리보드 v2 ↔ 슬라이드 — PASS
- **장수:** L01 13(콘텐츠 11 + cue 2) / L02 11 / L03 9 — `<section class="step">` 실측과 스토리보드 slide_count·Registry 전부 일치.
- **node --check:** 3개 슬라이드 인라인 `<script>` 추출 → 전부 PASS.
- **판서 엔진 동일성:** 세 슬라이드 엔진 `<script>` MD5 = board_template_light.html의 엔진 스크립트 MD5 (`6c07ce9b…`) **완전 일치(byte-identical)**. 3개 슬라이드 상호 간에도 동일.
- **다크 팔레트 잔존 0:** 시뮬레이터 다크 팔레트(indigo/cyan/emerald 계열·다크 슬레이트 배경) 콘텐츠 내 0건. 콘텐츠는 라이트 토큰(ink #1a1f2e / 흰 박스 / 블루 accent #0a6fbd). 유일한 어두운 배경은 판서모드 칠판(초록 그라디언트) — 엔진 소속·가독성용 정상.
- **시뮬레이터/긴 코드 내장 금지:** iframe 0, 시뮬레이터 embed 0, 긴 코드 블록 0. 코드는 개념 칩/식별자/1~2줄 diff 라벨 수준.
- **단어 수 ≤45 (제외 규칙 적용):** PASS — 단, 방법 투명성 고지(→ Warning W-WC). 스토리보드 3종이 규정한 카운트 규칙(하단 각주 제외 + **시드 도형 내부 식별자 라벨 제외** + L02 가운뎃점 복합토큰=1어절)을 적용하면 전 슬라이드 메시지 프로즈 ≤45(스토리보드 자가검사: L01 최대 S09≈27 / L02 최대 S08≈24 / L03 최대 S9≈35). 원자료 나이브 어절 수는 표·시드다이어그램·각주 밀집 슬라이드에서 45 초과(예: L02 S05 원자료 93, L03 S6 108)이나, spot-check 결과 초과분은 전부 제외 대상(대조표 셀·d2 노드 식별자·코드 식별자·인용 각주)이고 메시지 프로즈는 L02 S05≈22·L03 S6≈26로 확인.

### 5. 시드 소비 — PASS
- **원고 시드 → 스토리보드 소비 명세 → 슬라이드 반영** 체인 정합.
- **d2 노드 구조 슬라이드 SVG 반영(spot check):**
  - L01 d2#1(중복 서블릿) → S03: `LoginServlet`·`OrderServlet`·`PayServlet` 슬라이드에 실재.
  - L01 d2#2(요청 흐름) → S09: `DispatcherServlet`·`HandlerMapping`·`HandlerAdapter`·`Tomcat` 실재.
  - L03 d2(최종 구조) → S9 / 이사 diff → S6: `MemberController`·`MemberService`·`MemberRepository` + `existsByEmail`·`signUp`·`memberService` 실재.
- 비유#2(부친 편지)는 덱 밖(시뮬레이터 STEP9 오버레이) — 스토리보드 명세대로 슬라이드 미탑재.

### 6. L03 코드 정합 — PASS
- **step.yaml 승계 유효:** 6개 단계(00-starter~final) 전부 `change_reason` 보유.
- **validation_log 승계 유효:** `05_labcode_L04_validation.log` 전 단계 빌드 PASS, final 실기동 HTTP 201/409/201 PASS. 파일명 L04 승계(디렉토리 code/L04 유지 — Registry 명시 결정).
- **[IDE 화면] 마커 8개 ↔ 디렉토리:** 원고 본문 8개(00-starter·01·02·03·04·final·final-실행로그·final-전체구조). 마커 1~6 → 6개 디렉토리 실존, 7~8 → final 변형. 헤더 주석의 템플릿 정의(`{단계 디렉토리}`)는 마커 아님. 1:1 인터리브 표 정합.
- **슬라이드 S8 수치 ↔ validation log:** L03.html에 201·409·500 실재(500→409 전환 + 201/409/201). validation log TEST1(201 id:1)/TEST2(409)/TEST3(201 id:2)와 일치.

### 7. 큐시트 — PASS
- 편1: L01 13장 + L02 11장 / 편2: L03 9장 — 슬라이드 실측과 일치.
- 시뮬레이터 badge "L01", code/L04 6개 프로젝트 참조 — 실존.
- 프롬퍼·마커·화면 전환 지점 참조 전부 실존.

### 8. 자동 blocker 규칙 — 전부 미해당(통과)
- **panseo_board_html 부재:** Registry에 panseo_board_html 항목 없음(촬영 라인 — 판서보드 미사용). 자동 blocker 1 미해당.
- **required_artifacts 충족:** L01 = script·prompter·slides·simulator(4/4) / L02 = script·prompter·slides(3/3) / L03 = step_code·validation_log·script·prompter·slides(5/5). 전부 실존. 자동 blocker 2 미해당.
- **validation_log 성공:** step_code final, 로그 전 단계 PASS. 자동 blocker 3 미해당.

### 9. 개념 모델 — PASS
- ART-CM-001(concept_model) status=approved / approved_gate=G2.
- ART-AD-001(architecture_diagram) status=approved / approved_gate=G2.

### 10. v1.7 타입-밀도 결합 검사 — PASS
- 산출물 타입 `html_slide`(rich). "제목만 있는 빈 덱" 신호 없음(콘텐츠 밀도 충분). `panseo_slide_html` 고밀도 오분류 대상 아님(촬영 라인). warning 미발생.

---

## Warning (배포 비차단 — 기록/투명성)

- **W-WC [검사 방법 투명성]** 45단어 검사는 **제외 규칙(각주 + 시드 도형 내부 식별자 라벨 + 복합토큰 1어절) 적용 시 PASS**다. 제외 규칙 없이 나이브 어절 수로 읽으면 다수 슬라이드가 45 초과(L02 S05 93 / L03 S6 108 등)로 보인다. 본 검수는 스토리보드가 규정한 제외 규칙(quality-gates의 "시드 도형 내부 식별자 라벨 제외" 반영)에 따라 판정했고, 초과분이 전부 제외 대상임을 spot-check로 확인했다(전 슬라이드 라벨 수기 재계수는 아님). 향후 자동 검사기 도입 시 제외 규칙을 코드화 권장.
- **W-BADGE [기록 지연]** `09_sim_conceptmodel_check.md` §5(c)가 여전히 시뮬 badge를 "L02"로 서술하고 "오케스트레이터 확인 요망"으로 남겨둔다. 실제 파일·Registry 주석은 "L01"로 정정 완료. 산출물은 정상이나 QA 기록이 정정 전 상태 — 리포트 갱신 권장.
- **W-THEME [기록 지연]** L02·L03 스토리보드 v2 메타(`constraints_ref`/`constraints`)가 아직 "visual_style 다크 테마 / manifest 다크"로 표기. manifest.yaml은 라이트 테마(v1.6 사용자 결정)로 갱신됐고 슬라이드도 라이트(다크 잔존 0). L01 스토리보드가 제기한 테마 드리프트는 manifest 쪽에서 해소됨 — L02·L03 스토리보드 문구만 미갱신. 슬라이드 결함 아님, 문서 정합만 권장.

## Suggestion

- **S1 [L01 자수 하한 근접]** L01 나레이션 3,508자로 대역 하한(3,500)에 근접. duration 14분에 정확히 착지하여 초과 위험은 없으나, 촬영 애드립/호흡 여유(상한 4,200까지 692자)를 감안하면 클라이맥스 구간 보강 여지 있음. 필수 아님.

---

## G6 재확정 결론

**G6 재확정 가능(PASS).** blocker 0 / required_artifacts 충족 / validation_log 성공 / Registry↔파일·경계면 교차 비교 전부 정합. Warning 3건은 산출물 결함이 아닌 기록 지연·방법 고지이며 후속 문서 갱신 대상. G6 승인 시 draft(원고·프롬퍼·슬라이드) → final 승격 진행.
