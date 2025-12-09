# Plastic Labs Blog

This is the Plastic Labs blog, built with Quartz v4 - a static site generator for publishing digital gardens and notes.

## Project Overview

- **Framework**: Quartz v4 (built on top of Markdown processing with unified/remark/rehype)
- **Content Location**: `content/` directory
  - `blog/` - Blog posts
  - `research/` - Research content
  - `extrusions/` - Extrusions content
  - `notes/` - Notes
  - `careers/` - Career-related content
  - `releases/` - Release announcements
- **Static Assets**: `static/` directory (copied to public root during build)
- **Configuration**: `quartz.config.ts`

## Prerequisites

- Node.js >= 18.14
- npm >= 9.3.1

## Common Commands

### Setup
```bash
# Install dependencies
npm install
```

### Development
```bash
# Build and serve the site locally
npx quartz build --serve

# Build and serve docs specifically
npm run docs
```

### Code Quality
```bash
# Type check
npm run check

# Format code
npm run format

# Run tests
npm run test
```

### Git Workflow
```bash
# Check current branch
git branch

# Create new branch
git checkout -b your-branch-name

# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "your message"

# Push to remote
git push origin your-branch-name

# Pull latest changes
git pull origin branch-name

# Pull with rebase (recommended when you have local commits)
git pull --rebase origin branch-name
```

## Configuration

The site is configured via `quartz.config.ts`:
- **Site Title**: 🥽 Plastic Labs
- **Base URL**: blog.plasticlabs.ai
- **Theme**: Custom dark/light mode with Departure Mono headers and Roboto Mono body
- **Analytics**: PostHog
- **Ignored Patterns**: `private/`, `templates/`

## Custom Features

- Custom static file copying plugin (CopyStatic)
- OpenGraph images with default `/og-image.png`
- RSS feed and sitemap generation
- SPA navigation enabled
- Popovers enabled

## Deployment

The site uses Docker for deployment (see `Dockerfile`).

## Branch Structure

- `v4` - Main production branch
- Feature branches follow pattern: `username/feature-name`

## Troubleshooting

### Push Rejected
If you get "rejected - fetch first" errors:
1. Pull with rebase to preserve your local commits: `git pull --rebase origin branch-name`
2. Then push: `git push origin branch-name`

### Dependencies Not Found
Run `npm install` to ensure all dependencies are installed.

## Resources

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Discord Community](https://discord.gg/cRFFHYye7t)
