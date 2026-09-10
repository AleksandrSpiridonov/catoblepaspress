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
        name: isEnglishSite
          ? "Switch to Russian"
          : "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043D\u0430 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E",
        base: isEnglishSite ? opts.russianBaseUrl : opts.englishBaseUrl,
      },
      {
        label: "\u4E2D\u6587",
        name: isEnglishSite
          ? "Switch to Chinese"
          : "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043D\u0430 \u043A\u0438\u0442\u0430\u0439\u0441\u043A\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E",
        base: opts.chineseBaseUrl,
      },
    ]
    return /* @__PURE__ */ jsx("nav", {
      class: displayClass ?? "",
      "aria-label": isEnglishSite
        ? "Language versions"
        : "\u042F\u0437\u044B\u043A\u043E\u0432\u044B\u0435 \u0432\u0435\u0440\u0441\u0438\u0438",
      style: { display: "flex", gap: "0.5rem" },
      children: languages.map(({ label, name, base }) => {
        const url = new URL(base)
        url.pathname = url.pathname.replace(/\/$/, "") + (slug === "index" ? "/" : "/" + slug)
        return /* @__PURE__ */ jsx("a", {
          class: "language-switcher",
          href: url.toString(),
          "aria-label": name,
          title: name,
          children: label,
        })
      }),
    })
  }
  Component.css = styles
  return Component
}
export { LanguageSwitcher }
