import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../configs/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json("Token missing");
    }

    let decodedToken;
    try {
      decodedToken = await getAuth(firebaseApp).verifyIdToken(token);
      //   console.log(decodedToken);
    } catch (error) {
      console.log(error);
    }

    let user = await User.findOne({ firebaseId: decodedToken?.uid });
    if (!user) {
      user = await User.create({
        name: decodedToken?.name,
        email: decodedToken?.email,
        avatar: decodedToken?.picture,
        firebaseId: decodedToken?.uid,
      });
    }

    const sessionId = crypto.randomUUID();
    await redis.set(`session-${sessionId}`, sessionId);
    await redis.set(
      `sessionId-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
      }),
      "EX",
      7 * 24 * 60 * 60 * 1000,
    );

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      user: {
        userId: user?._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
