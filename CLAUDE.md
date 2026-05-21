# FarmWiki-Quartz

## What this repo is

A **vendored fork of [`jackyzha0/quartz`](https://github.com/jackyzha0/quartz)** tracking upstream branch `v4`. We host Davies Farms' internal wiki on it. Local divergence is intentionally minimal — only `quartz.config.ts` (page title, baseUrl, plugin tweaks) and occasionally `quartz.layout.ts`.

## What this repo is NOT

- **Not the content.** The actual wiki markdown lives in the sibling repo `/mnt/c/Projects/FarmWiki/wiki/`. Nothing in `content/` here is shipped.
- **Not where builds are kicked.** Don't run `npm run build` / `npx quartz build` by hand. Builds are driven by `/mnt/c/Projects/FarmWiki/scripts/build_if_changed.sh`, which is invoked by the `Quartz_FarmWiki_Service` Windows scheduled task.

## Files you may edit

Only these:

- `quartz.config.ts` — site config (page title, baseUrl, plugins)
- `quartz.layout.ts` — layout (left/right components, footer)
- `CLAUDE.md` — this file
- `.claude/**` — Claude Code hooks + settings

## Files you must NOT edit

Everything under `quartz/`, `docs/`, plus `package.json`, `package-lock.json`, `tsconfig.json`. These are upstream-vendored. Edits there create migration debt at the next `git pull upstream v4`. A PreToolUse hook hard-blocks writes to these paths.

If rendering behavior needs to change, the right place is almost always `quartz.config.ts` (plugin pipeline) or `quartz.layout.ts` (component composition). If neither will do it, that's a signal to upstream the change or fork explicitly — not to patch `quartz/` in place.

## Production runner

- **Scheduled task:** `Quartz_FarmWiki_Service` (Windows Task Scheduler on OptiPlex 7020)
- **Build wrapper:** `/mnt/c/Projects/FarmWiki/scripts/build_if_changed.sh` (in the sibling FarmWiki repo, not here)
- **Build log:** `logs/build_YYYYMMDD.log` (in this repo)
- **Served on:** `optiplex7020.taileb7d5b.ts.net:8600` (tailnet-only)

## Known drift surface

When upstream markdown parsing changes (or content introduces a syntax Quartz's parser chokes on), the build can fail **silently** — the last good `public/` keeps serving and the failure only shows up in `logs/build_YYYYMMDD.log`. Spot-check the most recent log if a wiki update doesn't appear to have landed.

## Upstream sync

```bash
git remote add upstream https://github.com/jackyzha0/quartz.git  # if not present
git fetch upstream
git merge upstream/v4
```

Resolve `quartz.config.ts` / `quartz.layout.ts` conflicts intentionally — those are the only files we customize. Anything else conflicting probably means someone edited a vendored file (which the hook should have blocked).
