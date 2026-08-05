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
    const configuredBase = cfg.baseUrl ?? opts.russianBaseUrl
    const currentUrl = new URL(
      configuredBase.includes("://") ? configuredBase : `https://${configuredBase}`,
    )
    const currentHostname = currentUrl.hostname
    const englishHostname = new URL(opts.englishBaseUrl).hostname
    const isEnglishSite = currentHostname === englishHostname
    const targetUrl = new URL(isEnglishSite ? opts.russianBaseUrl : opts.englishBaseUrl)
    const slug = fileData.slug ?? "index"
    const basePath = targetUrl.pathname.replace(/\/$/, "")
    targetUrl.pathname = slug === "index" ? `${basePath}/` : `${basePath}/${slug}`

    return (
      <a
        aria-label={isEnglishSite ? "Перейти на русскую версию" : "Switch to English"}
        class={`${displayClass ?? ""} language-switcher`.trim()}
        href={targetUrl.toString()}
      >
        {isEnglishSite ? "RU" : "EN"}
      </a>
    )
  }

  Component.css = styles
  return Component
}
