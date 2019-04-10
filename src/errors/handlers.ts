import {Request, Response} from "express";
import {ApplicationError} from "./error";
import _ from "lodash";

export type Sanitizer = (err: ApplicationError) => ApplicationError;
export type Renderer = (err: ApplicationError, req: Request, res: Response) => any;

export function jsonRenderer(err: ApplicationError, req: Request, res: Response) {
    res.status(err.status || 400);
    res.json(err);
}

export function sanitizeByEnvironment(err: ApplicationError) {
    const environment = process.env.NODE_ENV || "production";
    if (environment == "production") {
        const copy = Object.assign({}, err);
        Object.keys(err)
            .filter(k => err.publics.indexOf(k) == -1)
            // @ts-ignore
            .forEach(k => delete copy[k]);

        return copy;
    }

    const copy: any = Object.assign({}, err);
    copy.publics = undefined;
    return copy;
}

export type ApplicationErrorHandlerOptions = {
    sanitizer?: Sanitizer
    renderer?: Renderer,
};

export function restHandler(options: ApplicationErrorHandlerOptions) {
    options = Object.assign({renderer: jsonRenderer, sanitizer: sanitizeByEnvironment}, options);
    return function handler(err: ApplicationError, req: Request, res: Response, next: (err: ApplicationError) => any) {
        const sanitized = options.sanitizer(err);
        const renderer = options.renderer;

        renderer(sanitized, req, res);
    };
}

export function handlebarsRenderer(view: string = "applicationError"): Renderer {
    return function handler(err: ApplicationError, req: Request, res: Response) {
        res.status(err.status || 400);
        res.render(view, {err});
    };
}

export function htmlHandler(options: ApplicationErrorHandlerOptions) {
    options = Object.assign({renderer: handlebarsRenderer("error"), sanitizer: sanitizeByEnvironment}, options);
    return function handler(err: ApplicationError, req: Request, res: Response, next: (err: ApplicationError) => any) {
        const sanitized = options.sanitizer(err);
        const renderer = options.renderer;
        renderer(sanitized, req, res);
    };
}
