import { IndividualPrismaRepository } from '@core/recurring/infra/db/repositories/individual-prisma.repository';
import { Module, OnModuleInit, Scope } from '@nestjs/common';
import { RecurringController } from './recurring.controller';
import { RecurringService } from '@core/recurring/application/recurring.service';
import { IndividualRepository } from '@core/recurring/domain/repositories/individual.repository';
import { PrismaManager } from '@/database/prisma-manager';
import { RecurringRepository } from '@core/recurring/domain/repositories/recurring.repository';
import { RecurringPrismaRepository } from '@core/recurring/infra/db/repositories/recurring-prisma.repository';
import { UnitOfWork } from '@core/common/application/unit-of-work';
import { ApplicationService } from '@core/common/application/application.service';

@Module({
  imports: [],
  providers: [
    {
      provide: RecurringRepository,
      useFactory: (prismaManager: PrismaManager, uow: UnitOfWork) =>{
        return new RecurringPrismaRepository(prismaManager, uow);
      },
      inject: [PrismaManager, UnitOfWork]
    },
    {
      provide: IndividualRepository,
      useFactory: (prismaManager: PrismaManager, uow: UnitOfWork, recurringRepository: RecurringRepository) =>{
        return new IndividualPrismaRepository(prismaManager, uow, recurringRepository);
      },
      inject: [PrismaManager, UnitOfWork, RecurringRepository]
    },
    {
      provide: RecurringService,
      scope: Scope.REQUEST,
      useFactory: (applicationService: ApplicationService, individualRepository: IndividualRepository, uow: UnitOfWork) => {
        return applicationService.wrapWithDomainContext(new RecurringService(individualRepository, uow));
      },
      inject: [ApplicationService, IndividualRepository, UnitOfWork]
    },
  ],
  controllers: [RecurringController],
})
export class RecurringModule implements OnModuleInit {

  onModuleInit() {
    // throw new Error('Method not implemented.');
  }
}
