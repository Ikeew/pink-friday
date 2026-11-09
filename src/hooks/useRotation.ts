import { useCallback, useEffect, useState } from 'react';

/**
 * Reveza entre `count` telas a cada `intervalMs`, voltando à primeira depois da última.
 * Escolher uma tela manualmente reinicia a contagem a partir dela.
 */
export function useRotation(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  // Contador de seleções: muda a cada troca, mesmo quando o índice se repete.
  const [turn, setTurn] = useState(0);
  // Se o número de telas diminuir (dados novos), continua numa tela válida.
  const current = count > 0 ? index % count : 0;

  useEffect(() => {
    if (count < 2) return;
    const timer = setTimeout(() => {
      setIndex((current + 1) % count);
      setTurn((value) => value + 1);
    }, intervalMs);
    return () => clearTimeout(timer);
  }, [current, count, intervalMs, turn]);

  const select = useCallback((next: number) => {
    setIndex(next);
    setTurn((value) => value + 1);
  }, []);

  return { index: current, turn, select };
}
