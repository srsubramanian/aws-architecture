/**
 * Architecture Renderer Component
 * Renders any architecture from a declarative config
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { DiagramCanvas } from '../components/diagrams/DiagramCanvas';
import { DiagramControls } from '../components/diagrams/DiagramControls';
import { DataFlow } from '../components/connections/DataFlow';
import { AWSService } from '../components/aws/shared/AWSService';
import { useDiagramControls } from '../hooks';
import { containerVariants } from '../constants/animation-presets';
import type { ArchitectureDefinition, ThemeType, Position } from '../types';

export interface ArchitectureRendererProps {
  /** Architecture definition to render */
  architecture: ArchitectureDefinition;
  /** Theme */
  theme?: ThemeType;
  /** Auto-play animations */
  autoPlay?: boolean;
  /** Animation speed */
  speed?: number;
  /** Show playback controls */
  showControls?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Calculate center of a service for connection points */
const getServiceCenter = (pos: Position, size: number = 80): Position => ({
  x: pos.x + size / 2,
  y: pos.y + size / 2,
});

/** Calculate connection points between two services */
const getConnectionPoints = (
  fromPos: Position,
  toPos: Position,
  size: number = 80
): { from: Position; to: Position } => {
  const fromCenter = getServiceCenter(fromPos, size);
  const toCenter = getServiceCenter(toPos, size);

  // Calculate direction
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const angle = Math.atan2(dy, dx);

  // Offset from center to edge
  const offset = size / 2;

  return {
    from: {
      x: fromCenter.x + Math.cos(angle) * offset,
      y: fromCenter.y + Math.sin(angle) * offset,
    },
    to: {
      x: toCenter.x - Math.cos(angle) * offset,
      y: toCenter.y - Math.sin(angle) * offset,
    },
  };
};

export const ArchitectureRenderer: React.FC<ArchitectureRendererProps> = ({
  architecture,
  theme = 'light',
  autoPlay = true,
  speed = 1,
  showControls = true,
  className = '',
}) => {
  const {
    playbackState,
    play,
    pause,
    stop,
    next,
    previous,
    setSpeed,
    toggleLoop,
    loopEnabled,
  } = useDiagramControls({
    totalSteps: architecture.connections.length,
    autoPlay,
    loop: true,
    stepDuration: 2000 / speed,
  });

  // Create a map of service IDs to positions
  const servicePositions = useMemo(() => {
    const map = new Map<string, Position>();
    architecture.services.forEach((service) => {
      map.set(service.id, service.position);
    });
    return map;
  }, [architecture.services]);

  const canvasWidth = architecture.canvas?.width ?? 1000;
  const canvasHeight = architecture.canvas?.height ?? 600;

  return (
    <div className={`architecture-renderer relative ${className}`}>
      <DiagramCanvas
        theme={theme}
        autoPlay={autoPlay}
        speed={speed}
        showControls={false}
      >
        <div style={{ width: canvasWidth, height: canvasHeight, position: 'relative' }}>
          {/* Title */}
          <div className="absolute top-4 left-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {architecture.name}
          </div>
          <div className="absolute top-10 left-4 text-sm text-gray-500 dark:text-gray-400">
            {architecture.description}
          </div>

          {/* Groups (VPC boundaries, etc.) */}
          {architecture.groups?.map((group) => {
            // Calculate group bounds from services
            const groupServices = architecture.services.filter((s) =>
              group.serviceIds.includes(s.id)
            );
            if (groupServices.length === 0) return null;

            const minX = Math.min(...groupServices.map((s) => s.position.x)) - 30;
            const minY = Math.min(...groupServices.map((s) => s.position.y)) - 40;
            const maxX = Math.max(...groupServices.map((s) => s.position.x)) + 110;
            const maxY = Math.max(...groupServices.map((s) => s.position.y)) + 110;

            return (
              <div
                key={group.id}
                className="absolute border-2 border-dashed rounded-xl"
                style={{
                  left: minX,
                  top: minY,
                  width: maxX - minX,
                  height: maxY - minY,
                  borderColor: group.color ?? '#A166FF',
                  backgroundColor: `${group.color ?? '#A166FF'}10`,
                }}
              >
                <span
                  className="absolute top-2 left-4 text-xs font-medium"
                  style={{ color: group.color ?? '#A166FF' }}
                >
                  {group.label}
                </span>
              </div>
            );
          })}

          {/* Services */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {architecture.services.map((service, index) => (
              <AWSService
                key={service.id}
                id={service.id}
                type={service.type}
                label={service.label}
                position={service.position}
                size="md"
                animationDelay={index * 0.1}
                metadata={
                  service.description
                    ? { name: service.label ?? service.type, description: service.description }
                    : undefined
                }
              />
            ))}
          </motion.div>

          {/* Connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasWidth}
            height={canvasHeight}
          >
            {architecture.connections.map((connection) => {
              const fromPos = servicePositions.get(connection.from);
              const toPos = servicePositions.get(connection.to);

              if (!fromPos || !toPos) return null;

              const points = getConnectionPoints(fromPos, toPos);

              return (
                <DataFlow
                  key={connection.id}
                  id={connection.id}
                  from={points.from}
                  to={points.to}
                  type={connection.type}
                  isActive={playbackState.isPlaying}
                  speed={speed}
                  label={connection.label}
                  packetType={connection.type === 'sync' ? 'request' : 'event'}
                />
              );
            })}
          </svg>

          {/* Legend */}
          {architecture.legend && architecture.legend.length > 0 && (
            <div className="absolute bottom-16 left-4 right-4 flex justify-center gap-8 text-xs text-gray-500 dark:text-gray-400">
              {architecture.legend.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div
                    className="w-8 h-0.5"
                    style={{
                      backgroundColor:
                        item.color ??
                        (item.type === 'sync'
                          ? '#3B82F6'
                          : item.type === 'async'
                          ? '#F59E0B'
                          : item.type === 'stream'
                          ? '#8B5CF6'
                          : item.type === 'batch'
                          ? '#10B981'
                          : '#6B7280'),
                      ...(item.type === 'async' && {
                        backgroundImage:
                          'repeating-linear-gradient(90deg, transparent, transparent 3px, currentColor 3px, currentColor 6px)',
                      }),
                    }}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DiagramCanvas>

      {/* Playback Controls */}
      {showControls && (
        <DiagramControls
          playbackState={playbackState}
          controls={{ play, pause, stop, next, previous, setSpeed }}
          loopEnabled={loopEnabled}
          onToggleLoop={toggleLoop}
          position="bottom"
          showStepControls={false}
        />
      )}
    </div>
  );
};

export default ArchitectureRenderer;
