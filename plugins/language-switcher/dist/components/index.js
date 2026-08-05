import { jsx } from "preact/jsx-runtime"

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

const LanguageSwitcher = (opts) => {
  const Component = ({ cfg, fileData, displayClass }) => {
    const currentHostname = new URL(`https://${cfg.baseUrl ?? ""}`).hostname
    const englishHostname = new URL(opts.englishBaseUrl).hostname
    const isEnglishSite = currentHostname === englishHostname
    const targetBase = isEnglishSite ? opts.russianBaseUrl : opts.englishBaseUrl
    const slug = fileData.slug ?? "index"
    const path = slug === "index" ? "/" : `/${slug}`

    return jsx("a", {
      "aria-label": isEnglishSite ? "Перейти на русскую версию" : "Switch to English",
      class: `${displayClass ?? ""} language-switcher`.trim(),
      href: `${targetBase}${path}`,
      children: isEnglishSite ? "RU" : "EN",
    })
  }

  Component.css = styles
  return Component
}

export { LanguageSwitcher }
