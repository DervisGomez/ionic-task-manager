# Roadmap

Este documento resume la evolución del proyecto por sprints.

## Sprints completados

| Sprint   | Objetivo                                                                                                                                                             | Estado     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Sprint 1 | Inicializar la base del proyecto con Angular + Ionic, routing principal y estructura modular inicial.                                                                | Completado |
| Sprint 2 | Definir la arquitectura de la feature `tasks` con enfoque Clean Architecture: entidades, comandos, casos de uso, contrato de repositorio e implementación in-memory. | Completado |
| Sprint 3 | Construir la capa de presentación de `tasks` con listado, formulario de creación, `TaskFacade`, componentes compartidos y base visual con design tokens.             | Completado |
| Sprint 4 | Consolidar la documentación técnica del proyecto: índice general, arquitectura, flujo de dependencias, estructura de carpetas, decisiones de diseño y ADR.           | Completado |
| Sprint 5 | Completar CRUD, búsqueda, filtros, retroalimentación visual, accesibilidad, polish visual, calidad de código y documentación final (versión 1.0.0).                  | Completado |

## Próxima etapa — Sprint 6

| Área              | Descripción                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| Firebase          | Integración con Firebase como backend de datos.                                        |
| Persistencia real | Reemplazar `InMemoryTaskRepository` por un repositorio con almacenamiento persistente. |
| Offline           | Soporte de modo offline con sincronización diferida.                                   |
| Autenticación     | Flujo de login/registro y protección de rutas.                                         |
| Sincronización    | Sincronización bidireccional entre dispositivo y nube.                                 |

### Consideraciones técnicas

- El contrato `TaskRepository` en el dominio no requiere cambios; solo se sustituye la implementación en la capa `data`.
- Los casos de uso y el facade permanecen estables gracias a la inversión de dependencias.
- La capa de presentación consumirá los mismos facades; los cambios se concentran en infraestructura y autenticación.
