import type { DashboardData, RankedAmount, SellerSales } from '../src/types.ts';

/**
 * Consultas permitidas. O SQL fica só no servidor: a rota da Groner executa o que
 * receber, então nem o token nem o texto das consultas podem chegar ao navegador.
 */
const QUERIES = {
  teams: `SELECT Receita, Equipe
FROM (
    SELECT TOP 5
      SUM(v.ValorTotal) AS Receita, eq.Nome AS Equipe
    FROM Vendas v
    JOIN Leads l ON v.LeadId = l.Id
    JOIN Usuarios u ON v.VendedorId = u.Id
    JOIN Projetos p ON v.ProjetoId = p.Id
    JOIN EquipesTecnicas eq ON u.EquipeId = eq.Id
    WHERE v.Excluido = 0
      [[AND v.DataVenda BETWEEN {{data}}]]
      [[AND u.Id IN {{vendedor}}]]
      [[AND l.OrigemId IN {{origem}}]]
      [[AND u.EquipeId IN {{equipe}}]]
    GROUP BY eq.Nome
    ORDER BY Receita DESC
) AS t
ORDER BY Receita ASC`,
  sellers: `SELECT COUNT(*) AS Vendas, SUM(v.ValorTotal) AS Receita, u.Nome AS Vendedor, eq.Nome AS Equipe
FROM Vendas v
JOIN Leads l ON v.LeadId = l.Id
JOIN Usuarios u ON v.VendedorId = u.Id
JOIN Projetos p ON v.ProjetoId = p.Id
JOIN EquipesTecnicas eq ON u.EquipeId = eq.Id
WHERE v.Excluido = 0
  [[AND v.DataVenda BETWEEN {{data}}]]
  [[AND u.Id IN {{vendedor}}]]
  [[AND l.OrigemId IN {{origem}}]]
  [[AND u.EquipeId IN {{equipe}}]]
GROUP BY u.Id, u.Nome, eq.Nome
ORDER BY Receita DESC`,
  sdrs: `SELECT u.Nome,
    'R$ ' + FORMAT(SUM(v.ValorTotal), 'N2', 'pt-BR') AS "Valor Total",
    COUNT(DISTINCT v.Id) AS "Vendas"
FROM Vendas v
JOIN Leads l ON l.id = v.leadid
JOIN usuarios u ON l.PreVendedorId = u.id
WHERE v.Excluido = 0
  AND (
      u.Nome LIKE '%Kelly Moreira%'
      OR u.Nome LIKE '%Camila Lopes%'
      OR u.Nome LIKE '%Filipe Gonçalves Correa%'
      OR u.Nome LIKE '%ERICA GOMES%'
      OR u.Nome LIKE 'GISA%'
      OR u.Nome LIKE 'KETLY%'
  )
  [[AND v.DataVenda BETWEEN {{data}}]]
GROUP BY u.Nome
ORDER BY SUM(v.ValorTotal) DESC`,
  averageTicket: `SELECT AVG(CAST(v.ValorTotal AS FLOAT)) AS [Ticket Médio]
FROM Vendas v
JOIN Leads l ON v.LeadId = l.Id
JOIN Usuarios u ON v.VendedorId = u.Id
WHERE v.Excluido = 0
  [[AND v.DataVenda BETWEEN {{data}}]]
  [[AND u.Id IN {{vendedor}}]]
  [[AND l.OrigemId IN {{origem}}]]
  [[AND u.EquipeId IN {{equipe}}]]`,
} as const;

type QueryName = keyof typeof QUERIES;
type Row = Record<string, unknown>;

export interface GronerConfig {
  url: string;
  token: string;
}

const REQUEST_TIMEOUT_MS = 20_000;

/** A API lê a data final como meia-noite; sem o horário, o último dia ficaria de fora. */
const endOfDay = (isoDate: string) => `${isoDate}T23:59:59`;

async function runQuery(config: GronerConfig, query: QueryName, from: string, to: string): Promise<Row[]> {
  const end = endOfDay(to);
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.token}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      Sql: QUERIES[query],
      Parametros: {
        obra_nova: 129,
        obra_pendente: 130,
        obra_instalada: 133,
        funil_instalacao: 9,
        funil_pos_obra: null,
        data: { from, to: end },
        data_inicio: from,
        data_fim: end,
        vendedor: [],
        equipe: [],
        origem: [],
      },
    }),
  });

  if (!response.ok) throw new Error(`Groner respondeu ${response.status} na consulta "${query}".`);

  const body = (await response.json()) as {
    Content?: { columns?: string[]; rows?: unknown[][]; truncated?: boolean };
  };
  const { columns, rows, truncated } = body.Content ?? {};
  if (!columns || !rows) throw new Error(`Resposta inesperada da Groner na consulta "${query}".`);
  // Resultado cortado deixaria os totais abaixo do real: melhor falhar do que exibir número errado.
  if (truncated) throw new Error(`Resultado truncado na consulta "${query}".`);

  return rows.map((row) => Object.fromEntries(columns.map((column, index) => [column, row[index]])));
}

/** Converte "R$ 116.480,00", formato devolvido pela consulta de SDRs, em número. */
export function parseBrl(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const parsed = Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

const toNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0);
const toName = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const byAmountDesc = (a: RankedAmount, b: RankedAmount) => b.amount - a.amount;

/** Data de hoje em São Paulo (AAAA-MM-DD), independentemente do fuso do servidor. */
export function todayInSaoPaulo(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(now);
}

export async function fetchDashboard(config: GronerConfig, from: string, to: string): Promise<DashboardData> {
  const today = todayInSaoPaulo();
  const [sellerRows, teamRows, sdrRows, ticketRows, todayRows] = await Promise.all([
    runQuery(config, 'sellers', from, to),
    runQuery(config, 'teams', from, to),
    runQuery(config, 'sdrs', from, to),
    runQuery(config, 'averageTicket', from, to),
    runQuery(config, 'sellers', today, today),
  ]);

  const sellers: SellerSales[] = sellerRows
    .map((row) => ({
      name: toName(row['Vendedor']),
      team: toName(row['Equipe']),
      amount: toNumber(row['Receita']),
      count: toNumber(row['Vendas']),
    }))
    .sort(byAmountDesc);

  return {
    sellers,
    teams: teamRows
      .map((row) => ({ name: toName(row['Equipe']), amount: toNumber(row['Receita']) }))
      .sort(byAmountDesc),
    sdrs: sdrRows
      .map((row) => ({ name: toName(row['Nome']), amount: parseBrl(row['Valor Total']) }))
      .sort(byAmountDesc),
    averageTicket: toNumber(ticketRows[0]?.['Ticket Médio']),
    salesToday: todayRows.reduce((sum, row) => sum + toNumber(row['Vendas']), 0),
    fetchedAt: new Date().toISOString(),
  };
}
