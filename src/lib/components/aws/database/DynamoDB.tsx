/**
 * Amazon DynamoDB Component
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

export type DynamoDBProps = Omit<AWSServiceBaseProps, 'type'> & {
  /** Table name */
  tableName?: string;
  /** Read capacity units */
  readCapacity?: number;
  /** Write capacity units */
  writeCapacity?: number;
  /** Billing mode */
  billingMode?: 'PROVISIONED' | 'PAY_PER_REQUEST';
  /** Global secondary indexes count */
  gsiCount?: number;
};

export const DynamoDB: React.FC<DynamoDBProps> = ({
  tableName,
  readCapacity,
  writeCapacity,
  billingMode,
  gsiCount,
  metadata,
  ...props
}) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon DynamoDB',
    custom: {
      ...metadata?.custom,
      ...(tableName && { Table: tableName }),
      ...(billingMode && { Billing: billingMode }),
      ...(readCapacity && { RCU: readCapacity }),
      ...(writeCapacity && { WCU: writeCapacity }),
      ...(gsiCount && { GSIs: gsiCount }),
    },
  };

  return <AWSService type="dynamodb" metadata={enhancedMetadata} {...props} />;
};

export default DynamoDB;
