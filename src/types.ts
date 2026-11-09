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
  /** Meta de cada equipe. */
  teamTarget?: number;
  /** Meta de cada SDR. */
  sdrTarget?: number;
}

export interface RankedAmount {
  name: string;
  amount: number;
  /** Quantidade de vendas, quando a consulta informa. */
  count?: number;
}

export interface SellerSales extends RankedAmount {
  team: string;
  count: number;
}

/** Uma das telas que se revezam na pista. */
export interface RaceBoardPage {
  id: string;
  /** Rótulo curto do seletor de telas. */
  label: string;
  /** Descrição completa, anunciada a leitores de tela. */
  title: string;
  rows: LaneRow[];
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
  /** Equipe do vendedor, sem o prefixo "Equipe"; vazio para equipes e SDRs. */
  team: string;
  rank: number;
  amount: number;
  /** Valor ÷ meta individual, sem limite (1,5 = 150%); `null` sem meta. */
  attainment: number | null;
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
  /** Telas da pista, na ordem do revezamento. */
  boards: RaceBoardPage[];
  teams: RankingRow[];
  sdrs: RankingRow[];
}

export type LoadStatus = 'loading' | 'ready' | 'error';
