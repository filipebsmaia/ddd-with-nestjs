import { AsyncLocalStorage } from 'async_hooks';
import { SagaStep } from './step.saga';

export interface SagaStorageContext<T extends SagaStep<any, any>> {
  id: string;
  transportKey: string;
  flow: string;
  previousStep: string;
  currentStep: string;
  event: Parameters<T['invoke']>[0];
  progression: 'in' | 'compensate';
};

const storage = new AsyncLocalStorage<SagaStorageContext<any>>();

export class SagaContext {
  static runWithContext<T>(context: SagaStorageContext<any>, callback: () => T): T {
    return storage.run(context, callback);
  }
  static getContext<T extends SagaStep<any, any>>(): SagaStorageContext<T> | undefined {
    return storage.getStore();
  }
}
