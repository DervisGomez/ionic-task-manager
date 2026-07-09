# Flujo de dependencias

Este documento describe cómo fluye una operación a través de las capas del proyecto, desde la interacción del usuario hasta la persistencia de datos y la actualización de la interfaz.

## Diagrama general

```
Usuario
   ↓
TaskListComponent / TaskCardComponent / TaskFormComponent
   ↓
TaskFacade
   ↓
Use Case (Create · Update · Delete · GetTasks)
   ↓
TaskRepository (contrato)
   ↓
InMemoryTaskRepository
   ↓
TaskFacade (recarga y aplica filtros)
   ↓
TaskMapper → TaskViewModel
   ↓
UI (listado actualizado + IonToast)
```

## Operaciones disponibles

| Operación | Origen UI                        | Use Case             | Resultado en UI                |
| --------- | -------------------------------- | -------------------- | ------------------------------ |
| Listar    | `ngOnInit` → `loadTasks()`       | `GetTasksUseCase`    | Listado o estado vacío         |
| Crear     | `TaskFormComponent` → modal      | `CreateTaskUseCase`  | Toast de éxito, modal cerrado  |
| Editar    | `TaskCardComponent` → modal      | `UpdateTaskUseCase`  | Toast de éxito, modal cerrado  |
| Eliminar  | `TaskCardComponent` → `IonAlert` | `DeleteTaskUseCase`  | Toast de éxito                 |
| Completar | `TaskCardComponent` → checkbox   | `UpdateTaskUseCase`  | Listado actualizado            |
| Buscar    | `SearchBarComponent`             | — (filtro en facade) | Listado filtrado               |
| Filtrar   | `CategoryFilterComponent`        | — (filtro en facade) | Listado filtrado por categoría |

## Flujo de creación de tarea

### Usuario

El usuario completa el formulario (título, descripción y categoría) y confirma el envío desde el modal.

### TaskFormComponent

Valida los datos y emite un `CreateTaskCommand`. No accede al dominio directamente.

### TaskListComponent

Escucha el evento del formulario, delega a `TaskFacade.createTask()` y muestra un `IonToast` según el resultado. La retroalimentación visual vive en la capa de presentación, no en el facade.

### TaskFacade

Invoca `CreateTaskUseCase` y recarga el listado con `loadTasks()`, aplicando los filtros activos de búsqueda y categoría.

### CreateTaskUseCase

Construye la entidad `Task` (identificador, fechas, estado inicial) y solicita persistencia al repositorio.

### TaskRepository → InMemoryTaskRepository

El contrato define la operación; la implementación almacena la entidad en memoria.

### Retorno a la UI

`TaskFacade` actualiza su estado interno. `TaskMapper` transforma las entidades en `TaskViewModel` y el listado se renderiza con la nueva tarea.

## Flujo de edición y eliminación

### Edición

1. El usuario pulsa editar en `TaskCardComponent`.
2. `TaskListComponent` abre el modal con `TaskFormComponent` precargado.
3. Al enviar, `TaskFacade.updateTask()` invoca `UpdateTaskUseCase`.
4. Se muestra toast de confirmación o error.

### Eliminación

1. El usuario pulsa eliminar en `TaskCardComponent`.
2. `TaskListComponent` presenta un `IonAlert` de confirmación.
3. Si confirma, `TaskFacade.deleteTask()` invoca `DeleteTaskUseCase`.
4. Se muestra toast de confirmación o error.

## Flujo de búsqueda y filtrado

La búsqueda y el filtrado por categoría se resuelven en `TaskFacade` sin invocar casos de uso adicionales:

1. `SearchBarComponent` emite el término de búsqueda.
2. `CategoryFilterComponent` emite la categoría seleccionada.
3. `TaskFacade` aplica ambos filtros sobre `state.tasks` y actualiza `state.filteredTasks`.
4. La UI reacciona al cambio de `filteredTasks`.

## Principio del flujo

La operación desciende desde la presentación hacia el dominio y la infraestructura, y asciende de vuelta a través de `TaskFacade` para actualizar la UI. En ningún punto la capa de presentación accede directamente a `InMemoryTaskRepository`: la inversión de dependencias mantiene cada capa en su responsabilidad y permite sustituir la implementación de persistencia sin modificar la interfaz ni los casos de uso.
