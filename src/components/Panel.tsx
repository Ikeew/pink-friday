import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

/** Cartão com faixa de título na cor da marca. */
export function Panel({ title, icon: Icon, children, className = '' }: PanelProps) {
  return (
    <section className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ${className}`}>
      <h2 className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-bright px-5 py-2.5 font-display text-xl font-semibold tracking-wide text-white uppercase">
        {Icon && <Icon aria-hidden="true" className="size-6 text-gold" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
