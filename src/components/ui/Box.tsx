import React from 'react';
import { cn } from '../../design-system/utils/cn';
import { designClasses, splitDesignProps, type BoxProps } from './boxClasses';

export const Box: React.FC<BoxProps> = ({
  as: Component = 'div',
  className,
  children,
  ...rest
}) => {
  const { design, dom } = splitDesignProps(rest);
  return (
    <Component className={cn(designClasses(design), className)} {...dom}>
      {children}
    </Component>
  );
};

export default Box;
