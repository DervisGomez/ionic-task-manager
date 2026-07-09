# Guía de contribución

Gracias por tu interés en contribuir a **Ionic Task Manager**. Esta guía describe las convenciones del proyecto para mantener coherencia arquitectónica y calidad de código.

---

## Requisitos previos

- Node.js >= 20
- npm >= 10

```bash
git clone <url-del-repositorio>
cd ionic-task-manager
npm install
```

---

## Flujo de trabajo

1. Crea una rama desde `main` con un nombre descriptivo (`feat/offline-sync`, `fix/form-validation`).
2. Realiza cambios acotados a un objetivo claro.
3. Ejecuta `npm run check` antes de abrir un PR.
4. Describe el cambio, el motivo y cómo probarlo en el PR.

---

## Convenciones de código

### Arquitectura

- Respeta la separación de capas: **dominio → datos → presentación**.
- La UI **no** accede directamente a repositorios ni a la capa `data`.
- Nueva operación CRUD o orquestación de dominio → caso de uso en `domain/use-cases/`.
- Nueva persistencia → implementación en `data/` que cumpla el contrato del dominio.
- Orquestación de pantalla → facade en `presentation/facades/`.
- Componentes reutilizables entre features → `shared/components/`.

### TypeScript

- Modo estricto habilitado (`strict: true`, plantillas estrictas).
- Usa alias de importación: `@features/*`, `@shared/*`, `@core/*`.
- Prefiere interfaces y tipos explícitos en contratos públicos.
- Evita `any`; usa `unknown` y narrowing cuando sea necesario.

### Angular / Ionic

- Componentes standalone o declarados en el módulo de su feature.
- Reactive Forms para formularios con validación.
- Los toasts y alerts de feedback viven en la capa de página, no en el facade.

### Estilos

- Consume tokens del Design System (`--app-*`). Ver [design-system.md](./design-system.md).
- No introduzcas colores, espaciados o radios arbitrarios si existe un token.
- Transiciones: `--app-transition-interactive` o `--app-transition-emphasis`.
- Breakpoints responsive: `768px` y `1024px`.

### Nomenclatura

| Elemento    | Convención                     | Ejemplo                  |
| ----------- | ------------------------------ | ------------------------ |
| Componente  | `kebab-case` + `.component.ts` | `task-card.component.ts` |
| Caso de uso | `PascalCase` + `UseCase`       | `CreateTaskUseCase`      |
| Entidad     | `PascalCase`                   | `Task`                   |
| Comando     | `PascalCase` + `Command`       | `CreateTaskCommand`      |
| Facade      | `PascalCase` + `Facade`        | `TaskFacade`             |
| ViewModel   | `PascalCase` + `ViewModel`     | `TaskViewModel`          |
| Test        | mismo nombre + `.spec.ts`      | `task.facade.spec.ts`    |

---

## Formato

El proyecto usa **Prettier** para formato consistente.

```bash
npm run format        # Aplica formato
npm run format:check  # Solo verifica (usado en CI)
```

No mezcles cambios de formato no relacionados con tu PR.

---

## Lint

**ESLint** con reglas de Angular ESLint:

```bash
npm run lint
```

Corrige advertencias antes de integrar. No desactives reglas sin justificación documentada.

---

## Tests

- Cada caso de uso, repositorio, facade y componente relevante debe tener su `.spec.ts`.
- Ejecuta tests en modo interactivo durante desarrollo:

```bash
npm test
```

- En CI (sin watch):

```bash
npm run test:ci
```

Filosofía y alcance: [testing.md](./testing.md)

---

## Commits

Usa mensajes claros en español o inglés (sé consistente dentro del PR):

```
feat(tasks): add offline queue for pending operations
fix(form): correct aria-describedby on description field
docs: update architecture diagram
test(facade): cover category filter edge cases
```

Prefijos sugeridos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.

---

## Estructura de carpetas

Al añadir una nueva feature, replica la estructura de `tasks/`:

```text
features/<nombre>/
├── domain/
│   ├── entities/
│   ├── commands/
│   ├── repositories/
│   └── use-cases/
├── data/
│   ├── datasources/
│   └── repositories/
├── presentation/
│   ├── components/
│   ├── facades/
│   ├── mappers/
│   ├── models/
│   └── state/
├── pages/
├── <nombre>.module.ts
├── <nombre>.providers.ts
└── <nombre>-routing-module.ts
```

Documenta decisiones arquitectónicas relevantes como ADR en `docs/adr/`.

---

## Documentación

- Actualiza `CHANGELOG.md` en cambios de versión.
- Decisiones estructurales → nuevo ADR o actualización de [architecture/architecture.md](./architecture/architecture.md).
- Cambios visuales significativos → [design-system.md](./design-system.md).

---

## Verificación final

```bash
npm run check
```

Este comando ejecuta: formato → lint → typecheck → tests (117) → build.

Un PR debe pasar `npm run check` sin errores.
