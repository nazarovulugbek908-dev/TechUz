import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    rightElement,
    className = '',
    containerClassName = '',
    id,
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'w-full bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 rounded-xl text-sm transition-all duration-150',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2',
            Icon ? 'pl-10' : 'pl-3.5',
            rightElement ? 'pr-10' : 'pr-3.5',
            'py-2.5',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-800'
              : 'border-slate-200 hover:border-slate-300 focus:border-[#FF7A00] focus:ring-orange-500/20 dark:border-slate-700 dark:focus:border-[#FF7A00]',
            disabled && 'opacity-60 bg-slate-50 cursor-not-allowed',
            className
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center">{rightElement}</div>
        )}
      </div>

      {error ? (
        <span className="text-xs text-rose-500 mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500 mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});
