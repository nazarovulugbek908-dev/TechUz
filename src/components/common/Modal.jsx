import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  className = '',
  contentClassName = ''
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17191F]/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-[#1D2028] rounded-xl shadow-xl border border-[#E6E8EE] dark:border-[#2A2E3B] z-10 overflow-hidden flex flex-col max-h-[90vh]',
          maxWidth,
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
            <h3 className="text-base font-semibold text-[#17191F] dark:text-[#F4F7FC]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] hover:bg-[#F7F8FA] dark:hover:bg-[#15171D] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className={cn('p-5 overflow-y-auto', contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
