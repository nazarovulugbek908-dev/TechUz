import React from 'react';
import { cn } from '../../utils/cn';
import { Minus, Plus } from 'lucide-react';

export function QuantityCounter({
  quantity = 1,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'md', // sm | md
  className = ''
}) {
  const isSm = size === 'sm';

  return (
    <div
      className={cn(
        'inline-flex items-center justify-between border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-xl overflow-hidden select-none',
        isSm ? 'h-8 px-1' : 'h-10 px-1.5',
        className
      )}
    >
      <button
        type="button"
        disabled={quantity <= min}
        onClick={onDecrement}
        className={cn(
          'flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer',
          isSm ? 'w-6 h-6' : 'w-7 h-7'
        )}
        aria-label="Kamaytirish"
      >
        <Minus className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>

      <span
        className={cn(
          'font-bold text-slate-900 dark:text-white text-center tabular-nums',
          isSm ? 'w-6 text-xs' : 'w-8 text-sm'
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={quantity >= max}
        onClick={onIncrement}
        className={cn(
          'flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer',
          isSm ? 'w-6 h-6' : 'w-7 h-7'
        )}
        aria-label="Ko'paytirish"
      >
        <Plus className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>
    </div>
  );
}
