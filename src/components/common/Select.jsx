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
          className="text-xs sm:text-sm font-medium text-[#17191F] dark:text-[#F4F7FC]"
        >
          {label} {required && <span className="text-[#D64545]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full bg-white dark:bg-[#15171D] border text-[#17191F] dark:text-[#F4F7FC] rounded-lg text-sm transition-all duration-150 cursor-pointer appearance-none',
            'pl-3 pr-9 py-2 focus:outline-none focus:ring-2',
            error
              ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/15'
              : 'border-[#E6E8EE] hover:border-[#D1D5DB] focus:border-[#00A859] focus:ring-[#00A859]/15 dark:border-[#2A2E3B] dark:hover:border-[#3B4254] dark:focus:border-[#00A859]',
            disabled && 'opacity-60 bg-[#F7F8FA] dark:bg-[#1D2028] cursor-not-allowed',
            className
          )}
          {...props}
        >
          {options && options.length > 0
            ? options.map((opt, idx) => {
                const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
                const lbl = typeof opt === 'object' && opt !== null ? opt.label : opt;
                return (
                  <option
                    key={idx}
                    value={val}
                    className="bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] py-1"
                  >
                    {lbl}
                  </option>
                );
              })
            : children}
        </select>

        <div className="absolute right-3 pointer-events-none text-[#737985] dark:text-[#9CA3AF] flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <span className="text-xs text-[#D64545] mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#737985] mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});
