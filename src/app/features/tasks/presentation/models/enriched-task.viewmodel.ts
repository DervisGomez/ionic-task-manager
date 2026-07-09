/**
 * Representación visual de una tarea enriquecida para la UI.
 */
export interface EnrichedTaskViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly categoryId: string;
  readonly categoryLabel: string;
  readonly statusLabel: string;
  readonly statusColor: string;
}
