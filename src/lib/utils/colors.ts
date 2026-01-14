/**
 * Color Utilities
 */

import type { ServiceCategory, ServiceVariant, DataFlowType, DataPacketType } from '../types';
import { CATEGORY_COLORS, FLOW_COLORS, PACKET_COLORS, STATUS_COLORS } from '../constants';

/**
 * Get color for a service category
 */
export function getCategoryColor(
  category: ServiceCategory,
  variant: 'primary' | 'secondary' | 'dark' | 'background' = 'primary'
): string {
  const colors = CATEGORY_COLORS[category];
  return colors[variant];
}

/**
 * Get the appropriate color for a service variant
 */
export function getVariantColor(variant: ServiceVariant): string {
  switch (variant) {
    case 'highlighted':
      return '#FF9900'; // AWS Orange
    case 'error':
      return STATUS_COLORS.error;
    case 'success':
      return STATUS_COLORS.healthy;
    case 'warning':
      return STATUS_COLORS.warning;
    case 'processing':
      return STATUS_COLORS.processing;
    case 'dimmed':
      return STATUS_COLORS.unknown;
    default:
      return 'transparent';
  }
}

/**
 * Get data flow color by type
 */
export function getFlowColor(type: DataFlowType): string {
  return FLOW_COLORS[type] ?? FLOW_COLORS.default;
}

/**
 * Get data packet color by type
 */
export function getPacketColor(type: DataPacketType): string {
  return PACKET_COLORS[type] ?? PACKET_COLORS.data;
}

/**
 * Lighten a hex color
 */
export function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Darken a hex color
 */
export function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Add alpha to hex color
 */
export function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Create gradient stops for data flow
 */
export function createFlowGradient(
  startColor: string,
  endColor: string,
  id: string
): { id: string; stops: Array<{ offset: string; color: string }> } {
  return {
    id,
    stops: [
      { offset: '0%', color: startColor },
      { offset: '100%', color: endColor },
    ],
  };
}

/**
 * Get contrasting text color for a background
 */
export function getContrastColor(hexColor: string): string {
  const num = parseInt(hexColor.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#1e293b' : '#ffffff';
}
