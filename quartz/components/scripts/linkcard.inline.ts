// Handle link card image failures
function handleLinkCardImages() {
  const linkCardImages = document.querySelectorAll('.rlc-image')
  
  linkCardImages.forEach((img: Element) => {
    const imgElement = img as HTMLImageElement
    const container = imgElement.closest('.rlc-image-container')
    
    if (!container) return
    
    // If the image has already failed to load (complete=true and naturalWidth=0)
    if (imgElement.complete && imgElement.naturalWidth === 0) {
      container.classList.add('image-failed')
      return
    }
    
    // Event listener for image load errors
    const handleError = () => {
      container.classList.add('image-failed')
    }
    
    imgElement.addEventListener('error', handleError)
    window.addCleanup(() => imgElement.removeEventListener('error', handleError))
  })
}

// Execute on page load and navigation events
document.addEventListener('nav', handleLinkCardImages)
document.addEventListener('DOMContentLoaded', handleLinkCardImages)