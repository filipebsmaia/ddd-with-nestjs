import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RecurringModule } from './recurring/recurring.module';

@Module({
  imports: [
    DatabaseModule,
    RecurringModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
