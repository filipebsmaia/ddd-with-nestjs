import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DomainEvent } from '@core/common/domain/domain-event';
import { ModuleRef } from '@nestjs/core';
import { EventManager } from '@core/common/domain/event/event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { EventStreamingProvider } from '@core/common/domain/event/event-streaming';
import { KafkaEventStreamingProvider } from '@core/common/infra/event-streaming-kafka';
import { kafkaOptions } from './kafkaOptions';
import { RecurringCreatedEvent } from '@core/recurring/domain/events/domain-events/recurring-created.event';
import { RecurringCreatedIntegrationEvent } from '@core/recurring/domain/events/integration-events/recurring-created.event';
import { Kafka } from 'kafkajs';
import { DomainEventLogHandler } from '@core/recurring/application/handlers/domain-event-log.handler';
import { EventConsumerModule } from './event-consumer.module';

@Global()
@Module({
  imports: [
    EventConsumerModule
  ],
  providers: [
    EventManager,
    IntegrationEventsPublisher,
    DomainEventLogHandler,
    {
      provide: EventStreamingProvider,
      useFactory: async () => {
        const { client, consumer, producer } =  kafkaOptions;
        const kafka = new Kafka(client);
        const kafkaConsumer = kafka.consumer(consumer);
        const kafkaProducer = kafka.producer(producer);
        kafkaConsumer.connect();
        kafkaProducer.connect();
        return new KafkaEventStreamingProvider(kafkaProducer, kafkaConsumer);
      },

    },
  ],
  exports: [EventManager, EventStreamingProvider],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly eventManager: EventManager,
    private readonly eventStreaming: EventStreamingProvider,
    private moduleRef: ModuleRef,
    private readonly integrationEventsPublisher: IntegrationEventsPublisher
  ) {}

  async onApplicationBootstrap() {
    (this.eventStreaming as KafkaEventStreamingProvider)?.initialize();
  }

  async onModuleInit() {
    DomainEventLogHandler.listensTo().forEach((eventName: string) => {
      this.eventManager.register(eventName, async (event: DomainEvent) => {
        const handler = await this.moduleRef.resolve(DomainEventLogHandler);
        await handler.handle(event);
      });
    });

    this.eventManager.registerForIntegrationEvent(
      RecurringCreatedEvent.name,
      async (event: RecurringCreatedEvent) => {
        const integrationEvent = new RecurringCreatedIntegrationEvent(event);
        this.integrationEventsPublisher.handle(integrationEvent);
      },
    );
  }
}
