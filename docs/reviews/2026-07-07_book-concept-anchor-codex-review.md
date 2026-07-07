# codex 사전검증 — 책 개념 앵커 (2026-07-07)

**결론: 조건부 승인** (codex gpt-5.5, xhigh, read-only). 핵심 접근(Div.concept-anchor → Lua 필터 → `#concept-anchor[…]` typst)은 정합. 3개 조건을 계획에 반영해야 함.

## 조건 (계획 반영 대상)

### 조건 1 — Lua 필터: AST→Typst 직렬화로 못박기
- Lua 필터가 내부 Markdown 문자열을 그대로 끼워 넣으면 안 된다. `Div`의 AST content를 `pandoc.write(pandoc.Pandoc(el.content), "typst")`로 Typst content로 직렬화한 뒤 `pandoc.RawBlock("typst", "#concept-anchor[\n" .. inner .. "\n]")`로 감싼다.
- pandoc 입력 포맷에 `+fenced_divs`를 명시한다.
- 두 번째 필터(anchor)를 paragraph-gap **앞**에 두어 순서를 고정한다(anchor가 Div→RawBlock으로 낮춘 뒤 paragraph-gap이 그 RawBlock을 건드리지 않음).
- 후처리 이미지 변환(typst_builder.py:498)은 감싼 내부 Typst 코드에 계속 적용 가능.

### 조건 2 — figure 여백 중복 + design 모드 경로
- 앵커 내부 이미지가 alt/caption을 가지면 전역 `#show figure`(book_base.typ:176)가 적용되어 앵커 자체 여백과 중복된다. → **앵커 D2 이미지는 빈 alt**(`![](path)`)로 두어 `#auto-image`의 `alt==none` 분기(figure 없이 align(center))를 타게 한다.
- `design` 모드는 design_assembler 경로(typst_builder.py:674)가 `book_base.typ`만 읽지 않는다. → `#concept-anchor` 함수가 **모든 base 생성 경로**에 포함되도록 한다(design 경로 템플릿에도 함수 존재 확인/추가).

### 조건 3 — 편집검토: 기존 3종 유지 + 신규 ④ 추가 (대체 금지)
- 스펙은 ③"과도한 소설화 방지"를 앵커 검증으로 **대체**한다고 썼으나, 대체하면 "이야기만 3문단 이상 연속" 감지가 사라진다. → **기존 ③ 유지**, `개념 앵커 검증`을 **명시적 ④로 추가**(3종 → 4종).
- ③의 "정의·동작 원리·코드 삽입" 문구는 "정의는 앵커에만, 프로즈에는 동작 원리/코드/예시"로 고쳐 새 하드 체크의 "정의 중복 용해 금지"와 충돌하지 않게 한다.
- 확정 체크리스트도 4종으로 갱신한다.

## 비고
- Pandoc이 codex 실행 환경에 없어 실제 변환 샘플은 실행하지 못함(정합성은 AST 수준 분석). 구현 Task의 pytest(pandoc 실변환)가 이를 실증한다.
