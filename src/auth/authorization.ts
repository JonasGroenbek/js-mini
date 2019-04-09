import {Request, Response} from "express";
import {ApplicationError, ApplicationErrorBase} from "../errors/error";
import _ from "lodash";
import AuthenticatableUser from "./AuthenticatableUser";
import {JsonWebTokenService} from "./jsonWebToken";

type ErrorHandler = (err: ApplicationError) => void;

export interface AuthorizationProvider<T extends AuthenticatableUser> {

    /**
     * Called when the user is authenticated.
     * @param req The request object.
     * @param res The response object.
     * @param next The next object.
     * @param user The user that was authenticated.
     */
    onAuthentication(req: Request, res: Response, next: ErrorHandler, user: T): any;

    /**
     * Called when a user attempts to authorize.
     * @param req The request object.
     * @param res The response object.
     * @param next The next object.
     */
    onAuthorizationAttempt(req: Request, res: Response, next: ErrorHandler): any;
}

export type JwtAuthorizationProviderOptions = {

    /**
     * The name of the http header the jwt is stored within.
     */
    header?: string,

    /**
     * The key to set the decoded authentication information on the Request object.
     */
    destination?: string,

    /**
     * The prefix, if any to remove from the incoming header.
     */
    prefix?: string,
};

export class JwtAuthorizationProvider<T extends AuthenticatableUser> implements AuthorizationProvider<T> {

    private readonly jsonWebTokenService: JsonWebTokenService<T>;
    private readonly options: JwtAuthorizationProviderOptions;

    constructor(jsonWebTokenService: JsonWebTokenService<T>, options: JwtAuthorizationProviderOptions) {
        const defaults = {
            header: "Authorization",
            destination: "auth",
            prefix: "Bearer"
        };

        this.jsonWebTokenService = jsonWebTokenService;
        this.options = Object.assign(defaults, options);
    }

    onAuthentication(req: Request, res: Response, next: ErrorHandler, user: T) {

    }

    async onAuthorizationAttempt(req: Request, res: Response, next: ErrorHandler) {

        const {header, prefix, destination} = this.options;

        const headerValue = req.header(header);
        if (headerValue == undefined) {
            const message = `Could not authorize. Missing ${header} header.`;
            next(new AuthorizationError(message));
            return;
        }

        try {
            const token = _.trimStart(headerValue, prefix);
            // @ts-ignore
            req[destination] = await this.jsonWebTokenService.verify(token);
        } catch (e) {
            const message = `Could not authorize. ${e.message}.`;
            next(new AuthorizationError(message, e));
        }
    }
}

export class AuthorizationError extends ApplicationErrorBase {
    constructor(message: string, cause?: undefined) {
        super("AuthorizationError", message, 403, cause, undefined);
    }
}