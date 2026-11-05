import { useState } from 'react';
import { formatCurrency, formatPercent } from '../lib/format';
import type { CycleView } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { Panel } from './Panel';

type Segment = 'realized' | 'remaining';

const RADIUS = 40;
/** Respiro entre os segmentos, em unidades de `pathLength` (0–100). */
const GAP = 0.6;

const SEGMENT_LABEL: Record<Segment, string> = {
  realized: 'Realizado',
  remaining: 'Falta',
};
const SEGMENT_COLOR: Record<Segment, string> = {
  realized: 'var(--color-brand)',
  remaining: 'var(--color-remaining)',
};

export function GoalDonut({ view }: { view: CycleView }) {
  const [hovered, setHovered] = useState<Segment | null>(null);

  const ratio = view.attainment;
  const realizedLength = ratio * 100;
  const shown = hovered === 'remaining' ? 1 - ratio : ratio;
  const caption = hovered === 'remaining' ? 'FALTANDO' : 'ATINGIDO';

  const segments: { id: Segment; length: number; offset: number; amount: number }[] = [
    { id: 'realized', length: realizedLength, offset: 0, amount: view.realized },
    { id: 'remaining', length: 100 - realizedLength, offset: realizedLength, amount: view.remaining },
  ];

  return (
    <Panel title="Meta de venda" className="h-full">
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="relative mx-auto my-auto aspect-square w-full max-w-60 xl:max-w-none">
          <svg
            role="img"
            aria-label={
              view.loaded
                ? `${formatPercent(ratio)} da meta atingido: ${formatCurrency(view.realized)} realizados, faltam ${formatCurrency(view.remaining)}.`
                : 'Dados da meta indisponíveis.'
            }
            viewBox="0 0 100 100"
            className="size-full -rotate-90"
          >
            {segments.map(
              ({ id, length, offset }) =>
                length > 0 && (
                  <circle
                    key={id}
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    pathLength={100}
                    fill="none"
                    stroke={SEGMENT_COLOR[id]}
                    strokeWidth={hovered === id ? 19 : 17}
                    strokeDasharray={`${Math.max(0, length - GAP)} ${100 - Math.max(0, length - GAP)}`}
                    strokeDashoffset={-offset}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    className="transition-all duration-300 ease-premium"
                  />
                ),
            )}
          </svg>
          <p className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-5xl leading-none font-bold text-brand-deep">
              <AnimatedNumber value={view.loaded ? shown * 100 : null} format={(value) => `${Math.round(value)}%`} />
            </span>
            <span className="font-display text-lg font-semibold tracking-wide text-ink">{caption}</span>
          </p>
        </div>

        <ul className="flex flex-col gap-1">
          {segments.map(({ id, amount }) => (
            <li
              key={id}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-3 rounded-lg px-2 py-1.5 font-display text-lg font-medium transition-all duration-300 ease-premium ${hovered === id ? 'bg-canvas' : ''}`}
            >
              <span
                aria-hidden="true"
                className="size-4 shrink-0 rounded-full"
                style={{ background: SEGMENT_COLOR[id] }}
              />
              <span className="text-ink-soft">{SEGMENT_LABEL[id]}</span>
              <span className="ml-auto font-semibold text-ink">
                <AnimatedNumber value={view.loaded ? amount : null} format={formatCurrency} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
