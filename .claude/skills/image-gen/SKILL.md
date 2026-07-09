---
name: image-gen
description: "[IMAGE PROMPT] 플레이스홀더를 Codex(GPT) CLI 이미지로 자동 생성·교체하고, [PLOT SCRIPT]는 plot_gen.py(matplotlib 정확 좌표 플롯)로 렌더한다. visual-assets가 주 호출자. '이미지 생성' 시 로드."
---

# 이미지 자동화 스킬

## 로드 시점
- 챕터 집필 완료 후, `이미지 생성` 명령.

## 백엔드
- **Codex CLI**(구독 로그인, API 키 불필요). 헤드리스 호출: `node <npm-global>/@openai/codex/bin/codex.js exec --json --skip-git-repo-check -` (프롬프트 stdin). 평문 `codex exec "..."`는 non-TTY에서 실패.
- 생성 PNG는 `~/.codex/generated_images/{thread_id}/ig_*.png`에 저장됨(thread_id는 JSONL `thread.started`에서 파싱) → 스크립트가 플레이스홀더의 `path:`(project_root 상대)가 가리키는 곳으로 이동. 경로는 전적으로 `path:` 기준이며, 강의 하네스 표준 위치는 `courses/{id}/outputs/03_시각자산/images/chNN/`(호출자 visual-assets가 지정).

## 참고 이미지 (image-to-image)

플레이스홀더 블록에 `ref: <경로>` 한 줄을 넣으면 그 파일 경로를 프롬프트 앞에 세워 Codex가 읽는다 — 사용자가 준 손그림 스케치·참고 화면을 반영해 다시 그릴 때 쓴다. 별도 API 인자가 아니라 워크스페이스 파일 읽기다.

```
<!-- [IMAGE PROMPT: ch02-slide07]
A clean educational illustration of a factory method, no text, 16:9
ref: inbox/slide07-sketch.png
path: outputs/03_시각자산/images/ch02/slide07.png
-->
![ch02-slide07](placeholder.png)
```

`ref:`/`path:` 줄은 프롬프트 본문에서 제외된다. `ref:`가 없으면 기존과 동일하게 텍스트→이미지로 동작한다.

## 사용
```bash
# 한 챕터 처리
python .claude/skills/image-gen/scripts/image_gen.py <chapter.md> <project_root>
# 미리보기(생성 안 함)
python .claude/skills/image-gen/scripts/image_gen.py <chapter.md> <project_root> --dry-run
```
실패(헤드리스 불가) 시 플레이스홀더는 보존된다(manual 폴백).

## 두 갈래: 생성형(`[IMAGE PROMPT]`) vs 결정론(`[PLOT SCRIPT]`)

`image_gen.py`는 **생성형** 이미지(`[IMAGE PROMPT]`, 비유·정성 개념)만 처리한다.
**정확한 수식·좌표 그래프**(함수 곡선, 곡선 위의 점·화살표, 등고선)는 생성형이 곡선
연속성·점 위치를 보장 못 하므로(Ch.8 ex1이 깨진 이유), `[PLOT SCRIPT]` 플레이스홀더 +
**`plot_gen.py`**(matplotlib 결정론 실행)로 처리한다. 어느 갈래로 보낼지의 판정 기준은
`visual/references/image.md` §0(검산 기준).

```bash
# 정확한 그래프: [PLOT SCRIPT] 블록의 matplotlib 코드를 실행해 PNG 생성·교체
python .claude/skills/image-gen/scripts/plot_gen.py <chapter.md> <project_root>
python .claude/skills/image-gen/scripts/plot_gen.py <chapter.md> <project_root> --dry-run
```
- 코드 안에서 출력은 변수 `OUT`(절대경로)로 저장. 깜빡해도 러너가 현재 figure를 자동 저장.
- 한글 폰트(Malgun Gothic 등)·`unicode_minus=False`·`Agg` 백엔드는 러너가 미리 설정.
- 코드 오류 시 해당 플레이스홀더는 보존된다(다른 그림은 계속 처리).

> 한 챕터에 두 종류가 섞여 있으면 `image_gen.py`와 `plot_gen.py`를 **둘 다** 돌린다(서로 다른 태그만 건드리므로 순서 무관).

## 참조
- `scripts/image_gen.py` — `[IMAGE PROMPT]` 스캔/생성(Codex)/이동/교체
- `scripts/plot_gen.py` — `[PLOT SCRIPT]` 스캔/실행(matplotlib)/저장/교체
- `scripts/spike_codex.md` — S1 검증 결과(호출 방식)
