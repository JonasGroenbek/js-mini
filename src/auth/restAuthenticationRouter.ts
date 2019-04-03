import express, {Request, Response} from "express";
import AuthenticationProvider from "./authentication";
import AuthenticatableUser from "./AuthenticatableUser";
import {JsonWebTokenService} from "./jsonWebToken";

export type Renderer<T extends AuthenticatableUser> = (req: Request, res: Response, next: (err: Error) => void, token: string, user: T) => any;

export type RestAuthenticationRouterOptions<T extends AuthenticatableUser> = {
    identifierKey?: string,
    passwordKey?: string,
    registrationUrl?: string,
    authenticationUrl?: string,
    renderer?: Renderer<T>,
};

export function jsonRenderer<T>(req: Request, res: Response, next: (err: Error) => void, token: string, user: T) {
    res.json({token, user});
}

/**
 * Fills the provided options object with default values.
 * @param config The configuration object to fill with default values.
 */
export function createOptions<T extends AuthenticatableUser>(config: RestAuthenticationRouterOptions<T> = {}): RestAuthenticationRouterOptions<T> {

    const defaults = {
        identifierKey: "email",
        passwordKey: "password",
        registrationUrl: "/registration",
        authenticationUrl: "/authentication",
        renderer: jsonRenderer
    };

    return Object.assign(defaults, config);
}

export default function factory<T extends AuthenticatableUser>(
    authenticationProvider: AuthenticationProvider<T>,
    jsonWebTokenService: JsonWebTokenService<T>,
    configuration: RestAuthenticationRouterOptions<T>) {

    configuration = createOptions(configuration);
    const router = express.Router();

    /**
     * Middleware that performs authentication based on the provided json body.
     * @param req The request object.
     * @param res The response object.
     * @param next next middleware.
     */
    async function restAuthentication(req: Request, res: Response, next: (err: Error) => void) {
        try {
            const identifier = req.body[configuration.identifierKey];
            const password = req.body[configuration.passwordKey];
            const user = await authenticationProvider.authenticate(identifier, password);
            const token = await jsonWebTokenService.encode(user);
            configuration.renderer(req, res, next, token, user);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Middleware that registers a new user from the provided json body.
     * @param req The request object.
     * @param res The response object.
     * @param next next middleware.
     */
    async function restRegistration(req: Request, res: Response, next: (err: Error) => void) {
        try {
            const identifier = req.body[configuration.identifierKey];
            const password = req.body[configuration.passwordKey];
            const user = await authenticationProvider.register(identifier, password);
            const token = await jsonWebTokenService.encode(user);
            configuration.renderer(req, res, next, token, user);
        } catch (e) {
            next(e);
        }
    }

    router.post(configuration.authenticationUrl, restAuthentication);
    router.post(configuration.registrationUrl, restRegistration);

    return router;
}