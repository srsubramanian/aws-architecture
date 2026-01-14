/**
 * Containerized and Scalable Web Application on AWS
 * Based on AWS Guidance: https://aws.amazon.com/solutions/guidance/building-a-containerized-and-scalable-web-application-on-aws/
 *
 * Exact replica of the official AWS architecture diagram with proper nested boxes
 */

import type { ArchitectureDefinition } from '../../types';

export const containerizedWebApp: ArchitectureDefinition = {
  id: 'containerized-webapp',
  name: 'Containerized Web Application',
  description: 'Scalable three-tier web application using ECS Fargate with multi-AZ deployment',
  category: 'containers',
  tags: ['ecs', 'fargate', 'cloudfront', 'dynamodb', 'api-gateway', 'three-tier', 'scalable', 'multi-az', 'vpc'],
  version: '1.0.0',
  canvas: {
    width: 1150,
    height: 680,
  },
  services: [
    // Left column - Entry points
    {
      id: 'route53',
      type: 'route53',
      label: 'Route 53',
      position: { x: 100, y: 100 },
      description: '1. DNS routing',
    },
    {
      id: 'cognito',
      type: 'cognito',
      label: 'Cognito',
      position: { x: 100, y: 210 },
      description: '2. Authentication',
    },
    {
      id: 'cloudfront',
      type: 'cloudfront',
      label: 'CloudFront',
      position: { x: 100, y: 320 },
      description: '3. CDN',
    },
    {
      id: 's3',
      type: 's3',
      label: 'S3',
      position: { x: 100, y: 430 },
      description: '4. Static storage',
    },

    // Middle - API Layer
    {
      id: 'api-gateway',
      type: 'api-gateway',
      label: 'API Gateway',
      position: { x: 250, y: 320 },
      description: '5. API management',
    },
    {
      id: 'alb',
      type: 'alb',
      label: 'ALB',
      position: { x: 400, y: 320 },
      description: '6. Load Balancer',
    },

    // AZ 1 - Private app subnet
    {
      id: 'ecs-az1',
      type: 'ecs',
      label: 'ECS',
      position: { x: 540, y: 170 },
      description: '7. ECS (AZ1)',
    },
    {
      id: 'fargate-az1',
      type: 'fargate',
      label: 'Fargate',
      position: { x: 640, y: 170 },
      description: '7. Fargate (AZ1)',
    },

    // AZ 1 - Private database subnet
    {
      id: 'dynamodb-az1',
      type: 'dynamodb',
      label: 'DynamoDB',
      position: { x: 800, y: 170 },
      description: '8. Database (AZ1)',
    },

    // AZ 2 - Private app subnet
    {
      id: 'ecs-az2',
      type: 'ecs',
      label: 'ECS',
      position: { x: 540, y: 470 },
      description: '7. ECS (AZ2)',
    },
    {
      id: 'fargate-az2',
      type: 'fargate',
      label: 'Fargate',
      position: { x: 640, y: 470 },
      description: '7. Fargate (AZ2)',
    },

    // AZ 2 - Private database subnet
    {
      id: 'dynamodb-az2',
      type: 'dynamodb',
      label: 'DynamoDB',
      position: { x: 800, y: 470 },
      description: '8. Database (AZ2)',
    },

    // Right side - ECR and CloudWatch (outside VPC)
    {
      id: 'ecr',
      type: 'ecs',
      label: 'ECR',
      position: { x: 980, y: 100 },
      description: '9. Container Registry',
    },
    {
      id: 'cloudwatch',
      type: 'cloudwatch',
      label: 'CloudWatch',
      position: { x: 980, y: 320 },
      description: '10. Monitoring',
    },
  ],
  connections: [
    // Entry flow
    { id: 'r53-cognito', from: 'route53', to: 'cognito', type: 'sync' },
    { id: 'cognito-cf', from: 'cognito', to: 'cloudfront', type: 'sync' },
    { id: 'cf-s3', from: 'cloudfront', to: 's3', type: 'sync' },
    { id: 'cf-api', from: 'cloudfront', to: 'api-gateway', type: 'sync' },

    // API to ALB
    { id: 'api-alb', from: 'api-gateway', to: 'alb', type: 'sync' },

    // ALB to ECS in both AZs
    { id: 'alb-ecs1', from: 'alb', to: 'ecs-az1', type: 'sync' },
    { id: 'alb-ecs2', from: 'alb', to: 'ecs-az2', type: 'sync' },

    // ECS to Fargate
    { id: 'ecs1-fargate1', from: 'ecs-az1', to: 'fargate-az1', type: 'sync' },
    { id: 'ecs2-fargate2', from: 'ecs-az2', to: 'fargate-az2', type: 'sync' },

    // Fargate to DynamoDB
    { id: 'fargate1-ddb1', from: 'fargate-az1', to: 'dynamodb-az1', type: 'sync' },
    { id: 'fargate2-ddb2', from: 'fargate-az2', to: 'dynamodb-az2', type: 'sync' },

    // ECR to ECS
    { id: 'ecr-ecs1', from: 'ecr', to: 'ecs-az1', type: 'sync', label: 'Pull' },
    { id: 'ecr-ecs2', from: 'ecr', to: 'ecs-az2', type: 'sync', label: 'Pull' },

    // CloudWatch monitoring
    { id: 'ddb1-cw', from: 'dynamodb-az1', to: 'cloudwatch', type: 'stream' },
    { id: 'ddb2-cw', from: 'dynamodb-az2', to: 'cloudwatch', type: 'stream' },
  ],
  groups: [
    // AWS Cloud - outermost container
    {
      id: 'aws-cloud',
      label: 'AWS Cloud',
      style: 'aws-cloud',
      bounds: { x: 60, y: 60, width: 1030, height: 560 },
      zIndex: 0,
    },
    // VPC - contains ALB and both AZs
    {
      id: 'vpc',
      label: 'Virtual private cloud (VPC)',
      style: 'vpc',
      bounds: { x: 360, y: 90, width: 560, height: 500 },
      zIndex: 1,
    },
    // AZ 1 container
    {
      id: 'az1',
      label: 'AZ 1',
      style: 'az',
      bounds: { x: 500, y: 120, width: 400, height: 180 },
      zIndex: 2,
    },
    // AZ 1 - Private app subnet
    {
      id: 'az1-app',
      label: 'Private app subnet',
      style: 'subnet',
      bounds: { x: 520, y: 150, width: 200, height: 130 },
      zIndex: 3,
    },
    // AZ 1 - Private database subnet
    {
      id: 'az1-db',
      label: 'Private database subnet',
      style: 'subnet',
      bounds: { x: 770, y: 150, width: 120, height: 130 },
      zIndex: 3,
    },
    // AZ 2 container
    {
      id: 'az2',
      label: 'AZ 2',
      style: 'az',
      bounds: { x: 500, y: 420, width: 400, height: 180 },
      zIndex: 2,
    },
    // AZ 2 - Private app subnet
    {
      id: 'az2-app',
      label: 'Private app subnet',
      style: 'subnet',
      bounds: { x: 520, y: 450, width: 200, height: 130 },
      zIndex: 3,
    },
    // AZ 2 - Private database subnet
    {
      id: 'az2-db',
      label: 'Private database subnet',
      style: 'subnet',
      bounds: { x: 770, y: 450, width: 120, height: 130 },
      zIndex: 3,
    },
  ],
  legend: [
    { type: 'sync', label: 'Request/Response' },
    { type: 'stream', label: 'Metrics/Logs' },
  ],
  metadata: {
    createdAt: '2026-01-14',
    source: 'https://aws.amazon.com/solutions/guidance/building-a-containerized-and-scalable-web-application-on-aws/',
  },
};
