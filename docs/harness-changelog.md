# 하네스 변경 이력 (append-only 감사 로그)

> **역할 구분** (중복 기록 방지):
> - **설계 규범이 바뀌는 변경**(아키텍처·스키마·파이프라인·게이트)은 `docs/harness-design-v1.md`의 개정 이력 표에 **도** 기록한다 (그쪽이 설계 버전의 원천).
> - **운영 수준 변경**(포인터·참조·스킬 문구·에이전트 정의 수정, 파일 이동 등)은 이 파일에**만** 기록한다.
> - CLAUDE.md에는 이력을 두지 않는다 — "지금 무엇이 유효한지"만 담고, "왜 그렇게 됐는지"는 이 파일과 `docs/reviews/`가 담당한다.

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-07-05 | 초기 구성 (에이전트 17, 스킬 5) | 전체 | 설계 v1.2 승인 |
| 2026-07-05 | 스캐폴드 codex 검증 반영: 온라인 LAB 계약 밖 규정, Registry standalone 필드, deferred·조건부 G6 규칙 | online-lecture, lecture-harness, qa-agent, bridge | 스캐폴드 교차 검증 warning 3건 (설계 v1.3) |
| 2026-07-05 | 촬영강의 1편 = 30분 표준 명시 | skills/filmed-lecture | 드라이런 G1에서 사용자 피드백 ("촬영은 보통 30분 기준") |
| 2026-07-05 | bridge 폐기 → 참고스킬 복사 방식 전환 (panseo-slide/panseo-board/edu-sim-builder를 .claude/skills로 복사, "하네스 통합 재정의" 섹션 추가) | skills 3종 추가, reference-skill-bridge 삭제, 참조 문서 일괄 수정 | 사용자 결정 (드라이런 G2 시점, 설계 v1.4) |
| 2026-07-05 | 편(episode) 스키마, 원고 자수 예산 선반영 규칙, 기존 코드 반입 경로(existing_assets, lab-code 3모드, origin 필드) | schemas, content-rules, quality-gates, script-agent, lab-code-agent, filmed-lecture | 드라이런 길이 초과 3건 + 사용자 요구 (설계 v1.5) |
| 2026-07-05 | 촬영 슬라이드 판서 엔진 기반 전환(라이트 변형 템플릿) + 덱 간 디자인 일관성 규칙 + 원고 시드 블록([IMG]/d2/비유) | slide-rules, slide-composer/storyboard/script-agent, content-rules, filmed assets | G6 후 사용자 품질 피드백 4건 (설계 v1.6) |
| 2026-07-05 | 변경 처리 원칙(선반영 금지: 제안→계획→codex 사전 검증→승인→반영) 등록 | CLAUDE.md, gpt-review-process.md | 사용자 지적 — v1.6을 질문에 대한 선반영으로 진행한 절차 위반 (v1.6.1) |
| 2026-07-05 | CLAUDE.md 변경 이력을 이 파일로 분리 (CLAUDE.md = 현재 유효 상태만), stale 버전 핀 제거 | CLAUDE.md, lecture-harness SKILL.md, gpt-review-process.md, 본 파일 신설 | 사용자 제안 + codex 사전 검증 (blocker 0) — CLAUDE.md 비대화 방지 |
| 2026-07-05 | v1.7 반영: SIMULATION 레슨 폐지(시뮬=레슨의 파트), concept_model+architecture_diagram 신설(G1 직후 생성·G2 승인), 슬라이드 2프로파일(rich/summary — panseo-slide가 엔진 소유, 라이트 템플릿 이관), 온라인 라인=유튜브 판서 VOD 재정의 | schemas·quality-gates·content-rules, 파이프라인 3건, panseo-slide/filmed/offline/online SKILL, research/simulator/lesson-classifier/slide-composer/online-orchestrator 에이전트, 설계 문서 | 사용자 제안 4건 + codex 사전 검증 (기각 2건 병기, 설계 v1.7) |
| 2026-07-05 | v1.8 원고=책: [IMAGE PROMPT] 표기 표준화(image-gen 스킬 연동, codex spawn 자동 생성), d2 CLI 설치+SVG 렌더 병기, 밀도 강화(H2/H3마다 예시/비유+시각 요소), 원고 북 빌드 단계, 프롬프터 비발화 확장, QA 7항목 | content-rules, script/prompter/storyboard 에이전트, filmed pipeline, quality-gates, image-gen SKILL(stale 정정), 설계 문서 | 사용자 피드백 "원고는 책" + codex 사전 검증 조건부 통과 (설계 v1.8) |
| 2026-07-05 | pub-d2-diagram 스킬 연결: 원고 도형 렌더를 `render_md_diagrams.py`(ELK+모노톤 SVG)로 표준화, script-agent d2 문구에 스타일 계약 추가, QA에 d2 스타일 게이트(v1.9) 신설 | content-rules, script-agent, filmed pipeline, quality-gates, 설계 문서 | 사용자 제공 pub-d2-diagram 스킬 연결 (설계 v1.9) |
| 2026-07-05 | 오프라인 LAB required_artifacts 기본 문언 확정 (script·slides는 조건부 — 가이드·진행노트가 도입/진행 담당), lesson-classifier LAB 기본 포함 금지 | offline-lecture pipeline (v1.9.1) | 오프라인 드라이런 G6 QA blocker(문언 불일치) 해소, 사용자 승인 |
