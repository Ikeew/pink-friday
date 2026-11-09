import { GROUP_RACE_SIZE, RACE_SIZE, SELLER_PAGES } from '../data/dashboard';
import type {
  Cycle,
  CycleView,
  DashboardData,
  LaneRow,
  RaceBoardPage,
  RankedAmount,
  RankingRow,
  Seller,
} from '../types';
import { formatCurrency, formatPercent } from './format';
import { shortName, teamName, toSdrRunner, toSeller, toTeamRunner } from './people';

/** Sem meta individual, o líder fica neste ponto da pista e os demais, em proporção a ele. */
const LEADER_POSITION = 0.7;
const RANKING_SIZE = 5;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface LaneEntry {
  runner: Seller;
  team: string;
  amount: number;
  count?: number;
}

interface LaneOptions {
  /** Meta de cada corredor; sem ela, a pista é proporcional ao primeiro colocado. */
  target: number | undefined;
  /** Valor do primeiro colocado do ranking completo, não só desta tela. */
  leaderAmount: number;
  /** Posição do primeiro corredor da tela no ranking completo, menos 1. */
  rankOffset: number;
  realized: number;
}

function salesCount(count: number | undefined) {
  return count === undefined ? '' : `${count} ${count === 1 ? 'venda' : 'vendas'}`;
}

function laneNote(entry: LaneEntry, rank: number, { target, leaderAmount }: LaneOptions) {
  if (target !== undefined && entry.amount >= target) {
    return `Meta batida · ${formatCurrency(entry.amount - target)} acima`;
  }
  if (target) {
    return `${formatPercent(clamp01(entry.amount / target))} da meta · faltam ${formatCurrency(target - entry.amount)}`;
  }
  const count = salesCount(entry.count);
  if (rank === 1) return count ? `Líder · ${count}` : 'Líder';
  const behind = `${formatCurrency(leaderAmount - entry.amount)} atrás do líder`;
  return count ? `${count} · ${behind}` : behind;
}

function buildLanes(entries: LaneEntry[], options: LaneOptions): LaneRow[] {
  const { target, leaderAmount, rankOffset, realized } = options;
  const scale = target ?? leaderAmount / LEADER_POSITION;

  return entries.map((entry, index) => {
    const rank = rankOffset + index + 1;
    return {
      seller: entry.runner,
      team: entry.team,
      rank,
      amount: entry.amount,
      share: realized > 0 ? entry.amount / realized : 0,
      progress: scale > 0 ? clamp01(entry.amount / scale) : 0,
      reachedGoal: target !== undefined && entry.amount >= target,
      note: laneNote(entry, rank, options),
    };
  });
}

/**
 * Telas que se revezam na pista: vendedores em páginas de 5, depois equipes e SDRs.
 * Telas sem ninguém ficam de fora; a primeira sempre existe, para o estado de carregamento.
 */
function buildBoards(cycle: Cycle, data: DashboardData | null, realized: number): RaceBoardPage[] {
  const sellers = data?.sellers ?? [];
  const leader = sellers[0]?.amount ?? 0;
  const boards: RaceBoardPage[] = [];

  for (let page = 0; page < SELLER_PAGES; page += 1) {
    const from = page * RACE_SIZE;
    const slice = sellers.slice(from, from + RACE_SIZE);
    if (page > 0 && slice.length === 0) break;
    boards.push({
      id: `vendedores-${page + 1}`,
      label: `${from + 1}º–${from + RACE_SIZE}º`,
      title: `Vendedores do ${from + 1}º ao ${from + RACE_SIZE}º lugar`,
      rows: buildLanes(
        slice.map((sales) => ({ runner: toSeller(sales.name), team: teamName(sales.team), amount: sales.amount, count: sales.count })),
        { target: cycle.sellerTarget, leaderAmount: leader, rankOffset: from, realized },
      ),
    });
  }

  const group = (id: string, label: string, title: string, entries: RankedAmount[], toRunner: (name: string) => Seller, target?: number) => {
    const top = entries.slice(0, GROUP_RACE_SIZE);
    if (top.length === 0) return;
    boards.push({
      id,
      label,
      title,
      rows: buildLanes(
        top.map((entry) => ({ runner: toRunner(entry.name), team: '', amount: entry.amount, count: entry.count })),
        { target, leaderAmount: top[0]?.amount ?? 0, rankOffset: 0, realized },
      ),
    });
  };

  group('equipes', 'Equipes', 'Corrida das equipes', data?.teams ?? [], toTeamRunner, cycle.teamTarget);
  group('sdrs', 'SDRs', 'Corrida das SDRs', data?.sdrs ?? [], toSdrRunner);

  return boards;
}

function buildRanking(entries: RankedAmount[], people: boolean): RankingRow[] {
  return entries.slice(0, RANKING_SIZE).map((entry, index) => ({
    id: entry.name,
    // O seletor do painel já diz "Equipes"; sem o prefixo, o nome cabe na linha.
    name: people ? shortName(entry.name) : teamName(entry.name),
    rank: index + 1,
    amount: entry.amount,
  }));
}

/** Deriva tudo o que o painel exibe a partir da meta manual e dos dados da API. */
export function buildCycleView(cycle: Cycle, data: DashboardData | null): CycleView {
  const sellers = data?.sellers ?? [];
  const realized = sellers.reduce((sum, sales) => sum + sales.amount, 0);

  return {
    cycle,
    loaded: data !== null,
    realized,
    remaining: Math.max(0, cycle.target - realized),
    attainment: cycle.target > 0 ? clamp01(realized / cycle.target) : 0,
    averageTicket: data?.averageTicket ?? 0,
    salesCount: sellers.reduce((sum, sales) => sum + sales.count, 0),
    salesToday: data?.salesToday ?? 0,
    boards: buildBoards(cycle, data, realized),
    teams: buildRanking(data?.teams ?? [], false),
    sdrs: buildRanking(data?.sdrs ?? [], true),
  };
}
