import React from 'react';
import { cn } from '../../utils/cn';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-9 h-9 border-3'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          'rounded-full border-[#5B5BD6]/20 border-t-[#5B5BD6] animate-spin',
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
        'bg-white dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-xl p-4 flex flex-col gap-3 animate-pulse',
        className
      )}
    >
      <div className="w-full aspect-square bg-[#F7F8FA] dark:bg-[#15171D] rounded-lg" />
      <div className="h-4 bg-[#E6E8EE] dark:bg-[#2A2E3B] rounded w-3/4" />
      <div className="h-3 bg-[#F7F8FA] dark:bg-[#15171D] rounded w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 bg-[#E6E8EE] dark:bg-[#2A2E3B] rounded w-1/3" />
        <div className="h-8 w-8 bg-[#E6E8EE] dark:bg-[#2A2E3B] rounded-lg" />
      </div>
    </div>
  );
}
