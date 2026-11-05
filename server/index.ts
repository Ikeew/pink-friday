import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, type ServerResponse } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { createApiHandler } from './api.ts';

/** Servidor de produção: entrega o build de `dist/` e a rota `/api/dashboard`. */

const DIST = resolve(import.meta.dirname, '../dist');
const PORT = Number(process.env['PORT'] ?? 3000);

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const handleApi = createApiHandler({
  url: process.env['GRONER_API_URL'],
  token: process.env['GRONER_API_TOKEN'],
});

function sendFile(res: ServerResponse, path: string, immutable: boolean) {
  res.setHeader('Content-Type', CONTENT_TYPES[extname(path)] ?? 'application/octet-stream');
  res.setHeader('Cache-Control', immutable ? 'public, max-age=31536000, immutable' : 'no-cache');
  createReadStream(path).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    if (await handleApi(req, res)) return;

    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    const candidate = resolve(join(DIST, decodeURIComponent(pathname)));
    const insideDist = candidate === DIST || candidate.startsWith(DIST + sep);
    const isFile = insideDist && (await stat(candidate).catch(() => null))?.isFile();

    if (isFile) {
      sendFile(res, candidate, pathname.startsWith('/assets/'));
    } else {
      sendFile(res, join(DIST, 'index.html'), false);
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Painel em http://localhost:${PORT}`);
});
