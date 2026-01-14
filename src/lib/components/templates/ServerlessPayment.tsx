/**
 * Serverless Payment Processing Architecture Template
 *
 * This diagram shows a typical serverless payment processing flow:
 * API Gateway → Lambda Authorizer → Lambda Handler → DynamoDB
 *            → SQS for async processing → Lambda Worker → SNS for notifications
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { DiagramCanvas } from '../diagrams/DiagramCanvas';
import { DiagramControls } from '../diagrams/DiagramControls';
import { DataFlow } from '../connections/DataFlow';
import { APIGateway } from '../aws/networking/APIGateway';
import { Lambda } from '../aws/compute/Lambda';
import { DynamoDB } from '../aws/database/DynamoDB';
import { SQS, SNS } from '../aws/messaging';
import { CloudWatch } from '../aws/monitoring';
import { Cognito, WAF } from '../aws/security';
import { useDiagramControls } from '../../hooks';
import { containerVariants } from '../../constants/animation-presets';
import type { ThemeType } from '../../types';

export interface ServerlessPaymentProps {
  /** Theme */
  theme?: ThemeType;
  /** Auto-play animations */
  autoPlay?: boolean;
  /** Animation speed */
  speed?: number;
  /** Show controls */
  showControls?: boolean;
  /** Width */
  width?: number;
  /** Height */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

export const ServerlessPayment: React.FC<ServerlessPaymentProps> = ({
  theme = 'light',
  autoPlay = true,
  speed = 1,
  showControls = true,
  width = 1100,
  height = 600,
  className = '',
}) => {
  // Playback controls
  const {
    playbackState,
    play,
    pause,
    stop,
    next,
    previous,
    setSpeed,
    toggleLoop,
    loopEnabled,
  } = useDiagramControls({
    totalSteps: 6,
    autoPlay,
    loop: true,
    stepDuration: 2000 / speed,
  });

  // Service positions
  const positions = useMemo(() => ({
    waf: { x: 50, y: 220 },
    apiGateway: { x: 180, y: 220 },
    cognito: { x: 180, y: 80 },
    lambdaAuth: { x: 310, y: 120 },
    lambdaHandler: { x: 440, y: 220 },
    dynamodb: { x: 600, y: 220 },
    sqs: { x: 440, y: 380 },
    lambdaWorker: { x: 600, y: 380 },
    sns: { x: 760, y: 380 },
    cloudwatch: { x: 900, y: 220 },
  }), []);

  // Connection centers for DataFlow
  const getCenter = (pos: { x: number; y: number }) => ({
    x: pos.x + 40,
    y: pos.y + 40,
  });

  return (
    <div className={`serverless-payment-diagram relative ${className}`}>
      <DiagramCanvas
        theme={theme}
        autoPlay={autoPlay}
        speed={speed}
        showControls={false}
      >
        <div style={{ width, height, position: 'relative' }}>
          {/* Background label */}
          <div className="absolute top-4 left-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Serverless Payment Processing
          </div>
          <div className="absolute top-10 left-4 text-sm text-gray-500 dark:text-gray-400">
            Real-time payment validation with async settlement
          </div>

          {/* Services */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Security Layer */}
            <WAF
              id="waf"
              label="WAF"
              position={positions.waf}
              size="md"
              animationDelay={0}
              metadata={{ name: 'AWS WAF', description: 'Web Application Firewall' }}
            />

            {/* API Layer */}
            <APIGateway
              id="api-gateway"
              label="API Gateway"
              position={positions.apiGateway}
              size="md"
              animationDelay={0.1}
              apiType="REST"
              stageName="prod"
            />

            {/* Auth Layer */}
            <Cognito
              id="cognito"
              label="Cognito"
              position={positions.cognito}
              size="md"
              animationDelay={0.15}
            />

            <Lambda
              id="lambda-auth"
              label="Authorizer"
              position={positions.lambdaAuth}
              size="md"
              animationDelay={0.2}
              runtime="nodejs18.x"
              memoryMB={128}
            />

            {/* Processing Layer */}
            <Lambda
              id="lambda-handler"
              label="Payment Handler"
              position={positions.lambdaHandler}
              size="md"
              animationDelay={0.3}
              runtime="nodejs18.x"
              memoryMB={512}
              timeoutSeconds={30}
            />

            {/* Data Layer */}
            <DynamoDB
              id="dynamodb"
              label="Transactions"
              position={positions.dynamodb}
              size="md"
              animationDelay={0.4}
              tableName="Transactions"
              billingMode="PAY_PER_REQUEST"
            />

            {/* Async Processing Layer */}
            <SQS
              id="sqs"
              label="Settlement Queue"
              position={positions.sqs}
              size="md"
              animationDelay={0.5}
              queueType="FIFO"
            />

            <Lambda
              id="lambda-worker"
              label="Settlement Worker"
              position={positions.lambdaWorker}
              size="md"
              animationDelay={0.6}
              runtime="nodejs18.x"
              memoryMB={256}
            />

            {/* Notification Layer */}
            <SNS
              id="sns"
              label="Notifications"
              position={positions.sns}
              size="md"
              animationDelay={0.7}
              topicName="PaymentNotifications"
            />

            {/* Monitoring */}
            <CloudWatch
              id="cloudwatch"
              label="Monitoring"
              position={positions.cloudwatch}
              size="md"
              animationDelay={0.8}
            />
          </motion.div>

          {/* Data Flows - SVG layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={width}
            height={height}
          >
            {/* WAF → API Gateway */}
            <DataFlow
              id="flow-waf-api"
              from={getCenter(positions.waf)}
              to={getCenter(positions.apiGateway)}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
              label="HTTPS"
            />

            {/* API Gateway → Lambda Auth */}
            <DataFlow
              id="flow-api-auth"
              from={{ x: positions.apiGateway.x + 60, y: positions.apiGateway.y + 20 }}
              to={{ x: positions.lambdaAuth.x + 20, y: positions.lambdaAuth.y + 60 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
            />

            {/* Cognito → Lambda Auth */}
            <DataFlow
              id="flow-cognito-auth"
              from={{ x: positions.cognito.x + 60, y: positions.cognito.y + 40 }}
              to={{ x: positions.lambdaAuth.x + 20, y: positions.lambdaAuth.y + 20 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="data"
              label="JWT"
            />

            {/* API Gateway → Lambda Handler */}
            <DataFlow
              id="flow-api-handler"
              from={{ x: positions.apiGateway.x + 80, y: positions.apiGateway.y + 40 }}
              to={{ x: positions.lambdaHandler.x, y: positions.lambdaHandler.y + 40 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
            />

            {/* Lambda Handler → DynamoDB */}
            <DataFlow
              id="flow-handler-dynamo"
              from={getCenter(positions.lambdaHandler)}
              to={getCenter(positions.dynamodb)}
              type="sync"
              direction="bidirectional"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="data"
            />

            {/* Lambda Handler → SQS */}
            <DataFlow
              id="flow-handler-sqs"
              from={{ x: positions.lambdaHandler.x + 40, y: positions.lambdaHandler.y + 80 }}
              to={{ x: positions.sqs.x + 40, y: positions.sqs.y }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.8}
              packetType="event"
            />

            {/* SQS → Lambda Worker */}
            <DataFlow
              id="flow-sqs-worker"
              from={{ x: positions.sqs.x + 80, y: positions.sqs.y + 40 }}
              to={{ x: positions.lambdaWorker.x, y: positions.lambdaWorker.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.7}
              packetType="data"
              label="Poll"
            />

            {/* Lambda Worker → DynamoDB */}
            <DataFlow
              id="flow-worker-dynamo"
              from={{ x: positions.lambdaWorker.x + 40, y: positions.lambdaWorker.y }}
              to={{ x: positions.dynamodb.x + 40, y: positions.dynamodb.y + 80 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="data"
            />

            {/* Lambda Worker → SNS */}
            <DataFlow
              id="flow-worker-sns"
              from={{ x: positions.lambdaWorker.x + 80, y: positions.lambdaWorker.y + 40 }}
              to={{ x: positions.sns.x, y: positions.sns.y + 40 }}
              type="async"
              isActive={playbackState.isPlaying}
              speed={speed * 0.6}
              packetType="event"
            />

            {/* Services → CloudWatch (monitoring lines - dimmed) */}
            <DataFlow
              id="flow-handler-cw"
              from={{ x: positions.lambdaHandler.x + 60, y: positions.lambdaHandler.y + 20 }}
              to={{ x: positions.cloudwatch.x, y: positions.cloudwatch.y + 40 }}
              type="stream"
              isActive={playbackState.isPlaying}
              speed={speed * 0.5}
              packetType="data"
              packetCount={2}
            />
          </svg>

          {/* Flow annotations */}
          <div className="absolute bottom-16 left-4 right-4 flex justify-around text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-500" />
              <span>Sync Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-amber-500 border-dashed" style={{ borderTop: '2px dashed' }} />
              <span>Async Event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-purple-500" />
              <span>Stream</span>
            </div>
          </div>
        </div>
      </DiagramCanvas>

      {/* Playback Controls */}
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

export default ServerlessPayment;
