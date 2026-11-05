import type { Seller } from '../types';
import { MascotHead } from './art/Mascot';

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

interface AvatarProps {
  seller: Seller;
  className?: string;
}

/** Foto do vendedor quando houver; caso contrário, o rosto do mascote. */
export function Avatar({ seller, className = '' }: AvatarProps) {
  const frame = `shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-[#E8EEF7] to-[#CBD6E6] ring-2 ring-white shadow-[0_1px_3px_rgb(31_26_46/0.3)] ${className}`;

  if (seller.photo) {
    return <img src={seller.photo} alt="" className={`object-cover ${frame}`} />;
  }

  return (
    <svg aria-hidden="true" viewBox="-54 -58 108 108" className={frame}>
      <path d="M-46 60Q-40 36 0 34Q40 36 46 60Z" fill="#E8127F" />
      <MascotHead look={seller.look} />
    </svg>
  );
}
