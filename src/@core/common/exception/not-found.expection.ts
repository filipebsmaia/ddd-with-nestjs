import { Exception } from "@core/common/exception/exception";
import { GrpcStatus, HttpStatus } from "@core/common/exception/expection-protocol-status";

export abstract class NotFoundException extends Exception {
  constructor(message: string, code: string){
    super('NotFound', message, code, {
      http: HttpStatus.NOT_FOUND,
      grpc: GrpcStatus.NOT_FOUND
    })
  }
}