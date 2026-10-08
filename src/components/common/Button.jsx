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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-[#FF7A00] text-white hover:bg-[#E66E00] focus:ring-[#FF7A00]/40 shadow-sm hover:shadow-md hover:shadow-orange-500/20',
    secondary:
      'bg-[#18181B] text-white hover:bg-[#27272A] focus:ring-zinc-800 shadow-sm',
    outline:
      'border-1.5 border-slate-200 bg-transparent text-slate-800 hover:border-[#FF7A00] hover:text-[#FF7A00] hover:bg-orange-50/50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    soft:
      'bg-orange-50 text-[#FF7A00] hover:bg-orange-100 focus:ring-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:hover:bg-orange-950/60',
    danger:
      'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400 shadow-sm'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl',
    icon: 'p-2.5 rounded-xl aspect-square'
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
