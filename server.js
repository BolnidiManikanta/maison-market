const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = parseInt(process.env.PORT || '3000', 10)
const HOST = process.env.HOSTNAME || '0.0.0.0'
process.env.PORT = String(PORT)
process.env.HOSTNAME = HOST

const STANDALONE_SERVER = path.join(__dirname, '.next', 'standalone', 'server.js')
if (fs.existsSync(STANDALONE_SERVER)) {
  console.log(`Starting Next.js standalone server on http://${HOST}:${PORT}`)
  require(STANDALONE_SERVER)
  return
}

const OUT_DIR = path.join(__dirname, 'out')
const DIST_DIR = path.join(__dirname, 'dist')
const BASE_DIR = fs.existsSync(OUT_DIR)
  ? OUT_DIR
  : fs.existsSync(DIST_DIR)
  ? DIST_DIR
  : __dirname

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.join(BASE_DIR, urlPath)

  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(BASE_DIR, 'index.html')
  } else if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html'
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html')
    }
  }

  // Prevent directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' })
    res.end('Forbidden')
    return
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(BASE_DIR, '404.html')
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        fs.createReadStream(notFoundPath).pipe(res)
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('404 Not Found')
      }
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    const isImmutable = urlPath.startsWith('/_next/static/')

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isImmutable
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600',
    })
    fs.createReadStream(filePath).pipe(res)
  })
})

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
