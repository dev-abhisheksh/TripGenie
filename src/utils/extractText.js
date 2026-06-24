import Tesseract from "tesseract.js";
import { createRequire } from "module";
import ApiError from "./apiError.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const extractText = async (file) => {
    if (file.mimetype === "application/pdf") {
        const data = await pdf(file.buffer);
        return data.text;
    }

    if (file.mimetype.startsWith("image/")) {
        const result = await Tesseract.recognize(
            file.buffer,
            "eng"
        );

        return result.data.text;
    }

    throw new ApiError(400, "Unsupported file type");
};

export default extractText;