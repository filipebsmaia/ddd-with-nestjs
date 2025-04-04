import { UnitOfWork } from '@core/common/application/unit-of-work';
import { PrismaUnitOfWork } from '@core/common/infra/unit-of-work-prisma';
import { Global, Module, Scope } from '@nestjs/common';
import { PrismaManager } from './prisma-manager';

@Global()
@Module({
  providers: [
    {
      provide: PrismaManager,
      useFactory: () => {
        return new PrismaManager()
      },
    },
    {
      provide: UnitOfWork,
      scope: Scope.REQUEST,
      useFactory: (databaseModule: PrismaManager) => {
        return new PrismaUnitOfWork(databaseModule);
      },
      inject: [PrismaManager]
    }
  ],
  exports: [PrismaManager, UnitOfWork],
})

export class DatabaseModule {}