interface CrystalProps {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
}

/** Rocha facetada rosa, o motivo visual da "quebra de preços". Base centrada em (x, y). */
export function Crystal({ x, y, scale = 1, rotate = 0, opacity = 1 }: CrystalProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      <polygon points="-40,0 -30,-34 -6,-52 8,-20 0,0" fill="#E0247F" />
      <polygon points="-6,-52 22,-44 38,-14 8,-20" fill="#F774B4" />
      <polygon points="8,-20 38,-14 44,0 0,0" fill="#B00A62" />
      <polygon points="-30,-34 -6,-52 8,-20 -14,-16" fill="#F24C9C" />
      <polygon points="-40,0 -30,-34 -14,-16 -18,0" fill="#C4116D" />
    </g>
  );
}
