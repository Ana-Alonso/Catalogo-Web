import React from 'react';
import { cn } from '../../design-system/utils/cn';

const CHIP_TONE = {
  solid: {
    base: 'inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
    active: 'bg-orange-600 text-white shadow-md shadow-orange-600/30',
    idle: 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800',
  },
  accent: {
    base: 'inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
    active: 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/30',
    idle: 'bg-neutral-900 border-orange-600/60 text-orange-400 hover:bg-orange-600/10',
  },
  text: {
    base: 'group inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
    active: 'text-orange-500',
    idle: 'text-neutral-400 hover:text-white',
  },
} as const;

export type ChipTone = keyof typeof CHIP_TONE;

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ChipTone;
  active?: boolean;
  count?: number;
}

const countStyles = {
  active: 'bg-neutral-950/40 text-white',
  idle: 'bg-orange-600/20 text-orange-300',
} as const;

export const Chip: React.FC<ChipProps> = ({
  tone = 'solid',
  active = false,
  count,
  className,
  children,
  ...props
}) => {
  const recipe = CHIP_TONE[tone];
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(recipe.base, active ? recipe.active : recipe.idle, className)}
      {...props}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'min-w-5 rounded-full px-1.5 py-0.5 text-[10px] leading-none',
            active ? countStyles.active : countStyles.idle
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default Chip;
