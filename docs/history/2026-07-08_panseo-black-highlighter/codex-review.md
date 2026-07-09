결론: 조건부승인 (조건 5건 + 자체발견 3건 반영)

codex gpt-5.5, read-only, 2026-07-08.

codex 조건:
1. 선택/이동 hit-test·bbox가 `size`만 보면 형광폭과 불일치 → `effW(s)=s.hl?HL_W(s.size):s.size` 도입해 pickStroke 허용오차·bboxOf 여백에 반영.
2. drawStroke save/restore 대체는 destination-out에도 안전하되, composite 설정+stroke가 같은 save/restore 안·조기 return 없이. → hl 브랜치는 draw 후 restore+return, erase는 else 브랜치 안에서 처리(조기 return 없음).
3. 두 템플릿 `<script>` 바이트동일 유지 → panseo-slide 편집·검증 후 그 `<script>`를 panseo-board에 복사, diff로 동일 게이트.
4. 상호배타는 상태만 갱신(클릭 핸들러 재호출 금지) → setHighlight/setEraser는 서로의 set*만 호출(핸들러 아님), on-path에서만, 무한재귀 없음.
5. 회귀 점검: 라이브 preview는 per-segment, release 시 render()로 단일 alpha 정리 / undo는 스냅샷 복원 후 render()라 alpha 누적 없음 / 선택박스는 effW 반영 / 스냅 생략 시 holdArm 미호출 → holdAt null → holdTrack no-op, pointerup에서 holdCancel.

자체 발견(형광펜 hl 플래그 보존):
6. applyErase 분할 stroke에 hl 유지(안 하면 지운 뒤 형광이 불투명펜으로 변함).
7. commitFloat 재구성 stroke에 hl 유지(이동 후 형광 유지).
8. clusterFrom(도형 스냅 클러스터)에서 hl 제외(형광이 도형으로 오인식 방지).
