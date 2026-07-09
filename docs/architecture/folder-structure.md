# Estructura de carpetas

La organización del proyecto sigue una estructura **por feature**. Esto significa que cada funcionalidad agrupa en un mismo lugar su dominio, su presentación, su acceso a datos y su configuración de módulo, en lugar de dispersar archivos similares por toda la aplicación.

Este enfoque mejora la cohesión, facilita el mantenimiento y permite entender una funcionalidad completa sin recorrer múltiples carpetas técnicas separadas.

## Árbol simplificado

```text
src/app/
├── app.module.ts
├── app-routing.module.ts
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
│       ├── tasks-routing-module.ts
│       ├── tasks.providers.ts
│       └── tasks.module.ts
└── shared/
    ├── components/
    │   ├── category-filter/
    │   ├── empty-state/
    │   ├── floating-action-button/
    │   ├── page-header/
    │   └── search-bar/
    ├── models/
    └── shared.module.ts

src/theme/
└── variables.scss
```

## Carpetas principales

### `core/`

En una aplicación Angular empresarial, `core/` es la carpeta adecuada para piezas globales de la aplicación que deben existir una sola vez y no pertenecen a una feature concreta.

Aquí debería ir código como:

- servicios singleton de alcance global
- configuración transversal de la aplicación
- interceptores, guards o adaptadores compartidos a nivel app
- inicialización de infraestructura común

No debería ir en `core/`:

- componentes reutilizables de UI
- lógica de una feature específica
- modelos o utilidades exclusivas de una sola funcionalidad

En el estado actual del proyecto, esta carpeta **no está presente**. La documentación la incluye como referencia arquitectónica para indicar cuándo tendría sentido incorporarla.

### `shared/`

`shared/` contiene piezas reutilizables por varias pantallas o features, especialmente elementos de interfaz y modelos simples compartidos.

Componentes actuales:

| Componente                      | Responsabilidad                           |
| ------------------------------- | ----------------------------------------- |
| `PageHeaderComponent`           | Cabecera de página con título y subtítulo |
| `SearchBarComponent`            | Campo de búsqueda con debounce            |
| `CategoryFilterComponent`       | Filtro por categoría con patrón tablist   |
| `EmptyStateComponent`           | Estado vacío con icono, texto y CTA       |
| `FloatingActionButtonComponent` | Botón flotante de acción principal        |

No debería ir en `shared/`:

- lógica de negocio del dominio
- casos de uso
- repositorios
- componentes o estados acoplados a una feature específica

### `features/`

`features/` es el núcleo de la organización funcional del proyecto. Cada carpeta dentro de `features/` representa una capacidad de negocio o módulo funcional autónomo.

En el proyecto actual, `tasks/` es la feature implementada y contiene todos los elementos necesarios para operar esa funcionalidad de forma cohesionada.

## Estructura interna de una feature

### `domain/`

`domain/` contiene el núcleo de negocio de la feature.

Contenido actual:

- **Entidades**: `Task`, `Category`
- **Comandos**: `CreateTaskCommand`, `UpdateTaskCommand`
- **Contratos**: `TaskRepository`
- **Casos de uso**: `GetTasksUseCase`, `CreateTaskUseCase`, `UpdateTaskUseCase`, `DeleteTaskUseCase`

No debe ir:

- componentes Angular de UI
- detalles de persistencia
- implementaciones concretas de infraestructura

### `data/`

`data/` implementa el acceso real a los datos definidos por el dominio.

Contenido actual:

- `InMemoryTaskRepository` — implementación in-memory del contrato `TaskRepository`
- `datasources/` — preparada para futuras fuentes de datos (Firebase, API, etc.)

### `presentation/`

`presentation/` contiene las piezas que conectan la UI con el dominio.

Contenido actual:

| Carpeta / archivo          | Responsabilidad                                       |
| -------------------------- | ----------------------------------------------------- |
| `components/task-form/`    | Formulario reactivo de creación/edición               |
| `components/task-card/`    | Tarjeta de tarea con acciones                         |
| `facades/task.facade.ts`   | Orquestación de casos de uso y estado de pantalla     |
| `mappers/task.mapper.ts`   | Adaptación de entidades del dominio a `TaskViewModel` |
| `models/task.viewmodel.ts` | Modelo de datos orientado a la UI                     |
| `state/task.state.ts`      | Interfaz del estado interno del facade                |

### `pages/`

`pages/` aloja los componentes de página que actúan como contenedores de la feature.

Contenido actual:

- `task-list/` — pantalla principal con listado, búsqueda, filtros, modal y toast

## Por qué la arquitectura está organizada por feature

Organizar la aplicación por feature evita dispersar una misma funcionalidad en carpetas horizontales como `components/`, `services/`, `models/` o `repositories/` a nivel global. En una base de código empresarial, esa dispersión hace más difícil entender el alcance de un cambio y aumenta el acoplamiento entre módulos.

Con una estructura por feature:

- cada funcionalidad vive agrupada en un único contexto
- el impacto de un cambio es más fácil de localizar
- la navegación del proyecto resulta más clara
- la escalabilidad mejora al incorporar nuevas capacidades sin mezclar responsabilidades

Además, este enfoque encaja mejor con Clean Architecture porque cada feature puede contener sus propias capas (`domain`, `data`, `presentation`) sin depender de una estructura global centrada en tipos de archivo.
