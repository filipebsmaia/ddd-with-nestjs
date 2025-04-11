import { Saga } from "@/events/saga.decorator";
import { SagaStep, SagaStepWithCompensationResponse } from "@core/common/domain/saga/step.saga";
import { RecurringCreatedIntegrationEvent } from "@core/recurring/domain/events/integration-events/recurring-created.event";

@Saga({
  flow: "recurring",
  previousStep: "start",
  stepName: "order-created"
})
export class OrderCreatedStep extends SagaStep<RecurringCreatedIntegrationEvent, RecurringCreatedIntegrationEvent> {

  async invoke(params: RecurringCreatedIntegrationEvent): Promise<RecurringCreatedIntegrationEvent> {
    console.log("Running", this.constructor.name, params);
    await new Promise(r => setTimeout(r, 3000));
    console.log("Runned", this.constructor.name);
    return params;
  }

  async withCompenstation(params: RecurringCreatedIntegrationEvent): Promise<SagaStepWithCompensationResponse> {
    console.log("Compensating", this.constructor.name, params);
    await new Promise(r => setTimeout(r, 3000));
    console.log("Compensating", this.constructor.name);

    return {
      idempotencyId: ''
    };
  }

}