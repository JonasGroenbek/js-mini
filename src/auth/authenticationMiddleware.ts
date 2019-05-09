import {Request, Response} from "express";
import {User} from "../data/User";

export function sessionAuthentication(req: Request, key: string = "authenticatedUser") {
    return {
        isAuthenticated() {
            return !!req.session[key];
        },
        getAuthenticatedUser(): User {
            return req.session[key];
        },
        setAuthenticatedUser(user: User): void {
            req.session[key] = user;
        }
    };
}

export function defaultSessionAuthenticationCheck(req: Request, key: string) {
    return !!req.session[key];
}

export function redirect(to: string) {
    return (res: Response) => {
        res.redirect(to);
    };
}

export type OnUnauthorized = (res: Response, next: (err?: Error) => void) => void;

export function sessionAuthenticationGuard(onUnauthorized: OnUnauthorized, key: string = "authenticatedUser", check = defaultSessionAuthenticationCheck) {
    return function (req: Request, res: Response, next: (err?: Error) => void) {
        if (!check(req, key))
            onUnauthorized(res, next);
        else
            next();
    };
}