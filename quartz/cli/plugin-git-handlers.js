import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { styleText } from "util"

const LOCKFILE_PATH = path.join(process.cwd(), "quartz.lock.json")
const PLUGINS_DIR = path.join(process.cwd(), ".quartz", "plugins")

function readLockfile() {
  if (!fs.existsSync(LOCKFILE_PATH)) {
    return null
  }
  try {
    const content = fs.readFileSync(LOCKFILE_PATH, "utf-8")
    return JSON.parse(content)
  } catch {
    return null
  }
}

function writeLockfile(lockfile) {
  fs.writeFileSync(LOCKFILE_PATH, JSON.stringify(lockfile, null, 2))
}

function parseGitSource(source) {
  if (source.startsWith("github:")) {
    const [repoPath, ref] = source.replace("github:", "").split("#")
    const [owner, repo] = repoPath.split("/")
    return { name: repo, url: `https://github.com/${owner}/${repo}.git`, ref }
  }
  if (source.startsWith("git+")) {
    const url = source.replace("git+", "")
    const name = path.basename(url, ".git")
    return { name, url }
  }
  if (source.startsWith("https://")) {
    const name = path.basename(source, ".git")
    return { name, url: source }
  }
  throw new Error(`Cannot parse plugin source: ${source}`)
}

function getGitCommit(pluginDir) {
  try {
    return execSync("git rev-parse HEAD", { cwd: pluginDir, encoding: "utf-8" }).trim()
  } catch {
    return "unknown"
  }
}

export async function handlePluginInstall() {
  const lockfile = readLockfile()

  if (!lockfile) {
    console.log(styleText("yellow", "⚠ No quartz.lock.json found. Run 'npx quartz plugin add <repo>' first."))
    return
  }

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  }

  console.log(styleText("cyan", "→ Installing plugins from lockfile..."))
  let installed = 0
  let failed = 0

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(PLUGINS_DIR, name)

    if (fs.existsSync(pluginDir)) {
      try {
        const currentCommit = getGitCommit(pluginDir)
        if (currentCommit === entry.commit) {
          console.log(styleText("gray", `  ✓ ${name}@${entry.commit.slice(0, 7)} already installed`))
          installed++
          continue
        }
        console.log(styleText("cyan", `  → ${name}: updating to ${entry.commit.slice(0, 7)}...`))
        execSync("git fetch --depth 1 origin", { cwd: pluginDir, stdio: "ignore" })
        execSync(`git reset --hard ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
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
          execSync(`git fetch --depth 1 origin ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
          execSync(`git checkout ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
        }
        console.log(styleText("green", `  ✓ ${name}@${entry.commit.slice(0, 7)}`))
        installed++
      } catch {
        console.log(styleText("red", `  ✗ ${name}: failed to clone`))
        failed++
      }
    }
  }

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

      console.log(styleText("green", `✓ Added ${name}@${commit.slice(0, 7)}`))
    } catch (error) {
      console.log(styleText("red", `✗ Failed to add ${source}: ${error}`))
    }
  }

  writeLockfile(lockfile)
  console.log()
  console.log(styleText("gray", "Updated quartz.lock.json"))
}

export async function handlePluginRemove(names) {
  const lockfile = readLockfile()
  if (!lockfile) {
    console.log(styleText("yellow", "⚠ No plugins installed"))
    return
  }

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
  }

  writeLockfile(lockfile)
  console.log()
  console.log(styleText("gray", "Updated quartz.lock.json"))
}

export async function handlePluginUpdate(names) {
  const lockfile = readLockfile()
  if (!lockfile) {
    console.log(styleText("yellow", "⚠ No plugins installed"))
    return
  }

  const pluginsToUpdate = names || Object.keys(lockfile.plugins)

  for (const name of pluginsToUpdate) {
    const entry = lockfile.plugins[name]
    if (!entry) {
      console.log(styleText("yellow", `⚠ ${name} is not installed`))
      continue
    }

    const pluginDir = path.join(PLUGINS_DIR, name)
    if (!fs.existsSync(pluginDir)) {
      console.log(styleText("yellow", `⚠ ${name} directory missing. Run 'npx quartz plugin install'.`))
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
        console.log(styleText("green", `✓ Updated ${name} to ${newCommit.slice(0, 7)}`))
      } else {
        console.log(styleText("gray", `✓ ${name} already up to date`))
      }
    } catch (error) {
      console.log(styleText("red", `✗ Failed to update ${name}: ${error}`))
    }
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

  for (const [name, entry] of Object.entries(lockfile.plugins)) {
    const pluginDir = path.join(pluginsDir, name)

    if (fs.existsSync(pluginDir)) {
      console.log(styleText("yellow", `⚠ ${name}: directory exists, skipping`))
      continue
    }

    try {
      console.log(styleText("cyan", `→ ${name}: cloning ${entry.resolved}@${entry.commit.slice(0, 7)}...`))
      execSync(`git clone ${entry.resolved} ${pluginDir}`, { stdio: "ignore" })
      execSync(`git checkout ${entry.commit}`, { cwd: pluginDir, stdio: "ignore" })
      console.log(styleText("green", `✓ ${name} restored`))
      installed++
    } catch {
      console.log(styleText("red", `✗ ${name}: failed to restore`))
      failed++
    }
  }

  console.log()
  if (failed === 0) {
    console.log(styleText("green", `✓ Restored ${installed} plugin(s)`))
  } else {
    console.log(styleText("yellow", `⚠ Restored ${installed} plugin(s), ${failed} failed`))
  }
}
