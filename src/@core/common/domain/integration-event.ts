export abstract class IntegrationEvent<T = any> {

  constructor(
    readonly eventName: string,
    readonly payload: T,
    readonly version: T,
    readonly occurredOn: Date) {
    //
  }
}