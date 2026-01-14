/**
 * Service Label Component
 */

import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface ServiceLabelProps {
  /** Label text */
  label: string;
  /** Whether label is visible */
  isVisible?: boolean;
  /** Position relative to icon */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Additional CSS classes */
  className?: string;
}

export const ServiceLabel: React.FC<ServiceLabelProps> = ({
  label,
  isVisible = true,
  position = 'bottom',
  className = '',
}) => {
  if (!isVisible) return null;

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'absolute whitespace-nowrap text-center',
        'text-xs font-medium text-gray-700 dark:text-gray-300',
        'px-2 py-1 rounded bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'shadow-sm border border-gray-200 dark:border-gray-700',
        positionClasses[position],
        className
      )}
    >
      {label}
    </motion.div>
  );
};

export default ServiceLabel;
