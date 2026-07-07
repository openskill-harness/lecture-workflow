# 강의 제작 하네스 v2 — 원고 단일 원천 11단계 파이프라인

## 목표

확정 원고(manuscript)를 단일 원천으로 삼아 실습 코드·스토리보드·PPT·판서·시뮬레이터·PPTX·PDF책을 차례로 파생하는 단일 파이프라인으로 개발자 강의를 제작한다. 라인(촬영/오프라인/온라인) 구분과 승인 게이트는 폐기하고, 단계별 확정(생성 → 확인/수정 → 확정 → 다음 단계)으로 진행 상태를 관리한다.

## 파이프라인 (11단계)

각 단계는 독립 스킬이다. 어느 단계에서든 세션을 끝내고 나중에 이어서 실행할 수 있다.

| # | 스킬 | 산출물 | 확정 방식 |
|---|------|--------|-----------|
| 1 | `course-outline` | `1.과정개요서.md` | 대화로 함께 작성 → 확정 |
| 2 | `manuscript-draft` | `manuscripts/chNN_draft.md` | 생성 → 확인 |
| 3 | `manuscript-final` | `manuscripts/chNN.md` | 티키타카 수정 → 확정 |
| 4 | `visual-assets` | `assets/images/chNN/`, `assets/diagrams/`, `assets/manifest.json` | 생성(지금/deferred) → 확인 |
| 5 | `practice-code` | `code/chNN/` + 실행 검증 로그 | 실행 검증 통과 → 확인 |
| 6 | `storyboard` | `storyboards/chNN.html` (라이트) | 확인 |
| 7 | `ppt-preview` | `ppt_previews/chNN.html` (라이트) | 확인 |
| 8 | `panseo-slide` | `panseo/chNN.html` + `panseo/chNN_대본.md` | 모드 선택 → 생성 → 확인 |
| 9 | `edu-sim-builder` | `simulators/chNN_{주제}.html` | 대상 슬라이드 질문 → 생성 → 확인 |
| 10 | `pptx-build` | `pptx/chNN.pptx` | 확인 |
| 11 | `book-build` | `book/chNN.pdf`, 완주 시 `book/합본.pdf` | 확인 |

2~11단계는 차시(chapter) 단위로 반복된다. 차시별로 완주할 수도, 단계별로 전 차시를 훑을 수도 있다(사용자 선택). 오케스트라 스킬 `course-pipeline`은 `status.md`를 읽어 미완료 첫 단계부터 순서대로 스킬을 호출한다(오케스트라 없이 각 단계 스킬 단독 호출도 항상 가능).

**시각자산 하드 게이트**: `visual-assets`(4단계)가 ✅ 또는 명시적 `deferred`일 때만 5~11단계(코드~책)를 진행한다. 5~11단계 소비 스킬은 원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 자산을 임베드한다. 단 `pptx-build`만은 예외로, `annotate_manuscript_assets.py`가 manifest primary를 원고에 되써준 **공식 브릿지 표기**를 읽는다(브릿지 = manifest primary 불변식; 상세: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3.0-A).

보조 엔진 스킬(파이프라인 단계 아님, 각 단계 스킬이 필요 시 호출):
- `image-gen` — GPT 이미지 생성·교체 (주 호출자: `visual-assets`)
- `pub-d2-diagram` — D2 모노톤 도형 렌더 (opt-in 폴백 엔진 — 기본 시각자산은 GPT 이미지, 원고에 `주 시각자료: D2` 마커가 있는 슬라이드에서만 `visual-assets`가 호출)
- `panseo-board` — 빈 판서보드, 명시 요청 시만
- `humanizer` — 책 문체 교정 (이식 완료, book-build가 §3에서 호출해 사용)
- `manuscript-verify` — 확정 원고 기술 주장을 외부 근거로 적대적 검증(근거부 리포트, 비차단 온디맨드, 3.5단계 — 원고 자동수정 없음). "원고 검증" 요청 시.

## 트리거 라우팅

| 사용자 발화 | 스킬 |
|---|---|
| "과정 만들자", "개요서" | `course-outline` |
| "원고 초안" | `manuscript-draft` |
| "원고 수정", "원고 완성" | `manuscript-final` |
| "원고 검증", "기술 검증", "팩트체크" | `manuscript-verify` |
| "시각자산", "이미지·다이어그램 생성" | `visual-assets` |
| "실습 코드" | `practice-code` |
| "스토리보드" | `storyboard` |
| "PPT 프리뷰" | `ppt-preview` |
| "판서" | `panseo-slide` |
| "시뮬레이터" | `edu-sim-builder` |
| "PPTX" | `pptx-build` |
| "책", "PDF" | `book-build` |
| "이어서 하자", "다음 단계", "전체 실행" | `course-pipeline` |

## 규약

**디렉터리 구조** (스펙 §4):

```
courses/{course-id}/
├── status.md                 # 단계×차시 진행 상태 (재개용)
├── 1.과정개요서.md            # 1단계 확정 산출물
├── research/                 # 개요서 단계의 리서치 md (서브에이전트 산출)
├── manuscripts/              # chNN_draft.md → chNN.md (확정)
├── storyboards/              # chNN.html
├── ppt_previews/              # chNN.html
├── panseo/                   # chNN.html + chNN_대본.md
├── simulators/                # chNN_{주제}.html
├── pptx/                      # chNN.pptx
├── book/                      # chNN.pdf, 합본.pdf, 집필 중간 md
├── assets/
│   ├── images/chNN/           # 생성 이미지
│   ├── diagrams/               # D2 소스 + 렌더 PNG
│   ├── ppt_render/chNN/         # pptx-build 이미지 모드: preview HTML→PNG 렌더(render_preview_slides.py)
│   └── manifest.json           # 시각자산 SSOT (visual-assets 소유, 슬라이드→경로/해시/상태)
└── code/chNN/                  # 차시별 실습 코드
```

**status.md 갱신 의무**: 단계 스킬은 작업 시작 시 해당 열을 🔄로, 사용자 확정 시 ✅로 갱신하고 산출물 인덱스에 경로(및 확정일, 있으면 검증 로그 경로)를 한 줄 추가한다. 사용자가 보류를 선택하면 ➖ + 보류/누락 섹션에 사유를 기록한다. 템플릿: `templates/status_template.md` (신규 과정 시작 시 이 파일을 `courses/{course-id}/status.md`로 복사해 시작).

**골든 템플릿**: `templates/golden/manuscript_golden.md`, `templates/golden/storyboard_golden.html`, `templates/golden/ppt_preview_golden.html` — 각각 원고 스키마·스토리보드·PPT 프리뷰의 포맷/디자인 기준(라이트 테마)이다. 해당 단계 스킬은 새 산출물 작성 시 반드시 이 파일을 참조한다.

## 유지 규칙

하네스 구조 변경(스킬 추가/수정, 디렉터리 규약, status.md 스키마 등)은 `docs/proposals/`에 계획서를 작성하고 codex 사전 검증(`codex exec --sandbox read-only '...' </dev/null`, Git Bash에서 stdin 닫고 실행)을 거친 후 반영한다. 검증 결과는 `docs/reviews/`에 저장한다.

## 설계 문서

- 스펙: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`
- 구현 계획: `docs/superpowers/plans/2026-07-05-unified-lecture-pipeline.md`

## 강의 현황

`spring-boot-basic` — 파일럿. ch01은 11단계를 전 구간 통과해(원고~책·시뮬·PPTX 산출 완료) 시각자산 D2→GPT 재빌드 후 사용자 시각 검토만 남은 사실상 완주 상태다. 상태·다음 할 일: `courses/spring-boot-basic/status.md`.

---

구축 상태: 16개 스킬·파이썬 도구체인 구현 완료, ch01 파일럿 전 구간 드라이런 통과. 잔여 항목은 `docs/superpowers/plans/2026-07-07-harness-review-fixes.md` 참조.
