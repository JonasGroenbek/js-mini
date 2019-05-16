import {ApplicationError} from "../errors/error";
import {StackFrame} from "stack-trace";

export default class DataError extends ApplicationError {

    constructor(message: string,
                status: number,
                cause: Error | ApplicationError,
                stack: StackFrame[]) {
        super("DataError", message, status, cause, stack);
    }
}