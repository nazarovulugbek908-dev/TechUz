import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function Alert({
  type = 'info', // info | success | warning | error
  title,
  children,
  onClose,
  className = ''
}) {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle
  };

  const Icon = icons[type] || Info;

  const styles = {
    info: 'bg-[#E6F7EF] border-[#00A859]/20 text-[#00A859] dark:bg-[#00A859]/15 dark:border-[#00A859]/30 dark:text-[#00A859]',
    success: 'bg-[#EAF6F0] border-[#CFEBDD] text-[#16845B] dark:bg-[#16845B]/15 dark:border-[#16845B]/30 dark:text-[#4ADE80]',
    warning: 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706] dark:bg-[#D97706]/15 dark:border-[#D97706]/30 dark:text-[#FBBF24]',
    error: 'bg-[#FDF2F2] border-[#FCDADA] text-[#D64545] dark:bg-[#D64545]/15 dark:border-[#D64545]/30 dark:text-[#F87171]'
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-lg border text-sm',
        styles[type],
        className
      )}
      role="alert"
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Yopish"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
