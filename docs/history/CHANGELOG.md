# 하네스 변경 이력 (CHANGELOG)

권위 문서(SSOT)의 "무엇이 언제 왜 바뀌었나" 단일 ledger. 상세는 각 레코드 폴더 링크.
한 줄 = 한 변경. 최신이 위. 이 파일과 `docs/history/<날짜_변경>/`만이 이력의 SSOT다 — 권위 문서엔 이력을 쓰지 않는다.

| 날짜 | 변경 | 대상 | 사유 | 레코드 |
|------|------|------|------|--------|
| 2026-07-07 | 설계 spec의 v1 구성·1회성 이관 서술을 history로 분리(결정 **이유**는 spec에 유지) | spec §1·§2, docs/history/2026-07-05_v2-redesign/migration-notes.md | 현행 문서=현행 진실+결정 이유만, 옛 상태는 이력으로(R1) | [2026-07-05_v2-redesign](2026-07-05_v2-redesign/) |
| 2026-07-07 | SSOT 규율(R1~R4) 도입 + CLAUDE.md 슬림화 + 이력 docs/history 일원화 + harness-maintain 스킬 신설(외부 플러그인 대체) | CLAUDE.md, course-pipeline, harness-maintain, docs/ | old+new 공존·중복·3중관리 제거, 유지보수 in-repo 자립 | [2026-07-07_ssot-discipline](2026-07-07_ssot-discipline/) |
| 2026-07-07 | manuscript-verify 스킬 신설(3.5단계) | skills/manuscript-verify, CLAUDE.md | 원고 기술주장 적대적 검증 | [2026-07-07_manuscript-verify](2026-07-07_manuscript-verify/) |
| 2026-07-07 | book-build 개념 앵커 도입 | skills/book-build | 개념 누락 방지 | [2026-07-07_book-concept-anchor](2026-07-07_book-concept-anchor/) |
| 2026-07-06 | pptx 이미지 모드 기본화 | skills/pptx-build | 프리뷰 픽셀 동일 | [2026-07-06_pptx-image-mode](2026-07-06_pptx-image-mode/) |
| 2026-07-06 | 기본 시각자산 D2→GPT 이미지 | skills/visual-assets, image-gen | 품질/일관성 | [2026-07-06_d2-to-gpt-image-default](2026-07-06_d2-to-gpt-image-default/) |
| 2026-07-06 | 자산 임베드 안전 여백 | skills/storyboard, ppt-preview, panseo-slide | 자산 잘림 방지 | [2026-07-06_asset-embed-safe-margin](2026-07-06_asset-embed-safe-margin/) |
| 2026-07-06 | visual-assets 스테이지 신설(10→11단계) | skills/visual-assets, spec | 재동기화 폭포 제거 | [2026-07-06_visual-assets-stage-redesign](2026-07-06_visual-assets-stage-redesign/) |
| 2026-07-05 | 원고 단일원천 파이프라인 v2 재설계 | 전체 | 라인/게이트 폐기, 단계별 확정 | [2026-07-05_v2-redesign](2026-07-05_v2-redesign/) |
