---
title: CrawlLinks
tags:
  - plugin/transformer
---

This plugin parses links and processes them to point to the right places. It is also needed for embedded links (like images). See [[Obsidian compatibility]] for more information.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

This plugin accepts the following configuration options:

- `markdownLinkResolution`: Sets the strategy for resolving Markdown paths, can be `"absolute"` (default), `"relative"` or `"shortest"`. You should use the same setting here as in [[Obsidian compatibility|Obsidian]].
  - `absolute`: Path relative to the root of the content folder.
  - `relative`: Path relative to the file you are linking from.
  - `shortest`: Name of the file. If this isn't enough to identify the file, use the full absolute path.
- `prettyLinks`: If `true` (default), simplifies links by removing folder paths, making them more user friendly (e.g. `folder/deeply/nested/note` becomes `note`).
- `openLinksInNewTab`: If `true`, configures external links to open in a new tab. Defaults to `false`.
- `lazyLoad`: If `true`, adds lazy loading to resource elements (`img`, `video`, etc.) to improve page load performance. Defaults to `false`.
- `externalLinkIcon`: Adds an icon next to external links when `true` (default) to visually distinguishing them from internal links.
- `showLinkFavicon`: If `true`, displays the favicon of external websites before each external link, making it easier to visually identify the source of the link. Defaults to `false`.
  - **Note:** This feature is **disabled by default**. Favicons are fetched from Google's favicon service.
  - **Caching:** Favicons are cached in memory during the build process. Each unique domain is fetched only once, even if there are multiple links to that domain. This prevents excessive API calls and rate limiting issues.
- `cacheLinkFavicons`: If `true`, preemptively fetches and caches external link favicons during the build process. This ensures favicons are available immediately on page load without additional runtime requests. Defaults to `false`.
  - **Use case:** Enable this option if you want to avoid any runtime favicon requests and ensure all favicons are cached during build time.

> [!warning]
> Removing this plugin is _not_ recommended and will likely break the page.

## API

- Category: Transformer
- Function name: `Plugin.CrawlLinks()`.
- Source: [`quartz/plugins/transformers/links.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/transformers/links.ts).
