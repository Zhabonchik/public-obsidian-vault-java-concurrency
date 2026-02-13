import {
  QuartzTransformerPluginInstance,
  QuartzFilterPluginInstance,
  QuartzEmitterPluginInstance,
  QuartzPageTypePluginInstance,
} from "./types"
import { LoadedPlugin } from "./loader/types"

export interface PluginConfiguration {
  transformers: (QuartzTransformerPluginInstance | LoadedPlugin)[]
  filters: (QuartzFilterPluginInstance | LoadedPlugin)[]
  emitters: (QuartzEmitterPluginInstance | LoadedPlugin)[]
  pageTypes?: (QuartzPageTypePluginInstance | LoadedPlugin)[]
}

export function isLoadedPlugin(plugin: unknown): plugin is LoadedPlugin {
  return (
    typeof plugin === "object" &&
    plugin !== null &&
    "plugin" in plugin &&
    "manifest" in plugin &&
    "type" in plugin &&
    typeof (plugin as LoadedPlugin).plugin === "function"
  )
}

export function getPluginInstance<T extends object | undefined>(
  plugin:
    | QuartzTransformerPluginInstance
    | QuartzFilterPluginInstance
    | QuartzEmitterPluginInstance
    | QuartzPageTypePluginInstance
    | LoadedPlugin,
  options?: T,
):
  | QuartzTransformerPluginInstance
  | QuartzFilterPluginInstance
  | QuartzEmitterPluginInstance
  | QuartzPageTypePluginInstance {
  if (isLoadedPlugin(plugin)) {
    const factory = plugin.plugin as (
      opts?: T,
    ) =>
      | QuartzTransformerPluginInstance
      | QuartzFilterPluginInstance
      | QuartzEmitterPluginInstance
      | QuartzPageTypePluginInstance
    return factory(options)
  }
  return plugin
}
