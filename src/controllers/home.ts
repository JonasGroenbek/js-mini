import {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import BlogPostModel from "../data/BlogPost";
import {sessionMessenger} from "../util/messenger";

// Renders the home page.
export default async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, async function () {
        res.render("home", {
            authenticatedUser: sessionAuthentication(req).getAuthenticatedUser(),
            messenger: sessionMessenger(req),
            posts: await getBlogPosts()
        });
    });
}

async function getBlogPosts() {
    const results = await BlogPostModel.aggregate([{
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
        }
    }])
        .sort({created: -1})
        .exec();

    return results.map((post: any) => {
        post.author = post.author[0];
        return post;
    });
}