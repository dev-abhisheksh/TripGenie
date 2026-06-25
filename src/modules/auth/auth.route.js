import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { getCurrentUser, loginUser, logoutUser, register, updateProfile } from "./auth.controller.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", loginUser)
router.post("/logout", verifyToken, logoutUser)
router.get("/me", verifyToken, getCurrentUser)
router.put("/profile", verifyToken, upload.single("avatar"), updateProfile)

export default router;