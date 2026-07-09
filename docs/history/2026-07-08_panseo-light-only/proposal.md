# panseo-slide 두 모드 모두 라이트 — 다크 네이비 제거

- 날짜: 2026-07-08
- 대상: `.claude/skills/panseo-slide/SKILL.md`, `reference/components.md`, 다크 템플릿 파일
- 유형: 변경(R2 제자리 교체) + 고아 파일 제거(R1)

## 문제 / 사용자 결정

사용자가 panseo-slide의 **요약·그대로 두 모드 모두 라이트 테마**로 통일하기로 결정했다(다크 네이비 미사용). 현재는 요약 모드만 다크 네이비 템플릿(`template/board_template.html`)을 기본으로 쓰고, 그대로 모드만 라이트(`template/board_template_light.html`)를 쓴다.

## 근거(현재형)

- 요약 모드 컴포넌트(`reference/components.md`: 도발질문·게이지 등)는 색을 `:root` 변수(`var(--warn)`/`var(--green)`/`var(--gold)`/`var(--accent)`)로 참조한다. 라이트 템플릿 `board_template_light.html`의 `:root`가 이 4개 변수를 모두 정의하므로(`--warn:#d21f3c` 등), 요약 모드를 라이트 템플릿으로 옮겨도 컴포넌트가 그대로 렌더된다.
- 두 템플릿은 "`<script>` 바이트 동일, 색 토큰만 다름"이라 엔진 동작은 라이트에서도 동일하다.
- 판서모드 칠판(펜 필기 배경)은 라이트 템플릿에서도 초록 유지(판서 가독성) — 이건 슬라이드 테마가 아니라 필기 보드라 다크 네이비 제거 대상과 무관.

## 제안

1. §2 모드별 템플릿 표: 요약 모드 템플릿을 `board_template_light.html`로 교체(그대로 모드와 동일). "다크 네이비" 표기 제거.
2. §3 요약 모드 절차 step 5: "기본: 다크 네이비 테크" → "기본: 라이트(그대로 모드와 동일 팔레트)". `:root` 강조색만 톤 조정 가능은 유지.
3. repair §·참고 §: 소유 템플릿을 `board_template_light.html` 하나로 정리(엔진 재복사 기준도 이 파일).
4. `reference/components.md` §의 "기본은 다크 네이비 테크" → 라이트로 교체.
5. 고아가 된 `panseo-slide/template/board_template.html`(다크) **삭제**(R1: 어느 모드도 안 쓰면 dead state).

## 범위 밖(건드리지 않음)

- `panseo-board` 스킬(빈 칠판): 자체 `panseo-board/template/board_template.html`(별도 파일)을 쓰며, 사용자 지시는 panseo-slide의 두 모드에 한정되므로 미변경. panseo-slide 다크 템플릿 삭제는 panseo-board에 영향 없음(파일 분리).

## 회귀 위험

- 요약 모드 컴포넌트가 라이트에서 색이 죽지 않는지 → 라이트 `:root`에 강조 변수 전부 존재 확인됨(위 근거).
- 다크 템플릿 삭제로 깨지는 참조 → panseo-slide 내 참조는 이 변경으로 전부 라이트로 교체, panseo-board는 자체 복사본이라 무관. 삭제 후 잔여 참조 0 확인 필요(grep).

## 검증

- SKILL.md·components.md의 "다크 네이비" 잔재 0, board_template.html(다크) 참조 0.
- 후속 ch01 판서(그대로 모드)는 원래 라이트라 이 변경과 독립적으로 진행.
