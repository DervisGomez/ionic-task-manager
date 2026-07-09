# Ionic Task Manager

Aplicación de gestión de tareas construida con **Angular** e **Ionic**, diseñada con **Clean Architecture** y **DDD** para mantener una separación clara entre dominio, presentación e infraestructura.

El proyecto prioriza legibilidad, testabilidad y escalabilidad, sirviendo como referencia de arquitectura en aplicaciones móviles híbridas.

## Características

Funcionalidades implementadas:

- **CRUD completo de tareas**: crear, leer, editar y eliminar.
- **Listado de tareas** con carga automática al iniciar la pantalla.
- **Formulario reactivo** reutilizable (`TaskFormComponent`) para creación y edición.
- **Tarjetas de tarea** (`TaskCardComponent`) con checkbox, categoría, estado y acciones.
- **Búsqueda en tiempo real** por título y descripción.
- **Filtrado por categoría** (Todas, Trabajo, Personal).
- **Estado vacío** cuando no existen tareas registradas.
- **Retroalimentación visual** con `IonToast` tras operaciones exitosas o fallidas.
- **Confirmación de eliminación** mediante `IonAlert`.
- **Gestión de estado de pantalla** a través de `TaskFacade` (tareas filtradas, búsqueda, categoría, carga y errores).
- **Componentes compartidos** reutilizables: cabecera, búsqueda, filtros, estado vacío y botón flotante.
- **Capa de dominio** con entidades, comandos, casos de uso y contrato de repositorio.
- **Persistencia in-memory** mediante `InMemoryTaskRepository`.
- **Design Tokens** centralizados en `src/theme/variables.scss`.
- **Accesibilidad** con soporte WCAG 2.2 AA (ARIA, navegación por teclado, foco visible).
- **96 tests unitarios** en dominio, datos, presentación y componentes compartidos.

## Arquitectura de alto nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTACIÓN                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  TaskList    │  │  TaskCard    │  │  Shared Components   │  │
│  │  Component   │  │  Component   │  │  (SearchBar, Filter, │  │
│  │  (página)    │  │              │  │   EmptyState, FAB)   │  │
│  └──────┬───────┘  └──────────────┘  └──────────────────────┘  │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  TaskFacade  │  │  TaskMapper  │  │  TaskViewModel       │  │
│  │  (orquesta)  │  │  (adapta)    │  │  (estado de UI)      │  │
│  └──────┬───────┘  └──────────────┘  └──────────────────────┘  │
└─────────┼───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                           DOMINIO                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Use Cases: GetTasks · CreateTask · UpdateTask · Delete  │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │  TaskRepository (contrato abstracto)                      │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                            DATOS                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  InMemoryTaskRepository (implementación concreta)         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Arquitectura

El módulo `Tasks` organiza el código en capas con responsabilidades bien definidas:

### Clean Architecture

Separa el dominio de los detalles de framework e infraestructura. La UI no accede directamente al repositorio ni a la capa de datos; toda la orquestación pasa por `TaskFacade`.

### DDD (Domain-Driven Design)

El dominio modela el negocio con entidades (`Task`), comandos (`CreateTaskCommand`, `UpdateTaskCommand`) y reglas encapsuladas en casos de uso. La lógica de negocio vive en `domain/`, independiente de cómo se muestra o persiste la información.

### Repository Pattern

`TaskRepository` define el contrato de persistencia en el dominio. La implementación concreta (`InMemoryTaskRepository`) reside en la capa de datos y se registra en el composition root (`tasks.providers.ts`).

### Use Cases

Cada operación de negocio se expresa como un caso de uso dedicado:

- `GetTasksUseCase`
- `CreateTaskUseCase`
- `UpdateTaskUseCase`
- `DeleteTaskUseCase`

Los casos de uso del dominio se comunican únicamente con el contrato `TaskRepository`.

### Facade Pattern

`TaskFacade` actúa como punto de entrada entre la UI y el dominio. Los componentes dependen solo del facade, que orquesta los casos de uso, aplica filtros de búsqueda y categoría, y expone el estado de la pantalla mediante `TaskViewModel`.

### Flujo de la aplicación

1. Al cargar la pantalla, `TaskListComponent` invoca `TaskFacade.loadTasks()`.
2. El usuario puede **buscar** tareas o **filtrar** por categoría; el facade aplica los filtros en memoria.
3. Para **crear** o **editar**, se abre un modal con `TaskFormComponent` que emite un `CreateTaskCommand`.
4. Para **eliminar**, se muestra un `IonAlert` de confirmación antes de delegar al facade.
5. Tras cada operación, `TaskListComponent` muestra un `IonToast` de éxito o error.
6. El facade recarga el listado y la UI se actualiza automáticamente.

```
Usuario
   ↓
TaskListComponent / TaskCardComponent / TaskFormComponent
   ↓
TaskFacade
   ↓
Use Cases (Create · Update · Delete · GetTasks)
   ↓
TaskRepository (contrato)
   ↓
InMemoryTaskRepository (implementación)
```

## Tecnologías

| Tecnología     | Uso                                |
| -------------- | ---------------------------------- |
| Angular 20     | Framework de aplicación            |
| Ionic 8        | Componentes UI y experiencia móvil |
| TypeScript     | Lenguaje principal                 |
| SCSS           | Estilos con Design Tokens          |
| Reactive Forms | Formulario de creación/edición     |
| Jasmine        | Framework de testing               |
| Karma          | Test runner                        |

## Calidad

El proyecto mantiene estándares de calidad en cada cambio:

- **Prettier** — formato de código consistente.
- **ESLint** — análisis estático con reglas de Angular ESLint.
- **Strict TypeScript** — `strict: true` y opciones estrictas del compilador de Angular.
- **Unit Testing** — 96 tests unitarios en dominio, datos, presentación y componentes compartidos.

El script `npm run check` ejecuta el pipeline completo de validación antes de integrar cambios.

## Estructura del proyecto

```
src/app/
├── features/
│   └── tasks/
│       ├── data/
│       │   ├── datasources/
│       │   └── repositories/
│       │       └── in-memory-task.repository.ts
│       ├── domain/
│       │   ├── commands/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── use-cases/
│       ├── pages/
│       │   └── task-list/
│       ├── presentation/
│       │   ├── components/
│       │   │   ├── task-card/
│       │   │   └── task-form/
│       │   ├── facades/
│       │   ├── mappers/
│       │   ├── models/
│       │   └── state/
│       ├── tasks.module.ts
│       └── tasks.providers.ts
└── shared/
    ├── components/
    │   ├── category-filter/
    │   ├── empty-state/
    │   ├── floating-action-button/
    │   ├── page-header/
    │   └── search-bar/
    └── models/

src/theme/
└── variables.scss

docs/
├── architecture/
├── adr/
└── roadmap.md
```

## Scripts disponibles

| Script          | Descripción                                                             |
| --------------- | ----------------------------------------------------------------------- |
| `npm start`     | Inicia el servidor de desarrollo en `http://localhost:4200`.            |
| `npm test`      | Ejecuta los tests unitarios en modo interactivo con recarga automática. |
| `npm run check` | Pipeline completo: formato, lint, typecheck, tests en CI y build.       |
| `npm run build` | Compila la aplicación para producción en el directorio `www/`.          |

Otros scripts útiles:

- `npm run lint` — ejecuta ESLint.
- `npm run format` — aplica Prettier a todo el proyecto.
- `npm run typecheck` — verifica tipos con TypeScript sin emitir archivos.

## Cómo ejecutar

### Requisitos

- Node.js >= 20
- npm >= 10

### Instalación

```bash
git clone <url-del-repositorio>
cd ionic-task-manager
npm install
```

### Desarrollo

```bash
npm start
```

Abre `http://localhost:4200` en el navegador. La aplicación se recarga automáticamente al detectar cambios en el código fuente.

### Verificación

```bash
npm run check
```

## Documentación

La documentación técnica del proyecto vive en `docs/`:

| Ruta                 | Contenido                                                             |
| -------------------- | --------------------------------------------------------------------- |
| `docs/`              | Raíz de la documentación del proyecto.                                |
| `docs/architecture/` | Diagramas y decisiones de alto nivel sobre la arquitectura.           |
| `docs/adr/`          | Architecture Decision Records (ADRs) que documentan decisiones clave. |
| `docs/roadmap.md`    | Planificación por sprints y evolución prevista del producto.          |
| `CHANGELOG.md`       | Historial de cambios por versión.                                     |

Recursos disponibles:

- [ADR-001: Angular Dependency Injection dentro del Dominio](docs/adr/ADR-001-angular-di-in-domain.md)
- [Roadmap del proyecto](docs/roadmap.md)
- [Changelog](CHANGELOG.md)

## Estado del proyecto

Versión estable: **v1.0.0**

Sprint 5 finalizado. El proyecto cuenta con CRUD completo, búsqueda, filtros, componentes reutilizables, facade, clean architecture, accesibilidad, polish visual y documentación técnica. La persistencia actual es in-memory; la evolución hacia Firebase, offline y autenticación está planificada en el Sprint 6.

Consulta las [notas de release v1.0.0](docs/RELEASE-v1.0.0.md) para el resumen técnico completo.

## Autor

**Dervis Gómez**

- Web: [dervisgomez.dev](https://dervisgomez.dev/)
