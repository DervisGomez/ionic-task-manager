# Proceso de releases

Este documento describe cómo publicar versiones de **Ionic Task Manager** siguiendo [Semantic Versioning](https://semver.org/lang/es/).

---

## Versionado

| Tipo      | Cuándo                                              | Ejemplo |
| --------- | --------------------------------------------------- | ------- |
| **MAJOR** | Cambios incompatibles en API pública o arquitectura | `2.0.0` |
| **MINOR** | Nueva funcionalidad compatible hacia atrás          | `1.1.0` |
| **PATCH** | Correcciones compatibles hacia atrás                | `1.0.1` |

La versión actual está definida en `package.json` (`version`) y reflejada en `CHANGELOG.md`.

---

## Checklist pre-release

Antes de etiquetar una versión:

- [ ] Todos los cambios están documentados en `CHANGELOG.md`
- [ ] `npm run check` pasa sin errores (formato, lint, typecheck, 117 tests, build)
- [ ] `README.md` y documentación en `docs/` reflejan el estado real
- [ ] `ROADMAP.md` actualizado si cambia el plan de sprints
- [ ] ADRs creados o actualizados para decisiones arquitectónicas relevantes
- [ ] No hay secretos ni credenciales en el repositorio

---

## Pasos para publicar

### 1. Preparar la rama

```bash
git checkout main
git pull origin main
```

### 2. Actualizar versión

Editar `package.json`:

```json
"version": "1.1.0"
```

### 3. Actualizar CHANGELOG

Añadir una nueva sección en `CHANGELOG.md` siguiendo el formato existente:

```markdown
## [1.1.0] — YYYY-MM-DD

### Added

- ...

### Changed

- ...
```

Categorías usadas en v1.0.0: Added, Changed, Improved, Accessibility, Documentation, Testing, Architecture.

### 4. Verificar calidad

```bash
npm run check
```

### 5. Commit de release

```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): v1.1.0"
```

### 6. Crear tag

```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0
```

### 7. Publicar artefacto (opcional)

```bash
npm run build
```

El output de producción queda en `www/`. Para despliegue web, publicar el contenido de `www/` en el hosting elegido.

Para builds nativos con Capacitor:

```bash
npx cap sync
```

---

## Notas de release

Para versiones mayores, crear o actualizar un documento de resumen en `docs/`:

```text
docs/RELEASE-vX.Y.Z.md
```

Incluir: funcionalidades, cambios arquitectónicos, métricas de tests y próximos pasos del roadmap.

Ejemplo existente: [RELEASE-v1.0.0.md](./RELEASE-v1.0.0.md)

---

## Hotfix

Para correcciones urgentes en producción:

1. Crear rama `hotfix/<descripcion>` desde el tag de la versión afectada.
2. Aplicar el fix mínimo.
3. Incrementar versión PATCH (`1.0.1`).
4. Actualizar `CHANGELOG.md`, ejecutar `npm run check`, tag y push.

---

## Post-release

- Actualizar `ROADMAP.md` marcando sprints completados.
- Abrir issues o milestones para la siguiente iteración.
- Comunicar cambios breaking en el README si aplica.

---

## Referencias

- [CHANGELOG.md](../CHANGELOG.md)
- [ROADMAP.md](../ROADMAP.md)
- [Guía de contribución](./contributing.md)
