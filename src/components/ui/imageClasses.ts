import type { CursorToken, ImageEffectToken, ToneToken } from './styles';
import {
  CURSOR,
  DISPLAY_SM,
  HEIGHT,
  HEIGHT_SM,
  IMAGE_EFFECT,
  MAX_HEIGHT,
  MAX_WIDTH,
  OBJECT_POSITION,
  OPACITY,
  ROUNDED,
  TONE,
  WIDTH,
  WIDTH_SM,
} from './styles';
import { cn } from '../../design-system/utils/cn';

export interface ImageProps {
  src: string | undefined;
  alt: string;
  width?: keyof typeof WIDTH;
  height?: keyof typeof HEIGHT;
  widthSm?: keyof typeof WIDTH_SM;
  heightSm?: keyof typeof HEIGHT_SM;
  maxWidth?: keyof typeof MAX_WIDTH;
  maxHeight?: keyof typeof MAX_HEIGHT;
  fit?: 'cover' | 'contain' | 'fill';
  color?: ToneToken;
  cursor?: CursorToken;
  position?: keyof typeof OBJECT_POSITION;
  effect?: ImageEffectToken;
  opacity?: keyof typeof OPACITY;
  rounded?: keyof typeof ROUNDED;
  background?: 'strong' | 'neutral' | 'surface';
  border?: boolean;
  shrink?: boolean;
  fullWidth?: boolean;
  displaySm?: keyof typeof DISPLAY_SM;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export type ImageDesignProps = Omit<ImageProps, 'src' | 'alt' | 'loading' | 'className'>;

const IMAGE_DESIGN_KEYS = new Set<string>([
  'width', 'height', 'widthSm', 'heightSm', 'maxWidth', 'maxHeight', 'fit',
  'color', 'cursor', 'position', 'effect', 'opacity', 'rounded', 'background',
  'border', 'shrink', 'fullWidth', 'displaySm',
]);

export const splitImageProps = (
  rest: Record<string, unknown>
): { design: ImageDesignProps; dom: Record<string, unknown> } => {
  const design: Record<string, unknown> = {};
  const dom: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    (IMAGE_DESIGN_KEYS.has(key) ? design : dom)[key] = value;
  }
  return { design: design as ImageDesignProps, dom };
};

const IMAGE_FIT = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
} as const;

const IMAGE_BACKGROUND = {
  strong: 'bg-neutral-800',
  neutral: 'bg-neutral-950',
  surface: 'bg-neutral-900',
} as const;

export const imageClasses = (p: ImageDesignProps, className?: string): string =>
  cn(
    p.width && WIDTH[p.width],
    p.height && HEIGHT[p.height],
    p.widthSm && WIDTH_SM[p.widthSm],
    p.heightSm && HEIGHT_SM[p.heightSm],
    p.displaySm && DISPLAY_SM[p.displaySm],
    p.maxWidth && MAX_WIDTH[p.maxWidth],
    p.maxHeight && MAX_HEIGHT[p.maxHeight],
    p.fullWidth === true && 'w-full',
    IMAGE_FIT[p.fit ?? 'cover'],
    p.color && TONE[p.color],
    p.cursor && CURSOR[p.cursor],
    p.position && OBJECT_POSITION[p.position],
    p.effect && IMAGE_EFFECT[p.effect],
    p.opacity !== undefined && OPACITY[p.opacity],
    p.rounded && ROUNDED[p.rounded],
    p.background && IMAGE_BACKGROUND[p.background],
    p.border === true && 'border border-neutral-800',
    p.shrink === false && 'flex-shrink-0',
    className
  );
