/**
 * Hook for diagram playback controls
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { PlaybackState } from '../types';
import { SPEED_PRESETS } from '../constants';

export interface UseDiagramControlsOptions {
  /** Total number of animation steps */
  totalSteps?: number;
  /** Initial playback speed */
  initialSpeed?: number;
  /** Whether to auto-play */
  autoPlay?: boolean;
  /** Whether to loop */
  loop?: boolean;
  /** Step duration in ms */
  stepDuration?: number;
  /** Callback when playback state changes */
  onPlaybackChange?: (state: PlaybackState) => void;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
}

export interface UseDiagramControlsReturn {
  /** Current playback state */
  playbackState: PlaybackState;
  /** Play/resume animation */
  play: () => void;
  /** Pause animation */
  pause: () => void;
  /** Stop and reset */
  stop: () => void;
  /** Go to next step */
  next: () => void;
  /** Go to previous step */
  previous: () => void;
  /** Set playback speed */
  setSpeed: (speed: number) => void;
  /** Cycle to next speed preset */
  cycleSpeed: () => void;
  /** Jump to specific step */
  goToStep: (step: number) => void;
  /** Toggle loop mode */
  toggleLoop: () => void;
  /** Whether loop is enabled */
  loopEnabled: boolean;
  /** Toggle play/pause */
  togglePlayPause: () => void;
  /** Current speed index in presets */
  speedIndex: number;
}

export function useDiagramControls({
  totalSteps = 0,
  initialSpeed = 1,
  autoPlay = false,
  loop = false,
  stepDuration = 2000,
  onPlaybackChange,
  onStepChange,
}: UseDiagramControlsOptions = {}): UseDiagramControlsReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: autoPlay,
    isPaused: false,
    speed: initialSpeed,
    currentStep: 0,
    totalSteps,
    progress: 0,
  });

  const [loopEnabled, setLoopEnabled] = useState(loop);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(autoPlay);

  // Calculate speed index
  const speedIndex = SPEED_PRESETS.findIndex((s) => s === playbackState.speed);

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Update playback state and notify
  const updateState = useCallback(
    (updates: Partial<PlaybackState>) => {
      setPlaybackState((prev) => {
        const newState = { ...prev, ...updates };
        onPlaybackChange?.(newState);
        return newState;
      });
    },
    [onPlaybackChange]
  );

  // Schedule next step
  const scheduleNextStep = useCallback(() => {
    if (!isPlayingRef.current || totalSteps === 0) return;

    const adjustedDuration = stepDuration / playbackState.speed;

    timerRef.current = setTimeout(() => {
      setPlaybackState((prev) => {
        const nextStep = prev.currentStep + 1;

        if (nextStep >= totalSteps) {
          if (loopEnabled) {
            onStepChange?.(0);
            return {
              ...prev,
              currentStep: 0,
              progress: 0,
            };
          } else {
            isPlayingRef.current = false;
            return {
              ...prev,
              isPlaying: false,
              isPaused: false,
              currentStep: totalSteps - 1,
              progress: 100,
            };
          }
        }

        onStepChange?.(nextStep);
        return {
          ...prev,
          currentStep: nextStep,
          progress: (nextStep / (totalSteps - 1)) * 100,
        };
      });

      scheduleNextStep();
    }, adjustedDuration);
  }, [totalSteps, stepDuration, playbackState.speed, loopEnabled, onStepChange]);

  // Play
  const play = useCallback(() => {
    if (totalSteps === 0) return;

    isPlayingRef.current = true;
    updateState({
      isPlaying: true,
      isPaused: false,
    });
    scheduleNextStep();
  }, [totalSteps, updateState, scheduleNextStep]);

  // Pause
  const pause = useCallback(() => {
    isPlayingRef.current = false;
    clearTimer();
    updateState({
      isPlaying: false,
      isPaused: true,
    });
  }, [clearTimer, updateState]);

  // Stop
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    clearTimer();
    updateState({
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0,
    });
    onStepChange?.(0);
  }, [clearTimer, updateState, onStepChange]);

  // Next
  const next = useCallback(() => {
    clearTimer();
    setPlaybackState((prev) => {
      const nextStep = Math.min(prev.currentStep + 1, totalSteps - 1);
      onStepChange?.(nextStep);
      return {
        ...prev,
        currentStep: nextStep,
        progress: totalSteps > 1 ? (nextStep / (totalSteps - 1)) * 100 : 0,
      };
    });

    if (isPlayingRef.current) {
      scheduleNextStep();
    }
  }, [clearTimer, totalSteps, onStepChange, scheduleNextStep]);

  // Previous
  const previous = useCallback(() => {
    clearTimer();
    setPlaybackState((prev) => {
      const prevStep = Math.max(prev.currentStep - 1, 0);
      onStepChange?.(prevStep);
      return {
        ...prev,
        currentStep: prevStep,
        progress: totalSteps > 1 ? (prevStep / (totalSteps - 1)) * 100 : 0,
      };
    });

    if (isPlayingRef.current) {
      scheduleNextStep();
    }
  }, [clearTimer, totalSteps, onStepChange, scheduleNextStep]);

  // Set speed
  const setSpeed = useCallback(
    (speed: number) => {
      updateState({ speed });
      if (isPlayingRef.current) {
        clearTimer();
        scheduleNextStep();
      }
    },
    [updateState, clearTimer, scheduleNextStep]
  );

  // Cycle speed
  const cycleSpeed = useCallback(() => {
    const currentIndex = SPEED_PRESETS.findIndex((s) => s === playbackState.speed);
    const nextIndex = (currentIndex + 1) % SPEED_PRESETS.length;
    const nextSpeed = SPEED_PRESETS[nextIndex];
    if (nextSpeed !== undefined) {
      setSpeed(nextSpeed);
    }
  }, [playbackState.speed, setSpeed]);

  // Go to step
  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= totalSteps) return;

      clearTimer();
      updateState({
        currentStep: step,
        progress: totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 0,
      });
      onStepChange?.(step);

      if (isPlayingRef.current) {
        scheduleNextStep();
      }
    },
    [totalSteps, clearTimer, updateState, onStepChange, scheduleNextStep]
  );

  // Toggle loop
  const toggleLoop = useCallback(() => {
    setLoopEnabled((prev) => !prev);
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (playbackState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playbackState.isPlaying, pause, play]);

  // Update total steps when it changes
  useEffect(() => {
    setPlaybackState((prev) => ({
      ...prev,
      totalSteps,
      progress: totalSteps > 1 ? (prev.currentStep / (totalSteps - 1)) * 100 : 0,
    }));
  }, [totalSteps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && totalSteps > 0) {
      play();
    }
  }, [autoPlay, totalSteps, play]);

  return {
    playbackState,
    play,
    pause,
    stop,
    next,
    previous,
    setSpeed,
    cycleSpeed,
    goToStep,
    toggleLoop,
    loopEnabled,
    togglePlayPause,
    speedIndex,
  };
}
