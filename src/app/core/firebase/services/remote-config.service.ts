import { inject, Injectable } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';

import { environment } from '@env/environment';

import { REMOTE_CONFIG_BOOLEAN_DEFAULTS } from '../remote-config.defaults';
import { RemoteConfigClient } from './remote-config.client';

/** Intervalo mínimo entre fetch en producción (1 hora). */
const PRODUCTION_MINIMUM_FETCH_INTERVAL_MS = 3_600_000;

/** Tiempo máximo de espera para un fetch de Remote Config. */
const FETCH_TIMEOUT_MS = 60_000;

/**
 * Servicio de infraestructura para Firebase Remote Config.
 *
 * Encapsula AngularFire y expone una API estable para feature flags.
 * El resto de la aplicación no debe importar `@angular/fire` directamente.
 */
@Injectable()
export class RemoteConfigService {
  private readonly remoteConfig = inject(RemoteConfig);
  private readonly remoteConfigClient = inject(RemoteConfigClient);

  private initialized = false;
  private activated = false;

  /**
   * Descarga y activa la configuración remota.
   *
   * Aplica ajustes mínimos de fetch, ejecuta `fetchConfig` y `activate`,
   * y falla en silencio si Firebase no está configurado o la red falla.
   * En ese caso los getters devuelven valores por defecto.
   */
  async initialize(): Promise<void> {
    if (this.initialized || !isFirebaseConfigured()) {
      return;
    }

    this.initialized = true;

    try {
      this.applyMinimumSettings();
      await this.remoteConfigClient.fetch(this.remoteConfig);
      await this.remoteConfigClient.activate(this.remoteConfig);
      this.activated = true;
    } catch {
      this.activated = false;
    }
  }

  /**
   * Obtiene un parámetro booleano de Remote Config.
   *
   * @param key Clave del parámetro en Firebase Console.
   * @returns Valor remoto o `false` si Remote Config no está disponible.
   */
  getBoolean(key: string): boolean {
    const fallback = REMOTE_CONFIG_BOOLEAN_DEFAULTS[key] ?? false;

    return this.readValue(
      () => this.remoteConfigClient.getBoolean(this.remoteConfig, key),
      fallback,
    );
  }

  /**
   * Obtiene un parámetro de texto de Remote Config.
   *
   * @param key Clave del parámetro en Firebase Console.
   * @returns Valor remoto o cadena vacía si Remote Config no está disponible.
   */
  getString(key: string): string {
    return this.readValue(() => this.remoteConfigClient.getString(this.remoteConfig, key), '');
  }

  /**
   * Obtiene un parámetro numérico de Remote Config.
   *
   * @param key Clave del parámetro en Firebase Console.
   * @returns Valor remoto o `0` si Remote Config no está disponible.
   */
  getNumber(key: string): number {
    return this.readValue(() => this.remoteConfigClient.getNumber(this.remoteConfig, key), 0);
  }

  private readValue<T>(reader: () => T, fallback: T): T {
    if (!isFirebaseConfigured() || !this.activated) {
      return fallback;
    }

    try {
      return reader();
    } catch {
      return fallback;
    }
  }

  private applyMinimumSettings(): void {
    this.remoteConfig.settings.minimumFetchIntervalMillis = environment.production
      ? PRODUCTION_MINIMUM_FETCH_INTERVAL_MS
      : 0;
    this.remoteConfig.settings.fetchTimeoutMillis = FETCH_TIMEOUT_MS;

    const defaultConfig: Record<string, string> = {};
    for (const key of Object.keys(REMOTE_CONFIG_BOOLEAN_DEFAULTS)) {
      defaultConfig[key] = String(REMOTE_CONFIG_BOOLEAN_DEFAULTS[key]);
    }
    this.remoteConfig.defaultConfig = defaultConfig;
  }
}

/**
 * Indica si las credenciales de Firebase fueron reemplazadas en el entorno.
 *
 * @param firebase Configuración a validar. Por defecto usa `environment.firebase`.
 */
export function isFirebaseConfigured(
  firebase: { apiKey: string; projectId: string } = environment.firebase,
): boolean {
  const isPlaceholder = (value: string): boolean => value.startsWith('YOUR_FIREBASE_');

  return !isPlaceholder(firebase.apiKey) && !isPlaceholder(firebase.projectId);
}
