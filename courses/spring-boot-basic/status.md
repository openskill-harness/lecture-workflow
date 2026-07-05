# spring-boot-basic 진행 상태

과정개요서: ➖ (`스프링부트_기초_과정내용_10차시.md` 기준 — 파일럿 ch01 집중, 별도 개요서 소급 생략)

| 차시 | 원고초안 | 원고확정 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
|---|---|---|---|---|---|---|---|---|---|
| ch01 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

기호: ⬜ 미착수 / 🔄 진행 중(사용자 확인 대기 포함) / ✅ 확정 / ➖ 보류(사유는 아래)

> ch01 하위 산출물 8단계는 2026-07-06 밤 자율 생성 + 자가검증 완료. **아침 사용자 검토 대기** 상태이며, 검토 후 수정 요청을 반영한다.

다음 할 일: ch01 산출물 사용자 검토. (선택) GPT 이미지 26슬라이드 생성 → 스토리보드/PPT프리뷰/판서/PPTX 시각자산 재동기화.

## 산출물 인덱스 (확정 시 자동 갱신)
- ch01 확정원고: manuscripts/ch01.md (채택 2026-07-06 — course-hangida-spring 26슬라이드)
- ch01 실습코드: code/ch01/final/ (검증 로그: code/ch01/final/validation.log — gradle test 통과, /hello 200 "Hello Spring Boot", /helo 404 재현, 2026-07-06)
- ch01 스토리보드: storyboards/ch01.html (라이트 26카드, 2026-07-06)
- ch01 PPT프리뷰: ppt_previews/ch01.html (16:9 26캔버스, DOM 계약 준수, 2026-07-06)
- ch01 판서: panseo/ch01.html + panseo/ch01_대본.md (그대로 모드, 엔진 7기능, 2026-07-06)
- ch01 시뮬레이터: simulators/ch01_http-request-flow.html (HTTP 요청-응답 7단계, 라이트, 2026-07-06)
- ch01 PPTX: pptx/ch01.pptx (26슬라이드, 발표자 노트 26/26, 2026-07-06)
- ch01 책: book/ch01.pdf (13p, 소설체, 캐릭터 3인, 편집검토 3종 통과, 2026-07-06)
- ch01 D2 다이어그램: assets/diagrams/ch01-slide{05,08,10,15,20}-*.png (모노톤 5개, manifest: assets/diagrams/ch01-d2-manifest.md, 2026-07-06)

## 보류/누락
- 과정개요서: 파일럿 ch01 단일 차시 집중을 위해 소급 작성 생략 (2026-07-06)
- ch01 GPT 이미지 자산: 26슬라이드 image prompt 미생성(placeholder 유지) — API 비용·재동기화 범위로 사용자 승인 후 진행 (2026-07-06)
- ch01 시각자산 재동기화: D2 5개는 assets/diagrams/에 생성됐으나 스토리보드/PPT프리뷰/판서는 아직 flow-widget/placeholder 표현 — 이미지 생성 시 함께 repair 예정 (2026-07-06)
