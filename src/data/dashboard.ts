import type { Cycle, Look } from '../types';

/**
 * Tudo o que é definido à mão. As vendas vêm da API da Groner (ver `server/groner.ts`).
 */

export const OVERALL_TARGET = 8_500_000;
export const DEFAULT_CYCLE_ID = 'ciclo-1';

/** Quantos vendedores correm na pista. */
export const RACE_SIZE = 5;

/** Meta de cada vendedor no ciclo: quem chega nela ganha a coroa. */
const SELLER_TARGET = 100_000;

export const cycles: Cycle[] = [
  { id: 'ciclo-1', label: 'Ciclo 1', start: '2026-11-01', end: '2026-11-10', target: 1_500_000, sellerTarget: SELLER_TARGET },
  { id: 'ciclo-2', label: 'Ciclo 2', start: '2026-10-10', end: '2026-10-20', target: 2_100_000, sellerTarget: SELLER_TARGET },
  // PLACEHOLDER: datas e meta do Ciclo 3 são provisórias.
  { id: 'ciclo-3', label: 'Ciclo 3', start: '2026-10-21', end: '2026-10-31', target: 3_200_000, sellerTarget: SELLER_TARGET },
];

/**
 * Foto e aparência opcionais por pessoa, usando o nome exatamente como vem da API.
 * Exemplo:
 *   'CAMILA LOPES': { photo: '/fotos/camila.jpg' },
 *   'LUCAS MACHADO': { look: { skin: '#F2C09A', hair: '#2B1B14', hairStyle: 'short', beard: '#2B1B14' } },
 */
export const profiles: Record<string, { photo?: string; look?: Look }> = {};
