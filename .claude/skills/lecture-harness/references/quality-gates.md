# 승인 게이트와 품질 기준

승인 게이트는 AI의 내용 불리기를 막는 구조적 장치다. 게이트에서는 산출물 요약 + QA 결과 + (구조적 결정이 있었다면) GPT 교차 검증 결과를 함께 보고하고, 승인 없이 다음 Phase로 가지 않는다.

## 게이트별 통과 기준

### G1 — Course Manifest 확정
- learning_goals가 "~할 수 있다" 형식이고 측정 가능한가
- target_learners가 "아는 것/모르는 것"을 구분하는가
- total_minutes, tech_stack 버전이 구체적인가 (촬영강의: 1편 ≈ 30분, 초과 시 episodes 선언)
- 미리 만들어진 자산이 있는지 확인했는가 (`existing_assets` — 있으면 등록, 반입 모드는 G3에서)
- 오프라인강의: `style.slide_mode`(rich/summary)를 확정했는가 (v1.7 — 촬영=rich 고정, 온라인=summary 고정)
- constraints가 채워져 있는가 (기본값 사용 시 그 사실 보고)

### G2 — 레슨 플랜 확정 (+ 개념 모델·완성 구조도, v1.7)
- 개념 모델(concept_model)과 완성 구조도(architecture_diagram)가 함께 제출되었는가 — 레슨 분해가 개념 경계(scope_boundaries)와 정합하는가
- 시뮬 파트가 필요한 레슨에 `simulator`가 required_artifacts로 부착되었는가 (시뮬 전용 레슨은 설계 오류)
- 모든 레슨이 learning_goals 중 하나 이상과 연결되는가
- duration 합계가 total_minutes 이내인가 (LAB은 실습 시간 1.5~2배 반영 — 단, 촬영강의 LAB은 "코드 설명 시간" 기준)
- 촬영강의: 레슨의 편(episode) 배정이 확정되었는가, 편별 합계가 편 minutes 이내인가
- 강의 전체가 단일 모드로 분류되어 있지 않은가 (의심 신호)
- required_artifacts가 라인 기본 산출물과 정합하는가

### G3 — 실습 범위 + 단계별 코드 계획 확정
- 기존 코드 반입 시: 반입 모드(역-단계화/검증만/read-only)와 재구성 범위가 확정되었는가, tech_stack·목표와의 어긋남 목록이 보고되었는가
- 단계 목록 각각에 change_reason이 있는가
- 단계 수가 수업/영상 시간 안에 소화 가능한가
- starter에 넣을 설정/반복 코드와 학생(시청자)이 작성할 코드가 구분되는가
- 지연 시 생략/과제 전환할 단계의 우선순위가 있는가 (오프라인)

### G4 — 슬라이드 스토리보드 확정 (촬영강의)
- 슬라이드 1장 = 메시지 1개인가
- max_slide_words 이내로 설계되었는가
- 시뮬레이터/코드 시연이 cue 슬라이드로 처리되었는가
- 원고 흐름과 슬라이드 순서가 일치하는가

### G5 — 판서슬라이드 방향 확정 (오프라인/온라인)
- 컷 6~9개, 컷당 한 줄 메시지(+보조 한 줄)인가
- 중심 비유 1개가 정해졌고 끝까지 유지 가능한가
- 판서로 채울 여백이 컷마다 있는가
- 부술 오개념/심을 진실이 정의되었는가

### G6 — 최종 배포 패키지 확정
- qa-agent 리포트에 blocker가 없는가
- required_artifacts가 모두 존재하는가 — **누락 시 final 불가, repair/defer/abort 사용자 선택**
- 사용자 defer 승인으로 `deferred` 상태인 산출물은 final을 막지 않는다 (Registry 기록 유지, 후속 복원 대상)
- 조건부 산출물(`institutional_export` 등 실행 조건이 미충족인 것)은 required_artifacts에 넣지 않는다 — 조건 미충족은 누락이 아니라 "조건 대기"로 보고한다
- Registry의 모든 항목이 실제 파일과 일치하는가

## 라인별 G6 체크리스트

### 촬영강의 (filmed)
- [ ] 슬라이드가 강의 흐름의 중심인가?
- [ ] 시뮬레이터는 별도 파일이며 슬라이드에는 실행 cue만 있는가?
- [ ] 프롬프터 원고가 실제 말하기 흐름으로 읽히는가?
- [ ] 나레이션 분량이 레슨 duration_minutes 안에 들어가는가? (분당 250~300자 환산)
- [ ] 단계별 코드는 starter/problem/step/final로 변화 이유를 보여주는가? validation_log가 성공인가?
- [ ] 긴 설정/반복 코드를 실시간 타이핑하도록 강요하지 않는가?
- [ ] constraints(max_slide_words, code_font_min_pt)를 지키는가?

### 오프라인강의 (offline)
- [ ] 판서슬라이드의 화면 글자가 적은가? 판서 여백이 충분한가?
- [ ] 실습 가이드는 학생이 혼자 보고 시작할 수 있는가?
- [ ] 루브릭은 학습목표와 연결되는가? weight 합계 100인가?
- [ ] 정답 코드와 평가 기준이 충돌하지 않는가?
- [ ] 실습 난이도가 수업 시간 안에 가능한가?
- [ ] **panseo-board가 중복 생성되지 않았는가?** (Registry에 panseo_board_html 있으면 자동 blocker)
- [ ] 진행 노트의 컷 번호/단계 포인터가 실제와 일치하는가?

### 온라인강의 (online)
- [ ] 원고와 판서슬라이드 흐름이 맞는가?
- [ ] 판서슬라이드는 글자가 적고 설명 여백이 있는가?
- [ ] 시뮬레이터는 별도 파일이고 online_self_paced 프로파일(안내·리셋)을 갖췄는가?
- [ ] 학습자가 혼자 봐도 섹션마다 hook → concept → summary가 이어지는가?
- [ ] **panseo-board가 중복 생성되지 않았는가?** (자동 blocker)

## qa-agent 원고=책 검사 (v1.8)

- 구 표기 `[IMG:` 잔존 = 0
- `[IMAGE PROMPT]` 블록마다 `path:` 존재 + path 파일 실존 + 원고 이미지/SVG 링크가 실제 파일을 가리킴
- d2 코드블록 수 == 렌더 SVG 병기 수
- d2 스타일 게이트 (v1.9): 각 블록 direction: right / fill은 허용 3색(+transparent)만 / SVG에 테마색(#0D32B2·#F7F8FE·#EDF0FD·#E3E9FD·#EEF1F8)·streaks 잔존 0
- 주요 섹션(H2/H3 학습 전환 단위)마다 예시/비유 서술 + 시각 요소 존재
- 프롬프터 자수 계산에서 시각 요소(주석 블록·이미지 라인·<img>·캡션·d2) 제외 준수
- 스토리보드가 이미지/SVG 시드를 소비했는지

## qa-agent 타입-밀도 결합 검사 (v1.7, warning)

- `panseo_slide_html`인데 고밀도(코드칩 다수, 45단어 근접 장 존재) → warning ("판서슬라이드는 글자가 적어야 한다" 위반 신호)
- `html_slide`인데 제목만 있는 빈 덱 → warning (rich 프로파일 위반 신호)

## qa-agent 자동 blocker 규칙

1. 오프라인/온라인 Registry에 `panseo_board_html`이 **`pipeline_scope: standalone` + `request_reason` 없이** 등록됨 (기본 파이프라인에서 생성된 중복). 명시 요청으로 단독 생성되어 두 필드가 있으면 blocker가 아니다.
2. required_artifacts 누락 상태의 `final` 승격 시도 (`deferred`는 예외 — 사용자 승인 기록)
3. validation_log 실패 상태의 step_code `final` 승격 시도
