import { PerfTimer } from "../util/perf"
import { getStaticResourcesFromPlugins } from "../plugins"
import { ProcessedContent } from "../plugins/vfile"
import { QuartzLogger } from "../util/log"
import { trace } from "../util/trace"
import { BuildCtx } from "../util/ctx"
import { styleText } from "util"

export async function emitContent(ctx: BuildCtx, content: ProcessedContent[]) {
  const { argv, cfg } = ctx
  const perf = new PerfTimer()
  const log = new QuartzLogger(ctx.argv.verbose)

  log.start(`Emitting files`)

  const staticResources = getStaticResourcesFromPlugins(ctx)
  const emittedFiles = await Promise.all(
    cfg.plugins.emitters.map(async (emitter) => {
      try {
        const emitted = emitter.emit(ctx, content, staticResources)
        if (Symbol.asyncIterator in emitted) {
          // Async generator case
          let emittedFiles = 0
          for await (const file of emitted) {
            emittedFiles++
            if (ctx.argv.verbose) {
              console.log(`[emit:${emitter.name}] ${file}`)
            } else {
              log.updateText(`${emitter.name} -> ${styleText("gray", file)}`)
            }
          }
          return emittedFiles
        } else {
          // Array case
          return (
            await Promise.all(
              (await emitted).map((file) => {
                if (ctx.argv.verbose) {
                  console.log(`[emit:${emitter.name}] ${file}`)
                } else {
                  log.updateText(`${emitter.name} -> ${styleText("gray", file)}`)
                }
              }),
            )
          ).length
        }
      } catch (err) {
        trace(`Failed to emit from plugin \`${emitter.name}\``, err as Error)
        return 0
      }
    }),
  )
  const sumFiles = emittedFiles.reduce((a, b) => a + b)
  log.end(`Emitted ${sumFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)
}
