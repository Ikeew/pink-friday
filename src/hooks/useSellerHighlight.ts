import { useCallback, useMemo, useState, type FocusEvent } from 'react';

/**
 * Destaque compartilhado entre a pista e o ranking.
 * Hover e foco por teclado destacam temporariamente; o clique fixa o destaque,
 * o que também torna o recurso utilizável em telas de toque.
 */
export function useSellerHighlight() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const bind = useCallback(
    (id: string) => ({
      onMouseEnter: () => setHoveredId(id),
      onMouseLeave: () => setHoveredId(null),
      onFocus: (event: FocusEvent<HTMLElement>) => {
        if (event.currentTarget.matches(':focus-visible')) setHoveredId(id);
      },
      onBlur: () => setHoveredId(null),
      onClick: () => setPinnedId((current) => (current === id ? null : id)),
    }),
    [],
  );

  return useMemo(
    () => ({ activeId: hoveredId ?? pinnedId, pinnedId, bind }),
    [hoveredId, pinnedId, bind],
  );
}

export type SellerHighlight = ReturnType<typeof useSellerHighlight>;
