import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import {sessionStore} from "../util/formHelpers";
import BlogPostModel from "../data/BlogPost";
import {sessionAuthentication} from "../auth/authenticationMiddleware";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("create_blog_post", {
            formErrors: sessionStore(req).getErrors()
        });
    });
});

router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {

    await attempt(next, async function () {
        try {

            await BlogPostModel.create({
                title: req.body.title,
                content: req.body.content,
                images: req.body.images || [],
                author: sessionAuthentication(req).getAuthenticatedUser()._id,
                position: [req.body.longitude, req.body.latitude]
            });

            res.redirect("/");

        } catch (e) {
            sessionStore(req).pushError("form", "Could not create the blog post.");
            res.redirect("create-post");
        }
    });
});

export default router;