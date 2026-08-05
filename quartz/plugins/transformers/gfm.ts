import remarkGfm from "remark-gfm"
import smartypants from "remark-smartypants"
import { QuartzTransformerPlugin } from "../types"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { visit } from "unist-util-visit"
import { i18n } from "../../i18n"

export interface Options {
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultOptions: Options = {
  enableSmartyPants: true,
  linkHeadings: true,
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm]
    },
    htmlPlugins(ctx) {
      const plugins: any[] = []

      if (opts.linkHeadings) {
        plugins.push(rehypeSlug, [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              role: "anchor",
              ariaHidden: true,
              tabIndex: -1,
              "data-no-popover": true,
            },
            content: {
              type: "element",
              tagName: "svg",
              properties: {
                width: 18,
                height: 18,
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
              },
              children: [
                {
                  type: "element",
                  tagName: "path",
                  properties: {
                    d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                  },
                  children: [],
                },
                {
                  type: "element",
                  tagName: "path",
                  properties: {
                    d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                  },
                  children: [],
                },
              ],
            },
          },
        ])
      }

      // Localize footnotes title
      plugins.push(() => {
        return (tree: any) => {
          const locale = ctx.cfg.configuration.locale ?? "en-US"
          const footnotesTitle = i18n(locale).components.footnotes?.title ?? "Footnotes"

          visit(tree, "element", (node: any) => {
            // Check if this is the footnotes heading with id="footnote-label"
            if (node.tagName === "h2" && node.properties?.id === "footnote-label") {
              // Find the first text node and replace it, or prepend a new one
              if (node.children && node.children.length > 0) {
                const textNodeIndex = node.children.findIndex((child: any) => child.type === "text")
                if (textNodeIndex !== -1) {
                  // Replace existing text node
                  node.children[textNodeIndex].value = footnotesTitle
                  // Remove any other text nodes that might exist
                  node.children = node.children.filter(
                    (child: any, index: number) => child.type !== "text" || index === textNodeIndex,
                  )
                } else {
                  // Prepend text node if none exists
                  node.children.unshift({
                    type: "text",
                    value: footnotesTitle,
                  })
                }
              } else {
                // If no children, create text node
                node.children = [
                  {
                    type: "text",
                    value: footnotesTitle,
                  },
                ]
              }
            }
          })
        }
      })

      return plugins
    },
  }
}
