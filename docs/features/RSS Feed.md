Quartz emits an RSS feed for all the content on your site by generating a file that RSS readers can subscribe to. Because of the RSS spec, this requires the `baseUrl` property in your [[configuration]] to be set properly for RSS readers to pick it up properly.

> [!info]
> After deploying, the generated RSS link will be available at `https://${baseUrl}/index.xml` by default.
>
> The `index.xml` path can be customized by passing the `rssSlug` option to the [[ContentIndex]] plugin.

Quartz also generates RSS feeds for all subdirectories on your site. Add `.rss` to the end of the directory link to download an RSS file limited to the content in that directory and its subdirectories.

- Subdirectories containing an `index.md` file with `noRSS: true` in the frontmatter will not generate an RSS feed.
  - The entries in that subdirectory will still be present in the default feed.
- You can hide a file from all RSS feeds by putting `noRSS: true` in that file's frontmatter.

## Configuration

This functionality is provided by the [[ContentIndex]] plugin. See the plugin page for customization options.
