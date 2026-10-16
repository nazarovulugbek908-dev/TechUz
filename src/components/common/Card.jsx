import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-xl p-4 sm:p-5 shadow-xs transition-all duration-150',
        hoverEffect &&
          'hover:border-[#D1D5DB] dark:hover:border-[#3B4254] hover:shadow-sm cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
