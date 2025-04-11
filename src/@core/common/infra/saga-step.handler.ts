import { EventStreamingProvider } from "../domain/event/event-streaming";
import { SagaContext } from "../domain/saga/saga-context";
import { SagaStep } from "../domain/saga/step.saga";
import { InternalServerException } from "@core/common/exception/internal-server.expection";

export class SagaStepHandler {

  constructor(private readonly eventStreaming: EventStreamingProvider){}

  public async execute<T extends SagaStep<any, any>>(step: T): Promise<void> {
    const context = SagaContext.getContext<T>();
    if (!context) {
      throw new Error('Saga Context is not defined');
    }
    const { event, progression, flow, id, transportKey, currentStep, previousStep } = context;

    if (progression === "in") {
      try {
        const result = await step.invoke(event);
        await this.eventStreaming.send({
          events: result,
          headers: {
            sagaId: id ?? ''
          },
          key: transportKey,
          subject: `saga.${flow}.${currentStep}.in`
        });

      } catch (error) {
        console.error(error);

        await this.eventStreaming.send({
          events: event,
          headers: {
            sagaId: id ?? ''
          },
          key: transportKey,
          subject: `saga.${flow}.${currentStep}.error`
        });

      }
    } else if (progression === "compensate") {
      const compensation = await step.withCompenstation(event);

      await this.eventStreaming.send({
        events: event,
        headers: {
          sagaId: id ?? ''
        },
        key: transportKey,
        subject: `saga.${flow}.${previousStep}.compensate`
      });

    } else {
      throw new Error('Unhandled progression');
    }
  }
}