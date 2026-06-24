import express, { json } from "express";
import cors from "cors"
import authRoutes from "./modules/auth/auth.route.js"

const app = express();
app.use(json())
app.use("/api/v1/auth", authRoutes)

export default app;