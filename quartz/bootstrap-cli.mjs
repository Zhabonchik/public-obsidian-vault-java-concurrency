#!/usr/bin/env -S node --no-deprecation
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import {
  handleBuild,
  handleCreate,
  handleUpdate,
  handleRestore,
  handleSync,
} from "./cli/handlers.js"
import { handleMigrate } from "./cli/migrate-handler.js"
import {
  handlePluginInstall as handleGitPluginInstall,
  handlePluginAdd,
  handlePluginRemove,
  handlePluginUpdate,
  handlePluginRestore,
  handlePluginList,
  handlePluginEnable,
  handlePluginDisable,
  handlePluginConfig,
  handlePluginCheck,
} from "./cli/plugin-git-handlers.js"
import {
  CommonArgv,
  BuildArgv,
  CreateArgv,
  SyncArgv,
  PluginInstallArgv,
  PluginUninstallArgv,
  PluginSearchArgv,
} from "./cli/args.js"
import { version } from "./cli/constants.js"

yargs(hideBin(process.argv))
  .scriptName("quartz")
  .version(version)
  .usage("$0 <cmd> [args]")
  .command("create", "Initialize Quartz", CreateArgv, async (argv) => {
    await handleCreate(argv)
  })
  .command("update", "Get the latest Quartz updates", CommonArgv, async (argv) => {
    await handleUpdate(argv)
  })
  .command(
    "restore",
    "Try to restore your content folder from the cache",
    CommonArgv,
    async (argv) => {
      await handleRestore(argv)
    },
  )
  .command("sync", "Sync your Quartz to and from GitHub.", SyncArgv, async (argv) => {
    await handleSync(argv)
  })
  .command("build", "Build Quartz into a bundle of static HTML files", BuildArgv, async (argv) => {
    await handleBuild(argv)
  })
  .command("migrate", "Migrate old config to quartz.plugins.json", CommonArgv, async () => {
    await handleMigrate()
  })
  .command(
    "plugin <subcommand>",
    "Manage Quartz plugins",
    (yargs) => {
      return yargs
        .command("install", "Install plugins from quartz.lock.json", CommonArgv, async () => {
          await handleGitPluginInstall()
        })
        .command("add <repos..>", "Add plugins from Git repositories", CommonArgv, async (argv) => {
          await handlePluginAdd(argv.repos)
        })
        .command("remove <names..>", "Remove installed plugins", CommonArgv, async (argv) => {
          await handlePluginRemove(argv.names)
        })
        .command(
          "update [names..]",
          "Update installed plugins to latest version",
          CommonArgv,
          async (argv) => {
            await handlePluginUpdate(argv.names)
          },
        )
        .command("list", "List all installed plugins", CommonArgv, async () => {
          await handlePluginList()
        })
        .command(
          "restore",
          "Restore plugins from lockfile (exact versions)",
          CommonArgv,
          async () => {
            await handlePluginRestore()
          },
        )
        .command(
          "enable <names..>",
          "Enable plugins in quartz.plugins.json",
          CommonArgv,
          async (argv) => {
            await handlePluginEnable(argv.names)
          },
        )
        .command(
          "disable <names..>",
          "Disable plugins in quartz.plugins.json",
          CommonArgv,
          async (argv) => {
            await handlePluginDisable(argv.names)
          },
        )
        .command(
          "config <name>",
          "View or set plugin configuration",
          {
            ...CommonArgv,
            set: {
              string: true,
              describe: "Set a config value (key=value)",
            },
          },
          async (argv) => {
            await handlePluginConfig(argv.name, { set: argv.set })
          },
        )
        .command("check", "Check for plugin updates", CommonArgv, async () => {
          await handlePluginCheck()
        })
        .demandCommand(1, "Please specify a plugin subcommand")
    },
    async () => {
      // This handler is called when no subcommand is provided
    },
  )
  .showHelpOnFail(false)
  .help()
  .strict()
  .demandCommand().argv
