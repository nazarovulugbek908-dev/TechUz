import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    options = [],
    children,
    error,
    helperText,
    className = '',
    containerClassName = '',
    id,
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full appearance-none bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 rounded-xl text-sm transition-all duration-150 cursor-pointer',
            'pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-200 hover:border-slate-300 focus:border-[#FF7A00] focus:ring-orange-500/20 dark:border-slate-700 dark:focus:border-[#FF7A00]',
            disabled && 'opacity-60 bg-slate-50 cursor-not-allowed',
            className
          )}
          {...props}
        >
          {children
            ? children
            : options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <span className="text-xs text-rose-500 mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500 mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});
