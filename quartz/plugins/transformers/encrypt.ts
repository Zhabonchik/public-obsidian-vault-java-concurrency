import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { toHtml } from "hast-util-to-html"
import { fromHtml } from "hast-util-from-html"
import { VFile } from "vfile"
import { i18n } from "../../i18n"
import {
  SUPPORTED_ALGORITHMS,
  encryptContent,
  Hash,
  hashString,
  EncryptionResult,
  CompleteCryptoConfig,
  BaseCryptoConfig,
  EncryptionConfig,
  DirectoryConfig,
} from "../../util/encryption"

// @ts-ignore
import encryptScript from "../../components/scripts/encrypt.inline.ts"
import encryptStyle from "../../components/styles/encrypt.scss"

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
// Plugin configuration
export interface PluginConfig extends CompleteCryptoConfig {
  encryptedFolders: Record<string, DirectoryConfig>
}

// User-provided options (all optional)
export type PluginOptions = Partial<PluginConfig>

// Internal normalized folder configuration
interface NormalizedFolderConfig extends CompleteCryptoConfig {
  password: string
  path: string
  depth: number
}

// =============================================================================
// CONFIGURATION MANAGEMENT
// =============================================================================

const DEFAULT_CONFIG: CompleteCryptoConfig = {
  algorithm: "aes-256-cbc",
  ttl: 3600 * 24 * 7, // 1 week
  message: "This content is encrypted.",
}

/**
 * Normalizes a directory configuration into a complete configuration object
 */
function normalizeDirectoryConfig(
  dirConfig: DirectoryConfig,
  defaults: CompleteCryptoConfig,
): EncryptionConfig {
  if (typeof dirConfig === "string") {
    return {
      ...defaults,
      password: dirConfig,
    }
  }

  return {
    algorithm: dirConfig.algorithm ?? defaults.algorithm,
    ttl: dirConfig.ttl ?? defaults.ttl,
    message: dirConfig.message ?? defaults.message,
    password: dirConfig.password,
  }
}

/**
 * Creates a sorted list of folder configurations by path depth
 * This ensures parent configurations are processed before children
 */
function createFolderConfigHierarchy(
  folders: Record<string, DirectoryConfig>,
  globalDefaults: CompleteCryptoConfig,
): NormalizedFolderConfig[] {
  const configs: NormalizedFolderConfig[] = []

  for (const [path, config] of Object.entries(folders)) {
    const normalized = normalizeDirectoryConfig(config, globalDefaults)
    configs.push({
      ...normalized,
      path: path.endsWith("/") ? path : path + "/",
      depth: path.split("/").filter(Boolean).length,
    })
  }

  // Sort by depth (shallow to deep) to ensure proper inheritance
  return configs.sort((a, b) => a.depth - b.depth)
}

/**
 * Merges configurations following the inheritance chain
 * Deeper paths override shallower ones
 */
function mergeConfigurations(
  base: CompleteCryptoConfig,
  override: Partial<BaseCryptoConfig>,
): CompleteCryptoConfig {
  return {
    algorithm: override.algorithm ?? base.algorithm,
    ttl: override.ttl ?? base.ttl,
    message: override.message ?? base.message,
  }
}

/**
 * Gets the encryption configuration for a specific file path
 * Respects the directory hierarchy and inheritance
 */
function getConfigurationForPath(
  filePath: string,
  folderConfigs: NormalizedFolderConfig[],
  globalDefaults: CompleteCryptoConfig,
): EncryptionConfig | undefined {
  let currentConfig: CompleteCryptoConfig = globalDefaults
  let password: string | undefined

  // Apply configurations in order (shallow to deep)
  for (const folderConfig of folderConfigs) {
    if (filePath.startsWith(folderConfig.path)) {
      // Merge the configuration, inheriting from parent
      currentConfig = mergeConfigurations(currentConfig, folderConfig)
      password = folderConfig.password
    }
  }

  // If no password was found in any matching folder, return undefined
  if (!password) {
    return undefined
  }

  return {
    ...currentConfig,
    password,
  }
}

/**
 * Validates the plugin configuration
 */
function validateConfig(config: EncryptionConfig, file: VFile | null = null): void {
  let suffixedPath = ""

  if (file && file.data && file.data.relativePath) {
    suffixedPath = `(in file: ${file.data.relativePath})`
  }

  if (!SUPPORTED_ALGORITHMS.includes(config.algorithm)) {
    throw new Error(
      `[EncryptPlugin] Unsupported encryption algorithm: ${config.algorithm}. ` +
        `Supported algorithms: ${SUPPORTED_ALGORITHMS.join(", ")} ${suffixedPath}`,
    )
  }

  if (config.ttl < 0) {
    throw new Error(`[EncryptPlugin] TTL cannot be negative. ${suffixedPath}`)
  }
}

// =============================================================================
// PLUGIN IMPLEMENTATION
// =============================================================================

export const Encrypt: QuartzTransformerPlugin<PluginOptions> = (userOpts) => {
  // Merge user options with defaults
  const pluginConfig: PluginConfig = {
    ...DEFAULT_CONFIG,
    ...userOpts,
    encryptedFolders: userOpts?.encryptedFolders ?? {},
  }

  // Pre-process folder configurations for efficient lookup
  const folderConfigs = createFolderConfigHierarchy(pluginConfig.encryptedFolders, pluginConfig)

  /**
   * Determines the final encryption configuration for a file
   * Priority: frontmatter > deepest matching folder > global defaults
   */
  const getEncryptionConfig = (file: VFile): EncryptionConfig | undefined => {
    const frontmatter = file.data?.frontmatter
    const relativePath = file.data?.relativePath

    // Check if file should be encrypted via frontmatter
    const shouldEncryptViaFrontmatter = frontmatter?.encrypt === true
    const frontmatterConfig = frontmatter?.encryptConfig as
      | (BaseCryptoConfig & { password?: string })
      | undefined

    // Get folder-based configuration
    const folderConfig = relativePath
      ? getConfigurationForPath(relativePath, folderConfigs, pluginConfig)
      : undefined

    // If neither folder config nor frontmatter indicates encryption, skip
    if (!folderConfig && !shouldEncryptViaFrontmatter) {
      return undefined
    }

    // Build final configuration with proper precedence
    let finalConfig: EncryptionConfig | undefined

    if (folderConfig && frontmatterConfig) {
      // Merge folder and frontmatter configs
      finalConfig = {
        algorithm: frontmatterConfig.algorithm ?? folderConfig.algorithm,
        ttl: frontmatterConfig.ttl ?? folderConfig.ttl,
        message: frontmatterConfig.message ?? folderConfig.message,
        password: frontmatterConfig.password ?? folderConfig.password,
      }
    } else if (folderConfig) {
      // Use folder config only
      finalConfig = folderConfig
    } else if (frontmatterConfig?.password) {
      // Use frontmatter config with global defaults
      finalConfig = {
        algorithm: frontmatterConfig.algorithm ?? pluginConfig.algorithm,
        ttl: frontmatterConfig.ttl ?? pluginConfig.ttl,
        message: frontmatterConfig.message ?? pluginConfig.message,
        password: frontmatterConfig.password,
      }
    }

    // Validate final configuration
    if (!finalConfig?.password) {
      console.warn(`[EncryptPlugin] No password configured for ${relativePath}`)
      return undefined
    }

    return finalConfig
  }

  return {
    name: "Encrypt",
    markdownPlugins() {
      return [
        () => {
          return async (_, file) => {
            const config = getEncryptionConfig(file)
            if (!config) {
              return
            }
            // Validate configuration
            validateConfig(config, file)

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
            if (!config || !file.data.hash) {
              return tree
            }

            const locale = ctx.cfg.configuration.locale
            const t = i18n(locale).components.encryption

            // Encrypt the content
            const encryptionResult = await encryptContent(toHtml(tree), config.password, config)

            // Store for later use
            file.data.encryptionResult = encryptionResult

            // Create attributes for client-side decryption
            const attributes = [
              `data-config='${JSON.stringify({
                algorithm: config.algorithm,
                ttl: config.ttl,
                message: config.message,
              })}'`,
              `data-encrypted='${JSON.stringify(encryptionResult)}'`,
              `data-hash='${JSON.stringify(file.data.hash)}'`,
              `data-slug='${file.data.slug}'`,
              `data-decrypted='false'`,
            ].join(" ")

            // Create encrypted content placeholder
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
      }
    },
  }
}

// =============================================================================
// MODULE AUGMENTATION
// =============================================================================

declare module "vfile" {
  interface DataMap {
    encryptionConfig: EncryptionConfig
    encryptionResult: EncryptionResult
    hash: Hash
  }
}
