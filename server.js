import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/configs/db.js";

connectDB();

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))