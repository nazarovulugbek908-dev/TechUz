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
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
        active
          ? 'bg-[#FF7A00] text-white shadow-sm shadow-orange-500/20'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80',
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
      {count !== null && (
        <span
          className={cn(
            'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
            active ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
    <div className={cn('flex items-center gap-2 overflow-x-auto no-scrollbar py-1', className)}>
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
