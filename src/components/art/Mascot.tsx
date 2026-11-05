import { memo } from 'react';
import type { Look } from '../../types';

const PANTS = '#27304A';
const SHOE = '#3A1230';
const SHIRT = '#E8127F';
const SHIRT_SHADE = '#C40A68';
const WOOD = '#8A4B24';
const LIMB_ORIGIN = { transformOrigin: '106px 146px' };
const ARM_ORIGIN = { transformOrigin: '124px 112px' };

/** Cabeça do personagem, centrada em (0, 0). Compartilhada entre mascote e avatar. */
export function MascotHead({ look }: { look: Look }) {
  const { skin, hair, hairStyle, glasses, beard, stubble } = look;

  return (
    <g>
      {hairStyle === 'long' && (
        <path
          d="M-38-8C-42-56 42-56 38-8C42 18 50 44 38 66L18 50H-18L-38 66C-50 44-42 18-38-8Z"
          fill={hair}
        />
      )}
      <circle cx="-34" cy="4" r="6" fill={skin} />
      <circle cx="34" cy="4" r="6" fill={skin} />
      <ellipse cx="0" cy="2" rx="34" ry="38" fill={skin} />
      {beard && (
        <path
          d="M-34 2C-36 30-18 42 0 42C18 42 36 30 34 2C30 10 24 12 18 11C8 8-8 8-18 11C-24 12-30 10-34 2Z"
          fill={beard}
          opacity={stubble ? 0.32 : 1}
        />
      )}
      {hairStyle === 'short' ? (
        <path
          d="M-35-4C-40-30-28-48 0-48C28-48 40-30 35-4C32-16 26-24 14-26C0-22-20-24-28-18C-32-14-34-10-35-4Z"
          fill={hair}
        />
      ) : (
        <path d="M-35-4C-36-44 36-46 35-4C28-20 16-30 4-32C-2-20-22-14-35-4Z" fill={hair} />
      )}
      <path d="M-21-15Q-13-20-6-15M6-15Q13-20 21-15" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="-13" cy="-3" rx="7.5" ry="8.5" fill="#FFF" />
      <ellipse cx="13" cy="-3" rx="7.5" ry="8.5" fill="#FFF" />
      <ellipse cx="-12" cy="-2.5" rx="4.6" ry="5.4" fill="#2A1A12" />
      <ellipse cx="14" cy="-2.5" rx="4.6" ry="5.4" fill="#2A1A12" />
      <circle cx="-10.5" cy="-5" r="1.6" fill="#FFF" />
      <circle cx="15.5" cy="-5" r="1.6" fill="#FFF" />
      {!beard && (
        <>
          <ellipse cx="-22" cy="12" rx="6" ry="4" fill="#FF7FA8" opacity="0.4" />
          <ellipse cx="22" cy="12" rx="6" ry="4" fill="#FF7FA8" opacity="0.4" />
        </>
      )}
      <path d="M0 4Q4 9-1 11" fill="none" stroke="#7A3C1E" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      <path d="M-13 16Q0 34 13 16Q0 20-13 16Z" fill="#7A1A2C" />
      <path d="M-10.5 17.5Q0 21 10.5 17.5L9 21Q0 24-9 21Z" fill="#FFF" />
      {glasses && (
        <g fill="#FFFFFF" fillOpacity="0.12" stroke="#16131C" strokeWidth="2.6">
          <rect x="-24" y="-13" width="21" height="18" rx="6" />
          <rect x="3" y="-13" width="21" height="18" rx="6" />
          <path d="M-3-6H3" fill="none" />
        </g>
      )}
    </g>
  );
}

function Hammer() {
  return (
    <g>
      <path d="M100 128L42 50" stroke={WOOD} strokeWidth="8" strokeLinecap="round" />
      <g transform="translate(40 46) rotate(-37)">
        <polygon points="-26,-20 22,-20 28,-6 -28,-6" fill="#F774B4" />
        <polygon points="-28,-6 28,-6 26,20 -24,20" fill="#E0247F" />
        <polygon points="6,-6 28,-6 26,20 2,20" fill="#B00A62" />
        <polygon points="-12,-20 6,-20 -2,-6 -18,-6" fill="#FFA6D2" />
      </g>
    </g>
  );
}

function Shoe({ d }: { d: string }) {
  return <path d={d} fill={SHOE} />;
}

function RunningLegs() {
  return (
    <>
      <g className="run-limb-b" style={LIMB_ORIGIN}>
        <path d="M100 146L82 172L60 168" fill="none" stroke={PANTS} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
        <Shoe d="M56 156Q44 158 42 172Q42 184 50 186Q58 180 62 172Z" />
      </g>
      <g className="run-limb-a" style={LIMB_ORIGIN}>
        <path d="M110 146L128 170L112 194" fill="none" stroke={PANTS} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        <Shoe d="M102 192Q116 186 130 192Q142 196 144 206H102Q98 200 102 192Z" />
      </g>
    </>
  );
}

function StandingLegs() {
  return (
    <>
      <path d="M94 150L90 194" stroke={PANTS} strokeWidth="19" strokeLinecap="round" />
      <path d="M118 150L122 194" stroke={PANTS} strokeWidth="19" strokeLinecap="round" />
      <Shoe d="M78 196Q90 190 100 196L100 206H70Q70 200 78 196Z" />
      <Shoe d="M112 196Q124 190 134 196Q142 200 142 206H112Z" />
    </>
  );
}

interface MascotProps {
  look: Look;
  pose?: 'run' | 'stand';
  /** Estampa da camiseta; só vale em tamanhos maiores, onde o texto é legível. */
  shirt?: readonly [string, string];
  className?: string;
}

/** Personagem vetorial com marreta. A pose `run` tem animação contínua de corrida. */
export const Mascot = memo(function Mascot({ look, pose = 'run', shirt, className }: MascotProps) {
  const running = pose === 'run';

  return (
    <svg aria-hidden="true" viewBox="0 0 200 210" className={className}>
      <g className={running ? 'run-body' : undefined}>
        <g className={running ? 'run-limb-a' : undefined} style={ARM_ORIGIN}>
          <path d="M124 112Q146 120 152 102" fill="none" stroke={look.skin} strokeWidth="11" strokeLinecap="round" />
          <path d="M124 112Q134 117 140 116" fill="none" stroke={SHIRT_SHADE} strokeWidth="14" strokeLinecap="round" />
        </g>
        {running ? <RunningLegs /> : <StandingLegs />}
        <Hammer />
        <path d="M84 104Q104 94 128 104Q134 128 128 152Q104 160 84 152Q78 128 84 104Z" fill={SHIRT} />
        <path d="M118 100Q124 102 128 104Q134 128 128 152Q122 155 116 156Q124 128 118 100Z" fill={SHIRT_SHADE} />
        {shirt && (
          <g fontFamily="var(--font-display)" fontStyle="italic" fontWeight="800" textAnchor="middle">
            <text x="108" y="132" fontSize="12" fill="#FFC629">{shirt[0]}</text>
            <text x="108" y="143" fontSize="9.5" fill="#FFFFFF">{shirt[1]}</text>
          </g>
        )}
        <path d="M94 112Q78 122 72 100" fill="none" stroke={look.skin} strokeWidth="11" strokeLinecap="round" />
        <path d="M94 112Q86 117 82 114" fill="none" stroke={SHIRT} strokeWidth="14" strokeLinecap="round" />
        <circle cx="71" cy="96" r="7.5" fill={look.skin} />
        <g transform="translate(112 62) rotate(4) scale(0.92)">
          <MascotHead look={look} />
        </g>
      </g>
    </svg>
  );
});
