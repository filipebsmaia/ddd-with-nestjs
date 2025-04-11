import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RecurringModule } from './recurring/recurring.module';
import { ApplicationModule } from './application/application.module';
import { EventsModule } from './events/events.module';
import { SagasModule } from './sagas/sagas.module';

@Module({
  imports: [
    DatabaseModule,
    ApplicationModule,
    EventsModule,
    RecurringModule,
    SagasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
