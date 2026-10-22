import React from 'react';
import { cn } from '../../utils/cn';
import { PackageOpen } from 'lucide-react';
import { Button } from '../common/Button';

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white dark:bg-[#1D2028] rounded-xl border border-[#E6E8EE] dark:border-[#2A2E3B]',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center mb-3.5">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[#17191F] dark:text-[#F4F7FC] mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-[#737985] dark:text-[#9CA3AF] max-w-sm mb-5">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
