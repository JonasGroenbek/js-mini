import {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import {sessionAuthentication} from "../auth/authenticationMiddleware";

// Renders the home page.
export default async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("home", {
            authenticatedUser: sessionAuthentication(req).getAuthenticatedUser()
        });
    });
}
