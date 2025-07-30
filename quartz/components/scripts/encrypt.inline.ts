// Password cache management
const PASSWORD_CACHE_KEY = "quartz-encrypt-passwords"

function getPasswordCache(): Record<string, { password: string; ttl: number }> {
  try {
    const cache = localStorage.getItem(PASSWORD_CACHE_KEY)
    return cache ? JSON.parse(cache) : {}
  } catch {
    return {}
  }
}

function savePasswordCache(cache: Record<string, { password: string; ttl: number }>) {
  try {
    localStorage.setItem(PASSWORD_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Silent fail if localStorage is not available
  }
}

function addPasswordToCache(password: string, filePath: string, ttl: number) {
  const cache = getPasswordCache()
  const now = Date.now()

  // Store password for exact file path
  cache[filePath] = {
    password,
    ttl: ttl <= 0 ? 0 : now + ttl,
  }

  savePasswordCache(cache)
}

function getRelevantPasswords(filePath: string): string[] {
  const cache = getPasswordCache()
  const now = Date.now()
  const passwords: string[] = []

  // Clean expired passwords (but keep infinite TTL ones)
  Object.keys(cache).forEach((path) => {
    if (cache[path].ttl > 0 && cache[path].ttl < now) {
      delete cache[path]
    }
  })

  // Get passwords by directory hierarchy (closest first)

  // Sort cache keys by how many directory levels they share with current file
  const sortedPaths = Object.keys(cache).sort((a, b) => {
    const aShared = getSharedDirectoryDepth(a, filePath)
    const bShared = getSharedDirectoryDepth(b, filePath)
    return bShared - aShared // Descending order (most shared first)
  })

  for (const cachedPath of sortedPaths) {
    if (getSharedDirectoryDepth(cachedPath, filePath) > 0) {
      passwords.push(cache[cachedPath].password)
    }
  }

  savePasswordCache(cache)
  return passwords
}

function getSharedDirectoryDepth(path1: string, path2: string): number {
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

// Helper: hex string to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  if (!hex) return new ArrayBuffer(0)
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes.buffer
}

// Helper: ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Helper: string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer as ArrayBuffer
}

// Helper: ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

async function verifyPassword(password: string, parsed: any): Promise<boolean> {
  // Hash password with salt for verification using SubtleCrypto
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)
  const saltBytes = hexToArrayBuffer(parsed.salt)

  // Concatenate password and salt
  const combined = new Uint8Array(passwordBytes.byteLength + saltBytes.byteLength)
  combined.set(new Uint8Array(passwordBytes), 0)
  combined.set(new Uint8Array(saltBytes), passwordBytes.byteLength)

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", combined)
  const passwordHash = arrayBufferToHex(hashBuffer)

  return passwordHash === parsed.passwordHash
}

async function performDecryption(password: string, parsed: any, config: any): Promise<string> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  )

  // Derive key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: hexToArrayBuffer(parsed.salt),
      iterations: config.iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: getAlgorithmName(config.algorithm), length: config.keyLength * 8 },
    false,
    ["decrypt"],
  )

  const ciphertext = hexToArrayBuffer(parsed.content)

  let decryptedBuffer: ArrayBuffer

  if (config.algorithm.includes("gcm")) {
    // GCM mode
    const iv = hexToArrayBuffer(parsed.iv)
    const authTag = parsed.authTag ? hexToArrayBuffer(parsed.authTag) : null

    // For GCM, concatenate ciphertext + authTag
    let fullCiphertext = ciphertext
    if (authTag) {
      const combined = new Uint8Array(ciphertext.byteLength + authTag.byteLength)
      combined.set(new Uint8Array(ciphertext), 0)
      combined.set(new Uint8Array(authTag), ciphertext.byteLength)
      fullCiphertext = combined.buffer
    }

    decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fullCiphertext,
    )
  } else if (config.algorithm.includes("cbc")) {
    // CBC mode
    const iv = hexToArrayBuffer(parsed.iv)

    decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      key,
      ciphertext,
    )
  } else if (config.algorithm.includes("ecb")) {
    // ECB mode - simulate using CBC with zero IV (SubtleCrypto doesn't support ECB directly)
    const zeroIv = new ArrayBuffer(16) // 16 bytes of zeros

    decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: zeroIv,
      },
      key,
      ciphertext,
    )
  } else {
    throw new Error("Unsupported algorithm: " + config.algorithm)
  }

  return arrayBufferToString(decryptedBuffer)
}

function getAlgorithmName(algorithm: string): string {
  if (algorithm.includes("gcm")) return "AES-GCM"
  if (algorithm.includes("cbc")) return "AES-CBC"
  if (algorithm.includes("ecb")) return "AES-CBC" // Use CBC for ECB simulation
  throw new Error("Unsupported algorithm: " + algorithm)
}

function showLoading(container: Element, show: boolean) {
  const loadingDiv = container.querySelector(".decrypt-loading") as HTMLElement
  const form = container.querySelector(".decrypt-form") as HTMLElement

  if (loadingDiv && form) {
    if (show) {
      form.style.display = "none"
      loadingDiv.style.display = "flex"
    } else {
      form.style.display = "flex"
      loadingDiv.style.display = "none"
    }
  }
}

async function decryptWithPassword(
  container: Element,
  password: string,
  showError = true,
): Promise<boolean> {
  const errorDiv = container.querySelector(".decrypt-error") as HTMLElement
  const encryptedData = (container as HTMLElement).dataset.encrypted!
  const config = JSON.parse((container as HTMLElement).dataset.config!)
  const i18n = JSON.parse((container as HTMLElement).dataset.i18n!)

  if (showError) errorDiv.style.display = "none"

  try {
    const parsed = JSON.parse(atob(encryptedData))

    // First verify password hash
    const isValidPassword = await verifyPassword(password, parsed)

    if (!isValidPassword) {
      if (showError) throw new Error(i18n.incorrectPassword)
      return false
    }

    // Show loading indicator when hash passes and give UI time to update
    if (showError) {
      showLoading(container, true)
      // Allow UI to update before starting heavy computation
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    try {
      // If hash matches, decrypt content
      const decryptedContent = await performDecryption(password, parsed, config)

      if (decryptedContent) {
        // Cache the password
        const filePath = window.location.pathname
        addPasswordToCache(password, filePath, config.ttl)

        // Replace content
        const contentWrapper = document.createElement("div")
        contentWrapper.className = "decrypted-content-wrapper"
        contentWrapper.innerHTML = decryptedContent
        container.parentNode!.replaceChild(contentWrapper, container)
        return true
      }

      if (showError) throw new Error(i18n.decryptionFailed)
      return false
    } catch (decryptError) {
      if (showError) showLoading(container, false)
      if (showError) throw new Error(i18n.decryptionFailed)
      return false
    }
  } catch (error) {
    if (showError) {
      showLoading(container, false)
      errorDiv.style.display = "block"
      errorDiv.textContent = error instanceof Error ? error.message : "Decryption failed"
      const passwordInput = container.querySelector(".decrypt-password") as HTMLInputElement
      if (passwordInput) {
        passwordInput.value = ""
        passwordInput.focus()
      }
    }
    return false
  }
}

async function tryAutoDecrypt(container: Element): Promise<boolean> {
  const filePath = window.location.pathname
  const passwords = getRelevantPasswords(filePath)

  for (const password of passwords) {
    if (await decryptWithPassword(container, password, false)) {
      return true
    }
  }
  return false
}

async function manualDecrypt(container: Element) {
  const passwordInput = container.querySelector(".decrypt-password") as HTMLInputElement
  const password = passwordInput.value

  if (!password) {
    passwordInput.focus()
    return
  }

  await decryptWithPassword(container, password, true)
}

document.addEventListener("nav", async () => {
  // Try auto-decryption for all encrypted content
  const encryptedElements = document.querySelectorAll(".encrypted-content")

  for (const container of encryptedElements) {
    await tryAutoDecrypt(container)
  }

  // Manual decryption handlers
  const buttons = document.querySelectorAll(".decrypt-button")

  buttons.forEach((button) => {
    const handleClick = async function (this: HTMLElement) {
      const container = this.closest(".encrypted-content")!
      await manualDecrypt(container)
    }

    button.addEventListener("click", handleClick)
    window.addCleanup(() => button.removeEventListener("click", handleClick))
  })

  // Enter key handler
  document.querySelectorAll(".decrypt-password").forEach((input) => {
    const handleKeypress = async function (this: HTMLInputElement, e: Event) {
      const keyEvent = e as KeyboardEvent
      if (keyEvent.key === "Enter") {
        const container = this.closest(".encrypted-content")!
        await manualDecrypt(container)
      }
    }

    input.addEventListener("keypress", handleKeypress)
    window.addCleanup(() => input.removeEventListener("keypress", handleKeypress))
  })
})
