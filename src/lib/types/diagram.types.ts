/**
 * Diagram Types and Interfaces
 */

import type { ServiceInstance } from './aws-services.types';
import type { DataFlowConfig, AnimationSequence, PlaybackState } from './animation.types';

/** Connection types between services */
export type ConnectionType =
  | 'http'
  | 'https'
  | 'websocket'
  | 'grpc'
  | 'tcp'
  | 'message-queue'
  | 'event'
  | 'stream'
  | 'sync'
  | 'async';

/** Connection line style */
export type LineStyle = 'solid' | 'dashed' | 'dotted';

/** Arrow style */
export type ArrowStyle = 'none' | 'arrow' | 'triangle' | 'diamond';

/** Service connection definition */
export interface ServiceConnection {
  /** Unique connection ID */
  id: string;
  /** Source service ID */
  from: string;
  /** Target service ID */
  to: string;
  /** Connection type */
  type: ConnectionType;
  /** Data flow configuration */
  flow?: DataFlowConfig;
  /** Line style */
  lineStyle?: LineStyle;
  /** Arrow style at the end */
  arrowStyle?: ArrowStyle;
  /** Arrow style at the start (for bidirectional) */
  startArrowStyle?: ArrowStyle;
  /** Connection label */
  label?: string;
  /** Label position along the line (0-1) */
  labelPosition?: number;
  /** Whether connection is highlighted */
  isHighlighted?: boolean;
  /** Whether connection is dimmed */
  isDimmed?: boolean;
  /** Custom color override */
  color?: string;
  /** Animation delay */
  animationDelay?: number;
  /** Curve offset for parallel connections */
  curveOffset?: number;
}

/** Layout options for diagrams */
export type LayoutType =
  | 'manual'
  | 'auto'
  | 'hierarchical'
  | 'force-directed'
  | 'grid'
  | 'circular';

/** Theme options */
export type ThemeType = 'light' | 'dark' | 'aws' | 'custom';

/** Diagram theme configuration */
export interface DiagramTheme {
  /** Theme type */
  type: ThemeType;
  /** Background color */
  backgroundColor: string;
  /** Grid color */
  gridColor: string;
  /** Default connection color */
  connectionColor: string;
  /** Text color */
  textColor: string;
  /** Secondary text color */
  textSecondaryColor: string;
  /** Border color */
  borderColor: string;
  /** Highlight color */
  highlightColor: string;
  /** Error color */
  errorColor: string;
  /** Success color */
  successColor: string;
  /** Warning color */
  warningColor: string;
}

/** Canvas configuration */
export interface CanvasConfig {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Minimum zoom level */
  minZoom: number;
  /** Maximum zoom level */
  maxZoom: number;
  /** Grid size for snapping */
  gridSize: number;
  /** Whether to show grid */
  showGrid: boolean;
  /** Whether to enable snapping */
  enableSnap: boolean;
  /** Padding around content */
  padding: number;
}

/** Viewport state */
export interface ViewportState {
  /** Current zoom level */
  zoom: number;
  /** Pan offset X */
  panX: number;
  /** Pan offset Y */
  panY: number;
}

/** Complete diagram configuration */
export interface DiagramConfig {
  /** Unique diagram ID */
  id: string;
  /** Diagram name */
  name: string;
  /** Diagram description */
  description?: string;
  /** Services in the diagram */
  services: ServiceInstance[];
  /** Connections between services */
  connections: ServiceConnection[];
  /** Layout type */
  layout: LayoutType;
  /** Theme configuration */
  theme?: ThemeType | DiagramTheme;
  /** Canvas configuration */
  canvas?: Partial<CanvasConfig>;
  /** Animation sequences */
  animations?: AnimationSequence[];
  /** Default animation sequence ID */
  defaultAnimation?: string;
  /** Metadata */
  metadata?: Record<string, unknown>;
}

/** Diagram state */
export interface DiagramState {
  /** Current configuration */
  config: DiagramConfig;
  /** Selected service IDs */
  selectedServices: string[];
  /** Highlighted connection IDs */
  highlightedConnections: string[];
  /** Services in active flow */
  activeFlowServices: string[];
  /** Viewport state */
  viewport: ViewportState;
  /** Playback state */
  playback: PlaybackState;
  /** Whether diagram is loading */
  isLoading: boolean;
  /** Error message if any */
  error?: string;
}

/** Diagram context value */
export interface DiagramContextValue {
  /** Current state */
  state: DiagramState;
  /** Select a service */
  selectService: (id: string) => void;
  /** Deselect a service */
  deselectService: (id: string) => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Highlight a connection */
  highlightConnection: (id: string) => void;
  /** Clear highlights */
  clearHighlights: () => void;
  /** Set active flow */
  setActiveFlow: (serviceIds: string[]) => void;
  /** Clear active flow */
  clearActiveFlow: () => void;
  /** Update viewport */
  updateViewport: (viewport: Partial<ViewportState>) => void;
  /** Reset viewport */
  resetViewport: () => void;
  /** Zoom to fit */
  zoomToFit: () => void;
  /** Play animation */
  play: () => void;
  /** Pause animation */
  pause: () => void;
  /** Stop animation */
  stop: () => void;
  /** Set playback speed */
  setSpeed: (speed: number) => void;
  /** Go to step */
  goToStep: (step: number) => void;
}

/** Props for DiagramCanvas component */
export interface DiagramCanvasProps {
  /** Diagram configuration */
  config?: DiagramConfig;
  /** Theme override */
  theme?: ThemeType | DiagramTheme;
  /** Whether to auto-play animations */
  autoPlay?: boolean;
  /** Initial playback speed */
  speed?: number;
  /** Whether to loop animations */
  loop?: boolean;
  /** Initial zoom level */
  initialZoom?: number;
  /** Whether to show controls */
  showControls?: boolean;
  /** Whether to show minimap */
  showMinimap?: boolean;
  /** Callback when service is clicked */
  onServiceClick?: (id: string) => void;
  /** Callback when connection is clicked */
  onConnectionClick?: (id: string) => void;
  /** Callback when playback state changes */
  onPlaybackChange?: (state: PlaybackState) => void;
  /** Additional CSS classes */
  className?: string;
  /** Children (service components) */
  children?: React.ReactNode;
}

/** Props for DiagramControls component */
export interface DiagramControlsProps {
  /** Current playback state */
  playbackState: PlaybackState;
  /** Animation controls */
  controls: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    next: () => void;
    previous: () => void;
    setSpeed: (speed: number) => void;
  };
  /** Whether loop is enabled */
  loopEnabled?: boolean;
  /** Toggle loop callback */
  onToggleLoop?: () => void;
  /** Position of controls */
  position?: 'top' | 'bottom' | 'floating';
  /** Whether to show step controls */
  showStepControls?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Default canvas configuration */
export const defaultCanvasConfig: CanvasConfig = {
  width: 1200,
  height: 800,
  minZoom: 0.1,
  maxZoom: 3,
  gridSize: 20,
  showGrid: true,
  enableSnap: true,
  padding: 40,
};

/** Default viewport state */
export const defaultViewportState: ViewportState = {
  zoom: 1,
  panX: 0,
  panY: 0,
};

/** Default playback state */
export const defaultPlaybackState: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  speed: 1,
  currentStep: 0,
  totalSteps: 0,
  progress: 0,
};

/** Pre-defined themes */
export const themes: Record<ThemeType, DiagramTheme> = {
  light: {
    type: 'light',
    backgroundColor: '#ffffff',
    gridColor: '#f0f0f0',
    connectionColor: '#94a3b8',
    textColor: '#1e293b',
    textSecondaryColor: '#64748b',
    borderColor: '#e2e8f0',
    highlightColor: '#3b82f6',
    errorColor: '#ef4444',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
  },
  dark: {
    type: 'dark',
    backgroundColor: '#0f172a',
    gridColor: '#1e293b',
    connectionColor: '#475569',
    textColor: '#f1f5f9',
    textSecondaryColor: '#94a3b8',
    borderColor: '#334155',
    highlightColor: '#60a5fa',
    errorColor: '#f87171',
    successColor: '#4ade80',
    warningColor: '#fbbf24',
  },
  aws: {
    type: 'aws',
    backgroundColor: '#232f3e',
    gridColor: '#2d3a4a',
    connectionColor: '#ff9900',
    textColor: '#ffffff',
    textSecondaryColor: '#a0aec0',
    borderColor: '#3d4f5f',
    highlightColor: '#ff9900',
    errorColor: '#dd344c',
    successColor: '#3f8624',
    warningColor: '#ff9900',
  },
  custom: {
    type: 'custom',
    backgroundColor: '#ffffff',
    gridColor: '#f0f0f0',
    connectionColor: '#94a3b8',
    textColor: '#1e293b',
    textSecondaryColor: '#64748b',
    borderColor: '#e2e8f0',
    highlightColor: '#3b82f6',
    errorColor: '#ef4444',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
  },
};
