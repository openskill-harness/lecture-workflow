# 통합 강의 제작 하네스 v2 설계

- 날짜: 2026-07-05
- 상태: codex 사전 검증 반영 완료 (`docs/reviews/2026-07-05_v2-redesign-codex-review.md`), 사용자 최종 승인 대기
- 대체 대상: 기존 3라인 하네스 전체 (`docs/harness-design-v1.md` 및 관련 구성)

## 1. 배경

기존 하네스는 촬영/오프라인/온라인 3개 제작 라인, 승인 게이트 G1~G6, 에이전트 17개, 공통 스키마 3종(Manifest/Lesson Plan/Registry)으로 구성되어 있었다. 유지 비용(오케스트레이터 3개, 라인별 게이트, 전용 에이전트 7개) 대비 실제 제작 흐름은 하나였고, 외부(GPT)가 만든 산출물 3종 — `ch01_server-webapp-runtime.md`(원고), `ch01_storyboard.html`, `ch01_ppt_preview.html` — 이 기존 하네스 산출물보다 품질과 가독성이 좋다는 사용자 판단이 있었다.

이에 따라 **상세 원고를 단일 원천으로 삼고, 그 원고에서 실습 코드·이미지·다이어그램·스토리보드·PPT·판서·시뮬레이터·PDF책을 차례로 파생하는 단일 파이프라인**으로 전면 재설계한다.

## 2. 사용자 확정 결정 사항

1. 3라인을 단일 파이프라인으로 통합. 라인 전용 산출물(프롬프터 나레이션·촬영 큐시트·루브릭·문제지·실습가이드·진행노트·기관 제출 변환)은 **제거** (필요 시 추후 단계로 추가).
2. 승인 게이트 G1~G6·QA 에이전트·Artifact Registry를 폐기하고 **단계별 확정 방식**(산출물 생성 → 사용자 확인/수정 → 확정 → 다음 단계)으로 교체. 진행 상태는 `status.md` 하나로 추적.
3. 기존 자산(강의 3개, 설계문서, proposals/reviews/changelog, 인수인계 문서, 에이전트 17개, 라인 스킬)은 **전부 삭제하고 완전 새 출발**. 단, 삭제 전 "legacy snapshot" 커밋 1개를 만들어 git 이력으로만 보존 (현재 저장소는 커밋 0개 상태).
4. 파이프라인 마지막 PPT는 **PPTX 파일 자동 생성** (python-pptx, 발표자 노트에 나레이션 삽입).
5. PDF책은 **차시별 PDF + 과정 완주 시 합본 1권**. 책은 원고 렌더가 아니라 **비유 기반 소설체 재집필** — `lecture-book-workflow` 저장소(집필에이전트 v5)의 방식을 이식.
6. 판서슬라이드는 **요약 모드 / 그대로 모드(ppt_preview 내용 그대로 + 판서 기능)** 2가지를 사용자가 선택. panseo-slide 스킬 자체를 재작성.
7. 시뮬레이터 스킬(edu-sim-builder)은 **라이트 테마 + 원고 연동 입력 계약** 및 **구조/품질 표준화** 방향으로 재작성.
8. 스토리보드·PPT preview·시뮬레이터는 라이트 테마. GPT 산출물 3종을 골든 템플릿(디자인 레퍼런스)으로 보관.

## 3. 파이프라인 (10단계)

각 단계는 독립 스킬이다. 어느 단계에서든 세션을 끝내고 나중에 이어서 실행할 수 있다. 오케스트라 스킬 `course-pipeline`은 `status.md`를 읽어 다음 미완료 단계부터 순서대로 스킬을 호출한다.

| # | 스킬 | 산출물 | 확정 방식 |
|---|------|--------|-----------|
| 1 | `course-outline` | `1.과정개요서.md` | 대화로 함께 작성 → 확정 |
| 2 | `manuscript-draft` | `manuscripts/chNN_draft.md` | 생성 → 확인 |
| 3 | `manuscript-final` | `manuscripts/chNN.md` | 티키타카 수정 → 확정 |
| 4 | `practice-code` | `code/chNN/` + 실행 검증 로그 | 실행 검증 통과 → 확인 |
| 5 | `storyboard` | `storyboards/chNN.html` (라이트) | 확인 |
| 6 | `ppt-preview` | `ppt_previews/chNN.html` (라이트) | 확인 |
| 7 | `panseo-slide` (재작성) | `panseo/chNN.html` + `panseo/chNN_대본.md` | 모드 선택 → 생성 → 확인 |
| 8 | `edu-sim-builder` (재작성) | `simulators/chNN_{주제}.html` | 대상 슬라이드 질문 → 생성 → 확인 |
| 9 | `pptx-build` | `pptx/chNN.pptx` | 확인 |
| 10 | `book-build` | `book/chNN.pdf`, 완주 시 `book/합본.pdf` | 확인 |

- 2~10단계는 차시(chapter) 단위로 반복된다. 차시별로 단계를 완주할 수도, 단계별로 전 차시를 훑을 수도 있다(사용자 선택).
- 1차시를 파일럿으로 완성해 형식을 검증한 뒤 나머지 차시로 확장한다.
- 시각 자산 생성은 기존 엔진 스킬을 그대로 사용: `image-gen`(GPT 이미지 생성·교체), `pub-d2-diagram`(D2 모노톤 도형 렌더).
- **단계별 확정 체크리스트**: 각 단계 스킬은 자기 산출물의 확정 체크리스트(예: 원고 — 슬라이드별 필수 필드 존재·출처 유효, 코드 — 실행 검증 통과, 책 — 사실성·개념 누락 체크)와 실패 시 repair 규칙을 스킬 안에 내장한다. 별도 QA 에이전트는 두지 않는다.

### 3.0 실습 코드 단계 (`practice-code`)

확정 원고의 `Practice` 필드를 근거로 차시별 실습 코드를 `code/chNN/`에 생성하고 **실제로 실행해 검증**한다(빌드/실행/HTTP 호출 등, 결과는 검증 로그로 남김). 검증 중 원고의 실습 지시와 코드가 어긋나면 원고를 역수정(사용자 확인 후)한다. 이후 단계(스토리보드/PPT/책)의 코드 블록은 이 검증된 코드에서 발췌한다.

### 3.1 오케스트라 스킬 `course-pipeline`

- 입력: 과정 폴더 경로(또는 신규 과정 시작).
- 동작: `status.md` 파싱 → 미완료 첫 단계 식별 → 해당 단계 스킬 실행 → 사용자 확정 시 `status.md` 갱신 → 다음 단계. 사용자가 "여기까지"라고 하면 정지.
- 오케스트라 없이 각 단계 스킬을 단독 호출하는 것도 항상 가능하다.

## 4. 디렉터리 구조

```
courses/{course-id}/
├── status.md                 # 단계×차시 진행 상태 (재개용)
├── 1.과정개요서.md            # 1단계 확정 산출물
├── research/                 # 개요서 단계의 리서치 md (서브에이전트 산출)
├── manuscripts/              # chNN_draft.md → chNN.md (확정)
├── storyboards/              # chNN.html
├── ppt_previews/             # chNN.html
├── panseo/                   # chNN.html + chNN_대본.md
├── simulators/               # chNN_{주제}.html
├── pptx/                     # chNN.pptx
├── book/                     # chNN.pdf, 합본.pdf, 집필 중간 md
├── assets/
│   ├── images/chNN/          # 생성 이미지
│   └── diagrams/             # D2 소스 + 렌더 PNG
└── code/chNN/                # 차시별 실습 코드
```

`status.md` 형식: 차시×단계 체크 테이블 + "다음 할 일" + **산출물 인덱스/보류 섹션** (Registry 폐기의 경량 대체 — codex 검증 반영). 예:

```markdown
# spring-boot-basic 진행 상태
| 차시 | 원고초안 | 원고확정 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
|---|---|---|---|---|---|---|---|---|---|
| ch01 | ✅ | ✅ | ✅ | ✅ | 🔄 | ⬜ | ⬜ | ⬜ | ⬜ |
| ch02 | ⬜ | … |

다음 할 일: ch01 PPT프리뷰 사용자 확인 대기

## 산출물 인덱스 (자동 갱신)
- ch01 원고: manuscripts/ch01.md (확정 2026-07-05)
- ch01 코드: code/ch01/ (검증 로그: code/ch01/validation.log)
…

## 보류/누락
- ch01 시뮬레이터: 사용자가 3차시 이후로 보류 (2026-07-05)
```

산출물 경로는 디렉터리 규약으로 고정되므로 인덱스는 확정 일자·검증 로그·보류 사유만 추가로 기록한다.

## 5. 과정개요서 대화 흐름 (`course-outline`)

1. "어떤 과정을 만들까요?" 질문.
2. **서브에이전트**가 인터넷 최신 자료를 조사해 `research/{주제}.md` 작성 (메인 컨텍스트 청정 유지).
3. 메인이 리서치 md를 읽고 주제를 사용자에게 설명.
4. **대상자 선정** (초보자/1년차 개발자 등). 대상자가 과정목표 후보와 예제 수준을 좌우하므로 목표 논의보다 앞에 둔다.
5. 과정목표 1개 — 후보 3개 제시, 사용자가 선택하거나 직접 제안.
6. 세부 학습목표 N개 — 각각 후보 3개 제시.
7. 과정 차시 수/차시명/차시내용을 함께 정리.
8. 개요서 초안 생성 → 확인·수정 → `1.과정개요서.md` 확정.

개요서에는 NCS 능력단위요소 연계(해당 시), 차시별 강의 흐름, 실습 도메인의 연속성(예: 하나의 Todo 도메인으로 이어가기)을 담는다.

## 6. 원고 스키마 (`manuscript-draft` / `manuscript-final`)

GPT가 만든 `ch01_server-webapp-runtime.md` 포맷을 표준으로 채택한다.

- **차시 헤더**: 과정명 / 회차명 / 차시 목표 / NCS 연계 / 예상 분량 / 사용 출처 목록.
- **슬라이드 단위 반복** (`## Slide N. 제목`):
  - `Screen` — PPT 화면 구성(제목, 짧은 문구, 배치)
  - `Easy analogy` — 초보자용 쉬운 비유
  - `Practical case` — 실무 사례
  - `Visual asset` — GPT 이미지 프롬프트 / D2 다이어그램 초안 / 화면 캡처 계획 / 코드 블록
  - `Source` — 공식 문서·기사·GitHub 출처
  - `Narration` — 강사가 그대로 읽을 수 있는 한국어 대본
  - `Practice` — 실습 단계(IDE 조작, 코드 작성, 실행, 테스트)
  - `Assessment` — 평가 문항
- **차시당 평가 문항**: 4지선다 1개 + 진위형 2개 (정답·해설 포함).
- **초안 원칙**: 압축하지 않는다. 차시당 30분 초과 허용. 덜어내기는 사용자가 완성 단계(티키타카)에서 한다.
- 초안(`chNN_draft.md`) 확정 후 사용자와의 반복 수정을 거쳐 `chNN.md`로 완성 확정.

## 7. 판서슬라이드 (`panseo-slide` 재작성)

기존 판서 엔진(펜/모눈 격자/사각형 선택 이동/획 객체 이동/지우개/빈 칠판 판서모드 전환)은 유지하되, 스킬을 재작성하여 입력 모드 2개를 정식 지원한다:

- **요약 모드**: 확정 원고를 판서용으로 요약한 저밀도 슬라이드 생성 (판서 여백 확보).
- **그대로 모드**: `ppt_previews/chNN.html`의 슬라이드 내용을 그대로 가져오고 판서 기능 레이어만 얹음.

실행 시 사용자에게 모드를 묻는다. 판서대본도 함께 생성한다. 기존 "복사본 + 하네스 통합 재정의 섹션" 방식은 폐기하고 스킬 본문을 직접 새로 쓴다. `panseo-board`(빈 칠판 단독)는 명시 요청 시 사용하는 보조 스킬로 유지한다.

## 8. 시뮬레이터 (`edu-sim-builder` 재작성)

- **라이트 테마를 기본값**으로 전환 (골든 템플릿의 라이트 톤과 통일).
- **원고 연동 입력 계약**: 확정 원고의 해당 슬라이드(비유·나레이션·Visual asset)를 자동으로 읽어 시뮬레이터 설계에 반영.
- **구조/품질 표준화**: 단계별 시나리오 진행, 비유 ↔ 실제 개념 토글, 속도 조절, 리셋 등 표준 구성 요소와 품질 체크리스트를 스킬에 내장해 시뮬레이터 간 품질 편차를 줄인다.
- 실행 흐름: 스토리보드/원고의 슬라이드 목록을 보여주고 "어떤 슬라이드를 시뮬레이터로 만들까요?" 질문 → 생성 → 확인.

## 9. PPTX 자동 생성 (`pptx-build`)

- python-pptx 기반. 원고(`chNN.md`)와 `ppt_previews/chNN.html`을 기준으로 16:9 슬라이드 생성.
- 슬라이드 본문: 제목, 짧은 문구, 이미지(assets), D2 렌더 PNG, 핵심 코드.
- **발표자 노트에 Narration 삽입** — python-pptx의 `notes_slide` API가 발표자 노트를 정식 지원한다(codex가 blocker로 지적했으나 과대평가로 판단). 다만 구현 초기에 "슬라이드 1장 + 노트 삽입 + PowerPoint에서 열어 확인" spike를 먼저 수행해 확정한다.
- 강의장에서 바로 쓸 수 있는 실제 .pptx가 목표.

## 10. PDF책 (`book-build`) — lecture-book-workflow 이식

책은 원고의 나레이션·비유·이미지·D2 도형·실습·평가문항을 씨앗으로 삼아 **소설처럼 이야기 형태로 재집필**한다. `https://github.com/edu-openskill/lecture-book-workflow.git`(집필에이전트 v5)에서 다음 3덩어리를 이식한다:

1. **소설체 집필 규칙** → `.claude/rules/` 또는 book-build 스킬 references로:
   - `storytelling.md`: 캐릭터 삼각구도(팀장=힌트 제공자, 동료=문제 제기자, 주인공=독자 대리인), 비유→왜?→정의 2단계, 비유는 대화에서 발견, Show Don't Tell, Try-Fail(성공 전 최소 2회 실패), 챕터 구조(이야기 파트 → 기술 파트, 라벨형 H2 금지).
   - `style.md`: 한국어 톤(~합니다체, 대사 존댓말), 이모지·em dash 금지, AI 선호어 금지 등.
2. **humanizer 스킬** (한국어 AI 문체 24패턴 감지·교정, MIT): 그대로 복사.
3. **Typst 조판 엔진**: `book_base.typ`(46배판 188×257mm, 자동 목차/표지/헤더, auto-image 공간 계산) + `typst_builder.py`(MD 통합 → Pandoc → Typst → PDF, 6단계 파이프라인).

**Windows 이식 조정 (필수)**:
- 폰트 경로가 macOS(`~/Library/Fonts`) 하드코딩 → Windows 폰트 경로로 수정.
- 본문 폰트 RIDIBatang·코드 D2Coding: Windows에 설치하거나 무료 대체 폰트(KoPubWorld바탕 등) 선정 — 구현 시 사용자와 확정.
- 외부 바이너리 `typst`, `pandoc` 설치 필요 (d2는 기존 pub-d2-diagram이 이미 사용).

**책 품질 통제 (codex 검증 반영)**: humanizer 문체 교정 외에, 집필 후 편집 검토 패스를 둔다 — ① 원고 사실성 보존(기술 서술이 원고·출처와 어긋나지 않는지), ② 기술 개념 누락(원고의 핵심 개념·실습·평가가 책에 모두 반영됐는지), ③ 과도한 소설화 방지(이야기가 기술 설명을 잠식하지 않는지). 원본 저장소의 writer → illustrator → editor 순환 구조에서 editor 역할을 이 체크리스트로 이식한다.

출력: 차시 완성 시 `book/chNN.pdf`, 과정 완주 시 `book/합본.pdf`(목차·표지 포함 1권).

참조 clone 위치(재사용): scratchpad의 `lecture-book-workflow/` — 구현 시 필요한 파일만 저장소로 복사.

## 11. 삭제 / 보존 / 이동

**삭제** (legacy snapshot 커밋 후):
- 스킬: `filmed-lecture`, `offline-lecture`, `online-lecture`, `lecture-harness`
- 에이전트: `.claude/agents/` 17개 전부
- 문서: `docs/harness-design-v1.md`, `docs/claude-handoff-lecture-harness.md`, `docs/harness-changelog.md`, `docs/proposals/`, `docs/reviews/`
- 강의: `courses/spring-mvc-2026`, `courses/spring-mvc-offline-2026`, `courses/spring-mvc-online-2026`

**보존(엔진, 단 7·8절대로 재작성 대상 포함)**: `panseo-slide`(재작성), `panseo-board`, `edu-sim-builder`(재작성), `image-gen`, `pub-d2-diagram`, `참고스킬/` 백업 폴더.

**이동**: 루트의 `ch01_server-webapp-runtime.md`, `ch01_storyboard.html`, `ch01_ppt_preview.html` → 새 파일럿 과정 `courses/spring-boot-basic/`의 1차시 산출물로 배치하고, 동시에 각 스킬의 골든 템플릿(디자인·포맷 레퍼런스)으로 참조.

**재작성**: `CLAUDE.md`를 새 하네스(단일 파이프라인, 단계별 확정, 스킬 목록) 기준으로 다시 쓴다. 구조 변경 시 codex 사전 검증 규칙은 유지한다.

## 12. 되돌리기

- 삭제 직전 저장소 전체를 "legacy snapshot" 커밋으로 남긴다 (현재 커밋 0개이므로 이 커밋이 최초 커밋). 필요 시 해당 커밋에서 어떤 파일이든 복원 가능.
- 새 구조는 그 위에 별도 커밋(들)로 쌓는다.

## 13. 기각된 대안

- **라인 전용 산출물을 옵션 단계로 보존**: 하네스 복잡도가 유지되어 기각. 필요 시 추후 단계 추가가 더 저렴.
- **게이트 축소 유지(핵심 게이트 2~3개)**: 단계별 확정 흐름과 중복. 기각.
- **기존 강의 마이그레이션**: 파일럿(스프링부트 기초)부터 새로 시작하는 편이 검증에 유리. 기각.

## 14. 구현 순서 (개요)

1. legacy snapshot 커밋 → 삭제/이동 실행 → CLAUDE.md 재작성 (삭제분은 git 이력에서 언제든 복원 가능)
2. 골든 템플릿 배치 + `status.md`/디렉터리 규약 확정
3. 단계 스킬 1~6 작성 (`course-outline` → `ppt-preview`, `practice-code` 포함)
4. `panseo-slide`/`edu-sim-builder` 재작성 (7~8단계)
5. `pptx-build` 구현 (9단계) — **speaker notes spike 선행**
6. `book-build` 이식 (10단계) — **Windows Typst/Pandoc 드라이런 선행** (폰트·경로·한글 줄바꿈·변환 품질 확인)
7. `course-pipeline` 오케스트라 작성
8. 파일럿(스프링부트 기초 1차시)으로 전 구간 드라이런
