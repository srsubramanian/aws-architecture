/**
 * Amazon S3 Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type S3Props = Omit<AWSServiceBaseProps, 'type'> & {
  bucketName?: string;
  storageClass?: 'STANDARD' | 'INTELLIGENT_TIERING' | 'GLACIER' | 'DEEP_ARCHIVE';
  versioning?: boolean;
  encryption?: 'SSE-S3' | 'SSE-KMS' | 'SSE-C';
};

export const S3: React.FC<S3Props> = ({
  bucketName, storageClass, versioning, encryption, metadata, ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon S3',
    custom: {
      ...metadata?.custom,
      ...(bucketName && { Bucket: bucketName }),
      ...(storageClass && { Class: storageClass }),
      ...(versioning !== undefined && { Versioning: versioning ? 'Enabled' : 'Disabled' }),
      ...(encryption && { Encryption: encryption }),
    },
  };
  return <AWSService type="s3" metadata={enhancedMetadata} {...props} />;
};

export default S3;
