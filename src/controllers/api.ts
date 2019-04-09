import express from "express";
import {restRouter} from "../auth/router";
import {restAuthentication} from "../util/configuration";
import {restHandler} from "../errors/handlers";

const router = express.Router();

router.use("/account", restRouter(restAuthentication));
router.use(restHandler({}));

export default router;