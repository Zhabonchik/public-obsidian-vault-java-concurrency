---
title: quartz plugin
---

The `plugin` command is the heart of the Quartz v5 plugin management system. it allows you to install, configure, and update plugins directly from the command line.

All plugins are stored in the `.quartz/plugins/` directory, and their versions are tracked in `quartz.lock.json`.

## Subcommands

### list

List all currently installed plugins and their versions.

```shell
npx quartz plugin list
```

### add

Add a new plugin from a Git repository.

```shell
npx quartz plugin add github:username/repo
```

### remove

Remove an installed plugin.

```shell
npx quartz plugin remove plugin-name
```

### install

Install all plugins listed in your `quartz.lock.json` file. This is useful when setting up the project on a new machine.

```shell
npx quartz plugin install
```

### update

Update specific plugins or all plugins to their latest versions.

```shell
npx quartz plugin update plugin-name
npx quartz plugin update # updates all
```

### restore

Restore plugins to the exact versions specified in the lockfile. Unlike `install`, this will downgrade plugins if the lockfile specifies an older version. This is recommended for CI/CD environments.

```shell
npx quartz plugin restore
```

### enable / disable

Toggle a plugin's status in your `quartz.config.yaml` without removing its files.

```shell
npx quartz plugin enable plugin-name
npx quartz plugin disable plugin-name
```

### config

View or modify the configuration for a specific plugin.

```shell
# View config
npx quartz plugin config plugin-name

# Set a value
npx quartz plugin config plugin-name --set key=value
```

### check

Check if any of your installed plugins have updates available.

```shell
npx quartz plugin check
```

### prune

Remove installed plugins that are no longer referenced in your `quartz.config.yaml`. This is useful for cleaning up after removing plugin entries from your configuration.

```shell
npx quartz plugin prune
```

Use `--dry-run` to preview which plugins would be removed without making changes:

```shell
npx quartz plugin prune --dry-run
```

### resolve

Install plugins that are listed in your `quartz.config.yaml` but missing from the lockfile. This is the inverse of `prune` — it ensures your installed plugins match your configuration.

```shell
npx quartz plugin resolve
```

Use `--dry-run` to preview which plugins would be installed without making changes:

```shell
npx quartz plugin resolve --dry-run
```

## Common Workflows

### Adding and Enabling a Plugin

To add a new plugin and start using it:

1. Add the plugin: `npx quartz plugin add github:quartz-community/example`
2. Enable it: `npx quartz plugin enable example`

### Updating Everything

To keep your plugins fresh:

```shell
npx quartz plugin update
```

### Managing Configuration

If you want to change a plugin setting without opening the YAML file:

```shell
npx quartz plugin config explorer --set useSavedState=true
```

### Cleaning Up Unused Plugins

If you've removed plugins from your config and want to clean up leftover files:

```shell
npx quartz plugin prune --dry-run  # preview first
npx quartz plugin prune            # remove orphaned plugins
```

### Setting Up from Config

When setting up on a new machine or in CI, resolve any plugins referenced in your config that aren't yet installed:

```shell
npx quartz plugin resolve
```

Both `prune` and `resolve` will fall back to `quartz.config.default.yaml` if no `quartz.config.yaml` is present.

## Interactive Mode

Running the plugin command without any subcommand will launch the [[cli/tui|TUI]], which provides a visual interface for all these operations.

```shell
npx quartz plugin
```
