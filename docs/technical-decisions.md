# Decisiones técnicas

Respuestas al enunciado de la prueba técnica y decisiones clave para revisión de código o entrevista. Basado en el estado final del repositorio (v1.0.0).

**Documentación relacionada:** [architecture.md](./architecture.md) · [performance-benchmark.md](./performance-benchmark.md) · [cordova-environment.md](./cordova-environment.md)

---

## Decisiones clave (resumen)

### ¿Por qué Clean Architecture?

El proyecto evolucionó de un CRUD simple a categorías dinámicas, Remote Config, persistencia local y build nativo. Sin capas explícitas, cada nueva capacidad hubiera acoplado componentes a `localStorage`, Firebase o detalles de Ionic.

Se organizó cada feature en **domain → data → presentation** con contratos de repositorio en el núcleo. La UI nunca importa datasources; los casos de uso nunca importan componentes. Eso permitió añadir `categories/` como módulo paralelo a `tasks/` sin reescribir el dominio de tareas.

### ¿Por qué Facade?

`TaskListComponent` coordina modal, toast, búsqueda, filtros, infinite scroll y empty states. Inyectar cuatro casos de uso y un repositorio en cada componente dispersaría orquestación y estado.

`TaskFacade` y `CategoryFacade` concentran invocación de use cases, estado de pantalla y — en tareas — búsqueda/filtrado en memoria. Los tests mockean un solo punto de entrada; los componentes permanecen delgados.

### ¿Por qué Remote Config (y no Firestore)?

El enunciado pedía feature flags sin backend completo. Remote Config activa o desactiva `enable_categories` sin redeploy. Toda integración Firebase vive en `core/firebase/`; features solo usan `RemoteConfigService`. Si Firebase falla o no está configurado, los defaults en `remote-config.defaults.ts` mantienen la app operativa.

### ¿Por qué Infinite Scroll e IncrementalList?

El benchmark demostró que con 5000 tareas el filtrado era rápido pero pintar 5000 tarjetas bloqueaba la UI. `IncrementalList` (TypeScript puro, reutilizable) limita el render a 30 ítems por página; `ion-infinite-scroll` carga el resto bajo demanda. Ver [performance-benchmark.md](./performance-benchmark.md).

### ¿Por qué localStorage?

Para la prueba técnica se necesitaba persistencia real en dispositivo sin backend ni credenciales en el repositorio. Los datasources serializan a `localStorage`; los repositorios mantienen el contrato de dominio. Sustituir por Firestore sería un cambio acotado a `data/` y los providers.

### ¿Por qué `@Injectable()` en dominio?

Compromiso documentado en [architecture.md](./architecture.md#decisión-angular-di-en-dominio): solo DI de Angular en use cases, composition root en `*.providers.ts`. Prioriza simplicidad y testabilidad frente a dominio 100 % agnóstico al framework.

---

## 1. Principales desafíos al implementar las nuevas funcionalidades

### Evolucionar hacia una arquitectura mantenible

El proyecto creció desde un listado de tareas hasta categorías, flags, Cordova y optimización de listas. La respuesta fue features autónomas con composition root por módulo (`tasks.providers.ts`, `categories.providers.ts`): la UI solo inyecta facades.

### Separar Presentation, Domain y Data

Validaciones en formularios; CRUD en casos de uso; persistencia detrás de `TaskRepository` / `CategoryRepository`. Búsqueda y filtro se resolvieron en `TaskFacade` para no inflar el dominio con consultas de UI. Los datasources aislaron el formato de `localStorage`.

### Mantener desacoplado Firebase

`@angular/fire` solo en `core/firebase/`. Pantallas y guards consumen `RemoteConfigService`; sin Firestore ni Auth.

### CRUD de categorías sin romper Tasks

Feature `categories/` con la misma estructura de capas. Tareas referencian `categoryId`; `TaskPresentationMapper` enriquece etiquetas con un `Map`. El flag `enable_categories` oculta administración sin romper el formulario de tareas.

### Rendimiento con grandes volúmenes

Cuello de botella: renderizado masivo de `TaskCardComponent`. Solución: `IncrementalList` + infinite scroll + OnPush. Detalle en [performance-benchmark.md](./performance-benchmark.md).

### Cordova sin tocar la arquitectura

Scripts `build:native`, `android`, `android:run` operan sobre `www/`. Sin imports Cordova en features. Guía: [cordova-environment.md](./cordova-environment.md).

### Cobertura de pruebas durante la evolución

Cada capa nueva incluyó `.spec.ts` junto al código. `npm run check` ejecuta **248 tests** en CI antes del build.

---

## 2. Técnicas de optimización de rendimiento

Las optimizaciones se aplicaron en **presentación**, donde el benchmark localizó el costo dominante:

| Técnica                  | Motivo                                                                    |
| ------------------------ | ------------------------------------------------------------------------- |
| **OnPush**               | Menos ciclos de detección en listas grandes                               |
| **Caché de view models** | `TaskFacade` y `TaskListComponent` materializan estado una vez por cambio |
| **Map en mapper**        | Etiquetas de categoría O(1) al enriquecer miles de tareas                 |
| **IncrementalList**      | Desacopla datos totales de nodos DOM                                      |
| **Infinite Scroll**      | Carga progresiva al hacer scroll                                          |
| **trackBy**              | Reutiliza instancias de tarjeta por `task.id`                             |
| **Benchmark dev**        | Valida hipótesis con 100–5000 tareas sembradas por use case               |

**Resultado:** con 5000 tareas, 30 tarjetas visibles en carga inicial; búsqueda y filtro &lt; 25 ms en memoria; UI fluida. Tablas y reproducción: [performance-benchmark.md](./performance-benchmark.md).

---

## 3. Calidad y mantenibilidad del código

La mantenibilidad no depende de una sola herramienta sino de convenciones repetidas en todo el repositorio.

**Arquitectura por capas** hizo intercambiable la persistencia y aisló Firebase en `core/`. **DDD ligero** unificó el vocabulario (`Task`, `Category`, comandos, puertos) sin modelado rico innecesario para el alcance de la prueba.

**Facades** simplifican componentes y tests. **Mappers y view models** evitan que la UI conozca entidades de dominio. **Repositorios y casos de uso** mantienen una responsabilidad por operación CRUD.

En experiencia de usuario, el **Design System** tokenizado (`src/theme/`) y el **motion system** con `prefers-reduced-motion` dan coherencia visual. La **accesibilidad** (ARIA, `radiogroup` en filtros, listas semánticas, foco visible) se verifica en tests de componentes.

**248 pruebas unitarias** cubren dominio, datos, presentación, core y shared. **`npm run check`** unifica formato, lint, tipos, tests y build.

**Feature flags** vía `RemoteConfigService` mantienen Firebase desacoplado. **`IncrementalList`** en `shared/utils/` demuestra extracción de lógica reutilizable sin acoplar al framework.

---

## Aprendizajes — ¿Qué mejoraría en el futuro?

La v1.0.0 cumple el objetivo de la prueba: CRUD completo, persistencia local, flags, demo web en Firebase Hosting, APK Android, 248 tests y documentación alineada con el código.

Extensiones naturales, sin invalidar lo entregado:

- **Firestore** como otra implementación de los repositorios existentes.
- **Sincronización offline** con cola de operaciones y reconciliación.
- **Autenticación** y rutas protegidas por usuario.
- **Notificaciones push** para recordatorios de tareas.
- **Compartir listas** y **colaboración en tiempo real** con permisos y backend compartido.

Todas apoyan la misma estructura por features y el composition root actual; el cambio se concentraría en `data/` y nueva infraestructura.

---

## Referencias

- [README.md](../README.md)
- [architecture.md](./architecture.md)
- [performance-benchmark.md](./performance-benchmark.md)
- [CHANGELOG.md](../CHANGELOG.md)
