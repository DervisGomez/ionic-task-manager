# Documentación

Toda la documentación técnica del proyecto se encuentra en la carpeta `docs`. Desde aquí puedes orientarte y acceder a los distintos recursos que describen la arquitectura, las decisiones de diseño y la evolución del proyecto.

## Índice

### Architecture

Describe la arquitectura general del proyecto: capas, módulos, flujos de datos y convenciones que guían su organización.

### ADR

Architecture Decision Records. Documentan las decisiones importantes tomadas durante el desarrollo, incluyendo el contexto, las alternativas consideradas y las razones que motivaron la elección final.

### Roadmap

Contiene la evolución del proyecto organizada por sprints: objetivos planificados, entregas previstas y prioridades de cada iteración.

### Changelog

Registra los cambios importantes del proyecto: nuevas funcionalidades, correcciones, mejoras y cualquier modificación relevante entre versiones. Disponible en [`CHANGELOG.md`](../CHANGELOG.md) en la raíz del repositorio.

## Estructura

```
docs/
├── README.md
├── architecture/
│   ├── README.md
│   ├── layers.md
│   ├── dependency-flow.md
│   ├── folder-structure.md
│   └── design-decisions.md
├── adr/
│   ├── README.md
│   └── ADR-001-angular-di-in-domain.md
└── roadmap.md

CHANGELOG.md          (raíz del repositorio)
README.md             (raíz del repositorio)
```

## Estado actual

Versión estable: **v1.0.0** — Sprint 5 finalizado.

El proyecto incluye CRUD completo, búsqueda, filtros, componentes reutilizables, facade, clean architecture, accesibilidad, polish visual y 96 tests unitarios.

- [Notas de release v1.0.0](RELEASE-v1.0.0.md)

## Objetivo de la documentación

La documentación busca facilitar:

- incorporación de nuevos desarrolladores
- mantenimiento
- comprensión de decisiones arquitectónicas
- evolución del proyecto
