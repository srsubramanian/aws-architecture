/**
 * Hook for managing data flow animations between services
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DataFlowConfig, DataFlowType, DataPacketType } from '../types';

export interface DataFlowState {
  /** Flow ID */
  id: string;
  /** Source service ID */
  from: string;
  /** Target service ID */
  to: string;
  /** Flow configuration */
  config: DataFlowConfig;
  /** Current progress (0-1) */
  progress: number;
  /** Whether flow is active */
  isActive: boolean;
  /** Current packet positions (0-1) */
  packetPositions: number[];
}

export interface UseDataFlowOptions {
  /** Connections to animate */
  connections: Array<{
    id: string;
    from: string;
    to: string;
    config?: Partial<DataFlowConfig>;
  }>;
  /** Default flow type */
  defaultType?: DataFlowType;
  /** Default flow speed */
  defaultSpeed?: number;
  /** Whether to auto-start */
  autoStart?: boolean;
  /** Number of packets per flow */
  packetCount?: number;
}

export interface UseDataFlowReturn {
  /** Current state of all flows */
  flows: DataFlowState[];
  /** Start all flows */
  startAll: () => void;
  /** Stop all flows */
  stopAll: () => void;
  /** Start a specific flow */
  startFlow: (id: string) => void;
  /** Stop a specific flow */
  stopFlow: (id: string) => void;
  /** Set flow type */
  setFlowType: (id: string, type: DataFlowType) => void;
  /** Set flow speed */
  setFlowSpeed: (id: string, speed: number) => void;
  /** Trigger a single data packet */
  triggerPacket: (id: string, type?: DataPacketType) => void;
  /** Get flow state by ID */
  getFlow: (id: string) => DataFlowState | undefined;
  /** Whether any flow is active */
  isAnyActive: boolean;
}

const DEFAULT_FLOW_CONFIG: DataFlowConfig = {
  type: 'sync',
  direction: 'forward',
  speed: 1,
  showPackets: true,
  packetType: 'data',
  packetCount: 3,
  isActive: false,
};

export function useDataFlow({
  connections,
  defaultType = 'sync',
  defaultSpeed = 1,
  autoStart = false,
  packetCount = 3,
}: UseDataFlowOptions): UseDataFlowReturn {
  // Initialize flows from connections
  const initializeFlows = useCallback((): DataFlowState[] => {
    return connections.map(({ id, from, to, config }) => ({
      id,
      from,
      to,
      config: {
        ...DEFAULT_FLOW_CONFIG,
        type: defaultType,
        speed: defaultSpeed,
        packetCount,
        ...config,
      },
      progress: 0,
      isActive: autoStart,
      packetPositions: Array.from({ length: packetCount }, (_, i) => i / packetCount),
    }));
  }, [connections, defaultType, defaultSpeed, autoStart, packetCount]);

  const [flows, setFlows] = useState<DataFlowState[]>(initializeFlows);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const delta = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = timestamp;

    setFlows((prevFlows) =>
      prevFlows.map((flow) => {
        if (!flow.isActive) return flow;

        const speed = flow.config.speed ?? 1;
        const increment = delta * speed * 0.5; // Base speed

        // Update packet positions
        const newPacketPositions = flow.packetPositions.map((pos) => {
          let newPos = pos + increment;
          if (newPos > 1) {
            newPos = newPos - 1; // Loop back
          }
          return newPos;
        });

        // Update overall progress
        let newProgress = flow.progress + increment;
        if (newProgress > 1) {
          newProgress = newProgress - 1;
        }

        return {
          ...flow,
          progress: newProgress,
          packetPositions: newPacketPositions,
        };
      })
    );

    // Check if any flow is still active
    const hasActiveFlows = flows.some((f) => f.isActive);
    if (hasActiveFlows) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [flows]);

  // Start animation loop when flows become active
  useEffect(() => {
    const hasActiveFlows = flows.some((f) => f.isActive);

    if (hasActiveFlows && !animationFrameRef.current) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [flows, animate]);

  // Start all flows
  const startAll = useCallback(() => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) => ({
        ...flow,
        isActive: true,
        config: { ...flow.config, isActive: true },
      }))
    );
  }, []);

  // Stop all flows
  const stopAll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setFlows((prevFlows) =>
      prevFlows.map((flow) => ({
        ...flow,
        isActive: false,
        config: { ...flow.config, isActive: false },
      }))
    );
  }, []);

  // Start a specific flow
  const startFlow = useCallback((id: string) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) =>
        flow.id === id
          ? { ...flow, isActive: true, config: { ...flow.config, isActive: true } }
          : flow
      )
    );
  }, []);

  // Stop a specific flow
  const stopFlow = useCallback((id: string) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) =>
        flow.id === id
          ? { ...flow, isActive: false, config: { ...flow.config, isActive: false } }
          : flow
      )
    );
  }, []);

  // Set flow type
  const setFlowType = useCallback((id: string, type: DataFlowType) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) =>
        flow.id === id ? { ...flow, config: { ...flow.config, type } } : flow
      )
    );
  }, []);

  // Set flow speed
  const setFlowSpeed = useCallback((id: string, speed: number) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) =>
        flow.id === id ? { ...flow, config: { ...flow.config, speed } } : flow
      )
    );
  }, []);

  // Trigger a single packet
  const triggerPacket = useCallback((id: string, type?: DataPacketType) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) => {
        if (flow.id !== id) return flow;

        return {
          ...flow,
          packetPositions: [0, ...flow.packetPositions.slice(0, -1)],
          config: type ? { ...flow.config, packetType: type } : flow.config,
        };
      })
    );
  }, []);

  // Get flow by ID
  const getFlow = useCallback(
    (id: string): DataFlowState | undefined => {
      return flows.find((f) => f.id === id);
    },
    [flows]
  );

  const isAnyActive = flows.some((f) => f.isActive);

  // Reinitialize when connections change
  useEffect(() => {
    setFlows(initializeFlows());
  }, [initializeFlows]);

  return {
    flows,
    startAll,
    stopAll,
    startFlow,
    stopFlow,
    setFlowType,
    setFlowSpeed,
    triggerPacket,
    getFlow,
    isAnyActive,
  };
}
