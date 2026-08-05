import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import CustomFooter from "./quartz/components/CustomFooter"
import type { ExplorerOptions } from "@quartz-community/explorer"

const priorityOrder: Record<string, number> = {
  "Книжный клуб": 1,
  Киноклуб: 2,
  "Об издательстве": 3,
  Контакты: 4,
}

const sortExplorerEntries: NonNullable<ExplorerOptions["sortFn"]> = (a, b) => {
  if (a.isFolder !== b.isFolder) {
    return a.isFolder ? -1 : 1
  }

  const aName = a.displayName ?? ""
  const bName = b.displayName ?? ""
  const priorityDifference =
    (priorityOrder[aName] ?? Number.MAX_SAFE_INTEGER) -
    (priorityOrder[bName] ?? Number.MAX_SAFE_INTEGER)

  return (
    priorityDifference ||
    aName.localeCompare(bName, "ru", {
      numeric: true,
      sensitivity: "base",
    })
  )
}

ExternalPlugin.Explorer({
  sortFn: sortExplorerEntries,
})

const footer = CustomFooter({
  copyrightText: "© 2025–2026 Издательство «Катоблепас»",
  links: {
    Telegram: "https://t.me/catoblepaspress",
  },
})

const layoutOverrides = {
  defaults: {
    footer: [footer],
  },
  byPageType: {
    content: { footer: [footer] },
    folder: { footer: [footer] },
    tag: { footer: [footer] },
    "404": { footer: [footer] },
  },
}

const config = await loadQuartzConfig(undefined, layoutOverrides)
export default config
export const layout = await loadQuartzLayout(layoutOverrides)
