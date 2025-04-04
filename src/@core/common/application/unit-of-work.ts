import { AggregateRoot } from "../domain/aggregate-root";
import { DomainEventContext } from "../domain/domain-event-context";

export abstract class UnitOfWork {
  abstract runTransaction<T>(callback: () => Promise<T>): Promise<T>;

  getAggregateRoots = (): Set<AggregateRoot> => {
    return DomainEventContext.getAggregates();
  };
}