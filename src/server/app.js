import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ParkingLot, DEFAULT_CAPACITY } from '../domain/parkingLot.js';
import { DEFAULT_TARIFFS } from '../domain/tariffCalculator.js';
import { JsonStore } from '../storage/jsonStore.js';
import { readJsonBody, sendError, sendJson } from './httpUtils.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '../..');
const publicDir = join(rootDir, 'public');
const dataPath = join(rootDir, 'data', 'parking-lot.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const store = new JsonStore(dataPath, {
  capacity: DEFAULT_CAPACITY,
  tariffs: DEFAULT_TARIFFS,
  tickets: []
});

async function loadLot() {
  return new ParkingLot(await store.read());
}

async function saveLot(lot) {
  await store.write(lot.toJSON());
}

async function serveStatic(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = resolve(publicDir, `.${requestedPath}`);

  if (!filePath.startsWith(publicDir)) {
    sendError(response, new Error('Ruta no permitida.'), 403);
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Error('No encontrado.');
    }

    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
  } catch {
    sendError(response, new Error('Recurso no encontrado.'), 404);
  }
}

async function handleApi(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const lot = await loadLot();

  if (request.method === 'GET' && url.pathname === '/api/dashboard') {
    sendJson(response, 200, {
      ok: true,
      occupancy: lot.getOccupancy(),
      openTickets: lot.getOpenTickets(),
      history: lot.getHistory().slice(0, 20),
      tariffs: lot.tariffs
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/entries') {
    const payload = await readJsonBody(request);
    const ticket = lot.registerEntry(payload);
    await saveLot(lot);
    sendJson(response, 201, { ok: true, ticket });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/exits') {
    const payload = await readJsonBody(request);
    const ticket = lot.closeTicket(payload);
    await saveLot(lot);
    sendJson(response, 200, { ok: true, ticket });
    return;
  }

  sendError(response, new Error('Endpoint no encontrado.'), 404);
}

export function createParkingServer() {
  return createServer(async (request, response) => {
    try {
      if (request.url.startsWith('/api/')) {
        await handleApi(request, response);
        return;
      }

      await serveStatic(request, response);
    } catch (error) {
      sendError(response, error);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '127.0.0.1';
  createParkingServer().listen(port, host, () => {
    console.log(`ParkControl disponible en http://${host}:${port}`);
  });
}
