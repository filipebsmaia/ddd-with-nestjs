import { DomainEventContext } from '../domain/domain-event-context';
import { DomainEventManager } from '../domain/domain-event-manager';

export class ApplicationService {
  constructor(
    private domainEventManager: DomainEventManager,
  ) {}

  async start() {}

  async finish() {
    const aggregateRoots = DomainEventContext.getAggregates();

    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventManager.publish(aggregateRoot);
    }

    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventManager.publishForIntegrationEvent(aggregateRoot);
    }
    aggregateRoots.forEach(aggregateRoot => aggregateRoot.clearEvents());
  }

  async fail() {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    return DomainEventContext.run(async () => {
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
