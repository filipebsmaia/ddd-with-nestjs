import { IndividualRepository } from "@core/recurring/domain/repositories/individual.repository";
import { UnitOfWork } from "@core/common/application/unit-of-work";
import { IndividualNotFoundError } from "@core/recurring/domain/errors/individual-not-found.error";

interface CreateRecurringProps {
  individualId: string;
}

export class RecurringService {

  constructor(private individualRepository: IndividualRepository, private uow: UnitOfWork) {
    
  }

  async createNewRecurring({ individualId }: CreateRecurringProps) {
    const individual = await this.individualRepository.findById(individualId);

    if(!individual) {
      throw new IndividualNotFoundError(individualId)
    }
    
    individual.addNewRecurring({
      scheduledTo: (() => { const date = new Date(); date.setMonth(date.getMonth() + 1); return date; })()
    })

    this.individualRepository.add(individual);
    return individual;
  }

}