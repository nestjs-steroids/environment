export type EnvironmentConstructor<T extends object = any> = {
  new (): T;
};
