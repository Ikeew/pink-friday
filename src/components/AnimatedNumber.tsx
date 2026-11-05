import { useCountUp } from '../hooks/useCountUp';

interface AnimatedNumberProps {
  /** `null` significa dado indisponível: exibe "—" em vez de um zero enganoso. */
  value: number | null;
  format: (value: number) => string;
}

export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const animated = useCountUp(value ?? 0);
  return <>{value === null ? '—' : format(animated)}</>;
}
