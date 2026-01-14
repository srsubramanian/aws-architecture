import type { Meta, StoryObj } from '@storybook/react';
import { Lambda, EC2, ECS } from '../lib/components/aws/compute';

const meta: Meta = {
  title: 'AWS Services/Compute',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Lambda Stories
export const LambdaDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <Lambda
        id="lambda-1"
        label="My Lambda"
        position={{ x: 50, y: 50 }}
        size="md"
        runtime="python3.11"
        memoryMB={256}
        timeoutSeconds={30}
      />
    </div>
  ),
};

export const LambdaHighlighted: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <Lambda
        id="lambda-2"
        label="Processing"
        position={{ x: 50, y: 50 }}
        size="md"
        variant="highlighted"
        runtime="nodejs18.x"
      />
    </div>
  ),
};

export const LambdaSizes: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 500, height: 200, display: 'flex', gap: 20 }}>
      <Lambda id="lambda-sm" label="Small" position={{ x: 0, y: 50 }} size="sm" />
      <Lambda id="lambda-md" label="Medium" position={{ x: 100, y: 50 }} size="md" />
      <Lambda id="lambda-lg" label="Large" position={{ x: 220, y: 50 }} size="lg" />
      <Lambda id="lambda-xl" label="XLarge" position={{ x: 360, y: 50 }} size="xl" />
    </div>
  ),
};

// EC2 Stories
export const EC2Default: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <EC2
        id="ec2-1"
        label="Web Server"
        position={{ x: 50, y: 50 }}
        size="md"
        instanceType="t3.medium"
      />
    </div>
  ),
};

// ECS Stories
export const ECSDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <ECS
        id="ecs-1"
        label="Container Service"
        position={{ x: 50, y: 50 }}
        size="md"
        launchType="FARGATE"
        desiredCount={3}
      />
    </div>
  ),
};

// Service Variants
export const ServiceVariants: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', width: 600, height: 200 }}>
      <Lambda id="v-default" label="Default" position={{ x: 0, y: 50 }} variant="default" />
      <Lambda id="v-highlighted" label="Highlighted" position={{ x: 100, y: 50 }} variant="highlighted" />
      <Lambda id="v-success" label="Success" position={{ x: 200, y: 50 }} variant="success" />
      <Lambda id="v-warning" label="Warning" position={{ x: 300, y: 50 }} variant="warning" />
      <Lambda id="v-error" label="Error" position={{ x: 400, y: 50 }} variant="error" />
      <Lambda id="v-processing" label="Processing" position={{ x: 500, y: 50 }} variant="processing" />
    </div>
  ),
};
