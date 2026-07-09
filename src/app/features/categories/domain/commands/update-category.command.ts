/**
 * Datos requeridos para actualizar una categoría existente.
 */
export interface UpdateCategoryCommand {
  readonly id: string;
  readonly name: string;
}
