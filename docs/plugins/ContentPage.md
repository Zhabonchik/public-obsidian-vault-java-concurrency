---
title: ContentPage
tags:
  - plugin/pageType
---

This plugin is a page type plugin for the Quartz framework. It generates the HTML pages for each piece of Markdown content. It emits the full-page [[layout]], including headers, footers, and body content, among others. It is now configured in the `pageTypes` section of `quartz.config.ts`.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

This plugin has no configuration options.

## API

- Category: Page Type
- Function name: `ExternalPlugin.ContentPage()`.
- Source: [`quartz-community/content-page`](https://github.com/quartz-community/content-page)
- Install: `npx quartz plugin add github:quartz-community/content-page`
