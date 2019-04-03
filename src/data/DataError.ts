import {ApplicationError, ApplicationErrorBase} from "../errors/error";
import {StackFrame} from "@types/stack-trace";

export default class DataError extends ApplicationErrorBase {

    constructor(message: string,
                status: number,
                cause: Error | ApplicationError,
                stack: StackFrame[]) {
        super("DataError", message, status, cause, stack);
    }
}