import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

test("build renders repeated independent transclusions of the same page", () => {
  const fixtureDir = mkdtempSync(join(tmpdir(), "quartz-transclusion-"))
  const outputDir = join(fixtureDir, "public")

  try {
    writeFileSync(
      join(fixtureDir, "index.md"),
      "---\ntitle: Home\n---\n\n![[target]]\n\n![[target]]\n",
    )
    writeFileSync(join(fixtureDir, "target.md"), "---\ntitle: Target\n---\n\nEmbedded content\n")

    execFileSync(
      process.execPath,
      ["quartz/bootstrap-cli.mjs", "build", "-d", fixtureDir, "-o", outputDir],
      { cwd: process.cwd(), stdio: "pipe" },
    )

    const html = readFileSync(join(outputDir, "index.html"), "utf8")
    assert.equal(html.match(/Embedded content/g)?.length, 2)
    assert.doesNotMatch(html, /Circular transclusion detected/)
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true })
  }
})

test("build stops circular transclusions", () => {
  const fixtureDir = mkdtempSync(join(tmpdir(), "quartz-transclusion-cycle-"))
  const outputDir = join(fixtureDir, "public")

  try {
    writeFileSync(join(fixtureDir, "index.md"), "---\ntitle: Home\n---\n\n![[target]]\n")
    writeFileSync(join(fixtureDir, "target.md"), "---\ntitle: Target\n---\n\n![[index]]\n")

    execFileSync(
      process.execPath,
      ["quartz/bootstrap-cli.mjs", "build", "-d", fixtureDir, "-o", outputDir],
      { cwd: process.cwd(), stdio: "pipe" },
    )

    const html = readFileSync(join(outputDir, "index.html"), "utf8")
    assert.match(html, /Circular transclusion detected: index/)
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true })
  }
})

test("nested transclusions keep links relative to the rendered page", () => {
  const fixtureDir = mkdtempSync(join(tmpdir(), "quartz-transclusion-links-"))
  const outputDir = join(fixtureDir, "public")
  const folderDir = join(fixtureDir, "folder")

  try {
    mkdirSync(folderDir)
    writeFileSync(join(fixtureDir, "index.md"), "---\ntitle: Home\n---\n\n![[folder/a]]\n")
    writeFileSync(join(folderDir, "a.md"), "---\ntitle: A\n---\n\n![[b]]\n")
    writeFileSync(join(folderDir, "b.md"), "---\ntitle: B\n---\n\n[Relative asset](./asset.png)\n")
    writeFileSync(join(folderDir, "asset.png"), "fixture")

    execFileSync(
      process.execPath,
      ["quartz/bootstrap-cli.mjs", "build", "-d", fixtureDir, "-o", outputDir],
      { cwd: process.cwd(), stdio: "pipe" },
    )

    const html = readFileSync(join(outputDir, "index.html"), "utf8")
    const assetHref = html.match(/href="([^"]*asset\.png)"/)?.[1]
    assert.equal(new URL(assetHref!, "https://example.com/index").pathname, "/folder/asset.png")
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true })
  }
})
