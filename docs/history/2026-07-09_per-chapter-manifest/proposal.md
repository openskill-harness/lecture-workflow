# 제안: manifest를 차시별 파일로 분리 (다차시 과정에서 상호 덮어쓰기 버그)

- 날짜: 2026-07-09
- 발견 경위: `design-pattern` ch02 시각자산 생성 직후 manifest 빌드에서 stale 10장 오탐

## 1. 문제 (실측)

`build_asset_manifest.py`는 결과를 `{시각자산}/manifest.json` **한 파일**에 쓴다. 경로에 차시(chNN)가 없다.

```python
out_path = course / assets_rel / "manifest.json"     # build_asset_manifest.py
p = course_layout.path(course, "assets") / "manifest.json"   # _load_prior_hashes()
manifest = json.loads((course_layout.path(course, "assets") / "manifest.json")...)  # annotate
```

따라서 한 과정에 차시가 둘 이상이면 **뒤에 빌드한 차시가 앞 차시의 manifest를 덮어쓴다.** 그리고 `_load_prior_hashes()`는 그 파일을 차시 확인 없이 읽어 **다른 차시의 해시**를 현재 차시의 같은 번호 슬라이드와 비교한다.

실측 결과(ch01 manifest가 있는 상태에서 ch02 빌드):

```
OK: manifest.json — partial (시각슬라이드 8/18 커버)
image status: {'stale': 10, 'present': 8}
present 아닌 슬라이드: [1, 2, 3, 4, 5, 6, 7, 9, 10, 14]
```

18장 모두 방금 생성해 파일이 존재하는데 10장이 `stale`이다. ch01의 slide01~10 프롬프트 해시와 ch02의 slide01~10 프롬프트 해시가 다르기 때문이다. 동시에 ch01 manifest(`present 11/11`)는 파일에서 사라졌다.

**두 가지 고장이 겹쳐 있다.**
1. 저장 경로에 차시가 없어 차시끼리 서로 덮어쓴다(데이터 손실).
2. `_load_prior_hashes()`가 차시를 확인하지 않아 stale을 오탐한다(하드 게이트가 멀쩡한 자산의 재생성을 요구).

## 2. 왜 지금까지 안 드러났나

파일럿 `spring-boot-basic`도, `design-pattern`도 ch01 한 차시만 시각자산을 만들었다. **ch02가 이 하네스에서 처음으로 두 번째 차시**다. 설계 §3.0-A와 `visual-assets` SKILL.md가 `outputs/03_시각자산/manifest.json`을 단수로 못박은 것도 이 가정 위에 있었다.

## 3. 제안

### A. 차시별 manifest 파일

`{시각자산}/manifest.json` → `{시각자산}/manifest_chNN.json`

- 소비처는 차시를 이미 알고 있으므로(`chNN.md`를 읽고 있다) 경로를 유도할 수 있다. 조회 로직이 바뀌지 않는다.
- 파일명이 차시를 담아 덮어쓰기가 구조적으로 불가능해진다.
- 대안(단일 파일에 `chapters: {ch01: …}` 맵)은 8개 소비 스킬이 전부 "차시로 인덱싱" 로직을 새로 갖게 되고, 부분 쓰기 시 다른 차시 데이터를 잃을 위험이 남는다. 파일 분리가 더 단순하고 안전하다.

### B. `_load_prior_hashes()`에 차시 가드

경로가 분리되면 교차 오염은 사라지지만, 방어적으로 이전 manifest의 `chapter` 필드가 대상 차시와 다르면 이전 해시를 쓰지 않는다(빈 dict 반환). 경로 규약이 미래에 또 바뀌어도 stale 오탐이 재발하지 않는다.

### C. 기존 자산 이관

`courses/design-pattern/outputs/03_시각자산/manifest.json`(ch01, `present 11/11`) → `manifest_ch01.json`으로 이름 변경. 재생성하지 않는다(프롬프트 해시가 보존되어야 stale 오탐이 안 난다).

`spring-boot-basic`은 삭제됐으므로 이관 대상이 아니다.

### D. 문서 계약 갱신 (R2 제자리 교체)

`outputs/03_시각자산/manifest.json`을 명시한 곳을 `manifest_chNN.json`으로 바꾼다:
`visual-assets`, `ppt-preview`, `storyboard`, `book-build`, `pptx-build`, `panseo-slide`, `course-pipeline`, `manuscript-final` SKILL.md + 설계 spec §3.0-A·§4 + `scripts/annotate_manuscript_assets.py` 독스트링.

### E. 테스트

`tests/test_build_asset_manifest.py`의 `_make_course`는 단일 차시만 만든다. 다차시 회귀 테스트를 추가한다.
- ch01 빌드 → ch02 빌드 → **ch01 manifest가 그대로 남아 있다.**
- ch01과 ch02의 slide 번호가 겹치고 프롬프트가 달라도 ch02가 stale로 떨어지지 않는다.
- 차시 가드: 다른 차시의 manifest를 prior로 넘겨도 무시한다.

## 4. 회귀 위험

| 위험 | 완화 |
|---|---|
| 소비 스킬이 옛 경로(`manifest.json`)를 계속 읽어 파일을 못 찾음 | 문서 8곳 + annotate를 한 커밋에서 함께 바꾼다. grep으로 잔재 0 확인 |
| ch01 자산이 재생성되어 이미 승인된 이미지 11장이 교체됨 | 파일을 **이름만 바꾼다**(rename). 프롬프트 해시가 보존되므로 stale 아님 |
| `check_visual_gate.py`가 영향받음 | status.md만 읽는다. 무관 |
| `build_pptx.py`가 영향받음 | 원고의 annotate 병기 경로를 읽는다. manifest 경로와 무관 |
| ch02 manifest에 남은 stale 10장 오탐 | 경로 분리 후 재빌드하면 prior가 없어 전부 `present`가 된다 |

## 5. 검증

- ch01 rename 후 `build_asset_manifest.py courses/design-pattern ch01` 재빌드 → `present 11/11`, stale 0, `manifest_ch02.json` 무영향.
- `build_asset_manifest.py courses/design-pattern ch02` → `present 18/18`, stale 0, `manifest_ch01.json` 무영향.
- `annotate_manuscript_assets.py`가 두 차시 모두에서 primary 경로를 병기.
- drift grep: 권위 문서에 `03_시각자산/manifest.json`(차시 없는 형태) 잔재 0.

## 6. 반영 순서

1. `build_asset_manifest.py` — 출력 경로 + `_load_prior_hashes` 차시 가드
2. `annotate_manuscript_assets.py` — 입력 경로
3. 기존 ch01 manifest rename
4. 테스트(다차시 회귀 3종)
5. 문서 8곳 + spec
6. ch01·ch02 재빌드 검증 → CHANGELOG
