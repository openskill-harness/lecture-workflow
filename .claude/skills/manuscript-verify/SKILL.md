---
name: manuscript-verify
description: 확정 원고(`manuscripts/chNN.md`)의 기술 주장(정의·프로토콜·API·버전)을 외부 권위 문서 + Source 교차확인으로 적대적 검증해 근거부 리포트(`verification/chNN_verify.md`)를 내는 비차단 온디맨드 스킬. "원고 검증", "기술 검증", "팩트체크", "사실 확인" 요청 시 사용. 파이프라인 3.5단계(원고확정 직후, 온디맨드) — 하드 게이트가 아니며 원고를 자동 수정하지 않는다(수정은 사용자가 manuscript-final로). 비유·의견·서사는 검증 대상이 아니다.
---

# manuscript-verify

확정 원고의 기술 주장을 외부 권위 근거와 대조해 참/거짓을 판정하고, 의심 주장을 **근거부 리포트**로 내는 비차단 온디맨드 스킬이다. 원고는 수정하지 않는다.

**설계 근거**: `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`.

## 0. 전제 게이트

- 대상 차시 `원고확정`이 `status.md`에서 ✅가 아니면 **중단**하고 사용자에게 알린다. 미확정 원고는 검증하지 않는다.
- 대상 차시(chNN)·과정 디렉터리를 확정한다.

## 1. 주장 추출 (결정적 후보 → LLM distill)

- `python scripts/extract_claim_candidates.py courses/{id} chNN` 를 실행해 슬라이드별 후보(정의/나레이션/Source) JSON을 얻는다.
- 각 슬라이드 후보에서 **검증 가능한 원자적 기술 주장**을 distill한다: 정의·프로토콜/표준 사실·API/메서드 동작·버전/설정 값. 하나의 문장이 여러 주장을 담으면 쪼갠다.
- **범위 가드(필수)**: 비유·의견·교육적 서사·주관적 표현은 주장으로 삼지 않는다(후보 추출기가 Easy analogy를 이미 제외하므로 나레이션 속 비유 표현만 추가로 거른다).
- 결과: 주장 리스트 `{slide, claim_text, source_field, claim_type}`.

## 2. 검증 (병렬 서브에이전트, 적대적)

- 슬라이드 단위로 검증 서브에이전트를 병렬 파견한다(한 슬라이드의 1–3개 주장을 묶어 처리 — 에이전트 수 억제). 프롬프트 규범은 `references/verifier-prompt.md`.
- 각 검증자는: (a) 권위 문서 웹 리서치(WebSearch/WebFetch — 공식 도큐·MDN·RFC·프레임워크 문서), (b) 슬라이드 `Source` 교차확인(존재·권위·주장 지지 여부), (c) 적대적 반박 시도 후 근거 인용이 있어야만 판정.
- 반환(주장별): `{claim, verdict: "지지"|"반박"|"검증불가", confidence: "high"|"medium"|"low", evidence_url, evidence_quote, source_supports: bool, target_version, evidence_version, suggested_correction}`.
- **판정 기준(오탐 억제)**: `반박(high)`은 공식 문서·버전 맥락이 **직접 충돌**할 때만 낸다. 출처가 없거나·버전이 안 맞거나·문서 간 표현이 애매하면 → `검증불가`(오류 아님, 사람 판단). 버전/설정값 주장은 `target_version`(과정 대상 버전)과 `evidence_version`(근거 문서 버전)을 함께 기록한다.
- **Source 부실 분리**: 주장 자체는 맞지만 슬라이드 `Source`가 그 주장을 지지하지 않으면 → `verdict: "지지"` + `source_supports: false`(리포트에서 "Source 보완 필요"로 표기). 이는 조치 대상 **반박이 아니다**(원고 주장은 맞으니 수정 대상 아님, Source만 보완 권유).
- **파견 상한**: 동시 파견 수에 상한을 둔다. 상한으로 못 돌린 주장이 있으면 리포트에 "미검증"으로 **명시**한다(침묵 절단 금지).

## 3. 리포트 집계

- 판정을 모아 `courses/{id}/verification/chNN_verify.md`를 만든다. 포맷은 `references/report-template.md`를 따른다.
- **"반박(조치 대상)"과 "검증불가(사람 판단 필요)"를 분리**한다 — 오탐이 조치 목록을 오염시키지 않게. "검증불가"는 오류가 아니라 사람 판단 항목이다.
- 의심 요약(반박 N건·검증불가 Z건·미검증 W건)을 사용자에게 보고한다.

## 4. 수정 루프 (안내)

- 사용자가 리포트를 검토 → 고칠 주장을 정함 → `manuscript-final`로 수정(사용자 확정 SSOT 편집) → 필요 시 `manuscript-verify` 재실행. **이 스킬은 원고를 수정하지 않는다.**
- `status.md`에 정보성 한 줄만 남긴다: `원고검증: chNN 리포트 YYYY-MM-DD, 반박 N·검증불가 Z`. (하드 게이트 칸 아님.)

## 확정 체크리스트 (실행마다)

- [ ] **전제 게이트**: 대상 차시 `원고확정` ✅ 확인 후 실행했다.
- [ ] **범위 준수**: 리포트에 비유·의견이 기술 주장으로 잘못 올라오지 않았다.
- [ ] **근거 첨부**: "반박"·"지지" 판정에 인용 가능한 근거(URL + 인용문)가 붙어 있다. 근거 없는 판정은 "검증불가"로 내렸다.
- [ ] **분리 표기**: 리포트가 "반박(조치)"과 "검증불가(사람 판단)"를 분리했다.
- [ ] **미검증 명시**: 상한 등으로 못 돌린 주장을 리포트에 명시했다.
- [ ] **비파괴**: 원고(`manuscripts/chNN.md`)를 수정하지 않았다.

## 참고

- 후보 추출기: `scripts/extract_claim_candidates.py`(수정 금지, 그대로 호출)
- 리포트 포맷: `references/report-template.md`
- 검증자 프롬프트: `references/verifier-prompt.md`
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. 실사용 품질은 위 확정 체크리스트가 매 실행마다 담당한다.
