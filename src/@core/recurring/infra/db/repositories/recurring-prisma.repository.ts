import { Recurring } from "@core/recurring/domain/entities/recurring.entity";
import { RecurringRepository } from "@core/recurring/domain/repositories/recurring.repository";
import { RecurringPrismaMapper } from "@core/recurring/infra/db/mappers/recurring-prisma.mapper";
import { PrismaManager } from "@/database/prisma-manager";
import { UnitOfWork } from "@core/common/application/unit-of-work";

export class RecurringPrismaRepository implements RecurringRepository {

  constructor(private prismaManager: PrismaManager, private uow: UnitOfWork) {
  }

  get repository() {
    return this.prismaManager.client;
  }


  //! TODO: Testar separando e usando uow
  async add(entity: Recurring): Promise<void> {
    const recurring = RecurringPrismaMapper.toPersistence(entity);

    await this.repository.recurring.upsert({
      where: {
        id: recurring.id
      },
      create: recurring,
      update: recurring,
    })
  }

}