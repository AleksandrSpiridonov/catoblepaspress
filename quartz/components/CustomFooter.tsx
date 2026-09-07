import { version } from "../../package.json"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

interface Options {
  copyrightText: string
  links: Record<string, string>
}

const CustomFooter: QuartzComponentConstructor<Options> = (opts) => {
  const Footer: QuartzComponent = ({ displayClass }) => (
    <footer class={displayClass ?? ""}>
      <div class="footer-top">
        <p class="copyright">{opts.copyrightText}</p>
        <ul class="footer-links">
          {Object.entries(opts.links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </div>
      <p>
        Создано <a href="/authors/asp">А. А. Спиридоновым-мл.</a> с помощью{" "}
        <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>
        {" · "}
        <button
          id="cookie-settings"
          type="button"
          class="cookie-settings"
        >
          О cookie
        </button>
      </p>
    </footer>
  )

  Footer.afterDOMLoaded = `
    const localizeBasesEntryCounts = () => {
      const entryWord = (count) => {
        const lastTwo = count % 100
        const last = count % 10

        if (lastTwo >= 11 && lastTwo <= 14) return "записей"
        if (last === 1) return "запись"
        if (last >= 2 && last <= 4) return "записи"
        return "записей"
      }

      for (const element of document.querySelectorAll(".bases-view-meta")) {
        const match = element.textContent?.trim().match(/^Showing (\\d+) of (\\d+) entries$/)
        if (!match) continue

        const shown = Number(match[1])
        const total = Number(match[2])
        element.textContent = "Показано " + shown + " из " + total + " " + entryWord(total)
      }
    }

    localizeBasesEntryCounts()
    document.addEventListener("nav", localizeBasesEntryCounts)
  `

  return Footer
}

export default CustomFooter
