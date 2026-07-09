# Release v1.0.0 — Resumen técnico

Primera versión estable del proyecto **Ionic Task Manager**.

## Funcionalidades implementadas

| Área          | Detalle                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| CRUD          | Crear, leer, editar y eliminar tareas desde la interfaz                          |
| Listado       | Carga automática al iniciar, tarjetas con estado y categoría                     |
| Búsqueda      | Filtrado en tiempo real por título y descripción                                 |
| Filtros       | Selección por categoría (Todas, Trabajo, Personal) con navegación por teclado    |
| Formulario    | Creación y edición reutilizando `TaskFormComponent` en modal                     |
| Feedback      | `IonToast` para confirmación de operaciones; `IonAlert` para eliminación         |
| Estado vacío  | Pantalla informativa con CTA cuando no hay tareas                                |
| Accesibilidad | WCAG 2.2 AA: ARIA contextual, foco visible, formulario accesible, patrón tablist |
| Diseño        | Design Tokens centralizados, polish visual y transiciones suaves                 |

## Arquitectura utilizada

Organización por **feature** (`tasks`) con tres capas internas:

```
Presentation → Domain → Data
```

- **Presentation**: páginas, componentes, `TaskFacade`, `TaskMapper`, `TaskViewModel`
- **Domain**: entidades, comandos, casos de uso, contrato `TaskRepository`
- **Data**: `InMemoryTaskRepository` (implementación in-memory)

La UI nunca accede directamente al repositorio. Toda orquestación pasa por `TaskFacade`.

## Patrones aplicados

| Patrón             | Implementación                                                  |
| ------------------ | --------------------------------------------------------------- |
| Clean Architecture | Separación dominio / presentación / datos con inversión de deps |
| DDD                | Entidades, comandos y casos de uso con lenguaje de negocio      |
| Repository Pattern | `TaskRepository` (contrato) + `InMemoryTaskRepository` (impl.)  |
| Use Cases          | `GetTasks`, `CreateTask`, `UpdateTask`, `DeleteTask`            |
| Facade             | `TaskFacade` como único punto de entrada UI → dominio           |
| ViewModel + Mapper | `TaskViewModel` y `TaskMapper` para adaptar entidades a la UI   |
| Composition Root   | `tasks.providers.ts` registra contratos e implementaciones      |
| Shared Components  | Módulo `SharedModule` con componentes UI reutilizables          |
| Design Tokens      | Variables CSS centralizadas en `src/theme/variables.scss`       |

## Cobertura de pruebas

| Métrica                | Valor           |
| ---------------------- | --------------- |
| Tests unitarios        | **96**          |
| Framework              | Jasmine + Karma |
| Pipeline de validación | `npm run check` |

Áreas cubiertas:

- Dominio: casos de uso (create, update, delete, get)
- Datos: `InMemoryTaskRepository`
- Presentación: facade, mapper, task-card, task-form, task-list
- Shared: search-bar, category-filter, empty-state, page-header, floating-action-button

## Scripts disponibles

| Script          | Descripción                                   |
| --------------- | --------------------------------------------- |
| `npm start`     | Servidor de desarrollo                        |
| `npm test`      | Tests en modo interactivo                     |
| `npm run check` | Formato + lint + typecheck + tests CI + build |
| `npm run build` | Build de producción                           |

## Próximos pasos (Sprint 6)

1. **Firebase** — backend de datos en la nube
2. **Persistencia real** — repositorio con almacenamiento durable
3. **Offline** — operación sin conexión con cola de sincronización
4. **Autenticación** — login/registro y rutas protegidas
5. **Sincronización** — reconciliación bidireccional dispositivo ↔ nube

Gracias a la inversión de dependencias, estos cambios se concentran en la capa `data` y en nuevos módulos de infraestructura, sin alterar dominio ni facade.
