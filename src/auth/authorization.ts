import jwt, {JwtConfiguration} from "./jwt";
import {Request, Response} from "express";
import {ApplicationError} from "../errors/error";
import _ from "lodash";

export type JwtAuthenticateOptions = {

    /**
     * The name of the http header the jwt is stored within.
     */
    header?: string,

    /**
     * The key to set the decoded authentication information on the Request object.
     */
    destination?: string,

    /**
     * The prefix, if any to remove from the header.
     */
    prefix?: string,
};

export class AuthorizationError extends ApplicationError {
    constructor(message: string, cause?: undefined) {
        super(message, 403, cause);
    }
}

export function jwtAuthenticate(jwtConfiguration: JwtConfiguration, authenticateOptions: JwtAuthenticateOptions) {
    const defaults: JwtAuthenticateOptions = {header: "Authorization", destination: "auth", prefix: "Bearer"};
    authenticateOptions = Object.assign(defaults, authenticateOptions);

    // The function that handles the authentication.
    return async function middleware(req: Request, res: Response, next: (err: Error) => any) {

        let header = req.header(authenticateOptions.header);
        if (header == undefined) {
            const message = `Could not authorize. Missing ${authenticateOptions.header} header.`;
            next(new AuthorizationError(message));
            return;
        }

        // remove prefix
        header = _.trimStart(header, authenticateOptions.prefix);

        try {
            const jwtInstance = jwt(jwtConfiguration);
            // @ts-ignore
            req[authenticateOptions.destination] = await jwtInstance.verify(header);
        } catch (e) {
            const message = `Could not authorize. ${e.message}.`;
            next(new AuthorizationError(message, e));
            return;
        }
    };
}