# 제안: 산출물 디렉터리 규약 재편 — `outputs/` + 번호 한글 폴더

날짜: 2026-07-07
요청: 사용자 — "산출물이 여러 폴더에 나눠져 있어 보기 힘듦. outputs 폴더에 순서대로 나오게 하자."

## 문제

현행 규약(spec §4)은 과정 루트에 산출물 폴더 10여 개(`manuscripts/`, `assets/`, `code/`,
`storyboards/`, `ppt_previews/`, `panseo/`, `simulators/`, `pptx/`, `book/`, `verification/`)가
평면으로 나열된다. 탐색기에서 가나다/알파벳 순으로 정렬되어 파이프라인 순서와 무관하게 보이고,
입력(research)·상태(status.md)와 산출물이 섞여 가독성이 낮다.

## 제안

산출물을 `outputs/` 아래 **파이프라인 순서 번호 + 한글 이름** 폴더로 모은다.
`status.md`(상태)와 `research/`(입력)는 과정 루트에 유지한다.

```
courses/{course-id}/
├── status.md
├── research/
└── outputs/
    ├── 01_과정개요서.md
    ├── 02_원고/          # chNN_draft.md → chNN.md (구 manuscripts/)
    ├── 03_시각자산/       # images/chNN/, diagrams/, manifest.json, ppt_render/ (구 assets/)
    ├── 04_코드/          # chNN/ (구 code/)
    ├── 05_스토리보드/     # chNN.html (구 storyboards/)
    ├── 06_PPT프리뷰/     # chNN.html (구 ppt_previews/)
    ├── 07_판서/          # chNN.html + chNN_대본.md (구 panseo/)
    ├── 08_시뮬/          # chNN_{주제}.html (구 simulators/)
    ├── 09_PPTX/          # chNN.pptx (구 pptx/)
    ├── 10_책/            # chNN.pdf, 합본.pdf (구 book/)
    └── 11_검증/          # chNN_verify.md (구 verification/, 온디맨드)
```

폴더 번호는 **표시 순서**(파이프라인 진행 순서와 동일)이며 단계 번호와 1:1은 아니다
(원고초안·확정이 `02_원고/` 하나를 공유, 검증(3.5단계)은 온디맨드라 마지막 배치).

### 경로 매핑 (전량 치환 표)

| 구 경로 | 신 경로 |
|---|---|
| `1.과정개요서.md` | `outputs/01_과정개요서.md` |
| `manuscripts/` | `outputs/02_원고/` |
| `assets/` | `outputs/03_시각자산/` |
| `code/` | `outputs/04_코드/` |
| `storyboards/` | `outputs/05_스토리보드/` |
| `ppt_previews/` | `outputs/06_PPT프리뷰/` |
| `panseo/` | `outputs/07_판서/` |
| `simulators/` | `outputs/08_시뮬/` |
| `pptx/` | `outputs/09_PPTX/` |
| `book/` | `outputs/10_책/` |
| `verification/` | `outputs/11_검증/` |

산출물 간 **상대 참조**(HTML 임베드 등)는 형제 관계가 유지되므로 깊이 불변:
`../assets/images/...` → `../03_시각자산/images/...` (outputs/ 내부 형제 참조라 `outputs/` 접두 없음).

### 적용 범위 — 신규 과정부터 (레거시 무이관)

- 새 규약은 **이후 생성되는 과정부터** 적용한다. 파일럿 `spring-boot-basic`(ch01 전 단계 완료,
  임베드 상대경로 176곳)은 **이관하지 않는다** — 사용자 결정(2026-07-07). `courses/**`는 산출물이라
  R1 감사 대상이 아니므로 옛 경로가 남아도 규율 위반이 아니다.
- **repair 규칙 일반화**: course-pipeline의 ✅↔실파일 대조는 "규약 경로 하드코딩" 대신
  **그 과정 status.md 산출물 인덱스에 기록된 경로**를 1차 기준으로 실존 확인하고, 인덱스에 없는
  ✅ 셀만 현행 규약 경로로 확인한다. 이로써 레거시 과정(옛 배치)과 신규 과정(outputs/ 배치)이
  같은 repair 로직으로 동작한다 — 레거시 특례 서술이 권위 문서에 필요 없어진다.

### 변경 대상 (권위 문서·하네스 구성물만)

- `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` — §3 표, §3.0-A, §4 트리, §5~§10 경로 서술 (R2 제자리 교체)
- `templates/status_template.md` — 과정개요서 경로 표기
- `.claude/skills/*/SKILL.md` 및 references/scripts — 경로 언급 178곳/21파일
  (course-pipeline, manuscript-draft/final/verify, visual-assets, practice-code, storyboard,
  ppt-preview, panseo-slide, edu-sim-builder, pptx-build, book-build, image-gen, pub-d2-diagram)
- `docs/history/**`, `courses/**`는 **건드리지 않는다** (스냅샷/산출물).

## 회귀 위험과 대응

1. **한글 폴더명 × 툴체인**: typst/pandoc(book-build), python-pptx·헤드리스 Chromium(pptx-build),
   matplotlib(plot_gen.py)이 한글·공백 없는 경로를 처리해야 함. Windows에서 Python pathlib은
   유니코드 경로 안전. Chromium file:// URL은 percent-encoding 필요할 수 있음 — 신규 과정 첫 빌드
   때 각 빌드 스크립트를 스모크 검증하고, 문제 시 해당 스크립트만 수정.
2. **부분 치환 오염**: `python-pptx`, `pptx-build`, `book-build` 같은 토큰이 `pptx/`·`book/`
   치환에 오염되지 않도록 슬래시 포함 패턴만 치환 + 치환 후 전량 diff 육안 확인.
3. **상대경로 깊이**: 임베드 가이드의 `../assets/` 계열은 `../03_시각자산/`로 치환
   (`../outputs/03_시각자산/`이 아님 — 형제 참조).
4. **스킬 description 트리거**: frontmatter description 안 경로도 갱신 — 트리거 문구는 경로와
   무관하므로 오발동 위험 없음.
5. **레거시 과정 오탐**: repair 규칙 일반화(위)로 spring-boot-basic이 규약 대조에서 오탐되지 않음.

## codex 조건부승인 반영 (2026-07-07)

codex-review.md의 조건 9건을 다음과 같이 반영한다:

1. **루트 scripts/ 하드코딩** (조건 4·8): `scripts/course_layout.py` 신설 — `courses/{id}/outputs/`
   디렉터리 존재 여부로 배치를 판별해 경로 dict를 반환. `build_asset_manifest.py`,
   `annotate_manuscript_assets.py`, `extract_claim_candidates.py`가 이를 사용. 레거시 과정
   재실행(stale 재생성 등)도 특례 서술 없이 동작한다.
2. **manuscript_grammar.IMG_PATH_RE** (조건 4): `assets/...`와 `outputs/03_시각자산/...` 둘 다
   인식하도록 확장. `build_pptx.py` 네이티브 모드는 이 정규식+`--assets-root`(과정 루트) 조합이라
   자동 해결. `test_build_pptx.py`에 outputs 경로 케이스 추가.
3. **repair 계약** (조건 2·3): course-pipeline repair를 "산출물 인덱스에 기록된 경로 1차,
   인덱스 미기재 ✅ 셀만 현행 규약 경로" 로 명시 개정. spec §4의 "경로는 규약 고정, 인덱스는
   부가 정보" 서술을 "인덱스가 실경로 대조 기준" 으로 제자리 교체(R2).
4. **누락 참조 파일** (조건 1·5·8): 변경 대상에 추가 — `course-outline` SKILL.md,
   `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`, `2026-07-07-book-concept-anchor-design.md`,
   `templates/golden/*`(경로 언급 시), book-build SKILL.md 인라인 코드(`course_dir / "book"`,
   `assets_dir`), pptx-build 호출 예시.
5. **치환 오염** (조건 7): blind sed 대신 allowlist 정규식(단어경계 lookbehind로 `visual-assets/`,
   `python-pptx`, `projects/*/book/` 보호) + 치환 후 git diff 전수 육안 검토.
6. **상대경로 산출** (조건 6): storyboard/ppt-preview의 임베드 가이드를 "문자열 접두 `../` 부착"이
   아니라 "소비 파일 위치 기준 상대경로 계산(manifest의 과정 루트 상대경로 → 소비 파일에서 relpath)"으로
   서술 교체.
7. **최소 검증** (조건 9): `pytest scripts/test_build_pptx.py` + manifest/annotate 스크립트를
   임시 outputs 배치 픽스처로 실행 확인. 한글 경로 실전 통과(렌더·typst)는 신규 과정 ch01에서
   스모크(§검증)로 수행.

## 검증

- drift grep: 권위 문서에서 구 경로(`manuscripts/`, `storyboards/`, `ppt_previews/`, `panseo/`,
  `simulators/`, `assets/manifest`, `code/chNN`, `book/chNN`, `verification/chNN`) 잔존 0건 확인
  (`docs/history/`·`courses/**` 제외).
- `scripts/check_visual_gate.py`는 경로 무관(표 기호 검사) — 변경 불요 확인됨.
- 신규 과정(디자인패턴) ch01 진행이 실전 스모크 테스트 — 각 단계 스킬이 outputs/ 경로에
  산출물을 만들고 status.md 인덱스에 신 경로를 기록하는지 확인.
