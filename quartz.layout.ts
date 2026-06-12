import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.Graph({
        globalOnly: true,
        globalGraph: {
          removeSlugs: ["index"],
        },
      }),
      condition: (props) => props.fileData.slug === "index",
    }),
  ],
  footer: Component.Footer({
    links: {},
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
    Component.ConditionalRender({
      component: Component.ThemeToggle(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Socials()),
      condition: (props) => props.fileData.slug !== "index",
    }),
  ],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.ThemeToggle(),
    Component.DesktopOnly(Component.Socials()),
  ],
  right: [],
}
