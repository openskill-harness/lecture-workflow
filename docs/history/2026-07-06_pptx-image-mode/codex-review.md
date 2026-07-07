# codex 검토: pptx-build 이미지 모드 제안서

- 날짜: 2026-07-06
- 대상 제안서: `docs/proposals/2026-07-06_pptx-image-mode.md`
- 방식: `codex exec --sandbox read-only` (stdin 닫음), 실제 파일 대조 검토
- 독립 재검증: codex가 직접 카운트 — 원고 26 / preview 26 / 렌더 PNG 26 / PPTX 26, 전 슬라이드 단일 풀블리드, 노트 26/26, PNG 2560×1440 확인.
- 종합: **이미지 모드 방향 건전, 구현·하위호환 확인.** 계약 강제와 문서 정합만 보완 권고.

## 지적 사항 및 조치

| # | 심각도 | 지적 | 조치 |
|---|---|---|---|
| 1 | 중요 | 슬라이드 수 불일치가 코드에서 hard fail이 아니라 stderr 경고뿐 → drift가 산출물에 박제 | ✅ 반영: 이미지 모드 기본 불일치 시 `SystemExit`, `--allow-count-mismatch`로만 완화 |
| 2 | 중요 | SKILL.md 프론트매터/참고에 "HTML 프리뷰 다시 파싱 안 함/소비 안 함" 문구가 이미지 모드와 모순 | ✅ 반영: "이미지 모드=preview 렌더 소비, 네이티브 모드만 원고 직접 파싱"으로 정정 |
| 3 | 중간 | 렌더러 16:9가 preview CSS(`aspect-ratio`)에 의존 — override가 강제 안 함 | ✅ 반영: override에 `aspect-ratio:16/9!important; height:calc(...)!important` 추가 + 렌더 후 PNG 크기 검증 |
| 4 | 중간 | 한글 폰트 이식성 미검증(`networkidle`이 폰트 준비 보장 안 함) | ✅ 반영: `document.fonts.ready` 대기 추가. CI/서버는 Noto Sans CJK 설치 필요(문서 주석) |
| 5 | 낮음 | `build_pptx` 출력 디렉터리 미생성 — `pptx/` 없으면 save 실패 | ✅ 반영: `out_path.parent.mkdir(parents=True, exist_ok=True)` 추가 |

## 원문 검토 요지

> 다만 "계약"이라고 부른 부분 중 핵심인 슬라이드 수 일치가 코드상 hard fail이 아니라 사후 체크리스트에 가깝습니다. 이 부분을 빌드 단계에서 강제하고, SKILL.md의 남은 네이티브 전용 문구를 정리하면 제안서는 훨씬 안정적입니다.

→ 위 5건 전부 반영. 재검증: `python -m pytest scripts/test_build_pptx.py` 전건 통과 유지, ch01 재빌드 정상.
