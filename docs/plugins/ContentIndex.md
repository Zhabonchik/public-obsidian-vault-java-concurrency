---
title: ContentIndex
tags:
  - plugin/emitter
---

This plugin emits both RSS feeds and an XML sitemap for your site. The [[RSS Feed]] allows users to subscribe to content on your site and the sitemap allows search engines to better index your site. The plugin also emits a `contentIndex.json` file which is used by dynamic frontend components like search and graph.

This plugin emits a comprehensive index of the site's content, generating additional resources such as a sitemap and RSS feeds for each directory.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

This plugin accepts the following configuration options:

- `enableSiteMap`: If `true` (default), generates a sitemap XML file (`sitemap.xml`) listing all site URLs for search engines in content discovery.
- `enableRSS`: If `true` (default), produces an RSS feed (`index.xml`) with recent content updates.
  - For a more fine-grained approach, use `noRSS: true` in a file to remove it from feeds, or set the same in a folder's `index.md` to remove the entire folder.
- `rssLimit`: Defines the maximum number of entries to include in the RSS feed, helping to focus on the most recent or relevant content. Defaults to `10`.
- `rssFullHtml`: If `true`, the RSS feed includes full HTML content. Otherwise it includes just summaries.
- `rssSlug`: Slug to the generated RSS feed XML file. Defaults to `"index"`.
- `includeEmptyFiles`: If `true` (default), content files with no body text are included in the generated index and resources.
- `titlePattern`: custom title generator for RSS feeds based on the global configuration and the directory name of the relevant folder, and (**if it exists**) the data of the `index.md` file of the current folder.
  - ex.
    ``titlePattern: (cfg, dir, dirIndex) => `A feed found at ${cfg.baseUrl}/${dir}.rss: ${dirIndex != null ? dirIndex.title : "(untitled)"}` ``
  - outputs: `"A feed found at my-site.com/directory.rss: Directory"`

## API

- Category: Emitter
- Function name: `Plugin.ContentIndex()`.
- Source: [`quartz/plugins/emitters/contentIndex.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/emitters/contentIndex.ts).
