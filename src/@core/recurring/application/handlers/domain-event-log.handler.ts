import { DomainEventHandler } from "@core/common/application/domain-event-handler";
import { DomainEvent } from "@core/common/domain/domain-event";

export class DomainEventLogHandler implements DomainEventHandler {
  constructor(
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    console.log('[LogHandler]', event);
  }

  static listensTo(): string[] {
    return ['*'];
  }
}
