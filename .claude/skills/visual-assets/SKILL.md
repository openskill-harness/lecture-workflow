---
name: visual-assets
description: 확정 원고(`manuscripts/chNN.md`)의 Visual asset 필드(이미지 프롬프트·D2 소스)를 실자산(PNG/SVG)으로 생성해 `assets/manifest.json`(SSOT)을 확정하는 스킬. "시각자산 생성", "이미지·다이어그램 만들어줘", "자산 렌더", "visual-assets" 요청 시 사용. 파이프라인 4단계(원고확정 직후, 코드/스토리보드 등 소비 산출물보다 앞) — 이후 6~11단계(스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)가 재동기화 폭포 없이 처음부터 실자산을 임베드하도록 하는 것이 존재 이유. image-gen `[IMAGE PROMPT]` 태그 자동 변환 브릿지 내장, `원고확정 ✅`(또는 명시적 `deferred`) hard gate, 해시 기반 부분(stale) 재생성을 담당한다.
---

# visual-assets

확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 **Visual asset** 필드에 있는 이미지 프롬프트·D2 소스를 실제 자산 파일(`assets/images/chNN/`, `assets/diagrams/`)로 생성하고, 그 결과를 `assets/manifest.json`(SSOT)에 확정하는 스킬이다.

**파이프라인 위치**: `manuscript-final`(3단계, 원고확정) 바로 다음, `practice-code`(코드) 이전. 자산 생성이 소비 산출물(스토리보드·PPT프리뷰·판서·PPTX·책) 뒤로 밀리면, 나중에 이미지를 만들 때마다 그 4~5개 산출물을 전부 다시 만들어야 하는 재동기화 폭포가 생긴다(`docs/proposals/2026-07-06_visual-assets-stage-redesign.md` §1). 이 스킬을 원고확정 직후에 실행해 그 문제를 구조적으로 없앤다.

**설계 근거**: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`(제안 A·E), codex 사전검증 `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`(4개 조건 — hard gate/해시 stale/manifest SSOT/소비 계약).

**엔진(호출만 하고 자체 생성 로직 없음)**: `image-gen`(`scripts/image_gen.py` — Codex 이미지), `pub-d2-diagram`(`scripts/render_md_diagrams.py` + Windows PNG 변환 — D2 렌더). manifest 빌더: `scripts/build_asset_manifest.py`(레포 루트, 이미 작성됨 — 이 스킬이 수정하지 않고 그대로 호출).

## 절차

### 1. 입력 확인 — 선행 게이트 (hard gate 대상 자신도 게이트를 받는다)

- `manuscripts/chNN.md`가 없거나 `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅가 아니면 **중단한다**. 미확정 원고로 자산을 생성하지 않는다(확정 후에도 프롬프트가 바뀌면 §7 해시 stale로 흡수하지, 티키타카 중간에 매번 생성하지 않는다).
- `status.md`에 `시각자산` 열이 아직 없으면(제안 C 반영 전일 수 있음) 사용자에게 알리고, 표 구조를 이 스킬이 임의로 바꾸지 않는다 — 열 추가는 `templates/status_template.md` 갱신(제안 D 반영 범위)로 별도 처리한다. 열이 없어도 아래 자산 생성 자체는 진행할 수 있다(§6에서 상태 반영만 보류).
- 대상 차시(chNN)·과정 디렉터리(`courses/{course-id}`)를 확정하고, 이번에 생성할 슬라이드 범위를 사용자에게 확인한다: "지금 전부 생성" / "일부만 생성하고 나머지는 나중(deferred)" / "이미 지정한 슬라이드만".

### 2. 이미지 브릿지 (자동)

원고 스키마의 인라인 라벨(`GPT image prompt:` / 구 표기 `시각자료 프롬프트(영문):`, 만화 2컷은 `Comic panel prompt:`)은 `image_gen.py`가 스캔하는 리터럴 블록 형식이 아니다. 이 스킬이 **자동으로** 변환한다.

- `manuscripts/chNN.md`를 훑어 이번에 생성하기로 한 슬라이드의 이미지 프롬프트를 전부 수집한다(§1에서 "나중에"로 미루기로 한 슬라이드는 제외 — placeholder 유지).
- 슬라이드마다 아래 블록을 만들어 **임시 스크래치 파일 하나**(세션 스크래치 디렉터리, 또는 `courses/{course-id}/.tmp_visual_assets_chNN.md`)에 전부 모아 담는다(원고 `chNN.md`에는 절대 직접 삽입하지 않는다 — `image_gen.py`는 처리한 블록을 프롬프트 원문째로 지우고 `<img>`로 치환해버리는 파괴적 스크립트다):
  ```
  <!-- [IMAGE PROMPT: chNN-slideNN]
  {프롬프트 원문 그대로}
  path: assets/images/chNN/slideNN.png
  -->
  ![chNN-slideNN](placeholder.png)
  ```
  - `id`는 `chNN-slideNN` 형식(예: `ch01-slide05`)으로 슬라이드를 식별한다.
  - `path:`가 실제 저장 경로를 결정한다(project_root=`courses/{course-id}` 기준 상대경로, `assets/images/chNN/slideNN.png` 고정 — `pptx-build`의 `IMG_PATH_RE`가 이 패턴만 인식하므로 어긋나면 안 된다).
  - `![...](...)` 줄의 `alt`/`src`는 아무 값이나 무방하다(정규식 매치 목적일 뿐, 실사용 안 됨).
- `python .claude/skills/image-gen/scripts/image_gen.py <스크래치.md> courses/{course-id}` 를 실행한다. 성공한 슬라이드는 지정한 `path:`로 PNG가 이동된다. 실패한 슬라이드는 플레이스홀더가 보존되고 스킬 실행 로그로만 표시된다(원고엔 영향 없음).
- **지연 경고**: Codex 이미지 생성은 장당 1~2분, 직렬 처리다. 26장이면 30~50분 걸릴 수 있다.
  - 스크래치 파일에 이번에 생성할 모든 슬라이드의 블록을 한 번에 담아 **백그라운드로 1회** 실행한다(예: Bash `run_in_background`).
  - 대기 중 **폴링 전용 서브에이전트를 띄우지 않는다** — 파일럿에서 토큰만 소모하고 진행에 도움이 안 됐던 실패 패턴이다. 대신 `assets/images/chNN/`에 생성된 PNG 개수를 주기적으로(사용자가 물었을 때, 또는 Monitor 도구의 until-루프) 확인해 "몇 장 중 몇 장 완료"로 진행 상황을 보고한다.
  - 완료(또는 부분 완료 확인) 후에만 다음 단계로 넘어간다.
- 완료 후 **스크래치 파일은 삭제한다**(원고·course_dir에 잔재를 남기지 않는다).

### 3. D2 렌더

- 원고의 ` ```d2 ` 코드펜스는 `pub-d2-diagram`의 `scripts/render_md_diagrams.py <원고.md> <images_dir> <접두사>`가 그대로 인식한다(변환 불필요) — ELK 레이아웃 + 모노톤 치환까지 자동, **SVG로 저장**한다.
- 이 스크립트의 파일명은 파일 내 D2 블록 **등장 순서**(`{접두사}-d{i}.svg`)로 매겨진다 — 슬라이드 번호 기반이 아니다. 반면 `build_asset_manifest.py`(§4)와 기존 소비 계약은 `assets/diagrams/{chNN}-slide{NN}-{요지}.png` 형식(슬라이드 번호 포함, PNG)을 기대한다(`courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` 등 기존 실사례 참고). 따라서:
  1. 렌더된 `{접두사}-d{i}.svg`를 원고 순서와 대조해 어느 슬라이드에 대응하는지 확인한다.
  2. `pub-d2-diagram` SKILL.md의 "Windows 렌더" 절(headless Chromium 스크린샷, 고정 뷰포트/스케일/투명배경)에 따라 SVG → PNG로 변환한다.
  3. 최종 파일을 `assets/diagrams/{chNN}-slide{NN}-{요지}.png`로 저장(또는 리네임)한다 — `{요지}`는 다이어그램 내용을 요약한 짧은 영문/한글 슬러그.
  4. 종횡비가 3:1을 넘으면 `pub-d2-diagram`의 종횡비 가이드에 따라 원고 D2 소스를 `direction: down` 등으로 재배치할지 사용자에게 확인한다(자동 재배치 아님).

### 4. manifest 생성 (SSOT)

- `python scripts/build_asset_manifest.py courses/{course-id} chNN` 를 실행한다(레포 루트 스크립트, 수정하지 않고 그대로 호출).
- 결과 `courses/{course-id}/assets/manifest.json`이 이후 모든 소비 판단의 **단일 진실원(SSOT)**이다. 슬라이드별 `image`/`d2` 블록에 `path`/`prompt_hash`(또는 `d2_hash`)/`status`(`present`/`deferred`/`missing`)가 담긴다.
- D2가 있는 슬라이드는 이미지가 없어도 스크립트가 자동으로 `image.status = "deferred"`(primary=false) 처리한다 — D2가 그 슬라이드의 주 시각자료이므로 이미지 중복 생성이 불필요하다는 뜻이다. 이 슬라이드는 결핍(missing)으로 세지 않는다.
- 최상위 `overall_status`(present/partial/missing)와 `visual_slides_covered`/`visual_slides_total`를 확인해 §6·§7 판단의 근거로 삼는다.

### 5. 원고 주석 (보조 — SSOT 아님)

- 실제 생성/렌더가 완료된 슬라이드의 Visual asset 필드에 사람이 읽기 위한 병기를 남긴다: 이미지는 `→ 생성됨: assets/images/chNN/slideNN.png`, D2는 `→ 렌더됨: assets/diagrams/chNN-slideNN-*.png`(실제 파일명 그대로). 프롬프트/D2 원문은 지우지 않는다(재생성 근거).
- 이 주석은 사람이 읽기 위한 보조 표기일 뿐이다 — **manifest.json이 SSOT**다. 소비 스킬(`storyboard`/`ppt-preview`/`pptx-build`/`panseo-slide`/`book-build`)의 "원고 주석이 아니라 manifest 확정 경로를 읽도록" 계약 전환은 이 스킬의 책임 범위 밖(제안 E 조건 4, 별도 반영 — 각 소비 스킬의 SKILL.md 개정 필요)이다. 전환 전까지는 두 표기(원고 주석 + manifest)가 병존한다.

### 6. 하드 게이트 (기본값 — placeholder로 조용히 넘어가지 않는다)

manifest의 `overall_status`에 따라 `status.md`의 `시각자산` 칸(있는 경우)을 갱신한다:

- `present`(커버 대상 슬라이드 전부 present/deferred) → `✅`.
- 사용자가 명시적으로 일부를 "나중에"로 선택했다면 → `deferred`로 표기한다(자동으로 조용히 `⬜`나 `✅`로 얼버무리지 않는다 — placeholder 유지 사실을 표에 남긴다).
- 일부만 생성됐고 나머지는 아직 결정 안 됨(`missing`이 남아 있는데 사용자 확인 전) → `partial`.
- **hard gate 본체**: 이후 5~11단계(코드~책)를 호출하는 쪽(`course-pipeline` 오케스트라 또는 사용자 수동 호출)은 이 칸이 `✅` 또는 명시적 `deferred`일 때만 진행해야 한다 — `missing`/`partial`인 채로 넘어가지 않는다. 이 스킬 자신은 다음 단계를 호출하지 않으므로, 상태를 정확히 남겨 두는 것이 게이트 역할을 한다.

### 7. 해시 기반 stale 재감지 (재실행 시 — 원고가 확정 후 다시 바뀐 경우)

원고 확정 후 프롬프트/D2가 수정되면(재개된 티키타카, "이 이미지 프롬프트 바꿔줘" 등) **전체 재생성 금지** — 바뀐 슬라이드만 재생성한다.

1. 재실행 전 기존 `assets/manifest.json`을 읽어 슬라이드별 `prompt_hash`/`d2_hash`를 보관해 둔다(파일 그대로 두거나 값만 메모).
2. `build_asset_manifest.py`를 다시 실행한다 — 이 스크립트는 **현재 원고 텍스트**에서 해시를 새로 계산하지만, 기존 생성 파일의 내용이 그 해시와 실제로 일치하는지는 검증하지 않는다(파일 존재+크기만 확인). 그래서 이 비교는 스킬이 직접 한다.
3. 1단계에서 보관한 값과 새 manifest의 슬라이드별 해시를 비교한다.
   - 해시가 달라졌는데 상태가 여전히 `present`인 슬라이드 → **stale**: 원고는 바뀌었지만 자산은 옛날 그대로다. 그 슬라이드만 §2(이미지) 또는 §3(D2)을 다시 수행해 파일을 교체한 뒤 manifest를 재생성한다.
   - 해시가 같으면 손대지 않는다.
4. stale로 재생성한 슬라이드는 후속 산출물(스토리보드 등)에도 "이 슬라이드만 재검수 필요"로 보고한다 — 다른 슬라이드까지 재작업 대상으로 넓히지 않는다.

## 확정 체크리스트

- [ ] **manifest 존재 및 판정 명시**: `assets/manifest.json`이 존재하고 `overall_status`가 `present`이거나, 사용자가 실제로 선택한 `deferred`/`partial`이다(임의로 `missing`을 방치한 채 넘어가지 않았다).
- [ ] **파일 실존·용량**: manifest에 `status: "present"`로 표시된 모든 자산(`image`/`d2`)이 실제로 파일로 존재하고 크기 > 0 바이트다.
- [ ] **커버 안 된 시각 슬라이드 0**: Visual asset 필드가 있는 슬라이드 중 `present`도 `deferred`도 아닌(`missing`) 슬라이드가 0개다. 남아 있다면 사용자에게 구체적으로(어느 슬라이드) 보고하고 생성/보류 여부를 재확인한다.
- [ ] **브릿지 위생**: 스크래치 파일이 실행 후 삭제됐고, 원고 `chNN.md`에는 image-gen용 HTML 주석 블록이 남아 있지 않다.
- [ ] **D2 파일명 계약**: D2 렌더 산출물이 `assets/diagrams/{chNN}-slide{NN}-*.png` 형식(슬라이드 번호 포함, PNG)으로 저장돼 있다(§3 리네임 누락 없음).

## repair 규칙

체크리스트 중 하나라도 실패하면 **전체를 다시 생성하지 않는다.**

- `missing`으로 남은 슬라이드만 골라 사용자에게 보고("Slide 9 이미지가 아직 없습니다 — 지금 생성할까요, 나중으로 미룰까요?")한 뒤, 선택에 따라 §2/§3을 그 슬라이드에 한해 재실행하거나 `deferred`로 명시 확정한다.
- 파일이 0바이트/손상이면 해당 슬라이드만 §2/§3 재실행(생성 실패 원인을 함께 보고 — Codex 호출 실패, d2 컴파일 오류 등).
- D2 파일명이 계약과 다르면(슬라이드 번호 누락 등) 파일만 리네임하고 `build_asset_manifest.py`를 다시 돌려 manifest를 갱신한다(재렌더 불필요).
- 원고가 재수정돼 해시가 어긋난 경우는 §7 절차를 그대로 따른다(바뀐 슬라이드만).
- 스크래치 파일이 삭제되지 않았으면 지운다(원고·과정 디렉터리에 임시 파일을 남기지 않는다).

## 참고

- 제안·검증 문서: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`, `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`
- manifest 빌더(수정 금지, 그대로 호출): `scripts/build_asset_manifest.py`
- 이미지 엔진: `.claude/skills/image-gen/SKILL.md` + `scripts/image_gen.py`(브릿지 블록 정규식·이동 로직의 원본)
- D2 엔진: `.claude/skills/pub-d2-diagram/SKILL.md`(Windows 렌더·종횡비 절 포함) + `scripts/render_md_diagrams.py`
- 원고 스키마(Visual asset 하위 유형): `.claude/skills/manuscript-draft/references/manuscript-schema.md` §4
- 기존 실사례(수동으로 이 절차를 먼저 밟아본 파일럿): `courses/spring-boot-basic/assets/manifest.json`, `courses/spring-boot-basic/assets/diagrams/ch01-d2-manifest.md`
- **범위 밖(별도 반영 대상)**: `status.md`의 `시각자산` 열 신설(제안 C), `CLAUDE.md`/설계 문서/`course-pipeline` 매핑 표에 이 스킬을 11단계 파이프라인으로 편입(제안 D), 소비 스킬(storyboard/ppt-preview/pptx-build/panseo-slide/book-build)의 "manifest 우선 소비" 계약 전환(제안 E 조건 4) — 이 스킬은 이 변경들이 아직 반영되지 않은 상태에서도 단독으로 동작하도록 §1·§5·§6에서 방어적으로 서술했다.
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
