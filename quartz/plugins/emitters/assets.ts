import { FilePath, joinSegments, slugifyFilePath, getFileExtension } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import path from "path"
import fs from "fs"
import sharp, { FitEnum } from "sharp"
import { styleText } from "util"
import { glob } from "../../util/glob"
import { Argv } from "../../util/ctx"
import { QuartzConfig } from "../../cfg"

interface Options {
  resizeImages?: { width?: number; height?: number; fit?: keyof FitEnum }
  compressImages?: boolean
}

const defaultOptions: Options = {
  resizeImages: { width: 1700, fit: "inside" },
  compressImages: true,
}

// Accepted Sharp formats https://sharp.pixelplumbing.com/#formats
const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".tif", ".tiff", ".svg"]

const filesToCopy = async (argv: Argv, cfg: QuartzConfig) => {
  // glob all non MD files in content folder and copy it over
  return await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns])
}

const copyFile = async (argv: Argv, fp: FilePath, opts: Options) => {
  const src = joinSegments(argv.directory, fp) as FilePath
  const name = slugifyFilePath(fp)
  const dest = joinSegments(argv.output, name) as FilePath

  // ensure dir exists
  const dir = path.dirname(dest) as FilePath
  await fs.promises.mkdir(dir, { recursive: true })

  const ext = getFileExtension(fp)?.toLowerCase()
  if (ext && imageExtensions.includes(ext)) {
    await copyImage(src, dest, opts)
  } else {
    await copyBlob(src, dest)
  }

  return dest
}

const copyImage = async (src: FilePath, dest: FilePath, opts: Options) => {
  if (!opts.compressImages) {
    await copyBlob(src, dest)
  } else if (opts.resizeImages) {
    await sharp(src).resize(opts.resizeImages).toFile(dest)
  } else {
    await sharp(src).toFile(dest)
  }
}

const copyBlob = async (src: FilePath, dest: FilePath) => {
  await fs.promises.copyFile(src, dest)
}

export const Assets: QuartzEmitterPlugin<Partial<Options>> = (opts) => {
  opts = { ...defaultOptions, ...opts }

  if ((opts.resizeImages?.width || opts.resizeImages?.height) && !opts.compressImages) {
    console.warn(
      styleText(
        "yellow",
        "Your asset resizing options are incompatible - enable compression to resize images",
      ),
    )
  }

  return {
    name: "Assets",
    async *emit({ argv, cfg }) {
      const fps = await filesToCopy(argv, cfg)
      for (const fp of fps) {
        yield copyFile(argv, fp, opts)
      }
    },
    async *partialEmit(ctx, _content, _resources, changeEvents) {
      for (const changeEvent of changeEvents) {
        const ext = path.extname(changeEvent.path)
        if (ext === ".md") continue

        if (changeEvent.type === "add" || changeEvent.type === "change") {
          yield copyFile(ctx.argv, changeEvent.path, opts)
        } else if (changeEvent.type === "delete") {
          const name = slugifyFilePath(changeEvent.path)
          const dest = joinSegments(ctx.argv.output, name) as FilePath
          await fs.promises.unlink(dest)
        }
      }
    },
  }
}
