import React from 'react';
import { cn } from '../../utils/cn';

export function Button({
  children,
  variant = 'primary', // primary | secondary | outline | ghost | soft | danger
  size = 'md', // sm | md | lg | icon
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const variants = {
    primary:
      'bg-[#5B5BD6] text-white hover:bg-[#4949BC] active:bg-[#3C3CA8] focus:ring-[#5B5BD6]/30 shadow-xs',
    secondary:
      'bg-[#17191F] text-white hover:bg-[#252830] active:bg-[#111216] focus:ring-[#17191F]/30 shadow-xs',
    outline:
      'border border-[#E6E8EE] bg-white text-[#17191F] hover:bg-[#F7F8FA] hover:border-[#D1D5DB] focus:ring-[#5B5BD6]/20 dark:bg-[#15171D] dark:border-[#2A2E3B] dark:text-[#F4F7FC] dark:hover:bg-[#1D2028]',
    ghost:
      'bg-transparent text-[#737985] hover:bg-[#F7F8FA] hover:text-[#17191F] focus:ring-slate-200 dark:text-[#9CA3AF] dark:hover:bg-[#1D2028] dark:hover:text-white',
    soft:
      'bg-[#EEEEFF] text-[#5B5BD6] hover:bg-[#E5E5FF] active:bg-[#DBDBFA] focus:ring-[#5B5BD6]/20 dark:bg-[#5B5BD6]/15 dark:text-[#A5A5F5] dark:hover:bg-[#5B5BD6]/25',
    danger:
      'bg-[#D64545] text-white hover:bg-[#BC3636] active:bg-[#A62F2F] focus:ring-[#D64545]/30 shadow-xs'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl',
    icon: 'p-2 rounded-lg aspect-square'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={cn(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      ) : null}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={cn(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      )}
    </button>
  );
}
