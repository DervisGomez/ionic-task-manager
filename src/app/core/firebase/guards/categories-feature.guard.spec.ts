import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { RemoteConfigKeys } from '../remote-config.keys';
import { RemoteConfigService } from '../services/remote-config.service';
import { categoriesFeatureGuard } from './categories-feature.guard';

describe('categoriesFeatureGuard', () => {
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let router: Router;

  beforeEach(() => {
    remoteConfigSpy = jasmine.createSpyObj<RemoteConfigService>('RemoteConfigService', [
      'getBoolean',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        {
          provide: Router,
          useValue: {
            createUrlTree: jasmine
              .createSpy('createUrlTree')
              .and.callFake((commands: string[]) => ({ toString: () => commands.join('/') })),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('debe permitir el acceso cuando enable_categories es true', () => {
    remoteConfigSpy.getBoolean.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      categoriesFeatureGuard({} as never, {} as never),
    );

    expect(remoteConfigSpy.getBoolean).toHaveBeenCalledWith(RemoteConfigKeys.enableCategories);
    expect(result).toBeTrue();
  });

  it('debe redirigir a /tasks cuando enable_categories es false', () => {
    remoteConfigSpy.getBoolean.and.returnValue(false);
    const urlTree = { toString: () => '/tasks' } as UrlTree;
    (router.createUrlTree as jasmine.Spy).and.returnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      categoriesFeatureGuard({} as never, {} as never),
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/tasks']);
    expect(result).toBe(urlTree);
  });
});
