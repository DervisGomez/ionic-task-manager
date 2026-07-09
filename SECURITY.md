# Política de seguridad

## Versiones soportadas

| Versión | Soportada |
| ------- | --------- |
| 1.0.x   | Sí        |
| < 1.0   | No        |

La versión actual se define en `package.json` y se documenta en [CHANGELOG.md](CHANGELOG.md).

## Alcance del proyecto

**Ionic Task Manager** es una aplicación frontend (Angular + Ionic) con persistencia **in-memory**. En v1.0.0 no hay backend propio ni autenticación de usuarios.

Reportes relevantes incluyen, entre otros:

- Vulnerabilidades en dependencias del proyecto
- Exposición accidental de secretos o credenciales en el repositorio
- Problemas de seguridad en el código de la aplicación (XSS, inyección, etc.)

## Cómo reportar una vulnerabilidad

**No abras un issue público** si el reporte puede incluir información sensible o explotable.

1. Contacta al mantenedor de forma privada: **Dervis Gómez** — [dervisgomez.dev](https://dervisgomez.dev/)
2. Incluye:
   - Descripción del problema
   - Pasos para reproducirlo
   - Versión afectada (`package.json`)
   - Impacto estimado

## Qué esperar

- Confirmación de recepción del reporte
- Evaluación del impacto en el proyecto
- Corrección o mitigación según la gravedad del hallazgo
- Actualización de `CHANGELOG.md` cuando se publique un fix (versión PATCH según [docs/releases.md](docs/releases.md))

## Buenas prácticas para contribuidores

Antes de abrir un PR, verifica que no introduces secretos ni credenciales. El checklist de release en [docs/releases.md](docs/releases.md) incluye esta comprobación.
