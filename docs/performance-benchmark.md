# Rendimiento y benchmark

Documento único de referencia para optimizaciones de presentación e Infinite Scroll.

---

## Problema identificado

Con miles de tareas en memoria, el filtrado y el dominio seguían siendo rápidos, pero renderizar un `*ngFor` con miles de `TaskCardComponent` bloqueaba la UI. El cuello de botella era el **renderizado simultáneo**, no los repositorios ni los casos de uso.

---

## Optimizaciones implementadas

### ChangeDetectionStrategy.OnPush

Aplicado en listas, tarjetas, formularios, filtros, empty states, FAB y pantallas de categorías. Reduce ciclos de detección a cambios de `@Input`, eventos del template y `markForCheck()` explícito tras `syncViewState()` en `TaskListComponent`.

### Caché de ViewModels y estado materializado

- `TaskFacade` cachea `taskViewModels`; se regeneran en `refreshTaskViewModels()` solo al filtrar o recargar.
- `TaskListComponent` asigna `visibleTasks`, flags de empty state y categorías en `syncViewState()`, evitando getters costosos en plantilla que re-mapeen en cada ciclo.

### TaskPresentationMapper con Map

`buildCategoryMap()` indexa categorías por id. `toEnrichedViewModels()` resuelve etiquetas en O(1) por tarea en lugar de `find` lineal.

### IncrementalList

Utilidad pura en `shared/utils/incremental-list.ts` (sin dependencias Angular). Tras `reset(items)`, expone como máximo `PAGE_SIZE` (30) ítems; `loadMore()` amplía el subconjunto visible. Desacopla **datos totales** de **nodos DOM**.

### Infinite Scroll

`ion-infinite-scroll` en `TaskListComponent` llama a `loadMore()` al final del scroll. La lista incremental se reinicia en búsqueda, filtro, CRUD y recarga del facade.

### trackBy

`trackByTaskId` identifica ítems por `task.id` para reutilizar componentes hijo al paginar o actualizar parcialmente.

### Reducción de memoria en render

Solo existen en DOM hasta 30 tarjetas por página visible (más las ya cargadas por scroll incremental), no el total filtrado de una vez. Los datos completos permanecen en memoria del facade; el ahorro está en nodos Angular/Ionic instanciados.

---

## Benchmark

### Panel en UI (recomendado)

1. `npm start` (`environment.production === false`).
2. Abrir `/tasks`.
3. Panel **Benchmark (solo desarrollo)** → sembrar 100, 500, 1000 o 5000 tareas.
4. Revisar tiempos en pantalla.

### Servicio y tests

`TaskBenchmarkService` siembra tareas vía `CreateTaskUseCase` (lotes de 100), mide con `performance.now()` y replica el flujo real incluyendo `IncrementalList`.

Para métricas en Karma, habilitar el `xit` documental en `task-benchmark.service.spec.ts` y ejecutar:

```bash
npx ng test --watch=false --browsers=ChromeHeadless --include=task-benchmark.service.spec.ts
```

### Métricas

| Métrica            | Qué mide                                                   |
| ------------------ | ---------------------------------------------------------- |
| Carga inicial      | `loadTasks` + categorías + mapeo + `IncrementalList.reset` |
| Búsqueda           | `TaskFacade.search` + mapeo + reinicio incremental         |
| Filtrado           | `TaskFacade.selectCategory` + mapeo + reinicio incremental |
| Visibles (inicial) | Tarjetas listas para render (máx. 30)                      |

### Resultados (ms) — Infinite Scroll activo

| Tareas | Carga inicial | Búsqueda | Filtrado | Visibles |
| -----: | ------------: | -------: | -------: | -------: |
|    100 |           2.0 |      0.3 |      0.2 |       30 |
|    500 |           2.8 |      1.0 |      2.7 |       30 |
|   1000 |           6.5 |      2.1 |      5.2 |       30 |
|   5000 |          31.0 |      9.8 |     24.5 |       30 |

Mediciones julio 2026. El render inicial permanece en **30 tarjetas** aunque el volumen en memoria crezca.

### Antes vs después (5000 tareas)

| Aspecto                      |        Sin Infinite Scroll | Con `PAGE_SIZE = 30` |
| ---------------------------- | -------------------------: | -------------------: |
| `TaskCardComponent` en carga |                       5000 |                   30 |
| Experiencia en navegador     |                 Bloqueante |               Fluida |
| Fuente de datos              | `filteredTasks` en memoria |                Igual |

---

## Conclusión

La combinación OnPush + estado cacheado + Map + `IncrementalList` + Infinite Scroll mantiene la UI usable con miles de tareas locales. Búsqueda y filtrado en memoria escalan por debajo de 25 ms con 5000 ítems; el render deja de ser el factor limitante.
