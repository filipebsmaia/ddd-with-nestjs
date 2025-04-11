import { Individual } from "@core/recurring/domain/entities/individual.entity";
import { IndividualRepository } from "@core/recurring/domain/repositories/individual.repository";
import { IndividualPrismaMapper } from "@core/recurring/infra/db/mappers/individual-prisma.mapper";
import { PrismaManager } from "@/database/prisma-manager";
import { UnitOfWork } from "@core/common/application/unit-of-work";
import { RecurringRepository } from "@core/recurring/domain/repositories/recurring.repository";
import { RecurringPrismaMapper } from "@core/recurring/infra/db/mappers/recurring-prisma.mapper";

export class IndividualPrismaRepository implements IndividualRepository {

  constructor(
    private prismaManager: PrismaManager,
    private uow: UnitOfWork,
    private recurringRepository: RecurringRepository) {
  }

  get repository() {
    return this.prismaManager.client;
  }

  async add(entity: Individual): Promise<void> {
    const { recurrings, ...individual } = IndividualPrismaMapper.toPersistence(entity);

    this.uow.runTransaction(async () => {
      await this.repository.individual.upsert({
        where: {
          id: individual.id
        },
        create: {
          ...individual
        },
        update: {
          ...individual,
        },
      });

      await Promise.all(
        recurrings.map(recurring => this.recurringRepository.add(RecurringPrismaMapper.toDomain(recurring)))
      );
    });
  }

  async findById(id: string): Promise<Individual | undefined> {
    const raw = await this.repository.individual.findUnique({
      where: {
        id
      },
      include: {
        recurrings: true
      }
    });

    if (raw) {
      const entity = IndividualPrismaMapper.toDomain(raw);

      return entity;

    }
  }

}