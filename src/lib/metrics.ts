import { RACE_SIZE } from '../data/dashboard';
import type { Cycle, CycleView, DashboardData, LaneRow, RankedAmount, RankingRow } from '../types';
import { formatCurrency, formatPercent } from './format';
import { titleCase, toSeller } from './people';

/** Sem meta individual, o líder fica neste ponto da pista e os demais, em proporção a ele. */
const LEADER_POSITION = 0.75;
const RANKING_SIZE = 5;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function buildLanes(cycle: Cycle, data: DashboardData | null, realized: number): LaneRow[] {
  const top = (data?.sellers ?? []).slice(0, RACE_SIZE);
  const leaderAmount = top[0]?.amount ?? 0;
  const { sellerTarget } = cycle;
  const scale = sellerTarget ?? leaderAmount / LEADER_POSITION;

  return top.map((sales, index) => {
    const behindLeader = leaderAmount - sales.amount;
    const reachedGoal = sellerTarget !== undefined && sales.amount >= sellerTarget;
    const note = reachedGoal
      ? `Meta batida · ${formatCurrency(sales.amount - sellerTarget)} acima`
      : sellerTarget
      ? `${formatPercent(clamp01(sales.amount / sellerTarget))} da meta · faltam ${formatCurrency(sellerTarget - sales.amount)}`
      : index === 0
        ? `Líder · ${sales.count} vendas`
        : `${sales.count} vendas · ${formatCurrency(behindLeader)} atrás do líder`;

    return {
      seller: toSeller(sales.name),
      rank: index + 1,
      amount: sales.amount,
      share: realized > 0 ? sales.amount / realized : 0,
      progress: scale > 0 ? clamp01(sales.amount / scale) : 0,
      reachedGoal,
      note,
    };
  });
}

function buildRanking(entries: RankedAmount[], people: boolean): RankingRow[] {
  return entries.slice(0, RANKING_SIZE).map((entry, index) => {
    const seller = people ? toSeller(entry.name) : undefined;
    return {
      id: entry.name,
      // O seletor do painel já diz "Equipes"; sem o prefixo, o nome cabe na linha.
      name: seller?.name ?? titleCase(entry.name).replace(/^Equipe\s+/, ''),
      rank: index + 1,
      amount: entry.amount,
      seller,
    };
  });
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
    rows: buildLanes(cycle, data, realized),
    teams: buildRanking(data?.teams ?? [], false),
    sdrs: buildRanking(data?.sdrs ?? [], true),
  };
}
