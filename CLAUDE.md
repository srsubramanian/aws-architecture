# AWS Architecture Animations

A production-ready React component library for creating animated AWS architecture diagrams with 60fps animations powered by Motion.dev (Framer Motion).

## Project Overview

This library provides:
- 27 animated AWS service components organized by category
- DataFlow animations (sync, async, stream, batch, error types)
- Pre-built architecture templates (ServerlessPayment, Microservices, EventDriven)
- DiagramCanvas with zoom/pan support
- Full TypeScript support with strict mode

## Directory Structure

```
src/
├── lib/                        # Library source code (published to npm)
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
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # colors, positions, timing, animations utilities
│   └── index.ts               # Main library exports
├── demo/                       # Demo application
│   ├── App.tsx                # Main demo app
│   └── main.tsx               # Entry point
├── stories/                    # Storybook stories
└── styles.css                  # Tailwind CSS styles
public/
└── icons/                      # AWS service SVG icons (29 icons)
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
- `src/lib/components/aws/shared/AWSService.tsx` - Base component for all AWS services
- `src/lib/components/aws/shared/ServiceIcon.tsx` - Icon loader with fallback SVGs
- `src/lib/components/connections/DataFlow.tsx` - Animated data flow between services
- `src/lib/components/diagrams/DiagramCanvas.tsx` - Zoomable/pannable canvas
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

## Code Conventions

- All components use Motion.dev for animations
- Service components extend the base `AWSService` component
- Icons are SVG files in `public/icons/` with gradient backgrounds
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
