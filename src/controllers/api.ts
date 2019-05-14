import express from "express";
import {restRouter} from "../auth/controller";
import {restHandler} from "../errors/handlers";
import {restAuthenticationRouterOptions} from "../util/configuration";
import graphqlRouter from "./graphql/router";
import cors from "cors";

const router = express.Router();

router.use(cors());
router.use("/account", restRouter(restAuthenticationRouterOptions));
router.use("/graphql", graphqlRouter({graphiql: true}));
router.use(restHandler({}));

export default router;