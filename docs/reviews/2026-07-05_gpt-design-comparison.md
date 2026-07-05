# GPT 설계안 비교 검토 기록

- 날짜: 2026-07-05
- 대상: 사용자가 제공한 GPT(ChatGPT) 설계안 "강의 제작 하네스: 오케스트레이션 3개로 분리하는 구조" vs `docs/harness-design-v1.md` (v1.0)
- 결과: v1.1로 개정 (채택 9건, 비채택 4건)

## 채택 — v1.1에 반영

| # | 항목 | 반영 위치 | 사유 |
|---|------|----------|------|
| 1 | Manifest `style`/`constraints` 확장 (max_slide_words, code_font_min_pt, visual_style, citation_required_for) | 5-1절 | 품질 게이트를 수치로 검사 가능하게 함 |
| 2 | 출처 인용 정책 (통계·뉴스·버전 특정 주장·외부 사례) | 5-4절 (a) | v1.0에 리서치 신뢰성 규칙이 없었음 |
| 3 | 이론형 레슨 서사 구조 강제 (문제 상황 → … → 언제 쓰고 언제 피할지) | 5-4절 (b) | v1.0은 THEORY 레슨의 내용 품질 기준이 비어 있었음 |
| 4 | 시뮬레이터 프로파일 (filmed / offline_interactive / online_self_paced) | 5-4절 (c), 8절 bridge | 하나의 스킬을 공유하되 미래 분리를 대비하는 좋은 장치 |
| 5 | step 코드 실행 검증 + `validation_log` 산출물 타입 | 5-3절, 10절 | "코드가 실제로 도는가"가 v1.0 계약에 없었음 |
| 6 | LAB 구조 스키마 (learner_task / instructor_checkpoint / submission / evaluation.rubric_id) | 7-2절 | 실습 가이드·문제지·진행 노트·루브릭이 한 원본에서 파생되어 상호 충돌을 구조적으로 방지 |
| 7 | 루브릭 YAML 스키마 (criteria/weight/levels) + `problem_sheet` 타입 | 7-2절, 5-3절 | 기관 포맷 변환의 전제인 내부 원본 고정을 구체화 |
| 8 | 슬라이드 제작 단계 분해 (스토리보드 → 명세 → 조립 → 렌더링 QA) + 나레이션 길이 검증 | 7-1절 | 한 에이전트가 슬라이드를 통짜로 만들면 품질 검사 지점이 사라짐. 길이 검증은 duration과 원고를 연결하는 유일한 수치 게이트 |
| 9 | 선언형 파이프라인 표기 (`for_each: lesson_plan where lesson_mode == ...`) | 7-0절 | "if를 흩뿌리지 않는다" 원칙의 구체적 표기법 |

## 비채택 — 사유

| # | 항목 | 사유 |
|---|------|------|
| 1 | MVP에 PPTX 변환 포함 | 사용자 결정으로 후속 연기 (2026-07-05). Artifact 타입만 예약 |
| 2 | 상황 만화(comic)·이미지 에셋 에이전트/스킬 | 인수인계 문서상 촬영강의 산출물이지만 MVP 범위 아님. 후속 확장 시 추가 |
| 3 | `lecture-factory/` 독자 폴더 구조 (orchestrators/, skill-library/) | Claude Code 환경의 표준인 `.claude/agents` + `.claude/skills` 구조를 유지. 개념(공유 코어 vs 라인 전용)은 skills 디렉토리 구성에 이미 반영됨 |
| 4 | 슬라이드 스킬 8개 분리 (shape-design, diagram-design, image-prompt, image-generation 등) | 과잉 분리. 단계로는 채택하되(7-1절) 스킬 단위 분리는 실제 병목이 확인될 때 진행. 이미지 생성은 MVP 범위 밖 |

## 비고

- GPT 설계안은 인수인계 문서의 핵심 정정사항(panseo-slide에 판서보드 내장, panseo-board 중복 생성 금지)을 다루지 않았다. 이 부분은 v1이 우세하므로 유지.
- GPT 설계안의 "판서보드 슬라이드(BoardSlideAgent)" 명칭은 우리 용어로 판서슬라이드(panseo-slide-agent)에 해당한다.
