---
title: Recent Notes
tags: component
---

Quartz can generate a list of recent notes based on some filtering and sorting criteria. Though this component isn't included in any [[layout]] by default, you can add it by using `Plugin.RecentNotes` in `quartz.layout.ts`.

## Customization

- Changing the title from "Recent notes": pass in an additional parameter to `Plugin.RecentNotes({ title: "Recent writing" })`
- Changing the number of recent notes: pass in an additional parameter to `Plugin.RecentNotes({ limit: 5 })`
- Display the note's tags (defaults to true): `Plugin.RecentNotes({ showTags: false })`
- Show a 'see more' link: pass in an additional parameter to `Plugin.RecentNotes({ linkToMore: "tags/components" })`. This field should be a full slug to a page that exists.
- Customize filtering: pass in an additional parameter to `Plugin.RecentNotes({ filter: someFilterFunction })`. The filter function should be a function that has the signature `(f: QuartzPluginData) => boolean`.
- Customize sorting: pass in an additional parameter to `Plugin.RecentNotes({ sort: someSortFunction })`. By default, Quartz will sort by date and then tie break lexographically. The sort function should be a function that has the signature `(f1: QuartzPluginData, f2: QuartzPluginData) => number`.
- Install: `npx quartz plugin add github:quartz-community/recent-notes`
- Source: [`quartz-community/recent-notes`](https://github.com/quartz-community/recent-notes)
