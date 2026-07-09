---
name: manuscript-final
description: 원고 초안(2단계 산출물)을 사용자와 티키타카(반복 수정)하며 확정 원고로 완성한다. "원고 수정", "원고 완성", "티키타카" 요청 시 사용. outputs/02_원고/chNN_draft.md를 chNN.md로 이어받아 슬라이드 추가/삭제/압축/비유 교체/나레이션 수정을 한 번에 한 요청씩 처리하고, 사용자가 "확정"이라 하면 확정 체크리스트를 통과시켜 status.md 원고확정을 갱신한다. 시각 자산(이미지/D2)의 실제 생성은 이 스킬이 아니라 다음 단계 `visual-assets`(4단계)가 담당한다.
---

# manuscript-final

원고 초안 `outputs/02_원고/chNN_draft.md`(2단계 산출물, `manuscript-draft` 소유)를 사용자와의 반복 수정(티키타카)으로 다듬어 확정 원고 `outputs/02_원고/chNN.md`를 만드는 스킬. 이 확정 원고는 이후 `visual-assets`(4단계, 시각자산), `practice-code`(코드), `storyboard`, `ppt-preview`, `panseo-slide`, `edu-sim-builder`, `pptx-build`, `book-build` 전 단계의 단일 입력(source of truth)이 된다.

**스키마 규범**: `.claude/skills/manuscript-draft/references/manuscript-schema.md` — 이 스킬은 원고를 수정하는 동안에도 이 스키마(필드명·순서·표기)를 절대 깨뜨리지 않는다. 골든 참고: `templates/golden/manuscript_golden.md`.

`manuscript-draft`와의 역할 분담: 초안 단계는 "풍부하게 채우기"(압축 금지), `manuscript-final`은 "사용자 의도에 맞춰 덜어내고 다듬기"(압축·요약·비유 교체 허용) — 스키마 무결성은 두 단계 공통.

## 절차

### 1. 시작 — 초안 이어받기

- `outputs/02_원고/chNN.md`가 아직 없으면 `outputs/02_원고/chNN_draft.md`를 그대로 복사해 `outputs/02_원고/chNN.md`를 만든다.
- `outputs/02_원고/chNN.md`가 이미 있으면(이전 세션에서 티키타카 중이었으면) 그 파일을 그대로 이어서 연다 — 처음부터 다시 복사하지 않는다.
- `courses/{course-id}/status.md`의 해당 차시 `원고확정` 칸을 🔄로 갱신한다(아직 ✅가 아니면).

### 2. 티키타카 루프

사용자의 수정 지시를 슬라이드 단위로 받아 처리한다. 지시 예시: 슬라이드 추가/삭제, 나레이션 압축, 비유(Easy analogy) 교체, Practice 단계 조정, 평가 문항 교체 등.

- **한 번에 한 요청만 처리한다.** 여러 슬라이드를 한꺼번에 고치라는 지시라도 슬라이드별로 순차 처리하고, 매 처리 후 무엇을 바꿨는지 요약해 보고한다(전체 원고를 다시 붙여넣지 않는다).
- 수정할 때마다 **스키마 필드 무결성**을 유지한다: 8개 필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment) 라벨·순서를 지우거나 흐트러뜨리지 않는다. 슬라이드를 삭제해도 다른 슬라이드의 필드 구조는 그대로 둔다. 슬라이드를 삭제하면 `## Slide N.` 번호가 뒤로 밀리는 슬라이드들의 번호를 다시 매긴다(평가 슬라이드의 "관련학습보기: Slide N" 참조도 함께 갱신).
- 나레이션을 압축해도 "그대로 소리 내어 읽을 수 있는 존댓말 완결 문장"이라는 스키마 원칙은 유지한다(불릿으로 바꾸지 않는다).
- Source 필드는 삭제·요약 대상이 아니다 — 슬라이드를 삭제하지 않는 한 출처는 그대로 남긴다.

### 3. 시각 자산 — 다음 단계로 이관 (2026-07-06 개정)

이 스킬은 Visual asset 필드의 프롬프트/D2 소스 **문구를 다듬는 것까지만** 책임진다. 실제 이미지/D2 렌더 생성, `→ 생성됨:`/`→ 렌더됨:` 병기, `outputs/03_시각자산/manifest_chNN.json` 갱신은 원고확정 **다음** 단계인 `visual-assets` 스킬(4단계, `.claude/skills/visual-assets/SKILL.md`)이 전담한다 — image-gen/pub-d2-diagram 브릿지 절차(태그 변환, 스크래치 파일, 경로 규약)도 그쪽으로 이관되었다.

원고확정 시점에 시각 자산이 아직 없어도(프롬프트/D2 소스만 있어도) 확정할 수 있다 — 자산 생성 완료 여부는 §4 확정 체크리스트의 대상이 아니다.

### 4. 확정

사용자가 "확정"이라고 하면 아래 **확정 체크리스트**를 실행한다.

## 확정 체크리스트

- [ ] **스키마 전 필드 무결**: 모든 슬라이드에 8개 필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment)가 순서대로 존재한다(해당 없음도 `- 없음.`으로 명기, 필드 자체 누락 없음). 슬라이드 번호가 순차적이고 평가 슬라이드의 "관련학습보기" 참조 번호가 실제 슬라이드와 일치한다.
- [ ] **draft 대비 의도된 변경만 존재**: `outputs/02_원고/chNN_draft.md`와 `chNN.md`를 비교(diff)했을 때 나타나는 모든 차이가 티키타카 루프에서 사용자가 실제로 요청한 수정에 대응한다 — 사용자가 지시하지 않은 슬라이드·필드가 임의로 삭제되거나 축약되어 있지 않다.

## repair 규칙

체크리스트 중 하나라도 실패하면 **원고 전체를 다시 쓰지 않는다.** 실패한 슬라이드만 골라 사용자에게 무엇이 왜 실패했는지 보고한 뒤(예: "Slide 9의 Assessment 관련학습보기가 삭제된 Slide 7을 가리킵니다"), 해당 슬라이드 블록만 수정하고 그 슬라이드에 한해 체크리스트를 다시 확인한다. 여러 슬라이드가 동시에 실패했으면 슬라이드별로 반복한다. 이때도 사용자가 지시하지 않은 다른 슬라이드는 건드리지 않는다.

### 5. 확정 반영

체크리스트를 모두 통과하면:

- `courses/{course-id}/status.md`의 해당 차시 `원고확정` 칸을 ✅로 갱신한다.
- "산출물 인덱스"에 `- chNN 원고확정: outputs/02_원고/chNN.md (확정 YYYY-MM-DD)`를 추가한다.
- "다음 할 일"을 `chNN 시각자산 생성(visual-assets)`으로 갱신한다.
- 사용자에게 확정 완료와 최종 슬라이드 목록(번호 + 제목)을 요약해 보고한다.

## 참고

- 원고 스키마 상세: `.claude/skills/manuscript-draft/references/manuscript-schema.md`
- 골든 예시: `templates/golden/manuscript_golden.md`
- 시각 자산 생성: 다음 단계 `visual-assets` 스킬(`.claude/skills/visual-assets/SKILL.md`) 참조 — image-gen/pub-d2-diagram 호출·브릿지 절차·`outputs/03_시각자산/manifest_chNN.json` 갱신 전부 그 스킬이 담당한다(§3).
- 이 스킬은 대화형 절차 문서이며 TDD 대상이 아니다. 구조 검증은 SKILL.md 필수 키워드 grep(개발 시점 1회성 검증)으로 확인되었고, 실사용 시 품질 검증은 본문 "확정 체크리스트"가 매 실행마다 담당한다.
