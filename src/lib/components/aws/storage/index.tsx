/**
 * Storage service exports
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

// S3 Component
export type S3Props = Omit<AWSServiceBaseProps, 'type'> & {
  bucketName?: string;
  storageClass?: string;
  versioning?: boolean;
};

export const S3: React.FC<S3Props> = ({ bucketName, storageClass, versioning, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon S3',
    custom: { ...metadata?.custom, ...(bucketName && { Bucket: bucketName }), ...(storageClass && { Class: storageClass }) },
  };
  return <AWSService type="s3" metadata={enhancedMetadata} {...props} />;
};

// EFS Component
export type EFSProps = Omit<AWSServiceBaseProps, 'type'> & {
  fileSystemId?: string;
  performanceMode?: 'generalPurpose' | 'maxIO';
  throughputMode?: 'bursting' | 'provisioned' | 'elastic';
};

export const EFS: React.FC<EFSProps> = ({ fileSystemId, performanceMode, throughputMode, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon EFS',
    custom: { ...metadata?.custom, ...(fileSystemId && { ID: fileSystemId }), ...(performanceMode && { Performance: performanceMode }) },
  };
  return <AWSService type="efs" metadata={enhancedMetadata} {...props} />;
};

// EBS Component
export type EBSProps = Omit<AWSServiceBaseProps, 'type'> & {
  volumeId?: string;
  volumeType?: 'gp2' | 'gp3' | 'io1' | 'io2' | 'st1' | 'sc1';
  sizeGB?: number;
  iops?: number;
};

export const EBS: React.FC<EBSProps> = ({ volumeId, volumeType, sizeGB, iops, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon EBS',
    storage: sizeGB ? `${sizeGB} GB` : metadata?.storage,
    custom: { ...metadata?.custom, ...(volumeType && { Type: volumeType }), ...(iops && { IOPS: iops }) },
  };
  return <AWSService type="ebs" metadata={enhancedMetadata} {...props} />;
};
