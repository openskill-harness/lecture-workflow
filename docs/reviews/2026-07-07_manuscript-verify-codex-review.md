# codex 사전검증 — manuscript-verify (2026-07-07)

**결론: 조건부 승인** (codex gpt-5.5, xhigh, read-only). 방향(비차단·온디맨드·비파괴)은 기존 11단계와 정합. 구현 전 3개 조건 반영 필요.

## 조건 (계획 반영 대상)

### 조건 1 — 파이프라인 비침투 (Task 5·4)
- "3.5단계"는 **문서상 개념 위치로만** 둔다. `status.md` **열/필수 선행조건/하드 게이트/11단계 파이프라인 표에 넣지 않는다**(→ `scripts/check_visual_gate.py`와 충돌 방지).
- 갱신 범위는 **트리거 라우팅 + 원고확정 직후 선택 권유**로 제한. `status.md` 기록은 표가 아니라 **산출물 인덱스/정보성 라인**에만.

### 조건 2 — 추출기 경계 명확화 (Task 3·4)
- 결정적 추출기는 `manuscript_grammar` 기반 **구조 후보 텍스트만**(Screen `핵심 정의`, Narration, Source) 뽑는다. **원자 주장 분해·claim_type 판정은 검증 단계(스킬 LLM)**로 분리.
- `Easy analogy`는 **필드 자체를 안 읽어** 1차 배제(추출기). Narration 속 비유성 문장은 **2차 필터(distill 단계)**로 배제. "Easy analogy 제외"만으로 부족.
- 추출기에 **비유 배제 테스트** 추가(analogy 필드 텍스트가 후보에 안 들어감).

### 조건 3 — 오탐 억제 강화 (Task 4: verdict 기준·리포트·검증자 프롬프트)
- **반박(high)**은 공식 문서·버전 맥락이 **직접 충돌**할 때만. 출처 없음/버전 불일치/표현 애매 → **검증불가**.
- **Source 부실 분리**: 주장은 맞지만 Source만 부실 → `지지 + Source 보완 필요`(=`source_supports: false`), **조치 대상 반박 아님**. "주장 반박"과 별도 분류.
- **버전/설정값 주장**은 course/chapter **대상 버전(target_version)과 근거 버전(evidence_version)을 함께 기록**.

## 비고
- Pandoc/외부 도구 미실행 — 설계·정합성 수준 검토. 구현 Task의 pytest(추출기)와 드라이런(Task 6)이 실증.
