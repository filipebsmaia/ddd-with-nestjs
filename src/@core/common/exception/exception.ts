import { ExceptionProtocolDict } from "@core/common/exception/expection-protocol-status";

export abstract class Exception extends Error {
  constructor(
    public readonly type: string,
    public readonly message: string,
    public readonly code: string,
    public readonly protocolDict: ExceptionProtocolDict
  ) {
    super(message);
    this.name = type;
    this.code = code;
  }
}