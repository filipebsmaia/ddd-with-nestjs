import { Global, Module } from '@nestjs/common';
import { ApplicationService } from '@core/common/application/application.service';
import { DomainEventManager } from '@core/common/domain/domain-event-manager';

@Global()
@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (domainEventManager: DomainEventManager) => {
        return new ApplicationService(domainEventManager);
      },
      inject: [DomainEventManager],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
