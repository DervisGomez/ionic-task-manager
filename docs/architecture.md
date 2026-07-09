# Arquitectura

Documento único de referencia para la estructura del proyecto **Ionic Task Manager** (v1.0.0).

---

## Visión general

Clean Architecture sobre Angular 20 e Ionic 8. Cada capacidad de negocio es una **feature** autónoma (`tasks`, `categories`) con capas internas. El dominio define contratos; la presentación y los datos dependen de ellos, nunca al revés.

```
Presentation → Facade → Use Cases → Repository (contrato) → Data Source → localStorage
```

Infraestructura transversal en `core/firebase/` (Remote Config). Componentes reutilizables en `shared/`.

---

## Capas y responsabilidades

| Capa             | Ubicación                 | Responsabilidad                                            | No debe conocer                                                |
| ---------------- | ------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| **Presentation** | `presentation/`, `pages/` | UI, facades, mappers, estado, validación de formularios    | Implementaciones de repositorio, `localStorage`, SDK Firebase  |
| **Domain**       | `domain/`                 | Entidades, comandos, casos de uso, contratos `*Repository` | Ionic, Angular (salvo `@Injectable` en use cases), datasources |
| **Data**         | `data/`                   | Repositorios concretos y datasources                       | Componentes, facades                                           |
| **Core**         | `core/`                   | Remote Config, guards, providers globales                  | Lógica de negocio de features                                  |

**DDD ligero:** interfaces `Task` y `Category`, comandos y casos de uso CRUD. Sin invariantes de negocio en dominio; validaciones en Reactive Forms.

**Dominio anémico deliberado:** los casos de uso ensamblan entidades y delegan en el repositorio. Búsqueda y filtrado de tareas viven en `TaskFacade`, no en casos de uso adicionales.

---

## Estructura de carpetas

```text
src/app/
├── core/firebase/              # Remote Config, guards, providers
├── features/
│   ├── tasks/
│   │   ├── domain/             # Entidades, use cases, TaskRepository
│   │   ├── data/               # InMemoryTaskRepository, LocalStorageTaskDatasource
│   │   ├── presentation/       # Facade, mappers, task-card, task-form, benchmark dev
│   │   ├── pages/task-list/
│   │   ├── tasks.providers.ts  # Composition root
│   │   └── shared/catalogs/    # Labels legacy complementarios
│   └── categories/             # Misma estructura: CRUD categorías
└── shared/
    ├── components/             # PageHeader, SearchBar, CategoryFilter, EmptyState, FAB
    └── utils/incremental-list.ts

src/theme/                      # Design tokens y motion
```

Alias TypeScript: `@features/*`, `@shared/*`, `@core/*`, `@env/*`.

---

## Flujo de dependencias

### CRUD de tarea

```
Usuario → TaskListComponent / TaskFormComponent
       → TaskFacade
       → CreateTaskUseCase | UpdateTaskUseCase | DeleteTaskUseCase | GetTasksUseCase
       → TaskRepository
       → InMemoryTaskRepository → LocalStorageTaskDatasource
       → TaskFacade (recarga + filtros)
       → TaskMapper / TaskPresentationMapper → ViewModels
       → UI (+ IonToast / IonAlert)
```

### Búsqueda, filtro y listas grandes

1. `SearchBarComponent` y `CategoryFilterComponent` emiten eventos.
2. `TaskFacade` filtra `state.tasks` en memoria → `filteredTasks`.
3. `TaskListComponent` mapea a `EnrichedTaskViewModel` y pagina con `IncrementalList` (30 ítems/página) + `ion-infinite-scroll`.

Detalle de rendimiento: [performance-benchmark.md](./performance-benchmark.md).

### Categorías y feature flags

```
CategoryListComponent → CategoryFacade → use cases → CategoryRepository → localStorage
```

`/categories` protegida por `CategoriesFeatureGuard` según `enable_categories` en Remote Config.

### Operaciones UI → dominio

| Operación        | UI                          | Use case            | Notas                    |
| ---------------- | --------------------------- | ------------------- | ------------------------ |
| Listar           | `ionViewWillEnter`          | `GetTasksUseCase`   | —                        |
| Crear / editar   | Modal + `TaskFormComponent` | `Create` / `Update` | Validación en formulario |
| Eliminar         | `IonAlert` + confirmación   | `DeleteTaskUseCase` | —                        |
| Completar        | Checkbox en tarjeta         | `UpdateTaskUseCase` | Toggle `completed`       |
| Buscar / filtrar | SearchBar, CategoryFilter   | —                   | Solo `TaskFacade`        |

---

## Patrones de presentación

### Facade (`TaskFacade`, `CategoryFacade`)

Único punto de entrada UI → dominio. Orquesta casos de uso, mantiene estado de pantalla y expone view models. Los componentes no inyectan repositorios ni use cases individuales.

### ViewModel + Mapper

- `Task` / `Category` — forma persistida (dominio).
- `TaskViewModel`, `EnrichedTaskViewModel`, `CategoryViewModel` — datos listos para renderizar.
- `TaskMapper`, `TaskPresentationMapper`, `CategoryMapper` — traducción unidireccional; el mapper de presentación usa `Map` O(1) para etiquetas de categoría.

### Composition root

| Archivo                                       | Registra                                                            |
| --------------------------------------------- | ------------------------------------------------------------------- |
| `features/tasks/tasks.providers.ts`           | `TaskRepository` → implementación, use cases, `TaskFacade`          |
| `features/categories/categories.providers.ts` | `CategoryRepository` → implementación, use cases, `CategoryFacade`  |
| `core/firebase/firebase.providers.ts`         | AngularFire Remote Config, `RemoteConfigService`, `APP_INITIALIZER` |

---

## Persistencia

`InMemoryTaskRepository` e `InMemoryCategoryRepository` mantienen estado en memoria y delegan serialización a datasources:

- `LocalStorageTaskDatasource` — clave `task-manager.tasks`
- `LocalStorageCategoryDatasource` — clave `task-manager.categories`

Sustituir `localStorage` por Firestore implica cambiar `data/` y el composition root; dominio y facades permanecen estables.

---

## Firebase (Hosting y Remote Config)

El proyecto Firebase se utiliza para **Hosting** (demo web pública) y **Remote Config** (feature flags). `@angular/fire` se importa **únicamente** en `core/firebase/`. Features consumen `RemoteConfigService.getBoolean(RemoteConfigKeys.*)` con fallback en `remote-config.defaults.ts`. Sin Firestore, Auth ni Analytics.

**Demo web:** [https://ionic-task-manager-9e74b.web.app](https://ionic-task-manager-9e74b.web.app)

---

## Design System y motion

Tokens en `src/theme/`: colores (`--app-color-*`), spacing (`--app-spacing-*`), tipografía (`--app-text-*`), elevación, radius y motion (`--app-transition-*`).

Principios:

- Componentes consumen tokens semánticos; evitar valores arbitrarios en SCSS de feature.
- Motion con keyframes globales (`app-enter-rise`, `app-modal-enter`) y `prefers-reduced-motion: reduce`.
- Responsive mobile first: breakpoints `768px` y `1024px`.

Componentes shared: `PageHeader`, `SearchBar`, `CategoryFilter`, `EmptyState`, `FloatingActionButton`.

---

## Accesibilidad

Orientación WCAG 2.2 AA (cobertura parcial, sin certificación):

- HTML semántico (`header`, `main`, `ul`/`li`, `form`).
- Filtro de categorías como `radiogroup` + `radio` (no `tablist` sin paneles).
- Etiquetas asociadas, `aria-describedby`, mensajes con `role="alert"`.
- Foco visible tokenizado; área táctil mínima 44px.
- Empty states diferenciados con CTAs distintas («Nueva tarea» vs «Limpiar filtros»).

---

## Decisión: Angular DI en dominio

**Contexto:** casos de uso necesitan DI; Clean Architecture estricta exigiría dominio sin framework.

**Decisión:** `@Injectable()` solo en use cases; composición en `*.providers.ts`. No se usa otra API de Angular en dominio.

**Trade-off:** acoplamiento mínimo a Angular a cambio de simplicidad y testabilidad con `TestBed`/mocks. Revisable si el dominio debe ser 100 % agnóstico.

---

## Testing (resumen)

248 pruebas unitarias en CI (Jasmine + Karma). Cobertura por capa: dominio, datasources, repositorios, facades, mappers, guards, Remote Config, componentes y `IncrementalList`. Pipeline: `npm run check`.

Detalle de estrategia: sección Testing del [README.md](../README.md).

---

## Referencias

- [technical-decisions.md](./technical-decisions.md) — respuestas al enunciado y decisiones para entrevista
- [performance-benchmark.md](./performance-benchmark.md) — optimizaciones y métricas
- [cordova-environment.md](./cordova-environment.md) — build nativo
