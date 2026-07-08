# Changelog

Todos los cambios importantes de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

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
