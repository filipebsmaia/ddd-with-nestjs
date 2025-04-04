import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DomainEventManager } from '@core/common/domain/domain-event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { DomainEvent } from '@core/common/domain/domain-event';

@Global()
@Module({
  providers: [
    DomainEventManager,
    IntegrationEventsPublisher,
  ],
  exports: [DomainEventManager],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: DomainEvent) => {
      console.log('[Event]', event);
      // TODO: Store events?
    });
  }
}
