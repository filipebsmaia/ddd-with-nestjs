import { Exception } from "@core/common/exception/exception";
import { GrpcStatus, HttpStatus } from "@core/common/exception/expection-protocol-status";

export abstract class UnauthorizedException extends Exception {
  constructor(message: string, code: string){
    super('Unauthorized', message, code, {
      http: HttpStatus.UNAUTHORIZED,
      grpc: GrpcStatus.UNAUTHENTICATED
    })
  }
}