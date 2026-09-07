// PROTOTYPE: local-only static server for the OG image layout study.
import { createReadStream, existsSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const root = normalize(join(import.meta.dirname, "../../.."))
const port = 8094
const types = { ".html": "text/html; charset=utf-8", ".png": "image/png" }

createServer((request, response) => {
  const pathname = request.url?.split("?")[0] || "/"
  const requested = pathname === "/" ? "/components/prototypes/og-image-template.prototype.html" : pathname
  const file = normalize(join(root, requested))
  if (!file.startsWith(root) || !existsSync(file)) {
    response.writeHead(404).end("Not found")
    return
  }

  response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" })
  createReadStream(file).pipe(response)
}).listen(port, "127.0.0.1", () => {
  console.log(`OG prototype: http://127.0.0.1:${port}/`)
})
