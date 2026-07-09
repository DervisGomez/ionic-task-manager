# ADR-001: Angular Dependency Injection dentro del Dominio

## Estado

✅ Accepted

---

## Contexto

Los casos de uso (`Use Cases`) forman parte de la capa de dominio y necesitan ser instanciados mediante el sistema de Dependency Injection de Angular para simplificar la composición del módulo `Tasks`.

En una implementación estricta de Clean Architecture o Arquitectura Hexagonal, el dominio debería ser completamente independiente del framework y no tendría dependencias hacia Angular.

Sin embargo, esta prueba técnica prioriza la simplicidad, la legibilidad y el tiempo de desarrollo sin sacrificar la separación entre dominio, presentación e infraestructura.

---

## Decisión

Se acepta utilizar `@Injectable()` en los casos de uso del dominio.

Los casos de uso **no utilizan** ninguna otra característica de Angular aparte del mecanismo de inyección de dependencias.

La composición de dependencias se centraliza en:

```
features/tasks/tasks.providers.ts
```

registrando el contrato:

```
TaskRepository
```

y resolviendo su implementación concreta:

```
InMemoryTaskRepository
```

---

## Consecuencias

### Ventajas

- Reduce la complejidad de la composición del proyecto.
- Evita crear fábricas o Composition Roots adicionales.
- Mantiene una integración natural con Angular.
- Facilita las pruebas unitarias mediante inyección de dependencias.
- Permite reemplazar fácilmente la implementación del repositorio.

### Desventajas

- El dominio adquiere un acoplamiento mínimo con Angular mediante `@Injectable()`.
- Los casos de uso dejan de ser completamente agnósticos al framework.

---

## Alternativas consideradas

### Opción 1 (Seleccionada)

Utilizar `@Injectable()` en los casos de uso y registrar las dependencias mediante `tasks.providers.ts`.

**Resultado:** simplicidad, legibilidad y bajo costo de mantenimiento.

---

### Opción 2

No utilizar Angular DI en el dominio.

Crear manualmente todos los casos de uso desde un Composition Root externo.

**Ventaja**

- Dominio completamente independiente del framework.

**Desventaja**

- Mayor complejidad para una prueba técnica.
- Más clases de infraestructura.
- Más código de composición.

---

## Justificación

Se considera que el acoplamiento introducido es mínimo y controlado.

La decisión favorece la claridad de la arquitectura sin comprometer la separación entre dominio, infraestructura y presentación.

En un proyecto empresarial con múltiples bounded contexts o una Arquitectura Hexagonal estricta, esta decisión podría revisarse.

---

## Revisión futura

Cuando el proyecto evolucione hacia una arquitectura completamente agnóstica del framework, los casos de uso podrán eliminar la dependencia de Angular y ser instanciados desde un Composition Root externo sin modificar su comportamiento.
