import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import BlogPostModel from "../data/BlogPost";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import {FormErrors, sessionFormErrors} from "../util/formErrors";
import {sessionMessenger} from "../util/messenger";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("create_blog_post", {
            formErrors: sessionFormErrors(req).getErrors(),
            messenger: sessionMessenger(req),
        });
    });
});

function validateBlogPost(form: FormErrors, body: any): void {

    const {title, content, latitude, longitude} = body;

    if (!title || title.length < 1)
        form.pushError("title", "The title field is required.");

    if (!content || content.length < 1)
        form.pushError("content", "The content field is required.");

    if (!latitude || latitude.length < 1 || !longitude || latitude.length < 1)
        form.pushError("position", "The provided position information is invalid.");
}

router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {

    await attempt(next, async function () {

        // validate request
        const formErrors = sessionFormErrors(req);
        validateBlogPost(formErrors, req.body);
        if (formErrors.hasNewErrors()) {
            res.redirect("create-blog");
            return;
        }

        try {

            await BlogPostModel.create({
                title: req.body.title,
                content: req.body.content,
                images: req.body.images.split(";;"),
                author: sessionAuthentication(req).getAuthenticatedUser()._id,
                position: [req.body.longitude, req.body.latitude]
            });

            res.redirect("/");

        } catch (e) {
            sessionMessenger(req).pushError("The blog post could not be created.");
            res.redirect("create-post");
        }
    });
});

export default router;