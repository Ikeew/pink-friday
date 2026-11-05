import { Crystal } from './Crystal';

const svgClass = 'pointer-events-none absolute inset-0 h-full w-full';

function Mountains({ idPrefix }: { idPrefix: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${idPrefix}-far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B7C6DE" />
          <stop offset="1" stopColor="#E7ECF5" />
        </linearGradient>
      </defs>
      <path
        d="M0 170 L120 96 L210 140 L340 62 L470 138 L600 84 L720 142 L860 70 L1000 136 L1130 86 L1270 146 L1420 76 L1600 150 V260 H0Z"
        fill={`url(#${idPrefix}-far)`}
      />
      <path
        d="M340 62 L306 82 L330 78 L346 94 L364 80 L382 86Z M860 70 L826 90 L850 86 L866 100 L884 86 L904 94Z M1420 76 L1386 94 L1410 92 L1428 106 L1446 90 L1468 98Z M120 96 L92 113 L114 110 L128 120 L144 108Z M600 84 L574 99 L596 97 L610 108 L628 100Z M1130 86 L1102 102 L1124 100 L1138 110 L1156 100Z"
        fill="#FFFFFF"
      />
    </>
  );
}

/** Paisagem de fundo do cabeçalho. */
export function HeroScenery() {
  return (
    <svg
      aria-hidden="true"
      className={svgClass}
      viewBox="0 0 1600 300"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9CBF0" />
          <stop offset="0.55" stopColor="#E4EEF9" />
          <stop offset="1" stopColor="#F9EDF1" />
        </linearGradient>
        <linearGradient id="hero-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E4DF" />
          <stop offset="1" stopColor="#EAF0F9" />
        </linearGradient>
        <filter id="hero-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="hero-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <rect width="1600" height="300" fill="url(#hero-sky)" />
      <g filter="url(#hero-soft)" fill="#FFFFFF" opacity="0.9">
        <ellipse cx="520" cy="46" rx="170" ry="26" />
        <ellipse cx="1120" cy="34" rx="210" ry="24" />
        <ellipse cx="1420" cy="70" rx="130" ry="18" />
      </g>
      <g filter="url(#hero-blur)">
        <Mountains idPrefix="hero" />
      </g>
      <path
        d="M0 214 C260 186 470 226 760 204 C1040 184 1300 226 1600 196 V300 H0Z"
        fill="url(#hero-ground)"
      />
      <g filter="url(#hero-blur)">
        <Crystal x={620} y={258} scale={0.75} opacity={0.6} />
        <Crystal x={1050} y={262} scale={0.85} opacity={0.65} />
        <ellipse cx="1400" cy="276" rx="130" ry="20" fill="#B9AEA6" opacity="0.55" />
      </g>
      <Crystal x={1362} y={268} scale={0.7} />
    </svg>
  );
}

/** Pista em perspectiva suave, atrás das raias da corrida. */
export function RaceScenery() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FBF1F3] to-[#F9E3EC]"
    >
      {/* Céu com altura fixa, para não invadir as raias em telas estreitas. */}
      <svg
        className="absolute inset-x-0 top-0 h-16 w-full"
        viewBox="0 0 1000 90"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="race-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CFE0F4" />
            <stop offset="1" stopColor="#F4F2F8" />
          </linearGradient>
          <filter id="race-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <rect width="1000" height="90" fill="url(#race-sky)" />
        <g filter="url(#race-blur)" transform="scale(0.625 0.42)">
          <Mountains idPrefix="race" />
        </g>
        <path d="M0 74 C240 58 520 84 1000 62 V90 H0Z" fill="#FBF1F3" />
      </svg>
    </div>
  );
}
