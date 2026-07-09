# Arquitectura

El proyecto sigue los principios de **Clean Architecture** aplicados sobre **Angular** e **Ionic**. La organización por capas — dominio, datos y presentación — busca separar responsabilidades, invertir dependencias hacia el dominio y mantener los casos de uso independientes de los detalles de infraestructura y de la interfaz de usuario.

## Documento principal

### [architecture.md](./architecture.md)

Documento consolidado que explica Clean Architecture, lenguaje de dominio, flujo de dependencias, Composition Root, Design System, Motion System, accesibilidad y estrategia de testing.

## Documentos complementarios

### [layers.md](./layers.md)

Describe las capas del proyecto — presentación, dominio, repositorio y datos — y la responsabilidad de cada una.

### [dependency-flow.md](./dependency-flow.md)

Explica el sentido de las dependencias entre capas y los flujos por operación (CRUD, búsqueda, filtrado).

### [folder-structure.md](./folder-structure.md)

Detalla la organización de carpetas del código fuente: módulos de aplicación, features, capas internas y recursos compartidos.

### [design-decisions.md](./design-decisions.md)

Recopila las decisiones de diseño arquitectónico adoptadas en el proyecto y enlaza con los ADR cuando corresponda.

## Objetivo

Estos documentos permiten comprender cómo está construido el proyecto antes de leer el código: qué capa ocupa cada pieza, por qué están organizadas de esa forma y qué convenciones seguir al incorporar cambios.
