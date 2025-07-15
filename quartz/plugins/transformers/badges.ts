import { QuartzTransformerPlugin } from "../types"
import badgesCSS from "../../styles/badges.scss"
import { JSResource, CSSResource } from "../../util/resources"
import icons from "lucide-static"

export const BADGE_TYPES: any[] = [
  ["note", "Note", "lucide-pencil"],
  ["info", "Info", "lucide-info"],
  ["todo", "Todo", "lucide-check-circle-2"],
  ["abstract", "Abstract", "lucide-clipboard-list"],
  ["summary", "Summary", "lucide-clipboard-list"],
  ["tldr", "TLDR", "lucide-clipboard-list"],
  ["tip", "Tip", "lucide-flame"],
  ["hint", "Hint", "lucide-flame"],
  ["important", "Important", "lucide-flame"],
  ["success", "Success", "lucide-check"],
  ["check", "Check", "lucide-check"],
  ["done", "Done", "lucide-check"],
  ["question", "Question", "help-circle"],
  ["help", "Help", "help-circle"],
  ["faq", "FAQ", "help-circle"],
  ["warning", "Warning", "lucide-alert-triangle"],
  ["caution", "Caution", "lucide-alert-triangle"],
  ["attention", "Attention", "lucide-alert-triangle"],
  ["failure", "Failure", "lucide-x"],
  ["fail", "Fail", "lucide-x"],
  ["missing", "Missing", "lucide-x"],
  ["danger", "Danger", "lucide-zap"],
  ["error", "Error", "lucide-zap"],
  ["bug", "Bug", "lucide-bug"],
  ["example", "Example", "lucide-list"],
  ["quote", "Quote", "quote-glyph"],
  ["cite", "Cite", "quote-glyph"],
  ["power", "Power", "lucide-power"],
  ["verse", "Verse", "lucide-music"],
  ["complete", "Complete", "lucide-check-circle"],
  ["milestone", "Milestone", "lucide-milestone"],
  ["component", "Component", "lucide-toy-brick"],
  ["polish", "Polish", "lucide-car"],
  ["point", "point", "lucide-pointer"],
  ["dream", "Dream", "lucide-moon"],
  ["process", "Process", "lucide-clock"],
  ["refine", "Refine", "lucide-axe"],
  ["image", "Image", "lucide-image"],
  ["party", "Party", "lucide-party-popper"],
  ["crystallize", "Crystallize", "lucide-diamond"],
  ["definition", "Definition", "lucide-key"],
  ["mention", "Mention", "lucide-at-sign"],
  ["exclaim", "Exclaim", "lucide-megaphone"],
  ["meta", "Meta", "lucide-filter"],
  ["compute", "Compute", "lucide-hourglass"],
  ["emergency", "Emergency", "lucide-siren"],
  ["magnet", "Magnet", "lucide-magnet"],
  ["flag", "Flag", "flag"],
  ["branch", "Branch", "network"],
  ["snippet", "Snippet", "scissors"],
  ["lock", "Lock", "lock"],
  ["highlight", "Highlight", "highlighter"],
  ["clue", "Clue", "puzzle"],
  ["claim", "Claim", "anchor"],
  ["profile", "Profile", "lucide-user"],
  ["hat-tip", "Hat-tip", "hard-hat"],
  ["dig", "Dig", "shovel"],
  ["witness", "Witness", "edit-3"],
  ["notice", "Notice", "pen-tool"],
  ["attachment", "Attachment", "paperclip"],
  ["lightbulb", "Lightbulb", "lightbulb"],
  ["prohibit", "Prohibit", "ban"],
  ["stop", "Stop", "lucide-alert-octagon"],
  ["bomb", "Bomb", "lucide-bomb"],
  ["hold", "Hold", "lucide-hand"],
  ["charge", "Charge", "lucide-zap"],
  ["sprout", "Sprout", "lucide-sprout"],
  ["extract", "Extract", "lucide-hammer"],
  ["compass", "Compass", "lucide-compass"],
  ["map", "Map", "lucide-map"],
  ["expedition", "Expedition", "lucide-mountain-snow"],
  ["home", "Home", "lucide-home"],
  ["knowledge", "Knowledge", "lucide-book"],
  ["account", "Account", "open-vault"],
  ["judgment", "Judgment", "lucide-gavel"],
  ["balance", "Balance", "lucide-scale"],
  ["feast", "Feast", "lucide-grape"],
  ["gift", "Gift", "lucide-gift"],
  ["love", "Love", "lucide-heart"],
  ["specimen", "Specimen", "lucide-gem"],
  ["command", "Command", "lucide-swords"],
  ["deed", "Deed", "lucide-scroll"],
  ["honor", "Honor", "lucide-sword"],
  ["reward", "Reward", "lucide-crown"],
  ["customized", "Customized", "hash"],
  ["vault", "Vault", "vault"],
]

var allBadges: any[] = BADGE_TYPES //Append custom badges to the end of this array.

const REGEXP = /\[!!([^\]]+)\]/gm
const CODEREGEX = /`([^`\n]+)`/g

export interface Options {
  customBadges: Array, // Write in format [ [icon,name,[RED,GREEN,BLUE,ALPHA],TEXT_ALPHA], [icon,name,[RED,GREEN,BLUE,ALPHA],TEXT_ALPHA] ]
}

const defaultOptions: Options = {
  customBadges: []
}

export const InlineBadges: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "InlineBadges",
    textTransform(_ctx, src) {
      // Append custom badges.
      for (let badge of opts.customBadges){
        allBadges.push([badge[1],badge[1],badge[0]]) // Pushes it to the array in the format [icon,icon,name].
      }

      var srcReplacement: string = src //Start by assuming there are no badges.
      for (const match of src.matchAll(CODEREGEX)) {
        for (const badgeMatch of match[0].matchAll(REGEXP)) {
          srcReplacement = srcReplacement.replace(match[0], buildBadge(badgeMatch[0]))
        }
      }
      return srcReplacement
    },
    externalResources() {
      // Required for proper rendering under themes.
      const js: JSResource[] = []
      const css: CSSResource[] = []

      css.push({
        content: badgesCSS,
        inline: true,
      })
      css.push({
        // Requirement for the SVG to align properly.
        content: ".inline-badge .inline-badge-icon svg {display: flex;align-self: center;}",
        inline: true,
      })
      // Sets the colour of custom badges.
      for (let badgeDef of opts.customBadges){
       let badgeColor: string = `${badgeDef[2][0]},${badgeDef[2][1]},${badgeDef[2][2]}`
       let textColor:  string = `rgba(var(--badge-color),${badgeDef[3]})`
       let badgeName: string = badgeDef[1] // Removes the "" from the name.
        css.push({
         content: `.inline-badge[data-inline-badge=${badgeName}] {
                      --badge-color: ${badgeColor};
                      color: rgba(var(--badge-color), ${badgeDef[2][3]});
                      background-color: ${textColor};
                    }`,
        inline: true,
      })
      }
      return { js, css }
    },
  }
}

function buildBadge(text: string) {
  // HTML Elements
  let newEl = ""
  let iconEl = ""
  let titleEl = ""
  let textEl = ""
  let attrType = ""
  let part: string = text?.substring(2) ?? ""
  let content: string = part?.substring(part.length - 1, 1).trim() ?? ""
  let styleAttr = ""

  // no content
  if (!content.length) {
    newEl = "<span>Badges syntax error</span>"
    return newEl
  }

  let parts: string[] = content.split(":", 2)
  // return if NO CONTENT
  if (parts.length < 2) {
    newEl = `<span style="color:var(--text-error)">❌ Badges syntax error</span>`
    return newEl
  }

  // type of badge
  let badgeType: string = parts[0].trim()
  // build and check for extras
  let extras: string[] = badgeType.split("|")
  let hasExtra: boolean = extras.length > 1
  // title value for badge
  let badgeContent: string = parts[1].trim().split("|")[0] //Original code doesnt have .split[...] but for some reason its needed for proper rendering.

  // custom badge
  if (extras.length == 3) {
    //icon
    iconEl = `<span class="inline-badge-icon" aria-label="${extras[2]}">${getLucideIconSvg(extras[1])}</span>`
    attrType = "customized"

    // details
    let details: any[] = parts[1].split("|")

    //title
    let title: string = details[0].trim()
    titleEl = `<span class="inline-badge-title-inner">${title}</span>`

    // color
    let color: string = "currentColor"
    if (details[1]) {
      color = details[1].trim()
    }

    styleAttr = `style="--customize-badge-color: ${color};"`
  } else {
    if (hasExtra) {
      // Github badges
      if (extras[1].startsWith("ghb>") || extras[1].startsWith("ghs>")) {
        let ghType: string = extras[1].split(">")[1].trim()
        iconEl = `<span class="inline-badge-icon" aria-label="Github">${getLucideIconSvg("github")}</span>`
        textEl = `<span class="gh-type">${ghType}</span>`
        attrType = extras[1].startsWith("ghb>") ? "github" : "github-success"
        badgeType = extras[1].startsWith("ghb>") ? "github" : "github-success"
      } else {
        // No icon, text only
        iconEl = `<span>${badgeType.split("|")[1].trim()}</span>`
        attrType = "text"
        badgeType = "text"
      }
    } else {
      // Non-github
      attrType = badgeType.trim()
      allBadges.forEach((el) => {
        if (el.indexOf(badgeType.toLowerCase()) == 0 && el[2].length > 0) {
          iconEl = `<span class="inline-badge-icon" aria-label=${badgeType.trim()}>${getLucideIconSvg(el[2])}</span>`
        }
      })
    }
  }
  // render
  titleEl = `<span class="inline-badge-title-inner">${badgeContent}</span>`
  newEl = `<span class="inline-badge" data-inline-badge="${attrType.toLowerCase()}" ${styleAttr}>${iconEl}${textEl}${titleEl}</span>`
  return newEl
}

function getLucideIconSvg(iconName: string): string {
  var potentialIconReturn =
    icons[toPascalCase(iconName.replace(/^lucide-/, "")) as keyof typeof icons]
  if (potentialIconReturn) {
    var iconToReturn = potentialIconReturn.replace(/\n/g, "").replace("  ", " ")
    return iconToReturn
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban-icon lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`
  }
}

function toPascalCase(str: string): string {
  // First, convert kebab-case to camelCase
  const camelCaseStr = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  // Then, capitalize the first letter to make it PascalCase
  return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1)
}
