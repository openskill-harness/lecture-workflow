# codex 사전검증 — 책 개념 앵커 (2026-07-07)

**결론: 조건부 승인** (codex gpt-5.5, xhigh, read-only). 핵심 접근(Div.concept-anchor → 두 번째 Lua 필터 → `#concept-anchor[…]` typst → book_base.typ `#let concept-anchor`)은 Pandoc Typst writer와 정합. 3개(+1) 조건을 계획에 반영해야 함: (1) Lua 필터는 원문 Markdown 문자열이 아니라 `Div` AST content를 감싸 RawBlock으로 낮춰야 하고 pandoc 입력에 `+fenced_divs` 명시, anchor 필터를 paragraph-gap 앞에 배치. (2) 앵커 내부 D2 이미지는 빈 alt(`![](path)`)로 두어 전역 `#show figure` 여백 중복을 피함. (3) 편집검토는 기존 3종을 유지하고 `개념 앵커 검증`을 명시적 ④로 추가(대체 금지), ③ 문구를 "정의는 앵커에만"으로 수정, 확정 체크리스트 4종화. (추가) `design` 모드의 `assemble_book_base` 경로에도 `#concept-anchor` 함수가 포함되는지 확인.

---

## codex 출력 전문 (verbatim)

```
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
session id: 019f3b0a-4f65-75d2-bf55-d6a0afab2fd6
--------
user
docs/proposals/2026-07-07_book-concept-anchor.md 제안과 docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md 스펙을 검토하라. .claude/skills/book-build/references/scripts/typst_builder.py의 pandoc 호출(401~408행, --lua-filter paragraph-gap.lua)과 book_base.typ의 #show 스타일을 읽고, (1) Div.concept-anchor를 두 번째 Lua 필터로 #concept-anchor[…]로 감싸 typst로 변환하는 접근이 pandoc typst writer와 정합한지 (2) book_base.typ에 #let concept-anchor(body) 블록을 추가할 때 기존 #show 규칙과 충돌 여부 (3) 편집검토 하드 체크가 기존 3종과 정합한지 지적하라. 승인/조건부 승인/반려로 결론.
codex
`superpowers:using-superpowers`와 계획/제안 검토 성격에 맞는 `gstack-openclaw-ceo-review`를 먼저 확인한 뒤, 요청하신 문서와 Typst/Pandoc 연결부를 근거 중심으로 보겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'C:\\Users\\ssarm\\.codex\\plugins\\cache\\claude-plugins-official\\superpowers\\6.1.1\\skills\\using-superpowers\\SKILL.md'" in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'C:\\Users\\ssarm\\.agents\\skills\\gstack\\openclaw\\skills\\gstack-openclaw-ceo-review\\SKILL.md'" in C:\Users\ssarm\Documents\course-haness
 succeeded in 2302ms:
---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response including clarifying questions
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## The Rule

**Invoke relevant or requested skills BEFORE any response or action** — including clarifying questions, exploring the codebase, or checking files. If it turns out wrong for the situation, you don't have to use it.

**Before entering plan mode:** if you haven't already brainstormed, invoke the brainstorming skill first.

Then announce "Using [skill] to [purpose]" and follow the skill exactly. If it has a checklist, create a todo per item.

## Skill Priority

When multiple skills apply, process skills come first — they set the approach, then implementation skills (frontend-design, etc.) carry it out. Brainstorming and systematic-debugging are Superpowers' most common process skills, but the rule holds for any of them.

- "Let's build X" → superpowers:brainstorming first, then implementation skills.
- "Fix this bug" → superpowers:systematic-debugging first, then domain skills.

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## Platform Adaptation

If your harness appears here, read its reference file for special instructions:

- Codex: `references/codex-tools.md`
- Pi: `references/pi-tools.md`
- Antigravity: `references/antigravity-tools.md`

## User Instructions

User instructions (CLAUDE.md, AGENTS.md, GEMINI.md, etc, direct requests) take precedence over skills, which in turn override default behavior. Only skip skill workflows or instructions when your human partner has explicitly told you to.

 succeeded in 2401ms:
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
Codex용 superpowers 보조 지침도 확인해야 해서 그 파일까지 읽고 진행합니다. 이후에는 범위를 넓히지 않고 사용자가 지정한 세 가지 쟁점만 판정하겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'C:\\Users\\ssarm\\.codex\\plugins\\cache\\claude-plugins-official\\superpowers\\6.1.1\\skills\\using-superpowers\\references\\codex-tools.md'" in C:\Users\ssarm\Documents\course-haness
 succeeded in 1077ms:
## Subagent dispatch requires multi-agent support

Add to your Codex config (`~/.codex/config.toml`):

```toml
[features]
multi_agent = true
```

This enables `spawn_agent`, `wait_agent`, and `close_agent` for skills like `dispatching-parallel-agents` and `subagent-driven-development`. When using subagent-driven-development, you should always close implementer and reviewer subagents when they have finished all their work.

## Environment Detection

Skills that create worktrees or finish branches should detect their
environment with read-only git commands before proceeding:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

- `GIT_DIR != GIT_COMMON` → already in a linked worktree (skip creation)
- `BRANCH` empty → detached HEAD (cannot branch/push/PR from sandbox)

See `using-git-worktrees` Step 0 and `finishing-a-development-branch`
Step 1 for how each skill uses these signals.

## Codex App Finishing

When the sandbox blocks branch/push operations (detached HEAD in an
externally managed worktree), the agent commits all work and informs
the user to use the App's native controls:

- **"Create branch"** — names the branch, then commit/push/PR via App UI
- **"Hand off to local"** — transfers work to the user's local checkout

The agent can still run tests, stage files, and output suggested branch
names, commit messages, and PR descriptions for the user to copy.

codex
이제 실제 근거 파일을 읽습니다. 문서에서 `concept-anchor`, `Lua filter`, `hard check` 주변을 보고, 코드에서는 pandoc 명령과 Typst 베이스 스타일의 `#show` 체인을 확인하겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/references/scripts/typst_builder.py'; "'$lines=Get-Content -LiteralPath $p; for($i=360;$i -le 430 -and $i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "concept-anchor|Lua|lua-filter|hard check|하드|검토|paragraph-gap|show|typst|Div" docs/proposals/2026-07-07_book-concept-anchor.md docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "#show|show:|set par|#let|paragraph-gap|concept-anchor|heading|figure|quote|list|enum|body" .claude/skills/book-build -g "*.typ" -g "*.lua" -g "*.py"' in C:\Users\ssarm\Documents\course-haness
 succeeded in 2091ms:
 360: 
 361: 
 362: # ══════════════════════════════════════
 363: # 통합
 364: # ══════════════════════════════════════
 365: 
 366: def build_integrated_md(front: list, chapters: list, back: list,
 367:                         mermaid_out: Path) -> str:
 368:     """모든 파일을 하나의 마크다운으로 통합"""
 369:     parts = []
 370:     all_files = [("front", front), ("chapters", chapters), ("back", back)]
 371: 
 372:     for section_name, files in all_files:
 373:         for f in files:
 374:             if not f.exists():
 375:                 print(f"   [경고] 파일 없음: {f}")
 376:                 continue
 377: 
 378:             print(f"   처리 중: {f.name}")
 379:             content = f.read_text(encoding="utf-8")
 380:             content = clean_comments(content)
 381:             content = convert_img_tags(content)
 382:             content = fix_image_paths(content, f)
 383:             content = render_mermaid_diagrams(content, mermaid_out)
 384:             content = split_code_block_titles(content)
 385:             content = fix_br_tags(content)
 386:             content = re.sub(r'\n{3,}', '\n\n', content)
 387:             parts.append(content)
 388:             parts.append("\n\n---\n\n")
 389: 
 390:     return "\n".join(parts)
 391: 
 392: 
 393: # ══════════════════════════════════════
 394: # Pandoc 변환
 395: # ══════════════════════════════════════
 396: 
 397: def md_to_typst(md_path: Path, typ_path: Path) -> bool:
 398:     """Pandoc으로 마크다운 → Typst 변환 (paragraph-gap Lua 필터 포함)"""
 399:     lua_filter = Path(__file__).parent / 'paragraph-gap.lua'
 400:     cmd = [
 401:         'pandoc',
 402:         str(md_path),
 403:         '-f', 'markdown+pipe_tables+fenced_code_blocks+backtick_code_blocks-citations',
 404:         '-t', 'typst',
 405:         '-o', str(typ_path),
 406:         '--wrap=none',
 407:         '--lua-filter', str(lua_filter),
 408:     ]
 409: 
 410:     result = subprocess.run(cmd, capture_output=True, text=True)
 411:     if result.returncode != 0:
 412:         print(f"   [오류] Pandoc 변환 실패: {result.stderr}")
 413:         return False
 414: 
 415:     print(f"   Pandoc 변환 완료: {typ_path.name}")
 416:     return True
 417: 
 418: 
 419: # ══════════════════════════════════════
 420: # Typst 후처리
 421: # ══════════════════════════════════════
 422: 
 423: def _get_image_aspect_ratio(path: str) -> float | None:
 424:     """이미지의 종횡비(width/height)를 반환. 실패 시 None."""
 425:     try:
 426:         from PIL import Image
 427:         img = Image.open(path)
 428:         w, h = img.size
 429:         return w / h if h > 0 else None
 430:     except Exception:

 succeeded in 2266ms:
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:23:::: concept-anchor
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:60:- **최종 폴백**: 도식이 개념에 부적합하면(도식화가 무의미한 개념) 도식 없이 **명 + 정의**만으로 앵커를 만든다. (앵커 자체는 생략 불가 — §3.5 하드 체크.)
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:67:### 3.5 편집 검토 ④ — 개념 앵커 검증 (하드 체크)
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:69:기존 편집 검토 3종의 ③"과도한 소설화 방지"를 **"개념 앵커 검증"**으로 강화한다. 아래를 **하드 체크**로 하며, 미충족 시 책을 확정할 수 없다(기존 3종과 동일한 강제력):
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:81:| `.claude/skills/book-build/SKILL.md` | 재집필 단계에 앵커 규칙(§3.1·3.2·3.4) 추가. 편집 검토 ④ 하드 체크(§3.5)로 개정 |
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:83:| 책 원고 마크다운 규약 (`book/chNN_원고.md`) | 앵커를 pandoc fenced div `::: concept-anchor … :::`로 표기 |
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:84:| `.claude/skills/book-build/references/scripts/typst_builder.py` | `concept-anchor` fenced div를 구분 블록(구분선/여백 + 도식 + 정의)으로 렌더하는 스타일 추가 |
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:85:| `.claude/skills/book-build/references/templates/book_base.typ` | `concept-anchor` 블록 typst 스타일 정의 |
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:89:- **마크다운 → typst**: pandoc fenced div `::: concept-anchor`가 typst의 커스텀 함수(예: `#concept-anchor[명][도식경로][정의])` 또는 스타일 박스로 매핑된다. `typst_builder.py`의 MD→typst 변환 로직에 이 div 클래스 처리를 추가한다.
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:98:- 편집 검토 ④(하드 체크)를 통과시킨다.
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:103:- **기술 검증 에이전트**: 원고의 기술적 주장을 권위 있는 외부 근거와 대조해 참/거짓을 판정하는 독립 에이전트는 현재 하네스에 없다(가장 근접한 것은 book-build 편집검토 ①사실성=원고 대조, practice-code=코드 실행). 이는 본 스펙(책 표현 형식)과 독립된 서브시스템이므로 별도 브레인스토밍/스펙으로 다룬다.
docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:108:book-build는 하네스 구조(스킬 절차·검토 규칙)를 바꾸므로, 구현 전 `docs/proposals/`에 계획을 쓰고 codex 사전검증(`codex exec --sandbox read-only … </dev/null`) 후 `docs/reviews/`에 결과를 저장한다(CLAUDE.md 유지 규칙). — 구현 계획(writing-plans) 단계에서 Task로 포함한다.
docs/proposals/2026-07-07_book-concept-anchor.md:9:- **렌더**: 책 원고에 pandoc fenced div `::: concept-anchor`로 표기 → 새 Lua 필터가 `#concept-anchor[…]` typst 호출로 변환 → book_base.typ의 `#let concept-anchor`가 구분선 블록으로 렌더.
docs/proposals/2026-07-07_book-concept-anchor.md:11:- **편집검토 ④(하드 체크)**: 앵커 미충족 시 확정 불가.
docs/proposals/2026-07-07_book-concept-anchor.md:15:- `::: concept-anchor`가 없는 기존 책 원고는 새 Lua 필터에 무영향(매칭 0건) → 회귀 없음.
docs/proposals/2026-07-07_book-concept-anchor.md:16:- Lua 필터가 div 내용을 그대로 `#concept-anchor[…]`로 감싸므로 앵커 내부 마크다운(굵은 명·이미지·정의)은 정상 렌더.

 succeeded in 2294ms:
.claude/skills/book-build\references\templates\book_base.typ:6://   #let book-title = "책 제목"
.claude/skills/book-build\references\templates\book_base.typ:7://   #let book-subtitle = "부제"
.claude/skills/book-build\references\templates\book_base.typ:8://   #let book-description = [설명]
.claude/skills/book-build\references\templates\book_base.typ:9://   #let book-header-title = "헤더 표시 제목"
.claude/skills/book-build\references\templates\book_base.typ:12:#let chapter-title = state("chapter-title", none)
.claude/skills/book-build\references\templates\book_base.typ:55:#set par(
.claude/skills/book-build\references\templates\book_base.typ:62:#show heading.where(level: 1): it => {
.claude/skills/book-build\references\templates\book_base.typ:63:  chapter-title.update(it.body)
.claude/skills/book-build\references\templates\book_base.typ:71:      text(26pt, weight: "bold", fill: rgb("#1a1a1a"))[#it.body]
.claude/skills/book-build\references\templates\book_base.typ:79:#show heading.where(level: 2): it => {
.claude/skills/book-build\references\templates\book_base.typ:87:    text(16pt, weight: "bold", fill: rgb("#1e40af"))[#it.body]
.claude/skills/book-build\references\templates\book_base.typ:92:#show heading.where(level: 3): it => {
.claude/skills/book-build\references\templates\book_base.typ:97:    text(13pt, weight: "semibold", fill: rgb("#1e3a5f"))[#it.body]
.claude/skills/book-build\references\templates\book_base.typ:102:#show heading.where(level: 4): it => {
.claude/skills/book-build\references\templates\book_base.typ:107:    text(11pt, weight: "semibold", fill: rgb("#374151"))[#it.body]
.claude/skills/book-build\references\templates\book_base.typ:113:#show raw.where(block: true): it => {
.claude/skills/book-build\references\templates\book_base.typ:129:#show raw.where(block: false): it => {
.claude/skills/book-build\references\templates\book_base.typ:138:// ── 인용 블록 (blockquote) ──
.claude/skills/book-build\references\templates\book_base.typ:139:#show quote.where(block: true): it => {
.claude/skills/book-build\references\templates\book_base.typ:149:      set par(justify: true, leading: 0.9em)
.claude/skills/book-build\references\templates\book_base.typ:150:      text(size: 9pt, fill: rgb("#4b5563"))[#it.body]
.claude/skills/book-build\references\templates\book_base.typ:162:#show table.cell.where(y: 0): set text(fill: white, weight: "medium")
.claude/skills/book-build\references\templates\book_base.typ:164:#show table: it => {
.claude/skills/book-build\references\templates\book_base.typ:170:#show strong: set text(fill: rgb("#1e3a5f"))
.claude/skills/book-build\references\templates\book_base.typ:171:#show emph: set text(fill: rgb("#6b7280"))
.claude/skills/book-build\references\templates\book_base.typ:175:// ── figure 스타일 ──
.claude/skills/book-build\references\templates\book_base.typ:176:#show figure: it => {
.claude/skills/book-build\references\templates\book_base.typ:178:  align(center, it.body)
.claude/skills/book-build\references\templates\book_base.typ:181:    align(center, text(8pt, fill: rgb("#6b7280"))[#it.caption.body])
.claude/skills/book-build\references\templates\book_base.typ:187:#show link: it => {
.claude/skills/book-build\references\templates\book_base.typ:195:#let embed-margin-ratio = 0.05
.claude/skills/book-build\references\templates\book_base.typ:199:#let page-content-height = 257mm - 20mm - 28mm  // 209mm
.claude/skills/book-build\references\templates\book_base.typ:213:#let auto-image(path, alt: none, max-width: 0.7, max-height-ratio: 0.8, style: "plain") = layout(size => context {
.claude/skills/book-build\references\templates\book_base.typ:295:  let body = if alt != none {
.claude/skills/book-build\references\templates\book_base.typ:296:    figure(styled-img, caption: [#alt])
.claude/skills/book-build\references\templates\book_base.typ:302:    body + v(2pt) + align(center, text(7.5pt, fill: rgb("#b45309"), style: "italic")[⚠ 세로 비율이 커 축소됨 — D2 재배치/전면 그림 배치 검토 권장])
.claude/skills/book-build\references\templates\book_base.typ:304:    body
.claude/skills/book-build\references\templates\book_base.typ:311:#let side-image(path, body, img-width: 0.35, gap: 16pt) = {
.claude/skills/book-build\references\templates\book_base.typ:318:    body,
.claude/skills/book-build\references\templates\book_base.typ:373:  #show outline.entry.where(level: 1): set text(weight: "bold", size: 11pt)
.claude/skills/book-build\references\templates\book_base.typ:374:  #show outline.entry.where(level: 1): it => {
.claude/skills/book-build\references\templates\book_base.typ:378:  #show outline.entry.where(level: 3): set text(size: 8.5pt, fill: rgb("#6b7280"))
.claude/skills/book-build\references\scripts\typst_builder.py:319:    for i, part in enumerate(parts):
.claude/skills/book-build\references\scripts\typst_builder.py:338:    for i, part in enumerate(parts):
.claude/skills/book-build\references\scripts\typst_builder.py:357:        lang, title, body = m.group(1), m.group(2).strip(), m.group(3)
.claude/skills/book-build\references\scripts\typst_builder.py:358:        return f"**{title}**\n```{lang}\n{body}```"
.claude/skills/book-build\references\scripts\typst_builder.py:366:def build_integrated_md(front: list, chapters: list, back: list,
.claude/skills/book-build\references\scripts\typst_builder.py:398:    """Pandoc으로 마크다운 → Typst 변환 (paragraph-gap Lua 필터 포함)"""
.claude/skills/book-build\references\scripts\typst_builder.py:399:    lua_filter = Path(__file__).parent / 'paragraph-gap.lua'
.claude/skills/book-build\references\scripts\typst_builder.py:535:    # 3. 이미지 수정: #figure(image("path"), caption: [...]) → #auto-image
.claude/skills/book-build\references\scripts\typst_builder.py:536:    def fix_figure_image(m):
.claude/skills/book-build\references\scripts\typst_builder.py:560:        r'#figure\(image\("([^"]+)"(?:,\s*alt:\s*"[^"]*")?\)\s*,\s*caption:\s*\[([^\]]*)\]\s*\)',
.claude/skills/book-build\references\scripts\typst_builder.py:561:        fix_figure_image, text
.claude/skills/book-build\references\scripts\typst_builder.py:583:    # 3.55 auto-image 뒤에 빈 줄 보장 (Typst가 figure와 다음 문단을 분리하도록)
.claude/skills/book-build\references\scripts\typst_builder.py:586:    # 3.6 pre_toc 콘텐츠 heading 목차 제외: = 제목 → #heading(outlined: false)[제목]
.claude/skills/book-build\references\scripts\typst_builder.py:590:                       lambda m: f'#heading(outlined: false, level: {len(m.group(1))})[{m.group(2).strip()}]',
.claude/skills/book-build\references\scripts\typst_builder.py:599:        marker = '#quote(block: true)['
.claude/skills/book-build\references\scripts\typst_builder.py:606:            # 브라켓 매칭으로 quote 블록 전체 추출
.claude/skills/book-build\references\scripts\typst_builder.py:624:                body = m.group(2).strip()
.claude/skills/book-build\references\scripts\typst_builder.py:625:                result.append(f'#callout-box([{label}], [{body}])')
.claude/skills/book-build\references\scripts\typst_builder.py:637:    # 5. 수평선 바로 뒤에 heading(= 또는 ==)이 오면 수평선 제거 (pagebreak 중복 방지)
.claude/skills/book-build\references\scripts\typst_builder.py:646:        pct_list = m.group(1)
.claude/skills/book-build\references\scripts\typst_builder.py:647:        col_count = len(re.findall(r'[\d.]+%', pct_list))
.claude/skills/book-build\references\scripts\typst_builder.py:654:    # 8. 문단 간격: Pandoc Lua 필터(paragraph-gap.lua)에서 처리
.claude/skills/book-build\references\scripts\typst_builder.py:655:    #    Para→Para 사이에만 #v(paragraph-gap) 삽입 (표/코드/이미지에 영향 없음)
.claude/skills/book-build\references\scripts\typst_builder.py:749:    page_count = len(list(svg_dir.glob("page_*.svg")))
.claude/skills/book-build\references\scripts\typst_builder.py:808:def build_raw_typ(front: list, chapters: list, back: list,
.claude/skills/book-build\references\scripts\typst_builder.py:952:        front:       list[Path]— 전문 마크다운 파일 목록
.claude/skills/book-build\references\scripts\typst_builder.py:953:        chapters:    list[Path]— 챕터 마크다운 파일 목록
.claude/skills/book-build\references\scripts\typst_builder.py:954:        back:        list[Path]— 후문 마크다운 파일 목록
.claude/skills/book-build\references\scripts\typst_builder.py:995:                        r'#let book-cover-image = ".*?"',
.claude/skills/book-build\references\scripts\typst_builder.py:996:                        f'#let book-cover-image = "{cover_path}"',
.claude/skills/book-build\references\scripts\paragraph-gap.lua:1:-- Pandoc Lua 필터: 텍스트 흐름 블록 사이에 #v(paragraph-gap) 삽입
.claude/skills/book-build\references\scripts\paragraph-gap.lua:2:-- 표, 코드블록, 이미지, heading 등 독립 블록 요소 사이에는 삽입하지 않음
.claude/skills/book-build\references\scripts\paragraph-gap.lua:43:    -- 캡션 바로 뒤 문단이면 gap 삽입하지 않음 (figure 자체 여백 사용)
.claude/skills/book-build\references\scripts\paragraph-gap.lua:57:        table.insert(result, pandoc.RawBlock("typst", "#v(paragraph-gap)"))

codex
한 가지 핵심은 실제 Pandoc Typst writer가 fenced div를 어떻게 내보내는지입니다. 로컬 pandoc이 있으면 표준 입력으로 최소 샘플만 흘려서 확인하고, 동시에 베이스 템플릿과 필터 내용을 읽겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'docs/proposals/2026-07-07_book-concept-anchor.md'" in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md'" in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$md = @'"'
::: concept-anchor
**명**

"'![diagram](x.png)

정의 문장.
:::
'"'@; "'$md | pandoc -f markdown+pipe_tables+fenced_code_blocks+backtick_code_blocks-citations -t typst --wrap=none' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/references/scripts/paragraph-gap.lua'; "'$lines=Get-Content -LiteralPath $p; for($i=1;$i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/references/templates/book_base.typ'; "'$lines=Get-Content -LiteralPath $p; for($i=1;$i -le [Math]::Min(420,$lines.Count);$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
 succeeded in 2446ms:
# 책 개념 앵커(Concept Anchor) 설계

**작성일**: 2026-07-07
**대상**: `book-build` 스킬 (파이프라인 11단계)
**상태**: 설계 확정 대기(사용자 리뷰)

## 1. 배경 / 문제

확정 원고를 소설체로 재집필한 PDF 책(`book/chNN.pdf`)이 **비유·이야기 일색**으로 나와 "부실해 보인다". 실제 ch01 책을 보면:

- 기술 정의가 **없는 게 아니라**, 서술 문단 속에 녹아 있어 눈에 안 보인다. 예: *"WAS는 Web Application Server의 줄임말입니다. …요청마다 결과가 달라지는 일을 처리합니다. WAS는 식당의 주방장과…"* — 정의·설명·비유가 한 문단에 뒤엉켜 독자가 "이 용어의 딱 떨어지는 정의"를 집어낼 수 없다.
- 장 제목이 순전히 이야기("3장. 안내 데스크와 주방")라 목차만 봐선 **어떤 기술을 다루는 장인지** 알 수 없다.

하네스 규칙(`storytelling.md`)은 이미 "비유 → 왜? → 정의", "비유로 넘어간 용어는 기술 파트에서 반드시 정식 정의"를 요구하지만, 실제 출력에서 **정의가 프로즈에 용해**되어 규칙이 형해화됐다.

**따라서 문제는 "정의가 없다"가 아니라 "정의가 안 보인다"이며, 해결은 정의를 구조적으로 도드라지게 만드는 것이다.**

## 2. 해결: 개념 앵커(Concept Anchor)

새 핵심 기술이 도입되는 자리에 **일관된 앵커 블록**을 세우고, 그 아래로 이야기 프로즈가 흐른다. 앵커는 3요소로 고정한다:

```
::: concept-anchor
**HTTP · HyperText Transfer Protocol**          ← ① 정식 기술명 (이야기 제목이 아님)
![](../assets/diagrams/ch01-slide05-http.png)     ← ② 깨끗한 D2 도식 (opt-in D2 재활용)
웹에서 클라이언트와 서버가 요청·응답 메시지를        ← ③ 짧은 정식 정의 (1–2문장, 원고 '핵심 정의' 근거)
주고받는 통신 규칙.
:::

그날 민준은 "API가 안 돼요"라고 했다. 팀장은 화면 대신    ← ④ 이야기 프로즈 (앵커의 용어를 자연스럽게 소비)
주소창을 가리켰다. "/hello가 맞아, /helo가 맞아?" …
```

### 2.1 소설 맥락을 깨지 않는 근거

- **일관성**: 앵커는 항상 같은 3요소(명+도식+정의)·같은 위치(새 개념 도입부)로만 등장 → 독자가 리듬으로 학습, 벽이 아니라 이정표가 된다.
- **시각적 분리**: 앵커와 프로즈가 구분선·여백·도식으로 분리 → 한 문단에 정의·비유·설명이 뒤엉키던 문제 제거.
- **단일 정의**: 정의는 앵커에서 한 번만 세우고, 프로즈는 그 용어를 다시 쓰기만 함(재정의 금지).
- **비유 보존**: 비유는 사라지지 않고 앵커 뒤 프로즈에서 계속 쓴다. 앵커는 "정의를 눈에 보이게" 할 뿐.

## 3. 규약

### 3.1 밀도 — 장당 핵심 개념 1–2개

각 장(book chapter)에서 가장 중심적인 기술 개념 **1–2개만** 앵커로 세운다. 모든 용어에 앵커를 달지 않는다(소설 몰입 보호). 부수적 용어는 프로즈 안에서 자연스럽게 설명한다.

### 3.2 앵커 개념 선정 근거 (원고 씨앗)

씨앗은 **이미 확정 원고에 존재**하므로 manuscript는 수정하지 않는다:

- **기술명·정의**: 원고 슬라이드 Screen 필드의 `핵심 정의` 라인을 근거로 한다.
- **도식**: 원고 Visual asset의 D2 소스 / `assets/manifest.json`의 `d2` 자산.

book-build는 각 장에 매핑되는 원고 슬라이드 중 `핵심 정의`가 있고(이상적으로 D2도 있는) 슬라이드를 골라 앵커 개념으로 삼는다.

### 3.3 도식 조달 — opt-in D2 재활용

- **기본**: 앵커 도식은 이미 렌더된 opt-in D2(`assets/diagrams/{chNN}-slide{NN}-*.png`)를 재활용한다. (ch01은 HTTP·WAS·내장Tomcat·WebMVC·요청흐름 5개 D2가 장별 핵심 개념과 거의 일치.)
- **없으면 생성**: 고른 핵심 개념 슬라이드에 D2가 없으면 `pub-d2-diagram`으로 1개 생성(opt-in). 원고에 D2 소스가 없으면 book-build가 그 개념의 구조를 나타내는 최소 D2 소스를 작성해 렌더한다.
- **최종 폴백**: 도식이 개념에 부적합하면(도식화가 무의미한 개념) 도식 없이 **명 + 정의**만으로 앵커를 만든다. (앵커 자체는 생략 불가 — §3.5 하드 체크.)
- 앵커 도식은 GPT 일러스트를 쓰지 않는다. **GPT 일러스트는 이야기 장면(분위기)용으로 유지**되며 역할이 분리된다: 앵커=구조(D2), 장면=분위기(GPT).

### 3.4 제목 이원화

각 장 제목은 `이야기 제목 — 기술 부제` 형식으로 쓴다. 예: `2장. 약속이 있어야 대화가 된다 — HTTP`. 목차에서 각 장의 기술 주제가 보이게 한다.

### 3.5 편집 검토 ④ — 개념 앵커 검증 (하드 체크)

기존 편집 검토 3종의 ③"과도한 소설화 방지"를 **"개념 앵커 검증"**으로 강화한다. 아래를 **하드 체크**로 하며, 미충족 시 책을 확정할 수 없다(기존 3종과 동일한 강제력):

- 각 장에 앵커가 **1–2개** 있다(0개 불가).
- 각 앵커에 **정식 기술명 + (도식 또는 명시적 도식-불가 사유) + 정의**가 모두 있다.
- 앵커의 정의가 프로즈 문단에 **중복 용해되지 않았다**(정의는 앵커에만).

## 4. 컴포넌트 / 변경 범위

manuscript는 변경하지 않는다. 변경은 book-build에 국한된다.

| 컴포넌트 | 변경 |
|---|---|
| `.claude/skills/book-build/SKILL.md` | 재집필 단계에 앵커 규칙(§3.1·3.2·3.4) 추가. 편집 검토 ④ 하드 체크(§3.5)로 개정 |
| `.claude/skills/book-build/references/storytelling.md` | "비유 → 왜? → 정의" 패턴 개정: 정의는 앵커에서 세운다(프로즈 용해 금지). 앵커를 필수 구조 요소로 명문화 |
| 책 원고 마크다운 규약 (`book/chNN_원고.md`) | 앵커를 pandoc fenced div `::: concept-anchor … :::`로 표기 |
| `.claude/skills/book-build/references/scripts/typst_builder.py` | `concept-anchor` fenced div를 구분 블록(구분선/여백 + 도식 + 정의)으로 렌더하는 스타일 추가 |
| `.claude/skills/book-build/references/templates/book_base.typ` | `concept-anchor` 블록 typst 스타일 정의 |

### 4.1 앵커 렌더링 인터페이스

- **마크다운 → typst**: pandoc fenced div `::: concept-anchor`가 typst의 커스텀 함수(예: `#concept-anchor[명][도식경로][정의])` 또는 스타일 박스로 매핑된다. `typst_builder.py`의 MD→typst 변환 로직에 이 div 클래스 처리를 추가한다.
- **도식 경로**: 앵커 내부 이미지 경로는 `book/chNN_원고.md` 기준 상대경로(기존 삽화와 동일 규약).
- **블록 스타일**: 위아래 구분선 또는 옅은 배경 + 여백으로 프로즈와 분리. 라이트 테마 고정(`style.md` 디자인 제약 준수, 새 색상 도입 금지).

## 5. 적용 (검증)

하네스 변경 후 **ch01 책을 앵커 버전으로 재빌드**해 실제 결과를 확인한다:

- ch01 6개 장에서 장당 1–2 핵심 개념을 골라 앵커로 세운다(HTTP·웹서버/WAS·내장 Tomcat/자동설정·요청 흐름 등 — 기존 5개 D2 재활용).
- 편집 검토 ④(하드 체크)를 통과시킨다.
- 사용자 육안 확인 후 `status.md` 책 칸 재확정.

## 6. 범위 밖 (별도 서브시스템)

- **기술 검증 에이전트**: 원고의 기술적 주장을 권위 있는 외부 근거와 대조해 참/거짓을 판정하는 독립 에이전트는 현재 하네스에 없다(가장 근접한 것은 book-build 편집검토 ①사실성=원고 대조, practice-code=코드 실행). 이는 본 스펙(책 표현 형식)과 독립된 서브시스템이므로 별도 브레인스토밍/스펙으로 다룬다.
- **manuscript 스키마 변경**: 앵커 씨앗이 이미 원고에 있으므로 불필요. 본 스펙 범위 밖.

## 7. 유지 규칙 준수

book-build는 하네스 구조(스킬 절차·검토 규칙)를 바꾸므로, 구현 전 `docs/proposals/`에 계획을 쓰고 codex 사전검증(`codex exec --sandbox read-only … </dev/null`) 후 `docs/reviews/`에 결과를 저장한다(CLAUDE.md 유지 규칙). — 구현 계획(writing-plans) 단계에서 Task로 포함한다.

 succeeded in 3435ms:
# 제안: 책 개념 앵커 (기술명+D2 도식+정의 블록)

## 1. 배경 / 문제
- 소설체 PDF 책이 비유·이야기 일색으로 "부실해 보인다". 실제 ch01은 기술 정의가 서술 문단에 용해돼 안 보이고, 장 제목도 순전히 이야기라 무슨 기술인지 목차에서 안 보인다.
- storytelling.md는 이미 "비유 → 왜? → 정의"를 요구하나 출력에서 정의가 프로즈에 용해돼 형해화됐다.

## 2. 제안
- **개념 앵커**: 새 핵심 기술 도입부(장당 1–2개)에 `정식 기술명 + 깨끗한 D2 도식 + 짧은 정의` 블록을 세우고 그 아래로 이야기가 흐른다. 정의는 앵커에만.
- **렌더**: 책 원고에 pandoc fenced div `::: concept-anchor`로 표기 → 새 Lua 필터가 `#concept-anchor[…]` typst 호출로 변환 → book_base.typ의 `#let concept-anchor`가 구분선 블록으로 렌더.
- **도식**: opt-in D2 재활용(GPT 일러스트는 장면 전용). **제목 이원화**("이야기 제목 — 기술 부제").
- **편집검토 ④(하드 체크)**: 앵커 미충족 시 확정 불가.
- **manuscript 무변경**(씨앗이 원고에 존재). 변경은 book-build에 국한.

## 3. 하위호환 / 리스크
- `::: concept-anchor`가 없는 기존 책 원고는 새 Lua 필터에 무영향(매칭 0건) → 회귀 없음.
- Lua 필터가 div 내용을 그대로 `#concept-anchor[…]`로 감싸므로 앵커 내부 마크다운(굵은 명·이미지·정의)은 정상 렌더.

## 4. 반영 순서
Phase B(렌더 기구+테스트) → Phase C(문서) → Phase D(ch01 적용).

 succeeded in 3887ms:
   1: -- Pandoc Lua 필터: 텍스트 흐름 블록 사이에 #v(paragraph-gap) 삽입
   2: -- 표, 코드블록, 이미지, heading 등 독립 블록 요소 사이에는 삽입하지 않음
   3: -- (독립 블록은 Typst에서 자체 block(above/below)로 여백 관리)
   4: 
   5: -- 텍스트 흐름 블록: 문단, 리스트 등 par(spacing)의 영향을 받는 요소
   6: local function is_text_flow(block)
   7:   local t = block.t
   8:   return t == "Para" or t == "Plain"
   9:       or t == "BulletList" or t == "OrderedList"
  10:       or t == "DefinitionList" or t == "LineBlock"
  11: end
  12: 
  13: -- 블록이 이미지만 포함하는지 확인 (![](path) → Para[Image] 또는 Plain[Image])
  14: local function is_image_block(block)
  15:   if (block.t == "Para" or block.t == "Plain") and #block.content == 1 and block.content[1].t == "Image" then
  16:     return true
  17:   end
  18:   return false
  19: end
  20: 
  21: -- Para 블록이 이탤릭 캡션인지 확인 (*캡션 텍스트* → Para[Emph])
  22: local function is_caption_para(block)
  23:   if block.t == "Para" and #block.content >= 1 and block.content[1].t == "Emph" then
  24:     return true
  25:   end
  26:   return false
  27: end
  28: 
  29: function Blocks(blocks)
  30:   local result = {}
  31:   local prev_was_text = false
  32:   local prev_was_image = false
  33:   local prev_was_caption = false
  34: 
  35:   for i, block in ipairs(blocks) do
  36:     -- 이미지 바로 뒤 이탤릭 캡션이면 gap 삽입하지 않음
  37:     if prev_was_image and is_caption_para(block) then
  38:       -- gap 없이 바로 이어붙임 (후처리에서 auto-image alt로 병합됨)
  39:       table.insert(result, block)
  40:       prev_was_text = false
  41:       prev_was_image = false
  42:       prev_was_caption = true
  43:     -- 캡션 바로 뒤 문단이면 gap 삽입하지 않음 (figure 자체 여백 사용)
  44:     elseif prev_was_caption and is_text_flow(block) then
  45:       table.insert(result, block)
  46:       prev_was_text = is_text_flow(block)
  47:       prev_was_image = false
  48:       prev_was_caption = false
  49:     -- 이미지(캡션 없음) 바로 뒤 문단이면 gap 삽입하지 않음
  50:     elseif prev_was_image and is_text_flow(block) then
  51:       table.insert(result, block)
  52:       prev_was_text = is_text_flow(block)
  53:       prev_was_image = false
  54:       prev_was_caption = false
  55:     else
  56:       if prev_was_text and is_text_flow(block) then
  57:         table.insert(result, pandoc.RawBlock("typst", "#v(paragraph-gap)"))
  58:       end
  59:       table.insert(result, block)
  60:       prev_was_text = is_text_flow(block)
  61:       prev_was_image = is_image_block(block)
  62:       prev_was_caption = false
  63:     end
  64:   end
  65: 
  66:   return result
  67: end

 succeeded in 3892ms:
   1: // ── 범용 북 템플릿 (Typst) ──
   2: // 이 파일은 스킬(pub-typst-design) 소유. 프로젝트에서 심볼릭 링크로 참조.
   3: // 프로젝트의 book.typ에서 정의한 변수(book-title 등)를 사용합니다.
   4: //
   5: // 필수 변수 (book.typ에서 정의):
   6: //   #let book-title = "책 제목"
   7: //   #let book-subtitle = "부제"
   8: //   #let book-description = [설명]
   9: //   #let book-header-title = "헤더 표시 제목"
  10: 
  11: // ── 챕터 추적 (헤더용) ──
  12: #let chapter-title = state("chapter-title", none)
  13: 
  14: // ── 페이지 설정 ──
  15: // 46배판 (188x257mm) — 국내 IT 서적 표준 판형
  16: #set page(
  17:   width: 188mm,
  18:   height: 257mm,
  19:   margin: (top: 20mm, bottom: 28mm, left: 20mm, right: 20mm),
  20:   numbering: "1",
  21:   number-align: center,
  22:   header: context {
  23:     let page-num = counter(page).get().first()
  24:     if page-num > 2 {
  25:       set text(8pt, fill: rgb("#999999"))
  26:       grid(
  27:         columns: (1fr, 1fr),
  28:         align(left)[#book-header-title],
  29:         align(right)[#chapter-title.get()],
  30:       )
  31:       v(2pt)
  32:       line(length: 100%, stroke: 0.3pt + rgb("#dddddd"))
  33:     }
  34:   },
  35:   footer: context {
  36:     let page-num = counter(page).get().first()
  37:     if page-num > 2 {
  38:       align(center, text(9pt, fill: rgb("#888888"))[#counter(page).display()])
  39:     }
  40:   },
  41: )
  42: 
  43: // ── 폰트 설정 ──
  44: // Windows 이식(2026-07 dry-run): 원본 macOS 폰트(RIDIBatang, Apple SD Gothic Neo)를
  45: // KoPubWorld바탕체(저장소 references/fonts/, KOPUS 라이선스 — 무료 재배포 가능)로 교체.
  46: // "Malgun Gothic"은 파일을 재배포하지 않고 Windows 시스템에 이미 설치된 폰트를
  47: // 폴백으로만 참조(패밀리명 매칭). --font-path로 재배포용 폰트 디렉토리를 추가로 지정한다.
  48: #set text(
  49:   font: ("KoPubWorldBatang_Pro", "Malgun Gothic"),
  50:   size: 10pt,
  51:   lang: "ko",
  52:   fill: rgb("#1a1a1a"),
  53: )
  54: 
  55: #set par(
  56:   leading: 1.0em,
  57:   first-line-indent: 0pt,
  58:   justify: true,
  59: )
  60: 
  61: // ── 제목 스타일 ──
  62: #show heading.where(level: 1): it => {
  63:   chapter-title.update(it.body)
  64:   pagebreak(weak: true)
  65:   v(60pt)  // 챕터 오프닝: 상단 1/3 여백 (출판 표준)
  66:   block(
  67:     width: 100%,
  68:     below: 16pt,
  69:     sticky: true,
  70:     {
  71:       text(26pt, weight: "bold", fill: rgb("#1a1a1a"))[#it.body]
  72:       v(8pt)
  73:       line(length: 100%, stroke: 3pt + rgb("#2563eb"))
  74:     }
  75:   )
  76:   v(14pt)
  77: }
  78: 
  79: #show heading.where(level: 2): it => {
  80:   v(24pt)
  81:   block(
  82:     width: 100%,
  83:     below: 8pt,
  84:     sticky: true,
  85:     inset: (left: 12pt),
  86:     stroke: (left: 4pt + rgb("#2563eb")),
  87:     text(16pt, weight: "bold", fill: rgb("#1e40af"))[#it.body]
  88:   )
  89:   v(6pt)
  90: }
  91: 
  92: #show heading.where(level: 3): it => {
  93:   v(16pt)
  94:   block(
  95:     below: 6pt,
  96:     sticky: true,
  97:     text(13pt, weight: "semibold", fill: rgb("#1e3a5f"))[#it.body]
  98:   )
  99:   v(4pt)
 100: }
 101: 
 102: #show heading.where(level: 4): it => {
 103:   v(12pt)
 104:   block(
 105:     below: 4pt,
 106:     sticky: true,
 107:     text(11pt, weight: "semibold", fill: rgb("#374151"))[#it.body]
 108:   )
 109:   v(2pt)
 110: }
 111: 
 112: // ── 코드 블록 (페이지 넘김 허용) ──
 113: #show raw.where(block: true): it => {
 114:   set text(size: 8pt, weight: "bold", font: ("D2Coding", "KoPubWorldBatang_Pro"))
 115:   block(
 116:     width: 100%,
 117:     fill: white,
 118:     inset: (x: 16pt, y: 14pt),
 119:     radius: 8pt,
 120:     stroke: 1pt + rgb("#d1d5db"),
 121:     breakable: true,
 122:     above: 8pt,
 123:     below: 8pt,
 124:     text(fill: rgb("#1a1a1a"))[#it]
 125:   )
 126: }
 127: 
 128: // ── 인라인 코드 ──
 129: #show raw.where(block: false): it => {
 130:   box(
 131:     fill: rgb("#f3f4f6"),
 132:     inset: (x: 4pt, y: 2pt),
 133:     radius: 3pt,
 134:     text(size: 8.5pt, fill: rgb("#1e40af"), font: ("D2Coding", "KoPubWorldBatang_Pro"))[#it]
 135:   )
 136: }
 137: 
 138: // ── 인용 블록 (blockquote) ──
 139: #show quote.where(block: true): it => {
 140:   block(
 141:     width: 100%,
 142:     above: 10pt,
 143:     below: 10pt,
 144:     inset: (left: 14pt, right: 14pt, top: 10pt, bottom: 10pt),
 145:     stroke: (left: 3pt + rgb("#93b4e8")),
 146:     fill: rgb("#f5f8ff"),
 147:     radius: (right: 4pt),
 148:     {
 149:       set par(justify: true, leading: 0.9em)
 150:       text(size: 9pt, fill: rgb("#4b5563"))[#it.body]
 151:     }
 152:   )
 153: }
 154: 
 155: // ── 표 스타일 ──
 156: #set table(
 157:   stroke: (bottom: 0.5pt + rgb("#e5e7eb")),
 158:   inset: (x: 10pt, y: 8pt),
 159:   fill: (_, y) => if y == 0 { rgb("#1e40af") } else if calc.odd(y) { rgb("#f8fafc") } else { white },
 160: )
 161: 
 162: #show table.cell.where(y: 0): set text(fill: white, weight: "medium")
 163: 
 164: #show table: it => {
 165:   set text(size: 8.5pt)
 166:   block(breakable: true)[#it]
 167: }
 168: 
 169: // ── 볼드/이탤릭 ──
 170: #show strong: set text(fill: rgb("#1e3a5f"))
 171: #show emph: set text(fill: rgb("#6b7280"))
 172: 
 173: // ── 수평선은 후처리에서 #v + block으로 변환됨 ──
 174: 
 175: // ── figure 스타일 ──
 176: #show figure: it => {
 177:   v(8pt)
 178:   align(center, it.body)
 179:   if it.caption != none {
 180:     v(2pt)
 181:     align(center, text(8pt, fill: rgb("#6b7280"))[#it.caption.body])
 182:   }
 183:   v(4pt)
 184: }
 185: 
 186: // ── 링크 스타일 ──
 187: #show link: it => {
 188:   text(fill: rgb("#2563eb"))[#it]
 189: }
 190: 
 191: // ── 임베드 안전 여백 정책 (공통 규약) ──
 192: // 근거: docs/proposals/2026-07-06_asset-embed-safe-margin.md §2-C,
 193: //       docs/reviews/2026-07-06_asset-embed-margin-codex-review.md 승인 조건 3·4
 194: // 정책값 1곳(공통 EMBED_SAFE_MARGIN_RATIO=0.05)의 Typst 구현 상수. 값을 바꿀 땐 여기만 수정.
 195: #let embed-margin-ratio = 0.05
 196: 
 197: // 페이지 본문(콘텐츠 영역) 높이 — 위 #set page 값(257mm, margin top 20mm/bottom 28mm)에서 파생.
 198: // #set page의 height/margin을 바꾸면 이 값도 함께 갱신해야 한다(이미지 max-height 계산의 기준).
 199: #let page-content-height = 257mm - 20mm - 28mm  // 209mm
 200: 
 201: // ── 자동 크기 조절 이미지 ──
 202: // 남은 페이지 공간(space-scale)과 페이지 본문 높이 상한(page-cap-scale)을 함께 고려해 이미지 크기를 조절합니다.
 203: // max-width: 이미지 최대 너비 비율 (0.0~1.0)
 204: // max-height-ratio: 이미지 최대 높이 비율 — page-content-height 기준 (0.7~0.85 권장, 70%는 과보수이므로 기본값 0.8)
 205: // style: 이미지 테두리 프리셋
 206: //   "plain"          — 효과 없음 (기본값)
 207: //   "bordered"       — 프라이머리 컬러(#2563eb) 테두리
 208: //   "shadow"         — 오른쪽/아래 그림자 효과
 209: //   "bordered-shadow" — 프라이머리 테두리 + 그림자
 210: //   "minimal"        — 얇은 회색 테두리
 211: // max-height-ratio 상한은 새 페이지로 넘어가도 항상 적용되어(수학적으로) 페이지를 넘치지 않는다.
 212: // width·height 둘 다 명시적으로 상한을 둔 뒤 fit: "contain"으로 종횡비를 보존한 채 박스 안에 넣는다(캡션 높이 별도 확보).
 213: #let auto-image(path, alt: none, max-width: 0.7, max-height-ratio: 0.8, style: "plain") = layout(size => context {
 214:   // 안전 여백(embed-margin-ratio)만큼 박스 자체를 줄여 자산이 텍스트 폭 경계에 닿지 않게 한다
 215:   let target-width = size.width * max-width * (1 - embed-margin-ratio)
 216:   let img = image(path, width: target-width)
 217:   let img-size = measure(img)
 218:   let caption-h = if alt != none { 28pt } else { 0pt }
 219: 
 220:   // 페이지 본문 높이 기준 최대 허용 높이(안전 여백 반영) — 어느 페이지에 놓이든 이 한도를 넘지 않는다
 221:   let max-img-height = page-content-height * max-height-ratio * (1 - embed-margin-ratio)
 222: 
 223:   // 1) 남은 공간(size.height) 기준 축소 비율 (기존 로직)
 224:   let space-scale = if size.height > 120pt {
 225:     let available = size.height - caption-h - 24pt
 226:     if img-size.height > available {
 227:       available / img-size.height
 228:     } else {
 229:       1.0
 230:     }
 231:   } else {
 232:     1.0
 233:   }
 234: 
 235:   // 2) 페이지 본문 높이 상한 기준 축소 비율 (신규 — 새 페이지에서도 항상 적용, floor 없이 항상 강제)
 236:   let page-cap-scale = if img-size.height > max-img-height {
 237:     max-img-height / img-size.height
 238:   } else {
 239:     1.0
 240:   }
 241: 
 242:   // 두 제약 중 더 타이트한 쪽을 적용 — max-height clamp가 항상 우선 보장되도록(오버플로 0 보장)
 243:   let final-scale = calc.min(space-scale, page-cap-scale)
 244:   let final-width = target-width * final-scale
 245:   let final-height = img-size.height * final-scale
 246: 
 247:   // ⚠️ 경고 표시 조건: final-scale < 0.5 면 원본 대비 절반 미만으로 축소된 것 —
 248:   // 초세로형(종횡비가 낮은) D2/이미지일 가능성이 높다. 자동 축소는 오버플로 방지를 위해 그대로 유지하되,
 249:   // 이 경우 D2 재배치(가로 분할·2단 구성) 또는 전면 그림(별도 페이지 배치)을 검토할 것.
 250:   let show-scale-warning = final-scale < 0.5
 251: 
 252:   // 스타일별 이미지 래핑 (width·height 둘 다 지정 + fit: "contain"으로 왜곡 없이 박스 안에 맞춤)
 253:   let styled-img = if style == "bordered" {
 254:     block(
 255:       stroke: 2pt + rgb("#2563eb"),
 256:       radius: 4pt,
 257:       clip: true,
 258:       image(path, width: final-width, height: final-height, fit: "contain")
 259:     )
 260:   } else if style == "shadow" {
 261:     block(
 262:       stroke: (
 263:         left: 0.5pt + rgb("#e0e0e0"),
 264:         top: 0.5pt + rgb("#e0e0e0"),
 265:         right: 2pt + rgb("#c0c0c0"),
 266:         bottom: 2pt + rgb("#c0c0c0"),
 267:       ),
 268:       radius: 4pt,
 269:       clip: true,
 270:       image(path, width: final-width, height: final-height, fit: "contain")
 271:     )
 272:   } else if style == "bordered-shadow" {
 273:     block(
 274:       stroke: (
 275:         left: 2pt + rgb("#2563eb"),
 276:         top: 2pt + rgb("#2563eb"),
 277:         right: 3pt + rgb("#1d4ed8"),
 278:         bottom: 3pt + rgb("#1d4ed8"),
 279:       ),
 280:       radius: 4pt,
 281:       clip: true,
 282:       image(path, width: final-width, height: final-height, fit: "contain")
 283:     )
 284:   } else if style == "minimal" {
 285:     block(
 286:       stroke: 0.5pt + rgb("#e5e7eb"),
 287:       radius: 2pt,
 288:       clip: true,
 289:       image(path, width: final-width, height: final-height, fit: "contain")
 290:     )
 291:   } else {
 292:     image(path, width: final-width, height: final-height, fit: "contain")
 293:   }
 294: 
 295:   let body = if alt != none {
 296:     figure(styled-img, caption: [#alt])
 297:   } else {
 298:     align(center, styled-img)
 299:   }
 300: 
 301:   if show-scale-warning {
 302:     body + v(2pt) + align(center, text(7.5pt, fill: rgb("#b45309"), style: "italic")[⚠ 세로 비율이 커 축소됨 — D2 재배치/전면 그림 배치 검토 권장])
 303:   } else {
 304:     body
 305:   }
 306: })
 307: 
 308: // ── 사이드 이미지 (2열 레이아웃) ──
 309: // 작은 이미지를 텍스트 옆에 나란히 배치합니다.
 310: // img-width: 이미지 열 너비 비율 (0.0~1.0), 나머지가 텍스트 열
 311: #let side-image(path, body, img-width: 0.35, gap: 16pt) = {
 312:   v(8pt)
 313:   grid(
 314:     columns: (img-width * 100% - gap / 2, 1fr),
 315:     column-gutter: gap,
 316:     align: (center + horizon, left + top),
 317:     image(path, width: 100%),
 318:     body,
 319:   )
 320:   v(8pt)
 321: }
 322: 
 323: // ══════════════════════════════════════
 324: // 표지 — 이미지 또는 텍스트
 325: // ══════════════════════════════════════
 326: #if book-cover-image != "" [
 327:   #page(numbering: none, header: none, footer: none, margin: (top: 20pt, bottom: 20pt, left: 16pt, right: 16pt))[
 328:     #image(book-cover-image, width: 100%, height: 100%, fit: "contain")
 329:   ]
 330: ] else [
 331:   #page(numbering: none, header: none, footer: none)[
 332:     #v(1fr)
 333:     #align(center)[
 334:       #line(length: 40%, stroke: 2pt + color-primary)
 335:       #v(24pt)
 336:       #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
 337:       #v(16pt)
 338:       #line(length: 60%, stroke: 0.5pt + color-primary-light)
 339:       #v(16pt)
 340:       #text(15pt, fill: rgb("#374151"), weight: "medium")[#book-subtitle]
 341:       #v(48pt)
 342:       #block(
 343:         width: 70%,
 344:         inset: (x: 20pt, y: 16pt),
 345:         radius: 4pt,
 346:         fill: rgb("#f8fafc"),
 347:         stroke: 0.5pt + rgb("#e2e8f0"),
 348:         text(10.5pt, fill: rgb("#64748b"))[#book-description]
 349:       )
 350:     ]
 351:     #v(1fr)
 352:     #align(center)[
 353:       #text(11pt, fill: rgb("#4b5563"), weight: "medium")[#book-authors 지음]
 354:       #v(14pt)
 355:       #text(9pt, fill: rgb("#94a3b8"))[#book-header-title]
 356:     ]
 357:     #v(24pt)
 358:   ]
 359: ]
 360: 
 361: // ══════════════════════════════════════
 362: // 목차 (자동 생성)
 363: // ══════════════════════════════════════
 364: #page(numbering: none, header: none, footer: none)[
 365:   #v(30pt)
 366:   #block(width: 100%, below: 12pt, {
 367:     text(24pt, weight: "bold", fill: rgb("#1a1a1a"))[목차]
 368:     v(6pt)
 369:     line(length: 100%, stroke: 3pt + rgb("#2563eb"))
 370:   })
 371:   #v(12pt)
 372: 
 373:   #show outline.entry.where(level: 1): set text(weight: "bold", size: 11pt)
 374:   #show outline.entry.where(level: 1): it => {
 375:     v(6pt)
 376:     it
 377:   }
 378:   #show outline.entry.where(level: 3): set text(size: 8.5pt, fill: rgb("#6b7280"))
 379: 
 380:   #outline(
 381:     title: none,
 382:     indent: 1.5em,
 383:     depth: 2,
 384:   )
 385: ]
 386: 
 387: // ══════════════════════════════════════
 388: // 본문 시작 — 이 아래에 Pandoc 변환 내용이 들어갑니다
 389: // ══════════════════════════════════════

2026-07-07T05:27:30.785700Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 6.4 seconds
Output:
pandoc : The term 'pandoc' is not recognized as the name of a cmdlet, function, script file, or operable program. 
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:10 char:11
+ '@; $md | pandoc -f markdown+pipe_tables+fenced_code_blocks+backtick_ ...
+           ~~~~~~
    + CategoryInfo          : ObjectNotFound: (pandoc:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
 

 exited 1 in 6399ms:
pandoc : The term 'pandoc' is not recognized as the name of a cmdlet, function, script file, or operable program. 
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:10 char:11
+ '@; $md | pandoc -f markdown+pipe_tables+fenced_code_blocks+backtick_ ...
+           ~~~~~~
    + CategoryInfo          : ObjectNotFound: (pandoc:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
 

codex
로컬에는 pandoc 실행 파일이 없어 샘플 변환은 못 했습니다. 대신 후처리 단계까지 읽어 실제 출력이 어느 지점에서 다시 바뀌는지 확인하고, Pandoc의 공식 문서/매뉴얼로 writer·Lua 필터 동작을 대조하겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/references/scripts/typst_builder.py'; "'$lines=Get-Content -LiteralPath $p; for($i=780;$i -le 1040 -and $i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/references/scripts/typst_builder.py'; "'$lines=Get-Content -LiteralPath $p; for($i=500;$i -le 670 -and $i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "편집 검토|편집검토|과도한|사실성|정합|하드 체크|확정|검토" .claude/skills/book-build docs -g "*.md"' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1705ms:
.claude/skills/book-build\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 비유(Easy analogy)·실무사례(Practical case)·나레이션·실습·평가문항을 씨앗으로 소설처럼 이야기 형태로 재집필해 차시별 PDF 책(`book/chNN.pdf`)을 만든다. 과정 완주 시 합본(`book/합본.pdf`)도 만든다. "책 만들어줘", "PDF 책", "챕터 집필" 요청 시 사용. 파이프라인 11단계 — 캐릭터 설정 → 소설체 재집필(이미지는 `assets/manifest.json`의 확정 경로를 참조) → humanizer 문체 교정 → 편집 검토 3종(사실성·개념 누락·과도한 소설화) → typst_builder(Typst/Pandoc)로 PDF 빌드. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
.claude/skills/book-build\SKILL.md:8:확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물, manuscript-schema 8필드)를 **소설처럼 이야기 형태로 재집필**해 차시별 PDF 책(`book/chNN.pdf`)을 만드는 스킬이다. 파이프라인 11단계(마지막 단계)이며, 원고를 그대로 렌더하지 않고 비유·실무사례·나레이션·실습·평가를 씨앗 삼아 새로 쓴다.
.claude/skills/book-build\SKILL.md:10:**전제**: `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅여야 한다. 아니면 사용자에게 알리고 중단한다. `manuscripts/chNN.md`가 존재해야 한다. **하드 게이트**: `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 완료(또는 명시적 보류)해야 한다.
.claude/skills/book-build\SKILL.md:28:`courses/{course-id}/book/characters.md`가 이미 있으면 건너뛴다. 없으면 `storytelling.md`의 삼각 구도(팀장=힌트 제공자/동료=문제 제기자/오픈이=독자 대리인)를 기준으로, 과정 대상자(과정개요서의 대상자 정의)에 맞는 캐릭터 3인의 이름·직군·말투를 사용자와 확정해 `book/characters.md`에 저장한다(예: 오픈이의 직군을 신입 백엔드 개발자로 할지, 주니어 데이터 분석가로 할지는 과정 주제에 따라 다르다). 실명 대신 역할명(팀장/동료/오픈이 또는 과정에 맞는 별칭)을 쓴다.
.claude/skills/book-build\SKILL.md:47:### 4. 편집 검토 패스 (필수, 3종)
.claude/skills/book-build\SKILL.md:49:humanizer 패스 이후 반드시 아래 3종 검토를 순서대로 수행하고, 발견 항목을 수정한 뒤 사용자 확인을 받는다. 셋 중 하나라도 건너뛰면 확정할 수 없다.
.claude/skills/book-build\SKILL.md:51:1. **사실성 보존**: 챕터의 기술 서술(코드 동작, API 이름, 개념 정의 등)이 원고 `manuscripts/chNN.md`와 원고의 `Source` 필드가 가리키는 근거와 어긋나는 문장이 없는지 문장 단위로 점검한다. 어긋나는 문장이 있으면 목록화하고 수정한다.
.claude/skills/book-build\SKILL.md:53:3. **과도한 소설화 방지**: 기술 설명 없이 이야기만 이어지는 구간(예: 대화·감정 묘사만 3문단 이상 연속)을 검출한다. 발견되면 그 구간에 기술 설명(정의·동작 원리·코드)을 끼워 넣어 이야기와 기술이 번갈아 나오도록 조정한다.
.claude/skills/book-build\SKILL.md:106:- 과정의 전 차시가 `원고확정` + 책 집필을 완료하면(status.md 전체 ✅), 사용자 요청 시 `chapters` 리스트에 전 차시 `chNN_원고.md`를 순서대로 담아 합본(`book/합본.pdf`)을 같은 방식으로 빌드한다. 표지/목차는 `book_base.typ`가 자동 생성하므로 챕터 md를 연결하는 것 외에 별도 작업이 필요 없다.
.claude/skills/book-build\SKILL.md:109:### 6. 확정
.claude/skills/book-build\SKILL.md:111:편집 검토 3종 통과 + PDF 렌더 정상을 사용자에게 보고하고 확인을 받은 뒤:
.claude/skills/book-build\SKILL.md:114:- 산출물 인덱스에 `- chNN 책: book/chNN.pdf (확정 YYYY-MM-DD)`를 추가한다(합본이면 별도로 `- 합본: book/합본.pdf (확정 YYYY-MM-DD)`).
.claude/skills/book-build\SKILL.md:116:## 확정 체크리스트
.claude/skills/book-build\SKILL.md:118:- [ ] **편집 검토 3종 통과**: 사실성 보존 / 개념 누락 대조표 / 과도한 소설화 방지 — 세 검토 모두 수행하고 발견 항목을 수정했다.
.claude/skills/book-build\SKILL.md:127:- 편집 검토 3종 중 하나라도 실패하면 **검토에서 지적된 문단만** 재집필한다(챕터 전체 재집필 금지).
.claude/skills/book-build\SKILL.md:143:- 이 스킬은 절차 문서이며 TDD 대상이 아니다. Step 2 grep(개발 시점 1회성 구조 검증)으로 SKILL.md 자체를 확인했고, 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
.claude/skills/book-build\references\storytelling.md:217:| 3 | 과도한 "~하는 이유는...때문입니다" | 설명문이 아니라 이야기 |
.claude/skills/book-build\references\storytelling.md:221:| 7 | 과도한 챕터 간 참조 (섹션당 1개 이하) | 독립적으로 읽을 수 있어야 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:14:## 2. 사용자 확정 결정 사항
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:17:2. 승인 게이트 G1~G6·QA 에이전트·Artifact Registry를 폐기하고 **단계별 확정 방식**(산출물 생성 → 사용자 확인/수정 → 확정 → 다음 단계)으로 교체. 진행 상태는 `status.md` 하나로 추적.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:29:| # | 스킬 | 산출물 | 확정 방식 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:31:| 1 | `course-outline` | `1.과정개요서.md` | 대화로 함께 작성 → 확정 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:33:| 3 | `manuscript-final` | `manuscripts/chNN.md` | 티키타카 수정 → 확정 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:46:- **단계별 확정 체크리스트**: 각 단계 스킬은 자기 산출물의 확정 체크리스트(예: 원고 — 슬라이드별 필수 필드 존재·출처 유효, 코드 — 실행 검증 통과, 책 — 사실성·개념 누락 체크)와 실패 시 repair 규칙을 스킬 안에 내장한다. 별도 QA 에이전트는 두지 않는다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:47:- **하드 게이트(codex 조건 반영)**: `visual-assets`가 ✅(생성 완료) 또는 명시적 `deferred`(placeholder 유지로 확인)일 때만 5~11단계를 진행한다. 원고확정만 되고 시각자산 칸이 비어 있으면(⬜/🔄) 후속 단계 스킬은 진행을 거부하고 먼저 `visual-assets`를 완료하도록 안내한다. `course-pipeline`의 선행 게이트 표에도 동일하게 반영한다(`.claude/skills/course-pipeline/SKILL.md`).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:51:원고확정 직후, 소비 산출물(코드~책) 앞에 놓인다. 책임:
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:53:- 확정 원고의 Visual asset 필드를 스캔해 이미지 프롬프트를 image-gen의 `[IMAGE PROMPT]` 태그로 자동 변환(브릿지 내장) 후 image-gen 실행 → `assets/images/chNN/`. `` ```d2 `` 블록은 pub-d2-diagram으로 렌더 → `assets/diagrams/`.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:57:- 결과: 이후 5~11단계(코드/스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)는 **원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로**를 읽어 자산을 임베드한다(소비 계약, 각 스킬 SKILL.md 참조) — 재동기화 폭포(자산을 나중에 만들어 소비 산출물을 전부 다시 만드는 문제)를 제거하기 위한 핵심 변경.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:63:- 코드/캡처형 자산(화면 캡처 등 실행 결과가 필요한 자산)은 예외적으로 `practice-code`(5단계) 이후 finalize substage에서 처리한다(image/D2는 원고확정 직후 착수).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:79:확정 원고의 `Practice` 필드를 근거로 차시별 실습 코드를 `code/chNN/`에 생성하고 **실제로 실행해 검증**한다(빌드/실행/HTTP 호출 등, 결과는 검증 로그로 남김). 검증 중 원고의 실습 지시와 코드가 어긋나면 원고를 역수정(사용자 확인 후)한다. 이후 단계(스토리보드/PPT/책)의 코드 블록은 이 검증된 코드에서 발췌한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:84:- 동작: `status.md` 파싱 → 미완료 첫 단계 식별 → 해당 단계 스킬 실행 → 사용자 확정 시 `status.md` 갱신 → 다음 단계. 사용자가 "여기까지"라고 하면 정지.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:92:├── 1.과정개요서.md            # 1단계 확정 산출물
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:94:├── manuscripts/              # chNN_draft.md → chNN.md (확정)
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:112:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:120:- ch01 원고: manuscripts/ch01.md (확정 2026-07-05)
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:128:산출물 경로는 디렉터리 규약으로 고정되므로 인덱스는 확정 일자·검증 로그·보류 사유만 추가로 기록한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:139:8. 개요서 초안 생성 → 확인·수정 → `1.과정개요서.md` 확정.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:159:- 초안(`chNN_draft.md`) 확정 후 사용자와의 반복 수정을 거쳐 `chNN.md`로 완성 확정.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:160:- **시각 자산 생성과의 분리(2026-07-06 개정)**: `manuscript-final`은 Visual asset 필드의 프롬프트/D2 소스 문구를 다듬는 것까지만 책임진다. 실제 이미지/D2 렌더 생성과 `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets`(§3.0-A)가 전담한다 — 원고확정 시점에는 자산이 아직 없어도 확정할 수 있다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:166:- **요약 모드**: 확정 원고를 판서용으로 요약한 저밀도 슬라이드 생성 (판서 여백 확보).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:176:- **원고 연동 입력 계약**: 확정 원고의 해당 슬라이드(비유·나레이션·Visual asset)를 자동으로 읽어 시뮬레이터 설계에 반영.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:184:- **발표자 노트에 Narration 삽입** — python-pptx의 `notes_slide` API가 발표자 노트를 정식 지원한다(codex가 blocker로 지적했으나 과대평가로 판단). 다만 구현 초기에 "슬라이드 1장 + 노트 삽입 + PowerPoint에서 열어 확인" spike를 먼저 수행해 확정한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:186:- **시각 자산과의 관계(2026-07-06 개정)**: `pptx-build`의 기본은 **이미지 모드**로 바뀌었다(제안 `2026-07-06_pptx-image-mode.md` 반영): 승인된 `ppt_previews/chNN.html`을 `render_preview_slides.py`로 렌더한 PNG를 각 장 전체 배경으로 넣는다. 원고를 python-pptx로 직접 파싱하는 방식은 대안 **네이티브 모드**(`--from-images` 미지정)로 남아 있으며, 그 모드는 annotate 브릿지 경로(§3.0-A)를 정규식으로 잡는다. 이제 `visual-assets`(4단계)가 원고확정 직후 실행되므로, `pptx-build`가 호출되는 시점엔 원고에 이미 실자산 경로가 병기되어 있는 것이 정상 경로다(과거처럼 placeholder만 있는 상태로 넘어와 재빌드가 필요한 상황이 줄어든다).
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:200:- 본문 폰트 RIDIBatang·코드 D2Coding: Windows에 설치하거나 무료 대체 폰트(KoPubWorld바탕 등) 선정 — 구현 시 사용자와 확정.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:203:**책 품질 통제 (codex 검증 반영)**: humanizer 문체 교정 외에, 집필 후 편집 검토 패스를 둔다 — ① 원고 사실성 보존(기술 서술이 원고·출처와 어긋나지 않는지), ② 기술 개념 누락(원고의 핵심 개념·실습·평가가 책에 모두 반영됐는지), ③ 과도한 소설화 방지(이야기가 기술 설명을 잠식하지 않는지). 원본 저장소의 writer → illustrator → editor 순환 구조에서 editor 역할을 이 체크리스트로 이식한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:209:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:223:**재작성**: `CLAUDE.md`를 새 하네스(단일 파이프라인, 단계별 확정, 스킬 목록) 기준으로 다시 쓴다. 구조 변경 시 codex 사전 검증 규칙은 유지한다.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:235:- **게이트 축소 유지(핵심 게이트 2~3개)**: 단계별 확정 흐름과 중복. 기각.
docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:241:2. 골든 템플릿 배치 + `status.md`/디렉터리 규약 확정
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:5:**상태**: 설계 확정 대기(사용자 리뷰)
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:9:확정 원고(`manuscripts/chNN.md`)가 전 파이프라인의 **단일 진실원(SSOT)** — 7개 이상 산출물이 여기서 파생된다. 그런데:
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:11:- `manuscript-final` 확정 체크리스트는 **구조만** 본다(8필드 무결성·슬라이드 번호). 기술적 주장의 참/거짓은 검증하지 않는다.
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:13:- 기존 검증 장치는 `practice-code`(코드 실행)·`book-build` 편집검토 ①사실성(책 vs 원고 대조)뿐 — **원고의 기술 주장을 외부 권위 근거와 대조해 참/거짓을 판정하는 독립 장치가 없다.**
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:20:- **위치**: 개념상 3.5단계 — `manuscript-final`(원고확정 ✅) 직후, `visual-assets` 언저리.
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:22:- **전제**: 대상 차시 `원고확정` ✅. 미확정 원고는 검증하지 않는다(어차피 바뀐다).
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:25:- **course-pipeline 연계**: 원고확정 후 "검증 돌려볼까요?"로 권유하되 막지 않는다(옵션).
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:26:- **원고 자동 수정 금지**: 이 스킬은 리포트만 만든다. 원고 수정은 사용자가 `manuscript-final`로 한다(사용자 확정 SSOT 보호 — `practice-code`의 "역수정은 사용자 승인 후에만" 원칙과 동일).
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:40:- 확정 원고를 슬라이드별로 훑어 **검증 가능한 기술 주장**만 원자 단위로 추출한다. 추출원: Screen의 `핵심 정의`, Narration, 정의성 문장. 슬라이드의 `Source` 필드도 함께 캡처한다.
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:64:1. 사용자가 `verification/chNN_verify.md` 리포트를 검토한다.
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:66:3. `manuscript-final`로 해당 주장을 수정한다(사용자 확정 SSOT 편집).
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:77:## 7. 확정 체크리스트 (스킬 실행마다)
docs\superpowers\specs\2026-07-07-manuscript-verify-design.md:79:- [ ] **전제 게이트**: 대상 차시 `원고확정` ✅. 아니면 중단하고 사용자에게 알린다.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:7:**Architecture:** 책 원고 마크다운에 pandoc fenced div `::: concept-anchor … :::`로 앵커를 표기하고, 새 Lua 필터(`concept-anchor.lua`)가 이 div를 typst의 `#concept-anchor[…]` 호출로 변환하며, `book_base.typ`에 정의된 `#let concept-anchor` 함수가 구분선 블록으로 렌더한다. manuscript는 변경하지 않는다(앵커 씨앗인 `핵심 정의`·D2가 이미 원고에 존재). book-build SKILL.md·storytelling.md에 앵커 저작 규칙과 편집검토 하드 체크를 추가하고, ch01 책을 앵커 버전으로 재빌드해 검증한다.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:14:- **manuscript 무변경**: 앵커 씨앗(`핵심 정의`·D2)이 이미 확정 원고에 있으므로 `courses/*/manuscripts/*.md`는 건드리지 않는다.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:16:- **밀도**: 장당 핵심 개념 1–2개만 앵커. 0개 불가(하드 체크). 모든 용어에 앵커 금지.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:19:- **편집검토 ④ = 하드 체크**: 앵커 미충족(0개, 3요소 누락, 정의 프로즈 용해) 시 책 확정 불가.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:34:- `.claude/skills/book-build/SKILL.md` — 앵커 저작 규칙 + 편집검토 ④ 하드 체크 (수정)
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:38:- `courses/spring-boot-basic/status.md` — ch01 책 재확정 (수정, Task 6)
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:69:- **편집검토 ④(하드 체크)**: 앵커 미충족 시 확정 불가.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:103:codex exec --sandbox read-only 'docs/proposals/2026-07-07_book-concept-anchor.md 제안과 docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md 스펙을 검토하라. .claude/skills/book-build/references/scripts/typst_builder.py의 pandoc 호출(401~408행, --lua-filter paragraph-gap.lua)과 book_base.typ의 #show 스타일을 읽고, (1) Div.concept-anchor를 두 번째 Lua 필터로 #concept-anchor[…]로 감싸 typst로 변환하는 접근이 pandoc typst writer와 정합한지 (2) book_base.typ에 #let concept-anchor(body) 블록을 추가할 때 기존 #show 규칙과 충돌 여부 (3) 편집검토 하드 체크가 기존 3종과 정합한지 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:296:### Task 4: book-build SKILL.md — 앵커 규칙 + 편집검토 ④ 하드 체크
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:329:- [ ] **Step 2: 편집검토 ③을 ④ 개념 앵커 검증(하드 체크)으로 개정**
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:331:`SKILL.md`의 `### 4. 편집 검토 패스` 절에서 3번 항목("**과도한 소설화 방지**…")을 아래로 교체한다:
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:334:3. **개념 앵커 검증(하드 체크)**: 아래를 모두 만족해야 하며, 하나라도 어기면 확정할 수 없다.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:340:- [ ] **Step 3: 확정 체크리스트에 앵커 항목 추가**
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:342:`SKILL.md`의 확정 체크리스트에 아래 항목을 추가한다:
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:352:git commit -m "docs(book-build): 개념 앵커 저작 규칙 + 편집검토 ④ 하드 체크"
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:434:- [ ] **Step 4: 편집검토 ④ 하드 체크 수행**
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:436:Task 4 Step 2의 하드 체크를 수행한다: 장마다 앵커 1–2개, 각 앵커 3요소 충족, 정의 프로즈 용해 없음, 제목 이원화. 미충족 항목이 있으면 그 장만 수정하고 Step 2 재빌드.
docs\superpowers\plans\2026-07-07-book-concept-anchor.md:459:- 편집검토 ④ 하드 체크(§3.5) → Task 4·Task 6 ✅
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:5:**Goal:** 기존 3라인 하네스를 폐기하고, 원고 단일 원천의 10단계 파이프라인(개요서→원고초안→원고확정→실습코드→스토리보드→PPT preview→판서→시뮬레이터→PPTX→PDF책) + 오케스트라 스킬로 재구축한다.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:20:- status.md 단계 열 이름(고정): `원고초안, 원고확정, 코드, 스토리보드, PPT프리뷰, 판서, 시뮬, PPTX, 책`.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:23:- 각 단계 스킬 SKILL.md에는 "확정 체크리스트"와 "실패 시 repair 규칙" 섹션 필수 (스펙 §3).
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:144:| 차시 | 원고초안 | 원고확정 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:148:기호: ⬜ 미착수 / 🔄 진행 중(사용자 확인 대기 포함) / ✅ 확정 / ➖ 보류(사유는 아래)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:152:## 산출물 인덱스 (확정 시 자동 갱신)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:153:<!-- 형식: - chNN 산출물명: 경로 (확정 YYYY-MM-DD[, 검증 로그: 경로]) -->
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:159:- [ ] **Step 2: `courses/spring-boot-basic/status.md` 생성** — 템플릿에서 `{course-id}`→`spring-boot-basic` 치환. ch01은 GPT 원고가 이미 있으므로 `원고초안 ✅, 원고확정 🔄`(파일럿 티키타카 대상), 스토리보드·PPT프리뷰는 GPT 산출물이 있으나 새 스킬 검증 전이므로 `🔄` 표기. `다음 할 일: ch01 원고 확정(manuscript-final) — 기존 GPT 원고 기반 티키타카`. 산출물 인덱스에 3개 파일 경로 기록.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:163:  - 파이프라인 표 (스펙 §3 표를 그대로: # / 스킬 / 산출물 / 확정 방식)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:165:  - 규약: 디렉터리 구조(스펙 §4), status.md 갱신 의무(단계 스킬은 시작 시 🔄, 사용자 확정 시 ✅ + 산출물 인덱스 행 추가), 골든 템플릿 위치
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:168:  - 강의 현황: `spring-boot-basic` 파일럿 진행 중(ch01 원고확정 단계부터)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:196:description: 개발자 강의 과정개요서를 사용자와 함께 만든다. "과정 만들자", "과정개요서 만들어줘", "새 강의 기획", "커리큘럼 짜자" 요청 시 사용. 리서치 서브에이전트로 최신 자료를 조사한 뒤 대상자→과정목표→세부목표→차시 순으로 대화하며 1.과정개요서.md를 확정한다.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:208:8. 개요서 초안 생성 → 사용자 확인/수정 → `1.과정개요서.md` 저장, `templates/status_template.md`로 status.md 생성(차시 행 수 = 확정 차시 수), 과정개요서 ✅ 표기
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:210:**확정 체크리스트** 섹션: 필수 섹션 7종 존재 / 차시표의 각 차시에 내용·실습 여부 기재 / 대상자·목표·차시 난이도 정합. **repair 규칙** 섹션: 체크 실패 항목은 해당 대화 단계로 되돌아가 재확정(전체 재시작 금지).
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:215:Select-String -LiteralPath .claude/skills/course-outline/SKILL.md -Pattern '^name: course-outline', '확정 체크리스트', 'repair' | ForEach-Object Line
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:253:  4. 생성 후 확정 체크리스트 통과 확인 → 사용자에게 슬라이드 목록 요약 보고 → 확인받으면 status.md 원고초안 ✅
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:255:  **확정 체크리스트**: 전 슬라이드 9필드 존재 / 평가 문항 4지선다1+진위형2 / 모든 Source에 URL 또는 문서명 / Narration은 그대로 읽을 수 있는 존댓말 문장. **repair**: 실패 필드만 해당 슬라이드 단위로 재생성.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:283:- Produces: `manuscripts/chNN.md` (확정 원고 — 이후 4~10단계의 단일 입력)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:286:  1. `chNN_draft.md`를 `chNN.md`로 복사(이미 있으면 이어서), status.md 원고확정 🔄
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:288:  3. 시각 자산 확정 지원: 사용자가 원하면 `image-gen` 스킬로 `GPT image prompt` 실생성 → `assets/images/chNN/`, `pub-d2-diagram` 스킬로 D2 렌더 → `assets/diagrams/`. 생성된 파일 경로를 해당 슬라이드 Visual asset에 병기
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:289:  4. 사용자가 "확정"이라 하면 확정 체크리스트 실행 → status.md 원고확정 ✅ + 산출물 인덱스 기록
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:291:  **확정 체크리스트**: 스키마 전 필드 무결 / draft 대비 의도된 변경만 존재(임의 삭제 없음) / Visual asset에 생성 완료된 자산은 실경로 병기. **repair**: 체크 실패 슬라이드만 사용자에게 보고 후 수정.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:296:Select-String -LiteralPath .claude/skills/manuscript-final/SKILL.md -Pattern '^name: manuscript-final', 'image-gen', 'pub-d2-diagram', '확정 체크리스트' | ForEach-Object Line
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:305:git commit -m "feat: manuscript-final 스킬 (3단계 — 원고 티키타카 확정)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:322:  1. 확정 원고의 Practice 필드를 전부 수집해 실습 시나리오 순서 재구성
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:328:  **확정 체크리스트**: validation.log 존재·통과 기록 / 원고 Practice의 모든 코드 블록이 code/chNN 실물과 일치 / 실행 전제(JDK 버전 등)가 원고 차시 헤더와 일치. **repair**: 실패 시 코드 수정 후 재실행(원고 임의 수정 금지 — 사용자 승인 필요).
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:364:  **확정 체크리스트**: 카드 수 = 원고 슬라이드 수 / 모든 카드에 Narration 표시 / 라이트 팔레트 준수 / 브라우저 열림 확인(Playwright 또는 사용자 확인). **repair**: 누락 카드만 재생성.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:400:  **확정 체크리스트**: `data-slide` 연번 = 원고 슬라이드 수 / 캔버스당 단어 수 과밀 여부(제목 제외 본문 45단어 이내 권고) / 라이트 팔레트. **repair**: 과밀 슬라이드는 문구 축약(원고는 불변).
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:456:**확정 체크리스트**: 엔진 기능 7종 전부 동작(브라우저 확인) / 슬라이드 수 일치 / 대본의 슬라이드 번호 정합. **repair**: 엔진 결함은 engine.md 명세 기준으로 수정, 콘텐츠 결함은 해당 슬라이드만 재생성.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:783:- [ ] **Step 6: SKILL.md 작성** — frontmatter `name: pptx-build`, 트리거("PPTX 만들어줘", "PPT 완성"). 본문: 위 CLI 실행 → 슬라이드 수 검증 → 이미지 누락 경고 목록 보고 → PowerPoint에서 열어 확인 요청 → 확정 시 status.md PPTX ✅. **확정 체크리스트**: 슬라이드 수 일치 / 전 슬라이드 노트 존재(Narration 있는 슬라이드) / 이미지 깨짐 없음(사용자 확인). **repair**: 파서가 놓친 필드는 build_pptx.py 수정으로 대응(원고 수정 금지), 수정 후 pytest 재실행.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:885:- Consumes: `manuscripts/chNN.md`(확정 원고 전체), `assets/`, `code/chNN/`, references(storytelling/style/templates/scripts/fonts), humanizer 스킬
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:889:  1. **캐릭터 설정(과정당 1회)**: `book/characters.md`가 없으면 storytelling.md의 삼각 구도(팀장=힌트 제공자/동료=문제 제기자/주인공=독자 대리인)로 과정 대상자에 맞는 캐릭터 3인을 사용자와 확정
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:892:  4. **편집 검토 패스(필수, 스펙 §10)**: ① 사실성 보존 — 기술 서술이 원고·Source와 어긋나는 문장 목록화 ② 개념 누락 — 원고의 핵심 개념/실습/평가문항이 책에 모두 등장하는지 대조표 ③ 과도한 소설화 — 기술 설명 없는 이야기 연속 구간 검출. 발견 항목 수정 후 사용자 확인
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:894:  6. 확정 시 status.md 책 ✅
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:896:  **확정 체크리스트**: 편집 검토 3종 통과 / PDF 렌더 정상(빈 페이지·고아 줄·이미지 깨짐 없음) / 캐릭터 등장 규칙(2챕터 연속 부재 금지) 준수. **repair**: 검토 실패 문단만 재집필(챕터 전체 재집필 금지), 렌더 실패는 Task 13 드라이런 기록 참조.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:901:Select-String -LiteralPath .claude/skills/book-build/SKILL.md -Pattern '^name: book-build', 'characters', 'humanizer', '사실성', 'typst_builder' | ForEach-Object Line
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:910:git commit -m "feat: book-build 스킬 (10단계 — 소설체 재집필·편집 검토·Typst PDF)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:928:  2. status.md 파싱 → 단계 순서(`과정개요서 → 원고초안 → 원고확정 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`)에서 첫 미완(⬜/🔄) 셀 식별. 진행 단위는 사용자에게 확인: "chNN을 끝까지" 또는 "이 단계를 전 차시에"
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:930:  4. 각 단계는 해당 스킬의 확정 절차(사용자 확인)를 그대로 따름 — 오케스트라가 확인을 생략하지 않음
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:933:  **확정 체크리스트**: 호출 전 선행 단계 ✅ 여부 검사(예: 코드 단계는 원고확정 ✅ 필수 — 위반 시 선행 단계부터 제안). **repair**: status.md와 실파일 불일치(파일 없는데 ✅) 발견 시 인덱스 재검증 후 사용자 보고.
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:966:- [ ] **Step 1: 개요서 소급 작성** — `course-outline` 스킬을 호출하되 리서치·차시 논의는 기존 GPT 시나리오(스프링부트 기초 10차시, 대상: 초보자, Todo 도메인 연속 실습)를 초안으로 제시해 빠르게 확정 → `1.과정개요서.md` + status.md 차시 행 10개로 확장
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:968:- [ ] **Step 2: ch01 원고 확정** — `manuscript-final`로 기존 `manuscripts/ch01.md`를 티키타카 확정 (필요 시 image-gen/D2 실생성 포함)
docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:970:- [ ] **Step 3: 4~10단계 순차 실행** — `course-pipeline`으로 ch01의 코드→스토리보드→PPT프리뷰→판서(두 모드 중 사용자 선택)→시뮬→PPTX→책을 차례로 실행. 각 단계에서 확정 체크리스트가 실제로 걸러내는지, status.md가 올바르게 갱신되는지 관찰
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:5:**상태**: 설계 확정 대기(사용자 리뷰)
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:9:확정 원고를 소설체로 재집필한 PDF 책(`book/chNN.pdf`)이 **비유·이야기 일색**으로 나와 "부실해 보인다". 실제 ch01 책을 보면:
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:49:씨앗은 **이미 확정 원고에 존재**하므로 manuscript는 수정하지 않는다:
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:60:- **최종 폴백**: 도식이 개념에 부적합하면(도식화가 무의미한 개념) 도식 없이 **명 + 정의**만으로 앵커를 만든다. (앵커 자체는 생략 불가 — §3.5 하드 체크.)
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:67:### 3.5 편집 검토 ④ — 개념 앵커 검증 (하드 체크)
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:69:기존 편집 검토 3종의 ③"과도한 소설화 방지"를 **"개념 앵커 검증"**으로 강화한다. 아래를 **하드 체크**로 하며, 미충족 시 책을 확정할 수 없다(기존 3종과 동일한 강제력):
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:81:| `.claude/skills/book-build/SKILL.md` | 재집필 단계에 앵커 규칙(§3.1·3.2·3.4) 추가. 편집 검토 ④ 하드 체크(§3.5)로 개정 |
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:98:- 편집 검토 ④(하드 체크)를 통과시킨다.
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:99:- 사용자 육안 확인 후 `status.md` 책 칸 재확정.
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:103:- **기술 검증 에이전트**: 원고의 기술적 주장을 권위 있는 외부 근거와 대조해 참/거짓을 판정하는 독립 에이전트는 현재 하네스에 없다(가장 근접한 것은 book-build 편집검토 ①사실성=원고 대조, practice-code=코드 실행). 이는 본 스펙(책 표현 형식)과 독립된 서브시스템이므로 별도 브레인스토밍/스펙으로 다룬다.
docs\superpowers\specs\2026-07-07-book-concept-anchor-design.md:108:book-build는 하네스 구조(스킬 절차·검토 규칙)를 바꾸므로, 구현 전 `docs/proposals/`에 계획을 쓰고 codex 사전검증(`codex exec --sandbox read-only … </dev/null`) 후 `docs/reviews/`에 결과를 저장한다(CLAUDE.md 유지 규칙). — 구현 계획(writing-plans) 단계에서 Task로 포함한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:1:# D2 → GPT 이미지 기본 전환 + ch01 재확정 Implementation Plan
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:5:**Goal:** 하네스의 시각자산 기본값을 D2 다이어그램에서 GPT 이미지로 전환하고(D2는 명시 opt-in 폴백으로 유지), 그 규약으로 `spring-boot-basic` ch01의 5개 D2 슬라이드(05·08·10·15·20)를 GPT 이미지로 재생성해 전 소비물을 재빌드한 뒤 ch01을 재확정한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:7:**Architecture:** manifest 빌더(`scripts/build_asset_manifest.py`)의 "주 시각자료(primary)" 선택 로직을 역전한다 — 이미지 프롬프트가 있으면 GPT 이미지가 기본 primary, D2는 원고 Visual asset 필드에 `주 시각자료: D2` opt-in 마커가 있거나 이미지 프롬프트가 아예 없을 때만 primary. `image`/`d2` 두 블록 모두 명시 `primary` 불리언을 갖고, `slide_covered`는 primary 자산이 present(또는 명시 `이미지 보류`로 deferred)일 때만 커버로 센다. manifest.json은 SSOT이고, 소비 스크립트가 원고에서 자산 경로를 긁는 경로(annotate → build_pptx)도 primary만 병기하도록 만들어 primary-aware로 정합시킨다. 하네스 구조 변경이므로 CLAUDE.md 유지 규칙대로 proposal + codex 사전검증을 먼저 거친다(완료: Task 1·2, 조건부 승인 — 조건 5건 본 계획에 반영).
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:20:- **status.md 갱신 의무**: 단계 시작 시 🔄, 사용자 확정 시 ✅.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:41:- `courses/spring-boot-basic/status.md` — ch01 재확정 갱신 (수정)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:490:- [ ] **Step 3: 확정 체크리스트의 D2 파일명 계약 항목에 opt-in 단서 추가**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:492:`### 확정 체크리스트`의 "**D2 파일명 계약**" 항목을 아래로 바꾼다:
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:611:## Phase D — ch01 재확정 (5개 D2 슬라이드 → GPT 이미지)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:812:### Task 13: status.md 갱신 + ch01 재확정
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:819:- Produces: ch01 재확정 상태(사용자 확인 후 ✅)
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:831:- [ ] **Step 2: 사용자 재확정 요청**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:835:- [ ] **Step 3: 사용자 확정 시 ✅ 갱신**
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:837:사용자가 확정하면 ch01 `시각자산` 칸을 `✅`로 갱신하고, "다음 할 일" 줄을 다음 차시(ch02) 착수 또는 파일럿 종료로 갱신한다.
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:843:git commit -m "content(ch01): D2→GPT 이미지 재빌드 완료 — ch01 재확정"
docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:859:- ch01 재확정 → Task 13 ✅
docs\proposals\2026-07-06_d2-to-gpt-image-default.md:13:- **E. ch01 적용**: 05·08·10·15·20 슬라이드를 GPT 이미지로 재생성, 전 소비물 재빌드, 재확정.
docs\reviews\2026-07-05_v2-redesign-codex-review.md:14:1. **실습 코드 생성/검증 단계 누락** — 디렉터리에 `code/chNN/`이 있는데 9단계 표에 생성·검증 단계가 없음. `practice-code` 단계를 원고 확정 뒤·스토리보드 앞에 추가, 실행 로그 필수.
docs\reviews\2026-07-05_v2-redesign-codex-review.md:16:3. **python-pptx 발표자 노트** — 우회 구현 필요 가능성 제기, 구현 방식 사전 확정 요구. (Claude 검토: python-pptx는 `notes_slide` API로 발표자 노트를 정식 지원하므로 blocker는 과대평가. 다만 구현 초기에 spike로 검증하는 것은 수용.)
docs\reviews\2026-07-05_v2-redesign-codex-review.md:20:- 각 단계별 확정 체크리스트 + 실패 시 repair 규칙을 스킬에 내장 (QA "에이전트"는 불필요하나 단계별 체크는 필요).
docs\reviews\2026-07-05_v2-redesign-codex-review.md:21:- 소설체 책은 humanizer만으로 부족 — 원고 사실성 보존·기술 개념 누락·과도한 소설화 방지 체크 필요.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:7:**Architecture:** 하네스는 `.claude/skills/`의 스킬 산문 + `scripts/`의 파이썬 도구 + `docs/`의 설계문서로 구성된다. 코드 결함은 TDD로, 스킬·문서 결함은 정확한 텍스트 치환 + grep 검증으로 고친다. 가장 큰 구조 결정은 이미 확정됨: **manifest.json이 SSOT이고, `annotate_manuscript_assets.py`가 manifest→원고 경로를 되써주는 "공식 SSOT 브릿지"다** — pptx-build를 manifest 직독으로 재작성하지 않고 이 브릿지 관계를 계약으로 명문화한다.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:329:    "| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |\n"
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:368:course-pipeline이 재개 전/후 이 스크립트로 게이트 정합을 확인할 수 있다.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:374:COLS = ["차시", "원고초안", "원고확정", "시각자산", "코드", "스토리보드",
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:441:   보고한다 — (a) `assets/manifest.json`의 `overall_status`가 `present`면 시각자산 생성은 끝났고 사람 검토만
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:442:   남은 것이므로 사용자에게 시각자산을 ✅로 확정할지 확인하고, (b) manifest가 `partial`/`stale`/`missing`이면
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:506:리뷰 [MED/Tier1 #1, 확정 결정]: pptx-build가 manifest 대신 원고 주석 경로를 읽어 SSOT 계약이 반쪽만 강제된다. pptx-build/SKILL.md는 한 파일 안에서 자기모순(line 10 "manifest 조회 없음" vs line 12 "manifest가 SSOT"). **결정: pptx-build를 재작성하지 않고, annotate를 "공식 SSOT 브릿지"로 명문화**한다 — annotate가 manifest primary를 원고에 되써주고 pptx-build만 그 브릿지를 읽는다는 관계를 세 곳(pptx-build SKILL, spec §3.0-A, CLAUDE.md)에 일관되게 못박는다.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:540:- [ ] **Step 2: spec §3.0-A에 브릿지 계약 명문화** — Read `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md`, locate §3.0-A의 "소비 스킬은 manifest 확정 경로를 읽는다" 취지 문단, 그 문단 끝에 예외를 명시하는 문장을 추가:
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:552:**시각자산 하드 게이트**: `visual-assets`(4단계)가 ✅ 또는 명시적 `deferred`일 때만 5~11단계(코드~책)를 진행한다. 5~11단계 소비 스킬은 원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 자산을 임베드한다(상세: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3.0-A).
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:556:**시각자산 하드 게이트**: `visual-assets`(4단계)가 ✅ 또는 명시적 `deferred`일 때만 5~11단계(코드~책)를 진행한다. 5~11단계 소비 스킬은 원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 자산을 임베드한다. 단 `pptx-build`만은 예외로, `annotate_manuscript_assets.py`가 manifest primary를 원고에 되써준 **공식 브릿지 표기**를 읽는다(브릿지 = manifest primary 불변식; 상세: `docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3.0-A).
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:563:파일을 임베드하지 않고 SVG/JS로 재구성하므로 manifest 경로 직독이 불필요하다). 자산의 실존 여부·확정
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:661:- [ ] **Step 2: 하드게이트 확인 추가** — 시작게이트 절(원고확정/PPT프리뷰 확인하는 부분, 리뷰 기준 36~43행)에 시각자산 확인을 추가:
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:719:리뷰 [Tier3]: 완주 이후 문서가 대거 뒤처짐 — CLAUDE.md(humanizer "예정", ch01 "원고확정부터 재개", "구축 진행 중"), spec §9(pptx 네이티브만 기술, 이미지 모드 기본 반영 안 됨), visual-assets §68(소비자 계약 전환을 "미래 작업"으로 서술). plan 체크박스는 Task 10에서 별도 처리.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:741:`spring-boot-basic` — 파일럿 진행 중. ch01은 GPT가 만든 원고/스토리보드/PPT 프리뷰(골든 템플릿의 원본)를 이어받아 원고확정(`manuscript-final`) 단계부터 재개한다. 상태: `courses/spring-boot-basic/status.md`.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:745:`spring-boot-basic` — 파일럿. ch01은 11단계를 전 구간 통과해(원고~책·시뮬·PPTX 산출 완료) 시각자산 D2→GPT 재빌드 후 사용자 시각 검토만 남은 사실상 완주 상태다. 상태·다음 할 일: `courses/spring-boot-basic/status.md`.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:769:소비 스킬의 "manifest 확정 경로 직독" 계약 전환은 이미 완료됐다(각 소비 SKILL.md에 반영). `pptx-build`만은
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:878:### Task 11: 파일럿 status.md 게이트 상태 정합 (라이브 데이터 수정)
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:880:리뷰 [HIGH/Tier1 #2, 라이브]: 파일럿 `status.md:7`이 시각자산 🔄인데 코드~책 전부 ✅ — 하드게이트 위반 상태가 박제돼 있다. manifest는 `overall_status: present`(26/26)라 생성은 끝났고 사람 검토만 남았다. Task 3의 검증 스크립트로 검출하고, repair 역케이스 규칙(a)에 따라 사용자 확인 후 시각자산을 ✅로 확정한다.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:887:- Produces: 게이트 정합이 맞는 status.md(위반 0).
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:897:Expected: `present 26 26` — 시각자산 생성 완료, 사람 검토만 남음.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:899:- [ ] **Step 3: 사용자 확인** — repair 규칙 (a)에 따라, "manifest가 present(26/26)이니 시각자산을 ✅로 확정할까요? (또는 아직 시각 검토 중이면 하류 산출물을 🔄로 되돌릴까요?)"를 사용자에게 묻는다. **임의로 바꾸지 않는다.**
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:901:- [ ] **Step 4: status.md 갱신(사용자가 ✅ 확정 시)** — `courses/spring-boot-basic/status.md`의 ch01 행에서 시각자산 칸 🔄→✅, 산출물 인덱스에 확정일 기록, 12/14행의 "사용자 검토 대기" 문구 정리, "다음 할 일"을 현행에 맞게 갱신.
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:903:- [ ] **Step 5: 정합 재확인**
docs\superpowers\plans\2026-07-07-harness-review-fixes.md:912:git commit -m "fix(pilot): ch01 시각자산 게이트 정합 — 사용자 확정 반영"
docs\proposals\2026-07-06_pptx-image-mode.md:4:- 상태: ✅ codex 사전검증 완료(`docs/reviews/2026-07-06_pptx-image-mode-codex-review.md`) → 지적 5건 전부 반영 → 확정
docs\proposals\2026-07-06_pptx-image-mode.md:12:2. **디자인 재현 한계(근본 한계)**: 매핑을 고쳐도 네이티브 조립 슬라이드는 승인된 `ppt_previews/chNN.html`의 카드/2단/코드에디터 목업 디자인을 재현하지 못한다. 미리보기는 사람이 검토·승인한 골든 산출물인데, PPTX가 그와 달라 "제대로 안 나온다"는 사용자 인식의 근본 원인.
docs\reviews\2026-07-06_d2-layout-debug.md:24:**근본 원인 확정:**
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:12:1. **자산 생성이 소비 산출물 뒤에 와서 재동기화 폭포(cascade)를 유발한다.** 현재 파이프라인은 `원고확정 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`이고, 이미지(image-gen)·D2(pub-d2-diagram) 생성은 manuscript-final(3단계) 안의 "선택" 절차로만 존재한다. 실제로는 원고 확정 시점에 자산을 안 만들고 넘어가, 스토리보드·PPT프리뷰·판서·PPTX가 전부 placeholder로 먼저 만들어졌다. 나중에 이미지를 생성하니 **그 4개 산출물을 다시 만들어야 하는** 재작업이 생겼다.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:20:### 제안 A (핵심): "시각자산" 스테이지 신설 — 원고확정 직후, 소비 산출물 앞
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:22:파이프라인을 10단계 → **11단계**로 바꾼다. 새 단계 `visual-assets`를 4번(원고확정 다음, 코드 앞)에 넣는다.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:31:- 확정 원고의 Visual asset 필드를 스캔해 **이미지 프롬프트 → image-gen `[IMAGE PROMPT]` 태그 자동 변환(브릿지 내장)** 후 image-gen 실행 → `assets/images/chNN/`.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:42:열: `원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책` (10칸 → 11칸).
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:49:4. **소비 스킬 계약 변경**: storyboard·ppt-preview·pptx-build·panseo·book-build은 원고 프롬프트 텍스트가 아니라 **manifest의 확정 경로**를 읽어 자산을 임베드한다(경로 없으면 그 슬라이드만 placeholder). 이 변경이 D 반영 범위에 포함됨.
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:50:5. **코드/캡처형 자산**: 화면 캡처처럼 실행 결과가 필요한 자산은 practice-code 이후 finalize substage로 처리(image/D2는 원고확정 직후 착수).
docs\proposals\2026-07-06_visual-assets-stage-redesign.md:58:- **대안 2: 자산 생성을 manuscript-final 안에 강제 편입(선택 아님).** → 원고 확정과 자산 생성이 한 단계에 묶여 책임이 비대해지고, "원고만 빠르게 확정"이 불가. 별도 단계가 관심사 분리에 맞음. 기각 권고.
docs\proposals\2026-07-07_book-concept-anchor.md:11:- **편집검토 ④(하드 체크)**: 앵커 미충족 시 확정 불가.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:18:docs/proposals/2026-07-06_d2-to-gpt-image-default.md 제안을 검토하라. scripts/build_asset_manifest.py의 현재 D2 우선 로직(105~120행)과 slide_covered 집계(123~135행)를 읽고, 제안대로 이미지 primary 기본 + D2 opt-in 마커로 역전할 때 (1) 기존 D2-only 슬라이드 회귀 여부 (2) 이미지 미생성 슬라이드가 missing으로 뜨는 게 하드 게이트와 정합한지 (3) 소비 스킬이 primary를 읽는 계약의 빈틈을 지적하라. 승인/조건부 승인/반려로 결론.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:20:`gstack-openclaw-ceo-review` 스킬을 사용하겠습니다. 요청이 제안서를 반박적으로 검토하는 성격이고, 결론을 승인/조건부 승인/반려로 내려야 하기 때문입니다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:237:- **E. ch01 적용**: 05·08·10·15·20 슬라이드를 GPT 이미지로 재생성, 전 소비물 재빌드, 재확정.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:358:.\docs\proposals\2026-07-06_visual-assets-stage-redesign.md:12:1. **자산 생성이 소비 산출물 뒤에 와서 재동기화 폭포(cascade)를 유발한다.** 현재 파이프라인은 `원고확정 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`이고, 이미지(image-gen)·D2(pub-d2-diagram) 생성은 manuscript-final(3단계) 안의 "선택" 절차로만 존재한다. 실제로는 원고 확정 시점에 자산을 안 만들고 넘어가, 스토리보드·PPT프리뷰·판서·PPTX가 전부 placeholder로 먼저 만들어졌다. 나중에 이미지를 생성하니 **그 4개 산출물을 다시 만들어야 하는** 재작업이 생겼다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:420:.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:53:- 확정 원고의 Visual asset 필드를 스캔해 이미지 프롬프트를 image-gen의 `[IMAGE PROMPT]` 태그로 자동 변환(브릿지 내장) 후 image-gen 실행 → `assets/images/chNN/`. `` ```d2 `` 블록은 pub-d2-diagram으로 렌더 → `assets/diagrams/`.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:421:.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:424:.\docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:204:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:478:.\docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:105:codex exec --sandbox read-only 'docs/proposals/2026-07-06_d2-to-gpt-image-default.md 제안을 검토하라. scripts/build_asset_manifest.py의 현재 D2 우선 로직(105~120행)과 slide_covered 집계(123~135행)를 읽고, 제안대로 이미지 primary 기본 + D2 opt-in 마커로 역전할 때 (1) 기존 D2-only 슬라이드 회귀 여부 (2) 이미지 미생성 슬라이드가 missing으로 뜨는 게 하드 게이트와 정합한지 (3) 소비 스킬이 primary를 읽는 계약의 빈틈을 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:574:.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:288:  3. 시각 자산 확정 지원: 사용자가 원하면 `image-gen` 스킬로 `GPT image prompt` 실생성 → `assets/images/chNN/`, `pub-d2-diagram` 스킬로 D2 렌더 → `assets/diagrams/`. 생성된 파일 경로를 해당 슬라이드 Visual asset에 병기
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:575:.\docs\superpowers\plans\2026-07-05-unified-lecture-pipeline.md:296:Select-String -LiteralPath .claude/skills/manuscript-final/SKILL.md -Pattern '^name: manuscript-final', 'image-gen', 'pub-d2-diagram', '확정 체크리스트' | ForEach-Object Line
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:648:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:53:- 확정 원고의 Visual asset 필드를 스캔해 이미지 프롬프트를 image-gen의 `[IMAGE PROMPT]` 태그로 자동 변환(브릿지 내장) 후 image-gen 실행 → `assets/images/chNN/`. `` ```d2 `` 블록은 pub-d2-diagram으로 렌더 → `assets/diagrams/`.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:649:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:651:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:57:- 결과: 이후 5~11단계(코드/스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)는 **원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로**를 읽어 자산을 임베드한다(소비 계약, 각 스킬 SKILL.md 참조) — 재동기화 폭포(자산을 나중에 만들어 소비 산출물을 전부 다시 만드는 문제)를 제거하기 위한 핵심 변경.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:652:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:58:- 코드/캡처형 자산(화면 캡처 등 실행 결과가 필요한 자산)은 예외적으로 `practice-code`(5단계) 이후 finalize substage에서 처리한다(image/D2는 원고확정 직후 착수).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:657:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:155:- **시각 자산 생성과의 분리(2026-07-06 개정)**: `manuscript-final`은 Visual asset 필드의 프롬프트/D2 소스 문구를 다듬는 것까지만 책임진다. 실제 이미지/D2 렌더 생성과 `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets`(§3.0-A)가 전담한다 — 원고확정 시점에는 자산이 아직 없어도 확정할 수 있다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:659:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:171:- **원고 연동 입력 계약**: 확정 원고의 해당 슬라이드(비유·나레이션·Visual asset)를 자동으로 읽어 시뮬레이터 설계에 반영.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:662:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:195:- 본문 폰트 RIDIBatang·코드 D2Coding: Windows에 설치하거나 무료 대체 폰트(KoPubWorld바탕 등) 선정 — 구현 시 사용자와 확정.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:663:docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md:204:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:664:scripts\annotate_manuscript_assets.py:1:"""원고 Visual asset 필드에 manifest의 확정 자산 경로를 병기(주석).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:709:.claude/skills\book-build\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 비유(Easy analogy)·실무사례(Practical case)·나레이션·실습·평가문항을 씨앗으로 소설처럼 이야기 형태로 재집필해 차시별 PDF 책(`book/chNN.pdf`)을 만든다. 과정 완주 시 합본(`book/합본.pdf`)도 만든다. "책 만들어줘", "PDF 책", "챕터 집필" 요청 시 사용. 파이프라인 11단계 — 캐릭터 설정 → 소설체 재집필(이미지는 `assets/manifest.json`의 확정 경로를 참조) → humanizer 문체 교정 → 편집 검토 3종(사실성·개념 누락·과도한 소설화) → typst_builder(Typst/Pandoc)로 PDF 빌드. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:742:.claude/skills\manuscript-final\SKILL.md:3:description: 원고 초안(2단계 산출물)을 사용자와 티키타카(반복 수정)하며 확정 원고로 완성한다. "원고 수정", "원고 완성", "티키타카" 요청 시 사용. manuscripts/chNN_draft.md를 chNN.md로 이어받아 슬라이드 추가/삭제/압축/비유 교체/나레이션 수정을 한 번에 한 요청씩 처리하고, 사용자가 "확정"이라 하면 확정 체크리스트를 통과시켜 status.md 원고확정을 갱신한다. 시각 자산(이미지/D2)의 실제 생성은 이 스킬이 아니라 다음 단계 `visual-assets`(4단계)가 담당한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:744:.claude/skills\manuscript-final\SKILL.md:33:이 스킬은 Visual asset 필드의 프롬프트/D2 소스 **문구를 다듬는 것까지만** 책임진다. 실제 이미지/D2 렌더 생성, `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets` 스킬(4단계, `.claude/skills/visual-assets/SKILL.md`)이 전담한다 — image-gen/pub-d2-diagram 브릿지 절차(태그 변환, 스크래치 파일, 경로 규약)도 그쪽으로 이관되었다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:745:.claude/skills\manuscript-final\SKILL.md:35:원고확정 시점에 시각 자산이 아직 없어도(프롬프트/D2 소스만 있어도) 확정할 수 있다 — 자산 생성 완료 여부는 §4 확정 체크리스트의 대상이 아니다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:754:.claude/skills\visual-assets\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 Visual asset 필드(이미지 프롬프트·D2 소스)를 실자산(PNG/SVG)으로 생성해 `assets/manifest.json`(SSOT)을 확정하는 스킬. "시각자산 생성", "이미지·다이어그램 만들어줘", "자산 렌더", "visual-assets" 요청 시 사용. 파이프라인 4단계(원고확정 직후, 코드/스토리보드 등 소비 산출물보다 앞) — 이후 6~11단계(스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)가 재동기화 폭포 없이 처음부터 실자산을 임베드하도록 하는 것이 존재 이유. image-gen `[IMAGE PROMPT]` 태그 자동 변환 브릿지 내장, `원고확정 ✅`(또는 명시적 `deferred`) hard gate, 해시 기반 부분(stale) 재생성을 담당한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:755:.claude/skills\visual-assets\SKILL.md:8:확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 **Visual asset** 필드에 있는 이미지 프롬프트·D2 소스를 실제 자산 파일(`assets/images/chNN/`, `assets/diagrams/`)로 생성하고, 그 결과를 `assets/manifest.json`(SSOT)에 확정하는 스킬이다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:771:.claude/skills\visual-assets\SKILL.md:66:- 이 주석은 사람이 읽기 위한 보조 표기일 뿐이다 — **manifest.json이 SSOT**다. 소비 스킬(`storyboard`/`ppt-preview`/`pptx-build`/`panseo-slide`/`book-build`)의 "원고 주석이 아니라 manifest 확정 경로를 읽도록" 계약 전환은 이 스킬의 책임 범위 밖(제안 E 조건 4, 별도 반영 — 각 소비 스킬의 SKILL.md 개정 필요)이다. 전환 전까지는 두 표기(원고 주석 + manifest)가 병존한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:773:.claude/skills\visual-assets\SKILL.md:79:원고 확정 후 프롬프트/D2가 수정되면(재개된 티키타카, "이 이미지 프롬프트 바꿔줘" 등) **전체 재생성 금지** — 바뀐 슬라이드만 재생성한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:811:.claude/skills\ppt-preview\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 Screen/Visual asset 필드를 16:9 슬라이드 캔버스로 나열한 라이트 테마 PPT 미리보기 `ppt_previews/chNN.html`을 만든다. "PPT 프리뷰 만들어줘", "PPT 미리보기 만들어줘" 요청 시 사용. 캔버스당 제목+짧은 문구+이미지/D2/코드만 배치하고 긴 설명은 넣지 않는다(설명은 원고·스토리보드 담당). 이미지/D2는 원고 프롬프트가 아니라 `assets/manifest.json`의 확정 경로를 읽어 삽입한다. 디자인 규범은 `templates/golden/ppt_preview_golden.html`이며 새 색상·다크 테마는 도입하지 않는다. 슬라이드 DOM은 `<section class="ppt-slide" data-slide="N">` + 내부 `.ppt-canvas` + 캔버스 내 `h2` 제목으로 고정한다(panseo-slide 그대로 모드가 이 구조를 그대로 소비 — pptx-build는 이 HTML이 아니라 원고 manuscripts/chNN.md를 직접 파싱하므로 이 계약에 의존하지 않는다). 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트). 사용자 확인 후 status.md PPT프리뷰 칸을 ✅로 갱신한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:812:.claude/skills\ppt-preview\SKILL.md:8:확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 Screen/Visual asset 필드를 실제 PPT 화면처럼 16:9 캔버스로 나열한 라이트 테마 미리보기 `ppt_previews/chNN.html`을 만드는 스킬이다. 파이프라인 7단계(`docs/superpowers/specs/2026-07-05-unified-lecture-pipeline-design.md` §3 표)이며, 순서 확인용으로 `storyboards/chNN.html`(6단계 산출물)을 참고한다. 선행 단계는 원고확정(3단계) + 시각자산(4단계, `visual-assets`) — 시각자산이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:825:.claude/skills\book-build\references\templates\book_base.typ:249:  // 이 경우 D2 재배치(가로 분할·2단 구성) 또는 전면 그림(별도 페이지 배치)을 검토할 것.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:826:.claude/skills\book-build\references\templates\book_base.typ:302:    body + v(2pt) + align(center, text(7.5pt, fill: rgb("#b45309"), style: "italic")[⚠ 세로 비율이 커 축소됨 — D2 재배치/전면 그림 배치 검토 권장])
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:830:.claude/skills\storyboard\SKILL.md:3:description: 확정 원고(`manuscripts/chNN.md`)의 슬라이드를 1:1 카드로 펼친 라이트 테마 강사용 스토리보드 `storyboards/chNN.html`을 만든다. "스토리보드 만들어줘" 요청 시 사용. 카드 상단에 슬라이드 화면 미리보기(Screen 필드 재현, `assets/manifest.json`에 실자산이 있으면 삽입/없으면 프롬프트 placeholder), 하단에 Easy analogy/Practical case/Visual asset/Source/Narration/Practice/Assessment를 라벨링된 패널로 배치한다. 디자인 규범은 `templates/golden/storyboard_golden.html`이며 새 색상·다크 테마는 도입하지 않는다. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트). 사용자 확인 후 status.md 스토리보드 칸을 ✅로 갱신한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1082:   3: description: 확정 원고(`manuscripts/chNN.md`)를 python-pptx로 16:9 PPTX(`pptx/chNN.pptx`)로 변환하고, 슬라이드마다 Narration을 발표자 노트에 삽입한다. "PPTX 만들어줘", "PPT 완성", "PPTX 빌드" 요청 시 사용. 파이프라인 10단계 — `scripts/build_pptx.py` CLI를 실행해 원고를 직접 파싱한다(HTML 프리뷰를 다시 파싱하지 않음). 확정 원고와 `--assets-root`로 지정한 과정 디렉터리의 `assets/` 하위 이미지 경로를 사용한다. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1087:   8: 확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물, manuscript-schema 문법)를 16:9 PPTX(`pptx/chNN.pptx`)로 변환하는 스킬이다. 파이프라인 10단계이며, 빌더는 `scripts/build_pptx.py`(python-pptx 1.0.2, Task 11 스파이크로 notes_slide 동작 검증됨)다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1093:  14: - `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅여야 한다. 아니면 사용자에게 알리고 중단한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1115:  36: ### 2. 검증 (확정 체크리스트)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1130:  51: ### 3. 사용자 확인 및 확정
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1134:  55: - 사용자가 확정하면 `courses/{course-id}/status.md`의 해당 차시 `PPTX` 칸을 ✅로 갱신하고, 산출물 인덱스에 `- chNN PPTX: pptx/chNN.pptx (확정 YYYY-MM-DD)`를 추가한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1140:  61: 1. **원고를 수정하지 않는다** — `manuscript-schema` 문법을 따르는 확정 원고는 건드리지 않는다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1202:  42: ### 4. 편집 검토 패스 (필수, 3종)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1213:   3: description: 확정 원고(`manuscripts/chNN.md`)의 Visual asset 필드(이미지 프롬프트·D2 소스)를 실자산(PNG/SVG)으로 생성해 `assets/manifest.json`(SSOT)을 확정하는 스킬. "시각자산 생성", "이미지·다이어그램 만들어줘", "자산 렌더", "visual-assets" 요청 시 사용. 파이프라인 4단계(원고확정 직후, 코드/스토리보드 등 소비 산출물보다 앞) — 이후 6~11단계(스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)가 재동기화 폭포 없이 처음부터 실자산을 임베드하도록 하는 것이 존재 이유. image-gen `[IMAGE PROMPT]` 태그 자동 변환 브릿지 내장, `원고확정 ✅`(또는 명시적 `deferred`) hard gate, 해시 기반 부분(stale) 재생성을 담당한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1218:   8: 확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물)의 **Visual asset** 필드에 있는 이미지 프롬프트·D2 소스를 실제 자산 파일(`assets/images/chNN/`, `assets/diagrams/`)로 생성하고, 그 결과를 `assets/manifest.json`(SSOT)에 확정하는 스킬이다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1220:  10: **파이프라인 위치**: `manuscript-final`(3단계, 원고확정) 바로 다음, `practice-code`(코드) 이전. 자산 생성이 소비 산출물(스토리보드·PPT프리뷰·판서·PPTX·책) 뒤로 밀리면, 나중에 이미지를 만들 때마다 그 4~5개 산출물을 전부 다시 만들어야 하는 재동기화 폭포가 생긴다(`docs/proposals/2026-07-06_visual-assets-stage-redesign.md` §1). 이 스킬을 원고확정 직후에 실행해 그 문제를 구조적으로 없앤다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1230:  20: - `manuscripts/chNN.md`가 없거나 `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅가 아니면 **중단한다**. 미확정 원고로 자산을 생성하지 않는다(확정 후에도 프롬프트가 바뀌면 §7 해시 stale로 흡수하지, 티키타카 중간에 매번 생성하지 않는다).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1232:  22: - 대상 차시(chNN)·과정 디렉터리(`courses/{course-id}`)를 확정하고, 이번에 생성할 슬라이드 범위를 사용자에게 확인한다: "지금 전부 생성" / "일부만 생성하고 나머지는 나중(deferred)" / "이미 지정한 슬라이드만".
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1276:  66: - 이 주석은 사람이 읽기 위한 보조 표기일 뿐이다 — **manifest.json이 SSOT**다. 소비 스킬(`storyboard`/`ppt-preview`/`pptx-build`/`panseo-slide`/`book-build`)의 "원고 주석이 아니라 manifest 확정 경로를 읽도록" 계약 전환은 이 스킬의 책임 범위 밖(제안 E 조건 4, 별도 반영 — 각 소비 스킬의 SKILL.md 개정 필요)이다. 전환 전까지는 두 표기(원고 주석 + manifest)가 병존한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1287:  77: ### 7. 해시 기반 stale 재감지 (재실행 시 — 원고가 확정 후 다시 바뀐 경우)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1289:  79: 원고 확정 후 프롬프트/D2가 수정되면(재개된 티키타카, "이 이미지 프롬프트 바꿔줘" 등) **전체 재생성 금지** — 바뀐 슬라이드만 재생성한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1298:  88: ## 확정 체크리스트
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1310: 100: - `missing`으로 남은 슬라이드만 골라 사용자에게 보고("Slide 9 이미지가 아직 없습니다 — 지금 생성할까요, 나중으로 미룰까요?")한 뒤, 선택에 따라 §2/§3을 그 슬라이드에 한해 재실행하거나 `deferred`로 명시 확정한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1325: 115: - 이 스킬은 절차 문서이며 TDD 대상이 아니다. 실사용 시 산출물 품질은 위 "확정 체크리스트"가 매 실행마다 담당한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1328:   1: """원고 Visual asset 필드에 manifest의 확정 자산 경로를 병기(주석).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1421:.claude/skills/course-pipeline/SKILL.md:41:- 위 매핑 표의 순서(`과정개요서 → 원고초안 → 원고확정 → 시각자산 → 코드 → 스토리보드 → PPT프리뷰 → 판서 → 시뮬 → PPTX → 책`)를 그대로 따라, 각 차시(chNN) 행에서 왼쪽부터 훑어 **첫 번째 ⬜ 또는 🔄 셀**을 찾는다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1423:.claude/skills/course-pipeline/SKILL.md:56:| 시각자산 (`visual-assets`) | 원고확정 ✅ |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1424:.claude/skills/course-pipeline/SKILL.md:57:| 코드 (`practice-code`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1425:.claude/skills/course-pipeline/SKILL.md:58:| 스토리보드 (`storyboard`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1426:.claude/skills/course-pipeline/SKILL.md:59:| PPT프리뷰 (`ppt-preview`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1427:.claude/skills/course-pipeline/SKILL.md:60:| 판서 (`panseo-slide`) | (원고확정 ✅ 요약 모드 / PPT프리뷰 ✅ 그대로 모드 — 모드는 스킬이 실행 시 사용자에게 물음) **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1428:.claude/skills/course-pipeline/SKILL.md:61:| 시뮬 (`edu-sim-builder`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1429:.claude/skills/course-pipeline/SKILL.md:62:| PPTX (`pptx-build`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1430:.claude/skills/course-pipeline/SKILL.md:63:| 책 (`book-build`) | 원고확정 ✅ **그리고** 시각자산 ✅ 또는 `deferred`(하드 게이트) |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1432:.claude/skills/course-pipeline/SKILL.md:67:예: 코드 단계(`practice-code`)를 호출하려는데 해당 차시 `원고확정`이 아직 ⬜/🔄이면, 오케스트라는 `practice-code`를 호출하지 않고 "ch03의 원고확정이 아직 끝나지 않았습니다. 먼저 `manuscript-final`부터 진행할까요?"라고 사용자에게 확인한다. `원고확정`은 ✅인데 `시각자산`이 ⬜/🔄/`partial`/`stale`이면 "ch03의 시각자산이 아직 완료(✅)되지 않았거나 명시적 `deferred`가 아닙니다. 먼저 `visual-assets`부터 진행할까요?"라고 확인한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1435:courses/spring-boot-basic/status.md:5:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1437:courses/spring-boot-basic/status.md:12:> ch01 전 단계는 2026-07-06 자율 생성 + 자가검증 완료. **아침 사용자 검토 대기**. 파이프라인 11단계(visual-assets 신설) 재설계 후 새 순서로 재빌드됨.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1440:templates\status_template.md:5:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1443:templates\status_template.md:13:- `partial` — 슬라이드 일부는 생성 완료(`present`)했지만 나머지가 아직 미확정(`missing`)이고 사용자가 그 나머지를 `deferred`로 확정 짓지 않은 상태(`visual-assets` §6). 전부 `present`가 되거나 남은 슬라이드를 명시적으로 `deferred`로 확정하면 `✅`로 갱신.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1447:docs\proposals\2026-07-06_visual-assets-stage-redesign.md:20:### 제안 A (핵심): "시각자산" 스테이지 신설 — 원고확정 직후, 소비 산출물 앞
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1448:docs\proposals\2026-07-06_visual-assets-stage-redesign.md:22:파이프라인을 10단계 → **11단계**로 바꾼다. 새 단계 `visual-assets`를 4번(원고확정 다음, 코드 앞)에 넣는다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1452:docs\proposals\2026-07-06_visual-assets-stage-redesign.md:42:열: `원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책` (10칸 → 11칸).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1457:docs\proposals\2026-07-06_visual-assets-stage-redesign.md:49:4. **소비 스킬 계약 변경**: storyboard·ppt-preview·pptx-build·panseo·book-build은 원고 프롬프트 텍스트가 아니라 **manifest의 확정 경로**를 읽어 자산을 임베드한다(경로 없으면 그 슬라이드만 placeholder). 이 변경이 D 반영 범위에 포함됨.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1475:docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:14:4. **소비 스킬 계약 변경을 D 범위에 명시.** 후속 스킬(storyboard/ppt-preview/pptx-build/panseo/book)은 원고의 prompt 텍스트가 아니라 manifest/확정 경로를 읽는다. 안 바꾸면 효과 반쪽.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1476:docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:20:`manuscript-final → visual-assets(image+D2) → practice-code → (코드/캡처형 자산 finalize substage) → storyboard → ...`. 이미지 생성 지연이 크므로 원고확정 직후 착수가 유리. 코드/스크린샷 파생 자산은 practice-code 이후 substage로.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1481:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:47:- **하드 게이트(codex 조건 반영)**: `visual-assets`가 ✅(생성 완료) 또는 명시적 `deferred`(placeholder 유지로 확인)일 때만 5~11단계를 진행한다. 원고확정만 되고 시각자산 칸이 비어 있으면(⬜/🔄) 후속 단계 스킬은 진행을 거부하고 먼저 `visual-assets`를 완료하도록 안내한다. `course-pipeline`의 선행 게이트 표에도 동일하게 반영한다(`.claude/skills/course-pipeline/SKILL.md`).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1484:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:55:- 생성 완료 자산 경로를 원고 Visual asset 필드에 `→ 생성됨:`/`→ 렌더됨:`으로 주석(사람이 읽는 보조 표기)하는 동시에, **`assets/manifest.json`을 SSOT로 갱신**한다 — 슬라이드별 `{ image: {status, path, prompt_hash}, d2: {status, path, d2_hash} }` 구조. 슬라이드별 status는 `present`(실자산 존재) / `deferred`(사용자가 나중으로 선택, placeholder 유지) / `missing`(아직 미확정) 중 하나(`scripts/build_asset_manifest.py`, `.claude/skills/visual-assets/SKILL.md` §4 실제 구현 기준). 이와 별개로 status.md `시각자산` 열(차시 전체 요약)은 `✅`/`deferred`/`partial`/`stale` 4가지 값을 쓴다(§4, `templates/status_template.md` 참조) — 원고가 재수정되어 해시가 어긋난 상태는 이 status.md 칸에 `stale`로 표기된다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1486:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:57:- 결과: 이후 5~11단계(코드/스토리보드/PPT프리뷰/판서/시뮬/PPTX/책)는 **원고 프롬프트 텍스트가 아니라 `assets/manifest.json`의 확정 경로**를 읽어 자산을 임베드한다(소비 계약, 각 스킬 SKILL.md 참조) — 재동기화 폭포(자산을 나중에 만들어 소비 산출물을 전부 다시 만드는 문제)를 제거하기 위한 핵심 변경.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1490:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:107:| 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1491:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:155:- **시각 자산 생성과의 분리(2026-07-06 개정)**: `manuscript-final`은 Visual asset 필드의 프롬프트/D2 소스 문구를 다듬는 것까지만 책임진다. 실제 이미지/D2 렌더 생성과 `→ 생성됨:`/`→ 렌더됨:` 병기, `assets/manifest.json` 갱신은 원고확정 **다음** 단계인 `visual-assets`(§3.0-A)가 전담한다 — 원고확정 시점에는 자산이 아직 없어도 확정할 수 있다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1493:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:181:- **시각 자산과의 관계(2026-07-06 개정)**: `pptx-build`(10단계) 코드 자체는 바뀌지 않는다 — 원고에 병기된 `assets/...png|jpg` 경로를 정규식으로 잡는 방식 그대로다. 이제 `visual-assets`(4단계)가 원고확정 직후 실행되므로, `pptx-build`가 호출되는 시점엔 원고에 이미 실자산 경로가 병기되어 있는 것이 정상 경로다(과거처럼 placeholder만 있는 상태로 넘어와 재빌드가 필요한 상황이 줄어든다).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1494:docs\superpowers\specs\2026-07-05-unified-lecture-pipeline-design.md:204:**시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1499:docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:5:**Goal:** 하네스의 시각자산 기본값을 D2 다이어그램에서 GPT 이미지로 전환하고(D2는 명시 opt-in 폴백으로 유지), 그 규약으로 `spring-boot-basic` ch01의 5개 D2 슬라이드(05·08·10·15·20)를 GPT 이미지로 재생성해 전 소비물을 재빌드한 뒤 ch01을 재확정한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1515:docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:105:codex exec --sandbox read-only 'docs/proposals/2026-07-06_d2-to-gpt-image-default.md 제안을 검토하라. scripts/build_asset_manifest.py의 현재 D2 우선 로직(105~120행)과 slide_covered 집계(123~135행)를 읽고, 제안대로 이미지 primary 기본 + D2 opt-in 마커로 역전할 때 (1) 기존 D2-only 슬라이드 회귀 여부 (2) 이미지 미생성 슬라이드가 missing으로 뜨는 게 하드 게이트와 정합한지 (3) 소비 스킬이 primary를 읽는 계약의 빈틈을 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1583:docs\superpowers\plans\2026-07-06-d2-to-gpt-image-default.md:716:사용자가 확정하면 ch01 `시각자산` 칸을 `✅`로 갱신하고, "다음 할 일" 줄을 다음 차시(ch02) 착수 또는 파일럿 종료로 갱신한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1652:   5: | 차시 | 원고초안 | 원고확정 | 시각자산 | 코드 | 스토리보드 | PPT프리뷰 | 판서 | 시뮬 | PPTX | 책 |
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1656:   9: 기호: ⬜ 미착수 / 🔄 진행 중(사용자 확인 대기 포함) / ✅ 확정 / ➖ 보류(사유는 아래)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1659:  12: > ch01 전 단계는 2026-07-06 자율 생성 + 자가검증 완료. **아침 사용자 검토 대기**. 파이프라인 11단계(visual-assets 신설) 재설계 후 새 순서로 재빌드됨.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1661:  14: 다음 할 일: ch01 산출물 사용자 검토. (엔진 7기능 실브라우저 조작, PDF/PPTX 육안 확인 권장)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1664:  17: - ch01 확정원고: manuscripts/ch01.md (26슬라이드, 자산 경로 병기, 채택 2026-07-06)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1672:  25: - ch01 책: book/ch01.pdf (17p, 소설체, 삽화 13개[D2 5 + 이미지 8], 캐릭터 3인, 편집검토 3종 통과)
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1682: 179: - **발표자 노트에 Narration 삽입** — python-pptx의 `notes_slide` API가 발표자 노트를 정식 지원한다(codex가 blocker로 지적했으나 과대평가로 판단). 다만 구현 초기에 "슬라이드 1장 + 노트 삽입 + PowerPoint에서 열어 확인" spike를 먼저 수행해 확정한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1684: 181: - **시각 자산과의 관계(2026-07-06 개정)**: `pptx-build`(10단계) 코드 자체는 바뀌지 않는다 — 원고에 병기된 `assets/...png|jpg` 경로를 정규식으로 잡는 방식 그대로다. 이제 `visual-assets`(4단계)가 원고확정 직후 실행되므로, `pptx-build`가 호출되는 시점엔 원고에 이미 실자산 경로가 병기되어 있는 것이 정상 경로다(과거처럼 placeholder만 있는 상태로 넘어와 재빌드가 필요한 상황이 줄어든다).
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1692: 204: **시각 자산 소비(2026-07-06 개정)**: 이미지·D2 PNG 삽입 시 원고에 병기된 프롬프트 텍스트가 아니라 `assets/manifest.json`에서 해당 슬라이드의 확정 경로(image가 `present`면 그 path, 없고 d2가 `present`면 그 path)를 읽어 참조한다. 둘 다 `present`가 아니면(`deferred`/`missing`) 해당 장면은 삽화 없이 텍스트만으로 진행한다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1705:3. 이미지 미생성 슬라이드를 `missing`으로 띄우는 것은 하드 게이트와 정합합니다. [visual-assets](C:/Users/ssarm/Documents/course-haness/.claude/skills/visual-assets/SKILL.md:68)와 [course-pipeline](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-pipeline/SKILL.md:65)은 `partial`/`missing` 상태에서 후속 단계를 막도록 되어 있습니다. 다만 “사용자가 명시적으로 나중에”를 계속 지원하려면 별도 opt-out/deferred 마커가 필요합니다. 새 기본값에서는 D2 present만으로 자동 deferred 처리하면 안 됩니다.
docs\reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:1730:3. 이미지 미생성 슬라이드를 `missing`으로 띄우는 것은 하드 게이트와 정합합니다. [visual-assets](C:/Users/ssarm/Documents/course-haness/.claude/skills/visual-assets/SKILL.md:68)와 [course-pipeline](C:/Users/ssarm/Documents/course-haness/.claude/skills/course-pipeline/SKILL.md:65)은 `partial`/`missing` 상태에서 후속 단계를 막도록 되어 있습니다. 다만 “사용자가 명시적으로 나중에”를 계속 지원하려면 별도 opt-out/deferred 마커가 필요합니다. 새 기본값에서는 D2 present만으로 자동 deferred 처리하면 안 됩니다.
docs\reviews\2026-07-06_pptx-image-mode-codex-review.md:1:# codex 검토: pptx-build 이미지 모드 제안서
docs\reviews\2026-07-06_pptx-image-mode-codex-review.md:5:- 방식: `codex exec --sandbox read-only` (stdin 닫음), 실제 파일 대조 검토
docs\reviews\2026-07-06_pptx-image-mode-codex-review.md:7:- 종합: **이미지 모드 방향 건전, 구현·하위호환 확인.** 계약 강제와 문서 정합만 보완 권고.
docs\reviews\2026-07-06_pptx-image-mode-codex-review.md:19:## 원문 검토 요지
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:14:4. **소비 스킬 계약 변경을 D 범위에 명시.** 후속 스킬(storyboard/ppt-preview/pptx-build/panseo/book)은 원고의 prompt 텍스트가 아니라 manifest/확정 경로를 읽는다. 안 바꾸면 효과 반쪽.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:17:"원고확정 후 자산 생성"이면 티키타카 중 프롬프트 변경 비용 우려는 대부분 해소(확정=승인). 이후 변경은 티키타카가 아니라 "변경 요청". 현실적 수정은 해시 기반 부분 재생성으로 흡수.
docs\reviews\2026-07-06_visual-assets-redesign-codex-review.md:20:`manuscript-final → visual-assets(image+D2) → practice-code → (코드/캡처형 자산 finalize substage) → storyboard → ...`. 이미지 생성 지연이 크므로 원고확정 직후 착수가 유리. 코드/스크린샷 파생 자산은 practice-code 이후 substage로.

 succeeded in 1880ms:
 780:     """필수 도구 설치 확인"""
 781:     missing = []
 782:     for tool in ['typst', 'pandoc']:
 783:         if shutil.which(tool) is None:
 784:             missing.append(tool)
 785: 
 786:     if missing:
 787:         print(f"[오류] 필수 도구 미설치: {', '.join(missing)}")
 788:         if sys.platform == 'win32':
 789:             ids = {'typst': 'Typst.Typst', 'pandoc': 'JohnMacFarlane.Pandoc'}
 790:             for tool in missing:
 791:                 print(f"  설치(winget): winget install --id {ids.get(tool, tool)} -e")
 792:         else:
 793:             print(f"  설치(brew): brew install {' '.join(missing)}")
 794:         return False
 795: 
 796:     for tool in ['typst', 'pandoc']:
 797:         result = subprocess.run([tool, '--version'], capture_output=True, text=True)
 798:         version = result.stdout.strip().split('\n')[0]
 799:         print(f"   {tool}: {version}")
 800: 
 801:     return True
 802: 
 803: 
 804: # ══════════════════════════════════════
 805: # Stage 1: raw .typ 생성 (캐시용)
 806: # ══════════════════════════════════════
 807: 
 808: def build_raw_typ(front: list, chapters: list, back: list,
 809:                   mermaid_out: Path, assets_dir: Path,
 810:                   md_output: Path,
 811:                   image_border_preset: str = "plain",
 812:                   use_image_variables: bool = False,
 813:                   exclude_from_toc: bool = False) -> str:
 814:     """Stage 1: MD 파일들 → 통합 MD → Pandoc → 후처리된 raw .typ 콘텐츠.
 815: 
 816:     템플릿/디자인 병합 전 단계까지만 실행하고 결과 문자열을 반환.
 817:     디자인 변경 시 이 결과를 캐시하여 Stage 2만 재실행하면 ~200ms로 처리 가능.
 818:     """
 819:     global _mermaid_counter
 820:     _mermaid_counter = 0
 821: 
 822:     # 이미지 공백 제거
 823:     autocrop_all_assets(assets_dir, mermaid_out)
 824: 
 825:     # 통합 MD
 826:     integrated = build_integrated_md(front, chapters, back, mermaid_out)
 827:     if md_output is None:
 828:         import tempfile
 829:         tmp = tempfile.NamedTemporaryFile(suffix=".md", delete=False, mode="w", encoding="utf-8")
 830:         tmp.write(integrated)
 831:         tmp.close()
 832:         md_output = Path(tmp.name)
 833:         _tmp_md = True
 834:     else:
 835:         md_output.parent.mkdir(parents=True, exist_ok=True)
 836:         md_output.write_text(integrated, encoding="utf-8")
 837:         _tmp_md = False
 838: 
 839:     # Pandoc 변환
 840:     raw_typ_path = md_output.with_suffix('.raw.typ')
 841:     if not md_to_typst(md_output, raw_typ_path):
 842:         raise RuntimeError("Pandoc 변환 실패")
 843: 
 844:     # 후처리
 845:     raw = raw_typ_path.read_text(encoding="utf-8")
 846:     fixed = fix_typst_content(raw, image_border_preset=image_border_preset, use_image_variables=use_image_variables, exclude_from_toc=exclude_from_toc)
 847:     raw_typ_path.unlink(missing_ok=True)
 848:     if _tmp_md:
 849:         md_output.unlink(missing_ok=True)
 850: 
 851:     print(f"   Stage 1 완료: raw .typ ({len(fixed)} chars)")
 852:     return fixed
 853: 
 854: 
 855: # ══════════════════════════════════════
 856: # 부분 빌드 함수
 857: # ══════════════════════════════════════
 858: 
 859: def build_partial(md_content: str, config: dict,
 860:                   design_state: dict | None = None,
 861:                   include_cover: bool = False) -> Path | None:
 862:     """선택된 블록만 PDF로 빌드 (경량 빌드)
 863: 
 864:     Parameters:
 865:         md_content: 선택된 블록들의 마크다운 텍스트
 866:         config: 빌드 설정 (build()와 동일한 키)
 867:         design_state: 에디터 디자인 상태 딕셔너리
 868:         include_cover: 표지 페이지 포함 여부
 869:     Returns:
 870:         생성된 PDF 경로, 실패 시 None
 871:     """
 872:     import tempfile
 873: 
 874:     title = config.get('title', 'Book')
 875:     print(f"{title} 부분 PDF 생성 (Typst)")
 876:     print("-" * 40)
 877: 
 878:     # 0. 의존성 확인
 879:     if not check_dependencies():
 880:         return None
 881: 
 882:     # 1. 임시 MD 파일 생성
 883:     book_dir = config['output_md'].parent
 884:     tmp_md = book_dir / "_preview_partial.md"
 885:     tmp_md.write_text(md_content, encoding="utf-8")
 886:     print(f"   임시 MD: {tmp_md.name} ({len(md_content)} chars)")
 887: 
 888:     # 2. 전처리 (이미지 경로, br 태그 등)
 889:     mermaid_out = config.get('mermaid_out', book_dir / '_mermaid_images')
 890:     processed = build_integrated_md([], [tmp_md], [], mermaid_out)
 891:     tmp_md.write_text(processed, encoding="utf-8")
 892: 
 893:     # 3. Pandoc 변환
 894:     print("   Pandoc 변환...")
 895:     tmp_raw_typ = book_dir / "_preview_partial.raw.typ"
 896:     if not md_to_typst(tmp_md, tmp_raw_typ):
 897:         print("   [오류] Pandoc 변환 실패")
 898:         return None
 899: 
 900:     # 4. 후처리
 901:     raw_content = tmp_raw_typ.read_text(encoding="utf-8")
 902:     image_border_preset = config.get('image_border_preset', 'plain')
 903:     fixed_content = fix_typst_content(raw_content, image_border_preset=image_border_preset)
 904: 
 905:     # 5. 템플릿 병합 (디자인 상태 반영)
 906:     design = config.get('design')
 907:     # design이 없으면 design_state의 components로 생성
 908:     if not design and design_state:
 909:         components = design_state.get('components', {})
 910:         if components:
 911:             design = ",".join(f"{k}={v}" for k, v in components.items())
 912: 
 913:     final_typ = merge_template_and_content(
 914:         config['template'], fixed_content,
 915:         design=design, design_state=design_state,
 916:         skip_cover=not include_cover, skip_toc=not include_cover
 917:     )
 918: 
 919:     out_typ = book_dir / "_preview_partial.typ"
 920:     out_pdf = book_dir / "_preview_partial.pdf"
 921:     out_typ.write_text(final_typ, encoding="utf-8")
 922: 
 923:     # 6. Typst 컴파일
 924:     print("   Typst 컴파일...")
 925:     if not typst_compile(out_typ, out_pdf, config.get('font_path')):
 926:         print("   [오류] Typst 컴파일 실패")
 927:         return None
 928: 
 929:     # 7. 임시 파일 정리
 930:     for f in [tmp_md, tmp_raw_typ, out_typ]:
 931:         f.unlink(missing_ok=True)
 932: 
 933:     size_kb = out_pdf.stat().st_size / 1024
 934:     print(f"   완료: {out_pdf.name} ({size_kb:.0f} KB)")
 935:     return out_pdf
 936: 
 937: 
 938: # ══════════════════════════════════════
 939: # 메인 빌드 함수
 940: # ══════════════════════════════════════
 941: 
 942: def build(config: dict):
 943:     """PDF 빌드 실행.
 944: 
 945:     config 필수 키:
 946:         title:       str       — 책 제목 (출력 메시지용)
 947:         base:        Path      — 프로젝트 루트
 948:         assets_dir:  Path      — 이미지 에셋 디렉토리
 949:         mermaid_out: Path      — Mermaid 렌더링 출력 디렉토리
 950:         template:    Path      — Typst 템플릿 (book.typ)
 951:         font_path:   Path|None — 추가 폰트 디렉토리
 952:         front:       list[Path]— 전문 마크다운 파일 목록
 953:         chapters:    list[Path]— 챕터 마크다운 파일 목록
 954:         back:        list[Path]— 후문 마크다운 파일 목록
 955:         output_md:   Path      — 통합 마크다운 출력 경로
 956:         output_typ:  Path      — 최종 Typst 출력 경로
 957:         output_pdf:  Path      — PDF 출력 경로
 958: 
 959:     config 선택 키:
 960:         image_border_preset: str — 이미지 테두리 프리셋
 961:             "plain" (기본), "clean-border", "shadow", "primary-shadow", "minimal"
 962:     """
 963:     global _mermaid_counter
 964: 
 965:     title = config.get('title', 'Book')
 966:     print(f"{title} 통합 PDF 생성 (Typst)")
 967:     print("=" * 50)
 968: 
 969:     # 0. 의존성 확인
 970:     if not check_dependencies():
 971:         return
 972: 
 973:     # 1. Mermaid 초기화
 974:     _mermaid_counter = 0
 975:     mermaid_out = config['mermaid_out']
 976:     if mermaid_out.exists():
 977:         shutil.rmtree(mermaid_out)
 978: 
 979:     # 1b. 표지 자동 생성 (cover_data가 있으면)
 980:     if config.get('cover_data'):
 981:         try:
 982:             _cover_scripts = Path(__file__).resolve().parents[3] / "pub-studio" / "references" / "scripts"
 983:             if str(_cover_scripts) not in sys.path:
 984:                 sys.path.insert(0, str(_cover_scripts))
 985:             from cover_generator import generate_front_cover
 986:             cover_dir = config['base'] / "assets"
 987:             cover_path = generate_front_cover(config, cover_dir)
 988:             # book.typ의 book-cover-image 변수를 이 경로로 설정
 989:             template_path = config.get('template')
 990:             if template_path and template_path.exists():
 991:                 typ_text = template_path.read_text(encoding="utf-8")
 992:                 if 'book-cover-image' in typ_text:
 993:                     import re as _re
 994:                     typ_text = _re.sub(
 995:                         r'#let book-cover-image = ".*?"',
 996:                         f'#let book-cover-image = "{cover_path}"',
 997:                         typ_text,
 998:                     )
 999:                     template_path.write_text(typ_text, encoding="utf-8")
1000:         except Exception as e:
1001:             print(f"   [경고] 표지 자동 생성 실패: {e}")
1002: 
1003:     # 2. 마크다운 통합 + 전처리
1004:     print("\n[1/6] 마크다운 통합 + 전처리...")
1005:     pre_toc_files = config.get('pre_toc', [])
1006:     integrated_md = build_integrated_md(
1007:         config['front'], config['chapters'], config['back'], mermaid_out
1008:     )
1009:     output_md = config['output_md']
1010:     output_md.parent.mkdir(parents=True, exist_ok=True)
1011:     output_md.write_text(integrated_md, encoding="utf-8")
1012:     print(f"\n   통합 마크다운: {output_md.name}")
1013: 
1014:     # 2b. pre_toc 파일 별도 처리 (머릿말 등 — 목차 앞에 배치)
1015:     pre_toc_typ_content = ""
1016:     if pre_toc_files:
1017:         pre_toc_md = build_integrated_md(pre_toc_files, [], [], mermaid_out)
1018:         pre_toc_md_path = output_md.parent / "_pre_toc.md"
1019:         pre_toc_md_path.write_text(pre_toc_md, encoding="utf-8")
1020:         pre_toc_raw = pre_toc_md_path.parent / "_pre_toc.raw.typ"
1021:         if md_to_typst(pre_toc_md_path, pre_toc_raw):
1022:             raw = pre_toc_raw.read_text(encoding="utf-8")
1023:             image_border_preset = config.get('image_border_preset', 'plain')
1024:             pre_toc_typ_content = fix_typst_content(raw, image_border_preset=image_border_preset, exclude_from_toc=True)
1025:             pre_toc_raw.unlink(missing_ok=True)
1026:         pre_toc_md_path.unlink(missing_ok=True)
1027: 
1028:     # 3. 이미지 공백 자동 제거
1029:     print("\n[2/6] 이미지 공백 자동 제거...")
1030:     autocrop_all_assets(config['assets_dir'], mermaid_out)
1031: 
1032:     # 4. Pandoc: MD → Typst (임시)
1033:     print("\n[3/6] Pandoc 변환 (MD → Typst)...")
1034:     output_typ = config['output_typ']
1035:     temp_typ = output_typ.with_suffix('.raw.typ')
1036:     if not md_to_typst(output_md, temp_typ):
1037:         return
1038: 
1039:     # 5. 후처리 + 템플릿 병합
1040:     print("\n[4/6] 후처리 + 템플릿 병합...")

 succeeded in 2064ms:
 500:         path = m.group(1)
 501:         alt = m.group(2).strip()
 502:         if use_image_variables:
 503:             cat = _detect_image_category(path)
 504:             width_var = f'img-{cat}-width'
 505:             style_var = f'img-{cat}-style'
 506:             if alt:
 507:                 return f'#auto-image("{path}", alt: [{alt}], max-width: {width_var}, style: {style_var})'
 508:             else:
 509:                 return f'#auto-image("{path}", max-width: {width_var}, style: {style_var})'
 510:         max_w = _detect_image_max_width(path)
 511:         style = _detect_image_style(path, image_border_preset)
 512:         style_param = f', style: "{style}"' if style != "plain" else ""
 513:         if alt:
 514:             return f'#auto-image("{path}", alt: [{alt}], max-width: {max_w}{style_param})'
 515:         else:
 516:             return f'#auto-image("{path}", max-width: {max_w}{style_param})'
 517: 
 518:     text = re.sub(r'!#link\("([^"]+)"\)\[([^\]]*)\]', fix_image, text)
 519: 
 520:     # 2. 이미지 수정: #box(image("path")) → #auto-image
 521:     def fix_box_image(m):
 522:         path = m.group(1)
 523:         if use_image_variables:
 524:             cat = _detect_image_category(path)
 525:             width_var = f'img-{cat}-width'
 526:             style_var = f'img-{cat}-style'
 527:             return f'#auto-image("{path}", max-width: {width_var}, style: {style_var})'
 528:         max_w = _detect_image_max_width(path)
 529:         style = _detect_image_style(path, image_border_preset)
 530:         style_param = f', style: "{style}"' if style != "plain" else ""
 531:         return f'#auto-image("{path}", max-width: {max_w}{style_param})'
 532: 
 533:     text = re.sub(r'#box\(image\("([^"]+)"\)\)', fix_box_image, text)
 534: 
 535:     # 3. 이미지 수정: #figure(image("path"), caption: [...]) → #auto-image
 536:     def fix_figure_image(m):
 537:         path = m.group(1)
 538:         alt = ' '.join(m.group(2).split()) if m.group(2) else ""
 539:         if use_image_variables:
 540:             cat = _detect_image_category(path)
 541:             width_var = f'img-{cat}-width'
 542:             style_var = f'img-{cat}-style'
 543:             if alt:
 544:                 return f'#auto-image("{path}", alt: [{alt}], max-width: {width_var}, style: {style_var})'
 545:             else:
 546:                 return f'#auto-image("{path}", max-width: {width_var}, style: {style_var})'
 547:         max_w = _detect_image_max_width(path)
 548:         style = _detect_image_style(path, image_border_preset)
 549:         style_param = f', style: "{style}"' if style != "plain" else ""
 550:         if alt:
 551:             return f'#auto-image("{path}", alt: [{alt}], max-width: {max_w}{style_param})'
 552:         else:
 553:             return f'#auto-image("{path}", max-width: {max_w}{style_param})'
 554: 
 555:     # image("path") 뿐 아니라 Pandoc이 캡션 있을 때 내는 image("path", alt: "...") 도 매치.
 556:     # alt는 따옴표 문자열로 정확히 매치(`"[^"]*"`) — alt 안에 "main()" 같은 괄호가 있어도
 557:     # 매치가 깨지지 않는다. 안 그러면 캡션 달린 도형이 auto-image(여백·max-height clamp)를
 558:     # 우회해 안전 여백 정책을 못 받는다 (2026-07-06 fix).
 559:     text = re.sub(
 560:         r'#figure\(image\("([^"]+)"(?:,\s*alt:\s*"[^"]*")?\)\s*,\s*caption:\s*\[([^\]]*)\]\s*\)',
 561:         fix_figure_image, text
 562:     )
 563: 
 564:     # 3.5 이미지 바로 뒤의 #emph[그림 N-M: ...] 캡션을 auto-image의 alt 파라미터로 병합
 565:     #     이미지와 캡션이 같은 페이지에 있도록 보장 (캡션만 다음 페이지로 넘어가는 고아 방지)
 566:     def _merge_caption_into_auto_image(m):
 567:         img_call = m.group(1)  # #auto-image("path", alt: [...], max-width: 0.6)
 568:         caption = m.group(2)    # 그림 2-4: 설명 텍스트
 569:         # 자동 번호 부여를 위해 수동 "그림 N-N:" / "실행 결과 N-N:" 접두어 제거
 570:         caption = re.sub(r'^(?:그림|실행\s*결과)\s*[\d서]+-\d+\s*[:：]\s*', '', caption)
 571:         if 'alt:' in img_call:
 572:             # alt가 이미 있으면 이탤릭 캡션으로 교체
 573:             return re.sub(r'alt:\s*\[[^\]]*\]', f'alt: [{caption}]', img_call)
 574:         # max-width: 앞에 alt: 삽입
 575:         return img_call.replace('max-width:', f'alt: [{caption}], max-width:')
 576: 
 577:     text = re.sub(
 578:         r'(#auto-image\([^)]*\))\s*\n?#emph\[((?:[^\]\\]|\\.)*)\]',
 579:         _merge_caption_into_auto_image,
 580:         text
 581:     )
 582: 
 583:     # 3.55 auto-image 뒤에 빈 줄 보장 (Typst가 figure와 다음 문단을 분리하도록)
 584:     text = re.sub(r'(#auto-image\([^)]*\))\n([^\n])', r'\1\n\n\2', text)
 585: 
 586:     # 3.6 pre_toc 콘텐츠 heading 목차 제외: = 제목 → #heading(outlined: false)[제목]
 587:     #     pre_toc 파일은 목차 앞에 배치되므로 목차에 포함되면 안 됨
 588:     if kwargs.get('exclude_from_toc'):
 589:         text = re.sub(r'^(=+)\s+(.+)$',
 590:                        lambda m: f'#heading(outlined: false, level: {len(m.group(1))})[{m.group(2).strip()}]',
 591:                        text, flags=re.MULTILINE)
 592: 
 593:     # 3.7 callout-box 변환: > **라벨**: 내용 or > **라벨: 제목** 내용
 594:     #     라벨을 프라이머리 색상 볼드로 강조
 595:     #     본문에 #strong[...] 등 중첩 브라켓이 있을 수 있으므로 정규식 대신 파싱
 596:     def _convert_callout_boxes(text):
 597:         result = []
 598:         i = 0
 599:         marker = '#quote(block: true)['
 600:         while i < len(text):
 601:             pos = text.find(marker, i)
 602:             if pos == -1:
 603:                 result.append(text[i:])
 604:                 break
 605:             result.append(text[i:pos])
 606:             # 브라켓 매칭으로 quote 블록 전체 추출
 607:             start = pos + len(marker)
 608:             depth = 1
 609:             j = start
 610:             while j < len(text) and depth > 0:
 611:                 if text[j] == '[':
 612:                     depth += 1
 613:                 elif text[j] == ']':
 614:                     depth -= 1
 615:                 j += 1
 616:             inner = text[start:j-1].strip()
 617:             # 패턴 A: #strong[라벨]: 본문
 618:             m = re.match(r'#strong\[([^\]]+)\]:\s*(.*)', inner, re.DOTALL)
 619:             if not m:
 620:                 # 패턴 B: #strong[라벨: 제목] (—|--)? 본문
 621:                 m = re.match(r'#strong\[([^:\]]+:\s*[^\]]+)\]\s*(?:---|—|--)?\s*(.*)', inner, re.DOTALL)
 622:             if m:
 623:                 label = m.group(1).strip()
 624:                 body = m.group(2).strip()
 625:                 result.append(f'#callout-box([{label}], [{body}])')
 626:             else:
 627:                 # callout 패턴이 아니면 원본 유지
 628:                 result.append(f'{marker}{inner}]')
 629:             i = j
 630:         return ''.join(result)
 631: 
 632:     text = _convert_callout_boxes(text)
 633: 
 634:     # 4. 한국어 라벨 제거 (Pandoc이 생성하는 <한국어-라벨>)
 635:     text = re.sub(r'<[가-힣a-zA-Z0-9.\-_]+>\n', '\n', text)
 636: 
 637:     # 5. 수평선 바로 뒤에 heading(= 또는 ==)이 오면 수평선 제거 (pagebreak 중복 방지)
 638:     text = re.sub(r'#horizontalrule\n+(?==)', '', text)
 639: 
 640:     # 6. 남은 수평선을 Typst 방식으로
 641:     text = text.replace('#horizontalrule', '#v(4pt)\n#block(width: 100%, height: 0.5pt, fill: rgb("#e5e7eb"))\n#v(4pt)')
 642: 
 643:     # 7. 표 열 균등화: Pandoc이 생성한 퍼센트 기반 열(38.71%, 32.26%, ...)을 1fr로 변환
 644:     #    짧은 열이 과도하게 넓고 긴 텍스트 열이 좁아지는 문제 해결
 645:     def _equalize_table_columns(m):
 646:         pct_list = m.group(1)
 647:         col_count = len(re.findall(r'[\d.]+%', pct_list))
 648:         if col_count > 0:
 649:             return f'columns: ({", ".join(["1fr"] * col_count)})'
 650:         return m.group(0)
 651: 
 652:     text = re.sub(r'columns:\s*\(([\d.%,\s]+)\)', _equalize_table_columns, text)
 653: 
 654:     # 8. 문단 간격: Pandoc Lua 필터(paragraph-gap.lua)에서 처리
 655:     #    Para→Para 사이에만 #v(paragraph-gap) 삽입 (표/코드/이미지에 영향 없음)
 656: 
 657:     return text
 658: 
 659: 
 660: def merge_template_and_content(template_path: Path, content: str,
 661:                                design: str | None = None,
 662:                                design_state: dict | None = None,
 663:                                skip_cover: bool = False,
 664:                                skip_toc: bool = False,
 665:                                pre_toc_content: str = "") -> str:
 666:     """템플릿 + Pandoc 변환 내용을 하나의 .typ 파일로 합침
 667: 
 668:     design이 지정되면 컴포넌트 어셈블러로 book_base를 조립.
 669:     없으면 기존 book_base.typ 파일을 사용 (하위호환).
 670:     pre_toc_content가 있으면 cover와 toc 사이에 삽입 (머릿말 등).

codex
기존 편집검토는 `book-build` 안에서 “3종 모두 수행, 하나라도 건너뛰면 확정 불가”로 정의되어 있습니다. 새 ④가 여기에 병렬 추가인지, ③을 대체하는지의 문서 표현이 실제 정합성의 핵심으로 보입니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md'; "'$lines=Get-Content -LiteralPath $p; foreach($range in @(@(67,91),@(95,105))){ for($i=$range[0];$i -le $range[1] -and $i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }; '"'' }" in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/SKILL.md'; "'$lines=Get-Content -LiteralPath $p; foreach($range in @(@(1,14),@(44,56),@(108,129))){ for($i=$range[0];$i -le $range[1] -and $i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }; '"'' }" in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'docs/proposals/2026-07-07_book-concept-anchor.md'; "'$lines=Get-Content -LiteralPath $p; for($i=1;$i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
 succeeded in 2048ms:
   1: # 제안: 책 개념 앵커 (기술명+D2 도식+정의 블록)
   2: 
   3: ## 1. 배경 / 문제
   4: - 소설체 PDF 책이 비유·이야기 일색으로 "부실해 보인다". 실제 ch01은 기술 정의가 서술 문단에 용해돼 안 보이고, 장 제목도 순전히 이야기라 무슨 기술인지 목차에서 안 보인다.
   5: - storytelling.md는 이미 "비유 → 왜? → 정의"를 요구하나 출력에서 정의가 프로즈에 용해돼 형해화됐다.
   6: 
   7: ## 2. 제안
   8: - **개념 앵커**: 새 핵심 기술 도입부(장당 1–2개)에 `정식 기술명 + 깨끗한 D2 도식 + 짧은 정의` 블록을 세우고 그 아래로 이야기가 흐른다. 정의는 앵커에만.
   9: - **렌더**: 책 원고에 pandoc fenced div `::: concept-anchor`로 표기 → 새 Lua 필터가 `#concept-anchor[…]` typst 호출로 변환 → book_base.typ의 `#let concept-anchor`가 구분선 블록으로 렌더.
  10: - **도식**: opt-in D2 재활용(GPT 일러스트는 장면 전용). **제목 이원화**("이야기 제목 — 기술 부제").
  11: - **편집검토 ④(하드 체크)**: 앵커 미충족 시 확정 불가.
  12: - **manuscript 무변경**(씨앗이 원고에 존재). 변경은 book-build에 국한.
  13: 
  14: ## 3. 하위호환 / 리스크
  15: - `::: concept-anchor`가 없는 기존 책 원고는 새 Lua 필터에 무영향(매칭 0건) → 회귀 없음.
  16: - Lua 필터가 div 내용을 그대로 `#concept-anchor[…]`로 감싸므로 앵커 내부 마크다운(굵은 명·이미지·정의)은 정상 렌더.
  17: 
  18: ## 4. 반영 순서
  19: Phase B(렌더 기구+테스트) → Phase C(문서) → Phase D(ch01 적용).

 succeeded in 2333ms:
  67: ### 3.5 편집 검토 ④ — 개념 앵커 검증 (하드 체크)
  68: 
  69: 기존 편집 검토 3종의 ③"과도한 소설화 방지"를 **"개념 앵커 검증"**으로 강화한다. 아래를 **하드 체크**로 하며, 미충족 시 책을 확정할 수 없다(기존 3종과 동일한 강제력):
  70: 
  71: - 각 장에 앵커가 **1–2개** 있다(0개 불가).
  72: - 각 앵커에 **정식 기술명 + (도식 또는 명시적 도식-불가 사유) + 정의**가 모두 있다.
  73: - 앵커의 정의가 프로즈 문단에 **중복 용해되지 않았다**(정의는 앵커에만).
  74: 
  75: ## 4. 컴포넌트 / 변경 범위
  76: 
  77: manuscript는 변경하지 않는다. 변경은 book-build에 국한된다.
  78: 
  79: | 컴포넌트 | 변경 |
  80: |---|---|
  81: | `.claude/skills/book-build/SKILL.md` | 재집필 단계에 앵커 규칙(§3.1·3.2·3.4) 추가. 편집 검토 ④ 하드 체크(§3.5)로 개정 |
  82: | `.claude/skills/book-build/references/storytelling.md` | "비유 → 왜? → 정의" 패턴 개정: 정의는 앵커에서 세운다(프로즈 용해 금지). 앵커를 필수 구조 요소로 명문화 |
  83: | 책 원고 마크다운 규약 (`book/chNN_원고.md`) | 앵커를 pandoc fenced div `::: concept-anchor … :::`로 표기 |
  84: | `.claude/skills/book-build/references/scripts/typst_builder.py` | `concept-anchor` fenced div를 구분 블록(구분선/여백 + 도식 + 정의)으로 렌더하는 스타일 추가 |
  85: | `.claude/skills/book-build/references/templates/book_base.typ` | `concept-anchor` 블록 typst 스타일 정의 |
  86: 
  87: ### 4.1 앵커 렌더링 인터페이스
  88: 
  89: - **마크다운 → typst**: pandoc fenced div `::: concept-anchor`가 typst의 커스텀 함수(예: `#concept-anchor[명][도식경로][정의])` 또는 스타일 박스로 매핑된다. `typst_builder.py`의 MD→typst 변환 로직에 이 div 클래스 처리를 추가한다.
  90: - **도식 경로**: 앵커 내부 이미지 경로는 `book/chNN_원고.md` 기준 상대경로(기존 삽화와 동일 규약).
  91: - **블록 스타일**: 위아래 구분선 또는 옅은 배경 + 여백으로 프로즈와 분리. 라이트 테마 고정(`style.md` 디자인 제약 준수, 새 색상 도입 금지).

  95: 하네스 변경 후 **ch01 책을 앵커 버전으로 재빌드**해 실제 결과를 확인한다:
  96: 
  97: - ch01 6개 장에서 장당 1–2 핵심 개념을 골라 앵커로 세운다(HTTP·웹서버/WAS·내장 Tomcat/자동설정·요청 흐름 등 — 기존 5개 D2 재활용).
  98: - 편집 검토 ④(하드 체크)를 통과시킨다.
  99: - 사용자 육안 확인 후 `status.md` 책 칸 재확정.
 100: 
 101: ## 6. 범위 밖 (별도 서브시스템)
 102: 
 103: - **기술 검증 에이전트**: 원고의 기술적 주장을 권위 있는 외부 근거와 대조해 참/거짓을 판정하는 독립 에이전트는 현재 하네스에 없다(가장 근접한 것은 book-build 편집검토 ①사실성=원고 대조, practice-code=코드 실행). 이는 본 스펙(책 표현 형식)과 독립된 서브시스템이므로 별도 브레인스토밍/스펙으로 다룬다.
 104: - **manuscript 스키마 변경**: 앵커 씨앗이 이미 원고에 있으므로 불필요. 본 스펙 범위 밖.
 105: 


 succeeded in 2436ms:
   1: ---
   2: name: book-build
   3: description: 확정 원고(`manuscripts/chNN.md`)의 비유(Easy analogy)·실무사례(Practical case)·나레이션·실습·평가문항을 씨앗으로 소설처럼 이야기 형태로 재집필해 차시별 PDF 책(`book/chNN.pdf`)을 만든다. 과정 완주 시 합본(`book/합본.pdf`)도 만든다. "책 만들어줘", "PDF 책", "챕터 집필" 요청 시 사용. 파이프라인 11단계 — 캐릭터 설정 → 소설체 재집필(이미지는 `assets/manifest.json`의 확정 경로를 참조) → humanizer 문체 교정 → 편집 검토 3종(사실성·개념 누락·과도한 소설화) → typst_builder(Typst/Pandoc)로 PDF 빌드. 시각자산(4단계)이 ✅ 또는 `deferred`여야 시작한다(하드 게이트).
   4: ---
   5: 
   6: # book-build
   7: 
   8: 확정 원고 `manuscripts/chNN.md`(`manuscript-final` 산출물, manuscript-schema 8필드)를 **소설처럼 이야기 형태로 재집필**해 차시별 PDF 책(`book/chNN.pdf`)을 만드는 스킬이다. 파이프라인 11단계(마지막 단계)이며, 원고를 그대로 렌더하지 않고 비유·실무사례·나레이션·실습·평가를 씨앗 삼아 새로 쓴다.
   9: 
  10: **전제**: `courses/{course-id}/status.md`의 해당 차시 `원고확정`이 ✅여야 한다. 아니면 사용자에게 알리고 중단한다. `manuscripts/chNN.md`가 존재해야 한다. **하드 게이트**: `시각자산`이 ✅도 `deferred`도 아니면(⬜/🔄/`partial`/`stale`) 사용자에게 알리고 중단한다 — 먼저 `visual-assets` 스킬로 완료(또는 명시적 보류)해야 한다.
  11: 
  12: **status.md 착수 갱신**: 집필을 시작하면 해당 차시 `책` 칸을 🔄로 바꾼다. PDF 산출·사용자 확인 후 ✅로,
  13: 보류 시 ➖ + 보류/누락 사유로 갱신한다.
  14: 

  44: 
  45: `book/chNN_원고.md` 작성 직후 **humanizer 스킬**을 호출해 AI 문체 24패턴(쉼표 과다, 어색한 띄어쓰기, AI 선호 어휘, 대명사·복수형 과다, 구조적 단조로움 등)을 교정한다. 교정 결과로 `book/chNN_원고.md`를 갱신한다.
  46: 
  47: ### 4. 편집 검토 패스 (필수, 3종)
  48: 
  49: humanizer 패스 이후 반드시 아래 3종 검토를 순서대로 수행하고, 발견 항목을 수정한 뒤 사용자 확인을 받는다. 셋 중 하나라도 건너뛰면 확정할 수 없다.
  50: 
  51: 1. **사실성 보존**: 챕터의 기술 서술(코드 동작, API 이름, 개념 정의 등)이 원고 `manuscripts/chNN.md`와 원고의 `Source` 필드가 가리키는 근거와 어긋나는 문장이 없는지 문장 단위로 점검한다. 어긋나는 문장이 있으면 목록화하고 수정한다.
  52: 2. **개념 누락 대조표**: 원고의 슬라이드별 핵심 개념·Practice(실습)·Assessment(평가문항)가 `chNN_원고.md`에 모두 반영됐는지 대조표(원고 슬라이드 번호 ↔ 책 챕터/문단 위치)를 만들어 확인한다. 누락이 있으면 해당 부분만 보강한다.
  53: 3. **과도한 소설화 방지**: 기술 설명 없이 이야기만 이어지는 구간(예: 대화·감정 묘사만 3문단 이상 연속)을 검출한다. 발견되면 그 구간에 기술 설명(정의·동작 원리·코드)을 끼워 넣어 이야기와 기술이 번갈아 나오도록 조정한다.
  54: 
  55: ### 5. PDF 빌드
  56: 

 108: 
 109: ### 6. 확정
 110: 
 111: 편집 검토 3종 통과 + PDF 렌더 정상을 사용자에게 보고하고 확인을 받은 뒤:
 112: 
 113: - `courses/{course-id}/status.md`의 해당 차시 `책` 칸을 ✅로 갱신한다.
 114: - 산출물 인덱스에 `- chNN 책: book/chNN.pdf (확정 YYYY-MM-DD)`를 추가한다(합본이면 별도로 `- 합본: book/합본.pdf (확정 YYYY-MM-DD)`).
 115: 
 116: ## 확정 체크리스트
 117: 
 118: - [ ] **편집 검토 3종 통과**: 사실성 보존 / 개념 누락 대조표 / 과도한 소설화 방지 — 세 검토 모두 수행하고 발견 항목을 수정했다.
 119: - [ ] **PDF 렌더 정상**: 빈 페이지, 고아 줄(단락 마지막 한 줄이 다음 페이지로 넘어가는 현상), 이미지 깨짐이 없다(PyMuPDF 텍스트 추출 또는 렌더 이미지 육안 확인).
 120: - [ ] **캐릭터 등장 규칙**: 2개 챕터 연속으로 캐릭터(팀장/동료/오픈이)가 하나도 등장하지 않는 구간이 없다.
 121: - [ ] **개념 완전성**: 원고의 핵심 개념·Practice·Assessment가 책에서 대조표로 확인됐다(누락 없음).
 122: 
 123: ## repair 규칙
 124: 
 125: 체크리스트 실패 시 챕터 전체를 다시 쓰지 않는다.
 126: 
 127: - 편집 검토 3종 중 하나라도 실패하면 **검토에서 지적된 문단만** 재집필한다(챕터 전체 재집필 금지).
 128: - 캐릭터 부재 구간이 발견되면 해당 챕터(또는 인접 챕터)에 짧은 대사 1개만 추가해 규칙을 충족시킨다.
 129: - 개념 누락이 발견되면 누락된 개념만 가장 관련 있는 기술 파트 문단에 추가한다.


web search: 
web search: Pandoc manual Typst writer Div class custom styles Lua filter RawBlock typst
web search: 
web search: site:pandoc.org/MANUAL.html typst RawBlock lua filter
web search: 
web search: https://pandoc.org/MANUAL.html
web search: 
web search: 'fenced_divs' in https://pandoc.org/MANUAL.html
web search: 
web search: https://pandoc.org/MANUAL.html
web search: 
web search: https://pandoc.org/MANUAL.html
web search: 
web search: Pandoc Typst property attributes pandoc.org typst property attributes
web search: 
web search: https://pandoc.org/MANUAL.html
web search: 
web search: 'Traversal order' in https://pandoc.org/lua-filters.html
web search: 
web search: https://pandoc.org/lua-filters.html
web search: 
web search: 'Extension: fenced_divs' in https://pandoc.org/MANUAL.html
web search: 
web search: 'Extension: raw_attribute' in https://pandoc.org/MANUAL.html
web search: 
web search: https://pandoc.org/chunkedhtml-demo/10.6-typst-property-attributes.html
web search: 
web search: https://pandoc.org/lua-filters.html
codex
Pandoc 공식 문서 기준으로는 fenced div가 native `Div` AST가 되고, Lua 필터는 명령행 순서대로 적용됩니다. 따라서 “두 번째 필터” 자체는 맞지만, 구현은 raw Typst를 통째 문자열화할지, 열기/닫기 RawBlock으로 감쌀지가 관건입니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "paragraph-gap|#let color|color-primary|callout-box|#let .*gap|#set" .claude/skills/book-build/references/templates .claude/skills/book-build -g "*.typ"' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "concept-anchor|paragraph-gap|book_base|#let concept|lua-filter|Div|RawBlock" docs/superpowers/plans/2026-07-07-book-concept-anchor.md docs/reviews -g "*.md"' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1706ms:
.claude/skills/book-build/references/templates\book_base.typ:16:#set page(
.claude/skills/book-build/references/templates\book_base.typ:48:#set text(
.claude/skills/book-build/references/templates\book_base.typ:55:#set par(
.claude/skills/book-build/references/templates\book_base.typ:156:#set table(
.claude/skills/book-build/references/templates\book_base.typ:197:// 페이지 본문(콘텐츠 영역) 높이 — 위 #set page 값(257mm, margin top 20mm/bottom 28mm)에서 파생.
.claude/skills/book-build/references/templates\book_base.typ:198:// #set page의 height/margin을 바꾸면 이 값도 함께 갱신해야 한다(이미지 max-height 계산의 기준).
.claude/skills/book-build/references/templates\book_base.typ:311:#let side-image(path, body, img-width: 0.35, gap: 16pt) = {
.claude/skills/book-build/references/templates\book_base.typ:334:      #line(length: 40%, stroke: 2pt + color-primary)
.claude/skills/book-build/references/templates\book_base.typ:336:      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
.claude/skills/book-build/references/templates\book_base.typ:338:      #line(length: 60%, stroke: 0.5pt + color-primary-light)
.claude/skills/book-build\references\templates\book_base.typ:16:#set page(
.claude/skills/book-build\references\templates\book_base.typ:48:#set text(
.claude/skills/book-build\references\templates\book_base.typ:55:#set par(
.claude/skills/book-build\references\templates\book_base.typ:156:#set table(
.claude/skills/book-build\references\templates\book_base.typ:197:// 페이지 본문(콘텐츠 영역) 높이 — 위 #set page 값(257mm, margin top 20mm/bottom 28mm)에서 파생.
.claude/skills/book-build\references\templates\book_base.typ:198:// #set page의 height/margin을 바꾸면 이 값도 함께 갱신해야 한다(이미지 max-height 계산의 기준).
.claude/skills/book-build\references\templates\book_base.typ:311:#let side-image(path, body, img-width: 0.35, gap: 16pt) = {
.claude/skills/book-build\references\templates\book_base.typ:334:      #line(length: 40%, stroke: 2pt + color-primary)
.claude/skills/book-build\references\templates\book_base.typ:336:      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
.claude/skills/book-build\references\templates\book_base.typ:338:      #line(length: 60%, stroke: 0.5pt + color-primary-light)

 succeeded in 1941ms:
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:7:**Architecture:** 책 원고 마크다운에 pandoc fenced div `::: concept-anchor … :::`로 앵커를 표기하고, 새 Lua 필터(`concept-anchor.lua`)가 이 div를 typst의 `#concept-anchor[…]` 호출로 변환하며, `book_base.typ`에 정의된 `#let concept-anchor` 함수가 구분선 블록으로 렌더한다. manuscript는 변경하지 않는다(앵커 씨앗인 `핵심 정의`·D2가 이미 원고에 존재). book-build SKILL.md·storytelling.md에 앵커 저작 규칙과 편집검토 하드 체크를 추가하고, ch01 책을 앵커 버전으로 재빌드해 검증한다.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:20:- **라이트 테마 고정**: 새 색상 도입 금지. `book_base.typ` 기존 accent `rgb("#2563eb")` 재사용(`style.md` 디자인 제약 준수).
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:22:- 스펙 출처: `docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md`.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:28:- `docs/proposals/2026-07-07_book-concept-anchor.md` — 재설계 제안서 (신규)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:29:- `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md` — codex 사전검증 결과 (신규)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:30:- `.claude/skills/book-build/references/scripts/concept-anchor.lua` — `Div.concept-anchor` → `#concept-anchor[…]` 변환 Lua 필터 (신규)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:31:- `.claude/skills/book-build/references/templates/book_base.typ` — `#let concept-anchor(body)` 블록 스타일 추가 (수정)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:32:- `.claude/skills/book-build/references/scripts/typst_builder.py` — pandoc 호출에 `concept-anchor.lua` 필터 추가 (수정, 401–408행)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:49:- Create: `docs/proposals/2026-07-07_book-concept-anchor.md`
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:56:아래 내용으로 `docs/proposals/2026-07-07_book-concept-anchor.md`를 생성한다:
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:67:- **렌더**: 책 원고에 pandoc fenced div `::: concept-anchor`로 표기 → 새 Lua 필터가 `#concept-anchor[…]` typst 호출로 변환 → book_base.typ의 `#let concept-anchor`가 구분선 블록으로 렌더.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:73:- `::: concept-anchor`가 없는 기존 책 원고는 새 Lua 필터에 무영향(매칭 0건) → 회귀 없음.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:74:- Lua 필터가 div 내용을 그대로 `#concept-anchor[…]`로 감싸므로 앵커 내부 마크다운(굵은 명·이미지·정의)은 정상 렌더.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:83:git add docs/proposals/2026-07-07_book-concept-anchor.md
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:92:- Create: `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md`
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:95:- Consumes: `docs/proposals/2026-07-07_book-concept-anchor.md`
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:103:codex exec --sandbox read-only 'docs/proposals/2026-07-07_book-concept-anchor.md 제안과 docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md 스펙을 검토하라. .claude/skills/book-build/references/scripts/typst_builder.py의 pandoc 호출(401~408행, --lua-filter paragraph-gap.lua)과 book_base.typ의 #show 스타일을 읽고, (1) Div.concept-anchor를 두 번째 Lua 필터로 #concept-anchor[…]로 감싸 typst로 변환하는 접근이 pandoc typst writer와 정합한지 (2) book_base.typ에 #let concept-anchor(body) 블록을 추가할 때 기존 #show 규칙과 충돌 여부 (3) 편집검토 하드 체크가 기존 3종과 정합한지 지적하라. 승인/조건부 승인/반려로 결론.' </dev/null
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:110:codex 출력 전문을 `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md`에 저장하고 맨 위에 한 줄 결론을 요약한다. 조건부 승인이면 조건을 Phase B~D 해당 Task에 반영한다.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:115:git add docs/reviews/2026-07-07_book-concept-anchor-codex-review.md
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:123:### Task 3: concept-anchor Lua 필터 + typst 함수 + pandoc 배선
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:126:- Create: `.claude/skills/book-build/references/scripts/concept-anchor.lua`
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:127:- Modify: `.claude/skills/book-build/references/templates/book_base.typ` (`#let concept-anchor` 추가)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:133:- Produces: 책 원고의 `::: concept-anchor … :::` fenced div가 PDF에서 위아래 구분선으로 감싼 블록(기술명 굵게 + D2 이미지 + 정의)으로 렌더된다. Lua 필터 함수명 `Div`, typst 함수 `#concept-anchor(body)`.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:149:LUA = SCRIPTS / "concept-anchor.lua"
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:150:BASE = TEMPLATES / "book_base.typ"
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:156:    "::: concept-anchor\n"
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:171:           "--wrap=none", "--lua-filter", str(LUA)]
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:175:    assert "#concept-anchor[" in typ          # 앵커 호출로 감쌈
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:188:           "--wrap=none", "--lua-filter", str(LUA)]
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:191:    assert "#concept-anchor[" not in out.read_text(encoding="utf-8")
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:194:def test_book_base_defines_concept_anchor():
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:195:    assert "#let concept-anchor(" in BASE.read_text(encoding="utf-8")
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:200:    # book_base.typ의 concept-anchor 함수를 import해 최소 문서로 컴파일
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:203:        f'#import "{BASE.as_posix()}": concept-anchor\n'
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:204:        '#concept-anchor[*HTTP* \\ 웹 통신 규칙.]\n',
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:216:Expected: `test_div_becomes_concept_anchor_call`, `test_book_base_defines_concept_anchor`, `test_concept_anchor_typst_compiles` 가 FAIL(필터·함수 없음). `test_non_anchor_div_untouched`는 필터 파일이 없어 pandoc이 `--lua-filter` 경로 오류로 FAIL.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:220:`.claude/skills/book-build/references/scripts/concept-anchor.lua`를 생성한다:
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:223:-- Div(class="concept-anchor") → typst #concept-anchor[ <div 내용> ] 로 감싼다.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:226:function Div(el)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:227:  if el.classes:includes("concept-anchor") then
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:228:    local blocks = { pandoc.RawBlock("typst", "#concept-anchor[") }
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:232:    table.insert(blocks, pandoc.RawBlock("typst", "]"))
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:240:`book_base.typ`에서 기존 `#show strong: set text(fill: rgb("#1e3a5f"))` 줄(약 170행) 바로 다음에 아래를 추가한다:
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:243:// ── 개념 앵커 (concept-anchor) ──
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:246:#let concept-anchor(body) = block(
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:263:`typst_builder.py`의 pandoc 변환 함수(약 398–408행)를 아래처럼 수정한다. `lua_filter` 정의 다음에 `anchor_filter`를 추가하고 cmd에 `--lua-filter`를 하나 더 넣는다:
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:266:    lua_filter = Path(__file__).parent / 'paragraph-gap.lua'
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:267:    anchor_filter = Path(__file__).parent / 'concept-anchor.lua'
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:275:        '--lua-filter', str(anchor_filter),
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:276:        '--lua-filter', str(lua_filter),
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:283:Expected: 4개 테스트 PASS. (`test_concept_anchor_typst_compiles`가 `book_base.typ` import 시 최상위 미정의 변수 오류로 실패하면, 그 원인 줄을 함수 정의 위로 옮기지 말고 — 대신 book_base.typ 최상위에서 미정의 변수를 직접 참조하는 곳이 없는지 확인한다. `#let`/`#show`/`state`만 있으면 import는 성공한다.)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:288:git add .claude/skills/book-build/references/scripts/concept-anchor.lua .claude/skills/book-build/references/templates/book_base.typ .claude/skills/book-build/references/scripts/typst_builder.py tests/test_concept_anchor_render.py
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:289:git commit -m "feat(book-build): 개념 앵커 렌더 — concept-anchor Lua 필터 + typst 블록 함수"
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:302:- Consumes: Task 3 렌더 규약(`::: concept-anchor` 마크다운, 3요소)
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:315:::: concept-anchor
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:371:**정의는 개념 앵커에 세운다(중요)**: 위 "정의"는 프로즈 문단에 녹이지 말고, 장당 1–2개의 **개념 앵커**(정식 기술명 + D2 도식 + 짧은 정의) 블록으로 세운다. 앵커는 book-build SKILL.md의 `::: concept-anchor` 규약을 따른다. 비유는 앵커 뒤 프로즈에서 계속 쓰되, 정식 정의를 다시 풀어 쓰지 않는다(앵커에만).
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:406:`courses/spring-boot-basic/book/ch01_원고.md`의 각 장에서 핵심 개념 1–2개를 골라(원고 `manuscripts/ch01.md`의 해당 슬라이드 `핵심 정의` 근거) 그 개념 도입부에 `::: concept-anchor` 블록을 삽입한다. 기존 5개 D2(HTTP·WAS·내장Tomcat·WebMVC·요청흐름)를 도식으로 재활용한다. 예(2장):
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:411:::: concept-anchor
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:431:Run: `grep -c "::: concept-anchor" courses/spring-boot-basic/book/ch01_원고.md`
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:467:**3. Type consistency:** 마크다운 마커 `::: concept-anchor`, typst 함수 `#concept-anchor(body)`/호출 `#concept-anchor[…]`, Lua 함수 `Div`가 Task 3(정의)·Task 4·5(문서)·Task 6(적용)에서 일치. D2 경로 계약 `assets/diagrams/{chNN}-slide{NN}-*.png` 일치. 필터 배선(2개 `--lua-filter`) Task 3 Step 5에 명시.
docs/superpowers/plans/2026-07-07-book-concept-anchor.md:469:> **실행 순서 주의**: Task 3(렌더 기구)이 없으면 Task 6의 `::: concept-anchor`가 그냥 텍스트로 렌더된다 — Phase B → Phase D 순서 필수.
docs/reviews\2026-07-05_typst-windows-dryrun.md:26:Microsoft 라이선스상 재배포 대상이 아니므로 저장소에 넣지 않았다 — `book_base.typ`의
docs/reviews\2026-07-05_typst-windows-dryrun.md:32:### 1. `book_base.typ` — 폰트 패밀리명 교체
docs/reviews\2026-07-05_typst-windows-dryrun.md:99:    "template": Path,       # 프로젝트 book.typ (book-title 등 변수 정의 + book_base.typ와 같은 디렉토리)
docs/reviews\2026-07-05_typst-windows-dryrun.md:116:  book.typ       # 프로젝트 템플릿 최소본 — book-title/color-primary 등 book_base.typ가 참조하는 변수 정의
docs/reviews\2026-07-05_typst-windows-dryrun.md:117:  book_base.typ  # references/templates/book_base.typ의 사본(프로젝트가 같은 디렉토리에 두는 실제 구조 재현)
docs/reviews\2026-07-05_typst-windows-dryrun.md:172:  (이미지 확장 테스트에서 4페이지째가 헤더만 있는 빈 페이지). 이는 `book_base.typ`/
docs/reviews\2026-07-05_typst-windows-dryrun.md:187:Windows에서 `typst_builder.py` + `book_base.typ` + 확보한 폰트로 한글 본문·코드
docs/reviews\2026-07-06_asset-embed-margin-codex-review.md:13:3. **책(Typst)**: 현재 book_base.typ는 max-width 중심, ratio<0.5면 원폭 유지 → 초세로가 새 페이지에서도 넘침. **max-height clamp + `fit: "contain"`**(캡션 높이 포함). 70% clamp는 과보수 — D2는 70~85% + "스케일 너무 작으면 재배치" 경고. **실제 PDF 드라이런으로 확인.**
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:377:.\docs\reviews\2026-07-05_typst-windows-dryrun.md:116:  book.typ       # 프로젝트 템플릿 최소본 — book-title/color-primary 등 book_base.typ가 참조하는 변수 정의
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:439:.\courses\spring-boot-basic\book\book_base.typ:334:      #line(length: 40%, stroke: 2pt + color-primary)
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:440:.\courses\spring-boot-basic\book\book_base.typ:336:      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:441:.\courses\spring-boot-basic\book\book_base.typ:338:      #line(length: 60%, stroke: 0.5pt + color-primary-light)
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:636:.claude\skills\book-build\references\scripts\paragraph-gap.lua
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:638:.claude\skills\book-build\references\templates\book_base.typ
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:710:.claude/skills\book-build\SKILL.md:16:- `references/templates/book_base.typ` — Typst 조판(46배판 188×257mm, 자동 목차/표지/헤더). 본문 폰트 `KoPubWorldBatang_Pro`(폴백 `Malgun Gothic`), 코드 폰트 `D2Coding`
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:714:.claude/skills\book-build\SKILL.md:85:- `merge_template_and_content()`가 `template_path.parent / "book_base.typ"`를 찾으므로, 프로젝트별 `book.typ`(book-title/color-primary 등 변수 정의)는 반드시 `references/templates/book_base.typ`의 사본과 **같은 디렉토리**(`book/` 또는 `book/_build/`)에 둔다. 처음 만드는 과정이면 `book_base.typ`를 그 디렉토리로 복사하고 `book.typ`에서 변수만 채운다.
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:715:.claude/skills\book-build\SKILL.md:86:- **`book.typ`가 반드시 정의해야 하는 변수(누락 시 Typst 컴파일 실패)**: `book-title`, `book-subtitle`, `book-description`, `book-header-title`, `book-authors`, `book-cover-image`(없으면 `""`), 표지 색상 `color-primary`/`color-primary-dark`/`color-primary-light`, 그리고 **`#let paragraph-gap = 6pt`**. `paragraph-gap`은 `book_base.typ`가 아니라 `paragraph-gap.lua` 필터가 생성 typst에 삽입하는 참조라 눈에 안 띄지만, 정의하지 않으면 `unknown variable: paragraph-gap`으로 빌드가 멈춘다. book.typ 최소 골격:
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:822:.claude/skills\book-build\references\templates\book_base.typ:114:  set text(size: 8pt, weight: "bold", font: ("D2Coding", "KoPubWorldBatang_Pro"))
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:823:.claude/skills\book-build\references\templates\book_base.typ:134:    text(size: 8.5pt, fill: rgb("#1e40af"), font: ("D2Coding", "KoPubWorldBatang_Pro"))[#it]
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:824:.claude/skills\book-build\references\templates\book_base.typ:248:  // 초세로형(종횡비가 낮은) D2/이미지일 가능성이 높다. 자동 축소는 오버플로 방지를 위해 그대로 유지하되,
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:825:.claude/skills\book-build\references\templates\book_base.typ:249:  // 이 경우 D2 재배치(가로 분할·2단 구성) 또는 전면 그림(별도 페이지 배치)을 검토할 것.
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:826:.claude/skills\book-build\references\templates\book_base.typ:302:    body + v(2pt) + align(center, text(7.5pt, fill: rgb("#b45309"), style: "italic")[⚠ 세로 비율이 커 축소됨 — D2 재배치/전면 그림 배치 검토 권장])
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:827:.claude/skills\book-build\references\templates\book_base.typ:334:      #line(length: 40%, stroke: 2pt + color-primary)
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:828:.claude/skills\book-build\references\templates\book_base.typ:336:      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
docs/reviews\2026-07-06_d2-to-gpt-image-default-codex-review.md:829:.claude/skills\book-build\references\templates\book_base.typ:338:      #line(length: 60%, stroke: 0.5pt + color-primary-light)
docs/reviews\2026-07-07_book-concept-anchor-codex-review.md:3:**결론: 조건부 승인** (codex gpt-5.5, xhigh, read-only). 핵심 접근(Div.concept-anchor → Lua 필터 → `#concept-anchor[…]` typst)은 정합. 3개 조건을 계획에 반영해야 함.
docs/reviews\2026-07-07_book-concept-anchor-codex-review.md:8:- Lua 필터가 내부 Markdown 문자열을 그대로 끼워 넣으면 안 된다. `Div`의 AST content를 `pandoc.write(pandoc.Pandoc(el.content), "typst")`로 Typst content로 직렬화한 뒤 `pandoc.RawBlock("typst", "#concept-anchor[\n" .. inner .. "\n]")`로 감싼다.
docs/reviews\2026-07-07_book-concept-anchor-codex-review.md:10:- 두 번째 필터(anchor)를 paragraph-gap **앞**에 두어 순서를 고정한다(anchor가 Div→RawBlock으로 낮춘 뒤 paragraph-gap이 그 RawBlock을 건드리지 않음).
docs/reviews\2026-07-07_book-concept-anchor-codex-review.md:14:- 앵커 내부 이미지가 alt/caption을 가지면 전역 `#show figure`(book_base.typ:176)가 적용되어 앵커 자체 여백과 중복된다. → **앵커 D2 이미지는 빈 alt**(`![](path)`)로 두어 `#auto-image`의 `alt==none` 분기(figure 없이 align(center))를 타게 한다.
docs/reviews\2026-07-07_book-concept-anchor-codex-review.md:15:- `design` 모드는 design_assembler 경로(typst_builder.py:674)가 `book_base.typ`만 읽지 않는다. → `#concept-anchor` 함수가 **모든 base 생성 경로**에 포함되도록 한다(design 경로 템플릿에도 함수 존재 확인/추가).

codex
참고로 이미 같은 이름의 리뷰 파일이 `docs/reviews/2026-07-07_book-concept-anchor-codex-review.md`에 존재합니다. 결론이 요청 쟁점과 겹치므로, 그대로 복붙하지 않고 현재 파일 상태와 대조해서 제 판단으로 정리하겠습니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'docs/reviews/2026-07-07_book-concept-anchor-codex-review.md'" in C:\Users\ssarm\Documents\course-haness
 succeeded in 2093ms:
# codex 사전검증 — 책 개념 앵커 (2026-07-07)

**결론: 조건부 승인** (codex gpt-5.5, xhigh, read-only). 핵심 접근(Div.concept-anchor → Lua 필터 → `#concept-anchor[…]` typst)은 정합. 3개 조건을 계획에 반영해야 함.

## 조건 (계획 반영 대상)

### 조건 1 — Lua 필터: AST→Typst 직렬화로 못박기
- Lua 필터가 내부 Markdown 문자열을 그대로 끼워 넣으면 안 된다. `Div`의 AST content를 `pandoc.write(pandoc.Pandoc(el.content), "typst")`로 Typst content로 직렬화한 뒤 `pandoc.RawBlock("typst", "#concept-anchor[\n" .. inner .. "\n]")`로 감싼다.
- pandoc 입력 포맷에 `+fenced_divs`를 명시한다.
- 두 번째 필터(anchor)를 paragraph-gap **앞**에 두어 순서를 고정한다(anchor가 Div→RawBlock으로 낮춘 뒤 paragraph-gap이 그 RawBlock을 건드리지 않음).
- 후처리 이미지 변환(typst_builder.py:498)은 감싼 내부 Typst 코드에 계속 적용 가능.

### 조건 2 — figure 여백 중복 + design 모드 경로
- 앵커 내부 이미지가 alt/caption을 가지면 전역 `#show figure`(book_base.typ:176)가 적용되어 앵커 자체 여백과 중복된다. → **앵커 D2 이미지는 빈 alt**(`![](path)`)로 두어 `#auto-image`의 `alt==none` 분기(figure 없이 align(center))를 타게 한다.
- `design` 모드는 design_assembler 경로(typst_builder.py:674)가 `book_base.typ`만 읽지 않는다. → `#concept-anchor` 함수가 **모든 base 생성 경로**에 포함되도록 한다(design 경로 템플릿에도 함수 존재 확인/추가).

### 조건 3 — 편집검토: 기존 3종 유지 + 신규 ④ 추가 (대체 금지)
- 스펙은 ③"과도한 소설화 방지"를 앵커 검증으로 **대체**한다고 썼으나, 대체하면 "이야기만 3문단 이상 연속" 감지가 사라진다. → **기존 ③ 유지**, `개념 앵커 검증`을 **명시적 ④로 추가**(3종 → 4종).
- ③의 "정의·동작 원리·코드 삽입" 문구는 "정의는 앵커에만, 프로즈에는 동작 원리/코드/예시"로 고쳐 새 하드 체크의 "정의 중복 용해 금지"와 충돌하지 않게 한다.
- 확정 체크리스트도 4종으로 갱신한다.

## 비고
- Pandoc이 codex 실행 환경에 없어 실제 변환 샘플은 실행하지 못함(정합성은 AST 수준 분석). 구현 Task의 pytest(pandoc 실변환)가 이를 실증한다.

codex
`book_base.typ`만 보면 함수 추가 자체는 충돌이 작습니다. 다만 `typst_builder.py`에는 디자인 조립 경로가 있어, 실제 빌드가 항상 그 파일만 쓰는지는 별도 확인이 필요합니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$p='"'.claude/skills/book-build/references/scripts/typst_builder.py'; "'$lines=Get-Content -LiteralPath $p; for($i=660;$i -le 730 -and $i -le $lines.Count;$i++){ '"'{0,4}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1087ms:
 660: def merge_template_and_content(template_path: Path, content: str,
 661:                                design: str | None = None,
 662:                                design_state: dict | None = None,
 663:                                skip_cover: bool = False,
 664:                                skip_toc: bool = False,
 665:                                pre_toc_content: str = "") -> str:
 666:     """템플릿 + Pandoc 변환 내용을 하나의 .typ 파일로 합침
 667: 
 668:     design이 지정되면 컴포넌트 어셈블러로 book_base를 조립.
 669:     없으면 기존 book_base.typ 파일을 사용 (하위호환).
 670:     pre_toc_content가 있으면 cover와 toc 사이에 삽입 (머릿말 등).
 671:     """
 672:     template = template_path.read_text(encoding="utf-8")
 673: 
 674:     if design is not None:
 675:         from design_assembler import parse_design_arg, load_preset_overrides, assemble_book_base
 676:         selection = parse_design_arg(design)
 677:         # 프리셋에 overrides가 있으면 design_state에 병합 (프리셋이 기본, 사용자가 우선)
 678:         preset_overrides = load_preset_overrides(design) if design.strip() in "123456789" else {}
 679:         if preset_overrides:
 680:             merged = dict(preset_overrides)
 681:             if design_state:
 682:                 for k, v in design_state.items():
 683:                     if isinstance(v, dict) and k in merged and isinstance(merged[k], dict):
 684:                         merged[k] = {**merged[k], **v}
 685:                     else:
 686:                         merged[k] = v
 687:             design_state = merged
 688:         base = assemble_book_base(selection, design_state=design_state,
 689:                                   skip_cover=skip_cover, skip_toc=skip_toc)
 690:     else:
 691:         base_path = template_path.parent / "book_base.typ"
 692:         if base_path.exists():
 693:             base = base_path.read_text(encoding="utf-8")
 694:         else:
 695:             base = ""
 696: 
 697:     # PRE_TOC 마커에 머릿말 등 삽입
 698:     if base and pre_toc_content:
 699:         if PRE_TOC_MARKER in base:
 700:             base = base.replace(PRE_TOC_MARKER, pre_toc_content)
 701:         elif "// 목차" in base or "#outline(" in base:
 702:             # 마커 없을 때 fallback: 목차 섹션 직전에 삽입
 703:             for marker in ["// ══════════════════════════════════════\n// 목차", "// 목차 (자동 생성)", "// 목차"]:
 704:                 if marker in base:
 705:                     base = base.replace(marker, pre_toc_content + "\n" + marker, 1)
 706:                     break
 707:     elif base and PRE_TOC_MARKER in base:
 708:         base = base.replace(PRE_TOC_MARKER, "")
 709: 
 710:     if base:
 711:         return template + "\n" + base + "\n" + CONTENT_MARKER + "\n" + content
 712:     return template + "\n" + CONTENT_MARKER + "\n" + content
 713: 
 714: 
 715: def extract_content_from_typ(typ_text: str) -> str | None:
 716:     """CONTENT_MARKER 이후 콘텐츠 추출. 마커 없으면 None 반환."""
 717:     if CONTENT_MARKER in typ_text:
 718:         _, content = typ_text.split(CONTENT_MARKER, 1)
 719:         return content.lstrip("\n")
 720:     return None
 721: 
 722: 
 723: # ══════════════════════════════════════
 724: # Typst 컴파일
 725: # ══════════════════════════════════════
 726: 
 727: def typst_compile_svg(typ_path: Path, svg_dir: Path,
 728:                       font_path: Path | None = None) -> int:
 729:     """Typst → 페이지별 SVG 컴파일. 생성된 페이지 수 반환."""
 730:     svg_dir.mkdir(parents=True, exist_ok=True)

exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "def assemble_book_base|book_base|#show strong|figure|auto-image|side-image|templates" .claude/skills/book-build/references/scripts .claude/skills/book-build/references/templates -g "*.py" -g "*.typ"' in C:\Users\ssarm\Documents\course-haness
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg --files .claude/skills/book-build/references | rg "design|component|base|typ$"' in C:\Users\ssarm\Documents\course-haness
 succeeded in 1232ms:
.claude/skills/book-build/references/templates\book_base.typ:170:#show strong: set text(fill: rgb("#1e3a5f"))
.claude/skills/book-build/references/templates\book_base.typ:175:// ── figure 스타일 ──
.claude/skills/book-build/references/templates\book_base.typ:176:#show figure: it => {
.claude/skills/book-build/references/templates\book_base.typ:213:#let auto-image(path, alt: none, max-width: 0.7, max-height-ratio: 0.8, style: "plain") = layout(size => context {
.claude/skills/book-build/references/templates\book_base.typ:296:    figure(styled-img, caption: [#alt])
.claude/skills/book-build/references/templates\book_base.typ:311:#let side-image(path, body, img-width: 0.35, gap: 16pt) = {
.claude/skills/book-build/references/scripts\typst_builder.py:460:    실제 크기는 Typst auto-image 함수가 페이지 공간에 맞게 자동 조절."""
.claude/skills/book-build/references/scripts\typst_builder.py:480:        return '0.6'     # 최대 60% (auto-image가 페이지에 맞춰 자동 축소)
.claude/skills/book-build/references/scripts\typst_builder.py:498:    # 1. 이미지 수정: !#link("path")[alt] → #auto-image (페이지 공간 자동 조절)
.claude/skills/book-build/references/scripts\typst_builder.py:507:                return f'#auto-image("{path}", alt: [{alt}], max-width: {width_var}, style: {style_var})'
.claude/skills/book-build/references/scripts\typst_builder.py:509:                return f'#auto-image("{path}", max-width: {width_var}, style: {style_var})'
.claude/skills/book-build/references/scripts\typst_builder.py:514:            return f'#auto-image("{path}", alt: [{alt}], max-width: {max_w}{style_param})'
.claude/skills/book-build/references/scripts\typst_builder.py:516:            return f'#auto-image("{path}", max-width: {max_w}{style_param})'
.claude/skills/book-build/references/scripts\typst_builder.py:520:    # 2. 이미지 수정: #box(image("path")) → #auto-image
.claude/skills/book-build/references/scripts\typst_builder.py:527:            return f'#auto-image("{path}", max-width: {width_var}, style: {style_var})'
.claude/skills/book-build/references/scripts\typst_builder.py:531:        return f'#auto-image("{path}", max-width: {max_w}{style_param})'
.claude/skills/book-build/references/scripts\typst_builder.py:535:    # 3. 이미지 수정: #figure(image("path"), caption: [...]) → #auto-image
.claude/skills/book-build/references/scripts\typst_builder.py:536:    def fix_figure_image(m):
.claude/skills/book-build/references/scripts\typst_builder.py:544:                return f'#auto-image("{path}", alt: [{alt}], max-width: {width_var}, style: {style_var})'
.claude/skills/book-build/references/scripts\typst_builder.py:546:                return f'#auto-image("{path}", max-width: {width_var}, style: {style_var})'
.claude/skills/book-build/references/scripts\typst_builder.py:551:            return f'#auto-image("{path}", alt: [{alt}], max-width: {max_w}{style_param})'
.claude/skills/book-build/references/scripts\typst_builder.py:553:            return f'#auto-image("{path}", max-width: {max_w}{style_param})'
.claude/skills/book-build/references/scripts\typst_builder.py:557:    # 매치가 깨지지 않는다. 안 그러면 캡션 달린 도형이 auto-image(여백·max-height clamp)를
.claude/skills/book-build/references/scripts\typst_builder.py:560:        r'#figure\(image\("([^"]+)"(?:,\s*alt:\s*"[^"]*")?\)\s*,\s*caption:\s*\[([^\]]*)\]\s*\)',
.claude/skills/book-build/references/scripts\typst_builder.py:561:        fix_figure_image, text
.claude/skills/book-build/references/scripts\typst_builder.py:564:    # 3.5 이미지 바로 뒤의 #emph[그림 N-M: ...] 캡션을 auto-image의 alt 파라미터로 병합
.claude/skills/book-build/references/scripts\typst_builder.py:567:        img_call = m.group(1)  # #auto-image("path", alt: [...], max-width: 0.6)
.claude/skills/book-build/references/scripts\typst_builder.py:578:        r'(#auto-image\([^)]*\))\s*\n?#emph\[((?:[^\]\\]|\\.)*)\]',
.claude/skills/book-build/references/scripts\typst_builder.py:583:    # 3.55 auto-image 뒤에 빈 줄 보장 (Typst가 figure와 다음 문단을 분리하도록)
.claude/skills/book-build/references/scripts\typst_builder.py:584:    text = re.sub(r'(#auto-image\([^)]*\))\n([^\n])', r'\1\n\n\2', text)
.claude/skills/book-build/references/scripts\typst_builder.py:668:    design이 지정되면 컴포넌트 어셈블러로 book_base를 조립.
.claude/skills/book-build/references/scripts\typst_builder.py:669:    없으면 기존 book_base.typ 파일을 사용 (하위호환).
.claude/skills/book-build/references/scripts\typst_builder.py:675:        from design_assembler import parse_design_arg, load_preset_overrides, assemble_book_base
.claude/skills/book-build/references/scripts\typst_builder.py:688:        base = assemble_book_base(selection, design_state=design_state,
.claude/skills/book-build/references/scripts\typst_builder.py:691:        base_path = template_path.parent / "book_base.typ"

 succeeded in 1777ms:
.claude/skills/book-build/references\templates\book_base.typ

exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg --files .claude | rg \"design_assembler\\.py"'$"' in C:\Users\ssarm\Documents\course-haness
2026-07-07T05:44:41.011451Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.5 seconds
Output:

 exited 1 in 1493ms:
codex
`design_assembler.py`는 현재 `.claude` 트리에서 바로 잡히지 않습니다. 그래서 “book_base.typ에 추가하면 모든 디자인 모드에 자동 반영된다”는 가정은 검증되지 않은 상태입니다.
exec
"C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg --files . | rg \"design_assembler\\.py"'$|assemble_book_base|parse_design_arg"' in C:\Users\ssarm\Documents\course-haness
2026-07-07T05:44:46.664186Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.3 seconds
Output:

 exited 1 in 1295ms:
codex
**결론: 조건부 승인**

1. `Div.concept-anchor → #concept-anchor[…]` 접근은 Pandoc Typst writer와 정합합니다. Pandoc은 여러 `--lua-filter`를 명령행 순서대로 적용하고, Lua 필터가 `Div` AST를 `RawBlock("typst", ...)`로 바꾸는 방식은 정상 경로입니다. 다만 [typst_builder.py](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/scripts/typst_builder.py:397)에 `+fenced_divs`를 명시하고, 필터는 원문 Markdown 문자열이 아니라 AST content를 감싸야 합니다. 즉 `Div` 내용을 그대로 문자열 삽입하면 반려, `RawBlock("#concept-anchor[") + el.content + RawBlock("]")` 또는 AST→Typst 직렬화면 승인 가능입니다.

2. [book_base.typ](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/templates/book_base.typ:62)의 기존 `#show heading/raw/quote/table/strong/figure/link`와 `#let concept-anchor(body)` 자체는 충돌하지 않습니다. 함수 블록 안의 `body`에도 기존 `#show strong` 등은 자연스럽게 적용됩니다. 조건은 앵커 내부 D2 이미지를 `![](path)`처럼 빈 alt로 두는 것입니다. alt/caption이 있으면 [figure show 규칙](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/templates/book_base.typ:176)과 `auto-image`의 figure 분기가 앵커 여백과 중복될 수 있습니다.

3. 편집검토 하드 체크는 현재 문구 그대로는 기존 3종과 불정합입니다. 스펙은 [“편집 검토 ④”](C:/Users/ssarm/Documents/course-haness/docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:67)라고 하면서도 ③ “과도한 소설화 방지”를 대체/강화한다고 씁니다. 기존 ③은 [이야기만 이어지는 구간 감지](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:53)라서 없애면 안 됩니다. `개념 앵커 검증`은 명시적 ④로 추가하고, 기존 ③의 “정의 삽입” 문구는 “정의는 앵커에만, 프로즈에는 동작 원리/코드/예시”로 고쳐야 합니다. 체크리스트도 [3종 통과](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:118)에서 4종 통과로 바꾸세요.

추가 조건: `design` 모드에서는 [assemble_book_base 경로](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/scripts/typst_builder.py:674)가 `book_base.typ`만 읽지 않을 수 있으므로, `#concept-anchor`가 모든 base 생성 경로에 들어가는지 확인이 필요합니다.

근거로 Pandoc 공식 문서의 [Lua filter 순서/AST 필터 동작](https://pandoc.org/lua-filters.html)과 [Typst writer의 Div 처리](https://pandoc.org/typst-property-output.html)를 대조했습니다.
tokens used
162,125
**결론: 조건부 승인**

1. `Div.concept-anchor → #concept-anchor[…]` 접근은 Pandoc Typst writer와 정합합니다. Pandoc은 여러 `--lua-filter`를 명령행 순서대로 적용하고, Lua 필터가 `Div` AST를 `RawBlock("typst", ...)`로 바꾸는 방식은 정상 경로입니다. 다만 [typst_builder.py](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/scripts/typst_builder.py:397)에 `+fenced_divs`를 명시하고, 필터는 원문 Markdown 문자열이 아니라 AST content를 감싸야 합니다. 즉 `Div` 내용을 그대로 문자열 삽입하면 반려, `RawBlock("#concept-anchor[") + el.content + RawBlock("]")` 또는 AST→Typst 직렬화면 승인 가능입니다.

2. [book_base.typ](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/templates/book_base.typ:62)의 기존 `#show heading/raw/quote/table/strong/figure/link`와 `#let concept-anchor(body)` 자체는 충돌하지 않습니다. 함수 블록 안의 `body`에도 기존 `#show strong` 등은 자연스럽게 적용됩니다. 조건은 앵커 내부 D2 이미지를 `![](path)`처럼 빈 alt로 두는 것입니다. alt/caption이 있으면 [figure show 규칙](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/templates/book_base.typ:176)과 `auto-image`의 figure 분기가 앵커 여백과 중복될 수 있습니다.

3. 편집검토 하드 체크는 현재 문구 그대로는 기존 3종과 불정합입니다. 스펙은 [“편집 검토 ④”](C:/Users/ssarm/Documents/course-haness/docs/superpowers/specs/2026-07-07-book-concept-anchor-design.md:67)라고 하면서도 ③ “과도한 소설화 방지”를 대체/강화한다고 씁니다. 기존 ③은 [이야기만 이어지는 구간 감지](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:53)라서 없애면 안 됩니다. `개념 앵커 검증`은 명시적 ④로 추가하고, 기존 ③의 “정의 삽입” 문구는 “정의는 앵커에만, 프로즈에는 동작 원리/코드/예시”로 고쳐야 합니다. 체크리스트도 [3종 통과](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/SKILL.md:118)에서 4종 통과로 바꾸세요.

추가 조건: `design` 모드에서는 [assemble_book_base 경로](C:/Users/ssarm/Documents/course-haness/.claude/skills/book-build/references/scripts/typst_builder.py:674)가 `book_base.typ`만 읽지 않을 수 있으므로, `#concept-anchor`가 모든 base 생성 경로에 들어가는지 확인이 필요합니다.

근거로 Pandoc 공식 문서의 [Lua filter 순서/AST 필터 동작](https://pandoc.org/lua-filters.html)과 [Typst writer의 Div 처리](https://pandoc.org/typst-property-output.html)를 대조했습니다.

```
