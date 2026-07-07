# codex 사전검증 — book-workflow 마이그레이션

**결론: 조건부승인** — 방향은 맞지만 `pub-image-optimize`는 신규 스킬이 아니라 `book-build` 내장 기능으로 흡수해야 한다.

날짜: 2026-07-07 · 모드: `codex exec --sandbox read-only`

## 조건 (proposal 반영 완료)

1. **(a) `pub-image-optimize`는 별도 스킬이면 중복.**
   `typst_builder.py`에 `autocrop_image()`(L44), `autocrop_all_assets()`(L73), auto-image 변환(L496)이 이미 있고 `book_base.typ`에도 auto-image 함수(L232)가 있다.
   → **수정 조건:** pub-image-optimize를 신규 스킬 목록에서 제외. book-build 내부 유틸/체크 항목으로만 흡수. dry-run/리포트 CLI가 필요하면 별도 스킬이 아니라 `book-build/references/scripts` 보조 스크립트로.

2. **(b) `reader-panel` 비차단 온디맨드 배치는 계약 위반 아님.**
   manuscript-verify도 "비차단 온디맨드, 하드게이트 아님, 자동수정 없음"(SKILL.md L3). course-pipeline은 고정 11단계만 오케스트레이션하고 optional은 권유만(L75).
   → **수정 조건:** status.md 열 추가 금지. `outputs/12_독자패널`의 "12"는 파이프라인 12단계가 아니라 **선택 리포트 namespace**임을 명시. PDF 기준(`책 ✅` 이후)과 원고 기준(`원고확정 ✅` 이후) 전제를 분리 서술.

3. **(c) `pub-layout-check/pub-page-fit`를 book-build 체크리스트에 거는 것은 hard gate 안 깸.**
   기존 hard gate는 book-build 진입 조건(`시각자산` ✅/`deferred`, SKILL.md L10). "PDF 렌더 정상"은 이미 확정 체크리스트에 있음(L144) → layout-check는 그 도구화.
   → **수정 조건:** pub-layout-check는 book-build 내부 post-build 분석으로 연결, pub-page-fit은 repair 전략으로. course-pipeline 선행 게이트나 별도 status 칸으로 **승격 금지**.

**부수 확인:** `math` 현행화 판단 맞음 — 현재 `math/SKILL.md` L3에 `STEP`, `코드 트랙`, `code 스킬 대응` 잔재 존재.
