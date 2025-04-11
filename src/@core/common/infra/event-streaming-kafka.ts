import { EventStreamingProvider, SendEvent, SubscribeEvent } from '@core/common/domain/event/event-streaming';
import { IntegrationEvent } from '@core/common/domain/integration-event';

import { Producer, Message, Consumer } from 'kafkajs';

export class KafkaEventStreamingProvider implements EventStreamingProvider {
  private handlers: Map<string, SubscribeEvent<any>['handler']> = new Map();

  constructor(
    private readonly kafkaProducer: Producer,
    private readonly kafkaConsumer: Consumer,
  ) {
  }

  async send<Value extends IntegrationEvent = IntegrationEvent>({
    subject,
    key,
    headers,
    events
  }: SendEvent<Value>): Promise<void> {
    const messages: Array<Message> = [];
    if (Array.isArray(events)) {
      events.forEach(event => {
        messages.push({
          key,
          value: JSON.stringify(event),
          headers,
        });
      });
    } else {
      messages.push({
        key,
        value: JSON.stringify(events),
        headers,
      });
    }

    await this.kafkaProducer.send({
      topic: subject,
      messages
    });
  }

  async subscribe<Value extends IntegrationEvent = IntegrationEvent>({ handler, topic }: SubscribeEvent<Value>): Promise<void> {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, handler);
      await this.kafkaConsumer.subscribe({ topic, fromBeginning: false });
    }
  }

  async initialize(){
    this.kafkaConsumer.run({
      partitionsConsumedConcurrently: 100,
      eachMessage: async ({ message, topic }) => {
        const rawValue = message.value?.toString();
        if (!rawValue) {
          return;
        }

        try {
          JSON.parse(rawValue);
        } catch (err) {
          console.error(err);
        }

        const event = JSON.parse(rawValue);

        const key = message.key?.toString() ?? '';

        const headers = Object.fromEntries(
          Object.entries(message.headers ?? {}).map(([k, v]) => [k, v?.toString() ?? ''])
        ) ?? {};
        const handler = this.handlers.get(topic);
        if (handler) {
          await handler({ key, event, headers });
        }
      }
    });
  }

}
