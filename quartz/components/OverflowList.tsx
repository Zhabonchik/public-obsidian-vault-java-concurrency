import { JSX } from "preact"

const OverflowList = ({ children, ...props }: JSX.HTMLAttributes<HTMLUListElement>) => {
  return (
    <ul {...props} class={[props.class, "overflow"].filter(Boolean).join(" ")}>
      {children}
      <li class="overflow-end" />
    </ul>
  )
}

let numExplorers = 0
export default () => {
  const dataId = `list-${numExplorers++}`

  return {
    OverflowList: (props: JSX.HTMLAttributes<HTMLUListElement>) => (
      <OverflowList {...props} data-list-id={dataId} />
    ),
    overflowListAfterDOMLoaded: `
document.addEventListener("nav", (e) => {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const parentUl = entry.target.parentElement
      if (!parentUl) return
      if (entry.isIntersecting) {
        parentUl.classList.remove("gradient-active")
      } else {
        parentUl.classList.add("gradient-active")
      }
    }
  })

  const ul = document.querySelector("ul[data-list-id='${dataId}']")
  if (!ul) return

  const end = ul.querySelector(".overflow-end")
  if (!end) return

  observer.observe(end)
  window.addCleanup(() => observer.disconnect())
})
`,
  }
}
