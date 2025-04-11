import { IntegrationEvent } from "../integration-event";

export interface SagaStepWithCompensationProps {
  sagaId: string;
}

export abstract class SagaStep<Payload, NextStepPayload extends IntegrationEvent> {
  // abstract get flow(): string;
  // abstract get previousStep(): string;
  // abstract get stepName(): string;
  // abstract get retries(): number;
  abstract invoke(params: Payload): Promise<NextStepPayload>;
  abstract withCompenstation(params: SagaStepWithCompensationProps): Promise<SagaStepWithCompensationProps>;
}
