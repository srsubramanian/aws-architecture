/**
 * Amazon CloudFront Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type CloudFrontProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Distribution ID */
  distributionId?: string;
  /** Origin domain */
  origin?: string;
  /** Price class */
  priceClass?: 'PriceClass_All' | 'PriceClass_200' | 'PriceClass_100';
  /** HTTP version */
  httpVersion?: 'http1.1' | 'http2' | 'http2and3' | 'http3';
};

export const CloudFront: React.FC<CloudFrontProps> = ({
  distributionId,
  origin,
  priceClass,
  httpVersion,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon CloudFront',
    custom: {
      ...metadata?.custom,
      ...(distributionId && { ID: distributionId }),
      ...(origin && { Origin: origin }),
      ...(priceClass && { 'Price Class': priceClass }),
      ...(httpVersion && { HTTP: httpVersion }),
    },
  };

  return <AWSService type="cloudfront" metadata={enhancedMetadata} {...props} />;
};

export default CloudFront;
