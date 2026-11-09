import type { CSSProperties } from 'react';
import type { SellerHighlight } from '../hooks/useSellerHighlight';
import { formatCurrency, formatGoalStatus, goalStatusParts } from '../lib/format';
import type { LaneRow, Sprite } from '../types';
import { CrownBadge, Mascot } from './art/Mascot';
import { RankBadge } from './SellerBadges';

/** Acima deste avanço não há espaço à direita do corredor, e o valor passa para a esquerda. */
const FLIP_LABEL_AT = 0.6;

interface StatProps {
  row: LaneRow;
  /** Versão menor, para as raias mais baixas. */
  compact?: boolean;
  className?: string;
}

/**
 * Valor e situação na meta. No celular, em duas linhas. Na tela larga, numa linha só,
 * com a situação em letra menor ao lado: o balão fica baixo e não alcança a faixa
 * de baixo da raia, onde sobe a cabeça do personagem da raia seguinte.
 */
function Stat({ row, compact = false, className = '' }: StatProps) {
  const status = row.attainment !== null ? goalStatusParts(row.attainment) : null;
  return (
    <p className={`font-display whitespace-nowrap wide:flex wide:items-center wide:gap-1.5 ${className}`}>
      <span className={`block text-2xl leading-none font-bold text-ink ${compact ? 'wide:text-[1.6rem]' : 'wide:text-[2rem]'}`}>
        {formatCurrency(row.amount)}
      </span>
      {status && (
        <span
          className={`mt-0.5 block text-base leading-none font-medium text-ink-soft wide:mt-0 wide:leading-[1.05] ${
            compact ? 'wide:text-[0.8rem]' : 'wide:text-[0.95rem]'
          }`}
        >
          <span className="wide:block">{status[0]}</span> <span className="wide:block">{status[1]}</span>
        </span>
      )}
    </p>
  );
}

/** Selo "Meta batida", colado no canto do valor de quem atingiu a meta. */
function GoalStamp({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-[1] flex -rotate-6 items-center gap-1 rounded-md border-2 border-white bg-gradient-to-b from-[#FFE27A] to-gold px-1.5 font-display leading-tight font-extrabold whitespace-nowrap text-plum uppercase italic shadow-card ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[1em] shrink-0" fill="currentColor">
        <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z" />
      </svg>
      Meta batida
    </span>
  );
}

function TeamTag({ team, className = '' }: { team: string; className?: string }) {
  if (!team) return null;
  return <span className={`font-medium tracking-wide text-ink-soft uppercase ${className}`}>{team}</span>;
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

function SpriteRunner({ sprite, crown }: { sprite: Sprite; crown: boolean }) {
  return (
    <div
      className="run-body absolute right-0 bottom-0 h-full wide:h-[105%]"
      style={{ aspectRatio: sprite.aspect }}
    >
      <img src={sprite.src} alt="" className="size-full" />
      {crown && (
        <CrownBadge
          className="absolute h-auto -translate-x-1/2 -translate-y-3/4 overflow-visible"
          style={{ left: `${sprite.crownX}%`, top: `${sprite.crownY}%`, width: `${sprite.crownWidth}%` }}
        />
      )}
    </div>
  );
}

interface RaceLaneProps {
  row: LaneRow;
  /** 0 antes da animação de entrada; depois, o avanço real. */
  progress: number;
  highlight: SellerHighlight;
  /** Raias mais baixas, para caber uma sexta. */
  dense?: boolean;
}

export function RaceLane({ row, progress, highlight, dense = false }: RaceLaneProps) {
  const { seller, rank } = row;
  const active = highlight.activeId === seller.id;
  const flipLabel = progress > FLIP_LABEL_AT;

  return (
    <li
      style={{ '--p': progress, zIndex: active ? 10 : undefined } as CSSProperties}
      className={`lane group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-xl px-2 py-1 transition-all duration-300 ease-premium wide:flex wide:flex-1 wide:gap-x-0 ${
        active ? 'bg-white/70 shadow-card' : row.reachedGoal ? 'bg-gold-soft/70' : 'hover:bg-white/40'
      }`}
    >
      <RankBadge rank={rank} className="relative z-[1] size-9 text-xl wide:size-[3.25rem] wide:text-[1.75rem]" />

      {/* Cabeçalho da raia em telas menores. */}
      <p className="min-w-0 font-display text-xl leading-tight font-semibold text-ink wide:hidden">
        {seller.name}
        <TeamTag team={row.team} className="ml-1.5 text-sm" />
      </p>
      <div className="relative pr-2 text-right wide:hidden">
        {row.reachedGoal && <GoalStamp className="-top-4 right-1 text-[0.7rem]" />}
        <Stat row={row} />
      </div>

      <div
        className={`relative col-span-full h-[4.25rem] wide:h-full wide:flex-1 ${
          dense ? 'wide:min-h-[3.25rem]' : 'wide:min-h-[4rem]'
        }`}
      >
        {/* Trilho e preenchimento. */}
        <div className="absolute inset-x-0 bottom-2.5 h-3 overflow-hidden rounded-r-full bg-white/70 wide:-left-3 wide:bottom-3 wide:h-3.5">
          <div
            className={`lane-fill size-full rounded-r-full bg-gradient-to-r ${
              'from-brand-bright/70 via-brand to-brand'
            }`}
          />
        </div>

        <div className="absolute top-0 left-0 z-[3] flex max-w-full items-center gap-2 wide:top-1 wide:left-3">
          <p
            className={`hidden font-display leading-tight font-semibold whitespace-nowrap text-ink wide:block ${
              dense ? 'text-[1.6rem]' : 'text-[1.9rem]'
            }`}
          >
            {seller.name}
            <TeamTag team={row.team} className="ml-2 text-[1.05rem]" />
          </p>
          <GoalChip row={row} active={active} />
        </div>

        {/* O grupo inteiro se desloca por transform, na largura da pista. */}
        <div className="lane-runner pointer-events-none absolute inset-0 z-[2]">
          <span aria-hidden="true" className="absolute bottom-7 -left-[5.25rem] flex gap-2 wide:-left-[6.75rem]">
            <i className="dust block size-2.5 rounded-full bg-[#D8B6A6]" />
            <i className="dust block size-2 rounded-full bg-[#D8B6A6] [animation-delay:300ms]" />
          </span>
          <div
            className={`absolute bottom-1 -left-[4rem] h-[4.25rem] w-[4rem] origin-bottom transition-all duration-300 ease-premium group-hover:scale-110 wide:-left-[5.25rem] wide:w-[5.25rem] ${
              dense ? 'wide:h-[4.5rem]' : 'wide:h-[5.5rem]'
            }`}
          >
            {/* Quem bateu a meta ganha brilho dourado e coroa. */}
            {row.reachedGoal && (
              <span
                aria-hidden="true"
                className="absolute -inset-x-[30%] -top-[5%] -bottom-[15%] rounded-full bg-[radial-gradient(closest-side,rgb(255_198_41/0.75),rgb(255_198_41/0.3)_55%,transparent)]"
              />
            )}
            {/* Todos os personagens 10% maiores na tela larga; no celular, o tamanho normal não cobre o texto. */}
            <div data-lane-sprite className="relative size-full origin-bottom wide:scale-110">
              {seller.sprite ? (
                <SpriteRunner sprite={seller.sprite} crown={row.reachedGoal} />
              ) : (
                <Mascot look={seller.look} crown={row.reachedGoal} className="size-full" />
              )}
            </div>
          </div>
        </div>

        {/* Valor numa camada própria, acima de todos os personagens: o da raia de baixo não cobre o texto. */}
        <div className="lane-runner pointer-events-none absolute inset-0 z-[3]">
          <div
            data-lane-label
            className={`absolute top-0 hidden rounded-lg px-2 py-0.5 wide:block ${
              row.reachedGoal ? 'bg-white shadow-card' : 'bg-white/95'
            } ${
              flipLabel ? 'left-0 -translate-x-[calc(100%+6rem)]' : 'left-2'
            }`}
          >
            {row.reachedGoal && (
              // Quem bateu a meta está na chegada, com o valor à esquerda; o selo fica do lado livre.
              <GoalStamp
                className={`top-1/2 right-full mr-2 -translate-y-1/2 ${dense ? 'text-[0.95rem]' : 'text-[1.15rem]'}`}
              />
            )}
            <Stat row={row} compact={dense} />
          </div>
        </div>
      </div>

      {/* Cobre a raia inteira: um único alvo para hover, toque e teclado. */}
      <button
        type="button"
        aria-pressed={highlight.pinnedId === seller.id}
        aria-label={`${rank}º lugar, ${seller.name}: ${formatCurrency(row.amount)}${
          row.attainment !== null ? `, ${formatGoalStatus(row.attainment)}` : ''
        }${row.reachedGoal ? ', meta batida' : ''}. ${row.note}.`}
        {...highlight.bind(seller.id)}
        className="absolute inset-0 z-[4] cursor-pointer rounded-xl outline-none transition-all duration-300 ease-premium focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-brand"
      />
    </li>
  );
}
