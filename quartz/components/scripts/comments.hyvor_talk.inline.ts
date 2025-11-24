document.addEventListener("nav", () => {
  if (!document.getElementById("hyvor-talk-script")) {
    const script = document.createElement("script")
    script.id = "hyvor-talk-script"
    script.src = "https://talk.hyvor.com/embed/embed.js"
    script.async = true
    script.type = "module"

    document.body.appendChild(script)
  }

  const container = document.getElementById("hyvor-talk-container")
  if (!container) {
    return
  }

  const websiteId = container.dataset.websiteId
  if (!websiteId) {
    return
  }

  const comments = document.createElement("hyvor-talk-comments")
  comments.setAttribute("website-id", websiteId)
  comments.setAttribute("page-id", window.location.pathname)
  comments.setAttribute("instance", "https://talk.hyvor.localhost")

  if ((window as any).hyvorTalkStyles) {
    ;(window as any).hyvorTalkStyles.stylesheet = undefined
  }

  container.innerHTML = ""
  container.appendChild(comments)
})
