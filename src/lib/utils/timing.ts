/**
 * Timing Utilities
 */

/** Default durations in seconds */
export const DURATIONS = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 1,
} as const;

/** Animation timing presets */
export const TIMING_PRESETS = {
  /** Quick UI feedback */
  feedback: {
    duration: DURATIONS.fast,
    ease: 'easeOut',
  },
  /** Standard transitions */
  standard: {
    duration: DURATIONS.normal,
    ease: 'easeInOut',
  },
  /** Entrance animations */
  entrance: {
    duration: DURATIONS.slow,
    ease: 'easeOut',
  },
  /** Exit animations */
  exit: {
    duration: DURATIONS.fast,
    ease: 'easeIn',
  },
  /** Emphasis animations */
  emphasis: {
    duration: DURATIONS.verySlow,
    ease: 'easeInOut',
  },
} as const;

/**
 * Calculate stagger delay for an item at a given index
 */
export function calculateStaggerDelay(
  index: number,
  baseDelay: number = 0.1,
  maxDelay: number = 2
): number {
  return Math.min(index * baseDelay, maxDelay);
}

/**
 * Create a sequence of delays for a group of items
 */
export function createDelaySequence(
  count: number,
  baseDelay: number = 0.1,
  startDelay: number = 0
): number[] {
  return Array.from({ length: count }, (_, i) => startDelay + i * baseDelay);
}

/**
 * Calculate animation duration based on distance
 */
export function calculateDurationByDistance(
  distance: number,
  speed: number = 200 // pixels per second
): number {
  return distance / speed;
}

/**
 * Apply speed multiplier to duration
 */
export function applySpeedMultiplier(duration: number, speed: number): number {
  if (speed <= 0) return duration;
  return duration / speed;
}

/**
 * Create a repeating interval timer
 */
export function createInterval(
  callback: () => void,
  intervalMs: number
): { start: () => void; stop: () => void } {
  let timerId: ReturnType<typeof setInterval> | null = null;

  return {
    start: () => {
      if (timerId === null) {
        timerId = setInterval(callback, intervalMs);
      }
    },
    stop: () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Create a timeout wrapper
 */
export function createTimeout(
  callback: () => void,
  delayMs: number
): { start: () => void; cancel: () => void } {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return {
    start: () => {
      if (timerId === null) {
        timerId = setTimeout(() => {
          callback();
          timerId = null;
        }, delayMs);
      }
    },
    cancel: () => {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Wait for a specified duration
 */
export function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

/**
 * Run a callback after animations would complete
 */
export function afterAnimation(
  durationSeconds: number,
  callback: () => void
): () => void {
  const timerId = setTimeout(callback, durationSeconds * 1000);
  return () => clearTimeout(timerId);
}
