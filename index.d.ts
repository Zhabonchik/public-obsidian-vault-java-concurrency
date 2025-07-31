declare module "*.scss" {
  const content: string
  export = content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  render: CustomEvent<{ htmlElement: HTMLElement }>
  decrypt: CustomEvent<{ filePath: FullSlug; password: string }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
}

type DecryptedFlag = {
  decrypted?: boolean
}

type ContentIndex = Record<FullSlug, ContentDetails & DecryptedFlag>
declare const fetchData: Promise<ContentIndex>
