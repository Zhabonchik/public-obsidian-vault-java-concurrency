import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/linksList.scss"

interface Options {
  links: Record<string, string>
}

const MailIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const GitHubIcon = () => (
  <svg class="links-list-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
)

const LinkedInIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" />
    <path d="M8 11v5" />
    <path d="M12 16v-2.75a2.25 2.25 0 0 1 4.5 0V16" />
  </svg>
)

const YouTubeIcon = () => (
  <svg
    class="links-list-icon links-list-icon-youtube"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="6" width="18" height="12" rx="3.5" />
    <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
  </svg>
)

const RssIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M5 18h.01" />
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 6a14 14 0 0 1 14 14" />
  </svg>
)

const InstagramIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)

const XIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M5 4h3l11 16h-3z" />
    <path d="M19 4 5 20" />
  </svg>
)

const MastodonIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <path d="M8 16v-4.5a2.5 2.5 0 0 1 4.38-1.66A2.5 2.5 0 0 1 16 11.5V16" />
  </svg>
)

const LinkIcon = () => (
  <svg
    class="links-list-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const getLinkIcon = (text: string, link: string) => {
  const normalizedText = text.toLowerCase()
  const normalizedLink = link.toLowerCase()

  if (normalizedLink.startsWith("mailto:") || normalizedText.includes("mail")) {
    return MailIcon
  }

  if (normalizedText.includes("github") || normalizedLink.includes("github.com")) {
    return GitHubIcon
  }

  if (normalizedText.includes("linkedin") || normalizedLink.includes("linkedin.com")) {
    return LinkedInIcon
  }

  if (normalizedText.includes("youtube") || normalizedLink.includes("youtube.com") || normalizedLink.includes("youtu.be")) {
    return YouTubeIcon
  }

  if (
    normalizedText.includes("instagram") ||
    normalizedLink.includes("instagram.com")
  ) {
    return InstagramIcon
  }

  if (
    normalizedText === "x" ||
    normalizedText.includes("twitter") ||
    normalizedLink.includes("x.com") ||
    normalizedLink.includes("twitter.com")
  ) {
    return XIcon
  }

  if (
    normalizedText.includes("mastodon") ||
    normalizedLink.includes("mastodon")
  ) {
    return MastodonIcon
  }

  if (
    normalizedText.includes("rss") ||
    normalizedLink.endsWith(".xml") ||
    normalizedLink.includes("/rss") ||
    normalizedLink.includes("/feed")
  ) {
    return RssIcon
  }

  return LinkIcon
}

export default ((opts?: Options) => {
  const LinksList: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? {}
    return (
      <div class={classNames(displayClass, "links-list")}>
        <h3>Social</h3>
        <div class="links-list-grid">
          {Object.entries(links).map(([text, link]) => {
            const Icon = getLinkIcon(text, link)
            const isExternal = link.startsWith("http://") || link.startsWith("https://")

            return (
              <a
                class="links-list-link"
                href={link}
                aria-label={text}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                <Icon />
                <span>{text}</span>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  LinksList.css = style
  return LinksList
}) satisfies QuartzComponentConstructor
