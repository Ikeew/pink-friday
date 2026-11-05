import { describe, expect, it } from 'vitest';
import { parseBrl, todayInSaoPaulo } from '../../server/groner';
import type { Cycle, DashboardData } from '../types';
import { formatPeriod } from './format';
import { buildCycleView } from './metrics';
import { shortName, titleCase } from './people';

const cycle: Cycle = { id: 'c', label: 'Ciclo', start: '2026-10-10', end: '2026-10-20', target: 2_000_000 };

const sale = (name: string, amount: number, count = 2) => ({ name, amount, count, team: 'EQUIPE' });

const data: DashboardData = {
  sellers: [
    sale('ANA', 400_000),
    sale('BIA', 300_000),
    sale('CAIO', 200_000),
    sale('DANI', 50_000),
    sale('EDU', 30_000),
    sale('FABI', 20_000),
  ],
  teams: [{ name: 'EQUIPE ELITE ', amount: 700_000 }],
  sdrs: [{ name: 'CAMILA LOPES', amount: 100_000 }],
  averageTicket: 18_000,
  salesToday: 4,
  fetchedAt: '2026-11-05T12:00:00.000Z',
};

describe('buildCycleView', () => {
  it('soma todos os vendedores, mas só o Top 5 corre na pista', () => {
    const view = buildCycleView(cycle, data);

    expect(view.realized).toBe(1_000_000);
    expect(view.remaining).toBe(1_000_000);
    expect(view.attainment).toBe(0.5);
    expect(view.salesCount).toBe(12);
    expect(view.rows).toHaveLength(5);
    expect(view.rows[0]?.share).toBe(0.4);
  });

  it('sem meta individual, posiciona a pista em proporção ao líder', () => {
    const view = buildCycleView(cycle, data);

    expect(view.rows[0]?.progress).toBeCloseTo(0.75);
    expect(view.rows[1]?.progress).toBeCloseTo(0.5625);
    expect(view.rows[0]?.note).toContain('Líder');
  });

  it('com meta individual, a linha de chegada é a meta', () => {
    const view = buildCycleView({ ...cycle, sellerTarget: 400_000 }, data);

    expect(view.rows[0]?.progress).toBe(1);
    expect(view.rows[1]?.progress).toBe(0.75);
    expect(view.rows[1]?.note).toContain('75% da meta');
  });

  it('não quebra sem dados nem divide por zero', () => {
    const view = buildCycleView(cycle, null);

    expect(view.realized).toBe(0);
    expect(view.rows).toEqual([]);
    expect(buildCycleView({ ...cycle, target: 0 }, null).attainment).toBe(0);
  });
});

describe('nomes', () => {
  it('encurta nomes completos em maiúsculas', () => {
    expect(shortName('GABRIEL MORELI MACHADO OLIVEIRA')).toBe('Gabriel Moreli');
    expect(shortName('MARIA DA SILVA')).toBe('Maria Silva');
    expect(shortName('RHUAN PEREIRA ')).toBe('Rhuan Pereira');
    expect(titleCase('EQUIPE ÁGUIA')).toBe('Equipe Águia');
  });
});

describe('servidor', () => {
  it('converte o valor em texto das SDRs', () => {
    expect(parseBrl('R$ 1.116.480,50')).toBe(1_116_480.5);
    expect(parseBrl(null)).toBe(0);
  });

  it('calcula "hoje" no fuso de São Paulo', () => {
    expect(todayInSaoPaulo(new Date('2026-11-06T01:30:00Z'))).toBe('2026-11-05');
  });
});

describe('formatPeriod', () => {
  it('formata o período como na referência', () => {
    expect(formatPeriod('2026-10-10', '2026-10-20')).toBe('10 OUT – 20 OUT 2026');
  });
});
