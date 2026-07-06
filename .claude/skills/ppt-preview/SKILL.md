---
name: ppt-preview
description: 확정 원고(`manuscripts/chNN.md`)의 Screen/Visual asset 필드를 16:9 슬라이드 캔버스로 나열한 라이트 테마 PPT 미리보기 `ppt_previews/chNN.html`을 만든다. "PPT 프리뷰 만들어줘", "PPT 미리보기 만들어줘" 요청 시 사용. 캔버스당 제목+짧은 문구+이미지/D2/코드만 배치하고 긴 설명은 넣지 않는다(설명은 원고·스토리보드 담당). 이미지/D2는 원고 프롬프트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 삽입한다. 디자인 규범은 `templates/golden/ppt_preview_golden.html`이며 새 색상·다크 테마는 도입하지 않는다. 슬라이드 DOM은 `<section class="ppt-slide" data-slide="N">` + 내부 `.ppt-canvas` + 캔버스 내 `h2` 제목으로 고정한다(panseo-slide 그대로 모드가 이 구조를 그대로 소비 — pptx-build는 이 HTML이 아니라 원고 manuscripts/chNN.md를 직접 파싱하므로 이 계약에 의존하지 않는다). 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트). 사용자 확인 후 status.md PPT프리뷰 칸을 ✅로 갱신한다.
---

# ppt-preview

확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 Screen/Visual asset 필드를 실제 PPT 화면처럼 16:9 캔버스로 나열한 라이트 테마 미리보기 `ppt_previews/chNN.html`을 만드는 스킬이다. 파이프라인 7단계(`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3 표)이며, 순서 확인용으로 `storyboards/chNN.html`(6단계 산출물)을 참고한다. 선행 단계는 원고확정(3단계) + 시각자산(4단계, `visual-assets`) — 시각자산이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).

이 단계의 산출물은 **후속 단계가 그대로 소비하는 계약 파일**이다:
- 8단계 `panseo-slide`의 "그대로 모드" — `ppt_previews/chNN.html`의 슬라이드 내용을 그대로 가져와 판서 기능 레이어만 얹는다. 이 DOM 계약(아래 "출력 계약")의 실제 소비자는 이 하나뿐이다.

**10단계 `pptx-build`는 이 파일을 소비하지 않는다** — 원고(`manuscripts/chNN.md`)를 직접 파싱해 python-pptx 16:9 슬라이드를 생성한다(`ppt_previews/chNN.html`은 사람이 보는 미리보기일 뿐 pptx-build의 입력이 아니다).

그래서 이 스킬은 스토리보드보다 **DOM 구조 고정**이 훨씬 중요하다(panseo-slide 그대로 모드가 파싱하므로). 아래 "출력 계약"을 벗어나면 안 된다.

## 디자인 규범 (golden)

`templates/golden/ppt_preview_golden.html` — GPT가 만든 ch01 PPT 미리보기이며, 이 파일의 CSS 변수·캔버스 규격·레이아웃 패턴이 **유일한 디자인 기준**이다. 새 색상표·다크 테마를 도입하지 않는다.

- CSS 변수: `--ink: #17202a`(본문 글자), `--muted: #5d6875`(보조 글자), `--line: #d9dee7`(테두리), `--green`/`--blue`(강조), `--soft: #f5f7fa`. 배경(`body`)은 `#e8ebf1`.
- 폰트: `"Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif`.
- 캔버스 규격: `.ppt-canvas { aspect-ratio: 16/9; background:#fff; border:1px solid #cdd5df; border-radius:8px; box-shadow:0 12px 28px rgba(28,38,54,.12); padding:42px 48px; }`. 폭은 `.ppt-slide { width: min(1120px, calc(100vw - 36px)); }`로 화면에 맞춰 축소된다.
- 레이아웃 원칙: 캔버스 안에는 **제목(`h2`) + 짧은 문구/불릿 + 이미지 또는 D2/순서도/코드**만 놓는다. 긴 설명·나레이션 전문은 넣지 않는다 — 그건 원고(`manuscripts/chNN.md`)와 스토리보드(`storyboards/chNN.html`)의 몫이다.
- 골든이 이미 여러 캔버스 위젯 패턴을 제공한다: 표지(`cover-canvas`/`cover-text`/`cover-image`), 이미지 2단(`image-canvas`/`ppt-two-col`/`ppt-media img`), 순서도(`.flow`/`.node`/`.node.input`/`.node.key`/`.arrow`), 비교 패널(`.split`/`.panel`/`.old`/`.new`), 코드(`code-canvas`/`.ppt-code-layout`/`pre`/`code`), IDE 목업(`.ide`/`.tree`/`.editor`), 브라우저 목업(`.browser`/`.bar`/`.result`), 평가(`assessment-canvas`/`.ppt-question`/`.question`/`.choice`), 참고자료(`sources-canvas`/`.ppt-source-list`). 새 시각 패턴이 필요해도 이 팔레트·구조 안에서만 스타일을 추가한다.

## 출력 계약 (필수 — 후속 단계 파싱 대상)

`ppt_previews/chNN.html`의 슬라이드 DOM은 다음 3가지로 고정한다. panseo-slide 그대로 모드가 이 구조를 그대로 파싱하므로 임의로 바꾸지 않는다(pptx-build는 이 HTML이 아니라 원고 `manuscripts/chNN.md`를 직접 파싱하므로 이 출력 계약에 의존하지 않는다).

1. **슬라이드 루트**: `<section class="ppt-slide" data-slide="N">` — `N`은 원고 `## Slide N.` 번호와 1:1로 일치하는 정수(1부터 연번, 누락·중복 없음).
2. **캔버스**: 슬라이드 루트 내부에 `<div class="ppt-canvas ...">` (16:9, `aspect-ratio: 16/9`). 골든처럼 `cover-canvas`/`standard-canvas`/`image-canvas`/`code-canvas`/`assessment-canvas`/`sources-canvas` 등 레이아웃 보조 클래스를 `ppt-canvas`와 함께 추가로 붙이는 것은 허용된다(선택자 `.ppt-canvas`는 항상 매치되어야 한다).
3. **슬라이드 제목**: `.ppt-canvas` 내부의 `<h2>` 요소.

**골든 DOM과의 차이(의도적 조정)**: 골든 원본은 `<section class="ppt-slide" id="ppt-slide-N">`로 `id`만 쓰고 `data-slide`가 없다. 이 스킬은 후속 단계가 슬라이드 번호를 기계적으로 파싱해야 하므로 `data-slide="N"` 속성을 **추가**한다(`id="ppt-slide-N"`도 유지 가능하되 필수는 아니다). 그 외 클래스명·구조는 골든을 그대로 따른다.

## 절차

### 1. 시작 — 확정 원고 확인

- `manuscripts/chNN.md`가 없거나 `status.md`의 해당 차시 `원고확정`이 ✅가 아니면 사용자에게 알리고 중단한다.
- **하드 게이트**: `status.md`의 해당 차시 `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 시각자산을 완료(또는 명시적 보류)해야 한다.
- `courses/{course-id}/status.md`의 해당 차시 `PPT프리뷰` 칸을 🔄로 갱신한다.
- 처음 만드는 차시면 `templates/golden/ppt_preview_golden.html`의 `<style>` 블록 전체를 그대로 가져와 `ppt_previews/chNN.html`의 뼈대로 삼는다(변수명·클래스명·값을 임의로 바꾸지 않는다). `<header>`의 제목/부제만 이번 차시 정보로 교체한다.
- 순서·슬라이드 성격(표지/코드/평가 등) 확인용으로 이미 만들어진 `storyboards/chNN.html`을 참고한다(있으면).

### 2. 슬라이드별 캔버스 생성

원고의 `## Slide N. {제목}` 블록마다 캔버스 1개를 만든다. **캔버스 수는 반드시 원고 슬라이드 수와 같아야 한다.**

- Screen 필드의 화면 구성 지시(제목/짧은 문구/배치)를 그대로 재현한다. Screen이 표지·순서도·비교·코드·IDE·브라우저·평가 중 어떤 성격인지 보고 골든의 해당 위젯 패턴을 고른다.
- 본문 텍스트(불릿·문구)는 Screen 필드 문구를 압축해 옮긴다 — **원고 문장을 그대로 길게 붙이지 않는다.** 캔버스당 제목 제외 본문 45단어 이내를 권장한다.
- 코드 슬라이드는 `code-canvas`/`.ppt-code-layout` + `pre code`에 실제 코드(실습 검증된 코드, `practice-code` 산출물 우선)를 넣는다.
- 평가 슬라이드는 `assessment-canvas` + `.question`/`.choice`로 문제·보기만 노출한다(정답·해설은 넣지 않음 — 그건 스토리보드의 강사 전용 패널 몫).
- 참고자료 슬라이드는 `sources-canvas`로 원고 Source 목록을 나열한다.

### 3. Visual asset 실자산 연결 (manifest 기반, 2026-07-06 개정)

**자산 해석 규칙(필수)**: 이 스킬은 원고 Visual asset의 프롬프트/D2 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 자산을 임베드한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다:

1. `image.status == "present"`이면 `image.path`를 사용한다.
2. 아니고 `d2.status == "present"`이면 `d2.path`를 사용한다.
3. 둘 다 `present`가 아니면(`deferred`/`missing`) placeholder로 처리한다.

- (1) 이미지: `.ppt-media img` 또는 `.cover-image img`에 실제 상대경로로 삽입한다. `ppt_previews/chNN.html`은 `courses/{course-id}/ppt_previews/` 아래 있으므로, manifest의 `assets/images/chNN/...` 경로는 골든처럼 한 단계 상위로 올려 상대경로를 맞춘다(`../assets/images/chNN/...`). 원고의 `→ 생성됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다 — manifest와 다르면 manifest를 따른다.
- (2) D2: 그 렌더 결과(svg/png)를 동일하게 삽입한다. 재현이 필요하면 골든처럼 `.flow`/`.node`/`.arrow`로 간단히 재현한다.
- (3) placeholder: `--line` 테두리의 placeholder 박스를 두고 프롬프트 원문을 짧게 표시한다 — 실제 픽셀 이미지를 대신 만들지 않는다.

**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며 `d2.primary=true` 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다(원고 병기는 annotate가 primary 한 줄만 남긴다).

**자산 임베드 안전 여백 (2026-07-06 개정)**: 임베드된 이미지/D2가 `.ppt-media` 셀 가장자리에 닿지 않게, 이미지 전용 셀렉터 `.ppt-media > img`에만 `box-sizing: border-box; padding: clamp(10px, 4%, 28px);`를 적용한다(`object-fit: contain`은 기존 규칙 유지). **`.ppt-media`/`.cover-image` 자체나 `.flow`/`pre`/`.split` 등 비이미지 위젯에는 patting을 주지 않는다** — 그 컨테이너 안에는 이미지 외에도 순서도·코드·비교 패널이 들어가므로 전역 padding은 레이아웃을 깬다. `%` 단독 padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`(제안 B), codex 조건 2: `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md`.

### 4. 자립성 검증

- 외부 CDN·웹폰트·스크립트 참조를 넣지 않는다. 이미지도 로컬 상대경로만 사용한다.
- `ppt_previews/chNN.html` 파일 하나만으로 브라우저에서 바로 열려야 한다.

### 5. 확정

사용자에게 프리뷰를 보여주고(브라우저로 열기 등) 확인을 받은 뒤:

- `courses/{course-id}/status.md`의 해당 차시 `PPT프리뷰` 칸을 ✅로 갱신한다.
- "산출물 인덱스"에 `- chNN PPT프리뷰: ppt_previews/chNN.html (확정 YYYY-MM-DD)`를 추가한다.
- "다음 할 일"을 `chNN 판서슬라이드 작성(panseo-slide)`로 갱신한다.

## 확정 체크리스트

- [ ] **슬라이드 수 일치 + 연번**: `ppt_previews/chNN.html`의 `[data-slide]` 개수가 원고 `## Slide N.` 블록 수와 정확히 같고, `data-slide` 값이 1부터 빠짐없이 연번이다.
- [ ] **캔버스당 과밀 금지**: 각 `.ppt-canvas` 안 본문(제목 `h2` 제외) 단어 수가 45단어 이내다(권고 — 초과 시 repair 대상으로 표시).
- [ ] **라이트 팔레트 준수**: 골든 CSS 변수(`--ink #17202a`/`--muted #5d6875`/`--line #d9dee7`/`--soft #f5f7fa`, 배경 `#e8ebf1`)를 그대로 사용하고, 새 색상표나 다크 테마가 도입되지 않았다.
- [ ] **출력 계약 준수**: 모든 슬라이드가 `<section class="ppt-slide" data-slide="N">` 루트 + 내부 `.ppt-canvas` + 캔버스 내 `h2` 구조를 따른다.
- [ ] **브라우저 열림 확인**: 완성 파일을 브라우저에서 열어(Playwright 또는 사용자 육안 확인) 캔버스가 정상 렌더되는지 확인했다.

## repair 규칙

체크리스트 중 하나라도 실패하면 전체를 다시 만들지 않는다. **원고(`manuscripts/chNN.md`)는 불변** — 캔버스 과밀은 원고를 고치지 않고 캔버스 쪽 문구만 축약한다.

- 과밀 슬라이드(45단어 초과)는 해당 캔버스의 불릿·문구만 더 짧게 축약한다(핵심어 위주로 재작성). 다른 캔버스는 건드리지 않는다.
- 슬라이드 수 불일치(`data-slide` 누락/중복/원고 수와 불일치)는 누락되거나 잘못 병합된 슬라이드 번호만 찾아 **그 캔버스만** 추가·재생성한다.
- 색상 이탈(새 색상·다크 테마 도입)이 발견되면 해당 스타일 선언만 golden 변수 값으로 되돌린다.
- 출력 계약 위반(`data-slide` 누락, `.ppt-canvas` 클래스 누락, 캔버스 밖 `h2` 등)은 해당 슬라이드의 마크업만 계약대로 수정한다.
- 브라우저에서 깨짐(이미지 경로 오류 등)이 확인되면 해당 캔버스의 리소스 참조만 수정한다.
- manifest와 캔버스 내용이 어긋나면(예: manifest는 `present`인데 캔버스가 여전히 placeholder거나 경로가 다름) 해당 캔버스의 자산 참조만 manifest 기준으로 다시 맞춘다. 다른 캔버스는 건드리지 않는다.

## 참고

- 골든 템플릿: `templates/golden/ppt_preview_golden.html` (ch01 GPT 원본 — CSS 변수, 캔버스 규격, 위젯 패턴의 디자인 기준. DOM 속성은 출력 계약이 우선하며 위 "골든 DOM과의 차이" 참조)
- 원고 스키마: `.claude/skills/manuscript-draft/references/manuscript-schema.md` (Screen/Visual asset 등 8개 필드 정의·순서)
- 순서 참고용 스토리보드: `storyboards/chNN.html` (`storyboard` 스킬 산출물)
- 시각자산 SSOT: `assets/manifest.json`(`visual-assets` 스킬 소유) — §3 "자산 해석 규칙" 참조. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.
- status.md 형식: `templates/status_template.md`
- 파이프라인 표·디렉터리 구조: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3(7단계), §3.0-A(visual-assets), §4(`ppt_previews/chNN.html` 경로 규약), §7(panseo-slide 그대로 모드)
- pptx-build와의 관계: `.claude/skills/pptx-build/SKILL.md` "참고" — pptx-build는 `ppt_previews/chNN.html`을 소비하지 않고 원고(`manuscripts/chNN.md`)를 직접 파싱한다.
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. Step 2 grep(개발 시점 1회성 구조 검증)으로 SKILL.md 자체를 확인했고, 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
