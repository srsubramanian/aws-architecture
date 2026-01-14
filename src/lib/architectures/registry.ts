/**
 * Architecture Registry
 * Central registry of all available architectures
 */

import type { ArchitectureDefinition, ArchitectureCategory } from '../types';
import {
  serverlessPaymentArchitecture,
  microservicesEcommerceArchitecture,
  eventDrivenOrdersArchitecture,
  containerizedWebApp,
} from './configs';

/** All registered architectures */
export const architectures: ArchitectureDefinition[] = [
  serverlessPaymentArchitecture,
  microservicesEcommerceArchitecture,
  eventDrivenOrdersArchitecture,
  containerizedWebApp,
];

/** Get architecture by ID */
export function getArchitectureById(id: string): ArchitectureDefinition | undefined {
  return architectures.find((arch) => arch.id === id);
}

/** Get architectures by category */
export function getArchitecturesByCategory(category: ArchitectureCategory): ArchitectureDefinition[] {
  return architectures.filter((arch) => arch.category === category);
}

/** Get architectures by tag */
export function getArchitecturesByTag(tag: string): ArchitectureDefinition[] {
  return architectures.filter((arch) => arch.tags.includes(tag.toLowerCase()));
}

/** Search architectures by name or description */
export function searchArchitectures(query: string): ArchitectureDefinition[] {
  const lowerQuery = query.toLowerCase();
  return architectures.filter(
    (arch) =>
      arch.name.toLowerCase().includes(lowerQuery) ||
      arch.description.toLowerCase().includes(lowerQuery) ||
      arch.tags.some((tag) => tag.includes(lowerQuery))
  );
}

/** Get all unique tags across all architectures */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  architectures.forEach((arch) => arch.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

/** Get all categories that have at least one architecture */
export function getActiveCategories(): ArchitectureCategory[] {
  const categorySet = new Set<ArchitectureCategory>();
  architectures.forEach((arch) => categorySet.add(arch.category));
  return Array.from(categorySet);
}

/** Register a new architecture (for runtime additions) */
export function registerArchitecture(architecture: ArchitectureDefinition): void {
  const existing = architectures.findIndex((a) => a.id === architecture.id);
  if (existing >= 0) {
    architectures[existing] = architecture;
  } else {
    architectures.push(architecture);
  }
}
