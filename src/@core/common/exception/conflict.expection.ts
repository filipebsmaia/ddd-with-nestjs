
import { Exception } from "@core/common/exception/exception";
import { GrpcStatus, HttpStatus } from "@core/common/exception/expection-protocol-status";

export abstract class ConflictException extends Exception {
  constructor(message: string, code: string){
    super('Conflict', message, code, {
      http: HttpStatus.CONFLICT,
      grpc: GrpcStatus.ALREADY_EXISTS
    });
  }
}