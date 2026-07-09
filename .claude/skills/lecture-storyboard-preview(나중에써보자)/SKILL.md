---
name: lecture-storyboard-preview
description: "Use when generating or revising the WYSIWYG storyboard and the final PPT Preview HTML from an approved production-script, merging user storyboard edits, and auditing preview layout before final approval."
---

# Lecture Storyboard And PPT Preview

발표용 슬라이드의 시각 산출물을 만든다. `07_storyboard.html`은 사용자가 완성 슬라이드 위에서 편집하는 WYSIWYG 화면이고, `09_ppt-preview.html`은 읽기 전용 최종 산출물이다. 발표형 PPTX로 변환하지 않는다.

담당 에이전트는 `storyboard-composition-director`다.

## 입력

- `outputs/<course-slug>/NN_chNN/06_production-script.md`
- `outputs/<course-slug>/NN_chNN/08_visual-assets/provided/`
- `outputs/<course-slug>/NN_chNN/08_visual-assets/reused/`
- `outputs/<course-slug>/NN_chNN/08_visual-assets/final/`
- `outputs/<course-slug>/NN_chNN/05_submission-review/`
- 필요 시 `outputs/<course-slug>/NN_chNN/04_narration-script.md`
- 필요 시 `outputs/<course-slug>/NN_chNN/02_practice-code/`

## 출력

- `outputs/<course-slug>/NN_chNN/07_storyboard.html`
- `outputs/<course-slug>/NN_chNN/07_storyboard-state.json`
- `outputs/<course-slug>/NN_chNN/09_ppt-preview.html`

`07_storyboard-state.json`이 사용자 편집 상태의 단일 진실이다.

## Scripts

이 스킬이 소유하는 스크립트다. 저장소 루트에서 실행한다.

### storyboard와 preview 생성

`generate_ppt_preview.mjs`는 같은 preview state로 `07_storyboard.html`과 `09_ppt-preview.html`을 함께 생성한다. 두 화면이 같은 렌더링 기준을 쓰도록 보장하는 것이 이 스크립트의 목적이다.

```bash
node .claude/skills/lecture-storyboard-preview/scripts/generate_ppt_preview.mjs \
  --chapterDir outputs/springboot/03_ch01
```

`--chapterDir`은 필수다. 나머지 경로는 chapterDir 기준으로 유도된다.

| 인자 | 기본값 |
| --- | --- |
| `--state` | `<chapterDir>/07_storyboard-state.json` |
| `--out` | `<chapterDir>/09_ppt-preview.html` |
| `--storyboardOut` | `<chapterDir>/07_storyboard.html` |
| `--practiceDir` | `<chapterDir>/02_practice-code` |
| `--projectDir` | `<practiceDir>/project/` 아래 첫 디렉터리 |
| `--generatedAssetsDir` | `<chapterDir>/08_visual-assets/provided` |

### preview 레이아웃 검사

사용자에게 preview를 제시하기 **전에** 반드시 돌린다. 텍스트 잘림, 요소 겹침, 슬라이드 밖 이탈, 이미지 과도한 crop을 잡는다.

```bash
node .claude/skills/lecture-storyboard-preview/scripts/audit_ppt_preview_layout.mjs \
  outputs/springboot/03_ch01/09_ppt-preview.html
```

blocking이 남아 있으면 사용자에게 제시하지 않는다.

### storyboard 편집기 스모크 테스트

storyboard가 WYSIWYG 편집 화면으로 동작하는지 확인한다.

```bash
node .claude/skills/lecture-storyboard-preview/scripts/smoke_storyboard_editor.mjs \
  outputs/springboot/03_ch01/07_storyboard.html
```

### 사용자 편집 병합

사용자가 storyboard에서 편집해 내려받은 state를 기존 state에 병합한다.

```bash
node .claude/skills/lecture-storyboard-preview/scripts/merge_storyboard_user_prompts.mjs \
  --baseState  outputs/springboot/03_ch01/07_storyboard-state.json \
  --savedState <사용자가 내려받은 state.json> \
  --baseHtml   outputs/springboot/03_ch01/07_storyboard.html \
  --outHtml    outputs/springboot/03_ch01/07_storyboard.html \
  --outState   outputs/springboot/03_ch01/07_storyboard-state.json \
  --assetsDir  outputs/springboot/03_ch01/08_visual-assets \
  --report     outputs/springboot/03_ch01/_workspace/prompt-merge-report.json
```

### preview 슬라이드 이미지 렌더

검토나 공유용으로 preview를 슬라이드 이미지로 뽑는다. 발표형 PPTX 제작용이 아니다.

```bash
node .claude/skills/lecture-storyboard-preview/scripts/render_ppt_preview_slides.mjs \
  --input outputs/springboot/03_ch01/09_ppt-preview.html
```

`--outDir` 기본값은 `<input과 같은 폴더>/_workspace/preview-slides`다.

### 필수 인자 회귀 테스트

```bash
bash .claude/skills/lecture-storyboard-preview/scripts/test_required_args.sh
```

모든 스크립트가 필수 인자 누락 시 exit 1로 종료하는지 확인한다.

## 작업 절차

1. `06_production-script.md`와 `08_visual-assets/`의 실제 자산을 읽는다.
2. `generate_ppt_preview.mjs`로 storyboard와 preview를 함께 생성한다.
3. `audit_ppt_preview_layout.mjs`로 preview를 검사한다. blocking이 있으면 storyboard-state를 고치고 2번으로 돌아간다.
4. storyboard를 사용자에게 제시하고 편집 요청을 받는다.
5. 사용자 편집 state를 `merge_storyboard_user_prompts.mjs`로 병합한다.
6. 2~5를 반복해 storyboard 승인을 받는다.
7. 승인된 `07_storyboard-state.json`으로 preview를 최종 생성하고 다시 감사한다.
8. preview를 사용자에게 제시하고 최종 승인을 받는다.

## Typography 기준

- 허용 font-size token은 `14, 16, 18, 20, 22, 24, 28, 34, 36, 42px`이다.
- 발표 본문 역할의 `screen-text`, `custom-text` 실제 문장 줄은 `20px` 또는 `22px`만 사용한다.
- 한 슬라이드 안의 본문 박스가 여러 개면 같은 typography fit을 공유한다.
- 본문 줄간격은 `1.28`, `1.34`, `1.45` token만 사용하고, flex 줄 사이 gap은 최소 `8px` 이상 유지한다.
- 줄바꿈한 문장이 붙어 보이면 글자를 더 줄이지 말고 박스 높이, 열 배치, composition, 슬라이드 분할을 조정한다.

## 실패 조건

다음 중 하나라도 있으면 preview를 사용자에게 최종 확인용으로 제시하지 않는다.

- `scrollHeight > clientHeight`인 텍스트 박스가 있다.
- 허용 typography token 밖의 font-size, 본문 line-height, 본문 gap이 있다.
- 요소 bounding box가 슬라이드 밖으로 나간다.
- 제목, 본문, 시각자료가 서로 겹쳐 학습자가 읽기 어렵다.
- 이미지가 본문 텍스트를 침범한다.
- 실제 화면 이미지가 핵심 내용을 잃을 정도로 crop된다.
- 정확한 코드, URL, 명령어, 문제 보기가 이미지 안에 묻혀 수정·검증할 수 없다.
- `07_storyboard.html`과 `09_ppt-preview.html`의 slide count, typography, image render, overflow 기준이 다르다.
- 실제 자산이 있어야 할 위치에 자리와 요구 조건이 표시되지 않아 사용자가 무엇을 넣어야 하는지 알 수 없다.

## 품질 기준

- `09_ppt-preview.html`은 나레이션, 자기점검, 제작 메모, 검토 패널을 화면에 넣지 않는다.
- 사용자가 storyboard에서 수정한 이미지, 위치, 크기, fit, 텍스트는 승인된 편집 의도로 보고 preview에 보존한다.
- 코드, 명령어, URL, 예상 응답은 `02_practice-code/`의 검증 결과와 일치한다.
- `PPT Screen`의 화면 문구가 나레이션 본문을 반복하지 않는다.
