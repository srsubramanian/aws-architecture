/**
 * Application Load Balancer Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type ALBProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Load balancer name */
  lbName?: string;
  /** Scheme */
  scheme?: 'internet-facing' | 'internal';
  /** Target group count */
  targetGroups?: number;
  /** Listener count */
  listeners?: number;
};

export const ALB: React.FC<ALBProps> = ({
  lbName,
  scheme,
  targetGroups,
  listeners,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Application Load Balancer',
    custom: {
      ...metadata?.custom,
      ...(lbName && { Name: lbName }),
      ...(scheme && { Scheme: scheme }),
      ...(targetGroups && { 'Target Groups': targetGroups }),
      ...(listeners && { Listeners: listeners }),
    },
  };

  return <AWSService type="alb" metadata={enhancedMetadata} {...props} />;
};

export default ALB;
