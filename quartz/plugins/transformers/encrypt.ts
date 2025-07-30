import { createCipheriv, randomBytes, pbkdf2Sync, createHash } from "crypto"
import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { toHtml } from "hast-util-to-html"
import { fromHtml } from "hast-util-from-html"
import { VFile } from "vfile"
import { i18n } from "../../i18n"

// @ts-ignore
import encryptScript from "../../components/scripts/encrypt.inline.ts"
import encryptStyle from "../../components/styles/encrypt.scss"

export interface Options {
  algorithm?: string
  keyLength?: number
  iterations?: number
  encryptedFolders?: { [folderPath: string]: string } // json object with folder paths as keys and passwords as values
  ttl: number
}

const defaultOptions: Options = {
  algorithm: "aes-256-cbc",
  keyLength: 32,
  iterations: 100000,
  encryptedFolders: {},
  ttl: 3600 * 24 * 7,
}

const SUPPORTED_ALGORITHMS = ["aes-256-cbc", "aes-256-gcm", "aes-256-ecb"] as const

type SupportedAlgorithm = (typeof SUPPORTED_ALGORITHMS)[number]

function deriveKey(password: string, salt: Buffer, keyLength: number, iterations: number): Buffer {
  return pbkdf2Sync(password, salt, iterations, keyLength, "sha256")
}

function hashPassword(password: string, salt: Buffer): string {
  // Create a fast hash for password verification (separate from key derivation)
  const hash = createHash("sha256")
  hash.update(password)
  hash.update(salt)
  const result = hash.digest("hex")
  return result
}

function encryptContent(content: string, password: string, options: Options): string {
  const { algorithm, keyLength, iterations } = { ...defaultOptions, ...options }

  // Validate algorithm
  if (!SUPPORTED_ALGORITHMS.includes(algorithm as SupportedAlgorithm)) {
    throw new Error(
      `Unsupported encryption algorithm: ${algorithm}. Supported: ${SUPPORTED_ALGORITHMS.join(", ")}`,
    )
  }

  const salt = randomBytes(16)
  const key = deriveKey(password, salt, keyLength!, iterations!)

  let iv: Buffer | undefined
  let cipher: any

  // Handle different encryption modes
  if (algorithm === "aes-256-ecb") {
    // ECB doesn't use IV
    cipher = createCipheriv(algorithm!, key, null)
  } else {
    // CBC and GCM use IV
    iv = randomBytes(16)
    cipher = createCipheriv(algorithm!, key, iv)
  }

  let encrypted = cipher.update(content, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Handle auth tag for GCM
  let authTag: string | undefined
  if (algorithm === "aes-256-gcm") {
    authTag = cipher.getAuthTag().toString("hex")
  }

  // Create password hash for verification
  const passwordHash = hashPassword(password, salt)

  // Build result object
  const result: any = {
    salt: salt.toString("hex"),
    content: encrypted,
    passwordHash,
  }

  if (iv) {
    result.iv = iv.toString("hex")
  }

  if (authTag) {
    result.authTag = authTag
  }

  return Buffer.from(JSON.stringify(result)).toString("base64")
}

export const EncryptPlugin: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  // Validate algorithm at build time
  if (opts.algorithm && !SUPPORTED_ALGORITHMS.includes(opts.algorithm as SupportedAlgorithm)) {
    throw new Error(
      `[EncryptPlugin] Unsupported encryption algorithm: ${opts.algorithm}. Supported algorithms: ${SUPPORTED_ALGORITHMS.join(", ")}`,
    )
  }

  const getPassword = (file: VFile): string | undefined => {
    const frontmatter = file.data?.frontmatter

    if (frontmatter?.encrypt && frontmatter?.password) {
      return frontmatter.password as string
    }

    let deepestFolder = ""
    for (const folder of Object.keys(opts.encryptedFolders ?? {})) {
      if (file.data?.relativePath?.startsWith(folder) && deepestFolder.length < folder.length) {
        deepestFolder = folder
      }
    }

    if (deepestFolder) {
      if (frontmatter?.password) {
        // if frontmatter has a password, use it
        return frontmatter.password as string
      }

      return opts.encryptedFolders!![deepestFolder] as string
    }
  }

  return {
    name: "EncryptPlugin",
    markdownPlugins() {
      // If encypted, prepend lock emoji before the title
      return [
        () => {
          return (_, file) => {
            const password = getPassword(file)
            if (!password) {
              return
            }

            file.data.encrypted = true

            if (file.data?.frontmatter?.title) {
              file.data.frontmatter.title = `🔒 ${file.data.frontmatter.title}`
            }
          }
        },
      ]
    },
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree: Root, file) => {
            const password = getPassword(file)
            if (!password) {
              return tree // No encryption, return original tree
            }

            const locale = ctx.cfg.configuration.locale
            const t = i18n(locale).components.encryption

            // Convert the HTML tree to string
            const htmlContent = toHtml(tree)

            // Encrypt the content
            const encryptedContent = encryptContent(htmlContent, password, opts)

            // Create a new tree with encrypted content placeholder
            const encryptedTree = fromHtml(
              `
              <div class="encrypted-content" data-encrypted="${encryptedContent}" data-config='${JSON.stringify(opts)}' data-i18n='${JSON.stringify(t)}'>
                <div class="encryption-notice">
                  <h3>${t.title}</h3>
                  <p>${t.restricted}</p>
                  <div class="decrypt-form">
                    <input type="password" class="decrypt-password" placeholder="${t.enterPassword}" />
                    <button class="decrypt-button">${t.decrypt}</button>
                  </div>
                  <div class="decrypt-loading">
                    <div class="loading-spinner"></div>
                    <span>${t.decrypting}</span>
                  </div>
                  <div class="decrypt-error">
                    ${t.incorrectPassword}
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
    encrypted: boolean
  }
}
