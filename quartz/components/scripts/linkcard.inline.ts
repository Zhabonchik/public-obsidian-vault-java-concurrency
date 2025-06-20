function handleLinkCardImages() {
  const linkCardImages = document.querySelectorAll(".rlc-image") as NodeListOf<HTMLImageElement>

  linkCardImages.forEach((imgElement) => {
    const container = imgElement.closest(".rlc-image-container")
    if (!container) return

    if (imgElement.complete && imgElement.naturalWidth === 0) {
      container.classList.add("image-failed")
      return
    }

    const handleError = () => container.classList.add("image-failed")

    imgElement.addEventListener("error", handleError, { once: true })
    window.addCleanup(() => imgElement.removeEventListener("error", handleError))
  })
}

document.addEventListener("nav", handleLinkCardImages)
document.addEventListener("DOMContentLoaded", handleLinkCardImages)
