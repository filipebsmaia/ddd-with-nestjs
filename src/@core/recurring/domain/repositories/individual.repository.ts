import { Repository } from "@core/common/domain/repository";
import { Individual } from "@core/recurring/domain/entities/individual.entity";

export abstract class IndividualRepository extends Repository<Individual> {
  abstract findById(id: string): Promise<Individual | undefined>;
  //
}