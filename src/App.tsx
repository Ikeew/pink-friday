import { useMemo, useState } from 'react';
import { GoalDonut } from './components/GoalDonut';
import { Hero } from './components/Hero';
import { KpiStrip } from './components/KpiStrip';
import { RaceBoard } from './components/RaceBoard';
import { RankingPanel } from './components/RankingPanel';
import { SalesStats } from './components/SalesStats';
import { cycles, DEFAULT_CYCLE_ID, OVERALL_TARGET } from './data/dashboard';
import { useDashboardData } from './hooks/useDashboardData';
import { useSellerHighlight } from './hooks/useSellerHighlight';
import { buildCycleView } from './lib/metrics';

function findCycle(id: string) {
  const cycle = cycles.find((item) => item.id === id) ?? cycles[0];
  if (!cycle) throw new Error('Nenhum ciclo configurado.');
  return cycle;
}

export function App() {
  const [cycleId, setCycleId] = useState(DEFAULT_CYCLE_ID);
  const cycle = findCycle(cycleId);
  const { data, status } = useDashboardData(cycle);
  const highlight = useSellerHighlight();
  const view = useMemo(() => buildCycleView(cycle, data), [cycle, data]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Hero cycle={view.cycle} />

      <main className="relative z-10 flex flex-1 flex-col gap-4 px-4 pb-4 md:px-5 md:pb-5">
        <KpiStrip view={view} overallTarget={OVERALL_TARGET} />

        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[16.5rem_minmax(0,1fr)_17.5rem]">
          <div className="order-2 xl:order-1">
            <GoalDonut view={view} />
          </div>
          <div className="order-1 md:col-span-2 xl:order-2 xl:col-span-1">
            <RaceBoard
              view={view}
              status={status}
              cycles={cycles}
              onSelectCycle={setCycleId}
              highlight={highlight}
            />
          </div>
          <aside
            aria-label="Ranking e vendas"
            className="order-3 flex flex-col gap-3"
          >
            <RankingPanel teams={view.teams} sdrs={view.sdrs} loaded={view.loaded} />
            <SalesStats
              salesCount={view.loaded ? view.salesCount : null}
              salesToday={view.loaded ? view.salesToday : null}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
