import { RemoteConfigKeys } from './remote-config.keys';

/**
 * Valores por defecto de parámetros booleanos cuando Remote Config no está disponible.
 */
export const REMOTE_CONFIG_BOOLEAN_DEFAULTS: Readonly<Record<string, boolean>> = {
  [RemoteConfigKeys.enableCategories]: true,
};
