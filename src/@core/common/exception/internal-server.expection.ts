import { Exception } from "@core/common/exception/exception";
import { GrpcStatus, HttpStatus } from "@core/common/exception/expection-protocol-status";

export abstract class InternalServerException extends Exception {
  constructor(message: string, code: string){
    super('InternalServer', message, code, {
      http: HttpStatus.INTERNAL_SERVER_ERROR,
      grpc: GrpcStatus.INTERNAL
    })
  }
}