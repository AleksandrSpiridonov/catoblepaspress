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

  return Footer
}

export default CustomFooter
