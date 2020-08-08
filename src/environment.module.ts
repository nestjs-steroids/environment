import { Module, DynamicModule, Provider } from '@nestjs/common';
import { getEnvironment } from './environment.factory';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { EnvironmentLoadingOptions } from './types';

type EnvironmentModuleOptions<T = any> = {
  isGlobal?: boolean;
  useClass: Type<T>;
  useValue?: any;
} & Partial<EnvironmentLoadingOptions>;

@Module({})
export class EnvironmentModule {
  static forRoot({
    isGlobal,
    useClass,
    useValue,
    envFilePath,
    loadEnvFile,
    validatorOptions,
    transformOptions,
  }: EnvironmentModuleOptions): DynamicModule {
    const provider: Provider = useValue
      ? {
          provide: useClass,
          useValue: useValue,
        }
      : {
          provide: useClass,
          useValue: getEnvironment(useClass, {
            loadEnvFile,
            envFilePath,
            validatorOptions,
            transformOptions,
          }),
        };

    return {
      global: isGlobal,
      module: EnvironmentModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
