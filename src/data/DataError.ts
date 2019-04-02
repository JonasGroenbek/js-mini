import {ApplicationError} from "../errors/error";

export default class DataError extends ApplicationError {

    constructor(message: string, status: number, cause: Error) {
        super(message, status, cause);
    }
}