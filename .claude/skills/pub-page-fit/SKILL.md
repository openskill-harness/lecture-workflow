---
name: pub-page-fit
description: pub-layout-check가 감지한 PDF 레이아웃 이슈(고아줄·빈 페이지·과대 이미지·이미지 밀림)를 해결하는 수정 전략 스킬. "레이아웃 수정", "고아줄 해결", "이미지 밀림 고쳐줘" 요청 시, 또는 book-build repair 절차에서 로드한다. 자동 수정 가능분과 수동 판단분을 구분해 제시한다. 파이프라인 단계가 아니라 book-build 내부 repair 도구다.
---

# pub-page-fit — PDF 밀도 조정 전략

`pub-layout-check`가 감지한 이슈를 해결하는 전략을 제공한다. book-build의 **repair 도구**로, 챕터 전체 재집필이 아니라 문단·이미지 단위 수정을 원칙으로 한다. 파이프라인 게이트·status.md 칸으로 승격하지 않는다.

## 이슈별 전략(요약)

| 이슈 | 자동 수정 | 수동 판단 |
|------|-----------|-----------|
| 고아 콘텐츠 | 이전 페이지 이미지 max-width 5~10%↓, 수평선(`---`) 제거 | 앞 섹션 1~2문장 축약, h1이면 고아 허용 |
| 이미지 밀림 | max-width 0.7→0.6→0.5→0.4 단계 축소 후 재빌드 | 이미지 앞 텍스트 추가/이동 |
| 빈 페이지 | 해당 heading `pagebreak(weak:true)` 제거 | 의도적(Part 구분)인지 확인 |
| 과대 이미지 | `_detect_image_max_width()` 축소 + autocrop | — |

## 자동 수정 루프

1. `pub-layout-check` 실행 → 이슈 목록
2. 자동 수정 적용(이미지 크기·수평선)
3. book-build `typst_builder.py`로 재빌드
4. 재분석 → 이슈 감소 확인
5. 남은 이슈는 사용자에게 보고

## 참조

- `references/fit-strategies.md` — 구체 전략(전략 8: 이야기 파트 2단 레이아웃 포함)
