import type { CSSProperties } from 'react';
import type { RaceBoardPage } from '../types';

interface BoardPagerProps {
  boards: RaceBoardPage[];
  activeIndex: number;
  /** Muda a cada troca de tela e reinicia a barra de tempo. */
  turn: number;
  intervalMs: number;
  onSelect: (index: number) => void;
}

/** Seletor das telas da pista, com a barra do tempo que falta para a próxima. */
export function BoardPager({ boards, activeIndex, turn, intervalMs, onSelect }: BoardPagerProps) {
  const active = boards[activeIndex];

  return (
    <nav aria-label="Telas da corrida" className="flex flex-wrap items-center gap-1.5">
      {boards.map((board, index) => {
        const current = index === activeIndex;
        return (
          <button
            key={board.id}
            type="button"
            aria-current={current ? 'true' : undefined}
            aria-label={board.title}
            onClick={() => onSelect(index)}
            className={`relative cursor-pointer overflow-hidden rounded-full px-3 py-0.5 font-display text-sm font-semibold whitespace-nowrap uppercase shadow-card outline-none transition-all duration-300 ease-premium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand wide:px-4 wide:text-[1.15rem] ${
              current ? 'bg-plum text-white' : 'bg-white/90 text-ink-soft hover:bg-white hover:text-ink'
            }`}
          >
            {board.label}
            {current && boards.length > 1 && (
              <span
                key={turn}
                aria-hidden="true"
                style={{ '--duration': `${intervalMs}ms` } as CSSProperties}
                className="board-timer absolute inset-x-0 bottom-0 h-[3px] bg-gold"
              />
            )}
          </button>
        );
      })}
      <p aria-live="polite" className="sr-only">
        {active ? `Exibindo: ${active.title}` : ''}
      </p>
    </nav>
  );
}
