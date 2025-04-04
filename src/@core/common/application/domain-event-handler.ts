import { DomainEvent } from '@core/common/domain/domain-event';

export interface DomainEventHandler {
  handle(event: DomainEvent): Promise<void>;
}
