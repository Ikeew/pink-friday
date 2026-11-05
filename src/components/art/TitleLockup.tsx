import type { ReactNode } from 'react';

const PLUM = '#3D0527';

interface LineProps {
  y: number;
  size: number;
  fill: string;
  children: ReactNode;
}

/** Linha do título com contorno e sombra sólida, à maneira de um letreiro. */
function Line({ y, size, fill, children }: LineProps) {
  const shared = {
    x: 260,
    y,
    fontSize: size,
    textAnchor: 'middle',
    stroke: PLUM,
    strokeLinejoin: 'round',
    paintOrder: 'stroke',
  } as const;

  return (
    <>
      <text {...shared} y={y + 6} fill={PLUM} strokeWidth="13">
        {children}
      </text>
      <text {...shared} fill={fill} strokeWidth="10">
        {children}
      </text>
    </>
  );
}

/** Letreiro "Corrida da Quebra de Preços", com estilhaços de rocha ao fundo. */
export function TitleLockup({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 520 292" className={className}>
      <defs>
        <linearGradient id="title-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE873" />
          <stop offset="0.55" stopColor="#FFC629" />
          <stop offset="1" stopColor="#FF9D0A" />
        </linearGradient>
      </defs>

      <g className="drift" style={{ transformOrigin: '260px 130px' }}>
        <polygon points="70,60 150,10 240,26 330,4 430,44 500,120 458,216 330,240 170,244 42,200 20,118" fill="#B00A62" />
        <polygon points="70,60 150,10 240,26 200,80 96,90" fill="#E0247F" />
        <polygon points="330,4 430,44 408,92 300,70" fill="#F24C9C" />
        <polygon points="500,120 458,216 390,190 420,120" fill="#8C0850" />
        <polygon points="42,200 20,118 90,130 110,190" fill="#8C0850" />
        <polygon points="214,0 238,14 216,28 200,12" fill="#F774B4" />
        <polygon points="470,20 492,30 478,50 460,38" fill="#E0247F" />
        <polygon points="26,44 48,38 52,60 32,66" fill="#F24C9C" />
        <polygon points="506,190 518,206 500,216 492,200" fill="#F774B4" />
        <polygon points="14,226 32,222 34,240 18,244" fill="#E0247F" />
      </g>

      <g
        transform="rotate(-3 260 140)"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="900"
      >
        <Line y={72} size={68} fill="#FFFFFF">CORRIDA DA</Line>
        <Line y={146} size={84} fill="url(#title-gold)">
          QUEBRA<tspan fontSize="48"> DE </tspan>PREÇOS
        </Line>
        <Line y={208} size={64} fill="#FFFFFF">CATARINNA&rsquo;S</Line>

        <polygon points="66,226 462,214 450,262 54,274" fill={PLUM} transform="translate(0 4)" />
        <polygon points="66,226 462,214 450,262 54,274" fill="#FFC629" />
        <text
          x="258"
          y="254"
          fontSize="27"
          fontWeight="800"
          letterSpacing="1.2"
          textAnchor="middle"
          fill={PLUM}
        >
          DASHBOARD DE GAMIFICAÇÃO
        </text>
      </g>
    </svg>
  );
}
