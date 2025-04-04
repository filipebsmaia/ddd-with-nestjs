import { DomainEvent } from '@core/common/domain/domain-event';
import { Recurring, RecurringStatus } from '@core/recurring/domain/entities/recurring.entity';
import { IndividualId } from '@core/recurring/domain/entities/individual.entity';

export class RecurringCreatedEvent extends DomainEvent {

  constructor(
    readonly recurring: Omit<PropertiesOnly<Recurring>, 'events'>,
  ) {
    super(recurring.id, new Date());
  }
  
}
