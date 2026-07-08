# Arquitectura

El proyecto sigue los principios de **Clean Architecture** aplicados sobre **Angular** e **Ionic**. La organización por capas — dominio, datos y presentación — busca separar responsabilidades, invertir dependencias hacia el dominio y mantener la lógica de negocio independiente de los detalles de infraestructura y de la interfaz de usuario.

Cada funcionalidad se agrupa en una **feature** con su propia estructura interna. Los casos de uso encapsulan las reglas de negocio, los repositorios definen contratos en el dominio y las implementaciones concretas viven en la capa de datos. La presentación consume el dominio a través de facades, sin acceder directamente a la infraestructura.

## Documentos

### layers.md

Describe las capas del proyecto — dominio, datos y presentación — y la responsabilidad de cada una: entidades, casos de uso, contratos de repositorio, implementaciones de persistencia, estado de pantalla y componentes de UI.

### dependency-flow.md

Explica el sentido de las dependencias entre capas: hacia dónde apuntan las importaciones, cómo se invierten mediante contratos en el dominio y dónde se resuelven las implementaciones concretas.

### folder-structure.md

Detalla la organización de carpetas del código fuente: módulos de aplicación, features, capas internas de cada feature y recursos compartidos en `shared`.

### design-decisions.md

Recopila las decisiones de diseño arquitectónico adoptadas en el proyecto y enlaza con los ADR cuando corresponda, para contextualizar elecciones que no son evidentes solo leyendo la estructura de carpetas.

## Objetivo

Estos documentos permiten comprender cómo está construido el proyecto antes de leer el código: qué capa ocupa cada pieza, por qué están organizadas de esa forma y qué convenciones seguir al incorporar cambios.
