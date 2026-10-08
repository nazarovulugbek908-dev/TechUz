import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export function RatingStars({
  rating = 5,
  reviewsCount = null,
  size = 'sm',
  className = ''
}) {
  const isSm = size === 'sm';

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-slate-500', className)}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              isSm ? 'w-3.5 h-3.5' : 'w-4 h-4',
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
            )}
          />
        ))}
      </div>
      <span className={cn('font-bold text-slate-800 dark:text-slate-200', isSm ? 'text-xs' : 'text-sm')}>
        {rating.toFixed(1)}
      </span>
      {reviewsCount !== null && (
        <span className={cn('text-slate-400', isSm ? 'text-[11px]' : 'text-xs')}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
