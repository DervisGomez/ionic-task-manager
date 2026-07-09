# Changelog

Todos los cambios importantes de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] — v1.0.0 (2026-07-08)

### Added

- CRUD completo de tareas: crear, leer, editar y eliminar desde la interfaz.
- `TaskCardComponent` con checkbox de completado, acciones de edición y eliminación.
- Búsqueda en tiempo real por título y descripción.
- Filtrado por categoría con navegación por teclado (patrón tablist).
- `TaskMapper` y `TaskViewModel` para adaptar entidades del dominio a la UI.
- Retroalimentación visual con `IonToast` tras operaciones exitosas o fallidas.
- Confirmación de eliminación mediante `IonAlert`.
- Modal de creación/edición con `IonModal` y `aria-labelledby`.
- Mejoras de accesibilidad WCAG 2.2 AA: ARIA labels contextuales, foco visible, formulario accesible.
- Polish visual con Design Tokens: jerarquía tipográfica, transiciones y sombras.
- Consolidación de Design Tokens de tipografía en `variables.scss`.
- Documentación técnica actualizada: README, arquitectura, roadmap y changelog.

### Changed

- `TaskFacade` ampliado con operaciones de actualización, eliminación, búsqueda y filtrado.
- `TaskFormComponent` reutilizado para creación y edición de tareas.
- Estructura de presentación ampliada con `task-card`, `mappers` y `models`.

## [0.4.0]

### Added

- Presentation Layer para la feature de tareas.
- `TaskFacade` como punto de entrada entre la UI y los casos de uso.
- Flujo funcional de creación de tareas desde formulario hasta persistencia in-memory.

## [0.3.0]

### Added

- Capa de dominio con entidades y comandos de tareas.
- Repository Pattern mediante contrato de repositorio y su implementación concreta.
- Use Cases para operaciones principales de negocio.
- Composición de dependencias con Dependency Injection para conectar dominio e infraestructura.

## [0.2.0]

### Added

- Componentes reutilizables de interfaz en la capa `shared`.
- Módulo compartido para reutilización consistente de componentes UI.

## [0.1.0]

### Added

- Inicialización del proyecto con Angular + Ionic.
- Base del Design System con tokens visuales y estilos globales.
