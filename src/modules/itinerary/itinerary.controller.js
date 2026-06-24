import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import Tesseract from "tesseract.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    // Upload original file to Cloudinary
    const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "auto"
    );

    let extractedText = "";

    // PDF Extraction
    if (req.file.mimetype === "application/pdf") {
        const data = await pdf(req.file.buffer);
        extractedText = data.text;
    }

    // Image OCR
    else if (req.file.mimetype.startsWith("image/")) {
        const result = await Tesseract.recognize(
            req.file.buffer,
            "eng"
        );

        extractedText = result.data.text;
    }

    else {
        throw new ApiError(400, "Unsupported file type");
    }

    console.log("Extracted Text:", extractedText);

    res.status(200).json({
        success: true,
        extractedText,
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
    });
});

export {
    uploadDocument
};