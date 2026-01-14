/**
 * Microservices E-commerce Architecture Template
 *
 * Route53 → CloudFront → ALB → ECS Services (Users, Orders, Inventory)
 *                            → RDS Multi-AZ, ElastiCache
 *                            → S3 for images
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { DiagramCanvas } from '../diagrams/DiagramCanvas';
import { DiagramControls } from '../diagrams/DiagramControls';
import { DataFlow } from '../connections/DataFlow';
import { Route53, CloudFront, ALB } from '../aws/networking';
import { ECS } from '../aws/compute';
import { Aurora, ElastiCache } from '../aws/database';
import { S3 } from '../aws/storage';
import { CloudWatch } from '../aws/monitoring';
import { useDiagramControls } from '../../hooks';
import { containerVariants } from '../../constants/animation-presets';
import type { ThemeType } from '../../types';

export interface MicroservicesProps {
  theme?: ThemeType;
  autoPlay?: boolean;
  speed?: number;
  showControls?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const Microservices: React.FC<MicroservicesProps> = ({
  theme = 'light',
  autoPlay = true,
  speed = 1,
  showControls = true,
  width = 1200,
  height = 700,
  className = '',
}) => {
  const {
    playbackState,
    play, pause, stop, next, previous, setSpeed,
    toggleLoop, loopEnabled,
  } = useDiagramControls({
    totalSteps: 8,
    autoPlay,
    loop: true,
    stepDuration: 2500 / speed,
  });

  const positions = useMemo(() => ({
    route53: { x: 50, y: 280 },
    cloudfront: { x: 180, y: 280 },
    alb: { x: 340, y: 280 },
    // ECS Services
    userService: { x: 520, y: 120 },
    orderService: { x: 520, y: 280 },
    inventoryService: { x: 520, y: 440 },
    // Data stores
    rds: { x: 720, y: 200 },
    elasticache: { x: 720, y: 360 },
    s3: { x: 880, y: 120 },
    // Monitoring
    cloudwatch: { x: 880, y: 280 },
    // VPC background
    vpc: { x: 300, y: 60 },
  }), []);

  const getCenter = (pos: { x: number; y: number }) => ({
    x: pos.x + 40,
    y: pos.y + 40,
  });

  return (
    <div className={`microservices-diagram relative ${className}`}>
      <DiagramCanvas theme={theme} autoPlay={autoPlay} speed={speed} showControls={false}>
        <div style={{ width, height, position: 'relative' }}>
          {/* Title */}
          <div className="absolute top-4 left-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Microservices E-commerce Platform
          </div>
          <div className="absolute top-10 left-4 text-sm text-gray-500 dark:text-gray-400">
            High-availability containerized architecture
          </div>

          {/* VPC boundary */}
          <div
            className="absolute border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl bg-purple-50/30 dark:bg-purple-900/10"
            style={{
              left: positions.vpc.x,
              top: positions.vpc.y,
              width: 680,
              height: 500,
            }}
          >
            <span className="absolute top-2 left-4 text-xs font-medium text-purple-600 dark:text-purple-400">
              VPC
            </span>
          </div>

          {/* Services */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Edge Services */}
            <Route53
              id="route53"
              label="Route 53"
              position={positions.route53}
              size="md"
              animationDelay={0}
              hostedZone="example.com"
            />

            <CloudFront
              id="cloudfront"
              label="CloudFront"
              position={positions.cloudfront}
              size="md"
              animationDelay={0.1}
            />

            {/* Load Balancer */}
            <ALB
              id="alb"
              label="Application LB"
              position={positions.alb}
              size="md"
              animationDelay={0.2}
              scheme="internet-facing"
            />

            {/* Microservices */}
            <ECS
              id="user-service"
              label="User Service"
              position={positions.userService}
              size="md"
              animationDelay={0.3}
              launchType="FARGATE"
              desiredCount={3}
            />

            <ECS
              id="order-service"
              label="Order Service"
              position={positions.orderService}
              size="md"
              animationDelay={0.4}
              launchType="FARGATE"
              desiredCount={3}
            />

            <ECS
              id="inventory-service"
              label="Inventory Service"
              position={positions.inventoryService}
              size="md"
              animationDelay={0.5}
              launchType="FARGATE"
              desiredCount={2}
            />

            {/* Data Layer */}
            <Aurora
              id="rds"
              label="Aurora PostgreSQL"
              position={positions.rds}
              size="md"
              animationDelay={0.6}
              engine="aurora-postgresql"
              replicaCount={2}
            />

            <ElastiCache
              id="elasticache"
              label="Redis Cache"
              position={positions.elasticache}
              size="md"
              animationDelay={0.7}
              engine="redis"
              clusterMode={true}
            />

            {/* Storage */}
            <S3
              id="s3"
              label="Product Images"
              position={positions.s3}
              size="md"
              animationDelay={0.8}
              bucketName="product-images"
            />

            {/* Monitoring */}
            <CloudWatch
              id="cloudwatch"
              label="CloudWatch"
              position={positions.cloudwatch}
              size="md"
              animationDelay={0.9}
            />
          </motion.div>

          {/* Data Flows */}
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            {/* Route53 → CloudFront */}
            <DataFlow
              id="flow-r53-cf"
              from={getCenter(positions.route53)}
              to={getCenter(positions.cloudfront)}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
              label="DNS"
            />

            {/* CloudFront → ALB */}
            <DataFlow
              id="flow-cf-alb"
              from={getCenter(positions.cloudfront)}
              to={getCenter(positions.alb)}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
            />

            {/* CloudFront → S3 (static content) */}
            <DataFlow
              id="flow-cf-s3"
              from={{ x: positions.cloudfront.x + 60, y: positions.cloudfront.y + 20 }}
              to={{ x: positions.s3.x, y: positions.s3.y + 40 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="response"
              label="Static"
              pathType="curved"
              curvature={0.5}
            />

            {/* ALB → Services */}
            <DataFlow
              id="flow-alb-user"
              from={{ x: positions.alb.x + 80, y: positions.alb.y + 20 }}
              to={{ x: positions.userService.x, y: positions.userService.y + 40 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
            />

            <DataFlow
              id="flow-alb-order"
              from={{ x: positions.alb.x + 80, y: positions.alb.y + 40 }}
              to={{ x: positions.orderService.x, y: positions.orderService.y + 40 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
            />

            <DataFlow
              id="flow-alb-inv"
              from={{ x: positions.alb.x + 80, y: positions.alb.y + 60 }}
              to={{ x: positions.inventoryService.x, y: positions.inventoryService.y + 40 }}
              type="sync"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="request"
            />

            {/* Services → RDS */}
            <DataFlow
              id="flow-user-rds"
              from={{ x: positions.userService.x + 80, y: positions.userService.y + 40 }}
              to={{ x: positions.rds.x, y: positions.rds.y + 20 }}
              type="sync"
              direction="bidirectional"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="data"
            />

            <DataFlow
              id="flow-order-rds"
              from={{ x: positions.orderService.x + 80, y: positions.orderService.y + 40 }}
              to={{ x: positions.rds.x, y: positions.rds.y + 40 }}
              type="sync"
              direction="bidirectional"
              isActive={playbackState.isPlaying}
              speed={speed}
              packetType="data"
            />

            {/* Services → ElastiCache */}
            <DataFlow
              id="flow-order-cache"
              from={{ x: positions.orderService.x + 80, y: positions.orderService.y + 60 }}
              to={{ x: positions.elasticache.x, y: positions.elasticache.y + 20 }}
              type="sync"
              direction="bidirectional"
              isActive={playbackState.isPlaying}
              speed={speed * 1.5}
              packetType="data"
              label="Cache"
            />

            <DataFlow
              id="flow-inv-cache"
              from={{ x: positions.inventoryService.x + 80, y: positions.inventoryService.y + 20 }}
              to={{ x: positions.elasticache.x, y: positions.elasticache.y + 60 }}
              type="sync"
              direction="bidirectional"
              isActive={playbackState.isPlaying}
              speed={speed * 1.5}
              packetType="data"
            />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-16 left-4 right-4 flex justify-around text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-compute" />
              <span>Compute</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-database" />
              <span>Database</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-networking" />
              <span>Networking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-storage" />
              <span>Storage</span>
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

export default Microservices;
