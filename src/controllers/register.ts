import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";
import {session} from "../util/formHelpers";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// Renders the registration page.
// @ts-ignore
router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("register");
    });
});

// Accepts form information sent by the registration page.
// @ts-ignore
router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {

    const errors = session(req);
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || firstName.length() < 1)
        errors.pushError("firstName", "First name is invalid.");
    if (!lastName || lastName.length() < 1)
        errors.pushError("lastName", "Last name is invalid.");
    if (!email || !validateEmail(email))
        errors.pushError("email", "Email is invalid.");
    if (!password || password.length() < 6)
        errors.pushError("password", "Password is invalid.");

    res.send(JSON.stringify(req.session));
});

function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default router;