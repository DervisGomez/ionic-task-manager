/**
 * Entidad de dominio que representa una categoría.
 */
export interface Category {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
