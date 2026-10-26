import React from 'react';
import { cn } from '../../design-system/utils/cn';

export interface DotProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  active?: boolean;
}

export const Dot: React.FC<DotProps> = ({ active, ...props }) => (
  <button
    type="button"
    aria-pressed={active}
    className={cn(
      'h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
      active ? 'w-6 bg-orange-600' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
    )}
    {...props}
  />
);

Dot.displayName = 'Dot';

export default Dot;
