import React from 'react';
import { cn } from '../../utils/cn';

export function PillFilter({
  label,
  active = false,
  count = null,
  icon: Icon = null,
  onClick,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap',
        active
          ? 'bg-[#5B5BD6] text-white shadow-xs'
          : 'bg-white dark:bg-[#1D2028] text-[#737985] dark:text-[#9CA3AF] border border-[#E6E8EE] dark:border-[#2A2E3B] hover:text-[#17191F] dark:hover:text-white hover:border-[#D1D5DB] dark:hover:border-[#3B4254]',
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
      {count !== null && (
        <span
          className={cn(
            'px-1.5 py-0.2 rounded text-[10px] font-semibold tabular-nums',
            active
              ? 'bg-white/20 text-white'
              : 'bg-[#F7F8FA] dark:bg-[#15171D] text-[#737985] dark:text-[#9CA3AF]'
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={cn('flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1', className)}>
      {tabs.map((tab) => (
        <PillFilter
          key={tab.id}
          label={tab.label}
          active={activeTab === tab.id}
          count={tab.count}
          icon={tab.icon}
          onClick={() => onChange(tab.id)}
        />
      ))}
    </div>
  );
}
