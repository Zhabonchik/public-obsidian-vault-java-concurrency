import {
  decryptContent,
  verifyPasswordHash,
  addPasswordToCache,
  Hash,
  CompleteCryptoConfig,
  searchForValidPassword,
  EncryptionResult,
} from "../../util/encryption"
import { FullSlug, getFullSlug } from "../../util/path"
import { addRenderListener, dispatchRenderEvent } from "./util"

const showLoading = (container: Element, show: boolean) => {
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

function dispatchDecryptEvent(filePath: FullSlug, password: string) {
  const event = new CustomEvent("decrypt", {
    detail: {
      filePath,
      password,
    },
  })
  document.dispatchEvent(event)
}

const decryptWithPassword = async (
  container: Element,
  password: string,
  showError = true,
): Promise<boolean> => {
  const errorDivs = container.querySelectorAll(".decrypt-error") as NodeListOf<HTMLElement>
  const containerElement = container as HTMLElement

  const config = JSON.parse(containerElement.dataset.config!) as CompleteCryptoConfig
  const encrypted = JSON.parse(containerElement.dataset.encrypted!) as EncryptionResult
  const hash = JSON.parse(containerElement.dataset.hash!) as Hash

  if (showError) errorDivs.forEach((div) => (div.style.display = "none"))

  try {
    // Check if crypto.subtle is available (especially important for older iOS versions)
    if (!crypto || !crypto.subtle) {
      throw new Error(
        "This device does not support the required encryption features. Please use a modern browser.",
      )
    }

    // First verify password hash
    let isValidPassword: boolean

    isValidPassword = await verifyPasswordHash(password, hash)

    if (!isValidPassword) {
      if (showError) throw new Error("incorrect-password")
      return false
    }

    // Show loading indicator when hash passes and give UI time to update
    if (showError) {
      showLoading(container, true)
      // Allow UI to update before starting heavy computation
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    try {
      let decryptedContent: string

      decryptedContent = await decryptContent(encrypted, config, password)

      if (decryptedContent) {
        // Cache the password
        const filePath = getFullSlug(window)
        await addPasswordToCache(password, filePath, config.ttl)

        // Replace content
        const contentWrapper = document.createElement("div")
        contentWrapper.className = "decrypted-content-wrapper"
        contentWrapper.innerHTML = decryptedContent
        container.parentNode!.replaceChild(contentWrapper, container)
        // set data-decrypted of the original container to true
        containerElement.dataset.decrypted = "true"

        return true
      }

      if (showError) throw new Error("decryption-failed")
      return false
    } catch (decryptError) {
      console.error("Decryption failed:", decryptError)
      if (showError) showLoading(container, false)
      if (showError) throw new Error("decryption-failed")
      return false
    }
  } catch (error) {
    if (showError) {
      showLoading(container, false)
      const errorMessage = error instanceof Error ? error.message : null

      errorDivs.forEach((div) => {
        if (div.dataset.error == errorMessage) {
          div.style.display = "block"
        }
      })
      const passwordInput = container.querySelector(".decrypt-password") as HTMLInputElement
      const decryptButton = container.querySelector(".decrypt-button") as HTMLButtonElement

      // Check if we're in a popover context
      const isInPopover = container.closest(".popover") !== null

      if (passwordInput) {
        passwordInput.value = ""
        if (isInPopover) {
          // Disable input and button in popover on failure
          passwordInput.disabled = true
          if (decryptButton) {
            decryptButton.disabled = true
          }
        } else {
          passwordInput.focus()
        }
      }
    }
    return false
  }
}

function updateTitle(container: HTMLElement | null) {
  if (container) {
    const span = container.querySelector(".article-title-icon") as HTMLElement
    if (span) {
      span.textContent = "🔓 "
    }
  }
}

const tryAutoDecrypt = async (parent: HTMLElement, container: HTMLElement): Promise<boolean> => {
  const fullSlug = container.dataset.slug as FullSlug
  const config = JSON.parse(container.dataset.config!) as CompleteCryptoConfig
  const hash = JSON.parse(container.dataset.hash!) as Hash

  const password = await searchForValidPassword(fullSlug, hash, config)

  if (password && (await decryptWithPassword(container, password, false))) {
    dispatchRenderEvent(parent)
    dispatchDecryptEvent(fullSlug, password)
    updateTitle(parent)
    return true
  }
  return false
}

const manualDecrypt = async (parent: HTMLElement, container: HTMLElement) => {
  const fullSlug = container.dataset.slug as FullSlug
  const passwordInput = container.querySelector(".decrypt-password") as HTMLInputElement
  const password = passwordInput.value

  if (!password) {
    passwordInput.focus()
    return
  }

  if (await decryptWithPassword(container, password, true)) {
    dispatchRenderEvent(parent)
    dispatchDecryptEvent(fullSlug, password)
    updateTitle(parent)
  }
}

addRenderListener(async (element) => {
  // Try auto-decryption for all encrypted content with data-decrypted="false"
  const encryptedElements = element.querySelectorAll(
    ".encrypted-content[data-decrypted='false']",
  ) as NodeListOf<HTMLElement>

  for (const encryptedContainer of encryptedElements) {
    await tryAutoDecrypt(element, encryptedContainer)
  }

  // Manual decryption handlers
  const buttons = element.querySelectorAll(".decrypt-button")

  buttons.forEach((button) => {
    const handleClick = async function (this: HTMLElement) {
      const encryptedContainer = this.closest(".encrypted-content")!
      await manualDecrypt(element, encryptedContainer as HTMLElement)
    }

    button.addEventListener("click", handleClick)
    // Check if window.addCleanup exists before using it
    if (window.addCleanup) {
      window.addCleanup(() => button.removeEventListener("click", handleClick))
    }
  })

  // Enter key handler
  element.querySelectorAll(".decrypt-password").forEach((input) => {
    const handleKeypress = async function (this: HTMLInputElement, e: Event) {
      const keyEvent = e as KeyboardEvent
      if (keyEvent.key === "Enter") {
        const encryptedContainer = this.closest(".encrypted-content")!
        await manualDecrypt(element, encryptedContainer as HTMLElement)
      }
    }

    input.addEventListener("keypress", handleKeypress)
    // Check if window.addCleanup exists before using it
    if (window.addCleanup) {
      window.addCleanup(() => input.removeEventListener("keypress", handleKeypress))
    }
  })
})
