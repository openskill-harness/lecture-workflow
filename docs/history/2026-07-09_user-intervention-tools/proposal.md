# 제안: 사용자 개입 도구 — 자산 origin과 프리뷰 개입 통로

- 날짜: 2026-07-09
- 근거 대화: `docs/discussions/2026-07-09-harness-intervention-points.md`

## 1. 배경 / 문제

사용자의 하네스 운용 철학: 하네스는 직원이다. 원고와 PPT프리뷰는 **사용자가 눈으로 보고 확정**한다. 하네스에는 "영원히 지켜야 할 규칙"(여백·폰트·일관성·삐져나옴·DOM 계약)만 넣고, "무엇을 보여줄지"는 그때그때 지시로 준다. 내용 결정을 규칙으로 쌓으면 하네스가 오버피팅되어 일을 더 못한다.

이 기준으로 보면 네 가지 공백이 있다.

1. **PPT프리뷰에 개입 통로가 없다.** 원고에는 티키타카 스킬(`manuscript-final`)이 있으나, `ppt-preview`에는 repair 규칙(체크리스트 실패 시 자동 수리)뿐이고 사용자 지시를 받는 절이 없다. repair 첫 줄이 "원고는 불변"이라 사진 교체가 원천 차단된다. 사용자는 `manuscript-final` → `visual-assets` → `ppt-preview` 3단계 우회를 해야 한다.

2. **사용자 제공 이미지 경로가 없다.** `manuscript-schema.md` §4의 Visual asset 하위 유형 4종(`GPT image prompt:` / D2 / `Screenshot plan:` / 코드 블록)에 사람이 준 파일을 가리키는 유형이 없다. `build_asset_manifest.py`는 프롬프트 없는 슬라이드를 자산 없음으로 취급한다.

3. **image-to-image가 없다.** `image_gen.py`의 `run_codex_image()`는 프롬프트 텍스트만 stdin으로 넘긴다. 손그림 스케치를 참조로 주는 경로가 없다(`edu-sim-builder`만 참고 스케치를 받는다).

4. **프리뷰 레이아웃 검증이 육안에 의존한다.** 책에는 `pub-layout-check`(감지) + `pub-page-fit`(수정) 쌍이 있으나 프리뷰에는 대응물이 없다. 코드 무스크롤 규칙(2026-07-08 도입)조차 "브라우저에서 스크롤바 없는지 확인"이다. 이 항목은 사용자가 **하네스를 고쳐야 한다고 인정한 유일한 종류**의 문제인데 기계 검증이 없다.

### 근본 원인

원고 프롬프트가 자산의 유일한 원천이라는 가정. 그래서 사용자가 하류에서 확정한 것을 표현할 자리가 없다. 자산에 **누가 준 것인가(provenance)** 를 기록하는 필드가 없다.

## 2. 제안

### A. manifest 자산 블록에 `origin` 필드 추가 (핵심)

기록해야 할 것은 변경 이력이 아니라 출처다. 출처가 곧 "하네스가 이걸 덮어써도 되는가"의 답이다.

| origin | 원고 Visual asset 라벨 | 해시 stale | 하네스 권한 |
|---|---|---|---|
| `agent` | `GPT image prompt:` | 적용 | 자유롭게 재생성·개선 |
| `user-prompt` | `User image prompt:` | 적용 | 재생성만, 문구 임의 수정 금지 |
| `user-file` | `User image:` (경로) | **면제** | 덮어쓰기 금지 |

- `user-file`은 프롬프트가 없어 `prompt_hash: null`이다. **stale 비교를 명시적으로 건너뛴다** — 자동으로 면제되지 않는다(codex-review 조건 1). 현재 stale 조건은 `prior_hash is not None and prior_hash != cur_hash`이므로, agent 이미지를 user-file로 교체하면 `prior_hash`(non-null) != `None`이 되어 오히려 stale로 오판된다. 사용자가 준 파일이 덮어쓰기 대상이 되는 정반대 결과다.
- `user-prompt`를 `agent`와 분리하는 이유: 사용자가 준 문구를 하네스가 "더 나은 프롬프트로 다듬어" 바꾸면 안 된다. 자유도를 준 영역과 지시받은 영역의 경계가 이 필드에 담긴다.
- **원고에 옛 프롬프트를 주석으로 남기지 않는다** — CLAUDE.md R2(old/new 공존 금지)·R3(이력은 history/git). 라벨과 내용을 제자리 교체한다.

**primary 결정 순서** (기존 로직 **앞**에 user-file 분기 삽입):
`user-file` > `주 시각자료: D2` 마커 > 이미지 프롬프트 존재 > D2 존재 > 없음.

사용자가 파일을 직접 줬으면 그게 최신 확정이므로 D2 마커보다 우선한다. 단순히 "image 취급"만 하면 `has_img = bool(info["prompt"])`가 False라 이미지 블록 자체가 안 생기고, `d2_primary` 분기가 먼저 걸려 D2가 계속 이긴다(codex-review 조건 2). `has_img`를 `bool(prompt) or bool(user_file)`로 확장한다.

**파일 배치**: 사용자 제공 파일은 캐노니컬 경로 `{assets_rel}/images/chNN/slideNN.png`로 **복사**한다. `assets_rel`은 `course_layout.rel(course, "assets")`로 계산한다 — 레거시 배치(`assets/`)와 신규 규약(`outputs/03_시각자산/`)을 모두 지원해야 하므로 하드코딩하지 않는다(codex-review 조건 3).

이 경로는 `annotate_manuscript_assets.py`가 병기하는 primary 경로와 **동일해야 한다**. `build_pptx.py`의 `IMG_PATH_RE`가 `User image:` 줄도 매치하고 첫 경로만 쓰기 때문에, 둘이 다르면 PPTX가 원고에서 먼저 나온 쪽을 집는다(codex-review 조건 4). 이 등식을 테스트로 고정한다.

### B. `ppt-preview`에 사용자 개입 절(§6) 신설 + repair 첫 줄 교체

repair 규칙의 "원고는 불변"은 **자동 repair에만** 적용됨을 명확히 하고, 사용자 지시 개입은 별도 절로 분리한다.

> **사용자 확정이 원고를 이긴다.** 원고확정(3단계) 이후 단계에서 사용자가 다르게 확정하면 원고를 최소 범위로 역수정한다. 이는 `practice-code` §4(실행 검증 결과가 원고와 다르면 사용자 승인 후 역수정)와 같은 패턴이며, 시각 산출물 쪽으로 일반화한 것이다.

개입 유형 3종과 처리:

| 지시 | 처리 |
|---|---|
| "이 프롬프트로 다시" | 원고 라벨을 `User image prompt:`로 교체 + 문구를 사용자 원문으로 → 해당 슬라이드만 재생성 → manifest 재빌드 → 캔버스 갱신 |
| "내가 준 이 파일로" | 파일을 규약 경로로 복사 → 원고를 `User image: <경로>`로 제자리 교체(옛 프롬프트 줄 삭제) → manifest 재빌드(`origin: user-file`) → 캔버스 갱신 |
| "여긴 표로" / "여긴 순서도로" | 캔버스 위젯 교체 + 원고 Screen 필드 화면 배치 서술을 최소 역수정. 이미지를 빼면 `- 이미지 보류` 한 줄 추가(manifest가 `deferred` 처리) |

**프리뷰 HTML을 직접 고치고 끝내지 않는다.** manifest를 경유해야 스토리보드·PPTX·책이 같은 그림을 쓴다. 프리뷰만 고치면 `book-build`는 옛 사진을 쓴다.

개입 후 그 슬라이드를 소비한 하류 산출물(스토리보드, `panseo-slide` 그대로 모드, `pptx-build` 이미지 모드, 책)만 "재검수 필요"로 보고한다. 전체 재생성은 하지 않는다 — stale이 이미 슬라이드 단위로 잡는다.

**역수정 범위는 원고와 프리뷰로 한정한다.** 사용자가 눈으로 보고 확정하는 지점이 그 둘이기 때문이다. 스토리보드·판서·책 단계에 개입 통로를 만들지 않는다(범위 폭발 방지).

### C. `image_gen.py` 참조 이미지 지원

플레이스홀더 블록에 선택적 `ref:` 라인을 허용하고, 있으면 프롬프트 앞에 참조 파일 경로를 붙여 Codex가 읽게 한다.

```
<!-- [IMAGE PROMPT: ch02-slide07]
{프롬프트}
ref: courses/design-pattern/inbox/slide07-sketch.png
path: outputs/03_시각자산/images/ch02/slide07.png
-->
```

`run_codex_image(prompt, ref=None)` — `ref`가 있으면 stdin 프롬프트에 `참고 이미지 파일: <절대경로>` 를 앞세운다. Codex CLI는 워크스페이스 파일을 읽을 수 있으므로 별도 API 변경이 필요 없다. `scan_placeholders()`가 `ref:` 줄을 프롬프트 본문에서 제외해야 한다(현재 `path:`만 제외).

### D. `scripts/check_preview_layout.py` 신설

`pub-layout-check`의 HTML판. 감지만 하고 수정하지 않는다(수정은 `ppt-preview` repair 규칙).

기존 `render_preview_slides.py`의 헤드리스 Chromium을 재사용해 검사:

1. `pre` 스크롤 발생 (`scrollHeight > clientHeight`) — 무스크롤 규칙 위반, PPTX에서 잘림
2. 캔버스 overflow — 자식 요소가 `.ppt-canvas` 경계를 벗어남
3. `data-slide` 연번·중복·원고 슬라이드 수 일치
4. 캔버스당 본문 45단어 초과
5. 골든 CSS 변수 밖 색상 하드코딩

`ppt-preview` 확정 체크리스트의 "브라우저 열림 확인"을 이 스크립트 호출로 대체한다(육안 → 기계).

### E. `manuscript-schema.md` §4 하위 유형 확장

`User image prompt:` / `User image:` 두 라벨 추가. 표가 골든 팔레트 안에서 허용됨을 명시.

### F. `manuscript_grammar.py` 정규식 추가

라벨 문법의 SSOT이므로 여기서만 수정한다(3중 복붙 드리프트 방지).

- `USER_IMG_FILE_RE` — `User image: <경로>`
- `USER_PROMPT_RE` — `User image prompt:` (origin 판정용. `IMG_PROMPT_RE`는 문자열 `image prompt`를 포함하므로 이미 매치된다 — 프롬프트 추출은 기존 정규식이 그대로 처리)

## 3. 되돌리지 않는 것 (퇴행 방지)

CHANGELOG 대조 결과, 아래는 **유지**한다. deep-talk 초안에서 "오버피팅"으로 지목했으나 오진이었다.

- **"기본 주 시각자료는 GPT 이미지"** — 2026-07-06 결정. ch01 파일럿에서 D2 슬라이드 5개를 GPT 이미지로 교체한 결과를 사용자가 직접 선호 확인해 내린 것이다. 또한 이 규칙은 "모든 슬라이드에 그림을 넣어라"가 아니라 이미지·D2가 공존할 때의 primary 기계 판정이다. 되돌리면 퇴행.
- **골든 위젯 "9종 제한"은 실재하지 않는다** — 현행 문구는 "새 시각 패턴이 필요해도 이 팔레트·구조 안에서만 스타일을 추가한다"로, 새 위젯은 이미 허용되고 CSS 변수만 제약한다. 제거가 아니라 명시화(제안 E)만 한다.
- 골든 CSS 변수·라이트 팔레트, `.ppt-slide`/`.ppt-canvas` DOM 계약, 안전 여백 `clamp()`(2026-07-06), 코드 무스크롤(2026-07-08), 45단어 권고 — 전부 "어떻게 보이는가"의 규칙이므로 유지.

## 4. 회귀 위험

| 위험 | 완화 |
|---|---|
| `origin` 없는 기존 manifest(spring-boot-basic ch01, design-pattern ch01) 재빌드 시 동작 변화 | `origin` 부재 = `agent`로 간주(기본값). 기존 슬라이드는 라벨이 `GPT image prompt:`이므로 그대로 `agent` 판정 → 회귀 없음 |
| `IMG_PROMPT_RE`가 `User image prompt:`를 이미 매치 → 기존 원고에 오탐? | 기존 원고에 `User image` 문자열이 없음(grep 확인 필요). 오탐 시 origin만 잘못 붙고 프롬프트 추출은 정상 |
| user-file 슬라이드가 stale 면제 → 원고 Screen이 바뀌어도 옛 그림 유지 | 의도된 동작. 사용자가 준 파일은 사용자만 바꾼다. 바꾸려면 개입 통로(§B)로 다시 지시 |
| primary 우선순위에 user-file 삽입 → 기존 D2 마커 슬라이드 영향 | user-file이 없으면 기존 분기 그대로. ch01들에 user-file 없음 → 회귀 없음 |
| 개입 통로가 원고를 자동 수정 → 사용자 확정 원칙 훼손 | 지시("이 사진 바꿔줘")와 역수정 범위 승인("원고 Slide 7의 이 줄을 이렇게 바꿉니다")은 별개다. `practice-code` §4와 같은 강도로 **최소 diff를 보고하고 명시 승인을 받은 뒤** 반영한다(codex-review 조건 6) |
| `check_preview_layout.py`가 기존 ch01 프리뷰에서 위반 다수 검출 | 감지만 하고 자동 수정하지 않는다. 기존 산출물 재검수는 사용자 판단 |
| `ppt-preview` §3의 "`image.status == present` 우선" 해석과 §"자산 선택 계약"의 primary 기준이 공존 → user-file primary와 어긋남 | R2로 primary 기준으로 제자리 교체(codex-review 조건 6 부수) |
| **선재 drift**: `spring-boot-basic` ch01 slide 12는 manifest 해시(`5ca87bd88c48`)와 현재 원고 해시(`6f46ae482e5f`)가 이미 불일치. 재빌드하면 이 변경과 무관하게 `stale` | 이번 변경이 만든 것이 아니다. 검증은 `design-pattern` ch01로 하고 `spring-boot-basic`은 재빌드하지 않는다. 사용자에게 보고 |

## 5. 검증

- `build_asset_manifest.py`: **`design-pattern` ch01만** 재빌드 → manifest diff가 `origin: "agent"` 추가뿐인지 확인(overall_status·primary·status 불변). `spring-boot-basic`은 선재 stale drift가 있어 재빌드 대상에서 제외한다(codex-review "검증 계획의 오류").
- `scripts/test_build_pptx.py` 옆에 manifest 단위 테스트 추가: user-file primary가 D2 마커를 이긴다 / user-file은 stale로 안 떨어진다 / user-file 경로 == annotate 병기 경로.
- `image_gen.py`: `--dry-run`으로 `ref:` 파싱 확인(프롬프트 본문에서 `ref:` 줄 제외됨) + 단위 테스트.
- `check_preview_layout.py`: 기존 `courses/design-pattern/outputs/06_PPT프리뷰/ch01.html`에 실행 → 검출 결과를 사용자에게 보고.
- 문서: drift grep 4종(중복·stale·old+new·dead-link) 0.

## 6. 반영 순서

1. Phase A — `manuscript_grammar.py` 정규식 + `build_asset_manifest.py` origin (기존 manifest 재빌드 diff 검증)
2. Phase B — `image_gen.py` ref 지원
3. Phase C — `check_preview_layout.py` 신설
4. Phase D — 문서: `manuscript-schema.md` §4, `visual-assets` SKILL.md, `ppt-preview` SKILL.md(§6 신설 + repair 첫 줄 교체 + 체크리스트), `course-pipeline` SKILL.md(사용자 확정 우선 원칙)
5. Phase E — CHANGELOG 한 줄
