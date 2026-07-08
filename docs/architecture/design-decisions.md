# Decisiones de diseño (hasta Sprint 4)

Este documento resume las decisiones arquitectónicas principales adoptadas en el proyecto hasta el Sprint 4. Cada decisión incluye su contexto, la elección realizada y el beneficio obtenido en el estado actual del producto.

## ¿Por qué usamos Clean Architecture?

### Contexto

El proyecto necesita separar reglas de negocio, UI y acceso a datos para evitar acoplamientos directos entre componentes de pantalla y detalles de infraestructura.

### Decisión

Organizar cada feature en capas con responsabilidades claras: presentación, dominio y datos, utilizando contratos para aislar la lógica de negocio de las implementaciones concretas.

### Beneficio

Permite evolucionar la interfaz o la infraestructura sin reescribir el núcleo de negocio, facilita pruebas unitarias y reduce el impacto de cambios estructurales.

## ¿Por qué usamos DDD?

### Contexto

La funcionalidad de tareas requiere un lenguaje de negocio explícito para modelar conceptos como tarea, categoría y operaciones del dominio de forma consistente en todo el módulo.

### Decisión

Representar el negocio mediante entidades, comandos y casos de uso dentro de la feature, manteniendo el foco en el modelo del dominio y sus operaciones.

### Beneficio

Mejora la claridad del código, alinea la implementación con el lenguaje del problema y reduce ambiguedades al incorporar cambios funcionales.

## ¿Por qué usamos Repository Pattern?

### Contexto

Los casos de uso necesitan leer y persistir tareas sin depender de una tecnología concreta de almacenamiento.

### Decisión

Definir contratos de repositorio en el dominio y resolver su implementación concreta en la capa de datos mediante inyección de dependencias.

### Beneficio

Desacopla la lógica de negocio de la persistencia, facilita el reemplazo de implementación y simplifica las pruebas del dominio con dobles de repositorio.

## ¿Por qué usamos Use Cases?

### Contexto

Las acciones del usuario (crear, consultar, actualizar y eliminar tareas) requieren una capa que concentre reglas de negocio y evite distribuirlas entre componentes de UI.

### Decisión

Modelar cada operación principal como un caso de uso del dominio con una única responsabilidad y una interfaz de ejecución explícita.

### Beneficio

Reduce lógica de negocio en la presentación, mejora la trazabilidad de cada operación y hace más predecible la evolución funcional del módulo.

## ¿Por qué usamos TaskFacade?

### Contexto

La pantalla de tareas necesita coordinar múltiples operaciones de dominio y exponer estado listo para renderizar sin acoplar los componentes a varios casos de uso.

### Decisión

Introducir `TaskFacade` como punto de entrada de la presentación al dominio, centralizando orquestación de casos de uso y estado de pantalla.

### Beneficio

Simplifica los componentes, concentra la lógica de interacción de la UI en una sola pieza y mejora mantenibilidad al reducir dependencias directas en la capa de presentación.

## ¿Por qué usamos Reactive Forms?

### Contexto

El formulario de creación de tareas necesita validaciones explícitas, tipado y control del estado del formulario en un flujo predecible.

### Decisión

Implementar el formulario de alta con `ReactiveFormsModule`, `FormGroup` y `FormControl` con validadores declarativos.

### Beneficio

Aumenta el control sobre validaciones, facilita testeo del comportamiento del formulario y mantiene un flujo de datos claro entre entrada de usuario y comando de dominio.

## ¿Por qué existen Shared Components?

### Contexto

La interfaz utiliza piezas visuales repetibles en distintas pantallas o secciones, y conviene evitar duplicación de estructura y estilos.

### Decisión

Centralizar componentes reutilizables de UI en `shared/components` y exponerlos mediante `SharedModule`.

### Beneficio

Promueve consistencia visual y de comportamiento, reduce duplicación y acelera la construcción de nuevas pantallas reutilizando bloques existentes.

## ¿Por qué usamos Design Tokens?

### Contexto

La aplicación necesita una base visual coherente (colores, espaciados, radios, sombras y transiciones) para mantener consistencia entre componentes.

### Decisión

Definir tokens de diseño en `src/theme/variables.scss` como fuente central de valores visuales consumidos por estilos de la aplicación.

### Beneficio

Unifica la identidad visual, simplifica ajustes de tema y evita valores hardcodeados dispersos en múltiples archivos de estilo.

## ¿Por qué usamos alias de TypeScript?

### Contexto

En una estructura por features y capas, las rutas relativas largas dificultan navegación y vuelven frágiles los imports ante cambios de carpetas.

### Decisión

Configurar alias en `tsconfig.json` (`@features/*`, `@shared/*`, `@core/*`, entre otros) para referenciar módulos por contexto arquitectónico.

### Beneficio

Mejora legibilidad de imports, reduce fricción en refactors de estructura y refuerza una navegación más clara dentro de la arquitectura del proyecto.
