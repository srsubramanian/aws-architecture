/**
 * Hook for managing service highlight states
 */

import { useState, useCallback, useMemo } from 'react';
import type { ServiceConnection } from '../types';

export interface UseServiceHighlightOptions {
  /** All connections in the diagram */
  connections: ServiceConnection[];
  /** Enable multi-select mode */
  multiSelect?: boolean;
}

export interface UseServiceHighlightReturn {
  /** Currently selected service IDs */
  selectedServices: string[];
  /** Services in the highlighted path */
  highlightedServices: string[];
  /** Dimmed service IDs */
  dimmedServices: string[];
  /** Highlighted connection IDs */
  highlightedConnections: string[];
  /** Select a service */
  selectService: (id: string) => void;
  /** Deselect a service */
  deselectService: (id: string) => void;
  /** Toggle service selection */
  toggleService: (id: string) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Highlight a specific path */
  highlightPath: (serviceIds: string[]) => void;
  /** Clear highlights */
  clearHighlights: () => void;
  /** Check if a service is selected */
  isSelected: (id: string) => boolean;
  /** Check if a service is highlighted */
  isHighlighted: (id: string) => boolean;
  /** Check if a service is dimmed */
  isDimmed: (id: string) => boolean;
  /** Check if a connection is highlighted */
  isConnectionHighlighted: (id: string) => boolean;
  /** Get variant for a service based on its state */
  getServiceVariant: (id: string) => 'highlighted' | 'dimmed' | 'default';
}

export function useServiceHighlight({
  connections,
  multiSelect = false,
}: UseServiceHighlightOptions): UseServiceHighlightReturn {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  // Get all services connected to the selected services
  const connectedServices = useMemo(() => {
    if (selectedServices.length === 0) return new Set<string>();

    const connected = new Set<string>();

    // Add all selected services
    selectedServices.forEach((id) => connected.add(id));

    // Find connected services through connections
    connections.forEach((conn) => {
      if (selectedServices.includes(conn.from)) {
        connected.add(conn.to);
      }
      if (selectedServices.includes(conn.to)) {
        connected.add(conn.from);
      }
    });

    return connected;
  }, [selectedServices, connections]);

  // Get highlighted connections
  const highlightedConnections = useMemo(() => {
    if (selectedServices.length === 0 && highlightedPath.length === 0) {
      return [];
    }

    const pathSet = new Set([...selectedServices, ...highlightedPath]);

    return connections
      .filter((conn) => pathSet.has(conn.from) && pathSet.has(conn.to))
      .map((conn) => conn.id);
  }, [selectedServices, highlightedPath, connections]);

  // Services that should be highlighted
  const highlightedServices = useMemo(() => {
    if (highlightedPath.length > 0) {
      return highlightedPath;
    }
    return Array.from(connectedServices);
  }, [highlightedPath, connectedServices]);

  // Services that should be dimmed
  const dimmedServices = useMemo(() => {
    if (selectedServices.length === 0 && highlightedPath.length === 0) {
      return [];
    }

    // Get all service IDs from connections
    const allServices = new Set<string>();
    connections.forEach((conn) => {
      allServices.add(conn.from);
      allServices.add(conn.to);
    });

    // Return services not in highlighted set
    const highlighted = new Set([...selectedServices, ...highlightedPath, ...connectedServices]);
    return Array.from(allServices).filter((id) => !highlighted.has(id));
  }, [selectedServices, highlightedPath, connectedServices, connections]);

  // Select a service
  const selectService = useCallback(
    (id: string) => {
      setSelectedServices((prev) => {
        if (prev.includes(id)) return prev;

        if (multiSelect) {
          return [...prev, id];
        }
        return [id];
      });
      setHighlightedPath([]);
    },
    [multiSelect]
  );

  // Deselect a service
  const deselectService = useCallback((id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== id));
  }, []);

  // Toggle service selection
  const toggleService = useCallback(
    (id: string) => {
      setSelectedServices((prev) => {
        if (prev.includes(id)) {
          return prev.filter((s) => s !== id);
        }
        if (multiSelect) {
          return [...prev, id];
        }
        return [id];
      });
      setHighlightedPath([]);
    },
    [multiSelect]
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedServices([]);
    setHighlightedPath([]);
  }, []);

  // Highlight a specific path
  const highlightPath = useCallback((serviceIds: string[]) => {
    setHighlightedPath(serviceIds);
  }, []);

  // Clear highlights
  const clearHighlights = useCallback(() => {
    setHighlightedPath([]);
  }, []);

  // Check if a service is selected
  const isSelected = useCallback(
    (id: string) => selectedServices.includes(id),
    [selectedServices]
  );

  // Check if a service is highlighted
  const isHighlighted = useCallback(
    (id: string) => highlightedServices.includes(id),
    [highlightedServices]
  );

  // Check if a service is dimmed
  const isDimmed = useCallback(
    (id: string) => dimmedServices.includes(id),
    [dimmedServices]
  );

  // Check if a connection is highlighted
  const isConnectionHighlighted = useCallback(
    (id: string) => highlightedConnections.includes(id),
    [highlightedConnections]
  );

  // Get variant for a service
  const getServiceVariant = useCallback(
    (id: string): 'highlighted' | 'dimmed' | 'default' => {
      if (selectedServices.includes(id) || highlightedPath.includes(id)) {
        return 'highlighted';
      }
      if (dimmedServices.includes(id)) {
        return 'dimmed';
      }
      return 'default';
    },
    [selectedServices, highlightedPath, dimmedServices]
  );

  return {
    selectedServices,
    highlightedServices,
    dimmedServices,
    highlightedConnections,
    selectService,
    deselectService,
    toggleService,
    clearSelection,
    highlightPath,
    clearHighlights,
    isSelected,
    isHighlighted,
    isDimmed,
    isConnectionHighlighted,
    getServiceVariant,
  };
}
