/**
 * Amazon API Gateway Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type APIGatewayProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** API name */
  apiName?: string;
  /** API type */
  apiType?: 'REST' | 'HTTP' | 'WebSocket';
  /** Stage name */
  stageName?: string;
  /** Endpoint type */
  endpointType?: 'REGIONAL' | 'EDGE' | 'PRIVATE';
};

export const APIGateway: React.FC<APIGatewayProps> = ({
  apiName,
  apiType,
  stageName,
  endpointType,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon API Gateway',
    custom: {
      ...metadata?.custom,
      ...(apiName && { API: apiName }),
      ...(apiType && { Type: apiType }),
      ...(stageName && { Stage: stageName }),
      ...(endpointType && { Endpoint: endpointType }),
    },
  };

  return <AWSService type="api-gateway" metadata={enhancedMetadata} {...props} />;
};

export default APIGateway;
