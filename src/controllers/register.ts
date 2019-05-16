import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import {sessionFormErrors} from "../util/formErrors";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import {authenticationProvider} from "../util/configuration";
import {createAuthenticatableUser} from "../auth/AuthenticatableUser";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// Renders the registration page.
// @ts-ignore
router.get("/", async function (req: Request, res: Response, next: (err: Error) => any) {
    await attempt(next, function () {
        res.render("register", {
            formErrors: sessionFormErrors(req).getErrors()
        }, next);
    });
});

// Accepts form information sent by the registration page.
// @ts-ignore
router.post("/", async function (req: Request, res: Response, next: (err: Error) => any) {

    const errors = sessionFormErrors(req);
    const {firstName, lastName, email, password, repeatPassword} = req.body;

    if (!firstName || firstName.length < 1)
        errors.pushError("firstName", "First name is invalid.");
    if (!lastName || lastName.length < 1)
        errors.pushError("lastName", "Last name is invalid.");
    if (!email || !validateEmail(email))
        errors.pushError("email", "Email is invalid.");
    if (!password || password.length < 6)
        errors.pushError("password", "Password is invalid.");
    if (!repeatPassword || repeatPassword != password)
        errors.pushError("repeatPassword", "Passwords must match.");

    if (errors.hasErrors()) {
        res.redirect("register");
        return;
    }

    const toInsert = createAuthenticatableUser(req.body, "email", "password");
    const created = await authenticationProvider.register(toInsert);
    if (created) {
        const sessionAuth = sessionAuthentication(req);
        sessionAuth.setAuthenticatedUser(created);
        res.redirect("/");
        return;
    }

    errors.pushError("form", "Could not register user account.");
    res.redirect("register");
});

function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default router;