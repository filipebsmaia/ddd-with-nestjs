import { EventStreamingProvider } from "@core/common/domain/event/event-streaming";
import { forwardRef, Module, OnModuleInit } from "@nestjs/common";
import { DiscoveryModule, DiscoveryService } from "@nestjs/core";
import { SAGA, SagaProps } from "./saga.decorator";
import { EVENT_CONSUMER, EventConsumerProps } from "./event-consumer.decorator";
import { EventsModule } from "./events.module";
import { SagaStep } from "@core/common/domain/saga/step.saga";
import { SagaStepHandler } from "@core/common/infra/saga-step.handler";
import { SagaContext, SagaStorageContext } from "@core/common/domain/saga/saga-context";

@Module({
  imports: [
    DiscoveryModule,
    forwardRef(() => EventsModule)
  ],
  providers: [
    {
      provide: SagaStepHandler,
      useFactory: (eventStreamingProvider: EventStreamingProvider) => {
        return new SagaStepHandler(eventStreamingProvider);
      },
      inject: [EventStreamingProvider]
    }
  ],
  exports: [],
})
export class EventConsumerModule implements OnModuleInit {

  constructor(
    private readonly eventStreaming: EventStreamingProvider,
    private readonly sagaStepHandler: SagaStepHandler,
    private readonly discoveryService: DiscoveryService
  ) {}

  async onModuleInit() {
    const eventConsumers: Array<{ metadata: EventConsumerProps } & any> = [];
    const sagas: Array<{ instance: SagaStep<any, any>, metadata: SagaProps }> = [];

    const providers = this.discoveryService.getProviders(); // For @Saga
    // const controllers = this.discoveryService.getControllers(); // For @EventConsumer

    const getSagaTopicsFromMetadata = (metadata: SagaProps) => {
      return [
        `saga.${metadata.flow}.${metadata.previousStep}.in`,
        `saga.${metadata.flow}.${metadata.previousStep}.compensate`
      ];
    };

    providers.forEach(wrapper => {
      const { instance } = wrapper;
      if (!instance) {
        return;
      }

      const sagaMetadata = Reflect.getMetadata(SAGA, instance.constructor) as SagaProps;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        method => method !== 'constructor' && typeof instance[method] === 'function'
      );

      if (sagaMetadata) {
        console.log('Instance', { instance });
        const sagaStepRegistered = sagas.find(saga => saga.metadata.flow === sagaMetadata.flow && saga.metadata.previousStep === sagaMetadata.previousStep);
        if (sagaStepRegistered) {
          console.error('SagaStep is already registered', { registered: sagaStepRegistered.instance.constructor.name, current: instance.constructor.name, metadata: sagaMetadata });
          throw new Error(`Saga already registered`);
        }
        sagas.push({
          instance,
          metadata: sagaMetadata,
        });
      }

      methodNames.forEach(methodName => {
        const eventConsumerMetadata = Reflect.getMetadata(EVENT_CONSUMER, prototype, methodName) as EventConsumerProps;
        if (!eventConsumerMetadata) {
          return;
        }
        if (sagaMetadata && eventConsumerMetadata) {
          throw new Error(`Cannot use both: @Saga and @EventConsumer on ${instance.constructor.name}[${methodName}]`);
        }

        const topicIsRegisteredInSaga = sagas.find(({ metadata }) =>
            getSagaTopicsFromMetadata(metadata).includes(eventConsumerMetadata.topic)
        );

        if (topicIsRegisteredInSaga) {
          throw new Error(`Topic ${eventConsumerMetadata.topic} on ${instance.constructor.name}[${methodName}] is already registered by SagaStep ${topicIsRegisteredInSaga.instance.constructor.name}`);
        }

        const topicIsRegisteredInSagaInEventConsumer = eventConsumers.find(({ metadata }) => (
            eventConsumerMetadata.topic === metadata.topic
          )
        );

        if (topicIsRegisteredInSagaInEventConsumer) {
          throw new Error(`Topic ${eventConsumerMetadata.topic} on ${instance.constructor.name}[${methodName}] is already registered by other EventConsumer in ${topicIsRegisteredInSagaInEventConsumer.instance.constructor.name}`);
        }

        eventConsumers.push({
          instance,
          method: instance[methodName],
          metadata: sagaMetadata
        });

        console.log('[EventConsumerModule]', instance.constructor.name, { sagaMetadata, eventConsumerMetadata });
      });
    });

    sagas.forEach(({ instance, metadata }) => {
      const topics = getSagaTopicsFromMetadata(metadata);
      topics.forEach(topic => {
        console.log('Stating listen on', topic, 'in', instance.constructor.name);
        this.eventStreaming.subscribe({
          topic,
          handler: async ({ event, key, headers }) => {
            const [_, flow, step, progression] = topic.split('.');
            const sagaContext: SagaStorageContext<any> = {
              event,
              flow: `${flow}`,
              id: headers.sagaId,
              transportKey: key,
              progression: progression as 'in' | 'compensate',
              previousStep: step,
              currentStep: metadata.stepName
            };
            await SagaContext.runWithContext(sagaContext, async () => {
              await this.sagaStepHandler.execute(instance);
            });
          }
        });
      });

    });
  }
}