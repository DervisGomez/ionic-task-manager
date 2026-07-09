# Design System — Ionic Task Manager

Sistema visual consolidado para mantener consistencia, reutilización y extensibilidad en módulos futuros (Categorías, Usuarios, Dashboard).

Los tokens viven en `src/theme/` y se cargan globalmente vía `angular.json` (`variables.scss`) y `global.scss` (`motion.scss`).

---

## Design Tokens

### Colores

Definidos en `src/theme/_colors.scss`.

| Token                                            | Uso                                                |
| ------------------------------------------------ | -------------------------------------------------- |
| `--ion-color-primary`                            | Acciones principales, enlaces, chips seleccionados |
| `--ion-color-success` / `--warning` / `--danger` | Estados semánticos                                 |
| `--ion-background-color`                         | Fondo de la aplicación                             |
| `--ion-text-color`                               | Texto base de Ionic                                |
| `--app-color-surface`                            | Tarjetas, inputs, modales                          |
| `--app-color-text-primary`                       | Títulos y texto principal                          |
| `--app-color-text-secondary`                     | Subtítulos, descripciones, meta                    |
| `--app-color-text-placeholder`                   | Placeholders de formulario y búsqueda              |
| `--app-color-text-error`                         | Mensajes de validación                             |
| `--app-color-border`                             | Bordes de tarjetas, inputs y separadores           |

### Spacing

Escala base en `src/theme/_spacing.scss`:

| Token               | Valor |
| ------------------- | ----- |
| `--app-spacing-xs`  | 4px   |
| `--app-spacing-sm`  | 8px   |
| `--app-spacing-md`  | 16px  |
| `--app-spacing-lg`  | 24px  |
| `--app-spacing-xl`  | 32px  |
| `--app-spacing-2xl` | 40px  |
| `--app-spacing-3xl` | 48px  |

Tamaños derivados para layout y accesibilidad:

| Token                            | Uso                                    |
| -------------------------------- | -------------------------------------- |
| `--app-size-touch-target`        | Mínimo 44px en controles interactivos  |
| `--app-size-input-min-height`    | Altura mínima de inputs y searchbar    |
| `--app-size-checkbox`            | Checkbox en TaskCard                   |
| `--app-size-pill-height`         | Badges y pills                         |
| `--app-size-empty-icon`          | Icono del EmptyState                   |
| `--app-size-empty-text-max`      | Ancho máximo de texto en EmptyState    |
| `--app-size-empty-container-max` | Ancho máximo del contenedor EmptyState |

### Typography

Definidos en `src/theme/_typography.scss`.

**Escala primitiva:** `--app-font-size-xs` … `--app-font-size-2xl`  
**Pesos:** `--app-font-weight-regular` … `--app-font-weight-bold`  
**Interlineado:** `--app-line-height-tight` / `normal` / `relaxed`  
**Familia:** `--app-font-family-base`

**Roles semánticos** (preferir estos en componentes):

| Token                      | Uso típico                                           |
| -------------------------- | ---------------------------------------------------- |
| `--app-text-display`       | Iconos grandes decorativos                           |
| `--app-text-title-page`    | Título de página (PageHeader, formulario en desktop) |
| `--app-text-title-section` | Títulos de sección y tarjetas en tablet+             |
| `--app-text-body`          | Texto principal                                      |
| `--app-text-body-sm`       | Descripciones, subtítulos                            |
| `--app-text-label`         | Labels de formulario, botones                        |
| `--app-text-caption`       | Helper text, errores, badges                         |
| `--app-text-chip`          | Chips y filtros de categoría                         |

### Elevation

Definidos en `src/theme/_elevation.scss`.

| Token                       | Uso                                                 |
| --------------------------- | --------------------------------------------------- |
| `--app-shadow-sm`           | Tarjetas en reposo, chips seleccionados, FAB activo |
| `--app-shadow-md`           | Hover de tarjetas, FAB en reposo, `ion-card` global |
| `--app-shadow-lg`           | Modales, hover del FAB                              |
| `--app-shadow-focus`        | Anillo de foco en inputs y searchbar                |
| `--app-shadow-focus-danger` | Foco en campos con error                            |

### Radius

Escala en `src/theme/_radius.scss`. No usar valores arbitrarios.

| Token               | Valor  | Uso                            |
| ------------------- | ------ | ------------------------------ |
| `--app-radius-xs`   | 4px    | Acento lateral en TaskCard     |
| `--app-radius-sm`   | 8px    | Badges, checkbox               |
| `--app-radius-md`   | 12px   | Botones Ionic (`ion-button`)   |
| `--app-radius-lg`   | 16px   | Tarjetas, inputs, searchbar    |
| `--app-radius-xl`   | 24px   | Modales                        |
| `--app-radius-pill` | 9999px | CategoryFilter chips           |
| `--app-radius-full` | 50%    | Contenedor de icono EmptyState |

### Motion

Tokens en `src/theme/_motion-tokens.scss`. Comportamientos y keyframes en `src/theme/motion.scss`.

| Token                                                | Valor / uso                                            |
| ---------------------------------------------------- | ------------------------------------------------------ |
| `--app-duration-fast`                                | 150ms — interacciones (hover, focus, tap)              |
| `--app-duration-medium`                              | 200ms — entradas y énfasis                             |
| `--app-transition-interactive`                       | Transiciones de controles (obligatorio en componentes) |
| `--app-transition-emphasis`                          | Entradas de lista, modales, empty state                |
| `--app-easing-standard`                              | Curva por defecto                                      |
| `--app-easing-enter`                                 | Entradas y modales                                     |
| `--app-enter-delay`                                  | Stagger de tarjetas en TaskList                        |
| `--app-focus-ring-width` / `--app-focus-ring-offset` | Anillo de foco accesible                               |

**Keyframes globales:** `app-enter-rise`, `app-fade-in`, `app-modal-enter`.

Con `prefers-reduced-motion: reduce`, las duraciones se anulan a `0ms` y las animaciones se desactivan.

---

## Componentes

Componentes reutilizables que consumen el mismo sistema de tokens.

### TaskCard

- **Spacing:** padding `--app-spacing-md` (mobile) / `--app-spacing-lg` (tablet+)
- **Radius:** `--app-radius-lg` contenedor; `--app-radius-sm` badges
- **Shadow:** `--app-shadow-sm` → `--app-shadow-md` en hover
- **Typography:** `--app-text-body` título; `--app-text-body-sm` descripción; `--app-text-caption` meta
- **Motion:** `--app-transition-interactive` en hover y estado completado

### TaskForm

- **Spacing:** gaps `--app-spacing-xl` / `--app-spacing-2xl`; acciones con borde superior
- **Radius:** `--app-radius-lg` inputs; `--app-radius-md` chips de categoría
- **Shadow:** `--app-shadow-focus` / `--app-shadow-focus-danger`
- **Typography:** roles `--app-text-title-*`, `--app-text-label`, `--app-text-caption`, `--app-text-chip`
- **Motion:** transiciones interactivas en inputs y chips

### EmptyState

- **Spacing:** padding `--app-spacing-2xl`; márgenes entre icono, título y CTA
- **Radius:** `--app-radius-full` en icono
- **Typography:** `--app-text-title-section`, `--app-text-body-sm`, `--app-text-label`
- **Motion:** `app-fade-in` con `--app-transition-emphasis`

### SearchBar

- **Spacing:** `margin-bottom: --app-spacing-xl`
- **Radius:** `--app-radius-lg`
- **Shadow:** `--app-shadow-focus` al enfocar
- **Typography:** hereda placeholder y color de tokens de texto

### CategoryFilter

- **Spacing:** gap `--app-spacing-sm`; padding horizontal en chips
- **Radius:** `--app-radius-pill`
- **Shadow:** `--app-shadow-sm` en chip seleccionado
- **Typography:** `--app-text-chip`
- **Motion:** `--app-transition-interactive` en todos los estados

### FloatingActionButton (FAB)

- **Spacing:** offset inferior con `--app-spacing-*` + safe area
- **Shadow:** `--app-shadow-md` → `--app-shadow-lg` en hover
- **Typography:** icono con `--app-text-title-section`
- **Motion:** transform y box-shadow con `--app-transition-interactive`

### PageHeader

- **Spacing:** `margin-bottom: --app-spacing-2xl`
- **Typography:** `--app-text-title-page` + `--app-text-body-sm` subtítulo

---

## Principios

### Consistencia

Un solo origen de verdad en `src/theme/`. Los componentes referencian tokens semánticos (`--app-text-body`, `--app-shadow-md`) en lugar de valores literales. La escala de spacing, radius y tipografía es finita y predecible.

### Mobile First

Estilos base para viewport estrecho; progresión en `768px` (tablet) y `1024px` (desktop). Contenedores con `max-width` derivados de `--app-spacing-*`. Sin lógica responsive en TypeScript.

### Accesibilidad

- Área táctil mínima `--app-size-touch-target` (44px)
- Foco visible con `--app-focus-ring-*` y sombras de foco tokenizadas
- Contraste en `--app-color-text-placeholder` y `--app-color-text-error`
- Utilidad `.visually-hidden` en `global.scss`
- Ver también [accessibility.md](./accessibility.md)

### Motion

Interacciones rápidas (150ms) con `--app-transition-interactive`. Entradas y modales (200ms) con `--app-transition-emphasis` o keyframes globales. Respeto de `prefers-reduced-motion`.

### Responsive

Breakpoints fijos: `768px` y `1024px`. Padding, tipografía y anchos de modal/dialog escalan con tokens. Listas y formularios se centran con anchos máximos calculados desde spacing.

---

## Estructura de archivos

```
src/theme/
  variables.scss      # Barrel — importa todos los partials
  _colors.scss
  _spacing.scss
  _radius.scss
  _elevation.scss
  _typography.scss
  _motion-tokens.scss
  motion.scss         # Keyframes, botones globales, reduced motion

src/global.scss       # Reset, Ionic overrides, a11y, import motion
```

Al añadir un nuevo módulo, importar solo estilos de componente y consumir tokens existentes antes de definir valores nuevos.
