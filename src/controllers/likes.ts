import express from "express";
import bodyParser from "body-parser";
import {sessionAuthentication} from "../auth/authenticationMiddleware";
import PostFacade from "./facades/PostFacade";
import {attempt} from "../errors/error";

const router = express.Router();

router.post("/like", async (req, res, next) => {
    await attempt(next, async function () {
        const authentication = sessionAuthentication(req);
        await PostFacade.likePost(req.body.post, authentication.getAuthenticatedUser()._id);
        res.redirect(req.body.redirect || `/#${req.body.post}`);
    });
});

router.post("/unlike", async (req, res, next) => {
    await attempt(next, async function () {
        const authentication = sessionAuthentication(req);
        await PostFacade.unlikePost(req.body.post, authentication.getAuthenticatedUser()._id);
        res.redirect(req.body.redirect || `/#${req.body.post}`);
    });
});

router.use(bodyParser.urlencoded({extended: true}));

export default router;