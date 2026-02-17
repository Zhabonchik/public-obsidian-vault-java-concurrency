import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { styleText } from "util"
import {
  readPluginsJson,
  writePluginsJson,
  readLockfile,
  writeLockfile,
  extractPluginName,
  readManifestFromPackageJson,
  parseGitSource,
  getGitCommit,
  PLUGINS_DIR,
  LOCKFILE_PATH,
} from "./plugin-data.js"

const INTERNAL_EXPORTS = new Set(["manifest", "default"])

function buildPlugin(pluginDir, name) {
  try {
    console.log(styleText("cyan", `  → ${name}: installing dependencies...`))
    execSync("npm install", { cwd: pluginDir, stdio: "ignore" })
    console.log(styleText("cyan", `  → ${name}: building...`))
    execSync("npm run build", { cwd: pluginDir, stdio: "ignore" })
    return true
  } catch (error) {
    console.log(styleText("red", `  ✗ ${name}: build failed`))
    return false
  }
}

function needsBuild(pluginDir) {
  const distDir = path.join(pluginDir, "dist")
  return !fs.existsSync(distDir)
}

function parseExportsFromDts(content) {
  const exports = []
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

  const plugins = fs.readdirSync(PLUGINS_DIR).filter((name) => {
    const pluginPath = path.join(PLUGINS_DIR, name)
    return fs.statSync(pluginPath).isDirectory()
  })

  const exports = []

  for (const pluginName of plugins) {
    const pluginDir = path.join(PLUGINS_DIR, pluginName)
    const distIndex = path.join(pluginDir, "dist", "index.d.ts")

    if (!fs.existsSync(distIndex)) continue

    const dtsContent = fs.readFileSync(distIndex, "utf-8")
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
  fs.writeFileSync(indexPath, indexContent)
}

export async function handlePluginInstall() {
  const lockfile = readLockfile()

  if (!lockfile) {
    console.log(
      styleText("yellow", "⚠ No quartz.lock.json found. Run 'npx quartz plugin add <repo>' first."),
    )
    return
  }

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  }

  console.log(styleText("cyan", "→ Installing plugins from lockfile..."))
  let installed = 0
  let failed = 0
  const pluginsToBuild = []

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(PLUGINS_DIR, name)

    if (fs.existsSync(pluginDir)) {
      try {
        const currentCommit = getGitCommit(pluginDir)
        if (currentCommit === entry.commit && !needsBuild(pluginDir)) {
          console.log(
            styleText("gray", `  ✓ ${name}@${entry.commit.slice(0, 7)} already installed`),
          )
          installed++
          continue
        }
        if (currentCommit !== entry.commit) {
          console.log(styleText("cyan", `  → ${name}: updating to ${entry.commit.slice(0, 7)}...`))
          execSync("git fetch --depth 1 origin", { cwd: pluginDir, stdio: "ignore" })
          execSync(`git reset --hard ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
        }
        pluginsToBuild.push({ name, pluginDir })
        installed++
      } catch {
        console.log(styleText("red", `  ✗ ${name}: failed to update`))
        failed++
      }
    } else {
      try {
        console.log(styleText("cyan", `  → ${name}: cloning...`))
        execSync(`git clone --depth 1 ${entry.resolved} ${pluginDir}`, { stdio: "ignore" })
        if (entry.commit !== "unknown") {
          execSync(`git fetch --depth 1 origin ${entry.commit}`, {
            cwd: pluginDir,
            stdio: "ignore",
          })
          execSync(`git checkout ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
        }
        console.log(styleText("green", `  ✓ ${name}@${entry.commit.slice(0, 7)}`))
        pluginsToBuild.push({ name, pluginDir })
        installed++
      } catch {
        console.log(styleText("red", `  ✗ ${name}: failed to clone`))
        failed++
      }
    }
  }

  if (pluginsToBuild.length > 0) {
    console.log()
    console.log(styleText("cyan", "→ Building plugins..."))
    for (const { name, pluginDir } of pluginsToBuild) {
      if (!buildPlugin(pluginDir, name)) {
        failed++
        installed--
      } else {
        console.log(styleText("green", `  ✓ ${name} built`))
      }
    }
  }

  await regeneratePluginIndex()

  console.log()
  if (failed === 0) {
    console.log(styleText("green", `✓ Installed ${installed} plugin(s)`))
  } else {
    console.log(styleText("yellow", `⚠ Installed ${installed} plugin(s), ${failed} failed`))
  }
}

export async function handlePluginAdd(sources) {
  let lockfile = readLockfile()
  if (!lockfile) {
    lockfile = { version: "1.0.0", plugins: {} }
  }

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  }

  const addedPlugins = []

  for (const source of sources) {
    try {
      const { name, url, ref } = parseGitSource(source)
      const pluginDir = path.join(PLUGINS_DIR, name)

      if (fs.existsSync(pluginDir)) {
        console.log(styleText("yellow", `⚠ ${name} already exists. Use 'update' to refresh.`))
        continue
      }

      console.log(styleText("cyan", `→ Adding ${name} from ${url}...`))

      if (ref) {
        execSync(`git clone --depth 1 --branch ${ref} ${url} ${pluginDir}`, { stdio: "ignore" })
      } else {
        execSync(`git clone --depth 1 ${url} ${pluginDir}`, { stdio: "ignore" })
      }

      const commit = getGitCommit(pluginDir)
      lockfile.plugins[name] = {
        source,
        resolved: url,
        commit,
        installedAt: new Date().toISOString(),
      }

      addedPlugins.push({ name, pluginDir, source })
      console.log(styleText("green", `✓ Added ${name}@${commit.slice(0, 7)}`))
    } catch (error) {
      console.log(styleText("red", `✗ Failed to add ${source}: ${error}`))
    }
  }

  if (addedPlugins.length > 0) {
    console.log()
    console.log(styleText("cyan", "→ Building plugins..."))
    for (const { name, pluginDir } of addedPlugins) {
      if (buildPlugin(pluginDir, name)) {
        console.log(styleText("green", `  ✓ ${name} built`))
      }
    }
    await regeneratePluginIndex()
  }

  writeLockfile(lockfile)
  const pluginsJson = readPluginsJson()
  if (pluginsJson?.plugins) {
    for (const { pluginDir, source } of addedPlugins) {
      const manifest = readManifestFromPackageJson(pluginDir)
      const newEntry = {
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
    writePluginsJson(pluginsJson)
  }
  console.log()
  console.log(styleText("gray", "Updated quartz.lock.json"))
}

export async function handlePluginRemove(names) {
  const lockfile = readLockfile()
  if (!lockfile) {
    console.log(styleText("yellow", "⚠ No plugins installed"))
    return
  }

  let removed = false
  for (const name of names) {
    const pluginDir = path.join(PLUGINS_DIR, name)

    if (!lockfile.plugins[name] && !fs.existsSync(pluginDir)) {
      console.log(styleText("yellow", `⚠ ${name} is not installed`))
      continue
    }

    console.log(styleText("cyan", `→ Removing ${name}...`))

    if (fs.existsSync(pluginDir)) {
      fs.rmSync(pluginDir, { recursive: true })
    }

    delete lockfile.plugins[name]
    console.log(styleText("green", `✓ Removed ${name}`))
    removed = true
  }

  if (removed) {
    await regeneratePluginIndex()
  }

  writeLockfile(lockfile)
  const pluginsJson = readPluginsJson()
  if (pluginsJson?.plugins) {
    pluginsJson.plugins = pluginsJson.plugins.filter(
      (plugin) =>
        !names.includes(extractPluginName(plugin.source)) && !names.includes(plugin.source),
    )
    writePluginsJson(pluginsJson)
  }
  console.log()
  console.log(styleText("gray", "Updated quartz.lock.json"))
}

export async function handlePluginEnable(names) {
  const json = readPluginsJson()
  if (!json) {
    console.log(styleText("red", "✗ No quartz.plugins.json found. Cannot enable plugins."))
    return
  }

  for (const name of names) {
    const entry = json.plugins.find(
      (e) => extractPluginName(e.source) === name || e.source === name,
    )
    if (!entry) {
      console.log(styleText("yellow", `⚠ Plugin "${name}" not found in quartz.plugins.json`))
      continue
    }
    if (entry.enabled) {
      console.log(styleText("gray", `✓ ${name} is already enabled`))
      continue
    }
    entry.enabled = true
    console.log(styleText("green", `✓ Enabled ${name}`))
  }

  writePluginsJson(json)
}

export async function handlePluginDisable(names) {
  const json = readPluginsJson()
  if (!json) {
    console.log(styleText("red", "✗ No quartz.plugins.json found. Cannot disable plugins."))
    return
  }

  for (const name of names) {
    const entry = json.plugins.find(
      (e) => extractPluginName(e.source) === name || e.source === name,
    )
    if (!entry) {
      console.log(styleText("yellow", `⚠ Plugin "${name}" not found in quartz.plugins.json`))
      continue
    }
    if (!entry.enabled) {
      console.log(styleText("gray", `✓ ${name} is already disabled`))
      continue
    }
    entry.enabled = false
    console.log(styleText("green", `✓ Disabled ${name}`))
  }

  writePluginsJson(json)
}

export async function handlePluginConfig(name, options = {}) {
  const json = readPluginsJson()
  if (!json) {
    console.log(styleText("red", "✗ No quartz.plugins.json found."))
    return
  }

  const entry = json.plugins.find((e) => extractPluginName(e.source) === name || e.source === name)
  if (!entry) {
    console.log(styleText("red", `✗ Plugin "${name}" not found in quartz.plugins.json`))
    return
  }

  if (options.set) {
    const eqIndex = options.set.indexOf("=")
    if (eqIndex === -1) {
      console.log(styleText("red", "✗ Invalid format. Use: --set key=value"))
      return
    }
    const key = options.set.slice(0, eqIndex)
    let value = options.set.slice(eqIndex + 1)

    try {
      value = JSON.parse(value)
    } catch {}

    if (!entry.options) entry.options = {}
    entry.options[key] = value
    writePluginsJson(json)
    console.log(styleText("green", `✓ Set ${name}.${key} = ${JSON.stringify(value)}`))
  } else {
    console.log(styleText("bold", `Plugin: ${name}`))
    console.log(`  Source: ${entry.source}`)
    console.log(`  Enabled: ${entry.enabled}`)
    console.log(`  Order: ${entry.order ?? 50}`)
    if (entry.options && Object.keys(entry.options).length > 0) {
      console.log(`  Options:`)
      for (const [k, v] of Object.entries(entry.options)) {
        console.log(`    ${k}: ${JSON.stringify(v)}`)
      }
    } else {
      console.log(`  Options: (none)`)
    }
    if (entry.layout) {
      console.log(`  Layout:`)
      for (const [k, v] of Object.entries(entry.layout)) {
        console.log(`    ${k}: ${JSON.stringify(v)}`)
      }
    }
  }
}

export async function handlePluginCheck() {
  const lockfile = readLockfile()
  if (!lockfile || Object.keys(lockfile.plugins).length === 0) {
    console.log(styleText("gray", "No plugins installed"))
    return
  }

  console.log(styleText("bold", "Checking for plugin updates...\n"))

  const results = []
  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    try {
      const latestCommit = execSync(`git ls-remote ${entry.resolved} HEAD`, {
        encoding: "utf-8",
      })
        .split("\t")[0]
        .trim()

      const isCurrent = latestCommit === entry.commit
      results.push({
        name,
        installed: entry.commit.slice(0, 7),
        latest: latestCommit.slice(0, 7),
        status: isCurrent ? "up to date" : "update available",
      })
    } catch {
      results.push({
        name,
        installed: entry.commit.slice(0, 7),
        latest: "?",
        status: "check failed",
      })
    }
  }

  const nameWidth = Math.max(6, ...results.map((r) => r.name.length)) + 2
  const header = `${"Plugin".padEnd(nameWidth)}${"Installed".padEnd(12)}${"Latest".padEnd(12)}Status`
  console.log(styleText("bold", header))
  console.log("─".repeat(header.length))

  for (const r of results) {
    const color =
      r.status === "up to date" ? "green" : r.status === "check failed" ? "red" : "yellow"
    console.log(
      `${r.name.padEnd(nameWidth)}${r.installed.padEnd(12)}${r.latest.padEnd(12)}${styleText(
        color,
        r.status,
      )}`,
    )
  }
}

export async function handlePluginUpdate(names) {
  const lockfile = readLockfile()
  if (!lockfile) {
    console.log(styleText("yellow", "⚠ No plugins installed"))
    return
  }

  const pluginsToUpdate = names || Object.keys(lockfile.plugins)
  const updatedPlugins = []

  for (const name of pluginsToUpdate) {
    const entry = lockfile.plugins[name]
    if (!entry) {
      console.log(styleText("yellow", `⚠ ${name} is not installed`))
      continue
    }

    const pluginDir = path.join(PLUGINS_DIR, name)
    if (!fs.existsSync(pluginDir)) {
      console.log(
        styleText("yellow", `⚠ ${name} directory missing. Run 'npx quartz plugin install'.`),
      )
      continue
    }

    try {
      console.log(styleText("cyan", `→ Updating ${name}...`))
      execSync("git fetch --depth 1 origin", { cwd: pluginDir, stdio: "ignore" })
      execSync("git reset --hard origin/HEAD", { cwd: pluginDir, stdio: "ignore" })

      const newCommit = getGitCommit(pluginDir)
      if (newCommit !== entry.commit) {
        entry.commit = newCommit
        entry.installedAt = new Date().toISOString()
        updatedPlugins.push({ name, pluginDir })
        console.log(styleText("green", `✓ Updated ${name} to ${newCommit.slice(0, 7)}`))
      } else {
        console.log(styleText("gray", `✓ ${name} already up to date`))
      }
    } catch (error) {
      console.log(styleText("red", `✗ Failed to update ${name}: ${error}`))
    }
  }

  if (updatedPlugins.length > 0) {
    console.log()
    console.log(styleText("cyan", "→ Rebuilding updated plugins..."))
    for (const { name, pluginDir } of updatedPlugins) {
      if (buildPlugin(pluginDir, name)) {
        console.log(styleText("green", `  ✓ ${name} rebuilt`))
      }
    }
    await regeneratePluginIndex()
  }

  writeLockfile(lockfile)
  console.log()
  console.log(styleText("gray", "Updated quartz.lock.json"))
}

export async function handlePluginList() {
  const lockfile = readLockfile()
  if (!lockfile || Object.keys(lockfile.plugins).length === 0) {
    console.log(styleText("gray", "No plugins installed"))
    return
  }

  console.log(styleText("bold", "Installed Plugins:"))
  console.log()

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(PLUGINS_DIR, name)
    const exists = fs.existsSync(pluginDir)
    let currentCommit = entry.commit

    if (exists) {
      currentCommit = getGitCommit(pluginDir)
    }

    const status = exists
      ? currentCommit === entry.commit
        ? styleText("green", "✓")
        : styleText("yellow", "⚡")
      : styleText("red", "✗")

    console.log(`  ${status} ${styleText("bold", name)}`)
    console.log(`    Source: ${entry.source}`)
    console.log(`    Commit: ${entry.commit.slice(0, 7)}`)
    if (currentCommit !== entry.commit && exists) {
      console.log(`    Current: ${currentCommit.slice(0, 7)} (modified)`)
    }
    console.log(`    Installed: ${new Date(entry.installedAt).toLocaleDateString()}`)
    console.log()
  }
}

export async function handlePluginRestore() {
  const lockfile = readLockfile()
  if (!lockfile) {
    console.log(styleText("red", "✗ No quartz.lock.json found. Cannot restore."))
    console.log()
    console.log("Run 'npx quartz plugin add <repo>' to install plugins from scratch.")
    return
  }

  console.log(styleText("cyan", "→ Restoring plugins from lockfile..."))
  console.log()

  const pluginsDir = path.join(process.cwd(), ".quartz", "plugins")
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true })
  }

  let installed = 0
  let failed = 0
  const restoredPlugins = []

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(pluginsDir, name)

    if (fs.existsSync(pluginDir)) {
      console.log(styleText("yellow", `⚠ ${name}: directory exists, skipping`))
      continue
    }

    try {
      console.log(
        styleText("cyan", `→ ${name}: cloning ${entry.resolved}@${entry.commit.slice(0, 7)}...`),
      )
      execSync(`git clone ${entry.resolved} ${pluginDir}`, { stdio: "ignore" })
      execSync(`git checkout ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
      console.log(styleText("green", `✓ ${name} restored`))
      restoredPlugins.push({ name, pluginDir })
      installed++
    } catch {
      console.log(styleText("red", `✗ ${name}: failed to restore`))
      failed++
    }
  }

  if (restoredPlugins.length > 0) {
    console.log()
    console.log(styleText("cyan", "→ Building restored plugins..."))
    for (const { name, pluginDir } of restoredPlugins) {
      if (!buildPlugin(pluginDir, name)) {
        failed++
        installed--
      } else {
        console.log(styleText("green", `  ✓ ${name} built`))
      }
    }
    await regeneratePluginIndex()
  }

  console.log()
  if (failed === 0) {
    console.log(styleText("green", `✓ Restored ${installed} plugin(s)`))
  } else {
    console.log(styleText("yellow", `⚠ Restored ${installed} plugin(s), ${failed} failed`))
  }
}
