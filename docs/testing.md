# Estrategia de pruebas

Este documento describe cómo se prueba **Ionic Task Manager**, qué áreas cubren las pruebas y cómo ejecutarlas.

---

## Filosofía

El proyecto adopta **pruebas unitarias** como principal mecanismo de calidad:

1. **Aislar capas** — el dominio se prueba sin UI; los componentes se prueban con dependencias mockeadas.
2. **Probar comportamiento** — se verifican resultados observables (estado, emisiones, DOM), no detalles internos frágiles.
3. **Confianza en refactors** — la arquitectura por capas facilita cambiar infraestructura sin romper los casos de uso ni los contratos del dominio.
4. **Accesibilidad como contrato** — tests verifican atributos ARIA, roles y asociaciones de etiquetas donde aplica.

No hay tests end-to-end en el estado actual del proyecto. La cobertura se concentra en casos de uso, repositorio y componentes de presentación.

---

## Stack

| Herramienta     | Rol                                                    |
| --------------- | ------------------------------------------------------ |
| Jasmine         | Framework de aserciones y estructura `describe` / `it` |
| Karma           | Test runner en navegador                               |
| Angular TestBed | Configuración de módulos y componentes en aislamiento  |
| ChromeHeadless  | Navegador en CI (`npm run test:ci`)                    |

---

## Qué se prueba

### Dominio (`domain/use-cases/`)

| Archivo                        | Enfoque                                         |
| ------------------------------ | ----------------------------------------------- |
| `create-task.use-case.spec.ts` | Creación de entidad y delegación al repositorio |
| `update-task.use-case.spec.ts` | Actualización de campos y persistencia          |
| `delete-task.use-case.spec.ts` | Eliminación por identificador                   |
| `get-tasks.use-case.spec.ts`   | Obtención del listado                           |

Los casos de uso se prueban con un **mock de `TaskRepository`**, sin Angular salvo la inyección mínima.

### Datos (`data/repositories/`)

| Archivo                             | Enfoque                                 |
| ----------------------------------- | --------------------------------------- |
| `in-memory-task.repository.spec.ts` | CRUD en memoria, integridad del almacén |

### Presentación

| Archivo                       | Enfoque                                 |
| ----------------------------- | --------------------------------------- |
| `task.facade.spec.ts`         | Orquestación, filtros, búsqueda, estado |
| `task.mapper.spec.ts`         | Transformación `Task` → `TaskViewModel` |
| `task-card.component.spec.ts` | Renderizado, eventos, accesibilidad     |
| `task-form.component.spec.ts` | Validación, emisión de comandos, ARIA   |
| `task-list.component.spec.ts` | Integración de pantalla, modal, toast   |

### Shared (`shared/components/`)

| Componente               | Enfoque                                 |
| ------------------------ | --------------------------------------- |
| `search-bar`             | Emisión de búsqueda, etiqueta accesible |
| `category-filter`        | Selección, teclado, `radiogroup`        |
| `empty-state`            | Renderizado, IDs únicos, CTA            |
| `page-header`            | Título y subtítulo                      |
| `floating-action-button` | Emisión de clic, `aria-label`           |

### Aplicación

| Archivo                 | Enfoque                           |
| ----------------------- | --------------------------------- |
| `app.component.spec.ts` | Bootstrap básico de la aplicación |

---

## Métricas actuales

| Métrica         | Valor             |
| --------------- | ----------------- |
| Tests unitarios | **117**           |
| Comando CI      | `npm run test:ci` |
| Navegador CI    | ChromeHeadless    |

---

## Cómo ejecutar

### Modo desarrollo (watch)

```bash
npm test
```

Abre Karma en el navegador y recarga al guardar cambios.

### Modo CI (sin watch)

```bash
npm run test:ci
```

Usado por `npm run check`. Debe terminar con `117 SUCCESS`.

### Pipeline completo

```bash
npm run check
```

Incluye formato, lint, typecheck, tests y build de producción.

---

## Convenciones para nuevos tests

1. **Ubicación** — el `.spec.ts` vive junto al archivo que prueba.
2. **Nombres** — describe el comportamiento en español o inglés de forma legible:

   ```typescript
   it('debe filtrar tareas por categoría Personal', () => { ... });
   ```

3. **Arrange – Act – Assert** — estructura clara en cada test.
4. **Mocks mínimos** — solo lo necesario; preferir spies sobre stubs complejos.
5. **Sin lógica en tests** — evita condicionales o bucles en el cuerpo del test.
6. **Accesibilidad** — cuando el componente expone ARIA, verifica atributos relevantes.

---

## Qué no se prueba (estado actual)

- Integración con backend real (persistencia in-memory).
- Tests end-to-end (Cypress / Playwright).
- Rendimiento visual o regresión de screenshots.
- Cobertura de código como umbral obligatorio en CI.

Estas áreas están planificadas para evoluciones futuras (Sprint 7+).

---

## Solución de problemas

### ChunkLoadError en Karma

Error intermitente al cargar chunks de Ionic en headless. Reejecutar:

```bash
npm run test:ci
```

### Tests de componentes Ionic

Importa `IonicModule` o los componentes standalone necesarios en el `TestBed.configureTestingModule`.

---

## Referencias

- [Guía de contribución](./contributing.md)
- [Arquitectura — Testing Strategy](./architecture/architecture.md#testing-strategy)
