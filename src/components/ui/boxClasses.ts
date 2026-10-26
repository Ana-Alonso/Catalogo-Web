import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '../../design-system/utils/cn';
import {
  ALIGN,
  ALIGN_SM,
  ALIGN_MD,
  ASPECT,
  BACKGROUND,
  BACKDROP,
  BORDER_STYLE,
  BORDER_TONE,
  CLAMP,
  CORNER,
  CURSOR,
  DIRECTION,
  DISPLAY,
  DIVIDER,
  DIVIDE,
  EDGE,
  FOCUS_RING,
  FONT,
  GAP,
  GAP_LG,
  GRADIENT,
  GRID_COLS,
  GRID_COLS_LG,
  GRID_COLS_MD,
  HEIGHT,
  HEIGHT_MD,
  HEIGHT_SM,
  HIDE_BELOW,
  HIDE_FROM,
  HOVER_BORDER_TONE,
  HOVER_SHADOW,
  JUSTIFY,
  LEFT,
  MAX_WIDTH,
  MARGIN,
  MIN_HEIGHT,
  MIN_WIDTH,
  OPACITY,
  OVERFLOW,
  PADDING,
  PADDING_SM,
  POSITION,
  REVEAL,
  RIGHT,
  ROUNDED,
  SELECTION,
  SHADOW,
  SHOW_BELOW,
  STACK_BELOW,
  TEXT_ALIGN,
  TEXT_ALIGN_LG,
  TEXT_ALIGN_SM,
  TEXT_SIZE,
  TOP,
  TONE,
  TRANSLATE,
  TRANSITION,
  WIDTH,
  WIDTH_MD,
  WIDTH_SM,
  Z_INDEX,
  type CursorToken,
  type DisplayToken,
  type FocusRingToken,
  type HoverShadowToken,
  type MarginToken,
  type PaddingToken,
  type TextSizeToken,
  type ToneToken,
  type TransitionToken,
} from './styles';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  display?: DisplayToken;
  direction?: keyof typeof DIRECTION;
  align?: keyof typeof ALIGN;
  alignSm?: keyof typeof ALIGN_SM;
  alignMd?: keyof typeof ALIGN_MD;
  justify?: keyof typeof JUSTIFY;
  gap?: keyof typeof GAP;
  gapLg?: keyof typeof GAP_LG;
  wrap?: boolean;
  inline?: boolean;
  stackBelow?: keyof typeof STACK_BELOW;
  columns?: keyof typeof GRID_COLS;
  columnsMd?: keyof typeof GRID_COLS_MD;
  columnsLg?: keyof typeof GRID_COLS_LG;
  padding?: PaddingToken;
  paddingSm?: keyof typeof PADDING_SM;
  paddingX?: PaddingToken;
  paddingY?: PaddingToken;
  paddingTop?: PaddingToken;
  paddingRight?: PaddingToken;
  paddingBottom?: PaddingToken;
  paddingLeft?: PaddingToken;
  margin?: MarginToken;
  marginX?: MarginToken;
  marginY?: MarginToken;
  marginTop?: MarginToken;
  marginBottom?: MarginToken;
  width?: keyof typeof WIDTH;
  height?: keyof typeof HEIGHT;
  widthSm?: keyof typeof WIDTH_SM;
  widthMd?: keyof typeof WIDTH_MD;
  heightSm?: keyof typeof HEIGHT_SM;
  heightMd?: keyof typeof HEIGHT_MD;
  maxWidth?: keyof typeof MAX_WIDTH;
  center?: boolean;
  block?: boolean;
  cursor?: CursorToken;
  reveal?: 'fade';
  srOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  hrefLang?: string;
  minWidth?: keyof typeof MIN_WIDTH;
  minHeight?: keyof typeof MIN_HEIGHT;
  aspect?: keyof typeof ASPECT;
  grow?: boolean;
  flex?: boolean;
  shrink?: boolean;
  position?: keyof typeof POSITION;
  top?: keyof typeof TOP;
  left?: keyof typeof LEFT;
  right?: keyof typeof RIGHT;
  shift?: keyof typeof TRANSLATE;
  backdrop?: keyof typeof BACKDROP;
  inset?: boolean;
  edge?: keyof typeof EDGE;
  corner?: keyof typeof CORNER;
  zIndex?: keyof typeof Z_INDEX;
  opacity?: keyof typeof OPACITY;
  background?: keyof typeof BACKGROUND;
  border?: boolean;
  borderTone?: keyof typeof BORDER_TONE;
  borderStyle?: keyof typeof BORDER_STYLE;
  borderWidth?: 'md' | 'thick';
  hoverBorder?: keyof typeof HOVER_BORDER_TONE;
  hoverShadow?: HoverShadowToken;
  focusRing?: FocusRingToken;
  divider?: keyof typeof DIVIDER;
  divide?: keyof typeof DIVIDE;
  rounded?: keyof typeof ROUNDED;
  shadow?: keyof typeof SHADOW;
  overflow?: keyof typeof OVERFLOW;
  clamp?: keyof typeof CLAMP;
  tone?: ToneToken;
  size?: TextSizeToken;
  textAlign?: keyof typeof TEXT_ALIGN;
  textAlignSm?: keyof typeof TEXT_ALIGN_SM;
  textAlignLg?: keyof typeof TEXT_ALIGN_LG;
  gradient?: keyof typeof GRADIENT;
  font?: keyof typeof FONT;
  selection?: keyof typeof SELECTION;
  group?: boolean;
  cssTransition?: TransitionToken;
  hideBelow?: keyof typeof HIDE_BELOW;
  hideFrom?: keyof typeof HIDE_FROM;
  showBelow?: keyof typeof SHOW_BELOW;
}

export type DesignProps = Omit<BoxProps, 'as' | 'className'>;

const DESIGN_KEYS = new Set<string>([
  'display', 'inline', 'direction', 'align', 'alignSm', 'alignMd', 'justify',
  'gap', 'gapLg', 'wrap', 'stackBelow',
  'columns', 'columnsMd', 'columnsLg',
  'padding', 'paddingSm', 'paddingX', 'paddingY', 'paddingTop', 'paddingRight',
  'paddingBottom', 'paddingLeft',
  'margin', 'marginX', 'marginY', 'marginTop', 'marginBottom',
  'width', 'height', 'widthSm', 'widthMd', 'heightSm', 'heightMd', 'maxWidth',
  'center', 'block', 'cursor', 'reveal', 'srOnly',
  'minWidth', 'minHeight', 'aspect', 'grow', 'flex', 'shrink',
  'position', 'top', 'left', 'right', 'shift', 'backdrop', 'inset', 'edge',
  'corner', 'zIndex', 'opacity',
  'background', 'border', 'borderTone', 'borderStyle', 'borderWidth',
  'hoverBorder', 'hoverShadow', 'focusRing', 'divider', 'divide', 'rounded',
  'shadow', 'overflow', 'clamp', 'tone', 'size',
  'textAlign', 'textAlignSm', 'textAlignLg', 'gradient', 'font', 'selection',
  'group', 'cssTransition', 'hideBelow', 'hideFrom', 'showBelow',
]);

export const splitDesignProps = (
  rest: Record<string, unknown>
): { design: DesignProps; dom: Record<string, unknown> } => {
  const design: Record<string, unknown> = {};
  const dom: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    (DESIGN_KEYS.has(key) ? design : dom)[key] = value;
  }
  return { design: design as DesignProps, dom };
};

export const designClasses = (p: DesignProps): string =>
  cn(
    p.display && DISPLAY[p.display],
    p.inline === true && p.display === 'flex' && 'inline-flex',
    p.direction && DIRECTION[p.direction],
    p.align && ALIGN[p.align],
    p.alignSm && ALIGN_SM[p.alignSm],
    p.alignMd && ALIGN_MD[p.alignMd],
    p.justify && JUSTIFY[p.justify],
    p.gap && GAP[p.gap],
    p.gapLg && GAP_LG[p.gapLg],
    p.wrap === true && 'flex-wrap',
    p.stackBelow && STACK_BELOW[p.stackBelow],
    p.columns && GRID_COLS[p.columns],
    p.columnsMd && GRID_COLS_MD[p.columnsMd],
    p.columnsLg && GRID_COLS_LG[p.columnsLg],
    p.padding && PADDING[p.padding].p,
    p.paddingSm && PADDING_SM[p.paddingSm],
    p.paddingX && PADDING[p.paddingX].px,
    p.paddingY && PADDING[p.paddingY].py,
    p.paddingTop && PADDING[p.paddingTop].pt,
    p.paddingRight && PADDING[p.paddingRight].pr,
    p.paddingBottom && PADDING[p.paddingBottom].pb,
    p.paddingLeft && PADDING[p.paddingLeft].pl,
    p.margin && MARGIN[p.margin].m,
    p.marginX && MARGIN[p.marginX].mx,
    p.marginY && MARGIN[p.marginY].my,
    p.marginTop && MARGIN[p.marginTop].mt,
    p.marginBottom && MARGIN[p.marginBottom].mb,
    p.width && WIDTH[p.width],
    p.height && HEIGHT[p.height],
    p.widthSm && WIDTH_SM[p.widthSm],
    p.widthMd && WIDTH_MD[p.widthMd],
    p.heightSm && HEIGHT_SM[p.heightSm],
    p.heightMd && HEIGHT_MD[p.heightMd],
    p.maxWidth && MAX_WIDTH[p.maxWidth],
    p.center === true && 'mx-auto',
    p.block === true && 'w-full',
    p.cursor && CURSOR[p.cursor],
    p.reveal && REVEAL[p.reveal],
    p.srOnly === true && 'sr-only',
    p.minWidth && MIN_WIDTH[p.minWidth],
    p.minHeight && MIN_HEIGHT[p.minHeight],
    p.aspect && ASPECT[p.aspect],
    p.grow === true && 'flex-grow',
    p.flex === true && 'flex-1',
    p.shrink === false && 'flex-shrink-0',
    p.position && POSITION[p.position],
    p.top !== undefined && TOP[p.top],
    p.left !== undefined && LEFT[p.left],
    p.right !== undefined && RIGHT[p.right],
    p.shift && TRANSLATE[p.shift],
    p.backdrop && BACKDROP[p.backdrop],
    p.inset && 'inset-0',
    p.edge && EDGE[p.edge],
    p.corner && CORNER[p.corner],
    p.zIndex !== undefined && Z_INDEX[p.zIndex],
    p.opacity !== undefined && OPACITY[p.opacity],
    p.background && BACKGROUND[p.background],
    p.border && 'border border-neutral-800',
    p.border === true && p.borderWidth === 'thick' && 'border-2',
    p.border === true && p.borderStyle && BORDER_STYLE[p.borderStyle],
    p.border === true && p.hoverBorder && HOVER_BORDER_TONE[p.hoverBorder],
    p.borderTone && BORDER_TONE[p.borderTone],
    p.divider && DIVIDER[p.divider],
    p.divide && DIVIDE[p.divide],
    p.rounded && ROUNDED[p.rounded],
    p.shadow && SHADOW[p.shadow],
    p.hoverShadow && HOVER_SHADOW[p.hoverShadow],
    p.focusRing && FOCUS_RING[p.focusRing],
    p.overflow && OVERFLOW[p.overflow],
    p.clamp && CLAMP[p.clamp],
    p.tone && TONE[p.tone],
    p.size && TEXT_SIZE[p.size],
    p.textAlign && TEXT_ALIGN[p.textAlign],
    p.textAlignSm && TEXT_ALIGN_SM[p.textAlignSm],
    p.textAlignLg && TEXT_ALIGN_LG[p.textAlignLg],
    p.gradient && GRADIENT[p.gradient],
    p.font && FONT[p.font],
    p.selection && SELECTION[p.selection],
    p.group === true && 'group',
    p.cssTransition && TRANSITION[p.cssTransition],
    p.hideBelow && HIDE_BELOW[p.hideBelow][p.display ?? 'block'],
    p.hideFrom && HIDE_FROM[p.hideFrom],
    p.showBelow && SHOW_BELOW[p.showBelow][p.display ?? 'block']
  );
