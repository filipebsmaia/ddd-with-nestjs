import { Individual, IndividualId } from "@core/recurring/domain/entities/individual.entity";
import { Individual as RawIndividual, Recurring as RawRecurring } from "@prisma/client";
import { RecurringPrismaMapper } from "@core/recurring/infra/db/mappers/recurring-prisma.mapper";

interface Raw extends RawIndividual {
  recurrings: Array<RawRecurring>;
}

export class IndividualPrismaMapper {

  static toDomain(raw: Raw): Individual {
    return new Individual({
      id: new IndividualId(raw.id),
      organizationId: raw.organizationId,
      recurrings: raw.recurrings.map(RecurringPrismaMapper.toDomain)
    });
  }

  static toPersistence(individual: Individual): Raw {
    return {
      id: individual.id.value,
      organizationId: individual.organizationId.value,
      recurrings: individual.recurrings.map(RecurringPrismaMapper.toPersistence)
    };
  }
}