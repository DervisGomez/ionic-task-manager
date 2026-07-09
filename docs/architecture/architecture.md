# Arquitectura — Ionic Task Manager

Documento consolidado de la arquitectura del proyecto. Complementa los detalles en [layers.md](./layers.md), [dependency-flow.md](./dependency-flow.md) y [folder-structure.md](./folder-structure.md).

---

## Visión general

El proyecto aplica **Clean Architecture** sobre **Angular** e **Ionic**, organizando cada funcionalidad como una **feature** autónoma con capas internas. El dominio es el núcleo: las demás capas dependen de sus abstracciones, nunca al revés.

```
Presentation
     ↓
  Facade
     ↓
 Use Cases
     ↓
Repositories (contratos)
     ↓
Data Sources
     ↓
Infrastructure
```

---

## Clean Architecture

Cada feature (`tasks`) se divide en tres capas principales:

| Capa         | Carpeta                   | Contenido                                                   |
| ------------ | ------------------------- | ----------------------------------------------------------- |
| Presentación | `presentation/`, `pages/` | Componentes, facades, mappers, view models, estado          |
| Dominio      | `domain/`                 | Entidades, comandos, casos de uso, contratos de repositorio |
| Datos        | `data/`                   | Implementaciones de repositorio, datasources                |

**Regla de dependencia:** la presentación conoce el dominio; el dominio no conoce la presentación ni la infraestructura. La capa de datos implementa contratos definidos en el dominio.

Beneficios en el estado actual:

- Sustituir `InMemoryTaskRepository` por otra implementación sin tocar casos de uso ni UI.
- Probar los casos de uso con dobles de repositorio.
- Evolucionar la interfaz sin modificar la estructura del dominio.

**Alcance real del dominio:** los casos de uso ensamblan la entidad `Task` (id, fechas, campos del comando) y delegan en el repositorio. No aplican validaciones ni invariantes de negocio; las validaciones de entrada viven en `TaskFormComponent` (Reactive Forms).

---

## DDD (Domain-Driven Design)

El proyecto adopta **lenguaje ubicuo básico** inspirado en DDD, no un modelado rico de dominio:

| Concepto    | Implementación                                                                      |
| ----------- | ----------------------------------------------------------------------------------- |
| Entidad     | `Task` (interfaz TypeScript); `Category` (tipo en dominio, sin uso activo en flujo) |
| Comando     | `CreateTaskCommand`, `UpdateTaskCommand`                                            |
| Caso de uso | `CreateTaskUseCase`, `UpdateTaskUseCase`, etc.                                      |
| Puerto      | `TaskRepository`                                                                    |

Los casos de uso coordinan operaciones CRUD y persistencia. Las etiquetas de categoría para la UI provienen de `features/tasks/shared/catalogs/task-categories.catalog.ts`, no del dominio.

La validación de formulario (título obligatorio, categoría obligatoria, longitudes máximas) está en la capa de presentación.

---

## Flujo de dependencias

### Operación CRUD típica

```
Usuario
  ↓
TaskListComponent / TaskCardComponent / TaskFormComponent
  ↓
TaskFacade
  ↓
Use Case (Create · Update · Delete · GetTasks)
  ↓
TaskRepository (contrato)
  ↓
InMemoryTaskRepository
  ↓
TaskFacade (recarga + filtros)
  ↓
TaskMapper → TaskViewModel
  ↓
UI actualizada
```

### Búsqueda y filtrado

La búsqueda y el filtro por categoría se resuelven en `TaskFacade` sobre el estado en memoria, sin casos de uso adicionales. `SearchBarComponent` y `CategoryFilterComponent` emiten eventos; el facade actualiza `filteredTasks`.

---

## Composition Root

El **composition root** es el único lugar donde se conectan abstracciones con implementaciones concretas:

```text
features/tasks/tasks.providers.ts
```

Aquí se registra:

- `TaskRepository` → `InMemoryTaskRepository`
- Casos de uso del dominio
- `TaskFacade`

Los componentes y páginas inyectan `TaskFacade`; nunca el repositorio directamente.

Ver [ADR-001](../adr/ADR-001-angular-di-in-domain.md) para la decisión sobre `@Injectable()` en casos de uso del dominio.

---

## Patrones de presentación

### Facade

`TaskFacade` centraliza:

- Invocación de casos de uso
- Estado de pantalla (`TaskState`)
- Búsqueda y filtrado en memoria
- Exposición de `TaskViewModel[]` para la UI

### ViewModel + Mapper

- `Task` (dominio) — interfaz con la forma de datos persistidos.
- `TaskViewModel` (presentación) — datos orientados a renderizado (incluye `categoryLabel`, `statusLabel`).
- `TaskMapper` — transformación unidireccional dominio → UI; resuelve labels desde el catálogo de categorías.

Esto evita que los componentes conozcan la estructura interna de las entidades ni dupliquen traducciones de categoría.

---

## Design System

El sistema visual vive en `src/theme/` y se carga globalmente:

- `variables.scss` — barrel que importa partials de tokens
- `_colors.scss`, `_spacing.scss`, `_radius.scss`, `_elevation.scss`, `_typography.scss`, `_motion-tokens.scss`
- `motion.scss` — keyframes y comportamientos globales (importado desde `global.scss`)

Los componentes consumen tokens semánticos. No se definen colores, espaciados o radios arbitrarios en archivos de componente cuando existe un token equivalente.

Documentación completa: [design-system.md](../design-system.md)

---

## Motion System

Definido en `_motion-tokens.scss` y `motion.scss`:

| Token                          | Uso                            |
| ------------------------------ | ------------------------------ |
| `--app-transition-interactive` | Hover, focus, tap (150 ms)     |
| `--app-transition-emphasis`    | Entradas, modales (200 ms)     |
| `app-enter-rise`               | Stagger de tarjetas en listado |
| `app-fade-in`                  | Empty state, backdrop de modal |
| `app-modal-enter`              | Apertura de modal              |

`prefers-reduced-motion: reduce` anula duraciones y desactiva animaciones.

---

## Accessibility

Integrada en la capa de presentación sin alterar el dominio:

- HTML semántico y roles ARIA correctos (`radiogroup` en filtros, no `tablist` sin paneles)
- Foco visible tokenizado
- Etiquetas asociadas y mensajes de error accesibles
- Área táctil mínima de 44px

Documentación: [accessibility.md](../accessibility.md)

---

## Testing Strategy

La estrategia prioriza **pruebas unitarias** en cada capa:

| Capa         | Qué se prueba                     | Herramientas      |
| ------------ | --------------------------------- | ----------------- |
| Dominio      | Casos de uso con repositorio mock | Jasmine           |
| Datos        | `InMemoryTaskRepository`          | Jasmine           |
| Presentación | Facade, mapper, componentes       | Jasmine + TestBed |
| Shared       | Componentes reutilizables         | Jasmine + TestBed |

**117 tests** ejecutados en CI con `npm run test:ci`.

Filosofía:

- Probar comportamiento observable (estado, DOM, emisiones) siempre que sea posible.
- Aislar casos de uso con mocks de repositorio; el dominio depende de `@Injectable()` de Angular (ADR-001).
- Verificar atributos ARIA en componentes interactivos.

Guía detallada: [testing.md](../testing.md)

---

## Estructura por feature

```text
features/tasks/
├── domain/          # Tipos, comandos, casos de uso, contratos
├── data/            # Infraestructura de persistencia
├── presentation/    # UI + orquestación
├── shared/          # Catálogos y utilidades compartidas de la feature
│   └── catalogs/
├── pages/           # Contenedores de pantalla
├── tasks.module.ts
├── tasks.providers.ts   # Composition root
└── tasks-routing-module.ts
```

Componentes transversales de UI en `shared/`. Servicios globales futuros en `core/` (carpeta reservada).

Detalle de carpetas: [folder-structure.md](./folder-structure.md)

---

## Decisiones relacionadas

| Documento                                         | Contenido                           |
| ------------------------------------------------- | ----------------------------------- |
| [design-decisions.md](./design-decisions.md)      | Decisiones de diseño hasta Sprint 6 |
| [ADR-001](../adr/ADR-001-angular-di-in-domain.md) | Angular DI en casos de uso          |
| [dependency-flow.md](./dependency-flow.md)        | Flujos por operación                |

---

## Evolución planificada (Sprint 7)

La arquitectura actual permite incorporar sin ruptura:

- **Firestore** como implementación de `TaskRepository`
- **DTOs** en `data/datasources/` para desacoplar API de entidades
- **Offline** con cola de sincronización en infraestructura
- **Categorías dinámicas** como nueva feature con la misma estructura de capas

El dominio y el facade permanecen estables; los cambios se concentran en `data/` y nuevos módulos de infraestructura.
