import { QuartzEmitterPlugin, QuartzPageTypePluginInstance } from "../types"
import { QuartzComponent, QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { write } from "../emitters/helpers"
import { BuildCtx, trieFromAllFiles } from "../../util/ctx"
import { StaticResources } from "../../util/resources"

function getPageTypes(ctx: BuildCtx): QuartzPageTypePluginInstance[] {
  return (ctx.cfg.plugins.pageTypes ?? []) as unknown as QuartzPageTypePluginInstance[]
}

function resolveLayout(
  pageType: QuartzPageTypePluginInstance,
  sharedDefaults: Partial<FullPageLayout>,
  byPageType: Record<string, Partial<FullPageLayout>>,
): FullPageLayout {
  const overrides = byPageType[pageType.layout] ?? {}
  return {
    head: overrides.head ?? sharedDefaults.head!,
    header: overrides.header ?? sharedDefaults.header ?? [],
    beforeBody: overrides.beforeBody ?? sharedDefaults.beforeBody ?? [],
    pageBody: pageType.body(undefined),
    afterBody: overrides.afterBody ?? sharedDefaults.afterBody ?? [],
    left: overrides.left ?? sharedDefaults.left ?? [],
    right: overrides.right ?? sharedDefaults.right ?? [],
    footer: overrides.footer ?? sharedDefaults.footer!,
  }
}

function collectComponents(
  pageTypes: QuartzPageTypePluginInstance[],
  sharedDefaults: Partial<FullPageLayout>,
  byPageType: Record<string, Partial<FullPageLayout>>,
): QuartzComponent[] {
  const seen = new Set<QuartzComponent>()
  for (const pt of pageTypes) {
    const layout = resolveLayout(pt, sharedDefaults, byPageType)
    const all = [
      layout.head,
      ...layout.header,
      ...layout.beforeBody,
      layout.pageBody,
      ...layout.afterBody,
      ...layout.left,
      ...layout.right,
      layout.footer,
    ]
    for (const c of all) {
      seen.add(c)
    }
  }
  return [...seen]
}

interface DispatcherOptions {
  defaults: Partial<FullPageLayout>
  byPageType: Record<string, Partial<FullPageLayout>>
}

async function emitPage(
  ctx: BuildCtx,
  slug: FullSlug,
  tree: ProcessedContent[0],
  fileData: ProcessedContent[1]["data"],
  allFiles: ProcessedContent[1]["data"][],
  layout: FullPageLayout,
  resources: StaticResources,
) {
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources)
  const componentData: QuartzComponentProps = {
    ctx,
    fileData,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }

  return write({
    ctx,
    content: renderPage(cfg, slug, componentData, layout, externalResources),
    slug,
    ext: ".html",
  })
}

export const PageTypeDispatcher: QuartzEmitterPlugin<Partial<DispatcherOptions>> = (userOpts) => {
  const defaults = userOpts?.defaults ?? {}
  const byPageType = userOpts?.byPageType ?? {}

  return {
    name: "PageTypeDispatcher",
    getQuartzComponents(ctx) {
      const pageTypes = getPageTypes(ctx)
      return collectComponents(pageTypes, defaults, byPageType)
    },
    async *emit(ctx, content, resources) {
      const pageTypes = [...getPageTypes(ctx)].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((c) => c[1].data)

      // Ensure trie is available for components that need folder hierarchy (e.g. FolderContent)
      ctx.trie ??= trieFromAllFiles(allFiles)

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        const fileData = file.data

        for (const pt of pageTypes) {
          if (pt.match({ slug, fileData, cfg })) {
            const layout = resolveLayout(pt, defaults, byPageType)
            yield emitPage(ctx, slug, tree, fileData, allFiles, layout, resources)
            break
          }
        }
      }

      for (const pt of pageTypes) {
        if (!pt.generate) continue

        const virtualPages = pt.generate({ content, cfg, ctx })
        const layout = resolveLayout(pt, defaults, byPageType)

        for (const vp of virtualPages) {
          const vpSlug = vp.slug as FullSlug
          const [tree, vfile] = defaultProcessedContent({
            slug: vpSlug,
            frontmatter: { title: vp.title, tags: [] },
            ...vp.data,
          })

          // Expose virtual pages on ctx so other emitters (e.g. ContentIndex) can include them
          ctx.virtualPages.push([tree, vfile])

          yield emitPage(ctx, vpSlug, tree, vfile.data, allFiles, layout, resources)
        }
      }
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const pageTypes = [...getPageTypes(ctx)].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((c) => c[1].data)

      // Rebuild trie on partial emit to reflect file changes
      ctx.trie = trieFromAllFiles(allFiles)

      const changedSlugs = new Set<string>()
      for (const changeEvent of changeEvents) {
        if (!changeEvent.file) continue
        if (changeEvent.type === "add" || changeEvent.type === "change") {
          changedSlugs.add(changeEvent.file.data.slug!)
        }
      }

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (!changedSlugs.has(slug)) continue

        const fileData = file.data
        for (const pt of pageTypes) {
          if (pt.match({ slug, fileData, cfg })) {
            const layout = resolveLayout(pt, defaults, byPageType)
            yield emitPage(ctx, slug, tree, fileData, allFiles, layout, resources)
            break
          }
        }
      }

      for (const pt of pageTypes) {
        if (!pt.generate) continue

        const virtualPages = pt.generate({ content, cfg, ctx })
        const layout = resolveLayout(pt, defaults, byPageType)

        for (const vp of virtualPages) {
          const vpSlug = vp.slug as FullSlug
          const [tree, vfile] = defaultProcessedContent({
            slug: vpSlug,
            frontmatter: { title: vp.title, tags: [] },
            ...vp.data,
          })

          // Expose virtual pages on ctx so other emitters (e.g. ContentIndex) can include them
          ctx.virtualPages.push([tree, vfile])

          yield emitPage(ctx, vpSlug, tree, vfile.data, allFiles, layout, resources)
        }
      }
    },
  }
}
