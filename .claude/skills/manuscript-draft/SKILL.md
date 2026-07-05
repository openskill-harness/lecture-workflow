---
name: manuscript-draft
description: 확정된 과정개요서와 리서치를 근거로 차시별 원고 초안을 만든다. "원고 초안", "N차시 원고 만들어줘", "원고 초안 생성" 요청 시 사용. status.md에서 대상 차시를 확인하고, 개요서·리서치 md를 근거로 references/manuscript-schema.md 규격에 맞는 manuscripts/chNN_draft.md를 생성한 뒤 확정 체크리스트를 통과시키고 사용자 확인을 받는다.
---

# manuscript-draft

과정개요서(1단계 산출물)와 리서치를 원천으로 차시별 원고 초안 `manuscripts/chNN_draft.md`를 만드는 스킬. 이 원고는 이후 `manuscript-final`, `practice-code`, `storyboard`, `ppt-preview`, `panseo-slide`, `edu-sim-builder`, `pptx-build`, `book-build` 전 단계의 단일 원천(source of truth)이 된다.

**스키마 규범**: `references/manuscript-schema.md` — 필드명·순서·표기는 반드시 `templates/golden/manuscript_golden.md`와 일치해야 한다. 작성 전에 골든 파일을 먼저 열어 문체·분량 감각을 확인한다.

## 절차

### 1. 대상 차시 확인

- 사용자가 `chNN`을 인자로 지정했으면 그 차시로 진행한다.
- 지정하지 않았으면 `courses/{course-id}/status.md`를 읽어 "다음 할 일"과 차시 진행 표에서 `원고초안`이 ⬜(미착수)인 첫 차시를 대상으로 제안한다.
- `1.과정개요서.md`가 아직 확정(✅)되지 않았으면 먼저 `course-outline` 스킬로 개요서를 확정하라고 안내하고 중단한다.

### 2. 근거 자료 확인

- `1.과정개요서.md`에서 대상 차시의 차시명·차시내용·실습 여부·NCS 연계(해당 시)를 확인한다.
- `courses/{course-id}/research/*.md`에서 이 차시 주제와 관련된 리서치 md를 찾아 주장-출처 쌍을 확인한다.
- 리서치 md에 없는 새로운 주장(예: 특정 버전 요구사항, 특정 API 동작)을 원고에 넣어야 하면, 웹서치(WebSearch/WebFetch 또는 서브에이전트)로 출처를 확보한 뒤 인용한다. 출처 없는 주장은 원고에 넣지 않는다.

### 3. 초안 생성

- `references/manuscript-schema.md` 규격대로 `manuscripts/chNN_draft.md`를 작성한다.
- 차시 헤더(과정명/회차명/차시 목표/NCS 연계/예상 분량) + `## 사용 출처` + 슬라이드 블록들(표지 → 도입 → 학습목표 → 본문 → 실습 → 정리 → 평가 3문항 → 참고자료 권장)을 골든과 같은 흐름으로 구성한다.
- **분량이 크므로 서브에이전트에 위임 가능**: 슬라이드 수가 많거나(15개 이상) 여러 실습 단계가 있으면, Agent 도구(`subagent_type: general-purpose`)에 다음을 전달해 초안 생성을 위임할 수 있다.
  - `references/manuscript-schema.md`의 절대 경로(규격)
  - `templates/golden/manuscript_golden.md`의 절대 경로(문체·형식 예시)
  - `1.과정개요서.md`의 절대 경로 + 대상 차시 지정
  - 관련 `research/*.md` 경로들
  - 출력 경로 `manuscripts/chNN_draft.md`와 "스키마 8필드 순서 고정, 압축 금지, Source는 실제 출처만" 등 핵심 제약을 프롬프트에 명시
  - 서브에이전트 완료 후 메인은 결과 파일을 직접 읽고 §4 체크리스트로 검증한다(위임했다고 검증까지 생략하지 않는다).

### 4. 확정 체크리스트

`manuscripts/chNN_draft.md` 저장 전에 아래를 모두 확인한다. 하나라도 실패하면 **repair 규칙**을 따른다.

- [ ] 전 슬라이드에 8개 필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment)가 모두 존재한다(해당 없음도 `- 없음.`으로 명기되어 있고 필드 자체가 빠진 곳이 없다).
- [ ] 평가 문항이 정확히 4지선다형 1개 + 진위형 2개이며, 각 문항에 보기(4지선다형)/정답/난이도/해설/관련학습보기가 모두 있다.
- [ ] 모든 Source 필드에 URL 또는 문서명(예: `[과정개요서] ....hwpx`)이 실제로 적혀 있다 — "없음"으로 비워둔 Source가 없다.
- [ ] 모든 Narration이 그대로 소리 내어 읽을 수 있는 존댓말(합니다체) 완결 문장/문단이다 — 불릿 나열이나 개조식 문장이 섞여 있지 않다.

### 5. repair 규칙

체크리스트 실패 시 **원고 전체를 다시 만들지 않는다.** 실패한 필드가 속한 슬라이드만 골라 해당 슬라이드 블록만 재생성한다(다른 슬라이드는 그대로 둔다). 예: Slide 7의 Source가 비어 있으면 Slide 7 블록만 다시 쓰고, 재생성 후 §4 체크리스트를 그 슬라이드에 한해 다시 확인한다. 여러 슬라이드가 동시에 실패했으면 슬라이드별로 반복한다.

### 6. 보고 및 확정

- 체크리스트 통과 후, 사용자에게 슬라이드 목록(번호 + 제목)을 요약해 보고하고 확인을 받는다.
- 사용자가 확인하면 `status.md`의 해당 차시 `원고초안` 칸을 ✅로 갱신하고 "산출물 인덱스"에 `- chNN 원고초안: manuscripts/chNN_draft.md (확정 YYYY-MM-DD)`를 추가, "다음 할 일"을 `chNN 원고확정(manuscript-final)`으로 갱신한다.
- 사용자가 수정을 요청하면 해당 슬라이드만 §5 repair 규칙으로 재생성하고 다시 보고한다(원고초안 단계에서는 압축·요약 요청이 와도 §6(초안 원칙) 때문에 압축하지 않는다는 점을 안내하고, 요약은 `manuscript-final` 단계에서 진행하자고 제안한다).

## 참고

- 원고 스키마 상세: `references/manuscript-schema.md`
- 골든 예시: `templates/golden/manuscript_golden.md`
- 이 스킬은 대화형 절차 문서이며 TDD 대상이 아니다. 구조 검증은 골든 파일 필드명 grep(Step 3, 개발 시점 1회성 검증)으로 이미 확인되었고, 실사용 시 품질 검증은 본문 §4 확정 체크리스트가 매 실행마다 담당한다.
