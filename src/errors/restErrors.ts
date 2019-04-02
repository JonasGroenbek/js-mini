import {Request, Response} from "express";
import _ from "lodash";

export type Renderer = (req: Request, res: Response, err: {}) => void;

export function jsonRenderer(req: Request, res: Response, err: {}) {
    res.json(err);
}

export default function auto(renderer: Renderer = jsonRenderer) {
    switch (process.env.NODE_ENV) {
        case "production":
            return production(renderer);
        default:
            return development(renderer);
    }
}

const defaults = {status: 400};
const exclude = ["toString", "constructor"];

function getKeysFromError(err: Error) {
    return new Array<string>()
        .concat(Object.getOwnPropertyNames(err))
        .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(err)))
        .concat(Object.keys(defaults))
        .concat(Object.keys(err))
        .filter(k => exclude.indexOf(k) == -1);
}

export function development(renderer: Renderer = jsonRenderer) {
    function middleware(err: Error, req: Request, res: Response, next: (err: Error) => void) {

        const keys = getKeysFromError(err);
        // @ts-ignore
        const values = keys.map(k => err[k] || defaults[k]);
        const object = _.zipObject(keys, values);
        console.log(object);
        // @ts-ignore
        res.status(object["status"] || 400);
        renderer(req, res, object);
    }

    return middleware;
}

export function production(renderer: Renderer = jsonRenderer) {
    function middleware(err: Error, req: Request, res: Response, next: (err: Error) => void) {
        // @ts-ignore
        res.status(err.status || 400);
        renderer(req, res, {
            message: err.message,
            // @ts-ignore
            status: err.status || 400,
        });
    }

    return middleware;
}