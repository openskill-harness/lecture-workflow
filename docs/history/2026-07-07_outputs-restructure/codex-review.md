codex
조건부승인: 방향은 맞지만 루트 스크립트 하드코딩, repair 계약, 누락 참조를 보강하기 전에는 안전하게 적용할 수 없음.

1. 경로 매핑이 문서 표 수준에 머물러 있습니다. 제안의 매핑 표는 최상위 폴더만 다루지만, 실제로는 `assets/ppt_render`, `book/chNN_원고.md`, `book/characters.md`, `book.typ`, `_build/`, `verification/chNN_verify.md` 같은 파생·중간 산출물이 계약에 들어 있습니다. 특히 `book-build`는 `book_dir = course_dir / "book"`와 `assets_dir = course_dir / "assets"`를 전제로 합니다: [.claude/skills/book-build/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:91).

2. 레거시 무이관은 가능하지만, 현재 제안의 repair 일반화는 아직 안전하지 않습니다. 제안은 status 인덱스 우선 검증을 말하지만, 현행 `course-pipeline` repair는 여전히 `manuscripts/`, `assets/manifest.json`, `storyboards/` 등을 직접 규약 경로로 대조합니다: [.claude/skills/course-pipeline/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-pipeline/SKILL.md:96). 또한 현행 spec은 “경로는 규약으로 고정되므로 인덱스는 부가 정보”라고 하므로, 인덱스를 1차 진실원으로 승격하려면 spec과 template도 같이 바꿔야 합니다: [design.md](C:/Users/ssarm/Documents/course-haness/docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:127).

3. 기존 `spring-boot-basic`은 status 인덱스가 비교적 충실해서 레거시 유지 자체는 성립합니다. 다만 인덱스가 없는 레거시 과정까지 고려한다면 “인덱스 없으면 현행 규약”은 새 outputs 규약으로 떨어져 오탐을 냅니다. fallback은 `old-layout`과 `outputs-layout`을 명시적으로 구분해야 합니다.

4. 한글 폴더명 자체보다 더 큰 위험은 스크립트의 `assets`/`manuscripts` 하드코딩입니다. `build_asset_manifest.py`는 `course / "manuscripts"`와 `course / "assets"`를 직접 읽고 씁니다: [build_asset_manifest.py](C:/Users/ssarm/Documents/course-haness/scripts/build_asset_manifest.py:107). `annotate_manuscript_assets.py`도 동일합니다: [annotate_manuscript_assets.py](C:/Users/ssarm/Documents/course-haness/scripts/annotate_manuscript_assets.py:22). `pptx` 네이티브 모드는 `IMG_PATH_RE`가 `assets/...`만 인식합니다: [manuscript_grammar.py](C:/Users/ssarm/Documents/course-haness/scripts/manuscript_grammar.py:20).

5. 헤드리스 Chromium은 `Path.as_uri()`를 쓰고 있어 한글 HTML 경로 자체는 상대적으로 안전합니다: [render_preview_slides.py](C:/Users/ssarm/Documents/course-haness/scripts/render_preview_slides.py:46). 하지만 호출 예시는 여전히 `ppt_previews/`, `assets/ppt_render/`, `pptx/`입니다: [.claude/skills/pptx-build/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/pptx-build/SKILL.md:52). 새 구조에서는 `outputs/06_PPT프리뷰`, `outputs/03_시각자산/ppt_render`, `outputs/09_PPTX`로 바뀌어야 합니다.

6. 상대경로 치환은 단순 문자열 치환으로 처리하면 위험합니다. 제안의 `../assets/...` → `../03_시각자산/...` 방향은 맞지만, 현행 `storyboard`/`ppt-preview` 스킬은 manifest의 `assets/images/...`에 `../`를 붙이는 방식으로 설명되어 있습니다: [.claude/skills/storyboard/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/storyboard/SKILL.md:52), [.claude/skills/ppt-preview/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/ppt-preview/SKILL.md:68). 구현 조건은 `Path.relative_to`/`os.path.relpath` 기반으로 “소비 파일 위치 → 실제 자산 위치”를 계산하는 것입니다.

7. 치환 오염 방지는 “슬래시 포함 패턴”만으로는 부족합니다. 예를 들어 `book-build` reference에는 외부 원본 워크플로 glob인 `projects/*/book/front/*.md`가 있어 course 산출물 경로가 아닙니다: [.claude/skills/book-build/references/storytelling.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/storytelling.md:4). `book/` 일괄 치환은 이런 reference를 오염시킬 수 있으므로 course-root 상대경로만 allowlist로 바꿔야 합니다.

8. 놓친 참조 파일이 있습니다. 대표적으로 `scripts/build_asset_manifest.py`, `scripts/annotate_manuscript_assets.py`, `scripts/extract_claim_candidates.py`, `scripts/build_pptx.py`, `scripts/test_build_pptx.py`, `templates/golden/*`, `.claude/skills/*/references/*.md`, `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`, `docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md`가 제안의 변경 대상 목록에 명시되지 않았습니다. 특히 `course-outline`도 신규 과정 첫 저장 위치를 아직 `courses/{id}/1.과정개요서.md`로 지시합니다: [.claude/skills/course-outline/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-outline/SKILL.md:64).

9. 조건: 적용 전 최소 검증은 필요합니다. `build_asset_manifest`/`annotate`/`extract_claim_candidates`/`build_pptx` 단위 테스트를 outputs 경로로 갱신하고, 한글 경로가 포함된 신규 과정에서 `ppt-preview → render_preview_slides → build_pptx`, `book-build`, `plot_gen.py`를 실제로 한 번 통과시켜야 합니다. `scripts/check_visual_gate.py`는 경로를 보지 않아 변경 불요라는 제안 판단은 타당합니다.
tokens used
224,479
조건부승인: 방향은 맞지만 루트 스크립트 하드코딩, repair 계약, 누락 참조를 보강하기 전에는 안전하게 적용할 수 없음.

1. 경로 매핑이 문서 표 수준에 머물러 있습니다. 제안의 매핑 표는 최상위 폴더만 다루지만, 실제로는 `assets/ppt_render`, `book/chNN_원고.md`, `book/characters.md`, `book.typ`, `_build/`, `verification/chNN_verify.md` 같은 파생·중간 산출물이 계약에 들어 있습니다. 특히 `book-build`는 `book_dir = course_dir / "book"`와 `assets_dir = course_dir / "assets"`를 전제로 합니다: [.claude/skills/book-build/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:91).

2. 레거시 무이관은 가능하지만, 현재 제안의 repair 일반화는 아직 안전하지 않습니다. 제안은 status 인덱스 우선 검증을 말하지만, 현행 `course-pipeline` repair는 여전히 `manuscripts/`, `assets/manifest.json`, `storyboards/` 등을 직접 규약 경로로 대조합니다: [.claude/skills/course-pipeline/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-pipeline/SKILL.md:96). 또한 현행 spec은 “경로는 규약으로 고정되므로 인덱스는 부가 정보”라고 하므로, 인덱스를 1차 진실원으로 승격하려면 spec과 template도 같이 바꿔야 합니다: [design.md](C:/Users/ssarm/Documents/course-haness/docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:127).

3. 기존 `spring-boot-basic`은 status 인덱스가 비교적 충실해서 레거시 유지 자체는 성립합니다. 다만 인덱스가 없는 레거시 과정까지 고려한다면 “인덱스 없으면 현행 규약”은 새 outputs 규약으로 떨어져 오탐을 냅니다. fallback은 `old-layout`과 `outputs-layout`을 명시적으로 구분해야 합니다.

4. 한글 폴더명 자체보다 더 큰 위험은 스크립트의 `assets`/`manuscripts` 하드코딩입니다. `build_asset_manifest.py`는 `course / "manuscripts"`와 `course / "assets"`를 직접 읽고 씁니다: [build_asset_manifest.py](C:/Users/ssarm/Documents/course-haness/scripts/build_asset_manifest.py:107). `annotate_manuscript_assets.py`도 동일합니다: [annotate_manuscript_assets.py](C:/Users/ssarm/Documents/course-haness/scripts/annotate_manuscript_assets.py:22). `pptx` 네이티브 모드는 `IMG_PATH_RE`가 `assets/...`만 인식합니다: [manuscript_grammar.py](C:/Users/ssarm/Documents/course-haness/scripts/manuscript_grammar.py:20).

5. 헤드리스 Chromium은 `Path.as_uri()`를 쓰고 있어 한글 HTML 경로 자체는 상대적으로 안전합니다: [render_preview_slides.py](C:/Users/ssarm/Documents/course-haness/scripts/render_preview_slides.py:46). 하지만 호출 예시는 여전히 `ppt_previews/`, `assets/ppt_render/`, `pptx/`입니다: [.claude/skills/pptx-build/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/pptx-build/SKILL.md:52). 새 구조에서는 `outputs/06_PPT프리뷰`, `outputs/03_시각자산/ppt_render`, `outputs/09_PPTX`로 바뀌어야 합니다.

6. 상대경로 치환은 단순 문자열 치환으로 처리하면 위험합니다. 제안의 `../assets/...` → `../03_시각자산/...` 방향은 맞지만, 현행 `storyboard`/`ppt-preview` 스킬은 manifest의 `assets/images/...`에 `../`를 붙이는 방식으로 설명되어 있습니다: [.claude/skills/storyboard/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/storyboard/SKILL.md:52), [.claude/skills/ppt-preview/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/ppt-preview/SKILL.md:68). 구현 조건은 `Path.relative_to`/`os.path.relpath` 기반으로 “소비 파일 위치 → 실제 자산 위치”를 계산하는 것입니다.

7. 치환 오염 방지는 “슬래시 포함 패턴”만으로는 부족합니다. 예를 들어 `book-build` reference에는 외부 원본 워크플로 glob인 `projects/*/book/front/*.md`가 있어 course 산출물 경로가 아닙니다: [.claude/skills/book-build/references/storytelling.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/storytelling.md:4). `book/` 일괄 치환은 이런 reference를 오염시킬 수 있으므로 course-root 상대경로만 allowlist로 바꿔야 합니다.

8. 놓친 참조 파일이 있습니다. 대표적으로 `scripts/build_asset_manifest.py`, `scripts/annotate_manuscript_assets.py`, `scripts/extract_claim_candidates.py`, `scripts/build_pptx.py`, `scripts/test_build_pptx.py`, `templates/golden/*`, `.claude/skills/*/references/*.md`, `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`, `docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md`가 제안의 변경 대상 목록에 명시되지 않았습니다. 특히 `course-outline`도 신규 과정 첫 저장 위치를 아직 `courses/{id}/1.과정개요서.md`로 지시합니다: [.claude/skills/course-outline/SKILL.md](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-outline/SKILL.md:64).

9. 조건: 적용 전 최소 검증은 필요합니다. `build_asset_manifest`/`annotate`/`extract_claim_candidates`/`build_pptx` 단위 테스트를 outputs 경로로 갱신하고, 한글 경로가 포함된 신규 과정에서 `ppt-preview → render_preview_slides → build_pptx`, `book-build`, `plot_gen.py`를 실제로 한 번 통과시켜야 합니다. `scripts/check_visual_gate.py`는 경로를 보지 않아 변경 불요라는 제안 판단은 타당합니다.
