import { EventContext } from '../domain/event/event-context';
import { EventManager } from '../domain/event/event-manager';

export class ApplicationService {
  constructor(
    private eventManager: EventManager,
  ) {}

  async start() {}

  async finish() {
    const aggregateRoots = EventContext.getAggregates();

    for (const aggregateRoot of aggregateRoots) {
      await this.eventManager.publish(aggregateRoot);
    }

    for (const aggregateRoot of aggregateRoots) {
      await this.eventManager.publishForIntegrationEvent(aggregateRoot);
    }
    aggregateRoots.forEach(aggregateRoot => aggregateRoot.clearEvents());
  }

  async fail() {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    return EventContext.run(async () => {
      await this.start();
      try {
          const result = await callback();
          await this.finish();
          return result;
      } catch (e) {
        await this.fail();
        throw e;
      }
    });
  }

  wrapWithDomainContext<T extends object>(service: T): T {
    return new Proxy(service, {
      get: (target, prop, receiver) => {
        const original = Reflect.get(target, prop, receiver);
        if (typeof original !== 'function') {return original;}

        return (...args: any[]) => this.run(() => original.apply(target, args));
      },
    });
  }
}
