# 판서 엔진에 검정 펜 + 형광펜 추가

- 날짜: 2026-07-08
- 대상: panseo-slide·panseo-board 엔진(두 템플릿 `<script>` 바이트 동일) + 각 스킬 문서
- 유형: 엔진 기능 추가(R2 append)

## 요청 / 문제

판서 시 (1) 라이트 슬라이드 배경에 잘 보이는 **검정 펜**과 (2) 글자 위에 색을 덧칠하는 **형광펜(반투명 굵은 마커)**이 필요하다. 현재 스와치는 흰/노/파/빨/초 5색뿐이고 형광펜 모드가 없다. 특히 판서를 라이트 테마로 통일한 뒤 흰 펜이 라이트 배경에서 저대비라 검정 펜이 요긴하다.

## 근거(현재형)

- 두 스킬 엔진 `<script>`는 바이트 동일(22467자, diff 확인) — 동일 편집을 양쪽에 적용하면 된다.
- 툴바 HTML(스와치 5 + boardBtn/gridBtn/snapBtn/sizes/selBtn/moveBtn/eraser/undo/clear)도 두 파일 동일 — 스와치·버튼 삽입 지점이 공통.
- stroke 객체는 `{color,size,erase,pts}`. 형광펜은 `hl` 플래그만 더하면 렌더·선택·지우개·되돌리기와 자연히 호환된다(추가 데이터 모델 불필요).

## 제안

**검정 펜**: 스와치 행 끝(초록 뒤)에 `<div class="swatch" style="background:#1a1f2e" data-c="#1a1f2e"></div>` 추가. 기존 스와치 클릭 핸들러가 `color`를 세팅하므로 JS 변경 없음.

**형광펜**: 툴바에 `🖍 형광펜` 토글 버튼(`id="hlBtn"`) 추가 + 엔진 JS 5곳:
1. 상태·상수: `let highlighting=false; const HL_ALPHA=0.32; HL_W(sz)=max(16, sz*4.5)`.
2. `drawStroke`: `s.hl`이면 반투명(alpha)·굵게·단일 path로 렌더(각 획을 한 번에 그려 이음새 이중겹침 방지), 나머지는 기존 로직. save/restore로 상태 격리.
3. `pointerdown`: `curStroke.hl=highlighting`; 형광펜이면 도형 스냅 arm 생략(`if(!highlighting) holdArm`).
4. `pointermove` 라이브 세그먼트: 형광펜이면 alpha·굵게, 아니면 기존.
5. `pointerup`/`endStroke`: 형광 획이면 release 시 render() 1회로 이음새를 단일 alpha로 정리.
6. 버튼 핸들러 `setHighlight(on)` + 상호배타: 형광펜 켜면 지우개·선택·이동 해제, 지우개/선택/이동 켜면 형광펜 해제. 색 스와치 변경은 형광펜 유지(형광펜 색 선택).

## 범위

- 두 템플릿 파일 모두 편집(엔진 동일). panseo-board는 다크 배경이라 검정 펜은 저대비지만 사용자 요청대로 추가(선택은 사용자 몫).
- 문서: `panseo-slide/reference/engine.md`(기능 목록에 형광펜 추가), `panseo-slide/SKILL.md` 확정 체크리스트(엔진 기능 7종→형광펜 포함 8종), `panseo-board/reference/tools.md`(도구 목록에 검정·형광펜 추가).

## 회귀 위험

- 엔진 `<script>` 편집이므로 `node --check` + 브라우저 실동작(검정 그리기·형광펜 반투명·기존 7기능 무회귀) 검증 필수.
- save/restore 도입으로 기존 `globalCompositeOperation` 수동 리셋을 대체 — 지우개(destination-out) 경로도 save/restore 안에서 정상인지 확인.
- 두 파일 편집 후 `<script>` 여전히 바이트 동일 유지(같은 편집).
