# AWS Architecture Animations

A production-ready React component library for creating animated AWS architecture diagrams with 60fps animations powered by Motion.dev (Framer Motion).

## Project Overview

This library provides:
- 27 animated AWS service components organized by category
- Official AWS Architecture Icons (July 2025 release)
- DataFlow animations (sync, async, stream, batch, error types)
- Pre-built architecture templates (ServerlessPayment, Microservices, EventDriven)
- DiagramCanvas with zoom/pan support and fullscreen mode
- Full TypeScript support with strict mode

## Directory Structure

```
src/
├── lib/                        # Library source code (published to npm)
│   ├── architectures/         # Declarative architecture system
│   │   ├── configs/           # JSON configs for each architecture
│   │   │   ├── serverless-payment.ts
│   │   │   ├── microservices-ecommerce.ts
│   │   │   └── event-driven-orders.ts
│   │   ├── registry.ts        # Architecture registry and search
│   │   ├── ArchitectureRenderer.tsx  # Generic renderer
│   │   └── ArchitectureCatalog.tsx   # Sidebar + preview UI
│   ├── components/
│   │   ├── aws/               # AWS service components by category
│   │   │   ├── compute/       # Lambda, EC2, ECS, Fargate
│   │   │   ├── database/      # DynamoDB, RDS, Aurora, ElastiCache
│   │   │   ├── networking/    # APIGateway, ALB, NLB, VPC, CloudFront, Route53
│   │   │   ├── storage/       # S3, EFS, EBS
│   │   │   ├── messaging/     # SQS, SNS, EventBridge, Kinesis, StepFunctions
│   │   │   ├── security/      # WAF, Shield, SecretsManager, KMS, Cognito
│   │   │   ├── monitoring/    # CloudWatch, XRay
│   │   │   └── shared/        # AWSService, ServiceIcon, ServiceLabel, ServiceTooltip
│   │   ├── connections/       # ConnectionLine, DataFlow
│   │   ├── diagrams/          # DiagramCanvas, DiagramControls, DiagramProvider
│   │   └── templates/         # ServerlessPayment, Microservices, EventDriven
│   ├── constants/             # AWS colors, animation presets, service metadata
│   ├── hooks/                 # useAnimationSequence, useDiagramControls, useDataFlow, useServiceHighlight
│   ├── types/                 # TypeScript type definitions (including architecture.types.ts)
│   ├── utils/                 # colors, positions, timing, animations utilities
│   └── index.ts               # Main library exports
├── demo/                       # Demo application
│   ├── App.tsx                # Main demo app
│   └── main.tsx               # Entry point
├── stories/                    # Storybook stories
└── styles.css                  # Tailwind CSS styles
public/
└── icons/                      # Official AWS Architecture Icons (29 SVGs, July 2025 release)
```

## Tech Stack

- **React 18+** with TypeScript strict mode
- **Motion.dev** (Framer Motion v11) for animations
- **Vite 6+** for development and library builds
- **Tailwind CSS 3.4+** for styling
- **Zustand** for state management (DiagramProvider)
- **Storybook 8** for component documentation

## Development Commands

```bash
# Start development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build library for npm
npm run build:lib

# Run Storybook
npm run storybook

# Build Storybook
npm run build:storybook
```

## Key Files

- `src/lib/index.ts` - Main library exports
- `src/lib/types/aws-services.types.ts` - AWS service type definitions (AWSServiceType)
- `src/lib/types/architecture.types.ts` - Architecture schema types (ArchitectureDefinition, etc.)
- `src/lib/components/aws/shared/AWSService.tsx` - Base component for all AWS services
- `src/lib/components/aws/shared/ServiceIcon.tsx` - Icon loader with fallback SVGs
- `src/lib/components/connections/DataFlow.tsx` - Animated data flow between services
- `src/lib/components/diagrams/DiagramCanvas.tsx` - Zoomable/pannable canvas
- `src/lib/architectures/registry.ts` - Architecture registry with search/filter functions
- `src/lib/architectures/ArchitectureRenderer.tsx` - Generic renderer for any architecture config
- `src/lib/architectures/ArchitectureCatalog.tsx` - Sidebar + preview UI with collapsible nav
- `vite.config.lib.ts` - Library build configuration

## AWS Service Categories

| Category | Color | Services |
|----------|-------|----------|
| Compute | Orange (#F7981D) | lambda, ec2, ecs, fargate |
| Database | Blue (#527FFF) | dynamodb, rds, aurora, elasticache |
| Networking | Purple (#A166FF) | api-gateway, alb, nlb, vpc, cloudfront, route53 |
| Storage | Green (#3ECF8E) | s3, efs, ebs |
| Messaging | Pink (#FF4F8B) | sqs, sns, eventbridge, kinesis, step-functions |
| Security | Red (#DD344C) | waf, shield, secrets-manager, kms, cognito |
| Monitoring | Pink (#FF4F8B) | cloudwatch, xray |

## Canvas Controls

The DiagramCanvas component supports:
- **Ctrl+scroll** (or Cmd+scroll on Mac) to zoom in/out
- **Alt+drag** to pan the canvas
- **Fullscreen button** (top-right) for distraction-free presentations
- **Esc** to exit fullscreen mode

Note: Regular scroll does NOT zoom to prevent accidental zooming during presentations.

## Architecture Catalog System

The library includes a declarative architecture management system for handling many architectures programmatically.

### Adding New Architectures

1. Create a new config file in `src/lib/architectures/configs/`:

```typescript
import type { ArchitectureDefinition } from '../../types';

export const myArchitecture: ArchitectureDefinition = {
  id: 'my-architecture',
  name: 'My Architecture',
  description: 'Description here',
  category: 'serverless', // or 'containers', 'microservices', etc.
  tags: ['lambda', 'api-gateway'],
  services: [
    { id: 'api', type: 'api-gateway', label: 'API Gateway', position: { x: 100, y: 200 } },
    { id: 'fn', type: 'lambda', label: 'Lambda', position: { x: 300, y: 200 } },
  ],
  connections: [
    { id: 'api-fn', from: 'api', to: 'fn', type: 'sync', label: 'Invoke' },
  ],
};
```

2. Export from `src/lib/architectures/configs/index.ts`
3. Add to registry in `src/lib/architectures/registry.ts`

### Architecture Categories

- `serverless` - Lambda-based architectures
- `containers` - ECS, EKS, Fargate architectures
- `microservices` - Distributed service architectures
- `event-driven` - Event-based async architectures
- `data-pipeline` - ETL and data processing
- `machine-learning` - ML/AI workflows
- `web-application` - Web app architectures
- `iot` - Internet of Things
- `security` - Security-focused architectures
- `devops` - CI/CD and automation
- `hybrid` - Hybrid cloud architectures

### Catalog UI Features

- **Collapsible sidebar** - Click chevron button to collapse/expand
- **Search** - Filter architectures by name, description, or tags
- **Category filter** - Filter by architecture category
- **Preview panel** - Live animated preview of selected architecture

## Code Conventions

- All components use Motion.dev for animations
- Service components extend the base `AWSService` component
- Icons are official AWS Architecture Icons (July 2025) in `public/icons/`
- Animation timing uses the constants in `src/lib/constants/animation-presets.ts`
- All types are defined in `src/lib/types/`

## TypeScript Configuration

- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noUncheckedIndexedAccess` for safer array access
- Path aliases: `@/*` -> `src/*`, `@lib/*` -> `src/lib/*`

## Testing

Run type checking before committing:
```bash
npm run type-check
```

Run linting:
```bash
npm run lint
```

## Building

For npm publishing:
```bash
npm run build:lib
```

This generates:
- `dist/aws-architecture-animations.es.js` (ES module)
- `dist/aws-architecture-animations.umd.js` (UMD)
- `dist/index.d.ts` (TypeScript declarations)
- `dist/style.css` (Tailwind styles)

## Recent Updates

### January 2026
- **Architecture Catalog System** - Declarative architecture management:
  - JSON-based architecture configs for easy creation and maintenance
  - ArchitectureRenderer for rendering any architecture from config
  - ArchitectureCatalog UI with sidebar + preview layout
  - Collapsible sidebar for more preview space
  - Search and category filtering
  - 3 pre-built architectures (serverless, microservices, event-driven)
- Added official AWS Architecture Icons (July 2025 release) - 29 service icons
- Improved canvas UX for presentations:
  - Scroll-to-zoom now requires Ctrl/Cmd key (prevents accidental zoom)
  - Added fullscreen toggle button for distraction-free viewing
  - Updated instruction text to reflect new controls
