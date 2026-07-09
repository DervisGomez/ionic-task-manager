# Accesibilidad — Ionic Task Manager

Este documento resume la auditoría de accesibilidad aplicada a la aplicación, con el objetivo de acercar la experiencia a **WCAG 2.2 nivel AA** (cobertura parcial, sin certificación) sin modificar la arquitectura ni el flujo funcional de la app.

## Principios aplicados

- **Perceptible**: contraste de color mejorado en placeholders y mensajes de error; iconos decorativos con `aria-hidden`.
- **Operable**: navegación completa por teclado; foco visible consistente; modales y alertas delegados a Ionic cuando es posible.
- **Comprensible**: etiquetas asociadas a controles; mensajes de error con `role="alert"`; estados comunicados con ARIA solo cuando aportan valor.
- **Robusto**: HTML semántico (`header`, `main`, `nav`, `form`, `ul`/`li`); roles ARIA alineados con el patrón correcto (p. ej. `radiogroup` en lugar de `tablist` sin paneles).

## Componentes auditados

| Componente                        | Cambios principales                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **TaskListComponent**             | `header` semántico; lista `ul`/`li`; `ariaLabel` en búsqueda; modal con `aria-describedby`; toast con `role="status"` / `role="alert"`     |
| **TaskCardComponent**             | Eliminación de roles redundantes; `aria-label` contextual en Ver más; área táctil mínima en acciones                                       |
| **TaskFormComponent**             | `aria-required`; `aria-describedby` en descripción; radiogroup con teclado; errores accesibles; título y categoría obligatorios anunciados |
| **SearchBarComponent**            | Etiqueta visualmente oculta vinculada con `aria-labelledby`; label distinto del placeholder                                                |
| **CategoryFilterComponent**       | Patrón `radiogroup` + `radio` (antes `tablist` sin `tabpanel`); `aria-checked`; roving `tabindex`                                          |
| **EmptyStateComponent**           | IDs únicos por instancia; eliminación de `role="region"` redundante                                                                        |
| **FloatingActionButtonComponent** | Sin cambios funcionales; `aria-label` obligatorio ya existente                                                                             |

## Decisiones tomadas

### Category Filter: `radiogroup` en lugar de `tablist`

El filtro cambia el contenido de la lista, pero no existen paneles de pestaña independientes. Según WAI-ARIA, el patrón adecuado es **radio button group**, no tabs. Se mantiene navegación con flechas, Enter, Espacio y foco roving.

### Lista de tareas: `ul` / `li` en lugar de `ion-list`

`ion-list` sin `ion-item` no aportaba semántica de lista. Se sustituyó por HTML nativo con estilos equivalentes para que los lectores de pantalla anuncien correctamente el número de tareas.

### Modal de formulario

- `aria-labelledby` apunta al `<h2>` del formulario (`task-form-modal-title`).
- `aria-describedby` apunta al subtítulo (`task-form-modal-description`).
- Focus trap, Escape y retorno de foco: gestionados por **Ionic `ion-modal`** sin JavaScript adicional.

### Diálogo de eliminación

`AlertController` de Ionic genera un diálogo accesible. Se conserva:

- Botón **Cancelar** con `role: 'cancel'`.
- Botón **Eliminar** con `role: 'destructive'`.
- Orden: cancelar primero, acción destructiva después.

### SearchBar: label ≠ placeholder

El placeholder no sustituye a una etiqueta accesible. Se añadió `<label class="visually-hidden">` con `id` único y el `ion-searchbar` referencia ese id mediante `aria-labelledby`. Desde la pantalla principal se pasa `ariaLabel="Buscar tareas"`.

### ARIA eliminado por redundancia

- `role="article"` en tarjetas (el título + `aria-labelledby` es suficiente).
- `role="group"` + `aria-label` en metadatos de tarjeta (el contenido se lee en orden natural).
- `role="region"` en empty state (`section` + `aria-labelledby` basta).
- `aria-label` duplicado en `<form>` (el modal ya referencia el encabezado).

## Contraste y Design System

Nuevos tokens en `variables.scss`:

- `--app-color-text-placeholder`: mayor contraste para placeholders.
- `--app-color-text-error`: mensajes de error legibles sobre fondo claro.

Todos los colores derivan del sistema de diseño existente (`color-mix` con tokens base).

## Objetivos táctiles

Área mínima aproximada de **44×44 px** en:

- Checkbox de tarjeta (`--size` con tokens de espaciado).
- Botones de acción de tarjeta (`min-width` / `min-height`).
- Chips de categoría y FAB (vía token `--app-size-touch-target`).

## Reduced Motion

Las animaciones del Motion System respetan `prefers-reduced-motion` mediante tokens anulados y `animation: none` en `theme/motion.scss`. No se modificó ese comportamiento en esta auditoría.

## Utilidad global

Clase `.visually-hidden` en `global.scss` para etiquetas accesibles sin impacto visual.

Estilos de `:focus-visible` extendidos a `ion-input` e `ion-textarea`.

## Checklist WCAG aplicado (selección)

| Criterio                         | Estado   | Notas                                                 |
| -------------------------------- | -------- | ----------------------------------------------------- |
| **1.3.1 Info and Relationships** | Mejorado | Listas, labels, fieldset/legend, headings jerárquicos |
| **1.4.3 Contrast (Minimum)**     | Mejorado | Placeholders y errores con tokens de mayor contraste  |
| **2.1.1 Keyboard**               | Mejorado | Filtros, formulario, botones, modal (Ionic)           |
| **2.4.3 Focus Order**            | OK       | Orden DOM lógico                                      |
| **2.4.7 Focus Visible**          | OK       | Outline consistente con tokens primary                |
| **2.5.5 Target Size**            | Mejorado | Acciones de tarjeta ampliadas                         |
| **3.3.1 Error Identification**   | OK       | `aria-invalid` + `role="alert"` en errores            |
| **3.3.2 Labels or Instructions** | Mejorado | Labels, helper text, required en título y categoría   |
| **4.1.2 Name, Role, Value**      | Mejorado | Radiogroup, estados `aria-checked`, modal             |
| **4.1.3 Status Messages**        | Mejorado | Toast con `role="status"` / `role="alert"`            |

## Limitaciones conocidas

1. **Cobertura WCAG parcial**: no se realizaron pruebas con lectores de pantalla reales (NVDA, VoiceOver, TalkBack) ni auditoría automatizada completa (axe, Lighthouse).
2. **`ion-*` Web Components**: la exposición al árbol de accesibilidad depende de la implementación interna de Ionic; algunos controles pueden anunciar información duplicada.
3. **Categoría obligatoria en formulario**: `categoryId` tiene `Validators.required`; el radiogroup muestra error accesible (`role="alert"`, `aria-invalid`) si el usuario envía sin seleccionar. El catálogo solo ofrece Trabajo y Personal como opciones seleccionables.
4. **Toasts**: `role="alert"` interrumpe en errores; mensajes de éxito usan `role="status"` (anuncio no intrusivo).
5. **Contraste en modo oscuro**: los tokens se optimizaron para el tema claro principal; el modo oscuro del sistema puede requerir revisión adicional.
6. **Retorno de foco al cerrar modal**: delegado a Ionic; no se añadió lógica custom de `focus restoration` para evitar duplicar comportamiento del framework.

## Verificación

```bash
npm run check
```

Incluye formato, lint, typecheck, tests unitarios (con casos de accesibilidad añadidos) y build de producción.

## Mantenimiento

Al añadir nuevos componentes interactivos:

1. Usar HTML semántico antes que ARIA.
2. Añadir ARIA solo si el rol o estado no es evidente.
3. Probar Tab / Shift+Tab / Enter / Espacio / Escape.
4. Verificar `:focus-visible` y contraste con tokens.
5. Respetar `prefers-reduced-motion` para cualquier animación nueva.
