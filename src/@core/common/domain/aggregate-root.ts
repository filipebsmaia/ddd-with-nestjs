import { DomainEvent } from '@core/common/domain/domain-event';
import { Entity } from '@core/common/domain/entity';
import { DomainEventContext } from './domain-event-context';

export abstract class AggregateRoot extends Entity {
  events: Set<DomainEvent> = new Set<DomainEvent>();

  constructor(){
    super();
    DomainEventContext.registerAggregate(this);
  }

  addEvent(event: DomainEvent) {
    this.events.add(event);
  }

  clearEvents() {
    this.events.clear();
  }
}