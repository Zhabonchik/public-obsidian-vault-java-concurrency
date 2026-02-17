#!/usr/bin/env node
import esbuild from "esbuild"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tuiDir = path.join(__dirname, "tui")

await esbuild.build({
  entryPoints: [path.join(tuiDir, "App.tsx")],
  outdir: path.join(tuiDir, "dist"),
  bundle: true,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  jsxImportSource: "@opentui/react",
  packages: "external",
  sourcemap: true,
  target: "esnext",
  outExtension: { ".js": ".mjs" },
})
