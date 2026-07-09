# Changelog

Todos los cambios importantes de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]

### Added

- Catálogo centralizado de categorías en `features/tasks/shared/catalogs/task-categories.catalog.ts`.
- Validación obligatoria de `categoryId` en `TaskFormComponent` con mensaje de error accesible.

### Changed

- `TaskMapper`, `TaskFormComponent` y `TaskListComponent` consumen el catálogo en lugar de listas hardcodeadas.

### Documentation

- Documentación alineada con el comportamiento real del código (sin reglas de negocio aspiracionales).

### Testing

- **117 tests unitarios** (Jasmine + Karma); +2 tests de validación de categoría en formulario.

## [1.0.0] — 2026-07-08

Primera versión estable. Sprints 1–6 completados.

### Added

- CRUD completo de tareas desde la interfaz.
- `TaskCardComponent` con checkbox, categoría, estado y acciones de edición/eliminación.
- `TaskFormComponent` reutilizable para creación y edición en modal.
- Búsqueda en tiempo real por título y descripción.
- Filtrado por categoría (Todas, Trabajo, Personal).
- `TaskFacade`, `TaskMapper` y `TaskViewModel`.
- Componentes compartidos: `PageHeader`, `SearchBar`, `CategoryFilter`, `EmptyState`, `FAB`.
- Retroalimentación con `IonToast` y confirmación de eliminación con `IonAlert`.
- Design System modular en `src/theme/` (colores, spacing, tipografía, elevación, radius, motion).
- Motion System con keyframes globales y soporte `prefers-reduced-motion`.
- Layout responsive mobile first (breakpoints `768px` y `1024px`).
- Pipeline `npm run check` (formato, lint, typecheck, tests, build).

### Changed

- `TaskFacade` ampliado con actualización, eliminación, búsqueda y filtrado en memoria.
- Estructura de presentación con `task-card`, `mappers`, `models` y `state`.
- Tokens de tema reorganizados en partials SCSS (`_colors`, `_spacing`, etc.).
- Category filter migrado al patrón ARIA `radiogroup` + `radio`.

### Improved

- Consistencia visual: componentes consumen tokens semánticos unificados.
- Microinteracciones en tarjetas, formulario, FAB y modales.
- Legibilidad de SCSS: eliminación de valores hardcodeados redundantes.
- Jerarquía tipográfica con roles `--app-text-*`.

### Accessibility

- Auditoría orientada a WCAG 2.2 AA.
- HTML semántico (`header`, `ul`/`li`, `form`).
- Etiquetas asociadas, `aria-describedby`, `aria-required` y mensajes con `role="alert"`.
- Foco visible tokenizado (`--app-focus-ring-*`, `--app-shadow-focus`).
- Área táctil mínima de 44px en controles interactivos.
- Utilidad `.visually-hidden` para etiquetas de solo lectores de pantalla.

### Documentation

- README profesional con arquitectura, Design System, motion y roadmap.
- `docs/design-system.md` — tokens y principios visuales.
- `docs/accessibility.md` — decisiones y componentes auditados.
- `docs/architecture/architecture.md` — arquitectura consolidada.
- `docs/contributing.md`, `docs/testing.md`, `docs/releases.md`.
- `ROADMAP.md` con Sprints 1–6 completados y Sprint 7 planificado.
- ADR-001: Angular DI en el dominio.

### Testing

- **115 tests unitarios** (Jasmine + Karma).
- Cobertura en dominio, repositorio, facade, mapper y componentes UI.
- Tests de accesibilidad en formulario, filtros, búsqueda y listado.

### Architecture

- Clean Architecture por feature con capas `domain`, `data` y `presentation`.
- DDD ligero: interfaces `Task` y `Category`, comandos y casos de uso (orquestación CRUD).
- Repository Pattern con `TaskRepository` e `InMemoryTaskRepository`.
- Composition root en `tasks.providers.ts`.
- Alias TypeScript (`@features/*`, `@shared/*`).

---

## [0.4.0]

### Added

- Presentation Layer para la feature de tareas.
- `TaskFacade` como punto de entrada entre la UI y los casos de uso.
- Flujo funcional de creación de tareas desde formulario hasta persistencia in-memory.

## [0.3.0]

### Added

- Capa de dominio con entidades y comandos de tareas.
- Repository Pattern mediante contrato de repositorio y su implementación concreta.
- Use Cases para operaciones CRUD de tareas.
- Composición de dependencias con Dependency Injection.

## [0.2.0]

### Added

- Componentes reutilizables de interfaz en la capa `shared`.
- `SharedModule` para reutilización consistente de componentes UI.

## [0.1.0]

### Added

- Inicialización del proyecto con Angular + Ionic.
- Base del Design System con tokens visuales y estilos globales.
