import { IntegrationEvent } from '@core/common/domain/integration-event';

export class IntegrationEventsPublisher {
  constructor() {}

  async handle(payload: IntegrationEvent) {
    console.log('[IntegrationEventsPublisher]', payload);
    return {};
  }
}
