---
title: Making your own plugins
---

> [!warning]
> This part of the documentation will assume you have working knowledge in TypeScript and will include code snippets that describe the interface of what Quartz plugins should look like.

Quartz's plugins are a series of transformations over content. This is illustrated in the diagram of the processing pipeline below:

![[quartz transform pipeline.png]]

All plugins are defined as a function that takes in a single parameter for options `type OptionType = object | undefined` and return an object that corresponds to the type of plugin it is.

```ts
type OptionType = object | undefined
type QuartzPlugin<Options extends OptionType = undefined> = (opts?: Options) => QuartzPluginInstance
type QuartzPluginInstance =
  | QuartzTransformerPluginInstance
  | QuartzFilterPluginInstance
  | QuartzEmitterPluginInstance
  | QuartzPageTypePluginInstance
```

The following sections will go into detail for what methods can be implemented for each plugin type. Before we do that, let's clarify a few more ambiguous types:

- `BuildCtx` is defined in `@quartz-community/types`. It consists of
  - `argv`: The command line arguments passed to the Quartz [[build]] command
  - `cfg`: The full Quartz [[configuration]]
  - `allSlugs`: a list of all the valid content slugs (see [[paths]] for more information on what a slug is)
- `StaticResources` is defined in `@quartz-community/types`. It consists of
  - `css`: a list of CSS style definitions that should be loaded. A CSS style is described with the `CSSResource` type. It accepts either a source URL or the inline content of the stylesheet.
  - `js`: a list of scripts that should be loaded. A script is described with the `JSResource` type. It allows you to define a load time (either before or after the DOM has been loaded), whether it should be a module, and either the source URL or the inline content of the script.
  - `additionalHead`: a list of JSX elements or functions that return JSX elements to be added to the `<head>` tag of the page. Functions receive the page's data as an argument and can conditionally render elements.

## Getting Started

In v5, plugins are standalone repositories. The easiest way to create one is using the plugin template:

```shell
# Use the plugin template to create a new repository on GitHub
# Then clone it locally
git clone https://github.com/your-username/my-plugin.git
cd my-plugin
npm install
```

The template provides the build configuration (`tsup.config.ts`), TypeScript setup, and correct package structure.

## Plugin Structure

The basic file structure of a plugin is as follows:

```
my-plugin/
├── src/
│   └── index.ts          # Plugin entry point
├── tsup.config.ts         # Build configuration
├── package.json           # Dependencies and exports
└── tsconfig.json          # TypeScript configuration
```

The plugin's `package.json` should declare dependencies on `@quartz-community/types` (for type definitions) and optionally `@quartz-community/utils` (for shared utilities).

## Plugin Types

### Transformers

Transformers **map** over content, taking a Markdown file and outputting modified content or adding metadata to the file itself.

```ts
export type QuartzTransformerPluginInstance = {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx: BuildCtx) => PluggableList
  htmlPlugins?: (ctx: BuildCtx) => PluggableList
  externalResources?: (ctx: BuildCtx) => Partial<StaticResources>
}
```

All transformer plugins must define at least a `name` field to register the plugin and a few optional functions that allow you to hook into various parts of transforming a single Markdown file.

- `textTransform` performs a text-to-text transformation _before_ a file is parsed into the [Markdown AST](https://github.com/syntax-tree/mdast).
- `markdownPlugins` defines a list of [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md). `remark` is a tool that transforms Markdown to Markdown in a structured way.
- `htmlPlugins` defines a list of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md). Similar to how `remark` works, `rehype` is a tool that transforms HTML to HTML in a structured way.
- `externalResources` defines any external resources the plugin may need to load on the client-side for it to work properly.

Normally for both `remark` and `rehype`, you can find existing plugins that you can use. If you'd like to create your own `remark` or `rehype` plugin, checkout the [guide to creating a plugin](https://unifiedjs.com/learn/guide/create-a-plugin/) using `unified` (the underlying AST parser and transformer library).

A good example of a transformer plugin that borrows from the `remark` and `rehype` ecosystems is the [[plugins/Latex|Latex]] plugin:

```ts
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/svg"
import { QuartzTransformerPlugin } from "@quartz-community/types"

interface Options {
  renderEngine: "katex" | "mathjax"
}

export const Latex: QuartzTransformerPlugin<Options> = (opts?: Options) => {
  const engine = opts?.renderEngine ?? "katex"
  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      if (engine === "katex") {
        // if you need to pass options into a plugin, you
        // can use a tuple of [plugin, options]
        return [[rehypeKatex, { output: "html" }]]
      } else {
        return [rehypeMathjax]
      }
    },
    externalResources() {
      if (engine === "katex") {
        return {
          css: [
            {
              // base css
              content: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css",
            },
          ],
          js: [
            {
              // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
              src: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/copy-tex.min.js",
              loadTime: "afterDOMReady",
              contentType: "external",
            },
          ],
        }
      }
    },
  }
}
```

Another common thing that transformer plugins will do is parse a file and add extra data for that file:

```ts
import { QuartzTransformerPlugin } from "@quartz-community/types"

export const AddWordCount: QuartzTransformerPlugin = () => {
  return {
    name: "AddWordCount",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // tree is an `mdast` root element
            // file is a `vfile`
            const text = file.value
            const words = text.split(" ").length
            file.data.wordcount = words
          }
        },
      ]
    },
  }
}

// tell typescript about our custom data fields we are adding
// other plugins will then also be aware of this data field
declare module "vfile" {
  interface DataMap {
    wordcount: number
  }
}
```

Finally, you can also perform transformations over Markdown or HTML ASTs using the `visit` function from the `unist-util-visit` package or the `findAndReplace` function from the `mdast-util-find-and-replace` package.

```ts
import { visit } from "unist-util-visit"
import { findAndReplace } from "mdast-util-find-and-replace"
import { QuartzTransformerPlugin } from "@quartz-community/types"
import { Link } from "mdast"

export const TextTransforms: QuartzTransformerPlugin = () => {
  return {
    name: "TextTransforms",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // replace _text_ with the italics version
            findAndReplace(tree, /_(.+)_/, (_value: string, ...capture: string[]) => {
              // inner is the text inside of the () of the regex
              const [inner] = capture
              // return an mdast node
              // https://github.com/syntax-tree/mdast
              return {
                type: "emphasis",
                children: [{ type: "text", value: inner }],
              }
            })

            // remove all links (replace with just the link content)
            // match by 'type' field on an mdast node
            // https://github.com/syntax-tree/mdast#link in this example
            visit(tree, "link", (link: Link) => {
              return {
                type: "paragraph",
                children: [{ type: "text", value: link.title }],
              }
            })
          }
        },
      ]
    },
  }
}
```

A parting word: transformer plugins are quite complex so don't worry if you don't get them right away. Take a look at the built in transformers and see how they operate over content to get a better sense for how to accomplish what you are trying to do.

### Filters

Filters **filter** content, taking the output of all the transformers and determining what files to actually keep and what to discard.

```ts
export type QuartzFilterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzFilterPluginInstance

export type QuartzFilterPluginInstance = {
  name: string
  shouldPublish(ctx: BuildCtx, content: ProcessedContent): boolean
}
```

A filter plugin must define a `name` field and a `shouldPublish` function that takes in a piece of content that has been processed by all the transformers and returns a `true` or `false` depending on whether it should be passed to the emitter plugins or not.

For example, here is the built-in plugin for removing drafts:

```ts
import { QuartzFilterPlugin } from "@quartz-community/types"

export const RemoveDrafts: QuartzFilterPlugin<{}> = () => ({
  name: "RemoveDrafts",
  shouldPublish(_ctx, [_tree, vfile]) {
    // uses frontmatter parsed from transformers
    const draftFlag: boolean = vfile.data?.frontmatter?.draft ?? false
    return !draftFlag
  },
})
```

### Emitters

Emitters **reduce** over content, taking in a list of all the transformed and filtered content and creating output files.

```ts
export type QuartzEmitterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzEmitterPluginInstance

export type QuartzEmitterPluginInstance = {
  name: string
  emit(
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
  ): Promise<FilePath[]> | AsyncGenerator<FilePath>
  partialEmit?(
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
    changeEvents: ChangeEvent[],
  ): Promise<FilePath[]> | AsyncGenerator<FilePath> | null
  getQuartzComponents(ctx: BuildCtx): QuartzComponent[]
}
```

An emitter plugin must define a `name` field, an `emit` function, and a `getQuartzComponents` function. It can optionally implement a `partialEmit` function for incremental builds.

- `emit` is responsible for looking at all the parsed and filtered content and then appropriately creating files and returning a list of paths to files the plugin created.
- `partialEmit` is an optional function that enables incremental builds. It receives information about which files have changed (`changeEvents`) and can selectively rebuild only the necessary files. This is useful for optimizing build times in development mode. If `partialEmit` is undefined, it will default to the `emit` function.
- `getQuartzComponents` declares which Quartz components the emitter uses to construct its pages.

Creating new files can be done via regular Node [fs module](https://nodejs.org/api/fs.html) (i.e. `fs.cp` or `fs.writeFile`) or via the `write` function in `@quartz-community/utils` if you are creating files that contain text. `write` has the following signature:

```ts
export type WriteOptions = (data: {
  // the build context
  ctx: BuildCtx
  // the name of the file to emit (not including the file extension)
  slug: FullSlug
  // the file extension
  ext: `.${string}` | ""
  // the file content to add
  content: string
}) => Promise<FilePath>
```

This is a thin wrapper around writing to the appropriate output folder and ensuring that intermediate directories exist. If you choose to use the native Node `fs` APIs, ensure you emit to the `argv.output` folder as well.

If you are creating an emitter plugin that needs to render components, there are three more things to be aware of:

- Your component should use `getQuartzComponents` to declare a list of `QuartzComponents` that it uses to construct the page. See the page on [[creating components]] for more information.
- You can use the `renderPage` function defined in `@quartz-community/utils` to render Quartz components into HTML.
- If you need to render an HTML AST to JSX, you can use the `htmlToJsx` function from `@quartz-community/utils`.

For example, the following is a simplified version of the content page plugin that renders every single page.

```tsx
import { QuartzEmitterPlugin, FullPageLayout, QuartzComponentProps } from "@quartz-community/types"
import { renderPage, canonicalizeServer, pageResources, write } from "@quartz-community/utils"

export const ContentPage: QuartzEmitterPlugin = () => {
  return {
    name: "ContentPage",
    getQuartzComponents(ctx) {
      const { head, header, beforeBody, pageBody, afterBody, left, right, footer } = ctx.cfg.layout
      return [head, ...header, ...beforeBody, pageBody, ...afterBody, ...left, ...right, footer]
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const cfg = ctx.cfg.configuration
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      for (const [tree, file] of content) {
        const slug = canonicalizeServer(file.data.slug!)
        const externalResources = pageResources(slug, file.data, resources)
        const componentData: QuartzComponentProps = {
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(cfg, slug, componentData, {}, externalResources)
        const fp = await write({
          ctx,
          content,
          slug: file.data.slug!,
          ext: ".html",
        })

        fps.push(fp)
      }
      return fps
    },
  }
}
```

### Page Types

Page types define how a category of pages is rendered. They are configured in the `pageTypes` array in `quartz.config.ts`.

```ts
export type QuartzPageTypePluginInstance = {
  name: string
  pageType: string // e.g. "content", "folder", "tag"
  getQuartzComponents(ctx: BuildCtx): QuartzComponent[]
  emit(
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
    layout: FullPageLayout,
  ): Promise<FilePath[]> | AsyncGenerator<FilePath>
}
```

## Building and Testing

```shell
# Build the plugin
npm run build
# or
npx tsup
```

## Installing Your Plugin

```shell
# In your Quartz project
npx quartz plugin add github:your-username/my-plugin
```

Then add the plugin to the appropriate array in `quartz.config.ts`:

```ts
import * as ExternalPlugin from "./.quartz/plugins"
// ...
transformers: [ExternalPlugin.MyPlugin()]
```

## Component Plugins

For plugins that provide visual components (like Explorer, Graph, Search), see the [[creating components|creating component plugins]] guide.
