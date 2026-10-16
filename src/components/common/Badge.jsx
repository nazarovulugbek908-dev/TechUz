import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({
  children,
  variant = 'default', // default | sale | new | original | premium | compatible | success | warning | brand
  size = 'md', // sm | md
  className = ''
}) {
  const baseStyles = 'inline-flex items-center font-semibold tracking-normal rounded-md';

  const variants = {
    default: 'bg-[#F7F8FA] text-[#737985] border border-[#E6E8EE] dark:bg-[#1D2028] dark:text-[#9CA3AF] dark:border-[#2A2E3B]',
    sale: 'bg-[#FDF2F2] text-[#D64545] border border-[#FCDADA] dark:bg-[#D64545]/15 dark:text-[#F87171] dark:border-[#D64545]/30',
    new: 'bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] dark:bg-[#5B5BD6]/15 dark:text-[#A5A5F5] dark:border-[#5B5BD6]/30',
    original: 'bg-[#F0FDF4] text-[#16845B] border border-[#DCFCE7] dark:bg-[#16845B]/15 dark:text-[#4ADE80] dark:border-[#16845B]/30',
    premium: 'bg-[#17191F] text-white dark:bg-[#F4F7FC] dark:text-[#17191F]',
    compatible: 'bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] dark:bg-[#5B5BD6]/15 dark:text-[#A5A5F5] dark:border-[#5B5BD6]/30',
    success: 'bg-[#EAF6F0] text-[#16845B] border border-[#CFEBDD] dark:bg-[#16845B]/15 dark:text-[#4ADE80] dark:border-[#16845B]/30',
    warning: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] dark:bg-[#D97706]/15 dark:text-[#FBBF24] dark:border-[#D97706]/30',
    brand: 'bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] dark:bg-[#5B5BD6]/15 dark:text-[#A5A5F5] dark:border-[#5B5BD6]/30'
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2 py-0.5 rounded-md'
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
