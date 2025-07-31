import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { toHtml } from "hast-util-to-html"
import { fromHtml } from "hast-util-from-html"
import { toString } from "hast-util-to-string"
import { VFile } from "vfile"
import { i18n } from "../../i18n"
import {
  EncryptionOptions,
  DirectoryConfig,
  defaultEncryptionConfig,
  SUPPORTED_ALGORITHMS,
  SupportedEncryptionAlgorithm,
  encryptContent,
  getEncryptionConfigForPath,
  Hash,
  hashString,
  EncryptionResult,
  EncryptionConfig,
} from "../../util/encryption"

// @ts-ignore
import encryptScript from "../../components/scripts/encrypt.inline.ts"
import encryptStyle from "../../components/styles/encrypt.scss"

export interface Options extends EncryptionOptions {}

const defaultOptions: Options = {
  ...defaultEncryptionConfig,
  encryptedFolders: {},
}

export const Encrypt: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  // Validate algorithm at build time
  if (opts.algorithm && !SUPPORTED_ALGORITHMS.includes(opts.algorithm as SupportedEncryptionAlgorithm)) {
    throw new Error(
      `[EncryptPlugin] Unsupported encryption algorithm: ${opts.algorithm}. Supported algorithms: ${SUPPORTED_ALGORITHMS.join(", ")}`,
    )
  }

  const getEncryptionConfig = (file: VFile): DirectoryConfig | undefined => {
    const frontmatter = file.data?.frontmatter
    const frontmatterConfig = (frontmatter?.encryptConfig ?? {}) as DirectoryConfig
    const relativePath = file.data?.relativePath

    const folderConfig = relativePath ? getEncryptionConfigForPath(relativePath, opts) : null

    if (!folderConfig && !frontmatterConfig.password) {
      return undefined
    } else if (!folderConfig && !frontmatter?.encrypt) {
      return undefined
    }

    const config = {
      algorithm: frontmatterConfig.algorithm || folderConfig?.algorithm || opts.algorithm,
      password: frontmatterConfig.password || folderConfig?.password || "",
      message: frontmatterConfig.message || folderConfig?.message || opts.message,
      ttl: frontmatterConfig.ttl || folderConfig?.ttl || opts.ttl,
    }

    if (!config.password) {
      return undefined
    }

    return config
  }

  return {
    name: "Encrypt",
    markdownPlugins() {
      // If encrypted, prepend lock emoji before the title
      return [
        () => {
          return async (_, file) => {
            const config = getEncryptionConfig(file)
            if (!config) {
              return
            }

            file.data.encryptionConfig = config
            file.data.hash = await hashString(config.password)
          }
        },
      ]
    },
    htmlPlugins(ctx) {
      return [
        () => {
          return async (tree: Root, file) => {
            const config = getEncryptionConfig(file)

            if (!file.data.hash || !config) {
              return tree
            }

            const locale = ctx.cfg.configuration.locale
            const t = i18n(locale).components.encryption

            // Convert html to plaintext and encrypt it
            file.data.encryptionResult = await encryptContent(
              toString(tree),
              config.password,
              config,
            )

            // Encrypt the content and generate verification hash
            const encryptionResult = await encryptContent(toHtml(tree), config.password, config)

            // Create individual attributes for each field instead of JSON
            const attributes = [
              `data-config='${JSON.stringify(config)}'`,
              `data-encrypted='${JSON.stringify(encryptionResult)}'`,
              `data-hash='${JSON.stringify(file.data.hash)}'`,
              `data-slug='${file.data.slug}'`,
            ].join(" ")

            // Create a new tree with encrypted content placeholder
            const encryptedTree = fromHtml(
              `
              <div class="encrypted-content" ${attributes}>
                <div class="encryption-notice">
                  <h3>${t.title}</h3>
                  ${config.message ? `<p>${config.message}</p>` : ""}
                  <div class="decrypt-form">
                    <input type="password" class="decrypt-password" placeholder="${t.enterPassword}" />
                    <button class="decrypt-button">${t.decrypt}</button>
                  </div>
                  <div class="decrypt-loading">
                    <div class="loading-spinner"></div>
                    <span>${t.decrypting}</span>
                  </div>
                  <div class="decrypt-error" data-error="incorrect-password">
                    ${t.incorrectPassword}
                  </div>
                  <div class="decrypt-error" data-error="decryption-failed">
                    ${t.decryptionFailed}
                  </div>
                </div>
              </div>
            `,
              { fragment: true },
            )

            // Replace the original tree
            tree.children = encryptedTree.children

            return tree
          }
        },
      ]
    },
    externalResources() {
      return {
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: encryptScript,
          },
        ],
        css: [
          {
            content: encryptStyle,
            inline: true,
          },
        ],
        additionalHead: [],
      }
    },
  }
}

declare module "vfile" {
  interface DataMap {
    encryptionConfig: EncryptionConfig
    encryptionResult: EncryptionResult
    hash: Hash
  }
}
