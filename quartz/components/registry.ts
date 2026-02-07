import { QuartzComponent, QuartzComponentConstructor } from "./types"

export interface ComponentManifest {
  name: string
  displayName: string
  description: string
  version: string
  quartzVersion?: string
  author?: string
  homepage?: string
}

export interface RegisteredComponent {
  component: QuartzComponent | QuartzComponentConstructor
  source: string
  manifest?: ComponentManifest
}

class ComponentRegistry {
  private components = new Map<string, RegisteredComponent>()

  register(
    name: string,
    component: QuartzComponent | QuartzComponentConstructor,
    source: string,
    manifest?: ComponentManifest,
  ): void {
    if (this.components.has(name)) {
      console.warn(`Component "${name}" is being overwritten by ${source}`)
    }
    this.components.set(name, { component, source, manifest })
  }

  get(name: string): RegisteredComponent | undefined {
    return this.components.get(name)
  }

  getAll(): Map<string, RegisteredComponent> {
    return new Map(this.components)
  }

  getAllComponents(): QuartzComponent[] {
    return Array.from(this.components.values()).map((r) => {
      if (typeof r.component === "function") {
        return (r.component as QuartzComponentConstructor)(undefined)
      }
      return r.component as QuartzComponent
    })
  }
}

export const componentRegistry = new ComponentRegistry()

export function defineComponent<Options extends object | undefined = undefined>(
  factory: QuartzComponentConstructor<Options>,
  manifest: ComponentManifest,
): QuartzComponentConstructor<Options> {
  ;(factory as any).__quartzComponent = { manifest }
  return factory
}
