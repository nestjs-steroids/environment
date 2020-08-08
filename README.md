<h1 align="center">Environment</h1>
Extremely simple environment module (config loader) for your NestJS application

## Installation
```bash
npm install @nestjs-steroids/environment
```
## Usage
First of all, let's define our application environment
### AppEnvironment
```typescript
import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Env } from '@nestjs-steroids/environment';

enum NodeEnv {
  Development = 'development',
  Production = 'production'
}

export class AppEnvironment {
  /**
   * Env decorator mark environment variable that we want to assign
   * (Tip) Without name env Env decorator makes auto UPPER_SNAKE_CASE conversion (e.g. isTest -> IS_TEST)
   */
  @Env('PORT')
  /**
   * Transform is useful for all sorts of transformations or parsing complex values
   * For example: @Transform(value => value.toLowerCase() === 'true')
   */
  @Transform(parseInt)
  /**
   * Also, you could use class-validator operators for validation of the correctness of environment variables
   */
  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  @Env('NODE_ENV')
  @IsEnum(NodeEnv)
  nodeEnvironment: NodeEnv
}
```
### AppModule
Then, register `EnvironmentModule` in your application 
```typescript
import { Module } from '@nestjs/common';
import { EnvironmentModule } from '@nestjs-steroids/environment';
import { AppEnvironment } from './app-environment';

@Module({
  imports: [
    EnvironmentModule.forRoot({
      isGlobal: true,
      loadEnvFile: true,
      useClass: AppEnvironment,
    }),
  ],
})
export class AppModule {}
```

### AppService
Let's use our application environment in services
```typescript
import { Injectable } from '@nestjs/common';
import { AppEnvironment } from './app-environment';

@Injectable()
export class AppService {
  constructor(private readonly appEnvironment: AppEnvironment) {}

  getNodeEnvironment(): string {
    return `Application environment is: ${this.appEnvironment.nodeEnvironment}`;
  }
}
```

## Advanced usage
Sometimes we need access to our environments without creation NestJS application (e.g. ORM config, etc.).
So we can create an `AppEnvironment` using `getEnvironment` factory method and use it like class with static properties.
```typescript
import { getEnvironment } from '@nestjs-steroids/environment';
export const appEnv = getEnvironment<AppEnvironment>(AppEnvironment)

// Usage
appEnv.nodeEnvironment
```
Also, we can reuse this instance in `EnvironmentModule`
```typescript
import { Module } from '@nestjs/common';
import { EnvironmentModule } from '@nestjs-steroids/environment';
import { appEnv, AppEnvironment } from './app-environment';

@Module({
  imports: [
    EnvironmentModule.forRoot({
      isGlobal: true,
      loadEnvFile: true,
      useClass: AppEnvironment, // Class that we want to provide
      useValue: appEnv, // Class than we want to provide
    }),
  ],
})
export class AppModule {}

```

## License
[MIT](LICENSE.md)