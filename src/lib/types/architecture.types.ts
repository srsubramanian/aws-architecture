/**
 * Architecture Schema Types
 * Defines the structure for declarative architecture definitions
 */

import type { AWSServiceType, Position } from './aws-services.types';
import type { DataFlowType } from './animation.types';

/** Service node in an architecture */
export interface ArchitectureService {
  /** Unique identifier for the service within the architecture */
  id: string;
  /** AWS service type */
  type: AWSServiceType;
  /** Display label (defaults to service name if not provided) */
  label?: string;
  /** Position on canvas */
  position: Position;
  /** Optional badge text (e.g., "HTTPS", "JWT") */
  badge?: string;
  /** Optional description shown in tooltip */
  description?: string;
}

/** Connection between services */
export interface ArchitectureConnection {
  /** Unique identifier for the connection */
  id: string;
  /** Source service ID */
  from: string;
  /** Target service ID */
  to: string;
  /** Type of data flow animation */
  type: DataFlowType;
  /** Optional label for the connection */
  label?: string;
  /** Animation sequence order (for staged animations) */
  sequence?: number;
}

/** Group/container box (e.g., AWS Cloud, VPC, AZ, Subnet) */
export interface ArchitectureGroup {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Services contained in this group (used for auto-bounds if bounds not specified) */
  serviceIds?: string[];
  /** Explicit bounds (if not specified, calculated from serviceIds) */
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Group style - determines visual appearance */
  style?: 'aws-cloud' | 'vpc' | 'az' | 'subnet' | 'region' | 'custom';
  /** Border color */
  color?: string;
  /** Background color (overrides style default) */
  backgroundColor?: string;
  /** Border style */
  borderStyle?: 'solid' | 'dashed';
  /** Z-index for layering (lower = behind, higher = front) */
  zIndex?: number;
  /** Show icon in label */
  showIcon?: boolean;
}

/** Legend item */
export interface LegendItem {
  /** Data flow type or custom key */
  type: DataFlowType | string;
  /** Display label */
  label: string;
  /** Custom color (uses default if not provided) */
  color?: string;
}

/** Category for organizing architectures */
export type ArchitectureCategory =
  | 'serverless'
  | 'containers'
  | 'data-pipeline'
  | 'machine-learning'
  | 'web-application'
  | 'microservices'
  | 'event-driven'
  | 'iot'
  | 'security'
  | 'devops'
  | 'hybrid'
  | 'other';

/** Complete architecture definition */
export interface ArchitectureDefinition {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Category for organization */
  category: ArchitectureCategory;
  /** Tags for searching/filtering */
  tags: string[];
  /** Version of the architecture */
  version?: string;
  /** Author/creator */
  author?: string;
  /** Canvas dimensions */
  canvas?: {
    width: number;
    height: number;
  };
  /** Service nodes */
  services: ArchitectureService[];
  /** Connections between services */
  connections: ArchitectureConnection[];
  /** Optional groups (VPC, subnets, etc.) */
  groups?: ArchitectureGroup[];
  /** Legend items to display */
  legend?: LegendItem[];
  /** Metadata */
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
}

/** Architecture registry - collection of all architectures */
export interface ArchitectureRegistry {
  architectures: ArchitectureDefinition[];
}

/** Category metadata for UI */
export interface CategoryInfo {
  id: ArchitectureCategory;
  label: string;
  description: string;
  icon?: string;
}

/** All available categories with metadata */
export const ARCHITECTURE_CATEGORIES: CategoryInfo[] = [
  { id: 'serverless', label: 'Serverless', description: 'Lambda-based architectures' },
  { id: 'containers', label: 'Containers', description: 'ECS, EKS, Fargate architectures' },
  { id: 'microservices', label: 'Microservices', description: 'Distributed service architectures' },
  { id: 'event-driven', label: 'Event-Driven', description: 'Event-based async architectures' },
  { id: 'data-pipeline', label: 'Data Pipeline', description: 'ETL and data processing' },
  { id: 'machine-learning', label: 'Machine Learning', description: 'ML/AI workflows' },
  { id: 'web-application', label: 'Web Application', description: 'Web app architectures' },
  { id: 'iot', label: 'IoT', description: 'Internet of Things' },
  { id: 'security', label: 'Security', description: 'Security-focused architectures' },
  { id: 'devops', label: 'DevOps', description: 'CI/CD and automation' },
  { id: 'hybrid', label: 'Hybrid', description: 'Hybrid cloud architectures' },
  { id: 'other', label: 'Other', description: 'Other architectures' },
];
