import { DomainEvent } from '@core/common/domain/domain-event';
import { Entity } from '@core/common/domain/entity';

export abstract class AggregateRoot extends Entity {
  events: Set<DomainEvent> = new Set<DomainEvent>();

  addEvent(event: DomainEvent) {
    this.events.add(event);
  }

  clearEvents() {
    this.events.clear();
  }
}