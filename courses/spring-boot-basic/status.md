# spring-boot-basic 진행 상태

과정개요서: ➖ (`스프링부트_기초_과정내용_10차시.md` 기준 — 파일럿 ch01 집중, 별도 개요서 소급 생략)

| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
|---|---|---|---|---|---|---|---|---|---|---|
| ch01 | ✅ | ✅ | 🔄 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

기호: ⬜ 미착수 / 🔄 진행 중(사용자 확인 대기 포함) / ✅ 확정 / ➖ 보류(사유는 아래)
시각자산 전용 상태값: `deferred`(placeholder 유지) / `partial`(일부 생성) / `stale`(원고 변경으로 재생성 필요)

> ch01 전 단계는 2026-07-06 자율 생성 + 자가검증 완료. **아침 사용자 검토 대기**. 파이프라인 11단계(visual-assets 신설) 재설계 후 새 순서로 재빌드됨.

다음 할 일: ch01 05·08·10·15·20 GPT 이미지 재생성 진행 중

## 산출물 인덱스
- ch01 확정원고: manuscripts/ch01.md (26슬라이드, 자산 경로 병기, 채택 2026-07-06)
- ch01 시각자산: assets/manifest.json (SSOT, 26/26 커버 — GPT 이미지 21 + D2 5), assets/images/ch01/slide*.png(21), assets/diagrams/ch01-slide{05,08,10,15,20}-*.png(5, slide05/20 종횡비 재렌더 2.15:1/2.17:1)
- ch01 실습코드: code/ch01/final/ (검증 로그: validation.log — gradle test 통과, /hello 200, /helo 404 재현)
- ch01 스토리보드: storyboards/ch01.html (26카드, 실자산 26/26 임베드)
- ch01 PPT프리뷰: ppt_previews/ch01.html (16:9 26캔버스, DOM 계약, 실자산 26/26)
- ch01 판서: panseo/ch01.html + ch01_대본.md (그대로 모드, 엔진 7기능, 실자산 26/26)
- ch01 시뮬레이터: simulators/ch01_http-request-flow.html (HTTP 7단계, 라이트)
- ch01 PPTX: pptx/ch01.pptx (26슬라이드, **이미지 모드** — ppt_preview 렌더 PNG 26/26 풀블리드 + 발표자 노트 26/26, 렌더 소스 assets/ppt_render/ch01/, 확정 2026-07-06)
- ch01 책: book/ch01.pdf (17p, 소설체, 삽화 13개[D2 5 + 이미지 8], 캐릭터 3인, 편집검토 3종 통과)

## 보류/누락
- 과정개요서: 파일럿 ch01 단일 차시 집중을 위해 소급 작성 생략 (2026-07-06)
- D2 슬라이드(05/08/10/15/20)의 GPT 이미지: `deferred` — D2가 주 시각자료라 중복 불필요 (manifest 기록)
