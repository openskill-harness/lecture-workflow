---
name: pub-d2-diagram
description: D2 소스를 모노톤 도형 PNG/SVG로 렌더하는 opt-in 폴백 엔진. visual-assets가 원고 `주 시각자료: D2` 마커 슬라이드에서만 스크립트로 호출한다. 기본 시각자산은 GPT 이미지이므로 자동선택 대상이 아니다.
model: claude-sonnet-4-6
---

# D2 다이어그램 빌드 스킬

## 하는 일

D2 언어로 다이어그램을 작성하고, O'Reilly 모노톤 스타일로 PNG를 생성합니다.

## 디자인 규칙

### 색상 (3종류만 사용)

| 스타일 | fill | stroke | 용도 |
|--------|------|--------|------|
| **진한 회색** | `#f0f0f0` | black | 입력/시작점 (질문, 문서, 사용자) |
| **화이트** | `white` | black | 처리/결과 노드 (LLM, 에이전트, 변환, 답변) |
| **점선** | `white` | black + stroke-dash: 4 | 문제/불확실 (환각, 오류) |

### 특수 노드

| 노드 | shape | fill | 용도 |
|------|-------|------|------|
| DB | cylinder | `#eeeeee` | 데이터베이스 |
| 분기점 | diamond | white | 라우터, 파서 선택 |
| 핵심 분기 | hexagon | white + stroke-width: 2 | QueryRouter 등 중요 분기만 |
| 컨테이너 | rectangle | transparent + stroke-dash: 5 | Phase, 그룹 |

### 공통 스타일

- `border-radius: 8` — 모든 사각형 노드
- `direction`: **`right`(가로) 또는 `down`(세로) 중 다이어그램에 맞게 명시**. 노드가 3개 이하로 갈라지는 분기형은 `right`, 4개 이상 선형(체인)은 `down`이 종횡비(≤3:1)에 유리하다. dagre는 어느 방향이든 라벨을 깨끗이 배치한다.
- 화살표 색상: `style.stroke: "#222222"` (인라인 지정)
- **레이아웃: dagre (`--layout dagre`)** — ELK 금지. ELK는 엣지 라벨을 연결선/노드 위에 공간 예약 없이 얹어 **라벨-선 겹침·라벨-노드 겹침·글자가 도형 밖으로 넘침**을 유발한다. dagre는 엣지 라벨을 공간 예약 요소(가상 노드)로 취급해 라벨이 선/노드와 겹치지 않고, 노드에 텍스트 여백이 확보된다. (디버그 근거: `docs/history/2026-07-06_d2-layout-debug/debug-note.md`)

### 01번 전용 (classes 시스템)

```d2
classes: {
  phase: { shape: rectangle; style: { fill: transparent; stroke: black; stroke-width: 2; border-radius: 8; stroke-dash: 5; font-size: 16 } }
  question: { shape: rectangle; style: { fill: "#f0f0f0"; stroke: black; stroke-width: 1; border-radius: 8; font-size: 14 } }
  llm: { shape: hexagon; style: { fill: white; stroke: black; stroke-width: 2; font-size: 15; shadow: true } }
  hallucination: { shape: rectangle; style: { fill: white; stroke: black; stroke-width: 1; border-radius: 8; stroke-dash: 4 } }
  orchestrator: { shape: rectangle; style: { fill: white; stroke: black; stroke-width: 1; border-radius: 8 } }
  retriever: { shape: rectangle; style: { fill: white; stroke: black; stroke-width: 1; border-radius: 8 } }
  db: { shape: rectangle; style: { fill: "#eeeeee"; stroke: black; stroke-width: 1; border-radius: 8 } }
  answer: { shape: rectangle; style: { fill: white; stroke: black; stroke-width: 2; border-radius: 8 } }
}
```

## 빌드 파이프라인

D2 → SVG → 색상 치환(흑백) → PNG

```bash
# 1. D2 → SVG (dagre 레이아웃, 테마 없음)
d2 --layout dagre --pad 40 input.d2 output.svg

# 2. 테마 잔여 색상 → 흑백 치환
sed -e 's/#0D32B2/#222222/g' \
    -e 's/#F7F8FE/#FFFFFF/g' \
    -e 's/#EDF0FD/#FFFFFF/g' \
    -e 's/#E3E9FD/#FFFFFF/g' \
    -e 's/#EEF1F8/#FFFFFF/g' \
    -e 's/fill:url(#streaks-bright[^)]*)/fill:#FFFFFF/g' \
    -e 's/fill:url(#streaks-darker[^)]*)/fill:#FFFFFF/g' \
    -e 's/fill:url(#streaks-normal[^)]*)/fill:#FFFFFF/g' \
    -e 's/fill:url(#streaks-dark[^)]*)/fill:#FFFFFF/g' \
    output.svg > output_mono.svg

# 3. SVG → PNG (144 DPI)
rsvg-convert -d 144 -p 144 output_mono.svg -o output.png

# 4. 정리
rm output.svg output_mono.svg
```

## 일괄 빌드

```bash
cd projects/사내AI비서_v2/assets/diagrams
./build_diagrams.sh
```

## 의존성

| 도구 | 설치 | 용도 |
|------|------|------|
| d2 | `brew install d2` | D2 → SVG 컴파일 |
| rsvg-convert | `brew install librsvg` | SVG → PNG 변환 |

## 다이어그램 목록

| 파일 | 챕터 | 내용 |
|------|------|------|
| 01_rag-comparison | CH01 | LLM 단독 vs RAG 비교 |
| 02_api-restaurant | CH02 | API = 웨이터 비유 |
| 03_parser-pipeline | CH03 | 파서 → 청킹 → 벡터DB |
| 04_parser-dispatch | CH04 | 확장자별 파서 분기 |
| 05_rag-qa-flow | CH05 | RAG Q&A 흐름 |
| 05_lcel-pipeline | CH05 | LCEL 파이프 연결 |
| 06_tool-vs-mcp | CH06 | @tool vs MCP 비교 |
| 06_agent-architecture | CH06 | QueryRouter + ReAct |
| 06_sequence-crud | CH06 | CRUD 시퀀스 |
| 09_ch08-vs-ch09 | CH09 | 검색 전/중/후 비교 |
| 09_sequence-pipeline | CH09 | 전체 파이프라인 시퀀스 |

---
## 하네스 통합 (강의 제작 하네스 전용, v1.10)
- 원고 북 빌드의 도형 렌더는 `scripts/render_md_diagrams.py <원고.md> <images_dir> <접두사>` 사용 (dagre + 모노톤 치환, SVG까지 — 원고 계약이 SVG 병기라 PNG/rsvg-convert 불사용).
- 원고 d2 블록은 위 "디자인 규칙"(3색 모노톤·classes·direction right|down)을 따른다 — script-agent 계약은 lecture-harness content-rules (f) 참조.
- Windows: d2는 `C:\Program Files\D2\d2.exe` (brew 지침은 macOS용).

### Windows 렌더 — PNG 변환 (rsvg-convert 부재 시 정식 경로)

Windows에는 `rsvg-convert`가 없다. `visual-assets`/`pub-d2-diagram` 파이프라인이 PNG(슬라이드·책 임베드용)를 필요로 할 때는 아래 **headless Chromium(playwright) 스크린샷 폴백을 즉흥 수단이 아니라 정식 경로로** 쓴다(`ch01-d2-manifest.md` 파일럿에서 실제로 검증된 방식과 동일).

1. `d2.exe --layout dagre --pad 40 input.d2 output.svg` (위 "빌드 파이프라인" 1단계와 동일)
2. sed 규칙(위 §"빌드 파이프라인" 2단계 — 0D32B2→222222, F7F8FE/EDF0FD/E3E9FD/EEF1F8→FFFFFF, `streaks-*` fill→FFFFFF)을 SVG에 그대로 적용.
3. **PNG 변환(고정 값)**: playwright(Python 또는 Node) `chromium.launch()` → `page.goto(f"file:///{svg_path}")` (또는 SVG를 `<img>`로 감싼 임시 HTML을 만들어 로드) → `page.screenshot(path=out_png, omit_background=True)`.
   - **뷰포트**: SVG 자체의 `width`/`height`(또는 `viewBox`) 값을 그대로 뷰포트 크기로 설정한다(`page.set_viewport_size({"width": w, "height": h})`) — 임의 고정 해상도(예: 1920×1080)로 잘라내지 않는다.
   - **device scale factor**: `2`(레티나/고해상도 인쇄 대비 — `browser.new_context(device_scale_factor=2)`).
   - **배경**: 투명 배경 고정 — `page.screenshot(..., omit_background=True)` 사용, HTML 래퍼를 쓸 경우 `body { background: transparent }`도 명시(이중 안전장치).
4. 임시 `.d2`/`.svg`/(HTML 래퍼) 파일은 정리한다.
5. 산출물 파일명은 소비 계약(`assets/diagrams/{chNN}-slide{NN}-{요지}.png` — 슬라이드 번호 포함, `courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` 등 기존 실사례 참고)을 따른다. **주의**: `render_md_diagrams.py`는 파일 내 D2 블록 등장 순서로 `{접두사}-d{i}.svg`를 명명한다(슬라이드 번호 기반이 아니다) — PNG 변환 시 원고 순서와 대조해 슬라이드 번호를 붙여 리네임해야 `visual-assets`의 manifest 빌더(`build_asset_manifest.py`)가 `assets/diagrams/{chNN}-slide{NN}-*.png` 글롭으로 찾을 수 있다.

### 종횡비 가이드 — 3:1 권장 (자동 재배치 아님)

D2 다이어그램은 슬라이드(16:9)·책 페이지에 임베드되므로 **가로:세로 3:1 이내**를 권장한다. `direction: right`(가로 흐름)는 노드 수가 많아지면 가로로 계속 늘어나 극단적으로 납작해질 수 있다(파일럿 실패 사례: 일부가 ~9:1~19:1까지 늘어나 글자가 안 보임). 선형(체인) 다이어그램은 `direction: down`으로 두면 세로로 흘러 종횡비가 개선된다 — dagre라 세로여도 라벨 겹침이 없다.

- **hard fail이 아니라 warning + 수정 지침**이다 — 렌더 자체를 실패시키지 않는다. 자동 재배치는 하지 않는다(레이아웃 판단은 사람이 한다).
- 렌더 후 SVG/PNG의 실제 너비/높이를 확인해 종횡비를 계산한다. 3:1을 넘으면 아래 중 하나로 원고 D2 소스를 고치도록 사용자에게 안내한다:
  - `direction: down`(세로 흐름)으로 전환.
  - 노드를 논리적 그룹으로 묶어 여러 행으로 래핑(컨테이너 노드 + 그룹별 `direction` 분리).
- 종횡비 초과를 방치한 채 슬라이드/책에 그대로 임베드하지 않는다 — `visual-assets` 스킬의 D2 렌더 단계(§3)에서 이 경고를 받으면 재생성 전 사용자 확인을 거친다.
