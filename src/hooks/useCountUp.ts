import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Anima um número do valor atual até `target`, respeitando prefers-reduced-motion. */
export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  const current = useRef(value);

  useEffect(() => {
    const commit = (next: number) => {
      current.current = next;
      setValue(next);
    };

    if (prefersReducedMotion()) {
      commit(target);
      return;
    }

    const origin = current.current;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      commit(origin + (target - origin) * easeOutCubic(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
