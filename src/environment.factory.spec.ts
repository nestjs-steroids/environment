import 'reflect-metadata';
import { Env } from './environment.decorator';
import { getEnvironment } from './environment.factory';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

describe('getEnvironment factory', () => {
  it('should factory make instance of class', () => {
    class Environment {
      @Env()
      port = 1337;
    }

    const env = getEnvironment<Environment>(Environment)
    expect(env).toBeInstanceOf(Environment)
  })

  it('should load environment variables from .env', () => {
    class Environment {
      @Env()
      port!: string;
    }

    const env = getEnvironment<Environment>(Environment, {
      loadEnvFile: true,
      envFilePath: '.env.test',
    });
    expect(env.port).toBe('1337');
  });

  it('should run validation on environment variables', () => {
    class Environment {
      @Env()
      @IsNumber()
      port!: number;
    }

    expect(() =>
      getEnvironment<Environment>(Environment, {
        loadEnvFile: true,
        envFilePath: '.env.test',
      }),
    ).toThrowError();
  });

  it('should run transformation on environment variables', () => {
    class Environment {
      @Env()
      @Transform(parseInt)
      port!: number;
    }

    const env = getEnvironment<Environment>(Environment, {
      loadEnvFile: true,
      envFilePath: '.env.test',
    });

    expect(env.port).toStrictEqual(1337);
  });
});
