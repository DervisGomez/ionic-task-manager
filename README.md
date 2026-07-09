# Ionic Task Manager

**v1.0.0** · Angular 20 · Ionic 8 · Clean Architecture · 117 tests · [`npm run check`](#inicio-rápido)

Aplicación de gestión de tareas **mobile first** que resuelve el ciclo de vida completo de una tarea — crear, buscar, filtrar, completar, editar y eliminar — sin acoplar la UI a la persistencia.

Referencia de arquitectura frontend en apps híbridas: dominio explícito, capas separadas, decisiones documentadas en ADR y pipeline de calidad automatizado.

---

## Tabla de contenidos

- [En 60 segundos](#en-60-segundos)
- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Funcionalidades](#funcionalidades)
- [Inicio rápido](#inicio-rápido)
- [Cordova (Android / iOS)](#cordova-android--ios)
- [Firebase (Remote Config)](#firebase-remote-config)
- [Calidad](#calidad)
- [Documentación](#documentación)
- [Roadmap](#roadmap)
- [Autor](#autor)

---

## En 60 segundos

### Qué problema resuelve

Organizar tareas personales y laborales con categorías (Trabajo / Personal), búsqueda en tiempo real y feedback claro en cada operación — desde una interfaz usable en móvil y escritorio.

### Por qué está bien diseñado

| Principio                      | Cómo se aplica                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Separación de capas            | La UI nunca accede al repositorio; todo pasa por `TaskFacade` → casos de uso → `TaskRepository` |
| Organización por feature       | `features/tasks/` agrupa dominio, datos y presentación en un solo contexto                      |
| UI desacoplada del dominio     | `TaskViewModel` + `TaskMapper` adaptan entidades a la pantalla sin contaminar el modelo         |
| Infraestructura intercambiable | `InMemoryTaskRepository` hoy; `datasources/` preparado para API o Firestore                     |
| Consistencia visual            | Design System tokenizado en `src/theme/` — sin valores arbitrarios en componentes               |

### Decisiones técnicas clave

- **[ADR-001](docs/adr/ADR-001-angular-di-in-domain.md)** — Angular DI en casos de uso del dominio como compromiso pragmático que preserva la separación de capas.
- **Composition Root** — `tasks.providers.ts` conecta contrato e implementación; la presentación depende de use cases, no de data.
- **Catálogo centralizado** — `task-categories.catalog.ts` como única fuente de verdad para labels y filtros.
- **Accesibilidad orientada a WCAG 2.2 AA** — ARIA, foco visible, teclado y `prefers-reduced-motion` ([detalle](docs/accessibility.md)).
- **TypeScript estricto** — `strict: true` y plantillas estrictas en todo el proyecto.

### Por qué demuestra nivel Senior

- Arquitectura **documentada y justificada** — no solo carpetas bonitas: [arquitectura](docs/architecture/architecture.md), [flujos](docs/architecture/dependency-flow.md), [ADR](docs/adr/).
- **117 tests unitarios** en dominio, datos, presentación y shared — con pipeline `npm run check` listo para CI.
- Patrones reconocibles aplicados con criterio: Repository, Use Cases, Facade, ViewModel, Composition Root.
- Design System y Motion System con tokens reutilizables — [design-system.md](docs/design-system.md).
- Trade-offs explícitos: dominio anémico, persistencia in-memory en v1.0.0, cobertura de accesibilidad parcial.

> **Capturas / GIF:** no incluidos en el repositorio. Ejecuta `npm start` y abre `http://localhost:4200` para ver la UI.

---

## Stack

| Tecnología        | Versión / rol                                                           |
| ----------------- | ----------------------------------------------------------------------- |
| Angular           | 20 — framework, routing lazy, Reactive Forms                            |
| Ionic             | 8 — componentes UI e experiencia móvil                                  |
| TypeScript        | 5.9 — tipado estricto                                                   |
| SCSS              | Design System con CSS custom properties                                 |
| Capacitor         | 8 — dependencias instaladas (convive con Cordova durante la transición) |
| Cordova           | 13 — empaquetado nativo Android (`cordova-android@15`)                  |
| Firebase          | Remote Config vía AngularFire 20 (sin Firestore ni Auth)                |
| Jasmine + Karma   | 117 tests unitarios                                                     |
| ESLint + Prettier | Lint y formato automatizado                                             |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                           │
│  Pages · Components · ViewModels · Mappers · State          │
│                          │                                  │
│                          ▼                                  │
│                       FACADE                                │
│              TaskFacade (orquestación + filtros)            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        USE CASES                            │
│   GetTasks · CreateTask · UpdateTask · DeleteTask           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORIES                           │
│           TaskRepository (contrato en dominio)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                            │
│        datasources/ (preparado para futuras fuentes)        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                           │
│         InMemoryTaskRepository (implementación actual)      │
└─────────────────────────────────────────────────────────────┘
```

| Capa               | Responsabilidad                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| **Presentation**   | Páginas, componentes, facade, mappers y estado de pantalla              |
| **Facade**         | Orquesta casos de uso, aplica búsqueda/filtros, expone `TaskViewModel`  |
| **Use Cases**      | Operaciones CRUD; ensamblan entidades y delegan al repositorio          |
| **Repositories**   | Contrato abstracto que el dominio consume sin conocer la implementación |
| **Infrastructure** | `InMemoryTaskRepository` — persistencia en memoria actual               |

Profundizar: [architecture.md](docs/architecture/architecture.md) · [capas](docs/architecture/layers.md) · [estructura de carpetas](docs/architecture/folder-structure.md) · [decisiones de diseño](docs/architecture/design-decisions.md)

---

## Funcionalidades

**Gestión de tareas**

- CRUD completo (crear, leer, editar, eliminar)
- Búsqueda en tiempo real por título y descripción
- Filtro por categorías (Todas, Trabajo, Personal)
- Marcado de tareas como completadas
- Estado vacío con llamada a la acción
- Retroalimentación con `IonToast` y confirmación con `IonAlert`
- Persistencia in-memory mediante `InMemoryTaskRepository`

**Arquitectura y UI**

- Clean Architecture por feature · Repository · Use Cases · Facade · ViewModel · Mapper
- Design System tokenizado · Motion System con `prefers-reduced-motion`
- Responsive mobile first (`768px`, `1024px`)
- Shared components: `PageHeader`, `SearchBar`, `CategoryFilter`, `EmptyState`, `FAB`

---

## Inicio rápido

**Requisitos web:** Node.js ≥ 20.17 · npm ≥ 10

**Requisitos Android (Cordova):** JDK 17+, Android SDK Platform 36, Build Tools 36.x, `ANDROID_HOME` configurado. Detalle en [docs/cordova-environment.md](docs/cordova-environment.md).

```bash
git clone <url-del-repositorio>
cd ionic-task-manager
npm install
npm start          # http://localhost:4200
npm run check      # pipeline completo antes de un PR o release
```

| Script                 | Descripción                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `npm start`            | Servidor de desarrollo                                      |
| `npm run build`        | Build de producción en `www/`                               |
| `npm test`             | Tests interactivos (Karma + watch)                          |
| `npm run test:ci`      | 117 tests en `ChromeHeadless`                               |
| `npm run lint`         | ESLint                                                      |
| `npm run typecheck`    | `tsc --noEmit`                                              |
| `npm run check`        | **format → lint → typecheck → test:ci → build**             |
| `npm run build:native` | `ng build` + `cordova prepare` (copia `www/` a plataformas) |
| `npm run android`      | Build web + compilación APK debug de Android                |
| `npm run android:run`  | Build web + instala y ejecuta en dispositivo/emulador       |

---

## Cordova (Android / iOS)

La aplicación se empaqueta con **Apache Cordova 13** sobre el proyecto existente. El código Angular/Ionic no se modifica: Cordova consume el artefacto web generado en `www/`.

### Instalación de Cordova

Cordova ya está incluido como dependencia de desarrollo. Tras clonar el repositorio:

```bash
npm install
```

Para instalar Cordova globalmente (opcional):

```bash
npm install -g cordova@13
```

Verificar versiones:

```bash
npx cordova -v          # 13.x
node -v                 # >= 20.17.0
java -version           # JDK 17+
echo $ANDROID_HOME      # ruta al Android SDK
```

Configurar `JAVA_HOME` (recomendado):

```bash
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
```

### Plugin de routing (WebView)

Se incluye `cordova-plugin-ionic-webview` para servir la app desde `https://localhost` y soportar el routing SPA de Angular (`PathLocationStrategy`) sin modificar el código fuente.

### Compilación Android (APK)

1. Asegúrate de tener el Android SDK (Platform 36, Build Tools 36.x) y JDK 17+.
2. Si es la primera vez en tu máquina, añade la plataforma:

```bash
npx cordova platform add android@15.0.0
```

3. Compila:

```bash
npm run android
```

El APK debug se genera en:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Para instalar en emulador o dispositivo conectado:

```bash
npm run android:run
```

APK de release (requiere keystore y firma):

```bash
npm run build:native
npx cordova build android --release
```

### Preparación iOS (IPA)

> **Requisito:** la compilación iOS solo es posible en **macOS** con Xcode instalado. No se puede generar un IPA desde Linux.

Requisitos en macOS:

| Herramienta | Versión mínima |
| ----------- | -------------- |
| Xcode       | 15+            |
| CocoaPods   | 1.16+          |
| ios-deploy  | 1.12.2+        |
| Node.js     | 20.17+         |
| cordova-ios | 8              |

Pasos en macOS:

```bash
npm install
npx cordova platform add ios@8.0.0
npm run build:native
npx cordova build ios
```

Abre el workspace en Xcode para firmar y generar el IPA:

```bash
open platforms/ios/*.xcworkspace
```

En Xcode: selecciona el target, configura **Signing & Capabilities** con tu Apple Developer Team y usa **Product → Archive** para distribuir en App Store o TestFlight.

### Convivencia con Capacitor

Las dependencias de Capacitor se mantienen temporalmente. Una vez verificado que Cordova compila y ejecuta correctamente en tus entornos objetivo, será seguro retirar `@capacitor/*` si no planeas usar Capacitor. Hasta entonces, no afectan al build de Cordova.

Más detalle del entorno: [docs/cordova-environment.md](docs/cordova-environment.md).

## Firebase (Remote Config)

La aplicación integra **Firebase únicamente para Remote Config**. No se utiliza Firestore, Authentication ni Analytics. La persistencia local de tareas y categorías (`InMemoryTaskRepository`, `localStorage`) permanece sin cambios.

### Configuración

1. Crea un proyecto en la [consola de Firebase](https://console.firebase.google.com/) y habilita **Remote Config**.
2. Registra una app web y copia el objeto de configuración (`firebaseConfig`).
3. Sustituye los placeholders en los archivos de entorno:

| Archivo                                | Cuándo se usa           |
| -------------------------------------- | ----------------------- |
| `src/environments/environment.ts`      | Desarrollo (`ng serve`) |
| `src/environments/environment.prod.ts` | Producción (`ng build`) |

Reemplaza cada valor `YOUR_FIREBASE_*` por las credenciales reales de tu proyecto:

```ts
firebase: {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
}
```

> **Importante:** no subas credenciales reales al repositorio. Mantén los placeholders en el control de versiones y configura los valores reales solo en tu entorno local o en variables de CI/CD.

### Dónde vive la infraestructura

- **Credenciales:** `src/environments/environment.ts` y `environment.prod.ts`
- **Providers centralizados:** `src/app/core/firebase/firebase.providers.ts`
- **Servicio de Remote Config:** `src/app/core/firebase/services/remote-config.service.ts`
- **Registro en la app:** `AppModule` importa `FIREBASE_PROVIDERS` y `FIREBASE_APP_PROVIDERS`

`RemoteConfigService` se inicializa al arrancar la aplicación (`APP_INITIALIZER`). Si Firebase no está configurado o la red falla, la app sigue funcionando con valores por defecto.

### Feature Flags

Los feature flags se gestionan en Firebase Console → **Remote Config**. La aplicación consume parámetros únicamente a través de `RemoteConfigService` y las claves centralizadas en `remote-config.keys.ts`; no importes `@angular/fire` en features ni en dominio.

#### Flag activo: `enable_categories`

| Propiedad                | Valor                               |
| ------------------------ | ----------------------------------- |
| Clave Firebase           | `enable_categories`                 |
| Tipo                     | Boolean                             |
| Valor por defecto en app | `true`                              |
| Constante                | `RemoteConfigKeys.enableCategories` |

**Crear el parámetro en Firebase Console:**

1. Abre tu proyecto → **Remote Config** → **Add parameter**.
2. **Parameter name:** `enable_categories` (debe coincidir exactamente con la clave).
3. **Data type:** Boolean.
4. **Default value:** `true` (comportamiento actual) o `false` para ocultar la administración de categorías.
5. Publica los cambios (**Publish changes**).

**Efecto en la aplicación:**

- `true` — se muestra el botón "Administrar categorías" y `/categories` es accesible.
- `false` — se oculta el botón, el guard bloquea `/categories` y redirige a `/tasks`.

**Agregar un nuevo flag:**

1. Crea el parámetro en Firebase Console.
2. Registra la clave en `src/app/core/firebase/remote-config.keys.ts`.
3. Si es booleano, añade su valor por defecto en `remote-config.defaults.ts`.
4. Consume el valor desde presentación o routing con `RemoteConfigService` y la constante:

```ts
import { RemoteConfigKeys } from '@core/firebase/remote-config.keys';
import { RemoteConfigService } from '@core/firebase/services/remote-config.service';

this.remoteConfig.getBoolean(RemoteConfigKeys.enableCategories);
```

---

## Calidad

| Métrica  | Detalle                                                            |
| -------- | ------------------------------------------------------------------ |
| Tests    | 117 pruebas — dominio, datos, facade, mapper, componentes y shared |
| Lint     | Angular ESLint sin incidencias                                     |
| Tipos    | TypeScript estricto + plantillas estrictas                         |
| Formato  | Prettier en todo el proyecto                                       |
| CI local | `npm run check` — comando recomendado pre-merge                    |

Guía de testing: [docs/testing.md](docs/testing.md)

---

## Documentación

| Recurso                                                                              | Contenido                                       |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| [docs/README.md](docs/README.md)                                                     | **Índice completo** de documentación técnica    |
| [docs/architecture/architecture.md](docs/architecture/architecture.md)               | Arquitectura consolidada                        |
| [docs/architecture/dependency-flow.md](docs/architecture/dependency-flow.md)         | Flujos por operación                            |
| [docs/design-system.md](docs/design-system.md)                                       | Tokens, componentes y motion                    |
| [docs/accessibility.md](docs/accessibility.md)                                       | Mejoras orientadas a WCAG 2.2 AA                |
| [docs/adr/ADR-001-angular-di-in-domain.md](docs/adr/ADR-001-angular-di-in-domain.md) | Angular DI en dominio                           |
| [docs/RELEASE-v1.0.0.md](docs/RELEASE-v1.0.0.md)                                     | Notas técnicas del release                      |
| [docs/cordova-environment.md](docs/cordova-environment.md)                           | Requisitos del entorno Cordova (Node, JDK, SDK) |
| [docs/contributing.md](docs/contributing.md)                                         | Guía para colaboradores                         |
| [docs/releases.md](docs/releases.md)                                                 | Proceso de publicación                          |
| [CHANGELOG.md](CHANGELOG.md)                                                         | Historial de cambios                            |
| [ROADMAP.md](ROADMAP.md)                                                             | Planificación por sprints                       |

---

## Roadmap

| Sprint | Estado     | Resumen                                                                                       |
| ------ | ---------- | --------------------------------------------------------------------------------------------- |
| 1–6    | Completado | Fundación, dominio, UI, documentación, CRUD, Design System, motion, responsive, accesibilidad |
| **7**  | Próximo    | Firestore, DTO, offline, categorías dinámicas, sincronización, observabilidad                 |

Detalle: [ROADMAP.md](ROADMAP.md)

---

## Autor

**Dervis Gómez** — [dervisgomez.dev](https://dervisgomez.dev/)
