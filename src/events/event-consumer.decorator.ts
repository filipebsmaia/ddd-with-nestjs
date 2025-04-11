import 'reflect-metadata';

export const EVENT_CONSUMER = Symbol.for('EVENT_CONSUMER');

export interface EventConsumerProps {
  topic: string
}

export function EventConsumer(payload: EventConsumerProps): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(EVENT_CONSUMER, payload, target, propertyKey);
  };
}