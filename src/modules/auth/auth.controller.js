import asyncHandler from "../../middleware/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import { User } from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const register = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;
    if (!username || !fullName || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userExists) throw new ApiError(400, "User already exists")

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        username,
        fullName,
        email,
        password: hashedPassword
    })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token: accessToken,
        user: {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
        },
    })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const userExists = await User.findOne({ email }).select("+password")
    if (!userExists) throw new ApiError(404, "User does not exist")

    const isPassValid = await bcrypt.compare(password, userExists.password)
    if (!isPassValid) throw new ApiError(401, "Invalid credentials")

    const accessToken = generateAccessToken(userExists)
    const refreshToken = generateRefreshToken(userExists)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: accessToken,
        user: {
            _id: userExists._id,
            username: userExists.username,
            fullName: userExists.fullName,
            email: userExists.email,
            avatar: userExists.avatar,
        },
    });
})

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        expires: new Date(0)
    });

    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        expires: new Date(0)
    });

    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

export {
    register,
    loginUser,
    getCurrentUser,
    logoutUser
}