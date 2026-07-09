#!/usr/bin/env bash
# 각 스크립트가 필수 인자 없이 실행될 때 명시적 에러 메시지를 stderr에 쓰고
# exit 1로 종료하는지 확인한다.
#
# exit code만 검사하면 안 된다. Node는 처리되지 않은 예외나 모듈 로드 실패에서도
# exit 1로 죽으므로, 인자 검증이 아예 없는 스크립트도 통과해 버린다.
# 그래서 stderr가 우리가 의도한 에러 메시지와 일치하는지 함께 본다.
#
# 사용법: bash .claude/skills/lecture-storyboard-preview/scripts/test_required_args.sh
set -u
cd "$(git rev-parse --show-toplevel)"

SB=.claude/skills/lecture-storyboard-preview/scripts
SR=.claude/skills/lecture-submission-review-ppt/scripts
fail=0

# check <label> <stderr에서 찾을 정규식> <실행할 명령...>
check() {
  local label="$1" expect_re="$2"; shift 2
  local err code
  err=$("$@" 2>&1 >/dev/null); code=$?
  if [ "$code" -eq 1 ] && printf '%s' "$err" | grep -qE "$expect_re"; then
    echo "PASS  $label"
  else
    echo "FAIL  $label (exit $code, stderr does not match /$expect_re/)"
    printf '%s\n' "$err" | head -3 | sed 's/^/        /'
    fail=1
  fi
}

check "generate_ppt_preview requires --chapterDir" \
  '^Error: --chapterDir is required\.' \
  node "$SB/generate_ppt_preview.mjs"

check "audit_ppt_preview_layout requires target" \
  '^Error: preview path or URL is required' \
  node "$SB/audit_ppt_preview_layout.mjs"

check "render_ppt_preview_slides requires --input" \
  '^Error: --input is required\.' \
  node "$SB/render_ppt_preview_slides.mjs"

check "smoke_storyboard_editor requires target" \
  '^Error: storyboard path or URL is required' \
  node "$SB/smoke_storyboard_editor.mjs"

check "generate_koreatech_submission_pptx requires --chapterDir" \
  '^Error: --chapterDir is required\.' \
  node "$SR/generate_koreatech_submission_pptx.mjs"

exit "$fail"
