import express from "express";
import restAuthenticationRouter from "../auth/restAuthenticationRouter";
import {authenticationProvider, jsonWebTokenService, restAuthenticationRouterOptions} from "../util/configuration";

const router = express.Router();

router.use("/account", restAuthenticationRouter(authenticationProvider, jsonWebTokenService, restAuthenticationRouterOptions));

export default router;