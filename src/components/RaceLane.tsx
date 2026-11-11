import type { CSSProperties } from 'react';
import type { SellerHighlight } from '../hooks/useSellerHighlight';
import { formatCurrency, formatGoalStatus, goalStatusParts } from '../lib/format';
import type { LaneRow, Sprite } from '../types';
import { CrownBadge, Mascot } from './art/Mascot';
import { RankBadge } from './SellerBadges';

/** Acima deste avanço não há espaço à direita do corredor, e o valor passa para a esquerda. */
const FLIP_LABEL_AT = 0.6;

/** Rosa bem claro da linha de progresso de quem está no começo da meta. */
const PROGRESS_START = '#f9c6dd';

/**
 * Cor da linha de progresso. Quem bateu a meta: bordô. Quem não bateu: proporcional
 * ao atingimento, do rosa bem claro (0%) ao rosa-escuro (perto de 100%).
 * Sem meta, rosa-escuro.
 */
function progressColor(row: LaneRow) {
  if (row.reachedGoal) return 'var(--color-bordo)';
  if (row.attainment === null) return 'var(--color-brand-deep)';
  const percent = Math.round(Math.min(1, Math.max(0, row.attainment)) * 100);
  return `color-mix(in oklab, var(--color-brand-deep) ${percent}%, ${PROGRESS_START})`;
}

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
      data-lane-body
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
      </p>
      <Stat row={row} className="pr-2 text-right wide:hidden" />

      <div
        data-lane-track
        className={`relative col-span-full h-[4.25rem] wide:h-full wide:flex-1 ${
          dense ? 'wide:min-h-[3.25rem]' : 'wide:min-h-[4rem]'
        }`}
      >
        {/* Trilho e preenchimento. */}
        <div className="absolute inset-x-0 bottom-2.5 h-3 overflow-hidden rounded-r-full bg-white/70 wide:-left-3 wide:bottom-3 wide:h-3.5">
          <div className="lane-fill size-full rounded-r-full" style={{ backgroundColor: progressColor(row) }} />
        </div>

        <div className="absolute top-0 left-0 z-[3] flex max-w-full items-center gap-2 wide:top-1 wide:left-3">
          <p
            data-lane-name
            className={`hidden font-display leading-tight font-semibold whitespace-nowrap text-ink wide:block ${
              dense ? 'text-[1.6rem]' : 'text-[1.9rem]'
            }`}
          >
            {seller.name}
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
            className={`absolute top-0 hidden rounded-lg border-2 bg-white px-2 py-0.5 wide:block ${
              // Contorno rosa-escuro só em quem bateu a meta; nos demais a borda é invisível, para o tamanho não mudar.
              row.reachedGoal ? 'border-brand-deep' : 'border-transparent'
            } ${
              flipLabel ? 'left-0 -translate-x-[calc(100%+6rem)]' : 'left-2'
            }`}
          >
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
