import { ValueObject } from '@core/common/domain/value-objects/value-object';

export abstract class DomainEvent {

  constructor(readonly aggregateId: ValueObject, readonly occurredOn: Date) {
    //
  }
}