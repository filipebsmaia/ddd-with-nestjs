import { AggregateRoot } from "../domain/aggregate-root";
import { EventContext } from "../domain/event/event-context";

export abstract class UnitOfWork {
  abstract runTransaction<T>(callback: () => Promise<T>): Promise<T>;

  getAggregateRoots = (): Set<AggregateRoot> => {
    return EventContext.getAggregates();
  };
}