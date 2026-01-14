/**
 * Microservices E-commerce Architecture - Multi-Region
 */

import type { ArchitectureDefinition } from '../../types';

export const microservicesEcommerceArchitecture: ArchitectureDefinition = {
  id: 'microservices-ecommerce',
  name: 'Microservices E-commerce Platform',
  description: 'Multi-region high-availability containerized architecture',
  category: 'microservices',
  tags: ['ecs', 'fargate', 'aurora', 'elasticache', 'alb', 'cloudfront', 'multi-region'],
  version: '2.0.0',
  canvas: {
    width: 1400,
    height: 900,
  },
  services: [
    // Global Services (outside regions)
    {
      id: 'route53',
      type: 'route53',
      label: 'Route 53',
      position: { x: 60, y: 380 },
      badge: 'DNS',
      description: 'Global DNS routing with latency-based routing',
    },
    {
      id: 'cloudfront',
      type: 'cloudfront',
      label: 'CloudFront',
      position: { x: 200, y: 380 },
      description: 'Global CDN for static content and API caching',
    },
    {
      id: 's3',
      type: 's3',
      label: 'Product Images',
      position: { x: 200, y: 540 },
      description: 'S3 bucket with cross-region replication',
    },
    {
      id: 'cloudwatch',
      type: 'cloudwatch',
      label: 'CloudWatch',
      position: { x: 60, y: 540 },
      description: 'Centralized monitoring and alerting',
    },

    // ========== US-EAST-1 Region ==========
    {
      id: 'alb-east',
      type: 'alb',
      label: 'Application LB',
      position: { x: 400, y: 140 },
      description: 'Application Load Balancer (us-east-1)',
    },
    {
      id: 'user-service-east',
      type: 'ecs',
      label: 'User Service',
      position: { x: 580, y: 100 },
      description: 'User authentication (us-east-1)',
    },
    {
      id: 'order-service-east',
      type: 'ecs',
      label: 'Order Service',
      position: { x: 580, y: 220 },
      description: 'Order processing (us-east-1)',
    },
    {
      id: 'inventory-service-east',
      type: 'ecs',
      label: 'Inventory Service',
      position: { x: 580, y: 340 },
      description: 'Inventory tracking (us-east-1)',
    },
    {
      id: 'aurora-east',
      type: 'aurora',
      label: 'Aurora Primary',
      position: { x: 780, y: 140 },
      badge: 'Primary',
      description: 'Primary Aurora PostgreSQL (us-east-1)',
    },
    {
      id: 'elasticache-east',
      type: 'elasticache',
      label: 'Redis Cache',
      position: { x: 780, y: 280 },
      description: 'ElastiCache Redis (us-east-1)',
    },

    // ========== US-WEST-2 Region ==========
    {
      id: 'alb-west',
      type: 'alb',
      label: 'Application LB',
      position: { x: 400, y: 540 },
      description: 'Application Load Balancer (us-west-2)',
    },
    {
      id: 'user-service-west',
      type: 'ecs',
      label: 'User Service',
      position: { x: 580, y: 500 },
      description: 'User authentication (us-west-2)',
    },
    {
      id: 'order-service-west',
      type: 'ecs',
      label: 'Order Service',
      position: { x: 580, y: 620 },
      description: 'Order processing (us-west-2)',
    },
    {
      id: 'inventory-service-west',
      type: 'ecs',
      label: 'Inventory Service',
      position: { x: 580, y: 740 },
      description: 'Inventory tracking (us-west-2)',
    },
    {
      id: 'aurora-west',
      type: 'aurora',
      label: 'Aurora Replica',
      position: { x: 780, y: 540 },
      badge: 'Replica',
      description: 'Aurora read replica (us-west-2)',
    },
    {
      id: 'elasticache-west',
      type: 'elasticache',
      label: 'Redis Cache',
      position: { x: 780, y: 680 },
      description: 'ElastiCache Redis (us-west-2)',
    },
  ],
  connections: [
    // Global routing
    {
      id: 'flow-r53-cf',
      from: 'route53',
      to: 'cloudfront',
      type: 'sync',
      label: 'DNS',
      sequence: 1,
    },
    {
      id: 'flow-cf-s3',
      from: 'cloudfront',
      to: 's3',
      type: 'sync',
      label: 'Static',
      sequence: 2,
    },

    // CloudFront to both regions
    {
      id: 'flow-cf-alb-east',
      from: 'cloudfront',
      to: 'alb-east',
      type: 'sync',
      sequence: 2,
    },
    {
      id: 'flow-cf-alb-west',
      from: 'cloudfront',
      to: 'alb-west',
      type: 'sync',
      sequence: 2,
    },

    // US-EAST-1 internal flows
    {
      id: 'flow-alb-user-east',
      from: 'alb-east',
      to: 'user-service-east',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-alb-order-east',
      from: 'alb-east',
      to: 'order-service-east',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-alb-inv-east',
      from: 'alb-east',
      to: 'inventory-service-east',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-user-aurora-east',
      from: 'user-service-east',
      to: 'aurora-east',
      type: 'sync',
      sequence: 4,
    },
    {
      id: 'flow-order-aurora-east',
      from: 'order-service-east',
      to: 'aurora-east',
      type: 'sync',
      sequence: 4,
    },
    {
      id: 'flow-order-cache-east',
      from: 'order-service-east',
      to: 'elasticache-east',
      type: 'sync',
      sequence: 4,
    },
    {
      id: 'flow-inv-cache-east',
      from: 'inventory-service-east',
      to: 'elasticache-east',
      type: 'sync',
      sequence: 4,
    },

    // US-WEST-2 internal flows
    {
      id: 'flow-alb-user-west',
      from: 'alb-west',
      to: 'user-service-west',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-alb-order-west',
      from: 'alb-west',
      to: 'order-service-west',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-alb-inv-west',
      from: 'alb-west',
      to: 'inventory-service-west',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-user-aurora-west',
      from: 'user-service-west',
      to: 'aurora-west',
      type: 'sync',
      sequence: 4,
    },
    {
      id: 'flow-order-aurora-west',
      from: 'order-service-west',
      to: 'aurora-west',
      type: 'sync',
      sequence: 4,
    },
    {
      id: 'flow-order-cache-west',
      from: 'order-service-west',
      to: 'elasticache-west',
      type: 'sync',
      sequence: 4,
    },
    {
      id: 'flow-inv-cache-west',
      from: 'inventory-service-west',
      to: 'elasticache-west',
      type: 'sync',
      sequence: 4,
    },

    // Cross-region replication
    {
      id: 'flow-aurora-replication',
      from: 'aurora-east',
      to: 'aurora-west',
      type: 'async',
      label: 'Replication',
      sequence: 5,
    },
  ],
  groups: [
    // AWS Cloud - outermost container
    {
      id: 'aws-cloud',
      label: 'AWS Cloud',
      style: 'aws-cloud',
      bounds: { x: 40, y: 40, width: 900, height: 820 },
      zIndex: 0,
    },
    // US-EAST-1 Region
    {
      id: 'region-east',
      label: 'US-EAST-1',
      style: 'region',
      bounds: { x: 350, y: 60, width: 560, height: 380 },
      zIndex: 1,
    },
    // VPC in US-EAST-1
    {
      id: 'vpc-east',
      label: 'VPC',
      style: 'vpc',
      bounds: { x: 370, y: 90, width: 520, height: 330 },
      zIndex: 2,
    },
    // US-WEST-2 Region
    {
      id: 'region-west',
      label: 'US-WEST-2',
      style: 'region',
      bounds: { x: 350, y: 460, width: 560, height: 380 },
      zIndex: 1,
    },
    // VPC in US-WEST-2
    {
      id: 'vpc-west',
      label: 'VPC',
      style: 'vpc',
      bounds: { x: 370, y: 490, width: 520, height: 330 },
      zIndex: 2,
    },
  ],
  legend: [
    { type: 'sync', label: 'Sync Request' },
    { type: 'async', label: 'Async Replication' },
  ],
};
