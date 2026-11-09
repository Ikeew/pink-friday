export type HairStyle = 'short' | 'long';

/** Parâmetros visuais do mascote vetorial de cada vendedor. */
export interface Look {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  glasses?: boolean;
  /** Cor da barba; omita para rosto sem barba. */
  beard?: string;
  /** Barba rala (por fazer) em vez de cheia. */
  stubble?: boolean;
}

/** Personagem recortado que corre na pista no lugar do mascote vetorial. */
export interface Sprite {
  src: string;
  /** Largura ÷ altura da imagem. */
  aspect: number;
  /** Centro e topo da cabeça, e largura da coroa, em % da imagem. */
  crownX: number;
  crownY: number;
  crownWidth: number;
}

export interface Seller {
  id: string;
  name: string;
  look: Look;
  sprite?: Sprite;
}

/** Configuração manual de um ciclo; os valores de venda vêm da API. */
export interface Cycle {
  id: string;
  label: string;
  /** Datas ISO (AAAA-MM-DD), ambas inclusas. */
  start: string;
  end: string;
  target: number;
  /** Meta de cada vendedor. Sem ela, a pista é proporcional ao líder do ciclo. */
  sellerTarget?: number;
}

export interface RankedAmount {
  name: string;
  amount: number;
}

export interface SellerSales extends RankedAmount {
  team: string;
  count: number;
}

/** Resposta de `GET /api/dashboard`. */
export interface DashboardData {
  sellers: SellerSales[];
  teams: RankedAmount[];
  sdrs: RankedAmount[];
  averageTicket: number;
  salesToday: number;
  fetchedAt: string;
}

export interface LaneRow {
  seller: Seller;
  /** Equipe do vendedor, sem o prefixo "Equipe". */
  team: string;
  rank: number;
  amount: number;
  /** Participação no total realizado do ciclo (0–1). */
  share: number;
  /** Posição na pista (0–1). */
  progress: number;
  /** Atingiu a meta individual do ciclo. */
  reachedGoal: boolean;
  /** Comparação exibida no destaque da raia. */
  note: string;
}

export interface RankingRow {
  id: string;
  name: string;
  rank: number;
  amount: number;
}

export interface CycleView {
  cycle: Cycle;
  /** Falso até a primeira resposta da API; os totais ainda não significam nada. */
  loaded: boolean;
  realized: number;
  remaining: number;
  /** Realizado ÷ meta do ciclo, limitado a 0–1. */
  attainment: number;
  averageTicket: number;
  salesCount: number;
  salesToday: number;
  rows: LaneRow[];
  teams: RankingRow[];
  sdrs: RankingRow[];
}

export type LoadStatus = 'loading' | 'ready' | 'error';
