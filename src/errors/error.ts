import stacktrace, {StackFrame} from "stack-trace";
import getPrototypeOf = Reflect.getPrototypeOf;

export class ApplicationError implements Error {

    readonly name: string;
    readonly message: string;
    readonly status: number;
    readonly cause: Error | ApplicationError;
    readonly stacktrace?: StackFrame[];
    readonly publics = ["name", "message", "status"];

    constructor(name: string,
                message: string,
                status: number,
                cause: Error | ApplicationError,
                stack: StackFrame[]) {
        this.name = name;
        this.cause = cause;
        this.message = message;
        this.stacktrace = stack;
        this.status = status;
    }
}

export type ConstructableApplicationError = {
    new(name: string,
        message: string,
        status: number,
        cause: Error | ApplicationError,
        stack: StackFrame[]
    ): ApplicationError
};

export class Builder {

    private _name: string;
    private _message: string;
    private _status: number = 400;
    private _cause: Error | ApplicationError;
    private _stack: StackFrame[] = stacktrace.get();


    name(value: string): Builder {
        this._name = value;
        return this;
    }

    message(value: string): Builder {
        this._message = value;
        return this;
    }

    status(value: number): Builder {
        this._status = value;
        return this;
    }

    cause(value: Error | ApplicationError): Builder {
        this._cause = value;
        if (value instanceof Error)
            this.from(value);
        return this;
    }

    from(error: Error): Builder {
        if (this._name == undefined)
            this._name = getPrototypeOf(error).constructor.name;
        if (this._message == undefined)
            this._message = error.message;
        if (this._cause == undefined)
            this._cause = error;
        if (this._stack == undefined)
            this._stack = stacktrace.parse(error);

        return this;
    }

    build(constructable: ConstructableApplicationError = ApplicationError): ApplicationError {
        if (this._name == undefined)
            this._name = constructable.prototype.name;

        return new constructable(this._name, this._message, this._status, this._cause, this._stack);
    }
}

export async function attempt(next: (err: ApplicationError) => any, perform: () => any) {
    try {
        return await perform();
    } catch (e) {
        if (e instanceof ApplicationError)
            return next(e);
        if (e instanceof Error)
            return next(new ApplicationError("GeneralError", e.message, 500, e, stacktrace.parse(e)));
        if (typeof e === "string")
            return next(new ApplicationError("GeneralError", e, 500, undefined, undefined));

        return new ApplicationError("ErrorHandlerError", "Could not handle error.", 500, undefined, undefined);
    }
}

export default function error(message?: string, status: number = 400): Builder {
    const builder = new Builder();

    builder.status(status);
    if (message != undefined)
        builder.message(message);

    return builder;
}

export function errorToObject(err: any) {
    return {
        name: err.name,
        message: err.message,
        status: err.status,
        cause: err.cause,
        stack: err.stack,
    };
}