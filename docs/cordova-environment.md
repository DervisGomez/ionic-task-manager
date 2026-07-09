# Cordova — entorno nativo

Guía para descargar el APK oficial y compilar nuevas versiones en Android e iOS. Cordova consume el build web en `www/` **sin modificar** el código Angular/Ionic.

> **Alternativa sin compilar:** la [demo web en Firebase Hosting](https://ionic-task-manager-9e74b.web.app) permite validar la aplicación directamente desde el navegador, con la misma versión del código fuente.

---

## Descargar el APK oficial

La versión estable **v1.0.0** está publicada en [GitHub Releases](https://github.com/DervisGomez/ionic-task-manager/releases/tag/v1.0.0).

- APK generado con Cordova y validado en dispositivo Android físico.
- Instalable directamente sin compilar el proyecto.

Las secciones siguientes documentan el **proceso de compilación** para quienes deseen generar una nueva versión en local.

---

## Requisitos

### Comunes

| Herramienta | Versión                            |
| ----------- | ---------------------------------- |
| Node.js     | ≥ 20.17                            |
| npm         | ≥ 10                               |
| Cordova CLI | 13 (incluido en `devDependencies`) |

### Android

| Herramienta          | Versión               |
| -------------------- | --------------------- |
| JDK                  | 17+ (21 compatible)   |
| Android SDK Platform | 36                    |
| Android Build Tools  | 36.x                  |
| `ANDROID_HOME`       | Ruta al Android SDK   |
| `JAVA_HOME`          | Recomendado explícito |

### iOS (solo macOS)

| Herramienta   | Versión |
| ------------- | ------- |
| macOS + Xcode | 15+     |
| CocoaPods     | 1.16+   |
| ios-deploy    | 1.12.2+ |
| cordova-ios   | 8       |

> **Limitación:** no es posible generar un IPA desde Linux. La compilación iOS requiere macOS con Xcode.

---

## Verificación del entorno

```bash
node -v
npm -v
java -version
echo $ANDROID_HOME
echo $JAVA_HOME
npx cordova -v
```

Configurar `JAVA_HOME` si no está definido:

```bash
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export PATH="$JAVA_HOME/bin:$PATH"
```

---

## Instalación del proyecto

```bash
git clone <url-del-repositorio>
cd ionic-task-manager
npm install
```

Cordova ya está en el proyecto. Instalación global opcional: `npm install -g cordova@13`.

---

## Plugin WebView

`cordova-plugin-ionic-webview` sirve la app desde `https://localhost` y soporta el routing SPA de Angular sin cambios en el código fuente.

---

## Android

> El APK oficial de v1.0.0 ya está disponible en [GitHub Releases](https://github.com/DervisGomez/ionic-task-manager/releases/tag/v1.0.0). Esta sección describe cómo compilar localmente.

### Primera vez — añadir plataforma

```bash
npx cordova platform add android@15.0.0
```

### Compilar APK debug (desarrollo local)

```bash
npm run android
```

Equivalente a `npm run build:native` + `cordova build android`.

**Salida:**

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar en dispositivo o emulador

```bash
npm run android:run
```

### APK release

Requiere keystore y firma:

```bash
npm run build:native
npx cordova build android --release
```

---

## iOS

En macOS:

```bash
npm install
npx cordova platform add ios@8.0.0
npm run build:native
npx cordova build ios
open platforms/ios/*.xcworkspace
```

En Xcode:

1. **Signing & Capabilities** — seleccionar Apple Developer Team.
2. **Product → Archive** — distribución TestFlight o App Store.

---

## Scripts npm

| Script                 | Acción                                   |
| ---------------------- | ---------------------------------------- |
| `npm run build:native` | `ng build` + `cordova prepare`           |
| `npm run android`      | Build web + APK debug                    |
| `npm run android:run`  | Build + instala y ejecuta en dispositivo |

---

## Troubleshooting

### `JAVA_HOME` no configurado

Gradle puede fallar o usar un JDK inesperado. Exportar `JAVA_HOME` antes de compilar (ver arriba).

### Plataforma Android no encontrada

```bash
npx cordova platform add android@15.0.0
```

### `ANDROID_HOME` incorrecto

Debe apuntar al directorio raíz del SDK (contiene `platforms/`, `build-tools/`).

### Routing no funciona en WebView

Verificar que `cordova-plugin-ionic-webview` esté instalado (`config.xml` / `package.json`).

### Build iOS en Linux

No soportado. Usar macOS o CI con runner macOS.

### Capacitor en `package.json`

Dependencias Capacitor conviven temporalmente; no afectan el build Cordova. Pueden retirarse si solo se usa Cordova.

---

## Referencias

- [Cordova CLI 13](https://cordova.apache.org/announcements/2025/11/25/cordova-cli-13.0.0.html)
- [cordova-android 15](https://cordova.apache.org/announcements/2026/03/06/cordova-android-15.0.0.html)
- [cordova-ios 8](https://cordova.apache.org/announcements/2025/11/23/cordova-ios-8.0.0.html)
