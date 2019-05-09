import {Request} from "express";
import SafeString = Handlebars.SafeString;

export type Errors = { [key: string]: string[] };

export interface Suite {
    pushError(field: string, error: string): void;

    getErrors(): Errors;

    handlebars(field: string): SafeString;

    hasErrors(): boolean;
}

export interface Storage {

    get(field: string): string[];

    push(field: string, error: string): void;

    clear(field: string): void;

    clearAll(): void;
}

export class SessionStorage implements Storage {

    private readonly request: Request;
    private readonly key: string;

    constructor(request: Request, sessionKey: string) {
        this.request = request;
        this.key = sessionKey;
    }

    clearAll(): void {
        this.request.session[this.key] = {};
    }

    clear(field: string): void {
        if (this.request.session[this.key])
            this.request.session[this.key][field] = [];
    }

    push(field: string, error: string): void {
        if (!this.request.session[this.key]) {
            this.request.session[this.key] = {};
        }

        if (!this.request.session[this.key][field])
            this.request.session[this.key][field] = [];

        this.request.session[this.key][field].push(error);
    }

    get(field: string): string[] {
        if (!this.request.session[this.key] || !this.request.session[this.key][field])
            return [];

        return this.request.session[this.key][field];
    }
}

export function session(request: Request, sessionKey: string = "form-errors") {
    return factory(new SessionStorage(request, sessionKey));
}

function factory(storage: Storage): Suite {

    let hasErrors = false;

    return {
        pushError(field: string, error: string): void {
            storage.push(field, error);
            hasErrors = true;
        },
        hasErrors(): boolean {
            return hasErrors;
        },
        handlebars(field: string): SafeString {
            const errors = storage.get(field);

            if (errors.length > 0)
                return new SafeString("");

            const result = new SafeString(
                `<ul class="form-errors">` +
                errors.map(error => `<li>${error}</li>`).join("\n") +
                `</ul>`
            );

            storage.clear(field);
            return result;
        }
    };
}

export default factory;