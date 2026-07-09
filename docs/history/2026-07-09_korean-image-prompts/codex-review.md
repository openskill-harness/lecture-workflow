# codex 사전검증 — 이미지 프롬프트 한글화

**조건부승인** (조건 5: 골든 프롬프트 11개 전체 처리 / legacy `시각자료 프롬프트(영문)` 라벨 방침 명시 / `spring-boot-basic` dead-ref 전수 정리 / 적용 경계를 ch02로 확정 / 한글 프롬프트 글자 렌더링 파일럿 게이트 추가)

- 날짜: 2026-07-09
- 대상: `proposal.md`
- 방식: `codex exec --sandbox read-only`

## 조건별 근거

### 조건 1 — 골든 프롬프트는 10개가 아니라 11개

proposal의 "10개"가 틀렸다. 실측: `GPT image prompt` 9 + `Comic panel prompt` 1 + **`GPT support image prompt` 1**(line 566) = 11. `build_asset_manifest.parse_visual_assets()`가 `IMG_PROMPT_RE`로 `GPT support image prompt`도 프롬프트 슬라이드로 인식하므로 누락하면 안 된다.

### 조건 2 — legacy 라벨 `시각자료 프롬프트(영문)`은 이름을 바꾸지 않는다

`IMG_PROMPT_RE`는 라벨만 매치하고 본문 언어를 보지 않으므로 한글 본문은 정상 추출된다. 그러나 라벨을 `시각자료 프롬프트(한글)`로 "자연스럽게" 바꾸면 정규식이 매치하지 않는다.

→ 라벨 체계는 손대지 않는다. 새 원고는 `GPT image prompt:`를 쓰고 본문만 한글로 쓴다.

(반영 후 실측 정정: codex는 `design-pattern` ch01이 legacy 라벨을 쓴다고 했으나 실제로는 `GPT image prompt` 11개다. legacy 라벨 `시각자료 프롬프트(영문)`을 쓰던 것은 삭제된 `spring-boot-basic` 원고였다. 결론은 그대로 — legacy 라벨은 하위호환용으로 정규식에 남기고 새 원고에서는 쓰지 않는다.)

### 조건 3 — `spring-boot-basic` dead-ref 전수 정리 (R1)

`courses/spring-boot-basic`은 **이미 삭제됐다**(현재 `courses/`에 `design-pattern`만 존재). 권위 문서에 남은 참조:

| 위치 | 성격 |
|---|---|
| `CLAUDE.md:9` | "파일럿 `spring-boot-basic`의 다음 할 일" — 없는 과정 |
| `.claude/skills/visual-assets/SKILL.md:51, 135` | D2 파일명 실사례 / 파일럿 manifest 경로 |
| `.claude/skills/pub-d2-diagram/SKILL.md:128` | D2 파일명 실사례 |
| `docs/superpowers/specs/…-design.md:124, 236` | status.md 예시 헤더 / 1회성 이관 서술 |

R1은 "옛 경로/dead-link는 인라인에 남기지 않고 `docs/history/`로 보낸다"이다. 제거하거나 현재 유효한 예시(`design-pattern`)로 교체한다. `docs/history/`의 과거 기록은 grep 0 대상에서 제외한다(스냅샷).

spec:236의 "이동" 서술은 1회성 이관 절차이므로 R1상 애초에 spec에 있으면 안 된다 — 이번 정리에서 함께 제거한다.

### 조건 4 — 적용 경계를 ch02로 확정

`design-pattern` ch02는 이미 초안(`ch02_draft.md`, 영문 프롬프트 13개)이 생성돼 있다. "새 원고부터"가 ch02인지 ch03인지 모호하다.

→ **ch02_draft부터 적용**한다. 아직 확정(✅) 전이고 이미지도 생성 전이라 stale 폭포가 없다. `ch01.md`(확정·이미지 11장 생성 완료)는 그대로 둔다.

### 조건 5 — 글자 렌더링 파일럿 게이트

`image_gen.py:105`가 한국어 wrapper로 호출하는 것은 사실이나, "글자 없이"만으로 한글 프롬프트와 영문 프롬프트의 text-rendering 경향이 같다고 단정할 근거는 없다.

→ (a) 프롬프트 규칙에 글자/라벨/말풍선/간판 금지를 명시적으로 박는다. (b) ch02 첫 생성 결과를 사용자가 육안 확인해 품질을 판정하는 것을 조건으로 둔다. 품질이 나쁘면 되돌린다.

## 검증된 사항 (변경 불필요)

- `IMG_PROMPT_RE`는 한글 본문을 정상 추출한다(codex 실행 확인).
- `build_asset_manifest`는 프롬프트 언어가 아니라 텍스트 해시를 본다. ch01(영문)/ch02(한글) 혼재가 파이프라인을 깨지 않는다.
- `ppt-preview`/`book-build`는 manifest 경로만 읽는다.
- 골든은 `manuscript-draft`/`manuscript-final`이 **필드명·순서·문체 예시**로 참조한다. 구조·라벨을 건드리지 않고 프롬프트 본문만 바꾸는 방향은 안전하다.
- 스키마 3행 precedence 재정의는 R2 제자리 교체로 가능하다.
