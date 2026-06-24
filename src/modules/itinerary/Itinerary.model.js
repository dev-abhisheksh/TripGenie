import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        enum: ["pdf", "image"],
        required: true
    },

    extractedText: {
        type: String,
        required: true
    },

    itineraryData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    shareId: {
        type: String,
        required: true,
        unique: true
    }

}, { timestamps: true });

itinerarySchema.index({ user: 1, createdAt: -1 });

export const Itinerary = mongoose.model("Itinerary", itinerarySchema);