import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { loginUser, register } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", loginUser)

export default router;