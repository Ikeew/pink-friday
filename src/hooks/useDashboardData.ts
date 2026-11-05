import { useEffect, useState } from 'react';
import type { Cycle, DashboardData, LoadStatus } from '../types';

const REFRESH_INTERVAL_MS = 10 * 60_000;
/** Depois de uma falha, tenta antes do próximo ciclo para a tela não ficar sem dados. */
const RETRY_INTERVAL_MS = 60_000;

/**
 * Busca as vendas do ciclo e atualiza a cada 10 minutos.
 * Mantém o último resultado de cada ciclo: a troca de aba é imediata e uma falha
 * temporária não apaga da tela os números que já estavam ali.
 */
export function useDashboardData(cycle: Cycle) {
  const [byCycle, setByCycle] = useState<Record<string, DashboardData>>({});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ from: cycle.start, to: cycle.end });
    let timer: ReturnType<typeof setTimeout>;

    const load = async () => {
      let nextLoadIn = REFRESH_INTERVAL_MS;
      try {
        const response = await fetch(`/api/dashboard?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as DashboardData;
        setByCycle((current) => ({ ...current, [cycle.id]: data }));
        setFailed(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Falha ao carregar o painel:', error);
        setFailed(true);
        nextLoadIn = RETRY_INTERVAL_MS;
      }
      timer = setTimeout(() => void load(), nextLoadIn);
    };

    setFailed(false);
    void load();

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [cycle.id, cycle.start, cycle.end]);

  const data = byCycle[cycle.id] ?? null;
  const status: LoadStatus = failed ? 'error' : data ? 'ready' : 'loading';

  return { data, status };
}
