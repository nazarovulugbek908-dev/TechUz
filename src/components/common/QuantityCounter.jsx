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
        'inline-flex items-center justify-between border border-[#E6E8EE] dark:border-[#2A2E3B] bg-white dark:bg-[#15171D] rounded-lg overflow-hidden select-none',
        isSm ? 'h-7.5 px-1' : 'h-9 px-1.5',
        className
      )}
    >
      <button
        type="button"
        disabled={quantity <= min}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrement && onDecrement(e);
        }}
        className={cn(
          'flex items-center justify-center text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028] rounded transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer',
          isSm ? 'w-5.5 h-5.5' : 'w-6.5 h-6.5'
        )}
        aria-label="Kamaytirish"
      >
        <Minus className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>

      <span
        className={cn(
          'font-semibold text-[#17191F] dark:text-[#F4F7FC] text-center tabular-nums',
          isSm ? 'w-5 text-xs' : 'w-7 text-sm'
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={quantity >= max}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement && onIncrement(e);
        }}
        className={cn(
          'flex items-center justify-center text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028] rounded transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer',
          isSm ? 'w-5.5 h-5.5' : 'w-6.5 h-6.5'
        )}
        aria-label="Ko'paytirish"
      >
        <Plus className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>
    </div>
  );
}
