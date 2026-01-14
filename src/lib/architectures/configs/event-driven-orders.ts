/**
 * Event-Driven Order Processing Architecture
 */

import type { ArchitectureDefinition } from '../../types';

export const eventDrivenOrdersArchitecture: ArchitectureDefinition = {
  id: 'event-driven-orders',
  name: 'Event-Driven Order Processing',
  description: 'Loosely coupled, scalable event architecture',
  category: 'event-driven',
  tags: ['eventbridge', 'lambda', 'step-functions', 'sqs', 'sns', 'dynamodb'],
  version: '1.0.0',
  canvas: {
    width: 1000,
    height: 600,
  },
  services: [
    // Event Sources
    {
      id: 'api-gateway',
      type: 'api-gateway',
      label: 'REST API',
      position: { x: 80, y: 120 },
      badge: 'Order',
      description: 'Receives order events via REST API',
    },
    {
      id: 's3-source',
      type: 's3',
      label: 'File Uploads',
      position: { x: 80, y: 250 },
      badge: 'S3 Event',
      description: 'S3 event notifications for file uploads',
    },
    {
      id: 'scheduler',
      type: 'cloudwatch',
      label: 'Scheduler',
      position: { x: 80, y: 380 },
      badge: 'Cron',
      description: 'Scheduled events for batch processing',
    },
    // Central Event Bus
    {
      id: 'eventbridge',
      type: 'eventbridge',
      label: 'EventBridge',
      position: { x: 280, y: 250 },
      description: 'Central event bus for routing events',
    },
    // Event Handlers
    {
      id: 'lambda-order',
      type: 'lambda',
      label: 'Order Processor',
      position: { x: 480, y: 70 },
      description: 'Processes incoming orders',
    },
    {
      id: 'lambda-notify',
      type: 'lambda',
      label: 'Notification',
      position: { x: 480, y: 200 },
      description: 'Sends notifications to customers',
    },
    {
      id: 'lambda-analytics',
      type: 'lambda',
      label: 'Analytics',
      position: { x: 480, y: 330 },
      description: 'Processes analytics events',
    },
    {
      id: 'step-functions',
      type: 'step-functions',
      label: 'Order Workflow',
      position: { x: 480, y: 460 },
      description: 'Orchestrates complex order workflows',
    },
    // Targets
    {
      id: 'dynamodb',
      type: 'dynamodb',
      label: 'Orders Table',
      position: { x: 680, y: 70 },
      description: 'Stores order data',
    },
    {
      id: 'sns',
      type: 'sns',
      label: 'Notifications',
      position: { x: 680, y: 200 },
      description: 'Publishes notifications to subscribers',
    },
    {
      id: 's3-target',
      type: 's3',
      label: 'Analytics Lake',
      position: { x: 680, y: 330 },
      description: 'Data lake for analytics storage',
    },
    {
      id: 'sqs',
      type: 'sqs',
      label: 'Fulfillment Queue',
      position: { x: 680, y: 460 },
      description: 'Queue for fulfillment processing',
    },
    // Monitoring
    {
      id: 'cloudwatch',
      type: 'cloudwatch',
      label: 'Monitoring',
      position: { x: 860, y: 250 },
      description: 'Centralized monitoring and logging',
    },
  ],
  connections: [
    // Sources → EventBridge
    {
      id: 'flow-api-eb',
      from: 'api-gateway',
      to: 'eventbridge',
      type: 'async',
      label: 'Order',
      sequence: 1,
    },
    {
      id: 'flow-s3-eb',
      from: 's3-source',
      to: 'eventbridge',
      type: 'async',
      label: 'S3 Event',
      sequence: 1,
    },
    {
      id: 'flow-sched-eb',
      from: 'scheduler',
      to: 'eventbridge',
      type: 'async',
      label: 'Cron',
      sequence: 1,
    },
    // EventBridge → Handlers
    {
      id: 'flow-eb-order',
      from: 'eventbridge',
      to: 'lambda-order',
      type: 'async',
      sequence: 2,
    },
    {
      id: 'flow-eb-notify',
      from: 'eventbridge',
      to: 'lambda-notify',
      type: 'async',
      sequence: 2,
    },
    {
      id: 'flow-eb-analytics',
      from: 'eventbridge',
      to: 'lambda-analytics',
      type: 'async',
      sequence: 2,
    },
    {
      id: 'flow-eb-sf',
      from: 'eventbridge',
      to: 'step-functions',
      type: 'async',
      sequence: 2,
    },
    // Handlers → Targets
    {
      id: 'flow-order-ddb',
      from: 'lambda-order',
      to: 'dynamodb',
      type: 'sync',
      sequence: 3,
    },
    {
      id: 'flow-notify-sns',
      from: 'lambda-notify',
      to: 'sns',
      type: 'async',
      sequence: 3,
    },
    {
      id: 'flow-analytics-s3',
      from: 'lambda-analytics',
      to: 's3-target',
      type: 'batch',
      sequence: 3,
    },
    {
      id: 'flow-sf-sqs',
      from: 'step-functions',
      to: 'sqs',
      type: 'async',
      sequence: 3,
    },
  ],
  legend: [
    { type: 'async', label: 'Async Event' },
    { type: 'sync', label: 'Sync Call' },
    { type: 'batch', label: 'Batch' },
  ],
};
