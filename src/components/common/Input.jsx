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
          className="text-xs sm:text-sm font-medium text-[#17191F] dark:text-[#F4F7FC]"
        >
          {label} {required && <span className="text-[#D64545]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-[#737985] dark:text-[#9CA3AF]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'w-full bg-white dark:bg-[#15171D] border text-[#17191F] dark:text-[#F4F7FC] rounded-lg text-sm transition-all duration-150',
            'placeholder:text-[#737985]/60 dark:placeholder:text-[#9CA3AF]/50 focus:outline-none focus:ring-2',
            Icon ? 'pl-9' : 'pl-3',
            rightElement ? 'pr-9' : 'pr-3',
            'py-2',
            error
              ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/15'
              : 'border-[#E6E8EE] hover:border-[#D1D5DB] focus:border-[#00A859] focus:ring-[#00A859]/15 dark:border-[#2A2E3B] dark:hover:border-[#3B4254] dark:focus:border-[#00A859]',
            disabled && 'opacity-60 bg-[#F7F8FA] dark:bg-[#1D2028] cursor-not-allowed',
            className
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center">{rightElement}</div>
        )}
      </div>

      {error ? (
        <span className="text-xs text-[#D64545] mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#737985] mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});
