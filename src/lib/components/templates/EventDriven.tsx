/**
 * Event-Driven Architecture Template
 *
 * EventBridge (central) → Multiple Lambda consumers
 *                      → DynamoDB, S3, SNS, SQS
 *                      → Step Functions for orchestration
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { DiagramCanvas } from '../diagrams/DiagramCanvas';
import { DiagramControls } from '../diagrams/DiagramControls';
import { DataFlow } from '../connections/DataFlow';
import { APIGateway } from '../aws/networking';
import { Lambda } from '../aws/compute';
import { DynamoDB } from '../aws/database';
import { S3 } from '../aws/storage';
import { EventBridge, SQS, SNS, StepFunctions } from '../aws/messaging';
import { CloudWatch } from '../aws/monitoring';
import { useDiagramControls } from '../../hooks';
import { containerVariants } from '../../constants/animation-presets';
import type { ThemeType } from '../../types';

export interface EventDrivenProps {
  theme?: ThemeType;
  autoPlay?: boolean;
  speed?: number;
  showControls?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const EventDriven: React.FC<EventDrivenProps> = ({
  theme = 'light',
  autoPlay = true,
  speed = 1,
  showControls = true,
  width = 1100,
  height = 650,
  className = '',
}) => {
  const {
    playbackState,
    play, pause, stop, next, previous, setSpeed,
    toggleLoop, loopEnabled,
  } = useDiagramControls({
    totalSteps: 7,
    autoPlay,
    loop: true,
    stepDuration: 2000 / speed,
  });

  const positions = useMemo(() => ({
    // Event Sources
    apiGateway: { x: 80, y: 150 },
    s3Source: { x: 80, y: 280 },
    schedule: { x: 80, y: 410 },
    // Central Bus
    eventBridge: { x: 280, y: 280 },
    // Consumers
    lambdaOrder: { x: 480, y: 100 },
    lambdaNotify: { x: 480, y: 230 },
    lambdaAnalytics: { x: 480, y: 360 },
    stepFunctions: { x: 480, y: 490 },
    // Targets
    dynamodb: { x: 680, y: 100 },
    sns: { x: 680, y: 230 },
    s3Target: { x: 680, y: 360 },
    sqs: { x: 680, y: 490 },
    // Monitoring
    cloudwatch: { x: 880, y: 280 },
  }), []);

  return (
    <div className={`event-driven-diagram relative ${className}`}>
      <DiagramCanvas theme={theme} autoPlay={autoPlay} speed={speed} showControls={false}>
        <div style={{ width, height, position: 'relative' }}>
          {/* Title */}
          <div className="absolute top-4 left-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Event-Driven Order Processing
          </div>
          <div className="absolute top-10 left-4 text-sm text-gray-500 dark:text-gray-400">
            Loosely coupled, scalable event architecture
          </div>

          {/* Section labels */}
          <div className="absolute text-xs font-medium text-gray-400 dark:text-gray-500"
               style={{ left: 80, top: 90 }}>
            Event Sources
          </div>
          <div className="absolute text-xs font-medium text-gray-400 dark:text-gray-500"
               style={{ left: 280, top: 240 }}>
            Event Bus
          </div>
          <div className="absolute text-xs font-medium text-gray-400 dark:text-gray-500"
               style={{ left: 480, top: 60 }}>
            Event Handlers
          </div>
          <div className="absolute text-xs font-medium text-gray-400 dark:text-gray-500"
               style={{ left: 680, top: 60 }}>
            Targets
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Event Sources */}
            <APIGateway
              id="api-gateway"
              label="REST API"
              position={positions.apiGateway}
              size="md"
              animationDelay={0}
              metadata={{ name: 'REST API', description: 'Receives order events' }}
            />

            <S3
              id="s3-source"
              label="File Uploads"
              position={positions.s3Source}
              size="md"
              animationDelay={0.1}
              metadata={{ name: 'File Uploads', description: 'S3 event notifications' }}
            />

            <CloudWatch
              id="schedule"
              label="Scheduler"
              position={positions.schedule}
              size="md"
              animationDelay={0.2}
              metadata={{ name: 'Scheduler', description: 'Scheduled events' }}
            />

            {/* Central Event Bus */}
            <EventBridge
              id="eventbridge"
              label="EventBridge"
              position={positions.eventBridge}
              size="lg"
              animationDelay={0.3}
              busName="orders-bus"
              ruleCount={8}
            />

            {/* Event Handlers */}
            <Lambda
              id="lambda-order"
              label="Order Processor"
              position={positions.lambdaOrder}
              size="md"
              animationDelay={0.4}
              runtime="python3.11"
            />

            <Lambda
              id="lambda-notify"
              label="Notification"
              position={positions.lambdaNotify}
              size="md"
              animationDelay={0.5}
              runtime="nodejs18.x"
            />

            <Lambda
              id="lambda-analytics"
              label="Analytics"
              position={positions.lambdaAnalytics}
              size="md"
              animationDelay={0.6}
              runtime="python3.11"
            />

            <StepFunctions
              id="step-functions"
              label="Order Workflow"
              position={positions.stepFunctions}
              size="md"
              animationDelay={0.7}
              stateMachineType="STANDARD"
            />

            {/* Targets */}
            <DynamoDB
              id="dynamodb"
              label="Orders Table"
              position={positions.dynamodb}
              size="md"
              animationDelay={0.8}
            />

            <SNS
              id="sns"
              label="Notifications"
              position={positions.sns}
              size="md"
              animationDelay={0.9}
            />

            <S3
              id="s3-target"
              label="Analytics Lake"
              position={positions.s3Target}
              size="md"
              animationDelay={1.0}
            />

            <SQS
              id="sqs"
              label="Fulfillment Queue"
              position={positions.sqs}
              size="md"
              animationDelay={1.1}
            />

            {/* Monitoring */}
            <CloudWatch
              id="cloudwatch"
              label="Monitoring"
              position={positions.cloudwatch}
              size="md"
              animationDelay={1.2}
            />
          </motion.div>

          {/* Data Flows */}
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            {/* Sources → EventBridge */}
            <DataFlow
              id="flow-api-eb"
              from={{ x: positions.apiGateway.x + 80, y: positions.apiGateway.y + 40 }}
              to={{ x: positions.eventBridge.x, y: positions.eventBridge.y + 20 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="event"
              label="Order"
            />

            <DataFlow
              id="flow-s3-eb"
              from={{ x: positions.s3Source.x + 80, y: positions.s3Source.y + 40 }}
              to={{ x: positions.eventBridge.x, y: positions.eventBridge.y + 50 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.8}
              packetType="event"
              label="S3 Event"
            />

            <DataFlow
              id="flow-sched-eb"
              from={{ x: positions.schedule.x + 80, y: positions.schedule.y + 40 }}
              to={{ x: positions.eventBridge.x, y: positions.eventBridge.y + 80 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.6}
              packetType="event"
              label="Cron"
            />

            {/* EventBridge → Handlers */}
            <DataFlow
              id="flow-eb-order"
              from={{ x: positions.eventBridge.x + 100, y: positions.eventBridge.y + 20 }}
              to={{ x: positions.lambdaOrder.x, y: positions.lambdaOrder.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="event"
            />

            <DataFlow
              id="flow-eb-notify"
              from={{ x: positions.eventBridge.x + 100, y: positions.eventBridge.y + 50 }}
              to={{ x: positions.lambdaNotify.x, y: positions.lambdaNotify.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="event"
            />

            <DataFlow
              id="flow-eb-analytics"
              from={{ x: positions.eventBridge.x + 100, y: positions.eventBridge.y + 80 }}
              to={{ x: positions.lambdaAnalytics.x, y: positions.lambdaAnalytics.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="event"
            />

            <DataFlow
              id="flow-eb-sf"
              from={{ x: positions.eventBridge.x + 80, y: positions.eventBridge.y + 100 }}
              to={{ x: positions.stepFunctions.x, y: positions.stepFunctions.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.9}
              packetType="event"
            />

            {/* Handlers → Targets */}
            <DataFlow
              id="flow-order-ddb"
              from={{ x: positions.lambdaOrder.x + 80, y: positions.lambdaOrder.y + 40 }}
              to={{ x: positions.dynamodb.x, y: positions.dynamodb.y + 40 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="data"
            />

            <DataFlow
              id="flow-notify-sns"
              from={{ x: positions.lambdaNotify.x + 80, y: positions.lambdaNotify.y + 40 }}
              to={{ x: positions.sns.x, y: positions.sns.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="event"
            />

            <DataFlow
              id="flow-analytics-s3"
              from={{ x: positions.lambdaAnalytics.x + 80, y: positions.lambdaAnalytics.y + 40 }}
              to={{ x: positions.s3Target.x, y: positions.s3Target.y + 40 }}
              type="batch"
              isActive={playbackState.isPlaying}
              speed={speed * 0.7}
              packetType="data"
            />

            <DataFlow
              id="flow-sf-sqs"
              from={{ x: positions.stepFunctions.x + 80, y: positions.stepFunctions.y + 40 }}
              to={{ x: positions.sqs.x, y: positions.sqs.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.8}
              packetType="event"
            />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-16 left-4 right-4 flex justify-around text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Async Event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Sync Call</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Batch</span>
            </div>
          </div>
        </div>
      </DiagramCanvas>

      {showControls && (
        <DiagramControls
          playbackState={playbackState}
          controls={{ play, pause, stop, next, previous, setSpeed }}
          loopEnabled={loopEnabled}
          onToggleLoop={toggleLoop}
          position="bottom"
          showStepControls={false}
        />
      )}
    </div>
  );
};

export default EventDriven;
