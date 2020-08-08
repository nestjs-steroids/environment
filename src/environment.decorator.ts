import { ENVIRONMENT_METAKEY } from './environment-metakey.const';
import { MetadataPayload } from './types';

function defineMetadata(
  target: object,
  propertyKey: string,
  environmentName: string,
) {
  const oldMetadata = Reflect.getMetadata(
    ENVIRONMENT_METAKEY,
    target,
  ) as MetadataPayload;
  const newMetadata: MetadataPayload = {
    ...oldMetadata,
    [propertyKey]: environmentName,
  };
  Reflect.defineMetadata(ENVIRONMENT_METAKEY, newMetadata, target);
}

export function Env(name?: string): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const environmentName =
      name ??
      propertyKey
        .toString()
        .split(/(?=[A-Z])/)
        .join('_')
        .toUpperCase();

    defineMetadata(target, propertyKey.toString(), environmentName);
  };
}
