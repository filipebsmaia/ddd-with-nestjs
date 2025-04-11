import { Global, Module } from '@nestjs/common';
import { ApplicationService } from '@core/common/application/application.service';
import { EventManager } from '@core/common/domain/event/event-manager';

@Global()
@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (eventManager: EventManager) => {
        return new ApplicationService(eventManager);
      },
      inject: [EventManager],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
