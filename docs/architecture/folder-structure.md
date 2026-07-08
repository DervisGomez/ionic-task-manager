# Estructura de carpetas

La organización del proyecto sigue una estructura **por feature**. Esto significa que cada funcionalidad agrupa en un mismo lugar su dominio, su presentación, su acceso a datos y su configuración de módulo, en lugar de dispersar archivos similares por toda la aplicación.

Este enfoque mejora la cohesión, facilita el mantenimiento y permite entender una funcionalidad completa sin recorrer múltiples carpetas técnicas separadas.

## Árbol simplificado

```text
src/app/
├── app.module.ts
├── app-routing.module.ts
├── features/
│   └── tasks/
│       ├── data/
│       │   ├── datasources/
│       │   └── repositories/
│       ├── domain/
│       │   ├── commands/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── use-cases/
│       ├── pages/
│       ├── presentation/
│       │   ├── components/
│       │   ├── facades/
│       │   ├── services/
│       │   └── state/
│       ├── tasks-routing-module.ts
│       ├── tasks.providers.ts
│       └── tasks.module.ts
└── shared/
    ├── components/
    ├── models/
    └── shared.module.ts
```

## Carpetas principales

### `core/`

En una aplicación Angular empresarial, `core/` es la carpeta adecuada para piezas globales de la aplicación que deben existir una sola vez y no pertenecen a una feature concreta.

Aquí debería ir código como:

- servicios singleton de alcance global
- configuración transversal de la aplicación
- interceptores, guards o adaptadores compartidos a nivel app
- inicialización de infraestructura común

No debería ir en `core/`:

- componentes reutilizables de UI
- lógica de una feature específica
- modelos o utilidades exclusivas de una sola funcionalidad

En el estado actual del proyecto, esta carpeta **no está presente**. La documentación la incluye como referencia arquitectónica para indicar cuándo tendría sentido incorporarla.

### `shared/`

`shared/` contiene piezas reutilizables por varias pantallas o features, especialmente elementos de interfaz y modelos simples compartidos.

Aquí debe ir código como:

- componentes visuales reutilizables
- modelos ligeros usados por más de una pantalla
- módulos compartidos que agrupan componentes reutilizables

No debería ir en `shared/`:

- lógica de negocio del dominio
- casos de uso
- repositorios
- componentes o estados acoplados a una feature específica

Si una pieza solo tiene sentido dentro de `tasks`, no debería vivir en `shared/`, aunque sea reutilizable dentro de esa misma feature.

### `features/`

`features/` es el núcleo de la organización funcional del proyecto. Cada carpeta dentro de `features/` representa una capacidad de negocio o módulo funcional autónomo.

Aquí debe ir código como:

- módulos funcionales completos
- rutas de la feature
- composición de dependencias propia de la feature
- sus capas internas de dominio, datos y presentación

No debería ir en `features/`:

- recursos completamente transversales a toda la aplicación
- infraestructura global ajena a una funcionalidad concreta

En el proyecto actual, `tasks/` es la feature implementada y contiene todos los elementos necesarios para operar esa funcionalidad de forma cohesionada.

## Estructura interna de una feature

### `domain/`

`domain/` contiene el núcleo de negocio de la feature.

Aquí debe ir:

- entidades del dominio
- comandos o estructuras de entrada del negocio
- contratos de repositorio
- casos de uso

No debe ir:

- componentes Angular de UI
- detalles de persistencia
- implementaciones concretas de infraestructura

Es la carpeta que debe permanecer más estable frente a cambios de interfaz o de almacenamiento.

### `data/`

`data/` implementa el acceso real a los datos definidos por el dominio.

Aquí debe ir:

- implementaciones concretas de repositorios
- datasources o mecanismos de acceso a almacenamiento
- adaptadores de infraestructura necesarios para persistir o recuperar datos

No debe ir:

- reglas de negocio
- estado de pantalla
- componentes o páginas

Su responsabilidad es técnica: resolver cómo se guardan o leen los datos sin alterar la lógica del dominio.

### `presentation/`

`presentation/` contiene las piezas que conectan la UI con el dominio.

Aquí debe ir:

- componentes de presentación propios de la feature
- facades que orquestan casos de uso
- estado de pantalla
- servicios orientados a la capa de presentación

No debe ir:

- persistencia concreta
- contratos de infraestructura
- lógica de negocio que pertenezca al dominio

Su función es adaptar las interacciones de usuario al lenguaje del dominio y exponer a la UI un estado listo para renderizar.

## Por qué la arquitectura está organizada por feature

Organizar la aplicación por feature evita dispersar una misma funcionalidad en carpetas horizontales como `components/`, `services/`, `models/` o `repositories/` a nivel global. En una base de código empresarial, esa dispersión hace más difícil entender el alcance de un cambio y aumenta el acoplamiento entre módulos.

Con una estructura por feature:

- cada funcionalidad vive agrupada en un único contexto
- el impacto de un cambio es más fácil de localizar
- la navegación del proyecto resulta más clara
- la escalabilidad mejora al incorporar nuevas capacidades sin mezclar responsabilidades

Además, este enfoque encaja mejor con Clean Architecture porque cada feature puede contener sus propias capas (`domain`, `data`, `presentation`) sin depender de una estructura global centrada en tipos de archivo.

En otras palabras, la pregunta principal deja de ser "¿qué tipo de archivo es?" y pasa a ser "¿a qué capacidad del negocio pertenece?". Esa decisión hace que la estructura del proyecto refleje mejor el problema que resuelve la aplicación.
