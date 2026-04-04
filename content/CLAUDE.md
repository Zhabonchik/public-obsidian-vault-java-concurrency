# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an Obsidian vault for a **Cepheus Deluxe** tabletop RPG campaign (a Traveller-compatible system). The user is a **player** (not GM). Content is Markdown notes organized for use in Obsidian.

## Vault Structure

```
01 Sessions/       — one note per session (narrative, attendees, loot)
02 Characters/     — player characters in the party
03 NPCs/           — non-player characters encountered
04 Locations/      — worlds, systems, starports, specific places
05 Ships/          — vessels (party ship + notable others)
  05 Ships/Cargo/  — one note per cargo lot (buy/sell/profit tracking)
06 Factions/       — corporations, navies, criminal organizations, etc.
07 Religions/      — religions and cults
08 Creatures/      — alien creatures and monsters
09 Jobs/           — missions and jobs (one note per job)
_templates/        — Obsidian templates
```

## Tag Taxonomy

Tags drive graph view color coding and filtering:

| Tag | Color | Notes |
|-----|-------|-------|
| `#session` | gray | All session notes |
| `#npc` | orange | Named NPCs |
| `#location` | blue | Places |
| `#faction` | red | Organizations |
| `#pc` | green | Player characters |
| `#ship` | (default) | Vessels |
| `#cargo` | (default) | Cargo lots |
| `#job` | (default) | Jobs/missions |
| `#religion` | (default) | Religions |
| `#creature` | (default) | Creatures/monsters |
| `#mortgage` | (default) | Ship mortgages |

All templates pre-populate the correct tag in frontmatter.

## Graph View

Color groups are configured in `.obsidian/graph.json` — note types are visually distinct by color automatically.

**To hide session notes from the graph:** type `-tag:#session` in the graph filter bar.
**To show only sessions:** type `tag:#session`.
**To restore full graph:** clear the filter bar.

The graph becomes useful as notes accumulate **links**. When writing session notes, link to NPC, Location, and Faction notes using `[[Note Name]]` wikilinks. This creates edges in the graph that reveal connections over time.

## Templates

All templates live in `_templates/` and use the Obsidian core Templates plugin (`{{date}}` syntax).

- **Session Notes Template** — frontmatter with `tags: [session]` + date; sections for Attendees, Hirelings, Session Start, Loot & XP
- **NPC Template** — frontmatter: `tags`, `status`, `affiliation`, `first-seen`
- **Location Template** — frontmatter: `tags`, `system`, `planet`, `uwp`
- **Planet Template** — frontmatter: `tags`, `system`, `hex`, `uwp`, `starport`, `population`, `law-level`, `tech-level`, `trade-codes`, `bases`, `allegiance`; UWP breakdown table
- **Faction Template** — frontmatter: `tags`, `disposition`
- **Ship Template** — frontmatter: `tags`, `class`, `displacement`, `jump`, `thrust`, `owner`, `status`
- **Mortgage Template** — frontmatter: `tags`, `ship`, `principal`, `monthly-payment`, `term-months`, `payments-made`; payment log table
- **Cargo Template** — frontmatter: `tags`, `ship`, `status`, `bought-at`, `sold-at`; buy/sell/profit table
- **Job Template** — frontmatter: `tags`, `status`, `patron`, `location`, `payment`, `deadline`; session log table
- **Religion Template** — frontmatter: `tags`, `origin`, `prevalence`, `disposition`
- **Creature Template** — frontmatter: `tags`, `planet`, `habitat`, `encountered`; stat block

## Conventions

- Wikilinks (`[[Note Name]]`) for all internal references — this is what populates the graph
- Obsidian Vim mode is enabled
- Vault syncs via Obsidian Sync (iCloud) — keep filenames filesystem-safe, no binary files
- Active core plugins: file-explorer, search, graph, backlink, canvas, tag-pane, properties, daily-notes, templates, command-palette, bookmarks, bases, outline
