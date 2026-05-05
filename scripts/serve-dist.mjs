import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { createReadStream } from 'node:fs'

const root = resolve('dist')
const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '127.0.0.1'

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
}

function sendFile(res, filePath) {
  const type = mimeTypes[extname(filePath)] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': type })
  createReadStream(filePath).pipe(res)
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? '/', `http://${host}`).pathname)
  let filePath = join(root, urlPath)

  try {
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) {
      filePath = join(filePath, 'index.html')
      await stat(filePath)
    }
    return sendFile(res, filePath)
  } catch {
    try {
      const fallback = join(root, 'index.html')
      const html = await readFile(fallback)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html)
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(`Unable to serve app: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
})

server.listen(port, host, () => {
  console.log(`Spero preview running at http://${host}:${port}`)
})
