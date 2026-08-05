import { version } from "../../package.json"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

interface Options {
  copyrightText: string
  links: Record<string, string>
}

const CustomFooter: QuartzComponentConstructor<Options> = (opts) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }) => (
    <footer class={displayClass ?? ""}>
      {cfg.analytics?.provider === "yandex" && (
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${cfg.analytics.counterId}`}
              style="position:absolute; left:-9999px;"
              alt=""
            />
          </div>
        </noscript>
      )}
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
        Создано А. А. Спиридоновым-мл с помощью{" "}
        <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>
      </p>
    </footer>
  )

  return Footer
}

export default CustomFooter
