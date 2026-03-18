---
title: Recent Changes
tags: component
---

Quartz can generate an activity feed showing recently created and modified notes, with tab-based filtering and pagination. Though this component isn't included in any [[layout]] by default, you can add it by using `Component.RecentChanges` in `quartz.layout.ts`.

## Customization

- Changing the title from "Recent Changes": pass in an additional parameter to `Component.RecentChanges({ title: "Latest updates" })`
- Changing the number of items shown (without filter tabs): `Component.RecentChanges({ limit: 5 })`
- Show only new notes (hide modified): `Component.RecentChanges({ showModified: false })`
- Show only modified notes (hide new): `Component.RecentChanges({ showCreated: false })`
- Enable tab filter UI (All / New / Updated) with Load More pagination: `Component.RecentChanges({ showFilter: true })`
- Set the number of items loaded per tab or per "Load more" click: `Component.RecentChanges({ pageSize: 10 })`
- Show note excerpts (requires `detailed: true`): `Component.RecentChanges({ detailed: true, showExcerpt: true })`
- Show tags (requires `detailed: true`): `Component.RecentChanges({ detailed: true, showTags: true })`
- Restrict to notes under a specific path: `Component.RecentChanges({ filterBy: ["blog/"] })`
- Show a 'see all' link: pass in an additional parameter to `Component.RecentChanges({ linkToMore: "recent-changes" })`. This field should be a full slug to a page that exists.
- Restrict rendering to specific pages: `Component.RecentChanges({ pages: ["index" as FullSlug] })`. Useful when placing the component in a global layout but only wanting it to appear on certain pages.
- Component: `quartz/components/RecentChanges.tsx`
- Style: `quartz/components/styles/recentChanges.scss`
