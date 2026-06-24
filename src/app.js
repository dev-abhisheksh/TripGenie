import express, { json } from "express";
import cors from "cors"
import authRoutes from "./modules/auth/auth.route.js"
import itineraryRoutes from "./modules/itinerary/itinerary.route.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(json())


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/itinerary", itineraryRoutes)

export default app;