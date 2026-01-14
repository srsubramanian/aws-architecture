/**
 * Animation Types and Interfaces
 */

import type { Transition, Variants } from 'motion/react';

/** Animation variant types */
export type AnimationVariant =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'scaleUp'
  | 'scaleDown'
  | 'bounce'
  | 'glow'
  | 'pulse'
  | 'shake'
  | 'rotate';

/** Easing function presets */
export type EasingPreset =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'spring'
  | 'bounce';

/** Animation state */
export type AnimationState = 'hidden' | 'visible' | 'exit' | 'hover' | 'tap';

/** Animation configuration */
export interface AnimationConfig {
  /** Type of animation */
  variant: AnimationVariant;
  /** Duration in seconds */
  duration: number;
  /** Delay before animation starts */
  delay?: number;
  /** Number of times to repeat (use Infinity for infinite) */
  repeat?: number;
  /** Delay between repeats */
  repeatDelay?: number;
  /** Whether to reverse on repeat */
  repeatType?: 'loop' | 'reverse' | 'mirror';
  /** Easing function */
  ease?: EasingPreset | number[];
}

/** Data flow animation types */
export type DataFlowType = 'sync' | 'async' | 'stream' | 'batch' | 'error';

/** Data flow direction */
export type FlowDirection = 'forward' | 'backward' | 'bidirectional';

/** Data packet types for visualization */
export type DataPacketType =
  | 'request'
  | 'response'
  | 'data'
  | 'event'
  | 'error'
  | 'success';

/** Data flow configuration */
export interface DataFlowConfig {
  /** Type of data flow */
  type: DataFlowType;
  /** Direction of flow */
  direction: FlowDirection;
  /** Color for the flow line */
  color?: string;
  /** Speed multiplier (1 = normal) */
  speed?: number;
  /** Whether to show data packets */
  showPackets?: boolean;
  /** Type of packets to show */
  packetType?: DataPacketType;
  /** Number of packets to show */
  packetCount?: number;
  /** Whether flow is active */
  isActive?: boolean;
  /** Label for the flow */
  label?: string;
}

/** Animation sequence step */
export interface AnimationStep {
  /** IDs of elements to animate */
  targets: string[];
  /** Animation to apply */
  animation: AnimationConfig;
  /** Whether to wait for completion before next step */
  waitForComplete?: boolean;
}

/** Animation sequence configuration */
export interface AnimationSequence {
  /** Unique sequence ID */
  id: string;
  /** Name of the sequence */
  name: string;
  /** Steps in the sequence */
  steps: AnimationStep[];
  /** Whether sequence loops */
  loop?: boolean;
  /** Delay between loops */
  loopDelay?: number;
}

/** Animation playback state */
export interface PlaybackState {
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Whether animation is paused */
  isPaused: boolean;
  /** Current playback speed */
  speed: number;
  /** Current step index in sequence */
  currentStep: number;
  /** Total steps in sequence */
  totalSteps: number;
  /** Progress as percentage (0-100) */
  progress: number;
}

/** Animation controls interface */
export interface AnimationControls {
  /** Start or resume playback */
  play: () => void;
  /** Pause playback */
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
}

/** Pre-defined motion variants for common animations */
export const motionVariants: Record<AnimationVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  },
  bounce: {
    hidden: { opacity: 0, scale: 0.3, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
    exit: { opacity: 0, scale: 0.3, y: 50 },
  },
  glow: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  },
  pulse: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: [1, 1.02, 1],
      transition: {
        scale: {
          repeat: Infinity,
          duration: 2,
        },
      },
    },
    exit: { opacity: 0, scale: 0.95 },
  },
  shake: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration: 0.5,
          repeatDelay: 2,
        },
      },
    },
    exit: { opacity: 0 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -180 },
    visible: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 },
  },
};

/** Pre-defined transitions */
export const transitions: Record<EasingPreset, Transition> = {
  linear: { ease: 'linear', duration: 0.3 },
  easeIn: { ease: 'easeIn', duration: 0.3 },
  easeOut: { ease: 'easeOut', duration: 0.3 },
  easeInOut: { ease: 'easeInOut', duration: 0.3 },
  spring: { type: 'spring', stiffness: 300, damping: 20 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
};
