import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import Tesseract from "tesseract.js";
import { createRequire } from "module";
import { extractTravelData } from "../../services/ai.service.js";
import extractText from "../../utils/extractText.js";
import { generateItinerary } from "../../services/itinerary.service.js";
import { Itinerary } from "./Itinerary.model.js";
import mongoose from "mongoose";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const uploadResult = await uploadToCloudinary(
            req.file.buffer,
            "auto"
        );

        const extractedText = await extractText(req.file);

        let aiResponse = await extractTravelData(extractedText);
        aiResponse = JSON.parse(aiResponse);

        // Generate itinerary from the aiRespnses
        let itinerary = await generateItinerary(aiResponse);
        itinerary = JSON.parse(itinerary);

        // Saveing to db
        const itineraryDoc = new Itinerary({
            user: req.user._id,
            fileUrl: uploadResult.secure_url,
            fileType:
                req.file.mimetype === "application/pdf"
                    ? "pdf"
                    : "image",
            extractedText,
            itineraryData: itinerary,
            shareId: crypto.randomUUID(),
        });

        await itineraryDoc.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Itinerary generated successfully",
            data: {
                itineraryId: itineraryDoc._id,
                shareId: itineraryDoc.shareId,
                itinerary: itineraryDoc.itineraryData,
                fileUrl: itineraryDoc.fileUrl,
                createdAt: itineraryDoc.createdAt,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});

export {
    uploadDocument
};