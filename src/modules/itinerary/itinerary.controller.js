import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    const result = await uploadToCloudinary(
        req.file.buffer,
        "auto"
    );

    const data = await pdf(req.file.buffer)
    console.log("Extracted DATA:", data.text)

    res.status(200).json({
        success: true,
        fileUrl: result.secure_url,
        publicId: result.public_id,
    });
});

export {
    uploadDocument
}