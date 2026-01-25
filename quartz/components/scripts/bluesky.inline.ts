document.addEventListener("nav", async () => {
  const container = document.getElementById("bluesky-comments")
  if (!container) return

  const url = container.getAttribute("data-url")
  if (!url) return

  try {
    const { handle, postId } = parseBlueskyUrl(url)
    const did = await resolveHandle(handle)
    const replies = await fetchThread(did, postId)
    renderComments(replies)
  } catch (e) {
    console.error("Error loading Bluesky comments:", e)
    const list = document.getElementById("bluesky-comments-list")
    if (list) {
      list.textContent = "Error loading comments."
    }
  }
})

function parseBlueskyUrl(url: string) {
  const urlParts = new URL(url).pathname.split("/")
  const handle = urlParts[2]
  const postId = urlParts[4]

  if (!handle || !postId) throw new Error("Invalid Bluesky URL")
  return { handle, postId }
}

async function resolveHandle(handle: string) {
  const resolveRes = await fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`,
  )
  if (!resolveRes.ok) throw new Error("Could not resolve handle")
  const { did } = await resolveRes.json()
  return did
}

async function fetchThread(did: string, postId: string) {
  const atUri = `at://${did}/app.bsky.feed.post/${postId}`
  const threadRes = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${atUri}&depth=10&parentHeight=0`,
  )

  if (!threadRes.ok) throw new Error("Could not fetch thread")
  const data = await threadRes.json()
  return data.thread.replies
}

function renderComments(replies: any[]) {
  const commentsList = document.getElementById("bluesky-comments-list")
  if (!commentsList) return

  if (replies && replies.length > 0) {
    commentsList.innerHTML = "" // Clear loading text
    // Sort by likes
    replies.sort((a: any, b: any) => (b.post.likeCount || 0) - (a.post.likeCount || 0))

    replies.forEach((reply: any) => {
      if (!reply.post) return
      commentsList.appendChild(createCommentNode(reply))
    })
  } else {
    commentsList.textContent = "No comments yet."
  }
}

function createCommentNode(reply: any): HTMLElement {
  const post = reply.post
  const author = post.author
  const date = new Date(post.indexedAt).toLocaleDateString()

  const div = document.createElement("div")
  div.className = "comment"

  // Header
  const header = document.createElement("div")
  header.className = "comment-header"

  if (author.avatar) {
    const avatar = document.createElement("img")
    avatar.src = author.avatar
    avatar.alt = author.handle
    header.appendChild(avatar)
  }

  const handleLink = document.createElement("a")
  const postId = post.uri.split("/").pop()
  handleLink.href = `https://bsky.app/profile/${author.did}/post/${postId}`
  handleLink.target = "_blank"
  handleLink.className = "handle"
  handleLink.textContent = author.displayName || author.handle
  header.appendChild(handleLink)

  const timeSpan = document.createElement("span")
  timeSpan.className = "time"
  timeSpan.textContent = date
  header.appendChild(timeSpan)

  div.appendChild(header)

  // Body
  div.appendChild(renderPostBody(post))

  // Actions
  const actions = document.createElement("div")
  actions.className = "comment-actions"

  const likes = document.createElement("span")
  likes.textContent = `❤️ ${post.likeCount || 0}`
  actions.appendChild(likes)

  const reposts = document.createElement("span")
  reposts.textContent = `🔁 ${post.repostCount || 0}`
  actions.appendChild(reposts)

  div.appendChild(actions)

  // Recursive rendering for nested replies
  if (reply.replies && reply.replies.length > 0) {
    const repliesContainer = document.createElement("div")
    repliesContainer.className = "replies"
    reply.replies.forEach((child: any) => {
      if (!child.post) return
      repliesContainer.appendChild(createCommentNode(child))
    })
    div.appendChild(repliesContainer)
  }

  return div
}
function renderPostBody(post: any): HTMLElement {
  const text = post.record.text
  const facets = post.record.facets
  const body = document.createElement("div")
  body.className = "comment-body"

  if (!facets || facets.length === 0) {
    body.textContent = text
    return body
  }

  facets.sort((a: any, b: any) => a.index.byteStart - b.index.byteStart)

  const bytes = new TextEncoder().encode(text)
  let lastByteIndex = 0

  for (const facet of facets) {
    const { byteStart, byteEnd } = facet.index

    if (byteStart > lastByteIndex) {
      const slice = bytes.slice(lastByteIndex, byteStart)
      const textNode = document.createTextNode(new TextDecoder().decode(slice))
      body.appendChild(textNode)
    }

    const slice = bytes.slice(byteStart, byteEnd)
    const facetText = new TextDecoder().decode(slice)
    const feature = facet.features[0]

    if (feature["$type"] === "app.bsky.richtext.facet#link") {
      const link = document.createElement("a")
      link.href = feature.uri
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.textContent = facetText
      body.appendChild(link)
    } else if (feature["$type"] === "app.bsky.richtext.facet#mention") {
      const link = document.createElement("a")
      link.href = `https://bsky.app/profile/${feature.did}`
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.textContent = facetText
      body.appendChild(link)
    } else if (feature["$type"] === "app.bsky.richtext.facet#tag") {
      const link = document.createElement("a")
      link.href = `https://bsky.app/hashtag/${feature.tag}`
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.textContent = facetText
      body.appendChild(link)
    } else {
      body.appendChild(document.createTextNode(facetText))
    }

    lastByteIndex = byteEnd
  }

  if (lastByteIndex < bytes.length) {
    const slice = bytes.slice(lastByteIndex)
    body.appendChild(document.createTextNode(new TextDecoder().decode(slice)))
  }

  return body
}
