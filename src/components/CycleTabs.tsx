import { useRef, type KeyboardEvent } from 'react';
import type { Cycle } from '../types';

function CheckeredFlag({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`hidden size-6 sm:block ${className}`}>
      <path d="M4 2v21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 3h16v12H6z" fill="#fff" />
      <path d="M6 3h4v4H6zM14 3h4v4h-4zM10 7h4v4h-4zM18 7h4v4h-4zM6 11h4v4H6zM14 11h4v4h-4z" fill="#1F1A2E" />
    </svg>
  );
}

interface CycleTabsProps {
  cycles: Cycle[];
  activeId: string;
  panelId: string;
  onSelect: (id: string) => void;
}

/** Abas com o padrão WAI-ARIA: setas, Home e End navegam; só a aba ativa recebe Tab. */
export function CycleTabs({ cycles, activeId, panelId, onSelect }: CycleTabsProps) {
  const refs = useRef(new Map<string, HTMLButtonElement>());

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const last = cycles.length - 1;
    const nextIndex: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = cycles[nextIndex[event.key] ?? -1];
    if (!target) return;

    event.preventDefault();
    onSelect(target.id);
    refs.current.get(target.id)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Ciclos da corrida"
      className="relative z-20 grid grid-cols-3 bg-gradient-to-r from-plum to-plum-soft"
    >
      {cycles.map((cycle, index) => {
        const active = cycle.id === activeId;
        return (
          <button
            key={cycle.id}
            ref={(node) => {
              if (node) refs.current.set(cycle.id, node);
              else refs.current.delete(cycle.id);
            }}
            id={`tab-${cycle.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(cycle.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`group relative flex h-12 cursor-pointer items-center justify-center gap-3 font-display text-white uppercase transition-all duration-300 ease-premium outline-none focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-white md:h-[3.25rem] ${
              active
                ? 'bg-gradient-to-r from-brand to-brand-bright text-2xl font-extrabold italic md:text-[2rem] [clip-path:polygon(4%_0,96%_0,100%_100%,0_100%)]'
                : 'text-lg font-semibold tracking-wide hover:bg-white/15'
            }`}
          >
            {active && <CheckeredFlag className="-scale-x-100" />}
            <span className="transition-all duration-300 ease-premium group-hover:scale-105">
              {cycle.label}
            </span>
            {active && <CheckeredFlag />}
          </button>
        );
      })}
    </div>
  );
}
