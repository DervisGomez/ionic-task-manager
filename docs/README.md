# Documentación

Índice de la documentación técnica de **Ionic Task Manager**.

---

## Inicio rápido

| Recurso                         | Descripción                                          |
| ------------------------------- | ---------------------------------------------------- |
| [README.md](../README.md)       | Descripción, características, arquitectura y scripts |
| [ROADMAP.md](../ROADMAP.md)     | Planificación por sprints                            |
| [CHANGELOG.md](../CHANGELOG.md) | Historial de versiones                               |

---

## Arquitectura

| Documento                                                              | Contenido                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [architecture/architecture.md](./architecture/architecture.md)         | **Documento principal** — Clean Architecture, dominio, flujos, testing |
| [architecture/layers.md](./architecture/layers.md)                     | Responsabilidades por capa                                             |
| [architecture/dependency-flow.md](./architecture/dependency-flow.md)   | Flujos por operación                                                   |
| [architecture/folder-structure.md](./architecture/folder-structure.md) | Organización de carpetas                                               |
| [architecture/design-decisions.md](./architecture/design-decisions.md) | Decisiones de diseño                                                   |

---

## Diseño y experiencia

| Documento                              | Contenido                                            |
| -------------------------------------- | ---------------------------------------------------- |
| [design-system.md](./design-system.md) | Tokens, componentes y principios visuales            |
| [accessibility.md](./accessibility.md) | Mejoras orientadas a WCAG 2.2 AA (cobertura parcial) |

---

## Decisiones arquitectónicas

| Documento                                                                    | Contenido                              |
| ---------------------------------------------------------------------------- | -------------------------------------- |
| [adr/README.md](./adr/README.md)                                             | Qué es un ADR y registro de decisiones |
| [adr/ADR-001-angular-di-in-domain.md](./adr/ADR-001-angular-di-in-domain.md) | Angular DI en casos de uso del dominio |

---

## Contribución y calidad

| Documento                            | Contenido                            |
| ------------------------------------ | ------------------------------------ |
| [contributing.md](./contributing.md) | Convenciones, formato, lint, commits |
| [testing.md](./testing.md)           | Estrategia de pruebas (117 tests)    |
| [releases.md](./releases.md)         | Proceso de publicación de versiones  |

---

## Releases

| Documento                                | Contenido                          |
| ---------------------------------------- | ---------------------------------- |
| [RELEASE-v1.0.0.md](./RELEASE-v1.0.0.md) | Notas técnicas de la versión 1.0.0 |

---

## Estructura

```text
docs/
├── README.md
├── architecture/
│   ├── architecture.md      ← documento consolidado
│   ├── layers.md
│   ├── dependency-flow.md
│   ├── folder-structure.md
│   └── design-decisions.md
├── adr/
├── accessibility.md
├── design-system.md
├── contributing.md
├── testing.md
├── releases.md
├── RELEASE-v1.0.0.md
└── roadmap.md               → ver ROADMAP.md en raíz
```

---

## Estado actual

**Versión estable: v1.0.0** — Sprints 1–6 completados.

- CRUD, búsqueda, filtros, Design System, motion, responsive, accesibilidad
- Catálogo centralizado de categorías y validación obligatoria de categoría en formulario
- **117 tests unitarios**
- Persistencia in-memory; Sprint 7 planifica Firestore, offline y categorías dinámicas
