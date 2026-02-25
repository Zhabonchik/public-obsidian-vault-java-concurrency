---
title: CLI Reference
---

The Quartz CLI is the primary way to interact with your Quartz project. It provides commands for creating new projects, building static sites, syncing with GitHub, and managing plugins.

You can run the CLI using `npx quartz`.

## Quick Reference

| Command  | Description                           | Example                  |
| -------- | ------------------------------------- | ------------------------ |
| `create` | Initialize a new Quartz project       | `npx quartz create`      |
| `build`  | Generate static HTML files            | `npx quartz build`       |
| `sync`   | Sync content with GitHub              | `npx quartz sync`        |
| `update` | Update Quartz to the latest version   | `npx quartz update`      |
| `plugin` | Manage Quartz plugins                 | `npx quartz plugin list` |
| `tui`    | Launch the interactive plugin manager | `npx quartz tui`         |

## Commands

- [[cli/create|create]]: Initialize a new Quartz project from scratch or an existing vault.
- [[cli/build|build]]: Build your Quartz site into static HTML. Includes a development server.
- [[cli/sync|sync]]: Push and pull changes between your local machine and GitHub.
- [[cli/update|update]]: Pull the latest changes from the official Quartz repository.
- [[cli/restore|restore]]: Recover your content folder from the local cache.
- [[cli/migrate|migrate]]: Convert older configuration files to the new YAML format.
- [[cli/plugin|plugin]]: Install, add, remove, and configure plugins from the command line.
- [[cli/tui|tui]]: Use a terminal interface to manage plugins and layout.

## Help and Versioning

To see a full list of available flags for any command, use the `--help` flag.

```shell
npx quartz --help
npx quartz build --help
```

To check which version of Quartz you are currently running, use the `--version` flag.

```shell
npx quartz --version
```
