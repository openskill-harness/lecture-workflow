# v1 → v2 마이그레이션 경위 (2026-07-05)

현행 설계 문서(`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`)에서 분리 보존한 **이전 하네스 구성 상세 + 1회성 이관 절차** 스냅샷.

현행 설계 문서에는 "왜 바꿨나(결정 이유)"만 남기고, 아래 "무엇이 있었나 / 어떻게 지웠나"는 여기에 둔다.

## 이전(v1) 하네스 구성 — 무엇이 있었나
- 제작 라인 3개: 촬영 / 오프라인 / 온라인
- 승인 게이트 G1~G6
- 오케스트레이터 3개 (라인별)
- 에이전트 17개 (전용 에이전트 7개 포함)
- 공통 스키마 3종: Manifest / Lesson Plan / Registry
- 판서슬라이드: "복사본 + 하네스 통합 재정의 섹션" 방식

## 1회성 이관 절차 — 어떻게 이사했나 (이미 완료)
- 기존 자산(강의 3개, 설계문서, proposals/reviews/changelog, 인수인계 문서, 에이전트 17개, 라인 스킬)을 전부 삭제하고 완전 새 출발.
- 삭제 전 "legacy snapshot" 커밋 1개를 만들어 git 이력으로만 보존. (이관 시점 저장소는 커밋 0개 상태였음 — 현재는 무관.)
- Artifact Registry → `status.md`(차시×단계 테이블 + 산출물 인덱스)로 경량 대체.
- 판서슬라이드 스킬 본문을 직접 새로 작성.

## 전환 이유 (요지)
유지 비용(다중 오케스트레이터·라인별 승인 게이트·전용 에이전트)이 큰 데 비해 실제 제작 흐름은 하나였고, 외부(GPT) 산출물이 품질·가독성에서 더 나았다. — 상세 판단 근거는 현행 spec §1 배경 참조(이 "이유"는 현행 문서에 남긴다).

---

## v2 재설계 시점의 삭제 / 보존 / 이동 (spec §11에서 이관, 2026-07-09)

최초 spec(10단계)에 인라인으로 있던 1회성 마이그레이션 지시다. 이미 실행 완료됐고, 여기 언급된 파일럿 과정 `courses/spring-boot-basic`은 2026-07-09에 삭제됐다. R1(권위 문서엔 현행 진실만)에 따라 spec에서 옮겨 왔다.

**삭제** (legacy snapshot 커밋 후):
- 스킬: `filmed-lecture`, `offline-lecture`, `online-lecture`, `lecture-harness`
- 에이전트: `.claude/agents/` 17개 전부
- 문서: `docs/harness-design-v1.md`, `docs/claude-handoff-lecture-harness.md`, `docs/harness-changelog.md`, `docs/history/`
- 강의: `courses/spring-mvc-2026`, `courses/spring-mvc-offline-2026`, `courses/spring-mvc-online-2026`

**보존(엔진, 단 7·8절대로 재작성 대상 포함)**: `panseo-slide`(재작성), `panseo-board`, `edu-sim-builder`(재작성), `image-gen`, `pub-d2-diagram`, `참고스킬/` 백업 폴더.

**이동**: 루트의 `ch01_server-webapp-runtime.md`, `ch01_storyboard.html`, `ch01_ppt_preview.html` → 새 파일럿 과정 `courses/spring-boot-basic/`의 1차시 산출물로 배치하고, 동시에 각 스킬의 골든 템플릿(디자인·포맷 레퍼런스)으로 참조.

**재작성**: `CLAUDE.md`를 새 하네스(단일 파이프라인, 단계별 확정, 스킬 목록) 기준으로 다시 쓴다. 구조 변경 시 codex 사전 검증 규칙은 유지한다.

**이후 추가 (2026-07-06)**: 위 삭제/보존/이동은 이 문서 최초 작성 시점(10단계)의 1회성 마이그레이션 기록이며 이미 실행 완료됨. 이후 §3.0-A 신설로 스킬 `visual-assets`(`.claude/skills/visual-assets/`)가 신규 추가되었다 — 이 스킬은 위 삭제/보존/이동 대상이 아니라 파이프라인 재편(10→11단계)에 따른 신규 스킬이다.
