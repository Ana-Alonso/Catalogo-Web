import React, { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { cn } from '../../design-system/utils/cn';
import { HOVER_TONE, PADDING_CELL, TEXT_ALIGN, WEIGHT } from './styles';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  fullWidth?: boolean;
  align?: keyof typeof TEXT_ALIGN;
}

export const Table: React.FC<TableProps> = ({
  fullWidth,
  align = 'left',
  className,
  children,
  ...props
}) => (
  <table
    className={cn(
      fullWidth === true && 'w-full',
      align && TEXT_ALIGN[align],
      'border-collapse',
      className
    )}
    {...props}
  >
    {children}
  </table>
);

Table.displayName = 'Table';

export interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHead: React.FC<TableSectionProps> = ({
  className,
  children,
  ...props
}) => (
  <thead className={cn(className)} {...props}>
    {children}
  </thead>
);

TableHead.displayName = 'TableHead';

export const TableBody: React.FC<TableSectionProps> = ({
  divide = 'subtle',
  className,
  children,
  ...props
}) => (
  <tbody
    className={cn(
      divide === 'subtle' && 'divide-y divide-neutral-800/60',
      'text-sm',
      className
    )}
    {...props}
  >
    {children}
  </tbody>
);

TableBody.displayName = 'TableBody';

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  head?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  hoverable,
  head,
  className,
  children,
  ...props
}) => (
  <tr
    className={cn(
      head &&
        'border-b border-neutral-800 bg-neutral-950/60 text-xs font-semibold uppercase tracking-wider text-neutral-400',
      hoverable && HOVER_TONE.subtle,
      hoverable && 'transition-colors',
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

TableRow.displayName = 'TableRow';

interface TableCellLayout {
  padding?: keyof typeof PADDING_CELL;
  align?: keyof typeof TEXT_ALIGN;
  weight?: keyof typeof WEIGHT;
}

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement>,
    TableCellLayout {}

export const TableCell: React.FC<TableCellProps> = ({
  padding = 'md',
  align,
  weight,
  className,
  children,
  ...props
}) => (
  <td
    className={cn(
      padding && PADDING_CELL[padding],
      align && TEXT_ALIGN[align],
      weight && WEIGHT[weight],
      className
    )}
    {...props}
  >
    {children}
  </td>
);

TableCell.displayName = 'TableCell';

export interface TableHeaderProps
  extends ThHTMLAttributes<HTMLTableCellElement>,
    TableCellLayout {}

export const TableHeader: React.FC<TableHeaderProps> = ({
  padding = 'md',
  align,
  className,
  children,
  ...props
}) => (
  <th
    scope="col"
    className={cn(
      padding && PADDING_CELL[padding],
      align && TEXT_ALIGN[align],
      className
    )}
    {...props}
  >
    {children}
  </th>
);

TableHeader.displayName = 'TableHeader';
