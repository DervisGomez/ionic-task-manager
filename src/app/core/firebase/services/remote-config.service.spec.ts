import { TestBed } from '@angular/core/testing';
import { RemoteConfig } from '@angular/fire/remote-config';

import { environment } from '@env/environment';

import { RemoteConfigKeys } from '../remote-config.keys';
import { RemoteConfigClient } from './remote-config.client';
import { isFirebaseConfigured, RemoteConfigService } from './remote-config.service';

describe('isFirebaseConfigured', () => {
  it('debe devolver false con placeholders', () => {
    expect(
      isFirebaseConfigured({
        apiKey: 'YOUR_FIREBASE_API_KEY',
        projectId: 'YOUR_FIREBASE_PROJECT_ID',
      }),
    ).toBeFalse();
  });

  it('debe devolver true con credenciales reales', () => {
    expect(
      isFirebaseConfigured({
        apiKey: 'AIzaSyExample',
        projectId: 'my-project',
      }),
    ).toBeTrue();
  });
});

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;
  let remoteConfigMock: RemoteConfig;
  let clientMock: jasmine.SpyObj<RemoteConfigClient>;

  const originalFirebase = { ...environment.firebase };

  const placeholderFirebase = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_FIREBASE_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'YOUR_FIREBASE_APP_ID',
  };

  const configuredFirebase = {
    apiKey: 'AIzaSyExample',
    authDomain: 'my-project.firebaseapp.com',
    projectId: 'my-project',
    storageBucket: 'my-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc',
  };

  beforeEach(() => {
    remoteConfigMock = {
      settings: {
        minimumFetchIntervalMillis: 0,
        fetchTimeoutMillis: 0,
      },
      defaultConfig: {},
    } as RemoteConfig;

    clientMock = jasmine.createSpyObj<RemoteConfigClient>('RemoteConfigClient', [
      'fetch',
      'activate',
      'getBoolean',
      'getString',
      'getNumber',
    ]);
    clientMock.fetch.and.resolveTo();
    clientMock.activate.and.resolveTo(true);

    TestBed.configureTestingModule({
      providers: [
        RemoteConfigService,
        { provide: RemoteConfig, useValue: remoteConfigMock },
        { provide: RemoteConfigClient, useValue: clientMock },
      ],
    });

    service = TestBed.inject(RemoteConfigService);
    Object.assign(environment.firebase, originalFirebase);
  });

  afterEach(() => {
    Object.assign(environment.firebase, originalFirebase);
  });

  describe('con Firebase sin configurar', () => {
    beforeEach(() => {
      Object.assign(environment.firebase, placeholderFirebase);
    });

    it('initialize no debe lanzar error', async () => {
      await expectAsync(service.initialize()).toBeResolved();
    });

    it('initialize no debe invocar fetch ni activate', async () => {
      await service.initialize();

      expect(clientMock.fetch).not.toHaveBeenCalled();
      expect(clientMock.activate).not.toHaveBeenCalled();
    });

    it('getters deben devolver valores por defecto', () => {
      expect(service.getBoolean('feature_enabled')).toBeFalse();
      expect(service.getString('welcome_message')).toBe('');
      expect(service.getNumber('max_items')).toBe(0);
    });

    it('enable_categories debe devolver true por defecto sin Firebase configurado', () => {
      expect(service.getBoolean(RemoteConfigKeys.enableCategories)).toBeTrue();
    });
  });

  describe('con Firebase configurado', () => {
    beforeEach(() => {
      Object.assign(environment.firebase, configuredFirebase);
    });

    it('initialize debe aplicar configuración mínima, fetch y activate', async () => {
      await service.initialize();

      expect(remoteConfigMock.settings.minimumFetchIntervalMillis).toBe(0);
      expect(remoteConfigMock.settings.fetchTimeoutMillis).toBe(60_000);
      expect(remoteConfigMock.defaultConfig).toEqual({
        [RemoteConfigKeys.enableCategories]: 'true',
      });
      expect(clientMock.fetch).toHaveBeenCalledWith(remoteConfigMock);
      expect(clientMock.activate).toHaveBeenCalledWith(remoteConfigMock);
    });

    it('initialize debe ser idempotente', async () => {
      await service.initialize();
      await service.initialize();

      expect(clientMock.fetch).toHaveBeenCalledTimes(1);
    });

    it('initialize debe fallar en silencio si fetch lanza error', async () => {
      clientMock.fetch.and.rejectWith(new Error('network'));

      await expectAsync(service.initialize()).toBeResolved();
      expect(service.getBoolean('feature_enabled')).toBeFalse();
    });

    it('initialize debe fallar en silencio si activate lanza error', async () => {
      clientMock.activate.and.rejectWith(new Error('activate failed'));

      await expectAsync(service.initialize()).toBeResolved();
      expect(service.getString('welcome_message')).toBe('');
    });

    it('getters deben delegar en el cliente tras activar la configuración', async () => {
      clientMock.getBoolean.and.returnValue(true);
      clientMock.getString.and.returnValue('Hola');
      clientMock.getNumber.and.returnValue(42);

      await service.initialize();

      expect(service.getBoolean('feature_enabled')).toBeTrue();
      expect(service.getString('welcome_message')).toBe('Hola');
      expect(service.getNumber('max_items')).toBe(42);
      expect(clientMock.getBoolean).toHaveBeenCalledWith(remoteConfigMock, 'feature_enabled');
      expect(clientMock.getString).toHaveBeenCalledWith(remoteConfigMock, 'welcome_message');
      expect(clientMock.getNumber).toHaveBeenCalledWith(remoteConfigMock, 'max_items');
    });

    it('getters deben devolver valores por defecto si el cliente lanza error', async () => {
      clientMock.getBoolean.and.throwError('read error');
      clientMock.getString.and.throwError('read error');
      clientMock.getNumber.and.throwError('read error');

      await service.initialize();

      expect(service.getBoolean('feature_enabled')).toBeFalse();
      expect(service.getString('welcome_message')).toBe('');
      expect(service.getNumber('max_items')).toBe(0);
    });
  });
});
