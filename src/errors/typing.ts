import {Request, Response} from "express";

export interface Typing<T> extends Function {
    new(...args: any[]): T;
}

export type ErrorHandler<T> = (err: T, req: Request, res: Response) => any;

export default function type<T>(type: Typing<T>, handler: ErrorHandler<T>) {

    return function middleware(err: any, req: Request, res: Response, next: (err: any) => any): any {
        if (err instanceof type) {
            handler(err, req, res);
            return;
        }

        next(err);
    };
}