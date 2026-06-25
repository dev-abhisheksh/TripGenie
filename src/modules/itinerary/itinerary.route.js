import express from "express"
import { getAllItineraries, getItineraryById, getSharedItinerary, uploadDocument } from "./itinerary.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = express.Router();

// Public route - anyone with the link can view a shared itinerary
router.get("/share/:shareId", getSharedItinerary)

// Protected routes
router.use(verifyToken)

router.post("/upload", upload.single("document"), uploadDocument)
router.get("/itineraries", getAllItineraries)
router.get("/:id", getItineraryById)

export default router;  