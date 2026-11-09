import type { Cycle, Look, Sprite } from '../types';

/**
 * Tudo o que é definido à mão. As vendas vêm da API da Groner (ver `server/groner.ts`).
 */

export const OVERALL_TARGET = 8_500_000;
export const DEFAULT_CYCLE_ID = 'ciclo-1';

/** Quantos vendedores correm na pista em cada tela. */
export const RACE_SIZE = 5;
/** Telas de vendedores no revezamento: 1º ao 5º e 6º ao 10º. */
export const SELLER_PAGES = 2;
/** Equipes e SDRs correm todos juntos, até este limite. */
export const GROUP_RACE_SIZE = 6;
/** Tempo de cada tela da pista antes de passar para a próxima. */
export const BOARD_ROTATION_MS = 1 * 60_000;

/** Meta de cada vendedor no ciclo: quem chega nela ganha a coroa. */
const SELLER_TARGET = 100_000;
/** Meta de cada equipe no ciclo. */
const TEAM_TARGET = 450_000;
/** Meta de cada SDR no ciclo. */
const SDR_TARGET = 150_000;

export const cycles: Cycle[] = [
  { id: 'ciclo-1', label: 'Ciclo 1', start: '2026-11-01', end: '2026-11-10', target: 2_100_000, sellerTarget: SELLER_TARGET, teamTarget: TEAM_TARGET, sdrTarget: SDR_TARGET },
  { id: 'ciclo-2', label: 'Ciclo 2', start: '2026-10-10', end: '2026-10-20', target: 2_100_000, sellerTarget: SELLER_TARGET, teamTarget: TEAM_TARGET, sdrTarget: SDR_TARGET },
  // PLACEHOLDER: datas e meta do Ciclo 3 são provisórias.
  { id: 'ciclo-3', label: 'Ciclo 3', start: '2026-10-21', end: '2026-10-31', target: 3_200_000, sellerTarget: SELLER_TARGET, teamTarget: TEAM_TARGET, sdrTarget: SDR_TARGET },
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
  'OTAVIO AUGUSTO': avatar('otavio', 0.962, 59.8, 0.8, 32),
  'GESIEL DEOCLIDES': avatar('gesiel', 0.959, 64.1, 1.2, 32),
  // SDRs
  'CAMILA LOPES': avatar('camila', 0.966, 55.7, 0.8, 32),
  'FILIPE CORREA': avatar('filipe', 0.964, 59.3, 1, 32),
  'KETLY SANTOS': avatar('ketly', 0.959, 54.7, 0.9, 32),
  'ERICA GOMES NOVO': avatar('erica', 0.969, 54.3, 1.6, 32),
  'GISA ALVES': avatar('gisa', 0.963, 53.5, 0.8, 32),
};

/** Figurinha em `public/teams/<nome>.webp`, com a coroa no alto, ao centro. */
function teamSticker(name: string, aspect: number) {
  return { src: `/teams/${name}.webp`, aspect, crownX: 50, crownY: 2, crownWidth: 30 };
}

/** Figurinha de cada equipe, pelo nome exato que vem da API. */
export const teamSprites: Record<string, Sprite> = {
  'EQUIPE ELITE': teamSticker('elite', 1.002),
  'EQUIPE GERAÇÃO': teamSticker('geracao', 1.06),
  'EQUIPE PERFORMANCE': teamSticker('performance', 0.788),
  'EQUIPE SINERGIA': teamSticker('sinergia', 0.962),
  'EQUIPE DREAM': teamSticker('dream', 0.959),
  'EQUIPE PREDADORES': teamSticker('predadores', 1.044),
};
