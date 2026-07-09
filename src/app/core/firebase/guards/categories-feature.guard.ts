import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RemoteConfigKeys } from '../remote-config.keys';
import { RemoteConfigService } from '../services/remote-config.service';

/**
 * Impide el acceso a `/categories` cuando el feature flag está deshabilitado.
 */
export const categoriesFeatureGuard: CanActivateFn = () => {
  const remoteConfig = inject(RemoteConfigService);
  const router = inject(Router);

  if (remoteConfig.getBoolean(RemoteConfigKeys.enableCategories)) {
    return true;
  }

  return router.createUrlTree(['/tasks']);
};
