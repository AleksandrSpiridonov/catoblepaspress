import type { SocialImageOptions } from "@quartz-community/og-image"
import type { Theme } from "../util/theme"

const fontName = (font: string | { name: string }) => (typeof font === "string" ? font : font.name)

const pageDate = (dates: Record<string, Date> | undefined, locale: string) => {
  const date = dates?.modified ?? dates?.published ?? dates?.created
  return date?.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const LegacyOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  description,
  fileData,
  iconBase64,
}) => {
  const theme = cfg.theme as Theme
  const colors = theme.colors[userOpts.colorScheme]
  const compactTitle = title.length > 32
  const date = pageDate(fileData.dates, cfg.locale ?? "ru-RU")
  const tags = fileData.frontmatter?.tags ?? []
  const bodyFont = fontName(theme.typography.body)
  const headerFont = fontName(theme.typography.header)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "2.5rem",
        backgroundColor: colors.light,
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        {iconBase64 && <img src={iconBase64} width={56} height={56} />}
        <div style={{ display: "flex", fontSize: 32, color: colors.gray }}>{cfg.baseUrl}</div>
      </div>

      <div style={{ display: "flex", marginTop: "1rem", marginBottom: "1.5rem" }}>
        <h1
          style={{
            display: "-webkit-box",
            margin: 0,
            overflow: "hidden",
            color: colors.dark,
            fontFamily: headerFont,
            fontSize: compactTitle ? 64 : 72,
            fontWeight: 700,
            lineHeight: 1.2,
            textOverflow: "ellipsis",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {title}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          color: colors.darkgray,
          fontSize: 36,
          lineHeight: 1.4,
        }}
      >
        <p
          style={{
            display: "-webkit-box",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: `1px solid ${colors.lightgray}`,
        }}
      >
        <div style={{ display: "flex", color: colors.gray, fontSize: 28 }}>{date}</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: "0.5rem",
            maxWidth: "60%",
          }}
        >
          {tags.slice(0, 3).map((tag) => (
            <div
              style={{
                display: "flex",
                padding: "0.5rem 1rem",
                color: colors.secondary,
                backgroundColor: colors.highlight,
                borderRadius: "10px",
                fontSize: 24,
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LegacyOgImage
