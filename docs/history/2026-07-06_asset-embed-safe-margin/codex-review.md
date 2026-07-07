# codex 사전검증: 자산 임베드 안전 여백 규약

- 날짜: 2026-07-06
- 대상: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`
- 실행: `codex exec --sandbox read-only` (gpt-5.5)

## 결론
조건부 승인. PPTX는 fit-in-box로 오버플로가 수학적으로 제거됨. HTML/책은 "전역 padding/clamp"로 단순 적용하면 레이아웃을 망칠 수 있어 적용 범위를 좁혀야 함.

## 승인 조건 (반영 필수)
1. **PPTX fit-in-box**: `scale = min(box_w/img_w, box_h/img_h)` → `scaled ≤ box`, 중앙 정렬 → 경계 밖 불가. PIL로 픽셀 크기 읽고 `ImageOps.exif_transpose()` 후 사용. `add_picture`에 width·height 둘 다 전달. **초광폭/초세로 synthetic 이미지 회귀 테스트 추가.**
2. **HTML 범위 좁히기**: `.ppt-media`엔 이미지 외 `.flow`/`pre`/split panel도 들어감 → 전역 padding 금지. **`.ppt-media > img` / `.slide-preview > img` / 전용 `.asset-fit` wrapper에만** 적용. `box-sizing: border-box` + `padding: clamp(...)`(% padding은 width 기준이라 초세로에서 과함) + `object-fit: contain`.
3. **책(Typst)**: 현재 book_base.typ는 max-width 중심, ratio<0.5면 원폭 유지 → 초세로가 새 페이지에서도 넘침. **max-height clamp + `fit: "contain"`**(캡션 높이 포함). 70% clamp는 과보수 — D2는 70~85% + "스케일 너무 작으면 재배치" 경고. **실제 PDF 드라이런으로 확인.**
4. **여백 상수 위치**: 정책 1곳(스펙 §3.0-A 근처 `EMBED_SAFE_MARGIN_RATIO = 0.05`) + target별 구현 상수(build_pptx `PPTX_EMBED_MARGIN_RATIO`, 골든 HTML `--asset-safe-pad`, Typst `#let embed-margin-ratio`). 책임은 소비자(storyboard/ppt-preview/panseo/pptx-build/book-build)에, visual-assets 아님.

## 보완 권고
- fit은 오버플로만 막음 — 초세로/초광폭은 "안 넘침"과 별개로 unreadable 가능. D2 생성 단계 종횡비 경고와 병행(이미 pub-d2 ≤3:1 가이드 있음).
- 문서 불일치: CLAUDE.md는 5~11단계가 manifest를 읽는다 하나 pptx-build는 원고 주석 경로를 regex로 읽음. (판단: 원고 주석이 manifest에서 파생되므로 실질 충돌 아님. pptx는 원고 직접 파싱 계약 유지, HTML 소비자만 manifest — 문서에 이 구분 명확화.)

## Blocker
없음. 조건 4개 반영 후 적용.
