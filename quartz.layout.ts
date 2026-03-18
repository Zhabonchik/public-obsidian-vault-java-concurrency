import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.HomeHero(),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeProfile(),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeArticles(),
      condition: (props) => props.fileData.slug === "index",
    }),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.PageTitle(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.MobileOnly(Component.Spacer()),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.Darkmode(),
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.LinksList({
        links: {
          "E-Mail": "mailto:riceset@icloud.com",
          GitHub: "https://github.com/riceset",
          LinkedIn: "https://www.linkedin.com/in/riceset/",
        },
      })),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Explorer(),
      condition: (props) => props.fileData.slug !== "index",
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.RecentNotes({ title: "Latest", limit: 8 })),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.MobileOnly(Component.RecentNotes({ title: "Latest", limit: 1 })),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.MobileOnly(Component.LinksList({
        links: {
          GitHub: "https://github.com/riceset",
          LinkedIn: "https://www.linkedin.com/in/riceset/",
        },
      })),
      condition: (props) => props.fileData.slug !== "index",
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    //Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.LinksList({
        links: {
            "E-Mail": "mailto:riceset@icloud.com",
            GitHub: "https://github.com/riceset",
            LinkedIn: "https://www.linkedin.com/in/riceset/",
        }
    })),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.RecentNotes({
        title: "Latest",
        limit: 8
    })),
    Component.MobileOnly(Component.RecentNotes({
        title: "Latest",
        limit: 1
    })),
    Component.MobileOnly(Component.LinksList({
        links: {
            GitHub: "https://github.com/riceset",
            LinkedIn: "https://www.linkedin.com/in/riceset/",
        }
    }))
  ],
}
