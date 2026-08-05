import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

interface Options {
  englishBaseUrl: string
  russianBaseUrl: string
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
    const currentHostname = new URL(`https://${cfg.baseUrl ?? ""}`).hostname
    const englishHostname = new URL(opts.englishBaseUrl).hostname
    const isEnglishSite = currentHostname === englishHostname
    const targetBase = isEnglishSite ? opts.russianBaseUrl : opts.englishBaseUrl
    const slug = fileData.slug ?? "index"
    const path = slug === "index" ? "/" : `/${slug}`

    return (
      <a
        aria-label={isEnglishSite ? "Перейти на русскую версию" : "Switch to English"}
        class={`${displayClass ?? ""} language-switcher`.trim()}
        href={`${targetBase}${path}`}
      >
        {isEnglishSite ? "RU" : "EN"}
      </a>
    )
  }

  Component.css = styles
  return Component
}
