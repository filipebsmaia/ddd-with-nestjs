import 'reflect-metadata';

export const SAGA = Symbol.for('SAGA');

export interface SagaProps {
  flow: string;
  stepName: string;
  previousStep: string;
}

export function Saga(payload: SagaProps): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(SAGA, payload, target);
  };
}