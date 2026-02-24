import styles from "./styles/readermode.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ReaderMode: QuartzComponent = ({ displayClass, cfg, fileData }: QuartzComponentProps) => {
const isEnglishSite = (cfg.baseUrl ?? "").startsWith("en.")
const targetBase = isEnglishSite ? "https://catoblepaspress.ru" : "https://en.catoblepaspress.ru"
const targetLabel = isEnglishSite ? "RU" : "EN"

const slug = fileData.slug ?? "index"
const path = slug === "index" ? "/" : `/${slug}`
const href = `${targetBase}${path}`

return (
<a
class={classNames(displayClass, "readermode")}
href={href}
aria-label={isEnglishSite ? "Switch to Russian" : "Switch to English"}
>
<span style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;">{targetLabel}</span>
</a>
)
}

ReaderMode.css = styles

export default (() => ReaderMode) satisfies QuartzComponentConstructor
