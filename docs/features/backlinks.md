---
title: Backlinks
tags:
  - component
---

A backlink for a note is a link from another note to that note. Links in the backlink pane also feature rich [[popover previews]] if you have that feature enabled.

## Customization

- Removing backlinks: delete all usages of `Plugin.Backlinks()` from `quartz.layout.ts`.
- Hide when empty: hide `Backlinks` if given page doesn't contain any backlinks (default to `true`). To disable this, use `Plugin.Backlinks({ hideWhenEmpty: false })`.
- Install: `npx quartz plugin add github:quartz-community/backlinks`
- Source: [`quartz-community/backlinks`](https://github.com/quartz-community/backlinks)
