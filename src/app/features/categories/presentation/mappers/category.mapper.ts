import { Category } from '../../domain/entities/category.model';
import { CategoryViewModel } from '../models/category.viewmodel';

/**
 * Transforma entidades de dominio en modelos de vista para la UI.
 */
export class CategoryMapper {
  /**
   * Mapea una categoría de dominio a su representación de UI.
   * @param category Entidad de dominio.
   */
  static toViewModel(category: Category): CategoryViewModel {
    return {
      id: category.id,
      name: category.name,
    };
  }

  /**
   * Mapea una colección de categorías de dominio a modelos de vista.
   * @param categories Colección de entidades de dominio.
   */
  static toViewModels(categories: readonly Category[]): readonly CategoryViewModel[] {
    return categories.map((category) => CategoryMapper.toViewModel(category));
  }
}
