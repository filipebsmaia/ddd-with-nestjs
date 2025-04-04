import { DomainEvent } from '@core/common/domain/domain-event';
import { Recurring } from '@core/recurring/domain/entities/recurring.entity';

export class RecurringCreatedEvent extends DomainEvent {

  constructor(
    readonly recurring: Omit<PropertiesOnly<Recurring>, 'events'>,
  ) {
    super(recurring.id, new Date());
  }

}
