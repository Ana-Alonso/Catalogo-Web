import React from 'react';
import type { IconGlyphProps } from './Icon';

export const Instagram: React.FC<IconGlyphProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

Instagram.displayName = 'Instagram';

export const Tiktok: React.FC<IconGlyphProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

Tiktok.displayName = 'Tiktok';

export const Amazon: React.FC<IconGlyphProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.24-1.276-1.817-2.108-1.739 1.776-2.97 2.308-5.227 2.308-2.667 0-4.744-1.645-4.744-4.94 0-2.576 1.396-4.329 3.383-5.186 1.722-.754 4.128-.889 5.967-.889v-.411c0-.754.059-1.645-.384-2.296-.384-.579-1.12-.818-1.77-.818-1.202 0-2.274.616-2.537 1.894-.055.283-.26.56-.544.575l-3.056-.333c-.257-.058-.54-.266-.47-.66.705-3.717 4.068-4.838 7.082-4.838 1.542 0 3.558.411 4.778 1.58 1.545 1.496 1.396 3.492 1.396 5.662v5.122c0 1.54.64 2.215 1.24 3.047.211.292.257.644-.005.86-.662.555-1.84 1.58-2.489 2.156l-.009-.006z" />
  </svg>
);

Amazon.displayName = 'Amazon';
