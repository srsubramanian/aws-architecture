# AWS Architecture Animations

Production-ready animated AWS architecture diagram components for React. Create beautiful, interactive cloud architecture visualizations with smooth 60fps animations.

## Features

- **25+ AWS Service Components** - Compute, Database, Networking, Storage, Messaging, Security, and Monitoring
- **Animated Data Flows** - Visualize data movement with sync, async, stream, batch, and error flow types
- **Pre-built Templates** - Serverless, Microservices, and Event-Driven architecture patterns
- **Dark/Light Mode** - Full theme support with AWS brand colors
- **Playback Controls** - Play, pause, speed control, and step-through animations
- **TypeScript First** - Full type definitions for all components
- **60fps Animations** - Powered by Motion.dev (Framer Motion)

## Installation

```bash
npm install aws-architecture-animations motion react react-dom
```

## Quick Start

```tsx
import { ServerlessPayment } from 'aws-architecture-animations';
import 'aws-architecture-animations/styles.css';

function App() {
  return (
    <ServerlessPayment
      theme="light"
      autoPlay={true}
      speed={1}
      showControls={true}
    />
  );
}
```

## Templates

### Serverless Payment Processing

Real-time payment processing with async settlement flow.

```tsx
import { ServerlessPayment } from 'aws-architecture-animations';

<ServerlessPayment
  theme="dark"
  autoPlay={true}
  speed={1.5}
  showControls={true}
  width={1100}
  height={600}
/>
```

### Microservices Architecture

Containerized e-commerce platform with ECS/Fargate.

```tsx
import { Microservices } from 'aws-architecture-animations';

<Microservices
  theme="light"
  autoPlay={true}
  speed={1}
  showControls={true}
/>
```

### Event-Driven Architecture

EventBridge-based loosely coupled order processing.

```tsx
import { EventDriven } from 'aws-architecture-animations';

<EventDriven
  theme="light"
  autoPlay={true}
  speed={1}
  showControls={true}
/>
```

## AWS Service Components

### Compute

```tsx
import { Lambda, EC2, ECS, Fargate } from 'aws-architecture-animations';

<Lambda
  id="my-lambda"
  label="Order Processor"
  position={{ x: 100, y: 100 }}
  size="md"
  runtime="python3.11"
  memoryMB={256}
/>

<ECS
  id="my-ecs"
  label="API Service"
  position={{ x: 200, y: 100 }}
  launchType="FARGATE"
  desiredCount={3}
/>
```

### Database

```tsx
import { DynamoDB, RDS, Aurora, ElastiCache } from 'aws-architecture-animations';

<DynamoDB
  id="orders-table"
  label="Orders"
  position={{ x: 100, y: 100 }}
  tableName="orders"
  isGlobalTable={true}
/>

<Aurora
  id="aurora-cluster"
  label="PostgreSQL"
  position={{ x: 200, y: 100 }}
  engine="aurora-postgresql"
  replicaCount={2}
/>
```

### Networking

```tsx
import { APIGateway, ALB, CloudFront, Route53, VPC } from 'aws-architecture-animations';

<APIGateway
  id="api"
  label="REST API"
  position={{ x: 100, y: 100 }}
  apiType="REST"
/>

<CloudFront
  id="cdn"
  label="CDN"
  position={{ x: 200, y: 100 }}
/>
```

### Storage

```tsx
import { S3, EFS, EBS } from 'aws-architecture-animations';

<S3
  id="bucket"
  label="Assets"
  position={{ x: 100, y: 100 }}
  bucketName="my-assets"
/>
```

### Messaging

```tsx
import { SQS, SNS, EventBridge, Kinesis, StepFunctions } from 'aws-architecture-animations';

<EventBridge
  id="bus"
  label="Event Bus"
  position={{ x: 100, y: 100 }}
  busName="orders"
  ruleCount={5}
/>

<SQS
  id="queue"
  label="Processing Queue"
  position={{ x: 200, y: 100 }}
  queueType="standard"
/>
```

### Security

```tsx
import { WAF, Shield, SecretsManager, KMS, Cognito } from 'aws-architecture-animations';

<Cognito
  id="auth"
  label="User Pool"
  position={{ x: 100, y: 100 }}
  userPoolName="users"
/>
```

### Monitoring

```tsx
import { CloudWatch, XRay } from 'aws-architecture-animations';

<CloudWatch
  id="monitoring"
  label="Metrics"
  position={{ x: 100, y: 100 }}
/>
```

## Data Flow Animations

```tsx
import { DataFlow } from 'aws-architecture-animations';

<svg>
  <DataFlow
    id="flow-1"
    from={{ x: 100, y: 100 }}
    to={{ x: 300, y: 100 }}
    type="sync"        // sync | async | stream | batch | error
    direction="forward" // forward | reverse | bidirectional
    isActive={true}
    speed={1}
    packetType="data"  // data | request | response | event | error
    label="API Call"
  />
</svg>
```

## Service Variants

All services support visual variants:

```tsx
<Lambda variant="default" />     // Normal state
<Lambda variant="highlighted" /> // Emphasized with glow
<Lambda variant="success" />     // Green success state
<Lambda variant="warning" />     // Yellow warning state
<Lambda variant="error" />       // Red error state
<Lambda variant="processing" />  // Animated processing
<Lambda variant="dimmed" />      // Faded/inactive
```

## Sizing

Services support four sizes:

```tsx
<Lambda size="sm" />  // 48x48
<Lambda size="md" />  // 64x64
<Lambda size="lg" />  // 80x80
<Lambda size="xl" />  // 96x96
```

## Theme Configuration

```tsx
type ThemeType = 'light' | 'dark' | 'aws' | 'custom';

// Built-in themes
<ServerlessPayment theme="light" />
<ServerlessPayment theme="dark" />
<ServerlessPayment theme="aws" />
```

## Playback Controls

Templates include built-in playback controls:

- **Play/Pause** - Start/stop animation
- **Stop** - Reset to beginning
- **Speed** - 0.25x to 4x speed
- **Loop** - Enable/disable looping
- **Progress** - Visual progress indicator

## Custom Hooks

### useDiagramControls

```tsx
import { useDiagramControls } from 'aws-architecture-animations';

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
  totalSteps: 5,
  autoPlay: true,
  loop: true,
  stepDuration: 2000,
});
```

### useDataFlow

```tsx
import { useDataFlow } from 'aws-architecture-animations';

const {
  flows,
  startAll,
  stopAll,
  startFlow,
  stopFlow,
  setFlowType,
  setFlowSpeed,
} = useDataFlow({
  connections: [...],
  defaultType: 'sync',
  autoStart: true,
});
```

## Building Custom Diagrams

```tsx
import {
  DiagramCanvas,
  DiagramControls,
  Lambda,
  DynamoDB,
  DataFlow,
  useDiagramControls,
} from 'aws-architecture-animations';

function CustomDiagram() {
  const { playbackState, play, pause, stop, setSpeed } = useDiagramControls({
    totalSteps: 3,
    autoPlay: true,
  });

  return (
    <div style={{ position: 'relative' }}>
      <DiagramCanvas theme="light" autoPlay>
        <Lambda id="fn" label="Function" position={{ x: 50, y: 100 }} />
        <DynamoDB id="db" label="Table" position={{ x: 250, y: 100 }} />

        <svg style={{ position: 'absolute', inset: 0 }}>
          <DataFlow
            id="flow"
            from={{ x: 130, y: 120 }}
            to={{ x: 250, y: 120 }}
            type="sync"
            isActive={playbackState.isPlaying}
          />
        </svg>
      </DiagramCanvas>

      <DiagramControls
        playbackState={playbackState}
        controls={{ play, pause, stop, setSpeed }}
      />
    </div>
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run Storybook
npm run storybook

# Type check
npm run type-check

# Build library
npm run build:lib

# Build demo
npm run build
```

## Project Structure

```
src/
├── lib/                    # Component library
│   ├── components/
│   │   ├── aws/           # AWS service components
│   │   │   ├── compute/   # Lambda, EC2, ECS, Fargate
│   │   │   ├── database/  # DynamoDB, RDS, Aurora, ElastiCache
│   │   │   ├── networking/# APIGateway, ALB, CloudFront, etc.
│   │   │   ├── storage/   # S3, EFS, EBS
│   │   │   ├── messaging/ # SQS, SNS, EventBridge, etc.
│   │   │   ├── security/  # WAF, Shield, Cognito, etc.
│   │   │   └── monitoring/# CloudWatch, X-Ray
│   │   ├── connections/   # DataFlow, ConnectionLine
│   │   ├── diagrams/      # DiagramCanvas, DiagramControls
│   │   └── templates/     # Pre-built architecture diagrams
│   ├── hooks/             # Custom React hooks
│   ├── constants/         # Colors, animations, metadata
│   ├── types/             # TypeScript definitions
│   └── utils/             # Animation and positioning utilities
├── demo/                   # Demo application
└── stories/                # Storybook stories
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

Built with:
- [React](https://react.dev)
- [Motion.dev](https://motion.dev) (Framer Motion)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide React](https://lucide.dev)
