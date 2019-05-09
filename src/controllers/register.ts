import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import {sessionStore} from "../util/formHelpers";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// Renders the registration page.
// @ts-ignore
router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    sessionStore(req).pushError("firstName", "This is a bad format.");
    sessionStore(req).pushError("firstName", "This name is not long enough.");
    await attempt(next, function () {
        res.render("register", {
            formErrors: sessionStore(req).getErrors()
        });
    });
});

// Accepts form information sent by the registration page.
// @ts-ignore
router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {

    const errors = sessionStore(req);
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

    res.send(JSON.stringify(req.body));
});

function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default router;