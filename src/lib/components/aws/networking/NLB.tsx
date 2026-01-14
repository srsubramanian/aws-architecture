/**
 * Network Load Balancer Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type NLBProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Load balancer name */
  lbName?: string;
  /** Scheme */
  scheme?: 'internet-facing' | 'internal';
  /** Cross-zone enabled */
  crossZone?: boolean;
};

export const NLB: React.FC<NLBProps> = ({
  lbName,
  scheme,
  crossZone,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Network Load Balancer',
    custom: {
      ...metadata?.custom,
      ...(lbName && { Name: lbName }),
      ...(scheme && { Scheme: scheme }),
      ...(crossZone !== undefined && { 'Cross-Zone': crossZone ? 'Enabled' : 'Disabled' }),
    },
  };

  return <AWSService type="nlb" metadata={enhancedMetadata} {...props} />;
};

export default NLB;
