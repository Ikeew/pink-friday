import { BarChart3, History, Tag, Target, Trophy, type LucideIcon } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import type { CycleView } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: number | null;
  /** Destaca o valor na cor da marca. */
  accent?: boolean;
}

function KpiCard({ icon: Icon, label, value, accent }: KpiCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-card-hover md:gap-4 md:px-5 md:py-4">
      <Icon aria-hidden="true" className="hidden size-9 shrink-0 text-brand sm:block panel:size-[2.75rem]" strokeWidth={2.2} />
      <span aria-hidden="true" className="hidden h-11 w-px bg-line sm:block" />
      <dl className="min-w-0">
        <dt className="font-display text-sm font-medium tracking-wide whitespace-nowrap text-ink-soft uppercase">{label}</dt>
        <dd
          className={`font-display text-2xl leading-tight font-bold whitespace-nowrap panel:text-[2rem] ${accent ? 'text-brand-deep' : 'text-ink'}`}
        >
          <AnimatedNumber value={value} format={formatCurrency} />
        </dd>
      </dl>
    </div>
  );
}

function OverallGoal({ value }: { value: number }) {
  return (
    <div className="relative col-span-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand-bright p-1 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-card-hover wide:col-span-4 panel:col-span-1">
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 size-10 bg-gold [clip-path:polygon(100%_0,100%_100%,0_100%)] panel:size-[3rem]"
      />
      <dl className="flex flex-col">
        <dt className="relative flex items-center justify-center gap-2 py-1 font-display text-xl font-bold tracking-wide text-white">
          <Trophy aria-hidden="true" className="size-6 text-gold" />
          META GERAL
        </dt>
        <dd className="relative rounded-lg bg-white py-1 text-center font-display text-3xl leading-tight font-bold whitespace-nowrap text-ink">
          <AnimatedNumber value={value} format={formatCurrency} />
        </dd>
      </dl>
    </div>
  );
}

interface KpiStripProps {
  view: CycleView;
  overallTarget: number;
}

export function KpiStrip({ view, overallTarget }: KpiStripProps) {
  return (
    <section
      aria-label="Indicadores do ciclo"
      className="-mt-3 grid grid-cols-2 gap-3 md:gap-4 wide:grid-cols-4 panel:-mt-1 panel:grid-cols-[repeat(4,minmax(0,1fr))_17.5rem]"
    >
      <KpiCard icon={Target} label="Meta do ciclo" value={view.cycle.target} />
      <KpiCard icon={BarChart3} label="Realizado" value={view.loaded ? view.realized : null} accent />
      <KpiCard icon={History} label="Falta para meta" value={view.loaded ? view.remaining : null} />
      <KpiCard icon={Tag} label="Ticket médio" value={view.loaded ? view.averageTicket : null} accent />
      <OverallGoal value={overallTarget} />
    </section>
  );
}
