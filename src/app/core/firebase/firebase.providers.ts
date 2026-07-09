import { APP_INITIALIZER, EnvironmentProviders, Provider } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

import { environment } from '@env/environment';

import { RemoteConfigClient } from './services/remote-config.client';
import { RemoteConfigService } from './services/remote-config.service';

/**
 * Composition root de Firebase.
 *
 * Centraliza la inicialización de AngularFire para Remote Config.
 * No registrar Firebase directamente en AppModule: importar y extender
 * `FIREBASE_PROVIDERS` y `FIREBASE_APP_PROVIDERS` en el array de providers.
 */
export const FIREBASE_PROVIDERS: EnvironmentProviders[] = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideRemoteConfig(() => getRemoteConfig()),
];

export const FIREBASE_APP_PROVIDERS: Provider[] = [
  RemoteConfigClient,
  RemoteConfigService,
  {
    provide: APP_INITIALIZER,
    useFactory: (remoteConfigService: RemoteConfigService) => () =>
      remoteConfigService.initialize(),
    deps: [RemoteConfigService],
    multi: true,
  },
];
