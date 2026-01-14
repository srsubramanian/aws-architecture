/**
 * Amazon Aurora Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type AuroraProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Database engine */
  engine?: 'aurora-mysql' | 'aurora-postgresql';
  /** Engine version */
  engineVersion?: string;
  /** Instance class */
  instanceClass?: string;
  /** Number of replicas */
  replicaCount?: number;
  /** Serverless mode */
  serverless?: boolean;
  /** ACU range for serverless */
  acuRange?: string;
};

export const Aurora: React.FC<AuroraProps> = ({
  engine,
  engineVersion,
  instanceClass,
  replicaCount,
  serverless,
  acuRange,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon Aurora',
    instanceType: instanceClass ?? metadata?.instanceType,
    custom: {
      ...metadata?.custom,
      ...(engine && { Engine: engine }),
      ...(engineVersion && { Version: engineVersion }),
      ...(replicaCount !== undefined && { Replicas: replicaCount }),
      ...(serverless && { Mode: 'Serverless' }),
      ...(acuRange && { ACU: acuRange }),
    },
  };

  return <AWSService type="aurora" metadata={enhancedMetadata} {...props} />;
};

export default Aurora;
