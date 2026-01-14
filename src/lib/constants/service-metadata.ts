/**
 * AWS Service Metadata
 */

import type { AWSServiceType, ServiceCategory } from '../types';

/** Service metadata information */
export interface ServiceInfo {
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Service category */
  category: ServiceCategory;
  /** AWS documentation URL path */
  docsPath: string;
  /** Common use cases */
  useCases: string[];
  /** Related services */
  relatedServices: AWSServiceType[];
}

/** Metadata for all AWS services */
export const SERVICE_METADATA: Record<AWSServiceType, ServiceInfo> = {
  // Compute Services
  lambda: {
    name: 'AWS Lambda',
    description: 'Serverless compute service that runs code in response to events',
    category: 'compute',
    docsPath: '/lambda',
    useCases: ['Event-driven processing', 'API backends', 'Data processing'],
    relatedServices: ['api-gateway', 'dynamodb', 'sqs', 's3'],
  },
  ec2: {
    name: 'Amazon EC2',
    description: 'Virtual servers in the cloud with full control over computing resources',
    category: 'compute',
    docsPath: '/ec2',
    useCases: ['Web hosting', 'Application servers', 'High-performance computing'],
    relatedServices: ['alb', 'rds', 'ebs', 'vpc'],
  },
  ecs: {
    name: 'Amazon ECS',
    description: 'Fully managed container orchestration service',
    category: 'compute',
    docsPath: '/ecs',
    useCases: ['Microservices', 'Batch processing', 'ML inference'],
    relatedServices: ['fargate', 'alb', 'cloudwatch'],
  },
  fargate: {
    name: 'AWS Fargate',
    description: 'Serverless compute engine for containers',
    category: 'compute',
    docsPath: '/fargate',
    useCases: ['Serverless containers', 'Microservices', 'Batch jobs'],
    relatedServices: ['ecs', 'alb', 'cloudwatch'],
  },

  // Database Services
  dynamodb: {
    name: 'Amazon DynamoDB',
    description: 'Fast, flexible NoSQL database service for any scale',
    category: 'database',
    docsPath: '/dynamodb',
    useCases: ['Session management', 'Gaming leaderboards', 'Real-time bidding'],
    relatedServices: ['lambda', 'api-gateway', 'kinesis'],
  },
  rds: {
    name: 'Amazon RDS',
    description: 'Managed relational database service for MySQL, PostgreSQL, and more',
    category: 'database',
    docsPath: '/rds',
    useCases: ['Web applications', 'E-commerce', 'Enterprise applications'],
    relatedServices: ['ec2', 'lambda', 'secrets-manager'],
  },
  aurora: {
    name: 'Amazon Aurora',
    description: 'MySQL and PostgreSQL-compatible relational database with high performance',
    category: 'database',
    docsPath: '/aurora',
    useCases: ['Enterprise applications', 'SaaS applications', 'Gaming'],
    relatedServices: ['rds', 'lambda', 'secrets-manager'],
  },
  elasticache: {
    name: 'Amazon ElastiCache',
    description: 'In-memory caching service for Redis and Memcached',
    category: 'database',
    docsPath: '/elasticache',
    useCases: ['Session caching', 'Real-time analytics', 'Message queuing'],
    relatedServices: ['rds', 'ec2', 'lambda'],
  },

  // Networking Services
  'api-gateway': {
    name: 'Amazon API Gateway',
    description: 'Fully managed service for creating, publishing, and managing APIs',
    category: 'networking',
    docsPath: '/apigateway',
    useCases: ['REST APIs', 'WebSocket APIs', 'HTTP APIs'],
    relatedServices: ['lambda', 'cognito', 'waf'],
  },
  alb: {
    name: 'Application Load Balancer',
    description: 'Layer 7 load balancer for HTTP/HTTPS traffic',
    category: 'networking',
    docsPath: '/elasticloadbalancing',
    useCases: ['Web applications', 'Microservices', 'Container workloads'],
    relatedServices: ['ec2', 'ecs', 'waf'],
  },
  nlb: {
    name: 'Network Load Balancer',
    description: 'Layer 4 load balancer for TCP/UDP traffic',
    category: 'networking',
    docsPath: '/elasticloadbalancing',
    useCases: ['Gaming', 'IoT', 'Low-latency applications'],
    relatedServices: ['ec2', 'ecs', 'vpc'],
  },
  vpc: {
    name: 'Amazon VPC',
    description: 'Isolated cloud resources in a virtual network',
    category: 'networking',
    docsPath: '/vpc',
    useCases: ['Network isolation', 'Hybrid cloud', 'Multi-tier applications'],
    relatedServices: ['ec2', 'rds', 'lambda'],
  },
  cloudfront: {
    name: 'Amazon CloudFront',
    description: 'Fast content delivery network (CDN) service',
    category: 'networking',
    docsPath: '/cloudfront',
    useCases: ['Static content delivery', 'API acceleration', 'Video streaming'],
    relatedServices: ['s3', 'alb', 'waf'],
  },
  route53: {
    name: 'Amazon Route 53',
    description: 'Scalable domain name system (DNS) web service',
    category: 'networking',
    docsPath: '/route53',
    useCases: ['DNS management', 'Traffic routing', 'Health checking'],
    relatedServices: ['cloudfront', 'alb', 's3'],
  },

  // Storage Services
  s3: {
    name: 'Amazon S3',
    description: 'Object storage with industry-leading scalability and durability',
    category: 'storage',
    docsPath: '/s3',
    useCases: ['Data lakes', 'Backup and restore', 'Static website hosting'],
    relatedServices: ['cloudfront', 'lambda', 'dynamodb'],
  },
  efs: {
    name: 'Amazon EFS',
    description: 'Scalable, elastic file storage for Linux-based workloads',
    category: 'storage',
    docsPath: '/efs',
    useCases: ['Container storage', 'Web serving', 'Content management'],
    relatedServices: ['ec2', 'ecs', 'lambda'],
  },
  ebs: {
    name: 'Amazon EBS',
    description: 'Block storage volumes for use with EC2 instances',
    category: 'storage',
    docsPath: '/ebs',
    useCases: ['Boot volumes', 'Database storage', 'Enterprise applications'],
    relatedServices: ['ec2', 'rds'],
  },

  // Messaging Services
  sqs: {
    name: 'Amazon SQS',
    description: 'Fully managed message queuing service',
    category: 'messaging',
    docsPath: '/sqs',
    useCases: ['Decoupling microservices', 'Batch processing', 'Request buffering'],
    relatedServices: ['lambda', 'sns', 'ecs'],
  },
  sns: {
    name: 'Amazon SNS',
    description: 'Fully managed pub/sub messaging service',
    category: 'messaging',
    docsPath: '/sns',
    useCases: ['Push notifications', 'Fan-out messaging', 'Alerting'],
    relatedServices: ['sqs', 'lambda', 'cloudwatch'],
  },
  eventbridge: {
    name: 'Amazon EventBridge',
    description: 'Serverless event bus for building event-driven applications',
    category: 'messaging',
    docsPath: '/eventbridge',
    useCases: ['Event-driven architectures', 'SaaS integrations', 'Scheduling'],
    relatedServices: ['lambda', 'step-functions', 'sqs'],
  },
  kinesis: {
    name: 'Amazon Kinesis',
    description: 'Real-time data streaming service',
    category: 'messaging',
    docsPath: '/kinesis',
    useCases: ['Real-time analytics', 'Log aggregation', 'IoT data ingestion'],
    relatedServices: ['lambda', 's3', 'dynamodb'],
  },
  'step-functions': {
    name: 'AWS Step Functions',
    description: 'Visual workflow service for orchestrating distributed applications',
    category: 'messaging',
    docsPath: '/step-functions',
    useCases: ['Workflow orchestration', 'Data processing', 'Microservice coordination'],
    relatedServices: ['lambda', 'ecs', 'sns'],
  },

  // Security Services
  waf: {
    name: 'AWS WAF',
    description: 'Web application firewall to protect against common web exploits',
    category: 'security',
    docsPath: '/waf',
    useCases: ['SQL injection protection', 'XSS protection', 'Bot mitigation'],
    relatedServices: ['cloudfront', 'alb', 'api-gateway'],
  },
  shield: {
    name: 'AWS Shield',
    description: 'DDoS protection service',
    category: 'security',
    docsPath: '/shield',
    useCases: ['DDoS protection', 'Network security', 'Application protection'],
    relatedServices: ['cloudfront', 'route53', 'alb'],
  },
  'secrets-manager': {
    name: 'AWS Secrets Manager',
    description: 'Securely store and manage secrets',
    category: 'security',
    docsPath: '/secretsmanager',
    useCases: ['Database credentials', 'API keys', 'OAuth tokens'],
    relatedServices: ['rds', 'lambda', 'ecs'],
  },
  kms: {
    name: 'AWS KMS',
    description: 'Create and manage cryptographic keys',
    category: 'security',
    docsPath: '/kms',
    useCases: ['Data encryption', 'Key management', 'Digital signing'],
    relatedServices: ['s3', 'ebs', 'secrets-manager'],
  },
  cognito: {
    name: 'Amazon Cognito',
    description: 'Identity management for web and mobile applications',
    category: 'security',
    docsPath: '/cognito',
    useCases: ['User authentication', 'Social login', 'User pools'],
    relatedServices: ['api-gateway', 'lambda', 'alb'],
  },

  // Monitoring Services
  cloudwatch: {
    name: 'Amazon CloudWatch',
    description: 'Monitoring and observability service for AWS resources',
    category: 'monitoring',
    docsPath: '/cloudwatch',
    useCases: ['Metrics monitoring', 'Log analysis', 'Alerting'],
    relatedServices: ['lambda', 'ec2', 'sns'],
  },
  xray: {
    name: 'AWS X-Ray',
    description: 'Analyze and debug distributed applications',
    category: 'monitoring',
    docsPath: '/xray',
    useCases: ['Distributed tracing', 'Performance analysis', 'Error tracking'],
    relatedServices: ['lambda', 'api-gateway', 'ecs'],
  },
};

/** Get service info by type */
export function getServiceInfo(type: AWSServiceType): ServiceInfo {
  return SERVICE_METADATA[type];
}

/** Get all services by category */
export function getServicesByCategory(category: ServiceCategory): AWSServiceType[] {
  return (Object.entries(SERVICE_METADATA) as [AWSServiceType, ServiceInfo][])
    .filter(([, info]) => info.category === category)
    .map(([type]) => type);
}
