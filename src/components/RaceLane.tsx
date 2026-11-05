import type { CSSProperties } from 'react';
import type { SellerHighlight } from '../hooks/useSellerHighlight';
import { formatCurrency, formatPercent } from '../lib/format';
import type { LaneRow } from '../types';
import { Mascot } from './art/Mascot';
import { Avatar, RankBadge } from './SellerBadges';

/** Acima deste avanço não há espaço à direita do corredor, e o valor passa para a esquerda. */
const FLIP_LABEL_AT = 0.8;

function Stat({ row, className = '' }: { row: LaneRow; className?: string }) {
  return (
    <p className={`font-display leading-none whitespace-nowrap ${className}`}>
      <span className="block text-xl font-bold text-ink lg:text-[1.6rem]">{formatCurrency(row.amount)}</span>
      <span className="mt-0.5 block text-sm font-medium text-ink-soft lg:text-base">
        {formatPercent(row.share)} do total
      </span>
    </p>
  );
}

function GoalChip({ row, active }: { row: LaneRow; active: boolean }) {
  return (
    <span
      className={`inline-block rounded-md bg-plum px-2 py-0.5 font-display text-sm font-medium whitespace-nowrap text-white transition-all duration-300 ease-premium ${
        active ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
    >
      {row.note}
    </span>
  );
}

interface RaceLaneProps {
  row: LaneRow;
  /** 0 antes da animação de entrada; depois, o avanço real. */
  progress: number;
  highlight: SellerHighlight;
}

export function RaceLane({ row, progress, highlight }: RaceLaneProps) {
  const { seller, rank } = row;
  const active = highlight.activeId === seller.id;
  const flipLabel = progress > FLIP_LABEL_AT;

  return (
    <li
      style={{ '--p': progress, zIndex: active ? 10 : undefined } as CSSProperties}
      className={`lane group relative grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-xl px-2 py-1 transition-all duration-300 ease-premium lg:flex lg:flex-1 lg:gap-x-0 ${
        active ? 'bg-white/70 shadow-card' : 'hover:bg-white/40'
      }`}
    >
      <RankBadge rank={rank} className="relative z-[1] size-9 text-xl lg:size-[3.25rem] lg:text-[1.75rem]" />
      <Avatar seller={seller} className="relative z-[1] size-10 lg:-ml-1 lg:size-[3.5rem]" />

      {/* Cabeçalho da raia em telas menores. */}
      <p className="min-w-0 font-display text-lg leading-tight font-semibold text-ink lg:hidden">{seller.name}</p>
      <Stat row={row} className="pr-2 text-right lg:hidden" />

      <div className="relative col-span-full h-[4.25rem] lg:h-full lg:min-h-[4rem] lg:flex-1">
        {/* Trilho e preenchimento. */}
        <div className="absolute inset-x-0 bottom-2.5 h-3 overflow-hidden rounded-r-full bg-white/70 lg:-left-3 lg:bottom-3 lg:h-3.5">
          <div className="lane-fill size-full rounded-r-full bg-gradient-to-r from-brand-bright/70 via-brand to-brand" />
        </div>

        <div className="absolute top-0 left-0 z-[3] flex max-w-full items-center gap-2 lg:top-1.5 lg:left-2">
          <p className="hidden font-display text-xl font-semibold text-ink lg:block">{seller.name}</p>
          <GoalChip row={row} active={active} />
        </div>

        {/* O grupo inteiro se desloca por transform, na largura da pista. */}
        <div className="lane-runner pointer-events-none absolute inset-0 z-[2]">
          <span aria-hidden="true" className="absolute bottom-7 -left-[4.25rem] flex gap-2 lg:-left-[5rem]">
            <i className="dust block size-2.5 rounded-full bg-[#D8B6A6]" />
            <i className="dust block size-2 rounded-full bg-[#D8B6A6] [animation-delay:300ms]" />
          </span>
          <div className="absolute bottom-1 -left-[3.1rem] h-[4.25rem] w-[4rem] origin-bottom transition-all duration-300 ease-premium group-hover:scale-110 lg:-left-[3.9rem] lg:h-[5.5rem] lg:w-[5.25rem]">
            <Mascot look={seller.look} className="size-full" />
          </div>
          <div
            className={`absolute top-1/2 hidden -translate-y-[62%] rounded-lg bg-white/80 px-2 py-1 lg:block ${
              flipLabel ? 'left-0 -translate-x-[calc(100%+4.25rem)]' : 'left-[1.4rem]'
            }`}
          >
            <Stat row={row} />
          </div>
        </div>
      </div>

      {/* Cobre a raia inteira: um único alvo para hover, toque e teclado. */}
      <button
        type="button"
        aria-pressed={highlight.pinnedId === seller.id}
        aria-label={`${rank}º lugar, ${seller.name}: ${formatCurrency(row.amount)}, ${formatPercent(row.share)} do total. ${row.note}.`}
        {...highlight.bind(seller.id)}
        className="absolute inset-0 z-[4] cursor-pointer rounded-xl outline-none transition-all duration-300 ease-premium focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-brand"
      />
    </li>
  );
}
