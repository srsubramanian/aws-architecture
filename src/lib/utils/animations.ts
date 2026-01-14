/**
 * Animation Utilities
 */

import type { Variants, Transition, TargetAndTransition } from 'motion/react';
import type { AnimationVariant, AnimationConfig, EasingPreset } from '../types';
import { SPRING_CONFIG, BOUNCE_CONFIG, GENTLE_CONFIG } from '../constants';

/** Easing functions mapped to motion values */
export const EASING_MAP: Record<EasingPreset, string | number[]> = {
  linear: 'linear',
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  spring: 'spring',
  bounce: 'bounce',
};

/**
 * Create animation variants from config
 */
export function createVariants(config: AnimationConfig): Variants {
  const { variant, duration, delay = 0, repeat, repeatDelay, repeatType } = config;

  const baseTransition: Transition = {
    duration,
    delay,
    repeat: repeat === Infinity ? Infinity : repeat,
    repeatDelay,
    repeatType,
  };

  const variantMap: Record<AnimationVariant, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: baseTransition },
      exit: { opacity: 0, transition: { duration: duration / 2 } },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: baseTransition },
      exit: { opacity: 0, y: -30, transition: { duration: duration / 2 } },
    },
    slideDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0, transition: baseTransition },
      exit: { opacity: 0, y: 30, transition: { duration: duration / 2 } },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: baseTransition },
      exit: { opacity: 0, x: -30, transition: { duration: duration / 2 } },
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: baseTransition },
      exit: { opacity: 0, x: 30, transition: { duration: duration / 2 } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: baseTransition },
      exit: { opacity: 0, scale: 0.8, transition: { duration: duration / 2 } },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1, transition: { ...baseTransition, type: 'spring', ...SPRING_CONFIG } },
      exit: { opacity: 0, scale: 1.2, transition: { duration: duration / 2 } },
    },
    scaleDown: {
      hidden: { opacity: 0, scale: 1.3 },
      visible: { opacity: 1, scale: 1, transition: baseTransition },
      exit: { opacity: 0, scale: 0.7, transition: { duration: duration / 2 } },
    },
    bounce: {
      hidden: { opacity: 0, scale: 0.3, y: 50 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { ...baseTransition, type: 'spring', ...BOUNCE_CONFIG }
      },
      exit: { opacity: 0, scale: 0.3, y: 50, transition: { duration: duration / 2 } },
    },
    glow: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: baseTransition },
      exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: duration / 2 } },
    },
    pulse: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: [1, 1.02, 1],
        transition: {
          scale: { repeat: Infinity, duration: 2 },
          opacity: { duration: 0.3 },
        },
      },
      exit: { opacity: 0, scale: 0.95, transition: { duration: duration / 2 } },
    },
    shake: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        x: [0, -5, 5, -5, 5, 0],
        transition: {
          x: { repeat: Infinity, duration: 0.5, repeatDelay: 2 },
          opacity: { duration: 0.3 },
        },
      },
      exit: { opacity: 0, transition: { duration: duration / 2 } },
    },
    rotate: {
      hidden: { opacity: 0, rotate: -180, scale: 0.5 },
      visible: { opacity: 1, rotate: 0, scale: 1, transition: baseTransition },
      exit: { opacity: 0, rotate: 180, scale: 0.5, transition: { duration: duration / 2 } },
    },
  };

  return variantMap[variant];
}

/**
 * Create a spring transition
 */
export function createSpringTransition(
  config: Partial<typeof SPRING_CONFIG> = {}
): Transition {
  return {
    type: 'spring',
    ...SPRING_CONFIG,
    ...config,
  };
}

/**
 * Create a gentle spring transition
 */
export function createGentleTransition(): Transition {
  return {
    type: 'spring',
    ...GENTLE_CONFIG,
  };
}

/**
 * Create a stagger container variants
 */
export function createStaggerContainer(
  staggerDelay: number = 0.1,
  delayChildren: number = 0
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDelay / 2,
        staggerDirection: -1,
      },
    },
  };
}

/**
 * Create hover animation
 */
export function createHoverAnimation(scale: number = 1.05): TargetAndTransition {
  return {
    scale,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  };
}

/**
 * Create tap animation
 */
export function createTapAnimation(scale: number = 0.95): TargetAndTransition {
  return {
    scale,
  };
}

/**
 * Create glow shadow
 */
export function createGlowShadow(color: string, intensity: number = 20): string {
  return `0 0 ${intensity}px ${color}`;
}

/**
 * Calculate path for curved connection between two points
 */
export function calculateCurvedPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  curvature: number = 0.3
): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Control points for cubic bezier - use dy for vertical curve offset
  const cx1 = start.x + dx * curvature;
  const cy1 = start.y + dy * curvature * 0.5;
  const cx2 = end.x - dx * curvature;
  const cy2 = end.y - dy * curvature * 0.5;

  return `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;
}

/**
 * Calculate path for straight connection between two points
 */
export function calculateStraightPath(
  start: { x: number; y: number },
  end: { x: number; y: number }
): string {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

/**
 * Calculate orthogonal (right-angle) path between two points
 */
export function calculateOrthogonalPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  direction: 'horizontal-first' | 'vertical-first' = 'horizontal-first'
): string {
  if (direction === 'horizontal-first') {
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  } else {
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  }
}

/**
 * Get path length for animation
 */
export function getPathLength(path: SVGPathElement): number {
  return path.getTotalLength();
}

/**
 * Create flow animation keyframes
 */
export function createFlowKeyframes(
  duration: number,
  reverse: boolean = false
): { strokeDashoffset: number[]; transition: Transition } {
  return {
    strokeDashoffset: reverse ? [0, 100] : [100, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'linear',
    },
  };
}

/**
 * Create packet animation along path
 */
export function createPacketAnimation(
  duration: number,
  delay: number = 0
): { offsetDistance: string[]; transition: Transition } {
  return {
    offsetDistance: ['0%', '100%'],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    },
  };
}
