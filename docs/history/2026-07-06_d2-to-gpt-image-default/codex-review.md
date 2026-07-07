**결론: 조건부 승인** — D2→GPT 이미지 기본값 역전 방향은 타당하나, `slide_covered` 집계/소비 스킬 5종/`annotate_manuscript_assets.py`·`pptx-build` 우회 경로가 아직 'present 우선'이라 primary 계약이 관철되지 않음. 아래 5개 조건 반영 후 승인 가능(Phase B~D에 반영 요).

---

Reading additional input from stdin...
OpenAI Codex v0.142.0
--------
workdir: C:\Users\ssarm\Documents\course-haness
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f35fd-0680-7862-aa7c-dd8d3b3a59a1
--------
user
docs/proposals/2026-07-06_d2-to-gpt-image-default.md 제안을 검토하라. scripts/build_asset_manifest.py의 현재 D2 우선 로직(105~120행)과 slide_covered 집계(123~135행)를 읽고, 제안대로 이미지 primary 기본 + D2 opt-in 마커로 역전할 때 (1) 기존 D2-only 슬라이드 회귀 여부 (2) 이미지 미생성 슬라이드가 missing으로 뜨는 게 하드 게이트와 정합한지 (3) 소비 스킬이 primary를 읽는 계약의 빈틈을 지적하라. 승인/조건부 승인/반려로 결론.
codex
`gstack-openclaw-ceo-review` 스킬을 사용하겠습니다. 요청이 제안서를 반박적으로 검토하는 성격이고, 결론을 승인/조건부 승인/반려로 내려야 하기 때문입니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path 'C:\\Users\\ssarm\\.agents\\skills\\gstack\\openclaw\\skills\\gstack-openclaw-ceo-review\\SKILL.md'" in C:\Users\ssarm\Documents\course-haness
 succeeded in 1224ms:
---
name: gstack-openclaw-ceo-review
description: Use when asked to review a plan, challenge a proposal, run a CEO review, poke holes in an approach, think bigger about scope, or decide whether to expand or reduce the plan.
---

# CEO Plan Review

## Philosophy

You are not here to rubber-stamp this plan. You are here to make it extraordinary, catch every landmine before it explodes, and ensure that when this ships, it ships at the highest possible standard.

Your posture depends on what the user needs:

- **SCOPE EXPANSION:** You are building a cathedral. Envision the platonic ideal. Push scope UP. Ask "what would make this 10x better for 2x the effort?" Every expansion is the user's decision. Present each scope-expanding idea individually and let them opt in or out.
- **SELECTIVE EXPANSION:** You are a rigorous reviewer who also has taste. Hold the current scope as your baseline, make it bulletproof. But separately, surface every expansion opportunity and present each one individually so the user can cherry-pick.
- **HOLD SCOPE:** You are a rigorous reviewer. The plan's scope is accepted. Your job is to make it bulletproof... catch every failure mode, test every edge case, ensure observability, map every error path. Do not silently reduce OR expand.
- **SCOPE REDUCTION:** You are a surgeon. Find the minimum viable version that achieves the core outcome. Cut everything else. Be ruthless.

**Critical rule:** In ALL modes, the user is 100% in control. Every scope change is an explicit opt-in... never silently add or remove scope.

Do NOT make any code changes. Do NOT start implementation. Your only job is to review the plan.

## Prime Directives

1. Zero silent failures. Every failure mode must be visible.
2. Every error has a name. Don't say "handle errors." Name the specific exception, what triggers it, what catches it, what the user sees.
3. Data flows have shadow paths. Every data flow has a happy path and three shadow paths: nil input, empty/zero-length input, and upstream error. Trace all four.
4. Interactions have edge cases. Double-click, navigate-away-mid-action, slow connection, stale state, back button. Map them.
5. Observability is scope, not afterthought. New dashboards, alerts, and runbooks are first-class deliverables.
6. Diagrams are mandatory. No non-trivial flow goes undiagrammed.
7. Everything deferred must be written down. Vague intentions are lies.
8. Optimize for the 6-month future, not just today.
9. You have permission to say "scrap it and do this instead."

## Cognitive Patterns... How Great CEOs Think

These are thinking instincts, not a checklist. Let them shape your perspective throughout the review.

1. **Classification instinct** ... Categorize every decision by reversibility x magnitude. Most things are two-way doors; move fast.
2. **Paranoid scanning** ... Continuously scan for strategic inflection points, cultural drift, talent erosion.
3. **Inversion reflex** ... For every "how do we win?" also ask "what would make us fail?"
4. **Focus as subtraction** ... Primary value-add is what to NOT do. Default: do fewer things, better.
5. **People-first sequencing** ... People, products, profits... always in that order.
6. **Speed calibration** ... Fast is default. Only slow down for irreversible + high-magnitude decisions. 70% information is enough to decide.
7. **Proxy skepticism** ... Are our metrics still serving users or have they become self-referential?
8. **Narrative coherence** ... Hard decisions need clear framing. Make the "why" legible, not everyone happy.
9. **Temporal depth** ... Think in 5-10 year arcs. Apply regret minimization for major bets.
10. **Founder-mode bias** ... Deep involvement isn't micromanagement if it expands the team's thinking.
11. **Wartime awareness** ... Correctly diagnose peacetime vs wartime.
12. **Courage accumulation** ... Confidence comes from making hard decisions, not before them.
13. **Willfulness as strategy** ... Be intentionally willful. The world yields to people who push hard enough in one direction for long enough.
14. **Leverage obsession** ... Find inputs where small effort creates massive output.
15. **Hierarchy as service** ... Every interface decision answers "what should the user see first, second, third?"
16. **Edge case paranoia** ... What if the name is 47 chars? Zero results? Network fails mid-action?
17. **Subtraction default** ... "As little design as possible." If a UI element doesn't earn its pixels, cut it.
18. **Design for trust** ... Every interface decision either builds or erodes user trust.

---

## Step 0: Nuclear Scope Challenge + Mode Selection

### 0A. Premise Challenge
1. Is this the right problem to solve? Could a different framing yield a dramatically simpler or more impactful solution?
2. What is the actual user/business outcome? Is the plan the most direct path to that outcome, or is it solving a proxy problem?
3. What would happen if we did nothing? Real pain point or hypothetical one?

### 0B. Existing Code Leverage
1. What existing code already partially or fully solves each sub-problem? Map every sub-problem to existing code.
2. Is this plan rebuilding anything that already exists?

### 0C. Dream State Mapping
Describe the ideal end state 12 months from now. Does this plan move toward that state or away from it?

> CURRENT STATE → THIS PLAN → 12-MONTH IDEAL

### 0C-bis. Implementation Alternatives (MANDATORY)
Produce 2-3 distinct approaches before selecting a mode:

For each approach:
- **Name**, Summary, Effort (S/M/L/XL), Risk (Low/Med/High)
- Pros (2-3 bullets), Cons (2-3 bullets), Reuses (existing code leveraged)

One must be "minimal viable." One must be "ideal architecture."

**RECOMMENDATION:** Choose [X] because [reason].

Ask the user which approach to proceed with. Do NOT proceed without approval.

### 0D. Mode-Specific Analysis

**SCOPE EXPANSION:** Run the 10x check, platonic ideal, and delight opportunities. Then present each expansion proposal individually... the user opts in or out of each one.

**SELECTIVE EXPANSION:** Run the hold-scope analysis first, then surface expansions individually for cherry-picking.

**HOLD SCOPE:** Run the complexity check and minimum change set analysis.

**SCOPE REDUCTION:** Run the ruthless cut and follow-up PR separation.

### 0E. Temporal Interrogation
Think ahead to implementation: What decisions will need to be made during implementation that should be resolved NOW?

> HOUR 1 (foundations): What does the implementer need to know?
> HOUR 2-3 (core logic): What ambiguities will they hit?
> HOUR 4-5 (integration): What will surprise them?
> HOUR 6+ (polish/tests): What will they wish they'd planned for?

### 0F. Mode Selection
Present four options:
1. **SCOPE EXPANSION** ... Dream big, propose the ambitious version
2. **SELECTIVE EXPANSION** ... Hold baseline, cherry-pick expansions
3. **HOLD SCOPE** ... Maximum rigor, make it bulletproof
4. **SCOPE REDUCTION** ... Ruthless cut to minimum viable version

Context-dependent defaults:
- Greenfield feature → default EXPANSION
- Feature enhancement → default SELECTIVE EXPANSION
- Bug fix or hotfix → default HOLD SCOPE
- Refactor → default HOLD SCOPE
- Plan touching >15 files → suggest REDUCTION

Once selected, commit fully. Do not silently drift.

---

## Review Sections (11 sections, after scope and mode are agreed)

**Anti-skip rule:** Never condense, abbreviate, or skip any review section regardless of plan type. If a section genuinely has zero findings, say "No issues found" and move on, but you must evaluate it.

Ask the user about each issue ONE AT A TIME. Do NOT batch.

### Section 1: Architecture Review
Evaluate system design, component boundaries, data flow (all four paths), state machines, coupling, scaling, security architecture, production failure scenarios, rollback posture. Draw dependency graphs.

### Section 2: Error & Rescue Map
For every new method or codepath that can fail: name the exception, whether it's rescued, what the rescue action is, and what the user sees. Catch-all error handling is always a smell.

### Section 3: Security & Threat Model
Attack surface expansion, input validation, authorization, secrets management, dependency risk, data classification, injection vectors, audit logging.

### Section 4: Data Flow & Interaction Edge Cases
Trace every new data flow through input → validation → transform → persist → output, noting what happens at each node for nil, empty, wrong type, too long, timeout, conflict, encoding issues.

### Section 5: Code Quality Review
Organization, DRY violations, naming quality, error handling patterns, missing edge cases, over-engineering, under-engineering, cyclomatic complexity.

### Section 6: Test Review
Diagram every new UX flow, data flow, codepath, background job, integration, and error path. For each: what type of test covers it? Does one exist? What's the gap?

### Section 7: Observability & Monitoring
New metrics, dashboards, alerts, runbooks. For each new codepath: how would you know it's broken in production?

### Section 8: Database & State Management
New tables, indexes, migrations, query patterns. N+1 query risks. Data integrity constraints.

### Section 9: API Design & Contract
New endpoints, request/response shapes, backward compatibility, versioning, rate limiting.

### Section 10: Performance & Scalability
What breaks at 10x load? At 100x? Memory, CPU, network, database hotspots.

### Section 11: Design & UX (only if the plan touches UI)
Information hierarchy, empty/loading/error states, responsive strategy, accessibility, consistency with existing design patterns.

---

## Output

After all sections are reviewed, produce a clean summary:

**CEO REVIEW SUMMARY**
- **Mode:** [selected mode]
- **Strongest challenges:** [top 3 issues found]
- **Recommended path:** [what to do next]
- **Accepted scope:** [what's in]
- **Deferred:** [what's out and why]
- **NOT in scope:** [explicitly excluded items]

Save the summary to `memory/` for future reference.

---

## Important Rules

- **No code changes.** This skill reviews plans, it doesn't implement them.
- **One issue at a time.** Never batch multiple questions.
- **Every section gets evaluated.** "Doesn't apply" without examination is never valid.
- **The user is always in control.** Every scope change is an explicit opt-in.
- **Completion status:**
  - DONE ... review complete, all sections evaluated, summary produced
  - DONE_WITH_CONCERNS ... reviewed but with unresolved issues
  - BLOCKED ... cannot review without additional context

codex
제안서와 매니페스트 생성 로직을 먼저 대조해서 보겠습니다. 특히 `primary`를 소비하는 쪽 계약은 파일명만으로는 드러나지 않을 수 있어, 레포 전체에서 `primary` 참조를 같이 찾겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'scripts/build_asset_manifest.py' | ForEach-Object { "'$i++; if ($i -ge 90 -and $i -le 150) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path 'docs/proposals/2026-07-06_d2-to-gpt-image-default.md'" in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"\\bprimary\\b|slide_covered|build_asset_manifest|d2\" ." in C:\Users\ssarm\Documents\course-haness
 succeeded in 1236ms:
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

 succeeded in 1501ms:
  90:     slides = []
  91:     for num in sorted(va):
  92:         entry = {"slide": num}
  93:         info = va[num]
  94:         # D2 먼저 판정 (D2가 있으면 그 슬라이드의 주 시각자료)
  95:         d2_present = False
  96:         if info["d2"]:
  97:             matches = sorted(dia_dir.glob(f"{ch}-slide{num:02d}-*.png")) if dia_dir.exists() else []
  98:             d2_path = f"assets/diagrams/{matches[0].name}" if matches else None
  99:             d2_present = bool(matches) and matches[0].stat().st_size > 0
 100:             entry["d2"] = {
 101:                 "path": d2_path,
 102:                 "d2_hash": _hash(info["d2"]),
 103:                 "status": "present" if d2_present else "missing",
 104:             }
 105:         # 이미지: D2가 주 시각자료인 슬라이드에서 이미지가 없으면 deferred(중복 불필요)
 106:         if info["prompt"]:
 107:             img_path = f"assets/images/{ch}/slide{num:02d}.png"
 108:             present = (course / img_path).exists() and (course / img_path).stat().st_size > 0
 109:             if present:
 110:                 status = "present"
 111:             elif d2_present:
 112:                 status = "deferred"   # D2로 대체 — 생성 불필요
 113:             else:
 114:                 status = "missing"
 115:             entry["image"] = {
 116:                 "path": img_path,
 117:                 "prompt_hash": _hash(info["prompt"]),
 118:                 "status": status,
 119:                 "primary": not d2_present,   # 이 슬라이드의 주 시각자료인가
 120:             }
 121:         slides.append(entry)
 122: 
 123:     # 슬라이드별 "주 시각자료 확보" 여부로 집계 (deferred는 결핍 아님)
 124:     def slide_covered(s):
 125:         # D2 present 또는 image present면 커버됨
 126:         if s.get("d2", {}).get("status") == "present":
 127:             return True
 128:         if s.get("image", {}).get("status") == "present":
 129:             return True
 130:         # 시각자료 필드가 아예 없는 슬라이드(코드/평가)는 커버 대상 아님
 131:         return "d2" not in s and "image" not in s
 132:     total_visual_slides = sum(1 for s in slides if "d2" in s or "image" in s)
 133:     covered = sum(1 for s in slides if ("d2" in s or "image" in s) and slide_covered(s))
 134:     overall = "present" if covered == total_visual_slides and total_visual_slides > 0 else (
 135:         "partial" if covered > 0 else "missing")
 136: 
 137:     manifest = {
 138:         "chapter": ch,
 139:         "overall_status": overall,
 140:         "visual_slides_covered": covered,
 141:         "visual_slides_total": total_visual_slides,
 142:         "slides": slides,
 143:     }
 144:     out_path = course / "assets" / "manifest.json"
 145:     out_path.parent.mkdir(parents=True, exist_ok=True)
 146:     out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
 147:     return manifest, out_path
 148: 
 149: 
 150: def main():

 succeeded in 1844ms:
.\CLAUDE.md:31:- `pub-d2-diagram` — D2 모노톤 도형 렌더 (주 호출자: `visual-assets`)
.\scripts\build_pptx.py:106:                # d2 fence = diagram source, not display code -> discard.
.\scripts\build_pptx.py:107:                if field == "Visual asset" and fence_lang != "d2" and code_lines:
.\scripts\annotate_manuscript_assets.py:36:        d2 = entry.get("d2", {})
.\scripts\annotate_manuscript_assets.py:39:        if d2.get("status") == "present":
.\scripts\annotate_manuscript_assets.py:40:            anns.append(f"- → 렌더됨: {d2['path']}")
.\scripts\build_asset_manifest.py:11:    "d2":    {"path": "assets/diagrams/ch01-slide05-http.png", "d2_hash": "...", "status": "present|missing"}
.\scripts\build_asset_manifest.py:14:prompt_hash/d2_hash = 원고의 해당 소스 텍스트 SHA1 앞 12자 → 원고 변경 시 stale 감지에 사용.
.\scripts\build_asset_manifest.py:17:  python scripts/build_asset_manifest.py <course_dir> <chNN>
.\scripts\build_asset_manifest.py:18:  예: python scripts/build_asset_manifest.py courses/spring-boot-basic ch01
.\scripts\build_asset_manifest.py:37:    """슬라이드별 Visual asset 내용을 추출. return {slide_num: {"prompt": str|None, "d2": str|None}}"""
.\scripts\build_asset_manifest.py:43:    d2_lines = []
.\scripts\build_asset_manifest.py:48:                if field == "Visual asset" and fence_lang == "d2":
.\scripts\build_asset_manifest.py:49:                    out[cur]["d2"] = "\n".join(d2_lines)
.\scripts\build_asset_manifest.py:50:                in_code, fence_lang, d2_lines = False, "", []
.\scripts\build_asset_manifest.py:52:            if fence_lang == "d2":
.\scripts\build_asset_manifest.py:53:                d2_lines.append(line)
.\scripts\build_asset_manifest.py:60:            out[cur] = {"prompt": None, "d2": None, "_va": ""}
.\scripts\build_asset_manifest.py:95:        d2_present = False
.\scripts\build_asset_manifest.py:96:        if info["d2"]:
.\scripts\build_asset_manifest.py:98:            d2_path = f"assets/diagrams/{matches[0].name}" if matches else None
.\scripts\build_asset_manifest.py:99:            d2_present = bool(matches) and matches[0].stat().st_size > 0
.\scripts\build_asset_manifest.py:100:            entry["d2"] = {
.\scripts\build_asset_manifest.py:101:                "path": d2_path,
.\scripts\build_asset_manifest.py:102:                "d2_hash": _hash(info["d2"]),
.\scripts\build_asset_manifest.py:103:                "status": "present" if d2_present else "missing",
.\scripts\build_asset_manifest.py:111:            elif d2_present:
.\scripts\build_asset_manifest.py:119:                "primary": not d2_present,   # 이 슬라이드의 주 시각자료인가
.\scripts\build_asset_manifest.py:124:    def slide_covered(s):
.\scripts\build_asset_manifest.py:126:        if s.get("d2", {}).get("status") == "present":
.\scripts\build_asset_manifest.py:131:        return "d2" not in s and "image" not in s
.\scripts\build_asset_manifest.py:132:    total_visual_slides = sum(1 for s in slides if "d2" in s or "image" in s)
.\scripts\build_asset_manifest.py:133:    covered = sum(1 for s in slides if ("d2" in s or "image" in s) and slide_covered(s))
.\scripts\build_asset_manifest.py:152:        print("usage: python scripts/build_asset_manifest.py <course_dir> <chNN>")
.\scripts\test_build_pptx.py:87:    - D2 diagram: `assets/diagrams/ch01_http-request-response.d2`
.\scripts\test_build_pptx.py:89:    ```d2
.\scripts\test_build_pptx.py:135:def test_d2_fence_is_not_treated_as_display_code():
.\templates\golden\manuscript_golden.md:170:- D2 diagram: `assets/diagrams/ch01_http-request-response.d2`
.\templates\golden\manuscript_golden.md:172:```d2
.\templates\golden\manuscript_golden.md:312:- D2 diagram: `assets/diagrams/ch01_webserver-was-role.d2`
.\templates\golden\manuscript_golden.md:314:```d2
.\templates\golden\manuscript_golden.md:401:- D2 diagram: `assets/diagrams/ch01_springboot-embedded-server.d2`
.\templates\golden\manuscript_golden.md:403:```d2
.\templates\golden\manuscript_golden.md:607:```d2
.\templates\golden\manuscript_golden.md:829:- D2 diagram: `assets/diagrams/ch01_request-to-controller.d2`
.\templates\golden\manuscript_golden.md:831:```d2
.\templates\golden\manuscript_golden.md:920:- Reuse D2: `ch01_request-to-controller.d2`를 단순화하거나 정리용 아이콘 흐름도로 재사용.
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:12:1. **자산 생성이 소비 산출물 뒤에 와서 재동기화 폭포(cascade)를 유발한다.** 현재 파이프라인은 `원고확정 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`이고, 이미지(image-gen)·D2(pub-d2-diagram) 생성은 manuscript-final(3단계) 안의 "선택" 절차로만 존재한다. 실제로는 원고 확정 시점에 자산을 안 만들고 넘어가, 스토리보드·PPT프리뷰·판서·PPTX가 전부 placeholder로 먼저 만들어졌다. 나중에 이미지를 생성하니 **그 4개 산출물을 다시 만들어야 하는** 재작업이 생겼다.
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:15:4. **pub-d2-diagram의 Windows 렌더링·종횡비 문제.** rsvg-convert가 Windows에 없어 playwright 스크린샷 폴백을 즉흥적으로 썼고, 가로 선형 레이아웃이라 일부 다이어그램(slide05 ~10:1, slide20 ~9:1)이 극단적으로 납작해 슬라이드·책에 넣으면 글자가 안 보인다.
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:32:- 원고의 ```d2 블록 → pub-d2-diagram 렌더 → `assets/diagrams/`.
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:37:### 제안 B: pub-d2-diagram Windows 렌더링·종횡비 표준화
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:47:2. **asset manifest(SSOT)**: `courses/{id}/assets/manifest.json` — 슬라이드→{경로, prompt_hash/d2_hash, 상태}. 원고 주석(`→ 생성됨:`)은 사람이 읽는 보조일 뿐, 소비 스킬은 manifest를 신뢰.
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:54:- 신규 스킬 `.claude/skills/visual-assets/SKILL.md`. image-gen/pub-d2-diagram은 이 스킬이 호출하는 엔진으로 유지(기존과 동일).
.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:61:- 영향: 설계 문서, CLAUDE.md, status 템플릿, course-pipeline, manuscript-final(자산 서술 이관), 신규 visual-assets 스킬, pub-d2-diagram. 기존 ch01 산출물은 재설계 후 새 순서로 재빌드(이번 재동기화가 사실상 그 시연).
.\templates\golden\storyboard_golden.html:482:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_http-request-response.d2</code></li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\templates\golden\storyboard_golden.html:645:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_webserver-was-role.d2</code></li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\templates\golden\storyboard_golden.html:746:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_springboot-embedded-server.d2</code></li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\templates\golden\storyboard_golden.html:1030:            <div class="block-content"><ul><li>D2 mini diagram:</li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\templates\golden\storyboard_golden.html:1337:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_request-to-controller.d2</code></li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\templates\golden\storyboard_golden.html:1454:            <div class="block-content"><ul><li>Reuse D2: <code>ch01_request-to-controller.d2</code>를 단순화하거나 정리용 아이콘 흐름도로 재사용.</li></ul></div>
.\docs\proposals\2026-07-06_d2-to-gpt-image-default.md:4:- 현행 `build_asset_manifest.py`는 슬라이드에 D2 블록이 있으면 D2를 무조건 주 시각자료로 삼고, 같은 슬라이드의 GPT 이미지를 `status: deferred, primary: false`로 강등한다(현재 코드 105~120행).
.\docs\proposals\2026-07-06_d2-to-gpt-image-default.md:9:- **A. manifest 빌더 로직 역전**: 이미지 프롬프트가 있으면 이미지가 primary가 기본. D2는 원고 Visual asset 필드에 `주 시각자료: D2`(또는 `Primary asset: D2`) 마커가 있거나, 이미지 프롬프트가 아예 없을 때만 primary.
.\docs\proposals\2026-07-06_d2-to-gpt-image-default.md:10:- **B. D2 엔진(pub-d2-diagram) 유지**: 삭제하지 않는다. opt-in 폴백 엔진으로 남긴다. 파괴적 변경 최소화, 되돌리기 용이.
.\docs\proposals\2026-07-06_d2-to-gpt-image-default.md:11:- **C. 소비 스킬 계약**: 소비 스킬은 슬라이드별 manifest `primary` 자산을 임베드한다(이미지 primary면 이미지, D2 primary면 D2).
.\docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:12:2. **stale 판정 = 해시 비교.** 각 슬라이드 자산에 `prompt_hash`/`d2_hash`/`source_hash` 저장. 원고 Visual asset 변경 시 바뀐 슬라이드 자산만 재생성, 후속 산출물도 해당 슬라이드만 stale 표시. → "전체 26장 재생성"이 아니라 "수정 2~3장".
.\docs\reviews\2026-07-05_typst-windows-dryrun.md:17:| 코드 | D2Coding v1.3.2 (Regular/Bold) | `github.com/naver/d2codingfont` 공식 릴리스 | SIL Open Font License 1.1 | 원본 브리프 계획대로 확보 성공 |
.\docs\reviews\2026-07-05_typst-windows-dryrun.md:116:  book.typ       # 프로젝트 템플릿 최소본 — book-title/color-primary 등 book_base.typ가 참조하는 변수 정의
.\docs\reviews\2026-07-06_d2-layout-debug.md:5:- 대상: pub-d2-diagram 렌더 파이프라인
.\docs\reviews\2026-07-06_d2-layout-debug.md:18:**파이프라인:** `render_md_diagrams.py` → `d2.exe --layout elk --pad 40` → sed 모노톤 → playwright PNG.
.\docs\reviews\2026-07-06_d2-layout-debug.md:35:`pub-d2-diagram/SKILL.md`: 레이아웃 dagre로 개정(elk 금지 사유 명기), direction right|down 가이드, 종횡비 3:1 가이드 유지.
.\docs\reviews\2026-07-06_asset-embed-margin-codex-review.md:17:- fit은 오버플로만 막음 — 초세로/초광폭은 "안 넘침"과 별개로 unreadable 가능. D2 생성 단계 종횡비 경고와 병행(이미 pub-d2 ≤3:1 가이드 있음).
.\courses\spring-boot-basic\assets\manifest.json:13:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:22:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:31:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:40:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:45:      "d2": {
.\courses\spring-boot-basic\assets\manifest.json:47:        "d2_hash": "aca763898ae3",
.\courses\spring-boot-basic\assets\manifest.json:54:        "primary": false
.\courses\spring-boot-basic\assets\manifest.json:63:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:72:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:77:      "d2": {
.\courses\spring-boot-basic\assets\manifest.json:79:        "d2_hash": "09131a2024a8",
.\courses\spring-boot-basic\assets\manifest.json:86:        "primary": false
.\courses\spring-boot-basic\assets\manifest.json:95:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:100:      "d2": {
.\courses\spring-boot-basic\assets\manifest.json:102:        "d2_hash": "e3c68946ad34",
.\courses\spring-boot-basic\assets\manifest.json:109:        "primary": false
.\courses\spring-boot-basic\assets\manifest.json:118:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:127:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:134:        "prompt_hash": "12bd847e5fd2",
.\courses\spring-boot-basic\assets\manifest.json:136:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:145:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:150:      "d2": {
.\courses\spring-boot-basic\assets\manifest.json:152:        "d2_hash": "1ca3767f01d7",
.\courses\spring-boot-basic\assets\manifest.json:159:        "primary": false
.\courses\spring-boot-basic\assets\manifest.json:168:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:177:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:186:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:195:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:200:      "d2": {
.\courses\spring-boot-basic\assets\manifest.json:202:        "d2_hash": "df2d560e7f22",
.\courses\spring-boot-basic\assets\manifest.json:209:        "primary": false
.\courses\spring-boot-basic\assets\manifest.json:218:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:227:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:236:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:245:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:254:        "primary": true
.\courses\spring-boot-basic\assets\manifest.json:263:        "primary": true
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:45:- 시각 자산 생성은 기존 엔진 스킬을 그대로 사용: `image-gen`(GPT 이미지 생성·교체), `pub-d2-diagram`(D2 모노톤 도형 렌더). 두 엔진은 이제 4단계 `visual-assets`가 호출한다(§3.0-A).
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:53:- 확정 원고의 Visual asset 필드를 스캔해 이미지 프롬프트를 image-gen의 `[IMAGE PROMPT]` 태그로 자동 변환(브릿지 내장) 후 image-gen 실행 → `assets/images/chNN/`. `` ```d2 `` 블록은 pub-d2-diagram으로 렌더 → `assets/diagrams/`.
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:69:- fit은 오버플로만 막는다 — 초세로/광폭이 unreadable할 만큼 작아지면 pub-d2-diagram의 종횡비(≤3:1) 경고와 병행해 자산 재배치를 유도한다.
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:196:- 외부 바이너리 `typst`, `pandoc` 설치 필요 (d2는 기존 pub-d2-diagram이 이미 사용).
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:204:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:214:**보존(엔진, 단 7·8절대로 재작성 대상 포함)**: `panseo-slide`(재작성), `panseo-board`, `edu-sim-builder`(재작성), `image-gen`, `pub-d2-diagram`, `참고스킬/` 백업 폴더.
.\courses\spring-boot-basic\manuscripts\ch01.md:204:- D2 diagram: `assets/diagrams/ch01_http-request-response.d2`
.\courses\spring-boot-basic\manuscripts\ch01.md:208:```d2
.\courses\spring-boot-basic\manuscripts\ch01.md:326:- 원본: `assets/diagrams/ch01_web-server-static.d2`
.\courses\spring-boot-basic\manuscripts\ch01.md:368:- D2 diagram: `assets/diagrams/ch01_webserver-was-role.d2`
.\courses\spring-boot-basic\manuscripts\ch01.md:373:```d2
.\courses\spring-boot-basic\manuscripts\ch01.md:472:- D2 diagram: `assets/diagrams/ch01_springboot-embedded-server.d2`
.\courses\spring-boot-basic\manuscripts\ch01.md:476:```d2
.\courses\spring-boot-basic\manuscripts\ch01.md:712:```d2
.\courses\spring-boot-basic\manuscripts\ch01.md:962:- D2 diagram: `assets/diagrams/ch01_request-to-controller.d2`
.\courses\spring-boot-basic\manuscripts\ch01.md:966:```d2
.\courses\spring-boot-basic\book\book.typ:16:#let color-primary = rgb("#2563eb")
.\courses\spring-boot-basic\book\book.typ:17:#let color-primary-dark = rgb("#1e3a8a")
.\courses\spring-boot-basic\book\book.typ:18:#let color-primary-light = rgb("#93b4e8")
.\courses\spring-boot-basic\book\book_base.typ:334:      #line(length: 40%, stroke: 2pt + color-primary)
.\courses\spring-boot-basic\book\book_base.typ:336:      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
.\courses\spring-boot-basic\book\book_base.typ:338:      #line(length: 60%, stroke: 0.5pt + color-primary-light)
.\courses\spring-boot-basic\assets\diagrams\ch01-d2-manifest.md:4:렌더 도구: `pub-d2-diagram` 스킬 방식 (D2 --layout elk --pad 40 → 모노톤 색상 치환 → PNG)
.\courses\spring-boot-basic\assets\diagrams\ch01-d2-manifest.md:5:d2 버전: v0.7.1 (`C:\Program Files\D2\d2.exe`)
.\courses\spring-boot-basic\assets\diagrams\ch01-d2-manifest.md:10:| Slide 5 (HTTP 요청-응답 구조) | `courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` | 브라우저 → HTTP 요청(GET /hello) → Spring Boot 서버 → HTTP 응답(200 OK + Hello) → 화면 표시. 원고 표기 경로 `assets/diagrams/ch01_http-request-response.d2`에 대응. |
.\courses\spring-boot-basic\assets\diagrams\ch01-d2-manifest.md:11:| Slide 8 (웹 서버 vs WAS 역할 비교) | `courses/spring-boot-basic/assets/diagrams/ch01-slide08-was.png` | 브라우저의 정적 요청(이미지/CSS)은 웹 서버가 직접 응답, 동적 요청(로그인/등록)은 WAS가 DB 조회/저장 후 응답. 원고 표기 경로 `assets/diagrams/ch01_webserver-was-role.d2`에 대응. |
.\courses\spring-boot-basic\assets\diagrams\ch01-d2-manifest.md:12:| Slide 10 (Spring Boot 내장 서버 시작 흐름) | `courses/spring-boot-basic/assets/diagrams/ch01-slide10-embedded.png` | 개발자 실행 → main()/SpringApplication.run → Spring 컨테이너 시작 → 내장 Tomcat 시작 → localhost:8080 요청 대기. 원고 표기 경로 `assets/diagrams/ch01_springboot-embedded-server.d2`에 대응. |
.\courses\spring-boot-basic\assets\diagrams\ch01-d2-manifest.md:14:| Slide 20 (요청→코드 전체 흐름) | `courses/spring-boot-basic/assets/diagrams/ch01-slide20-flow.png` | 브라우저(/hello 요청) → 내장 Tomcat → Spring MVC 요청 매핑 → HelloController.hello() → 응답(Hello Spring Boot) → 브라우저. 원고 표기 경로 `assets/diagrams/ch01_request-to-controller.d2`에 대응. |
.\courses\spring-boot-basic\panseo\ch01.html:24:    --line:#e2e6ee; --accent:#0a6fbd; --warn:#d21f3c; --gold:#a86e00; --green:#0b8a55;
.\courses\spring-boot-basic\panseo\ch01.html:58:  .thumb::after{content:"▶"; position:absolute; top:8px; right:10px; color:#d21f3c; font-size:14px;}
.\courses\spring-boot-basic\panseo\ch01.html:74:    box-shadow:inset 0 0 0 14px #5a3d24, inset 0 0 0 16px #3a2614, inset 0 0 120px rgba(0,0,0,.5);}
.\courses\spring-boot-basic\panseo\ch01.html:800:    <div class="swatch" style="background:#ffd25c" data-c="#ffd25c"></div>
.\courses\spring-boot-basic\storyboards\ch01.html:527:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_http-request-response.d2</code></li><li>시각자료 프롬프트(영문): <code>A D2 flow diagram showing browser, HTTP request </code>GET /hello<code>, Spring Boot server, HTTP response </code>200 OK + Hello<code>, and the browser displaying the result.</code></li><li>시각자료 프롬프트(국문): 브라우저, HTTP 요청 <code>GET /hello</code>, Spring Boot 서버, HTTP 응답 <code>200 OK + Hello</code>, 화면 표시로 이어지는 D2 흐름도. 요청과 응답이 왕복한다는 점을 강조한다. D2 흐름은 가로 방향으로 단순하게 유지한다. 요청과 응답을 서로 다른 메시지 상자로 강조하고, 상태 코드는 서버 상자와 분리해서 눈에 띄게 배치한다.</li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\courses\spring-boot-basic\storyboards\ch01.html:643:            <div class="block-content"><ul><li>유형: D2 diagram</li><li>원본: <code>assets/diagrams/ch01_web-server-static.d2</code></li><li>렌더 결과: <code>assets/diagrams/ch01_web-server-static.svg</code></li><li>설명: 웹 서버가 정적 파일 요청을 처리하고 동적 요청을 WAS로 위임하는 흐름.</li><li>시각자료 프롬프트(영문): <code>A D2 diagram where the web server directly serves static files such as HTML, CSS, JavaScript, and images, while forwarding dynamic requests to a WAS.</code></li><li>시각자료 프롬프트(국문): 웹 서버가 HTML, CSS, JavaScript, 이미지 같은 정적 파일 요청은 직접 처리하고, 동적 처리가 필요한 요청은 WAS로 넘기는 구조를 보여주는 D2 다이어그램. 정적 파일 직접 처리와 동적 요청 위임을 분리해서 보여준다. 한쪽에는 파일 캐비닛이나 정적 리소스 폴더를 두고, 다른 쪽에는 WAS로 넘기는 화살표를 명확히 둔다</li></ul></div>
.\courses\spring-boot-basic\storyboards\ch01.html:690:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_webserver-was-role.d2</code></li><li>렌더 결과: <code>assets/diagrams/ch01_webserver-was-role.svg</code></li><li>시각자료 프롬프트(영문): <code>A D2 role-comparison diagram showing static resource requests handled by the web server and dynamic business requests handled by the WAS with database access.</code></li><li>시각자료 프롬프트(국문): 정적 리소스 요청은 웹 서버가 처리하고, 로그인/등록 같은 동적 비즈니스 요청은 WAS가 DB와 연동해 처리하는 역할 비교 D2 다이어그램. WAS 내부를 Controller, Service, Repository, DB 연결이 있는 처리 공간으로 표현한다. 웹 서버의 단순 정적 응답 흐름과 대비되도록 구성한다.</li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\courses\spring-boot-basic\storyboards\ch01.html:799:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_springboot-embedded-server.d2</code></li><li>시각자료 프롬프트(영문): <code>A D2 diagram showing a developer running </code>main()<code>, </code>SpringApplication.run<code>, Spring container startup, embedded Tomcat startup, and </code>localhost:8080<code> becoming ready.</code></li><li>시각자료 프롬프트(국문): 개발자가 <code>main()</code>을 실행하면 <code>SpringApplication.run</code>, Spring 컨테이너 시작, 내장 Tomcat 시작, <code>localhost:8080</code> 요청 대기 상태로 이어지는 D2 흐름도. Spring Boot 애플리케이션 상자 안에 애플리케이션 코드, Spring 컨텍스트, 내장 Tomcat이 함께 들어 있는 구조로 표현한다. 마지막 상태는 <code>localhost:8080</code> 요청 대기로 명확히 연결한다.</li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\courses\spring-boot-basic\storyboards\ch01.html:1039:            <div class="block-content"><ul><li>D2 mini diagram:</li><li>시각자료 프롬프트(영문): <code>A compact D2 diagram showing </code>Web MVC starter<code> leading to </code>Spring Boot auto-configuration<code>, which prepares </code>Spring MVC<code> and </code>embedded Tomcat<code>.</code></li><li>시각자료 프롬프트(국문): <code>Web MVC 스타터</code>가 <code>Spring Boot 자동 설정</code>으로 이어지고, 그 결과 <code>Spring MVC</code>와 <code>내장 Tomcat</code> 구성이 준비되는 미니 D2 도식. 스타터가 자동 설정의 단서가 된다는 점을 강조한다. Spring Boot가 클래스패스를 읽고 Spring MVC 요청 매핑과 내장 Tomcat 실행 환경을 준비하는 순서로 보여준다.</li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\courses\spring-boot-basic\storyboards\ch01.html:1312:            <div class="block-content"><ul><li>D2 diagram: <code>assets/diagrams/ch01_request-to-controller.d2</code></li><li>시각자료 프롬프트(영문): <code>A D2 end-to-end request flow: browser </code>/hello<code> request, embedded Tomcat, Spring MVC request mapping, </code>HelloController.hello()<code>, and the HTTP response.</code></li><li>시각자료 프롬프트(국문): 브라우저의 <code>/hello</code> 요청이 내장 Tomcat, Spring MVC 요청 매핑, <code>HelloController.hello()</code>를 거쳐 HTTP 응답으로 돌아오는 전체 D2 흐름도. 브라우저, 내장 Tomcat, Spring MVC 매핑, Controller 메서드, 응답을 순차적으로 배치한다. 화살표 방향은 하나로 유지하고 코드 라벨은 읽기 쉽게 한다.</li></ul><pre class="asset-code"><code class="language-d2">direction: right
.\courses\spring-boot-basic\simulators\ch01_http-request-flow.html:29:  .grid2{display:grid;grid-template-columns:1fr 360px;gap:18px;align-items:start;}
.\courses\spring-boot-basic\simulators\ch01_http-request-flow.html:30:  @media(max-width:1024px){.grid2{grid-template-columns:1fr;}}
.\courses\spring-boot-basic\simulators\ch01_http-request-flow.html:108:  <div class="grid2">
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:7:**Architecture:** manifest 빌더(`scripts/build_asset_manifest.py`)의 "주 시각자료" 선택 로직을 역전한다 — 이미지 프롬프트가 있으면 GPT 이미지가 기본 primary, D2는 원고 Visual asset 필드에 `주 시각자료: D2` opt-in 마커가 있거나 이미지 프롬프트가 아예 없을 때만 primary가 된다. manifest.json은 여전히 SSOT이고 소비 스킬은 슬라이드별 `primary` 자산을 임베드한다. 하네스 구조 변경이므로 CLAUDE.md 유지 규칙대로 proposal + codex 사전검증을 먼저 거친다. 그다음 ch01 콘텐츠를 새 규약으로 재빌드한다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:14:- **manifest.json은 SSOT — 손으로 편집 금지**: 항상 `python scripts/build_asset_manifest.py <course_dir> <chNN>`로 재생성한다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:26:- `docs/proposals/2026-07-06_d2-to-gpt-image-default.md` — 재설계 제안서 (신규)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:27:- `docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md` — codex 사전검증 결과 (신규)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:28:- `scripts/build_asset_manifest.py` — 주 시각자료 선택 로직 역전 (수정)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:29:- `tests/test_build_asset_manifest.py` — 빌더 단위테스트 (신규)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:32:- `.claude/skills/storyboard/SKILL.md`, `.claude/skills/ppt-preview/SKILL.md`, `.claude/skills/pptx-build/SKILL.md`, `.claude/skills/panseo-slide/SKILL.md`, `.claude/skills/book-build/SKILL.md` — "manifest `primary` 자산을 임베드" 계약 문구 (수정)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:33:- `CLAUDE.md` — 보조 엔진 설명에서 pub-d2-diagram을 "opt-in 폴백"으로 명시 (수정)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:49:- Create: `docs/proposals/2026-07-06_d2-to-gpt-image-default.md`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:56:아래 내용으로 `docs/proposals/2026-07-06_d2-to-gpt-image-default.md`를 생성한다:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:62:- 현행 `build_asset_manifest.py`는 슬라이드에 D2 블록이 있으면 D2를 무조건 주 시각자료로 삼고, 같은 슬라이드의 GPT 이미지를 `status: deferred, primary: false`로 강등한다(현재 코드 105~120행).
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:67:- **A. manifest 빌더 로직 역전**: 이미지 프롬프트가 있으면 이미지가 primary가 기본. D2는 원고 Visual asset 필드에 `주 시각자료: D2`(또는 `Primary asset: D2`) 마커가 있거나, 이미지 프롬프트가 아예 없을 때만 primary.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:68:- **B. D2 엔진(pub-d2-diagram) 유지**: 삭제하지 않는다. opt-in 폴백 엔진으로 남긴다. 파괴적 변경 최소화, 되돌리기 용이.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:69:- **C. 소비 스킬 계약**: 소비 스킬은 슬라이드별 manifest `primary` 자산을 임베드한다(이미지 primary면 이미지, D2 primary면 D2).
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:85:git add docs/proposals/2026-07-06_d2-to-gpt-image-default.md
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:94:- Create: `docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:97:- Consumes: `docs/proposals/2026-07-06_d2-to-gpt-image-default.md` (Task 1)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:105:codex exec --sandbox read-only 'docs/proposals/2026-07-06_d2-to-gpt-image-default.md 제안을 검토하라. scripts/build_asset_manifest.py의 현재 D2 우선 로직(105~120행)과 slide_covered 집계(123~135행)를 읽고, 제안대로 이미지 primary 기본 + D2 opt-in 마커로 역전할 때 (1) 기존 D2-only 슬라이드 회귀 여부 (2) 이미지 미생성 슬라이드가 missing으로 뜨는 게 하드 게이트와 정합한지 (3) 소비 스킬이 primary를 읽는 계약의 빈틈을 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:112:codex 출력 전문을 `docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md`에 붙여넣고, 맨 위에 한 줄 결론(승인/조건부 승인 + 반영할 조건)을 요약한다. 조건부 승인이면 그 조건을 Phase B~D 해당 Task에 반영한다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:117:git add docs/reviews/2026-07-06_d2-to-gpt-image-default-codex-review.md
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:125:### Task 3: 이미지 primary 기본 + D2 opt-in 마커
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:128:- Create: `tests/test_build_asset_manifest.py`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:129:- Modify: `scripts/build_asset_manifest.py` (parse_visual_assets, build_manifest 슬라이드 루프, slide_covered)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:133:- Produces: `build_manifest(course_dir, ch) -> (manifest_dict, out_path)`. manifest 슬라이드 엔트리의 `image`/`d2` 블록 각각에 `status`(`present`/`deferred`/`missing`)와 `primary`(bool) 필드. 주 시각자료 선택 규칙: `주 시각자료: D2` 마커 있고 D2 있으면 D2 primary, 아니면 이미지 프롬프트 있으면 이미지 primary, 둘 다 아니면 D2 primary(이미지 프롬프트 없는 D2-only). `slide_covered`는 primary 자산이 present여야 커버로 센다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:137:`tests/test_build_asset_manifest.py`를 생성한다:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:144:import build_asset_manifest as bam
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:147:def _make_course(tmp_path, slide_md, *, img=False, d2=False):
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:156:    if d2:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:161:_D2_FENCE = "```d2\nbrowser -> server\n```"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:193:    course = _make_course(tmp_path, _BOTH, img=True, d2=True)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:196:    assert s["image"]["primary"] is True
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:198:    assert s["d2"]["primary"] is False
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:202:def test_d2_opt_in_marker_makes_d2_primary(tmp_path):
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:203:    course = _make_course(tmp_path, _BOTH_D2_OPTIN, img=True, d2=True)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:206:    assert s["d2"]["primary"] is True
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:207:    assert s["image"]["primary"] is False
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:210:def test_d2_only_slide_keeps_d2_primary(tmp_path):
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:211:    course = _make_course(tmp_path, _D2_ONLY, img=False, d2=True)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:215:    assert s["d2"]["primary"] is True
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:216:    assert s["d2"]["status"] == "present"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:222:    course = _make_course(tmp_path, _BOTH, img=False, d2=True)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:225:    assert s["image"]["primary"] is True
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:232:Run: `python -m pytest tests/test_build_asset_manifest.py -v`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:233:Expected: `test_image_is_primary_by_default`, `test_d2_opt_in_marker_makes_d2_primary`, `test_ungenerated_image_reads_missing_not_deferred` 가 FAIL (현재 빌더는 D2 우선이라 image.primary=False, d2 primary 키 없음). `test_d2_only_slide_keeps_d2_primary`는 통과할 수도 있으나 d2에 `primary` 키가 없어 KeyError로 FAIL.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:237:`scripts/build_asset_manifest.py`에서 `IMG_PROMPT_RE` 정의 바로 아래에 추가한다:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:241:D2_PRIMARY_RE = re.compile(r"(?:주\s*시각자료|primary\s*asset)\s*[:：]\s*d2", re.IGNORECASE)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:247:            out[cur] = {"prompt": None, "d2": None, "d2_primary": False, "_va": ""}
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:256:                out[cur]["d2_primary"] = True
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:272:        has_d2 = bool(info["d2"])
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:275:        d2_matches = sorted(dia_dir.glob(f"{ch}-slide{num:02d}-*.png")) if (has_d2 and dia_dir.exists()) else []
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:276:        d2_file_ok = bool(d2_matches) and d2_matches[0].stat().st_size > 0
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:280:        # 주 시각자료 선택: 기본은 GPT 이미지. D2는 opt-in 마커가 있거나 이미지 프롬프트가 없을 때만 primary.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:281:        if info["d2_primary"] and has_d2:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:282:            primary = "d2"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:284:            primary = "image"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:285:        elif has_d2:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:286:            primary = "d2"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:288:            primary = None
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:290:        if has_d2:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:291:            entry["d2"] = {
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:292:                "path": f"assets/diagrams/{d2_matches[0].name}" if d2_matches else None,
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:293:                "d2_hash": _hash(info["d2"]),
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:294:                "status": "present" if d2_file_ok else ("deferred" if primary != "d2" else "missing"),
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:295:                "primary": primary == "d2",
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:301:                "status": "present" if img_file_ok else ("deferred" if primary != "image" else "missing"),
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:302:                "primary": primary == "image",
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:307:- [ ] **Step 5: slide_covered 를 primary 기준으로 교체**
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:309:`build_manifest`의 `def slide_covered(s):` 함수 본문(현재 124~131행)을 아래로 교체한다:
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:312:    def slide_covered(s):
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:313:        # 주 시각자료(primary)가 present면 커버됨
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:314:        for k in ("image", "d2"):
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:316:            if a and a.get("primary") and a.get("status") == "present":
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:319:        return "d2" not in s and "image" not in s
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:324:Run: `python -m pytest tests/test_build_asset_manifest.py -v`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:330:git add scripts/build_asset_manifest.py tests/test_build_asset_manifest.py
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:344:- Consumes: Task 3의 빌더 규약(이미지 primary 기본, `주 시각자료: D2` 마커)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:355:- 원고의 ` ```d2 ` 코드펜스는 `pub-d2-diagram`의 `scripts/render_md_diagrams.py <원고.md> <images_dir> <접두사>`가 그대로 인식한다(변환 불필요) — ELK 레이아웃 + 모노톤 치환까지 자동, **SVG로 저장**한다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:363:- **기본은 이미지 primary**: 이미지 프롬프트가 있으면 `image.primary = true`, D2는 있어도 `d2.primary = false`(폴백 소스로 보존, status는 파일 있으면 present·없으면 deferred). 원고에 `주 시각자료: D2` 마커가 있는 슬라이드만 `d2.primary = true`가 되고 이미지가 `deferred`로 강등된다. 이미지 프롬프트가 아예 없는 D2-only 슬라이드는 D2가 primary다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:371:- [ ] **D2 파일명 계약(opt-in 슬라이드 한정)**: `주 시각자료: D2` 마커로 실제 렌더한 D2 산출물이 있다면 `assets/diagrams/{chNN}-slide{NN}-*.png` 형식(슬라이드 번호 포함, PNG)으로 저장돼 있다(§3 리네임 누락 없음). 이미지 primary 슬라이드는 D2 렌더가 없어도 무방하다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:402:**주 시각자료 규칙(중요)**: 한 슬라이드에 이미지 프롬프트와 D2를 함께 둘 수 있으나, **기본 주 시각자료는 GPT 이미지**다. 소비물(스토리보드·PPT·판서·PPTX·책)은 manifest의 `primary` 자산을 임베드하며, 이미지 프롬프트가 있으면 이미지가 primary가 된다. 특정 슬라이드에서 D2를 주 시각자료로 쓰려면 Visual asset 필드에 `- 주 시각자료: D2` 한 줄을 넣는다. D2 코드펜스만 있고 이미지 프롬프트가 없는 슬라이드는 D2가 자동으로 primary다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:414:### Task 6: 소비 스킬 5종 — "manifest primary 자산 임베드" 계약
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:424:- Consumes: Task 3 manifest `primary` 필드
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:425:- Produces: 각 소비 스킬이 슬라이드별 primary 자산을 임베드한다는 계약 문구
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:429:Run: `grep -rn "manifest\|primary\|assets/diagrams\|assets/images\|D2\|시각자료\|Visual asset" .claude/skills/storyboard/SKILL.md .claude/skills/ppt-preview/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/panseo-slide/SKILL.md .claude/skills/book-build/SKILL.md`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:432:- [ ] **Step 2: 5개 파일 각각에 primary 계약 문장 추가**
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:437:**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며, `d2.primary=true`인 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:443:(pptx-build는 원고를 직접 파싱하되, 이미지 경로는 manifest의 primary와 일치해야 한다 — D2 primary 슬라이드는 원고에 `주 시각자료: D2` 마커 + D2 PNG 경로가 있어야 한다.)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:450:git commit -m "docs(consumers): 소비 스킬 5종 manifest primary 자산 임베드 계약 명시"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:455:### Task 7: CLAUDE.md — pub-d2-diagram을 opt-in 폴백으로 명시
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:469:- `pub-d2-diagram` — D2 모노톤 도형 렌더 (주 호출자: `visual-assets`)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:475:- `pub-d2-diagram` — D2 모노톤 도형 렌더 (opt-in 폴백 엔진 — 기본 시각자산은 GPT 이미지, 원고에 `주 시각자료: D2` 마커가 있는 슬라이드에서만 `visual-assets`가 호출)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:482:git commit -m "docs(CLAUDE): pub-d2-diagram을 opt-in 폴백 엔진으로 명시"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:533:Run: `grep -n "시각자료 프롬프트(영문)" courses/spring-boot-basic/manuscripts/ch01.md | grep -i "d2"`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:549:- Temp: 세션 스크래치 디렉터리의 `.tmp_ch01_d2repl.md`(실행 후 삭제)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:557:스크래치 디렉터리에 `.tmp_ch01_d2repl.md`를 만들고, 슬라이드 05·08·10·15·20 각각에 대해 Task 8의 영문 프롬프트로 아래 블록을 담는다(원고 `ch01.md`에는 절대 삽입하지 않는다):
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:571:Run (background): `python .claude/skills/image-gen/scripts/image_gen.py <스크래치>/.tmp_ch01_d2repl.md courses/spring-boot-basic`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:581:Run: `rm <스크래치>/.tmp_ch01_d2repl.md && grep -c "IMAGE PROMPT" courses/spring-boot-basic/manuscripts/ch01.md`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:601:### Task 10: manifest 재생성 + 이미지 primary 검증
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:608:- Produces: 5개 슬라이드가 `image.primary=true, status=present`인 manifest (소비 재빌드의 SSOT)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:612:Run: `python scripts/build_asset_manifest.py courses/spring-boot-basic ch01`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:615:- [ ] **Step 2: 5개 슬라이드 primary 검증**
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:617:Run: `python -c "import json; m=json.load(open('courses/spring-boot-basic/assets/manifest.json',encoding='utf-8')); [print(s['slide'], s.get('image',{}).get('status'), s.get('image',{}).get('primary'), s.get('d2',{}).get('primary')) for s in m['slides'] if s['slide'] in (5,8,10,15,20)]"`
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:618:Expected 각 줄: `<slide> present True False` — 이미지 present·primary, D2 not primary.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:629:git commit -m "content(ch01): manifest 재생성 — 05·08·10·15·20 이미지 primary"
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:644:- Consumes: Task 10 manifest(이미지 primary)
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:649:`storyboard` 스킬을 ch01에 대해 재실행한다(Task 6 계약대로 manifest primary 임베드). 05·08·10·15·20 카드가 `assets/images/ch01/slideNN.png`를 참조하도록 갱신.
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:677:`book-build` 스킬을 ch01에 대해 재실행한다(삽화가 D2 5 대신 GPT 이미지를 쓰도록 manifest primary 참조).
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:731:- D2 opt-in 유지(마커 + pub-d2-diagram 존치) → Task 3(마커), Task 7(엔진 존치 명시) ✅
.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:740:**3. Type consistency:** manifest 필드명 `primary`/`status`/`path`/`prompt_hash`/`d2_hash`가 Task 3(정의)·Task 6(소비 계약)·Task 10(검증) 전반에서 일치. opt-in 마커 문자열 `주 시각자료: D2`가 Task 3(정규식)·Task 4·5(문서)·Task 6(pptx 단서)에서 동일. 경로 계약 `assets/images/{chNN}/slide{NN}.png`, `assets/diagrams/{chNN}-slide{NN}-*.png` 전 Task 일치.
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:9:**Tech Stack:** Claude Code 스킬(md), Python 3 + python-pptx, Typst + Pandoc(책 조판), 기존 엔진 스킬(panseo-slide 판서 엔진, edu-sim-builder, image-gen, pub-d2-diagram).
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:104:주의: `.claude/skills/panseo-slide`, `panseo-board`, `edu-sim-builder`, `image-gen`, `pub-d2-diagram`, `참고스킬/`은 **삭제 금지**.
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:111:@('.claude/skills/panseo-slide','.claude/skills/edu-sim-builder','.claude/skills/image-gen','.claude/skills/pub-d2-diagram','.claude/skills/panseo-board') | ForEach-Object { if (-not (Test-Path $_)) { Write-Error "ENGINE SKILL LOST: $_" } }
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:244:  - Visual asset 하위 유형: `GPT image prompt:`(백틱 프롬프트), D2 초안(```d2 코드펜스), 화면 캡처 계획, 코드 블록
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:288:  3. 시각 자산 확정 지원: 사용자가 원하면 `image-gen` 스킬로 `GPT image prompt` 실생성 → `assets/images/chNN/`, `pub-d2-diagram` 스킬로 D2 렌더 → `assets/diagrams/`. 생성된 파일 경로를 해당 슬라이드 Visual asset에 병기
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:296:Select-String -LiteralPath .claude/skills/manuscript-final/SKILL.md -Pattern '^name: manuscript-final', 'image-gen', 'pub-d2-diagram', '확정 체크리스트' | ForEach-Object Line
.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:834:  - D2Coding: https://github.com/naver/d2codingfont 릴리스 zip에서 `D2Coding-*.ttf` 추출

codex
현재 코드상 집계는 “어떤 자산이든 present면 커버”라서, 제안처럼 `primary` 기준으로 하드 게이트를 세우려면 집계 함수도 같이 바뀌어야 합니다. 이제 실제 manifest와 소비 문서/스킬 쪽이 같은 계약을 이미 쓰는지 확인하겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'scripts/build_asset_manifest.py' | ForEach-Object { "'$i++; if ($i -ge 1 -and $i -le 89) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg --files .claude 2>$null' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "manifest|primary|assets/diagrams|assets/images|D2|시각자료|Visual asset" .claude/skills docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md scripts 2>$null' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$m = Get-Content -Raw -Path '"'courses/spring-boot-basic/assets/manifest.json' | ConvertFrom-Json; "'$m.slides | Where-Object { $_.d2 -or $_.image } | Select-Object slide,@{n='"'imageStatus';e={"'$_.image.status}},@{n='"'imagePrimary';e={"'$_.image.primary}},@{n='"'d2Status';e={"'$_.d2.status}},@{n='"'d2Primary';e={"'$_.d2.primary}} | Format-Table -AutoSize' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1683ms:
.claude\skills\pptx-build\SKILL.md
.claude\skills\manuscript-final\SKILL.md
.claude\skills\visual-assets\SKILL.md
.claude\skills\pub-d2-diagram\SKILL.md
.claude\skills\edu-sim-builder\SKILL.md
.claude\skills\image-gen\SKILL.md
.claude\skills\ppt-preview\SKILL.md
.claude\skills\practice-code\SKILL.md
.claude\skills\storyboard\SKILL.md
.claude\skills\course-outline\SKILL.md
.claude\skills\book-build\SKILL.md
.claude\skills\manuscript-draft\SKILL.md
.claude\skills\course-pipeline\SKILL.md
.claude\skills\edu-sim-builder\references\pedagogy.md
.claude\skills\edu-sim-builder\references\design-system.md
.claude\skills\edu-sim-builder\references\build-recipe.md
.claude\skills\edu-sim-builder\references\requesting.md
.claude\skills\edu-sim-builder\references\verification.md
.claude\skills\panseo-board\SKILL.md
.claude\skills\panseo-slide\template\board_template.html
.claude\skills\panseo-slide\SKILL.md
.claude\skills\panseo-slide\template\board_template_light.html
.claude\skills\pub-d2-diagram\scripts\render_md_diagrams.py
.claude\skills\image-gen\scripts\test_image_gen.py
.claude\skills\image-gen\scripts\spike_codex.md
.claude\skills\image-gen\scripts\plot_gen.py
.claude\skills\image-gen\scripts\image_gen.py
.claude\skills\panseo-slide\reference\engine.md
.claude\skills\panseo-slide\reference\components.md
.claude\skills\panseo-slide\reference\script_guide.md
.claude\skills\panseo-board\template\board_template.html
.claude\skills\humanizer\SKILL.md
.claude\skills\panseo-board\reference\tools.md
.claude\skills\edu-sim-builder\assets\template.html
.claude\skills\manuscript-draft\references\manuscript-schema.md
.claude\skills\book-build\references\build-pipeline.md
.claude\skills\book-build\references\style.md
.claude\skills\book-build\references\storytelling.md
.claude\skills\humanizer\examples\before-2.md
.claude\skills\humanizer\examples\before-1.md
.claude\skills\humanizer\examples\after-2.md
.claude\skills\humanizer\examples\after-1.md
.claude\skills\humanizer\references\spacing-patterns.md
.claude\skills\humanizer\references\punctuation-patterns.md
.claude\skills\humanizer\references\pos-patterns.md
.claude\skills\humanizer\references\structure-patterns.md
.claude\skills\humanizer\references\vocabulary-patterns.md
.claude\skills\book-build\references\scripts\paragraph-gap.lua
.claude\skills\book-build\references\scripts\typst_builder.py
.claude\skills\book-build\references\templates\book_base.typ
.claude\skills\book-build\references\fonts\KoPubWorld-Batang-Bold.otf
.claude\skills\book-build\references\fonts\D2CodingBold-Ver1.3.2-20180524.ttf
.claude\skills\book-build\references\fonts\D2Coding-Ver1.3.2-20180524.ttf
.claude\skills\book-build\references\fonts\KoPubWorld-Batang-Medium.otf
.claude\skills\book-build\references\fonts\KoPubWorld-LICENSE.md

 succeeded in 1699ms:
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:34:| 4 | `visual-assets` (신규) | `assets/images/chNN/`, `assets/diagrams/`, `assets/manifest.json` | 생성(지금/deferred 선택) → 확인 |
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:45:- 시각 자산 생성은 기존 엔진 스킬을 그대로 사용: `image-gen`(GPT 이미지 생성·교체), `pub-d2-diagram`(D2 모노톤 도형 렌더). 두 엔진은 이제 4단계 `visual-assets`가 호출한다(§3.0-A).
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:53:- 확정 원고의 Visual asset 필드를 스캔해 이미지 프롬프트를 image-gen의 `[IMAGE PROMPT]` 태그로 자동 변환(브릿지 내장) 후 image-gen 실행 → `assets/images/chNN/`. `` ```d2 `` 블록은 pub-d2-diagram으로 렌더 → `assets/diagrams/`.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:56:- **해시 기반 부분 재생성**: 원고 Visual asset의 프롬프트/D2 소스가 바뀌면 그 슬라이드의 해시만 불일치 → `visual-assets`가 그 슬라이드 자산만 재생성한다(전체 재생성 금지, `.claude/skills/visual-assets/SKILL.md` §7). 후속 산출물(스토리보드 등)도 그 슬라이드만 다시 만들면 된다.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:57:- 결과: 이후 5~11단계(코드/스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)는 **원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로**를 읽어 자산을 임베드한다(소비 계약, 각 스킬 SKILL.md 참조) — 재동기화 폭포(자산을 나중에 만들어 소비 산출물을 전부 다시 만드는 문제)를 제거하기 위한 핵심 변경.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:58:- 코드/캡처형 자산(화면 캡처 등 실행 결과가 필요한 자산)은 예외적으로 `practice-code`(5단계) 이후 finalize substage에서 처리한다(image/D2는 원고확정 직후 착수).
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:62:시각자산(image/D2)이 소비 산출물(PPTX·스토리보드·PPT프리뷰·판서·책)에 임베드될 때, **컨테이너를 꽉 채우지 않고 여백을 남긴다(fit-in-box).** 자산은 지정 박스 안에 종횡비를 유지한 채(width·height 둘 다 상한) 들어가고 가장자리에 닿지 않는다 — 세로형/광폭 자산이 슬라이드·페이지를 벗어나는 오버플로를 원천 차단한다.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:98:│   ├── diagrams/             # D2 소스 + 렌더 PNG
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:99:│   └── manifest.json         # 시각자산 SSOT (슬라이드→경로/해시/상태, visual-assets 소유)
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:147:  - `Visual asset` — GPT 이미지 프롬프트 / D2 다이어그램 초안 / 화면 캡처 계획 / 코드 블록
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:155:- **시각 자산 생성과의 분리(2026-07-06 개정)**: `manuscript-final`은 Visual asset 필드의 프롬프트/D2 소스 문구를 다듬는 것까지만 책임진다. 실제 이미지/D2 렌더 생성과 `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets`(§3.0-A)가 전담한다 — 원고확정 시점에는 자산이 아직 없어도 확정할 수 있다.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:166:**시각 자산 소비(2026-07-06 개정)**: 그대로 모드는 `ppt_previews/chNN.html`의 DOM(이미지 포함)을 그대로 이식하므로, 실자산 여부는 그 상위 단계인 `ppt-preview`가 `assets/manifest.json`을 읽어 이미 반영한 상태를 그대로 물려받는다(panseo-slide 자신이 manifest를 직접 읽지 않는다 — 간접 소비).
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:171:- **원고 연동 입력 계약**: 확정 원고의 해당 슬라이드(비유·나레이션·Visual asset)를 자동으로 읽어 시뮬레이터 설계에 반영.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:178:- 슬라이드 본문: 제목, 짧은 문구, 이미지(assets), D2 렌더 PNG, 핵심 코드.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:185:책은 원고의 나레이션·비유·이미지·D2 도형·실습·평가문항을 씨앗으로 삼아 **소설처럼 이야기 형태로 재집필**한다. `https://github.com/edu-openskill/lecture-book-workflow.git`(집필에이전트 v5)에서 다음 3덩어리를 이식한다:
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:195:- 본문 폰트 RIDIBatang·코드 D2Coding: Windows에 설치하거나 무료 대체 폰트(KoPubWorld바탕 등) 선정 — 구현 시 사용자와 확정.
docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:204:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
scripts\annotate_manuscript_assets.py:1:"""원고 Visual asset 필드에 manifest의 확정 자산 경로를 병기(주석).
scripts\annotate_manuscript_assets.py:3:visual-assets 스테이지의 일부. manifest.json에서 슬라이드별 present 자산을 읽어,
scripts\annotate_manuscript_assets.py:4:원고(manuscripts/chNN.md)의 해당 `**Visual asset**` 블록 끝에
scripts\annotate_manuscript_assets.py:5:`→ 생성됨: <path>`(이미지) / `→ 렌더됨: <path>`(D2) 한 줄을 삽입한다.
scripts\annotate_manuscript_assets.py:7:- manifest가 SSOT이고 이 주석은 사람이 읽는 보조 표기(+ build_pptx의 IMG_PATH_RE가 잡는 용도).
scripts\annotate_manuscript_assets.py:21:    manifest = json.loads((course / "assets" / "manifest.json").read_text(encoding="utf-8"))
scripts\annotate_manuscript_assets.py:22:    by_slide = {s["slide"]: s for s in manifest["slides"]}
scripts\annotate_manuscript_assets.py:29:    field_re = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
scripts\annotate_manuscript_assets.py:44:        """Visual asset 블록 buffer 끝에 주석을 삽입(중복 제거)."""
scripts\annotate_manuscript_assets.py:70:            # 이전 Visual asset 블록 종료 처리
scripts\annotate_manuscript_assets.py:77:            in_va = (f.group(1) == "Visual asset")
scripts\build_asset_manifest.py:1:"""시각자산 manifest 빌더 — 재설계(visual-assets 스테이지)의 SSOT 생성기.
scripts\build_asset_manifest.py:3:원고(manuscripts/chNN.md)의 슬라이드별 Visual asset(이미지 프롬프트 / D2 소스)을 스캔하고,
scripts\build_asset_manifest.py:4:실제 생성된 자산 파일(assets/images/chNN/, assets/diagrams/)과 대조해
scripts\build_asset_manifest.py:5:courses/{id}/assets/manifest.json 을 만든다.
scripts\build_asset_manifest.py:7:manifest 스키마(슬라이드별):
scripts\build_asset_manifest.py:10:    "image": {"path": "assets/images/ch01/slide05.png", "prompt_hash": "...", "status": "present|missing"},
scripts\build_asset_manifest.py:11:    "d2":    {"path": "assets/diagrams/ch01-slide05-http.png", "d2_hash": "...", "status": "present|missing"}
scripts\build_asset_manifest.py:17:  python scripts/build_asset_manifest.py <course_dir> <chNN>
scripts\build_asset_manifest.py:18:  예: python scripts/build_asset_manifest.py courses/spring-boot-basic ch01
scripts\build_asset_manifest.py:27:FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
scripts\build_asset_manifest.py:29:IMG_PROMPT_RE = re.compile(r"(?:image prompt|시각자료 프롬프트\(영문\))\s*[:：]\s*`?(.+)", re.IGNORECASE)
scripts\build_asset_manifest.py:37:    """슬라이드별 Visual asset 내용을 추출. return {slide_num: {"prompt": str|None, "d2": str|None}}"""
scripts\build_asset_manifest.py:48:                if field == "Visual asset" and fence_lang == "d2":
scripts\build_asset_manifest.py:73:        if field == "Visual asset":
scripts\build_asset_manifest.py:83:def build_manifest(course_dir, ch):
scripts\build_asset_manifest.py:94:        # D2 먼저 판정 (D2가 있으면 그 슬라이드의 주 시각자료)
scripts\build_asset_manifest.py:98:            d2_path = f"assets/diagrams/{matches[0].name}" if matches else None
scripts\build_asset_manifest.py:105:        # 이미지: D2가 주 시각자료인 슬라이드에서 이미지가 없으면 deferred(중복 불필요)
scripts\build_asset_manifest.py:107:            img_path = f"assets/images/{ch}/slide{num:02d}.png"
scripts\build_asset_manifest.py:112:                status = "deferred"   # D2로 대체 — 생성 불필요
scripts\build_asset_manifest.py:119:                "primary": not d2_present,   # 이 슬라이드의 주 시각자료인가
scripts\build_asset_manifest.py:123:    # 슬라이드별 "주 시각자료 확보" 여부로 집계 (deferred는 결핍 아님)
scripts\build_asset_manifest.py:125:        # D2 present 또는 image present면 커버됨
scripts\build_asset_manifest.py:130:        # 시각자료 필드가 아예 없는 슬라이드(코드/평가)는 커버 대상 아님
scripts\build_asset_manifest.py:137:    manifest = {
scripts\build_asset_manifest.py:144:    out_path = course / "assets" / "manifest.json"
scripts\build_asset_manifest.py:146:    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
scripts\build_asset_manifest.py:147:    return manifest, out_path
scripts\build_asset_manifest.py:152:        print("usage: python scripts/build_asset_manifest.py <course_dir> <chNN>")
scripts\build_asset_manifest.py:154:    manifest, out_path = build_manifest(sys.argv[1], sys.argv[2])
scripts\build_asset_manifest.py:155:    print(f"OK: {out_path} — {manifest['overall_status']} "
scripts\build_asset_manifest.py:156:          f"(시각슬라이드 {manifest['visual_slides_covered']}/{manifest['visual_slides_total']} 커버)")
.claude/skills\course-pipeline\SKILL.md:21:| 시각자산 | `visual-assets` | `assets/images/chNN/`, `assets/diagrams/`, `assets/manifest.json` |
.claude/skills\course-pipeline\SKILL.md:95:1. 해당 차시의 **표 전체를 인덱스 재검증**한다: 매핑 표의 산출물 경로 규약(`courses/{course-id}/manuscripts/chNN.md`, `assets/manifest.json`(+ `assets/images/chNN/`, `assets/diagrams/`), `storyboards/chNN.html`, `ppt_previews/chNN.html`, `panseo/chNN.html`, `simulators/chNN_*.html`, `pptx/chNN.pptx`, `book/chNN.pdf`, `code/chNN/`)에 따라 ✅로 표시된 모든 셀의 파일이 실제로 존재하는지 하나씩 확인한다. `시각자산` 칸이 `deferred`/`partial`이면 해당 상태값이 `assets/manifest.json`의 실제 상태와 일치하는지도 확인한다.
.claude/skills\book-build\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 비유(Easy analogy)·실무사례(Practical case)·나레이션·실습·평가문항을 씨앗으로 소설처럼 이야기 형태로 재집필해 차시별 PDF 책(`book/chNN.pdf`)을 만든다. 과정 완주 시 합본(`book/합본.pdf`)도 만든다. "책 만들어줘", "PDF 책", "챕터 집필" 요청 시 사용. 파이프라인 11단계 — 캐릭터 설정 → 소설체 재집필(이미지는 `assets/manifest.json`의 확정 경로를 참조) → humanizer 문체 교정 → 편집 검토 3종(사실성·개념 누락·과도한 소설화) → typst_builder(Typst/Pandoc)로 PDF 빌드. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
.claude/skills\book-build\SKILL.md:16:- `references/templates/book_base.typ` — Typst 조판(46배판 188×257mm, 자동 목차/표지/헤더). 본문 폰트 `KoPubWorldBatang_Pro`(폴백 `Malgun Gothic`), 코드 폰트 `D2Coding`
.claude/skills\book-build\SKILL.md:18:- `references/fonts/` — D2Coding(OFL), KoPubWorld바탕(KOPUS 라이선스) 폰트 파일
.claude/skills\book-build\SKILL.md:29:원고 `manuscripts/chNN.md`의 슬라이드들에서 다음을 씨앗으로 추출한다: Easy analogy(비유), Practical case(실무사례), Narration(설명 내용), Practice(실습), Assessment(평가문항). Screen/Visual asset은 장면 묘사·이미지 삽입 참고용으로만 쓴다.
.claude/skills\book-build\SKILL.md:36:- **자산 해석 규칙(필수, 2026-07-06 개정)**: 이미지·D2 PNG 삽입은 원고 Visual asset의 프롬프트 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 결정한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다: (1) `image.status == "present"`이면 `image.path`, (2) 아니고 `d2.status == "present"`이면 `d2.path`, (3) 둘 다 `present`가 아니면(`deferred`/`missing`) 그 장면은 삽화 없이 텍스트만으로 쓴다. 실사용 경로는 `book/chNN_원고.md` 기준 상대경로로 보정한다. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.
.claude/skills\book-build\SKILL.md:85:- `merge_template_and_content()`가 `template_path.parent / "book_base.typ"`를 찾으므로, 프로젝트별 `book.typ`(book-title/color-primary 등 변수 정의)는 반드시 `references/templates/book_base.typ`의 사본과 **같은 디렉토리**(`book/` 또는 `book/_build/`)에 둔다. 처음 만드는 과정이면 `book_base.typ`를 그 디렉토리로 복사하고 `book.typ`에서 변수만 채운다.
.claude/skills\book-build\SKILL.md:86:- **`book.typ`가 반드시 정의해야 하는 변수(누락 시 Typst 컴파일 실패)**: `book-title`, `book-subtitle`, `book-description`, `book-header-title`, `book-authors`, `book-cover-image`(없으면 `""`), 표지 색상 `color-primary`/`color-primary-dark`/`color-primary-light`, 그리고 **`#let paragraph-gap = 6pt`**. `paragraph-gap`은 `book_base.typ`가 아니라 `paragraph-gap.lua` 필터가 생성 typst에 삽입하는 참조라 눈에 안 띄지만, 정의하지 않으면 `unknown variable: paragraph-gap`으로 빌드가 멈춘다. book.typ 최소 골격:
.claude/skills\book-build\SKILL.md:94:  #let color-primary = rgb("#2563eb")
.claude/skills\book-build\SKILL.md:95:  #let color-primary-dark = rgb("#1e3a8a")
.claude/skills\book-build\SKILL.md:96:  #let color-primary-light = rgb("#93b4e8")
.claude/skills\book-build\SKILL.md:100:- 이미지·D2 PNG 경로는 챕터 md 파일 기준 상대경로로 두면 `fix_image_paths()`가 자동으로 절대경로(Typst용 드라이브 앵커 제거 형식)로 변환한다.
.claude/skills\book-build\SKILL.md:133:- 원고 스키마: `.claude/skills/manuscript-draft/references/manuscript-schema.md` (8개 필드: Screen, Easy analogy, Practical case, Visual asset, Source, Narration, Practice, Assessment)
.claude/skills\book-build\SKILL.md:136:- 시각자산 SSOT: `assets/manifest.json`(`visual-assets` 스킬 소유) — §2 "자산 해석 규칙" 참조.
scripts\build_pptx.py:38:FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
scripts\build_pptx.py:107:                if field == "Visual asset" and fence_lang != "d2" and code_lines:
scripts\build_pptx.py:141:        elif field == "Visual asset":
scripts\test_build_pptx.py:25:    **Visual asset**
scripts\test_build_pptx.py:59:    **Visual asset**
scripts\test_build_pptx.py:78:D2_ONLY_SAMPLE = textwrap.dedent("""\
scripts\test_build_pptx.py:86:    **Visual asset**
scripts\test_build_pptx.py:87:    - D2 diagram: `assets/diagrams/ch01_http-request-response.d2`
scripts\test_build_pptx.py:106:    **Visual asset**
scripts\test_build_pptx.py:136:    slides = parse_manuscript(D2_ONLY_SAMPLE)
scripts\test_build_pptx.py:252:        **Visual asset**
scripts\test_build_pptx.py:276:    _make_img(tmp_path, "assets/images/ch01/slide01.png", 100, 2000)
scripts\test_build_pptx.py:278:    build_pptx(_manuscript_with_image("assets/images/ch01/slide01.png"), str(out), assets_root=str(tmp_path))
scripts\test_build_pptx.py:289:    _make_img(tmp_path, "assets/images/ch01/slide01.png", 2000, 100)
scripts\test_build_pptx.py:291:    build_pptx(_manuscript_with_image("assets/images/ch01/slide01.png"), str(out), assets_root=str(tmp_path))
scripts\test_build_pptx.py:300:    _make_img(tmp_path, "assets/images/ch01/slide01.png", 800, 600)
scripts\test_build_pptx.py:302:    build_pptx(_manuscript_with_image("assets/images/ch01/slide01.png"), str(out), assets_root=str(tmp_path))
.claude/skills\edu-sim-builder\SKILL.md:7:  같은 거 애니메이션으로 설명해줘", "강의용 시각자료/explorable 만들어줘", "버튼 누르면 움직이는
.claude/skills\edu-sim-builder\SKILL.md:57:     - **Visual asset**(있으면) → 참고 도식/이미지 구도로 삼는다(그대로 베끼지 않고 구조만
.claude/skills\edu-sim-builder\SKILL.md:218:- 원고 스키마(Easy analogy/Narration/Visual asset 등 8개 필드 정의): `.claude/skills/manuscript-draft/references/manuscript-schema.md`
.claude/skills\manuscript-final\SKILL.md:3:description: 원고 초안(2단계 산출물)을 사용자와 티키타카(반복 수정)하며 확정 원고로 완성한다. "원고 수정", "원고 완성", "티키타카" 요청 시 사용. manuscripts/chNN_draft.md를 chNN.md로 이어받아 슬라이드 추가/삭제/압축/비유 교체/나레이션 수정을 한 번에 한 요청씩 처리하고, 사용자가 "확정"이라 하면 확정 체크리스트를 통과시켜 status.md 원고확정을 갱신한다. 시각 자산(이미지/D2)의 실제 생성은 이 스킬이 아니라 다음 단계 `visual-assets`(4단계)가 담당한다.
.claude/skills\manuscript-final\SKILL.md:27:- 수정할 때마다 **스키마 필드 무결성**을 유지한다: 8개 필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment) 라벨·순서를 지우거나 흐트러뜨리지 않는다. 슬라이드를 삭제해도 다른 슬라이드의 필드 구조는 그대로 둔다. 슬라이드를 삭제하면 `## Slide N.` 번호가 뒤로 밀리는 슬라이드들의 번호를 다시 매긴다(평가 슬라이드의 "관련학습보기: Slide N" 참조도 함께 갱신).
.claude/skills\manuscript-final\SKILL.md:33:이 스킬은 Visual asset 필드의 프롬프트/D2 소스 **문구를 다듬는 것까지만** 책임진다. 실제 이미지/D2 렌더 생성, `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets` 스킬(4단계, `.claude/skills/visual-assets/SKILL.md`)이 전담한다 — image-gen/pub-d2-diagram 브릿지 절차(태그 변환, 스크래치 파일, 경로 규약)도 그쪽으로 이관되었다.
.claude/skills\manuscript-final\SKILL.md:35:원고확정 시점에 시각 자산이 아직 없어도(프롬프트/D2 소스만 있어도) 확정할 수 있다 — 자산 생성 완료 여부는 §4 확정 체크리스트의 대상이 아니다.
.claude/skills\manuscript-final\SKILL.md:43:- [ ] **스키마 전 필드 무결**: 모든 슬라이드에 8개 필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment)가 순서대로 존재한다(해당 없음도 `- 없음.`으로 명기, 필드 자체 누락 없음). 슬라이드 번호가 순차적이고 평가 슬라이드의 "관련학습보기" 참조 번호가 실제 슬라이드와 일치한다.
.claude/skills\manuscript-final\SKILL.md:63:- 시각 자산 생성: 다음 단계 `visual-assets` 스킬(`.claude/skills/visual-assets/SKILL.md`) 참조 — image-gen/pub-d2-diagram 호출·브릿지 절차·`assets/manifest.json` 갱신 전부 그 스킬이 담당한다(§3).
.claude/skills\manuscript-draft\SKILL.md:42:- [ ] 전 슬라이드에 8개 필드(Screen/Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment)가 모두 존재한다(해당 없음도 `- 없음.`으로 명기되어 있고 필드 자체가 빠진 곳이 없다).
.claude/skills\pptx-build\SKILL.md:10:**시각자산(4단계)과의 관계(2026-07-06 개정)**: `scripts/build_pptx.py`의 파싱 로직은 바뀌지 않는다 — 원고의 `assets/...png|jpg|jpeg|webp` 경로 패턴(`IMG_PATH_RE`)을 그대로 잡는다. `visual-assets` 단계 완료 후 원고 Visual asset 필드에 병기된 자산 경로(`→ 생성됨:`/`→ 렌더됨:` 다음 줄의 `assets/...` 경로)가 그대로 이 정규식에 매치되므로, 이 스킬은 원고에 이미 병기된 경로를 그대로 사용하기만 하면 된다(별도 manifest 조회 로직 추가 없음).
.claude/skills\pptx-build\SKILL.md:23:- 원고 문법: `## Slide N. 제목` 헤더로 슬라이드 구간을 나누고, `**Screen**`/`**Narration**`/`**Visual asset**` 등 필드 라벨로 내용을 분류한다. 이미지 자산 경로는 `assets/...png|jpg|jpeg|webp` 패턴만 인식한다(D2 다이어그램의 `.d2` 소스 경로는 이미지로 삽입하지 않음 — 렌더된 png/jpg만 인식).
.claude/skills\pptx-build\SKILL.md:47:- **D2 소스만 있는 슬라이드는 코드 박스로 출력되지 않는다**: 렌더 이미지(png/jpg) 없이 `` ```d2 `` 소스만 있는 슬라이드는 `code`가 비어 있어야 한다(D2 소스 텍스트가 코드 박스로 깨져 나오면 안 된다).
.claude/skills\pptx-build\SKILL.md:49:- **다중 코드펜스 슬라이드는 모든 블록이 보존된다**: 한 슬라이드의 Visual asset에 표시용 코드 펜스(d2 제외)가 여러 개 있으면, 마지막 블록만 남지 않고 모든 블록이 `code`에 포함되어야 한다.
.claude/skills\pptx-build\SKILL.md:69:- D2 다이어그램을 실제 이미지로 슬라이드에 넣으려면 먼저 `pub-d2-diagram` 스킬로 렌더(svg/png)한 뒤, 원고의 Visual asset 필드에 렌더 결과 png/jpg 경로를 병기해야 이 빌더가 인식한다. 이 병기는 이제 `visual-assets`(4단계)가 수행한다(§ 전제 참조).
.claude/skills\visual-assets\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 Visual asset 필드(이미지 프롬프트·D2 소스)를 실자산(PNG/SVG)으로 생성해 `assets/manifest.json`(SSOT)을 확정하는 스킬. "시각자산 생성", "이미지·다이어그램 만들어줘", "자산 렌더", "visual-assets" 요청 시 사용. 파이프라인 4단계(원고확정 직후, 코드/스토리보드 등 소비 산출물보다 앞) — 이후 6~11단계(스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)가 재동기화 폭포 없이 처음부터 실자산을 임베드하도록 하는 것이 존재 이유. image-gen `[IMAGE PROMPT]` 태그 자동 변환 브릿지 내장, `원고확정 ✅`(또는 명시적 `deferred`) hard gate, 해시 기반 부분(stale) 재생성을 담당한다.
.claude/skills\visual-assets\SKILL.md:8:확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 **Visual asset** 필드에 있는 이미지 프롬프트·D2 소스를 실제 자산 파일(`assets/images/chNN/`, `assets/diagrams/`)로 생성하고, 그 결과를 `assets/manifest.json`(SSOT)에 확정하는 스킬이다.
.claude/skills\visual-assets\SKILL.md:12:**설계 근거**: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`(제안 A·E), codex 사전검증 `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`(4개 조건 — hard gate/해시 stale/manifest SSOT/소비 계약).
.claude/skills\visual-assets\SKILL.md:14:**엔진(호출만 하고 자체 생성 로직 없음)**: `image-gen`(`scripts/image_gen.py` — Codex 이미지), `pub-d2-diagram`(`scripts/render_md_diagrams.py` + Windows PNG 변환 — D2 렌더). manifest 빌더: `scripts/build_asset_manifest.py`(레포 루트, 이미 작성됨 — 이 스킬이 수정하지 않고 그대로 호출).
.claude/skills\visual-assets\SKILL.md:26:원고 스키마의 인라인 라벨(`GPT image prompt:` / 구 표기 `시각자료 프롬프트(영문):`, 만화 2컷은 `Comic panel prompt:`)은 `image_gen.py`가 스캔하는 리터럴 블록 형식이 아니다. 이 스킬이 **자동으로** 변환한다.
.claude/skills\visual-assets\SKILL.md:33:  path: assets/images/chNN/slideNN.png
.claude/skills\visual-assets\SKILL.md:38:  - `path:`가 실제 저장 경로를 결정한다(project_root=`courses/{course-id}` 기준 상대경로, `assets/images/chNN/slideNN.png` 고정 — `pptx-build`의 `IMG_PATH_RE`가 이 패턴만 인식하므로 어긋나면 안 된다).
.claude/skills\visual-assets\SKILL.md:43:  - 대기 중 **폴링 전용 서브에이전트를 띄우지 않는다** — 파일럿에서 토큰만 소모하고 진행에 도움이 안 됐던 실패 패턴이다. 대신 `assets/images/chNN/`에 생성된 PNG 개수를 주기적으로(사용자가 물었을 때, 또는 Monitor 도구의 until-루프) 확인해 "몇 장 중 몇 장 완료"로 진행 상황을 보고한다.
.claude/skills\visual-assets\SKILL.md:47:### 3. D2 렌더
.claude/skills\visual-assets\SKILL.md:50:- 이 스크립트의 파일명은 파일 내 D2 블록 **등장 순서**(`{접두사}-d{i}.svg`)로 매겨진다 — 슬라이드 번호 기반이 아니다. 반면 `build_asset_manifest.py`(§4)와 기존 소비 계약은 `assets/diagrams/{chNN}-slide{NN}-{요지}.png` 형식(슬라이드 번호 포함, PNG)을 기대한다(`courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` 등 기존 실사례 참고). 따라서:
.claude/skills\visual-assets\SKILL.md:53:  3. 최종 파일을 `assets/diagrams/{chNN}-slide{NN}-{요지}.png`로 저장(또는 리네임)한다 — `{요지}`는 다이어그램 내용을 요약한 짧은 영문/한글 슬러그.
.claude/skills\visual-assets\SKILL.md:54:  4. 종횡비가 3:1을 넘으면 `pub-d2-diagram`의 종횡비 가이드에 따라 원고 D2 소스를 `direction: down` 등으로 재배치할지 사용자에게 확인한다(자동 재배치 아님).
.claude/skills\visual-assets\SKILL.md:56:### 4. manifest 생성 (SSOT)
.claude/skills\visual-assets\SKILL.md:58:- `python scripts/build_asset_manifest.py courses/{course-id} chNN` 를 실행한다(레포 루트 스크립트, 수정하지 않고 그대로 호출).
.claude/skills\visual-assets\SKILL.md:59:- 결과 `courses/{course-id}/assets/manifest.json`이 이후 모든 소비 판단의 **단일 진실원(SSOT)**이다. 슬라이드별 `image`/`d2` 블록에 `path`/`prompt_hash`(또는 `d2_hash`)/`status`(`present`/`deferred`/`missing`)가 담긴다.
.claude/skills\visual-assets\SKILL.md:60:- D2가 있는 슬라이드는 이미지가 없어도 스크립트가 자동으로 `image.status = "deferred"`(primary=false) 처리한다 — D2가 그 슬라이드의 주 시각자료이므로 이미지 중복 생성이 불필요하다는 뜻이다. 이 슬라이드는 결핍(missing)으로 세지 않는다.
.claude/skills\visual-assets\SKILL.md:65:- 실제 생성/렌더가 완료된 슬라이드의 Visual asset 필드에 사람이 읽기 위한 병기를 남긴다: 이미지는 `→ 생성됨: assets/images/chNN/slideNN.png`, D2는 `→ 렌더됨: assets/diagrams/chNN-slideNN-*.png`(실제 파일명 그대로). 프롬프트/D2 원문은 지우지 않는다(재생성 근거).
.claude/skills\visual-assets\SKILL.md:66:- 이 주석은 사람이 읽기 위한 보조 표기일 뿐이다 — **manifest.json이 SSOT**다. 소비 스킬(`storyboard`/`ppt-preview`/`pptx-build`/`panseo-slide`/`book-build`)의 "원고 주석이 아니라 manifest 확정 경로를 읽도록" 계약 전환은 이 스킬의 책임 범위 밖(제안 E 조건 4, 별도 반영 — 각 소비 스킬의 SKILL.md 개정 필요)이다. 전환 전까지는 두 표기(원고 주석 + manifest)가 병존한다.
.claude/skills\visual-assets\SKILL.md:70:manifest의 `overall_status`에 따라 `status.md`의 `시각자산` 칸(있는 경우)을 갱신한다:
.claude/skills\visual-assets\SKILL.md:79:원고 확정 후 프롬프트/D2가 수정되면(재개된 티키타카, "이 이미지 프롬프트 바꿔줘" 등) **전체 재생성 금지** — 바뀐 슬라이드만 재생성한다.
.claude/skills\visual-assets\SKILL.md:81:1. 재실행 전 기존 `assets/manifest.json`을 읽어 슬라이드별 `prompt_hash`/`d2_hash`를 보관해 둔다(파일 그대로 두거나 값만 메모).
.claude/skills\visual-assets\SKILL.md:82:2. `build_asset_manifest.py`를 다시 실행한다 — 이 스크립트는 **현재 원고 텍스트**에서 해시를 새로 계산하지만, 기존 생성 파일의 내용이 그 해시와 실제로 일치하는지는 검증하지 않는다(파일 존재+크기만 확인). 그래서 이 비교는 스킬이 직접 한다.
.claude/skills\visual-assets\SKILL.md:83:3. 1단계에서 보관한 값과 새 manifest의 슬라이드별 해시를 비교한다.
.claude/skills\visual-assets\SKILL.md:84:   - 해시가 달라졌는데 상태가 여전히 `present`인 슬라이드 → **stale**: 원고는 바뀌었지만 자산은 옛날 그대로다. 그 슬라이드만 §2(이미지) 또는 §3(D2)을 다시 수행해 파일을 교체한 뒤 manifest를 재생성한다.
.claude/skills\visual-assets\SKILL.md:90:- [ ] **manifest 존재 및 판정 명시**: `assets/manifest.json`이 존재하고 `overall_status`가 `present`이거나, 사용자가 실제로 선택한 `deferred`/`partial`이다(임의로 `missing`을 방치한 채 넘어가지 않았다).
.claude/skills\visual-assets\SKILL.md:91:- [ ] **파일 실존·용량**: manifest에 `status: "present"`로 표시된 모든 자산(`image`/`d2`)이 실제로 파일로 존재하고 크기 > 0 바이트다.
.claude/skills\visual-assets\SKILL.md:92:- [ ] **커버 안 된 시각 슬라이드 0**: Visual asset 필드가 있는 슬라이드 중 `present`도 `deferred`도 아닌(`missing`) 슬라이드가 0개다. 남아 있다면 사용자에게 구체적으로(어느 슬라이드) 보고하고 생성/보류 여부를 재확인한다.
.claude/skills\visual-assets\SKILL.md:94:- [ ] **D2 파일명 계약**: D2 렌더 산출물이 `assets/diagrams/{chNN}-slide{NN}-*.png` 형식(슬라이드 번호 포함, PNG)으로 저장돼 있다(§3 리네임 누락 없음).
.claude/skills\visual-assets\SKILL.md:102:- D2 파일명이 계약과 다르면(슬라이드 번호 누락 등) 파일만 리네임하고 `build_asset_manifest.py`를 다시 돌려 manifest를 갱신한다(재렌더 불필요).
.claude/skills\visual-assets\SKILL.md:109:- manifest 빌더(수정 금지, 그대로 호출): `scripts/build_asset_manifest.py`
.claude/skills\visual-assets\SKILL.md:111:- D2 엔진: `.claude/skills/pub-d2-diagram/SKILL.md`(Windows 렌더·종횡비 절 포함) + `scripts/render_md_diagrams.py`
.claude/skills\visual-assets\SKILL.md:112:- 원고 스키마(Visual asset 하위 유형): `.claude/skills/manuscript-draft/references/manuscript-schema.md` §4
.claude/skills\visual-assets\SKILL.md:113:- 기존 실사례(수동으로 이 절차를 먼저 밟아본 파일럿): `courses/spring-boot-basic/assets/manifest.json`, `courses/spring-boot-basic/assets/diagrams/ch01-d2-manifest.md`
.claude/skills\visual-assets\SKILL.md:114:- **범위 밖(별도 반영 대상)**: `status.md`의 `시각자산` 열 신설(제안 C), `CLAUDE.md`/설계 문서/`course-pipeline` 매핑 표에 이 스킬을 11단계 파이프라인으로 편입(제안 D), 소비 스킬(storyboard/ppt-preview/pptx-build/panseo-slide/book-build)의 "manifest 우선 소비" 계약 전환(제안 E 조건 4) — 이 스킬은 이 변경들이 아직 반영되지 않은 상태에서도 단독으로 동작하도록 §1·§5·§6에서 방어적으로 서술했다.
.claude/skills\panseo-slide\SKILL.md:14:**시각자산(4단계)과의 관계**: 이 스킬은 `assets/manifest.json`을 직접 읽지 않는다 — 그대로 모드는
.claude/skills\panseo-slide\SKILL.md:15:`ppt_previews/chNN.html`(7단계, `ppt-preview`가 manifest를 읽어 이미 실자산을 반영한 산출물)을
.claude/skills\panseo-slide\SKILL.md:86:   원고에 적힌 상대경로(`../assets/images/chNN/...`)를 **그대로** 쓸 수 있다. 디렉터리 깊이가
.claude/skills\pub-d2-diagram\SKILL.md:1:# D2 다이어그램 빌드 스킬
.claude/skills\pub-d2-diagram\SKILL.md:5:trigger: ["D2 빌드", "다이어그램 생성", "/d2"]
.claude/skills\pub-d2-diagram\SKILL.md:9:D2 언어로 다이어그램을 작성하고, O'Reilly 모노톤 스타일로 PNG를 생성합니다.
.claude/skills\pub-d2-diagram\SKILL.md:54:D2 → SVG → 색상 치환(흑백) → PNG
.claude/skills\pub-d2-diagram\SKILL.md:57:# 1. D2 → SVG (dagre 레이아웃, 테마 없음)
.claude/skills\pub-d2-diagram\SKILL.md:82:cd projects/사내AI비서_v2/assets/diagrams
.claude/skills\pub-d2-diagram\SKILL.md:90:| d2 | `brew install d2` | D2 → SVG 컴파일 |
.claude/skills\pub-d2-diagram\SKILL.md:113:- Windows: d2는 `C:\Program Files\D2\d2.exe` (brew 지침은 macOS용).
.claude/skills\pub-d2-diagram\SKILL.md:117:Windows에는 `rsvg-convert`가 없다. `visual-assets`/`pub-d2-diagram` 파이프라인이 PNG(슬라이드·책 임베드용)를 필요로 할 때는 아래 **headless Chromium(playwright) 스크린샷 폴백을 즉흥 수단이 아니라 정식 경로로** 쓴다(`ch01-d2-manifest.md` 파일럿에서 실제로 검증된 방식과 동일).
.claude/skills\pub-d2-diagram\SKILL.md:126:5. 산출물 파일명은 소비 계약(`assets/diagrams/{chNN}-slide{NN}-{요지}.png` — 슬라이드 번호 포함, `courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` 등 기존 실사례 참고)을 따른다. **주의**: `render_md_diagrams.py`는 파일 내 D2 블록 등장 순서로 `{접두사}-d{i}.svg`를 명명한다(슬라이드 번호 기반이 아니다) — PNG 변환 시 원고 순서와 대조해 슬라이드 번호를 붙여 리네임해야 `visual-assets`의 manifest 빌더(`build_asset_manifest.py`)가 `assets/diagrams/{chNN}-slide{NN}-*.png` 글롭으로 찾을 수 있다.
.claude/skills\pub-d2-diagram\SKILL.md:130:D2 다이어그램은 슬라이드(16:9)·책 페이지에 임베드되므로 **가로:세로 3:1 이내**를 권장한다. `direction: right`(가로 흐름)는 노드 수가 많아지면 가로로 계속 늘어나 극단적으로 납작해질 수 있다(파일럿 실패 사례: 일부가 ~9:1~19:1까지 늘어나 글자가 안 보임). 선형(체인) 다이어그램은 `direction: down`으로 두면 세로로 흘러 종횡비가 개선된다 — dagre라 세로여도 라벨 겹침이 없다.
.claude/skills\pub-d2-diagram\SKILL.md:133:- 렌더 후 SVG/PNG의 실제 너비/높이를 확인해 종횡비를 계산한다. 3:1을 넘으면 아래 중 하나로 원고 D2 소스를 고치도록 사용자에게 안내한다:
.claude/skills\pub-d2-diagram\SKILL.md:136:- 종횡비 초과를 방치한 채 슬라이드/책에 그대로 임베드하지 않는다 — `visual-assets` 스킬의 D2 렌더 단계(§3)에서 이 경고를 받으면 재생성 전 사용자 확인을 거친다.
.claude/skills\book-build\references\build-pipeline.md:67:> **이식 주의 (이 하네스 기준):** 아래 예시는 원본(macOS) 기준이다. 이 하네스에서는 `typst_builder.py`가 컴파일을 대신 수행하며, Windows에 맞게 이미 조정되어 있다 — `--font-path`는 저장소 내 `references/fonts/`(D2Coding·KoPubWorld바탕)를 절대경로로 주입하고, `--root`는 하드코딩 `/` 대신 `_typst_root_for()`가 `.typ` 파일의 드라이브 앵커(Windows는 `C:/`)에서 도출한다. 아래 명령을 Windows에서 그대로 실행하지 말 것.
.claude/skills\book-build\references\build-pipeline.md:75:- `--font-path`: 사용자 폰트 경로. 이 하네스에서는 저장소 `references/fonts/`(D2Coding, KoPubWorld바탕).
.claude/skills\manuscript-draft\references\manuscript-schema.md:33:**Visual asset**
.claude/skills\manuscript-draft\references\manuscript-schema.md:75:4. **Visual asset** — 아래 §4의 하위 유형 중 하나 이상.
.claude/skills\manuscript-draft\references\manuscript-schema.md:81:## 4. Visual asset 하위 유형
.claude/skills\manuscript-draft\references\manuscript-schema.md:86:- **D2 초안** — 참조 파일 경로를 먼저 한 줄 적고(`` D2 diagram: `assets/diagrams/chNN_slug.d2` ``), 바로 아래에 ` ```d2 ` 코드펜스로 실제 D2 소스를 포함한다. 이미 만든 다이어그램을 재사용할 때는 `Reuse D2: {파일명}` 한 줄로 대체 가능.
.claude/skills\manuscript-draft\references\manuscript-schema.md:97:- **Easy analogy / Practical case / Visual asset**: 문항 이해를 돕는 보조 자료(다른 슬라이드와 동일 규칙, 생략 시 `- 없음.`은 지양 — 골든은 평가 슬라이드에도 실제 비유·사례를 채운다).
.claude/skills\ppt-preview\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 Screen/Visual asset 필드를 16:9 슬라이드 캔버스로 나열한 라이트 테마 PPT 미리보기 `ppt_previews/chNN.html`을 만든다. "PPT 프리뷰 만들어줘", "PPT 미리보기 만들어줘" 요청 시 사용. 캔버스당 제목+짧은 문구+이미지/D2/코드만 배치하고 긴 설명은 넣지 않는다(설명은 원고·스토리보드 담당). 이미지/D2는 원고 프롬프트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 삽입한다. 디자인 규범은 `templates/golden/ppt_preview_golden.html`이며 새 색상·다크 테마는 도입하지 않는다. 슬라이드 DOM은 `<section class="ppt-slide" data-slide="N">` + 내부 `.ppt-canvas` + 캔버스 내 `h2` 제목으로 고정한다(panseo-slide 그대로 모드가 이 구조를 그대로 소비 — pptx-build는 이 HTML이 아니라 원고 manuscripts/chNN.md를 직접 파싱하므로 이 계약에 의존하지 않는다). 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트). 사용자 확인 후 status.md PPT프리뷰 칸을 ✅로 갱신한다.
.claude/skills\ppt-preview\SKILL.md:8:확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 Screen/Visual asset 필드를 실제 PPT 화면처럼 16:9 캔버스로 나열한 라이트 테마 미리보기 `ppt_previews/chNN.html`을 만드는 스킬이다. 파이프라인 7단계(`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3 표)이며, 순서 확인용으로 `storyboards/chNN.html`(6단계 산출물)을 참고한다. 선행 단계는 원고확정(3단계) + 시각자산(4단계, `visual-assets`) — 시각자산이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
.claude/skills\ppt-preview\SKILL.md:24:- 레이아웃 원칙: 캔버스 안에는 **제목(`h2`) + 짧은 문구/불릿 + 이미지 또는 D2/순서도/코드**만 놓는다. 긴 설명·나레이션 전문은 넣지 않는다 — 그건 원고(`manuscripts/chNN.md`)와 스토리보드(`storyboards/chNN.html`)의 몫이다.
.claude/skills\ppt-preview\SKILL.md:57:### 3. Visual asset 실자산 연결 (manifest 기반, 2026-07-06 개정)
.claude/skills\ppt-preview\SKILL.md:59:**자산 해석 규칙(필수)**: 이 스킬은 원고 Visual asset의 프롬프트/D2 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 자산을 임베드한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다:
.claude/skills\ppt-preview\SKILL.md:65:- (1) 이미지: `.ppt-media img` 또는 `.cover-image img`에 실제 상대경로로 삽입한다. `ppt_previews/chNN.html`은 `courses/{course-id}/ppt_previews/` 아래 있으므로, manifest의 `assets/images/chNN/...` 경로는 골든처럼 한 단계 상위로 올려 상대경로를 맞춘다(`../assets/images/chNN/...`). 원고의 `→ 생성됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다 — manifest와 다르면 manifest를 따른다.
.claude/skills\ppt-preview\SKILL.md:66:- (2) D2: 그 렌더 결과(svg/png)를 동일하게 삽입한다. 재현이 필요하면 골든처럼 `.flow`/`.node`/`.arrow`로 간단히 재현한다.
.claude/skills\ppt-preview\SKILL.md:69:**자산 임베드 안전 여백 (2026-07-06 개정)**: 임베드된 이미지/D2가 `.ppt-media` 셀 가장자리에 닿지 않게, 이미지 전용 셀렉터 `.ppt-media > img`에만 `box-sizing: border-box; padding: clamp(10px, 4%, 28px);`를 적용한다(`object-fit: contain`은 기존 규칙 유지). **`.ppt-media`/`.cover-image` 자체나 `.flow`/`pre`/`.split` 등 비이미지 위젯에는 patting을 주지 않는다** — 그 컨테이너 안에는 이미지 외에도 순서도·코드·비교 패널이 들어가므로 전역 padding은 레이아웃을 깬다. `%` 단독 padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`(제안 B), codex 조건 2: `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md`.
.claude/skills\ppt-preview\SKILL.md:101:- manifest와 캔버스 내용이 어긋나면(예: manifest는 `present`인데 캔버스가 여전히 placeholder거나 경로가 다름) 해당 캔버스의 자산 참조만 manifest 기준으로 다시 맞춘다. 다른 캔버스는 건드리지 않는다.
.claude/skills\ppt-preview\SKILL.md:106:- 원고 스키마: `.claude/skills/manuscript-draft/references/manuscript-schema.md` (Screen/Visual asset 등 8개 필드 정의·순서)
.claude/skills\ppt-preview\SKILL.md:108:- 시각자산 SSOT: `assets/manifest.json`(`visual-assets` 스킬 소유) — §3 "자산 해석 규칙" 참조. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.
.claude/skills\book-build\references\templates\book_base.typ:114:  set text(size: 8pt, weight: "bold", font: ("D2Coding", "KoPubWorldBatang_Pro"))
.claude/skills\book-build\references\templates\book_base.typ:134:    text(size: 8.5pt, fill: rgb("#1e40af"), font: ("D2Coding", "KoPubWorldBatang_Pro"))[#it]
.claude/skills\book-build\references\templates\book_base.typ:248:  // 초세로형(종횡비가 낮은) D2/이미지일 가능성이 높다. 자동 축소는 오버플로 방지를 위해 그대로 유지하되,
.claude/skills\book-build\references\templates\book_base.typ:249:  // 이 경우 D2 재배치(가로 분할·2단 구성) 또는 전면 그림(별도 페이지 배치)을 검토할 것.
.claude/skills\book-build\references\templates\book_base.typ:302:    body + v(2pt) + align(center, text(7.5pt, fill: rgb("#b45309"), style: "italic")[⚠ 세로 비율이 커 축소됨 — D2 재배치/전면 그림 배치 검토 권장])
.claude/skills\book-build\references\templates\book_base.typ:334:      #line(length: 40%, stroke: 2pt + color-primary)
.claude/skills\book-build\references\templates\book_base.typ:336:      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
.claude/skills\book-build\references\templates\book_base.typ:338:      #line(length: 60%, stroke: 0.5pt + color-primary-light)
.claude/skills\storyboard\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 슬라이드를 1:1 카드로 펼친 라이트 테마 강사용 스토리보드 `storyboards/chNN.html`을 만든다. "스토리보드 만들어줘" 요청 시 사용. 카드 상단에 슬라이드 화면 미리보기(Screen 필드 재현, `assets/manifest.json`에 실자산이 있으면 삽입/없으면 프롬프트 placeholder), 하단에 Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment를 라벨링된 패널로 배치한다. 디자인 규범은 `templates/golden/storyboard_golden.html`이며 새 색상·다크 테마는 도입하지 않는다. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트). 사용자 확인 후 status.md 스토리보드 칸을 ✅로 갱신한다.
.claude/skills\storyboard\SKILL.md:30:- `slide-head`: `<h2>Slide N. {제목}</h2>` + `<span class="tag">{짧은 분류}</span>`. 분류 태그는 골든 어휘(예: `GPT image`, `D2 fallback`, `mock visual`, `roadmap`, `current issue`, `scenario`, `assessment`)를 참고해 슬라이드 성격에 맞게 붙인다.
.claude/skills\storyboard\SKILL.md:36:  4. *(선택)* **그림 읽는 순서** — 순서도/D2 다이어그램 슬라이드에서만, 화살표를 어떤 순서로 읽는지 한 문장으로 짚는다(골든 Slide 5·8 사례).
.claude/skills\storyboard\SKILL.md:37:  5. **시각 자료** (`class="lecture-block visual-asset"`) — Visual asset 필드 원문(프롬프트 문구, D2 소스, 코드 블록 등)을 그대로 옮긴다.
.claude/skills\storyboard\SKILL.md:44:### 3. 이미지/다이어그램 자산 연결 (manifest 기반, 2026-07-06 개정)
.claude/skills\storyboard\SKILL.md:46:**자산 해석 규칙(필수)**: 이 스킬은 원고 Visual asset의 프롬프트/D2 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 자산을 임베드한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다:
.claude/skills\storyboard\SKILL.md:52:- (1) 이미지 경로: `slide-preview` 안에 `<img src="{상대경로}" alt="...">`로 삽입한다. `storyboards/chNN.html`은 `courses/{course-id}/storyboards/` 아래 있으므로, manifest의 `assets/images/chNN/...` 경로는 골든 실제 참조 패턴(`../assets/images/ch01/...`)처럼 한 단계 상위로 올려 상대경로를 맞춘다. 원고에 병기된 `→ 생성됨:` 문구는 사람이 읽는 보조 표기일 뿐 신뢰 소스가 아니다 — manifest와 다르면 manifest를 따른다.
.claude/skills\storyboard\SKILL.md:53:- (2) D2 경로: 그 렌더 결과(svg/png)를 동일하게 삽입한다.
.claude/skills\storyboard\SKILL.md:54:- (3) placeholder: `slide-preview` 안에 `--line` 테두리의 placeholder 박스를 두고, `deferred`/`missing`이면 원고의 `GPT image prompt:`(또는 `Comic panel prompt:`)/D2 소스 원문을, 재현이 어려운 D2는 골든 Slide 5·8처럼 `.flow`/`.node`/`.arrow`로 흐름을 간단히 재현하거나 `<pre class="asset-code">`로 노출한다(골든 그대로). 실제 픽셀 이미지를 대신 만들지 않는다.
.claude/skills\storyboard\SKILL.md:55:- 화면 캡처 계획(`Screenshot plan:`)뿐이고 manifest에도 항목이 없으면 캡처 대상 목록을 placeholder 텍스트로 보여준다.
.claude/skills\storyboard\SKILL.md:57:**자산 임베드 안전 여백 (2026-07-06 개정)**: 임베드된 이미지/D2가 `.slide-preview` 셀 가장자리에 닿지 않게, 이미지 전용 셀렉터 `.slide-preview > img`에만 `box-sizing: border-box; padding: clamp(12px, 4%, 32px);`를 적용한다(`object-fit: contain`은 기존 규칙 유지). **`.slide-preview` 자체나 `.flow`/`pre`/`.split` 등 비이미지 위젯에는 padding을 주지 않는다** — 그 컨테이너 안에는 이미지 외에도 순서도·코드·비교 패널이 들어가므로 전역 padding은 레이아웃을 깬다. `%` 단독 padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`(제안 B), codex 조건 2: `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md`.
.claude/skills\storyboard\SKILL.md:87:- manifest와 카드 내용이 어긋나면(예: manifest는 `present`인데 카드가 여전히 placeholder거나 경로가 다름) 해당 카드의 자산 참조만 manifest 기준으로 다시 맞춘다. 다른 카드는 건드리지 않는다.
.claude/skills\storyboard\SKILL.md:93:- 시각자산 SSOT: `assets/manifest.json`(`visual-assets` 스킬 소유) — §3 "자산 해석 규칙" 참조. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.
.claude/skills\book-build\references\scripts\typst_builder.py:11:     쓰지 않는 전처리다(D2 다이어그램은 이미 PNG 파일로 존재). npx/mermaid-cli가
.claude/skills\book-build\references\scripts\typst_builder.py:141:    이 하네스(book-build)는 Mermaid를 쓰지 않으므로(D2 PNG를 파일로 이미 보유),
.claude/skills\book-build\references\scripts\typst_builder.py:443:        'primary-shadow': ('bordered-shadow', 'shadow'),
.claude/skills\book-build\references\scripts\typst_builder.py:496:    image_border_preset: 이미지 테두리 프리셋명 (plain, clean-border, shadow, primary-shadow, minimal)"""
.claude/skills\book-build\references\scripts\typst_builder.py:961:            "plain" (기본), "clean-border", "shadow", "primary-shadow", "minimal"
.claude/skills\pub-d2-diagram\scripts\render_md_diagrams.py:10:D2 = r"C:\Program Files\D2\d2.exe"
.claude/skills\pub-d2-diagram\scripts\render_md_diagrams.py:40:        r = subprocess.run([D2, "--layout", "dagre", "--pad", "40", str(d2f), str(svgf)],
.claude/skills\practice-code\SKILL.md:20:- Practice 필드가 참조하는 코드/설정은 같은 슬라이드의 **Visual asset** 필드(`Code block for slide:`, `Code block for PPT:` 등)에 실제 소스가 들어 있는 경우가 많다 — Practice만 보지 말고 해당 슬라이드의 Visual asset 코드 블록도 함께 확인해 실제 구현 소스로 삼는다.
.claude/skills\practice-code\SKILL.md:28:- 코드는 원고 Practice/Visual asset의 코드 블록에 등장한 파일 경로·패키지명·클래스명을 그대로 따른다(임의로 이름을 바꾸지 않는다) — 이후 단계가 이 코드에서 그대로 발췌하기 때문에 원고와 코드의 식별자가 어긋나면 안 된다.
.claude/skills\practice-code\SKILL.md:48:- 차이(원고 지시 vs 실제 검증 결과)를 사용자에게 구체적으로 보고한다: 어느 슬라이드의 Practice/Visual asset이, 무엇이(버전/명령/결과), 왜 어긋났는지.
.claude/skills\practice-code\SKILL.md:63:- [ ] **코드-원고 일치**: 원고 Practice 필드(및 관련 Visual asset 코드 블록)에 등장한 모든 코드 블록이 `code/chNN/` 실물과 일치한다(파일 경로·클래스명·패키지명·핵심 로직이 어긋나지 않는다).

 succeeded in 1861ms:
   1: """시각자산 manifest 빌더 — 재설계(visual-assets 스테이지)의 SSOT 생성기.
   2: 
   3: 원고(manuscripts/chNN.md)의 슬라이드별 Visual asset(이미지 프롬프트 / D2 소스)을 스캔하고,
   4: 실제 생성된 자산 파일(assets/images/chNN/, assets/diagrams/)과 대조해
   5: courses/{id}/assets/manifest.json 을 만든다.
   6: 
   7: manifest 스키마(슬라이드별):
   8:   {
   9:     "slide": 5,
  10:     "image": {"path": "assets/images/ch01/slide05.png", "prompt_hash": "...", "status": "present|missing"},
  11:     "d2":    {"path": "assets/diagrams/ch01-slide05-http.png", "d2_hash": "...", "status": "present|missing"}
  12:   }
  13: status(자산 단계 전체): present 수 / 예상 수 로 present|partial|missing 판정.
  14: prompt_hash/d2_hash = 원고의 해당 소스 텍스트 SHA1 앞 12자 → 원고 변경 시 stale 감지에 사용.
  15: 
  16: 사용:
  17:   python scripts/build_asset_manifest.py <course_dir> <chNN>
  18:   예: python scripts/build_asset_manifest.py courses/spring-boot-basic ch01
  19: """
  20: import hashlib
  21: import json
  22: import re
  23: import sys
  24: from pathlib import Path
  25: 
  26: SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
  27: FIELD_RE = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
  28: # 영문 이미지 프롬프트 라인 (백틱 안 우선, 없으면 라벨 뒤 텍스트)
  29: IMG_PROMPT_RE = re.compile(r"(?:image prompt|시각자료 프롬프트\(영문\))\s*[:：]\s*`?(.+)", re.IGNORECASE)
  30: 
  31: 
  32: def _hash(text):
  33:     return hashlib.sha1(text.strip().encode("utf-8")).hexdigest()[:12] if text and text.strip() else None
  34: 
  35: 
  36: def parse_visual_assets(md_text):
  37:     """슬라이드별 Visual asset 내용을 추출. return {slide_num: {"prompt": str|None, "d2": str|None}}"""
  38:     out = {}
  39:     cur = None
  40:     field = None
  41:     in_code = False
  42:     fence_lang = ""
  43:     d2_lines = []
  44:     va_lines = []
  45:     for line in md_text.splitlines():
  46:         if in_code:
  47:             if line.strip().startswith("```"):
  48:                 if field == "Visual asset" and fence_lang == "d2":
  49:                     out[cur]["d2"] = "\n".join(d2_lines)
  50:                 in_code, fence_lang, d2_lines = False, "", []
  51:                 continue
  52:             if fence_lang == "d2":
  53:                 d2_lines.append(line)
  54:             continue
  55:         m = SLIDE_RE.match(line)
  56:         if m:
  57:             if cur is not None:
  58:                 out[cur]["_va"] = "\n".join(va_lines)
  59:             cur = int(m.group(1))
  60:             out[cur] = {"prompt": None, "d2": None, "_va": ""}
  61:             field, va_lines = None, []
  62:             continue
  63:         if cur is None:
  64:             continue
  65:         f = FIELD_RE.match(line)
  66:         if f:
  67:             field = f.group(1)
  68:             continue
  69:         if line.strip().startswith("```"):
  70:             in_code = True
  71:             fence_lang = line.strip()[3:].strip().lower()
  72:             continue
  73:         if field == "Visual asset":
  74:             va_lines.append(line)
  75:             pm = IMG_PROMPT_RE.search(line)
  76:             if pm and not out[cur]["prompt"]:
  77:                 out[cur]["prompt"] = pm.group(1).strip().rstrip("`").strip()
  78:     if cur is not None:
  79:         out[cur]["_va"] = "\n".join(va_lines)
  80:     return out
  81: 
  82: 
  83: def build_manifest(course_dir, ch):
  84:     course = Path(course_dir)
  85:     md = (course / "manuscripts" / f"{ch}.md").read_text(encoding="utf-8")
  86:     va = parse_visual_assets(md)
  87:     img_dir = course / "assets" / "images" / ch
  88:     dia_dir = course / "assets" / "diagrams"
  89: 

 succeeded in 2190ms:

slide imageStatus imagePrimary d2Status d2Primary
----- ----------- ------------ -------- ---------
    1 present             True                   
    2 present             True                   
    3 present             True                   
    4 present             True                   
    5 deferred           False present           
    6 present             True                   
    7 present             True                   
    8 deferred           False present           
    9 present             True                   
   10 deferred           False present           
   11 present             True                   
   12 present             True                   
   13 present             True                   
   14 present             True                   
   15 deferred           False present           
   16 present             True                   
   17 present             True                   
   18 present             True                   
   19 present             True                   
   20 deferred           False present           
   21 present             True                   
   22 present             True                   
   23 present             True                   
   24 present             True                   
   25 present             True                   
   26 present             True                   



codex
소비 쪽은 이미 “manifest 우선”이라는 문구는 있지만, 현재는 대부분 `primary`가 아니라 `image.status == present` 우선순위로 설명되어 있습니다. 이 점은 제안 C가 그대로 통과되기 어려운 핵심 계약 구멍입니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'.claude/skills/pptx-build/SKILL.md' | ForEach-Object { "'$i++; if ($i -ge 1 -and $i -le 120) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'scripts/build_pptx.py' | ForEach-Object { "'$i++; if ($i -ge 120 -and $i -le 190) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'.claude/skills/book-build/SKILL.md' | ForEach-Object { "'$i++; if ($i -ge 32 -and $i -le 42) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'.claude/skills/panseo-slide/SKILL.md' | ForEach-Object { "'$i++; if ($i -ge 10 -and $i -le 20) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'.claude/skills/storyboard/SKILL.md' | ForEach-Object { "'$i++; if ($i -ge 40 -and $i -le 60) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'.claude/skills/ppt-preview/SKILL.md' | ForEach-Object { "'$i++; if ($i -ge 55 -and $i -le 70) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1394ms:
  10: 받아, 판서 엔진이 내장된 강의 슬라이드 `panseo/chNN.html`과 판서대본 `panseo/chNN_대본.md`를
  11: 만든다. 이 스킬은 하네스의 **판서 엔진 소유 스킬**이다 — 엔진(펜/모눈/선택이동/지우개/판서모드
  12: 전환/전체화면)의 요구 명세는 `reference/engine.md`, 소유 템플릿은 `template/`에 있다.
  13: 
  14: **시각자산(4단계)과의 관계**: 이 스킬은 `assets/manifest.json`을 직접 읽지 않는다 — 그대로 모드는
  15: `ppt_previews/chNN.html`(7단계, `ppt-preview`가 manifest를 읽어 이미 실자산을 반영한 산출물)을
  16: 그대로 이식하므로 간접 소비다. 요약 모드도 원고를 참고하되 이미지 삽입은 하지 않는다(저밀도 요약 취지).
  17: 
  18: ## 산출물 (항상 2개)
  19: 
  20: - `panseo/chNN.html` — 단일 파일. 판서 기능이 내장된 강의 슬라이드. 펜·터치 기기 브라우저에서

 succeeded in 1517ms:
 120:                    "image_paths": [], "code": "", "narration": ""}
 121:             field, in_code, code_lines, fence_lang = None, False, [], ""
 122:             continue
 123:         if cur is None:
 124:             continue
 125:         f = FIELD_RE.match(line)
 126:         if f:
 127:             field = f.group(1)
 128:             continue
 129:         if line.strip().startswith("```"):
 130:             in_code = True
 131:             fence_lang = line.strip()[3:].strip().lower()
 132:             continue
 133:         text = line.strip().lstrip("-").strip()
 134:         if not text:
 135:             continue
 136:         if field == "Screen":
 137:             cur["screen_lines"].append(text)
 138:             cur["screen_raw"].append(line)
 139:         elif field == "Narration":
 140:             cur["narration"] = (cur["narration"] + " " + text).strip()
 141:         elif field == "Visual asset":
 142:             for im in IMG_PATH_RE.findall(line):
 143:                 cur["image_paths"].append(im)
 144:     if cur:
 145:         slides.append(_finalize(cur))
 146:     return slides
 147: 
 148: def build_pptx(md_text, out_path, assets_root="."):
 149:     slides = parse_manuscript(md_text)
 150:     prs = Presentation()
 151:     prs.slide_width = Inches(13.333)
 152:     prs.slide_height = Inches(7.5)
 153:     layout = prs.slide_layouts[5]  # Title Only
 154:     for s in slides:
 155:         slide = prs.slides.add_slide(layout)
 156:         slide.shapes.title.text = s["title"]
 157:         top = Inches(1.8)
 158:         body_lines = s["body_lines"]
 159:         if body_lines:
 160:             box = slide.shapes.add_textbox(Inches(0.8), top, Inches(7.0), Inches(4.8))
 161:             tf = box.text_frame
 162:             tf.word_wrap = True
 163:             for i, l in enumerate(body_lines[:8]):
 164:                 p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
 165:                 p.text = l
 166:                 p.font.size = Pt(22)
 167:         for im in s["image_paths"][:1]:
 168:             p = Path(assets_root) / im
 169:             if p.exists():
 170:                 # 이미지 배치 박스: 본문이 있으면 우측 컬럼, 없으면 하단 중앙 넓은 영역.
 171:                 # 어느 경우든 슬라이드 가장자리에서 PPTX_EMBED_MARGIN 여백 확보.
 172:                 m = PPTX_EMBED_MARGIN
 173:                 box_top = top  # 제목 아래
 174:                 box_bottom = prs.slide_height - m
 175:                 box_h = box_bottom - box_top
 176:                 if body_lines:
 177:                     box_left = Inches(8.0)
 178:                     box_right = prs.slide_width - m
 179:                 else:
 180:                     box_left = m
 181:                     box_right = prs.slide_width - m
 182:                 box_w = box_right - box_left
 183:                 try:
 184:                     px_w, px_h = _image_px_size(p)
 185:                 except Exception:
 186:                     px_w, px_h = (4, 3)
 187:                 w, h = _fit_in_box(px_w, px_h, box_w, box_h)
 188:                 # 박스 안에서 중앙 정렬
 189:                 left = box_left + (box_w - w) // 2
 190:                 pic_top = box_top + (box_h - h) // 2

 succeeded in 1570ms:
   1: ---
   2: name: pptx-build
   3: description: 확정 원고(`manuscripts/chNN.md`)를 python-pptx로 16:9 PPTX(`pptx/chNN.pptx`)로 변환하고, 슬라이드마다 Narration을 발표자 노트에 삽입한다. "PPTX 만들어줘", "PPT 완성", "PPTX 빌드" 요청 시 사용. 파이프라인 10단계 — `scripts/build_pptx.py` CLI를 실행해 원고를 직접 파싱한다(HTML 프리뷰를 다시 파싱하지 않음). 확정 원고와 `--assets-root`로 지정한 과정 디렉터리의 `assets/` 하위 이미지 경로를 사용한다. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
   4: ---
   5: 
   6: # pptx-build
   7: 
   8: 확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물, manuscript-schema 문법)를 16:9 PPTX(`pptx/chNN.pptx`)로 변환하는 스킬이다. 파이프라인 10단계이며, 빌더는 `scripts/build_pptx.py`(python-pptx 1.0.2, Task 11 스파이크로 notes_slide 동작 검증됨)다.
   9: 
  10: **시각자산(4단계)과의 관계(2026-07-06 개정)**: `scripts/build_pptx.py`의 파싱 로직은 바뀌지 않는다 — 원고의 `assets/...png|jpg|jpeg|webp` 경로 패턴(`IMG_PATH_RE`)을 그대로 잡는다. `visual-assets` 단계 완료 후 원고 Visual asset 필드에 병기된 자산 경로(`→ 생성됨:`/`→ 렌더됨:` 다음 줄의 `assets/...` 경로)가 그대로 이 정규식에 매치되므로, 이 스킬은 원고에 이미 병기된 경로를 그대로 사용하기만 하면 된다(별도 manifest 조회 로직 추가 없음).
  11: 
  12: ## 전제
  13: 
  14: - `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅여야 한다. 아니면 사용자에게 알리고 중단한다.
  15: - **하드 게이트**: `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 완료(또는 명시적 보류)해야 한다.
  16: - `manuscripts/chNN.md`가 존재해야 한다.
  17: 
  18: ## 핵심 인터페이스 (고정 — 재현성을 위해 변경 시 이 문서와 브리프를 함께 갱신)
  19: 
  20: - CLI: `python scripts/build_pptx.py <manuscript.md> <out.pptx> [--assets-root <course-dir>]`
  21: - 함수: `parse_manuscript(md_text) -> list[Slide]` — Slide dict keys: `title, screen_lines, image_paths, code, narration`
  22: - 함수: `build_pptx(md_text, out_path, assets_root=".") -> int` — 생성된 슬라이드 수 반환
  23: - 원고 문법: `## Slide N. 제목` 헤더로 슬라이드 구간을 나누고, `**Screen**`/`**Narration**`/`**Visual asset**` 등 필드 라벨로 내용을 분류한다. 이미지 자산 경로는 `assets/...png|jpg|jpeg|webp` 패턴만 인식한다(D2 다이어그램의 `.d2` 소스 경로는 이미지로 삽입하지 않음 — 렌더된 png/jpg만 인식).
  24: 
  25: ## 절차
  26: 
  27: ### 1. 실행
  28: 
  29: ```powershell
  30: python scripts/build_pptx.py courses/{course-id}/manuscripts/chNN.md courses/{course-id}/pptx/chNN.pptx --assets-root courses/{course-id}
  31: ```
  32: 
  33: - 출력 대상 디렉터리(`pptx/`)가 없으면 먼저 생성한다.
  34: - 성공 시 `OK: <N> slides -> <out.pptx>` 출력.
  35: 
  36: ### 2. 검증 (확정 체크리스트)
  37: 
  38: - **슬라이드 수 일치**: 출력된 `N`이 원고의 `## Slide` 헤더 개수와 같은지 확인한다(`Select-String "^## Slide \d+\." chNN.md` 또는 grep로 카운트).
  39: - **전 슬라이드 노트 존재**: Narration 필드가 있는 모든 슬라이드에서 `notes_slide.notes_text_frame.text`가 비어 있지 않은지 확인한다. 빠르게 확인하려면:
  40: 
  41: ```powershell
  42: python -c "from pptx import Presentation; prs = Presentation('courses/{course-id}/pptx/chNN.pptx'); [print(i+1, bool(s.notes_slide.notes_text_frame.text)) for i, s in enumerate(prs.slides)]"
  43: ```
  44: 
  45: - **이미지 누락 경고**: 원고에 `assets/...png|jpg` 경로가 있는데 파일이 실제로 없으면 빌더가 조용히 건너뛴다(에러 없음) — 검증 시 원고의 이미지 경로 목록과 실제 `assets/` 파일 존재 여부를 대조해 누락 목록을 사용자에게 보고한다.
  46: - **이미지 깨짐 없음**: PowerPoint(또는 LibreOffice Impress)에서 실제로 열어 이미지·코드 블록·레이아웃이 깨지지 않았는지 사용자 확인을 받는다.
  47: - **D2 소스만 있는 슬라이드는 코드 박스로 출력되지 않는다**: 렌더 이미지(png/jpg) 없이 `` ```d2 `` 소스만 있는 슬라이드는 `code`가 비어 있어야 한다(D2 소스 텍스트가 코드 박스로 깨져 나오면 안 된다).
  48: - **이미지 오버플로 없음(안전 여백, 2026-07-06)**: 빌더의 `_fit_in_box()`가 이미지를 종횡비 유지한 채 배치 박스 안에 넣고 슬라이드 가장자리에서 `PPTX_EMBED_MARGIN`(0.5") 여백을 확보한다 — 세로형/광폭 이미지도 슬라이드를 벗어나지 않는다(스펙 §3.0-A 자산 임베드 안전 여백 규약). 검증: 전 슬라이드에서 `left+width ≤ slide_width`, `top+height ≤ slide_height`. 회귀 테스트 `test_build_pptx.py`의 초광폭/초세로/여백 3건으로 커버.
  49: - **다중 코드펜스 슬라이드는 모든 블록이 보존된다**: 한 슬라이드의 Visual asset에 표시용 코드 펜스(d2 제외)가 여러 개 있으면, 마지막 블록만 남지 않고 모든 블록이 `code`에 포함되어야 한다.
  50: 
  51: ### 3. 사용자 확인 및 확정
  52: 
  53: - 검증 결과(슬라이드 수, 노트 존재 여부, 이미지 누락 목록)를 사용자에게 보고한다.
  54: - PowerPoint에서 열어 확인해 달라고 요청한다.
  55: - 사용자가 확정하면 `courses/{course-id}/status.md`의 해당 차시 `PPTX` 칸을 ✅로 갱신하고, 산출물 인덱스에 `- chNN PPTX: pptx/chNN.pptx (확정 YYYY-MM-DD)`를 추가한다.
  56: 
  57: ## repair 규칙
  58: 
  59: 파서(`scripts/build_pptx.py`의 `parse_manuscript`)가 원고의 특정 표기(다중 라인 나레이션, 제목의 특수문자, 새로운 필드 라벨 등)를 놓치면:
  60: 
  61: 1. **원고를 수정하지 않는다** — `manuscript-schema` 문법을 따르는 확정 원고는 건드리지 않는다.
  62: 2. `scripts/build_pptx.py`의 정규식(`SLIDE_RE`, `FIELD_RE`, `IMG_PATH_RE`)이나 파싱 로직을 수정해 대응한다.
  63: 3. 수정 후 `scripts/test_build_pptx.py`에 회귀 케이스를 추가하고 `cd scripts; python -m pytest test_build_pptx.py -v`로 재실행해 통과를 확인한다.
  64: 4. 실데이터로 다시 빌드해 슬라이드 수·노트가 여전히 올바른지 재확인한다.
  65: 
  66: ## 참고
  67: 
  68: - 빌더는 `ppt_previews/chNN.html`(7단계 산출물)을 소비하지 않는다 — 원고(`manuscripts/chNN.md`)를 직접 파싱한다. HTML 프리뷰는 사람이 보는 미리보기이고, PPTX는 원고 기준의 별도 빌드다.
  69: - D2 다이어그램을 실제 이미지로 슬라이드에 넣으려면 먼저 `pub-d2-diagram` 스킬로 렌더(svg/png)한 뒤, 원고의 Visual asset 필드에 렌더 결과 png/jpg 경로를 병기해야 이 빌더가 인식한다. 이 병기는 이제 `visual-assets`(4단계)가 수행한다(§ 전제 참조).

 succeeded in 1574ms:
  55: - 참고자료 슬라이드는 `sources-canvas`로 원고 Source 목록을 나열한다.
  56: 
  57: ### 3. Visual asset 실자산 연결 (manifest 기반, 2026-07-06 개정)
  58: 
  59: **자산 해석 규칙(필수)**: 이 스킬은 원고 Visual asset의 프롬프트/D2 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 자산을 임베드한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다:
  60: 
  61: 1. `image.status == "present"`이면 `image.path`를 사용한다.
  62: 2. 아니고 `d2.status == "present"`이면 `d2.path`를 사용한다.
  63: 3. 둘 다 `present`가 아니면(`deferred`/`missing`) placeholder로 처리한다.
  64: 
  65: - (1) 이미지: `.ppt-media img` 또는 `.cover-image img`에 실제 상대경로로 삽입한다. `ppt_previews/chNN.html`은 `courses/{course-id}/ppt_previews/` 아래 있으므로, manifest의 `assets/images/chNN/...` 경로는 골든처럼 한 단계 상위로 올려 상대경로를 맞춘다(`../assets/images/chNN/...`). 원고의 `→ 생성됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다 — manifest와 다르면 manifest를 따른다.
  66: - (2) D2: 그 렌더 결과(svg/png)를 동일하게 삽입한다. 재현이 필요하면 골든처럼 `.flow`/`.node`/`.arrow`로 간단히 재현한다.
  67: - (3) placeholder: `--line` 테두리의 placeholder 박스를 두고 프롬프트 원문을 짧게 표시한다 — 실제 픽셀 이미지를 대신 만들지 않는다.
  68: 
  69: **자산 임베드 안전 여백 (2026-07-06 개정)**: 임베드된 이미지/D2가 `.ppt-media` 셀 가장자리에 닿지 않게, 이미지 전용 셀렉터 `.ppt-media > img`에만 `box-sizing: border-box; padding: clamp(10px, 4%, 28px);`를 적용한다(`object-fit: contain`은 기존 규칙 유지). **`.ppt-media`/`.cover-image` 자체나 `.flow`/`pre`/`.split` 등 비이미지 위젯에는 patting을 주지 않는다** — 그 컨테이너 안에는 이미지 외에도 순서도·코드·비교 패널이 들어가므로 전역 padding은 레이아웃을 깬다. `%` 단독 padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`(제안 B), codex 조건 2: `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md`.
  70: 

 succeeded in 1844ms:
  40:   8. **실습/진행** — Practice 필드(`- 없음.`이면 그대로 표시).
  41:   9. *(평가 슬라이드만)* **평가 문항** (`class="lecture-block instructor-only"`) — Assessment 구조화 필드(유형/정답/난이도/해설/관련학습보기)를 그대로 옮긴다. 수강자 화면(`slide-preview`)에는 문제와 보기만 노출하고 정답·해설은 이 강사 전용 패널에만 둔다.
  42:   10. **PPT 반영 메모** — 골든 고정 문구를 그대로 쓴다: "슬라이드 화면에는 핵심 문구와 이미지 또는 다이어그램을 크게 배치하고, 자세한 설명은 강사용 패널과 발표자 노트에 반영한다."
  43: 
  44: ### 3. 이미지/다이어그램 자산 연결 (manifest 기반, 2026-07-06 개정)
  45: 
  46: **자산 해석 규칙(필수)**: 이 스킬은 원고 Visual asset의 프롬프트/D2 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 자산을 임베드한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다:
  47: 
  48: 1. `image.status == "present"`이면 `image.path`를 사용한다.
  49: 2. 아니고 `d2.status == "present"`이면 `d2.path`를 사용한다.
  50: 3. 둘 다 `present`가 아니면(`deferred`/`missing`) placeholder로 처리한다.
  51: 
  52: - (1) 이미지 경로: `slide-preview` 안에 `<img src="{상대경로}" alt="...">`로 삽입한다. `storyboards/chNN.html`은 `courses/{course-id}/storyboards/` 아래 있으므로, manifest의 `assets/images/chNN/...` 경로는 골든 실제 참조 패턴(`../assets/images/ch01/...`)처럼 한 단계 상위로 올려 상대경로를 맞춘다. 원고에 병기된 `→ 생성됨:` 문구는 사람이 읽는 보조 표기일 뿐 신뢰 소스가 아니다 — manifest와 다르면 manifest를 따른다.
  53: - (2) D2 경로: 그 렌더 결과(svg/png)를 동일하게 삽입한다.
  54: - (3) placeholder: `slide-preview` 안에 `--line` 테두리의 placeholder 박스를 두고, `deferred`/`missing`이면 원고의 `GPT image prompt:`(또는 `Comic panel prompt:`)/D2 소스 원문을, 재현이 어려운 D2는 골든 Slide 5·8처럼 `.flow`/`.node`/`.arrow`로 흐름을 간단히 재현하거나 `<pre class="asset-code">`로 노출한다(골든 그대로). 실제 픽셀 이미지를 대신 만들지 않는다.
  55: - 화면 캡처 계획(`Screenshot plan:`)뿐이고 manifest에도 항목이 없으면 캡처 대상 목록을 placeholder 텍스트로 보여준다.
  56: 
  57: **자산 임베드 안전 여백 (2026-07-06 개정)**: 임베드된 이미지/D2가 `.slide-preview` 셀 가장자리에 닿지 않게, 이미지 전용 셀렉터 `.slide-preview > img`에만 `box-sizing: border-box; padding: clamp(12px, 4%, 32px);`를 적용한다(`object-fit: contain`은 기존 규칙 유지). **`.slide-preview` 자체나 `.flow`/`pre`/`.split` 등 비이미지 위젯에는 padding을 주지 않는다** — 그 컨테이너 안에는 이미지 외에도 순서도·코드·비교 패널이 들어가므로 전역 padding은 레이아웃을 깬다. `%` 단독 padding은 width 기준이라 세로형 이미지에서 과하게 먹으므로 반드시 `clamp()`를 쓴다. 근거: `docs/proposals/2026-07-06_asset-embed-safe-margin.md`(제안 B), codex 조건 2: `docs/reviews/2026-07-06_asset-embed-margin-codex-review.md`.
  58: 
  59: ### 4. 자립성 검증
  60: 

 succeeded in 1881ms:
  32: 
  33: - 챕터는 이야기 파트(문제 등장 → 비유로 기술 소개 → Try/Fail 시행착오 → 결과)로 시작하고, 이후 기술 파트(정식 정의·심화 설명·실습 코드)로 이어진다. 두 파트를 가르는 라벨형 H2("## 이야기", "## 기술 설명" 등)는 달지 않는다 — 자연스러운 장 제목(예: `## 1장. 팔찌를 잃어버린 날`)만 쓴다.
  34: - 원고의 핵심 개념·실습·평가문항이 하나도 누락되지 않도록 챕터 전체에 분배한다(한 슬라이드 = 반드시 한 장면일 필요는 없다. 여러 슬라이드를 하나의 장면으로 압축하거나, 한 슬라이드를 여러 장면으로 늘려도 된다).
  35: - 캐릭터 등장 규칙(2개 챕터 연속 부재 금지)을 지킨다.
  36: - **자산 해석 규칙(필수, 2026-07-06 개정)**: 이미지·D2 PNG 삽입은 원고 Visual asset의 프롬프트 텍스트가 아니라 `assets/manifest.json`(4단계 `visual-assets` 소유, SSOT)을 읽어 결정한다. 대상 슬라이드의 manifest 항목을 다음 순서로 해석한다: (1) `image.status == "present"`이면 `image.path`, (2) 아니고 `d2.status == "present"`이면 `d2.path`, (3) 둘 다 `present`가 아니면(`deferred`/`missing`) 그 장면은 삽화 없이 텍스트만으로 쓴다. 실사용 경로는 `book/chNN_원고.md` 기준 상대경로로 보정한다. 원고의 `→ 생성됨:`/`→ 렌더됨:` 병기는 보조 표기일 뿐 신뢰 소스가 아니다.
  37: 
  38: ### 3. humanizer 패스
  39: 
  40: `book/chNN_원고.md` 작성 직후 **humanizer 스킬**을 호출해 AI 문체 24패턴(쉼표 과다, 어색한 띄어쓰기, AI 선호 어휘, 대명사·복수형 과다, 구조적 단조로움 등)을 교정한다. 교정 결과로 `book/chNN_원고.md`를 갱신한다.
  41: 
  42: ### 4. 편집 검토 패스 (필수, 3종)

exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'.claude/skills/visual-assets/SKILL.md' | ForEach-Object { "'$i++; if ($i -ge 1 -and $i -le 130) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "시각자산|visual-assets|manifest|deferred|partial|missing|하드 게이트" courses/spring-boot-basic/status.md templates docs .claude/skills/course-pipeline/SKILL.md' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'scripts/annotate_manuscript_assets.py' | ForEach-Object { "'$i++; if ($i -ge 1 -and $i -le 90) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1023ms:
   1: ---
   2: name: visual-assets
   3: description: 확정 원고(`manuscripts/chNN.md`)의 Visual asset 필드(이미지 프롬프트·D2 소스)를 실자산(PNG/SVG)으로 생성해 `assets/manifest.json`(SSOT)을 확정하는 스킬. "시각자산 생성", "이미지·다이어그램 만들어줘", "자산 렌더", "visual-assets" 요청 시 사용. 파이프라인 4단계(원고확정 직후, 코드/스토리보드 등 소비 산출물보다 앞) — 이후 6~11단계(스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)가 재동기화 폭포 없이 처음부터 실자산을 임베드하도록 하는 것이 존재 이유. image-gen `[IMAGE PROMPT]` 태그 자동 변환 브릿지 내장, `원고확정 ✅`(또는 명시적 `deferred`) hard gate, 해시 기반 부분(stale) 재생성을 담당한다.
   4: ---
   5: 
   6: # visual-assets
   7: 
   8: 확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 **Visual asset** 필드에 있는 이미지 프롬프트·D2 소스를 실제 자산 파일(`assets/images/chNN/`, `assets/diagrams/`)로 생성하고, 그 결과를 `assets/manifest.json`(SSOT)에 확정하는 스킬이다.
   9: 
  10: **파이프라인 위치**: `manuscript-final`(3단계, 원고확정) 바로 다음, `practice-code`(코드) 이전. 자산 생성이 소비 산출물(스토리보드·PPT프리뷰·판서·PPTX·책) 뒤로 밀리면, 나중에 이미지를 만들 때마다 그 4~5개 산출물을 전부 다시 만들어야 하는 재동기화 폭포가 생긴다(`docs/proposals/2026-07-06_visual-assets-stage-redesign.md` §1). 이 스킬을 원고확정 직후에 실행해 그 문제를 구조적으로 없앤다.
  11: 
  12: **설계 근거**: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`(제안 A·E), codex 사전검증 `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`(4개 조건 — hard gate/해시 stale/manifest SSOT/소비 계약).
  13: 
  14: **엔진(호출만 하고 자체 생성 로직 없음)**: `image-gen`(`scripts/image_gen.py` — Codex 이미지), `pub-d2-diagram`(`scripts/render_md_diagrams.py` + Windows PNG 변환 — D2 렌더). manifest 빌더: `scripts/build_asset_manifest.py`(레포 루트, 이미 작성됨 — 이 스킬이 수정하지 않고 그대로 호출).
  15: 
  16: ## 절차
  17: 
  18: ### 1. 입력 확인 — 선행 게이트 (hard gate 대상 자신도 게이트를 받는다)
  19: 
  20: - `manuscripts/chNN.md`가 없거나 `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅가 아니면 **중단한다**. 미확정 원고로 자산을 생성하지 않는다(확정 후에도 프롬프트가 바뀌면 §7 해시 stale로 흡수하지, 티키타카 중간에 매번 생성하지 않는다).
  21: - `status.md`에 `시각자산` 열이 아직 없으면(제안 C 반영 전일 수 있음) 사용자에게 알리고, 표 구조를 이 스킬이 임의로 바꾸지 않는다 — 열 추가는 `templates/status_template.md` 갱신(제안 D 반영 범위)로 별도 처리한다. 열이 없어도 아래 자산 생성 자체는 진행할 수 있다(§6에서 상태 반영만 보류).
  22: - 대상 차시(chNN)·과정 디렉터리(`courses/{course-id}`)를 확정하고, 이번에 생성할 슬라이드 범위를 사용자에게 확인한다: "지금 전부 생성" / "일부만 생성하고 나머지는 나중(deferred)" / "이미 지정한 슬라이드만".
  23: 
  24: ### 2. 이미지 브릿지 (자동)
  25: 
  26: 원고 스키마의 인라인 라벨(`GPT image prompt:` / 구 표기 `시각자료 프롬프트(영문):`, 만화 2컷은 `Comic panel prompt:`)은 `image_gen.py`가 스캔하는 리터럴 블록 형식이 아니다. 이 스킬이 **자동으로** 변환한다.
  27: 
  28: - `manuscripts/chNN.md`를 훑어 이번에 생성하기로 한 슬라이드의 이미지 프롬프트를 전부 수집한다(§1에서 "나중에"로 미루기로 한 슬라이드는 제외 — placeholder 유지).
  29: - 슬라이드마다 아래 블록을 만들어 **임시 스크래치 파일 하나**(세션 스크래치 디렉터리, 또는 `courses/{course-id}/.tmp_visual_assets_chNN.md`)에 전부 모아 담는다(원고 `chNN.md`에는 절대 직접 삽입하지 않는다 — `image_gen.py`는 처리한 블록을 프롬프트 원문째로 지우고 `<img>`로 치환해버리는 파괴적 스크립트다):
  30:   ```
  31:   <!-- [IMAGE PROMPT: chNN-slideNN]
  32:   {프롬프트 원문 그대로}
  33:   path: assets/images/chNN/slideNN.png
  34:   -->
  35:   ![chNN-slideNN](placeholder.png)
  36:   ```
  37:   - `id`는 `chNN-slideNN` 형식(예: `ch01-slide05`)으로 슬라이드를 식별한다.
  38:   - `path:`가 실제 저장 경로를 결정한다(project_root=`courses/{course-id}` 기준 상대경로, `assets/images/chNN/slideNN.png` 고정 — `pptx-build`의 `IMG_PATH_RE`가 이 패턴만 인식하므로 어긋나면 안 된다).
  39:   - `![...](...)` 줄의 `alt`/`src`는 아무 값이나 무방하다(정규식 매치 목적일 뿐, 실사용 안 됨).
  40: - `python .claude/skills/image-gen/scripts/image_gen.py <스크래치.md> courses/{course-id}` 를 실행한다. 성공한 슬라이드는 지정한 `path:`로 PNG가 이동된다. 실패한 슬라이드는 플레이스홀더가 보존되고 스킬 실행 로그로만 표시된다(원고엔 영향 없음).
  41: - **지연 경고**: Codex 이미지 생성은 장당 1~2분, 직렬 처리다. 26장이면 30~50분 걸릴 수 있다.
  42:   - 스크래치 파일에 이번에 생성할 모든 슬라이드의 블록을 한 번에 담아 **백그라운드로 1회** 실행한다(예: Bash `run_in_background`).
  43:   - 대기 중 **폴링 전용 서브에이전트를 띄우지 않는다** — 파일럿에서 토큰만 소모하고 진행에 도움이 안 됐던 실패 패턴이다. 대신 `assets/images/chNN/`에 생성된 PNG 개수를 주기적으로(사용자가 물었을 때, 또는 Monitor 도구의 until-루프) 확인해 "몇 장 중 몇 장 완료"로 진행 상황을 보고한다.
  44:   - 완료(또는 부분 완료 확인) 후에만 다음 단계로 넘어간다.
  45: - 완료 후 **스크래치 파일은 삭제한다**(원고·course_dir에 잔재를 남기지 않는다).
  46: 
  47: ### 3. D2 렌더
  48: 
  49: - 원고의 ` ```d2 ` 코드펜스는 `pub-d2-diagram`의 `scripts/render_md_diagrams.py <원고.md> <images_dir> <접두사>`가 그대로 인식한다(변환 불필요) — ELK 레이아웃 + 모노톤 치환까지 자동, **SVG로 저장**한다.
  50: - 이 스크립트의 파일명은 파일 내 D2 블록 **등장 순서**(`{접두사}-d{i}.svg`)로 매겨진다 — 슬라이드 번호 기반이 아니다. 반면 `build_asset_manifest.py`(§4)와 기존 소비 계약은 `assets/diagrams/{chNN}-slide{NN}-{요지}.png` 형식(슬라이드 번호 포함, PNG)을 기대한다(`courses/spring-boot-basic/assets/diagrams/ch01-slide05-http.png` 등 기존 실사례 참고). 따라서:
  51:   1. 렌더된 `{접두사}-d{i}.svg`를 원고 순서와 대조해 어느 슬라이드에 대응하는지 확인한다.
  52:   2. `pub-d2-diagram` SKILL.md의 "Windows 렌더" 절(headless Chromium 스크린샷, 고정 뷰포트/스케일/투명배경)에 따라 SVG → PNG로 변환한다.
  53:   3. 최종 파일을 `assets/diagrams/{chNN}-slide{NN}-{요지}.png`로 저장(또는 리네임)한다 — `{요지}`는 다이어그램 내용을 요약한 짧은 영문/한글 슬러그.
  54:   4. 종횡비가 3:1을 넘으면 `pub-d2-diagram`의 종횡비 가이드에 따라 원고 D2 소스를 `direction: down` 등으로 재배치할지 사용자에게 확인한다(자동 재배치 아님).
  55: 
  56: ### 4. manifest 생성 (SSOT)
  57: 
  58: - `python scripts/build_asset_manifest.py courses/{course-id} chNN` 를 실행한다(레포 루트 스크립트, 수정하지 않고 그대로 호출).
  59: - 결과 `courses/{course-id}/assets/manifest.json`이 이후 모든 소비 판단의 **단일 진실원(SSOT)**이다. 슬라이드별 `image`/`d2` 블록에 `path`/`prompt_hash`(또는 `d2_hash`)/`status`(`present`/`deferred`/`missing`)가 담긴다.
  60: - D2가 있는 슬라이드는 이미지가 없어도 스크립트가 자동으로 `image.status = "deferred"`(primary=false) 처리한다 — D2가 그 슬라이드의 주 시각자료이므로 이미지 중복 생성이 불필요하다는 뜻이다. 이 슬라이드는 결핍(missing)으로 세지 않는다.
  61: - 최상위 `overall_status`(present/partial/missing)와 `visual_slides_covered`/`visual_slides_total`를 확인해 §6·§7 판단의 근거로 삼는다.
  62: 
  63: ### 5. 원고 주석 (보조 — SSOT 아님)
  64: 
  65: - 실제 생성/렌더가 완료된 슬라이드의 Visual asset 필드에 사람이 읽기 위한 병기를 남긴다: 이미지는 `→ 생성됨: assets/images/chNN/slideNN.png`, D2는 `→ 렌더됨: assets/diagrams/chNN-slideNN-*.png`(실제 파일명 그대로). 프롬프트/D2 원문은 지우지 않는다(재생성 근거).
  66: - 이 주석은 사람이 읽기 위한 보조 표기일 뿐이다 — **manifest.json이 SSOT**다. 소비 스킬(`storyboard`/`ppt-preview`/`pptx-build`/`panseo-slide`/`book-build`)의 "원고 주석이 아니라 manifest 확정 경로를 읽도록" 계약 전환은 이 스킬의 책임 범위 밖(제안 E 조건 4, 별도 반영 — 각 소비 스킬의 SKILL.md 개정 필요)이다. 전환 전까지는 두 표기(원고 주석 + manifest)가 병존한다.
  67: 
  68: ### 6. 하드 게이트 (기본값 — placeholder로 조용히 넘어가지 않는다)
  69: 
  70: manifest의 `overall_status`에 따라 `status.md`의 `시각자산` 칸(있는 경우)을 갱신한다:
  71: 
  72: - `present`(커버 대상 슬라이드 전부 present/deferred) → `✅`.
  73: - 사용자가 명시적으로 일부를 "나중에"로 선택했다면 → `deferred`로 표기한다(자동으로 조용히 `⬜`나 `✅`로 얼버무리지 않는다 — placeholder 유지 사실을 표에 남긴다).
  74: - 일부만 생성됐고 나머지는 아직 결정 안 됨(`missing`이 남아 있는데 사용자 확인 전) → `partial`.
  75: - **hard gate 본체**: 이후 5~11단계(코드~책)를 호출하는 쪽(`course-pipeline` 오케스트라 또는 사용자 수동 호출)은 이 칸이 `✅` 또는 명시적 `deferred`일 때만 진행해야 한다 — `missing`/`partial`인 채로 넘어가지 않는다. 이 스킬 자신은 다음 단계를 호출하지 않으므로, 상태를 정확히 남겨 두는 것이 게이트 역할을 한다.
  76: 
  77: ### 7. 해시 기반 stale 재감지 (재실행 시 — 원고가 확정 후 다시 바뀐 경우)
  78: 
  79: 원고 확정 후 프롬프트/D2가 수정되면(재개된 티키타카, "이 이미지 프롬프트 바꿔줘" 등) **전체 재생성 금지** — 바뀐 슬라이드만 재생성한다.
  80: 
  81: 1. 재실행 전 기존 `assets/manifest.json`을 읽어 슬라이드별 `prompt_hash`/`d2_hash`를 보관해 둔다(파일 그대로 두거나 값만 메모).
  82: 2. `build_asset_manifest.py`를 다시 실행한다 — 이 스크립트는 **현재 원고 텍스트**에서 해시를 새로 계산하지만, 기존 생성 파일의 내용이 그 해시와 실제로 일치하는지는 검증하지 않는다(파일 존재+크기만 확인). 그래서 이 비교는 스킬이 직접 한다.
  83: 3. 1단계에서 보관한 값과 새 manifest의 슬라이드별 해시를 비교한다.
  84:    - 해시가 달라졌는데 상태가 여전히 `present`인 슬라이드 → **stale**: 원고는 바뀌었지만 자산은 옛날 그대로다. 그 슬라이드만 §2(이미지) 또는 §3(D2)을 다시 수행해 파일을 교체한 뒤 manifest를 재생성한다.
  85:    - 해시가 같으면 손대지 않는다.
  86: 4. stale로 재생성한 슬라이드는 후속 산출물(스토리보드 등)에도 "이 슬라이드만 재검수 필요"로 보고한다 — 다른 슬라이드까지 재작업 대상으로 넓히지 않는다.
  87: 
  88: ## 확정 체크리스트
  89: 
  90: - [ ] **manifest 존재 및 판정 명시**: `assets/manifest.json`이 존재하고 `overall_status`가 `present`이거나, 사용자가 실제로 선택한 `deferred`/`partial`이다(임의로 `missing`을 방치한 채 넘어가지 않았다).
  91: - [ ] **파일 실존·용량**: manifest에 `status: "present"`로 표시된 모든 자산(`image`/`d2`)이 실제로 파일로 존재하고 크기 > 0 바이트다.
  92: - [ ] **커버 안 된 시각 슬라이드 0**: Visual asset 필드가 있는 슬라이드 중 `present`도 `deferred`도 아닌(`missing`) 슬라이드가 0개다. 남아 있다면 사용자에게 구체적으로(어느 슬라이드) 보고하고 생성/보류 여부를 재확인한다.
  93: - [ ] **브릿지 위생**: 스크래치 파일이 실행 후 삭제됐고, 원고 `chNN.md`에는 image-gen용 HTML 주석 블록이 남아 있지 않다.
  94: - [ ] **D2 파일명 계약**: D2 렌더 산출물이 `assets/diagrams/{chNN}-slide{NN}-*.png` 형식(슬라이드 번호 포함, PNG)으로 저장돼 있다(§3 리네임 누락 없음).
  95: 
  96: ## repair 규칙
  97: 
  98: 체크리스트 중 하나라도 실패하면 **전체를 다시 생성하지 않는다.**
  99: 
 100: - `missing`으로 남은 슬라이드만 골라 사용자에게 보고("Slide 9 이미지가 아직 없습니다 — 지금 생성할까요, 나중으로 미룰까요?")한 뒤, 선택에 따라 §2/§3을 그 슬라이드에 한해 재실행하거나 `deferred`로 명시 확정한다.
 101: - 파일이 0바이트/손상이면 해당 슬라이드만 §2/§3 재실행(생성 실패 원인을 함께 보고 — Codex 호출 실패, d2 컴파일 오류 등).
 102: - D2 파일명이 계약과 다르면(슬라이드 번호 누락 등) 파일만 리네임하고 `build_asset_manifest.py`를 다시 돌려 manifest를 갱신한다(재렌더 불필요).
 103: - 원고가 재수정돼 해시가 어긋난 경우는 §7 절차를 그대로 따른다(바뀐 슬라이드만).
 104: - 스크래치 파일이 삭제되지 않았으면 지운다(원고·과정 디렉터리에 임시 파일을 남기지 않는다).
 105: 
 106: ## 참고
 107: 
 108: - 제안·검증 문서: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`, `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`
 109: - manifest 빌더(수정 금지, 그대로 호출): `scripts/build_asset_manifest.py`
 110: - 이미지 엔진: `.claude/skills/image-gen/SKILL.md` + `scripts/image_gen.py`(브릿지 블록 정규식·이동 로직의 원본)
 111: - D2 엔진: `.claude/skills/pub-d2-diagram/SKILL.md`(Windows 렌더·종횡비 절 포함) + `scripts/render_md_diagrams.py`
 112: - 원고 스키마(Visual asset 하위 유형): `.claude/skills/manuscript-draft/references/manuscript-schema.md` §4
 113: - 기존 실사례(수동으로 이 절차를 먼저 밟아본 파일럿): `courses/spring-boot-basic/assets/manifest.json`, `courses/spring-boot-basic/assets/diagrams/ch01-d2-manifest.md`
 114: - **범위 밖(별도 반영 대상)**: `status.md`의 `시각자산` 열 신설(제안 C), `CLAUDE.md`/설계 문서/`course-pipeline` 매핑 표에 이 스킬을 11단계 파이프라인으로 편입(제안 D), 소비 스킬(storyboard/ppt-preview/pptx-build/panseo-slide/book-build)의 "manifest 우선 소비" 계약 전환(제안 E 조건 4) — 이 스킬은 이 변경들이 아직 반영되지 않은 상태에서도 단독으로 동작하도록 §1·§5·§6에서 방어적으로 서술했다.
 115: - 이 스킬은 절차 문서이며 TDD 대상이 아니다. 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.

 succeeded in 1102ms:
   1: """원고 Visual asset 필드에 manifest의 확정 자산 경로를 병기(주석).
   2: 
   3: visual-assets 스테이지의 일부. manifest.json에서 슬라이드별 present 자산을 읽어,
   4: 원고(manuscripts/chNN.md)의 해당 `**Visual asset**` 블록 끝에
   5: `→ 생성됨: <path>`(이미지) / `→ 렌더됨: <path>`(D2) 한 줄을 삽입한다.
   6: - 멱등(idempotent): 이미 같은 경로가 병기돼 있으면 건너뛴다.
   7: - manifest가 SSOT이고 이 주석은 사람이 읽는 보조 표기(+ build_pptx의 IMG_PATH_RE가 잡는 용도).
   8: 
   9: 사용:
  10:   python scripts/annotate_manuscript_assets.py <course_dir> <chNN>
  11: """
  12: import json
  13: import re
  14: import sys
  15: from pathlib import Path
  16: 
  17: 
  18: def annotate(course_dir, ch):
  19:     course = Path(course_dir)
  20:     md_path = course / "manuscripts" / f"{ch}.md"
  21:     manifest = json.loads((course / "assets" / "manifest.json").read_text(encoding="utf-8"))
  22:     by_slide = {s["slide"]: s for s in manifest["slides"]}
  23: 
  24:     lines = md_path.read_text(encoding="utf-8").splitlines()
  25:     out = []
  26:     cur_slide = None
  27:     in_va = False
  28:     slide_re = re.compile(r"^## Slide (\d+)\.")
  29:     field_re = re.compile(r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*")
  30: 
  31:     def va_annotations(slide):
  32:         """이 슬라이드에 병기할 라인들(present 자산만)."""
  33:         anns = []
  34:         entry = by_slide.get(slide, {})
  35:         img = entry.get("image", {})
  36:         d2 = entry.get("d2", {})
  37:         if img.get("status") == "present":
  38:             anns.append(f"- → 생성됨: {img['path']}")
  39:         if d2.get("status") == "present":
  40:             anns.append(f"- → 렌더됨: {d2['path']}")
  41:         return anns
  42: 
  43:     def flush_va(buffer, slide):
  44:         """Visual asset 블록 buffer 끝에 주석을 삽입(중복 제거)."""
  45:         anns = va_annotations(slide)
  46:         existing = "\n".join(buffer)
  47:         for a in anns:
  48:             path = a.split(": ", 1)[1]
  49:             if path not in existing:
  50:                 buffer.append(a)
  51:         return buffer
  52: 
  53:     va_buffer = []
  54:     inserted = 0
  55:     for line in lines:
  56:         m = slide_re.match(line)
  57:         if m:
  58:             if in_va and va_buffer:
  59:                 before = len(va_buffer)
  60:                 va_buffer = flush_va(va_buffer, cur_slide)
  61:                 inserted += len(va_buffer) - before
  62:                 out.extend(va_buffer)
  63:                 va_buffer = []
  64:             cur_slide = int(m.group(1))
  65:             in_va = False
  66:             out.append(line)
  67:             continue
  68:         f = field_re.match(line)
  69:         if f:
  70:             # 이전 Visual asset 블록 종료 처리
  71:             if in_va and va_buffer:
  72:                 before = len(va_buffer)
  73:                 va_buffer = flush_va(va_buffer, cur_slide)
  74:                 inserted += len(va_buffer) - before
  75:                 out.extend(va_buffer)
  76:                 va_buffer = []
  77:             in_va = (f.group(1) == "Visual asset")
  78:             if in_va:
  79:                 out.append(line)
  80:             else:
  81:                 out.append(line)
  82:             continue
  83:         if line.strip() == "---" and in_va:
  84:             if va_buffer:
  85:                 before = len(va_buffer)
  86:                 va_buffer = flush_va(va_buffer, cur_slide)
  87:                 inserted += len(va_buffer) - before
  88:                 out.extend(va_buffer)
  89:                 va_buffer = []
  90:             in_va = False

 succeeded in 1141ms:
.claude/skills/course-pipeline/SKILL.md:21:| 시각자산 | `visual-assets` | `assets/images/chNN/`, `assets/diagrams/`, `assets/manifest.json` |
.claude/skills/course-pipeline/SKILL.md:41:- 위 매핑 표의 순서(`과정개요서 → 원고초안 → 원고확정 → 시각자산 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`)를 그대로 따라, 각 차시(chNN) 행에서 왼쪽부터 훑어 **첫 번째 ⬜ 또는 🔄 셀**을 찾는다.
.claude/skills/course-pipeline/SKILL.md:42:  - `시각자산` 칸은 `deferred`도 완료로 간주한다(➖와 동일하게, 뒤 §3 하드 게이트 조건 참조) — `deferred`는 사용자가 "지금은 만들지 않겠다"고 명시적으로 선택한 상태이므로 오케스트라가 임의로 재개하지 않는다(➖ 보류와 같은 취급).
.claude/skills/course-pipeline/SKILL.md:56:| 시각자산 (`visual-assets`) | 원고확정 ✅ |
.claude/skills/course-pipeline/SKILL.md:57:| 코드 (`practice-code`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:58:| 스토리보드 (`storyboard`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:59:| PPT프리뷰 (`ppt-preview`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:60:| 판서 (`panseo-slide`) | (원고확정 ✅ 요약 모드 / PPT프리뷰 ✅ 그대로 모드 — 모드는 스킬이 실행 시 사용자에게 물음) **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:61:| 시뮬 (`edu-sim-builder`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:62:| PPTX (`pptx-build`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:63:| 책 (`book-build`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
.claude/skills/course-pipeline/SKILL.md:65:**하드 게이트(codex 조건 반영)**: 시각자산이 `✅`도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 코드~책(5~11단계)은 진행하지 않는다 — placeholder로 그냥 넘어가지 않는다. `partial`/`stale`은 완료로 보지 않으므로, 오케스트라는 후속 단계를 호출하지 않고 먼저 `visual-assets`로 돌아가 나머지 슬라이드를 마무리(또는 재생성)하도록 사용자에게 제안한다.
.claude/skills/course-pipeline/SKILL.md:67:예: 코드 단계(`practice-code`)를 호출하려는데 해당 차시 `원고확정`이 아직 ⬜/🔄이면, 오케스트라는 `practice-code`를 호출하지 않고 "ch03의 원고확정이 아직 끝나지 않았습니다. 먼저 `manuscript-final`부터 진행할까요?"라고 사용자에게 확인한다. `원고확정`은 ✅인데 `시각자산`이 ⬜/🔄/`partial`/`stale`이면 "ch03의 시각자산이 아직 완료(✅)되지 않았거나 명시적 `deferred`가 아닙니다. 먼저 `visual-assets`부터 진행할까요?"라고 확인한다.
.claude/skills/course-pipeline/SKILL.md:95:1. 해당 차시의 **표 전체를 인덱스 재검증**한다: 매핑 표의 산출물 경로 규약(`courses/{course-id}/manuscripts/chNN.md`, `assets/manifest.json`(+ `assets/images/chNN/`, `assets/diagrams/`), `storyboards/chNN.html`, `ppt_previews/chNN.html`, `panseo/chNN.html`, `simulators/chNN_*.html`, `pptx/chNN.pptx`, `book/chNN.pdf`, `code/chNN/`)에 따라 ✅로 표시된 모든 셀의 파일이 실제로 존재하는지 하나씩 확인한다. `시각자산` 칸이 `deferred`/`partial`이면 해당 상태값이 `assets/manifest.json`의 실제 상태와 일치하는지도 확인한다.
.claude/skills/course-pipeline/SKILL.md:102:- 파이프라인 표·오케스트라 설계: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3, §3.0-A(visual-assets), §3.2, §4(디렉터리 구조)
courses/spring-boot-basic/status.md:5:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
courses/spring-boot-basic/status.md:10:시각자산 전용 상태값: `deferred`(placeholder 유지) / `partial`(일부 생성) / `stale`(원고 변경으로 재생성 필요)
courses/spring-boot-basic/status.md:12:> ch01 전 단계는 2026-07-06 자율 생성 + 자가검증 완료. **아침 사용자 검토 대기**. 파이프라인 11단계(visual-assets 신설) 재설계 후 새 순서로 재빌드됨.
courses/spring-boot-basic/status.md:18:- ch01 시각자산: assets/manifest.json (SSOT, 26/26 커버 — GPT 이미지 21 + D2 5), assets/images/ch01/slide*.png(21), assets/diagrams/ch01-slide{05,08,10,15,20}-*.png(5, slide05/20 종횡비 재렌더 2.15:1/2.17:1)
courses/spring-boot-basic/status.md:29:- D2 슬라이드(05/08/10/15/20)의 GPT 이미지: `deferred` — D2가 주 시각자료라 중복 불필요 (manifest 기록)
templates\status_template.md:5:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
templates\status_template.md:11:**시각자산 칸 전용 상태값** (하드 게이트 — 코드~책 단계는 이 칸이 `✅` 또는 `deferred`여야 진행):
templates\status_template.md:12:- `deferred` — 지금 생성하지 않고 placeholder를 유지하기로 명시적으로 선택함(사유·재개 조건은 보류/누락 섹션에 기록).
templates\status_template.md:13:- `partial` — 슬라이드 일부는 생성 완료(`present`)했지만 나머지가 아직 미확정(`missing`)이고 사용자가 그 나머지를 `deferred`로 확정 짓지 않은 상태(`visual-assets` §6). 전부 `present`가 되거나 남은 슬라이드를 명시적으로 `deferred`로 확정하면 `✅`로 갱신.
templates\status_template.md:14:- `stale` — 원고 Visual asset(프롬프트/D2)이 변경되어 기존 자산의 해시가 원고와 불일치 — 해당 슬라이드 자산만 재생성 필요(`assets/manifest.json` 참조).
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:1:# 제안서: 시각자산 스테이지 신설 + 자산 파이프라인 재설계
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:4:- 상태: codex 사전검증 완료(`docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`) — 조건부 승인, 4개 조건 반영(§2.5)
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:20:### 제안 A (핵심): "시각자산" 스테이지 신설 — 원고확정 직후, 소비 산출물 앞
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:22:파이프라인을 10단계 → **11단계**로 바꾼다. 새 단계 `visual-assets`를 4번(원고확정 다음, 코드 앞)에 넣는다.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:26:4 visual-assets(신규) → 5 practice-code → 6 storyboard → 7 ppt-preview →
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:30:`visual-assets` 스킬의 책임:
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:41:### 제안 C: status.md에 `시각자산` 칸 추가
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:42:열: `원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책` (10칸 → 11칸).
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:43:상태 기호 확장: `⬜/🔄/✅/➖` 외에 자산 단계 전용으로 **`deferred`(placeholder 유지)·`partial`(일부만 생성)·`stale`(원고 변경으로 재생성 필요)** 를 status.md 범례에 추가.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:45:### 제안 E (codex 조건 반영): hard gate·manifest·해시 stale·소비 계약
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:46:1. **hard gate**: visual-assets가 `✅` 또는 명시적 `deferred`일 때만 6~11단계를 진행. placeholder로 그냥 넘어가지 않는다.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:47:2. **asset manifest(SSOT)**: `courses/{id}/assets/manifest.json` — 슬라이드→{경로, prompt_hash/d2_hash, 상태}. 원고 주석(`→ 생성됨:`)은 사람이 읽는 보조일 뿐, 소비 스킬은 manifest를 신뢰.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:49:4. **소비 스킬 계약 변경**: storyboard·ppt-preview·pptx-build·panseo·book-build은 원고 프롬프트 텍스트가 아니라 **manifest의 확정 경로**를 읽어 자산을 임베드한다(경로 없으면 그 슬라이드만 placeholder). 이 변경이 D 반영 범위에 포함됨.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:53:- 설계 문서(spec) §3 표·§6·§7 개정, CLAUDE.md 파이프라인 표·트리거 라우팅, `templates/status_template.md` 열, course-pipeline 매핑 표에 `visual-assets` 추가.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:54:- 신규 스킬 `.claude/skills/visual-assets/SKILL.md`. image-gen/pub-d2-diagram은 이 스킬이 호출하는 엔진으로 유지(기존과 동일).
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:61:- 영향: 설계 문서, CLAUDE.md, status 템플릿, course-pipeline, manuscript-final(자산 서술 이관), 신규 visual-assets 스킬, pub-d2-diagram. 기존 ch01 산출물은 재설계 후 새 순서로 재빌드(이번 재동기화가 사실상 그 시연).
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:1:# 제안: 시각자산 기본값 D2 → GPT 이미지 전환 (D2는 opt-in 폴백)
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:4:- 현행 `build_asset_manifest.py`는 슬라이드에 D2 블록이 있으면 D2를 무조건 주 시각자료로 삼고, 같은 슬라이드의 GPT 이미지를 `status: deferred, primary: false`로 강등한다(현재 코드 105~120행).
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:9:- **A. manifest 빌더 로직 역전**: 이미지 프롬프트가 있으면 이미지가 primary가 기본. D2는 원고 Visual asset 필드에 `주 시각자료: D2`(또는 `Primary asset: D2`) 마커가 있거나, 이미지 프롬프트가 아예 없을 때만 primary.
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:11:- **C. 소비 스킬 계약**: 소비 스킬은 슬라이드별 manifest `primary` 자산을 임베드한다(이미지 primary면 이미지, D2 primary면 D2).
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:12:- **D. 문서 동기화**: visual-assets/manuscript-schema/각 소비 스킬 SKILL.md/CLAUDE.md 갱신.
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:17:- 이미지 프롬프트 + D2 둘 다 있고 이미지가 아직 생성 안 된 슬라이드는 이제 `deferred`가 아니라 `missing`으로 뜬다(하드 게이트가 올바르게 막음). 이는 의도된 강화다.
docs\proposals\2026-07-06_asset-embed-safe-margin.md:9:시각자산(D2·이미지)이 소비 산출물에 임베드될 때 **여백 규칙이 없다.**
docs\proposals\2026-07-06_asset-embed-safe-margin.md:17:모든 임베드 target에서 시각자산은 **지정된 박스 안에 종횡비를 유지한 채 들어가고(width·height 둘 다 제한), 박스와 자산 사이에 여백을 남긴다.** 자산이 컨테이너 가장자리에 닿지 않는다.
docs\proposals\2026-07-06_asset-embed-safe-margin.md:31:- `visual-assets` 또는 공통 참조에 "임베드 안전 여백 규약"을 명시하고, 소비 스킬(storyboard/ppt-preview/panseo/pptx-build/book-build) SKILL.md가 이를 참조한다.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:1:# codex 사전검증: 시각자산 스테이지 재설계 제안
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:4:- 대상: `docs/proposals/2026-07-06_visual-assets-stage-redesign.md`
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:8:제안 A(시각자산 스테이지 신설)는 재동기화 폭포를 **조건부로** 없앤다. "나중에 가능"만 열어두면 문제에 이름만 붙이는 셈. 아래 4개 조건을 반영하면 구조적으로 해결.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:11:1. **visual-assets = 기본 hard gate.** placeholder 진행은 예외로 `deferred` 명시. 후속 소비 산출물은 visual-assets가 done(또는 deferred 확인)일 때만 생성.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:13:3. **asset manifest 도입.** 원고 주석만 신뢰하지 않고 `assets/manifest.json`(슬라이드→경로→해시→상태)을 SSOT로.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:14:4. **소비 스킬 계약 변경을 D 범위에 명시.** 후속 스킬(storyboard/ppt-preview/pptx-build/panseo/book)은 원고의 prompt 텍스트가 아니라 manifest/확정 경로를 읽는다. 안 바꾸면 효과 반쪽.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:20:`manuscript-final → visual-assets(image+D2) → practice-code → (코드/캡처형 자산 finalize substage) → storyboard → ...`. 이미지 생성 지연이 크므로 원고확정 직후 착수가 유리. 코드/스크린샷 파생 자산은 practice-code 이후 substage로.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:24:- C: `시각자산` 상태값은 `⬜/🔄/✅`로 부족 — `deferred`/`partial`/`stale` 필요.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:6:- 개정 이력: 2026-07-06 `visual-assets` 스테이지 신설 — 10단계 → 11단계로 재편 (`docs/proposals/2026-07-06_visual-assets-stage-redesign.md`, codex 검증: `docs/reviews/2026-07-06_visual-assets-redesign-codex-review.md`)
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:34:| 4 | `visual-assets` (신규) | `assets/images/chNN/`, `assets/diagrams/`, `assets/manifest.json` | 생성(지금/deferred 선택) → 확인 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:45:- 시각 자산 생성은 기존 엔진 스킬을 그대로 사용: `image-gen`(GPT 이미지 생성·교체), `pub-d2-diagram`(D2 모노톤 도형 렌더). 두 엔진은 이제 4단계 `visual-assets`가 호출한다(§3.0-A).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:47:- **하드 게이트(codex 조건 반영)**: `visual-assets`가 ✅(생성 완료) 또는 명시적 `deferred`(placeholder 유지로 확인)일 때만 5~11단계를 진행한다. 원고확정만 되고 시각자산 칸이 비어 있으면(⬜/🔄) 후속 단계 스킬은 진행을 거부하고 먼저 `visual-assets`를 완료하도록 안내한다. `course-pipeline`의 선행 게이트 표에도 동일하게 반영한다(`.claude/skills/course-pipeline/SKILL.md`).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:49:### 3.0-A 시각자산 스테이지 (`visual-assets`, 신규)
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:54:- 슬라이드마다 "지금 생성" 또는 "나중에(`deferred`, placeholder 유지)"를 사용자에게 명시적으로 선택받는다 — image-gen 지연(장당 1~2분, 직렬)을 고려해 백그라운드 배치 + 진행 표시로 처리한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:56:- **해시 기반 부분 재생성**: 원고 Visual asset의 프롬프트/D2 소스가 바뀌면 그 슬라이드의 해시만 불일치 → `visual-assets`가 그 슬라이드 자산만 재생성한다(전체 재생성 금지, `.claude/skills/visual-assets/SKILL.md` §7). 후속 산출물(스토리보드 등)도 그 슬라이드만 다시 만들면 된다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:57:- 결과: 이후 5~11단계(코드/스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)는 **원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로**를 읽어 자산을 임베드한다(소비 계약, 각 스킬 SKILL.md 참조) — 재동기화 폭포(자산을 나중에 만들어 소비 산출물을 전부 다시 만드는 문제)를 제거하기 위한 핵심 변경.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:62:시각자산(image/D2)이 소비 산출물(PPTX·스토리보드·PPT프리뷰·판서·책)에 임베드될 때, **컨테이너를 꽉 채우지 않고 여백을 남긴다(fit-in-box).** 자산은 지정 박스 안에 종횡비를 유지한 채(width·height 둘 다 상한) 들어가고 가장자리에 닿지 않는다 — 세로형/광폭 자산이 슬라이드·페이지를 벗어나는 오버플로를 원천 차단한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:65:- **책임은 소비 스킬에 있다**(자산 생성 스킬 `visual-assets`가 아니라 `storyboard`/`ppt-preview`/`panseo-slide`/`pptx-build`/`book-build`). target별 구현 상수로 반영:
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:99:│   └── manifest.json         # 시각자산 SSOT (슬라이드→경로/해시/상태, visual-assets 소유)
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:107:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:155:- **시각 자산 생성과의 분리(2026-07-06 개정)**: `manuscript-final`은 Visual asset 필드의 프롬프트/D2 소스 문구를 다듬는 것까지만 책임진다. 실제 이미지/D2 렌더 생성과 `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets`(§3.0-A)가 전담한다 — 원고확정 시점에는 자산이 아직 없어도 확정할 수 있다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:166:**시각 자산 소비(2026-07-06 개정)**: 그대로 모드는 `ppt_previews/chNN.html`의 DOM(이미지 포함)을 그대로 이식하므로, 실자산 여부는 그 상위 단계인 `ppt-preview`가 `assets/manifest.json`을 읽어 이미 반영한 상태를 그대로 물려받는다(panseo-slide 자신이 manifest를 직접 읽지 않는다 — 간접 소비).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:181:- **시각 자산과의 관계(2026-07-06 개정)**: `pptx-build`(10단계) 코드 자체는 바뀌지 않는다 — 원고에 병기된 `assets/...png|jpg` 경로를 정규식으로 잡는 방식 그대로다. 이제 `visual-assets`(4단계)가 원고확정 직후 실행되므로, `pptx-build`가 호출되는 시점엔 원고에 이미 실자산 경로가 병기되어 있는 것이 정상 경로다(과거처럼 placeholder만 있는 상태로 넘어와 재빌드가 필요한 상황이 줄어든다).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:204:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:220:**이후 추가 (2026-07-06)**: 위 삭제/보존/이동은 이 문서 최초 작성 시점(10단계)의 1회성 마이그레이션 기록이며 이미 실행 완료됨. 이후 §3.0-A 신설로 스킬 `visual-assets`(`.claude/skills/visual-assets/`)가 신규 추가되었다 — 이 스킬은 위 삭제/보존/이동 대상이 아니라 파이프라인 재편(10→11단계)에 따른 신규 스킬이다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:244:(위 1~8은 이 문서 최초 작성 시점의 10단계 기준 실행 순서이며 이미 완료된 기록이다 — 단계 번호는 §3의 현재 11단계 표가 아니라 당시 10단계 표를 가리킨다. `visual-assets` 스킬 신설은 §3.0-A 참조.)
docs\reviews\2026-07-06_asset-embed-margin-codex-review.md:14:4. **여백 상수 위치**: 정책 1곳(스펙 §3.0-A 근처 `EMBED_SAFE_MARGIN_RATIO = 0.05`) + target별 구현 상수(build_pptx `PPTX_EMBED_MARGIN_RATIO`, 골든 HTML `--asset-safe-pad`, Typst `#let embed-margin-ratio`). 책임은 소비자(storyboard/ppt-preview/panseo/pptx-build/book-build)에, visual-assets 아님.
docs\reviews\2026-07-06_asset-embed-margin-codex-review.md:18:- 문서 불일치: CLAUDE.md는 5~11단계가 manifest를 읽는다 하나 pptx-build는 원고 주석 경로를 regex로 읽음. (판단: 원고 주석이 manifest에서 파생되므로 실질 충돌 아님. pptx는 원고 직접 파싱 계약 유지, HTML 소비자만 manifest — 문서에 이 구분 명확화.)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:5:**Goal:** 하네스의 시각자산 기본값을 D2 다이어그램에서 GPT 이미지로 전환하고(D2는 명시 opt-in 폴백으로 유지), 그 규약으로 `spring-boot-basic` ch01의 5개 D2 슬라이드(05·08·10·15·20)를 GPT 이미지로 재생성해 전 소비물을 재빌드한 뒤 ch01을 재확정한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:7:**Architecture:** manifest 빌더(`scripts/build_asset_manifest.py`)의 "주 시각자료" 선택 로직을 역전한다 — 이미지 프롬프트가 있으면 GPT 이미지가 기본 primary, D2는 원고 Visual asset 필드에 `주 시각자료: D2` opt-in 마커가 있거나 이미지 프롬프트가 아예 없을 때만 primary가 된다. manifest.json은 여전히 SSOT이고 소비 스킬은 슬라이드별 `primary` 자산을 임베드한다. 하네스 구조 변경이므로 CLAUDE.md 유지 규칙대로 proposal + codex 사전검증을 먼저 거친다. 그다음 ch01 콘텐츠를 새 규약으로 재빌드한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:9:**Tech Stack:** Python 3.14 + pytest 9.0.3 (manifest 빌더 단위테스트), image-gen(`scripts/image_gen.py`, Codex 이미지), python-pptx(`scripts/build_pptx.py`), Typst(book-build), Git Bash on Windows 11.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:14:- **manifest.json은 SSOT — 손으로 편집 금지**: 항상 `python scripts/build_asset_manifest.py <course_dir> <chNN>`로 재생성한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:15:- **원고에 image-gen 주석 블록 직접 삽입 금지**: `image_gen.py`는 처리한 블록을 프롬프트째 지우고 `<img>`로 치환하는 파괴적 스크립트다. 반드시 스크래치 파일에 모아 실행하고 실행 후 삭제한다 (visual-assets §2).
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:28:- `scripts/build_asset_manifest.py` — 주 시각자료 선택 로직 역전 (수정)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:29:- `tests/test_build_asset_manifest.py` — 빌더 단위테스트 (신규)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:30:- `.claude/skills/visual-assets/SKILL.md` — 기본=이미지, D2=opt-in 절차로 개정 (수정)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:32:- `.claude/skills/storyboard/SKILL.md`, `.claude/skills/ppt-preview/SKILL.md`, `.claude/skills/pptx-build/SKILL.md`, `.claude/skills/panseo-slide/SKILL.md`, `.claude/skills/book-build/SKILL.md` — "manifest `primary` 자산을 임베드" 계약 문구 (수정)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:36:- `courses/spring-boot-basic/assets/manifest.json` — 재생성 (수정, 스크립트가 씀)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:59:# 제안: 시각자산 기본값 D2 → GPT 이미지 전환 (D2는 opt-in 폴백)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:62:- 현행 `build_asset_manifest.py`는 슬라이드에 D2 블록이 있으면 D2를 무조건 주 시각자료로 삼고, 같은 슬라이드의 GPT 이미지를 `status: deferred, primary: false`로 강등한다(현재 코드 105~120행).
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:67:- **A. manifest 빌더 로직 역전**: 이미지 프롬프트가 있으면 이미지가 primary가 기본. D2는 원고 Visual asset 필드에 `주 시각자료: D2`(또는 `Primary asset: D2`) 마커가 있거나, 이미지 프롬프트가 아예 없을 때만 primary.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:69:- **C. 소비 스킬 계약**: 소비 스킬은 슬라이드별 manifest `primary` 자산을 임베드한다(이미지 primary면 이미지, D2 primary면 D2).
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:70:- **D. 문서 동기화**: visual-assets/manuscript-schema/각 소비 스킬 SKILL.md/CLAUDE.md 갱신.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:75:- 이미지 프롬프트 + D2 둘 다 있고 이미지가 아직 생성 안 된 슬라이드는 이제 `deferred`가 아니라 `missing`으로 뜬다(하드 게이트가 올바르게 막음). 이는 의도된 강화다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:105:codex exec --sandbox read-only 'docs/proposals/2026-07-06_d2-to-gpt-image-default.md 제안을 검토하라. scripts/build_asset_manifest.py의 현재 D2 우선 로직(105~120행)과 slide_covered 집계(123~135행)를 읽고, 제안대로 이미지 primary 기본 + D2 opt-in 마커로 역전할 때 (1) 기존 D2-only 슬라이드 회귀 여부 (2) 이미지 미생성 슬라이드가 missing으로 뜨는 게 하드 게이트와 정합한지 (3) 소비 스킬이 primary를 읽는 계약의 빈틈을 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:123:## Phase B — manifest 빌더 로직 역전 (TDD)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:128:- Create: `tests/test_build_asset_manifest.py`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:129:- Modify: `scripts/build_asset_manifest.py` (parse_visual_assets, build_manifest 슬라이드 루프, slide_covered)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:133:- Produces: `build_manifest(course_dir, ch) -> (manifest_dict, out_path)`. manifest 슬라이드 엔트리의 `image`/`d2` 블록 각각에 `status`(`present`/`deferred`/`missing`)와 `primary`(bool) 필드. 주 시각자료 선택 규칙: `주 시각자료: D2` 마커 있고 D2 있으면 D2 primary, 아니면 이미지 프롬프트 있으면 이미지 primary, 둘 다 아니면 D2 primary(이미지 프롬프트 없는 D2-only). `slide_covered`는 primary 자산이 present여야 커버로 센다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:137:`tests/test_build_asset_manifest.py`를 생성한다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:144:import build_asset_manifest as bam
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:188:def _slide5(manifest):
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:189:    return next(s for s in manifest["slides"] if s["slide"] == 5)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:194:    manifest, _ = bam.build_manifest(str(course), "ch01")
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:195:    s = _slide5(manifest)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:199:    assert manifest["overall_status"] == "present"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:204:    manifest, _ = bam.build_manifest(str(course), "ch01")
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:205:    s = _slide5(manifest)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:212:    manifest, _ = bam.build_manifest(str(course), "ch01")
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:213:    s = _slide5(manifest)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:217:    assert manifest["overall_status"] == "present"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:220:def test_ungenerated_image_reads_missing_not_deferred(tmp_path):
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:221:    # 이미지 프롬프트 있고 D2 파일도 있으나 이미지 미생성 → 이제 이미지가 primary이므로 missing
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:223:    manifest, _ = bam.build_manifest(str(course), "ch01")
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:224:    s = _slide5(manifest)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:226:    assert s["image"]["status"] == "missing"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:227:    assert manifest["overall_status"] != "present"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:232:Run: `python -m pytest tests/test_build_asset_manifest.py -v`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:233:Expected: `test_image_is_primary_by_default`, `test_d2_opt_in_marker_makes_d2_primary`, `test_ungenerated_image_reads_missing_not_deferred` 가 FAIL (현재 빌더는 D2 우선이라 image.primary=False, d2 primary 키 없음). `test_d2_only_slide_keeps_d2_primary`는 통과할 수도 있으나 d2에 `primary` 키가 없어 KeyError로 FAIL.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:237:`scripts/build_asset_manifest.py`에서 `IMG_PROMPT_RE` 정의 바로 아래에 추가한다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:262:- [ ] **Step 4: build_manifest 슬라이드 루프 역전**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:264:`build_manifest`에서 `for num in sorted(va):` 부터 `slides.append(entry)` 까지의 블록(현재 91~121행) 전체를 아래로 교체한다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:294:                "status": "present" if d2_file_ok else ("deferred" if primary != "d2" else "missing"),
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:301:                "status": "present" if img_file_ok else ("deferred" if primary != "image" else "missing"),
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:309:`build_manifest`의 `def slide_covered(s):` 함수 본문(현재 124~131행)을 아래로 교체한다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:324:Run: `python -m pytest tests/test_build_asset_manifest.py -v`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:330:git add scripts/build_asset_manifest.py tests/test_build_asset_manifest.py
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:331:git commit -m "feat(manifest): 주 시각자료 기본값 D2→GPT 이미지 역전 + D2 opt-in 마커"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:338:### Task 4: visual-assets SKILL.md — 이미지 기본 / D2 opt-in
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:341:- Modify: `.claude/skills/visual-assets/SKILL.md`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:358:- [ ] **Step 2: §4 manifest 생성 절의 D2 자동 defer 설명 갱신**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:360:`### 4. manifest 생성 (SSOT)` 절에서 "D2가 있는 슬라이드는 이미지가 없어도 스크립트가 자동으로 `image.status = "deferred"`..." 로 시작하는 항목(현재 60행)을 아래로 교체한다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:363:- **기본은 이미지 primary**: 이미지 프롬프트가 있으면 `image.primary = true`, D2는 있어도 `d2.primary = false`(폴백 소스로 보존, status는 파일 있으면 present·없으면 deferred). 원고에 `주 시각자료: D2` 마커가 있는 슬라이드만 `d2.primary = true`가 되고 이미지가 `deferred`로 강등된다. 이미지 프롬프트가 아예 없는 D2-only 슬라이드는 D2가 primary다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:377:git add .claude/skills/visual-assets/SKILL.md
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:378:git commit -m "docs(visual-assets): 기본=GPT 이미지, D2=opt-in 절차로 개정"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:402:**주 시각자료 규칙(중요)**: 한 슬라이드에 이미지 프롬프트와 D2를 함께 둘 수 있으나, **기본 주 시각자료는 GPT 이미지**다. 소비물(스토리보드·PPT·판서·PPTX·책)은 manifest의 `primary` 자산을 임베드하며, 이미지 프롬프트가 있으면 이미지가 primary가 된다. 특정 슬라이드에서 D2를 주 시각자료로 쓰려면 Visual asset 필드에 `- 주 시각자료: D2` 한 줄을 넣는다. D2 코드펜스만 있고 이미지 프롬프트가 없는 슬라이드는 D2가 자동으로 primary다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:414:### Task 6: 소비 스킬 5종 — "manifest primary 자산 임베드" 계약
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:424:- Consumes: Task 3 manifest `primary` 필드
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:429:Run: `grep -rn "manifest\|primary\|assets/diagrams\|assets/images\|D2\|시각자료\|Visual asset" .claude/skills/storyboard/SKILL.md .claude/skills/ppt-preview/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/panseo-slide/SKILL.md .claude/skills/book-build/SKILL.md`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:437:**자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며, `d2.primary=true`인 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:443:(pptx-build는 원고를 직접 파싱하되, 이미지 경로는 manifest의 primary와 일치해야 한다 — D2 primary 슬라이드는 원고에 `주 시각자료: D2` 마커 + D2 PNG 경로가 있어야 한다.)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:450:git commit -m "docs(consumers): 소비 스킬 5종 manifest primary 자산 임베드 계약 명시"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:469:- `pub-d2-diagram` — D2 모노톤 도형 렌더 (주 호출자: `visual-assets`)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:475:- `pub-d2-diagram` — D2 모노톤 도형 렌더 (opt-in 폴백 엔진 — 기본 시각자산은 GPT 이미지, 원고에 `주 시각자료: D2` 마커가 있는 슬라이드에서만 `visual-assets`가 호출)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:498:- [ ] **Step 1: status.md ch01 시각자산 칸을 🔄로**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:500:`courses/spring-boot-basic/status.md`의 ch01 행 `시각자산` 칸을 `✅`에서 `🔄`로 바꾸고, "다음 할 일" 줄을 `ch01 05·08·10·15·20 GPT 이미지 재생성 진행 중`으로 갱신한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:601:### Task 10: manifest 재생성 + 이미지 primary 검증
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:604:- Modify: `courses/spring-boot-basic/assets/manifest.json` (스크립트가 씀)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:608:- Produces: 5개 슬라이드가 `image.primary=true, status=present`인 manifest (소비 재빌드의 SSOT)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:610:- [ ] **Step 1: manifest 재생성**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:612:Run: `python scripts/build_asset_manifest.py courses/spring-boot-basic ch01`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:617:Run: `python -c "import json; m=json.load(open('courses/spring-boot-basic/assets/manifest.json',encoding='utf-8')); [print(s['slide'], s.get('image',{}).get('status'), s.get('image',{}).get('primary'), s.get('d2',{}).get('primary')) for s in m['slides'] if s['slide'] in (5,8,10,15,20)]"`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:622:Run: `python -c "import json; m=json.load(open('courses/spring-boot-basic/assets/manifest.json',encoding='utf-8')); print(m['overall_status'], m['visual_slides_covered'], m['visual_slides_total'])"`
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:628:git add courses/spring-boot-basic/assets/manifest.json
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:629:git commit -m "content(ch01): manifest 재생성 — 05·08·10·15·20 이미지 primary"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:644:- Consumes: Task 10 manifest(이미지 primary)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:649:`storyboard` 스킬을 ch01에 대해 재실행한다(Task 6 계약대로 manifest primary 임베드). 05·08·10·15·20 카드가 `assets/images/ch01/slideNN.png`를 참조하도록 갱신.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:677:`book-build` 스킬을 ch01에 대해 재실행한다(삽화가 D2 5 대신 GPT 이미지를 쓰도록 manifest primary 참조).
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:702:`status.md` 산출물 인덱스에서 ch01 시각자산 줄을 아래로 바꾼다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:705:- ch01 시각자산: assets/manifest.json (SSOT, 26/26 커버 — GPT 이미지 26, D2 5는 opt-in 폴백 소스로 보존/미임베드)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:708:그리고 "보류/누락" 섹션의 "D2 슬라이드(05/08/10/15/20)의 GPT 이미지: deferred" 항목을 삭제한다(이제 생성됨).
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:712:사용자에게 재빌드된 ch01 산출물(특히 05·08·10·15·20의 새 GPT 이미지가 반영된 storyboard/ppt-preview/pptx/book)을 육안 확인 요청한다. 확인 전까지 시각자산 칸은 `🔄`.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:716:사용자가 확정하면 ch01 `시각자산` 칸을 `✅`로 갱신하고, "다음 할 일" 줄을 다음 차시(ch02) 착수 또는 파일럿 종료로 갱신한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:740:**3. Type consistency:** manifest 필드명 `primary`/`status`/`path`/`prompt_hash`/`d2_hash`가 Task 3(정의)·Task 6(소비 계약)·Task 10(검증) 전반에서 일치. opt-in 마커 문자열 `주 시각자료: D2`가 Task 3(정규식)·Task 4·5(문서)·Task 6(pptx 단서)에서 동일. 경로 계약 `assets/images/{chNN}/slide{NN}.png`, `assets/diagrams/{chNN}-slide{NN}-*.png` 전 Task 일치.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:742:> **주의(재설계 특성):** Task 3의 빌더 변경은 이미지 미생성 D2 슬라이드를 `deferred`가 아니라 `missing`으로 만든다. 그래서 반드시 Phase B(빌더) → Phase D(이미지 생성) 순서를 지켜야 한다 — 빌더만 바꾸고 이미지를 안 만들면 ch01 manifest가 일시적으로 `partial`이 된다. Phase D Task 9~10이 이를 해소한다.

codex
하드 게이트 자체는 `partial`/`missing`을 후속 단계 차단 상태로 보도록 이미 설계되어 있습니다. 다만 `pptx-build`와 원고 주석 생성기가 manifest를 직접 primary 기준으로 읽지 않는 구조라, 계약 변경이 문서 한 줄 추가로 끝나지는 않습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'courses/spring-boot-basic/status.md' | ForEach-Object { "'$i++; if ($i -ge 1 -and $i -le 35) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'docs/superpowers/plans/2026-07-06-d2-to-gpt-image-default.md' | ForEach-Object { "'$i++; if (($i -ge 123 -and $i -le 137) -or ($i -ge 414 -and $i -le 445) -or ($i -ge 740 -and $i -le 743)) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$i=0; Get-Content -Path '"'docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md' | ForEach-Object { "'$i++; if (($i -ge 176 -and $i -le 184) -or ($i -ge 200 -and $i -le 206)) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1400ms:
 123: ## Phase B — manifest 빌더 로직 역전 (TDD)
 124: 
 125: ### Task 3: 이미지 primary 기본 + D2 opt-in 마커
 126: 
 127: **Files:**
 128: - Create: `tests/test_build_asset_manifest.py`
 129: - Modify: `scripts/build_asset_manifest.py` (parse_visual_assets, build_manifest 슬라이드 루프, slide_covered)
 130: 
 131: **Interfaces:**
 132: - Consumes: 없음(독립 스크립트)
 133: - Produces: `build_manifest(course_dir, ch) -> (manifest_dict, out_path)`. manifest 슬라이드 엔트리의 `image`/`d2` 블록 각각에 `status`(`present`/`deferred`/`missing`)와 `primary`(bool) 필드. 주 시각자료 선택 규칙: `주 시각자료: D2` 마커 있고 D2 있으면 D2 primary, 아니면 이미지 프롬프트 있으면 이미지 primary, 둘 다 아니면 D2 primary(이미지 프롬프트 없는 D2-only). `slide_covered`는 primary 자산이 present여야 커버로 센다.
 134: 
 135: - [ ] **Step 1: 실패하는 테스트 작성**
 136: 
 137: `tests/test_build_asset_manifest.py`를 생성한다:
 414: ### Task 6: 소비 스킬 5종 — "manifest primary 자산 임베드" 계약
 415: 
 416: **Files:**
 417: - Modify: `.claude/skills/storyboard/SKILL.md`
 418: - Modify: `.claude/skills/ppt-preview/SKILL.md`
 419: - Modify: `.claude/skills/pptx-build/SKILL.md`
 420: - Modify: `.claude/skills/panseo-slide/SKILL.md`
 421: - Modify: `.claude/skills/book-build/SKILL.md`
 422: 
 423: **Interfaces:**
 424: - Consumes: Task 3 manifest `primary` 필드
 425: - Produces: 각 소비 스킬이 슬라이드별 primary 자산을 임베드한다는 계약 문구
 426: 
 427: - [ ] **Step 1: 각 소비 스킬에서 자산 선택을 서술하는 위치 확인**
 428: 
 429: Run: `grep -rn "manifest\|primary\|assets/diagrams\|assets/images\|D2\|시각자료\|Visual asset" .claude/skills/storyboard/SKILL.md .claude/skills/ppt-preview/SKILL.md .claude/skills/pptx-build/SKILL.md .claude/skills/panseo-slide/SKILL.md .claude/skills/book-build/SKILL.md`
 430: Expected: 각 파일에서 자산을 어느 경로로 읽어 임베드하는지 서술한 문장 위치.
 431: 
 432: - [ ] **Step 2: 5개 파일 각각에 primary 계약 문장 추가**
 433: 
 434: 각 소비 스킬 SKILL.md의 자산 임베드 절에 아래 문장을 추가(파일 어투에 맞춰 한 줄):
 435: 
 436: ```
 437: **자산 선택 계약**: 슬라이드별로 `assets/manifest.json`에서 `primary: true`인 자산(`image` 또는 `d2`)의 `path`를 임베드한다. 기본은 GPT 이미지(`assets/images/chNN/slideNN.png`)이며, `d2.primary=true`인 슬라이드만 D2 PNG를 쓴다. 원고 주석이 아니라 manifest가 SSOT다.
 438: ```
 439: 
 440: pptx-build는 원고를 직접 파싱(HTML 아님)하므로 문장 뒤에 단서를 덧붙인다:
 441: 
 442: ```
 443: (pptx-build는 원고를 직접 파싱하되, 이미지 경로는 manifest의 primary와 일치해야 한다 — D2 primary 슬라이드는 원고에 `주 시각자료: D2` 마커 + D2 PNG 경로가 있어야 한다.)
 444: ```
 445: 
 740: **3. Type consistency:** manifest 필드명 `primary`/`status`/`path`/`prompt_hash`/`d2_hash`가 Task 3(정의)·Task 6(소비 계약)·Task 10(검증) 전반에서 일치. opt-in 마커 문자열 `주 시각자료: D2`가 Task 3(정규식)·Task 4·5(문서)·Task 6(pptx 단서)에서 동일. 경로 계약 `assets/images/{chNN}/slide{NN}.png`, `assets/diagrams/{chNN}-slide{NN}-*.png` 전 Task 일치.
 741: 
 742: > **주의(재설계 특성):** Task 3의 빌더 변경은 이미지 미생성 D2 슬라이드를 `deferred`가 아니라 `missing`으로 만든다. 그래서 반드시 Phase B(빌더) → Phase D(이미지 생성) 순서를 지켜야 한다 — 빌더만 바꾸고 이미지를 안 만들면 ch01 manifest가 일시적으로 `partial`이 된다. Phase D Task 9~10이 이를 해소한다.

 succeeded in 1497ms:
   1: # spring-boot-basic 진행 상태
   2: 
   3: 과정개요서: ➖ (`스프링부트_기초_과정내용_10차시.md` 기준 — 파일럿 ch01 집중, 별도 개요서 소급 생략)
   4: 
   5: | 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
   6: |---|---|---|---|---|---|---|---|---|---|---|
   7: | ch01 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
   8: 
   9: 기호: ⬜ 미착수 / 🔄 진행 중(사용자 확인 대기 포함) / ✅ 확정 / ➖ 보류(사유는 아래)
  10: 시각자산 전용 상태값: `deferred`(placeholder 유지) / `partial`(일부 생성) / `stale`(원고 변경으로 재생성 필요)
  11: 
  12: > ch01 전 단계는 2026-07-06 자율 생성 + 자가검증 완료. **아침 사용자 검토 대기**. 파이프라인 11단계(visual-assets 신설) 재설계 후 새 순서로 재빌드됨.
  13: 
  14: 다음 할 일: ch01 산출물 사용자 검토. (엔진 7기능 실브라우저 조작, PDF/PPTX 육안 확인 권장)
  15: 
  16: ## 산출물 인덱스
  17: - ch01 확정원고: manuscripts/ch01.md (26슬라이드, 자산 경로 병기, 채택 2026-07-06)
  18: - ch01 시각자산: assets/manifest.json (SSOT, 26/26 커버 — GPT 이미지 21 + D2 5), assets/images/ch01/slide*.png(21), assets/diagrams/ch01-slide{05,08,10,15,20}-*.png(5, slide05/20 종횡비 재렌더 2.15:1/2.17:1)
  19: - ch01 실습코드: code/ch01/final/ (검증 로그: validation.log — gradle test 통과, /hello 200, /helo 404 재현)
  20: - ch01 스토리보드: storyboards/ch01.html (26카드, 실자산 26/26 임베드)
  21: - ch01 PPT프리뷰: ppt_previews/ch01.html (16:9 26캔버스, DOM 계약, 실자산 26/26)
  22: - ch01 판서: panseo/ch01.html + ch01_대본.md (그대로 모드, 엔진 7기능, 실자산 26/26)
  23: - ch01 시뮬레이터: simulators/ch01_http-request-flow.html (HTTP 7단계, 라이트)
  24: - ch01 PPTX: pptx/ch01.pptx (26슬라이드, 실자산 26/26 임베드, 발표자 노트 26/26)
  25: - ch01 책: book/ch01.pdf (17p, 소설체, 삽화 13개[D2 5 + 이미지 8], 캐릭터 3인, 편집검토 3종 통과)
  26: 
  27: ## 보류/누락
  28: - 과정개요서: 파일럿 ch01 단일 차시 집중을 위해 소급 작성 생략 (2026-07-06)
  29: - D2 슬라이드(05/08/10/15/20)의 GPT 이미지: `deferred` — D2가 주 시각자료라 중복 불필요 (manifest 기록)

 succeeded in 1588ms:
 176: 
 177: - python-pptx 기반. 원고(`chNN.md`)와 `ppt_previews/chNN.html`을 기준으로 16:9 슬라이드 생성.
 178: - 슬라이드 본문: 제목, 짧은 문구, 이미지(assets), D2 렌더 PNG, 핵심 코드.
 179: - **발표자 노트에 Narration 삽입** — python-pptx의 `notes_slide` API가 발표자 노트를 정식 지원한다(codex가 blocker로 지적했으나 과대평가로 판단). 다만 구현 초기에 "슬라이드 1장 + 노트 삽입 + PowerPoint에서 열어 확인" spike를 먼저 수행해 확정한다.
 180: - 강의장에서 바로 쓸 수 있는 실제 .pptx가 목표.
 181: - **시각 자산과의 관계(2026-07-06 개정)**: `pptx-build`(10단계) 코드 자체는 바뀌지 않는다 — 원고에 병기된 `assets/...png|jpg` 경로를 정규식으로 잡는 방식 그대로다. 이제 `visual-assets`(4단계)가 원고확정 직후 실행되므로, `pptx-build`가 호출되는 시점엔 원고에 이미 실자산 경로가 병기되어 있는 것이 정상 경로다(과거처럼 placeholder만 있는 상태로 넘어와 재빌드가 필요한 상황이 줄어든다).
 182: 
 183: ## 10. PDF책 (`book-build`) — lecture-book-workflow 이식
 184: 
 200: 출력: 차시 완성 시 `book/chNN.pdf`, 과정 완주 시 `book/합본.pdf`(목차·표지 포함 1권).
 201: 
 202: 참조 clone 위치(재사용): scratchpad의 `lecture-book-workflow/` — 구현 시 필요한 파일만 저장소로 복사.
 203: 
 204: **시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
 205: 
 206: ## 11. 삭제 / 보존 / 이동

codex
조건부 승인입니다. 방향은 맞지만, `primary` 계약을 끝까지 관철하지 않으면 하드 게이트와 소비 산출물이 서로 다른 판단을 하게 됩니다.

**주요 지적**

1. [scripts/build_asset_manifest.py](C:/Users/ssarm/Documents/course-haness/scripts/build_asset_manifest.py:123)의 `slide_covered`는 현재 `d2.status == "present"`이면 무조건 커버로 셉니다. 이미지 primary로 역전하면서 이 함수를 `primary == true && status == "present"` 기준으로 바꾸지 않으면, “이미지 미생성 + D2 present” 슬라이드가 계속 전체 `present`로 통과합니다. 제안의 `missing` 하드 게이트 주장은 이 변경이 전제일 때만 성립합니다.

2. 기존 D2-only 슬라이드는 제안대로라면 회귀 없습니다. `prompt`가 없고 `d2`만 있으면 D2가 primary가 되어야 합니다. 단, 현재 D2 엔트리에는 `primary` 필드가 없으므로 새 스키마에서 `d2.primary = true`를 반드시 써야 하고, D2 파일이 없으면 `missing`으로 집계되어야 합니다. 참고로 현재 ch01의 5개 D2 슬라이드는 D2-only가 아니라 “이미지 프롬프트 + D2”라서, 빌더만 먼저 바꾸면 `partial`이 되는 게 정상입니다.

3. 이미지 미생성 슬라이드를 `missing`으로 띄우는 것은 하드 게이트와 정합합니다. [visual-assets](C:/Users/ssarm/Documents/course-haness/.claude/skills/visual-assets/SKILL.md:68)와 [course-pipeline](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-pipeline/SKILL.md:65)은 `partial`/`missing` 상태에서 후속 단계를 막도록 되어 있습니다. 다만 “사용자가 명시적으로 나중에”를 계속 지원하려면 별도 opt-out/deferred 마커가 필요합니다. 새 기본값에서는 D2 present만으로 자동 deferred 처리하면 안 됩니다.

4. 소비 스킬 계약이 아직 비어 있습니다. [storyboard](C:/Users/ssarm/Documents/course-haness/.claude/skills/storyboard/SKILL.md:46), [ppt-preview](C:/Users/ssarm/Documents/course-haness/.claude/skills/ppt-preview/SKILL.md:59), [book-build](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:36)은 현재 `image.present` 우선, 그다음 `d2.present`입니다. 이러면 D2 opt-in 마커로 `d2.primary=true`가 되어도 이미지가 present이면 이미지를 골라 버립니다.

5. 가장 큰 구현 구멍은 PPTX입니다. [pptx-build](C:/Users/ssarm/Documents/course-haness/.claude/skills/pptx-build/SKILL.md:10)는 manifest를 직접 읽지 않고 원고 주석의 `assets/...png`를 regex로 읽습니다. 그런데 [annotate_manuscript_assets.py](C:/Users/ssarm/Documents/course-haness/scripts/annotate_manuscript_assets.py:37)는 present 이미지와 present D2를 둘 다, 이미지 먼저 병기합니다. [build_pptx.py](C:/Users/ssarm/Documents/course-haness/scripts/build_pptx.py:167)는 첫 이미지 경로만 넣으므로, D2 primary opt-in이어도 이미지가 삽입될 수 있습니다. `annotate`를 primary-aware로 고치거나 `build_pptx.py`가 manifest primary를 직접 읽어야 합니다.

**조건**

- `image`와 `d2` 양쪽 모두 `primary` 필드를 갖고, 시각 슬라이드마다 primary가 정확히 하나인지 검증.
- `slide_covered`를 primary-present 기준으로 변경하고 테스트 추가.
- 소비 스킬 문구를 “present 우선순위”가 아니라 “primary 자산 선택”으로 교체.
- `annotate_manuscript_assets.py`/`pptx-build`의 우회 경로도 primary 기준으로 맞춤.
- ch01은 빌더 변경 직후 `partial`이 될 수 있으므로 상태를 `🔄`로 내리고, 05/08/10/15/20 이미지 생성 후 `✅`로 되돌리는 순서를 명시.

이 조건들이 반영되면 승인 가능합니다.
tokens used
86,935
조건부 승인입니다. 방향은 맞지만, `primary` 계약을 끝까지 관철하지 않으면 하드 게이트와 소비 산출물이 서로 다른 판단을 하게 됩니다.

**주요 지적**

1. [scripts/build_asset_manifest.py](C:/Users/ssarm/Documents/course-haness/scripts/build_asset_manifest.py:123)의 `slide_covered`는 현재 `d2.status == "present"`이면 무조건 커버로 셉니다. 이미지 primary로 역전하면서 이 함수를 `primary == true && status == "present"` 기준으로 바꾸지 않으면, “이미지 미생성 + D2 present” 슬라이드가 계속 전체 `present`로 통과합니다. 제안의 `missing` 하드 게이트 주장은 이 변경이 전제일 때만 성립합니다.

2. 기존 D2-only 슬라이드는 제안대로라면 회귀 없습니다. `prompt`가 없고 `d2`만 있으면 D2가 primary가 되어야 합니다. 단, 현재 D2 엔트리에는 `primary` 필드가 없으므로 새 스키마에서 `d2.primary = true`를 반드시 써야 하고, D2 파일이 없으면 `missing`으로 집계되어야 합니다. 참고로 현재 ch01의 5개 D2 슬라이드는 D2-only가 아니라 “이미지 프롬프트 + D2”라서, 빌더만 먼저 바꾸면 `partial`이 되는 게 정상입니다.

3. 이미지 미생성 슬라이드를 `missing`으로 띄우는 것은 하드 게이트와 정합합니다. [visual-assets](C:/Users/ssarm/Documents/course-haness/.claude/skills/visual-assets/SKILL.md:68)와 [course-pipeline](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-pipeline/SKILL.md:65)은 `partial`/`missing` 상태에서 후속 단계를 막도록 되어 있습니다. 다만 “사용자가 명시적으로 나중에”를 계속 지원하려면 별도 opt-out/deferred 마커가 필요합니다. 새 기본값에서는 D2 present만으로 자동 deferred 처리하면 안 됩니다.

4. 소비 스킬 계약이 아직 비어 있습니다. [storyboard](C:/Users/ssarm/Documents/course-haness/.claude/skills/storyboard/SKILL.md:46), [ppt-preview](C:/Users/ssarm/Documents/course-haness/.claude/skills/ppt-preview/SKILL.md:59), [book-build](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:36)은 현재 `image.present` 우선, 그다음 `d2.present`입니다. 이러면 D2 opt-in 마커로 `d2.primary=true`가 되어도 이미지가 present이면 이미지를 골라 버립니다.

5. 가장 큰 구현 구멍은 PPTX입니다. [pptx-build](C:/Users/ssarm/Documents/course-haness/.claude/skills/pptx-build/SKILL.md:10)는 manifest를 직접 읽지 않고 원고 주석의 `assets/...png`를 regex로 읽습니다. 그런데 [annotate_manuscript_assets.py](C:/Users/ssarm/Documents/course-haness/scripts/annotate_manuscript_assets.py:37)는 present 이미지와 present D2를 둘 다, 이미지 먼저 병기합니다. [build_pptx.py](C:/Users/ssarm/Documents/course-haness/scripts/build_pptx.py:167)는 첫 이미지 경로만 넣으므로, D2 primary opt-in이어도 이미지가 삽입될 수 있습니다. `annotate`를 primary-aware로 고치거나 `build_pptx.py`가 manifest primary를 직접 읽어야 합니다.

**조건**

- `image`와 `d2` 양쪽 모두 `primary` 필드를 갖고, 시각 슬라이드마다 primary가 정확히 하나인지 검증.
- `slide_covered`를 primary-present 기준으로 변경하고 테스트 추가.
- 소비 스킬 문구를 “present 우선순위”가 아니라 “primary 자산 선택”으로 교체.
- `annotate_manuscript_assets.py`/`pptx-build`의 우회 경로도 primary 기준으로 맞춤.
- ch01은 빌더 변경 직후 `partial`이 될 수 있으므로 상태를 `🔄`로 내리고, 05/08/10/15/20 이미지 생성 후 `✅`로 되돌리는 순서를 명시.

이 조건들이 반영되면 승인 가능합니다.
