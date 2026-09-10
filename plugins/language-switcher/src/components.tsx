import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

interface Options {
  englishBaseUrl: string
  russianBaseUrl: string
  hindiBaseUrl: string
  chineseBaseUrl: string
}

const styles = `.language-switcher {
  align-items: center;
  background: none;
  border: none;
  color: var(--darkgray);
  display: inline-flex;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  height: 32px;
  justify-content: center;
  letter-spacing: 0.04em;
  margin: 0;
  padding: 0;
  text-decoration: none;
  width: 24px;
}`

export const LanguageSwitcher: QuartzComponentConstructor<Options> = (opts) => {
  const Component: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
    const configuredBase = cfg.baseUrl ?? opts.russianBaseUrl
    const currentUrl = new URL(
      configuredBase.includes("://") ? configuredBase : `https://${configuredBase}`,
    )
    const currentHostname = currentUrl.hostname
    const englishHostname = new URL(opts.englishBaseUrl).hostname
    const isEnglishSite = currentHostname === englishHostname
    const slug = (fileData.slug ?? "index").replace(/\/index$/, "/")
    const languages = [
      {
        label: isEnglishSite ? "RU" : "EN",
        name: isEnglishSite ? "Switch to Russian" : "Перейти на английскую версию",
        base: isEnglishSite ? opts.russianBaseUrl : opts.englishBaseUrl,
      },
      {
        label: "中文",
        name: isEnglishSite ? "Switch to Chinese" : "Перейти на китайскую версию",
        base: opts.chineseBaseUrl,
      },
      {
        label: "HI",
        name: isEnglishSite ? "Switch to Hindi" : "Перейти на хинди",
        base: opts.hindiBaseUrl,
      },
    ]
    return (
      <nav
        class={displayClass ?? ""}
        aria-label={isEnglishSite ? "Language versions" : "Языковые версии"}
        style={{ display: "flex", gap: "0.5rem" }}
      >
        {languages.map(({ label, name, base }) => {
          const url = new URL(base)
          url.pathname = url.pathname.replace(/\/$/, "") + (slug === "index" ? "/" : "/" + slug)
          return (
            <a class="language-switcher" href={url.toString()} aria-label={name} title={name}>
              {label}
            </a>
          )
        })}
      </nav>
    )
  }

  Component.css = styles
  return Component
}
