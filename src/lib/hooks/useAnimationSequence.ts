/**
 * Hook for managing animation sequences
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnimationSequence, AnimationStep, PlaybackState } from '../types';
import { applySpeedMultiplier } from '../utils';

export interface UseAnimationSequenceOptions {
  /** Animation sequence to play */
  sequence: AnimationSequence;
  /** Whether to start playing automatically */
  autoPlay?: boolean;
  /** Initial playback speed */
  speed?: number;
  /** Whether to loop the sequence */
  loop?: boolean;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  /** Callback when sequence completes */
  onComplete?: () => void;
}

export interface UseAnimationSequenceReturn {
  /** Current playback state */
  playbackState: PlaybackState;
  /** Current step */
  currentStep: AnimationStep | null;
  /** Active target IDs for current step */
  activeTargets: string[];
  /** Play animation */
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
  /** Jump to specific step */
  goToStep: (step: number) => void;
  /** Toggle loop mode */
  toggleLoop: () => void;
  /** Whether loop is enabled */
  loopEnabled: boolean;
}

export function useAnimationSequence({
  sequence,
  autoPlay = false,
  speed: initialSpeed = 1,
  loop: initialLoop = false,
  onStepChange,
  onComplete,
}: UseAnimationSequenceOptions): UseAnimationSequenceReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: false,
    speed: initialSpeed,
    currentStep: 0,
    totalSteps: sequence.steps.length,
    progress: 0,
  });

  const [loopEnabled, setLoopEnabled] = useState(initialLoop);
  const [activeTargets, setActiveTargets] = useState<string[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  const currentStep = sequence.steps[playbackState.currentStep] ?? null;

  // Calculate step duration based on speed
  const getStepDuration = useCallback(
    (step: AnimationStep): number => {
      const baseDuration = step.animation.duration * 1000; // Convert to ms
      return applySpeedMultiplier(baseDuration, playbackState.speed);
    },
    [playbackState.speed]
  );

  // Move to next step
  const advanceStep = useCallback(() => {
    setPlaybackState((prev) => {
      const nextStep = prev.currentStep + 1;

      if (nextStep >= prev.totalSteps) {
        if (loopEnabled) {
          // Loop back to start
          onStepChange?.(0);
          return {
            ...prev,
            currentStep: 0,
            progress: 0,
          };
        } else {
          // Complete
          onComplete?.();
          return {
            ...prev,
            isPlaying: false,
            isPaused: false,
            progress: 100,
          };
        }
      }

      onStepChange?.(nextStep);
      return {
        ...prev,
        currentStep: nextStep,
        progress: (nextStep / prev.totalSteps) * 100,
      };
    });
  }, [loopEnabled, onStepChange, onComplete]);

  // Schedule next step
  const scheduleNextStep = useCallback(() => {
    if (!isPlayingRef.current) return;

    const step = sequence.steps[playbackState.currentStep];
    if (!step) return;

    // Update active targets
    setActiveTargets(step.targets);

    // Schedule advancement
    const duration = getStepDuration(step);
    timerRef.current = setTimeout(() => {
      advanceStep();
      scheduleNextStep();
    }, duration);
  }, [sequence.steps, playbackState.currentStep, getStepDuration, advanceStep]);

  // Play
  const play = useCallback(() => {
    isPlayingRef.current = true;
    setPlaybackState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));
  }, []);

  // Pause
  const pause = useCallback(() => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPlaybackState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, []);

  // Stop and reset
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveTargets([]);
    setPlaybackState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0,
    }));
    onStepChange?.(0);
  }, [onStepChange]);

  // Next step
  const next = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    advanceStep();
    if (isPlayingRef.current) {
      scheduleNextStep();
    }
  }, [advanceStep, scheduleNextStep]);

  // Previous step
  const previous = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPlaybackState((prev) => {
      const prevStep = Math.max(0, prev.currentStep - 1);
      onStepChange?.(prevStep);
      return {
        ...prev,
        currentStep: prevStep,
        progress: (prevStep / prev.totalSteps) * 100,
      };
    });
    if (isPlayingRef.current) {
      scheduleNextStep();
    }
  }, [onStepChange, scheduleNextStep]);

  // Set speed
  const setSpeed = useCallback((newSpeed: number) => {
    setPlaybackState((prev) => ({
      ...prev,
      speed: newSpeed,
    }));
  }, []);

  // Go to step
  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= sequence.steps.length) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setPlaybackState((prev) => ({
        ...prev,
        currentStep: step,
        progress: (step / prev.totalSteps) * 100,
      }));

      onStepChange?.(step);

      if (isPlayingRef.current) {
        scheduleNextStep();
      }
    },
    [sequence.steps.length, onStepChange, scheduleNextStep]
  );

  // Toggle loop
  const toggleLoop = useCallback(() => {
    setLoopEnabled((prev) => !prev);
  }, []);

  // Effect to handle play state changes
  useEffect(() => {
    if (playbackState.isPlaying && !playbackState.isPaused) {
      scheduleNextStep();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [playbackState.isPlaying, playbackState.isPaused, scheduleNextStep]);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay) {
      play();
    }
  }, [autoPlay, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    playbackState,
    currentStep,
    activeTargets,
    play,
    pause,
    stop,
    next,
    previous,
    setSpeed,
    goToStep,
    toggleLoop,
    loopEnabled,
  };
}
