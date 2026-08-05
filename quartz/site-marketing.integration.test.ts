import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import { yandexMetrikaScript } from "./util/analytics"
import { canonicalUrlForSlug } from "./util/seo"

test("production homepage exposes the canonical marketing and analytics contract", () => {
  assert.equal(canonicalUrlForSlug("catoblepaspress.ru", "index"), "https://catoblepaspress.ru/")
  assert.equal(
    canonicalUrlForSlug("catoblepaspress.ru", "published/biastape"),
    "https://catoblepaspress.ru/published/biastape",
  )

  const javascript = yandexMetrikaScript(111323493)
  assert.match(javascript, /mc\.yandex\.ru\/metrika\/tag\.js\?id=111323493/)
  assert.match(javascript, /ym\(111323493,\s*["']init["']/)
  assert.match(javascript, /addEventListener\(["']nav["']/)
  assert.match(javascript, /reachGoal/)
})

test("homepage offers current routes for reading, participation, support, and direct contact", () => {
  const homepage = readFileSync(join(process.cwd(), "content", "index.md"), "utf8")

  assert.match(homepage, /Предзаказать «косую бейку»/)
  assert.match(homepage, /Читать стохастический журнал/)
  assert.match(homepage, /Limite.*10 августа 2026/)
  assert.match(homepage, /Письма «Катоблепаса»/)
  assert.match(homepage, /Все выпуски журнала/)
  assert.match(homepage, /data-metrika-goal="preorder_click"/)
  assert.match(homepage, /data-metrika-goal="journal_click"/)
  assert.match(homepage, /data-metrika-goal="participation_click"/)
  assert.match(homepage, /data-metrika-goal="newsletter_click"/)
  assert.doesNotMatch(homepage, /\[\[№ 1 \(1\)\|Выпуск № 1 \(1\)\]\]/)
  assert.doesNotMatch(homepage, /## Редакция/)
})
