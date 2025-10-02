import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "PATRICK> NHAT.NTM",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
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
          light: "#f9f9fa",                    // Màu nền chính của trang (background)
          lightgray: "#dedede",                // Màu viền nhẹ, đường kẻ phân cách, border
          gray: "#b0b0b0",                     // Màu liên kết trong graph view, đường nối giữa các node
          darkgray: "#444444",                 // Màu chữ chính trong nội dung (paragraph, text)
          dark: "#1c1c1e",                     // Màu tiêu đề (h1, h2, h3...), icon, text quan trọng
          secondary: "#007aff",                // Màu link thường, node hiện tại trong graph, button
          tertiary: "#d6b745",                 // Màu hover state, node đã thăm trong graph, accent color (vàng)
          highlight: "rgba(0, 122, 255, 0.1)", // Màu nền cho link nội bộ (internal link background)
          textHighlight: "#ffcc00aa",          // Màu nền cho text được highlight/đánh dấu
        },
        darkMode: {
          light: "#1c1c1e",                    // Màu nền chính của trang (background) - dark theme
          lightgray: "#2c2c2e",                // Màu viền nhẹ, đường kẻ phân cách, border - dark theme
          gray: "#636366",                     // Màu liên kết trong graph view, đường nối giữa các node - dark theme
          darkgray: "#e5e5e7",                 // Màu chữ chính trong nội dung (paragraph, text) - dark theme
          dark: "#f2f2f7",                     // Màu tiêu đề (h1, h2, h3...), icon, text quan trọng - dark theme
          secondary: "#0a84ff",                // Màu link thường, node hiện tại trong graph, button - dark theme
          tertiary: "#d6b745",                 // Màu hover state, node đã thăm trong graph, accent color (vàng)
          highlight: "rgba(10, 132, 255, 0.15)", // Màu nền cho link nội bộ (internal link background) - dark theme
          textHighlight: "#ffd60a99",          // Màu nền cho text được highlight/đánh dấu - dark theme
        }
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
      Plugin.TableOfContents({ maxDepth: 4 }),
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
