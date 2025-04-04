import { BadRequestException } from "@core/common/exception/bad-request.expection";

export class InvalidUuidError extends BadRequestException {
  constructor(invalidValue: any) {
    super(`Value ${invalidValue} must be a valid UUID`, 'common/invalid_uuid');
  }
}