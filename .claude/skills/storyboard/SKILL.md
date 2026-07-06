---
name: storyboard
description: 확정 원고(`manuscripts/chNN.md`)의 슬라이드를 1:1 카드로 펼친 라이트 테마 강사용 스토리보드 `storyboards/chNN.html`을 만든다. "스토리보드 만들어줘" 요청 시 사용. 카드 상단에 슬라이드 화면 미리보기(Screen 필드 재현, `assets/manifest.json`에 실자산이 있으면 삽입/없으면 프롬프트 placeholder), 하단에 Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment를 라벨링된 패널로 배치한다. 디자인 규범은 `templates/golden/storyboard_golden.html`이며 새 색상·다크 테마는 도입하지 않는다. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트). 사용자 확인 후 status.md 스토리보드 칸을 ✅로 갱신한다.
---

# storyboard

확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 슬라이드를 **1:1 카드**로 펼쳐 강사가 화면 구성과 나레이션을 함께 검수할 수 있는 상세 스토리보드 `storyboards/chNN.html`을 만드는 스킬이다. 파이프라인 6단계(`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3 표)이며, 이 단계의 산출물은 이후 `ppt-preview`/`panseo-slide`/`edu-sim-builder`가 슬라이드 화면 감각을 참고하는 레퍼런스가 된다. 선행 단계는 원고확정(3단계) + 시각자산(4단계, `visual-assets`) — 시각자산이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).

**디자인 규범(golden)**: `templates/golden/storyboard_golden.html` — GPT가 만든 ch01 스토리보드로, 이 파일의 CSS 변수와 구조가 그대로 규범이다. **새 색상표·다크 테마를 도입하지 않는다.**

- CSS 변수: `--ink: #17202a`(본문 글자), `--muted: #5d6875`(보조 글자), `--line: #d9dee7`(테두리), `--soft: #f5f7fa`, `--green/--blue/--warn`(강조 최소 사용). 배경은 `#eceff4`(body), 카드는 흰색 배경 + `border: 1px solid var(--line)` + `border-radius: 10px` + `box-shadow: 0 8px 20px rgba(22,32,42,.05)`.
- 폰트: `"Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif`.
- 구조: 카드 = `<section class="slide detailed" id="slide-N">` → `.slide-head`(제목 `<h2>` + 분류 `<span class="tag">`) → `.slide-body` → `.slide-preview`(슬라이드 화면 미리보기 캔버스) + `<aside class="lecture-panel">`(라벨 섹션 그리드).
- 미리보기 위젯은 골든이 이미 여러 패턴을 제공한다: 이미지 삽입(`.slide-preview img`), 순서도(`.flow`/`.node`/`.node.input`/`.node.key`/`.arrow`), 비교 패널(`.split`/`.panel`/`.old`/`.new`), 코드/터미널(`pre`/`code`), IDE 목업(`.ide`/`.tree`/`.editor`), 브라우저 목업(`.browser`/`.bar`/`.result`), 평가 문제(`.question`/`.choice`). 새 시각 패턴이 필요해도 이 팔레트 안에서만 스타일을 추가한다.

## 절차

### 1. 시작 — 확정 원고 확인

- `manuscripts/chNN.md`가 없거나 `status.md`의 해당 차시 `원고확정`이 ✅가 아니면 사용자에게 알리고 중단한다(미확정 원고로 스토리보드를 만들지 않는다).
- **하드 게이트**: `status.md`의 해당 차시 `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 시각자산을 완료(또는 명시적 보류)해야 한다.
- `courses/{course-id}/status.md`의 해당 차시 `스토리보드` 칸을 🔄로 갱신한다.
- 처음 만드는 차시면 `templates/golden/storyboard_golden.html`의 `<style>` 블록 전체를 그대로 가져와 `storyboards/chNN.html`의 뼈대로 삼는다(변수명·클래스명·값을 임의로 바꾸지 않는다). `<header>`의 제목/부제만 이번 차시 정보(회차명 등)로 교체하고, 상단 "제작 기준" 안내문(legend 섹션)도 골든 문구를 참고해 이번 차시에 맞게 고친다.

### 2. 슬라이드 1:1 카드화

원고의 `## Slide N. {제목}` 블록마다 카드 1개를 만든다. **카드 수는 반드시 원고 슬라이드 수와 같아야 한다** — 슬라이드를 합치거나 건너뛰지 않는다.

- `slide-head`: `<h2>Slide N. {제목}</h2>` + `<span class="tag">{짧은 분류}</span>`. 분류 태그는 골든 어휘(예: `GPT image`, `D2 fallback`, `mock visual`, `roadmap`, `current issue`, `scenario`, `assessment`)를 참고해 슬라이드 성격에 맞게 붙인다.
- `slide-preview`: Screen 필드를 시각적으로 재현한다. 재현 방식은 §3(이미지/다이어그램 자산 유무)에 따라 분기한다.
- `<aside class="lecture-panel">` 아래 `lecture-block` 섹션을 아래 순서 그대로 배치한다(원고 스키마 8필드 + golden 관례 2개를 합친 순서):
  1. **화면 구성** — Screen 필드 텍스트(제목·짧은 문구·화면 배치 설명)를 불릿으로 옮긴다.
  2. **쉬운 비유** — Easy analogy 필드.
  3. **실무사례** — Practical case 필드.
  4. *(선택)* **그림 읽는 순서** — 순서도/D2 다이어그램 슬라이드에서만, 화살표를 어떤 순서로 읽는지 한 문장으로 짚는다(골든 Slide 5·8 사례).
  5. **시각 자료** (`class="lecture-block visual-asset"`) — Visual asset 필드 원문(프롬프트 문구, D2 소스, 코드 블록 등)을 그대로 옮긴다.
  6. **출처** (`class="lecture-block source-block"`) — Source 필드.
  7. **나레이션** (`class="lecture-block lecture-script"`, `grid-column: 1 / -1`로 전체 폭) — Narration 필드 전문. **모든 카드에 이 섹션이 있어야 한다** (확정 체크리스트 대상, 압축·요약 금지).
  8. **실습/진행** — Practice 필드(`- 없음.`이면 그대로 표시).
  9. *(평가 슬라이드만)* **평가 문항** (`class="lecture-block instructor-only"`) — Assessment 구조화 필드(유형/정답/난이도/해설/관련학습보기)를 그대로 옮긴다. 수강자 화면(`slide-preview`)에는 문제와 보기만 노출하고 정답·해설은 이 강사 전용 패널에만 둔다.
  10. **PPT 반영 메모** — 골든 고정 문구를 그대로 쓴다: "슬라이드 화면에는 핵심 문구와 이미지 또는 다이어그램을 크게 배치하고, 자세한 설명은 강사용 패널과 발표자 노트에 반영한다."

### 3. 이미지/다이어그램 자산 연결 (manifest 기반, 2026-07-06 개정)

**자산 해석 규칙(필수)**: 이 스킬은 원고 Visual asset의 프롬프트/D2 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 자산을 임베드한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다:

1. `image.status == "present"`이면 `image.path`를 사용한다.
2. 아니고 `d2.status == "present"`이면 `d2.path`를 사용한다.
3. 둘 다 `present`가 아니면(`deferred`/`missing`) placeholder로 처리한다.

- (1) 이미지 경로: `slide-preview` 안에 `<img src="{상대경로}" alt="...">`로 삽입한다. `storyboards/chNN.html`은 `courses/{course-id}/storyboards/` 아래 있으므로, manifest의 `assets/images/chNN/...` 경로는 골든 실제 참조 패턴(`../assets/images/ch01/...`)처럼 한 단계 상위로 올려 상대경로를 맞춘다. 원고에 병기된 `→ 생성됨:` 문구는 사람이 읽는 보조 표기일 뿐 신뢰 소스가 아니다 — manifest와 다르면 manifest를 따른다.
- (2) D2 경로: 그 렌더 결과(svg/png)를 동일하게 삽입한다.
- (3) placeholder: `slide-preview` 안에 `--line` 테두리의 placeholder 박스를 두고, `deferred`/`missing`이면 원고의 `GPT image prompt:`(또는 `Comic panel prompt:`)/D2 소스 원문을, 재현이 어려운 D2는 골든 Slide 5·8처럼 `.flow`/`.node`/`.arrow`로 흐름을 간단히 재현하거나 `<pre class="asset-code">`로 노출한다(골든 그대로). 실제 픽셀 이미지를 대신 만들지 않는다.
- 화면 캡처 계획(`Screenshot plan:`)뿐이고 manifest에도 항목이 없으면 캡처 대상 목록을 placeholder 텍스트로 보여준다.

**자산 임베드 안전 여백 (2026-07-06 개정)**: 임베드된 이미지/D2가 `.slide-preview` 셀 가장자리에 닿지 않게, 이미지 전용 셀렉터 `.slide-preview > img`에만 `box-sizing: border-box; padding: clamp(12px, 4%, 32px);`를 적용한다(`object-fit: contain`은 기존 규칙 유지). **`.slide-preview` 자체나 `.flow`/`pre`/`.split` 등 비이미지 위젯에는 padding을 주지 않는다** — 그 컨테이너 안에는 이미지 외에도 순서도·코드·비교 패널이 들어가므로 전역 padding은 레이아웃을 깬다. `%` 단독 padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`(제안 B), codex 조건 2: `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md`.

### 4. 자립성 검증

- 외부 CDN·웹폰트·스크립트 참조를 넣지 않는다. 이미지도 로컬 상대경로만 사용한다.
- `storyboards/chNN.html` 파일 하나만으로 브라우저에서 바로 열려야 한다(추가 리소스 다운로드 없음).

### 5. 확정

사용자에게 스토리보드를 보여주고(브라우저로 열기 등) 확인을 받은 뒤:

- `courses/{course-id}/status.md`의 해당 차시 `스토리보드` 칸을 ✅로 갱신한다.
- "산출물 인덱스"에 `- chNN 스토리보드: storyboards/chNN.html (확정 YYYY-MM-DD)`를 추가한다.
- "다음 할 일"을 `chNN PPT프리뷰 작성(ppt-preview)`로 갱신한다.

## 확정 체크리스트

- [ ] **카드 수 일치**: `storyboards/chNN.html`의 `.slide.detailed` 카드 수가 원고 `manuscripts/chNN.md`의 `## Slide N.` 블록 수와 정확히 같다(1:1, 누락·병합 없음).
- [ ] **나레이션 표시**: 모든 카드에 `lecture-script` 나레이션 섹션이 존재하고 원고 Narration 필드 전문을 담고 있다(축약·누락 없음).
- [ ] **라이트 팔레트 준수**: 골든 CSS 변수(`--ink #17202a`/`--muted #5d6875`/`--line #d9dee7`/`--soft #f5f7fa`, 배경 `#eceff4`)를 그대로 사용하고, 새 색상표나 다크 테마가 도입되지 않았다.
- [ ] **브라우저 열림 확인**: 완성 파일을 브라우저에서 열어(Playwright 또는 사용자 육안 확인) 카드가 정상 렌더되는지 확인했다.

## repair 규칙

체크리스트 중 하나라도 실패하면 전체를 다시 만들지 않는다.

- 카드 수가 원고 슬라이드 수보다 적으면(또는 많으면) 누락되거나 잘못 병합된 슬라이드 번호만 찾아 **그 카드만** 추가·재생성한다. 이미 완성된 다른 카드는 건드리지 않는다.
- 나레이션 누락이면 해당 카드의 `lecture-script` 섹션만 채운다.
- 색상 이탈(새 색상·다크 테마 도입)이 발견되면 해당 스타일 선언만 golden 변수 값으로 되돌린다.
- 브라우저에서 깨짐(이미지 경로 오류 등)이 확인되면 해당 카드의 리소스 참조만 수정한다.
- manifest와 카드 내용이 어긋나면(예: manifest는 `present`인데 카드가 여전히 placeholder거나 경로가 다름) 해당 카드의 자산 참조만 manifest 기준으로 다시 맞춘다. 다른 카드는 건드리지 않는다.

## 참고

- 골든 템플릿: `templates/golden/storyboard_golden.html` (ch01 GPT 원본 — CSS 변수, Malgun Gothic 폰트, `.slide-head`/`.slide-body`/`.slide-preview`/`.lecture-panel`/`.lecture-block` 구조와 위젯 패턴의 유일한 기준)
- 원고 스키마: `.claude/skills/manuscript-draft/references/manuscript-schema.md` (8개 필드 정의·순서)
- 시각자산 SSOT: `assets/manifest.json`(`visual-assets` 스킬 소유) — §3 "자산 해석 규칙" 참조. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.
- status.md 형식: `templates/status_template.md`
- 파이프라인 표: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3, §3.0-A(visual-assets), §4(디렉터리 구조 — `storyboards/chNN.html` 경로 규약)
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. Step 2 grep(개발 시점 1회성 구조 검증)으로 SKILL.md 자체를 확인했고, 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
