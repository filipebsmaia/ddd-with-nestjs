import { AsyncLocalStorage } from 'async_hooks';
import { AggregateRoot } from '@core/common/domain/aggregate-root';

interface EventContext {
  aggregates: Set<AggregateRoot>;
};

const storage = new AsyncLocalStorage<EventContext>();

export class DomainEventContext {
  static run<T>(callback: () => T): T {
    const context: EventContext = { aggregates: new Set() };
    return storage.run(context, callback);
  }

  static registerAggregate(aggregate: AggregateRoot) {
    const store = storage.getStore();
    if (store) {
      store.aggregates.add(aggregate);
    }
  }

  static getAggregates(): Set<AggregateRoot> {
    return storage.getStore()?.aggregates ?? new Set();
  }

  static clear() {
    const store = storage.getStore();
    if (store) {
      store.aggregates.clear();
    }
  }
}
