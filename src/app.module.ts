import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RecurringModule } from './recurring/recurring.module';
import { ApplicationModule } from './application/application.module';
import { DomainEventsModule } from './domain-events/domain-events.module';

@Module({
  imports: [
    DatabaseModule,
    ApplicationModule,
    DomainEventsModule,
    RecurringModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
