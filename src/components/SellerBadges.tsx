const RANK_TONES: Record<number, string> = {
  1: 'from-[#FFE27A] to-[#F6B20F]',
  2: 'from-[#EEF1F7] to-[#C3CBDA]',
  3: 'from-[#FBC8A0] to-[#E2914F]',
};
const DEFAULT_TONE = 'from-[#EEF1F7] to-[#D5DBE7]';

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className = '' }: RankBadgeProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b font-display font-bold text-ink shadow-[inset_0_0_0_2px_rgb(255_255_255/0.75),0_1px_3px_rgb(31_26_46/0.25)] ${RANK_TONES[rank] ?? DEFAULT_TONE} ${className}`}
    >
      {rank}
    </span>
  );
}
