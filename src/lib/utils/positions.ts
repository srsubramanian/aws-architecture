/**
 * Position and Layout Utilities
 */

import type { Position, ServiceSize } from '../types';

/** Size dimensions in pixels */
export const SIZE_DIMENSIONS: Record<ServiceSize, { width: number; height: number }> = {
  sm: { width: 60, height: 60 },
  md: { width: 80, height: 80 },
  lg: { width: 100, height: 100 },
  xl: { width: 120, height: 120 },
};

/** Default grid size for snapping */
export const DEFAULT_GRID_SIZE = 20;

/**
 * Snap position to grid
 */
export function snapToGrid(position: Position, gridSize: number = DEFAULT_GRID_SIZE): Position {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Get center point of a service component
 */
export function getServiceCenter(position: Position, size: ServiceSize = 'md'): Position {
  const dimensions = SIZE_DIMENSIONS[size];
  return {
    x: position.x + dimensions.width / 2,
    y: position.y + dimensions.height / 2,
  };
}

/**
 * Get connection point on the edge of a service component
 */
export function getConnectionPoint(
  position: Position,
  size: ServiceSize,
  direction: 'top' | 'right' | 'bottom' | 'left'
): Position {
  const dimensions = SIZE_DIMENSIONS[size];
  const center = getServiceCenter(position, size);

  switch (direction) {
    case 'top':
      return { x: center.x, y: position.y };
    case 'right':
      return { x: position.x + dimensions.width, y: center.y };
    case 'bottom':
      return { x: center.x, y: position.y + dimensions.height };
    case 'left':
      return { x: position.x, y: center.y };
  }
}

/**
 * Calculate the best connection points between two services
 */
export function calculateConnectionPoints(
  fromPos: Position,
  fromSize: ServiceSize,
  toPos: Position,
  toSize: ServiceSize
): { from: Position; to: Position; fromDirection: string; toDirection: string } {
  const fromCenter = getServiceCenter(fromPos, fromSize);
  const toCenter = getServiceCenter(toPos, toSize);

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Determine primary direction
  let fromDirection: 'top' | 'right' | 'bottom' | 'left';
  let toDirection: 'top' | 'right' | 'bottom' | 'left';

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal connection
    fromDirection = dx > 0 ? 'right' : 'left';
    toDirection = dx > 0 ? 'left' : 'right';
  } else {
    // Vertical connection
    fromDirection = dy > 0 ? 'bottom' : 'top';
    toDirection = dy > 0 ? 'top' : 'bottom';
  }

  return {
    from: getConnectionPoint(fromPos, fromSize, fromDirection),
    to: getConnectionPoint(toPos, toSize, toDirection),
    fromDirection,
    toDirection,
  };
}

/**
 * Calculate bounding box for a set of positions
 */
export function calculateBoundingBox(
  positions: Array<{ position: Position; size: ServiceSize }>
): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } {
  if (positions.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const { position, size } of positions) {
    const dimensions = SIZE_DIMENSIONS[size];
    minX = Math.min(minX, position.x);
    minY = Math.min(minY, position.y);
    maxX = Math.max(maxX, position.x + dimensions.width);
    maxY = Math.max(maxY, position.y + dimensions.height);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Calculate zoom to fit all services in viewport
 */
export function calculateZoomToFit(
  boundingBox: { width: number; height: number },
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 40
): number {
  const scaleX = (viewportWidth - padding * 2) / boundingBox.width;
  const scaleY = (viewportHeight - padding * 2) / boundingBox.height;
  return Math.min(scaleX, scaleY, 1);
}

/**
 * Calculate center offset for centering content
 */
export function calculateCenterOffset(
  boundingBox: { minX: number; minY: number; width: number; height: number },
  viewportWidth: number,
  viewportHeight: number,
  zoom: number
): { x: number; y: number } {
  const scaledWidth = boundingBox.width * zoom;
  const scaledHeight = boundingBox.height * zoom;

  return {
    x: (viewportWidth - scaledWidth) / 2 - boundingBox.minX * zoom,
    y: (viewportHeight - scaledHeight) / 2 - boundingBox.minY * zoom,
  };
}

/**
 * Generate grid positions for a list of items
 */
export function generateGridPositions(
  count: number,
  columns: number,
  spacing: { x: number; y: number },
  startPosition: Position = { x: 0, y: 0 }
): Position[] {
  const positions: Position[] = [];

  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    positions.push({
      x: startPosition.x + col * spacing.x,
      y: startPosition.y + row * spacing.y,
    });
  }

  return positions;
}

/**
 * Generate horizontal layout positions
 */
export function generateHorizontalPositions(
  count: number,
  spacing: number,
  startPosition: Position = { x: 0, y: 0 }
): Position[] {
  return Array.from({ length: count }, (_, i) => ({
    x: startPosition.x + i * spacing,
    y: startPosition.y,
  }));
}

/**
 * Generate vertical layout positions
 */
export function generateVerticalPositions(
  count: number,
  spacing: number,
  startPosition: Position = { x: 0, y: 0 }
): Position[] {
  return Array.from({ length: count }, (_, i) => ({
    x: startPosition.x,
    y: startPosition.y + i * spacing,
  }));
}

/**
 * Distance between two points
 */
export function distance(p1: Position, p2: Position): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Angle between two points in radians
 */
export function angle(p1: Position, p2: Position): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Point along a line at a given percentage
 */
export function pointAlongLine(p1: Position, p2: Position, percentage: number): Position {
  return {
    x: p1.x + (p2.x - p1.x) * percentage,
    y: p1.y + (p2.y - p1.y) * percentage,
  };
}
