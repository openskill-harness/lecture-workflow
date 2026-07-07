---
name: pub-layout-check
description: book-build가 만든 PDF(`outputs/10_책/chNN.pdf`)를 페이지별로 분석해 빈 페이지·고아줄·과도한 공백·이미지 밀림을 감지하는 도구 스킬. "레이아웃 점검", "PDF 빈 페이지 확인", "고아줄 검사" 요청 시, 또는 book-build 확정 절차의 'PDF 렌더 정상' 검증을 도구화할 때 로드한다. 감지만 하고 수정하지 않는다(수정 전략은 pub-page-fit). 파이프라인 단계가 아니라 book-build 내부 post-build 도구다.
allowed-tools: Bash(python *pdf_layout_checker.py*)
---

# pub-layout-check — PDF 레이아웃 감지

book-build가 빌드한 PDF를 페이지별로 분석해 레이아웃 문제를 감지한다. **감지 전용** — 수정은 `pub-page-fit`이 담당한다. 파이프라인 단계나 status.md 칸이 아니라 **book-build 내부 post-build 도구**다(course-pipeline 게이트로 승격하지 않는다).

## 스크립트

- `references/scripts/pdf_layout_checker.py` — PDF 경로 1개를 인자로 받아 페이지 사용률 막대와 이슈 리포트를 출력. PyMuPDF(`fitz`) 필요(book-build와 동일 의존).

## 실행

```bash
python .claude/skills/pub-layout-check/references/scripts/pdf_layout_checker.py courses/{course-id}/outputs/10_책/chNN.pdf
```

## 감지 항목

| 이슈 | 심각도 | 조건 | 제안(→ pub-page-fit) |
|------|--------|------|------|
| 빈 페이지 | high | 텍스트·이미지 블록 없음 | pagebreak 제거 |
| 고아 콘텐츠 | high | ≤4줄 + 하단 50%+ 빈 공간 | 이전 페이지로 당기기 |
| 낮은 사용률 | medium | 콘텐츠 45% 미만 | 이미지/코드 밀림 패턴 |
| 과대 이미지 | medium | 이미지가 페이지 70%+ | max-width 축소 |
| 밀림 패턴 | medium | 이전 55% 미만 + 다음 페이지 이미지 | auto-image 자동 축소 |

## 출력 예

```
p03 |#################.......................|  45%  <<빈 공간>>
p06 |########................................|  22%  <<<고아>>>
```

## 참조

- `references/detection-rules.md` — 감지 규칙 상세
