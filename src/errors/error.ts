import stacktrace, {StackFrame} from "stack-trace";

export interface ApplicationError {

    readonly message: string;
    readonly status: number;
    readonly cause: Error;
    readonly stack?: StackFrame[];
}

type Constructable<T> = {new(): T};

function a<T extends ApplicationError>(c: Constructable<T>) {
    return new c();
}


export class ApplicationErrorBase implements ApplicationError {

    readonly message: string;
    readonly status: number;
    readonly cause: Error;
    readonly stack?: StackFrame[];

    constructor(message: string, status: number, cause: Error, stack?: StackFrame[]) {
        this.cause = cause;
        this.message = message;
        this.stack = stack;
        this.status = status;
    }
}

export class Builder {

    private _message: string;
    private _status: number;
    private _cause: Error;

    message(message: string) {
        this._message = message;
        return this;
    }

    status(status: number) {
        this._status = status;
        return this;
    }

    cause(cause: Error) {
        this._cause = cause;
        return this;
    }

    build(type = ApplicationError) {
        return new (type)(this._message, this._status, this._cause);
    }

    throw() {
        throw this.build();
    }
}

export default function error(message: string) {
    return new Builder().message(message);



    a<ApplicationErrorBase>(ApplicationErrorBase::new);}