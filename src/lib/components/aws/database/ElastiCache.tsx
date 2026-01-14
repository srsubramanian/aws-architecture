/**
 * Amazon ElastiCache Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type ElastiCacheProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Cache engine */
  engine?: 'redis' | 'memcached';
  /** Engine version */
  engineVersion?: string;
  /** Node type */
  nodeType?: string;
  /** Number of nodes */
  numNodes?: number;
  /** Cluster mode enabled */
  clusterMode?: boolean;
};

export const ElastiCache: React.FC<ElastiCacheProps> = ({
  engine,
  engineVersion,
  nodeType,
  numNodes,
  clusterMode,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon ElastiCache',
    instanceType: nodeType ?? metadata?.instanceType,
    custom: {
      ...metadata?.custom,
      ...(engine && { Engine: engine }),
      ...(engineVersion && { Version: engineVersion }),
      ...(numNodes && { Nodes: numNodes }),
      ...(clusterMode !== undefined && { 'Cluster Mode': clusterMode ? 'Enabled' : 'Disabled' }),
    },
  };

  return <AWSService type="elasticache" metadata={enhancedMetadata} {...props} />;
};

export default ElastiCache;
