# Flujo de dependencias

Este documento describe cómo fluye una operación a través de las capas del proyecto, desde la interacción del usuario hasta la persistencia de datos y la actualización de la interfaz.

Como ejemplo se utiliza la **creación de una tarea**, el flujo implementado en la feature `tasks`.

## Diagrama del flujo

```
Usuario
   ↓
TaskFormComponent
   ↓
TaskListComponent
   ↓
TaskFacade
   ↓
CreateTaskUseCase
   ↓
TaskRepository
   ↓
InMemoryTaskRepository
   ↓
TaskFacade
   ↓
UI
```

## Recorrido paso a paso

### Usuario

El usuario completa el formulario de creación de tarea (título, descripción y categoría) y confirma el envío. Es el origen de la acción; no conoce las capas internas de la aplicación.

### TaskFormComponent

Componente de presentación responsable del formulario. Valida los datos introducidos y, si son correctos, emite un `CreateTaskCommand` con la información necesaria. No accede al dominio ni a la infraestructura directamente: solo comunica la intención del usuario hacia el componente contenedor.

### TaskListComponent

Página que hospeda el formulario y el listado de tareas. Escucha el evento emitido por `TaskFormComponent` y delega la operación a `TaskFacade`. Actúa como coordinador de la pantalla: conecta los componentes de UI con el punto de entrada al dominio, sin invocar casos de uso ni repositorios por su cuenta.

### TaskFacade

Punto de entrada entre la presentación y el dominio. Recibe el comando desde `TaskListComponent`, invoca `CreateTaskUseCase` y, una vez completada la operación, recarga el listado de tareas para actualizar el estado de la pantalla. Centraliza el estado visible para la UI (tareas, carga y errores).

### CreateTaskUseCase

Caso de uso del dominio que encapsula la lógica de creación. Construye la entidad `Task` a partir del comando recibido — asignando identificador, fechas y estado inicial — y solicita su persistencia al repositorio. No conoce detalles de la interfaz ni de cómo se almacenan los datos.

### TaskRepository

Contrato abstracto definido en el dominio. `CreateTaskUseCase` depende de esta abstracción, no de una implementación concreta. Expone la operación `createTask` sin especificar dónde ni cómo se guardará la entidad.

### InMemoryTaskRepository

Implementación concreta del contrato en la capa de datos. Recibe la entidad `Task` y la almacena en memoria. Es la pieza de infraestructura que materializa la operación de persistencia; el dominio nunca la referencia directamente.

### TaskFacade (retorno)

Tras la persistencia, el control vuelve a `TaskFacade`. Este recarga las tareas disponibles y actualiza su estado interno con el nuevo listado, de modo que la pantalla refleje el resultado de la operación.

### UI

`TaskListComponent` lee el estado expuesto por `TaskFacade` (tareas, indicador de carga y posibles errores) y la interfaz se actualiza para mostrar la tarea recién creada en el listado.

## Principio del flujo

La operación desciende desde la presentación hacia el dominio y la infraestructura, y asciende de vuelta a través de `TaskFacade` para actualizar la UI. En ningún punto la capa de presentación accede directamente a `InMemoryTaskRepository`: la inversión de dependencias mantiene cada capa en su responsabilidad y permite sustituir la implementación de persistencia sin modificar la interfaz ni los casos de uso.
