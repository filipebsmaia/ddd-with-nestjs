import { SagaStep } from './step.saga';

export abstract class Saga<T extends SagaStep<any, any>> {
  abstract get steps(): [T, ...Array<SagaStep<any, any>>];
  abstract start(payload: Parameters<T['invoke']>[0]): Promise<void>;
}