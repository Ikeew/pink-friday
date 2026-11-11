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
/** Meta de equipe para quem não tiver meta própria em `TEAM_TARGETS`. */
const TEAM_TARGET = 450_000;
/** Meta individual de cada equipe no ciclo (soma R$ 2.100.000). A corrida das equipes é pelo % dela. */
const TEAM_TARGETS: Record<string, number> = {
  'EQUIPE ELITE': 471_910,
  'EQUIPE DREAM': 377_528,
  'EQUIPE SINERGIA': 377_528,
  'EQUIPE GERAÇÃO': 306_742,
  'EQUIPE PREDADORES': 283_146,
  'EQUIPE PERFORMANCE': 283_146,
};
/** Meta de cada SDR no ciclo. */
const SDR_TARGET = 150_000;

/** Ciclo 2: meta total de R$ 2.900.000. */
const CYCLE_2_SELLER_TARGET = 150_000;
const CYCLE_2_SDR_TARGET = 200_000;
/** Mesma proporção do Ciclo 1 (× 2,9M / 2,1M). */
const CYCLE_2_TEAM_TARGET = 621_429;
/** Mesma participação % de cada equipe no Ciclo 1, sobre R$ 2.900.000 (soma exata). */
const CYCLE_2_TEAM_TARGETS: Record<string, number> = {
  'EQUIPE ELITE': 651_686,
  'EQUIPE DREAM': 521_348,
  'EQUIPE SINERGIA': 521_348,
  'EQUIPE GERAÇÃO': 423_596,
  'EQUIPE PREDADORES': 391_011,
  'EQUIPE PERFORMANCE': 391_011,
};

/** Ciclo 3: meta total de R$ 3.500.000. */
const CYCLE_3_SELLER_TARGET = 200_000;
const CYCLE_3_SDR_TARGET = 250_000;
/** Mesma proporção do Ciclo 1 (× 3,5M / 2,1M). */
const CYCLE_3_TEAM_TARGET = 750_000;
/** Mesma participação % de cada equipe no Ciclo 1, sobre R$ 3.500.000 (soma exata). */
const CYCLE_3_TEAM_TARGETS: Record<string, number> = {
  'EQUIPE ELITE': 786_517,
  'EQUIPE DREAM': 629_213,
  'EQUIPE SINERGIA': 629_213,
  'EQUIPE GERAÇÃO': 511_237,
  'EQUIPE PREDADORES': 471_910,
  'EQUIPE PERFORMANCE': 471_910,
};

export const cycles: Cycle[] = [
  { id: 'ciclo-1', label: 'Ciclo 1', start: '2026-11-01', end: '2026-11-10', target: 2_100_000, sellerTarget: SELLER_TARGET, teamTarget: TEAM_TARGET, teamTargets: TEAM_TARGETS, sdrTarget: SDR_TARGET },
  { id: 'ciclo-2', label: 'Ciclo 2', start: '2026-11-11', end: '2026-11-20', target: 2_900_000, sellerTarget: CYCLE_2_SELLER_TARGET, teamTarget: CYCLE_2_TEAM_TARGET, teamTargets: CYCLE_2_TEAM_TARGETS, sdrTarget: CYCLE_2_SDR_TARGET },
  { id: 'ciclo-3', label: 'Ciclo 3', start: '2026-11-21', end: '2026-11-30', target: 3_500_000, sellerTarget: CYCLE_3_SELLER_TARGET, teamTarget: CYCLE_3_TEAM_TARGET, teamTargets: CYCLE_3_TEAM_TARGETS, sdrTarget: CYCLE_3_SDR_TARGET },
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
  'OTAVIO AUGUSTO': avatar('otavio', 0.993, 67, 1, 30),
  'GESIEL DEOCLIDES': avatar('gesiel', 0.959, 64.1, 1.2, 32),
  'VANUZA PROENÇA': avatar('vanuza', 0.89, 57, 0.5, 32),
  'ADRIANO DA SILVA TIBURCIO': avatar('adriano', 0.96, 69, 0, 34),
  'EDUARDO PALLAR': avatar('eduardo', 0.96, 62, 0, 34),
  'LEONARDO DOS SANTOS': avatar('leonardo', 1.129, 72, 1, 28),
  'MAIQUE PAROLIM': avatar('maique', 0.952, 62, 2.5, 28),
  'ABDIEL CARDOSO': avatar('abdiel', 0.993, 66, 0.5, 30),
  'GLAUBERTE MAMEDE': avatar('glauberte', 1.21, 65, 0.5, 28),
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
  'EQUIPE ELITE': teamSticker('elite', 0.976),
  'EQUIPE GERAÇÃO': teamSticker('geracao', 1.062),
  'EQUIPE PERFORMANCE': teamSticker('performance', 0.987),
  'EQUIPE SINERGIA': teamSticker('sinergia', 1.035),
  'EQUIPE DREAM': teamSticker('dream', 0.959),
  'EQUIPE PREDADORES': teamSticker('predadores', 1.001),
  /** Mascote: a pantera, com a coroa sobre a cabeça (fica à esquerda da figura). */
  'TIME MATRIZ': { ...teamSticker('matriz', 0.531), crownX: 45, crownY: 1, crownWidth: 45 },
};
