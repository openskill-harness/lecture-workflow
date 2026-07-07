# 원고 기술검증 에이전트(manuscript-verify) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 확정 원고(`manuscripts/chNN.md`)의 기술 주장을 외부 권위 문서 + Source 필드와 대조해 적대적으로 검증하고, 의심 주장을 근거부 리포트(`verification/chNN_verify.md`)로 내는 **비차단 온디맨드 스킬** `manuscript-verify`를 만든다(원고 자동 수정 없음).

**Architecture:** 결정적 후보 추출기(`scripts/extract_claim_candidates.py`, 원고→슬라이드별 정의/나레이션/Source JSON)가 검증 대상 후보를 뽑고, `manuscript-verify` 스킬(절차 문서)이 그 후보에서 원자적 기술 주장을 distill·분류(비유 제외)한 뒤 슬라이드 단위 검증 서브에이전트를 병렬 파견해(웹 리서치 + Source 교차확인 + 적대적 반박) 판정을 모아 리포트로 집계한다. 리포트는 "반박(조치)"과 "검증불가(사람 판단)"를 분리하며 원고를 수정하지 않는다.

**Tech Stack:** Python 3.14 + pytest 9.0.3(후보 추출기 TDD, 기존 `scripts/manuscript_grammar.py` 재사용), 서브에이전트 오케스트레이션 + WebSearch/WebFetch(검증), Git Bash on Windows 11.

## Global Constraints

- **하네스 구조 변경은 proposal + codex 사전검증 필수**: `docs/proposals/`에 계획서 → `codex exec --sandbox read-only '...' </dev/null`(Git Bash, stdin 닫고) → `docs/reviews/`에 결과 저장 후 반영 (CLAUDE.md 유지 규칙).
- **비차단·온디맨드**: 파이프라인 필수 관문이 아니다. 하드 게이트로 만들지 않는다(LLM 검증엔 오탐이 있으므로).
- **전제 게이트**: 대상 차시 `원고확정` ✅여야 실행. 미확정 원고는 검증하지 않는다.
- **원고 자동 수정 금지**: 이 스킬은 리포트만 만든다. 원고 수정은 사용자가 `manuscript-final`로 한다(SSOT 보호).
- **검증 근거**: 외부 권위 문서 웹 리서치(공식 도큐·MDN·RFC·프레임워크 문서) + 슬라이드 `Source` 교차확인. 적대적 검증(회의적 기본값, 근거 인용 없으면 "검증불가").
- **범위 가드**: 정의·프로토콜/표준 사실·API·버전만 검증. **비유(Easy analogy)·의견·서사 제외.**
- **리포트 분리**: "반박(조치 대상)"과 "검증불가(사람 판단)"를 분리. 파견 상한으로 미검증분은 리포트에 명시(침묵 절단 금지).
- **출력 경로**: `courses/{course-id}/verification/chNN_verify.md`. `status.md`엔 정보성 한 줄만.
- 스펙 출처: `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`.

---

## File Structure

- `docs/proposals/2026-07-07_manuscript-verify.md` — 제안서 (신규)
- `docs/reviews/2026-07-07_manuscript-verify-codex-review.md` — codex 사전검증 (신규)
- `scripts/extract_claim_candidates.py` — 원고→슬라이드별 검증 후보(정의/나레이션/Source) JSON (신규, `manuscript_grammar` 재사용)
- `tests/test_extract_claim_candidates.py` — 후보 추출기 TDD (신규)
- `.claude/skills/manuscript-verify/SKILL.md` — 검증 절차 스킬 (신규)
- `.claude/skills/manuscript-verify/references/report-template.md` — 리포트 포맷 규범 (신규)
- `.claude/skills/manuscript-verify/references/verifier-prompt.md` — 검증 서브에이전트 프롬프트 규범 (신규)
- `CLAUDE.md` — 트리거 라우팅 + 온디맨드 보조 검증 도구 명시 (수정)
- `.claude/skills/course-pipeline/SKILL.md` — 원고확정 후 검증 권유(옵션) 한 줄 (수정)
- `courses/spring-boot-basic/verification/ch01_verify.md` — ch01 검증 리포트 (신규, Task 6)

> **Scope note:** 단일 서브시스템(원고 기술검증) 플랜. 최종 산출물(책·PPTX) 검증·코드 검증 확대·원고 자동수정은 스펙 §9대로 범위 밖.

---

## Phase A — 제안서 + codex 사전검증

### Task 1: 제안서 작성

**Files:**
- Create: `docs/proposals/2026-07-07_manuscript-verify.md`

**Interfaces:**
- Produces: 제안서 경로 (Task 2 입력)

- [ ] **Step 1: 제안서 작성**

아래 내용으로 `docs/proposals/2026-07-07_manuscript-verify.md`를 생성한다:

```markdown
# 제안: 원고 기술검증 에이전트 (manuscript-verify)

## 1. 배경 / 문제
- 확정 원고가 전 파이프라인의 SSOT인데, manuscript-final 확정 체크리스트는 구조(8필드·번호)만 보고 기술 주장의 참/거짓은 검증하지 않는다.
- Source 필드는 있으나 품질이 제각각이고 "그 Source가 주장을 지지하는지"는 아무도 확인하지 않는다. 원고에서 틀리면 7개 산출물로 전파된다.

## 2. 제안
- 비차단 온디맨드 스킬 `manuscript-verify`(3.5단계): 확정 원고의 기술 주장을 외부 권위 문서 + Source 교차확인으로 적대적 검증하고, 의심 주장을 근거부 리포트(verification/chNN_verify.md)로 낸다.
- 3 컴포넌트: 결정적 후보 추출기(extract_claim_candidates.py) → 병렬 검증 서브에이전트(웹 리서치+반박) → 리포트 집계("반박(조치)"과 "검증불가(사람 판단)" 분리).
- 원고 자동 수정 없음(SSOT는 사용자가 manuscript-final로 수정). 하드 게이트 아님.

## 3. 하위호환 / 리스크
- 신규 스킬·신규 스크립트라 기존 파이프라인에 무영향(온디맨드). 파이프라인 11단계 표는 그대로.
- LLM 검증 오탐 → 적대적 검증 + 확신도 계층 + "검증불가" 분리로 억제.

## 4. 반영 순서
Phase B(후보 추출기+테스트) → Phase C(스킬+레퍼런스) → Phase D(하네스 통합) → Phase E(ch01 드라이런).
```

- [ ] **Step 2: 커밋**

```bash
git add docs/proposals/2026-07-07_manuscript-verify.md
git commit -m "docs: 원고 기술검증 에이전트(manuscript-verify) 제안서"
```

---

### Task 2: codex 사전검증

**Files:**
- Create: `docs/reviews/2026-07-07_manuscript-verify-codex-review.md`

**Interfaces:**
- Consumes: `docs/proposals/2026-07-07_manuscript-verify.md`
- Produces: 검증 결과(승인/조건부 승인 → 조건은 이후 Task 반영)

- [ ] **Step 1: codex 읽기전용 검증 실행**

Git Bash에서 stdin을 닫고 실행한다:

```bash
codex exec --sandbox read-only 'docs/proposals/2026-07-07_manuscript-verify.md 제안과 docs/superpowers/specs/2026-07-07-manuscript-verify-design.md 스펙을 검토하라. .claude/skills/manuscript-final/SKILL.md의 확정 체크리스트와 scripts/manuscript_grammar.py를 읽고, (1) 비차단 온디맨드 스킬이 기존 11단계 파이프라인·course-pipeline 게이트와 정합한지 (2) 후보 추출기가 manuscript_grammar 재사용으로 결정적 추출을 하고 비유를 배제하는 설계가 타당한지 (3) 적대적 검증 + "반박/검증불가" 분리가 오탐 억제에 충분한지 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
```

Expected: 승인 또는 조건부 승인(조건 목록). 출력 전문을 복사한다. (codex가 이미지·긴 스킬 덤프로 장문 출력을 낼 수 있다 — 최종 "결론:" 판정과 지적사항만 리뷰 파일에 정리한다.)

- [ ] **Step 2: 검증 결과 저장 + 조건 반영**

최종 판정 + 지적사항을 `docs/reviews/2026-07-07_manuscript-verify-codex-review.md`에 저장하고 맨 위에 한 줄 결론을 요약한다. 조건부 승인이면 조건을 Phase B~E 해당 Task에 반영한다.

- [ ] **Step 3: 커밋**

```bash
git add docs/reviews/2026-07-07_manuscript-verify-codex-review.md
git commit -m "docs: manuscript-verify 제안 codex 사전검증 결과"
```

---

## Phase B — 검증 후보 추출기 (TDD)

### Task 3: extract_claim_candidates.py

**Files:**
- Create: `scripts/extract_claim_candidates.py`
- Create: `tests/test_extract_claim_candidates.py`

**Interfaces:**
- Consumes: `scripts/manuscript_grammar.py`의 `SLIDE_RE`, `FIELD_RE`
- Produces: `extract_candidates(md_text) -> list[dict]`. 각 dict = `{"slide": int, "definition": str, "narration": str, "source": str}`. `definition`은 Screen의 `핵심 정의:` 라인 텍스트, `narration`은 Narration 필드 텍스트, `source`는 Source 필드 텍스트. 비유(Easy analogy) 등 다른 필드는 포함하지 않는다. CLI: `python scripts/extract_claim_candidates.py <course_dir> <chNN>` → JSON을 stdout으로.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/test_extract_claim_candidates.py`를 생성한다:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import extract_claim_candidates as ecc

_MD = (
    "## Slide 5. HTTP\n\n"
    "**Screen**\n"
    "- 제목: HTTP\n"
    "- 핵심 정의: HTTP는 웹에서 클라이언트와 서버가 요청·응답 메시지를 주고받는 통신 규칙이다.\n"
    "**Easy analogy**\n"
    "- HTTP는 택배 운송장과 같다.\n"
    "**Source**\n"
    "- MDN HTTP Overview: https://developer.mozilla.org/en-US/docs/Web/HTTP\n"
    "**Narration**\n"
    "- 브라우저와 서버는 HTTP라는 약속으로 대화합니다.\n"
)


def test_extracts_definition_narration_source():
    c = ecc.extract_candidates(_MD)
    assert len(c) == 1
    s = c[0]
    assert s["slide"] == 5
    assert "통신 규칙이다" in s["definition"]
    assert "브라우저와 서버" in s["narration"]
    assert "MDN" in s["source"]
    # 비유(Easy analogy)는 후보에 안 들어간다 (범위 가드)
    assert "택배" not in s["definition"]
    assert "택배" not in s["narration"]
    assert "택배" not in s["source"]


def test_slide_without_definition_has_empty_definition():
    md = "## Slide 7. X\n\n**Screen**\n- 제목: X\n**Narration**\n- 설명 문장.\n"
    c = ecc.extract_candidates(md)
    assert len(c) == 1
    assert c[0]["definition"] == ""
    assert "설명 문장" in c[0]["narration"]


def test_multiple_slides():
    md = _MD + "\n## Slide 6. Y\n\n**Screen**\n- 핵심 정의: Y는 Z이다.\n"
    c = ecc.extract_candidates(md)
    assert [s["slide"] for s in c] == [5, 6]
    assert "Z이다" in c[1]["definition"]
```

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `python -m pytest tests/test_extract_claim_candidates.py -v`
Expected: FAIL — `extract_claim_candidates` 모듈 없음(ModuleNotFoundError).

- [ ] **Step 3: 스크립트 구현**

`scripts/extract_claim_candidates.py`를 생성한다:

```python
"""원고 기술검증 후보 추출 — manuscript-verify(3.5단계)의 결정적 입력 생성기.

확정 원고(manuscripts/chNN.md)를 슬라이드별로 파싱해 검증 대상 후보 텍스트
(Screen의 '핵심 정의' / Narration / Source)를 구조화해 뽑는다. 어떤 문장이 '검증 가능한
원자적 기술 주장'인지 distill·분류하고 비유를 제외하는 판단은 이 스크립트가 아니라
manuscript-verify 스킬(LLM)이 한다 — 여기서는 결정적 후보 필드만 제공한다.

사용:
  python scripts/extract_claim_candidates.py <course_dir> <chNN>   # JSON을 stdout으로
"""
import json
import re
import sys
from pathlib import Path

from manuscript_grammar import SLIDE_RE, FIELD_RE

DEF_RE = re.compile(r"핵심\s*정의\s*[:：]\s*(.+)")


def extract_candidates(md_text):
    """return [{"slide": int, "definition": str, "narration": str, "source": str}, ...]"""
    out = []
    cur = None
    field = None
    buf = None

    def flush():
        if cur is not None:
            out.append({
                "slide": cur,
                "definition": " ".join(buf["definition"]).strip(),
                "narration": " ".join(buf["narration"]).strip(),
                "source": " ".join(buf["source"]).strip(),
            })

    for line in md_text.splitlines():
        m = SLIDE_RE.match(line)
        if m:
            flush()
            cur = int(m.group(1))
            field = None
            buf = {"definition": [], "narration": [], "source": []}
            continue
        if cur is None:
            continue
        f = FIELD_RE.match(line)
        if f:
            field = f.group(1)
            continue
        text = line.strip().lstrip("-").strip()
        if not text:
            continue
        if field == "Screen":
            dm = DEF_RE.search(text)
            if dm:
                buf["definition"].append(dm.group(1).strip())
        elif field == "Narration":
            buf["narration"].append(text)
        elif field == "Source":
            buf["source"].append(text)
    flush()
    return out


def main():
    if len(sys.argv) < 3:
        print("usage: python scripts/extract_claim_candidates.py <course_dir> <chNN>")
        return 1
    md = (Path(sys.argv[1]) / "manuscripts" / f"{sys.argv[2]}.md").read_text(encoding="utf-8")
    print(json.dumps(extract_candidates(md), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: 테스트 실행해 통과 확인**

Run: `python -m pytest tests/test_extract_claim_candidates.py -v`
Expected: 3개 PASS.

- [ ] **Step 5: ch01 실원고로 스모크 확인**

Run: `python scripts/extract_claim_candidates.py courses/spring-boot-basic ch01 | python -c "import json,sys; d=json.load(sys.stdin); print('slides:', len(d)); print('with def:', sum(1 for s in d if s['definition']))"`
Expected: `slides: 26` 내외, `with def:` > 0 (핵심 정의가 있는 슬라이드 수).

- [ ] **Step 6: 커밋**

```bash
git add scripts/extract_claim_candidates.py tests/test_extract_claim_candidates.py
git commit -m "feat(verify): 원고 검증 후보 추출기 — 슬라이드별 정의/나레이션/Source (manuscript_grammar 재사용)"
```

---

## Phase C — manuscript-verify 스킬

### Task 4: manuscript-verify SKILL.md + references

**Files:**
- Create: `.claude/skills/manuscript-verify/SKILL.md`
- Create: `.claude/skills/manuscript-verify/references/report-template.md`
- Create: `.claude/skills/manuscript-verify/references/verifier-prompt.md`

**Interfaces:**
- Consumes: Task 3 `extract_claim_candidates.py`(후보 JSON)
- Produces: 실행자가 따르는 검증 절차 문서. 리포트 출력 계약: `courses/{id}/verification/chNN_verify.md`.

- [ ] **Step 1: SKILL.md 작성**

`.claude/skills/manuscript-verify/SKILL.md`를 아래 내용으로 생성한다:

````markdown
---
name: manuscript-verify
description: 확정 원고(`manuscripts/chNN.md`)의 기술 주장(정의·프로토콜·API·버전)을 외부 권위 문서 + Source 교차확인으로 적대적 검증해 근거부 리포트(`verification/chNN_verify.md`)를 내는 비차단 온디맨드 스킬. "원고 검증", "기술 검증", "팩트체크", "사실 확인" 요청 시 사용. 파이프라인 3.5단계(원고확정 직후, 온디맨드) — 하드 게이트가 아니며 원고를 자동 수정하지 않는다(수정은 사용자가 manuscript-final로). 비유·의견·서사는 검증 대상이 아니다.
---

# manuscript-verify

확정 원고의 기술 주장을 외부 권위 근거와 대조해 참/거짓을 판정하고, 의심 주장을 **근거부 리포트**로 내는 비차단 온디맨드 스킬이다. 원고는 수정하지 않는다.

**설계 근거**: `docs/superpowers/specs/2026-07-07-manuscript-verify-design.md`.

## 0. 전제 게이트

- 대상 차시 `원고확정`이 `status.md`에서 ✅가 아니면 **중단**하고 사용자에게 알린다. 미확정 원고는 검증하지 않는다.
- 대상 차시(chNN)·과정 디렉터리를 확정한다.

## 1. 주장 추출 (결정적 후보 → LLM distill)

- `python scripts/extract_claim_candidates.py courses/{id} chNN` 를 실행해 슬라이드별 후보(정의/나레이션/Source) JSON을 얻는다.
- 각 슬라이드 후보에서 **검증 가능한 원자적 기술 주장**을 distill한다: 정의·프로토콜/표준 사실·API/메서드 동작·버전/설정 값. 하나의 문장이 여러 주장을 담으면 쪼갠다.
- **범위 가드(필수)**: 비유·의견·교육적 서사·주관적 표현은 주장으로 삼지 않는다(후보 추출기가 Easy analogy를 이미 제외하므로 나레이션 속 비유 표현만 추가로 거른다).
- 결과: 주장 리스트 `{slide, claim_text, source_field, claim_type}`.

## 2. 검증 (병렬 서브에이전트, 적대적)

- 슬라이드 단위로 검증 서브에이전트를 병렬 파견한다(한 슬라이드의 1–3개 주장을 묶어 처리 — 에이전트 수 억제). 프롬프트 규범은 `references/verifier-prompt.md`.
- 각 검증자는: (a) 권위 문서 웹 리서치(WebSearch/WebFetch — 공식 도큐·MDN·RFC·프레임워크 문서), (b) 슬라이드 `Source` 교차확인(존재·권위·주장 지지 여부), (c) 적대적 반박 시도 후 근거 인용이 있어야만 판정.
- 반환(주장별): `{claim, verdict: "지지"|"반박"|"검증불가", confidence: "high"|"medium"|"low", evidence_url, evidence_quote, source_supports: bool, suggested_correction}`.
- **파견 상한**: 동시 파견 수에 상한을 둔다. 상한으로 못 돌린 주장이 있으면 리포트에 "미검증"으로 **명시**한다(침묵 절단 금지).

## 3. 리포트 집계

- 판정을 모아 `courses/{id}/verification/chNN_verify.md`를 만든다. 포맷은 `references/report-template.md`를 따른다.
- **"반박(조치 대상)"과 "검증불가(사람 판단 필요)"를 분리**한다 — 오탐이 조치 목록을 오염시키지 않게. "검증불가"는 오류가 아니라 사람 판단 항목이다.
- 의심 요약(반박 N건·검증불가 Z건·미검증 W건)을 사용자에게 보고한다.

## 4. 수정 루프 (안내)

- 사용자가 리포트를 검토 → 고칠 주장을 정함 → `manuscript-final`로 수정(사용자 확정 SSOT 편집) → 필요 시 `manuscript-verify` 재실행. **이 스킬은 원고를 수정하지 않는다.**
- `status.md`에 정보성 한 줄만 남긴다: `원고검증: chNN 리포트 YYYY-MM-DD, 반박 N·검증불가 Z`. (하드 게이트 칸 아님.)

## 확정 체크리스트 (실행마다)

- [ ] **전제 게이트**: 대상 차시 `원고확정` ✅ 확인 후 실행했다.
- [ ] **범위 준수**: 리포트에 비유·의견이 기술 주장으로 잘못 올라오지 않았다.
- [ ] **근거 첨부**: "반박"·"지지" 판정에 인용 가능한 근거(URL + 인용문)가 붙어 있다. 근거 없는 판정은 "검증불가"로 내렸다.
- [ ] **분리 표기**: 리포트가 "반박(조치)"과 "검증불가(사람 판단)"를 분리했다.
- [ ] **미검증 명시**: 상한 등으로 못 돌린 주장을 리포트에 명시했다.
- [ ] **비파괴**: 원고(`manuscripts/chNN.md`)를 수정하지 않았다.

## 참고

- 후보 추출기: `scripts/extract_claim_candidates.py`(수정 금지, 그대로 호출)
- 리포트 포맷: `references/report-template.md`
- 검증자 프롬프트: `references/verifier-prompt.md`
- 이 스킬은 절차 문서이며 TDD 대상이 아니다. 실사용 품질은 위 확정 체크리스트가 매 실행마다 담당한다.
````

- [ ] **Step 2: report-template.md 작성**

`.claude/skills/manuscript-verify/references/report-template.md`를 아래 내용으로 생성한다:

````markdown
# 원고 기술검증 리포트 포맷

`courses/{id}/verification/chNN_verify.md`는 아래 구조를 따른다.

```
# 원고 기술검증 — chNN (YYYY-MM-DD)

## 요약
- 검증 주장: N건 / 지지 X / **반박 Y** / 검증불가 Z / 미검증 W(상한 초과)

## 반박 (조치 대상 — 사용자가 manuscript-final로 검토·수정)
| 슬라이드 | 주장 | 확신도 | 근거(URL) | 근거 인용 | Source 지지 | 수정안 |
|---|---|---|---|---|---|---|
| 8 | "WAS는 …" | high | https://… | "…" | ✗ | "…로 고칠 것" |

## 검증불가 (사람 판단 필요 — 오류 아님)
| 슬라이드 | 주장 | 사유 | 참고 |
|---|---|---|---|

## 미검증 (파견 상한 초과 — 재실행 필요)
- Slide N: "주장…"

## 지지 (참고 — 근거로 확인됨)
| 슬라이드 | 주장 | 근거(URL) |
|---|---|---|
```

- "반박"과 "검증불가"는 반드시 별도 섹션으로 분리한다.
- 모든 "반박"·"지지" 행에는 인용 가능한 `근거(URL)`와 `근거 인용`이 있어야 한다.
````

- [ ] **Step 3: verifier-prompt.md 작성**

`.claude/skills/manuscript-verify/references/verifier-prompt.md`를 아래 내용으로 생성한다:

````markdown
# 검증 서브에이전트 프롬프트 규범

각 검증 서브에이전트에 아래 골자를 전달한다(슬라이드 1개, 주장 1–3개 묶음):

- **역할**: 아래 기술 주장이 참인지 회의적으로 검증한다. 기본 태도는 "반박 시도" — 근거 없이 참으로 인정하지 않는다.
- **입력**: 슬라이드 번호, 주장 텍스트(들), 그 슬라이드의 Source 필드 원문.
- **해야 할 일**:
  1. 권위 문서를 WebSearch/WebFetch로 찾아 주장과 대조(공식 도큐·MDN·RFC·프레임워크 공식 문서 우선).
  2. Source 필드가 실제로 그 주장을 지지하는지 확인(존재·권위·지지 여부).
  3. 반박을 시도하고, 인용 가능한 근거가 있을 때만 판정한다.
- **반환(주장별 JSON)**: `{claim, verdict: "지지"|"반박"|"검증불가", confidence: "high"|"medium"|"low", evidence_url, evidence_quote, source_supports: bool, suggested_correction}`.
- **금지**: 근거 없이 "지지"/"반박" 판정 금지(그 경우 "검증불가"). 비유·의견·주관 표현은 판정 대상 아님. 원고 수정 금지.
````

- [ ] **Step 4: 구조 검증**

Run: `for f in .claude/skills/manuscript-verify/SKILL.md .claude/skills/manuscript-verify/references/report-template.md .claude/skills/manuscript-verify/references/verifier-prompt.md; do echo -n "$f: "; test -s "$f" && echo OK || echo MISSING; done`
Expected: 3개 OK.
Run: `grep -c "전제 게이트\|반박\|검증불가\|비파괴\|extract_claim_candidates" .claude/skills/manuscript-verify/SKILL.md`
Expected: `>=5`.

- [ ] **Step 5: 커밋**

```bash
git add .claude/skills/manuscript-verify/SKILL.md .claude/skills/manuscript-verify/references/report-template.md .claude/skills/manuscript-verify/references/verifier-prompt.md
git commit -m "feat(verify): manuscript-verify 스킬 — 적대적 검증 절차 + 리포트/검증자 규범"
```

---

## Phase D — 하네스 통합

### Task 5: CLAUDE.md 트리거 + course-pipeline 옵션 연계

**Files:**
- Modify: `CLAUDE.md` (트리거 라우팅 표 + 보조/온디맨드 도구 설명)
- Modify: `.claude/skills/course-pipeline/SKILL.md` (원고확정 후 검증 권유 옵션)

**Interfaces:**
- Consumes: Task 4 스킬
- Produces: 사용자·오케스트라가 스킬을 발견/권유하는 경로

- [ ] **Step 1: CLAUDE.md 트리거 라우팅 추가**

`CLAUDE.md`의 "트리거 라우팅" 표에서 `| "원고 수정", "원고 완성" | \`manuscript-final\` |` 행 **아래**에 행을 추가한다:

```
| "원고 검증", "기술 검증", "팩트체크" | `manuscript-verify` |
```

- [ ] **Step 2: CLAUDE.md 온디맨드 도구 명시**

`CLAUDE.md`의 "보조 엔진 스킬(파이프라인 단계 아님, 각 단계 스킬이 필요 시 호출):" 목록에 아래 줄을 추가한다:

```
- `manuscript-verify` — 확정 원고 기술 주장을 외부 근거로 적대적 검증(근거부 리포트, 비차단 온디맨드, 3.5단계 — 원고 자동수정 없음). "원고 검증" 요청 시.
```

- [ ] **Step 3: course-pipeline에 검증 권유 옵션 추가**

`.claude/skills/course-pipeline/SKILL.md`에서 원고확정(3단계) 완료 후 다음 단계로 넘어가는 흐름을 서술한 지점에 아래 한 줄을 추가한다(정확한 위치는 원고확정→visual-assets 전이 서술 근처):

```
- (옵션) 원고확정 ✅ 직후 `manuscript-verify`로 기술 주장 검증을 **권유**할 수 있다(비차단 — 사용자가 원하면 실행, 아니면 그대로 visual-assets로 진행). 파이프라인을 막지 않는다.
```

- [ ] **Step 4: 커밋**

```bash
git add CLAUDE.md .claude/skills/course-pipeline/SKILL.md
git commit -m "docs(harness): manuscript-verify 트리거 라우팅 + course-pipeline 검증 권유 옵션"
```

---

## Phase E — ch01 드라이런 (검증)

### Task 6: ch01 대표 슬라이드 검증 드라이런

**Files:**
- Create: `courses/spring-boot-basic/verification/ch01_verify.md`

**Interfaces:**
- Consumes: Task 3 후보 추출기, Task 4 스킬 절차
- Produces: 실제 검증 리포트(샘플) — 스킬 end-to-end 실증

- [ ] **Step 1: 후보 추출 확인**

Run: `python scripts/extract_claim_candidates.py courses/spring-boot-basic ch01 > "$SCRATCH/ch01_candidates.json"; python -c "import json; d=json.load(open(r'$SCRATCH/ch01_candidates.json',encoding='utf-8')); [print(s['slide'], s['definition'][:40]) for s in d if s['definition']][:8]"`
(`$SCRATCH`는 세션 스크래치 디렉터리.) Expected: 정의가 있는 슬라이드가 출력된다.

- [ ] **Step 2: 대표 3슬라이드 검증 (비용 한정 드라이런)**

비용을 한정하기 위해 **대표 3개 슬라이드**만 검증한다: slide 5(HTTP=프로토콜 사실), slide 8(WAS=정의), slide 10(내장 Tomcat 실행=API/동작). 각 슬라이드에 대해 Task 4 §2의 검증 서브에이전트를 파견한다(`references/verifier-prompt.md` 규범 + WebSearch/WebFetch). 판정을 수집한다.

- [ ] **Step 3: 리포트 작성**

수집한 판정을 `courses/spring-boot-basic/verification/ch01_verify.md`에 `references/report-template.md` 포맷으로 작성한다. "반박"과 "검증불가"를 분리하고, 3슬라이드만 검증했음을 요약에 "미검증: 나머지 23슬라이드(드라이런 범위 한정)"로 **명시**한다.

- [ ] **Step 4: 확정 체크리스트 + 사용자 보고**

Task 4 SKILL.md의 확정 체크리스트를 수행한다(범위 준수·근거 첨부·분리 표기·미검증 명시·비파괴). `status.md`에 정보성 한 줄(`원고검증: ch01 드라이런 리포트 YYYY-MM-DD, 대표 3슬라이드`)을 추가하고, 사용자에게 리포트를 보고한다. **원고는 수정하지 않는다.**

- [ ] **Step 5: 커밋**

```bash
git add courses/spring-boot-basic/verification/ch01_verify.md courses/spring-boot-basic/status.md
git commit -m "content(ch01): manuscript-verify 드라이런 리포트 (대표 3슬라이드)"
```

---

## Self-Review

**1. Spec coverage:**
- 정체성·위치(비차단 온디맨드 3.5, §2) → Task 4·5 ✅
- 검증 근거(외부 리서치+Source 교차확인+적대적, §3) → Task 4(절차)·verifier-prompt ✅
- 3 컴포넌트(추출기·검증기·집계기, §4) → Task 3(추출기)·Task 4(검증기·집계기) ✅
- 범위 가드(비유 제외, §4.1·§6) → Task 3(추출 단계 제외)·Task 4(distill 단계 제외) ✅
- 리포트 분리(반박/검증불가, §4.3) → Task 4·report-template ✅
- 수정 루프·비파괴(§5·§2) → Task 4 §4·확정 체크리스트 ✅
- 미검증 명시(§4.2·§6) → Task 4·Task 6 ✅
- proposal+codex(§8) → Task 1·2 ✅
- 범위 밖(책/PPTX·코드·자동수정, §9) → Scope note 명시 ✅

**2. Placeholder scan:** Task 3은 완전한 스크립트·pytest 코드. Task 4는 SKILL.md·2개 레퍼런스 전문. Task 5는 삽입할 정확한 문구. Task 6은 비용 한정 드라이런 절차 + 정확한 명령. "적절히 처리" 류 없음.

**3. Type consistency:** 후보 dict 키 `slide/definition/narration/source`가 Task 3(정의)·Task 4(§1 소비)·Task 6(스모크)에서 일치. 판정 스키마 `verdict/confidence/evidence_url/evidence_quote/source_supports/suggested_correction`가 Task 4 §2·verifier-prompt·report-template에서 일치. 출력 경로 `verification/chNN_verify.md` 전 Task 일치. `verdict` 값 "지지/반박/검증불가" 일관.

> **주의**: Task 6은 실제 WebSearch/WebFetch를 쓰는 드라이런이라 비용·시간이 든다 — 대표 3슬라이드로 한정하고 나머지는 "미검증"으로 명시한다(전량 검증은 사용자 운영 시).
