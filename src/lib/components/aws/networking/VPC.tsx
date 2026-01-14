/**
 * Amazon VPC Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type VPCProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** VPC name */
  vpcName?: string;
  /** CIDR block */
  cidrBlock?: string;
  /** Number of subnets */
  subnetCount?: number;
  /** Number of availability zones */
  azCount?: number;
};

export const VPC: React.FC<VPCProps> = ({
  vpcName,
  cidrBlock,
  subnetCount,
  azCount,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon VPC',
    custom: {
      ...metadata?.custom,
      ...(vpcName && { Name: vpcName }),
      ...(cidrBlock && { CIDR: cidrBlock }),
      ...(subnetCount && { Subnets: subnetCount }),
      ...(azCount && { AZs: azCount }),
    },
  };

  return <AWSService type="vpc" metadata={enhancedMetadata} {...props} />;
};

export default VPC;
