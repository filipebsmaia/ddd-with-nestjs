
type Payload = string | number | Date | { [key: string]: Payload } | Payload[] | null | undefined;
export abstract class IntegrationEvent {

  constructor(
    readonly eventName: string,
    readonly payload: Payload,
    readonly version: number,
    readonly occurredOn: Date) {
    //
  }
}