import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "靜觀微語",
    pageTitleSuffix: "",
    enableSPA: false,
    enablePopovers: true,
    analytics: {
  provider: "null",
  websiteId: "d6f39378-93d1-416e-94f5-2f29b2474f4a",
  host: "https://cloud.umami.is", // 拿掉後面的 /script.js
},
    locale: "en-US",
    baseUrl: "vcdvcd.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
  colors: {
    lightMode: {
      light: "#f8f7f4",        // 背景改成暖米白
      lightgray: "#e8e6e1",
      gray: "#9d9b97",
      darkgray: "#5c5a57",
      dark: "#2d2c29",
      secondary: "#C2956E",     // 主色改成陶土色
      tertiary: "#8B8680",      // 輔色改成柴燒灰
      highlight: "rgba(194, 149, 110, 0.15)",  // 高亮改成陶土色半透明
    },
    darkMode: {
      light: "#1e1e1e",         // 保持深色但不要全黑
      lightgray: "#2a2a2a",
      gray: "#6e6e6e",
      darkgray: "#c9c9c9",
      dark: "#ebebec",
      secondary: "#C2956E",     // 主色一樣是陶土色
      tertiary: "#9DAA8C",      // 輔色改成青瓷綠
      highlight: "rgba(194, 149, 110, 0.15)",
    },
  },
}

  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
