# Capas

El proyecto organiza cada feature en cuatro capas con responsabilidades bien definidas. Las dependencias fluyen hacia el interior: la capa más externa depende de las internas, nunca al revés.

```
Presentation
     ↓
  Domain
     ↓
Repository
     ↓
   Data
```

## Presentation

**Responsabilidad**

Interactuar con el usuario. Incluye páginas, componentes de UI, facades y el estado de pantalla. Orquesta las acciones del usuario delegando operaciones CRUD al dominio y reflejando el resultado en la interfaz. Las validaciones de formulario (título, categoría, longitudes) viven en esta capa.

**Qué puede conocer**

- Casos de uso del dominio.
- Entidades y comandos del dominio necesarios para invocar operaciones.
- Su propio estado de presentación (carga, errores, datos mostrados en pantalla).
- Componentes compartidos de `shared` para construir la interfaz.

**Qué NO puede conocer**

- Implementaciones concretas de repositorios.
- Detalles de persistencia, APIs o almacenamiento.
- La capa `data` ni sus clases de infraestructura.

## Domain

**Responsabilidad**

Definir tipos, comandos y casos de uso que orquestan operaciones CRUD sobre tareas. Los casos de uso ensamblan la entidad `Task` y delegan la persistencia al repositorio; no aplican validaciones de entrada ni invariantes de negocio.

**Qué puede conocer**

- Sus propias entidades, comandos y casos de uso.
- Los contratos de repositorio como abstracciones, sin conocer cómo se implementan.
- Otras piezas del propio dominio dentro de la misma feature.

**Qué NO puede conocer**

- Componentes, páginas ni detalles de la interfaz de usuario.
- Implementaciones concretas de persistencia.
- Frameworks de presentación más allá del acoplamiento mínimo aceptado para inyección de dependencias (ver ADR-001).

## Repository

**Responsabilidad**

Definir los contratos de acceso a datos que el dominio necesita. Actúa como puerto entre los casos de uso y la infraestructura: expone operaciones abstractas (obtener, crear, actualizar, eliminar) sin especificar dónde ni cómo se almacenan los datos.

En el proyecto, estos contratos viven dentro del dominio (por ejemplo, `TaskRepository`) y las implementaciones concretas se registran en el composition root de la feature.

**Qué puede conocer**

- Entidades del dominio que manipula.
- La firma de las operaciones que el dominio requiere sobre esos datos.

**Qué NO puede conocer**

- Cómo se persisten los datos en memoria, en una API o en un almacenamiento local.
- Componentes de UI, facades o estado de pantalla.
- Detalles de implementación de la capa `data`.

## Data

**Responsabilidad**

Implementar los contratos de repositorio y gestionar el acceso real a los datos. Traduce las operaciones del dominio en llamadas concretas de persistencia. En el estado actual del proyecto, incluye implementaciones in-memory y la carpeta `datasources` preparada para futuras fuentes de datos.

**Qué puede conocer**

- Los contratos de repositorio definidos en el dominio.
- Las entidades del dominio que persiste.
- Mecanismos de infraestructura propios de su capa (almacenamiento en memoria, clientes HTTP, almacenamiento local, etc.).

**Qué NO puede conocer**

- Componentes, páginas, facades ni estado de presentación.
- Casos de uso ni lógica de validación de formularios.
- Cómo la UI consume o muestra los datos.

## Dirección de las dependencias

Las dependencias siempre apuntan hacia el dominio porque este define los contratos y operaciones centrales de la feature, sin depender de detalles de UI o persistencia.

Si la presentación dependiera directamente de `data`, cualquier cambio en cómo se persisten los datos — pasar de memoria a una API, por ejemplo — obligaría a modificar la UI. Si `data` dependiera de la presentación, la infraestructura quedaría acoplada a detalles visuales que no le corresponden.

Al invertir las dependencias mediante contratos de repositorio en el dominio, las capas externas dependen de abstracciones definidas en el núcleo. La capa `data` implementa esos contratos, pero el dominio nunca importa implementaciones concretas. El composition root de cada feature es el único lugar donde se conecta un contrato con su implementación.

Este diseño permite sustituir la infraestructura, probar los casos de uso con dobles de repositorio y evolucionar la interfaz sin modificar el contrato del dominio.
