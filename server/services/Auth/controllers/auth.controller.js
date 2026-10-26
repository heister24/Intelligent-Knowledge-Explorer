import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../configs/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    let decodedToken;
    try {
      decodedToken = await getAuth(firebaseApp).verifyIdToken(token);
    } catch (verifyError) {
      console.error("Firebase token verification error:", verifyError.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
        error: verifyError.message,
      });
    }

    if (!decodedToken?.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid token payload",
      });
    }

    let user;
    try {
      user = await User.findOne({ firebaseId: decodedToken.uid });
      if (!user) {
        user = await User.create({
          name: decodedToken.name || "User",
          email: decodedToken.email || "",
          avatar: decodedToken.picture || "",
          firebaseId: decodedToken.uid,
        });
      }
    } catch (dbError) {
      console.error("Database user error:", dbError.message);
      return res.status(500).json({
        success: false,
        message: "Database error while processing user profile",
        error: dbError.message,
      });
    }

    const sessionId = crypto.randomUUID();
    const sessionTTLInSeconds = 7 * 24 * 60 * 60; // 7 days in seconds

    try {
      await redis.set(`session-${sessionId}`, sessionId, "EX", sessionTTLInSeconds);
      await redis.set(
        `sessionId-${sessionId}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }),
        "EX",
        sessionTTLInSeconds,
      );
    } catch (redisError) {
      console.error("Redis session storage error:", redisError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create user session in storage",
        error: redisError.message,
      });
    }

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: sessionTTLInSeconds * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login controller unexpected error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message,
    });
  }
};
