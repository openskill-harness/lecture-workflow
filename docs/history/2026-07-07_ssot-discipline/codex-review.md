# codex 사전검증 — 하네스 SSOT 규율 + 이력 일원화

**결론: 조건부승인 → 조건 3건 모두 계획에 반영 완료 (진행 가능).**

- 도구: `codex exec --sandbox read-only` (Git Bash, stdin 닫음)
- 대상: `proposal.md`, `plan.md`
- tokens used: 221,072

## 지적 사항과 반영

### F1. 참조 갱신 범위가 실제보다 좁음 (누락 참조)
codex가 `rg --hidden --no-ignore`로 찾은, Task 3 표에 없던 활성 참조:
- `.claude/skills/ppt-preview/SKILL.md:74`
- `.claude/skills/storyboard/SKILL.md:59`
- `.claude/skills/book-build/references/templates/book_base.typ:211-212`
- `.claude/skills/pub-d2-diagram/scripts/render_md_diagrams.py:6`
- (산출물) `courses/spring-boot-basic/{storyboards,ppt_previews,panseo,book}/*`, `book/_build/ch01.typ`

직접 검증(`sed`)으로 앞 4개는 실제 "근거: docs/proposals·reviews" 인용임을 확인. `_build/ch01.typ`는 `git check-ignore` 결과 **git-ignore(빌드 산출물)**.

**반영:** Task 3 Files·교체표에 4개 권위 파일 추가(`replace_all` 지시). 산출물(`courses/**`)·`_build`는 재생성 대상이라 갱신 제외로 명시(Global Constraints "산출물 제외"). 교체표 `replace_all: true`로 같은 경로 다중 라인(visual-assets :10·:12) 처리.

### F2. CHANGELOG 위치 충돌
Architecture/Global Constraints는 `docs/CHANGELOG.md`, File Structure/Task 2/proposal은 `docs/history/CHANGELOG.md`로 불일치. R3("이력은 docs/history에만")에 따라 후자로 통일해야 함.

**반영:** 계획 전체에서 `docs/CHANGELOG.md` → `docs/history/CHANGELOG.md`로 통일(replace_all).

### F3. append-only 이력 vs dead-link 0 검증 충돌
이전된 plans/reviews/proposals 내부엔 옛 경로가 스냅샷으로 남는데, 감사 grep이 `docs` 전체를 훑으면 history 내부 old path 때문에 영구 실패. 정책을 명시해야 함.

**반영:** "이력은 스냅샷(불변) — 내부 옛 경로 rewrite 안 함" + "dead-link 감사 범위 = 권위 파일만(`.claude/skills`+`docs/superpowers/specs`+`CLAUDE.md`), `docs/history`·`.superpowers/sdd`·`courses/**`·`_build` 제외" 를 Global Constraints에 추가. Task 6 harness-maintain 스킬의 dead-link grep과 Task 7 검증 범위를 여기에 맞춰 수정.

## 잔여
- `.superpowers/sdd/*`(226매치)는 빌드 이력이라 범위 밖 — 감사에서 명시적 제외로 처리됨(위 F3 정책 포함).
