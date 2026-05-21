#!/usr/bin/env bash
# PostToolUse hook: run prettier --check on edited .ts/.tsx/.scss files.
#
# We do NOT auto-format. Auto-format would silently re-flow vendored files
# the session shouldn't be touching. We just surface the failure so the
# editor sees it and can fix or revert.
#
# Surfaces via stderr + exit 2 (which Claude Code shows as a warning to
# the model without blocking the tool call — the tool call already
# happened, this is PostToolUse).

set -uo pipefail

input="$(cat)"

file_path="$(printf '%s' "$input" | python3 -c '
import json, sys
try:
    d = json.loads(sys.stdin.read())
    ti = d.get("tool_input", {}) or {}
    print(ti.get("file_path", ""))
except Exception:
    print("")
')"

if [ -z "$file_path" ]; then
    exit 0
fi

# Only check the three extensions we care about.
case "$file_path" in
    *.ts|*.tsx|*.scss) ;;
    *) exit 0 ;;
esac

# File must exist (Edit/Write should have created/updated it; defend
# against a race where the path is somehow gone).
if [ ! -f "$file_path" ]; then
    exit 0
fi

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"

# Skip if prettier is not available — don't make absence a hard failure.
if ! ( cd "$repo_root" && command -v npx >/dev/null 2>&1 ); then
    exit 0
fi

# Run prettier --check. We're permissive: any non-zero from prettier
# becomes an advisory warning on stderr, but we don't block further
# tool calls — the model can address it on its next turn.
output="$( cd "$repo_root" && npx --no-install prettier --check "$file_path" 2>&1 )"
status=$?

if [ "$status" -ne 0 ]; then
    cat >&2 <<EOF
prettier --check failed for $file_path:

$output

NOTE: This hook intentionally does NOT auto-format. If the file is one
we own (quartz.config.ts, quartz.layout.ts), run 'npx prettier --write'
yourself. If the file is in the vendored tree, the block-vendored-edits
hook should have caught it first.
EOF
    # Exit 2 surfaces to the model as a warning; PostToolUse exit 2
    # behavior is non-blocking but visible.
    exit 2
fi

exit 0
