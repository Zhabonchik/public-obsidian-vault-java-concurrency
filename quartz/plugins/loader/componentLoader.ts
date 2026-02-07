import { componentRegistry } from "../../components/registry"
import { ComponentManifest, PluginManifest } from "./types"
import { QuartzComponentConstructor } from "../../components/types"

export async function loadComponentsFromPackage(
  packageName: string,
  manifest: PluginManifest | null,
): Promise<void> {
  if (!manifest?.components) return

  try {
    const componentsModule = await import(`${packageName}/components`)

    for (const [exportName, componentManifest] of Object.entries(manifest.components)) {
      const component = componentsModule[exportName]
      if (!component) {
        console.warn(
          `Component "${exportName}" declared in manifest but not found in ${packageName}/components`,
        )
        continue
      }

      const fullName = `${packageName}/${exportName}`
      componentRegistry.register(
        fullName,
        component as QuartzComponentConstructor,
        packageName,
        componentManifest as ComponentManifest,
      )
    }
  } catch {
    // Components module doesn't exist, that's okay for plugins without components
    if (manifest.components && Object.keys(manifest.components).length > 0) {
      console.warn(
        `Plugin ${packageName} declares components but failed to load them from ${packageName}/components`,
      )
    }
  }
}
