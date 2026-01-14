/**
 * Animation Presets and Timing Constants
 */

import type { Transition, Variants } from 'motion/react';

/** Default animation duration in seconds */
export const DEFAULT_DURATION = 0.4;

/** Stagger delay between children */
export const STAGGER_DELAY = 0.1;

/** Data flow animation duration */
export const FLOW_DURATION = 2;

/** Pulse animation duration */
export const PULSE_DURATION = 2;

/** Speed presets */
export const SPEED_PRESETS = [0.25, 0.5, 1, 1.5, 2, 4] as const;

/** Default spring config */
export const SPRING_CONFIG = {
  stiffness: 300,
  damping: 20,
  mass: 1,
} as const;

/** Bounce spring config */
export const BOUNCE_CONFIG = {
  stiffness: 400,
  damping: 10,
  mass: 1,
} as const;

/** Gentle spring config */
export const GENTLE_CONFIG = {
  stiffness: 100,
  damping: 15,
  mass: 0.5,
} as const;

/** Container variants for staggered children */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/** Service component variants */
export const serviceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...SPRING_CONFIG,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  tap: {
    scale: 0.98,
  },
  highlighted: {
    scale: 1.1,
    boxShadow: '0 0 30px rgba(255, 153, 0, 0.6)',
    transition: {
      type: 'spring',
      ...BOUNCE_CONFIG,
    },
  },
  dimmed: {
    opacity: 0.3,
    scale: 0.95,
    filter: 'grayscale(0.5)',
  },
  error: {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0 0 0 rgba(239, 68, 68, 0)',
      '0 0 20px rgba(239, 68, 68, 0.6)',
      '0 0 0 rgba(239, 68, 68, 0)',
    ],
    transition: {
      repeat: Infinity,
      duration: 1,
    },
  },
  success: {
    boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
  },
  processing: {
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 1.5,
    },
  },
};

/** Connection line variants */
export const connectionVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        type: 'spring',
        duration: 0.8,
        bounce: 0,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  highlighted: {
    opacity: 1,
    strokeWidth: 3,
    transition: {
      duration: 0.2,
    },
  },
  dimmed: {
    opacity: 0.2,
    strokeWidth: 1,
  },
};

/** Data packet variants */
export const packetVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      ...GENTLE_CONFIG,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.1,
    },
  },
};

/** Tooltip variants */
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 5,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

/** Control button variants */
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  tap: {
    scale: 0.9,
  },
};

/** Glow effect transition */
export const glowTransition: Transition = {
  repeat: Infinity,
  repeatType: 'reverse',
  duration: 1.5,
  ease: 'easeInOut',
};

/** Flow animation transition */
export const flowTransition = (duration: number): Transition => ({
  duration,
  repeat: Infinity,
  ease: 'linear',
});

/** Pulse animation variants */
export const pulseVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 1,
  },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: PULSE_DURATION,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Create stagger transition */
export function createStaggerTransition(
  delay: number = STAGGER_DELAY,
  direction: 1 | -1 = 1
): Transition {
  return {
    staggerChildren: delay,
    staggerDirection: direction,
  };
}

/** Create delay transition */
export function createDelayedTransition(delay: number): Transition {
  return {
    type: 'spring',
    ...SPRING_CONFIG,
    delay,
  };
}
