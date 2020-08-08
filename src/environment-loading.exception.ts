import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { ENVIRONMENT_METAKEY } from './environment-metakey.const';
import { MetadataPayload } from './types';

export class EnvironmentLoadingException extends Error {
  constructor(private readonly errors: ValidationError[]) {
    super();

    this.message = errors
      .map(e => {
        const constraintsMessage = Object.values(e.constraints ?? {})
          .map(c => `  ${c}`)
          .join('\n');

        const environmentName = (Reflect.getMetadata(
          ENVIRONMENT_METAKEY,
          e.target as object,
        ) as MetadataPayload)[e.property];

        return environmentName + '\n' + constraintsMessage;
      })
      .join('\n');
  }
}