import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import { Recurring, RecurringStatus } from '@core/recurring/domain/entities/recurring.entity';

export class IndividualId extends Uuid {}

export type AddNewRecurringCommand = {
  scheduledTo: Date;
};

export type IndividualConstructorProps = {
  id?: IndividualId | string;
  organizationId: Uuid | string;
  recurrings: Array<Recurring>;
};

export type IndividualCreateCommand = CommandFromConstructor<
  IndividualConstructorProps, 
  'id' | 'organizationId'
>;


export class Individual extends AggregateRoot {

  id: IndividualId;
  recurrings: Array<Recurring>;
  organizationId: Uuid;

  constructor({ id, recurrings, organizationId }: IndividualConstructorProps) {
    super();
    this.id = typeof id === 'string' ? new IndividualId(id) : id ?? new IndividualId();
    this.recurrings = recurrings;
    this.organizationId = typeof organizationId === 'string' ?  new Uuid(organizationId) : organizationId;
  }

  static create({ id, recurrings, organizationId }: IndividualCreateCommand) {
    const individual = new Individual({
      id,
      recurrings: recurrings ?? [],
      organizationId,
    });
    // Individual.addEvent(
    //   new IndividualCreated(Individual.id, Individual.name),
    // );
    return individual;
  }

  addNewRecurring({scheduledTo}: AddNewRecurringCommand){
    const newRecurring = Recurring.create({
      individualId: this.id,
      scheduledTo: scheduledTo,
      status: RecurringStatus.SCHEDULED
    })
    
    this.recurrings.push(newRecurring);
  }
  
  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Individual, 'events'>>, any> = {
      id: this.id.value,
      recurrings: this.recurrings.map(recurring => recurring.toJSON()),
      organizationId: this.organizationId,
    }
    return data;
  }
}
