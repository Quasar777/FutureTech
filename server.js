const http = require("http");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT) || 3000;
const rootDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function resolveRequestPath(requestPathname) {
  const decodedPath = decodeURIComponent(requestPathname);
  let normalized = path.normalize(decodedPath);

  if (normalized === "/" || normalized === ".") {
    normalized = "/index.html";
  }

  const absolutePath = path.join(rootDir, normalized);
  const relativePath = path.relative(rootDir, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  if (!path.extname(absolutePath)) {
    const htmlPath = `${absolutePath}.html`;
    if (fs.existsSync(htmlPath)) {
      return htmlPath;
    }
  }

  return absolutePath;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = resolveRequestPath(url.pathname);

  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`FutureTech is running at http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
