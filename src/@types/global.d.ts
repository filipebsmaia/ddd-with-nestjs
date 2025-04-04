declare global {

  type Enumerize<T> = T[keyof T];

  type CommandFromConstructor<ConstructorProps, RequiredProps extends keyof ConstructorProps> =
    Pick<ConstructorProps, RequiredProps> &
    Partial<
      Pick<ConstructorProps, keyof Omit<ConstructorProps, RequiredProps>>
    >;

  type NonMethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
  }[keyof T];

  type PropertiesOnly<T> = Pick<T, NonMethodKeys<T>>;
}

export {}