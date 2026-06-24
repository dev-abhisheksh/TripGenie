import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import Tesseract from "tesseract.js";
import { createRequire } from "module";
import { extractTravelData } from "../../services/ai.service.js";
import extractText from "../../utils/extractText.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "auto"
    );

    const extractedText = await extractText(req.file)
    console.log("Extracted Text:", extractedText);

    // console.log("Extracted Text:", extractedText);

    let aiResponse = await extractTravelData(extractedText)
    aiResponse = JSON.parse(aiResponse)
    console.log("Ai response:", aiResponse)

    res.status(200).json({
        success: true,
        aiResponse,
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
    });
});

export {
    uploadDocument
};