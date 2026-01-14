/**
 * Service Icon Component
 * Renders AWS icons from /public/icons folder
 */

import React, { useState } from 'react';
import type { AWSServiceType } from '../../../types';
import { getCategoryColor } from '../../../utils/colors';
import { getServiceCategory } from '../../../types/aws-services.types';

interface ServiceIconProps {
  /** AWS service type */
  type: AWSServiceType;
  /** Icon size */
  size?: number;
  /** Custom color override (only applies to fallback icons) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Base path for icons */
  iconBasePath?: string;
  /** Force use of fallback icons */
  useFallback?: boolean;
}

/** Mapping of service types to icon filenames */
const ICON_FILENAMES: Record<AWSServiceType, string> = {
  lambda: 'lambda.svg',
  ec2: 'ec2.svg',
  ecs: 'ecs.svg',
  fargate: 'fargate.svg',
  dynamodb: 'dynamodb.svg',
  rds: 'rds.svg',
  aurora: 'aurora.svg',
  elasticache: 'elasticache.svg',
  'api-gateway': 'api-gateway.svg',
  alb: 'alb.svg',
  nlb: 'nlb.svg',
  vpc: 'vpc.svg',
  cloudfront: 'cloudfront.svg',
  route53: 'route53.svg',
  s3: 's3.svg',
  efs: 'efs.svg',
  ebs: 'ebs.svg',
  sqs: 'sqs.svg',
  sns: 'sns.svg',
  eventbridge: 'eventbridge.svg',
  kinesis: 'kinesis.svg',
  'step-functions': 'step-functions.svg',
  waf: 'waf.svg',
  shield: 'shield.svg',
  'secrets-manager': 'secrets-manager.svg',
  kms: 'kms.svg',
  cognito: 'cognito.svg',
  cloudwatch: 'cloudwatch.svg',
  xray: 'xray.svg',
};

/** Fallback icon paths for each service type */
const FALLBACK_ICON_PATHS: Record<AWSServiceType, string> = {
  lambda: 'M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 7 12 10.18 4.18 7 12 4.18zM4 9.18l7 3.5v6.64l-7-3.5V9.18zm9 10.14V12.68l7-3.5v6.64l-7 3.5z',
  ec2: 'M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4z',
  ecs: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  fargate: 'M12 2L4 6v12l8 4 8-4V6l-8-4zm6 14.5l-6 3-6-3v-9l6-3 6 3v9zM9 9v6l3 1.5 3-1.5V9l-3-1.5L9 9z',
  dynamodb: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 2C9.24 7 7 9.24 7 12s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z',
  rds: 'M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.35 6 2s-2.13 2-6 2-6-1.35-6-2 2.13-2 6-2zM6 9.5c1.38.81 3.56 1.5 6 1.5s4.62-.69 6-1.5V12c0 .65-2.13 2-6 2s-6-1.35-6-2V9.5zM6 14.5c1.38.81 3.56 1.5 6 1.5s4.62-.69 6-1.5V17c0 .65-2.13 2-6 2s-6-1.35-6-2v-2.5z',
  aurora: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z',
  elasticache: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V8h2v2zm12 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V8h8v2z',
  'api-gateway': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  alb: 'M4 4h16v16H4V4zm12 8l-4-4-4 4h3v4h2v-4h3z',
  nlb: 'M4 4h16v16H4V4zm4 4v8l4-4 4 4V8l-4 4-4-4z',
  vpc: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.41 3.59-8 8-8v16c-4.41 0-8-3.59-8-8z',
  cloudfront: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  route53: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z',
  s3: 'M4 6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6zm2 0v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z',
  efs: 'M4 4h16v16H4V4zm2 2v12h12V6H6zm4 2h4v2h-4V8zm-2 4h8v2H8v-2zm2 4h4v2h-4v-2z',
  ebs: 'M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5l6 3.75v7.5l-6 3.75-6-3.75v-7.5l6-3.75z',
  sqs: 'M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 4h6v2H9v-2z',
  sns: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
  eventbridge: 'M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l6 3v9.64l-6 3-6-3V7.18l6-3zM12 8a4 4 0 100 8 4 4 0 000-8z',
  kinesis: 'M4 4h16v16H4V4zm4 4v8h2l4-4-4-4H8zm8 0l-4 4 4 4h2V8h-2z',
  'step-functions': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.83 0 1.5.67 1.5 1.5S12.83 8 12 8s-1.5-.67-1.5-1.5S11.17 5 12 5zm0 14c-.83 0-1.5-.67-1.5-1.5S11.17 16 12 16s1.5.67 1.5 1.5S12.83 19 12 19zm4-7c0 .83-.67 1.5-1.5 1.5S13 12.83 13 12s.67-1.5 1.5-1.5S16 11.17 16 12zm-8 0c0 .83-.67 1.5-1.5 1.5S5 12.83 5 12s.67-1.5 1.5-1.5S8 11.17 8 12z',
  waf: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  shield: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67v4.67c0 3.67-2.53 7.08-6 8.13V5z',
  'secrets-manager': 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.65 0 3 1.35 3 3 0 1.05-.55 1.95-1.36 2.49l.84 3.51h-5l.87-3.51A2.997 2.997 0 019 10c0-1.65 1.35-3 3-3z',
  kms: 'M12.65 10A5.99 5.99 0 006 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 006.65-4H17v4h4v-4h3v-4H12.65zM6 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  cognito: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
  cloudwatch: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.42V7z',
  xray: 'M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l6 3v9.64l-6 3-6-3V7.18l6-3zM9 9v6h2v-2h1l1 2h2l-1.33-2.5c.77-.5 1.33-1.32 1.33-2.25V10c0-1.66-1.34-3-3-3H9v2zm2 0h1a1 1 0 110 2h-1V9z',
};

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  type,
  size = 48,
  color,
  className = '',
  iconBasePath = '/icons',
  useFallback = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const category = getServiceCategory(type);
  const iconColor = color ?? getCategoryColor(category);
  const fallbackPath = FALLBACK_ICON_PATHS[type];
  const iconPath = `${iconBasePath}/${ICON_FILENAMES[type]}`;

  // Use fallback if forced or if icon failed to load
  if (useFallback || hasError) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path d={fallbackPath} fill={iconColor} />
      </svg>
    );
  }

  // Load icon directly
  return (
    <img
      src={iconPath}
      alt={type}
      width={size}
      height={size}
      className={className}
      onError={() => setHasError(true)}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default ServiceIcon;
