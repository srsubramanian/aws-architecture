/**
 * Amazon RDS Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type RDSProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Database engine */
  engine?: 'mysql' | 'postgres' | 'mariadb' | 'oracle' | 'sqlserver';
  /** Engine version */
  engineVersion?: string;
  /** Instance class */
  instanceClass?: string;
  /** Is Multi-AZ deployment */
  multiAZ?: boolean;
  /** Storage type */
  storageType?: 'gp2' | 'gp3' | 'io1' | 'io2';
  /** Allocated storage in GB */
  storageGB?: number;
};

export const RDS: React.FC<RDSProps> = ({
  engine,
  engineVersion,
  instanceClass,
  multiAZ,
  storageType,
  storageGB,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon RDS',
    instanceType: instanceClass ?? metadata?.instanceType,
    storage: storageGB ? `${storageGB} GB ${storageType ?? ''}`.trim() : metadata?.storage,
    custom: {
      ...metadata?.custom,
      ...(engine && { Engine: engine }),
      ...(engineVersion && { Version: engineVersion }),
      ...(multiAZ !== undefined && { 'Multi-AZ': multiAZ ? 'Yes' : 'No' }),
    },
  };

  return <AWSService type="rds" metadata={enhancedMetadata} {...props} />;
};

export default RDS;
