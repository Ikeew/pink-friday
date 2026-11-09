const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export const formatCurrency = (value: number) => currency.format(value);
export const formatNumber = (value: number) => number.format(value);
export const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`;

/**
 * Situação diante da meta individual: "150% da meta" para quem bateu e
 * "faltam 23% para a meta" para quem não bateu. Arredonda o que falta para cima,
 * para nunca dizer "faltam 0%" a quem ainda não chegou.
 */
export function goalStatusParts(attainment: number): [string, string] {
  if (attainment >= 1) return [`${Math.floor(attainment * 100)}%`, 'da meta'];
  return [`faltam ${Math.max(1, Math.ceil((1 - attainment) * 100))}%`, 'para a meta'];
}

export const formatGoalStatus = (attainment: number) => goalStatusParts(attainment).join(' ');

/** Lê a data ISO por partes para não sofrer deslocamento de fuso horário. */
function parts(iso: string) {
  const [year = '', month = '1', day = '1'] = iso.split('-');
  return { year, day: day.padStart(2, '0'), month: MONTHS[Number(month) - 1] ?? '' };
}

export function formatPeriod(startIso: string, endIso: string) {
  const start = parts(startIso);
  const end = parts(endIso);
  return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
}
