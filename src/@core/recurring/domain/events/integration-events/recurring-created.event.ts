import { IntegrationEvent } from '@core/common/domain/integration-event';
import { RecurringCreatedEvent } from '../domain-events/recurring-created.event';

export class RecurringCreatedIntegrationEvent extends IntegrationEvent {

  constructor({ occurredOn, recurring }: RecurringCreatedEvent) {
    super(
      RecurringCreatedIntegrationEvent.name,
      {
        id: recurring.id.value,
        individualId: recurring.individualId.value,
        status: recurring.status,
        scheduledTo: recurring.scheduledTo,
        nextAttempt: recurring.nextAttempt,
        totalAttempts: recurring.totalAttempts,
        maxAttempts: recurring.maxAttempts,
        orderId: recurring.orderId,

      },
      1.0,
      occurredOn
    );
  }

}
