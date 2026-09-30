# 판서 녹화 · 클릭 재생 (엔진 v4)

강의 **전에** 판서를 미리 그려 두고 저장한 뒤, 강의 **중에는** 클릭할 때마다 그 판서가
한 구간씩 **실제로 그렸던 속도로 다시 그려지게** 하는 기능. panseo-board / panseo-slide 두 템플릿의
엔진(`<script>`)에 똑같이 들어 있다.

## 워크플로 (강사)

1. **그리기(녹화)** — 판서를 재생할 **바로 그 HTML**(panseo-slide 결과물 또는 판서보드)을 열고,
   재생하고 싶은 슬라이드(또는 `b` 칠판)에서 평소처럼 그린다. 별도의 녹화 버튼은 없다 — 모든 획에
   시간(ms)이 자동으로 기록된다. 지우개·이동·되돌리기로 다듬은 **최종 결과**가 저장된다
   (획별 원래 그린 시각은 유지).
   - **구간 나누기 = 손 멈추기**: 한 번의 클릭으로 보여줄 덩어리를 다 그린 뒤 **1초 이상 쉬고**
     다음 덩어리를 그린다. 1초 미만 간격의 획들은 한 구간으로 묶인다.
2. **저장** — 툴바 `💾`(또는 `k`) → `<제목>_slideN.ink.json` 다운로드.
   `Shift+💾`(또는 `Shift+K`) → 같은 내용을 표준 **InkML**(`.inkml`)로.
3. **박아 넣기** — 슬라이드 HTML에 클립을 인라인으로 넣는다(파일 하나로 배포, `file://`에서도 동작):
   ```
   python .claude/skills/panseo-slide/scripts/embed_ink.py outputs/07_판서/chNN.html 다운로드/덱_slide3.ink.json
   #  --slide N (기본: 저장할 때 슬라이드) · --layer slide|board · --pause 1500 (구간 기준 ms) · -o 다른파일.html
   ```
   같은 슬라이드·레이어에 다시 넣으면 교체된다. 여러 슬라이드면 파일마다 한 번씩 실행.
   - 빠른 확인용: 저장한 파일을 브라우저 화면에 **끌어다 놓으면** 현재 슬라이드에 임시로 붙는다
     (새로고침하면 사라짐).
4. **강의(재생)** — 클립이 있는 슬라이드에 들어가면 좌상단에 `▶ 재생 0/N`이 켜지고 재생 모드가 된다.
   | 동작 | 결과 |
   |---|---|
   | 화면 클릭 · `→` · `PageDown` · `Space` (프레젠터 리모컨 포함) | 다음 구간을 실제 속도로 그린다 |
   | 그리는 중에 한 번 더 | 그 구간을 즉시 완성 |
   | 모든 구간 끝난 뒤 `→`·클릭 | 다음 슬라이드 |
   | `←` · `PageUp` | 마지막 구간 되돌리기 → 다 되돌리면 이전 슬라이드 |
   | 색 스와치 · 지우개 · 선택 · 이동 · 형광펜 | 재생 모드 해제(재생된 판서 위에 덧그리기·지우기 가능) |
   | `▶` 버튼 · `p` | 재생 모드 켜기/끄기 (펜 모드여도 `→`·`Space`는 계속 다음 구간) |

   녹화 때와 화면 크기가 달라도 비율을 유지해 가운데 맞춰 그린다(녹화 w·h 기준 균등 스케일).
   **녹화·강의를 같은 화면 비율(가급적 같은 해상도, 전체화면)** 로 하면 슬라이드 글자와 판서 위치가 정확히 맞는다.
   라이트 슬라이드에서는 흰 펜이 안 보이니 검정·빨강·파랑 등으로 녹화한다.

## 파일 포맷

### `.ink.json` (기본, `format: "panseo-ink"`)
```json
{"format":"panseo-ink","version":1,"w":1280,"h":720,"layer":"slide","slide":3,"pauseMs":1000,
 "strokes":[{"color":"#ff5c6e","size":4,"hl":false,"pts":[[x,y,pressure,t],...]}, ...]}
```
- `w,h` = 녹화 당시 화면(CSS px). `slide` = 1부터. `layer` = `slide` | `board`(판서모드 칠판).
- `pts` = `[x, y, 필압 0~1, t(ms, 첫 점=0)]`. 획은 시작 시각 순.
- `pauseMs` = 구간 분할 기준. 앞 획이 끝나고 다음 획 시작까지 이 값 이상 쉬면 새 구간.
  같은 구간 안의 획 사이 대기는 재생 시 최대 300ms로 줄인다.

### `.inkml` (W3C InkML, 호환용)
`traceFormat` 채널 `X Y F T`, 색·굵기는 `<brush>`(`color`, `width`; 형광펜은 `transparency` +
`panseo-highlighter`), 메타(w,h,layer,slide,pauseMs)는 `<annotation type="panseo-ink">`에 JSON.
다른 도구에서 만든 InkML도 읽는다 — `T` 채널이 없으면 점당 12ms·획 사이 400ms로 시간을 합성한다
(그러면 모든 획이 한 구간이 되므로, 구간이 필요하면 panseo 엔진에서 다시 그려 저장한다).

### HTML 인라인 클립
```html
<!-- ===================== STEPS END ===================== -->
  <script type="application/json" class="ink-clip" data-slide="3" data-layer="slide">{...ink.json...}</script>
```
엔진 `<script>`보다 **앞**(STEPS END 바로 뒤)에 있어야 로드 때 읽힌다. `embed_ink.py`가 이 규칙대로 넣는다.
`board` 클립은 그 슬라이드에서 `b`로 칠판을 켰을 때 재생된다.

## 엔진 내부 (참고)
- 점 모델 `{x,y,p,t}` — `pos(e)`가 `e.timeStamp`를 `t`로 기록. 이동(`commitFloat`)·지우개(`applyErase`)는 `t`를 보존,
  도형 스냅으로 새로 생긴 점은 원래 획(들)의 시작~끝 시각을 선형 보간(`retime`).
- `inkData()` → 현재 레이어 직렬화, `toInkML()`/`fromInkML()` 변환, `chunkify()` 구간 분할,
  `clips['slide:N'|'board:N']` = `{data, chunks, played, added}`.
- 재생된 획은 일반 획으로 레이어에 들어가므로 지우개·이동·Undo와 호환된다. `←`는 해당 구간에서 추가한 획 객체만 뺀다.
- 테스트 훅: `window.panseoInk`(`state()`, `advance()`, `retreat()`, `finish()`, `chunkify()` 등).
