export class ApplicationError extends Error {

    public message: string;
    public status: number;
    public cause: Error;

    constructor(message: string, status: number, cause: Error) {
        super(message);
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

    build() {
        return new ApplicationError(this._message, this._status, this._cause)
    }

    throw() {
        throw this.build()
    }
}

export default function error(message: string) {
    return new Builder().message(message);
}