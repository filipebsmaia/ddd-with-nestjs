import { AggregateRoot } from '@core/common/domain/aggregate-root';
import Uuid from '@core/common/domain/value-objects/uuid.value-objet';
import { IndividualId } from '@core/recurring/domain/entities/individual.entity';
import { RecurringCreatedEvent } from '@core/recurring/domain/events/domain-events/recurring-created.event';
import { RecurringChangedNextAttemptEvent } from '@core/recurring/domain/events/domain-events/recurring-changed-next-attempt.event';

export const RecurringStatus = {
  SCHEDULED: 'SCHEDULED',
  PROCESSING_CAPTURE: 'PROCESSING_CAPTURE',
  CAPTURE_FAILED: 'CAPTURE_FAILED',
  COMPLETED: 'COMPLETED',
}

export type RecurringStatus = Enumerize<typeof RecurringStatus>

export class RecurringId extends Uuid {}

export type RecurringConstructorProps = {
  id?: RecurringId | string;
  individualId: IndividualId | string;
  status: RecurringStatus;
  scheduledTo: Date | null;
  nextAttempt: Date | null;
  totalAttempts: number;
  maxAttempts: number;
  orderId: string | null;
};

export type RecurringCreateCommand = CommandFromConstructor<
  RecurringConstructorProps, 
  'id' | 'individualId'
>;


export class Recurring extends AggregateRoot {
  id: RecurringId;
  individualId: IndividualId;
  status: RecurringStatus;
  scheduledTo: Date | null;
  nextAttempt: Date | null;
  totalAttempts: number;
  maxAttempts: number;
  orderId: string | null;

  constructor({id, individualId, status, scheduledTo, nextAttempt, totalAttempts, maxAttempts, orderId}: RecurringConstructorProps) {
    super();
    this.id = typeof id === 'string' ? new RecurringId(id) : id ?? new RecurringId();
    this.individualId = typeof individualId === 'string' ? new IndividualId(individualId) : individualId;
    this.status = status;
    this.scheduledTo = scheduledTo;
    this.nextAttempt = nextAttempt;
    this.totalAttempts = totalAttempts;
    this.maxAttempts = maxAttempts;
    this.orderId = orderId;
  }

  static create({ id, individualId, maxAttempts, nextAttempt, orderId, scheduledTo, status, totalAttempts }: RecurringCreateCommand) {
    const recurring = new Recurring({
      id,
      individualId,
      maxAttempts: maxAttempts ?? 3,
      nextAttempt: nextAttempt ?? null,
      orderId: orderId ?? null,
      scheduledTo: scheduledTo ?? null,
      status: status ?? RecurringStatus.SCHEDULED,
      totalAttempts: totalAttempts ?? 0,
    });
    recurring.addEvent(new RecurringCreatedEvent(recurring));
    return recurring;
  }

  scheduleNextAttemptTo(date: Date) {
    const previousNextAttempt = this.nextAttempt ? new Date(this.nextAttempt.getTime()) : null;
    this.nextAttempt = date;
    this.addEvent(new RecurringChangedNextAttemptEvent(this, previousNextAttempt))
  }
  
  toJSON() {
    const data: Record<keyof PropertiesOnly<Omit<Recurring, 'events'>>, any> = {
      id: this.id.value,
      individualId: this.individualId,
      status: this.status,
      scheduledTo: this.scheduledTo,
      nextAttempt: this.nextAttempt,
      totalAttempts: this.totalAttempts,
      maxAttempts: this.maxAttempts,
      orderId: this.orderId,
    }
    return data;
  }
}
