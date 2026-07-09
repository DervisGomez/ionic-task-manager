import { Injectable } from '@angular/core';
import {
  activate,
  fetchConfig,
  getBoolean,
  getNumber,
  getString,
  RemoteConfig,
} from '@angular/fire/remote-config';

/**
 * Adaptador interno de AngularFire Remote Config.
 *
 * Aísla las funciones del SDK para facilitar pruebas sin Firebase real.
 * No debe consumirse fuera de `core/firebase`.
 */
@Injectable()
export class RemoteConfigClient {
  fetch(remoteConfig: RemoteConfig): Promise<void> {
    return fetchConfig(remoteConfig);
  }

  activate(remoteConfig: RemoteConfig): Promise<boolean> {
    return activate(remoteConfig);
  }

  getBoolean(remoteConfig: RemoteConfig, key: string): boolean {
    return getBoolean(remoteConfig, key);
  }

  getString(remoteConfig: RemoteConfig, key: string): string {
    return getString(remoteConfig, key);
  }

  getNumber(remoteConfig: RemoteConfig, key: string): number {
    return getNumber(remoteConfig, key);
  }
}
