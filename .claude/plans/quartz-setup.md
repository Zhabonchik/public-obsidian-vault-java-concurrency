# Plan: Quartz Setup & GitHub Pages Deploy

This repo (`riccjohn/apennine-sector-notes`) is a fork of Quartz v4 with Traveller RPG vault notes already copied into `content/`. The following steps finish the deployment setup.

## Remaining tasks

### 1. Install dependencies
```bash
npm install
# Requires Node >=22. If needed: asdf local nodejs 22.14.0
```

### 2. Configure `quartz.config.ts`
Edit these fields:
- `pageTitle` — e.g. `"Traveller Campaign"`
- `baseUrl` — `"riccjohn.github.io/apennine-sector-notes"`
- `ignorePatterns` — add: `["_templates", ".obsidian", "CLAUDE.md", ".claude", "_assets"]`

### 3. Verify `.github/workflows/deploy.yml`
The Quartz fork default branch is `v4`. Confirm the workflow triggers on `v4`. It should already be correct — just verify.

### 4. Enable GitHub Pages
Repo Settings → Pages → Source → **GitHub Actions**

### 5. Add upstream remote (if not already done)
```bash
git remote add upstream https://github.com/jackyzha0/quartz.git
```

### 6. Commit and push
```bash
git add .
git commit -m "Configure Quartz for Traveller campaign site"
git push origin v4
```
First deploy takes ~2 minutes. Site will be live at `https://riccjohn.github.io/apennine-sector-notes/`.

### 7. Reopen Obsidian
Point Obsidian at `content/` as the vault root going forward.

## Updating Quartz later
```bash
git pull upstream v4 --no-rebase
git push origin v4
```
