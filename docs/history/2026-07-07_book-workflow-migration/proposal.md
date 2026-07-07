# book-workflow → course-haness 선별 마이그레이션

**날짜:** 2026-07-07
**대상:** `.claude/skills/{book-build, math, screenshot(신규), pub-layout-check(신규), pub-page-fit(신규), reader-panel(신규)}`, CLAUDE.md(포인터), status.md 스키마(무변경 — reader-panel 열 추가 안 함). ~~pub-image-optimize~~는 codex 조건 a로 book-build 흡수(별도 스킬 아님).
**한 줄 결론:** 책 쓰기 플러그인 `book-workflow`에서 course-haness에 **정말 빠진 것만** 골라 현행 구조에 맞게 편입하고, 이미 흡수됐거나 중복인 것은 확실히 배제한다.

---

## 1. 문제

`~/Documents/course-haness/book-workflow`(원 책 플러그인)와 그 최신 정리본들(`books/3track-test`, `유튜브/…/lecture-book-workflow`)에는 스킬 20여 개 + 에이전트 7개 + 훅 3개가 있다. course-haness는 이 중 강의 제작에 필요한 것만 골라 원고 단일원천 11단계 파이프라인으로 재편했지만, 눈으로 읽고 옮기면 (a) 이미 더 잘 만들어진 기능을 망가뜨리거나, (b) 경로 불일치로 죽은 스킬이 생기거나, (c) 정작 필요한 것을 빠뜨릴 위험이 있다. 무엇을 편입하고 무엇을 버릴지 근거를 남기고, 편입한 것은 현행 파이프라인에 **연결되어 흐르도록** 재작성해야 한다.

## 2. 원천·조사 결과 (무엇이 어디에 흡수됐나)

course-haness는 **에이전트 없는 스킬 오케스트라**(`course-pipeline`)다. book-workflow의 에이전트 역할은 이미 스킬로 분해·흡수되어 있다. 조사로 확인한 매핑:

| book-workflow 자산 | 정체 | course-haness에서의 상태 |
|---|---|---|
| `code` 스킬 (A/B3/B4 시리즈) | 코드 분석 + 기술파트 코드 설명 | **흡수** → `practice-code`(실습 코드 생성·실행검증), `manuscript-*`(기술 서술) |
| `writing` 스킬 (C 시리즈) | 스토리텔링 집필·톤 | **흡수** → `manuscript-draft`/`manuscript-final`(원고), `book-build`(소설체 재집필) |
| `planning` 스킬 (B1/B2/B6/D6) | 갭분석·분량·버전분해 | **흡수** → `course-outline`(과정개요·커리큘럼 설계) |
| `visual` 스킬 (Mermaid/이미지/플로우카드) | 다이어그램·이미지 플레이스홀더 | **흡수** → `visual-assets`(SSOT manifest), `image-gen`, `pub-d2-diagram` |
| `prose-polish` | 출판 직전 톤 수술(비유·시적형용사·의인화·AI흔적) | **흡수** → `humanizer` + `book-build` 편집검토 4종 |
| `review` 스킬 (D1/D3/D4/D5) | PASS/FAIL 검토 3모드 | **미사용 고아** → `book-build` 편집검토 4종이 대체. 사용처 0 |
| `pub-build`, `pub-typst-design` | MD→Typst→PDF 빌드 + 템플릿 | **중복** → `book-build`가 `typst_builder.py`로 자체 내장 |
| `pdf-ty`, `pub-info` | Typst PDF 빌드·출판정보 | **중복/불요** → book-build 내장, 출판정보는 현 범위 밖 |
| `pub-html-build`, `pub-html-to-pdf`, `pub-page-fit-html`, `pub-studio` | HTML+Chromium 대안 빌드 경로 | **미편입** → Typst 경로와 중복. 빌드 경로 2개는 유지보수 부담·충돌 위험 |
| `image-analyzer`, `design-doc-mermaid` | 참고이미지→프롬프트, Mermaid 문서화 | **미편입** → visual-assets/image-gen이 담당, 범위 밖 |
| `lecture`, `lecture-caption` | 판서대본·유튜브 자막 해부 | **제거**(사용자 지정 불요) |
| 에이전트 7개(writer/editor/illustrator/publisher/웹인쇄소/analyst-architect/pm-strategist) | 스킬 묶음 실행자 | **미편입** → 오케스트라가 대체. 역할은 스킬에 흡수. 웹인쇄소의 "책 완성 규격"만 §3-E로 흡수 |
| 훅 3개(analyze-trigger/auto-rebuild/check-chapter-style) | 자동 검수·재빌드 강제 | **미편입** → 5렌즈 중 유용분만 §3-D로 흡수 |

**사용자 자작 확인:** `math`, `image-gen`, `panseo-board`, `panseo-slide`, `edu-sim-builder`는 book-workflow에서 가져온 게 아니라 사용자가 course-haness에서 직접 만든 것 — 재편입 대상 아님. 단 `math`는 설명(description/본문)에 book-workflow 잔재(“코드 트랙 code 스킬 대응”, “STEP 5”)가 남아 현행화 필요.

## 3. 편입 대상 (변경 단위)

### A. 고아 정리
- **`review` 스킬 제거**: 사용처 0, `book-build` 편집검토 4종이 대체. 삭제하고 본 레코드에 이력을 남긴다.
- **`math` 현행화**: description·본문의 트랙/STEP/‘code 스킬 대응’ 등 옛 파이프라인 어휘를 제거하고, 개념형 강의 원고(`manuscript-*`)·책(`book-build`)에서 수식이 필요할 때 로드하는 스킬로 재서술. 파이프라인 단계 소유 스킬이 아니라 **온디맨드 보조 스킬**임을 명시.

### B. PDF 레이아웃 QA 도구 편입 (2종) — book-build 내부 연결 (codex 조건 c)
book-build 산출물의 품질을 높이는 실도구. 현행 경로(`courses/{id}/outputs/…`, `book-build`의 `typst_builder.py`)에 맞게 재작성. **course-pipeline의 선행 게이트나 별도 status 칸으로 승격하지 않는다** — 어디까지나 book-build 내부의 post-build 도구.
- **`pub-layout-check`**: 빌드된 PDF에서 빈 페이지·고아줄·과도한 공백을 감지. book-build의 기존 "PDF 렌더 정상" 육안검증(확정 체크리스트 L144)을 **도구화**해 book-build 내부 post-build 분석으로 연결.
- **`pub-page-fit`**: 그 분석 결과로 고아줄·이미지 밀림을 해소하는 **repair 전략**. book-build repair 규칙에 연결(체크리스트 실패 시 문단/이미지 단위 수정, 챕터 전체 재집필 금지 원칙 유지).

### B-2. 이미지 autocrop — 별도 스킬 아님, book-build 흡수 (codex 조건 a)
`pub-image-optimize`(GPT 이미지 여백 autocrop + Typst auto-image 크기조절)는 **신규 스킬로 편입하지 않는다**. `typst_builder.py`에 이미 `autocrop_image()`(L44)·`autocrop_all_assets()`(L73)·auto-image 변환(L496), `book_base.typ`에 auto-image 함수(L232)가 존재해 별도 스킬이면 중복이다. 필요한 후처리는 book-build 내장 유틸/체크 항목으로만 흡수하고, dry-run/리포트 CLI가 필요하면 별도 스킬이 아니라 `book-build/references/scripts` 보조 스크립트로 둔다.

### C. `screenshot` 편입
터미널 실행결과·브라우저 UI를 PNG로 캡처. book-build `style.md`가 이미 `[CAPTURE NEEDED]` 플레이스홀더를 전제하고 있어 연결점이 존재. `practice-code` 실행결과 캡처에도 활용 가능. 현행 경로 규약에 맞게 재작성.

### D. book-build 편집검토 **5종째** 추가 (훅 5렌즈 중 3종 흡수)
book-workflow의 `PostToolUse` 5렌즈 자동검수 중 book-build 기존 4종(사실성·개념누락·과도소설화·개념앵커)에 없는 3개를 5종째 "문장·문단 정합" 검토로 흡수(자동 훅이 아니라 book-build 확정 절차의 체크 항목으로):
1. **연결(문단 전환)**: 인접한 두 산문 문단이 ‘대비 개념쌍’인데 둘 다 같은 비유·어절로 시작하고 전환어(반대로·반면·그래서)나 앞 문단 끝 키워드 회수가 없으면 지적. (단순 절차 나열 연속은 예외.)
2. **시제 규율**: 분위기 보강용 불필요한 과거형 회수 검출(사건 사실 회수 과거형은 정상).
3. **기술파트 한정 의인화**: 코드·시스템에 사람 행위를 부여하는 표현 검출. **비유 캐릭터 대사·기존 어조("서버가 먼저 알린다")는 예외** — 이 책은 캐릭터 소설체이므로 기술 설명 산문에서만 적용.

이 3종은 book-build가 **소설체 재집필**을 하기에 문단 연결·시제·의인화가 실제로 품질을 좌우하므로 유효. 훅으로 강제하지 않고 체크리스트 항목으로 넣어 유지보수 부담을 만들지 않는다.

### E. `reader-panel` 신규 스킬 (beta-reader 편입·개명·재작성)
book-workflow `beta-reader`(10명 가상 독자 패널)는 실제로 여러 책 프로젝트에서 CH별 다회 사용된 증거가 있다(`특이점이-온-개발자-*` 프로젝트 review 폴더). course-haness에 **`reader-panel`**로 개명해 편입한다.
- **위치**: **비차단 온디맨드 옵션** — `manuscript-verify`와 같은 성격(하드 게이트 아님, 원고/책을 자동 수정하지 않음, 근거부 리포트만 산출). **status.md에 열을 추가하지 않는다**(codex 조건 b). course-pipeline은 이 스킬을 오케스트레이션하지 않고 필요 시 권유만 한다.
- **두 가지 기준(분리 서술)**: (1) **PDF 기준** — `책 ✅` 이후 확정 책(`outputs/10_책/chNN.pdf`)을 읽어 독자 리딩. (2) **원고 기준** — `원고확정 ✅` 이후 확정 원고(`outputs/02_원고/chNN.md`)를 읽어 조기 독자 리딩. 둘 중 사용자가 지정한 기준으로 실행.
- **출력**: **`outputs/12_독자패널/chNN_reader.md`**. 여기서 "12"는 **파이프라인 12단계가 아니라 선택 리포트 namespace**다(codex 조건 b — `11_검증`이 `manuscript-verify` 점유 중이므로 충돌 회피 목적의 번호일 뿐). 페르소나 리포트.
- **재작성 범위**: 스킬 내부 경로·트리거·산출물·페르소나 생성 근거(seed → 과정개요서/원고)를 전부 현행 구조에 맞게 고친다. `/beta-reader` 트리거 → `/reader-panel` + "독자 패널", "시험 독자" 유지.

### F. 합본 단계에 "책 완성 규격" 흡수 (웹인쇄소 규격만)
에이전트 `웹인쇄소`는 표지·판권지·머릿말·프롤로그·목차(절/소절)·챕터표지·전체 페이지번호·계층 북마크까지 **한 권으로 병합**하는 규격을 갖는다. 이 규격을 book-build **합본 규칙**의 완성 체크리스트로 흡수한다(구현은 기존 Typst 경로 유지 — HTML+Chromium 경로는 도입하지 않음). book-build 합본은 이미 `book_base.typ`가 표지/목차 자동생성을 하므로, 여기에 **판권지·프롤로그·챕터표지·계층 북마크 존재 여부** 체크 항목을 추가한다.

## 4. 미편입 (배제 확정)

`review`(삭제), `lecture`/`lecture-caption`(제거), 에이전트 7개, 훅 3개(5렌즈 유용분만 §3-D 흡수), `code`/`writing`/`planning`/`visual`/`prose-polish`(역할 흡수됨), `pub-build`/`pub-typst-design`/`pdf-ty`/`pub-info`(book-build 중복), `pub-html-build`/`pub-html-to-pdf`/`pub-page-fit-html`/`pub-studio`(HTML 경로 중복), `image-analyzer`/`design-doc-mermaid`(범위 밖). 배제 사유는 §2 매핑표가 근거.

## 5. 회귀 위험

1. **경로 불일치 죽은 스킬**: pub-layout-check·pub-page-fit·screenshot·reader-panel이 book-workflow 경로(`chapters/`, `projects/`)를 잔존시키면 실행 시 파일을 못 찾는다. → 재작성 시 현행 경로(`courses/{id}/outputs/…`)로 전량 치환하고, `book-build`처럼 `course_layout` 경로 헬퍼를 쓰는지 확인.
2. **빌드 경로 이중화**: autocrop 중복은 codex 조건 a로 해소 — pub-image-optimize를 별도 스킬로 두지 않고 `typst_builder.py` 내장 autocrop을 단일 원천으로 유지.
3. **트리거 충돌**: `reader-panel`, `screenshot`, `math` 트리거가 기존 스킬(특히 `manuscript-verify`, `visual-assets`) description과 오발동하지 않는지 near-miss 확인.
4. **book-build 체크리스트 비대화**: 5종째 검토 + 합본 규격 추가로 체크리스트가 길어짐 → 소설체 품질에 실제로 기여하는 항목만, 문단 단위 지적 형태로 간결히.
5. **CLAUDE.md 중복(R4 위반)**: 새 스킬 목록·경로를 CLAUDE.md에 복제하면 안 됨 → CLAUDE.md는 포인터만, 상세는 각 SKILL.md.

## 6. 검증 (codex 사전검증 + 반영 후)

- **codex 사전검증**(read-only 1회): **완료 — 조건부승인**(`codex-review.md`). 세 조건 모두 §3에 반영: (a) pub-image-optimize를 별도 스킬에서 제외하고 book-build 흡수(§B-2), (b) reader-panel status 열 미추가 + "12"는 리포트 namespace + PDF/원고 기준 분리(§E), (c) pub-layout-check는 book-build post-build 분석·pub-page-fit는 repair 전략으로 연결하고 파이프라인 게이트 승격 금지(§B).
- **반영 후 정합성**: `harness-maintain` 감사(R1 old+new 공존, R2 dead-link, R4 중복) 통과. 신규 스킬 description near-miss 트리거 점검. `math` 잔재어휘 0.
- **CHANGELOG**: 반영 완료 시 `docs/history/CHANGELOG.md` 맨 위 한 줄.

## 7. 실행 순서 (통합 proposal 1개 → 단계별 실행)

1. 고아 정리(review 삭제, math 현행화)
2. PDF 레이아웃 QA 2종 편입(pub-layout-check=post-build 분석, pub-page-fit=repair 전략) — book-build 내부 연결. autocrop은 신규 스킬 없이 book-build 흡수(§B-2)
3. screenshot 편입
4. book-build 편집검토 5종째 + 합본 완성 규격 추가
5. reader-panel 신규 편입(비차단 온디맨드, status 열 없음)
6. CLAUDE.md 포인터 갱신(필요 시), harness-maintain 감사, CHANGELOG 기록
