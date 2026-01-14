/**
 * Diagram Provider Component
 * Provides context for diagram state management
 */

import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import type {
  DiagramConfig,
  DiagramState,
  DiagramContextValue,
  ViewportState,
  PlaybackState,
  ThemeType,
  DiagramTheme,
} from '../../types';
import {
  defaultViewportState,
  defaultPlaybackState,
  themes,
} from '../../types/diagram.types';

interface DiagramProviderProps {
  /** Diagram configuration */
  config?: DiagramConfig;
  /** Theme */
  theme?: ThemeType | DiagramTheme;
  /** Auto-play animations */
  autoPlay?: boolean;
  /** Initial playback speed */
  speed?: number;
  /** Loop animations */
  loop?: boolean;
  /** Children */
  children: React.ReactNode;
}

const DiagramContext = createContext<DiagramContextValue | null>(null);

export const useDiagram = (): DiagramContextValue => {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagram must be used within a DiagramProvider');
  }
  return context;
};

export const DiagramProvider: React.FC<DiagramProviderProps> = ({
  config,
  theme = 'light',
  autoPlay = false,
  speed = 1,
  children,
}) => {
  // Initialize state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [highlightedConnections, setHighlightedConnections] = useState<string[]>([]);
  const [activeFlowServices, setActiveFlowServices] = useState<string[]>([]);
  const [viewport, setViewport] = useState<ViewportState>(defaultViewportState);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    ...defaultPlaybackState,
    isPlaying: autoPlay,
    speed,
  });
  const [isLoading] = useState(false);
  const [error] = useState<string | undefined>();

  // Resolve theme
  const resolvedTheme = useMemo((): DiagramTheme => {
    if (typeof theme === 'string') {
      return themes[theme];
    }
    return theme;
  }, [theme]);

  // Build current state
  const state = useMemo((): DiagramState => ({
    config: config ?? {
      id: 'default',
      name: 'Untitled Diagram',
      services: [],
      connections: [],
      layout: 'manual',
    },
    selectedServices,
    highlightedConnections,
    activeFlowServices,
    viewport,
    playback: playbackState,
    isLoading,
    error,
  }), [config, selectedServices, highlightedConnections, activeFlowServices, viewport, playbackState, isLoading, error]);

  // Service selection
  const selectService = useCallback((id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const deselectService = useCallback((id: string) => {
    setSelectedServices(prev => prev.filter(s => s !== id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedServices([]);
  }, []);

  // Connection highlighting
  const highlightConnection = useCallback((id: string) => {
    setHighlightedConnections(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlightedConnections([]);
  }, []);

  // Active flow
  const setActiveFlow = useCallback((serviceIds: string[]) => {
    setActiveFlowServices(serviceIds);
  }, []);

  const clearActiveFlow = useCallback(() => {
    setActiveFlowServices([]);
  }, []);

  // Viewport controls
  const updateViewport = useCallback((updates: Partial<ViewportState>) => {
    setViewport(prev => ({ ...prev, ...updates }));
  }, []);

  const resetViewport = useCallback(() => {
    setViewport(defaultViewportState);
  }, []);

  const zoomToFit = useCallback(() => {
    // Implementation would calculate bounds and set appropriate zoom/pan
    setViewport({ zoom: 1, panX: 0, panY: 0 });
  }, []);

  // Playback controls
  const play = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, []);

  const stop = useCallback(() => {
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0,
    }));
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setPlaybackState(prev => ({ ...prev, speed: newSpeed }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentStep: step,
      progress: prev.totalSteps > 0 ? (step / prev.totalSteps) * 100 : 0,
    }));
  }, []);

  // Context value
  const contextValue = useMemo((): DiagramContextValue => ({
    state,
    selectService,
    deselectService,
    clearSelection,
    highlightConnection,
    clearHighlights,
    setActiveFlow,
    clearActiveFlow,
    updateViewport,
    resetViewport,
    zoomToFit,
    play,
    pause,
    stop,
    setSpeed,
    goToStep,
  }), [
    state,
    selectService,
    deselectService,
    clearSelection,
    highlightConnection,
    clearHighlights,
    setActiveFlow,
    clearActiveFlow,
    updateViewport,
    resetViewport,
    zoomToFit,
    play,
    pause,
    stop,
    setSpeed,
    goToStep,
  ]);

  return (
    <DiagramContext.Provider value={contextValue}>
      <div
        className="diagram-provider"
        style={{
          '--diagram-bg': resolvedTheme.backgroundColor,
          '--diagram-grid': resolvedTheme.gridColor,
          '--diagram-text': resolvedTheme.textColor,
          '--diagram-text-secondary': resolvedTheme.textSecondaryColor,
          '--diagram-border': resolvedTheme.borderColor,
          '--diagram-highlight': resolvedTheme.highlightColor,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </DiagramContext.Provider>
  );
};

export default DiagramProvider;
