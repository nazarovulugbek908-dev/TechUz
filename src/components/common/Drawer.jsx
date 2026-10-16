import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right', // left | right
  maxWidth = 'max-w-md',
  className = ''
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17191F]/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-y-0 flex max-w-full',
          position === 'left' ? 'left-0' : 'right-0'
        )}
      >
        <div
          className={cn(
            'w-screen bg-white dark:bg-[#15171D] shadow-xl border-l border-[#E6E8EE] dark:border-[#2A2E3B] flex flex-col',
            maxWidth,
            className
          )}
          role="dialog"
          aria-modal="true"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
            <h3 className="text-base font-semibold text-[#17191F] dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#737985] hover:text-[#17191F] hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028] dark:hover:text-white transition-colors"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
