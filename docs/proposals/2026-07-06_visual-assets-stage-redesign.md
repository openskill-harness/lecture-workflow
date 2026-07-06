# 제안서: 시각자산 스테이지 신설 + 자산 파이프라인 재설계

- 날짜: 2026-07-06
- 상태: codex 사전검증 완료(`docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`) — 조건부 승인, 4개 조건 반영(§2.5)
- 배경 문서: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` (v2 설계)
- 계기: spring-boot-basic ch01 파일럿 실행에서 드러난 구조적 마찰

## 1. 배경 — 파일럿이 드러낸 문제

ch01 전체 패키지를 실제로 만들면서 아래 마찰이 확인됐다.

1. **자산 생성이 소비 산출물 뒤에 와서 재동기화 폭포(cascade)를 유발한다.** 현재 파이프라인은 `원고확정 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`이고, 이미지(image-gen)·D2(pub-d2-diagram) 생성은 manuscript-final(3단계) 안의 "선택" 절차로만 존재한다. 실제로는 원고 확정 시점에 자산을 안 만들고 넘어가, 스토리보드·PPT프리뷰·판서·PPTX가 전부 placeholder로 먼저 만들어졌다. 나중에 이미지를 생성하니 **그 4개 산출물을 다시 만들어야 하는** 재작업이 생겼다.
2. **image-gen 브릿지 마찰.** 원고 스키마의 `시각자료 프롬프트(영문):` 라벨은 image-gen이 스캔하는 `[IMAGE PROMPT]` 태그 형식이 아니다. 매번 스크래치 파일로 태그를 만들어 넣는 수작업 브릿지가 필요했다(manuscript-final fix에서 서술만 했을 뿐, 자동화가 없다).
3. **image-gen 지연이 크다.** Codex 이미지 생성이 장당 1~2분(직렬)이라 26장에 30~50분. "곧 되겠지"로 기다리다 폴링 서브에이전트가 토큰만 소모했다.
4. **pub-d2-diagram의 Windows 렌더링·종횡비 문제.** rsvg-convert가 Windows에 없어 playwright 스크린샷 폴백을 즉흥적으로 썼고, 가로 선형 레이아웃이라 일부 다이어그램(slide05 ~10:1, slide20 ~9:1)이 극단적으로 납작해 슬라이드·책에 넣으면 글자가 안 보인다.
5. **status.md에 자산 단계 추적 칸이 없다.** 자산이 생성됐는지/누락인지 상태로 안 보인다.

## 2. 제안

### 제안 A (핵심): "시각자산" 스테이지 신설 — 원고확정 직후, 소비 산출물 앞

파이프라인을 10단계 → **11단계**로 바꾼다. 새 단계 `visual-assets`를 4번(원고확정 다음, 코드 앞)에 넣는다.

```
1 course-outline → 2 manuscript-draft → 3 manuscript-final →
4 visual-assets(신규) → 5 practice-code → 6 storyboard → 7 ppt-preview →
8 panseo-slide → 9 edu-sim-builder → 10 pptx-build → 11 book-build
```

`visual-assets` 스킬의 책임:
- 확정 원고의 Visual asset 필드를 스캔해 **이미지 프롬프트 → image-gen `[IMAGE PROMPT]` 태그 자동 변환(브릿지 내장)** 후 image-gen 실행 → `assets/images/chNN/`.
- 원고의 ```d2 블록 → pub-d2-diagram 렌더 → `assets/diagrams/`.
- 생성 완료 자산 경로를 **원고 Visual asset에 `→ 생성됨:`/`→ 렌더됨:`으로 주석**(SSOT 갱신).
- 결과: 이후 6~11단계(스토리보드/PPT프리뷰/판서/PPTX/책)가 **처음부터 실자산을 임베드** → 재동기화 폭포 제거.
- image-gen 지연 대비: 이 단계는 "지금 생성 / 나중에(placeholder 유지)" 를 명시적으로 선택. 생성은 백그라운드 배치 + 진행 표시. manuscript-final의 선택적 자산 생성 서술은 이 단계로 이관(중복 제거).

### 제안 B: pub-d2-diagram Windows 렌더링·종횡비 표준화
- rsvg-convert 부재 시 **playwright 스크린샷 폴백을 정식 경로로 문서화**(즉흥 금지). 또는 Windows용 렌더 바이너리 설치 안내.
- 다이어그램 **종횡비 가이드**: 슬라이드(16:9)·책 페이지에 들어가므로 가로:세로 3:1 이내 권장. 노드가 많아 가로가 길어지면 `direction: down`(세로) 또는 그룹 래핑으로 재배치. 렌더 후 종횡비 검사 → 초과 시 경고.

### 제안 C: status.md에 `시각자산` 칸 추가
열: `원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책` (10칸 → 11칸).
상태 기호 확장: `⬜/🔄/✅/➖` 외에 자산 단계 전용으로 **`deferred`(placeholder 유지)·`partial`(일부만 생성)·`stale`(원고 변경으로 재생성 필요)** 를 status.md 범례에 추가.

### 제안 E (codex 조건 반영): hard gate·manifest·해시 stale·소비 계약
1. **hard gate**: visual-assets가 `✅` 또는 명시적 `deferred`일 때만 6~11단계를 진행. placeholder로 그냥 넘어가지 않는다.
2. **asset manifest(SSOT)**: `courses/{id}/assets/manifest.json` — 슬라이드→{경로, prompt_hash/d2_hash, 상태}. 원고 주석(`→ 생성됨:`)은 사람이 읽는 보조일 뿐, 소비 스킬은 manifest를 신뢰.
3. **해시 기반 stale**: 원고 Visual asset의 프롬프트/D2가 바뀌면 해당 슬라이드 해시 불일치 → 그 슬라이드 자산만 재생성, 후속 산출물도 그 슬라이드만 stale 표시(전체 재생성 금지).
4. **소비 스킬 계약 변경**: storyboard·ppt-preview·pptx-build·panseo·book-build은 원고 프롬프트 텍스트가 아니라 **manifest의 확정 경로**를 읽어 자산을 임베드한다(경로 없으면 그 슬라이드만 placeholder). 이 변경이 D 반영 범위에 포함됨.
5. **코드/캡처형 자산**: 화면 캡처처럼 실행 결과가 필요한 자산은 practice-code 이후 finalize substage로 처리(image/D2는 원고확정 직후 착수).

### 제안 D: 반영 범위 문서
- 설계 문서(spec) §3 표·§6·§7 개정, CLAUDE.md 파이프라인 표·트리거 라우팅, `templates/status_template.md` 열, course-pipeline 매핑 표에 `visual-assets` 추가.
- 신규 스킬 `.claude/skills/visual-assets/SKILL.md`. image-gen/pub-d2-diagram은 이 스킬이 호출하는 엔진으로 유지(기존과 동일).

## 3. 대안 (기각 후보)
- **대안 1: 순서는 그대로 두고 재동기화를 자동화.** 소비 산출물에 "자산 생성되면 자동 repair" 훅을 단다. → 각 스킬이 자산 생성 여부를 감시해야 해 복잡도 증가. 순서를 고치는 게 근본 해결. 기각 권고.
- **대안 2: 자산 생성을 manuscript-final 안에 강제 편입(선택 아님).** → 원고 확정과 자산 생성이 한 단계에 묶여 책임이 비대해지고, "원고만 빠르게 확정"이 불가. 별도 단계가 관심사 분리에 맞음. 기각 권고.

## 4. 영향 범위 / 되돌리기
- 영향: 설계 문서, CLAUDE.md, status 템플릿, course-pipeline, manuscript-final(자산 서술 이관), 신규 visual-assets 스킬, pub-d2-diagram. 기존 ch01 산출물은 재설계 후 새 순서로 재빌드(이번 재동기화가 사실상 그 시연).
- 되돌리기: 각 변경을 개별 커밋으로. 문제 시 커밋 revert. 신규 스킬은 삭제, 순서·표는 이전 값 복원.

## 5. 파일럿과의 관계
지금 진행 중인 ch01 이미지 생성 + 재동기화는 이 재설계의 **새 순서를 사후 적용**하는 것과 같다(자산 먼저 → 소비 산출물 재생성). 재동기화 결과가 재설계의 타당성 실증이 된다.
