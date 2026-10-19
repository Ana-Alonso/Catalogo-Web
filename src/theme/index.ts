export const theme = {
  colors: {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white',
    primaryText: 'text-orange-600',
    primaryBorder: 'border-orange-600',
    primaryFocus: 'focus-visible:ring-orange-600',
    primaryBadge: 'bg-orange-600/20 text-orange-400 border border-orange-500/30',
    background: 'bg-neutral-950',
    surface: 'bg-neutral-900',
    surfaceSubtle: 'bg-neutral-950/60',
    border: 'border-neutral-800',
    borderSubtle: 'border-neutral-800/60',
    textMain: 'text-white',
    textMuted: 'text-neutral-400',
    textSubtle: 'text-neutral-500',
  },
  inputs: {
    base: 'w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-600 text-sm transition-colors',
    label: 'block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2',
  },
  card: {
    base: 'bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden',
  },
} as const;

export type Theme = typeof theme;
