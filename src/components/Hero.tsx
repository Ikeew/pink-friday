import { CalendarDays } from 'lucide-react';
import { formatPeriod } from '../lib/format';
import type { Cycle, Look } from '../types';
import { Logo } from './art/Logo';
import { Mascot } from './art/Mascot';
import { HeroScenery } from './art/Scenery';
import { TitleLockup } from './art/TitleLockup';

const HOST_LOOKS: Record<'him' | 'her' | 'runner', Look> = {
  him: { skin: '#F2C09A', hair: '#2B1B14', hairStyle: 'short', glasses: true, beard: '#2B1B14' },
  her: { skin: '#F8D2B4', hair: '#D9A65C', hairStyle: 'long' },
  runner: { skin: '#E3A97F', hair: '#2E2826', hairStyle: 'short', beard: '#6F6A68' },
};

const SOLAR_SHIRT = ['SOLAR', 'Experience'] as const;
const FRIDAY_SHIRT = ['PINK', 'FRIDAY'] as const;

export function Hero({ cycle }: { cycle: Cycle }) {
  return (
    <header className="relative overflow-hidden px-4 pt-4 pb-5 md:px-5 panel:p-0">
      <HeroScenery />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-[22rem] w-[34rem] max-w-full bg-[radial-gradient(ellipse_farthest-side_at_top_left,var(--color-brand)_0%,var(--color-brand)_64%,transparent_100%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 120 130"
        className="drift absolute right-[3.5rem] bottom-3 hidden h-[8.5rem] w-[8rem] panel:block"
      >
        <defs>
          <linearGradient id="dollar-facet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F774B4" />
            <stop offset="0.5" stopColor="#E0247F" />
            <stop offset="0.5" stopColor="#C4116D" />
            <stop offset="1" stopColor="#8C0850" />
          </linearGradient>
        </defs>
        <text
          x="60"
          y="112"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontWeight="900"
          fontSize="128"
          fill="url(#dollar-facet)"
          stroke="#8C0850"
          strokeWidth="2"
        >
          $
        </text>
      </svg>

      <div className="hero-grid relative">
        <a
          href="/"
          aria-label="Catarinna's Energia Solar, página inicial"
          style={{ gridArea: 'logo' }}
          className="w-36 justify-self-start rounded-lg transition-all duration-300 ease-premium outline-offset-4 outline-white hover:scale-[1.03] focus-visible:outline-3 md:w-44 panel:mb-[5rem] panel:ml-[2rem] panel:w-[13rem]"
        >
          <Logo className="block w-full" />
        </a>

        <div
          style={{ gridArea: 'crew' }}
          className="hidden items-end justify-center self-end md:flex panel:-mr-[2.5rem] panel:-mb-[1.5rem] panel:justify-end"
        >
          <Mascot look={HOST_LOOKS.him} pose="stand" shirt={SOLAR_SHIRT} className="h-44 w-auto shrink-0 panel:h-[15.5rem]" />
          <Mascot look={HOST_LOOKS.her} pose="stand" shirt={SOLAR_SHIRT} className="-ml-12 hidden h-40 w-auto shrink-0 wide:block panel:-ml-[6rem] panel:h-[14.5rem]" />
        </div>

        <h1 style={{ gridArea: 'title' }} className="mx-auto w-full max-w-[30rem]">
          <span className="sr-only">Corrida da Quebra de Preços Catarinna&apos;s: dashboard de gamificação</span>
          <TitleLockup className="block w-full overflow-visible" />
        </h1>

        <div
          style={{ gridArea: 'runner' }}
          className="hidden justify-center self-end md:flex panel:-mb-[1rem]"
        >
          <Mascot look={HOST_LOOKS.runner} shirt={FRIDAY_SHIRT} className="h-44 w-auto panel:h-[16.5rem]" />
        </div>

        <div
          style={{ gridArea: 'period' }}
          className="flex items-center gap-3 justify-self-end rounded-xl bg-gradient-to-br from-plum-soft to-plum px-3 py-2 text-white shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-card-hover md:px-4 md:py-3 panel:mr-[1.25rem] panel:mb-[12.5rem]"
        >
          <CalendarDays aria-hidden="true" className="size-6 shrink-0 md:size-8" />
          <dl className="font-display text-sm leading-tight font-medium tracking-wide whitespace-nowrap wide:text-lg">
            <dt>PERÍODO DO CICLO</dt>
            <dd>{formatPeriod(cycle.start, cycle.end)}</dd>
          </dl>
        </div>
      </div>
    </header>
  );
}
