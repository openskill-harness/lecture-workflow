# 적용 결과 (2026-07-07)

proposal.md(codex 조건부승인 반영판)를 다음과 같이 적용 완료.

## 반영 내역

- **스크립트**: `scripts/course_layout.py` 신설(배치 자동 판별 — `outputs/` 없고 루트 `manuscripts/` 있으면 평면 배치).
  `build_asset_manifest.py`·`annotate_manuscript_assets.py`·`extract_claim_candidates.py`가 이를 사용.
  `manuscript_grammar.py` IMG_PATH_RE는 `assets/…`·`outputs/03_시각자산/…` 둘 다 인식.
  `typst_builder.py`는 루트 추정에 `outputs/` 추가 + cover_dir을 config['assets_dir']로.
- **문서 치환**: allowlist 정규식 sweep 334곳/26파일(.claude/skills, specs 3종, templates) 후 diff 전수 검토.
  오염 정정 7건 — 외부 프로젝트 예시(pub-d2), 범용 pub 배치 예시(build-pipeline.md), 레거시 실사례
  인용(courses/spring-boot-basic/assets·manuscripts 실경로로 복원), image-gen 표준 경로 서술 재작성.
- **구조 수정**: spec §4 트리 재작성(outputs/ 규약 + 배치 판별 규칙 + 상대참조 불변 서술),
  spec "인덱스는 부가 정보" → "인덱스 실경로가 repair 1차 기준"으로 교체,
  course-pipeline repair 1번을 인덱스 1차/규약 fallback으로 개정,
  book-build 인라인 config를 course_layout 사용으로 교체,
  storyboard/ppt-preview 임베드 가이드를 relpath 계산 규칙으로 교체.
- **부수 발견 수정**: pptx-build·pub-d2-diagram SKILL.md frontmatter description이 엄격 YAML에서
  파싱 실패(콜론+공백) — 문구 수정/단일따옴표 인용으로 해결. 전 스킬 frontmatter YAML 파싱 통과 확인.

## 검증 결과

- `pytest scripts/test_build_pptx.py` 17 passed (outputs 배치 인식 테스트 1건 신규 추가).
- manifest/annotate/extract 스크립트를 outputs·평면 두 배치 픽스처로 스모크 — 6/6 OK,
  manifest 경로가 배치별로 올바르게 기록됨(`outputs/03_시각자산/images/…` vs `assets/images/…`).
- drift grep 0건(구 경로 잔존·old+new·dead-link — 의도된 잔존은 배치 판별 규칙 서술,
  레거시 실사례 인용, 외부 프로젝트 예시뿐).
- `check_visual_gate.py` 회귀 없음(spring-boot-basic OK). `courses/**`·`docs/history/**` 무변경.

## 미완(신규 과정 첫 실행 때 스모크)

- 한글 경로 실전 통과: `ppt-preview → render_preview_slides → build_pptx`(헤드리스 렌더),
  `book-build`(typst/pandoc), `plot_gen.py` — 신규 과정 ch01 진행이 실전 검증(proposal §검증).
