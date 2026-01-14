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

          {/* Groups (AWS Cloud, VPC, AZ, Subnet boxes) - sorted by zIndex */}
          {[...(architecture.groups ?? [])]
            .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
            .map((group) => {
              // Calculate bounds from services if not explicitly set
              let bounds = group.bounds;
              if (!bounds && group.serviceIds && group.serviceIds.length > 0) {
                const groupServices = architecture.services.filter((s) =>
                  group.serviceIds!.includes(s.id)
                );
                if (groupServices.length === 0) return null;
                const minX = Math.min(...groupServices.map((s) => s.position.x)) - 30;
                const minY = Math.min(...groupServices.map((s) => s.position.y)) - 40;
                const maxX = Math.max(...groupServices.map((s) => s.position.x)) + 110;
                const maxY = Math.max(...groupServices.map((s) => s.position.y)) + 110;
                bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
              }
              if (!bounds) return null;

              // Style presets for different group types
              const stylePresets: Record<string, { bg: string; border: string; borderStyle: string; labelBg: string }> = {
                'aws-cloud': { bg: 'transparent', border: '#232F3E', borderStyle: 'solid', labelBg: '#232F3E' },
                'vpc': { bg: 'transparent', border: '#8C4FFF', borderStyle: 'solid', labelBg: 'transparent' },
                'az': { bg: 'rgba(232, 244, 248, 0.5)', border: '#147EB4', borderStyle: 'dashed', labelBg: 'transparent' },
                'subnet': { bg: 'rgba(232, 244, 248, 0.7)', border: '#00A4A6', borderStyle: 'dashed', labelBg: 'transparent' },
                'region': { bg: '#F5F5F5', border: '#147EB4', borderStyle: 'dashed', labelBg: 'transparent' },
                'custom': { bg: 'transparent', border: '#6B7280', borderStyle: 'dashed', labelBg: 'transparent' },
              };

              const defaultPreset = { bg: 'transparent', border: '#6B7280', borderStyle: 'dashed', labelBg: 'transparent' };
              const preset = stylePresets[group.style ?? 'custom'] ?? defaultPreset;
              const bgColor = group.backgroundColor ?? preset.bg;
              const borderColor = group.color ?? preset.border;
              const borderStyle = group.borderStyle ?? preset.borderStyle;
              const isAwsCloud = group.style === 'aws-cloud';
              const isVpc = group.style === 'vpc';

              return (
                <div
                  key={group.id}
                  className={`absolute rounded-lg ${isAwsCloud ? '' : ''}`}
                  style={{
                    left: bounds.x,
                    top: bounds.y,
                    width: bounds.width,
                    height: bounds.height,
                    backgroundColor: bgColor,
                    border: `2px ${borderStyle} ${borderColor}`,
                    zIndex: group.zIndex ?? 0,
                  }}
                >
                  {/* Label */}
                  <div
                    className={`absolute flex items-center gap-2 ${
                      isAwsCloud ? 'top-2 left-3' : 'top-1 left-3'
                    }`}
                    style={{
                      backgroundColor: preset.labelBg,
                      padding: isAwsCloud ? '4px 8px' : '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {/* AWS Cloud icon */}
                    {isAwsCloud && (
                      <svg width="20" height="12" viewBox="0 0 40 25" fill="none">
                        <path d="M13.7 19.4c-4.6-.3-8.1-4.3-7.8-9 .3-4.2 3.7-7.5 7.9-7.8 1.1-1.7 3-2.6 5-2.6 2.7 0 5.1 1.8 5.9 4.4 3.8.4 6.6 3.8 6.3 7.7-.3 3.5-3.2 6.2-6.7 6.3" stroke="#fff" strokeWidth="2"/>
                        <path d="M8 20l3-3m0 3l-3-3m20 3l3-3m0 3l-3-3" stroke="#F90" strokeWidth="2"/>
                      </svg>
                    )}
                    {/* VPC icon */}
                    {isVpc && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="2" stroke={borderColor} strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" stroke={borderColor} strokeWidth="2"/>
                      </svg>
                    )}
                    <span
                      className={`text-xs font-medium ${isAwsCloud ? 'text-white' : ''}`}
                      style={{ color: isAwsCloud ? '#fff' : borderColor }}
                    >
                      {group.label}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Services - render on top of groups */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 10 }}>
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
