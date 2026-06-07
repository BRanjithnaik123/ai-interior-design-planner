import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', glass = false, ...props }, ref) => {
    const baseClasses = glass ? 'glass-panel' : 'bg-[#1A1A3E] rounded-2xl border border-[rgba(255,255,255,0.08)]';
    return (
      <div ref={ref} className={`${baseClasses} p-6 h-full ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
