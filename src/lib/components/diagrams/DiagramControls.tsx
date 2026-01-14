/**
 * Diagram Controls Component
 * Playback controls for diagram animations
 */

import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import type { DiagramControlsProps } from '../../types';
import { SPEED_PRESETS } from '../../constants';
import { buttonVariants } from '../../constants/animation-presets';

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  size = 'md',
}) => (
  <motion.button
    variants={buttonVariants}
    initial="idle"
    whileHover="hover"
    whileTap="tap"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={clsx(
      'flex items-center justify-center rounded-lg transition-colors',
      size === 'sm' ? 'w-8 h-8' : 'w-10 h-10',
      isActive
        ? 'bg-aws-orange text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    {icon}
  </motion.button>
);

export const DiagramControls: React.FC<DiagramControlsProps> = ({
  playbackState,
  controls,
  loopEnabled = false,
  onToggleLoop,
  position = 'bottom',
  showStepControls = true,
  className = '',
}) => {
  const { isPlaying, speed, currentStep, totalSteps, progress } = playbackState;
  const { play, pause, stop, next, previous, setSpeed } = controls;

  // Cycle through speed presets
  const cycleSpeed = useCallback(() => {
    const currentIndex = SPEED_PRESETS.indexOf(speed as typeof SPEED_PRESETS[number]);
    const nextIndex = (currentIndex + 1) % SPEED_PRESETS.length;
    const nextSpeed = SPEED_PRESETS[nextIndex];
    if (nextSpeed !== undefined) {
      setSpeed(nextSpeed);
    }
  }, [speed, setSpeed]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
    floating: 'top-4 right-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'diagram-controls absolute z-20',
        'bg-white dark:bg-gray-800 rounded-xl shadow-lg',
        'border border-gray-200 dark:border-gray-700',
        'p-2',
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Step controls (optional) */}
        {showStepControls && (
          <>
            <ControlButton
              icon={<SkipBack size={18} />}
              label="Previous step"
              onClick={previous}
              disabled={currentStep === 0}
              size="sm"
            />
          </>
        )}

        {/* Main playback controls */}
        <ControlButton
          icon={<Square size={18} />}
          label="Stop"
          onClick={stop}
          size="sm"
        />

        <ControlButton
          icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
          label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlayPause}
          isActive={isPlaying}
        />

        {showStepControls && (
          <ControlButton
            icon={<SkipForward size={18} />}
            label="Next step"
            onClick={next}
            disabled={currentStep >= totalSteps - 1}
            size="sm"
          />
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />

        {/* Speed control */}
        <button
          onClick={cycleSpeed}
          className={clsx(
            'px-2 py-1 rounded-lg text-sm font-medium min-w-[50px] text-center',
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            'hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
          )}
          title="Click to change speed"
        >
          {speed}x
        </button>

        {/* Loop toggle */}
        {onToggleLoop && (
          <ControlButton
            icon={<Repeat size={18} />}
            label={loopEnabled ? 'Disable loop' : 'Enable loop'}
            onClick={onToggleLoop}
            isActive={loopEnabled}
            size="sm"
          />
        )}

        {/* Progress indicator */}
        {totalSteps > 0 && (
          <>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />
            <div className="flex items-center gap-2">
              {/* Progress bar */}
              <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-aws-orange rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {/* Step counter */}
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
                {currentStep + 1}/{totalSteps}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

/** Standalone zoom controls component */
export interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitToScreen?: () => void;
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitToScreen,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'zoom-controls absolute z-20 bottom-4 right-4',
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg',
        'border border-gray-200 dark:border-gray-700',
        'p-1 flex items-center gap-1',
        className
      )}
    >
      <ControlButton
        icon={<ZoomOut size={16} />}
        label="Zoom out"
        onClick={onZoomOut}
        disabled={zoom <= 0.1}
        size="sm"
      />

      <button
        onClick={onZoomReset}
        className={clsx(
          'px-2 py-1 text-xs font-medium min-w-[45px] text-center',
          'text-gray-600 dark:text-gray-300',
          'hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
        )}
        title="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>

      <ControlButton
        icon={<ZoomIn size={16} />}
        label="Zoom in"
        onClick={onZoomIn}
        disabled={zoom >= 3}
        size="sm"
      />

      {onFitToScreen && (
        <ControlButton
          icon={<Maximize2 size={16} />}
          label="Fit to screen"
          onClick={onFitToScreen}
          size="sm"
        />
      )}
    </div>
  );
};

export default DiagramControls;
