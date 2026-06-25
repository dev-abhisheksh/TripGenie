import express, { json } from "express";
import cors from "cors"
import authRoutes from "./modules/auth/auth.route.js"
import itineraryRoutes from "./modules/itinerary/itinerary.route.js"
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://tripgenie-nine.vercel.app",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(cookieParser());
app.use(json())


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/itinerary", itineraryRoutes)

// Error handling middleware (must be registered last)
app.use(errorMiddleware)

export default app;