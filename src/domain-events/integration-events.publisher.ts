import { Job } from 'bull';
import { IntegrationEvent } from '@core/common/domain/integration-event';
import { Process, Processor } from '@nestjs/bull';

@Processor('integration-events')
export class IntegrationEventsPublisher {
  constructor() {}

  @Process()
  async handle(job: Job<IntegrationEvent>) {
    console.log('[IntegrationEventsPublisher]', job.data);
    return {};
  }
}
