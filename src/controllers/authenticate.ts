import express, {Request, Response} from "express";
import {ApplicationError, attempt} from "../errors/error";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// Renders the authentication page.
// @ts-ignore
router.get("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    await attempt(next, function () {
        res.render("authenticate");
    });
});

// Accepts form information sent by the authentication page.
// @ts-ignore
router.post("/", async function (req: Request, res: Response, next: (err: ApplicationError) => any) {
    res.send(JSON.stringify(req.body));
});

export default router;