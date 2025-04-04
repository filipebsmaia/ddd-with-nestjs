import { NotFoundException } from "@core/common/exception/not-found.expection";

export class IndividualNotFoundError extends NotFoundException {
  constructor(invalidValue: any) {
    super(`The individual ${invalidValue} was not found`, 'recurring/individual_not_found');
  }
}