export class ApplicationError {

    public readonly message: string;
    public readonly status: number;
    public readonly cause: Error;
    public readonly publics = ["message", "status"];

    constructor(message: string, status: number, cause: Error) {
        this.message = message;
        this.status = status;
        this.cause = cause;
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
}