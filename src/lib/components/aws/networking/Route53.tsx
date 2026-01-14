/**
 * Amazon Route 53 Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type Route53Props = Omit<AWSServiceBaseProps, 'type'> & {
  /** Hosted zone name */
  hostedZone?: string;
  /** Record type */
  recordType?: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA';
  /** Routing policy */
  routingPolicy?: 'Simple' | 'Weighted' | 'Latency' | 'Failover' | 'Geolocation';
};

export const Route53: React.FC<Route53Props> = ({
  hostedZone,
  recordType,
  routingPolicy,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon Route 53',
    custom: {
      ...metadata?.custom,
      ...(hostedZone && { Zone: hostedZone }),
      ...(recordType && { 'Record Type': recordType }),
      ...(routingPolicy && { Policy: routingPolicy }),
    },
  };

  return <AWSService type="route53" metadata={enhancedMetadata} {...props} />;
};

export default Route53;
