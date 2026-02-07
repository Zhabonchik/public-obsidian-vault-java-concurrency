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
import {
  handlePluginInstall,
  handlePluginList,
  handlePluginSearch,
  handlePluginUninstall,
} from "./cli/plugin-handlers.js"
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
  .command(
    "plugin <subcommand>",
    "Manage Quartz plugins",
    (yargs) => {
      return yargs
        .command(
          "install <packages..>",
          "Install Quartz plugins from npm",
          PluginInstallArgv,
          async (argv) => {
            await handlePluginInstall(argv.packages)
          },
        )
        .command(
          "uninstall <packages..>",
          "Uninstall Quartz plugins",
          PluginUninstallArgv,
          async (argv) => {
            await handlePluginUninstall(argv.packages)
          },
        )
        .command("list", "List installed Quartz plugins", CommonArgv, async () => {
          await handlePluginList()
        })
        .command(
          "search [query]",
          "Search for Quartz plugins on npm",
          PluginSearchArgv,
          async (argv) => {
            await handlePluginSearch(argv.query)
          },
        )
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
