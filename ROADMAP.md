# Roadmap

Evolución del proyecto organizada por sprints. Cada sprint agrupa entregas coherentes hacia una aplicación de gestión de tareas production-ready.

---

## Sprints completados

### Sprint 1 — Fundación

**Estado:** Completado

- Inicialización del proyecto con Angular 20 + Ionic 8.
- Routing principal y estructura modular por features.
- Configuración base de TypeScript estricto, ESLint y Prettier.
- Design tokens iniciales y estilos globales.

### Sprint 2 — Dominio

**Estado:** Completado

- Entidades `Task` y `Category`.
- Comandos `CreateTaskCommand` y `UpdateTaskCommand`.
- Casos de uso: `GetTasks`, `CreateTask`, `UpdateTask`, `DeleteTask`.
- Contrato `TaskRepository` e implementación `InMemoryTaskRepository`.
- Composition root en `tasks.providers.ts`.

### Sprint 3 — Presentación

**Estado:** Completado

- `TaskListComponent` como pantalla principal.
- `TaskFormComponent` con Reactive Forms.
- `TaskFacade` como orquestador de la UI.
- Componentes compartidos: `PageHeader`, `SearchBar`, `CategoryFilter`, `EmptyState`, `FAB`.
- `SharedModule` para reutilización transversal.

### Sprint 4 — Documentación técnica

**Estado:** Completado

- Documentación de arquitectura: capas, flujo de dependencias, estructura de carpetas.
- ADR-001: Angular Dependency Injection en el dominio.
- Índice de documentación en `docs/`.
- Changelog y notas de release.

### Sprint 5 — Funcionalidad completa

**Estado:** Completado

- CRUD completo desde la interfaz.
- `TaskCardComponent` con acciones de edición, eliminación y completado.
- Búsqueda en tiempo real y filtrado por categoría.
- `TaskMapper` y `TaskViewModel`.
- Retroalimentación con `IonToast` y `IonAlert`.
- Ampliación de tests unitarios y pipeline `npm run check`.

### Sprint 6 — Experiencia y sistema visual

**Estado:** Completado

- Design System consolidado en `src/theme/` (colores, spacing, tipografía, elevación, radius, motion).
- Motion System con transiciones tokenizadas y `prefers-reduced-motion`.
- Layout responsive mobile first (`768px`, `1024px`).
- Auditoría de accesibilidad orientada a WCAG 2.2 AA (cobertura parcial; ver `docs/accessibility.md`).
- Documentación: `docs/design-system.md`, `docs/accessibility.md`.
- Catálogo centralizado de categorías en `features/tasks/shared/catalogs/`.
- Validación obligatoria de categoría en `TaskFormComponent`.
- **117 tests unitarios.**

---

## Próxima etapa — Sprint 7

**Estado:** Planificado

| Área                     | Descripción                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Firestore**            | Backend de datos en la nube como fuente de persistencia real.                     |
| **DTO**                  | Capa de transferencia entre dominio y fuentes externas, desacoplada de entidades. |
| **Offline**              | Operación sin conexión con cola de operaciones pendientes.                        |
| **Categorías dinámicas** | Gestión de categorías como entidad configurable, no hardcodeada.                  |
| **Sincronización**       | Reconciliación bidireccional entre dispositivo local y nube.                      |
| **Observabilidad**       | Logging estructurado, métricas y trazabilidad de errores en producción.           |

### Consideraciones técnicas

- El contrato `TaskRepository` en el dominio permanece estable; se sustituye la implementación en `data/`.
- Los casos de uso y el facade no requieren cambios estructurales gracias a la inversión de dependencias.
- La carpeta `datasources/` está preparada para alojar adaptadores Firestore u otras fuentes.
- Los cambios de UI se concentran en nuevos módulos (p. ej. gestión de categorías) reutilizando el Design System existente.

---

## Visión a largo plazo

Tras el Sprint 7, las líneas de evolución previstas incluyen:

- Autenticación y rutas protegidas.
- Módulos adicionales: Dashboard, Usuarios, Configuración.
- Despliegue nativo con Capacitor (iOS / Android).
