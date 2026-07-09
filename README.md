# Ionic Task Manager

**v1.0.0** · Prueba técnica Senior · Angular 20 · Ionic 8 · **248 tests**

Aplicación híbrida de gestión de **tareas** y **categorías** con Clean Architecture, persistencia local, feature flags (Firebase Remote Config) y empaquetado Android con Cordova.

---

## Descargar la aplicación

El proyecto incluye un **APK listo para instalar** en dispositivos Android.

[**📱 Android APK (GitHub Releases)**](GITHUB_RELEASES_URL)

- Generado con **Apache Cordova 13** (`cordova-android@15`).
- Validado en un **dispositivo Android físico**.
- Corresponde a la versión estable **v1.0.0**.

> Sustituir `GITHUB_RELEASES_URL` por la URL de la sección **Releases** del repositorio en GitHub (release `v1.0.0`).

---

## Inicio rápido

**Requisitos:** Node.js ≥ 20.17 · npm ≥ 10

```bash
git clone <url-del-repositorio>
cd ionic-task-manager
npm install
npm start          # http://localhost:4200
npm run check      # formato · lint · tipos · tests · build
```

| Script                | Descripción                      |
| --------------------- | -------------------------------- |
| `npm start`           | Desarrollo                       |
| `npm run check`       | Pipeline completo de calidad     |
| `npm run android`     | APK debug Android                |
| `npm run android:run` | Instalar en dispositivo/emulador |

---

## ¿Qué hace el proyecto?

- CRUD de tareas: crear, buscar, filtrar, completar, editar y eliminar.
- CRUD de categorías integrado con tareas (selector y filtros dinámicos).
- Persistencia en `localStorage` sin backend propio.
- Feature flag `enable_categories` para mostrar u ocultar administración de categorías.
- Infinite scroll y renderizado incremental para listas grandes.
- **APK Android v1.0.0** publicado en GitHub Releases; preparación iOS documentada (solo macOS).

---

## Tecnologías

| Stack           | Uso                                             |
| --------------- | ----------------------------------------------- |
| Angular 20      | Framework, routing lazy, Reactive Forms, OnPush |
| Ionic 8         | UI móvil, modales, toasts, infinite scroll      |
| TypeScript 5.9  | Tipado estricto                                 |
| Firebase        | Solo Remote Config (AngularFire 20)             |
| Cordova 13      | Android (`cordova-android@15`)                  |
| Jasmine + Karma | 248 tests unitarios en CI                       |
| SCSS + tokens   | Design System en `src/theme/`                   |

---

## Características principales

**Tareas** — CRUD, búsqueda en tiempo real, filtro por categoría, estados vacíos diferenciados, toast y alertas.

**Categorías** — CRUD en `/categories`, protegido por feature flag.

**UX** — Infinite scroll (`IncrementalList`, 30 ítems/página), motion, responsive (`768px`, `1024px`), accesibilidad WCAG 2.2 AA parcial.

**Infraestructura** — `npm run check`, benchmark de desarrollo, componentes shared reutilizables.

---

## Arquitectura (resumen)

Clean Architecture por feature: **Presentation → Facade → Use Cases → Repository → Data Source → localStorage**.

```
features/tasks/     features/categories/
core/firebase/      shared/components/
```

Detalle completo: [docs/architecture.md](docs/architecture.md)

---

## Capturas

| Pantalla                                                 | Descripción                  |
| -------------------------------------------------------- | ---------------------------- |
| ![Task List](docs/screenshots/tasks-list.png)            | Lista con búsqueda y filtros |
| ![Task Form](docs/screenshots/task-form.png)             | Modal crear/editar tarea     |
| ![Categories](docs/screenshots/categories.png)           | Administración de categorías |
| ![Category Form](docs/screenshots/category-form.png)     | Modal de categoría           |
| ![Empty State](docs/screenshots/empty-state.png)         | Sin tareas                   |
| ![No Results](docs/screenshots/no-results.png)           | Sin resultados de filtro     |
| ![Infinite Scroll](docs/screenshots/infinite-scroll.png) | Renderizado incremental      |
| ![Remote Config](docs/screenshots/remote-config.png)     | Feature flag en Firebase     |

---

## Performance

OnPush, caché de view models, `IncrementalList` + infinite scroll, `trackBy` y mapper con `Map`. Con 5000 tareas: **30 tarjetas** en carga inicial.

| Tareas | Carga (ms) | Búsqueda | Filtrado | Visibles |
| -----: | ---------: | -------: | -------: | -------: |
|   5000 |       31.0 |      9.8 |     24.5 |       30 |

Detalle: [docs/performance-benchmark.md](docs/performance-benchmark.md)

---

## Firebase / Remote Config

Solo Remote Config. Configurar `firebase` en `src/environments/environment*.ts` (no subir credenciales reales).

| Flag                   | Clave               | Default app |
| ---------------------- | ------------------- | ----------- |
| Administrar categorías | `enable_categories` | `true`      |

`true` → botón y ruta `/categories` activos. `false` → oculto + guard redirige a `/tasks`.

---

## Cordova

El proyecto ya cuenta con un **APK publicado** en [GitHub Releases](GITHUB_RELEASES_URL) (v1.0.0). Los pasos siguientes sirven para compilar nuevas versiones en local.

```bash
npx cordova platform add android@15.0.0   # primera vez
npm run android                           # APK debug local
```

**iOS:** la preparación sigue documentada en [docs/cordova-environment.md](docs/cordova-environment.md). La generación del IPA requiere **macOS y Xcode**; no es posible desde Linux.

---

## Testing

| Métrica  | Valor                                           |
| -------- | ----------------------------------------------- |
| Tests CI | **248** (249 definidos; 1 omitido en benchmark) |
| Comando  | `npm run test:ci` dentro de `npm run check`     |

Capas: dominio, datasources, repositorios, facades, mappers, guards, Remote Config, componentes UI, shared.

---

## Documentación técnica

| Documento                                                      | Contenido                                  |
| -------------------------------------------------------------- | ------------------------------------------ |
| [docs/architecture.md](docs/architecture.md)                   | Arquitectura, capas, carpetas, flujos      |
| [docs/technical-decisions.md](docs/technical-decisions.md)     | Respuestas al enunciado y decisiones clave |
| [docs/performance-benchmark.md](docs/performance-benchmark.md) | Optimizaciones y métricas                  |
| [docs/cordova-environment.md](docs/cordova-environment.md)     | Android, iOS, troubleshooting              |
| [CHANGELOG.md](CHANGELOG.md)                                   | Historial de versiones                     |

---

## Autor

**Dervis Gómez** — [dervisgomez.dev](https://dervisgomez.dev/)
