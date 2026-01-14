/**
 * Base AWS Service Component
 * This is the foundation component that all AWS service components extend
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import type { AWSServiceType, AWSServiceBaseProps } from '../../../types';
import { getServiceCategory } from '../../../types/aws-services.types';
import { getCategoryColor } from '../../../utils/colors';
import { SIZE_DIMENSIONS } from '../../../utils/positions';
import { serviceVariants, createDelayedTransition } from '../../../constants/animation-presets';
import { ServiceIcon } from './ServiceIcon';
import { ServiceTooltip } from './ServiceTooltip';

export interface AWSServiceProps extends AWSServiceBaseProps {
  /** AWS service type */
  type: AWSServiceType;
  /** Icon base path for official icons */
  iconBasePath?: string;
  /** Force use of fallback icons */
  useFallbackIcon?: boolean;
  /** Show service border */
  showBorder?: boolean;
  /** Show background */
  showBackground?: boolean;
}

export const AWSService: React.FC<AWSServiceProps> = ({
  id,
  type,
  label,
  position,
  size = 'md',
  variant = 'default',
  onClick,
  onHoverStart,
  onHoverEnd,
  metadata,
  animationDelay = 0,
  showTooltip = true,
  tooltipContent,
  isSelected = false,
  isInFlow = false,
  className = '',
  zIndex = 1,
  iconBasePath,
  useFallbackIcon = false,
  showBorder = true,
  showBackground = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const category = getServiceCategory(type);
  const categoryColor = getCategoryColor(category);
  const dimensions = SIZE_DIMENSIONS[size];

  // Handle hover start
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    onHoverStart?.(id);
  }, [id, onHoverStart]);

  // Handle hover end
  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    onHoverEnd?.(id);
  }, [id, onHoverEnd]);

  // Handle click
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  // Determine current animation variant
  const currentVariant = useMemo(() => {
    if (isSelected) return 'highlighted';
    if (variant !== 'default') return variant;
    return 'visible';
  }, [isSelected, variant]);

  // Create variant-specific styles
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'error':
        return {
          borderColor: '#ef4444',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
        };
      case 'success':
        return {
          borderColor: '#22c55e',
          boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)',
        };
      case 'warning':
        return {
          borderColor: '#f59e0b',
          boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
        };
      case 'highlighted':
        return {
          borderColor: categoryColor,
          boxShadow: `0 0 20px ${categoryColor}80`,
        };
      case 'processing':
        return {
          borderColor: '#3b82f6',
        };
      case 'dimmed':
        return {
          opacity: 0.4,
          filter: 'grayscale(0.5)',
        };
      default:
        return {};
    }
  }, [variant, categoryColor]);

  // Determine if in an active/highlighted state
  const isActive = isSelected || isInFlow || isHovered;

  return (
    <motion.div
      id={id}
      className={clsx(
        'absolute cursor-pointer select-none',
        'flex flex-col items-center justify-center',
        'transition-colors',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height + (label ? 24 : 0),
        zIndex: isActive ? zIndex + 10 : zIndex,
      }}
      variants={serviceVariants}
      initial="hidden"
      animate={currentVariant}
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      transition={createDelayedTransition(animationDelay)}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
      role="button"
      aria-label={label ?? type}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Service container */}
      <motion.div
        className={clsx(
          'relative flex items-center justify-center rounded-lg',
          showBorder && 'border-2',
          showBackground && 'bg-white dark:bg-gray-800',
          'transition-all duration-200'
        )}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          borderColor: showBorder ? (isActive ? categoryColor : '#e2e8f0') : 'transparent',
          ...variantStyles,
        }}
        animate={
          variant === 'processing'
            ? {
                scale: [1, 1.02, 1],
                transition: { repeat: Infinity, duration: 1.5 },
              }
            : variant === 'error'
              ? {
                  boxShadow: [
                    '0 0 0 rgba(239, 68, 68, 0)',
                    '0 0 20px rgba(239, 68, 68, 0.6)',
                    '0 0 0 rgba(239, 68, 68, 0)',
                  ],
                  transition: { repeat: Infinity, duration: 1 },
                }
              : {}
        }
      >
        {/* Category color indicator */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-md"
          style={{ backgroundColor: categoryColor }}
        />

        {/* Service icon */}
        <ServiceIcon
          type={type}
          size={dimensions.width * 0.5}
          iconBasePath={iconBasePath}
          useFallback={useFallbackIcon}
        />

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 pointer-events-none"
            style={{ borderColor: categoryColor }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              transition: { repeat: Infinity, duration: 1.5 },
            }}
          />
        )}

        {/* Flow indicator */}
        {isInFlow && !isSelected && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: `0 0 15px ${categoryColor}60`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.div>

      {/* Label */}
      {label && (
        <div className="mt-1 text-xs font-medium text-center text-gray-700 dark:text-gray-300 max-w-full truncate px-1">
          {label}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <ServiceTooltip
          type={type}
          isVisible={isHovered}
          metadata={metadata}
          position="top"
        >
          {tooltipContent}
        </ServiceTooltip>
      )}
    </motion.div>
  );
};

export default AWSService;
