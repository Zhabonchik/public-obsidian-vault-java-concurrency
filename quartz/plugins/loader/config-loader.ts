import fs from "fs"
import path from "path"
import YAML from "yaml"
import { styleText } from "util"
import { QuartzConfig, GlobalConfiguration, FullPageLayout } from "../../cfg"
import { QuartzComponent } from "../../components/types"
import { PluginTypes } from "../types"
import {
  PluginManifest,
  PluginJsonEntry,
  QuartzPluginsJson,
  LayoutConfig,
  PluginLayoutDeclaration,
  FlexGroupConfig,
  PluginCategory,
} from "./types"
import { parsePluginSource, installPlugin, getPluginEntryPoint } from "./gitLoader"
import { loadComponentsFromPackage } from "./componentLoader"
import { componentRegistry } from "../../components/registry"
import { getCondition } from "./conditions"

const CONFIG_YAML_PATH = path.join(process.cwd(), "quartz.config.yaml")
const LEGACY_PLUGINS_JSON_PATH = path.join(process.cwd(), "quartz.plugins.json")

function resolveConfigPath(): string {
  if (fs.existsSync(CONFIG_YAML_PATH)) return CONFIG_YAML_PATH
  if (fs.existsSync(LEGACY_PLUGINS_JSON_PATH)) return LEGACY_PLUGINS_JSON_PATH
  return CONFIG_YAML_PATH
}
function readPluginsJson(): QuartzPluginsJson | null {
  const configPath = resolveConfigPath()
  if (!fs.existsSync(configPath)) {
    return null
  }
  const raw = fs.readFileSync(configPath, "utf-8")
  if (configPath.endsWith(".yaml") || configPath.endsWith(".yml")) {
    return YAML.parse(raw) as QuartzPluginsJson
  }
  return JSON.parse(raw) as QuartzPluginsJson
}

function extractPluginName(source: string): string {
  if (source.startsWith("github:")) {
    const withoutPrefix = source.replace("github:", "")
    const [repoPath] = withoutPrefix.split("#")
    const parts = repoPath.split("/")
    return parts[parts.length - 1]
  }
  if (source.startsWith("git+") || source.startsWith("https://")) {
    const url = source.replace("git+", "")
    const match = url.match(/\/([^/]+?)(?:\.git)?(?:#|$)/)
    return match?.[1] ?? source
  }
  return source
}

interface DependencyValidationResult {
  errors: string[]
  warnings: string[]
}

function validateDependencies(
  entries: PluginJsonEntry[],
  manifests: Map<string, PluginManifest>,
): DependencyValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const sourceToEntry = new Map<string, PluginJsonEntry>()
  const nameToSource = new Map<string, string>()
  for (const entry of entries) {
    sourceToEntry.set(entry.source, entry)
    nameToSource.set(extractPluginName(entry.source), entry.source)
  }

  for (const entry of entries) {
    if (!entry.enabled) continue
    const manifest = manifests.get(entry.source)
    if (!manifest?.dependencies?.length) continue

    const pluginName = manifest.displayName || extractPluginName(entry.source)
    const pluginOrder = entry.order ?? manifest.defaultOrder ?? 50

    for (const dep of manifest.dependencies) {
      const depEntry = sourceToEntry.get(dep)
      const depName = extractPluginName(dep)

      if (!depEntry) {
        errors.push(
          `Plugin "${pluginName}" requires "${depName}". Run: npx quartz plugin add ${dep}`,
        )
        continue
      }

      if (!depEntry.enabled) {
        warnings.push(
          `Plugin "${pluginName}" depends on "${depName}" which is disabled. "${pluginName}" may not function correctly.`,
        )
      }

      const depManifest = manifests.get(dep)
      const depOrder = depEntry.order ?? depManifest?.defaultOrder ?? 50

      if (pluginOrder < depOrder) {
        errors.push(
          `Plugin "${pluginName}" (order: ${pluginOrder}) depends on "${depName}" (order: ${depOrder}), ` +
            `but "${pluginName}" is configured to run first. Either increase "${pluginName}"'s order above ${depOrder} ` +
            `or decrease "${depName}"'s order below ${pluginOrder}.`,
        )
      }
    }
  }

  // Circular dependency detection
  const graph = new Map<string, string[]>()
  for (const entry of entries) {
    const manifest = manifests.get(entry.source)
    if (manifest?.dependencies?.length) {
      graph.set(entry.source, manifest.dependencies)
    }
  }

  const visited = new Set<string>()
  const inStack = new Set<string>()

  function detectCycle(node: string, pathSoFar: string[]): string[] | null {
    if (inStack.has(node)) {
      const cycleStart = pathSoFar.indexOf(node)
      return pathSoFar.slice(cycleStart).concat(node)
    }
    if (visited.has(node)) return null

    visited.add(node)
    inStack.add(node)

    for (const dep of graph.get(node) ?? []) {
      const cycle = detectCycle(dep, [...pathSoFar, node])
      if (cycle) return cycle
    }

    inStack.delete(node)
    return null
  }

  for (const node of graph.keys()) {
    const cycle = detectCycle(node, [])
    if (cycle) {
      const names = cycle.map(extractPluginName)
      errors.push(`Circular dependency detected: ${names.join(" → ")}`)
      break
    }
  }

  return { errors, warnings }
}

async function resolvePluginManifest(source: string): Promise<PluginManifest | null> {
  try {
    const gitSpec = parsePluginSource(source)
    const entryPoint = getPluginEntryPoint(gitSpec.name, gitSpec.subdir)
    const module = await import(entryPoint)
    return module.manifest ?? null
  } catch {
    return null
  }
}

async function readManifestFromPackageJson(source: string): Promise<PluginManifest | null> {
  try {
    const gitSpec = parsePluginSource(source)
    const pluginDir = path.join(process.cwd(), ".quartz", "plugins", gitSpec.name)
    const pkgPath = path.join(pluginDir, "package.json")
    if (!fs.existsSync(pkgPath)) return null

    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
    if (!pkg.quartz) return null

    const q = pkg.quartz
    return {
      name: q.name ?? gitSpec.name,
      displayName: q.displayName ?? q.name ?? gitSpec.name,
      description: q.description ?? pkg.description ?? "No description",
      version: q.version ?? pkg.version ?? "1.0.0",
      author: q.author ?? pkg.author,
      homepage: q.homepage ?? pkg.homepage,
      category: q.category,
      quartzVersion: q.quartzVersion,
      dependencies: q.dependencies,
      defaultOrder: q.defaultOrder,
      defaultEnabled: q.defaultEnabled,
      defaultOptions: q.defaultOptions,
      configSchema: q.configSchema,
      components: q.components,
    }
  } catch {
    return null
  }
}

async function getManifest(source: string): Promise<PluginManifest | null> {
  // Try package.json quartz field first (preferred), then fall back to manifest.ts export
  return (await readManifestFromPackageJson(source)) ?? (await resolvePluginManifest(source))
}

export async function loadQuartzConfig(): Promise<QuartzConfig> {
  const json = readPluginsJson()

  if (!json) {
    // Fallback: import old-style config directly
    const oldConfig = await import("../../../quartz.config")
    return oldConfig.default
  }

  const configuration = json.configuration as unknown as GlobalConfiguration

  const enabledEntries = json.plugins.filter((e) => e.enabled)
  const manifests = new Map<string, PluginManifest>()

  // Ensure all plugins are installed and collect manifests
  for (const entry of enabledEntries) {
    try {
      const gitSpec = parsePluginSource(entry.source)
      await installPlugin(gitSpec, { verbose: false })

      const manifest = await getManifest(entry.source)
      if (manifest) {
        manifests.set(entry.source, manifest)
      }
    } catch (err) {
      console.error(
        styleText("red", `✗`) +
          ` Failed to install plugin: ${styleText("yellow", entry.source)}\n` +
          `  ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  // Validate dependencies
  const validation = validateDependencies(enabledEntries, manifests)
  for (const warning of validation.warnings) {
    console.warn(styleText("yellow", `⚠`) + ` ${warning}`)
  }
  if (validation.errors.length > 0) {
    for (const error of validation.errors) {
      console.error(styleText("red", `✗`) + ` ${error}`)
    }
    throw new Error(
      `Plugin dependency validation failed with ${validation.errors.length} error(s). See above for details.`,
    )
  }

  // Categorize and sort plugins
  const transformers: { entry: PluginJsonEntry; manifest: PluginManifest | undefined }[] = []
  const filters: { entry: PluginJsonEntry; manifest: PluginManifest | undefined }[] = []
  const emitters: { entry: PluginJsonEntry; manifest: PluginManifest | undefined }[] = []
  const pageTypes: { entry: PluginJsonEntry; manifest: PluginManifest | undefined }[] = []

  for (const entry of enabledEntries) {
    const manifest = manifests.get(entry.source)
    const category = manifest?.category
    // Resolve processing category: for array categories (e.g. ["transformer", "component"]),
    // find the first processing category. "component" is handled separately via loadComponentsFromPackage.
    const processingCategories = ["transformer", "filter", "emitter", "pageType"] as const
    let resolvedCategory: string | undefined
    if (Array.isArray(category)) {
      resolvedCategory = category.find((c) =>
        (processingCategories as readonly string[]).includes(c),
      )
    } else {
      resolvedCategory = category
    }

    switch (resolvedCategory) {
      case "transformer":
        transformers.push({ entry, manifest })
        break
      case "filter":
        filters.push({ entry, manifest })
        break
      case "emitter":
        emitters.push({ entry, manifest })
        break
      case "pageType":
        pageTypes.push({ entry, manifest })
        break
      default: {
        // Try to detect category from the loaded module
        const gitSpec = parsePluginSource(entry.source)
        const entryPoint = getPluginEntryPoint(gitSpec.name, gitSpec.subdir)
        try {
          const module = await import(entryPoint)
          const detected = detectCategoryFromModule(module)
          if (detected) {
            const target = {
              transformer: transformers,
              filter: filters,
              emitter: emitters,
              pageType: pageTypes,
            }[detected]
            target.push({ entry, manifest })
          } else {
            console.warn(
              styleText("yellow", `⚠`) +
                ` Could not determine category for plugin "${extractPluginName(entry.source)}". Skipping.`,
            )
          }
        } catch {
          console.warn(
            styleText("yellow", `⚠`) +
              ` Could not load plugin "${extractPluginName(entry.source)}" to detect category. Skipping.`,
          )
        }
      }
    }
  }

  // Sort by order within each category
  const sortByOrder = (
    a: { entry: PluginJsonEntry; manifest: PluginManifest | undefined },
    b: { entry: PluginJsonEntry; manifest: PluginManifest | undefined },
  ) => {
    const orderA = a.entry.order ?? a.manifest?.defaultOrder ?? 50
    const orderB = b.entry.order ?? b.manifest?.defaultOrder ?? 50
    return orderA - orderB
  }

  transformers.sort(sortByOrder)
  filters.sort(sortByOrder)
  emitters.sort(sortByOrder)
  pageTypes.sort(sortByOrder)

  // Instantiate plugins
  const instantiate = async (
    items: { entry: PluginJsonEntry; manifest: PluginManifest | undefined }[],
  ) => {
    const instances = []
    for (const { entry, manifest } of items) {
      try {
        const gitSpec = parsePluginSource(entry.source)
        const entryPoint = getPluginEntryPoint(gitSpec.name, gitSpec.subdir)
        const module = await import(entryPoint)

        // Load components if declared
        if (manifest?.components && Object.keys(manifest.components).length > 0) {
          await loadComponentsFromPackage(entryPoint, manifest)
        }

        const factory = module.default ?? module.plugin
        if (typeof factory !== "function") {
          console.warn(
            styleText("yellow", `⚠`) +
              ` Plugin "${extractPluginName(entry.source)}" has no factory function. Skipping.`,
          )
          continue
        }

        // Merge default options with user options
        const options = { ...manifest?.defaultOptions, ...entry.options }
        instances.push(factory(Object.keys(options).length > 0 ? options : undefined))
      } catch (err) {
        console.error(
          styleText("red", `✗`) +
            ` Failed to instantiate plugin "${extractPluginName(entry.source)}": ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }
    return instances
  }

  // Import built-in plugins
  const builtinPlugins = await import("../index")
  const builtinTransformers: unknown[] = []
  const builtinEmitters = [
    builtinPlugins.ComponentResources(),
    builtinPlugins.Assets(),
    builtinPlugins.Static(),
  ]
  const builtinPageTypes = [builtinPlugins.PageTypes.NotFoundPageType()]

  const plugins: PluginTypes = {
    transformers: [...builtinTransformers, ...(await instantiate(transformers))],
    filters: await instantiate(filters),
    emitters: [...builtinEmitters, ...(await instantiate(emitters))],
    pageTypes: [...(await instantiate(pageTypes)), ...builtinPageTypes],
  }

  return {
    configuration,
    plugins,
  }
}

function detectCategoryFromModule(module: unknown): PluginCategory | null {
  if (!module || typeof module !== "object") return null
  const mod = module as Record<string, unknown>

  if (typeof mod.default === "function") {
    // Try to instantiate and inspect
    try {
      const instance = (mod.default as Function)()
      if (instance && typeof instance === "object") {
        if ("match" in instance && "body" in instance && "layout" in instance) return "pageType"
        if ("emit" in instance) return "emitter"
        if ("shouldPublish" in instance) return "filter"
        if (
          "textTransform" in instance ||
          "markdownPlugins" in instance ||
          "htmlPlugins" in instance
        )
          return "transformer"
      }
    } catch {
      // Couldn't instantiate, skip detection
    }
  }

  return null
}

export async function loadQuartzLayout(): Promise<{
  defaults: Partial<FullPageLayout>
  byPageType: Record<string, Partial<FullPageLayout>>
}> {
  const json = readPluginsJson()

  if (!json) {
    // Fallback: import old-style layout directly
    const oldLayout = await import("../../../quartz.layout")
    return oldLayout.layout
  }

  const enabledWithLayout = json.plugins.filter((e) => e.enabled && e.layout)
  const layoutConfig = json.layout ?? {}

  // Build default layout for all page types
  const defaultLayout = buildLayoutForEntries(enabledWithLayout, layoutConfig)

  // Build per-page-type overrides
  const byPageType: Record<string, Partial<FullPageLayout>> = {}
  if (layoutConfig.byPageType) {
    for (const [pageType, override] of Object.entries(layoutConfig.byPageType)) {
      let filteredEntries = enabledWithLayout

      // Apply exclusions
      if (override.exclude?.length) {
        filteredEntries = filteredEntries.filter((e) => {
          const name = extractPluginName(e.source)
          return !override.exclude!.includes(name)
        })
      }

      const ptLayout = buildLayoutForEntries(filteredEntries, layoutConfig)

      // Apply position overrides (empty array = clear position)
      if (override.positions) {
        for (const [pos, components] of Object.entries(override.positions)) {
          if (Array.isArray(components) && components.length === 0) {
            const key = pos as keyof Pick<
              FullPageLayout,
              "left" | "right" | "beforeBody" | "afterBody"
            >
            if (key in ptLayout) {
              ;(ptLayout as Record<string, unknown>)[key] = []
            }
          }
        }
      }

      byPageType[pageType] = ptLayout
    }
  }

  // Add Head (built-in) and Footer (plugin)
  const HeadModule = await import("../../components/Head")
  const head = HeadModule.default()

  // Find footer plugin
  const footerEntry = json.plugins.find(
    (e) => e.enabled && extractPluginName(e.source) === "footer",
  )
  let footer: QuartzComponent | undefined
  if (footerEntry) {
    try {
      const gitSpec = parsePluginSource(footerEntry.source)
      const entryPoint = getPluginEntryPoint(gitSpec.name, gitSpec.subdir)
      const module = await import(entryPoint)
      const factory = module.default ?? module.plugin
      if (typeof factory === "function") {
        const options = { ...footerEntry.options }
        footer = factory(Object.keys(options).length > 0 ? options : undefined)
      }
    } catch {
      // Footer not available
    }
  }

  // Apply structural defaults
  defaultLayout.head = head
  defaultLayout.header = defaultLayout.header ?? []
  if (footer) {
    defaultLayout.footer = footer
  }

  // Ensure all byPageType entries inherit structural slots
  for (const pageType of Object.keys(byPageType)) {
    const pt = byPageType[pageType]
    if (!pt.head) pt.head = head
    if (!pt.header) pt.header = []
    if (footer && !pt.footer) pt.footer = footer
  }

  return { defaults: defaultLayout, byPageType }
}

function buildLayoutForEntries(
  entries: PluginJsonEntry[],
  layoutConfig: LayoutConfig,
): Partial<FullPageLayout> {
  const positions: Record<
    string,
    {
      component: QuartzComponent
      priority: number
      group?: string
      groupOptions?: PluginLayoutDeclaration["groupOptions"]
    }[]
  > = {
    left: [],
    right: [],
    beforeBody: [],
    afterBody: [],
  }

  for (const entry of entries) {
    if (!entry.layout) continue

    const layout = entry.layout
    const name = extractPluginName(entry.source)

    // Look up component from registry
    const registered =
      componentRegistry.get(name) ?? componentRegistry.get(`${entry.source}/${name}`)
    if (!registered) {
      // Try common naming patterns
      const pascalName = name
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")
      const altRegistered = componentRegistry.get(pascalName)
      if (!altRegistered) continue
    }

    const reg =
      registered ??
      componentRegistry.get(
        name
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(""),
      )
    if (!reg) continue

    let component: QuartzComponent
    if (typeof reg.component === "function" && !("displayName" in reg.component)) {
      // It's a constructor, instantiate with options
      const opts = { ...entry.options }
      component = (reg.component as Function)(
        Object.keys(opts).length > 0 ? opts : undefined,
      ) as QuartzComponent
    } else {
      component = reg.component as QuartzComponent
    }

    // Apply display modifier
    if (layout.display && layout.display !== "all") {
      component = applyDisplayWrapper(component, layout.display)
    }

    // Apply condition
    if (layout.condition) {
      component = applyConditionWrapper(component, layout.condition)
    }

    const posArray = positions[layout.position]
    if (posArray) {
      posArray.push({
        component,
        priority: layout.priority,
        group: layout.group,
        groupOptions: layout.groupOptions,
      })
    }
  }

  // Sort by priority and resolve groups
  const result: Partial<FullPageLayout> = {}

  for (const [position, items] of Object.entries(positions)) {
    items.sort((a, b) => a.priority - b.priority)

    const resolved = resolveGroups(items, layoutConfig.groups ?? {})
    const key = position as keyof Pick<
      FullPageLayout,
      "left" | "right" | "beforeBody" | "afterBody"
    >
    ;(result as Record<string, QuartzComponent[]>)[key] = resolved
  }

  return result
}

function resolveGroups(
  items: {
    component: QuartzComponent
    priority: number
    group?: string
    groupOptions?: PluginLayoutDeclaration["groupOptions"]
  }[],
  groups: Record<string, FlexGroupConfig>,
): QuartzComponent[] {
  const result: QuartzComponent[] = []
  const groupedComponents = new Map<
    string,
    { component: QuartzComponent; groupOptions?: PluginLayoutDeclaration["groupOptions"] }[]
  >()
  const groupInsertionOrder: { name: string; priority: number }[] = []

  for (const item of items) {
    if (item.group) {
      if (!groupedComponents.has(item.group)) {
        groupedComponents.set(item.group, [])
        groupInsertionOrder.push({ name: item.group, priority: item.priority })
      }
      groupedComponents.get(item.group)!.push({
        component: item.component,
        groupOptions: item.groupOptions,
      })
    } else {
      result.push(item.component)
    }
  }

  // Insert flex groups at the position of their first member
  for (const { name: groupName } of groupInsertionOrder) {
    const members = groupedComponents.get(groupName)!
    const groupConfig = groups[groupName] ?? {}

    const flexComponents = members.map((m) => ({
      Component: m.component,
      grow: m.groupOptions?.grow,
      shrink: m.groupOptions?.shrink,
      basis: m.groupOptions?.basis,
      order: m.groupOptions?.order,
      align: m.groupOptions?.align,
      justify: m.groupOptions?.justify,
    }))

    // Dynamically import Flex to avoid circular dependencies
    const FlexModule = require("../../components/Flex")
    const Flex = FlexModule.default as Function
    const flexComponent = Flex({
      components: flexComponents,
      direction: groupConfig.direction ?? "row",
      wrap: groupConfig.wrap,
      gap: groupConfig.gap ?? "1rem",
    }) as QuartzComponent

    result.push(flexComponent)
  }

  return result
}

function applyDisplayWrapper(
  component: QuartzComponent,
  display: "mobile-only" | "desktop-only",
): QuartzComponent {
  if (display === "mobile-only") {
    const MobileOnly = require("../../components/MobileOnly").default as Function
    return MobileOnly(component) as QuartzComponent
  } else {
    const DesktopOnly = require("../../components/DesktopOnly").default as Function
    return DesktopOnly(component) as QuartzComponent
  }
}

function applyConditionWrapper(component: QuartzComponent, conditionName: string): QuartzComponent {
  const predicate = getCondition(conditionName)
  if (!predicate) {
    console.warn(
      styleText("yellow", `⚠`) +
        ` Unknown condition "${conditionName}". Component will always render.`,
    )
    return component
  }

  const ConditionalRender = require("../../components/ConditionalRender").default as Function
  return ConditionalRender({
    component,
    condition: predicate,
  }) as QuartzComponent
}
