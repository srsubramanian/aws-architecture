/**
 * Containerized and Scalable Web Application on AWS
 * Based on AWS Guidance: https://aws.amazon.com/solutions/guidance/building-a-containerized-and-scalable-web-application-on-aws/
 */

import type { ArchitectureDefinition } from '../../types';

export const containerizedWebApp: ArchitectureDefinition = {
  id: 'containerized-webapp',
  name: 'Containerized Web Application',
  description: 'Scalable three-tier web application using ECS Fargate, CloudFront, and DynamoDB',
  category: 'containers',
  tags: ['ecs', 'fargate', 'cloudfront', 'dynamodb', 'api-gateway', 'three-tier', 'scalable', 'serverless'],
  version: '1.0.0',
  canvas: {
    width: 1100,
    height: 700,
  },
  services: [
    // Presentation Tier - External
    {
      id: 'route53',
      type: 'route53',
      label: 'Route 53',
      position: { x: 50, y: 280 },
      description: 'DNS with automatic failover and health checks',
    },
    {
      id: 'cloudfront',
      type: 'cloudfront',
      label: 'CloudFront',
      position: { x: 180, y: 180 },
      description: 'Global CDN for low latency content delivery',
    },
    {
      id: 's3',
      type: 's3',
      label: 'S3 Static',
      position: { x: 180, y: 380 },
      description: 'Static website content and assets',
    },
    {
      id: 'cognito',
      type: 'cognito',
      label: 'Cognito',
      position: { x: 310, y: 80 },
      description: 'User authentication and identity management',
    },
    // Application Tier
    {
      id: 'api-gateway',
      type: 'api-gateway',
      label: 'API Gateway',
      position: { x: 310, y: 280 },
      description: 'API management with throttling and monitoring',
    },
    {
      id: 'alb',
      type: 'alb',
      label: 'ALB',
      position: { x: 460, y: 280 },
      description: 'Application Load Balancer with health checks',
    },
    // ECS Fargate Services (multiple containers)
    {
      id: 'ecs-web',
      type: 'fargate',
      label: 'Web Service',
      position: { x: 610, y: 180 },
      description: 'Frontend container on Fargate',
    },
    {
      id: 'ecs-api',
      type: 'fargate',
      label: 'API Service',
      position: { x: 610, y: 280 },
      description: 'Backend API container on Fargate',
    },
    {
      id: 'ecs-worker',
      type: 'fargate',
      label: 'Worker Service',
      position: { x: 610, y: 380 },
      description: 'Background worker container on Fargate',
    },
    {
      id: 'ecr',
      type: 'ecs',
      label: 'ECR Registry',
      position: { x: 610, y: 480 },
      description: 'Container image registry',
    },
    // Data Tier
    {
      id: 'dynamodb',
      type: 'dynamodb',
      label: 'DynamoDB',
      position: { x: 800, y: 280 },
      description: 'Serverless NoSQL database with auto-scaling',
    },
    {
      id: 'elasticache',
      type: 'elasticache',
      label: 'ElastiCache',
      position: { x: 800, y: 180 },
      description: 'In-memory caching for performance',
    },
    // Monitoring
    {
      id: 'cloudwatch',
      type: 'cloudwatch',
      label: 'CloudWatch',
      position: { x: 950, y: 280 },
      description: 'Metrics, logs, and dashboards',
    },
  ],
  connections: [
    // User to DNS
    { id: 'dns-cf', from: 'route53', to: 'cloudfront', type: 'sync', label: 'Static' },
    { id: 'dns-api', from: 'route53', to: 'api-gateway', type: 'sync', label: 'API' },
    // CloudFront to S3
    { id: 'cf-s3', from: 'cloudfront', to: 's3', type: 'sync', label: 'Origin' },
    // Auth flow
    { id: 'api-cognito', from: 'api-gateway', to: 'cognito', type: 'sync', label: 'Auth' },
    // API to ALB
    { id: 'api-alb', from: 'api-gateway', to: 'alb', type: 'sync', label: 'Route' },
    // ALB to ECS services
    { id: 'alb-web', from: 'alb', to: 'ecs-web', type: 'sync', label: 'HTTP' },
    { id: 'alb-api', from: 'alb', to: 'ecs-api', type: 'sync', label: 'HTTP' },
    // ECS to data tier
    { id: 'api-cache', from: 'ecs-api', to: 'elasticache', type: 'sync', label: 'Cache' },
    { id: 'api-db', from: 'ecs-api', to: 'dynamodb', type: 'sync', label: 'Query' },
    { id: 'worker-db', from: 'ecs-worker', to: 'dynamodb', type: 'async', label: 'Process' },
    // ECR to ECS
    { id: 'ecr-web', from: 'ecr', to: 'ecs-web', type: 'sync', label: 'Pull' },
    { id: 'ecr-api', from: 'ecr', to: 'ecs-api', type: 'sync', label: 'Pull' },
    { id: 'ecr-worker', from: 'ecr', to: 'ecs-worker', type: 'sync', label: 'Pull' },
    // Monitoring
    { id: 'ecs-cw', from: 'ecs-api', to: 'cloudwatch', type: 'stream', label: 'Logs' },
    { id: 'db-cw', from: 'dynamodb', to: 'cloudwatch', type: 'stream', label: 'Metrics' },
  ],
  groups: [
    {
      id: 'vpc',
      label: 'VPC',
      serviceIds: ['alb', 'ecs-web', 'ecs-api', 'ecs-worker', 'dynamodb', 'elasticache'],
      style: 'vpc',
      color: '#A166FF',
    },
  ],
  legend: [
    { type: 'sync', label: 'Synchronous Request' },
    { type: 'async', label: 'Async Processing' },
    { type: 'stream', label: 'Logs/Metrics Stream' },
  ],
  metadata: {
    createdAt: '2026-01-14',
    source: 'https://aws.amazon.com/solutions/guidance/building-a-containerized-and-scalable-web-application-on-aws/',
  },
};
