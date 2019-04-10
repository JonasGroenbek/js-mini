// Renders the authentication page.
import {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";

// Renders the registration page.
export default async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("register");
    });
}