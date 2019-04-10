import express, {Request, Response} from "express";
import AuthenticationProvider from "./authentication";
import AuthenticatableUser, {createAuthenticatableUser} from "./AuthenticatableUser";
import {JsonWebTokenService} from "./jsonWebToken";
import {ApplicationError, attempt} from "../errors/error";
import validator from "../errors/validation";
import {UserValidationSchema} from "../data/User";

export type RestAuthenticationOptions<T extends AuthenticatableUser> = {
    identifierKey?: string,
    passwordKey?: string,
    registrationUrl?: string,
    authenticationUrl?: string,
    authenticationProvider: AuthenticationProvider<T>,
    jsonWebTokenService: JsonWebTokenService<T>,
    renderer?: (req: Request, res: Response, next: (err: ApplicationError) => void, token: string, user: T) => void,
};

export function jsonRenderer<T>(req: Request, res: Response, next: (err: Error) => void, token: string, user: T) {
    res.json({token, user});
}

export function createRestAuthenticationOptions<T extends AuthenticatableUser>(config: RestAuthenticationOptions<T>): RestAuthenticationOptions<T> {
    const defaults = {
        identifierKey: "email",
        passwordKey: "password",
        registrationUrl: "/registration",
        authenticationUrl: "/authentication",
        renderer: jsonRenderer
    };

    return Object.assign({...defaults}, config);
}

export function restRouter<T extends AuthenticatableUser>(options: RestAuthenticationOptions<T>) {

    const router = express.Router();

    async function restAuthentication(req: Request, res: Response, next: (err: ApplicationError) => void) {
        await attempt(next, async function () {
            const identifier = req.body[options.identifierKey];
            const password = req.body[options.passwordKey];
            const user = await options.authenticationProvider.authenticate(identifier, password);
            const token = await options.jsonWebTokenService.encode(user);
            options.renderer(req, res, next, token, user);
        });
    }

    async function restRegistration(req: Request, res: Response, next: (err: ApplicationError) => void) {
        await attempt(next, async function () {
            validator.validateOrThrow(req.body, UserValidationSchema);
            const user = await options.authenticationProvider.register(createAuthenticatableUser(req.body, "email", "password"));
            const token = await options.jsonWebTokenService.encode(user);
            options.renderer(req, res, next, token, user);
        });
    }

    router.post(options.authenticationUrl, restAuthentication);
    router.post(options.registrationUrl, restRegistration);

    return router;
}