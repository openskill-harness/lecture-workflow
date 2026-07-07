---
name: panseo-slide
description: 판서 기능(펜·모눈·선택이동·지우개·빈 칠판 전환)이 내장된 강의 슬라이드 HTML과 판서대본을 만든다. "판서 슬라이드 만들어줘", "판서 자료" 요청 시 사용. 요약 모드(원고를 판서용으로 요약)와 그대로 모드(PPT 프리뷰 내용 그대로 + 판서 레이어) 중 선택.
---

# panseo-slide

파이프라인 8단계(`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3 표).
확정 원고 `outputs/02_원고/chNN.md`(3단계) 또는 PPT 프리뷰 `outputs/06_PPT프리뷰/chNN.html`(7단계)을 입력으로
받아, 판서 엔진이 내장된 강의 슬라이드 `outputs/07_판서/chNN.html`과 판서대본 `outputs/07_판서/chNN_대본.md`를
만든다. 이 스킬은 하네스의 **판서 엔진 소유 스킬**이다 — 엔진(펜/모눈/선택이동/지우개/판서모드
전환/전체화면)의 요구 명세는 `reference/engine.md`, 소유 템플릿은 `template/`에 있다.

**시각자산(4단계)과의 관계**: 이 스킬은 `outputs/03_시각자산/manifest.json`을 직접 읽지 않는다 — 그대로 모드는
`outputs/06_PPT프리뷰/chNN.html`(7단계, `ppt-preview`가 manifest를 읽어 이미 실자산을 반영한 산출물)을
그대로 이식하므로 간접 소비다. 요약 모드도 원고를 참고하되 이미지 삽입은 하지 않는다(저밀도 요약 취지).

(이 스킬은 manifest를 직독하지 않는다: 그대로 모드는 ppt-preview HTML을 그대로 이어받아 이미 임베드된
자산을 쓰고, 요약 모드는 판서용으로 자산을 넣지 않기 때문이다. 자산 SSOT 계약은 상류 ppt-preview가 이미
충족했다.)

## 산출물 (항상 2개)

- `outputs/07_판서/chNN.html` — 단일 파일. 판서 기능이 내장된 강의 슬라이드. 펜·터치 기기 브라우저에서
  바로 열림.
- `outputs/07_판서/chNN_대본.md` — 슬라이드별 판서 지시 + 대본.

## 0. 모드 질문 (필수, 매 실행마다 먼저)

`AskUserQuestion` 도구가 있으면 활용해 아래 두 선택지를 제시한다. 없으면 번호를 매겨 텍스트로
묻고 사용자 응답을 받는다. **모드를 확인하지 않고 임의로 정하지 않는다.**

- **요약 모드** — 확정 원고를 판서 여백이 있는 저밀도 슬라이드로 요약한다. 화면 하단 1/3은 비워
  둔다.
- **그대로 모드** — `outputs/06_PPT프리뷰/chNN.html`의 각 `.ppt-slide` 캔버스 내용을 그대로 이식하고 판서
  레이어만 추가한다(캔버스는 요약하지 않는다).

## 1. 시작 — 전제 확인

- 대상 차시 `courses/{course-id}/status.md`를 읽는다.
- **요약 모드**: `outputs/02_원고/chNN.md`가 없거나 `원고확정`이 ✅가 아니면 사용자에게 알리고
  중단한다.
- **그대로 모드**: `outputs/06_PPT프리뷰/chNN.html`이 없거나 `PPT프리뷰`가 ✅가 아니면 사용자에게 알리고
  중단한다.
- **하드게이트**: 두 모드 공통으로 해당 차시 `시각자산`이 ✅ 또는 `deferred`가 아니면(⬜/🔄/`partial`/`stale`)
  사용자에게 알리고 중단한다 — 먼저 `visual-assets`를 완료(또는 명시 보류)해야 한다.
- `status.md`의 해당 차시 `판서` 칸을 🔄로 갱신한다.

## 2. 모드별 템플릿 선택

두 모드 모두 `reference/engine.md`의 엔진(펜/모눈/✂선택이동/✋획이동/지우개/판서모드전환/
전체화면)을 **그대로 복사**해서 쓴다. `<script>`는 절대 다시 타이핑하지 않는다. 템플릿은 다음
기본값을 따른다(사용자가 다른 테마를 명시적으로 요청하면 그쪽을 쓴다):

| 모드 | 템플릿 | 이유 |
|------|--------|------|
| 요약 모드 | `template/board_template.html` (다크 네이비) | 판서 대비가 좋은 원래 정체성. 저밀도 컷 + 넓은 판서 여백에 어울림 |
| 그대로 모드 | `template/board_template_light.html` (라이트) | `outputs/06_PPT프리뷰/chNN.html`이 라이트 팔레트라 이질감 없이 이식됨 |

`outputs/07_판서/chNN.html`로 복사한다.

## 3. 요약 모드 절차

1. 원고 `outputs/02_원고/chNN.md`의 `## Slide N.` 블록마다 `.step` 컷을 하나씩 만든다. **컷 수는
   원고 슬라이드 수와 반드시 같다.**
2. 각 컷은 핵심 1~2줄 + 키워드만(문장 3줄 이상 금지). `reference/components.md`의 컴포넌트
   (도발질문·썸네일피드·게이지·번호리스트·초대 등)를 그대로 붙여 쓴다.
3. **화면 하단 1/3은 판서 여백**으로 비운다 — 컷 내용을 상단에 몰아 배치한다(필요하면 해당
   `.step`에 `style="padding-bottom:34vh"`처럼 컷별 인라인 스타일을 추가해 강제한다. 엔진의
   `.step` 기본 규칙 자체는 건드리지 않는다).
4. `{{DECK_TITLE}}`을 강의명으로, `{{KICKER}}`(쓴다면)를 첫 컷 라벨로 치환한다. 첫 `.step`에만
   `class="step active"`.
5. 톤에 맞으면 `:root` 강조색 변수만 조정한다(기본: 다크 네이비 테크).

## 4. 그대로 모드 절차

1. `outputs/06_PPT프리뷰/chNN.html`을 읽어 `<section class="ppt-slide" data-slide="N">` 블록을
   `data-slide` 오름차순으로 전부 추출한다. 개수·연번은 `ppt-preview` 확정 체크리스트가 이미
   보장하지만 재확인한다(1부터 연번, 누락·중복 없음).
2. 블록마다: `<section class="ppt-slide" data-slide="N">...` 태그와 그 **직계 자식**
   `<div class="ppt-canvas ...">...</div>` 전체(클래스·내부 마크업·이미지 상대경로 포함)를
   **손대지 않고** 엔진의 `.step` 섹션 하나로 감싼다:
   ```html
   <section class="step embed">        <!-- 첫 컷은 "step active embed" -->
     <section class="ppt-slide" data-slide="1">
       <div class="ppt-canvas cover-canvas">...(원본 그대로)...</div>
     </section>
   </section>
   ```
   `.ppt-canvas`가 `.ppt-slide`의 직계 자식인지 확인하고 파싱한다(이 경로가 안전하다).
3. 이미지 경로: `outputs/07_판서/`와 `outputs/06_PPT프리뷰/`는 과정 루트 기준 같은 깊이(1단계 하위)이므로
   원고에 적힌 상대경로(`../03_시각자산/images/chNN/...`)를 **그대로** 쓸 수 있다. 디렉터리 깊이가
   다르면 상대경로를 재계산한다.
4. 라이트 템플릿의 `<style>` 뒤에 `outputs/06_PPT프리뷰/chNN.html`의 `<style>` 중 **슬라이드/캔버스
   관련 규칙만** 복사해 붙인다: `.ppt-slide`, `.ppt-canvas`와 그 하위 모든 위젯 클래스(예:
   `.cover-canvas`/`.cover-text`/`.cover-image`, `.standard-canvas`, `.image-canvas`/
   `.ppt-two-col`/`.ppt-media`, `.flow`/`.node`/`.arrow`, `.split`/`.panel`/`.old`/`.new`,
   `.code-canvas`/`.ppt-code-layout`/`pre`/`code`, `.ide`/`.tree`/`.editor`,
   `.browser`/`.bar`/`.result`, `.assessment-canvas`/`.ppt-question`/`.question`/`.choice`,
   `.sources-canvas`/`.ppt-source-list` — 실제 파일에 있는 것만). **`*`, `body`, `header`,
   `h1`, `main` 같은 페이지 레벨 규칙은 가져오지 않는다**(엔진 자체 배경·레이아웃과 충돌한다).
5. 복사한 스타일의 `:root{...}` 변수 중 엔진과 이름이 겹치는 6개(`--ink`/`--muted`/`--line`/
   `--green`/`--blue`/`--soft`)는 텍스트 치환으로 `--ppt-ink`/`--ppt-muted`/`--ppt-line`/
   `--ppt-green`/`--ppt-blue`/`--ppt-soft`로 바꾸고, 그 스타일 블록 안에서 그 변수를 참조하는
   곳(`var(--ink)` 등)도 함께 바꾼다(엔진 자체 kicker/hl 색상이 오염되지 않도록).
6. 엔진 `<style>` 끝에 그대로 모드 전용 규칙을 한 번만 추가한다:
   ```css
   .step.embed{align-items:center; padding:4vh 4vw;}
   .step.embed .ppt-slide{width:min(1120px, 92vw);}
   ```
   (엔진의 `.step` 기본 규칙은 좌측 정렬이라, 그대로 모드에서 16:9 캔버스를 가운데 두기 위한
   추가 규칙이다. 다른 엔진 규칙은 건드리지 않는다.)

   **자산 임베드 안전 여백 (2026-07-06 개정)**: `outputs/06_PPT프리뷰/chNN.html`에서 이식한 `.ppt-media img,
   .cover-image img` 규칙에 이어, 이미지 전용 셀렉터 `.ppt-media > img`에만
   `box-sizing: border-box; padding: clamp(10px, 4%, 28px);`를 추가해 이미지가 셀 가장자리에
   닿지 않게 한다(`object-fit: contain`은 유지). `.ppt-media`/`.cover-image` 자체나 `.flow`/`pre`/
   `.split` 등 비이미지 위젯에는 padding을 주지 않는다 — 전역 padding은 레이아웃을 깬다. `%` 단독
   padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거:
   `docs/history/2026-07-06_asset-embed-safe-margin/proposal.md`(제안 B), codex 조건 2:
   `docs/history/2026-07-06_asset-embed-safe-margin/codex-review.md`.
7. `{{DECK_TITLE}}`을 강의명/원고 제목으로 치환한다. 판서 캔버스(`#pad`)는 엔진 구조상 이미
   전체 화면을 덮는 오버레이이므로, 슬라이드 위에 판서 레이어를 얹기 위한 별도 작업은 필요 없다.

## 5. 판서 대본 생성 (공통, 모드 무관)

`outputs/07_판서/chNN_대본.md`를 `reference/script_guide.md` 형식으로 슬라이드 수만큼 작성한다:

```
## 슬라이드 N — {제목}
판서:
(그릴 도형/쓸 키워드 — 짧게)
대본:
(실제로 할 말…)
```

- 슬라이드 번호(N)는 `.step` 순서(요약 모드는 원고 `## Slide N.` 순서, 그대로 모드는
  `data-slide` 순서)와 정확히 1:1.
- "판서" 항목: 요약 모드는 컷에 못 담은 세부(도형·수식·화살표), 그대로 모드는 이미 화면에 있는
  내용 중 강조·부연할 부분(밑줄/원/화살표)을 짧게 적는다.
- "대본" 항목: 확정 원고 `outputs/02_원고/chNN.md`의 해당 `Slide N` Narration/Easy analogy 필드를
  근거로 구어체로 쓴다(그대로 모드도 원고를 참고한다 — 시각 구성만 ppt-preview에서 가져올 뿐,
  말할 내용의 원천은 항상 원고다).
- 톤·인용 규칙(비유 먼저, 하나의 이야기, 인용구는 실제 출처만)은 `reference/script_guide.md`를
  따른다.

## 6. 확정

사용자에게 `outputs/07_판서/chNN.html`을 브라우저로 열어 보여주고(펜 기기 없으면 마우스로 최소 조작
확인) 확인을 받은 뒤:

- `courses/{course-id}/status.md`의 해당 차시 `판서` 칸을 ✅로 갱신한다.
- "산출물 인덱스"에 `- chNN 판서: outputs/07_판서/chNN.html + outputs/07_판서/chNN_대본.md (확정 YYYY-MM-DD, 모드:
  {요약|그대로})`를 추가한다.
- "다음 할 일"을 `chNN 시뮬레이터 필요 여부 확인(edu-sim-builder)`로 갱신한다.

## 확정 체크리스트

- [ ] **엔진 기능 7종 전부 동작** — `reference/engine.md`의 7종(펜 드로잉/모눈 격자/✂ 사각형
  선택 이동/✋ 획 객체 이동/파괴적 지우개/판서모드 전환/전체화면)을 브라우저(Playwright 또는
  사용자 육안)로 실제 조작해 확인했다.
- [ ] **슬라이드 수 일치** — 요약 모드: `.step` 수 = 원고 `## Slide N.` 블록 수. 그대로 모드:
  `.step`으로 이식된 `data-slide` 개수 = `outputs/06_PPT프리뷰/chNN.html`의 `[data-slide]` 개수, 값이
  1부터 연번.
- [ ] **대본 슬라이드 번호 정합** — `outputs/07_판서/chNN_대본.md`의 `## 슬라이드 N` 번호가 1부터
  연번이고 `outputs/07_판서/chNN.html`의 컷 수와 정확히 같다.
- [ ] **`node --check`** — `outputs/07_판서/chNN.html`의 `<script>` 문법 통과(엔진을 그대로 복사했으면
  항상 통과 — 실패하면 복사 중 스크립트를 실수로 건드렸다는 뜻).
- [ ] **자립성** — 외부 CDN·웹폰트·스크립트 참조 없이 파일 하나로 브라우저에서 바로 열린다.

## repair 규칙

체크리스트 중 하나라도 실패하면 전체를 다시 만들지 않는다.

- **엔진 결함**(7종 중 하나라도 오작동, `node --check` 실패)은 `reference/engine.md` 명세와
  `template/board_template.html` 또는 `template/board_template_light.html` 원본을 기준으로,
  `<script>` 블록만 원본에서 그대로 재복사한다(다른 부분은 손대지 않는다).
- **콘텐츠 결함**(오탈자, 슬라이드 순서 어긋남, 요약 과밀, 그대로 모드 이식 누락)은 해당
  `.step` 하나만 다시 만든다. 다른 컷은 건드리지 않는다.
- **대본 정합 결함**(번호 누락/중복)은 어긋난 슬라이드 번호의 대본 항목만 추가·수정한다.
- **그대로 모드 스타일 충돌**(`:root` 변수 오염, 페이지 레벨 규칙 유입)이 발견되면 해당
  스타일 블록만 §4의 5~6 규칙대로 다시 고친다.

## 참고

- 엔진 명세(기능 7종 + 이벤트 처리 방식 + 데이터 모델): `reference/engine.md`
- 소유 템플릿: `template/board_template.html`(다크), `template/board_template_light.html`(라이트)
  — `<script>` 바이트 동일, `<style>` 색 토큰만 다름
- 요약 모드 컷 컴포넌트: `reference/components.md`
- 판서 대본 형식·톤·인용 규칙: `reference/script_guide.md`
- 그대로 모드가 소비하는 출력 계약(작성 주체는 `ppt-preview` 스킬): `.claude/skills/ppt-preview/SKILL.md`
  "출력 계약" 절 — `<section class="ppt-slide" data-slide="N">` + 직계 자식 `.ppt-canvas` +
  캔버스 내 `h2`
- 원고 스키마: `.claude/skills/manuscript-draft/references/manuscript-schema.md`
- status.md 형식: `templates/status_template.md`
- 파이프라인 표·디렉터리 구조: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`
  §3(7단계), §4(`outputs/07_판서/chNN.html` 경로 규약), §7(이 스킬의 재작성 배경)
- 빈 칠판만 필요하면(명시 요청 시): `panseo-board` 스킬 — 동일 엔진을 쓰지만 슬라이드 없이 칠판만
  낸다.
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. Step 3(구조 검증) grep으로 SKILL.md 자체를 확인했고,
  실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
