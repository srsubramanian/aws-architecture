/**
 * Amazon EC2 Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type EC2Props = Omit<AWSServiceBaseProps, 'type'> & {
  /** Instance type */
  instanceType?: string;
  /** AMI ID */
  amiId?: string;
  /** Availability zone */
  availabilityZone?: string;
  /** Instance state */
  state?: 'running' | 'stopped' | 'pending' | 'terminated';
};

export const EC2: React.FC<EC2Props> = ({
  instanceType,
  amiId,
  availabilityZone,
  state,
  metadata,
  variant,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon EC2',
    instanceType: instanceType ?? metadata?.instanceType,
    custom: {
      ...metadata?.custom,
      ...(amiId && { 'AMI ID': amiId }),
      ...(availabilityZone && { AZ: availabilityZone }),
      ...(state && { State: state }),
    },
  };

  // Map state to variant
  const stateVariant = state === 'stopped' ? 'warning' : state === 'terminated' ? 'error' : variant;

  return <AWSService type="ec2" metadata={enhancedMetadata} variant={stateVariant} {...props} />;
};

export default EC2;
