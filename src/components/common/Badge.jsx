import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({
  children,
  variant = 'default', // sale | new | original | premium | compatible | success | warning
  size = 'md', // sm | md
  className = ''
}) {
  const baseStyles = 'inline-flex items-center font-bold uppercase tracking-wider rounded-md';

  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    sale: 'bg-rose-500 text-white shadow-xs',
    new: 'bg-emerald-500 text-white shadow-xs',
    original: 'bg-blue-600 text-white shadow-xs',
    premium: 'bg-purple-600 text-white shadow-xs',
    compatible: 'bg-orange-100 text-[#FF7A00] border border-orange-200 font-semibold lowercase first-letter:uppercase',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2.5 py-0.5 rounded-md'
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
