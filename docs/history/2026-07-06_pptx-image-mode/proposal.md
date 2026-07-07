# 제안서: pptx-build 이미지 모드(ppt_preview 렌더 → 풀블리드 PPTX) 기본화

- 날짜: 2026-07-06
- 상태: ✅ codex 사전검증 완료(`docs/reviews/2026-07-06_pptx-image-mode-codex-review.md`) → 지적 5건 전부 반영 → 확정
- 계기: 사용자 관찰("PPTX 빌드가 제대로 안 나온다. ppt_preview는 잘 나왔으니 그 그림 그대로 떠서 옮기는 게 낫지 않냐") + systematic-debugging으로 원인 규명 후 방식 전환 결정(사용자 선택: 이미지 방식)

## 1. 배경 — 현재 문제 (증거)

`scripts/build_pptx.py`의 **네이티브 모드**(원고 직접 파싱 → 텍스트 상자 + 이미지 조립)에 두 층위의 문제가 있었다.

1. **Screen 필드 매핑 버그(수정 완료)**: 슬라이드 제목을 `## Slide N. <마커>` 헤더 단어(`표지`, `본문`…)로 쓰고, 본문에 `관련 학습목표:`·`핵심 정의:`·`화면:` 같은 메타/연출 지시 라벨을 그대로 덤프했다. 실제 표시 제목인 Screen `- 제목:`은 오히려 버려졌다. → `_screen_title_body()` 도입으로 제목=`제목:` 값, 본문=`짧은 문구`/`학습목표`/`학습내용` 내용 항목만으로 교정, 회귀 테스트 6건 추가.
2. **디자인 재현 한계(근본 한계)**: 매핑을 고쳐도 네이티브 조립 슬라이드는 승인된 `ppt_previews/chNN.html`의 카드/2단/코드에디터 목업 디자인을 재현하지 못한다. 미리보기는 사람이 검토·승인한 골든 산출물인데, PPTX가 그와 달라 "제대로 안 나온다"는 사용자 인식의 근본 원인.

## 2. 제안 — 이미지 모드를 기본으로

승인된 `ppt_previews/chNN.html`을 **단일 시각 원천**으로 삼아, 각 슬라이드(`.ppt-slide .ppt-canvas`)를 헤드리스 Chromium으로 렌더한 PNG를 PPTX 각 장의 **전체 배경**으로 넣고, 원고 Narration을 발표자 노트에 삽입한다. 미리보기와 픽셀 동일한 PPTX가 나온다.

### A. 렌더러 (`scripts/render_preview_slides.py`, 신규)
- Playwright(Chromium) 헤드리스로 `ppt_previews/chNN.html`을 열고, 캔버스를 정확한 16:9 풀블리드로 만드는 오버라이드 CSS(테두리·라운드·그림자·외부 여백 제거, 폭 고정)를 주입한 뒤 `.ppt-slide .ppt-canvas`를 슬라이드별 `slideNN.png`(기본 1280px 폭 × scale 2 = 2560×1440)로 렌더.
- 미리보기 HTML의 상대 자산 경로(`../assets/...`)가 유지되도록 원본 위치에서 렌더(복사본 렌더 금지).

### B. 빌더 (`scripts/build_pptx.py`, 함수/CLI 추가)
- `build_pptx_from_images(md_text, image_dir, out_path)`: `slideNN.png`를 좌상단 (0,0) + 슬라이드 전체 크기(13.333×7.5")로 배치, `parse_manuscript`의 Narration을 노트에 삽입.
- CLI `--from-images <dir>` 지정 시 이미지 모드, 미지정 시 기존 네이티브 모드(하위호환 유지).

### C. 방식 선택 원칙
- **기본 = 이미지 모드**. 이 파이프라인은 원고가 단일 원천이고 PPTX는 내보내기 결과물이라, PowerPoint에서 글자를 직접 편집할 일이 없어 편집 불가(그림)라는 단점이 실무상 비용이 낮다. 내용 수정은 원고 → 미리보기 재생성 → 재렌더 흐름.
- **네이티브 모드는 대안으로 유지**. 발표 직전 PPT에서 텍스트를 직접 고쳐야 하는 워크플로를 위해 코드·CLI·테스트를 그대로 남긴다.

### D. 계약/문서화
- `pptx-build` SKILL.md: 두 모드 명시, 이미지 모드를 기본 절차로, 검증 체크리스트에 "슬라이드 수 3중 일치(렌더 PNG=PPTX=preview 캔버스=원고 Slide)", "전 슬라이드 풀블리드", "미리보기 최신본 사용" 추가.
- **선행 의존 추가**: 이미지 모드는 `ppt_previews/chNN.html`(7단계) ✅를 입력으로 요구한다. 미리보기가 없으면 `ppt-preview` 선행 또는 네이티브 모드로 폴백.
- **후속 정리(본 제안에 포함)**: SKILL.md 프론트매터 description과 "참고"의 "HTML 프리뷰를 다시 파싱하지 않는다/소비하지 않는다" 문구는 이미지 모드 기본화와 모순되므로 "기본 이미지 모드는 preview를 렌더해 소비, 네이티브 모드만 원고 직접 파싱"으로 정정한다.

## 3. 대안 (기각 후보)
- **네이티브 레이아웃을 preview에 맞게 정교화**: 카드/2단/코드에디터 목업을 python-pptx 도형으로 재현 — 유지비 크고 디자인 드리프트 상존. 골든이 이미 HTML로 있는데 재구현은 중복. 기각(단, 편집 필요 시 대안 모드로 잔존).
- **미리보기 HTML을 통째로 PDF로 export 후 PPTX 변환**: 슬라이드 경계·노트 삽입 제어가 어렵고 종횡비 왜곡 위험. 슬라이드별 element 렌더가 더 정밀. 기각.
- **자산을 원고 프롬프트에서 다시 조립**: 이미 4단계 manifest/미리보기가 SSOT. 재조립은 재동기화 폭포 유발. 기각.

## 4. 영향 범위 / 되돌리기
- 영향: `scripts/render_preview_slides.py`(신규), `scripts/build_pptx.py`(함수/CLI 추가, 기존 네이티브 경로 불변), `scripts/test_build_pptx.py`(회귀 +7: 매핑 6 + 이미지 모드 1), `pptx-build` SKILL.md, 산출물 `courses/spring-boot-basic/assets/ppt_render/ch01/`(렌더 PNG 26) + `pptx/ch01.pptx` 재빌드.
- 신규 의존성: Playwright(Chromium) — 렌더 단계에서만 필요. 네이티브 모드는 무의존 유지.
- 되돌리기: 개별 커밋. `--from-images` 없이 실행하면 즉시 네이티브 모드로 회귀. 렌더 산출물은 파생물이라 삭제·재생성 안전.

## 5. 검증 기준
- 렌더: `.ppt-slide .ppt-canvas` 수 = 원고 `## Slide` 수 = 렌더 PNG 수. 각 PNG 2560×1440(16:9).
- 빌드: 전 슬라이드 이미지가 (0,0)+슬라이드 전체 크기 풀블리드, Narration 있는 슬라이드 전부 노트 존재.
- 육안: 대표 슬라이드(도식형·코드형)가 미리보기와 픽셀 동일.
- 회귀: `cd scripts; python -m pytest test_build_pptx.py -v` 전건 통과(현재 15/15).
- 실증: ch01 — 렌더 26/26, PPTX 26슬라이드 풀블리드 26/26 + 노트 26/26, 파일 24MB→18MB.
