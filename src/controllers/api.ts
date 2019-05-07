import express from "express";
import {restRouter} from "../auth/router";
import {restHandler} from "../errors/handlers";
import {restAuthenticationRouterOptions} from "../util/configuration";
import grapqlRouter from "./graphql/route";

const router = express.Router();

router.use("/account", restRouter(restAuthenticationRouterOptions));
router.use("/graphql", grapqlRouter({graphiql: true}));
router.use(restHandler({}));

export default router;