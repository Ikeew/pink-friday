import { useEffect, useState } from 'react';
import type { SellerHighlight } from '../hooks/useSellerHighlight';
import type { Cycle, CycleView, LoadStatus } from '../types';
import { RaceScenery } from './art/Scenery';
import { CycleTabs } from './CycleTabs';
import { RaceLane } from './RaceLane';

const PANEL_ID = 'race-panel';

function FinishGate() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-2 right-2 bottom-3 w-10 lg:right-5 lg:w-[5.75rem]"
    >
      <div className="checker absolute top-3 bottom-0 left-0 w-2.5 rounded-sm shadow-card lg:w-3.5" />
      <div className="checker absolute top-3 right-0 bottom-6 w-2.5 rounded-sm shadow-card lg:w-3.5" />
      <div className="absolute inset-x-0 top-0 rounded-sm bg-gradient-to-r from-brand to-brand-bright py-0.5 text-center font-display text-xs font-extrabold tracking-wide text-white italic shadow-card lg:text-[1.75rem] lg:leading-tight">
        META
      </div>
    </div>
  );
}

function statusMessage(status: LoadStatus, hasData: boolean, hasSales: boolean) {
  if (status === 'error') {
    return hasData
      ? 'Sem conexão com os dados: exibindo a última atualização'
      : 'Não foi possível carregar as vendas. Tentando novamente…';
  }
  if (status === 'loading') return 'Carregando vendas…';
  return hasSales ? null : 'Nenhuma venda registrada neste período';
}

interface RaceBoardProps {
  view: CycleView;
  status: LoadStatus;
  cycles: Cycle[];
  onSelectCycle: (id: string) => void;
  highlight: SellerHighlight;
}

export function RaceBoard({ view, status, cycles, onSelectCycle, highlight }: RaceBoardProps) {
  // Os corredores partem da largada no primeiro render e disparam a transição.
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const message = statusMessage(status, view.loaded, view.realized > 0);

  return (
    <section
      aria-label="Corrida de vendas"
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card"
    >
      <CycleTabs
        cycles={cycles}
        activeId={view.cycle.id}
        panelId={PANEL_ID}
        onSelect={onSelectCycle}
      />

      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={`tab-${view.cycle.id}`}
        className="relative flex-1 overflow-hidden"
      >
        <RaceScenery />
        <FinishGate />

        <div role="status" className="absolute top-2 left-1/2 z-20 w-max max-w-[calc(100%-4rem)] -translate-x-1/2">
          {message && (
            <p className="rounded-full bg-plum px-4 py-1 text-center font-display text-base font-medium text-white shadow-card">
              {message}
            </p>
          )}
        </div>

        <ol className="relative flex h-full flex-col gap-1 py-3 pr-10 pl-2 lg:gap-0 lg:pt-8 lg:pr-[6.5rem] lg:pb-2 lg:pl-3">
          {view.rows.map((row) => (
            <RaceLane
              key={row.seller.id}
              row={row}
              progress={started ? row.progress : 0}
              highlight={highlight}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
