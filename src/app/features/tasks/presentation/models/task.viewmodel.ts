export interface TaskViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly categoryId: string;
  readonly categoryLabel: string;
  readonly completed: boolean;
  readonly statusLabel: string;
  readonly statusColor: string;
}
