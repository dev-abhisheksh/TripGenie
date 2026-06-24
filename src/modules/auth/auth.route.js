import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { register } from "./auth.controller.js";

const router = express.Router();

router.post("/register", verifyToken, register)

export default router;