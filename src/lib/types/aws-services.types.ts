/**
 * AWS Service Types and Interfaces
 */

/** All supported AWS service types */
export type AWSServiceType =
  // Compute
  | 'lambda'
  | 'ec2'
  | 'ecs'
  | 'fargate'
  // Database
  | 'dynamodb'
  | 'rds'
  | 'aurora'
  | 'elasticache'
  // Networking
  | 'api-gateway'
  | 'alb'
  | 'nlb'
  | 'vpc'
  | 'cloudfront'
  | 'route53'
  // Storage
  | 's3'
  | 'efs'
  | 'ebs'
  // Messaging
  | 'sqs'
  | 'sns'
  | 'eventbridge'
  | 'kinesis'
  | 'step-functions'
  // Security
  | 'waf'
  | 'shield'
  | 'secrets-manager'
  | 'kms'
  | 'cognito'
  // Monitoring
  | 'cloudwatch'
  | 'xray';

/** Service category for styling */
export type ServiceCategory =
  | 'compute'
  | 'database'
  | 'networking'
  | 'storage'
  | 'messaging'
  | 'security'
  | 'monitoring';

/** Service size variants */
export type ServiceSize = 'sm' | 'md' | 'lg' | 'xl';

/** Service state variants */
export type ServiceVariant =
  | 'default'
  | 'highlighted'
  | 'dimmed'
  | 'error'
  | 'success'
  | 'warning'
  | 'processing';

/** Position in the diagram */
export interface Position {
  x: number;
  y: number;
}

/** Service metadata for tooltips and details */
export interface ServiceMetadata {
  /** Display name */
  name: string;
  /** AWS service description */
  description?: string;
  /** Instance type or configuration */
  instanceType?: string;
  /** Memory configuration */
  memory?: string;
  /** CPU configuration */
  cpu?: string;
  /** Storage configuration */
  storage?: string;
  /** Region */
  region?: string;
  /** Availability zones */
  availabilityZones?: string[];
  /** Estimated monthly cost */
  estimatedCost?: string;
  /** Custom properties */
  custom?: Record<string, string | number | boolean>;
}

/** Base props for all AWS service components */
export interface AWSServiceBaseProps {
  /** Unique identifier for the service */
  id: string;
  /** Label displayed below the icon */
  label?: string;
  /** Position in the canvas */
  position: Position;
  /** Size of the component */
  size?: ServiceSize;
  /** Visual variant */
  variant?: ServiceVariant;
  /** Click handler */
  onClick?: (id: string) => void;
  /** Hover start handler */
  onHoverStart?: (id: string) => void;
  /** Hover end handler */
  onHoverEnd?: (id: string) => void;
  /** Service metadata for tooltips */
  metadata?: ServiceMetadata;
  /** Animation delay in seconds */
  animationDelay?: number;
  /** Whether to show tooltip on hover */
  showTooltip?: boolean;
  /** Custom tooltip content */
  tooltipContent?: React.ReactNode;
  /** Whether the service is currently selected */
  isSelected?: boolean;
  /** Whether the service is part of an active flow */
  isInFlow?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Z-index for layering */
  zIndex?: number;
}

/** Service instance in a diagram configuration */
export interface ServiceInstance {
  id: string;
  type: AWSServiceType;
  label?: string;
  position: Position;
  size?: ServiceSize;
  variant?: ServiceVariant;
  metadata?: ServiceMetadata;
  animationDelay?: number;
}

/** Map of service type to category */
export const SERVICE_CATEGORIES: Record<AWSServiceType, ServiceCategory> = {
  // Compute
  lambda: 'compute',
  ec2: 'compute',
  ecs: 'compute',
  fargate: 'compute',
  // Database
  dynamodb: 'database',
  rds: 'database',
  aurora: 'database',
  elasticache: 'database',
  // Networking
  'api-gateway': 'networking',
  alb: 'networking',
  nlb: 'networking',
  vpc: 'networking',
  cloudfront: 'networking',
  route53: 'networking',
  // Storage
  s3: 'storage',
  efs: 'storage',
  ebs: 'storage',
  // Messaging
  sqs: 'messaging',
  sns: 'messaging',
  eventbridge: 'messaging',
  kinesis: 'messaging',
  'step-functions': 'messaging',
  // Security
  waf: 'security',
  shield: 'security',
  'secrets-manager': 'security',
  kms: 'security',
  cognito: 'security',
  // Monitoring
  cloudwatch: 'monitoring',
  xray: 'monitoring',
};

/** Get the category for a service type */
export function getServiceCategory(type: AWSServiceType): ServiceCategory {
  return SERVICE_CATEGORIES[type];
}
