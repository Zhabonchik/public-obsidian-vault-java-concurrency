---
title: quartz update
---

The `update` command keeps your Quartz installation up to date with the latest features and bug fixes from the official repository.

## How it Works

When you run `npx quartz update`, Quartz attempts to pull the latest code from the upstream Quartz repository. It uses Git to merge these changes into your local project.

```shell
npx quartz update
```

## Handling Conflicts

Because Quartz allows you to customize almost every part of the code, updates can sometimes result in merge conflicts. This happens if you have modified a file that the Quartz team has also updated.

If a conflict occurs:

1. Git will mark the conflicting sections in the affected files.
2. You will need to open these files and manually choose which changes to keep.
3. After resolving the conflicts, you can commit the changes.

## Recovery

If an update goes wrong or leaves your project in an unusable state, you can use the [[cli/restore|restore]] command to recover your content from the local cache.

For a more detailed guide on the upgrading process, see [[getting-started/upgrading]].
