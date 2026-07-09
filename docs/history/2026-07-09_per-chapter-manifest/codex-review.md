# codex 사전검증 — 차시별 manifest 분리

**조건부승인** (조건 5: annotate 교차오염을 별도 위험으로 명시 / rename 순서·"ch01 재빌드 불필요, ch02 빌드 필요" 정정 / 누락 문서 3곳(status_template·course status 인덱스·book-concept-anchor spec) 보완 / 차시 가드의 legacy·missing 정책 명시 + 테스트 / 권위 문서 옛 경로 잔재 0을 R2로 확인)

- 날짜: 2026-07-09
- 대상: `proposal.md`
- 방식: `codex exec --sandbox read-only`

## 확인된 진단

`_load_prior_hashes(course)`가 `{시각자산}/manifest.json`만 읽고 `chapter`를 보지 않는다. 출력도 같은 단일 파일에 쓴다. codex가 실제 데이터로 재현: ch01 manifest를 prior로 두고 ch02를 계산하면 `{'stale': 10, 'present': 8}`, non-present `[1,2,3,4,5,6,7,9,10,14]`. 관측값과 정확히 일치한다.

## 조건 1 — `annotate_manuscript_assets.py`도 오염원이다 (proposal 누락)

`annotate`도 단일 `manifest.json`을 읽고, **`chapter` 검증 없이 슬라이드 번호만으로** 원고에 자산 경로를 병기한다.

현재 실제 상태(`manifest.json`의 `chapter`는 ch01, `images/ch02/`는 존재)에서 ch02 annotate를 실행하면 **ch02 원고에 ch01의 primary 경로가 병기된다.** `build_pptx`가 원고의 첫 이미지 경로를 임베드하므로, ch02 PPTX에 ch01 그림이 들어가는 조용한 오염으로 이어진다.

→ proposal §3-D에 annotate를 "문서만 갱신" 대상으로 적었으나, **코드 필수 수정 대상**이다.

## 조건 2 — rename 순서와 재빌드 필요 범위 정정

proposal §5는 ch01 재빌드를 검증에 넣었으나 **ch01은 재빌드가 필요 없다.** 순서는:

1. 코드가 `manifest_chNN.json`을 읽고 쓰도록 먼저 바꾼다.
2. 기존 ch01 `manifest.json` → `manifest_ch01.json` **이름만 변경**(내용·해시 보존).
3. `status.md` 산출물 인덱스의 ch01 경로를 갱신한다.
4. ch02는 manifest가 아직 없으므로 **빌드**한다(이미지 재생성은 불필요 — 18장 이미 존재).

## 조건 3 — 누락 문서 3곳

proposal이 열거한 8개 SKILL.md + spec 외에:

- `templates/status_template.md:14`
- `courses/design-pattern/status.md:39` (ch01 산출물 인덱스)
- `docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:52`

## 조건 4 — 차시 가드의 legacy/missing 정책을 명시하고 테스트

경로 분리만으로 이번 버그는 사라지지만 방어적 가드는 유지한다. 다만 `chapter`가 없거나 어긋난 manifest를 무조건 무시하면 **정상 stale 감지를 false negative로 놓칠 수 있다.** 정책을 명문화한다:

- prior manifest의 `chapter` == 대상 차시 → 해시 비교 수행(정상 stale 감지).
- 다르거나 없음 → prior 없음으로 간주(해시 비교 생략).

세 경우 모두 테스트한다.

## 조건 5 — 코드 변경이 필요 없는 곳 (확인됨)

- `build_pptx.py`: 원고의 이미지 경로만 읽는다. manifest 경로와 무관.
- `check_visual_gate.py`: status.md 표만 본다.
- `course_layout.py`: 필수는 아니나 `asset_manifest_path(course, ch)` helper를 두어 경로 분산을 막을 것을 권장(채택).

기존 테스트 파일 두 개가 대상: `tests/test_build_asset_manifest.py`, `tests/test_annotate_manuscript_assets.py`.

## 설계 대안에 대한 반론 (기록)

codex: 단일 파일 + `chapters` 맵이 "압도적으로 열등"하지는 않다. 단일 파일은 기존 계약·status 인덱스를 덜 흔들고 과정 단위 요약이 쉽다. 대신 load-modify-write 실수와 병합 충돌 위험이 있다. 파일 분리는 쓰기 안전성이 강하지만 문서·소비처 경로 변경 blast radius가 크다.

→ **파일 분리를 채택한다.** 이번 사고가 정확히 "load-modify-write 없이 통째로 덮어쓴" 사고였고, 차시가 16개까지 늘어나는 과정에서 쓰기 안전성이 요약 편의보다 중요하다. blast radius는 일회성이다.

## R1~R4

구현 시 권위 문서에 `manifest.json → manifest_chNN.json` 같은 변경 이력 문구를 남기면 R1/R3 위반. old/new 병기는 R2 위반. CLAUDE.md에 상세를 추가하지 않는다(R4). 옛 경로는 제자리 교체하고 grep으로 잔재 0을 확인한다.
