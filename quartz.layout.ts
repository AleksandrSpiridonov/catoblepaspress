import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.CustomFooter({
    links: {
      "Telegram": "https://t.me/catoblepaspress",
    },
    copyrightText: "© 2025-2026 Издательство «Катоблепас»",
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        rootName: "Главная",
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({
      showReadingTime: false,
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "tags",
      sortFn: (a, b) => {
        // Сначала папки, потом файлы
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          // Простая сортировка по названию с приоритетом для определенных файлов
          const priorityOrder: Record<string, number> = {
            'Книжный клуб': 1, 
            'Киноклуб': 2,
            'Об издательстве': 3,
            'Контакты': 4
          }
          
          const aPriority = priorityOrder[a.displayName] || 999
          const bPriority = priorityOrder[b.displayName] || 999
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }
          
          // Иначе по алфавиту
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }

        if (!a.isFolder && b.isFolder) {
          return 1
        } else {
          return -1
        }
      }
    }),
  ],
  right: [
    Component.Graph({
      localGraph: {
        drag: true, // whether to allow panning the view around
        zoom: true, // whether to allow zooming in and out
        depth: 1, // how many hops of notes to display
        scale:1.1, // default view scale
        repelForce: 0.9, // how much nodes should repel each other
        centerForce: 0.9, // how much force to use when trying to center the nodes
        linkDistance: 50, // how long should the links be by default?
        fontSize: 0.6, // what size should the node labels be?
        opacityScale: 1, // how quickly do we fade out the labels when zooming out?
        removeTags: [], // what tags to remove from the graph
        showTags: true, // whether to show tags in the graph
        enableRadial: false, // whether to constrain the graph, similar to Obsidian
      },
      globalGraph: {
        drag: true,
        zoom: true,
        depth: -1,
        scale: 0.9,
        repelForce: 0.9,
        centerForce: 0.9,
        linkDistance: 50,
        fontSize: 0.6,
        opacityScale: 1,
        removeTags: [], // what tags to remove from the graph
        showTags: true, // whether to show tags in the graph
        enableRadial: false, // whether to constrain the graph, similar to Obsidian
      },
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs({
    rootName: "Главная",
  }), Component.ArticleTitle(), Component.ContentMeta({
    showReadingTime: false,
  })],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "tags",
      sortFn: (a, b) => {
        // Сначала папки, потом файлы
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          // Простая сортировка по названию с приоритетом для определенных файлов
          const priorityOrder: Record<string, number> = {
            'Киноклуб': 1,
            'Книжный клуб': 2,
            'Об издательстве': 3,
            'Контакты': 4,
          }
          
          const aPriority = priorityOrder[a.displayName] || 999
          const bPriority = priorityOrder[b.displayName] || 999
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }
          
          // Иначе по алфавиту
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }

        if (!a.isFolder && b.isFolder) {
          return 1
        } else {
          return -1
        }
      }
    }),
  ],
  right: [],
}
