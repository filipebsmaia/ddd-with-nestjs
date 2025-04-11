import { IntegrationEvent } from "../integration-event";

export interface SendEvent<Value extends IntegrationEvent | Array<IntegrationEvent>> {
  subject: string;
  key: string;
  events: Value;
  headers: Record<string, string>;
}

export interface SubscribeEvent<Value extends IntegrationEvent> {
  topic: string,
  handler: (_: { key: string; event: Value, headers: Record<string, string> })  => Promise<void>
}

export abstract class EventStreamingProvider {
  abstract send<Value extends IntegrationEvent = IntegrationEvent>(payload: SendEvent<Value>): Promise<void>;
  abstract subscribe<Value extends IntegrationEvent = IntegrationEvent>(_: SubscribeEvent<Value>): Promise<void>;
}
