/**
 * Diagram Canvas Component
 * Main container for rendering AWS architecture diagrams
 */

import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import type { DiagramCanvasProps } from '../../types';
import { defaultCanvasConfig } from '../../types/diagram.types';
import { containerVariants } from '../../constants/animation-presets';
import { DiagramProvider, useDiagram } from './DiagramProvider';

interface CanvasInnerProps extends Omit<DiagramCanvasProps, 'config' | 'theme'> {
  width?: number;
  height?: number;
  showGrid?: boolean;
  gridSize?: number;
}

const CanvasInner: React.FC<CanvasInnerProps> = ({
  width = defaultCanvasConfig.width,
  height = defaultCanvasConfig.height,
  showGrid = true,
  gridSize = defaultCanvasConfig.gridSize,
  className = '',
  children,
}) => {
  const { state, updateViewport } = useDiagram();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen change events (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Handle mouse wheel zoom (requires Ctrl/Cmd key to prevent accidental zoom)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Only zoom if Ctrl (Windows/Linux) or Cmd (Mac) is held
    if (!e.ctrlKey && !e.metaKey) {
      return; // Allow normal page scroll
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, state.viewport.zoom * delta));
    updateViewport({ zoom: newZoom });
  }, [state.viewport.zoom, updateViewport]);

  // Handle pan start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - state.viewport.panX, y: e.clientY - state.viewport.panY });
    }
  }, [state.viewport.panX, state.viewport.panY]);

  // Handle pan move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      updateViewport({
        panX: e.clientX - dragStart.x,
        panY: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, updateViewport]);

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Grid pattern
  const gridPattern = useMemo(() => {
    if (!showGrid) return null;

    const scaledGridSize = gridSize * state.viewport.zoom;

    return (
      <pattern
        id="grid-pattern"
        width={scaledGridSize}
        height={scaledGridSize}
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx={scaledGridSize / 2}
          cy={scaledGridSize / 2}
          r={1}
          className="fill-gray-300 dark:fill-gray-600"
        />
      </pattern>
    );
  }, [showGrid, gridSize, state.viewport.zoom]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'diagram-canvas relative overflow-hidden rounded-lg',
        'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        isFullscreen && 'rounded-none border-0',
        className
      )}
      style={isFullscreen ? { width: '100vw', height: '100vh' } : { width, height }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG layer for connections and grid */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        style={{
          transform: `translate(${state.viewport.panX}px, ${state.viewport.panY}px) scale(${state.viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>{gridPattern}</defs>

        {/* Grid background */}
        {showGrid && (
          <rect
            width="200%"
            height="200%"
            x="-50%"
            y="-50%"
            fill="url(#grid-pattern)"
          />
        )}

        {/* Connections layer - rendered via children */}
      </svg>

      {/* Components layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          transform: `translate(${state.viewport.panX}px, ${state.viewport.panY}px) scale(${state.viewport.zoom})`,
          transformOrigin: '0 0',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="sync">
          {children}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400 shadow-sm border border-gray-200 dark:border-gray-700">
        {Math.round(state.viewport.zoom * 100)}%
      </div>

      {/* Pan/zoom instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 dark:text-gray-500">
        Ctrl+scroll to zoom • Alt+drag to pan • Click ⛶ for fullscreen
      </div>
    </div>
  );
};

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  config,
  theme = 'light',
  autoPlay = false,
  speed = 1,
  loop = false,
  showControls = true,
  showMinimap = false,
  onServiceClick,
  onConnectionClick,
  onPlaybackChange,
  className = '',
  children,
  ...canvasProps
}) => {
  return (
    <DiagramProvider
      config={config}
      theme={theme}
      autoPlay={autoPlay}
      speed={speed}
      loop={loop}
    >
      <CanvasInner
        onServiceClick={onServiceClick}
        onConnectionClick={onConnectionClick}
        className={className}
        {...canvasProps}
      >
        {children}
      </CanvasInner>
    </DiagramProvider>
  );
};

export default DiagramCanvas;
