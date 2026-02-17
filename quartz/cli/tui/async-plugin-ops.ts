import fs from "fs"
import path from "path"
import { execFile } from "child_process"
import { promisify } from "util"
import {
  readPluginsJson,
  writePluginsJson,
  readLockfile,
  writeLockfile,
  extractPluginName,
  readManifestFromPackageJson,
  parseGitSource,
  PLUGINS_DIR,
} from "../plugin-data.js"

export type ProgressCallback = (
  message: string,
  type: "info" | "success" | "error" | "warning",
) => void

export interface OperationResult {
  success: boolean
  installed?: number
  failed?: number
  updated?: string[]
  errors?: string[]
}

interface LockfileEntry {
  source: string
  resolved: string
  commit: string
  installedAt: string
}

interface Lockfile {
  version: string
  plugins: Record<string, LockfileEntry>
}

interface PluginsJsonEntry {
  source: string
  enabled?: boolean
  options?: Record<string, unknown>
  order?: number
  layout?: {
    position: string
    priority?: number
    display?: string
    condition?: string
    group?: string
    groupOptions?: Record<string, unknown>
  }
}

interface PluginsJson {
  plugins?: PluginsJsonEntry[]
}

interface PluginManifestComponent {
  defaultPosition?: string
  defaultPriority?: number
}

interface PluginManifest {
  defaultEnabled?: boolean
  defaultOptions?: Record<string, unknown>
  defaultOrder?: number
  components?: Record<string, PluginManifestComponent>
}

const INTERNAL_EXPORTS = new Set(["manifest", "default"])
const execFileAsync = promisify(execFile)

function report(
  onProgress: ProgressCallback | undefined,
  message: string,
  type: OperationResultType,
) {
  onProgress?.(message, type)
}

type OperationResultType = "info" | "success" | "error" | "warning"

function shortCommit(commit: string) {
  return commit.slice(0, 7)
}

async function runGit(args: string[], cwd?: string, timeout = 60000) {
  const { stdout } = await execFileAsync("git", args, { cwd, timeout, encoding: "utf-8" })
  return stdout.trim()
}

async function runNpm(args: string[], cwd: string, timeout = 300000) {
  await execFileAsync("npm", args, { cwd, timeout, encoding: "utf-8" })
}

async function getGitCommitAsync(pluginDir: string) {
  try {
    const commit = await runGit(["rev-parse", "HEAD"], pluginDir)
    return commit || "unknown"
  } catch {
    return "unknown"
  }
}

async function buildPlugin(
  pluginDir: string,
  name: string,
  onProgress?: ProgressCallback,
): Promise<boolean> {
  try {
    report(onProgress, `  → ${name}: installing dependencies...`, "info")
    await runNpm(["install"], pluginDir)
    report(onProgress, `  → ${name}: building...`, "info")
    await runNpm(["run", "build"], pluginDir)
    return true
  } catch (error) {
    report(onProgress, `  ✗ ${name}: build failed`, "error")
    return false
  }
}

function needsBuild(pluginDir: string) {
  const distDir = path.join(pluginDir, "dist")
  return !fs.existsSync(distDir)
}

function parseExportsFromDts(content: string) {
  const exports: string[] = []
  const exportMatches = content.matchAll(/export\s*{\s*([^}]+)\s*}(?:\s*from\s*['"]([^'"]+)['"])?/g)
  for (const match of exportMatches) {
    const fromModule = match[2]
    if (fromModule?.startsWith("@")) continue

    const names = match[1]
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
    for (const name of names) {
      const cleanName = name.split(" as ").pop()?.trim() || name.trim()
      if (cleanName && !cleanName.startsWith("_") && !INTERNAL_EXPORTS.has(cleanName)) {
        const finalName = cleanName.replace(/^type\s+/, "")
        if (name.includes("type ")) {
          exports.push(`type ${finalName}`)
        } else {
          exports.push(finalName)
        }
      }
    }
  }
  return exports
}

async function regeneratePluginIndex() {
  if (!fs.existsSync(PLUGINS_DIR)) return

  const entries = await fs.promises.readdir(PLUGINS_DIR, { withFileTypes: true })
  const plugins = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

  const exports: string[] = []

  for (const pluginName of plugins) {
    const pluginDir = path.join(PLUGINS_DIR, pluginName)
    const distIndex = path.join(pluginDir, "dist", "index.d.ts")

    if (!fs.existsSync(distIndex)) continue

    const dtsContent = await fs.promises.readFile(distIndex, "utf-8")
    const exportedNames = parseExportsFromDts(dtsContent)

    if (exportedNames.length > 0) {
      const namedExports = exportedNames.filter((e) => !e.startsWith("type "))
      const typeExports = exportedNames.filter((e) => e.startsWith("type ")).map((e) => e.slice(5))

      if (namedExports.length > 0) {
        exports.push(`export { ${namedExports.join(", ")} } from "./${pluginName}"`)
      }
      if (typeExports.length > 0) {
        exports.push(`export type { ${typeExports.join(", ")} } from "./${pluginName}"`)
      }
    }
  }

  const indexContent = exports.join("\n") + "\n"
  const indexPath = path.join(PLUGINS_DIR, "index.ts")
  await fs.promises.writeFile(indexPath, indexContent)
}

export async function tuiPluginInstall(onProgress?: ProgressCallback): Promise<OperationResult> {
  const lockfile = readLockfile() as Lockfile | null

  if (!lockfile) {
    const message = "⚠ No quartz.lock.json found. Run 'npx quartz plugin add <repo>' first."
    report(onProgress, message, "warning")
    return { success: false, errors: [message] }
  }

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  }

  report(onProgress, "→ Installing plugins from lockfile...", "info")
  let installed = 0
  let failed = 0
  const errors: string[] = []
  const pluginsToBuild: Array<{ name: string; pluginDir: string }> = []

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(PLUGINS_DIR, name)

    if (fs.existsSync(pluginDir)) {
      try {
        const currentCommit = await getGitCommitAsync(pluginDir)
        if (currentCommit === entry.commit && !needsBuild(pluginDir)) {
          report(onProgress, `  ✓ ${name}@${shortCommit(entry.commit)} already installed`, "info")
          installed++
          continue
        }
        if (currentCommit !== entry.commit) {
          report(onProgress, `  → ${name}: updating to ${shortCommit(entry.commit)}...`, "info")
          await runGit(["fetch", "--depth", "1", "origin"], pluginDir)
          await runGit(["reset", "--hard", entry.commit], pluginDir)
        }
        pluginsToBuild.push({ name, pluginDir })
        installed++
      } catch (error) {
        const message = `  ✗ ${name}: failed to update`
        report(onProgress, message, "error")
        errors.push(error instanceof Error ? error.message : String(error))
        failed++
      }
    } else {
      try {
        report(onProgress, `  → ${name}: cloning...`, "info")
        await runGit(["clone", "--depth", "1", entry.resolved, pluginDir])
        if (entry.commit !== "unknown") {
          await runGit(["fetch", "--depth", "1", "origin", entry.commit], pluginDir)
          await runGit(["checkout", entry.commit], pluginDir)
        }
        report(onProgress, `  ✓ ${name}@${shortCommit(entry.commit)}`, "success")
        pluginsToBuild.push({ name, pluginDir })
        installed++
      } catch (error) {
        const message = `  ✗ ${name}: failed to clone`
        report(onProgress, message, "error")
        errors.push(error instanceof Error ? error.message : String(error))
        failed++
      }
    }
  }

  if (pluginsToBuild.length > 0) {
    report(onProgress, "→ Building plugins...", "info")
    for (const { name, pluginDir } of pluginsToBuild) {
      if (!(await buildPlugin(pluginDir, name, onProgress))) {
        failed++
        installed--
      } else {
        report(onProgress, `  ✓ ${name} built`, "success")
      }
    }
  }

  await regeneratePluginIndex()

  if (failed === 0) {
    report(onProgress, `✓ Installed ${installed} plugin(s)`, "success")
  } else {
    report(onProgress, `⚠ Installed ${installed} plugin(s), ${failed} failed`, "warning")
  }

  return { success: failed === 0, installed, failed, errors }
}

export async function tuiPluginAdd(
  sources: string[],
  onProgress?: ProgressCallback,
): Promise<OperationResult> {
  let lockfile = readLockfile() as Lockfile | null
  if (!lockfile) {
    lockfile = { version: "1.0.0", plugins: {} }
  }

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  }

  const addedPlugins: Array<{ name: string; pluginDir: string; source: string }> = []
  const errors: string[] = []
  let failed = 0

  for (const source of sources) {
    try {
      const { name, url, ref } = parseGitSource(source)
      const pluginDir = path.join(PLUGINS_DIR, name)

      if (fs.existsSync(pluginDir)) {
        report(onProgress, `⚠ ${name} already exists. Use 'update' to refresh.`, "warning")
        continue
      }

      report(onProgress, `→ Adding ${name} from ${url}...`, "info")

      if (ref) {
        await runGit(["clone", "--depth", "1", "--branch", ref, url, pluginDir])
      } else {
        await runGit(["clone", "--depth", "1", url, pluginDir])
      }

      const commit = await getGitCommitAsync(pluginDir)
      lockfile.plugins[name] = {
        source,
        resolved: url,
        commit,
        installedAt: new Date().toISOString(),
      }

      addedPlugins.push({ name, pluginDir, source })
      report(onProgress, `✓ Added ${name}@${shortCommit(commit)}`, "success")
    } catch (error) {
      const message = `✗ Failed to add ${source}: ${error instanceof Error ? error.message : error}`
      report(onProgress, message, "error")
      errors.push(error instanceof Error ? error.message : String(error))
      failed++
    }
  }

  if (addedPlugins.length > 0) {
    report(onProgress, "→ Building plugins...", "info")
    for (const { name, pluginDir } of addedPlugins) {
      if (await buildPlugin(pluginDir, name, onProgress)) {
        report(onProgress, `  ✓ ${name} built`, "success")
      }
    }
    await regeneratePluginIndex()
  }

  writeLockfile(lockfile)
  const pluginsJson = readPluginsJson() as PluginsJson | null
  if (pluginsJson?.plugins) {
    for (const { pluginDir, source } of addedPlugins) {
      const manifest = readManifestFromPackageJson(pluginDir) as PluginManifest | null
      const newEntry: PluginsJsonEntry = {
        source,
        enabled: manifest?.defaultEnabled ?? true,
        options: manifest?.defaultOptions ?? {},
        order: manifest?.defaultOrder ?? 50,
      }

      if (manifest?.components) {
        const firstComponentKey = Object.keys(manifest.components)[0]
        const comp = manifest.components[firstComponentKey]
        if (comp?.defaultPosition) {
          newEntry.layout = {
            position: comp.defaultPosition,
            priority: comp.defaultPriority ?? 50,
            display: "all",
          }
        }
      }

      pluginsJson.plugins.push(newEntry)
    }
    writePluginsJson(pluginsJson as Record<string, unknown>)
  }

  report(onProgress, "Updated quartz.lock.json", "info")
  return { success: failed === 0, installed: addedPlugins.length, failed, errors }
}

export async function tuiPluginRemove(
  names: string[],
  onProgress?: ProgressCallback,
): Promise<OperationResult> {
  const lockfile = readLockfile() as Lockfile | null
  if (!lockfile) {
    const message = "⚠ No plugins installed"
    report(onProgress, message, "warning")
    return { success: false, errors: [message] }
  }

  let removed = false
  let removedCount = 0
  const errors: string[] = []

  for (const name of names) {
    const pluginDir = path.join(PLUGINS_DIR, name)

    if (!lockfile.plugins[name] && !fs.existsSync(pluginDir)) {
      report(onProgress, `⚠ ${name} is not installed`, "warning")
      continue
    }

    report(onProgress, `→ Removing ${name}...`, "info")

    try {
      if (fs.existsSync(pluginDir)) {
        fs.rmSync(pluginDir, { recursive: true })
      }

      delete lockfile.plugins[name]
      report(onProgress, `✓ Removed ${name}`, "success")
      removed = true
      removedCount++
    } catch (error) {
      report(onProgress, `✗ Failed to remove ${name}`, "error")
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (removed) {
    await regeneratePluginIndex()
  }

  writeLockfile(lockfile)
  const pluginsJson = readPluginsJson() as PluginsJson | null
  if (pluginsJson?.plugins) {
    pluginsJson.plugins = pluginsJson.plugins.filter(
      (plugin) =>
        !names.includes(extractPluginName(plugin.source)) && !names.includes(plugin.source),
    )
    writePluginsJson(pluginsJson as Record<string, unknown>)
  }

  report(onProgress, "Updated quartz.lock.json", "info")
  return { success: errors.length === 0, installed: removedCount, failed: errors.length, errors }
}

export async function tuiPluginUpdate(
  names?: string[],
  onProgress?: ProgressCallback,
): Promise<OperationResult> {
  const lockfile = readLockfile() as Lockfile | null
  if (!lockfile) {
    const message = "⚠ No plugins installed"
    report(onProgress, message, "warning")
    return { success: false, errors: [message] }
  }

  const pluginsToUpdate = names ?? Object.keys(lockfile.plugins)
  const updatedPlugins: Array<{ name: string; pluginDir: string }> = []
  const errors: string[] = []
  let failed = 0

  for (const name of pluginsToUpdate) {
    const entry = lockfile.plugins[name]
    if (!entry) {
      report(onProgress, `⚠ ${name} is not installed`, "warning")
      continue
    }

    const pluginDir = path.join(PLUGINS_DIR, name)
    if (!fs.existsSync(pluginDir)) {
      report(onProgress, `⚠ ${name} directory missing. Run 'npx quartz plugin install'.`, "warning")
      continue
    }

    try {
      report(onProgress, `→ Updating ${name}...`, "info")
      await runGit(["fetch", "--depth", "1", "origin"], pluginDir)
      await runGit(["reset", "--hard", "origin/HEAD"], pluginDir)

      const newCommit = await getGitCommitAsync(pluginDir)
      if (newCommit !== entry.commit) {
        entry.commit = newCommit
        entry.installedAt = new Date().toISOString()
        updatedPlugins.push({ name, pluginDir })
        report(onProgress, `✓ Updated ${name} to ${shortCommit(newCommit)}`, "success")
      } else {
        report(onProgress, `✓ ${name} already up to date`, "info")
      }
    } catch (error) {
      const message = `✗ Failed to update ${name}: ${error instanceof Error ? error.message : error}`
      report(onProgress, message, "error")
      errors.push(error instanceof Error ? error.message : String(error))
      failed++
    }
  }

  if (updatedPlugins.length > 0) {
    report(onProgress, "→ Rebuilding updated plugins...", "info")
    for (const { name, pluginDir } of updatedPlugins) {
      if (await buildPlugin(pluginDir, name, onProgress)) {
        report(onProgress, `  ✓ ${name} rebuilt`, "success")
      }
    }
    await regeneratePluginIndex()
  }

  writeLockfile(lockfile)
  report(onProgress, "Updated quartz.lock.json", "info")

  return {
    success: failed === 0,
    updated: updatedPlugins.map((plugin) => plugin.name),
    failed,
    errors,
  }
}

export async function tuiPluginRestore(onProgress?: ProgressCallback): Promise<OperationResult> {
  const lockfile = readLockfile() as Lockfile | null
  if (!lockfile) {
    const message = "✗ No quartz.lock.json found. Cannot restore."
    report(onProgress, message, "error")
    report(
      onProgress,
      "Run 'npx quartz plugin add <repo>' to install plugins from scratch.",
      "info",
    )
    return { success: false, errors: [message] }
  }

  report(onProgress, "→ Restoring plugins from lockfile...", "info")

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  }

  let installed = 0
  let failed = 0
  const restoredPlugins: Array<{ name: string; pluginDir: string }> = []
  const errors: string[] = []

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(PLUGINS_DIR, name)

    if (fs.existsSync(pluginDir)) {
      report(onProgress, `⚠ ${name}: directory exists, skipping`, "warning")
      continue
    }

    try {
      report(
        onProgress,
        `→ ${name}: cloning ${entry.resolved}@${shortCommit(entry.commit)}...`,
        "info",
      )
      await runGit(["clone", entry.resolved, pluginDir])
      await runGit(["checkout", entry.commit], pluginDir)
      report(onProgress, `✓ ${name} restored`, "success")
      restoredPlugins.push({ name, pluginDir })
      installed++
    } catch (error) {
      report(onProgress, `✗ ${name}: failed to restore`, "error")
      errors.push(error instanceof Error ? error.message : String(error))
      failed++
    }
  }

  if (restoredPlugins.length > 0) {
    report(onProgress, "→ Building restored plugins...", "info")
    for (const { name, pluginDir } of restoredPlugins) {
      if (!(await buildPlugin(pluginDir, name, onProgress))) {
        failed++
        installed--
      } else {
        report(onProgress, `  ✓ ${name} built`, "success")
      }
    }
    await regeneratePluginIndex()
  }

  if (failed === 0) {
    report(onProgress, `✓ Restored ${installed} plugin(s)`, "success")
  } else {
    report(onProgress, `⚠ Restored ${installed} plugin(s), ${failed} failed`, "warning")
  }

  return { success: failed === 0, installed, failed, errors }
}
