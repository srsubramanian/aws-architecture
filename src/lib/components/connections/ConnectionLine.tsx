/**
 * Connection Line Component
 * Renders animated SVG paths between services
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import type { Position, LineStyle, ArrowStyle, ConnectionType } from '../../types';
import { FLOW_COLORS } from '../../constants';
import { calculateCurvedPath, calculateStraightPath, calculateOrthogonalPath } from '../../utils';

export interface ConnectionLineProps {
  /** Unique connection ID */
  id: string;
  /** Start position */
  from: Position;
  /** End position */
  to: Position;
  /** Connection type */
  type?: ConnectionType;
  /** Line style */
  lineStyle?: LineStyle;
  /** Arrow style at end */
  arrowStyle?: ArrowStyle;
  /** Arrow style at start */
  startArrowStyle?: ArrowStyle;
  /** Path type */
  pathType?: 'straight' | 'curved' | 'orthogonal';
  /** Curve intensity (0-1) */
  curvature?: number;
  /** Line color override */
  color?: string;
  /** Line width */
  strokeWidth?: number;
  /** Whether line is highlighted */
  isHighlighted?: boolean;
  /** Whether line is dimmed */
  isDimmed?: boolean;
  /** Animation delay */
  animationDelay?: number;
  /** Whether to animate drawing */
  animateDraw?: boolean;
  /** Label text */
  label?: string;
  /** Label position (0-1 along path) */
  labelPosition?: number;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (id: string) => void;
}

// Arrow marker component
const ArrowMarker: React.FC<{
  id: string;
  color: string;
  style: ArrowStyle;
  direction: 'start' | 'end';
}> = ({ id, color, style, direction }) => {
  if (style === 'none') return null;

  const markerId = `${id}-${direction}`;
  const orient = direction === 'start' ? 'auto-start-reverse' : 'auto';

  return (
    <marker
      id={markerId}
      markerWidth="10"
      markerHeight="10"
      refX={direction === 'start' ? '0' : '10'}
      refY="5"
      orient={orient}
      markerUnits="strokeWidth"
    >
      {style === 'arrow' && (
        <path d="M0,0 L10,5 L0,10 L3,5 Z" fill={color} />
      )}
      {style === 'triangle' && (
        <path d="M0,0 L10,5 L0,10 Z" fill={color} />
      )}
      {style === 'diamond' && (
        <path d="M0,5 L5,0 L10,5 L5,10 Z" fill={color} />
      )}
    </marker>
  );
};

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  id,
  from,
  to,
  type = 'http',
  lineStyle = 'solid',
  arrowStyle = 'arrow',
  startArrowStyle = 'none',
  pathType = 'curved',
  curvature = 0.3,
  color,
  strokeWidth = 2,
  isHighlighted = false,
  isDimmed = false,
  animationDelay = 0,
  animateDraw = true,
  label,
  labelPosition = 0.5,
  className = '',
  onClick,
}) => {
  // Determine line color based on type
  const lineColor = useMemo(() => {
    if (color) return color;
    if (isHighlighted) return FLOW_COLORS.sync;

    switch (type) {
      case 'http':
      case 'https':
        return FLOW_COLORS.sync;
      case 'message-queue':
      case 'event':
        return FLOW_COLORS.async;
      case 'stream':
        return FLOW_COLORS.stream;
      case 'async':
        return FLOW_COLORS.async;
      default:
        return FLOW_COLORS.default;
    }
  }, [color, type, isHighlighted]);

  // Calculate path
  const pathD = useMemo(() => {
    switch (pathType) {
      case 'straight':
        return calculateStraightPath(from, to);
      case 'orthogonal':
        return calculateOrthogonalPath(from, to);
      case 'curved':
      default:
        return calculateCurvedPath(from, to, curvature);
    }
  }, [from, to, pathType, curvature]);

  // Get stroke dash array for line style
  const strokeDasharray = useMemo(() => {
    switch (lineStyle) {
      case 'dashed':
        return '8,4';
      case 'dotted':
        return '2,4';
      default:
        return undefined;
    }
  }, [lineStyle]);

  // Calculate label position
  const labelPoint = useMemo(() => {
    // Simple interpolation for label position
    return {
      x: from.x + (to.x - from.x) * labelPosition,
      y: from.y + (to.y - from.y) * labelPosition - 10,
    };
  }, [from, to, labelPosition]);

  return (
    <g className={clsx('connection-line', className)}>
      {/* Definitions for arrow markers */}
      <defs>
        <ArrowMarker id={id} color={lineColor} style={arrowStyle} direction="end" />
        <ArrowMarker id={id} color={lineColor} style={startArrowStyle} direction="start" />
      </defs>

      {/* Invisible hit area for easier clicking */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onClick={() => onClick?.(id)}
      />

      {/* Main connection line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={isHighlighted ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={arrowStyle !== 'none' ? `url(#${id}-end)` : undefined}
        markerStart={startArrowStyle !== 'none' ? `url(#${id}-start)` : undefined}
        initial={animateDraw ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{
          pathLength: 1,
          opacity: isDimmed ? 0.3 : 1,
        }}
        transition={{
          pathLength: {
            type: 'spring',
            duration: 0.8,
            bounce: 0,
            delay: animationDelay,
          },
          opacity: { duration: 0.2 },
        }}
        className={clsx(
          'cursor-pointer transition-all',
          isHighlighted && 'filter drop-shadow-lg'
        )}
        onClick={() => onClick?.(id)}
        style={{
          filter: isHighlighted ? `drop-shadow(0 0 6px ${lineColor})` : undefined,
        }}
      />

      {/* Label */}
      {label && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isDimmed ? 0.3 : 1 }}
          transition={{ delay: animationDelay + 0.5 }}
        >
          <rect
            x={labelPoint.x - 20}
            y={labelPoint.y - 8}
            width={40}
            height={16}
            rx={4}
            fill="white"
            stroke={lineColor}
            strokeWidth={1}
            className="dark:fill-gray-800"
          />
          <text
            x={labelPoint.x}
            y={labelPoint.y + 4}
            textAnchor="middle"
            className="text-[10px] fill-gray-700 dark:fill-gray-300"
          >
            {label}
          </text>
        </motion.g>
      )}
    </g>
  );
};

export default ConnectionLine;
