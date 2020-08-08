import 'reflect-metadata';
import { ENVIRONMENT_METAKEY } from './environment-metakey.const';
import { Env } from './environment.decorator';

describe('Decorators', () => {
  describe('@Env()', () => {
    it('should decorate the class with { property: ENV_NAME } object', () => {
      class Environment {
        @Env('FOO')
        foo!: string;
      }

      const env = new Environment();

      const expectMetadata = { foo: 'FOO' };

      expect(Reflect.getMetadata(ENVIRONMENT_METAKEY, env)).toStrictEqual(
        expectMetadata,
      );
    });

    it('should decorator map property name to upper snake case', () => {
      class Environment {
        @Env()
        fooBar!: string;
      }

      const env = new Environment();

      const expectMetadata = { fooBar: 'FOO_BAR' };

      expect(Reflect.getMetadata(ENVIRONMENT_METAKEY, env)).toStrictEqual(
        expectMetadata,
      );
    });
  });
});
