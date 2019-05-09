import {Request} from "express";
import {SafeString, escapeExpression} from "handlebars";

export type Errors = { [key: string]: string[] };

export interface FormErrors {

    /**
     * Adds a new error to the provided field.
     * @param field The field where the error occurred.
     * @param error The error message.
     */
    pushError(field: string, error: string): void;

    /**
     * Returns all the errors in the suite.
     *
     * When <code>clear == true<code>, all the errors are removed.
     */
    getErrors(clear?: boolean): Errors;

    /**
     * Checks if there are currently any errors.
     */
    hasErrors(): boolean;

    /**
     * Returns the number of active errors.
     */
    countErrors(): number;
}

export class SessionFormErrors implements FormErrors {

    private size: number = 0;
    private readonly request: Request;
    private readonly key: string;

    constructor(request: Request, sessionKey: string) {
        this.request = request;
        this.key = sessionKey;

        if (!request.session[this.key])
            request.session[this.key] = {};

        const counter = (errors: string[]) => errors.length;
        this.size = Object.values(request.session[this.key])
            .map(counter)
            .reduce((acc, n) => acc + n, 0);
    }

    countErrors(): number {
        return this.size;
    }

    getErrors(clear: boolean = true): Errors {
        const result = Object.assign({}, this.request.session[this.key]);
        if (clear)
            this.clearAll();

        return result;
    }

    hasErrors(): boolean {
        return this.size > 0;
    }

    clearAll(): void {
        this.request.session[this.key] = {};
        this.size = 0;
    }

    pushError(field: string, error: string): void {

        if (!this.request.session[this.key][field])
            this.request.session[this.key][field] = [];

        this.request.session[this.key][field].push(error);
        this.size++;
    }
}

/**
 * Creates a new SessionFormErrors object.
 * @param request The request to attach errors to.
 * @param sessionKey The session key where the errors are stored.
 */
export function sessionStore(request: Request, sessionKey: string = "form-errors"): SessionFormErrors {
    return new SessionFormErrors(request, sessionKey);
}

/**
 * Renders a list of error messages.
 * @param errors The errors to render.
 */
export function handlebarsErrorHandler(errors: string[]): SafeString {

    if (!errors || errors.length < 1)
        return new SafeString("");

    return new SafeString(
        `<ul class="form-errors">` +
        errors.map(error => `<li>${escapeExpression(error)}</li>`).join("\n") +
        `</ul>`
    );
}