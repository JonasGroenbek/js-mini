import {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import {sessionMessenger} from "../util/messenger";
import PostFacade from "./facades/PostFacade";

// Renders the home page.
export default async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, async function () {
        res.render("home", {
            authenticatedUser: sessionAuthentication(req).getAuthenticatedUser(),
            messenger: sessionMessenger(req),
            posts: await PostFacade.getPosts()
        });
    });
}