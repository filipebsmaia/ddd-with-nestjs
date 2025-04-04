import { GrpcStatus, HttpStatus } from "@core/common/exception/expection-protocol-status";
import { Exception } from "@core/common/exception/exception";

export abstract class BadRequestException extends Exception {
  constructor(message: string, code: string){
    super('BadRequest', message, code, {
      http: HttpStatus.BAD_REQUEST,
      grpc: GrpcStatus.INVALID_ARGUMENT
    });
  }
}