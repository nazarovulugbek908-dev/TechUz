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
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5',
        hoverEffect &&
          'hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-200 dark:hover:border-orange-900/50 hover:-translate-y-0.5 transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
