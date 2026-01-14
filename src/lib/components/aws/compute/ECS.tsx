/**
 * Amazon ECS Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type ECSProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Cluster name */
  clusterName?: string;
  /** Service name */
  serviceName?: string;
  /** Desired count */
  desiredCount?: number;
  /** Running count */
  runningCount?: number;
  /** Launch type */
  launchType?: 'EC2' | 'FARGATE';
};

export const ECS: React.FC<ECSProps> = ({
  clusterName,
  serviceName,
  desiredCount,
  runningCount,
  launchType,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon ECS',
    custom: {
      ...metadata?.custom,
      ...(clusterName && { Cluster: clusterName }),
      ...(serviceName && { Service: serviceName }),
      ...(desiredCount !== undefined && { Desired: desiredCount }),
      ...(runningCount !== undefined && { Running: runningCount }),
      ...(launchType && { 'Launch Type': launchType }),
    },
  };

  return <AWSService type="ecs" metadata={enhancedMetadata} {...props} />;
};

export default ECS;
