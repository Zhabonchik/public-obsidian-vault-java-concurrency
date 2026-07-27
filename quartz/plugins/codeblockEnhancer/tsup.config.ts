import { defineConfig } from "tsup"
import type { Plugin } from "esbuild"
import path from "path"

const inlineScssPlugin: Plugin = {
  name: "inline-scss-loader",
  setup(parentBuild) {
    const absWorkingDir = parentBuild.initialOptions.absWorkingDir ?? process.cwd()
    parentBuild.onLoad({ filter: /\.scss$/ }, async (args) => {
      const sass = await import("sass")
      const result = sass.compile(args.path)
      return { contents: result.css, loader: "text" }
    })
  },
}

export default defineConfig({
  entry: {
    index: "index.ts",
  },
  format: ["esm"],
  dts: false,
  sourcemap: false,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  noExternal: [/.*/],
  external: [
    "unist-util-visit",
    "hast-util-from-html",
    "hast-util-to-html",
  ],
  outDir: "dist",
  platform: "node",
  esbuildPlugins: [inlineScssPlugin],
})
