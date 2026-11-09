import type { Cycle, Look, Sprite } from '../types';

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
  { id: 'ciclo-1', label: 'Ciclo 1', start: '2026-11-01', end: '2026-11-10', target: 2_100_000, sellerTarget: SELLER_TARGET },
  { id: 'ciclo-2', label: 'Ciclo 2', start: '2026-10-10', end: '2026-10-20', target: 2_100_000, sellerTarget: SELLER_TARGET },
  // PLACEHOLDER: datas e meta do Ciclo 3 são provisórias.
  { id: 'ciclo-3', label: 'Ciclo 3', start: '2026-10-21', end: '2026-10-31', target: 3_200_000, sellerTarget: SELLER_TARGET },
];

/** Personagem em `public/avatars/<nome>.webp`. */
function avatar(name: string, aspect: number, crownX: number, crownY: number, crownWidth: number) {
  return { sprite: { src: `/avatars/${name}.webp`, aspect, crownX, crownY, crownWidth } };
}

/**
 * Personagem ou aparência opcionais por pessoa, usando o nome exatamente como vem da API.
 * Exemplo:
 *   'LUCAS MACHADO': { look: { skin: '#F2C09A', hair: '#2B1B14', hairStyle: 'short', beard: '#2B1B14' } },
 */
export const profiles: Record<string, { look?: Look; sprite?: Sprite }> = {
  'GIOVANE SAMOEL': avatar('giovane', 0.924, 70.8, -0.2, 38.4),
  'SÁVIO SARTORI LOPES': avatar('savio', 0.875, 75.8, 0, 38.9),
  'GUSTAVO LUCIANO': avatar('gustavo', 1.035, 74.1, -0.8, 33.8),
  'GABRIEL MORELI MACHADO OLIVEIRA': avatar('gabriel', 0.741, 63, -0.1, 34),
  'RHUAN PEREIRA': avatar('rhuan', 0.938, 70.8, 0, 34.3),
  'LUCAS MACHADO': avatar('lucas', 0.779, 57.5, 0, 34),
  'RICARDO MOTA': avatar('ricardo', 0.902, 51, 0, 32),
  'FERNANDO FRANÇA': avatar('fernando', 0.909, 53.9, 0, 32),
};
