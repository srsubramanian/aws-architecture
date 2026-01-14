/**
 * Containerized and Scalable Web Application on AWS
 * Based on AWS Guidance: https://aws.amazon.com/solutions/guidance/building-a-containerized-and-scalable-web-application-on-aws/
 *
 * Exact replica of the official AWS architecture diagram
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
    width: 1200,
    height: 750,
  },
  services: [
    // Left column - Entry points (outside AWS Cloud conceptually shown inside)
    {
      id: 'route53',
      type: 'route53',
      label: 'Route 53',
      position: { x: 80, y: 80 },
      description: '1. DNS routing with health checks',
    },
    {
      id: 'cognito',
      type: 'cognito',
      label: 'Cognito',
      position: { x: 80, y: 200 },
      description: '2. User authentication',
    },
    {
      id: 'cloudfront',
      type: 'cloudfront',
      label: 'CloudFront',
      position: { x: 80, y: 320 },
      description: '3. CDN distribution',
    },
    {
      id: 's3',
      type: 's3',
      label: 'S3 Static',
      position: { x: 80, y: 440 },
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
      position: { x: 420, y: 320 },
      description: '6. Application Load Balancer',
    },

    // AZ 1 - Private app subnet
    {
      id: 'ecs-az1',
      type: 'ecs',
      label: 'ECS',
      position: { x: 580, y: 160 },
      description: '7. Container orchestration (AZ1)',
    },
    {
      id: 'fargate-az1',
      type: 'fargate',
      label: 'Fargate',
      position: { x: 700, y: 160 },
      description: '7. Serverless containers (AZ1)',
    },

    // AZ 1 - Private database subnet
    {
      id: 'dynamodb-az1',
      type: 'dynamodb',
      label: 'DynamoDB',
      position: { x: 880, y: 160 },
      description: '8. NoSQL database (AZ1)',
    },

    // AZ 2 - Private app subnet
    {
      id: 'ecs-az2',
      type: 'ecs',
      label: 'ECS',
      position: { x: 580, y: 480 },
      description: '7. Container orchestration (AZ2)',
    },
    {
      id: 'fargate-az2',
      type: 'fargate',
      label: 'Fargate',
      position: { x: 700, y: 480 },
      description: '7. Serverless containers (AZ2)',
    },

    // AZ 2 - Private database subnet
    {
      id: 'dynamodb-az2',
      type: 'dynamodb',
      label: 'DynamoDB',
      position: { x: 880, y: 480 },
      description: '8. NoSQL database (AZ2)',
    },

    // Right side - ECR and CloudWatch
    {
      id: 'ecr',
      type: 'ecs',
      label: 'ECR',
      position: { x: 1050, y: 80 },
      description: '9. Container registry',
    },
    {
      id: 'cloudwatch',
      type: 'cloudwatch',
      label: 'CloudWatch',
      position: { x: 1050, y: 320 },
      description: '10. Monitoring & logging',
    },
  ],
  connections: [
    // Entry flow
    { id: 'r53-cognito', from: 'route53', to: 'cognito', type: 'sync' },
    { id: 'cognito-cf', from: 'cognito', to: 'cloudfront', type: 'sync' },
    { id: 'cf-s3', from: 'cloudfront', to: 's3', type: 'sync', label: 'Static' },
    { id: 'cf-api', from: 'cloudfront', to: 'api-gateway', type: 'sync' },

    // API to ALB
    { id: 'api-alb', from: 'api-gateway', to: 'alb', type: 'sync' },

    // ALB to ECS in both AZs
    { id: 'alb-ecs1', from: 'alb', to: 'ecs-az1', type: 'sync' },
    { id: 'alb-ecs2', from: 'alb', to: 'ecs-az2', type: 'sync' },

    // ECS to Fargate (same service group)
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
    { id: 'ecs1-cw', from: 'ecs-az1', to: 'cloudwatch', type: 'stream' },
    { id: 'ecs2-cw', from: 'ecs-az2', to: 'cloudwatch', type: 'stream' },
  ],
  groups: [
    {
      id: 'vpc',
      label: 'Virtual Private Cloud (VPC)',
      serviceIds: ['alb', 'ecs-az1', 'fargate-az1', 'dynamodb-az1', 'ecs-az2', 'fargate-az2', 'dynamodb-az2'],
      style: 'vpc',
      color: '#A166FF',
    },
    {
      id: 'az1-app',
      label: 'AZ 1 - Private app subnet',
      serviceIds: ['ecs-az1', 'fargate-az1'],
      style: 'subnet',
      color: '#00A4A6',
    },
    {
      id: 'az1-db',
      label: 'AZ 1 - Private database subnet',
      serviceIds: ['dynamodb-az1'],
      style: 'subnet',
      color: '#00A4A6',
    },
    {
      id: 'az2-app',
      label: 'AZ 2 - Private app subnet',
      serviceIds: ['ecs-az2', 'fargate-az2'],
      style: 'subnet',
      color: '#00A4A6',
    },
    {
      id: 'az2-db',
      label: 'AZ 2 - Private database subnet',
      serviceIds: ['dynamodb-az2'],
      style: 'subnet',
      color: '#00A4A6',
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
