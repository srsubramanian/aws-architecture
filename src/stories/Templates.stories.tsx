import type { Meta, StoryObj } from '@storybook/react';
import { ServerlessPayment, Microservices, EventDriven } from '../lib/components/templates';

const meta: Meta = {
  title: 'Templates',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const ServerlessPaymentProcessing: StoryObj = {
  render: () => (
    <div style={{ padding: 20 }}>
      <ServerlessPayment
        theme="light"
        autoPlay={true}
        speed={1}
        showControls={true}
        width={1100}
        height={600}
      />
    </div>
  ),
};

export const ServerlessPaymentDark: StoryObj = {
  render: () => (
    <div style={{ padding: 20, backgroundColor: '#0f172a' }}>
      <ServerlessPayment
        theme="dark"
        autoPlay={true}
        speed={1}
        showControls={true}
      />
    </div>
  ),
};

export const MicroservicesArchitecture: StoryObj = {
  render: () => (
    <div style={{ padding: 20 }}>
      <Microservices
        theme="light"
        autoPlay={true}
        speed={1}
        showControls={true}
        width={1200}
        height={700}
      />
    </div>
  ),
};

export const MicroservicesDark: StoryObj = {
  render: () => (
    <div style={{ padding: 20, backgroundColor: '#0f172a' }}>
      <Microservices
        theme="dark"
        autoPlay={true}
        speed={1.5}
        showControls={true}
      />
    </div>
  ),
};

export const EventDrivenArchitecture: StoryObj = {
  render: () => (
    <div style={{ padding: 20 }}>
      <EventDriven
        theme="light"
        autoPlay={true}
        speed={1}
        showControls={true}
        width={1100}
        height={650}
      />
    </div>
  ),
};

export const EventDrivenDark: StoryObj = {
  render: () => (
    <div style={{ padding: 20, backgroundColor: '#0f172a' }}>
      <EventDriven
        theme="dark"
        autoPlay={true}
        speed={1}
        showControls={true}
      />
    </div>
  ),
};

export const SpeedComparison: StoryObj = {
  render: () => (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3>0.5x Speed</h3>
        <ServerlessPayment theme="light" autoPlay={true} speed={0.5} showControls={false} width={800} height={400} />
      </div>
      <div>
        <h3>2x Speed</h3>
        <ServerlessPayment theme="light" autoPlay={true} speed={2} showControls={false} width={800} height={400} />
      </div>
    </div>
  ),
};
