import express from "express"
import { uploadDocument } from "./itinerary.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = express.Router();

router.use(verifyToken)

router.post("/trial", upload.single("document"), uploadDocument)

export default router;  