/**
 * AWS Brand Colors and Service Category Colors
 */

/** AWS Brand Colors */
export const AWS_BRAND = {
  /** Primary AWS Orange */
  orange: '#FF9900',
  /** Dark Orange */
  orangeDark: '#EC7211',
  /** Light Orange */
  orangeLight: '#FFBB00',
  /** AWS Blue */
  blue: '#146EB4',
  /** Dark Blue */
  blueDark: '#0F4A80',
  /** Light Blue */
  blueLight: '#1A8CDE',
  /** Squid Ink (dark background) */
  squid: '#232F3E',
  /** Smile (darkest) */
  smile: '#131A22',
  /** White */
  white: '#FFFFFF',
} as const;

/** Service Category Colors */
export const CATEGORY_COLORS = {
  compute: {
    primary: '#ED7100',
    secondary: '#F89A3C',
    dark: '#C85A00',
    background: 'rgba(237, 113, 0, 0.1)',
  },
  database: {
    primary: '#3B48CC',
    secondary: '#5C6BD4',
    dark: '#2A35A0',
    background: 'rgba(59, 72, 204, 0.1)',
  },
  networking: {
    primary: '#8C4FFF',
    secondary: '#A77BFF',
    dark: '#6B38CC',
    background: 'rgba(140, 79, 255, 0.1)',
  },
  storage: {
    primary: '#3F8624',
    secondary: '#5FA642',
    dark: '#2D6618',
    background: 'rgba(63, 134, 36, 0.1)',
  },
  messaging: {
    primary: '#E7157B',
    secondary: '#EE4A9B',
    dark: '#B80F60',
    background: 'rgba(231, 21, 123, 0.1)',
  },
  security: {
    primary: '#DD344C',
    secondary: '#E55D71',
    dark: '#B02A3E',
    background: 'rgba(221, 52, 76, 0.1)',
  },
  monitoring: {
    primary: '#E7157B',
    secondary: '#EE4A9B',
    dark: '#B80F60',
    background: 'rgba(231, 21, 123, 0.1)',
  },
} as const;

/** Data Flow Colors */
export const FLOW_COLORS = {
  /** Synchronous request/response */
  sync: '#3B82F6',
  /** Asynchronous operations */
  async: '#F59E0B',
  /** Streaming data */
  stream: '#8B5CF6',
  /** Batch processing */
  batch: '#10B981',
  /** Error/retry flows */
  error: '#EF4444',
  /** Success */
  success: '#22C55E',
  /** Default */
  default: '#94A3B8',
} as const;

/** Data Packet Colors */
export const PACKET_COLORS = {
  request: '#3B82F6',
  response: '#22C55E',
  data: '#F59E0B',
  event: '#8B5CF6',
  error: '#EF4444',
  success: '#22C55E',
} as const;

/** Status Colors */
export const STATUS_COLORS = {
  healthy: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  unknown: '#94A3B8',
  processing: '#3B82F6',
} as const;

/** Get color for a service category */
export function getCategoryColor(
  category: keyof typeof CATEGORY_COLORS,
  variant: 'primary' | 'secondary' | 'dark' | 'background' = 'primary'
): string {
  return CATEGORY_COLORS[category][variant];
}

/** Get flow color by type */
export function getFlowColor(type: keyof typeof FLOW_COLORS): string {
  return FLOW_COLORS[type];
}

/** Get packet color by type */
export function getPacketColor(type: keyof typeof PACKET_COLORS): string {
  return PACKET_COLORS[type];
}
