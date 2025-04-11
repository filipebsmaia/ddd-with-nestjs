import { DomainEvent } from '@core/common/domain/domain-event';
import { Entity } from '@core/common/domain/entity';
import { EventContext } from './event/event-context';

export abstract class AggregateRoot extends Entity {
  events: Set<DomainEvent> = new Set<DomainEvent>();

  constructor(){
    super();
    EventContext.registerAggregate(this);
  }

  addEvent(event: DomainEvent) {
    this.events.add(event);
  }

  clearEvents() {
    this.events.clear();
  }
}