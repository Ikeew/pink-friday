import { BarChart3, CalendarPlus, ShoppingCart, type LucideIcon } from 'lucide-react';
import { formatNumber } from '../lib/format';
import { AnimatedNumber } from './AnimatedNumber';

interface StatCardProps {
  headerIcon: LucideIcon;
  bodyIcon: LucideIcon;
  label: string;
  value: number | null;
}

function StatCard({ headerIcon: HeaderIcon, bodyIcon: BodyIcon, label, value }: StatCardProps) {
  return (
    <dl className="flex flex-1 flex-col overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand-bright p-1 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-card-hover">
      <dt className="flex items-center justify-center gap-2 py-1 font-display text-lg font-semibold tracking-wide text-white uppercase">
        <HeaderIcon aria-hidden="true" className="size-5" />
        {label}
      </dt>
      <dd className="relative flex flex-1 items-center justify-center rounded-lg bg-white py-0.5">
        <BodyIcon aria-hidden="true" className="absolute left-4 size-8 text-brand" />
        <span className="font-display text-[2.25rem] leading-none font-bold text-ink">
          <AnimatedNumber value={value} format={formatNumber} />
        </span>
      </dd>
    </dl>
  );
}

interface SalesStatsProps {
  salesCount: number | null;
  salesToday: number | null;
}

export function SalesStats({ salesCount, salesToday }: SalesStatsProps) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <StatCard headerIcon={BarChart3} bodyIcon={ShoppingCart} label="Número de vendas" value={salesCount} />
      <StatCard headerIcon={CalendarPlus} bodyIcon={BarChart3} label="Vendas no dia" value={salesToday} />
    </div>
  );
}
