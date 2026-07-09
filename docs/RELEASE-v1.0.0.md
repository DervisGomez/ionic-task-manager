# Release v1.0.0 — Resumen técnico

> **Nota:** documento de referencia al publicar v1.0.0. Cambios posteriores (catálogo de categorías, validación obligatoria de categoría, tests adicionales) están en [CHANGELOG.md](../CHANGELOG.md) sección `[Unreleased]` y en el [README](../README.md).

Primera versión estable del proyecto **Ionic Task Manager**. Sprints 1–6 completados.

## Funcionalidades implementadas

| Área          | Detalle                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------- |
| CRUD          | Crear, leer, editar y eliminar tareas desde la interfaz                                  |
| Listado       | Carga automática, tarjetas con estado y categoría                                        |
| Búsqueda      | Filtrado en tiempo real por título y descripción                                         |
| Filtros       | Selección por categoría con patrón `radiogroup` + navegación por teclado                 |
| Formulario    | Creación y edición reutilizando `TaskFormComponent` en modal                             |
| Feedback      | `IonToast` para operaciones; `IonAlert` para eliminación                                 |
| Estado vacío  | Pantalla informativa con CTA cuando no hay tareas                                        |
| Design System | Tokens modulares en `src/theme/`                                                         |
| Motion        | Transiciones tokenizadas y `prefers-reduced-motion`                                      |
| Responsive    | Mobile first con breakpoints `768px` y `1024px`                                          |
| Accesibilidad | Mejoras orientadas a WCAG 2.2 AA: ARIA, foco visible, HTML semántico (cobertura parcial) |

## Arquitectura utilizada

```
Presentation → Facade → Use Cases → Repository → Data Sources → Infrastructure
```

- **Presentation**: páginas, componentes, `TaskFacade`, `TaskMapper`, `TaskViewModel`
- **Domain**: entidades, comandos, casos de uso, contrato `TaskRepository`
- **Data**: `InMemoryTaskRepository` (implementación in-memory)

La UI nunca accede directamente al repositorio.

## Patrones aplicados

| Patrón             | Implementación                                        |
| ------------------ | ----------------------------------------------------- |
| Clean Architecture | Separación dominio / presentación / datos             |
| DDD                | Interfaces, comandos y casos de uso (dominio anémico) |
| Repository Pattern | `TaskRepository` + `InMemoryTaskRepository`           |
| Use Cases          | `GetTasks`, `CreateTask`, `UpdateTask`, `DeleteTask`  |
| Facade             | `TaskFacade` como único punto de entrada UI → dominio |
| ViewModel + Mapper | Adaptación de entidades a la UI                       |
| Composition Root   | `tasks.providers.ts`                                  |
| Shared Components  | `SharedModule` con 5 componentes reutilizables        |
| Design Tokens      | `src/theme/` con partials modulares                   |

## Cobertura de pruebas

| Métrica         | Valor           |
| --------------- | --------------- |
| Tests unitarios | **115**         |
| Framework       | Jasmine + Karma |
| Pipeline        | `npm run check` |

## Próximos pasos (Sprint 7)

1. **Firestore** — backend de datos en la nube
2. **DTO** — capa de transferencia desacoplada
3. **Offline** — operación sin conexión
4. **Categorías dinámicas** — gestión configurable de categorías
5. **Sincronización** — reconciliación dispositivo ↔ nube
6. **Observabilidad** — logging y métricas en producción

Gracias a la inversión de dependencias, estos cambios se concentran en la capa `data` y nuevos módulos de infraestructura.
