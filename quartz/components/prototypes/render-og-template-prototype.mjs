// PROTOTYPE: render three static OG-image directions for visual comparison.
import { mkdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

const here = import.meta.dirname
const output = join(here, "output")
const iconPath = join(here, "../../static/icon.png")
const title = "«Я бы предпочёл, чтобы мою поэзию не читали». Интервью с Евгением Лебедевым"
const description =
  "Евгений Лебедев — о сборнике «Ошибки молодости», бесполезности поэзии, критиках, читателях и литературной индустрии"

const escapeXml = (text) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

function wrap(text, maxChars) {
  const lines = []
  let current = ""
  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

function textLines(lines, x, y, lineHeight, attrs = "") {
  return lines
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" ${attrs}>${escapeXml(line)}</text>`)
    .join("")
}

async function transparentLogo() {
  const { data, info } = await sharp(iconPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let index = 0; index < data.length; index += 4) {
    const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3
    if (brightness > 225) data[index + 3] = Math.max(0, Math.round((255 - brightness) * 8.5))
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

function svgA(logo) {
  const titleLines = wrap(title, 34).slice(0, 3)
  const descLines = wrap(description, 62).slice(0, 3)
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f7f3ed"/>
    <text x="56" y="66" font-family="Arial" font-size="25" font-weight="700" letter-spacing="3" fill="#315fd5">КАТОБЛЕПАС</text>
    <image href="data:image/png;base64,${logo}" x="890" y="254" width="350" height="350" opacity="0.94"/>
    ${textLines(titleLines, 56, 166, 58, 'font-family="Arial" font-size="52" font-weight="700" fill="#242429"')}
    ${textLines(descLines, 56, 386, 40, 'font-family="Arial" font-size="29" fill="#56535a"')}
    <line x1="56" y1="558" x2="1144" y2="558" stroke="#d9d4cc" stroke-width="2"/>
    <text x="56" y="600" font-family="Arial" font-size="22" fill="#77727a">catoblepaspress.ru</text>
    <text x="1144" y="600" text-anchor="end" font-family="Arial" font-size="22" fill="#77727a">Интервью</text>
  </svg>`
}

function svgB(icon) {
  const titleLines = wrap(title, 29).slice(0, 4)
  const descLines = wrap(description, 48).slice(0, 3)
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#16171b"/>
    <rect width="310" height="630" fill="#315fd5"/>
    <defs><clipPath id="circleB"><circle cx="102" cy="102" r="56"/></clipPath></defs>
    <circle cx="102" cy="102" r="59" fill="#f7f3ed" stroke="#8ba5ee" stroke-width="3"/>
    <image href="data:image/png;base64,${icon}" x="46" y="46" width="112" height="112" clip-path="url(#circleB)"/>
    <text x="46" y="522" font-family="Arial" font-size="25" font-weight="700" letter-spacing="1" fill="#fff">КАТОБЛЕПАС</text>
    <text x="46" y="562" font-family="Arial" font-size="17" fill="#b8c7ee">catoblepaspress.ru</text>
    <text x="356" y="67" font-family="Arial" font-size="21" font-weight="700" letter-spacing="2" fill="#8da9ff">ИНТЕРВЬЮ</text>
    ${textLines(titleLines, 356, 150, 51, 'font-family="Arial" font-size="46" font-weight="700" fill="#f8f7f2"')}
    ${textLines(descLines, 356, 405, 37, 'font-family="Arial" font-size="27" fill="#c9c9cf"')}
    <line x1="356" y1="551" x2="1144" y2="551" stroke="#34353a" stroke-width="2"/>
    <text x="356" y="597" font-family="Arial" font-size="21" fill="#85868d">30 янв. 2025 г.</text>
    <rect x="1000" y="570" width="144" height="38" rx="19" fill="#272d3d"/>
    <text x="1072" y="596" text-anchor="middle" font-family="Arial" font-size="20" fill="#b8c7fb">#интервью</text>
  </svg>`
}

function svgC(logo) {
  const titleLines = wrap(title, 37).slice(0, 3)
  const descLines = wrap(description, 67).slice(0, 2)
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#e9eefb"/>
    <path d="M820 0H1200V630H680Z" fill="#315fd5" opacity="0.09"/>
    <image href="data:image/png;base64,${logo}" x="820" y="315" width="470" height="470" opacity="0.14" transform="rotate(-5 1055 550)"/>
    <text x="54" y="65" font-family="Arial" font-size="25" font-weight="700" letter-spacing="3" fill="#315fd5">КАТОБЛЕПАС</text>
    ${textLines(titleLines, 54, 175, 60, 'font-family="Arial" font-size="54" font-weight="700" fill="#111219"')}
    ${textLines(descLines, 54, 420, 42, 'font-family="Arial" font-size="30" fill="#454b5b"')}
    <line x1="54" y1="558" x2="1146" y2="558" stroke="#b9c4df" stroke-width="2"/>
    <text x="54" y="601" font-family="Arial" font-size="22" fill="#60697c">Интервью</text>
    <text x="1146" y="601" text-anchor="end" font-family="Arial" font-size="22" fill="#60697c">catoblepaspress.ru</text>
  </svg>`
}

function svgD(icon) {
  const titleLines = wrap(title, 37).slice(0, 3)
  const descLines = wrap(description, 68).slice(0, 3)
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="circle"><circle cx="91" cy="77" r="35"/></clipPath></defs>
    <rect width="1200" height="630" fill="#151619"/>
    <circle cx="91" cy="77" r="37" fill="#f4f1ea" stroke="#34353a" stroke-width="2"/>
    <image href="data:image/png;base64,${icon}" x="56" y="42" width="70" height="70" clip-path="url(#circle)"/>
    <text x="145" y="85" font-family="Arial" font-size="23" fill="#aaaab0">catoblepaspress.ru</text>
    ${textLines(titleLines, 56, 190, 59, 'font-family="Arial" font-size="53" font-weight="700" fill="#f5f4f1"')}
    ${textLines(descLines, 56, 422, 39, 'font-family="Arial" font-size="29" fill="#c6c5c9"')}
    <line x1="56" y1="556" x2="1144" y2="556" stroke="#34353a" stroke-width="2"/>
    <text x="56" y="602" font-family="Arial" font-size="22" fill="#777980">30 янв. 2025 г.</text>
    <rect x="1000" y="574" width="144" height="38" rx="19" fill="#242936"/>
    <text x="1072" y="600" text-anchor="middle" font-family="Arial" font-size="20" fill="#aebef4">#интервью</text>
  </svg>`
}

await mkdir(output, { recursive: true })
const logoBuffer = await transparentLogo()
const logo = logoBuffer.toString("base64")
const icon = (await readFile(iconPath)).toString("base64")
const svgs = [svgA(logo), svgB(icon), svgC(logo), svgD(icon)]
const files = []

for (let index = 0; index < svgs.length; index++) {
  const file = join(output, `variant-${String.fromCharCode(65 + index)}.png`)
  await sharp(Buffer.from(svgs[index])).png().toFile(file)
  files.push(file)
}

await sharp({ create: { width: 1200, height: 2580, channels: 3, background: "#202124" } })
  .composite(
    files.map((file, index) => ({ input: file, left: 0, top: index * 650 })),
  )
  .png()
  .toFile(join(output, "contact-sheet.png"))

console.log(join(output, "contact-sheet.png"))
