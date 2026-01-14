/**
 * Monitoring service exports
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

// CloudWatch Component
export type CloudWatchProps = Omit<AWSServiceBaseProps, 'type'> & {
  dashboardName?: string;
  alarmCount?: number;
  logGroupCount?: number;
};

export const CloudWatch: React.FC<CloudWatchProps> = ({ dashboardName, alarmCount, logGroupCount, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon CloudWatch',
    custom: {
      ...metadata?.custom,
      ...(dashboardName && { Dashboard: dashboardName }),
      ...(alarmCount && { Alarms: alarmCount }),
      ...(logGroupCount && { 'Log Groups': logGroupCount }),
    },
  };
  return <AWSService type="cloudwatch" metadata={enhancedMetadata} {...props} />;
};

// X-Ray Component
export type XRayProps = Omit<AWSServiceBaseProps, 'type'> & {
  samplingRate?: number;
  groupName?: string;
};

export const XRay: React.FC<XRayProps> = ({ samplingRate, groupName, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS X-Ray',
    custom: {
      ...metadata?.custom,
      ...(samplingRate && { 'Sampling Rate': `${samplingRate}%` }),
      ...(groupName && { Group: groupName }),
    },
  };
  return <AWSService type="xray" metadata={enhancedMetadata} {...props} />;
};
