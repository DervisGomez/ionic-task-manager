# Benchmark de rendimiento — capa de presentación

Mediciones tomadas en entorno de desarrollo local (Chrome Headless, Karma) tras las optimizaciones de presentación (`OnPush`, caché de view models, `TaskPresentationMapper` con `Map`, **Infinite Scroll** con `IncrementalList`).

## Cómo reproducir

### Panel en la UI (recomendado)

1. Ejecutar `npm start` (solo disponible con `environment.production === false`).
2. Abrir la lista de tareas (`/tasks`).
3. Usar el panel **Benchmark (solo desarrollo)** para poblar el repositorio con 100, 500, 1000 o 5000 tareas.
4. Revisar los tiempos mostrados en pantalla.

### Servicio de benchmark (tests)

En `task-benchmark.service.spec.ts`, cambiar `xit` por `it` en el bloque _documenta métricas de rendimiento_ y ejecutar:

```bash
npx ng test --watch=false --browsers=ChromeHeadless --include=task-benchmark.service.spec.ts
```

## Qué se mide

| Métrica                | Descripción                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **Carga inicial**      | `loadTasks` + `loadCategories` + mapeo enriquecido + `IncrementalList.reset` (primera página) |
| **Búsqueda**           | `TaskFacade.search('benchmark 42')` + mapeo + reinicio incremental                            |
| **Filtrado**           | `TaskFacade.selectCategory(...)` + mapeo + reinicio incremental                               |
| **Visibles (inicial)** | Cantidad de `TaskCardComponent` listos para renderizar tras la carga (máx. 30)                |

Cada ejecución limpia las tareas existentes, siembra el volumen indicado mediante `CreateTaskUseCase` (lotes de 100) y mide en memoria con `performance.now()`.

## Resultados (ms) — con Infinite Scroll

| Tareas | Carga inicial | Búsqueda | Filtrado | Visibles (inicial) |
| -----: | ------------: | -------: | -------: | -----------------: |
|    100 |           2.0 |      0.3 |      0.2 |                 30 |
|    500 |           2.8 |      1.0 |      2.7 |                 30 |
|   1000 |           6.5 |      2.1 |      5.2 |                 30 |
|   5000 |          31.0 |      9.8 |     24.5 |                 30 |

> Mediciones de 100 y 500 tomadas directamente en Karma (julio 2026). 1000 y 5000 medidos en ejecuciones dedicadas del mismo servicio; el pipeline de datos escala con el volumen, pero **el render inicial permanece en 30 tarjetas**.

## Comparativa: antes vs después (5000 tareas)

| Aspecto                       |        Sin Infinite Scroll | Con Infinite Scroll (`PAGE_SIZE = 30`) |
| ----------------------------- | -------------------------: | -------------------------------------: |
| `TaskCardComponent` en carga  |                       5000 |                                     30 |
| Tiempo percebido en navegador |                 Bloqueante |                                 Fluido |
| Consultas al repositorio      |                          0 |                                      0 |
| Fuente de datos               | `filteredTasks` en memoria |             `filteredTasks` en memoria |

El cuello de botella identificado era el **renderizado simultáneo** de miles de tarjetas, no el dominio ni los filtros. `IncrementalList` desacopla el volumen total de datos del volumen renderizado.

## Observaciones

- `IncrementalList` (`shared/utils/incremental-list.ts`) es TypeScript puro, reutilizable y sin dependencias de Angular.
- El mapeo enriquecido con `Map<string, CategoryViewModel>` mantiene búsqueda y filtrado por debajo de 25 ms con 5000 tareas en memoria.
- `ChangeDetectionStrategy.OnPush`, propiedades cacheadas y `trackBy` se mantienen en toda la lista.
- La lista incremental se reinicia automáticamente ante búsqueda, filtro, CRUD y recarga del facade.
