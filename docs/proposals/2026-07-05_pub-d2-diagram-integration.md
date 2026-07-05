# pub-d2-diagram 하네스 연결 + 원고 다이어그램 재생성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사용자 제공 `pub-d2-diagram` 스킬(O'Reilly 모노톤 스타일)을 하네스의 원고 도형 파이프라인에 연결하고, L01~L03 원고의 d2 다이어그램 14개를 그 스타일로 재생성한다.

**Architecture:** ① 재사용 렌더 스크립트(md에서 d2 블록 추출 → ELK 레이아웃 → 모노톤 색 치환 → SVG)를 pub-d2-diagram 스킬에 추가 ② 하네스 규칙(content-rules (f)·script-agent·filmed pipeline 북 빌드)을 pub-d2-diagram 스타일·파이프라인으로 연결 ③ 원고 d2 블록을 "구조 보존·스타일 변환"으로 재작성 후 재렌더 — 노드/엣지 의미는 불변이라 스토리보드·슬라이드 시드 소비 계약에 영향 없음.

**Tech Stack:** d2 CLI 0.7.1 (`C:\Program Files\D2\d2.exe`, 설치됨) + ELK 레이아웃, Python 3.14 (블록 추출·색 치환 — sed 대체), pub-d2-diagram classes 시스템. rsvg-convert(PNG)는 **불사용** — 원고 계약이 SVG 병기라 불필요 (의존성 추가 0).

## Global Constraints

- **선반영 금지 원칙 준수**: Task 0(codex 사전 검증)을 통과해야 Task 1 이후 진행 (CLAUDE.md 변경 처리 원칙)
- **git 커밋 없음** — 사용자 미요청 (파일 저장까지만)
- 참고스킬/사용자 제공 스킬 원본 존중: `pub-d2-diagram/SKILL.md` 본문 무수정 — 추가는 `scripts/` 신설 + 말미 "하네스 통합" 섹션만
- 원고 발화 자수 불변 (d2 블록·SVG 라인은 비발화 — content-rules (f))
- d2 블록의 **노드/엣지 의미 구조 보존** (스타일만 변환) — 스토리보드 시드 소비 계약 유지
- 모노톤 3색 규칙: fill은 `#f0f0f0`(입력/시작) / `white`(처리/결과) / `#eeeeee`(DB·cylinder)만, 점선(stroke-dash: 4)=문제/불확실, `direction: right` 필수, 화살표 `stroke: "#222222"`
- **원고 SVG = 모노톤, 슬라이드 인라인 SVG = 라이트 토큰 유지 — 별개 산출물** (codex Task 0 확인: 충돌 없음. 스토리보드는 시드의 구조만 소비)
- d2 class 문법 (0.7.1 검증): `노드: "라벨" { class: x }` — `.class:` 접미 표기 금지
- 구 `direction: down` 3건(l01-d3, l02-d1, l02-d6)은 right 전환 후 **레이아웃 시각 검수** 필수 (해당 Task의 검증 스텝에 포함)

---

### Task 0: codex 사전 검증 (변경 처리 원칙)

**Files:**
- Create: `docs/reviews/2026-07-05_pub-d2-integration-codex-review.md` (검증 결과 기록)

- [ ] **Step 1: codex 사전 검증 실행** (Git Bash, stdin 닫기)

```bash
cd /c/Users/ssarm/Documents/course-haness && codex exec --sandbox read-only '너는 강의 제작 하네스의 구조 변경 사전 검토자다. 계획서 docs/proposals/2026-07-05_pub-d2-diagram-integration.md 를 읽고 검증하라 (사용자가 방식 확정 — pub-d2-diagram 스킬 연결 자체는 재론 금지, 설계 세부만). 추가로 읽을 것: .claude/skills/pub-d2-diagram/SKILL.md, .claude/skills/lecture-harness/references/content-rules.md (f)절, courses/spring-mvc-2026/images/l01-d1.d2 (현재 도형 표본). 검토: 1) SVG-only 파이프라인(PNG 생략)이 스킬 취지와 어긋나지 않는가, 2) 모노톤 3색 규칙이 라이트 슬라이드 rich 프로파일의 도형 색과 충돌하는가(슬라이드는 자체 SVG — 원고 SVG와 별개인지 확인), 3) 기존 14개 d2의 스타일 변환 시 깨질 수 있는 d2 문법(classes 미지원 구문 등), 4) 누락 연쇄, 5) blocker/warning/suggestion. 한국어 간결히.' </dev/null
```

- [ ] **Step 2: 결과 확인·기록** — blocker 있으면 계획 수정 후 재검증, 없으면 결과를 위 리뷰 파일에 저장 (지적/처리 표 형식 — 기존 리뷰 파일들과 동일 양식). Expected: blocker 0 또는 반영 가능한 조정안

---

### Task 1: 렌더 스크립트 생성 (`render_md_diagrams.py`)

**Files:**
- Create: `.claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py`
- Modify: `.claude/skills/pub-d2-diagram/SKILL.md` (말미에 "하네스 통합" 섹션 append — 본문 무수정)

**Interfaces:**
- Produces: `python .claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py <원고.md> <images_dir> <prefix>` → `{prefix}-d{N}.d2` + `{prefix}-d{N}.svg` (모노톤), stdout에 블록별 `rc`/검증 결과. Task 3~5가 이 명령을 그대로 사용.

- [ ] **Step 1: 스크립트 작성**

```python
#!/usr/bin/env python3
"""원고 md의 ```d2 블록 → ELK 레이아웃 + O'Reilly 모노톤 SVG (pub-d2-diagram 파이프라인)."""
import re, subprocess, sys, pathlib

D2 = r"C:\Program Files\D2\d2.exe"
MONO = [  # pub-d2-diagram SKILL.md의 sed 치환과 동일
    ("#0D32B2", "#222222"), ("#F7F8FE", "#FFFFFF"), ("#EDF0FD", "#FFFFFF"),
    ("#E3E9FD", "#FFFFFF"), ("#EEF1F8", "#FFFFFF"),
]
STREAKS = re.compile(r"fill:url\(#streaks-(?:bright|darker|normal|dark)[^)]*\)")
ALLOWED_FILLS = {"#f0f0f0", "white", "#eeeeee", "transparent", "#ffffff"}

def main(md_path, img_dir, prefix):
    md = pathlib.Path(md_path).read_text(encoding="utf-8")
    blocks = re.findall(r"```d2\n(.*?)```", md, re.S)
    img = pathlib.Path(img_dir); img.mkdir(exist_ok=True)
    fails = 0
    for i, b in enumerate(blocks, 1):
        if not b.strip():
            print(f"{prefix}-d{i}: FAIL 빈 d2 블록"); fails += 1; continue
        # 스타일 가드 (strict — 위반은 실패, codex Task0 처방)
        viol = []
        if "direction: right" not in b:
            viol.append("direction: right 누락")
        bad = [f for f in re.findall(r'fill:\s*"?([#\w]+)"?', b)
               if f.lower() not in ALLOWED_FILLS]
        if bad:
            viol.append(f"비허용 fill {bad}")
        if viol:
            print(f"{prefix}-d{i}: FAIL " + "; ".join(viol)); fails += 1; continue
        d2f = img / f"{prefix}-d{i}.d2"; svgf = img / f"{prefix}-d{i}.svg"
        d2f.write_text(b, encoding="utf-8")
        r = subprocess.run([D2, "--layout", "elk", "--pad", "40", str(d2f), str(svgf)],
                           capture_output=True, text=True)
        if r.returncode != 0:
            err = (r.stderr.strip().splitlines() or ["(stderr 없음)"])[-1]
            print(f"{prefix}-d{i}: FAIL {err}")
            fails += 1
            continue
        svg = svgf.read_text(encoding="utf-8")
        for src, dst in MONO:
            svg = svg.replace(src, dst)
        svg = STREAKS.sub("fill:#FFFFFF", svg)
        svgf.write_text(svg, encoding="utf-8")
        print(f"{prefix}-d{i}: OK (elk+mono)")
    print(f"blocks={len(blocks)} fails={fails}")
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2], sys.argv[3]))
```

- [ ] **Step 2: 실패 검증 (스크립트 동작 확인)** — 존재하지 않는 파일로 실행

Run: `python .claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py nope.md courses/spring-mvc-2026/images x`
Expected: FileNotFoundError (스크립트 로드·인자 처리 정상)

- [ ] **Step 3: 현행 원고로 렌더 확인** (스타일 변환 전 — 파이프라인만 검증)

Run: `python .claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py courses/spring-mvc-2026/scripts/L03.md courses/spring-mvc-2026/images l03`
Expected: `blocks=3 fails=0`, 각 블록 OK (WARN은 무방 — 구 스타일이라 direction/fill 경고 예상, Task 5에서 해소)

- [ ] **Step 4: SKILL.md 말미에 하네스 통합 섹션 append** (Bash heredoc — 본문 무수정)

```markdown
---
## 하네스 통합 (강의 제작 하네스 전용, v1.9)
- 원고 북 빌드의 도형 렌더는 `scripts/render_md_diagrams.py <원고.md> <images_dir> <접두사>` 사용 (ELK + 모노톤 치환, SVG까지 — 원고 계약이 SVG 병기라 PNG/rsvg-convert 불사용).
- 원고 d2 블록은 위 "디자인 규칙"(3색 모노톤·classes·direction: right)을 따른다 — script-agent 계약은 lecture-harness content-rules (f) 참조.
- Windows: d2는 `C:\Program Files\D2\d2.exe` (brew 지침은 macOS용).
```

---

### Task 2: 하네스 규칙 연결

**Files:**
- Modify: `.claude/skills/lecture-harness/references/content-rules.md` ((f)절 도형 행 + 북 빌드 절)
- Modify: `.claude/agents/script-agent.md` (원고=책 원칙의 d2 항목)
- Modify: `.claude/skills/filmed-lecture/references/pipeline.md` (북 빌드 단계 문구)
- Modify: `docs/harness-design-v1.md` (개정 이력 v1.9 행), `docs/harness-changelog.md` (append)

**Interfaces:**
- Consumes: Task 1의 렌더 명령
- Produces: script-agent가 따를 d2 스타일 계약 (Task 3~5의 재작성 기준)

- [ ] **Step 1: content-rules (f) 도형 행 교체** — 표의 "도형" 행 처리 칸을 다음으로:

```markdown
| **도형** | ` ```d2 ... ``` ` 코드블록(시드 원본 — 유지) **+ 바로 아래** `![도형 설명](../images/{파일}.svg)` 렌더 병기. **스타일: pub-d2-diagram 디자인 규칙 준수** — 3색 모노톤(`#f0f0f0` 입력/시작, `white` 처리/결과, `#eeeeee` DB), 점선=문제/불확실, `direction: right`, classes 시스템 권장 | 북 빌드 단계에서 `python .claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py` (ELK + 모노톤 SVG) |
```

- [ ] **Step 2: 북 빌드 절의 ② 항목 교체**

```markdown
② d2 블록 → `render_md_diagrams.py`로 ELK+모노톤 SVG 렌더 (pub-d2-diagram 파이프라인)
```

- [ ] **Step 3: script-agent.md d2 문구에 추가** — "도형은 ```d2``` 코드블록 + SVG 병기 라인" 뒤에: `(스타일: pub-d2-diagram 디자인 규칙 — 3색 모노톤·direction: right·classes, content-rules (f))`

- [ ] **Step 4: filmed pipeline.md 북 빌드 문구 교체** — "d2 → SVG 렌더 병기" → "d2 → pub-d2-diagram 파이프라인(ELK+모노톤) SVG 렌더 병기"

- [ ] **Step 5: quality-gates.md v1.9 게이트 추가** — "qa-agent 원고=책 검사 (v1.8)" 절의 d2 항목 아래에 추가: `- d2 스타일 게이트 (v1.9): 각 블록 direction: right / fill은 허용 3색(+transparent)만 / SVG에 테마색(#0D32B2·#F7F8FE·#EDF0FD·#E3E9FD·#EEF1F8)·streaks 잔존 0`

- [ ] **Step 6: 기록** — 설계 문서 개정 이력에 v1.9 행("pub-d2-diagram 스킬 연결 — 원고 도형 스타일·렌더 파이프라인 표준화, 사용자 제공 스킬") + harness-changelog append (양식은 기존 행과 동일)

- [ ] **Step 6: 검증** — `grep -r "render_md_diagrams" .claude/ | wc -l` ≥ 3 (content-rules·pub-d2 SKILL·pipeline), `grep "v1.9" docs/harness-design-v1.md` 1건

---

### Task 3: L01 다이어그램 재작성 + 렌더 (5개)

**Files:**
- Modify: `courses/spring-mvc-2026/scripts/L01.md` (d2 블록 5개 — 블록 내용만 교체, 발화·병기 라인 불변)
- 재생성: `courses/spring-mvc-2026/images/l01-d1~d5.{d2,svg}`

**Interfaces:**
- Consumes: Task 1 렌더 명령, Task 2 스타일 계약
- Produces: 모노톤 SVG 5개 (병기 라인 파일명 불변 — 원고 텍스트 수정 불요)

- [ ] **Step 1: 각 d2 블록을 모노톤 스타일로 재작성** — **노드 id·라벨·엣지 의미 보존**, 스타일만 변환. 매핑 규칙: 클라이언트/요청=`#f0f0f0`(입력) / 서블릿·컨트롤러·컴포넌트=`white`(처리) / 문제 상황(중복 코드 배지 등)=점선 / 그룹·Phase=transparent+stroke-dash 5 / `direction: right` 필수 / 화살표 `style.stroke: "#222222"`. 예 (l01-d1 중복 서블릿 문제 — 실제 재작성 시 기존 `images/l01-d1.d2`의 노드·라벨을 그대로 가져와 스타일만 적용):

```d2
direction: right
classes: {
  input: { shape: rectangle; style: { fill: "#f0f0f0"; stroke: black; stroke-width: 1; border-radius: 8 } }
  proc: { shape: rectangle; style: { fill: white; stroke: black; stroke-width: 1; border-radius: 8 } }
  problem: { shape: rectangle; style: { fill: white; stroke: black; stroke-width: 1; border-radius: 8; stroke-dash: 4 } }
}
client: "클라이언트" { class: input }
login: "LoginServlet\n인증·로깅 코드" { class: proc }
order: "OrderServlet\n인증·로깅 코드" { class: proc }
pay: "PayServlet\n인증·로깅 코드" { class: proc }
dup: "공통 코드 ×N 복제\n변경 어려움" { class: problem }
client -> login: "/login" { style.stroke: "#222222" }
client -> order: "/order" { style.stroke: "#222222" }
client -> pay: "/pay" { style.stroke: "#222222" }
```

- [ ] **Step 2: 렌더** — Run: `python .claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py courses/spring-mvc-2026/scripts/L01.md courses/spring-mvc-2026/images l01`
Expected: `blocks=5 fails=0`, WARN 0

- [ ] **Step 3: 검증** — 발화 자수 불변 확인 (d2는 비발화 — 블록 밖 텍스트 diff 0), 병기 라인 5개 파일명 불변, SVG 5개 갱신 타임스탬프

---

### Task 4: L02 다이어그램 재작성 + 렌더 (6개)

**Files:**
- Modify: `courses/spring-mvc-2026/scripts/L02.md` (d2 블록 6개)
- 재생성: `courses/spring-mvc-2026/images/l02-d1~d6.{d2,svg}`

절차·매핑·검증은 Task 3과 동일 (접두사 `l02`, Expected: `blocks=6 fails=0`, WARN 0). L02 특이점: l02-d4(계층 흐름)의 DB 노드는 `shape: cylinder; fill: "#eeeeee"`, l02-d5(오분류 wrong→right)의 wrong 측은 점선(problem) 클래스, l02-d6(판단 질문)의 분기점은 `shape: diamond; fill: white`.

- [ ] **Step 1: 재작성** (Task 3 매핑 규칙 + 위 특이점)
- [ ] **Step 2: 렌더** — Expected: `blocks=6 fails=0`
- [ ] **Step 3: 검증** — 발화 diff 0, 병기 6개 불변

---

### Task 5: L03 다이어그램 재작성 + 렌더 (3개)

**Files:**
- Modify: `courses/spring-mvc-2026/scripts/L03.md` (d2 블록 3개)
- 재생성: `courses/spring-mvc-2026/images/l03-d1~d3.{d2,svg}`

절차 동일 (접두사 `l03`, Expected: `blocks=3 fails=0`). L03 특이점: l03-d2(책임 이동 diff)의 step-03 뚱뚱한 컨트롤러 측은 점선(problem — "문제 상황" 의미), step-04 측은 white(해결), "블록 이사" 크로스 화살표 라벨 보존.

- [ ] **Step 1: 재작성** — 노드·크로스 화살표 의미 보존
- [ ] **Step 2: 렌더** — Expected: `blocks=3 fails=0`
- [ ] **Step 3: 검증** — 발화 diff 0, 병기 3개 불변, S8 실측값 등 본문 불변

---

### Task 6: 최종 검증 + 마무리

**Files:**
- Modify: `courses/spring-mvc-2026/artifacts.yaml` (헤더에 v1.9 도형 재생성 기록 1줄)

- [ ] **Step 1: 전체 검증 스크립트**

```bash
cd /c/Users/ssarm/Documents/course-haness && python - << 'EOF'
import re, pathlib
for L, n in [("l01",5),("l02",6),("l03",3)]:
    md = pathlib.Path(f"courses/spring-mvc-2026/scripts/{L.upper()}.md").read_text(encoding="utf-8")
    blocks = re.findall(r"```d2\n(.*?)```", md, re.S)
    assert len(blocks)==n, f"{L} 블록 수 {len(blocks)}!={n}"
    for i,b in enumerate(blocks,1):
        assert "direction: right" in b, f"{L}-d{i} direction 누락"
        svg = pathlib.Path(f"courses/spring-mvc-2026/images/{L}-d{i}.svg")
        assert svg.exists(), f"{svg} 없음"
        s = svg.read_text(encoding="utf-8")
        for c in ["#0D32B2","#F7F8FE","#EDF0FD","#E3E9FD","#EEF1F8","streaks-"]:
            assert c not in s, f"{L}-d{i} 테마색 잔존 {c}"
        bad = [f for f in re.findall(r'fill:\s*"?([#\w]+)"?', b)
               if f.lower() not in {"#f0f0f0","white","#eeeeee","transparent","#ffffff"}]
        assert not bad, f"{L}-d{i} 비허용 fill {bad}"
print("ALL PASS")
EOF
```

Expected: `ALL PASS`

- [ ] **Step 2: 마무리 기록** — artifacts.yaml 헤더에 `# v1.9 (2026-07-05): 원고 d2 14개를 pub-d2-diagram 모노톤 스타일로 재생성 (구조 보존·스타일 변환, ELK 레이아웃)` 추가

- [ ] **Step 3: 사용자 보고** — 재생성된 SVG 확인 경로 안내 (`scripts/L0x.md`를 뷰어로)

---

## Self-Review 결과

- **커버리지**: 요청 2건(스킬 연결=Task 1·2, 다이어그램 재생성=Task 3~5) 모두 태스크 존재. 하네스 원칙(사전 검증=Task 0, 기록=Task 2/6) 포함
- **플레이스홀더**: 없음 — 스크립트 전문·d2 예시·검증 코드 포함. Task 4·5의 "절차 동일"은 Task 3에 전체 코드가 있고 접두사·특이점을 명시했으므로 실행 가능
- **타입/이름 일관성**: `render_md_diagrams.py <md> <images_dir> <prefix>` 시그니처가 Task 1 정의·Task 3~5 사용에서 동일. 파일명 규칙 `{prefix}-d{N}` 일관
