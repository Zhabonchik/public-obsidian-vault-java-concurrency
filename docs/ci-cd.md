# CI/CD Pipeline Configuration

This document describes how to configure CI/CD pipelines for Quartz projects using the Git-based plugin system.

## Overview

Quartz uses a Git-based plugin system with a lockfile (`quartz.lock.json`) to track exact plugin versions. When building in CI/CD environments, you need to:

1. Install npm dependencies (including `@quartz-community/types` devDependency)
2. Install Git-based plugins from the lockfile
3. Build the Quartz site

## Required Steps

### 1. Install npm dependencies

```bash
npm ci
```

This installs all dependencies including `@quartz-community/types` which is required for TypeScript compilation of the plugins.

### 2. Install Git-based plugins

```bash
npx quartz plugin restore
```

This reads `quartz.lock.json` and clones the exact plugin versions specified.

### 3. Build the site

```bash
npx quartz build
```

## Example CI/CD Configurations

### GitHub Actions

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Quartz plugins
        run: npx quartz plugin restore

      - name: Build Quartz
        run: npx quartz build

      - name: Deploy
        # Add your deployment step here
```

### GitLab CI

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:22
  cache:
    paths:
      - node_modules/
      - .quartz/plugins/
  script:
    - npm ci
    - npx quartz plugin restore
    - npx quartz build
  artifacts:
    paths:
      - public/
```

### Netlify

For Netlify, use a custom build command:

```bash
npm ci && npx quartz plugin restore && npx quartz build
```

Add this to your `netlify.toml`:

```toml
[build]
  command = "npm ci && npx quartz plugin restore && npx quartz build"
  publish = "public"

[build.environment]
  NODE_VERSION = "22"
```

### Vercel

For Vercel, configure the build settings:

- **Build Command:** `npm ci && npx quartz plugin restore && npx quartz build`
- **Output Directory:** `public`
- **Node.js Version:** `22.x`

### Docker

The included `Dockerfile` already handles plugin installation:

```dockerfile
FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json* .
RUN npm ci

# Install plugins from lockfile
COPY quartz.lock.json .
RUN npx quartz plugin restore

FROM node:22-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .
CMD ["npx", "quartz", "build", "--serve"]
```

## Important Notes

### Lockfile Must Be Committed

Ensure `quartz.lock.json` is committed to your repository:

```bash
git add quartz.lock.json
git commit -m "Add plugin lockfile"
```

### Cache Considerations

For faster builds, cache both `node_modules` and `.quartz/plugins/`:

**GitHub Actions:**

```yaml
- name: Cache plugins
  uses: actions/cache@v4
  with:
    path: .quartz/plugins
    key: ${{ runner.os }}-plugins-${{ hashFiles('quartz.lock.json') }}
```

**GitLab CI:**

```yaml
cache:
  paths:
    - node_modules/
    - .quartz/plugins/
  key: ${CI_COMMIT_REF_SLUG}
```

### Plugin Updates in CI

To update plugins automatically in CI:

```yaml
- name: Update plugins
  run: npx quartz plugin update

- name: Commit updated lockfile
  run: |
    git config user.name "CI Bot"
    git config user.email "ci@example.com"
    git add quartz.lock.json
    git diff --quiet && git diff --staged --quiet || git commit -m "Update plugins"
    git push
```

## Troubleshooting

### "Cannot find module '@quartz-community/types'"

Ensure `npm ci` runs before `npx quartz plugin install`. The types package must be installed as a devDependency.

### "No quartz.lock.json found"

Run `npx quartz plugin add <repo>` locally first to create the lockfile, then commit it.

### "Plugin directory exists, skipping"

This is expected when caching `.quartz/plugins/`. The installer will skip existing plugins that match the lockfile.

### Slow builds

Enable caching for both `node_modules` and `.quartz/plugins/`. The plugin installation requires cloning Git repositories which can be slow.

## Summary

The key change from traditional npm-based plugin systems:

| Step            | Traditional          | Git-based                   |
| --------------- | -------------------- | --------------------------- |
| Install deps    | `npm ci`             | `npm ci`                    |
| Install plugins | (included in npm ci) | `npx quartz plugin restore` |
| Build           | `npx quartz build`   | `npx quartz build`          |

**Always run `npx quartz plugin restore` after `npm ci` and before `npx quartz build`.**
