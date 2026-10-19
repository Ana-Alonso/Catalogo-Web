import React, { type HTMLAttributes, type ElementType } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Box: React.FC<BoxProps> = ({
  as: Component = 'div',
  className,
  children,
  ...props
}) => {
  return (
    <Component className={twMerge(clsx(className))} {...props}>
      {children}
    </Component>
  );
};

export default Box;
