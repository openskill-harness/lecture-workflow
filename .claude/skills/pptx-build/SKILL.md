---
name: pptx-build
description: 확정 원고(`manuscripts/chNN.md`)를 python-pptx로 16:9 PPTX(`pptx/chNN.pptx`)로 변환하고, 슬라이드마다 Narration을 발표자 노트에 삽입한다. "PPTX 만들어줘", "PPT 완성", "PPTX 빌드" 요청 시 사용. 파이프라인 10단계 — `scripts/build_pptx.py` CLI를 실행해 원고를 직접 파싱한다(HTML 프리뷰를 다시 파싱하지 않음). 확정 원고와 `--assets-root`로 지정한 과정 디렉터리의 `assets/` 하위 이미지 경로를 사용한다. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
---

# pptx-build

확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물, manuscript-schema 문법)를 16:9 PPTX(`pptx/chNN.pptx`)로 변환하는 스킬이다. 파이프라인 10단계이며, 빌더는 `scripts/build_pptx.py`(python-pptx 1.0.2, Task 11 스파이크로 notes_slide 동작 검증됨)다.

**시각자산(4단계)과의 관계(2026-07-06 개정)**: `scripts/build_pptx.py`의 파싱 로직은 바뀌지 않는다 — 원고의 `assets/...png|jpg|jpeg|webp` 경로 패턴(`IMG_PATH_RE`)을 그대로 잡는다. `visual-assets` 단계 완료 후 원고 Visual asset 필드에 병기된 자산 경로(`→ 생성됨:`/`→ 렌더됨:` 다음 줄의 `assets/...` 경로)가 그대로 이 정규식에 매치되므로, 이 스킬은 원고에 이미 병기된 경로를 그대로 사용하기만 하면 된다(별도 manifest 조회 로직 추가 없음).

**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며 `d2.primary=true` 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다(원고 병기는 annotate가 primary 한 줄만 남긴다). (pptx-build는 원고를 파싱해 첫 자산 경로를 임베드한다 — annotate가 primary만 병기하므로 그 경로가 곧 primary다. D2 primary 슬라이드는 원고에 `주 시각자료: D2` 마커가 있어야 annotate가 D2 경로를 병기한다.)

## 전제

- `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅여야 한다. 아니면 사용자에게 알리고 중단한다.
- **하드 게이트**: `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 완료(또는 명시적 보류)해야 한다.
- `manuscripts/chNN.md`가 존재해야 한다.

## 빌드 모드 (2026-07-06 개정)

두 가지 모드가 있다. **기본은 이미지 모드**다.

- **이미지 모드(기본, 권장)**: 승인된 `ppt_previews/chNN.html`(7단계 산출물)의 각 슬라이드를 Chromium 헤드리스로 렌더한 PNG를 PPTX 각 장의 **전체 배경**으로 넣고, 원고 Narration을 발표자 노트에 삽입한다. 미리보기와 **픽셀 동일**한 PPTX가 나온다. 단점: PowerPoint에서 글자를 직접 편집할 수 없다(그림이므로). 이 강의는 원고가 단일 원천이고 PPTX는 내보내기 결과물이라 편집 불가가 문제되지 않는다.
- **네이티브 모드(대안)**: 원고를 직접 파싱해 편집 가능한 텍스트 상자 + 이미지로 슬라이드를 조립한다. 편집은 되지만 미리보기의 카드/2단 디자인을 완벽히 재현하지 못한다. `--from-images` 없이 실행하면 이 모드다.

## 핵심 인터페이스 (고정 — 재현성을 위해 변경 시 이 문서와 브리프를 함께 갱신)

- 렌더 CLI: `python scripts/render_preview_slides.py <preview.html> <out_dir> [--width 1280] [--scale 2]` — `.ppt-slide .ppt-canvas`를 슬라이드별 `slideNN.png`(16:9)로 렌더
- 빌드 CLI: `python scripts/build_pptx.py <manuscript.md> <out.pptx> [--assets-root <course-dir>] [--from-images <render_dir>]`
  - `--from-images <dir>` 지정 시 이미지 모드(전체 배경 + 노트), 미지정 시 네이티브 모드
- 함수: `parse_manuscript(md_text) -> list[Slide]` — Slide dict keys: `title, body_lines, screen_lines, image_paths, code, narration` (`title`=Screen `- 제목:` 값, `body_lines`=`짧은 문구`/`학습목표`/`학습내용` 내용 항목)
- 함수: `build_pptx(md_text, out_path, assets_root=".") -> int` — 네이티브 모드, 슬라이드 수 반환
- 함수: `build_pptx_from_images(md_text, image_dir, out_path) -> int` — 이미지 모드, 슬라이드 수 반환
- 원고 문법: `## Slide N. 제목` 헤더로 슬라이드 구간을 나누고, `**Screen**`/`**Narration**`/`**Visual asset**` 등 필드 라벨로 내용을 분류한다. 이미지 자산 경로는 `assets/...png|jpg|jpeg|webp` 패턴만 인식한다(D2 다이어그램의 `.d2` 소스 경로는 이미지로 삽입하지 않음 — 렌더된 png/jpg만 인식).

## 절차

### 1. 실행 (이미지 모드, 기본)

```powershell
# 1) 미리보기 슬라이드를 PNG로 렌더 (Chromium 헤드리스)
python scripts/render_preview_slides.py courses/{course-id}/ppt_previews/chNN.html courses/{course-id}/assets/ppt_render/chNN
# 2) 렌더 PNG를 전체 배경으로 PPTX 빌드 (+ 원고 Narration을 노트에)
python scripts/build_pptx.py courses/{course-id}/manuscripts/chNN.md courses/{course-id}/pptx/chNN.pptx --from-images courses/{course-id}/assets/ppt_render/chNN
```

- 출력 대상 디렉터리(`pptx/`, `assets/ppt_render/chNN/`)가 없으면 자동 생성된다.
- 성공 시 `OK: <N> slide images -> ...` / `OK (image mode): <N> slides -> <out.pptx>` 출력.
- 전제: `ppt_previews/chNN.html`(7단계)이 ✅여야 한다(이미지 모드의 입력). 없으면 `ppt-preview` 스킬을 먼저 완료하거나 네이티브 모드를 쓴다.

### 1-alt. 실행 (네이티브 모드, 대안)

```powershell
python scripts/build_pptx.py courses/{course-id}/manuscripts/chNN.md courses/{course-id}/pptx/chNN.pptx --assets-root courses/{course-id}
```

- 성공 시 `OK: <N> slides -> <out.pptx>` 출력.

### 2. 검증 (확정 체크리스트)

**이미지 모드 전용**:
- **슬라이드 수 3중 일치**: 렌더 PNG 수 == PPTX 슬라이드 수 == preview `.ppt-canvas` 수 == 원고 `## Slide` 수. 하나라도 어긋나면(미리보기 슬라이드 추가/삭제 미반영 등) 렌더를 다시 돌린다.
- **전 슬라이드 풀블리드**: 모든 슬라이드가 좌상단 `(0,0)` + 슬라이드 전체 크기 이미지 1장으로 채워졌는지 확인한다(회귀: `test_image_mode_full_bleed_and_notes`).
- **미리보기 최신본 사용**: `ppt_previews/chNN.html`이 원고 변경 이후 재생성된 최신본인지 확인한다(오래된 미리보기를 렌더하면 옛 내용이 그대로 박제된다). 원고가 바뀌면 `ppt-preview`(7단계)부터 다시 돌린 뒤 렌더한다.

**공통**:
- **슬라이드 수 일치**: 출력된 `N`이 원고의 `## Slide` 헤더 개수와 같은지 확인한다(`Select-String "^## Slide \d+\." chNN.md` 또는 grep로 카운트).
- **전 슬라이드 노트 존재**: Narration 필드가 있는 모든 슬라이드에서 `notes_slide.notes_text_frame.text`가 비어 있지 않은지 확인한다. 빠르게 확인하려면:

```powershell
python -c "from pptx import Presentation; prs = Presentation('courses/{course-id}/pptx/chNN.pptx'); [print(i+1, bool(s.notes_slide.notes_text_frame.text)) for i, s in enumerate(prs.slides)]"
```

- **이미지 누락 경고**: 원고에 `assets/...png|jpg` 경로가 있는데 파일이 실제로 없으면 빌더가 조용히 건너뛴다(에러 없음) — 검증 시 원고의 이미지 경로 목록과 실제 `assets/` 파일 존재 여부를 대조해 누락 목록을 사용자에게 보고한다.
- **이미지 깨짐 없음**: PowerPoint(또는 LibreOffice Impress)에서 실제로 열어 이미지·코드 블록·레이아웃이 깨지지 않았는지 사용자 확인을 받는다.
- **D2 소스만 있는 슬라이드는 코드 박스로 출력되지 않는다**: 렌더 이미지(png/jpg) 없이 `` ```d2 `` 소스만 있는 슬라이드는 `code`가 비어 있어야 한다(D2 소스 텍스트가 코드 박스로 깨져 나오면 안 된다).
- **이미지 오버플로 없음(안전 여백, 2026-07-06)**: 빌더의 `_fit_in_box()`가 이미지를 종횡비 유지한 채 배치 박스 안에 넣고 슬라이드 가장자리에서 `PPTX_EMBED_MARGIN`(0.5") 여백을 확보한다 — 세로형/광폭 이미지도 슬라이드를 벗어나지 않는다(스펙 §3.0-A 자산 임베드 안전 여백 규약). 검증: 전 슬라이드에서 `left+width ≤ slide_width`, `top+height ≤ slide_height`. 회귀 테스트 `test_build_pptx.py`의 초광폭/초세로/여백 3건으로 커버.
- **다중 코드펜스 슬라이드는 모든 블록이 보존된다**: 한 슬라이드의 Visual asset에 표시용 코드 펜스(d2 제외)가 여러 개 있으면, 마지막 블록만 남지 않고 모든 블록이 `code`에 포함되어야 한다.

### 3. 사용자 확인 및 확정

- 검증 결과(슬라이드 수, 노트 존재 여부, 이미지 누락 목록)를 사용자에게 보고한다.
- PowerPoint에서 열어 확인해 달라고 요청한다.
- 사용자가 확정하면 `courses/{course-id}/status.md`의 해당 차시 `PPTX` 칸을 ✅로 갱신하고, 산출물 인덱스에 `- chNN PPTX: pptx/chNN.pptx (확정 YYYY-MM-DD)`를 추가한다.

## repair 규칙

파서(`scripts/build_pptx.py`의 `parse_manuscript`)가 원고의 특정 표기(다중 라인 나레이션, 제목의 특수문자, 새로운 필드 라벨 등)를 놓치면:

1. **원고를 수정하지 않는다** — `manuscript-schema` 문법을 따르는 확정 원고는 건드리지 않는다.
2. `scripts/build_pptx.py`의 정규식(`SLIDE_RE`, `FIELD_RE`, `IMG_PATH_RE`)이나 파싱 로직을 수정해 대응한다.
3. 수정 후 `scripts/test_build_pptx.py`에 회귀 케이스를 추가하고 `cd scripts; python -m pytest test_build_pptx.py -v`로 재실행해 통과를 확인한다.
4. 실데이터로 다시 빌드해 슬라이드 수·노트가 여전히 올바른지 재확인한다.

## 참고

- 빌더는 `ppt_previews/chNN.html`(7단계 산출물)을 소비하지 않는다 — 원고(`manuscripts/chNN.md`)를 직접 파싱한다. HTML 프리뷰는 사람이 보는 미리보기이고, PPTX는 원고 기준의 별도 빌드다.
- D2 다이어그램을 실제 이미지로 슬라이드에 넣으려면 먼저 `pub-d2-diagram` 스킬로 렌더(svg/png)한 뒤, 원고의 Visual asset 필드에 렌더 결과 png/jpg 경로를 병기해야 이 빌더가 인식한다. 이 병기는 이제 `visual-assets`(4단계)가 수행한다(§ 전제 참조).
