import type { Meta, StoryObj } from '@storybook/react';
import { DynamoDB, RDS, Aurora, ElastiCache } from '../lib/components/aws/database';

const meta: Meta = {
  title: 'AWS Services/Database',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DynamoDBDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <DynamoDB
        id="dynamodb-1"
        label="Users Table"
        position={{ x: 50, y: 50 }}
        size="md"
        tableName="users"
        readCapacity={100}
        writeCapacity={50}
      />
    </div>
  ),
};

export const DynamoDBGlobalTable: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <DynamoDB
        id="dynamodb-2"
        label="Global Orders"
        position={{ x: 50, y: 50 }}
        size="lg"
        tableName="orders"
        gsiCount={2}
      />
    </div>
  ),
};

export const RDSDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <RDS
        id="rds-1"
        label="PostgreSQL"
        position={{ x: 50, y: 50 }}
        size="md"
        engine="postgres"
        multiAZ={true}
      />
    </div>
  ),
};

export const AuroraDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <Aurora
        id="aurora-1"
        label="Aurora Cluster"
        position={{ x: 50, y: 50 }}
        size="md"
        engine="aurora-postgresql"
        replicaCount={2}
      />
    </div>
  ),
};

export const ElastiCacheDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <ElastiCache
        id="cache-1"
        label="Redis Cache"
        position={{ x: 50, y: 50 }}
        size="md"
        engine="redis"
        clusterMode={true}
      />
    </div>
  ),
};

export const DatabaseComparison: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 600, height: 200 }}>
      <DynamoDB id="db-1" label="DynamoDB" position={{ x: 0, y: 50 }} size="md" />
      <RDS id="db-2" label="RDS" position={{ x: 120, y: 50 }} size="md" />
      <Aurora id="db-3" label="Aurora" position={{ x: 240, y: 50 }} size="md" />
      <ElastiCache id="db-4" label="ElastiCache" position={{ x: 360, y: 50 }} size="md" />
    </div>
  ),
};
