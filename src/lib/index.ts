/**
 * AWS Architecture Animations Library
 *
 * Production-ready animated AWS architecture diagram components for React
 *
 * @packageDocumentation
 */

// Types
export * from './types';

// Constants
export {
  AWS_BRAND,
  CATEGORY_COLORS,
  FLOW_COLORS,
  PACKET_COLORS,
  STATUS_COLORS,
  getCategoryColor,
  getFlowColor,
  getPacketColor,
  DEFAULT_DURATION,
  STAGGER_DELAY,
  FLOW_DURATION,
  PULSE_DURATION,
  SPEED_PRESETS,
  SPRING_CONFIG,
  BOUNCE_CONFIG,
  GENTLE_CONFIG,
  containerVariants,
  serviceVariants,
  connectionVariants,
  packetVariants,
  tooltipVariants,
  buttonVariants,
  glowTransition,
  flowTransition,
  pulseVariants,
  createStaggerTransition,
  createDelayedTransition,
  SERVICE_METADATA,
  getServiceInfo,
  getServicesByCategory,
} from './constants';

// Utils
export {
  createVariants,
  createSpringTransition,
  createGentleTransition,
  createStaggerContainer,
  createHoverAnimation,
  createTapAnimation,
  createGlowShadow,
  calculateCurvedPath,
  calculateStraightPath,
  calculateOrthogonalPath,
  createFlowKeyframes,
  createPacketAnimation,
  lightenColor,
  darkenColor,
  hexToRgba,
  createFlowGradient,
  getContrastColor,
  getVariantColor,
  SIZE_DIMENSIONS,
  DEFAULT_GRID_SIZE,
  snapToGrid,
  getServiceCenter,
  getConnectionPoint,
  calculateConnectionPoints,
  calculateBoundingBox,
  calculateZoomToFit,
  calculateCenterOffset,
  generateGridPositions,
  generateHorizontalPositions,
  generateVerticalPositions,
  distance,
  angle,
  pointAlongLine,
  DURATIONS,
  TIMING_PRESETS,
  calculateStaggerDelay,
  createDelaySequence,
  calculateDurationByDistance,
  applySpeedMultiplier,
  createInterval,
  createTimeout,
  wait,
  afterAnimation,
} from './utils';

// Hooks
export * from './hooks';

// AWS Components
export * from './components/aws';

// Connection Components
export * from './components/connections';

// Diagram Components
export * from './components/diagrams';

// Pre-built Templates
export * from './components/templates';
