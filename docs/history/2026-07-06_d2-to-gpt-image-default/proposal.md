# 제안: 시각자산 기본값 D2 → GPT 이미지 전환 (D2는 opt-in 폴백)

## 1. 배경 / 문제
- 현행 `build_asset_manifest.py`는 슬라이드에 D2 블록이 있으면 D2를 무조건 주 시각자료로 삼고, 같은 슬라이드의 GPT 이미지를 `status: deferred, primary: false`로 강등한다(현재 코드 105~120행).
- ch01 파일럿 결과 다이어그램 성격 슬라이드도 GPT 일러스트가 덱 전체와 톤이 일관되고 사용자 선호가 확인됐다(ch01 5개 D2 슬라이드 교체판 채택).
- 따라서 기본값을 뒤집어야 한다: **GPT 이미지가 기본 주 시각자료, D2는 명시 opt-in일 때만 주 시각자료.**

## 2. 제안
- **A. manifest 빌더 로직 역전**: 이미지 프롬프트가 있으면 이미지가 primary가 기본. D2는 원고 Visual asset 필드에 `주 시각자료: D2`(또는 `Primary asset: D2`) 마커가 있거나, 이미지 프롬프트가 아예 없을 때만 primary.
- **B. D2 엔진(pub-d2-diagram) 유지**: 삭제하지 않는다. opt-in 폴백 엔진으로 남긴다. 파괴적 변경 최소화, 되돌리기 용이.
- **C. 소비 스킬 계약**: 소비 스킬은 슬라이드별 manifest `primary` 자산을 임베드한다(이미지 primary면 이미지, D2 primary면 D2).
- **D. 문서 동기화**: visual-assets/manuscript-schema/각 소비 스킬 SKILL.md/CLAUDE.md 갱신.
- **E. ch01 적용**: 05·08·10·15·20 슬라이드를 GPT 이미지로 재생성, 전 소비물 재빌드, 재확정.

## 3. 하위호환 / 리스크
- 기존 D2-only 슬라이드(이미지 프롬프트 없음)는 여전히 D2 primary로 동작 → 회귀 없음.
- 이미지 프롬프트 + D2 둘 다 있고 이미지가 아직 생성 안 된 슬라이드는 이제 `deferred`가 아니라 `missing`으로 뜬다(하드 게이트가 올바르게 막음). 이는 의도된 강화다.
- opt-in 마커가 붙은 기존 원고가 없으므로 마커 도입에 따른 회귀 없음.

## 4. 반영 순서
Phase B(빌더+테스트) → Phase C(문서) → Phase D(ch01 재빌드).
