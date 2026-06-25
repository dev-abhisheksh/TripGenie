import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import { extractTravelData } from "../../services/ai.service.js";
import extractText from "../../utils/extractText.js";
import { generateItinerary } from "../../services/itinerary.service.js";
import { Itinerary } from "./Itinerary.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { getDestinationImage } from "../../services/image.service.js";

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "File is required");
    }

    const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "auto"
    );

    const extractedText = await extractText(req.file);

    let aiResponse = await extractTravelData(extractedText);
    aiResponse = JSON.parse(aiResponse);

    const destinationImage = await getDestinationImage(
        aiResponse.location
    );

    // Generate itinerary from the aiResponses
    let itinerary = await generateItinerary(aiResponse);
    itinerary = JSON.parse(itinerary);

    // Saving to db (safe, atomic single document creation)
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
        from: aiResponse.departureCity || aiResponse.departureAirport || "",
        to: aiResponse.arrivalCity || aiResponse.arrivalAirport || "",
        date: aiResponse.departureDate && aiResponse.returnDate
            ? `${aiResponse.departureDate} - ${aiResponse.returnDate}`
            : (aiResponse.departureDate || aiResponse.checkInDate || ""),
        location: aiResponse.arrivalCity || aiResponse.hotelName || "",
        destinationImage
    });

    await itineraryDoc.save();

    return res.status(201).json({
        success: true,
        message: "Itinerary generated successfully",
        data: {
            itineraryId: itineraryDoc._id,
            shareId: itineraryDoc.shareId,
            itinerary: itineraryDoc.itineraryData,
            fileUrl: itineraryDoc.fileUrl,
            from: itineraryDoc.from,
            to: itineraryDoc.to,
            date: itineraryDoc.date,
            location: itineraryDoc.location,
            destinationImage: itineraryDoc.destinationImage,
            createdAt: itineraryDoc.createdAt,
        },
    });
});

const getAllItineraries = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit);

    const query = Itinerary.find({
        user: req.user._id,
    })
        .select("-updatedAt -extractedText -__v")
        .sort({ createdAt: -1 });

    if (limit > 0) {
        query.limit(limit);
    }

    const itineraries = await query;

    return res.status(200).json({
        success: true,
        message: itineraries.length
            ? "Fetched itineraries successfully"
            : "No itineraries found",
        count: itineraries.length,
        itineraries,
    });
});

const getItineraryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid itinerary ID");
    }

    const itinerary = await Itinerary.findOne({
        _id: id,
        user: req.user._id,
    }).select("-__v");

    if (!itinerary) {
        throw new ApiError(404, "Itinerary not found");
    }

    return res.status(200).json({
        success: true,
        message: "Itinerary fetched successfully",
        itinerary,
    });
});

const getSharedItinerary = asyncHandler(async (req, res) => {
    const { shareId } = req.params;

    const itinerary = await Itinerary.findOne({ shareId })
        .select("-extractedText -__v -updatedAt");

    if (!itinerary) {
        throw new ApiError(404, "Shared itinerary not found");
    }

    return res.status(200).json({
        success: true,
        message: "Shared itinerary fetched successfully",
        itinerary,
    });
});

export {
    uploadDocument,
    getAllItineraries,
    getItineraryById,
    getSharedItinerary
};