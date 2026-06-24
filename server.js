import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/configs/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))