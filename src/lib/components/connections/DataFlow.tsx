/**
 * Data Flow Component
 * Renders animated data flow with particles between services
 */

import React, { useMemo, useId } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import type { Position, DataFlowType, FlowDirection, DataPacketType } from '../../types';
import { FLOW_COLORS, PACKET_COLORS } from '../../constants';
import { calculateCurvedPath, calculateStraightPath } from '../../utils';

export interface DataFlowProps {
  /** Unique flow ID */
  id: string;
  /** Start position */
  from: Position;
  /** End position */
  to: Position;
  /** Flow type */
  type?: DataFlowType;
  /** Flow direction */
  direction?: FlowDirection;
  /** Packet type for visualization */
  packetType?: DataPacketType;
  /** Number of packets to show */
  packetCount?: number;
  /** Path type */
  pathType?: 'straight' | 'curved';
  /** Curve intensity */
  curvature?: number;
  /** Animation speed (1 = normal) */
  speed?: number;
  /** Whether flow is active */
  isActive?: boolean;
  /** Whether flow is highlighted */
  isHighlighted?: boolean;
  /** Custom line color */
  lineColor?: string;
  /** Custom packet color */
  packetColor?: string;
  /** Line width */
  strokeWidth?: number;
  /** Packet size */
  packetSize?: number;
  /** Label for the flow */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (id: string) => void;
}

export const DataFlow: React.FC<DataFlowProps> = ({
  id,
  from,
  to,
  type = 'sync',
  direction = 'forward',
  packetType = 'data',
  packetCount = 3,
  pathType = 'curved',
  curvature = 0.3,
  speed = 1,
  isActive = true,
  isHighlighted = false,
  lineColor,
  packetColor,
  strokeWidth = 2,
  packetSize = 8,
  label,
  className = '',
  onClick,
}) => {
  const instanceId = useId();
  const pathId = `flow-path-${id}-${instanceId}`;

  // Calculate path
  const pathD = useMemo(() => {
    return pathType === 'straight'
      ? calculateStraightPath(from, to)
      : calculateCurvedPath(from, to, curvature);
  }, [from, to, pathType, curvature]);

  // Determine colors
  const flowColor = lineColor ?? FLOW_COLORS[type] ?? FLOW_COLORS.default;
  const pkColor = packetColor ?? PACKET_COLORS[packetType] ?? PACKET_COLORS.data;

  // Calculate animation duration based on speed
  const baseDuration = 2;
  const animationDuration = baseDuration / speed;

  // Generate packet delays for staggered animation
  const packetDelays = useMemo(() => {
    return Array.from({ length: packetCount }, (_, i) => (i / packetCount) * animationDuration);
  }, [packetCount, animationDuration]);

  // Get dash pattern based on flow type
  const dashPattern = useMemo(() => {
    switch (type) {
      case 'async':
        return '8,4';
      case 'stream':
        return '4,2';
      case 'batch':
        return '12,6';
      case 'error':
        return '4,4';
      default:
        return undefined;
    }
  }, [type]);

  // Label position calculation
  const labelPoint = useMemo(() => {
    return {
      x: from.x + (to.x - from.x) * 0.5,
      y: from.y + (to.y - from.y) * 0.5 - 15,
    };
  }, [from, to]);

  return (
    <g className={clsx('data-flow', className)}>
      {/* Define the path for motion path animation */}
      <defs>
        <path id={pathId} d={pathD} />

        {/* Gradient for the flow line */}
        <linearGradient id={`flow-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={flowColor} stopOpacity={0.3} />
          <stop offset="50%" stopColor={flowColor} stopOpacity={1} />
          <stop offset="100%" stopColor={flowColor} stopOpacity={0.3} />
        </linearGradient>
      </defs>

      {/* Invisible hit area */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onClick={() => onClick?.(id)}
      />

      {/* Base flow line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={flowColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashPattern}
        strokeLinecap="round"
        strokeOpacity={isActive ? 0.4 : 0.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Animated flow overlay (when active) */}
      {isActive && (
        <motion.path
          d={pathD}
          fill="none"
          stroke={`url(#flow-gradient-${id})`}
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray="20,80"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: direction === 'backward' ? 200 : 0 }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            filter: isHighlighted ? `drop-shadow(0 0 4px ${flowColor})` : undefined,
          }}
        />
      )}

      {/* Data packets */}
      {isActive &&
        packetDelays.map((delay, index) => (
          <motion.g
            key={`packet-${id}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay }}
          >
            <motion.circle
              r={packetSize / 2}
              fill={pkColor}
              className="drop-shadow-sm"
              initial={{ offsetDistance: direction === 'backward' ? '100%' : '0%' }}
              animate={{ offsetDistance: direction === 'backward' ? '0%' : '100%' }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
              }}
              style={{
                offsetPath: `path('${pathD}')`,
                filter: `drop-shadow(0 0 3px ${pkColor})`,
              }}
            />
            {/* Inner glow for packet */}
            <motion.circle
              r={packetSize / 4}
              fill="white"
              opacity={0.8}
              initial={{ offsetDistance: direction === 'backward' ? '100%' : '0%' }}
              animate={{ offsetDistance: direction === 'backward' ? '0%' : '100%' }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
              }}
              style={{
                offsetPath: `path('${pathD}')`,
              }}
            />
          </motion.g>
        ))}

      {/* Error pulses for error type */}
      {type === 'error' && isActive && (
        <motion.circle
          r={packetSize}
          fill={FLOW_COLORS.error}
          initial={{ offsetDistance: '50%', scale: 0, opacity: 0.8 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          style={{
            offsetPath: `path('${pathD}')`,
          }}
        />
      )}

      {/* Bidirectional indicator */}
      {direction === 'bidirectional' && isActive && (
        <>
          {packetDelays.slice(0, Math.floor(packetCount / 2)).map((delay, index) => (
            <motion.circle
              key={`packet-reverse-${id}-${index}`}
              r={packetSize / 2}
              fill={pkColor}
              opacity={0.7}
              initial={{ offsetDistance: '100%' }}
              animate={{ offsetDistance: '0%' }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: 'linear',
                delay: delay + animationDuration / 2,
              }}
              style={{
                offsetPath: `path('${pathD}')`,
              }}
            />
          ))}
        </>
      )}

      {/* Flow label */}
      {label && (
        <g>
          <rect
            x={labelPoint.x - 25}
            y={labelPoint.y - 8}
            width={50}
            height={16}
            rx={4}
            fill="white"
            stroke={flowColor}
            strokeWidth={1}
            className="dark:fill-gray-800"
            opacity={0.95}
          />
          <text
            x={labelPoint.x}
            y={labelPoint.y + 4}
            textAnchor="middle"
            className="text-[10px] font-medium fill-gray-700 dark:fill-gray-300"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

export default DataFlow;
