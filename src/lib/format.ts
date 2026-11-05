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
