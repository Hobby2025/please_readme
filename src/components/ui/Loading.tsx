import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        <div
          className={cn(
            'border-[3px] border-primary/10 rounded-full',
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            'absolute top-0 left-0 border-[3px] border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.5)]',
            sizeClasses[size]
          )}
        />
      </div>
    </div>
  );
}; 