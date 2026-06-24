import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { getCurrentUser, loginUser, logoutUser, register } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", loginUser)
router.post("/logout", verifyToken, logoutUser)
router.get("/me", verifyToken, getCurrentUser)

export default router;