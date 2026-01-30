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
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
  lightMode: {
    light: "#f8f7f4",           // 暖米白
    lightgray: "#e8e6e1",       // 淺灰米
    gray: "#9d9b97",            // 中灰
    darkgray: "#5c5a57",        // 深灰棕
    dark: "#2d2c29",            // 深棕黑
    secondary: "#C2956E",       // 陶土色 ✨
    tertiary: "#8B8680",        // 柴燒灰 ✨
    highlight: "rgba(194, 149, 110, 0.15)",  // 陶土色半透明
    textHighlight: "#C2956E44", // 陶土色高亮
  },
  darkMode: {
    light: "#1e1e1e",           // 不要全黑
    lightgray: "#2a2a2a",
    gray: "#6e6e6e",
    darkgray: "#c9c9c9",
    dark: "#ebebec",
    secondary: "#C2956E",       // 陶土色 ✨
    tertiary: "#9DAA8C",        // 青瓷綠 ✨
    highlight: "rgba(194, 149, 110, 0.15)",
    textHighlight: "#C2956E44",
  },
},

    },
  },
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
