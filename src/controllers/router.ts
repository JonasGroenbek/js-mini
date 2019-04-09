import express from "express";
import home from "./home";
import api from "./api";
import {htmlHandler} from "../errors/handlers";

const router = express.Router();

router.get("/", home);
router.use(htmlHandler({}));
router.use("/api", api);

export default router;
