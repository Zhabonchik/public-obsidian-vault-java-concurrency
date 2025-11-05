---
title: AliasRedirects
tags:
  - plugin/emitter
---

This plugin emits HTML redirect pages for aliases and permalinks defined in the frontmatter of content files.

## Aliases

Aliases create redirects from alternative names to the actual page URL.

For example, a `foo.md` has the following frontmatter:

```md title="foo.md"
---
title: "Foo"
alias:
  - "bar"
  - "old-name"
---
```

The URLs `host.me/bar` and `host.me/old-name` will be redirected to `host.me/foo`

## Permalinks

Permalinks set the actual URL where the page will be accessed. When you set a permalink, the page is rendered at that URL instead of the default file path.

For example, a `my-note.md` has the following frontmatter:

```md title="my-note.md"
---
title: "My Note"
permalink: "/custom-path"
---
```

The page will be accessible at `host.me/custom-path` (not at `host.me/my-note`). A redirect will automatically be created from the original file path (`host.me/my-note`) to the permalink (`host.me/custom-path`).

Note that these are permanent redirects.

The emitter supports the following aliases:

- `aliases`
- `alias`

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

This plugin has no configuration options.

## API

- Category: Emitter
- Function name: `Plugin.AliasRedirects()`.
- Source: [`quartz/plugins/emitters/aliases.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/emitters/aliases.ts).
