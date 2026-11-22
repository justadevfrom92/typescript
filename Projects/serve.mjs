// Zero-dependency static file server for running any project in a browser.
// Usage: node serve.mjs [port]   (defaults to PORT env var, then any free port)
// Then open http://localhost:<port>/<ProjectFolder>/

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.argv[2] ?? process.env.PORT ?? 0);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".ts": "text/plain; charset=utf-8",
  ".tsx": "text/plain; charset=utf-8",
};

const server = createServer(async (request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  let filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root) || filePath.includes("node_modules")) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) {
      if (!urlPath.endsWith("/")) {
        response.writeHead(301, { Location: urlPath + "/" }).end();
        return;
      }
      filePath = join(filePath, "index.html");
    }
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types[extname(filePath)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
});

server.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`Serving ${root}\nOpen http://localhost:${actualPort}/ to see every project.`);
});
