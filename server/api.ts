import type { IncomingMessage, ServerResponse } from 'node:http';
import type { DashboardData } from '../src/types.ts';
import { fetchDashboard, type GronerConfig } from './groner.ts';

/** Pouco abaixo dos 10 minutos da tela, para cada atualização receber dados novos. */
const CACHE_TTL_MS = 9 * 60_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string | null): value is string =>
  value !== null && ISO_DATE.test(value) && !Number.isNaN(Date.parse(value));

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/**
 * Trata `GET /api/dashboard?from=AAAA-MM-DD&to=AAAA-MM-DD`.
 * O cache evita que cada tela aberta gere novas consultas na Groner.
 * Devolve `false` quando a requisição não é da API, para o chamador seguir adiante.
 */
export function createApiHandler(config: Partial<GronerConfig>) {
  const cache = new Map<string, { expiresAt: number; data: Promise<DashboardData> }>();

  return async function handleApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (url.pathname !== '/api/dashboard') return false;

    if (req.method !== 'GET') {
      sendJson(res, 405, { error: 'Método não permitido.' });
      return true;
    }

    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    if (!isValidDate(from) || !isValidDate(to) || from > to) {
      sendJson(res, 400, { error: 'Período inválido.' });
      return true;
    }

    if (!config.url || !config.token) {
      console.error('GRONER_API_URL ou GRONER_API_TOKEN não configurados.');
      sendJson(res, 500, { error: 'Servidor sem configuração da API.' });
      return true;
    }
    const groner: GronerConfig = { url: config.url, token: config.token };

    const key = `${from}|${to}`;
    const now = Date.now();
    let entry = cache.get(key);
    if (!entry || entry.expiresAt <= now) {
      for (const [cachedKey, cached] of cache) {
        if (cached.expiresAt <= now) cache.delete(cachedKey);
      }
      entry = { expiresAt: now + CACHE_TTL_MS, data: fetchDashboard(groner, from, to) };
      cache.set(key, entry);
    }

    try {
      sendJson(res, 200, await entry.data);
    } catch (error) {
      // Falhas não ficam em cache, e o detalhe interno só vai para o log.
      if (cache.get(key) === entry) cache.delete(key);
      console.error('Falha ao consultar a Groner:', error);
      sendJson(res, 502, { error: 'Não foi possível consultar os dados de vendas.' });
    }
    return true;
  };
}
