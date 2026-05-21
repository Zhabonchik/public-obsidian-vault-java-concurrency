#!/usr/bin/env bash
# PreToolUse hook: block edits that introduce stale workspace paths.
#
# 'Pacioli' was renamed to 'bookkeeping' workspace-wide. The bare paths
# C:\Projects\Pacioli and /mnt/c/Projects/Pacioli should not appear in new
# code. This is cross-cutting workspace consistency — any project that
# accumulates one of these stale references is one more place the next
# rename has to chase.

set -uo pipefail

input="$(cat)"

read -r file_path new_text <<EOF
$(printf '%s' "$input" | python3 -c '
import json, sys
try:
    d = json.loads(sys.stdin.read())
    ti = d.get("tool_input", {}) or {}
    fp = ti.get("file_path", "") or ""
    # Edit uses new_string; Write uses content; MultiEdit has edits[].new_string.
    parts = []
    if "new_string" in ti:
        parts.append(str(ti["new_string"]))
    if "content" in ti:
        parts.append(str(ti["content"]))
    for e in ti.get("edits", []) or []:
        if isinstance(e, dict) and "new_string" in e:
            parts.append(str(e["new_string"]))
    blob = "\n".join(parts).replace("\n", " ")
    # Print on one line for read.
    print(fp, blob)
except Exception:
    print("", "")
')
EOF

if [ -z "$new_text" ]; then
    exit 0
fi

# Match either flavour of the legacy Pacioli path.
if printf '%s' "$new_text" | grep -qE '(C:\\Projects\\Pacioli|/mnt/c/Projects/Pacioli)'; then
    cat >&2 <<EOF
Blocked: edit to '$file_path' introduces a stale workspace path.

The 'Pacioli' tree was renamed to 'bookkeeping' workspace-wide. New code
should reference:
  C:\\Projects\\bookkeeping
  /mnt/c/Projects/bookkeeping

If you have a genuine reason to reference the legacy path (e.g. archived
state file, migration script that runs against the old name), surface it
explicitly and adjust this hook.
EOF
    exit 2
fi

exit 0
