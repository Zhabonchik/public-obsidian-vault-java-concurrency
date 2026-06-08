import sharp from "sharp"
import toIco from "to-ico"
import { readFileSync, writeFileSync } from "fs"

const SVG = readFileSync("quartz/static/logo-light.svg")
const OUT = "quartz/static"

const sizes = [16, 32, 48, 144, 150, 180]
const buffers = {}

for (const size of sizes) {
  const padding = Math.round(size * 0.08)
  const inner = size - padding * 2
  buffers[size] = await sharp(SVG)
    .resize(inner, inner)
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: { r: 250, g: 248, b: 248, alpha: 1 } })
    .png()
    .toBuffer()
}

writeFileSync(`${OUT}/favicon-16x16.png`, buffers[16])
writeFileSync(`${OUT}/favicon-32x32.png`, buffers[32])
writeFileSync(`${OUT}/apple-touch-icon.png`, buffers[180])
writeFileSync(`${OUT}/android-chrome-144x144.png`, buffers[144])
writeFileSync(`${OUT}/mstile-150x150.png`, buffers[150])
writeFileSync(`${OUT}/icon.png`, buffers[32])

const ico = await toIco([buffers[16], buffers[32], buffers[48]])
writeFileSync(`${OUT}/favicon.ico`, ico)

console.log("All favicons generated.")
