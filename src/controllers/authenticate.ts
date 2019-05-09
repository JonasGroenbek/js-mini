import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import {sessionFormErrors} from "../util/formErrors";
import {authenticationProvider} from "../util/configuration";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import {IncorrectCredentialsError} from "../auth/authentication";
import {sessionMessenger} from "../util/messenger";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// Renders the authentication page.
// @ts-ignore
router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("authenticate", {
            formErrors: sessionFormErrors(req).getErrors(),
            messenger: sessionMessenger(req)
        });
    });
});

// Accepts form information sent by the authentication page.
// @ts-ignore
router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, async function () {

        const errors = sessionFormErrors(req);
        try {
            const result = await authenticationProvider.authenticate(req.body.email, req.body.password);
            sessionAuthentication(req).setAuthenticatedUser(result);
            sessionMessenger(req).pushSuccess("You were successfully authenticated.");
            res.redirect("/");
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