import {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import BlogPostModel from "../data/BlogPost";

async function getBlogPosts() {
    return BlogPostModel.find({}).sort({created: -1}).exec();
}

// Renders the home page.
export default async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, async function () {
        res.render("home", {
            authenticatedUser: sessionAuthentication(req).getAuthenticatedUser(),
            posts: await getBlogPosts()
        });
    });
}
