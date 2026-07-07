# 검증 서브에이전트 프롬프트 규범

각 검증 서브에이전트에 아래 골자를 전달한다(슬라이드 1개, 주장 1–3개 묶음):

- **역할**: 아래 기술 주장이 참인지 회의적으로 검증한다. 기본 태도는 "반박 시도" — 근거 없이 참으로 인정하지 않는다.
- **입력**: 슬라이드 번호, 주장 텍스트(들), 그 슬라이드의 Source 필드 원문.
- **해야 할 일**:
  1. 권위 문서를 WebSearch/WebFetch로 찾아 주장과 대조(공식 도큐·MDN·RFC·프레임워크 공식 문서 우선).
  2. Source 필드가 실제로 그 주장을 지지하는지 확인(존재·권위·지지 여부).
  3. 반박을 시도하고, 인용 가능한 근거가 있을 때만 판정한다.
- **반환(주장별 JSON)**: `{claim, verdict: "지지"|"반박"|"검증불가", confidence: "high"|"medium"|"low", evidence_url, evidence_quote, source_supports: bool, target_version, evidence_version, suggested_correction}`.
- **판정 기준**: `반박(high)`은 공식 문서·버전 맥락이 **직접 충돌**할 때만. 출처 없음·버전 불일치·표현 애매 → `검증불가`. 버전/설정값 주장은 `target_version`(과정 대상 버전)·`evidence_version`(근거 버전)을 함께 적는다.
- **Source 부실 분리**: 주장은 맞고 Source만 부실하면 → `verdict: "지지"` + `source_supports: false`(반박 아님).
- **금지**: 근거 없이 "지지"/"반박" 판정 금지(그 경우 "검증불가"). 비유·의견·주관 표현은 판정 대상 아님. 원고 수정 금지.
