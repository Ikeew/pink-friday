import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { BOARD_ROTATION_MS } from '../data/dashboard';
import { useRotation } from '../hooks/useRotation';
import type { SellerHighlight } from '../hooks/useSellerHighlight';
import type { Cycle, CycleView, LaneRow, LoadStatus } from '../types';
import { RaceScenery } from './art/Scenery';
import { BoardPager } from './BoardPager';
import { CycleTabs } from './CycleTabs';
import { RaceLane } from './RaceLane';

const PANEL_ID = 'race-panel';

function FinishGate() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-2 right-2 bottom-3 w-10 wide:right-5 wide:w-[5.75rem]"
    >
      <div className="checker absolute top-3 bottom-0 left-0 w-2.5 rounded-sm shadow-card wide:w-3.5" />
      <div className="checker absolute top-3 right-0 bottom-6 w-2.5 rounded-sm shadow-card wide:w-3.5" />
      <div className="absolute inset-x-0 top-0 rounded-sm bg-gradient-to-r from-brand to-brand-bright py-0.5 text-center font-display text-xs font-extrabold tracking-wide text-white italic shadow-card wide:text-[1.75rem] wide:leading-tight">
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

/** Folga entre o fim do nome e o personagem parado na largada. */
const NAME_GAP_PX = 12;

/**
 * Largada da tela inteira: depois do nome mais comprido mais o personagem mais largo.
 * Igual para todas as raias, para que a distância percorrida continue comparável.
 */
function useLaneStart() {
  const listRef = useRef<HTMLOListElement>(null);
  const [start, setStart] = useState<number | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      let needed = 0;
      for (const track of list.querySelectorAll<HTMLElement>('[data-lane-track]')) {
        const name = track.querySelector<HTMLElement>('[data-lane-name]');
        // Nome escondido (tela estreita): fica no cabeçalho da raia, então não há o que evitar.
        if (!name || name.offsetWidth === 0) continue;
        const runner = track.querySelector<HTMLElement>('[data-lane-body]') ?? track.querySelector<HTMLElement>('[data-lane-sprite]');
        const nameRight = name.getBoundingClientRect().right - track.getBoundingClientRect().left;
        const runnerWidth = runner?.getBoundingClientRect().width ?? 0;
        needed = Math.max(needed, nameRight + runnerWidth + NAME_GAP_PX);
      }
      setStart(needed > 0 ? Math.ceil(needed) : null);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    // A fonte do nome pode chegar depois do primeiro render e mudar a largura.
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  return { listRef, style: (start === null ? undefined : { '--lane-start': `${start}px` }) as CSSProperties | undefined };
}

/** Raias de uma tela. Montadas de novo a cada troca, então a largada se repete. */
function Lanes({ rows, highlight }: { rows: LaneRow[]; highlight: SellerHighlight }) {
  // Os corredores partem da largada no primeiro render e disparam a transição.
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Com 6 raias, cada uma fica mais baixa; os personagens diminuem para não invadir a de cima.
  const dense = rows.length > 5;
  const laneStart = useLaneStart();

  return (
    <ol ref={laneStart.listRef} style={laneStart.style} className="relative flex h-full flex-col gap-1 pt-12 pr-10 pb-3 pl-2 wide:gap-0 wide:pt-10 wide:pr-[6.5rem] wide:pb-2 wide:pl-3">
      {rows.map((row) => (
        <RaceLane
          key={row.seller.id}
          row={row}
          progress={started ? row.progress : 0}
          highlight={highlight}
          dense={dense}
        />
      ))}
    </ol>
  );
}

interface RaceBoardProps {
  view: CycleView;
  status: LoadStatus;
  cycles: Cycle[];
  onSelectCycle: (id: string) => void;
  highlight: SellerHighlight;
}

export function RaceBoard({ view, status, cycles, onSelectCycle, highlight }: RaceBoardProps) {
  const { boards } = view;
  const rotation = useRotation(boards.length, BOARD_ROTATION_MS);
  const board = boards[rotation.index] ?? boards[0];

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

        <div className="absolute top-2 right-12 left-2 z-20 flex flex-wrap items-center gap-x-3 gap-y-1 wide:right-[8rem] wide:left-3">
          <BoardPager
            boards={boards}
            activeIndex={rotation.index}
            turn={rotation.turn}
            intervalMs={BOARD_ROTATION_MS}
            onSelect={rotation.select}
          />
          <div role="status" className="min-w-0">
            {message && (
              <p className="rounded-full bg-plum px-4 py-0.5 font-display text-base font-medium text-white shadow-card">
                {message}
              </p>
            )}
          </div>
        </div>

        {board && <Lanes key={board.id} rows={board.rows} highlight={highlight} />}
      </div>
    </section>
  );
}
