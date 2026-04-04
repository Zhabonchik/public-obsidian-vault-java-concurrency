# Research: Obsidian Vault → GitHub Pages Deployment

**Date:** 2026-04-03
**Goal:** Deploy Traveller RPG vault to GitHub Pages on merge to main; wikilinks must work; interactive graph view is post-MVP bonus.

---

## Vault Snapshot

- **~30 notes** across 8 folders + `_templates/` (11 templates)
- **No complex plugins**: no Dataview, no callouts (`> [!NOTE]`), no `![[embed]]` — pure markdown + YAML frontmatter
- **Wikilinks only**: all internal references use `[[Note Name]]` or `[[Note Name|alias]]`
- **Folder structure**: numerically prefixed (`01 Sessions/`, `02 Characters/`, etc.) with subfolders for Planets/ and Nazca/
- **YAML frontmatter schema**: `tags`, `status`, `date`, `affiliation`, `uwp`, `system`, `disposition`, `first-seen` etc. — varies by note type
- **NOT a git repo**: vault syncs via iCloud/Obsidian Sync only
- **No `.github/` directory** exists yet

---

## Tool Comparison

| Criterion | Quartz v4 | Jekyll + wikirefs | MkDocs Material |
|-----------|-----------|-------------------|-----------------|
| Wikilink fidelity | Native (built-in plugin) | Good but pre-stable plugin | Good via third-party plugin |
| Frontmatter | Native (tags, aliases, title) | Jekyll native | tags + title via Material theme |
| Graph view | Built-in D3 interactive | None | None |
| GitHub Actions | First-class, documented | Required, manual | Documented template exists |
| Setup effort | Medium | High | Medium |
| Last release | Aug 2024 (commits ongoing) | No releases (pre-stable) | Nov 2025 (wikilinks plugin) |
| Obsidian-native | Yes | Partial | No |

**Confidence:** High for Quartz (used extensively, well-documented). Medium for Jekyll wikirefs (pre-stable, fragile). Medium for MkDocs (third-party wikilink plugins).

---

## Recommendation: Quartz v4

**Why:** The only option satisfying all three requirements simultaneously — working wikilinks (native, not plugin-dependent), documented GitHub Actions deploy, and interactive graph view already built in by default.

### How Quartz handles this vault's specific content

- `[[Note Name]]` → resolves by filename, converted to correct relative URL ✓
- `[[Note Name|alias]]` → supported natively ✓
- YAML frontmatter `tags` → rendered as tag pills, used for filtering ✓
- Custom frontmatter fields (`uwp`, `status`, `disposition`) → passed through silently, no breakage ✓
- `{{date}}` in `_templates/` → these are Obsidian template files, should be excluded from build ✓
- Numbered folder URLs → `/01-Sessions/Session-1` etc. — functional, slightly ugly ✓
- **Limitation:** Frontmatter property links like `ship: "[[Luna Moth]]"` do NOT appear in the graph (Issue #820). Only in-body wikilinks are tracked. Low impact for this vault.

---

## Architecture Decision: Vault as Git Repo

Since the vault is NOT currently a git repo, the cleanest approach is:

**Option A — Initialize git in vault root** (recommended)
- `git init` in the Traveller vault directory
- Quartz lives in the repo root alongside vault content
- Vault content goes in `content/` (Quartz requirement)
- Either symlink or restructure so vault notes live in `content/`
- `.gitignore` excludes `.obsidian/`, iCloud artifacts
- Push to GitHub → Actions deploys to GitHub Pages

**Option B — Separate Quartz repo with sync step**
- Quartz repo separate from vault
- GitHub Actions copies vault content from another source
- More complex, harder to maintain; avoid unless privacy separation is needed

**Option A is simpler.** The vault syncs via iCloud for Obsidian use; git is layered on top for deployment. They coexist fine — iCloud syncs all files, git tracks changes for deploy.

### Content directory strategy

Quartz requires notes to live in `content/`. Two sub-options:

- **A1 (move):** Move all vault notes into `content/` subfolder. Obsidian must be reconfigured to use `content/` as vault root — disrupts current setup.
- **A2 (symlink in Actions):** Keep vault notes at root; GitHub Actions copies them into `content/` at build time. Local dev uses `quartz sync` pointed at root. Cleaner separation.
- **A3 (flat repo):** Use Quartz's `content` as the vault root directly — the simplest, requires Obsidian to open the `content/` folder as its vault.

**A3 is likely cleanest:** open `content/` as the Obsidian vault, keep Quartz config files at root level alongside it. Obsidian doesn't care about files outside its vault folder.

---

## GitHub Actions Workflow (Quartz standard)

```yaml
name: Deploy Quartz to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx quartz build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

GitHub repo Settings → Pages → Source must be set to **"GitHub Actions"**.

---

## Files to Exclude from Quartz Build

The `_templates/` folder and `.obsidian/` config should not be published. Quartz has a `draft: true` frontmatter flag and supports `ignorePatterns` in `quartz.config.ts`:

```ts
ignorePatterns: ["_templates", ".obsidian", "CLAUDE.md", ".claude"],
```

---

## Key Setup Steps (MVP)

1. Initialize git in vault root (or in a new GitHub repo)
2. Clone Quartz into the repo (or add as base)
3. Move/symlink vault notes into `content/`
4. Configure `quartz.config.ts`: set `baseUrl`, `pageTitle`, add `ignorePatterns`
5. Add `.github/workflows/deploy.yml`
6. Create GitHub repo, configure Pages source to "GitHub Actions"
7. Push → verify deploy

---

## Open Questions

1. **Vault restructure**: Does the user want to reconfigure Obsidian to use `content/` as the vault root (simplest long-term), or keep current structure and copy files in CI?
2. **Privacy**: Are all notes public? Or should some folders (e.g., `01 Sessions/` or `02 Characters/`) be excluded from the published site?
3. **Custom domain**: Will this live at `username.github.io/repo-name` or a custom domain?
4. **GitHub repo name**: Does one already exist, or needs to be created?

---

## Sources

- [Quartz v4 docs](https://quartz.jzhao.xyz/)
- [Quartz GitHub Actions hosting guide](https://quartz.jzhao.xyz/hosting)
- [Quartz authoring / Obsidian compatibility](https://quartz.jzhao.xyz/authoring-content)
- [jackyzha0/quartz on GitHub](https://github.com/jackyzha0/quartz) — 11.7k stars, active
- [Issue #820: frontmatter links not in graph](https://github.com/jackyzha0/quartz/issues/820)
