import { Trophy } from 'lucide-react';
import { useState } from 'react';
import { formatNumber } from '../lib/format';
import type { RankingRow } from '../types';
import { Panel } from './Panel';
import { RankBadge } from './SellerBadges';

const VIEWS = [
  { id: 'teams', label: 'Equipes', caption: 'Ranking de equipes por valor vendido no ciclo' },
  { id: 'sdrs', label: 'SDRs', caption: 'Ranking de SDRs por valor vendido no ciclo' },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

interface RankingPanelProps {
  teams: RankingRow[];
  sdrs: RankingRow[];
  loaded: boolean;
}

export function RankingPanel({ teams, sdrs, loaded }: RankingPanelProps) {
  const [viewId, setViewId] = useState<ViewId>('teams');
  const rows = viewId === 'teams' ? teams : sdrs;
  const caption = VIEWS.find((view) => view.id === viewId)?.caption;

  return (
    <Panel title="Ranking geral" icon={Trophy}>
      <div className="px-2 pt-1.5 pb-2">
        <div className="flex items-center justify-between gap-2 pr-3 pb-0.5">
          <div role="group" aria-label="Tipo de ranking" className="flex rounded-full bg-canvas p-0.5">
            {VIEWS.map((view) => {
              const active = view.id === viewId;
              return (
                <button
                  key={view.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setViewId(view.id)}
                  className={`min-h-6 cursor-pointer rounded-full px-2.5 font-display text-sm font-semibold transition-all duration-300 ease-premium outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand ${
                    active ? 'bg-brand text-white shadow-card' : 'text-ink-soft hover:bg-white hover:text-ink'
                  }`}
                >
                  {view.label}
                </button>
              );
            })}
          </div>
          <span aria-hidden="true" className="font-display text-xs font-semibold tracking-wide whitespace-nowrap text-ink-soft uppercase">
            Vendas (R$)
          </span>
        </div>

        <div className="min-h-[11.5rem]">
          {rows.length > 0 ? (
            <table className="w-full table-fixed border-separate border-spacing-y-0.5 font-display">
              <caption className="sr-only">{caption}</caption>
              <colgroup>
                <col className="w-9" />
                <col />
                <col className="w-[5.5rem]" />
              </colgroup>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Posição</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Vendas em reais</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const background = row.rank === 1 ? 'bg-gold-soft' : 'group-hover:bg-canvas';
                  const cell = `py-0.5 transition-all duration-300 ease-premium ${background}`;

                  return (
                    <tr key={row.id} className="group">
                      <td className={`rounded-l-full pl-1.5 ${cell}`}>
                        <RankBadge rank={row.rank} className="size-7 text-base" />
                      </td>
                      <td className={`pl-1 ${cell}`}>
                        <span className="block truncate text-[1.4rem] leading-tight font-semibold text-ink" title={row.name}>
                          {row.name}
                        </span>
                      </td>
                      <td className={`rounded-r-full pr-3 text-right text-[1.4rem] leading-tight font-semibold text-ink ${cell}`}>
                        {formatNumber(row.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-3 py-6 text-center font-display text-base font-medium text-ink-soft">
              {loaded ? 'Sem vendas neste período.' : '—'}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}
