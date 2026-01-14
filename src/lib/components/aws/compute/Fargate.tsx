/**
 * AWS Fargate Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type FargateProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** vCPU units */
  cpu?: string;
  /** Memory in GB */
  memoryGB?: number;
  /** Platform version */
  platformVersion?: string;
};

export const Fargate: React.FC<FargateProps> = ({
  cpu,
  memoryGB,
  platformVersion,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS Fargate',
    cpu: cpu ?? metadata?.cpu,
    memory: memoryGB ? `${memoryGB} GB` : metadata?.memory,
    custom: {
      ...metadata?.custom,
      ...(platformVersion && { Platform: platformVersion }),
    },
  };

  return <AWSService type="fargate" metadata={enhancedMetadata} {...props} />;
};

export default Fargate;
