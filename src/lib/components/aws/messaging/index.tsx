/**
 * Messaging service exports
 */

import React from 'react';
import { AWSService } from '../shared';
import type { AWSServiceBaseProps } from '../../../types';

// SQS Component
export type SQSProps = Omit<AWSServiceBaseProps, 'type'> & {
  queueName?: string;
  queueType?: 'Standard' | 'FIFO';
  visibilityTimeout?: number;
  messageRetention?: number;
};

export const SQS: React.FC<SQSProps> = ({ queueName, queueType, visibilityTimeout, messageRetention, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon SQS',
    custom: {
      ...metadata?.custom,
      ...(queueName && { Queue: queueName }),
      ...(queueType && { Type: queueType }),
      ...(visibilityTimeout && { 'Visibility Timeout': `${visibilityTimeout}s` }),
    },
  };
  return <AWSService type="sqs" metadata={enhancedMetadata} {...props} />;
};

// SNS Component
export type SNSProps = Omit<AWSServiceBaseProps, 'type'> & {
  topicName?: string;
  topicType?: 'Standard' | 'FIFO';
  subscriptionCount?: number;
};

export const SNS: React.FC<SNSProps> = ({ topicName, topicType, subscriptionCount, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon SNS',
    custom: {
      ...metadata?.custom,
      ...(topicName && { Topic: topicName }),
      ...(topicType && { Type: topicType }),
      ...(subscriptionCount && { Subscriptions: subscriptionCount }),
    },
  };
  return <AWSService type="sns" metadata={enhancedMetadata} {...props} />;
};

// EventBridge Component
export type EventBridgeProps = Omit<AWSServiceBaseProps, 'type'> & {
  busName?: string;
  ruleCount?: number;
};

export const EventBridge: React.FC<EventBridgeProps> = ({ busName, ruleCount, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon EventBridge',
    custom: {
      ...metadata?.custom,
      ...(busName && { Bus: busName }),
      ...(ruleCount && { Rules: ruleCount }),
    },
  };
  return <AWSService type="eventbridge" metadata={enhancedMetadata} {...props} />;
};

// Kinesis Component
export type KinesisProps = Omit<AWSServiceBaseProps, 'type'> & {
  streamName?: string;
  shardCount?: number;
  retentionHours?: number;
};

export const Kinesis: React.FC<KinesisProps> = ({ streamName, shardCount, retentionHours, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'Amazon Kinesis',
    custom: {
      ...metadata?.custom,
      ...(streamName && { Stream: streamName }),
      ...(shardCount && { Shards: shardCount }),
      ...(retentionHours && { Retention: `${retentionHours}h` }),
    },
  };
  return <AWSService type="kinesis" metadata={enhancedMetadata} {...props} />;
};

// Step Functions Component
export type StepFunctionsProps = Omit<AWSServiceBaseProps, 'type'> & {
  stateMachineName?: string;
  stateMachineType?: 'STANDARD' | 'EXPRESS';
  stateCount?: number;
};

export const StepFunctions: React.FC<StepFunctionsProps> = ({ stateMachineName, stateMachineType, stateCount, metadata, ...props }) => {
  const enhancedMetadata = {
    ...metadata,
    name: metadata?.name ?? 'AWS Step Functions',
    custom: {
      ...metadata?.custom,
      ...(stateMachineName && { 'State Machine': stateMachineName }),
      ...(stateMachineType && { Type: stateMachineType }),
      ...(stateCount && { States: stateCount }),
    },
  };
  return <AWSService type="step-functions" metadata={enhancedMetadata} {...props} />;
};
