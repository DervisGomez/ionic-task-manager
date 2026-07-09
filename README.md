# Ionic Task Manager

**v1.0.0** · Angular 20 · Ionic 8 · Clean Architecture · 117 tests · [`npm run check`](#inicio-rápido)

Aplicación de gestión de tareas **mobile first** que resuelve el ciclo de vida completo de una tarea — crear, buscar, filtrar, completar, editar y eliminar — sin acoplar la UI a la persistencia.

Referencia de arquitectura frontend en apps híbridas: dominio explícito, capas separadas, decisiones documentadas en ADR y pipeline de calidad automatizado.

---

## Tabla de contenidos

- [En 60 segundos](#en-60-segundos)
- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Funcionalidades](#funcionalidades)
- [Inicio rápido](#inicio-rápido)
- [Calidad](#calidad)
- [Documentación](#documentación)
- [Roadmap](#roadmap)
- [Autor](#autor)

---

## En 60 segundos

### Qué problema resuelve

Organizar tareas personales y laborales con categorías (Trabajo / Personal), búsqueda en tiempo real y feedback claro en cada operación — desde una interfaz usable en móvil y escritorio.

### Por qué está bien diseñado

| Principio                      | Cómo se aplica                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Separación de capas            | La UI nunca accede al repositorio; todo pasa por `TaskFacade` → casos de uso → `TaskRepository` |
| Organización por feature       | `features/tasks/` agrupa dominio, datos y presentación en un solo contexto                      |
| UI desacoplada del dominio     | `TaskViewModel` + `TaskMapper` adaptan entidades a la pantalla sin contaminar el modelo         |
| Infraestructura intercambiable | `InMemoryTaskRepository` hoy; `datasources/` preparado para API o Firestore                     |
| Consistencia visual            | Design System tokenizado en `src/theme/` — sin valores arbitrarios en componentes               |

### Decisiones técnicas clave

- **[ADR-001](docs/adr/ADR-001-angular-di-in-domain.md)** — Angular DI en casos de uso del dominio como compromiso pragmático que preserva la separación de capas.
- **Composition Root** — `tasks.providers.ts` conecta contrato e implementación; la presentación depende de use cases, no de data.
- **Catálogo centralizado** — `task-categories.catalog.ts` como única fuente de verdad para labels y filtros.
- **Accesibilidad orientada a WCAG 2.2 AA** — ARIA, foco visible, teclado y `prefers-reduced-motion` ([detalle](docs/accessibility.md)).
- **TypeScript estricto** — `strict: true` y plantillas estrictas en todo el proyecto.

### Por qué demuestra nivel Senior

- Arquitectura **documentada y justificada** — no solo carpetas bonitas: [arquitectura](docs/architecture/architecture.md), [flujos](docs/architecture/dependency-flow.md), [ADR](docs/adr/).
- **117 tests unitarios** en dominio, datos, presentación y shared — con pipeline `npm run check` listo para CI.
- Patrones reconocibles aplicados con criterio: Repository, Use Cases, Facade, ViewModel, Composition Root.
- Design System y Motion System con tokens reutilizables — [design-system.md](docs/design-system.md).
- Trade-offs explícitos: dominio anémico, persistencia in-memory en v1.0.0, cobertura de accesibilidad parcial.

> **Capturas / GIF:** no incluidos en el repositorio. Ejecuta `npm start` y abre `http://localhost:4200` para ver la UI.

---

## Stack

| Tecnología        | Versión / rol                                             |
| ----------------- | --------------------------------------------------------- |
| Angular           | 20 — framework, routing lazy, Reactive Forms              |
| Ionic             | 8 — componentes UI e experiencia móvil                    |
| TypeScript        | 5.9 — tipado estricto                                     |
| SCSS              | Design System con CSS custom properties                   |
| Capacitor         | 8 — base para despliegue nativo (dependencias instaladas) |
| Jasmine + Karma   | 117 tests unitarios                                       |
| ESLint + Prettier | Lint y formato automatizado                               |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                           │
│  Pages · Components · ViewModels · Mappers · State          │
│                          │                                  │
│                          ▼                                  │
│                       FACADE                                │
│              TaskFacade (orquestación + filtros)            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        USE CASES                            │
│   GetTasks · CreateTask · UpdateTask · DeleteTask           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORIES                           │
│           TaskRepository (contrato en dominio)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                            │
│        datasources/ (preparado para futuras fuentes)        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                           │
│         InMemoryTaskRepository (implementación actual)      │
└─────────────────────────────────────────────────────────────┘
```

| Capa               | Responsabilidad                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| **Presentation**   | Páginas, componentes, facade, mappers y estado de pantalla              |
| **Facade**         | Orquesta casos de uso, aplica búsqueda/filtros, expone `TaskViewModel`  |
| **Use Cases**      | Operaciones CRUD; ensamblan entidades y delegan al repositorio          |
| **Repositories**   | Contrato abstracto que el dominio consume sin conocer la implementación |
| **Infrastructure** | `InMemoryTaskRepository` — persistencia en memoria actual               |

Profundizar: [architecture.md](docs/architecture/architecture.md) · [capas](docs/architecture/layers.md) · [estructura de carpetas](docs/architecture/folder-structure.md) · [decisiones de diseño](docs/architecture/design-decisions.md)

---

## Funcionalidades

**Gestión de tareas**

- CRUD completo (crear, leer, editar, eliminar)
- Búsqueda en tiempo real por título y descripción
- Filtro por categorías (Todas, Trabajo, Personal)
- Marcado de tareas como completadas
- Estado vacío con llamada a la acción
- Retroalimentación con `IonToast` y confirmación con `IonAlert`
- Persistencia in-memory mediante `InMemoryTaskRepository`

**Arquitectura y UI**

- Clean Architecture por feature · Repository · Use Cases · Facade · ViewModel · Mapper
- Design System tokenizado · Motion System con `prefers-reduced-motion`
- Responsive mobile first (`768px`, `1024px`)
- Shared components: `PageHeader`, `SearchBar`, `CategoryFilter`, `EmptyState`, `FAB`

---

## Inicio rápido

**Requisitos:** Node.js ≥ 20 · npm ≥ 10

```bash
git clone <url-del-repositorio>
cd ionic-task-manager
npm install
npm start          # http://localhost:4200
npm run check      # pipeline completo antes de un PR o release
```

| Script              | Descripción                                     |
| ------------------- | ----------------------------------------------- |
| `npm start`         | Servidor de desarrollo                          |
| `npm run build`     | Build de producción en `www/`                   |
| `npm test`          | Tests interactivos (Karma + watch)              |
| `npm run test:ci`   | 117 tests en `ChromeHeadless`                   |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | `tsc --noEmit`                                  |
| `npm run check`     | **format → lint → typecheck → test:ci → build** |

---

## Calidad

| Métrica  | Detalle                                                            |
| -------- | ------------------------------------------------------------------ |
| Tests    | 117 pruebas — dominio, datos, facade, mapper, componentes y shared |
| Lint     | Angular ESLint sin incidencias                                     |
| Tipos    | TypeScript estricto + plantillas estrictas                         |
| Formato  | Prettier en todo el proyecto                                       |
| CI local | `npm run check` — comando recomendado pre-merge                    |

Guía de testing: [docs/testing.md](docs/testing.md)

---

## Documentación

| Recurso                                                                              | Contenido                                    |
| ------------------------------------------------------------------------------------ | -------------------------------------------- |
| [docs/README.md](docs/README.md)                                                     | **Índice completo** de documentación técnica |
| [docs/architecture/architecture.md](docs/architecture/architecture.md)               | Arquitectura consolidada                     |
| [docs/architecture/dependency-flow.md](docs/architecture/dependency-flow.md)         | Flujos por operación                         |
| [docs/design-system.md](docs/design-system.md)                                       | Tokens, componentes y motion                 |
| [docs/accessibility.md](docs/accessibility.md)                                       | Mejoras orientadas a WCAG 2.2 AA             |
| [docs/adr/ADR-001-angular-di-in-domain.md](docs/adr/ADR-001-angular-di-in-domain.md) | Angular DI en dominio                        |
| [docs/RELEASE-v1.0.0.md](docs/RELEASE-v1.0.0.md)                                     | Notas técnicas del release                   |
| [docs/contributing.md](docs/contributing.md)                                         | Guía para colaboradores                      |
| [docs/releases.md](docs/releases.md)                                                 | Proceso de publicación                       |
| [CHANGELOG.md](CHANGELOG.md)                                                         | Historial de cambios                         |
| [ROADMAP.md](ROADMAP.md)                                                             | Planificación por sprints                    |

---

## Roadmap

| Sprint | Estado     | Resumen                                                                                       |
| ------ | ---------- | --------------------------------------------------------------------------------------------- |
| 1–6    | Completado | Fundación, dominio, UI, documentación, CRUD, Design System, motion, responsive, accesibilidad |
| **7**  | Próximo    | Firestore, DTO, offline, categorías dinámicas, sincronización, observabilidad                 |

Detalle: [ROADMAP.md](ROADMAP.md)

---

## Autor

**Dervis Gómez** — [dervisgomez.dev](https://dervisgomez.dev/)
