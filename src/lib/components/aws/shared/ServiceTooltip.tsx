/**
 * Service Tooltip Component
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import type { ServiceMetadata, AWSServiceType } from '../../../types';
import { getServiceInfo } from '../../../constants/service-metadata';
import { tooltipVariants } from '../../../constants/animation-presets';

interface ServiceTooltipProps {
  /** Service type */
  type: AWSServiceType;
  /** Whether tooltip is visible */
  isVisible: boolean;
  /** Custom metadata */
  metadata?: ServiceMetadata;
  /** Custom content override */
  children?: React.ReactNode;
  /** Position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Additional CSS classes */
  className?: string;
}

export const ServiceTooltip: React.FC<ServiceTooltipProps> = ({
  type,
  isVisible,
  metadata,
  children,
  position = 'top',
  className = '',
}) => {
  const serviceInfo = getServiceInfo(type);

  const positionClasses = {
    top: 'bottom-full mb-3 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-3 left-1/2 -translate-x-1/2',
    left: 'right-full mr-3 top-1/2 -translate-y-1/2',
    right: 'left-full ml-3 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800 dark:border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800 dark:border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800 dark:border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800 dark:border-r-gray-700',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={clsx(
            'absolute z-50 pointer-events-none',
            positionClasses[position],
            className
          )}
        >
          <div className="relative">
            {/* Tooltip content */}
            <div className="bg-gray-800 dark:bg-gray-700 text-white rounded-lg shadow-xl p-3 min-w-[200px] max-w-[300px]">
              {children ?? (
                <>
                  {/* Header */}
                  <div className="font-semibold text-sm mb-1">
                    {metadata?.name ?? serviceInfo.name}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-gray-300 mb-2">
                    {metadata?.description ?? serviceInfo.description}
                  </div>

                  {/* Metadata details */}
                  {metadata && (
                    <div className="space-y-1 text-xs">
                      {metadata.instanceType && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Instance:</span>
                          <span className="text-gray-200">{metadata.instanceType}</span>
                        </div>
                      )}
                      {metadata.memory && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Memory:</span>
                          <span className="text-gray-200">{metadata.memory}</span>
                        </div>
                      )}
                      {metadata.cpu && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">CPU:</span>
                          <span className="text-gray-200">{metadata.cpu}</span>
                        </div>
                      )}
                      {metadata.storage && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Storage:</span>
                          <span className="text-gray-200">{metadata.storage}</span>
                        </div>
                      )}
                      {metadata.region && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Region:</span>
                          <span className="text-gray-200">{metadata.region}</span>
                        </div>
                      )}
                      {metadata.estimatedCost && (
                        <div className="flex justify-between border-t border-gray-600 pt-1 mt-1">
                          <span className="text-gray-400">Est. Cost:</span>
                          <span className="text-green-400 font-medium">
                            {metadata.estimatedCost}
                          </span>
                        </div>
                      )}
                      {/* Custom properties */}
                      {metadata.custom &&
                        Object.entries(metadata.custom).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-200">{String(value)}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Use cases */}
                  {!metadata && serviceInfo.useCases.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <div className="text-xs text-gray-400 mb-1">Use cases:</div>
                      <div className="flex flex-wrap gap-1">
                        {serviceInfo.useCases.slice(0, 3).map((useCase) => (
                          <span
                            key={useCase}
                            className="text-xs bg-gray-700 dark:bg-gray-600 px-1.5 py-0.5 rounded"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Arrow */}
            <div
              className={clsx(
                'absolute w-0 h-0 border-[6px]',
                arrowClasses[position]
              )}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceTooltip;
