import React from 'react';
import { cn } from '../../design-system/utils/cn';

export interface OptionListProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
}

export const OptionList: React.FC<OptionListProps> = ({
  label,
  className,
  children,
  ...props
}) => {
  const items = (
    <ul className={cn('flex items-center gap-1', className)} {...props}>
      {children}
    </ul>
  );

  if (!label) return items;

  return <nav aria-label={label}>{items}</nav>;
};

export interface OptionProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

export const Option: React.FC<OptionProps> = ({ className, children, ...props }) => (
  <li className={className} {...props}>
    {children}
  </li>
);

export default OptionList;
