/**
 * AWS Lambda Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type LambdaProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Runtime environment */
  runtime?: string;
  /** Memory size in MB */
  memoryMB?: number;
  /** Timeout in seconds */
  timeoutSeconds?: number;
  /** Handler function */
  handler?: string;
};

export const Lambda: React.FC<LambdaProps> = ({
  runtime,
  memoryMB,
  timeoutSeconds,
  handler,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS Lambda',
    custom: {
      ...metadata?.custom,
      ...(runtime && { Runtime: runtime }),
      ...(memoryMB && { Memory: `${memoryMB} MB` }),
      ...(timeoutSeconds && { Timeout: `${timeoutSeconds}s` }),
      ...(handler && { Handler: handler }),
    },
  };

  return <AWSService type="lambda" metadata={enhancedMetadata} {...props} />;
};

export default Lambda;
