# codex 사전검증: 시각자산 스테이지 재설계 제안

- 날짜: 2026-07-06
- 대상: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`
- 실행: `codex exec --sandbox read-only` (gpt-5.5)

## 결론
제안 A(시각자산 스테이지 신설)는 재동기화 폭포를 **조건부로** 없앤다. "나중에 가능"만 열어두면 문제에 이름만 붙이는 셈. 아래 4개 조건을 반영하면 구조적으로 해결.

## 승인 조건 (반영 필수)
1. **visual-assets = 기본 hard gate.** placeholder 진행은 예외로 `deferred` 명시. 후속 소비 산출물은 visual-assets가 done(또는 deferred 확인)일 때만 생성.
2. **stale 판정 = 해시 비교.** 각 슬라이드 자산에 `prompt_hash`/`d2_hash`/`source_hash` 저장. 원고 Visual asset 변경 시 바뀐 슬라이드 자산만 재생성, 후속 산출물도 해당 슬라이드만 stale 표시. → "전체 26장 재생성"이 아니라 "수정 2~3장".
3. **asset manifest 도입.** 원고 주석만 신뢰하지 않고 `assets/manifest.json`(슬라이드→경로→해시→상태)을 SSOT로.
4. **소비 스킬 계약 변경을 D 범위에 명시.** 후속 스킬(storyboard/ppt-preview/pptx-build/panseo/book)은 원고의 prompt 텍스트가 아니라 manifest/확정 경로를 읽는다. 안 바꾸면 효과 반쪽.

## 프롬프트 변경 트레이드오프
"원고확정 후 자산 생성"이면 티키타카 중 프롬프트 변경 비용 우려는 대부분 해소(확정=승인). 이후 변경은 티키타카가 아니라 "변경 요청". 현실적 수정은 해시 기반 부분 재생성으로 흡수.

## 순서 권고
`manuscript-final → visual-assets(image+D2) → practice-code → (코드/캡처형 자산 finalize substage) → storyboard → ...`. 이미지 생성 지연이 크므로 원고확정 직후 착수가 유리. 코드/스크린샷 파생 자산은 practice-code 이후 substage로.

## 제안 B~D 추가 리스크
- B: playwright 폴백은 뷰포트/device scale/투명배경 고정 필요. 종횡비는 hard fail 아니라 **warning + 수정 지침**(자동 재배치는 어려움).
- C: `시각자산` 상태값은 `⬜/🔄/✅`로 부족 — `deferred`/`partial`/`stale` 필요.
- D: 영향 범위 넓음(spec·plan·CLAUDE.md·status template·course-pipeline·manuscript-final·ppt-preview·pptx-build). 소비 스킬 계약 변경 포함해야 함.

## 반영 결정
4개 조건 전부 제안서에 반영 후 적용. blocker 없음(조건부 승인).
