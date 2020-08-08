import { classToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ENVIRONMENT_METAKEY } from './environment-metakey.const';
import { EnvironmentLoadingException } from './environment-loading.exception';
import {
  EnvironmentConstructor,
  EnvironmentLoadingOptions,
  MetadataPayload,
} from './types';

export function getEnvironment<T extends object>(
  constructor: EnvironmentConstructor<T>,
  options?: EnvironmentLoadingOptions,
): T {
  if (options?.loadEnvFile) {
    require('dotenv').config({ path: options?.envFilePath });
  }

  let instance = new constructor() as { [key: string]: any };

  const metadata = Reflect.getMetadata(
    ENVIRONMENT_METAKEY,
    instance,
  ) as MetadataPayload;

  if (!metadata) {
    return instance as T;
  }

  for (const [key, environmentName] of Object.entries(metadata)) {
    instance[key] = process.env[environmentName] ?? instance[key];
  }

  instance = classToClass(instance, options?.transformOptions);

  const errors = validateSync(instance, options?.validatorOptions);

  if (errors?.length > 0) {
    throw new EnvironmentLoadingException(errors);
  }

  return instance as T;
}
