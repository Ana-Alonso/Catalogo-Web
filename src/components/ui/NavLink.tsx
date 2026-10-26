import React from 'react';
import { Link } from 'react-router';
import { cn } from '../../design-system/utils/cn';

const NAV_LINK_TONE = {
  topBar: {
    base: 'text-sm font-medium tracking-wide uppercase px-3 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
    active: 'text-orange-500 font-semibold',
    idle: 'text-neutral-300 hover:text-white',
  },
  mobile: {
    base: 'block px-3 py-3 text-base font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
    active: 'text-orange-500 bg-neutral-800/80 font-semibold',
    idle: 'text-neutral-300 hover:text-white hover:bg-neutral-800',
  },
  skip: {
    base: 'sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:p-4 focus:bg-orange-600 focus:text-white focus:top-4 focus:left-4 rounded-md shadow-lg',
    active: '',
    idle: '',
  },
  pill: {
    base: 'inline-flex min-w-8 items-center justify-center rounded-md px-2 py-1 text-xs font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
    active: 'bg-orange-600 text-white',
    idle: 'text-neutral-400 hover:text-white',
  },
  cta: {
    base: 'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
    active: '',
    idle: '',
  },
} as const;

export type NavLinkVariant = keyof typeof NAV_LINK_TONE;

interface NavLinkOwnProps {
  variant?: NavLinkVariant;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  'aria-current'?: 'page' | 'date' | 'time' | 'true' | false;
  lang?: string;
  'aria-label'?: string;
  hrefLang?: string;
  className?: string;
  children?: React.ReactNode;
}

export type NavLinkProps = NavLinkOwnProps &
  ({ href: string; to?: undefined } | { to: string; href?: undefined });

export const NavLink: React.FC<NavLinkProps> = ({
  variant = 'topBar',
  active = false,
  onClick,
  className,
  children,
  ...rest
}) => {
  const recipe = NAV_LINK_TONE[variant];
  const classes = cn(recipe.base, active ? recipe.active : recipe.idle, className);

  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} onClick={onClick} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={rest.href} onClick={onClick} className={classes} {...rest}>
      {children}
    </a>
  );
};

export default NavLink;
