import express, { Request, Response } from "express";
import home from "./home";
import api from "./api";

const router = express.Router();

router.use("/", home);
router.use("/api", api);

export default router;
