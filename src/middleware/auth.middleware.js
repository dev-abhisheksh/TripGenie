import { User } from "../modules/auth/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "./asyncHandler.middleware.js";
import jwt from "jsonwebtoken"

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "")
    if (!token) throw new ApiError(401, "Unauthorized, No token provided")

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded);
        console.log(token);
        const user = await User.findById(decoded._id).select("-password -refreshToken")
        if (!user) throw new ApiError(401, "Unauthorized, Invalid token")

        req.user = user
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized, Access token expired")
        }
        return next(new ApiError(401, "Unauthorized, Invalid token"))
    }
})