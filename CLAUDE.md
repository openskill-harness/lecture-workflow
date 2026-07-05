# 강의 제작 하네스

## 하네스: 개발자 강의 제작

**목표:** 개발자 강의(촬영/오프라인/온라인)를 산출물 계약과 품질 게이트로 제작한다.

**트리거:**
- 촬영/녹화 강의 제작·수정·재실행 요청 → `filmed-lecture` 스킬
- 오프라인/현장/기관 강의 제작·수정·재실행 요청 → `offline-lecture` 스킬
- 온라인/유튜브/인강(판서 VOD) 강의 제작·수정·재실행 요청 → `online-lecture` 스킬
- 강의 유형이 불명확하면 delivery_type(촬영/오프라인/온라인)을 먼저 확인
- 하네스 구조·스키마·게이트 질문, 구조 변경 → `lecture-harness` 스킬
- 판서슬라이드 생성 → `panseo-slide` 스킬, 빈 판서보드(명시 요청만) → `panseo-board` 스킬, 시뮬레이터 → `edu-sim-builder` 스킬. 셋 다 각 SKILL.md 말미 "하네스 통합 재정의" 섹션이 본문보다 우선. `참고스킬/` 원본 폴더는 백업 — 수정 금지
- 단순 질문은 직접 응답 가능

**변경 처리 원칙 (필수, 선반영 금지):** 질문형 요청("~가능해?", "~어때?")과 품질 피드백은 실행 지시가 아니다. 하네스 구조 변경은 반드시 ① 변경 계획서 작성(`docs/proposals/{날짜}_{주제}.md` — 배경/제안/대안/영향 범위/되돌리기) → ② codex **사전** 검증(정합성뿐 아니라 **아이디어 자체의 타당성**: 장점/리스크/더 나은 대안/반대 의견) → ③ 사용자에게 항목별 [계획+codex 의견+권고] 보고 → ④ 승인된 항목만 반영 → ⑤ 반영 후 정합성 검증 순서를 따른다. 절차 상세: `.claude/skills/lecture-harness/references/gpt-review-process.md`.

**설계 결정 검증 규칙 (필수):** 설계 시점에 결정되는 구조적 사항(아키텍처·스키마·파이프라인·품질 게이트 변경, 에이전트/스킬 추가·수정)은 GPT를 CLI로 spawn하여(`codex exec --sandbox read-only '...' </dev/null`, Git Bash에서 stdin 닫고 실행) 교차 검토·검증을 거친다. 절차: `.claude/skills/lecture-harness/references/gpt-review-process.md`. 결과는 `docs/reviews/`에 저장. blocker는 보고 전 수정, 최종 결정은 사용자.

**설계 문서:** `docs/harness-design-v1.md` (최신 개정은 문서 내 개정 이력 표 참조 — 버전 핀 두지 않음) — 구조 변경 시 이 문서를 먼저 개정한다. 상위 배경 문서: `docs/claude-handoff-lecture-harness.md` — **이력 문서(비규범)**. 규범은 설계 문서다. 인수인계 문서의 일부 조항(bridge 방식, SIMULATION 레슨 모드, 온라인=자기주도형)은 이후 사용자 결정으로 대체됨 (대체 이력: `docs/harness-changelog.md`).

**현재 구성:** 에이전트 17 (`.claude/agents/`), 스킬 7 (라인 3 + lecture-harness + 판서/보드/시뮬 복사본 3) + 연동 스킬(image-gen, pub-d2-diagram — 원고 북 빌드 담당). 슬라이드는 panseo-slide 스킬(판서 엔진 소유)의 2프로파일 — rich(고밀도·라이트, 촬영 고정/오프라인 선택) / summary(판서용·다크, 온라인=유튜브 판서 VOD 고정/오프라인 선택). 레슨 모드는 THEORY/LAB/HYBRID (시뮬레이터는 레슨의 파트). 원고 = 발화 대본 + 책(렌더된 d2 모노톤 도형·생성 이미지·비유 — content-rules (f)).

**강의 현황:** `spring-mvc-2026` (촬영 2편, G6 final) / `spring-mvc-offline-2026` (오프라인 180분, G6 final) / `spring-mvc-online-2026` (온라인 유튜브 판서 VOD — **G1 승인 대기 동결**, 재개 시 여기부터). 로드맵 잔여: 온라인 드라이런 완주, PPTX 변환, 기관 변환 실행 경로.

**변경 이력:** `docs/harness-changelog.md` (append-only — CLAUDE.md에는 이력을 두지 않는다. 설계 규범 변경의 버전 이력은 설계 문서 내 개정 이력 표)
