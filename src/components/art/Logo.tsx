const RAY_ANGLES = [-72, -48, -24, 0, 24, 48, 72];

/** Marca Catarinna's Energia Solar, redesenhada em vetor. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg role="img" aria-label="Catarinna's Energia Solar" viewBox="0 0 220 124" className={className}>
      <defs>
        <linearGradient id="logo-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD84D" />
          <stop offset="1" stopColor="#FFAF1A" />
        </linearGradient>
      </defs>
      <g transform="translate(110 46)">
        {RAY_ANGLES.map((angle) => (
          <rect
            key={angle}
            x="-2.5"
            y="-44"
            width="5"
            height="17"
            rx="2.5"
            fill="#FFC629"
            transform={`rotate(${angle})`}
          />
        ))}
        <path d="M-22 0A22 22 0 0 1 22 0Z" fill="url(#logo-sun)" />
      </g>
      <text
        x="110"
        y="86"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="50"
        textLength="206"
        lengthAdjust="spacingAndGlyphs"
        fill="#FFF"
      >
        Catarinna&rsquo;s
      </text>
      <rect x="7" y="94" width="206" height="2" fill="#FFF" />
      <text
        x="110"
        y="115"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontWeight="600"
        fontSize="15"
        letterSpacing="2.4"
        fill="#FFF"
      >
        ENERGIA SOLAR
      </text>
    </svg>
  );
}
