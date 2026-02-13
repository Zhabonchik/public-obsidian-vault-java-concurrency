import Content from "./pages/Content"
import TagContent from "./pages/TagContent"
import FolderContent from "./pages/FolderContent"
import NotFound from "./pages/404"
import Head from "./Head"
import Spacer from "./Spacer"
import TableOfContents from "./TableOfContents"
import Backlinks from "./Backlinks"
import Search from "./Search"
import DesktopOnly from "./DesktopOnly"
import MobileOnly from "./MobileOnly"
import RecentNotes from "./RecentNotes"
import Breadcrumbs from "./Breadcrumbs"
import Comments from "./Comments"
import Flex from "./Flex"
import ConditionalRender from "./ConditionalRender"

export { componentRegistry, defineComponent } from "./registry"
export { External } from "./external"
export type { ComponentManifest, RegisteredComponent } from "./registry"
export type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export {
  Content,
  TagContent,
  FolderContent,
  Head,
  Spacer,
  TableOfContents,
  Backlinks,
  Search,
  DesktopOnly,
  MobileOnly,
  RecentNotes,
  NotFound,
  Breadcrumbs,
  Comments,
  Flex,
  ConditionalRender,
}
