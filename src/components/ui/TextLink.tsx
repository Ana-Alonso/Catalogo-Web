import React, { type AnchorHTMLAttributes } from 'react';
import { cn } from '../../design-system/utils/cn';
import { HOVER_TONE, TEXT_SIZE, TONE, WEIGHT, type HoverToneToken, type TextSizeToken, type ToneToken } from './styles';

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  tone?: ToneToken;
  size?: TextSizeToken;
  weight?: keyof typeof WEIGHT;
  hover?: HoverToneToken;
  underline?: boolean;
}

export const TextLink: React.FC<TextLinkProps> = ({
  href,
  tone = 'primary',
  size,
  weight,
  hover,
  underline,
  className,
  children,
  ...props
}) => (
  <a
    href={href}
    className={cn(
      'inline-flex items-center gap-1',
      TONE[tone],
      size && TEXT_SIZE[size],
      weight && WEIGHT[weight],
      hover && HOVER_TONE[hover],
      underline === true && 'underline underline-offset-2',
      className
    )}
    {...props}
  >
    {children}
  </a>
);

TextLink.displayName = 'TextLink';

export default TextLink;
