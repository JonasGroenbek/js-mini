import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import {sessionStore} from "../util/formHelpers";
import {authenticationProvider} from "../util/configuration";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import {IncorrectCredentialsError} from "../auth/authentication";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// Renders the authentication page.
// @ts-ignore
router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("authenticate", {
            formErrors: sessionStore(req).getErrors()
        });
    });
});

// Accepts form information sent by the authentication page.
// @ts-ignore
router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, async function () {

        const errors = sessionStore(req);
        try {
            const result = await authenticationProvider.authenticate(req.body.email, req.body.password);
            sessionAuthentication(req).setAuthenticatedUser(result);
            res.redirect("/");
            return;
        } catch (e) {
            if (e instanceof IncorrectCredentialsError) {
                errors.pushError("form", "Could not authenticate using provided credentials.");
                res.redirect("authenticate");
                return;
            }

            throw e;
        }
    });
});

export default router;