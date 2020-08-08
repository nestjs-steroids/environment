import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

export type EnvironmentLoadingOptions = {
  loadEnvFile?: boolean;
  envFilePath?: string;
  transformOptions?: ClassTransformOptions
  validatorOptions?: ValidatorOptions
};
