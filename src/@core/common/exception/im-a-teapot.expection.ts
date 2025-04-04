import { Exception } from "@core/common/exception/exception";
import { GrpcStatus, HttpStatus } from "@core/common/exception/expection-protocol-status";

export abstract class ImATeapotException extends Exception {
  constructor(message: string, code: string){
    super('ImATeapot', message, code, {
      http: HttpStatus.I_AM_A_TEAPOT,
      grpc: GrpcStatus.UNKNOWN
    });
  }
}