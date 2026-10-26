export const DISPLAY = {
  block: 'block',
  flex: 'flex',
  grid: 'grid',
  inline: 'inline',
  'inline-flex': 'inline-flex',
  'inline-block': 'inline-block',
  none: 'hidden',
} as const;

export const DISPLAY_SM = {
  block: 'sm:block',
  flex: 'sm:flex',
  grid: 'sm:grid',
  inline: 'sm:inline',
  'inline-flex': 'sm:inline-flex',
  'inline-block': 'sm:inline-block',
  none: 'sm:hidden',
} as const;

export type DisplayToken = keyof typeof DISPLAY;

export const PADDING = {
  none: { p: 'p-0', px: 'px-0', py: 'py-0', pt: 'pt-0', pr: 'pr-0', pb: 'pb-0', pl: 'pl-0' },
  xs: { p: 'p-1', px: 'px-1', py: 'py-1', pt: 'pt-1', pr: 'pr-1', pb: 'pb-1', pl: 'pl-1' },
  sm: { p: 'p-2', px: 'px-2', py: 'py-2', pt: 'pt-2', pr: 'pr-2', pb: 'pb-2', pl: 'pl-2' },
  md: { p: 'p-4', px: 'px-4', py: 'py-4', pt: 'pt-4', pr: 'pr-4', pb: 'pb-4', pl: 'pl-4' },
  lg: { p: 'p-6', px: 'px-6', py: 'py-6', pt: 'pt-6', pr: 'pr-6', pb: 'pb-6', pl: 'pl-6' },
  xl: { p: 'p-8', px: 'px-8', py: 'py-8', pt: 'pt-8', pr: 'pr-8', pb: 'pb-8', pl: 'pl-8' },
  '2xl': { p: 'p-10', px: 'px-10', py: 'py-10', pt: 'pt-10', pr: 'pr-10', pb: 'pb-10', pl: 'pl-10' },
  '3xl': { p: 'p-12', px: 'px-12', py: 'py-12', pt: 'pt-12', pr: 'pr-12', pb: 'pb-12', pl: 'pl-12' },
  nav: { p: 'p-20', px: 'px-20', py: 'py-20', pt: 'pt-20', pr: 'pr-20', pb: 'pb-20', pl: 'pl-20' },
  tight: { p: 'p-3', px: 'px-3', py: 'py-3', pt: 'pt-3', pr: 'pr-3', pb: 'pb-3', pl: 'pl-3' },
} as const;

export const PADDING_SM = {
  lg: 'sm:p-6',
  xl: 'sm:p-8',
} as const;

export type PaddingToken = keyof typeof PADDING;

export const MARGIN = {
  none: { m: 'm-0', mx: 'mx-0', my: 'my-0', mt: 'mt-0', mb: 'mb-0', ml: 'ml-0', mr: 'mr-0' },
  xs: { m: 'm-1', mx: 'mx-1', my: 'my-1', mt: 'mt-1', mb: 'mb-1', ml: 'ml-1', mr: 'mr-1' },
  sm: { m: 'm-2', mx: 'mx-2', my: 'my-2', mt: 'mt-2', mb: 'mb-2', ml: 'ml-2', mr: 'mr-2' },
  tight: { m: 'm-3', mx: 'mx-3', my: 'my-3', mt: 'mt-3', mb: 'mb-3', ml: 'ml-3', mr: 'mr-3' },
  md: { m: 'm-4', mx: 'mx-4', my: 'my-4', mt: 'mt-4', mb: 'mb-4', ml: 'ml-4', mr: 'mr-4' },
  lg: { m: 'm-6', mx: 'mx-6', my: 'my-6', mt: 'mt-6', mb: 'mb-6', ml: 'ml-6', mr: 'mr-6' },
  xl: { m: 'm-8', mx: 'mx-8', my: 'my-8', mt: 'mt-8', mb: 'mb-8', ml: 'ml-8', mr: 'mr-8' },
  '2xl': { m: 'm-10', mx: 'mx-10', my: 'my-10', mt: 'mt-10', mb: 'mb-10', ml: 'ml-10', mr: 'mr-10' },
  '3xl': { m: 'm-12', mx: 'mx-12', my: 'my-12', mt: 'mt-12', mb: 'mb-12', ml: 'ml-12', mr: 'mr-12' },
  auto: { m: '', mx: 'mx-auto', my: 'my-auto', mt: 'mt-auto', mb: 'mb-auto', ml: 'ml-auto', mr: 'mr-auto' },
  'auto-start-lg': { m: '', mx: 'mx-auto lg:mx-0', my: '', mt: '', mb: '', ml: '', mr: '' },
} as const;

export type MarginToken = keyof typeof MARGIN;

export const DIRECTION = {
  row: 'flex-row',
  column: 'flex-col',
} as const;

export const ALIGN = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

export const ALIGN_SM = {
  center: 'sm:items-center',
} as const;

export const JUSTIFY = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
} as const;

export const GAP = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  tight: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
} as const;

export const GAP_LG = {
  '3xl': 'lg:gap-12',
} as const;

export const HIDE_BELOW = {
  sm: { block: 'hidden sm:block', flex: 'hidden sm:flex', grid: 'hidden sm:grid', inline: 'hidden sm:inline', 'inline-flex': 'hidden sm:inline-flex', 'inline-block': 'hidden sm:inline-block', none: 'hidden' },
  md: { block: 'hidden md:block', flex: 'hidden md:flex', grid: 'hidden md:grid', inline: 'hidden md:inline', 'inline-flex': 'hidden md:inline-flex', 'inline-block': 'hidden md:inline-block', none: 'hidden' },
  lg: { block: 'hidden lg:block', flex: 'hidden lg:flex', grid: 'hidden lg:grid', inline: 'hidden lg:inline', 'inline-flex': 'hidden lg:inline-flex', 'inline-block': 'hidden lg:inline-block', none: 'hidden' },
} as const satisfies Record<string, Record<DisplayToken, string>>;

export const HIDE_FROM = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
} as const;

export const SHOW_BELOW = {
  sm: { block: 'block sm:hidden', flex: 'flex sm:hidden', grid: 'grid sm:hidden', inline: 'inline sm:hidden', 'inline-flex': 'inline-flex sm:hidden', 'inline-block': 'inline-block sm:hidden', none: 'hidden' },
  md: { block: 'block md:hidden', flex: 'flex md:hidden', grid: 'grid md:hidden', inline: 'inline md:hidden', 'inline-flex': 'inline-flex md:hidden', 'inline-block': 'inline-block md:hidden', none: 'hidden' },
  lg: { block: 'block lg:hidden', flex: 'flex lg:hidden', grid: 'grid lg:hidden', inline: 'inline lg:hidden', 'inline-flex': 'inline-flex lg:hidden', 'inline-block': 'inline-block lg:hidden', none: 'hidden' },
} as const satisfies Record<string, Record<DisplayToken, string>>;

export const POSITION = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
} as const;

export const BACKDROP = {
  blur: 'backdrop-blur-md',
} as const;

export const Z_INDEX = {
  0: 'z-0',
  10: 'z-10',
  20: 'z-20',
  30: 'z-30',
  40: 'z-40',
  50: 'z-50',
} as const;

export const OPACITY = {
  0: 'opacity-0',
  25: 'opacity-25',
  50: 'opacity-50',
  75: 'opacity-75',
  80: 'opacity-80',
  90: 'opacity-90',
  95: 'opacity-95',
  100: 'opacity-100',
} as const;

export const TEXT_ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export const BACKGROUND = {
  neutral: 'bg-neutral-950',
  surface: 'bg-neutral-900',
  subtle: 'bg-neutral-950/60',
  surfaceTranslucent: 'bg-neutral-900/50',
  headerTranslucent: 'bg-neutral-900/90',
  card: 'bg-neutral-900/90',
  overlayStrong: 'bg-black/95',
  strong: 'bg-neutral-800',
  transparent: 'bg-transparent',
  primary: 'bg-orange-600 hover:bg-orange-700 text-white',
  primaryFlat: 'bg-orange-600',
  dangerSoft: 'bg-red-950/30',
  warningSoft: 'bg-orange-950/20',
  successSoft: 'bg-green-950/60',
} as const;

export const BORDER_TONE = {
  neutral: 'border-neutral-800',
  subtle: 'border-neutral-800/60',
  strong: 'border-neutral-700',
  primary: 'border-orange-600',
  warning: 'border-orange-900/60',
  danger: 'border-red-900/50',
  success: 'border-green-800/60',
} as const;

export const ROUNDED = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  'bottom-lg': 'rounded-b-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

export const SHADOW = {
  md: 'shadow-md',
  lg: 'shadow-lg',
  elevated: 'shadow-lg shadow-black/50',
  dramatic: 'shadow-2xl shadow-black/70',
} as const;

export const DIVIDER = {
  top: 'border-t border-neutral-800',
  bottom: 'border-b border-neutral-800',
} as const;

export const DIVIDE = {
  neutral: 'divide-y divide-neutral-800',
  subtle: 'divide-y divide-neutral-800/60',
} as const;

export const OVERFLOW = {
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
  xAuto: 'overflow-x-auto',
  yAuto: 'overflow-y-auto',
  xHidden: 'overflow-x-hidden',
} as const;

export const WIDTH = {
  auto: 'w-auto',
  4: 'w-4',
  11: 'w-11',
  12: 'w-12',
  16: 'w-16',
  20: 'w-20',
  24: 'w-24',
  28: 'w-28',
  32: 'w-32',
  36: 'w-36',
  40: 'w-40',
  48: 'w-48',
  50: 'w-50',
  56: 'w-56',
  64: 'w-64',
  70: 'w-70',
  80: 'w-80',
  full: 'w-full',
  screen: 'w-screen',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '3/4': 'w-3/4',
  '5/6': 'w-5/6',
} as const;

export const HEIGHT = {
  auto: 'h-auto',
  1: 'h-1',
  3: 'h-3',
  4: 'h-4',
  5: 'h-5',
  6: 'h-6',
  8: 'h-8',
  10: 'h-10',
  11: 'h-11',
  12: 'h-12',
  20: 'h-20',
  24: 'h-24',
  28: 'h-28',
  32: 'h-32',
  36: 'h-36',
  40: 'h-40',
  70: 'h-70',
  80: 'h-80',
  84: 'h-84',
  98: 'h-98',
  full: 'h-full',
  screen: 'h-screen',
  hairline: 'h-px',
  nav: 'h-20',
} as const;

export const WIDTH_SM = {
  20: 'sm:w-20',
  24: 'sm:w-24',
  28: 'sm:w-28',
  32: 'sm:w-32',
  36: 'sm:w-36',
  40: 'sm:w-40',
  60: 'sm:w-60',
  auto: 'sm:w-auto',
  full: 'sm:w-full',
} as const;

export const WIDTH_MD = {
  70: 'md:w-70',
} as const;

export const HEIGHT_SM = {
  20: 'sm:h-20',
  24: 'sm:h-24',
  28: 'sm:h-28',
  32: 'sm:h-32',
  36: 'sm:h-36',
  40: 'sm:h-40',
  84: 'sm:h-84',
  95: 'sm:h-95',
  full: 'sm:h-full',
} as const;

export const HEIGHT_MD = {
  98: 'md:h-98',
  110: 'md:h-110',
} as const;

export const MAX_HEIGHT = {
  full: 'max-h-full',
} as const;

export const MIN_WIDTH = {
  zero: 'min-w-0',
} as const;

export const ASPECT = {
  square: 'aspect-square',
  '4/5': 'aspect-[4/5]',
  portrait: 'aspect-[3/4]',
  video: 'aspect-video',
} as const;

export const OBJECT_FIT = {
  cover: 'object-cover',
  contain: 'object-contain',
} as const;

export const CURSOR = {
  pointer: 'cursor-pointer',
  zoom: 'cursor-zoom-in',
  grab: 'cursor-grab active:cursor-grabbing',
  grabbing: 'cursor-grabbing',
} as const;

export type CursorToken = keyof typeof CURSOR;

export const REVEAL = {
  fade: 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
} as const;

export const OBJECT_POSITION = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
} as const;

export type ObjectFitToken = keyof typeof OBJECT_FIT;

export const HOVER_TONE = {
  underline: 'hover:underline',
  bright: 'hover:text-white',
  subtle: 'hover:bg-neutral-800/40',
  accentSoft: 'hover:text-orange-300',
} as const;

export type HoverToneToken = keyof typeof HOVER_TONE;

export const BORDER_STYLE = {
  solid: 'border-solid',
  dashed: 'border-dashed',
} as const;

export const HOVER_BORDER_TONE = {
  primary: 'hover:border-orange-600',
  primarySoft: 'hover:border-orange-600/60',
  muted: 'hover:border-neutral-700',
} as const;

export const HOVER_SHADOW = {
  spotlight: 'hover:shadow-2xl hover:shadow-orange-950/20',
} as const;

export type HoverShadowToken = keyof typeof HOVER_SHADOW;

export const FOCUS_RING = {
  withinPrimary: 'focus-within:ring-2 focus-visible:ring-orange-600',
  plain: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
  visiblePrimary:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
} as const;

export type FocusRingToken = keyof typeof FOCUS_RING;

export const TRANSITION = {
  none: '',
  colors: 'transition-colors',
  all: 'transition-all',
  allSlow: 'transition-all duration-300',
  allDuration300: 'transition-all duration-300',
} as const;

export type TransitionToken = keyof typeof TRANSITION;

export const HOVER_TRANSLATE = {
  right: 'group-hover:translate-x-1',
} as const;

export const IMAGE_EFFECT = {
  gallery:
    'grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out',
  zoom: 'group-hover:scale-105 transition-transform duration-300',
  zoomFast: 'group-hover:scale-105 transition-transform',
} as const;

export type ImageEffectToken = keyof typeof IMAGE_EFFECT;

export const PADDING_CELL = {
  md: 'py-4 px-6',
} as const;

export const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
} as const;

export const GRID_COLS_MD = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const;

export const GRID_COLS_LG = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
} as const;

export const STACK_BELOW = {
  sm: 'flex-col sm:flex-row',
  md: 'flex-col md:flex-row',
  lg: 'flex-col lg:flex-row',
} as const;

export const ALIGN_MD = {
  start: 'md:items-start',
  center: 'md:items-center',
  end: 'md:items-end',
  stretch: 'md:items-stretch',
} as const;

export const TEXT_ALIGN_SM = {
  left: 'sm:text-left',
  center: 'sm:text-center',
  right: 'sm:text-right',
} as const;

export const TEXT_ALIGN_LG = {
  left: 'lg:text-left',
  center: 'lg:text-center',
  right: 'lg:text-right',
} as const;

export const EDGE = {
  left: 'left-0',
  right: 'right-0',
  'left-md': 'left-4',
  'right-md': 'right-4',
  'left-out': 'left-0 sm:-left-12',
  'right-out': 'right-0 sm:-right-12',
  'bottom-center-md': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-center-out': '-bottom-8 left-1/2 -translate-x-1/2',
} as const;

export const TOP = {
  0: 'top-0',
  '-1/2': 'top-1/2',
  full: 'top-full',
} as const;

export const LEFT = {
  2: 'left-2',
  '1/2': 'left-1/2',
  md: 'left-8',
} as const;

export const RIGHT = {
  2: 'right-2',
} as const;

export const TRANSLATE = {
  'center-x': '-translate-x-1/2',
  'center-y': '-translate-y-1/2',
} as const;

export const CORNER = {
  'top-right': 'top-3 right-3',
  'top-left': 'top-3 left-3',
  'bottom-right': 'bottom-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'top-right-md': 'top-4 right-4',
  'top-right-lg': 'top-6 right-6',
} as const;

export const CLAMP = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
} as const;

export const MIN_HEIGHT = {
  hero: 'min-h-[90vh]',
  screen: 'min-h-screen',
} as const;

export const FONT = {
  sans: 'font-sans',
} as const;

export const SELECTION = {
  primary: 'selection:bg-orange-600 selection:text-white',
} as const;

export const GRADIENT = {
  vignette:
    'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950',
  fadeUp: 'bg-gradient-to-t from-neutral-900 via-transparent to-transparent',
  accentFadeX: 'bg-gradient-to-r from-orange-600/60 to-transparent',
} as const;

export const TRACKING = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
} as const;

export const WEIGHT = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const;

export const TRANSFORM_TEXT = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  none: 'normal-case',
} as const;

export const MAX_WIDTH = {
  prose: 'max-w-2xl',
  lg: 'max-w-lg',
  logo: 'max-w-[130px]',
  brand: 'max-w-[350px]',
  md: 'max-w-3xl',
  cover: 'max-w-md',
  showcase: 'max-w-[600px]',
  full: 'max-w-full',
  xl: 'max-w-xl',
  xs: 'max-w-xs',
} as const;

export const TEXT_SIZE = {
  '9': 'text-[9px]',
  '10': 'text-[10px]',
  '11': 'text-[11px]',
  '3xl': 'text-3xl',
  display: 'text-6xl',
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  reading: 'text-base md:text-lg',
  'heading-sm': 'text-2xl md:text-3xl',
  'heading-lg': 'text-3xl md:text-4xl lg:text-5xl',
} as const;

export type TextSizeToken = keyof typeof TEXT_SIZE;

export const TONE = {
  primary: 'text-orange-600',
  accent: 'text-orange-500',
  warning: 'text-orange-400',
  warningSoft: 'text-orange-300',
  warningFaint: 'text-orange-200',
  danger: 'text-red-400',
  dangerSoft: 'text-red-300',
  success: 'text-green-400',
  successSoft: 'text-green-300',
  main: 'text-white',
  bright: 'text-neutral-50',
  soft: 'text-neutral-200',
  muted: 'text-neutral-400',
  subtle: 'text-neutral-500',
} as const;

export type ToneToken = keyof typeof TONE;
