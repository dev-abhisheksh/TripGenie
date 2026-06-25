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

    from: {
        type: String,
        default: ""
    },

    to: {
        type: String,
        default: ""
    },

    date: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    shareId: {
        type: String,
        required: true,
        unique: true
    },

    destinationImage: {
        type: String,
        default: null,
    },

}, { timestamps: true });

itinerarySchema.index({ user: 1, createdAt: -1 });

export const Itinerary = mongoose.model("Itinerary", itinerarySchema);