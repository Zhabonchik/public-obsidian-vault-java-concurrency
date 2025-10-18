---
title: Private and Unlisted Pages
tags:
  - feature/filter
---

You may want to control which notes appear publicly on your site. Quartz supports two complementary mechanisms to achieve this:

- **Private Pages** — fully exclude notes from the published site.
- **Unlisted Pages** — published and accessible via direct link, but hidden from navigation and listings.

---

## Private Pages

Quarts supports **Private Pages**, which allow you to **prevent certain notes from being published as a website**. There are two mechanisms for this which can be used in conjunction:

### Filter Plugins

[[making plugins#Filters|Filter plugins]] are plugins that filter out content based off of certain criteria. By default, Quartz uses the [[RemoveDrafts]] plugin which filters out any note that has `draft: true` in the frontmatter.

If you'd like to only publish a select number of notes, you can instead use [[ExplicitPublish]] which will filter out all notes except for any that have `publish: true` in the frontmatter.

> [!warning]
> Regardless of the filter plugin used, **all non-markdown files will be emitted and available publically in the final build.** This includes files such as images, voice recordings, PDFs, etc.

### Quartz Config

This is a field in `quartz.config.ts` under the main [[configuration]] which allows you to specify a list of patterns to effectively exclude from parsing all together. Any valid [fast-glob](https://github.com/mrmlnc/fast-glob#pattern-syntax) pattern works here.

> [!note]
> Bash's glob syntax is slightly different from fast-glob's and using bash's syntax may lead to unexpected results.

Common examples include:

- `some/folder`: exclude the entire of `some/folder`
- `*.md`: exclude all files with a `.md` extension
- `!(*.md)`: exclude all files that _don't_ have a `.md` extension. Note that negations _must_ parenthesize the rest of the pattern!
- `**/private`: exclude any files or folders named `private` at any level of nesting

> [!warning]
> Marking something as private via either a plugin or through the `ignorePatterns` pattern will only prevent a page from being included in the final built site. If your GitHub repository is public, also be sure to include an ignore for those in the `.gitignore` of your Quartz. See the `git` [documentation](https://git-scm.com/docs/gitignore#_pattern_format) for more information.

---

## Unlisted Pages

Quartz supports **Unlisted Pages**, which allow you to publish notes that remain **accessible by direct link** but **hidden from navigation components** such as:

- the explorer sidebar  
- recent notes lists  
- tag or folder listings  

This is useful for sharing content privately with collaborators, collecting feedback, or keeping drafts semi-private without fully unpublishing them.

There are two mechanisms provided to enable unlisted pages:

### Frontmatter Flags

To mark a single page as unlisted, add `unlisted: true` to its frontmatter.

### Quartz Config

If you want to apply this behavior to multiple files or folders, you can use the `unlistedPatterns` field in your `quartz.config.ts`.
This accepts an array of fast-glob patterns that identify which pages should be treated as unlisted.

> [!note]
> As with `ignorePatterns`, fast-glob syntax differs slightly from Bash glob syntax. Using Bash-style patterns may lead to unexpected results.