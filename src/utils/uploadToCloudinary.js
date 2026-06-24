import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = (buffer, resourceType = "auto") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: "tripgenie",
                    resource_type: resourceType,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            )
            .end(buffer);
    });
};

export default uploadToCloudinary;