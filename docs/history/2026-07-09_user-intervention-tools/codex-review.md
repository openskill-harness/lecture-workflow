# codex 사전검증 — 사용자 개입 도구 (origin + 프리뷰 개입 통로)

**조건부승인** (조건 6: user-file stale 명시 우회 / spring-boot-basic 기존 stale 베이스라인 처리 / course_layout 경로 사용 / annotate·pptx 경로 canonical 계약 고정 / ref 파서·테스트 보강 / 사용자 개입 시 승인·diff 보고 문구 명확화)

- 날짜: 2026-07-09
- 대상: `proposal.md`
- 방식: `codex exec --sandbox read-only` (읽기 전용, stdin 닫음)

## 조건별 근거

### 조건 1 — `user-file`은 stale 비교를 명시적으로 건너뛰어야 한다 (제안 A 수정)

proposal은 "`prompt_hash: null`이면 비교할 해시가 없으니 stale 면제가 자연스러운 귀결"이라 했으나 **현재 코드 기준으로 거짓**이다.

`build_asset_manifest.py:162`의 조건은 `img_file_ok and prior_hash is not None and prior_hash != cur_hash`다. agent 이미지가 있던 슬라이드를 user-file로 교체하면 `prior_hash`는 non-null이고 `cur_hash`는 `None`이므로 `prior_hash != cur_hash`가 참 → **stale로 오판**된다. 사용자가 준 파일이 덮어쓰기 대상이 되는 정확히 반대의 결과.

→ `origin == "user-file"`일 때 stale 분기를 명시적으로 건너뛴다.

### 조건 2 — `user_file` 분기는 D2 opt-in 분기보다 **앞**에 와야 한다

`build_asset_manifest.py:122`의 `has_img = bool(info["prompt"])` 때문에 프롬프트 없는 `User image:`는 이미지 블록 자체가 생성되지 않는다. 또 `132`의 `if info["d2_primary"] and has_d2` 가 먼저 걸리므로, user-file을 단순히 "image 취급"만 하면 `주 시각자료: D2` 마커가 계속 이긴다.

→ `has_img`를 `bool(prompt) or bool(user_file)`로 확장하고, primary 분기 최상단에 `user_file`을 둔다.

### 조건 3 — user-file 경로는 `course_layout.rel(course, "assets")` 기준이어야 한다

proposal의 "항상 `outputs/03_시각자산/images/chNN/`로 복사"는 레거시 배치(`courses/spring-boot-basic/assets/`)와 충돌한다. `course_layout.py`가 신규 `outputs/` 규약과 루트 평면 배치를 모두 판별한다.

→ 복사 대상 경로를 `course_layout`으로 계산한다. 문서에도 규약 경로를 하드코딩하지 않는다.

### 조건 4 — `User image:` 경로와 annotate 병기 경로는 동일한 canonical 경로여야 한다

`build_pptx.py:140`의 `IMG_PATH_RE`가 `User image: outputs/03_시각자산/...` 라인 자체도 매치하고, `165`는 **첫 경로만** 사용한다. `annotate_manuscript_assets.py:33`은 primary present 자산 한 줄을 병기한다.

두 경로가 다르면 pptx-build가 원고에서 먼저 나온 쪽을 집는다.

→ user-file을 규약 경로로 복사하므로 두 경로는 동일해진다. 이 등식을 문서 계약으로 명시하고 테스트로 고정한다.

### 조건 5 — `ref:` 파서 보강 (제안 C)

`image_gen.py:33`의 `scan_placeholders()`는 `path:` 줄만 프롬프트 본문에서 제외한다. codex가 샘플 실행으로 확인: `ref:` 줄이 프롬프트에 그대로 남는다. `_PATH`(`^\s*path:`)는 `ref:`와 간섭하지 않는다.

→ `_REF` 정규식 + `Placeholder.ref` 필드 + 본문 제외 + `process_file()`의 `generate(ph.prompt, ph.ref)` 흐름 + dry-run 출력/테스트.

### 조건 6 — 사용자 개입 시 최소 diff 보고 + 명시 확인 (제안 B)

`practice-code` §4의 역수정 패턴은 "사용자 **승인 후에만**"이다. proposal의 "개입 자체가 지시이므로 승인은 이미 있다"는 뭉개기다. 지시("이 사진 바꿔줘")와 역수정 범위 승인("원고 Slide 7의 이 줄을 이렇게 바꿉니다")은 별개다.

→ 역수정 diff를 보고한 뒤 반영한다. `practice-code` §4와 같은 강도로 문구를 맞춘다.

부수: `ppt-preview` SKILL.md에 `image.status == "present"` 우선 해석 문장(§3, 67행)과 `primary` 기준 계약 문장(77행)이 **공존**한다. user-file은 primary 최우선이므로 present 우선 해석과 어긋날 수 있다. R2로 primary 기준으로 제자리 교체한다.

## 검증 계획의 오류 (proposal §5 수정)

proposal은 "기존 두 과정 재빌드 diff가 `origin` 추가뿐"이라 주장했으나 **거짓**이다.

codex 실측: `design-pattern` ch01은 mismatch 0이지만, **`spring-boot-basic` ch01 slide 12는 manifest 해시 `5ca87bd88c48`, 현재 원고 해시 `6f46ae482e5f`로 이미 어긋나 있다.** 이미지 파일이 존재하므로 재빌드하면 이 변경과 무관하게 `stale`이 된다.

→ 이건 **선재(pre-existing) drift**다. 이번 변경이 만든 게 아니다. 검증은 `design-pattern` ch01로 하고, `spring-boot-basic`은 재빌드하지 않는다(사용자 판단 사항으로 보고).

## R1~R4 관점

제안 문서 자체는 `docs/history/` 소속이므로 이력 서술이 정상이다. 다만 **반영 시** 권위 문서(SKILL.md, schema)에 "2026-07-09에 바뀜" 류 이력 문구를 넣지 말고 기존 문장을 제자리 교체할 것(R2·R3).
