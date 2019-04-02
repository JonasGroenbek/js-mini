import express from "express";
import {rest} from "../auth/router";
import {restAuthentication} from "../util/configuration";

const router = express.Router();

router.use("/account", rest(restAuthentication));

export default router;