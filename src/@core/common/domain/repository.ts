import { AggregateRoot } from '@core/common/domain/aggregate-root';

export abstract class Repository<A extends AggregateRoot> {
  abstract add(entity: A): Promise<void>;
}
