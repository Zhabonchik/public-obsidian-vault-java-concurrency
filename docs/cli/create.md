---
title: quartz create
---

The `create` command initializes a new Quartz project. It helps you set up your content folder and choose how Quartz should handle your Markdown files.

## Flags

| Flag          | Shorthand | Description                                                           |
| ------------- | --------- | --------------------------------------------------------------------- |
| `--directory` | `-d`      | The directory where Quartz will be initialized                        |
| `--source`    | `-s`      | The source directory of your Markdown files                           |
| `--strategy`  | `-X`      | How to handle the source files (`new`, `copy`, or `symlink`)          |
| `--links`     | `-l`      | How to resolve internal links (`absolute`, `shortest`, or `relative`) |
| `--verbose`   | `-v`      | Enable detailed logging                                               |

## Strategies

When you run `quartz create`, you must choose a strategy for your content:

- **new**: Creates a fresh, empty content folder. Use this if you are starting a new project from scratch.
- **copy**: Copies all files from your source directory into the Quartz content folder. This is the safest option for existing vaults as it doesn't touch your original files.
- **symlink**: Creates a symbolic link from the Quartz content folder to your source directory. Any changes you make in your source directory (e.g. in Obsidian) will be immediately reflected in Quartz.
- **move**: Moves your files from the source directory into the Quartz content folder.

## Link Resolution

Quartz needs to know how to interpret the internal links in your Markdown files:

- **shortest**: Resolves links to the closest matching file name. This is the default for Obsidian.
- **absolute**: Resolves links relative to the root of your content folder.
- **relative**: Resolves links relative to the current file's location.

## Interactive Walkthrough

If you run `npx quartz create` without any arguments, it will guide you through an interactive setup:

1. **Choose a name**: Enter the name of your project.
2. **Select a strategy**: Choose between `new`, `copy`, or `symlink`.
3. **Select link resolution**: Choose how your links are formatted.
4. **Finish**: Quartz will set up the directory structure and install necessary dependencies.

## Example: Importing an Obsidian Vault

To create a Quartz project that links directly to an existing Obsidian vault:

```shell
npx quartz create --strategy symlink --source ~/Documents/MyVault --links shortest
```

This command tells Quartz to look at your vault in `~/Documents/MyVault`, use symbolic links so changes are synced, and use the `shortest` link resolution that Obsidian expects.
