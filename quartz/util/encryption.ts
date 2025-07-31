// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export const SUPPORTED_ALGORITHMS = ["aes-256-cbc", "aes-256-gcm", "aes-256-ecb"] as const

export type SupportedEncryptionAlgorithm = (typeof SUPPORTED_ALGORITHMS)[number]

export interface Hash {
  hash: string
  salt: string
}

export interface EncryptionResult {
  encryptedContent: string
  encryptionSalt: string
  iv?: string
  authTag?: string
}

export interface EncryptionConfig {
  algorithm: string
  ttl: number
  message: string
}

export interface DirectoryConfig extends EncryptionConfig {
  password: string
}

export interface EncryptionOptions {
  algorithm: string
  encryptedFolders: { [folderPath: string]: string | DirectoryConfig }
  message: string
  ttl: number
}

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

export const defaultEncryptionConfig: EncryptionConfig = {
  algorithm: "aes-256-cbc",
  ttl: 3600 * 24 * 7,
  message: "This content is encrypted.",
}

const ENCRYPTION_CACHE_KEY = "quartz-encrypt-passwords"

// =============================================================================
// CRYPTO INITIALIZATION
// =============================================================================

// Unified crypto interface for both Node.js and browser environments
let crypto: Crypto
if (typeof globalThis !== "undefined" && globalThis.crypto) {
  crypto = globalThis.crypto
} else if (typeof window !== "undefined" && window.crypto) {
  crypto = window.crypto
} else {
  // Node.js environment
  try {
    const { webcrypto } = require("node:crypto")
    crypto = webcrypto as Crypto
  } catch {
    throw new Error("No crypto implementation available")
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Check if crypto.subtle is available and supported
function checkCryptoSupport(): void {
  if (!crypto || !crypto.subtle) {
    throw new Error("Web Crypto API is not supported in this environment")
  }
}

function deriveKeyLengthFromAlgorithm(algorithm: string): number {
  if (algorithm.includes("256")) return 32 // 256 bits = 32 bytes
  if (algorithm.includes("192")) return 24 // 192 bits = 24 bytes
  if (algorithm.includes("128")) return 16 // 128 bits = 16 bytes
  return 32 // Default to 256-bit
}

// Browser-compatible base64 encoding/decoding
export function base64Encode(data: string): string {
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return Buffer.from(data).toString("base64")
  } else {
    // Browser environment
    return btoa(unescape(encodeURIComponent(data)))
  }
}

export function base64Decode(data: string): string {
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return Buffer.from(data, "base64").toString()
  } else {
    // Browser environment
    return decodeURIComponent(escape(atob(data)))
  }
}

// Utility functions for array buffer conversions
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  if (!hex) return new ArrayBuffer(0)
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes.buffer
}

export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer as ArrayBuffer
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

// =============================================================================
// CORE CRYPTOGRAPHIC FUNCTIONS
// =============================================================================

export async function deriveKeyFromHash(
  passwordHash: string,
  algorithm: string,
): Promise<CryptoKey> {
  try {
    const keyLength = deriveKeyLengthFromAlgorithm(algorithm)
    const hashBytes = hexToArrayBuffer(passwordHash)

    // Use only the required key length from the hash
    const keyBytes = new Uint8Array(hashBytes).slice(0, keyLength)

    // For GCM mode, use AES-GCM as the algorithm name
    const algorithmName = algorithm === "aes-256-gcm" ? "AES-GCM" : "AES-CBC"

    return await crypto.subtle.importKey("raw", keyBytes, { name: algorithmName }, false, [
      "encrypt",
      "decrypt",
    ])
  } catch (error) {
    throw new Error(
      `Key derivation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function hashString(
  password: string,
  salt: ArrayBuffer | string | undefined = undefined,
): Promise<Hash> {
  const passwordBytes = stringToArrayBuffer(password)

  let saltBytes: Uint8Array | null = null

  if (typeof salt === "string") {
    saltBytes = new Uint8Array(hexToArrayBuffer(salt))
  } else if (salt !== undefined) {
    saltBytes = new Uint8Array(salt)
  } else {
    saltBytes = crypto.getRandomValues(new Uint8Array(16))
  }

  const combined = new Uint8Array(passwordBytes.byteLength + saltBytes.byteLength)
  combined.set(new Uint8Array(passwordBytes), 0)
  combined.set(saltBytes, passwordBytes.byteLength)

  const hashBuffer = await crypto.subtle.digest("SHA-256", combined)
  return {
    hash: arrayBufferToHex(hashBuffer),
    salt: arrayBufferToHex(saltBytes.buffer as ArrayBuffer),
  }
}

export async function verifyPasswordHash(
  password: string,
  passwordHashData: Hash,
): Promise<boolean> {
  const { hash: passwordHash } = await hashString(password, passwordHashData.salt)
  return passwordHash === passwordHashData.hash
}

export async function encryptContent(
  content: string,
  password: string,
  config: EncryptionConfig,
): Promise<EncryptionResult> {
  checkCryptoSupport()

  const { algorithm } = config

  if (!SUPPORTED_ALGORITHMS.includes(algorithm as SupportedEncryptionAlgorithm)) {
    throw new Error(
      `Unsupported encryption algorithm: ${algorithm}. Supported: ${SUPPORTED_ALGORITHMS.join(", ")}`,
    )
  }

  // Generate random salt for encryption
  const initializationVector =
    algorithm === "aes-256-ecb" ? new Uint8Array(16) : crypto.getRandomValues(new Uint8Array(16)) // Zero IV for ECB simulation

  // Create encryption hash and derive key
  const encryptionHashData = await hashString(password)
  const key = await deriveKeyFromHash(encryptionHashData.hash, algorithm)

  // Prepare content for encryption
  const contentBuffer = stringToArrayBuffer(content)

  let encryptedBuffer: ArrayBuffer
  let authTag: ArrayBuffer | undefined

  try {
    if (algorithm === "aes-256-gcm") {
      // GCM mode - the Web Crypto API returns ciphertext with auth tag appended
      const encryptedWithTag = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: initializationVector,
        },
        key,
        contentBuffer,
      )

      // The last 16 bytes (128 bits) are the authentication tag
      const encryptedBytes = new Uint8Array(encryptedWithTag)
      const ciphertext = encryptedBytes.slice(0, -16)
      const authTagBytes = encryptedBytes.slice(-16)

      encryptedBuffer = ciphertext.buffer
      authTag = authTagBytes.buffer
    } else if (algorithm === "aes-256-cbc") {
      // CBC mode
      encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: initializationVector,
        },
        key,
        contentBuffer,
      )
    } else if (algorithm === "aes-256-ecb") {
      // ECB simulation using CBC with zero IV
      encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: initializationVector, // Zero IV for ECB simulation
        },
        key,
        contentBuffer,
      )
    } else {
      throw new Error("Unsupported algorithm: " + algorithm)
    }
  } catch (error) {
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }

  // Build result object
  const result: EncryptionResult = {
    encryptedContent: arrayBufferToHex(encryptedBuffer),
    encryptionSalt: encryptionHashData.salt,
  }

  if (algorithm !== "aes-256-ecb") {
    result.iv = arrayBufferToHex(initializationVector.buffer)
  }

  if (authTag) {
    result.authTag = arrayBufferToHex(authTag)
  }

  return result
}

export async function decryptContent(
  encrypted: EncryptionResult,
  config: EncryptionConfig,
  password: string,
): Promise<string> {
  checkCryptoSupport()
  const { encryptedContent, encryptionSalt, iv, authTag } = encrypted

  // Create encryption hash and derive key
  const encryptionSaltBuffer = hexToArrayBuffer(encryptionSalt)
  const encryptionHashData = await hashString(password, encryptionSaltBuffer)
  const key = await deriveKeyFromHash(encryptionHashData.hash, config.algorithm)

  // Prepare for decryption
  const ciphertext = hexToArrayBuffer(encryptedContent)
  let decryptedBuffer: ArrayBuffer

  try {
    if (config.algorithm === "aes-256-gcm") {
      // GCM mode
      if (!iv) throw new Error("IV is required for GCM mode")
      if (!authTag) throw new Error("Authentication tag is required for GCM mode")

      const initializationVectorBuffer = hexToArrayBuffer(iv)
      const authTagBuffer = hexToArrayBuffer(authTag)

      // For GCM decryption, we need to append the auth tag to the ciphertext
      const combined = new Uint8Array(ciphertext.byteLength + authTagBuffer.byteLength)
      combined.set(new Uint8Array(ciphertext), 0)
      combined.set(new Uint8Array(authTagBuffer), ciphertext.byteLength)

      decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: initializationVectorBuffer,
        },
        key,
        combined.buffer,
      )
    } else if (config.algorithm === "aes-256-cbc") {
      // CBC mode
      if (!iv) throw new Error("IV is required for CBC mode")
      const initializationVectorBuffer = hexToArrayBuffer(iv)

      decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: initializationVectorBuffer,
        },
        key,
        ciphertext,
      )
    } else if (config.algorithm === "aes-256-ecb") {
      // ECB simulation using CBC with zero IV
      const zeroInitializationVector = new ArrayBuffer(16)

      decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: zeroInitializationVector,
        },
        key,
        ciphertext,
      )
    } else {
      throw new Error("Unsupported algorithm: " + config.algorithm)
    }
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }

  return arrayBufferToString(decryptedBuffer)
}

// =============================================================================
// CONFIGURATION MANAGEMENT
// =============================================================================

export function normalizeDirectoryConfig(
  folderConfig: string | DirectoryConfig,
  globalConfig: EncryptionConfig,
): DirectoryConfig {
  if (typeof folderConfig === "string") {
    return {
      ...globalConfig,
      password: folderConfig,
    }
  }

  return {
    algorithm: folderConfig.algorithm || globalConfig.algorithm,
    ttl: folderConfig.ttl || globalConfig.ttl,
    password: folderConfig.password,
    message: folderConfig.message || globalConfig.message,
  }
}

export function getEncryptionConfigForPath(
  filePath: string,
  options: EncryptionOptions,
): DirectoryConfig | undefined {
  if (!options.encryptedFolders) {
    return undefined
  }

  let deepestFolder = ""
  let deepestConfig: string | DirectoryConfig | undefined

  for (const [folder, config] of Object.entries(options.encryptedFolders)) {
    if (filePath.startsWith(folder) && deepestFolder.length < folder.length) {
      deepestFolder = folder
      deepestConfig = config
    }
  }

  if (deepestConfig) {
    const globalConfig = {
      algorithm: options.algorithm || defaultEncryptionConfig.algorithm,
      ttl: options.ttl || defaultEncryptionConfig.ttl,
      message: options.message || defaultEncryptionConfig.message,
    }

    return normalizeDirectoryConfig(deepestConfig, globalConfig)
  }

  return undefined
}

export async function searchForValidPassword(
  filePath: string,
  hash: Hash,
  config: EncryptionConfig,
): Promise<string | undefined> {
  const passwords = getRelevantPasswords(filePath)

  for (const password of passwords) {
    if (await verifyPasswordHash(password, hash)) {
      addPasswordToCache(password, filePath, config.ttl)
      return password
    }
  }

  return undefined
}

// =============================================================================
// PASSWORD CACHING AND MANAGEMENT
// =============================================================================

// Queue to prevent race conditions in cache operations
let cacheOperationQueue: Promise<void> = Promise.resolve()

interface CachedPassword {
  password: string
  ttl: number
}

// Helper function to execute cache operations atomically
async function executeAtomicCacheOperation<T>(operation: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    cacheOperationQueue = cacheOperationQueue
      .then(() => {
        try {
          const result = operation()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getPasswordCache(): Record<string, CachedPassword> {
  // Check if we're in a browser environment
  if (typeof localStorage === "undefined") {
    return {}
  }

  try {
    const cache = localStorage.getItem(ENCRYPTION_CACHE_KEY)
    return cache ? JSON.parse(cache) : {}
  } catch {
    return {}
  }
}

export function savePasswordCache(cache: Record<string, CachedPassword>) {
  // Check if we're in a browser environment
  if (typeof localStorage === "undefined") {
    return
  }

  try {
    localStorage.setItem(ENCRYPTION_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Silent fail if localStorage is not available
  }
}

export async function addPasswordToCache(
  password: string,
  filePath: string,
  ttl: number,
): Promise<void> {
  return executeAtomicCacheOperation(() => {
    const cache = getPasswordCache()
    const now = Date.now()

    cache[filePath] = {
      password,
      ttl: ttl <= 0 ? 0 : now + ttl,
    }

    savePasswordCache(cache)
  })
}

export function getRelevantPasswords(filePath: string): string[] {
  const cache = getPasswordCache()
  const now = Date.now()
  const uniquePasswords: Set<string> = new Set()
  const passwords: string[] = []

  // Clean expired passwords (but keep infinite TTL ones)
  Object.keys(cache).forEach((path) => {
    if (cache[path].ttl > 0 && cache[path].ttl < now) {
      delete cache[path]
    }
  })

  if (cache[filePath] && cache[filePath].ttl > now) {
    // If the exact file path is cached, return its password
    return [cache[filePath].password]
  }

  // Get passwords by directory hierarchy (closest first)
  const sortedPaths = Object.keys(cache).sort((a, b) => {
    const aShared = getSharedDirectoryDepth(a, filePath)
    const bShared = getSharedDirectoryDepth(b, filePath)
    return bShared - aShared // Descending order (most shared first)
  })

  for (const path of sortedPaths) {
    if (!uniquePasswords.has(cache[path].password)) {
      uniquePasswords.add(cache[path].password)
      passwords.push(cache[path].password)
    }
  }

  return passwords
}

export function getSharedDirectoryDepth(path1: string, path2: string): number {
  const parts1 = path1.split("/")
  const parts2 = path2.split("/")
  let sharedDepth = 0

  const minLength = Math.min(parts1.length, parts2.length)
  for (let i = 0; i < minLength - 1; i++) {
    // -1 to exclude filename
    if (parts1[i] === parts2[i]) {
      sharedDepth++
    } else {
      break
    }
  }

  return sharedDepth
}

export async function contentDecryptedEventListener(
  filePath: string,
  hash: Hash,
  config: EncryptionConfig,
  callback: (password: string) => void,
  once: boolean = true,
) {
  const checkForValidPassword: () => Promise<boolean> = async () => {
    const password = await searchForValidPassword(filePath, hash, config)
    if (password) {
      callback(password)
      return true
    }
    return false
  }

  const result = await checkForValidPassword()

  if (!result || !once) {
    document.addEventListener("nav", async function listener() {
      const result = await checkForValidPassword()
      if (result && once) {
        document.removeEventListener("nav", listener)
      }
    })
  }
}