import { IndividualId } from "@core/recurring/domain/entities/individual.entity";
import { Recurring, RecurringId, RecurringStatus } from "@core/recurring/domain/entities/recurring.entity";
import { Recurring as RawRecurring, RecurringStatus as RawRecurringStatus } from "@prisma/client";

export class RecurringPrismaMapper {

  static toDomain(raw: RawRecurring): Recurring {
    return new Recurring({
      id: new RecurringId(raw.id),
      individualId: new IndividualId(raw.individualId),
      status: raw.status as RecurringStatus,
      scheduledTo: raw.scheduledTo ? new Date(raw.scheduledTo) : null,
      nextAttempt: raw.nextAttempt ? new Date(raw.nextAttempt) : null,
      totalAttempts: raw.totalAttempts,
      maxAttempts: raw.maxAttempts,
      orderId: raw.orderId ?? null,
    });
  }

  static toPersistence(recurring: Recurring): RawRecurring {
    return {
      id: recurring.id.value,
      individualId: recurring.individualId.value,
      status: recurring.status as RawRecurringStatus,
      scheduledTo: recurring.scheduledTo ?? null,
      nextAttempt: recurring.nextAttempt ?? null,
      totalAttempts: recurring.totalAttempts,
      maxAttempts: recurring.maxAttempts,
      orderId: recurring.orderId ?? null,
    };
  }
}