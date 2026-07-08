# Ionic Task Manager

Aplicación de gestión de tareas construida con **Angular** e **Ionic**, diseñada con **Clean Architecture** y **DDD** para mantener una separación clara entre dominio, presentación e infraestructura.

El proyecto prioriza legibilidad, testabilidad y escalabilidad, sirviendo como referencia de arquitectura en aplicaciones móviles híbridas.

## Características

Funcionalidades implementadas actualmente:

- **Listado de tareas** con carga automática al iniciar la pantalla.
- **Creación de tareas** mediante un formulario reactivo reutilizable (`TaskFormComponent`).
- **Estado vacío** cuando no existen tareas registradas.
- **Gestión de estado de pantalla** (`tasks`, `loading`, `error`) a través de `TaskFacade`.
- **Interfaz de listado** con cabecera, barra de búsqueda y filtro por categoría.
- **Componentes compartidos** reutilizables: cabecera, búsqueda, filtros, estado vacío y botón flotante.
- **Capa de dominio** con entidades, comandos, casos de uso y contrato de repositorio.
- **Persistencia in-memory** mediante `InMemoryTaskRepository`.
- **Cobertura de tests unitarios** en dominio, repositorio, formulario y componentes de presentación.

## Arquitectura

El módulo `Tasks` organiza el código en capas con responsabilidades bien definidas:

### Clean Architecture

Separa el dominio de los detalles de framework e infraestructura. La UI no accede directamente al repositorio ni a la capa de datos; toda la orquestación pasa por la capa de presentación.

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

`TaskFacade` actúa como punto de entrada entre la UI y el dominio. Los componentes dependen solo del facade, que orquesta los casos de uso y expone el estado de la pantalla.

```
UI (TaskListComponent)
        ↓
TaskFacade
        ↓
Use Cases
        ↓
TaskRepository (contrato)
        ↓
InMemoryTaskRepository (implementación)
```

## Tecnologías

| Tecnología     | Uso                                |
| -------------- | ---------------------------------- |
| Angular        | Framework de aplicación            |
| Ionic          | Componentes UI y experiencia móvil |
| TypeScript     | Lenguaje principal                 |
| SCSS           | Estilos                            |
| Reactive Forms | Formulario de creación de tareas   |
| Jasmine        | Framework de testing               |
| Karma          | Test runner                        |

## Calidad

El proyecto mantiene estándares de calidad en cada cambio:

- **Prettier** — formato de código consistente.
- **ESLint** — análisis estático con reglas de Angular ESLint.
- **Strict TypeScript** — `strict: true` y opciones estrictas del compilador de Angular.
- **Unit Testing** — tests unitarios en dominio, datos y presentación.

El script `npm run check` ejecuta el pipeline completo de validación antes de integrar cambios.

## Estructura del proyecto

```
src/app/
├── features/
│   └── tasks/
│       ├── data/
│       │   ├── datasources/
│       │   └── repositories/
│       ├── domain/
│       │   ├── commands/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── use-cases/
│       ├── pages/
│       │   └── task-list/
│       ├── presentation/
│       │   ├── components/
│       │   │   └── task-form/
│       │   ├── facades/
│       │   ├── mappers/
│       │   └── state/
│       ├── tasks.module.ts
│       └── tasks.providers.ts
└── shared/
    ├── components/
    └── models/

docs/
└── adr/
    └── ADR-001-angular-di-in-domain.md
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

## Documentación

La documentación técnica del proyecto vive en `docs/`:

| Ruta                 | Contenido                                                             |
| -------------------- | --------------------------------------------------------------------- |
| `docs/`              | Raíz de la documentación del proyecto.                                |
| `docs/architecture/` | Diagramas y decisiones de alto nivel sobre la arquitectura.           |
| `docs/adr/`          | Architecture Decision Records (ADRs) que documentan decisiones clave. |
| `docs/roadmap`       | Planificación por sprints y evolución prevista del producto.          |

Actualmente disponible:

- [ADR-001: Angular Dependency Injection dentro del Dominio](docs/adr/ADR-001-angular-di-in-domain.md)

## Estado del proyecto

El proyecto se encuentra **en desarrollo activo**, siguiendo una planificación por sprints. Las funcionalidades de lectura y creación de tareas están integradas en la UI; la edición, eliminación, filtrado funcional y persistencia remota forman parte del roadmap.

## Autor

**Dervis Gómez**

- Web: [dervisgomez.dev](https://dervisgomez.dev/)
