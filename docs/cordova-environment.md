# Requisitos del entorno de desarrollo nativo (Cordova)

Documento generado durante la integración Cordova. Ver también la sección **Cordova (Android / iOS)** en [README.md](../README.md).

## Verificación rápida

```bash
node -v    # >= 20.17.0 (recomendado: 22.x LTS)
npm -v     # >= 10
java -version   # JDK 17+ (21 compatible)
echo $ANDROID_HOME
echo $JAVA_HOME   # recomendado configurarlo explícitamente
```

## Estado del entorno (última verificación)

| Herramienta              | Requisito Cordova 13 / android@15 | Detectado                   | Estado                              |
| ------------------------ | --------------------------------- | --------------------------- | ----------------------------------- |
| Node.js                  | `>= 20.17.0 \|\| >= 22.9.0`       | v22.22.0                    | OK                                  |
| npm                      | `>= 10`                           | 10.8.2                      | OK                                  |
| Java (JDK)               | 17+                               | OpenJDK 21.0.11             | OK                                  |
| `JAVA_HOME`              | Recomendado                       | No configurado              | **Configurar**                      |
| Android SDK Platform 36  | Obligatorio                       | android-36 instalado        | OK                                  |
| Android Build Tools 36.x | Obligatorio                       | 36.1.0 instalado            | OK                                  |
| Gradle (global)          | Cordova usa wrapper del proyecto  | 8.7 global                  | OK (wrapper en `platforms/android`) |
| `ANDROID_HOME`           | Obligatorio                       | `/home/usuario/Android/Sdk` | OK                                  |

## Requisitos faltantes o recomendados

### 1. `JAVA_HOME` (recomendado)

Cordova/Android Gradle Plugin localiza Java automáticamente en muchos entornos, pero se recomienda exportar `JAVA_HOME` antes de compilar:

```bash
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export PATH="$JAVA_HOME/bin:$PATH"
```

Añadir al `~/.bashrc` o `~/.profile` para persistencia.

### 2. iOS (solo macOS)

Para generar IPA no es posible compilar en Linux. Requisitos en macOS:

| Herramienta | Versión mínima                   |
| ----------- | -------------------------------- |
| macOS       | Versión compatible con Xcode 15+ |
| Xcode       | 15+                              |
| CocoaPods   | 1.16+                            |
| ios-deploy  | 1.12.2+                          |
| Node.js     | 20.17+                           |
| Cordova CLI | 13                               |
| cordova-ios | 8                                |

```bash
# En macOS, tras clonar el repo:
npm install
npx cordova platform add ios@8.0.0
npm run build:native
npx cordova build ios
```

La firma de código y la subida a App Store Connect se realizan desde Xcode (Apple Developer account requerida).

### 3. Android Studio (opcional)

No es obligatorio para compilar por CLI si `ANDROID_HOME` y las SDK están instaladas. Android Studio Ladybug o superior facilita depuración en emulador/dispositivo.

## Referencias

- [Cordova CLI 13](https://cordova.apache.org/announcements/2025/11/25/cordova-cli-13.0.0.html)
- [cordova-android 15](https://cordova.apache.org/announcements/2026/03/06/cordova-android-15.0.0.html)
- [cordova-ios 8](https://cordova.apache.org/announcements/2025/11/23/cordova-ios-8.0.0.html)
