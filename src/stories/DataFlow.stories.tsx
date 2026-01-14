import type { Meta, StoryObj } from '@storybook/react';
import { DataFlow } from '../lib/components/connections/DataFlow';
import { Lambda } from '../lib/components/aws/compute';
import { DynamoDB } from '../lib/components/aws/database';
import { SQS } from '../lib/components/aws/messaging';

const meta: Meta = {
  title: 'Components/DataFlow',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const SyncFlow: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <Lambda id="lambda-src" label="Lambda" position={{ x: 20, y: 80 }} size="sm" />
      <DynamoDB id="dynamodb-dst" label="DynamoDB" position={{ x: 280, y: 80 }} size="sm" />
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-sync"
          from={{ x: 100, y: 100 }}
          to={{ x: 280, y: 100 }}
          type="sync"
          isActive={true}
          speed={1}
          packetType="data"
        />
      </svg>
    </div>
  ),
};

export const AsyncFlow: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <Lambda id="lambda-src-2" label="Lambda" position={{ x: 20, y: 80 }} size="sm" />
      <SQS id="sqs-dst" label="SQS Queue" position={{ x: 280, y: 80 }} size="sm" />
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-async"
          from={{ x: 100, y: 100 }}
          to={{ x: 280, y: 100 }}
          type="async"
          isActive={true}
          speed={1}
          packetType="event"
          label="Message"
        />
      </svg>
    </div>
  ),
};

export const StreamFlow: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-stream"
          from={{ x: 50, y: 100 }}
          to={{ x: 350, y: 100 }}
          type="stream"
          isActive={true}
          speed={1.5}
          packetType="data"
          label="Stream"
        />
      </svg>
    </div>
  ),
};

export const BatchFlow: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-batch"
          from={{ x: 50, y: 100 }}
          to={{ x: 350, y: 100 }}
          type="batch"
          isActive={true}
          speed={0.7}
          packetType="data"
          label="Batch"
        />
      </svg>
    </div>
  ),
};

export const ErrorFlow: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-error"
          from={{ x: 50, y: 100 }}
          to={{ x: 350, y: 100 }}
          type="error"
          isActive={true}
          speed={1}
          packetType="error"
          label="Error"
        />
      </svg>
    </div>
  ),
};

export const BidirectionalFlow: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-bidirectional"
          from={{ x: 50, y: 100 }}
          to={{ x: 350, y: 100 }}
          type="sync"
          direction="bidirectional"
          isActive={true}
          speed={1}
          packetType="data"
          label="Request/Response"
        />
      </svg>
    </div>
  ),
};

export const CurvedPath: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 400, height: 300 }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow
          id="flow-curved"
          from={{ x: 50, y: 50 }}
          to={{ x: 350, y: 250 }}
          type="sync"
          pathType="curved"
          curvature={0.5}
          isActive={true}
          speed={1}
          packetType="data"
        />
      </svg>
    </div>
  ),
};

export const AllFlowTypes: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 500, height: 400 }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DataFlow id="ft-sync" from={{ x: 50, y: 50 }} to={{ x: 450, y: 50 }} type="sync" isActive={true} speed={1} label="Sync" />
        <DataFlow id="ft-async" from={{ x: 50, y: 120 }} to={{ x: 450, y: 120 }} type="async" isActive={true} speed={1} label="Async" />
        <DataFlow id="ft-stream" from={{ x: 50, y: 190 }} to={{ x: 450, y: 190 }} type="stream" isActive={true} speed={1} label="Stream" />
        <DataFlow id="ft-batch" from={{ x: 50, y: 260 }} to={{ x: 450, y: 260 }} type="batch" isActive={true} speed={1} label="Batch" />
        <DataFlow id="ft-error" from={{ x: 50, y: 330 }} to={{ x: 450, y: 330 }} type="error" isActive={true} speed={1} label="Error" />
      </svg>
    </div>
  ),
};
