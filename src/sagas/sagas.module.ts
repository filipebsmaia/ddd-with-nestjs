import { Module } from '@nestjs/common';
import { RunRecurringStep } from './run-recurring-step';
import { OrderCreatedStep } from './order-created-step';

@Module({
  providers: [
    RunRecurringStep,
    OrderCreatedStep,
  ]
})
export class SagasModule { }
