import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Naamloos",
    description: "Geen beschrijving gegeven.",
  },
  components: {
    callout: {
      note: "Notitie",
      abstract: "Samenvatting",
      info: "Info",
      todo: "Te doen",
      tip: "Tip",
      success: "Succes",
      question: "Vraag",
      warning: "Waarschuwing",
      failure: "Mislukking",
      danger: "Gevaar",
      bug: "Bug",
      example: "Voorbeeld",
      quote: "Citaat",
    },
    backlinks: {
      title: "Backlinks",
      noBacklinksFound: "Geen backlinks gevonden",
    },
    themeToggle: {
      lightMode: "Lichte modus",
      darkMode: "Donkere modus",
    },
    readerMode: {
      title: "Leesmodus",
    },
    explorer: {
      title: "Verkenner",
    },
    footer: {
      createdWith: "Gemaakt met",
    },
    graph: {
      title: "Grafiekweergave",
    },
    recentNotes: {
      title: "Recente notities",
      seeRemainingMore: ({ remaining }) => `Zie ${remaining} meer →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Invoeging van ${targetSlug}`,
      linkToOriginal: "Link naar origineel",
    },
    search: {
      title: "Zoeken",
      searchBarPlaceholder: "Doorzoek de website",
    },
    tableOfContents: {
      title: "Inhoudsopgave",
    },
    contentMeta: {
      readingTime: ({ minutes }) =>
        minutes === 1 ? "1 minuut leestijd" : `${minutes} minuten leestijd`,
    },
    encryption: {
      title: "🛡️ Beperkte Inhoud 🛡️",
      restricted: "Deze inhoud is beperkt. Voer het wachtwoord in om te bekijken:",
      enterPassword: "Voer wachtwoord in",
      decrypt: "Ontsleutelen",
      decrypting: "Ontsleutelen...",
      incorrectPassword: "Onjuist wachtwoord. Probeer opnieuw.",
      decryptionFailed: "Ontsleuteling mislukt, controleer logs",
      encryptedDescription: "Dit bestand is versleuteld. Open het om de inhoud te zien.",
    },
  },
  pages: {
    rss: {
      recentNotes: "Recente notities",
      lastFewNotes: ({ count }) => `Laatste ${count} notities`,
    },
    error: {
      title: "Niet gevonden",
      notFound: "Deze pagina is niet zichtbaar of bestaat niet.",
      home: "Keer terug naar de start pagina",
    },
    folderContent: {
      folder: "Map",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 item in deze map." : `${count} items in deze map.`,
    },
    tagContent: {
      tag: "Label",
      tagIndex: "Label-index",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 item met dit label." : `${count} items met dit label.`,
      showingFirst: ({ count }) =>
        count === 1 ? "Eerste label tonen." : `Eerste ${count} labels tonen.`,
      totalTags: ({ count }) => `${count} labels gevonden.`,
    },
  },
} as const satisfies Translation
