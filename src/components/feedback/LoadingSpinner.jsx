import React from 'react';
import { cn } from '../../utils/cn';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-3',
    lg: 'w-10 h-10 border-4'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          'rounded-full border-orange-500/20 border-t-[#FF7A00] animate-spin',
          sizes[size],
          className
        )}
      />
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3 animate-pulse',
        className
      )}
    >
      <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
