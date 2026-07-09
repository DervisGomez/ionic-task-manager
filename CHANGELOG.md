# Changelog

Todos los cambios importantes de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] — 2026-07-09

Versión final de entrega de la prueba técnica Senior. Sprints 1–8 consolidados.

### Added

- CRUD completo de **tareas** y **categorías** desde la interfaz.
- Feature `categories`: pantalla `/categories`, `CategoryFacade`, casos de uso y repositorio.
- **Persistencia local** con `localStorage` vía datasources (`LocalStorageTaskDatasource`, `LocalStorageCategoryDatasource`).
- **Firebase Remote Config** — infraestructura en `core/firebase/` sin Firestore ni Auth.
- **Feature flag** `enable_categories` con `CategoriesFeatureGuard` y valor por defecto en `remote-config.defaults.ts`.
- **Infinite Scroll** con `IncrementalList` (página de 30 ítems) e `ion-infinite-scroll`.
- **Benchmark de rendimiento** — `TaskBenchmarkService` y panel de desarrollo en lista de tareas.
- **Cordova 13** — empaquetado Android (`cordova-android@15`), scripts `build:native`, `android`, `android:run`.
- Preparación **iOS** documentada (`cordova-ios@8`; compilación solo en macOS).
- Estados vacíos diferenciados: sin tareas vs. sin resultados de búsqueda/filtro.
- `TaskPresentationMapper` con caché `Map` para categorías enriquecidas.
- Catálogo centralizado de categorías en `features/tasks/shared/catalogs/`.
- Componentes compartidos: `PageHeader`, `SearchBar`, `CategoryFilter`, `EmptyState`, `FAB`.
- Design System modular en `src/theme/` y Motion System con `prefers-reduced-motion`.
- Pipeline `npm run check` (formato, lint, typecheck, tests, build).
- Capturas de pantalla en `docs/screenshots/`.
- Publicación del **APK Android** mediante GitHub Releases (v1.0.0).

### Changed

- `TaskFacade` ampliado con búsqueda, filtrado, `hasAnyTasks` y orquestación CRUD.
- `TaskListComponent` con `OnPush`, renderizado incremental y FAB fijo al viewport.
- `FloatingActionButtonComponent` con posicionamiento fijo compatible con wrappers Angular.
- Category filter migrado al patrón ARIA `radiogroup` + `radio`.
- Tokens de tema reorganizados en partials SCSS.

### Improved

- Rendimiento de listas grandes: de renderizar miles de tarjetas a máximo 30 visibles por página.
- Consistencia visual: componentes consumen tokens semánticos unificados.
- Microinteracciones en tarjetas, formulario, FAB y modales.
- Legibilidad de SCSS: eliminación de valores hardcodeados redundantes.

### Accessibility

- Auditoría orientada a WCAG 2.2 AA (cobertura parcial).
- HTML semántico (`header`, `main`, `ul`/`li`, `form`).
- Etiquetas asociadas, `aria-describedby`, `aria-required` y mensajes con `role="alert"`.
- Foco visible tokenizado y área táctil mínima de 44px.
- Utilidad `.visually-hidden` para etiquetas de lectores de pantalla.

### Documentation

- README como punto de entrada; detalle en `docs/architecture.md`, `docs/technical-decisions.md`, `docs/performance-benchmark.md` y `docs/cordova-environment.md`.
- Capturas en `docs/screenshots/`.
- Documentación consolidada para revisión en ~15 minutos.

### Testing

- **248 tests unitarios** ejecutados en CI (249 definidos; 1 omitido opcional en benchmark documental).
- Cobertura en dominio, datos, datasources, facades, mappers, guards, Remote Config, componentes UI y shared.

### Architecture

- Clean Architecture por feature con capas `domain`, `data` y `presentation`.
- DDD ligero: entidades, comandos y casos de uso (dominio anémico).
- Repository Pattern con contratos en dominio e implementaciones en `data/`.
- Composition root en `tasks.providers.ts` y `categories.providers.ts`.
- Alias TypeScript (`@features/*`, `@shared/*`, `@core/*`).

---

## Versiones de desarrollo (histórico)

### [0.4.0]

- Presentation Layer para la feature de tareas.
- `TaskFacade` y flujo de creación de tareas.

### [0.3.0]

- Capa de dominio con entidades, comandos y casos de uso.
- Repository Pattern e inyección de dependencias.

### [0.2.0]

- Componentes reutilizables en `shared/` y `SharedModule`.

### [0.1.0]

- Inicialización del proyecto con Angular + Ionic.
- Base del Design System.
