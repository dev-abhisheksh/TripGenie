import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    const result = await uploadToCloudinary(
        req.file.buffer,
        "auto"
    );

    res.status(200).json({
        success: true,
        fileUrl: result.secure_url,
        publicId: result.public_id,
    });
});

export {
    uploadDocument
}