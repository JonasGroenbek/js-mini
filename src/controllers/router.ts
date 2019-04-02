import express from "express";
import home from "./home";
import api from "./api";

const router = express.Router();

router.get("/", home);
router.use("/api", api);

export default router;
