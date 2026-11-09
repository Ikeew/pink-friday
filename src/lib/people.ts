import { profiles, teamSprites } from '../data/dashboard';
import type { Look, Seller } from '../types';

const CONNECTORS = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);
const SKINS = ['#F2C09A', '#F8D2B4', '#EDBB94', '#E9B48C', '#E3A97F', '#C98F68', '#A86F4C'];
const HAIRS = ['#2B1B14', '#1F1A1A', '#5A3522', '#6B3E26', '#3A2A20'];

const capitalize = (word: string) => word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1);

/** "EQUIPE ELITE " vira "Equipe Elite". */
export function titleCase(raw: string) {
  return raw
    .trim()
    .toLocaleLowerCase('pt-BR')
    .split(/\s+/)
    .map((word) => (CONNECTORS.has(word) ? word : capitalize(word)))
    .join(' ');
}

/** "GABRIEL MORELI MACHADO OLIVEIRA" vira "Gabriel Moreli": cabe na raia e continua identificável. */
export function shortName(raw: string) {
  return titleCase(raw)
    .split(' ')
    .filter((word) => !CONNECTORS.has(word))
    .slice(0, 2)
    .join(' ');
}

function hash(text: string) {
  let value = 0;
  for (const char of text) value = (value * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  return value;
}

/** Sempre a mesma aparência para a mesma pessoa, sem deduzir características pelo nome. */
function generatedLook(name: string): Look {
  const seed = hash(name);
  return {
    skin: SKINS[seed % SKINS.length] ?? '#F2C09A',
    hair: HAIRS[(seed >>> 3) % HAIRS.length] ?? '#2B1B14',
    hairStyle: 'short',
    glasses: (seed >>> 6) % 4 === 0,
  };
}

export function toSeller(rawName: string): Seller {
  const name = rawName.trim();
  const profile = profiles[name];
  return {
    id: name,
    name: shortName(name),
    look: profile?.look ?? generatedLook(name),
    sprite: profile?.sprite,
  };
}

/** "EQUIPE ELITE" vira "Elite": o contexto já diz que é uma equipe. */
export function teamName(raw: string) {
  return titleCase(raw).replace(/^Equipe\s+/, '');
}

/** Equipe como corredor da pista, com a figurinha do time. */
export function toTeamRunner(rawName: string): Seller {
  const name = rawName.trim();
  return { id: `equipe:${name}`, name: teamName(name), look: generatedLook(name), sprite: teamSprites[name] };
}

/** SDR como corredor da pista; ainda sem figurinha, usa o mascote vetorial. */
export function toSdrRunner(rawName: string): Seller {
  const name = rawName.trim();
  return { id: `sdr:${name}`, name: shortName(name), look: generatedLook(name) };
}
