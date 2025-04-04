import { DomainEvent } from '@core/common/domain/domain-event';
import { Recurring } from '@core/recurring/domain/entities/recurring.entity';

export class RecurringChangedNextAttemptEvent extends DomainEvent {

  constructor(
    readonly recurring: Omit<PropertiesOnly<Recurring>, 'events'>,
    readonly previousNextAttempt: Date | null,
  ) {
    super(recurring.id, new Date())
  }
  
}
