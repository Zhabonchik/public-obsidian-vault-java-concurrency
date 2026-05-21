#!/usr/bin/env bash
# PreToolUse hook: hard-block edits to vendored-upstream paths.
#
# This is a vendored fork of jackyzha0/quartz. Everything under quartz/,
# docs/, plus package.json / package-lock.json / tsconfig.json is upstream
# code we treat as read-only. Whitelist: quartz.config.ts, quartz.layout.ts,
# CLAUDE.md, and anything under .claude/.
#
# Hook reads JSON from stdin (Claude Code PreToolUse payload). Exit 2 with
# message on stderr = block. Exit 0 = allow.

set -uo pipefail

input="$(cat)"

# Pull the file path out of tool_input. Both Edit and Write use file_path.
file_path="$(printf '%s' "$input" | python3 -c '
import json, sys
try:
    d = json.loads(sys.stdin.read())
    ti = d.get("tool_input", {}) or {}
    # Edit/Write use file_path; MultiEdit also uses file_path at top level.
    print(ti.get("file_path", ""))
except Exception:
    print("")
')"

# No path => let it through; not our concern.
if [ -z "$file_path" ]; then
    exit 0
fi

# Repo root (resolve relative to this script).
repo_root="$(cd "$(dirname "$0")/../.." && pwd)"

# Normalize file_path to absolute, then strip repo_root prefix to get a
# repo-relative path. If the edit is outside the repo, allow it (not our
# scope).
case "$file_path" in
    /*) abs="$file_path" ;;
    *)  abs="$repo_root/$file_path" ;;
esac

case "$abs" in
    "$repo_root"/*)
        rel="${abs#$repo_root/}"
        ;;
    *)
        # Edit is outside this repo — not our scope.
        exit 0
        ;;
esac

# Whitelist: allowed paths in the vendored repo.
case "$rel" in
    quartz.config.ts|quartz.layout.ts|CLAUDE.md|.claude/*|.claude)
        exit 0
        ;;
esac

# Blocklist: explicitly vendored paths.
blocked=""
case "$rel" in
    quartz/*|quartz)
        blocked="quartz/"
        ;;
    docs/*|docs)
        blocked="docs/"
        ;;
    package.json|package-lock.json|tsconfig.json)
        blocked="$rel"
        ;;
esac

if [ -n "$blocked" ]; then
    cat >&2 <<EOF
Blocked: edit to '$rel' is in the vendored-upstream surface ($blocked).

This repo is a vendored fork of jackyzha0/quartz tracking upstream v4. Files
under quartz/, docs/, and the package/tsconfig manifests are upstream code.
Editing them creates migration debt at the next 'git pull upstream v4'.

If you need to change rendering behavior, the right place is almost always:
  - quartz.config.ts   (plugin pipeline, site config)
  - quartz.layout.ts   (component composition)

If neither of those will do it, that's a signal to upstream the change or
fork explicitly — not to patch the vendored tree in place. See CLAUDE.md.
EOF
    exit 2
fi

exit 0
